
"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/CC/Input";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useStateContext } from "@/app/StateContext";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useCreateApplication } from "../../../hooks/beneficiary-hook";
import axios from "axios";
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
import { ethers } from "ethers";

// Enhanced exchange rate handling with caching
const useExchangeRate = () => {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  const fetchRate = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd'
          }
        }
      );
      const newRate = response.data.ethereum.usd;
      setRate(newRate);
      localStorage.setItem('eth-usd-rate', newRate.toString());
      localStorage.setItem('eth-usd-rate-timestamp', Date.now().toString());
      return newRate;
    } catch (err) {
      console.error("Failed to fetch live rate, using fallback", err);
      const cachedRate = localStorage.getItem('eth-usd-rate');
      if (cachedRate) {
        setRate(parseFloat(cachedRate));
        return parseFloat(cachedRate);
      }
      setRate(2000); // Fallback rate if API fails and no cache
      return 2000;
    }
  };

  useEffect(() => {
    const cachedRate = localStorage.getItem('eth-usd-rate');
    const cachedTime = localStorage.getItem('eth-usd-rate-timestamp');
    
    // Use cached rate if less than 5 minutes old
    if (cachedRate && cachedTime && (Date.now() - parseInt(cachedTime)) < 300000) {
      setRate(parseFloat(cachedRate));
    } else {
      fetchRate();
    }
  }, []);

  return { rate, error, refreshRate: fetchRate };
};

const RequestSupport = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [applicationPicture, setApplicationPicture] = useState(null);
  const { user } = useStateContext();
  const [breakdown, setBreakdown] = useState([
    { purpose: "", amount: "", description: "", document: null }
  ]);
  const { rate: exchangeRate, refreshRate } = useExchangeRate();
  const [conversionErrors, setConversionErrors] = useState({});

  const [data, setData] = useState({
    name: "",
    age: "",
    userId: user?.userId,
    gender: "",
    applicationTitle: "",
    address: "",
    contact: "",
    occupation: "",
    description: "",
    deadline: "",
    applicationPicture: "",
    amountRequested: "",
    monthlyIncome: "",
    sourceOfIncome: "",
    otherAidSources: "",
    bankDetails: {
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      branchCode: "",
    },
    declarationAgreed: false,
  });

  // Calculate ETH value for a USD amount
  const calculateEthValue = (usdAmount) => {
    if (!exchangeRate || isNaN(usdAmount)) return 0;
    return usdAmount / exchangeRate;
  };

  // Upload file to IPFS
  const uploadFileToIPFS = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append("file", file);
  
      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw error;
    }
  };

  const { mutate: addMutate } = useCreateApplication(
    JSON.stringify({...data, breakdowns: breakdown})
  );

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleBankDetailsChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      bankDetails: {
        ...data.bankDetails,
        [name]: value,
      },
    });
  };

  const handleFileChange = (event) => {
    const { name } = event.target;
    if (name === "applicationPicture") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setData({ ...data, [name]: reader.result });
          setApplicationPicture(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const removeAvatar = () => {
    setApplicationPicture(null);
    setData({ ...data, applicationPicture: "" });
  };
  
  const handleBreakdownChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBreakdowns = [...breakdown];
    updatedBreakdowns[index][name] = value;
    setBreakdown(updatedBreakdowns);

    // Clear any previous conversion errors for this field
    if (name === "amount") {
      setConversionErrors(prev => ({ ...prev, [index]: null }));
    }
  };

  // Handle breakdown document upload
  const handleBreakdownFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const ipfsHash = await uploadFileToIPFS(file);
      
      const updatedBreakdown = [...breakdown];
      updatedBreakdown[index] = {
        ...updatedBreakdown[index],
        documentHash: ipfsHash,
      };
      
      setBreakdown(updatedBreakdown);
      toast.success("Document uploaded to IPFS");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };
  
  const addBreakdownField = () => {
    setBreakdown([
      ...breakdown,
      { purpose: "", amount: "", description: "", document: null },
    ]);
  };
  
  const removeBreakdownField = (index) => {
    const updatedBreakdown = breakdown.filter((_, i) => i !== index);
    setBreakdown(updatedBreakdown);
  };

  // Validate all breakdown amounts before submission
  const validateBreakdown = () => {
    let isValid = true;
    const newErrors = {};
    
    breakdown.forEach((item, index) => {
      const amount = parseFloat(item.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors[index] = "Please enter a valid amount greater than 0";
        isValid = false;
      }
    });
    
    setConversionErrors(newErrors);
    return isValid;
  };

  // Main submit function - user input in dollar, send to smart contract in wei
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateBreakdown()) {
      toast.error("Please fix the errors in your breakdown amounts");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get current wallet address
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const beneficiaryAddress = accounts[0];

      // 2. Prepare breakdowns: convert USD → ETH → Wei
      const descriptions = breakdown.map(item => item.purpose);
      const amountsInWei = breakdown.map(item => {
        const ethValue = calculateEthValue(parseFloat(item.amount));
        return ethers.utils.parseEther(ethValue.toString());
      });
      const documentsIpfsHashes = breakdown.map(item => [item.documentHash]);

      console.log("Submitting to smart contract:", {
        beneficiaryAddress,
        descriptions,
        amountsInWei: amountsInWei.map(a => a.toString()),
        documentsIpfsHashes
      });

      // 3. Submit to smart contract
      const tx = await TrustAidContractInteraction.submitNeeds(
        beneficiaryAddress,
        descriptions,
        amountsInWei,
        documentsIpfsHashes
      );

      await tx.wait();

      // 4. Prepare data for backend (still in USD)
      const applicationData = {
        ...data,
        breakdowns: breakdown.map(item => ({
          ...item,
          amount: parseFloat(item.amount), // Store USD amount in backend
          documentHash: item.documentHash,
          ethValue: calculateEthValue(parseFloat(item.amount)) // Add ETH value for reference
        }))
      };

      // 5. Send to backend
      addMutate(applicationData, {
        onSuccess: (response) => {
          toast.success(response?.data?.message);
          router.push("/dashboard/beneficiary");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        },
      });

    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
      <h1 className="font-bold text-3xl">Beneficiary Application Form</h1>
      <p className="text-sm mt-3 leading-6 text-[#62706b]">
        Please complete the form below to apply for donation assistance.
      </p>
      
      <form className="w-full mt-10" onSubmit={handleSubmit}>
        {/* ... (keep all your existing form sections) ... */}
        <div className="my-3">
          {applicationPicture ? (
            <div className="">
              <div className="w-24 h-24 mx-auto relative">
                <img
                  src={applicationPicture}
                  alt="Image"
                  className="rounded-full w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-0 right-0 p-[5px] bg-gray-200 rounded-full"
                >
                  <RxCross1 className="text-[#000] text-[14px]" />
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-full h-32 bg-gray-200 rounded-md flex flex-col items-center justify-center text-gray-700">
                <FaUpload className="text-2xl" />
                <p>Upload Image</p>
                <p className="text-xs mt-2">Click to browse the image</p>
              </div>
            </label>
          )}
          <input
            id="avatar-upload"
            name="applicationPicture"
            required
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-5">
        <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            name="name"
            onChange={handleInputChange}
            value={data.name}
            required
          />
          <Input
            label="Age"
            type="number"
            placeholder="Enter your age"
            name="age"
            onChange={handleInputChange}
            value={data.age}
            required
          />
          <select
            name="gender"
            required
            value={data.gender}
            onChange={handleInputChange}
            className="col-span-2 border-2 rounded-md p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <Input
            label="Contact Number"
            type="text"
            placeholder="Enter your contact number"
            name="contact"
            onChange={handleInputChange}
            value={data.contact}
            required
          />
          <Input
            label="Address"
            type="text"
            placeholder="Enter your address"
            name="address"
            onChange={handleInputChange}
            value={data.address}
            required
          />
          <Input
            label="Occupation"
            type="text"
            placeholder="Enter your occupation"
            name="occupation"
            onChange={handleInputChange}
            value={data.occupation}
          />
        </div>

        {/* Financial Information */}
        <div className="col-span-2">
            
            <label className="font-semibold text-sm text-[#202725] mb-2">
              Application Title
            </label>
            <textarea
              name="applicationTitle"
              required
              placeholder="Enter application title"
              value={data.applicationTitle}
              onChange={handleInputChange}
              className="outline-none text-sm p-4 w-full rounded-md border-2 border-[#d9e4df] h-24"
            ></textarea>
            <label className="font-semibold text-sm text-[#202725] mb-1">
              Reason for Assistance
            </label>
            <textarea
              name="description"
              required
              placeholder="Explain why you need assistance"
              value={data.description}
              onChange={handleInputChange}
              className="outline-none text-sm p-4 w-full rounded-md border-2 border-[#d9e4df] h-24"
            ></textarea>
          </div>
         
          <div className="grid grid-cols-2 gap-5">
          <Input
            label="Total Amount Requested ($)"
            type="number"
            name="amountRequested"
            required
            onChange={handleInputChange}
          />
          <Input
            label="Deadline"
            type="date"
            placeholder="Enter deadline "
            name="deadline"
            onChange={handleInputChange}
            value={data.deadline}
            required
          />
          <Input
            label="Monthly Income"
            type="number"
            name="monthlyIncome"
            onChange={handleInputChange}
          />
          <Input
            label="Source of Income"
            type="text"
            name="sourceOfIncome"
            onChange={handleInputChange}
          />
          <Input
            label="Other Aid Sources"
            type="text"
            name="otherAidSources"
            onChange={handleInputChange}
          />
        </div>
        {/* Breakdown section with enhanced ETH conversion display */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">Breakdown of Requested Amount</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please provide detailed breakdown of how the funds will be used.
          </p>
          
          {breakdown.map((field, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Purpose*"
                type="text"
                name="purpose"
                value={field.purpose}
                onChange={(e) => handleBreakdownChange(index, e)}
                required
              />
              <Input
                label="Description*"
                type="text"
                name="description"
                value={field.description}
                onChange={(e) => handleBreakdownChange(index, e)}
                required
              />
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Amount ($)*
                </label>
                <input
                  type="number"
                  name="amount"
                  value={field.amount}
                  onChange={(e) => handleBreakdownChange(index, e)}
                  step="0.01"
                  min="0.01"
                  required
                  className={`w-full px-4 py-4 border ${
                    conversionErrors[index] ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  placeholder="Enter amount in USD"
                />
                {conversionErrors[index] && (
                  <p className="text-xs text-red-500 mt-1">{conversionErrors[index]}</p>
                )}
                {field.amount && exchangeRate && !conversionErrors[index] && (
                  <p className="text-xs text-green-600 mt-1">
                    ≈ {calculateEthValue(parseFloat(field.amount)).toFixed(6)} ETH
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Document*
                </label>
                <input
                  type="file"
                  required
                  accept="application/pdf,image/*"
                  onChange={(e) => handleBreakdownFileChange(index, e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {field.documentHash && (
                  <p className="mt-1 text-xs text-green-600">
                    Document uploaded ✓
                  </p>
                )}
              </div>
              
              {breakdown.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBreakdownField(index)}
                  className="self-end mb-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addBreakdownField}
            className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
          >
            Add Another Need
          </button>
        </div>

        {/* ... (rest of your form) ... */}
        
        {/* Bank Details */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">Bank Account Details</h2>
          <Input
            label="Account Holder's Name"
            type="text"
            name="accountHolder"
            onChange={handleBankDetailsChange}
          />
          <Input
            label="Account Number"
            type="text"
            name="accountNumber"
            onChange={handleBankDetailsChange}
          />
          <Input
            label="Bank Name"
            type="text"
            name="bankName"
            onChange={handleBankDetailsChange}
          />
          <Input
            label="Branch/IFSC/Swift Code"
            type="text"
            name="branchCode"
            onChange={handleBankDetailsChange}
          />
        </div>

        {/* Declaration */}
        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="declarationAgreed"
              required
              onChange={(e) =>
                setData({ ...data, declarationAgreed: e.target.checked })
              }
            />
            <span className="ml-2 text-sm">
              I certify that the information provided is true and correct to
              the best of my knowledge. I understand that any false information
              may result in the rejection of my application or legal action.
            </span>
          </label>
        </div>
        
        {/* Submit button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <IoIosArrowRoundForward className="text-xl" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestSupport;




























