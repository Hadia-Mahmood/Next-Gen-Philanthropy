"use client";
import Input from "@/components/CC/Input";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useStateContext } from "@/app/StateContext";
import { FaUpload } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { FaSpinner } from "react-icons/fa";
import { useUnlockMilestone } from "../../../hooks/beneficiary-hook";
import { useUnlockMilestoneId } from "../../../hooks/beneficiary-hook";
import axios from "axios";
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";

const UnlockMilestone = () => {
  const router = useRouter();
  const { user } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingToBlockchain, setIsSubmittingToBlockchain] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileHash, setFileHash] = useState(null);
  const [data, setData] = useState(() => ({
    userId: user?.userId || '',
    usageSummary: '',
    completionDate: '',
    breakdownFileHash: '',
    thirdPartyVerification: {
      thirdPartyName: '',
      thirdPartyContactNumber: '',
      thirdPartyEmailAddress: '',
    },
  }));
  // Update userId when user changes
  React.useEffect(() => {
    if (user?.userId) {
      setData(prev => ({ ...prev, userId: user.userId }));
    }
  }, [user?.userId]);


  const { data: applicationData, isLoading: isApplicationDataLoading } = useUnlockMilestoneId(user?.userId);
  const currentNeedId = applicationData?.needId;
  const { mutate: addMutate } = useUnlockMilestone(JSON.stringify({ ...data }));
  
  console.log("Application Data:", applicationData);
  console.log("Current Need ID:", currentNeedId);

  const submitProofToBlockchain = async (ipfsHash) => {
    console.log("Submitting proof with:", {
      ethAddress: user?.ethAddress,
      currentNeedId,
      ipfsHash
    });

    if (!user?.ethAddress) {
      throw new Error("Beneficiary address not found");
    }
    if (!currentNeedId && currentNeedId !== 0) { // Also accept 0 as valid needId
      throw new Error(`Need ID not found (currentNeedId: ${currentNeedId})`);
    }
    if (!ipfsHash) {
      throw new Error("IPFS hash not found");
    }

    setIsSubmittingToBlockchain(true);
    try {
      const cleanHash = ipfsHash.replace('https://gateway.pinata.cloud/ipfs/', '');
      const proofIpfsHashes = [cleanHash];
      
      const tx = await TrustAidContractInteraction.submitProof(
        user.ethAddress,
        currentNeedId,
        proofIpfsHashes
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Blockchain error details:", {
        error,
        message: error.message,
        data: error.data,
        stack: error.stack
      });
      throw new Error(`Blockchain submission failed: ${error.message}`);
    } finally {
      setIsSubmittingToBlockchain(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log("Form data before submission:", data); // Debug log
    if (!data.userId) {
      toast.error("User ID is required");
      return;
    }

    if (!data.usageSummary) {
      toast.error("Usage summary is required");
      return;
    }
    if (isApplicationDataLoading) {
      toast.info("Still loading campaign data...");
      return;
    }

    if (!currentNeedId && currentNeedId !== 0) {
      toast.error("Campaign need ID not available yet");
      return;
    }

    if (!fileHash) {
      toast.error("Please upload a document first");
      return;
    }

    setIsLoading(true);
    
    try {
      await submitProofToBlockchain(fileHash);
      
      const cleanHash = fileHash.replace('https://gateway.pinata.cloud/ipfs/', '');
      const submissionData = {
        ...data,
        breakdownFileHash: cleanHash,
        needId: currentNeedId,
        beneficiaryAddress: user.ethAddress
      };
      console.log("submissionData",submissionData);

      addMutate(JSON.stringify(submissionData), {
        onSuccess: (response) => {
          toast.success(response?.data?.message);
          router.push("/dashboard/beneficiary");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Backend submission failed");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Full submission error:", error);
      toast.error(error.message.includes("Blockchain submission failed") 
        ? error.message 
        : "Submission failed");
      setIsLoading(false);
    }
  };
const handleThirdPartyVerification = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      thirdPartyVerification: {
        ...data.thirdPartyVerification,
        [name]: value,
      },
    });
  };

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Handle nested thirdPartyVerification fields
    if (name in data.thirdPartyVerification) {
      setData(prev => ({
        ...prev,
        thirdPartyVerification: {
          ...prev.thirdPartyVerification,
          [name]: value,
        },
      }));
    } else {
      // Handle top-level fields
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadFileToIPFS = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        fileData,
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const ipfsHash = await uploadFileToIPFS(file);
      setFiles([file]);
      setFileHash(ipfsHash);
      setData({ ...data, breakdownFileHash: ipfsHash });
    } catch (error) {
      toast.error("Failed to upload file to IPFS");
    }
  };




  return (
    <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
      <h1 className="font-bold text-3xl">Provide Aid Support Usage Details</h1>
      <p className="text-sm mt-3 leading-6 text-[#62706b]">
        Please complete the form below to unlock the next milestone.
      </p>
      <form className="w-full mt-10" onSubmit={handleSubmit}>
        {/* Document Upload Section */}
        <div className="my-3">
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      setFileHash(null);
                      setData({ ...data, breakdownFileHash: "" });
                    }}
                    className="text-red-500"
                  >
                    <RxCross1 className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-full h-32 bg-gray-200 rounded-md flex flex-col items-center justify-center text-gray-700">
                <FaUpload className="text-2xl" />
                <p>Upload Breakdown Document</p>
                <p className="text-xs mt-2">Click to browse document</p>
              </div>
            </label>
          )}
          <input
            id="file-upload"
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Summary of Aid Usage */}
        <div className="my-5">
          <Input
            label="Summary of Usage"
            type="text"
            placeholder="Explain how the aid was used"
            name="usageSummary"
            value={data.usageSummary}
            onChange={handleInputChange}
            
            required={true}
          />
        </div>

        {/* Completion Date */}
        <div className="my-5">
          <label className="font-semibold mb-2 block">Completion Date</label>
          <input
            type="date"
            name="completionDate"
            
            onChange={handleInputChange}
            value={data.completionDate}
            className="block w-full text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Third-Party Verification */}
        <div className="my-5">
          <h2 className="font-semibold text-lg mb-3">Third-Party Verification</h2>
          <Input
            label="Third-PartyName"
            type="text"
            placeholder="Enter Name"
            name="name"
            // value={data.thirdPartyVerification.thirdPartyName}
            onChange={handleThirdPartyVerification}
            
            required={true}
          />
          <Input
            label="Third-PartyContactNumber"
            type="number"
            placeholder="Enter Contact Number"
            name="contactNumber"
            // value={data.thirdPartyVerification.thirdPartyContactNumber}
            onChange={handleThirdPartyVerification}
            
            required={true}
          />
          <Input
            label="Third-PartyEmailAddress"
            type="email"
            placeholder="Enter Email Address"
            name="email"
            onChange={handleThirdPartyVerification}
            
            // value={data.thirdPartyVerification.thirdPartyEmailAddress}
            required={true}
          />
        </div>
 
        {/* Submit Button */}
        <div className="grid place-items-center mt-6">
        <button 
      type="submit" 
      
  disabled={isLoading || isSubmittingToBlockchain || isApplicationDataLoading}
      className="mt-6 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] text-white px-7 py-5 rounded-sm hover:bg-[#257830]"
    >
      {isSubmittingToBlockchain ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Submitting to Blockchain...
        </>
      ) : isLoading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Finalizing Submission...
        </>
      ) : (
        <>
          Submit Proof
          <IoIosArrowRoundForward className="text-[27px] ml-2" />
        </>
      )}
    </button>
        </div>
      </form>
    </div>
  );
};


export default UnlockMilestone;




