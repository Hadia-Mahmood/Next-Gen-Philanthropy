"use client";
import React, { useState, useEffect } from "react";
import styles from "./CampaignDetails.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/app/StateContext";  
import { useGetProgressReport } from "../../hooks/beneficiary-hook"; 
import { useFundCampaign } from "../../hooks/donor-hook"; 
import { toast } from "react-toastify";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
import { ethers } from "ethers";
import axios from "axios";

// USD to ETH conversion rate (fallback if API fails)
const FALLBACK_ETH_RATE = 0.0005; // Adjust this based on current rates

const getUsdToEthRate = async () => {
  try {
    const response = await axios.get(
      'https://api.coinbase.com/v2/exchange-rates',
      {
        params: {
          currency: 'USD'
        }
      }
    );
    const rate = response.data.data.rates.ETH;
    console.log("ETH/USD rate:", rate);
    return parseFloat(rate);
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1 / FALLBACK_ETH_RATE; // Return rate as USD per ETH
  }
};
const CampaignDetails = ({ campaignID }) => {
  const router = useRouter();
  const { isLoggedIn, user } = useStateContext(); 
  const [isProcessing, setIsProcessing] = useState(false);

  const [ethEstimate, setEthEstimate] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  const [isNeedFulfilled, setIsNeedFulfilled] = useState(false);
  const [checkingFulfillment, setCheckingFulfillment] = useState(false);
  const { data: applicationData, isLoading, error } = useGetProgressReport(campaignID);
  console.log("specific campaign data",applicationData);
  const [formData, setFormData] = useState({
    userId: user?.userId,
    campaignId: campaignID,
    amount: "",
    timestamp: new Date().toISOString(),
    fulfilled: false 
  });
  const { mutate: addMutate } = useFundCampaign(JSON.stringify(formData));

  const currentNeedId = applicationData?.currentNeedId;
  console.log("currentNeedId",currentNeedId);
  
  // Check if current need is fulfilled when component mounts or currentNeedId changes
  useEffect(() => {
    const checkNeedFulfillment = async () => {
      if (!applicationData?.user?.ethAddress || currentNeedId === undefined) return;
      
      setCheckingFulfillment(true);
      try {
        const needs = await TrustAidContractInteraction.getBeneficiaryNeeds(
          applicationData.user.ethAddress
        );
        
        // Find the current need by ID
        const currentNeed = needs.find(need => need[0].toString() === currentNeedId?.toString());
        
        if (currentNeed) {
          setIsNeedFulfilled(currentNeed[3]); // Index 3 is the fulfilled boolean
        }
      } catch (error) {
        console.error("Error checking need fulfillment:", error);
        toast.error("Could not verify campaign status");
      } finally {
        setCheckingFulfillment(false);
      }
    };

    checkNeedFulfillment();
  }, [applicationData?.user?.ethAddress, currentNeedId]);
  // Fetch conversion rate on component mount
  React.useEffect(() => {
    const fetchRate = async () => {
      const rate = await getUsdToEthRate();
      setConversionRate(rate);
    };
    fetchRate();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "amount" && value && conversionRate) {
      try {
        const usdAmount = parseFloat(value);
        if (isNaN(usdAmount)) return;

        
        // Calculate ETH value (USD amount * ETH per USD rate)
        const ethValue = usdAmount * conversionRate;
        setEthEstimate(ethValue.toFixed(6));
      } catch (err) {
        console.error("Conversion error:", err);
        setEthEstimate("");
      }
    }
  };

  const handleBlockchainDonation = async (beneficiaryAddress, usdAmount) => {
    if (!conversionRate) {
      throw new Error("Exchange rate not loaded");
    }

    setIsProcessing(true);
    try {
      // Validate inputs
      if (!beneficiaryAddress || !ethers.utils.isAddress(beneficiaryAddress)) {
        throw new Error("Invalid beneficiary address");
      }

      const usdValue = parseFloat(usdAmount);
      // if (isNaN(usdValue) {
        if (isNaN(usdValue)) {

        throw new Error("Please enter a valid USD amount");
      }

      // Convert USD to ETH
      const ethValue = usdValue * conversionRate;
      if (ethValue <= 0) {
        throw new Error("Donation amount must be greater than 0");
      }

      console.log(`Donating: $${usdValue} USD -> ${ethValue} ETH`);

      // Call smart contract with ETH value (not wei - the function will handle conversion)
      const tx = await TrustAidContractInteraction.donate(
        beneficiaryAddress,
        currentNeedId,
        ethValue.toString() // Pass as ETH string
      );

      const receipt = await tx.wait();
       
      // Find donation event
      const event = receipt.events?.find(e => e.event === "FundsDonated");
      if (event) {
        const [donor, amountDonated, timestamp] = event.args;
        console.log("Donation successful:", {
          donor,
          amountDonated: ethers.utils.formatEther(amountDonated),
          timestamp: new Date(timestamp * 1000)
        });
      }

      return true;
    } catch (error) {
      console.error("Donation failed:", error);
      
      let errorMessage = "Donation failed";
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Modify handleSubmit to check fulfillment status
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (checkingFulfillment) {
      toast.info("Verifying campaign status...");
      return;
    }

    if (isNeedFulfilled) {
      toast.error("This campaign need has already been fulfilled");
      return;
    }

    if (isFormLoading || isProcessing) return;
    
    setIsFormLoading(true);
    try {
      // First handle blockchain donation
      const success = await handleBlockchainDonation(
        applicationData?.user?.ethAddress,
        formData.amount
      );

      if (!success) {
        setIsFormLoading(false);
        return;
      }
      
      addMutate(
        {},
        {
          onSuccess: (response) => {
            toast.success(response?.data?.message);
            router.push("/dashboard/donor");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
          },
          onSettled: () => {
            setIsFormLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to process donation");
      setIsFormLoading(false);
    }
  };

  // ... (keep the rest of your component code)

  const totalAmountRequired = applicationData?.totalAmount || 0;
  const applicationTitle = applicationData?.applicationTitle || "";
  const name = applicationData?.user?.name || "";
  const ethAddress = applicationData?.user?.ethAddress || ""; // beneficiary eth address
  const applicationPicture = applicationData?.applicationPicture;
  const daysLeft = applicationData?.daysLeft || 0;
  const description = applicationData?.description || "";

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">No report found.</div>;
  // Modify the Fund Section to show status
  return (
    <div>
      {/* ... (keep existing JSX) */}
      <div className="flex items-center justify-center mt-6">
        <h1 className="text-center font-bold text-black text-2xl">
         
          {applicationTitle}
        </h1>
      </div>

      <div className={styles.campaignDetailsPage}>
       
        <div className={styles.campaignContainer}>
          <div className={styles.leftColumn}>
            
            <img
          src={applicationPicture?.url}  
          alt="Campaign"
          className={styles.campaignImage}
          style={{ paddingLeft: '20px' }}
        />

            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  
               
                width: `${(0.01 / totalAmountRequired) * 100}%`, }}
              ></div>
            </div>

            {/* Creator Section */}
            <div className={styles.creatorSection}>
              <h2>CREATOR</h2>
              <span>{name}</span>
            </div>

            {/* Story Section */}
            <div className={styles.storySection}>
              <h2>Story</h2>
              <p>{description}</p>
            
            </div>

            {/* Donators Section */}
            <div className={styles.donatorsSection}>
              <h2>Donators</h2>
              <ul>
                
                 <li >0x24Cd5...2C</li>
                 <li >0x24Cd5...2C</li>
              </ul>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <p>Days Left</p>
                <h2>{daysLeft} Days Left</h2>
                </div>
              <div className={styles.statItem}>
                <p>Raised</p>
                
                <h2>
                  0.01 of {totalAmountRequired} ETH
                </h2>
              </div>
              <div className={styles.statItem}>
                <p>Total Donors</p>
                
                <h2>2</h2>
              </div>
            </div>
      <div className={styles.fundSection}>
        <h2>Fund</h2>
        {checkingFulfillment ? (
          <div className="text-center py-4">
            <FaSpinner className="animate-spin mx-auto" />
            <p>Checking campaign status...</p>
          </div>
        ) : isNeedFulfilled ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>This campaign need has been fully funded!</p>
            <p className="text-sm mt-1">Thank you for your support.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          <label htmlFor="pledgeInput">Pledge without reward</label>
          <input
            id="pledgeInput"
            name="amount"
            type="number"
            placeholder="USD 10"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            required
            disabled={isProcessing}
          />
          
          
          {ethEstimate && (
  <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
    <svg
      className="w-4 h-4 text-green-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Live ETH Estimate: <span className="ml-1">{ethEstimate} ETH</span>
  </p>
)}


          <button
            type="submit"
            disabled={isProcessing}
            className={styles.fundBtn}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Fund Campaign"
            )}
          </button>
        </form>
        )}
      </div>
      </div>
    </div>
    </div>
      {/* ... (rest of your JSX) */}
    </div>
  );
};

export default CampaignDetails;










//before fulfilled
// "use client";
// import React, { useState } from "react";
// import styles from "./CampaignDetails.module.css";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useStateContext } from "@/app/StateContext";  
// import { useGetProgressReport } from "../../hooks/beneficiary-hook"; 
// import { useFundCampaign } from "../../hooks/donor-hook"; 
// import { toast } from "react-toastify";
// import { FaUpload, FaSpinner } from "react-icons/fa";
// import { IoIosArrowRoundForward } from "react-icons/io";
// import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
// import { ethers } from "ethers";
// import axios from "axios";

// // USD to ETH conversion rate (fallback if API fails)
// const FALLBACK_ETH_RATE = 0.0005; // Adjust this based on current rates

// const getUsdToEthRate = async () => {
//   try {
//     const response = await axios.get(
//       'https://api.coinbase.com/v2/exchange-rates',
//       {
//         params: {
//           currency: 'USD'
//         }
//       }
//     );
//     const rate = response.data.data.rates.ETH;
//     console.log("ETH/USD rate:", rate);
//     return parseFloat(rate);
//   } catch (error) {
//     console.error('Error fetching exchange rate:', error);
//     return 1 / FALLBACK_ETH_RATE; // Return rate as USD per ETH
//   }
// };

// const CampaignDetails = ({ campaignID }) => {
//   const router = useRouter();
//   const { isLoggedIn, user } = useStateContext(); 
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [ethEstimate, setEthEstimate] = useState("");
//   const [conversionRate, setConversionRate] = useState(null);
//   const [isFormLoading, setIsFormLoading] = useState(false);

//   const { data: applicationData, isLoading, error } = useGetProgressReport(campaignID);
//   console.log("specific campaign data",applicationData);
//   const [formData, setFormData] = useState({
//     userId: user?.userId,
//     campaignId: campaignID,
//     amount: "",
//     timestamp: new Date().toISOString(),
//   });
//   const currentNeedId = applicationData?.currentNeedId;
//   console.log("currentNeedId",currentNeedId);
  
//   const { mutate: addMutate } = useFundCampaign(JSON.stringify(formData));

//   // Fetch conversion rate on component mount
//   React.useEffect(() => {
//     const fetchRate = async () => {
//       const rate = await getUsdToEthRate();
//       setConversionRate(rate);
//     };
//     fetchRate();
//   }, []);

//   const handleInputChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "amount" && value && conversionRate) {
//       try {
//         const usdAmount = parseFloat(value);
//         if (isNaN(usdAmount)) return;

        
//         // Calculate ETH value (USD amount * ETH per USD rate)
//         const ethValue = usdAmount * conversionRate;
//         setEthEstimate(ethValue.toFixed(6));
//       } catch (err) {
//         console.error("Conversion error:", err);
//         setEthEstimate("");
//       }
//     }
//   };

//   const handleBlockchainDonation = async (beneficiaryAddress, usdAmount) => {
//     if (!conversionRate) {
//       throw new Error("Exchange rate not loaded");
//     }

//     setIsProcessing(true);
//     try {
//       // Validate inputs
//       if (!beneficiaryAddress || !ethers.utils.isAddress(beneficiaryAddress)) {
//         throw new Error("Invalid beneficiary address");
//       }

//       const usdValue = parseFloat(usdAmount);
//       // if (isNaN(usdValue) {
//         if (isNaN(usdValue)) {

//         throw new Error("Please enter a valid USD amount");
//       }

//       // Convert USD to ETH
//       const ethValue = usdValue * conversionRate;
//       if (ethValue <= 0) {
//         throw new Error("Donation amount must be greater than 0");
//       }

//       console.log(`Donating: $${usdValue} USD -> ${ethValue} ETH`);

//       // Call smart contract with ETH value (not wei - the function will handle conversion)
//       const tx = await TrustAidContractInteraction.donate(
//         beneficiaryAddress,
//         currentNeedId,
//         ethValue.toString() // Pass as ETH string
//       );

//       const receipt = await tx.wait();
      
//       // Find donation event
//       const event = receipt.events?.find(e => e.event === "FundsDonated");
//       if (event) {
//         const [donor, amountDonated, timestamp] = event.args;
//         console.log("Donation successful:", {
//           donor,
//           amountDonated: ethers.utils.formatEther(amountDonated),
//           timestamp: new Date(timestamp * 1000)
//         });
//       }

//       return true;
//     } catch (error) {
//       console.error("Donation failed:", error);
      
//       let errorMessage = "Donation failed";
//       if (error.code === 'INSUFFICIENT_FUNDS') {
//         errorMessage = "Insufficient funds for transaction";
//       } else if (error.code === 4001) {
//         errorMessage = "Transaction rejected by user";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       toast.error(errorMessage);
//       return false;
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isLoggedIn) {
//       toast.error("Please connect your wallet first");
//       return;
//     }

//     if (isFormLoading || isProcessing) return;
    
//     setIsFormLoading(true);
//     try {
//       // First handle blockchain donation
//       const success = await handleBlockchainDonation(
//         applicationData?.user?.ethAddress,
//         formData.amount
//       );

//       if (!success){
//         setIsFormLoading(false);
//         return;
//       }

      
//       addMutate(
//         {},
//         {
//           onSuccess: (response) => {
//             toast.success(response?.data?.message);
//             router.push("/dashboard/donor");
//           },
//           onError: (error) => {
//             toast.error(error.response?.data?.message || "Something went wrong");
//           },
//           onSettled: () => {
//             setIsFormLoading(false);
//           }
//         }
//       );
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error(error.message || "Failed to process donation");
//       setIsFormLoading(false);
//     }
//   };


//   const totalAmountRequired = applicationData?.totalAmount || 0;
//   const applicationTitle = applicationData?.applicationTitle || "";
//   const name = applicationData?.user?.name || "";
//   const ethAddress = applicationData?.user?.ethAddress || ""; // beneficiary eth address
//   const applicationPicture = applicationData?.applicationPicture;
//   const daysLeft = applicationData?.daysLeft || 0;
//   const description = applicationData?.description || "";

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">No report found.</div>;

//   return (
//     <div>
//       <div className="flex items-center justify-center mt-6">
//         <h1 className="text-center font-bold text-black text-2xl">
         
//           {applicationTitle}
//         </h1>
//       </div>

//       <div className={styles.campaignDetailsPage}>
       
//         <div className={styles.campaignContainer}>
//           <div className={styles.leftColumn}>
            
//             <img
//           src={applicationPicture?.url}  
//           alt="Campaign"
//           className={styles.campaignImage}
//           style={{ paddingLeft: '20px' }}
//         />

//             <div className={styles.progressBar}>
//               <div
//                 className={styles.progress}
//                 style={{
                  
               
//                 width: `${(0.01 / totalAmountRequired) * 100}%`, }}
//               ></div>
//             </div>

//             {/* Creator Section */}
//             <div className={styles.creatorSection}>
//               <h2>CREATOR</h2>
//               <span>{name}</span>
//             </div>

//             {/* Story Section */}
//             <div className={styles.storySection}>
//               <h2>Story</h2>
//               <p>{description}</p>
            
//             </div>

//             {/* Donators Section */}
//             <div className={styles.donatorsSection}>
//               <h2>Donators</h2>
//               <ul>
                
//                  <li >0x24Cd5...2C</li>
//                  <li >0x24Cd5...2C</li>
//               </ul>
//             </div>
//           </div>

//           <div className={styles.rightColumn}>
//             <div className={styles.stats}>
//               <div className={styles.statItem}>
//                 <p>Days Left</p>
//                 <h2>{daysLeft} Days Left</h2>
//                 </div>
//               <div className={styles.statItem}>
//                 <p>Raised</p>
                
//                 <h2>
//                   0.01 of {totalAmountRequired} ETH
//                 </h2>
//               </div>
//               <div className={styles.statItem}>
//                 <p>Total Donors</p>
                
//                 <h2>2</h2>
//               </div>
//             </div>
//       {/* Fund Section */}
//       <div className={styles.fundSection}>
//         <h2>Fund</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="pledgeInput">Pledge without reward</label>
//           <input
//             id="pledgeInput"
//             name="amount"
//             type="number"
//             placeholder="USD 10"
//             step="0.01"
//             min="0.01"
//             value={formData.amount}
//             onChange={handleInputChange}
//             required
//             disabled={isProcessing}
//           />
          
          
//           {ethEstimate && (
//   <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
//     <svg
//       className="w-4 h-4 text-green-500"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//     >
//       <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//     Live ETH Estimate: <span className="ml-1">{ethEstimate} ETH</span>
//   </p>
// )}


//           <button
//             type="submit"
//             disabled={isProcessing}
//             className={styles.fundBtn}
//           >
//             {isProcessing ? (
//               <>
//                 <FaSpinner className="animate-spin mr-2" />
//                 Processing...
//               </>
//             ) : (
//               "Fund Campaign"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default CampaignDetails;