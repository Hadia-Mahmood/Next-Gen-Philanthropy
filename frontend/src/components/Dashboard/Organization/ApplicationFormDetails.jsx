"use client";
import React, { useState, useEffect } from "react";
import { useGetApplicationById } from "../../../hooks/organization-hook";
import { useApplicationApproval } from "../../../hooks/organization-hook";
import { useRouter } from "next/navigation"; 
import { toast } from "react-toastify";
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
import { ethers } from "ethers";

const RequestedAmountTable = ({ data }) => {
  const downloadFile = async (hash) => {
    const response = await fetch(`${hash}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "file"; // Change filename as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  
  
  return (
    <div className="my-5">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Purpose</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Document</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{item.purpose}</td>
              <td className="py-2 px-4">${item.amount}</td>
              <td className="py-2 px-4">{item.description}</td>
              <td className="py-2 px-4">
                 {/* <a href={item.documentHash} className="text-blue-500 underline" download>
                  Download
                 </a> */}
                 <a onClick={() => downloadFile(item.documentHash)} className="text-blue-500 underline cursor-pointer">
                     Download
                      </a>
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const ApplicationFormDetails = ({ applicationId }) => {
  const router = useRouter();
  const { data: applicationData, isLoading, error } = useGetApplicationById(applicationId);
  const [loading, setLoading] = useState(false);
  const [processingBlockchain, setProcessingBlockchain] = useState(false);

  const [data, setData] = useState({
    applicationApproval: "",
    applicationId: applicationId,
  });

  const { mutate: addMutate } = useApplicationApproval(JSON.stringify(data));

  const handleBlockchainApproval = async (beneficiaryAddress, approve) => {
    setProcessingBlockchain(true);
    try {
      if (approve) {
        // Approve beneficiary and create campaign
        const approveTx = await TrustAidContractInteraction.approveCampaign(beneficiaryAddress);
        await approveTx.wait();
        
        
        toast.success("Beneficiary approved and campaign created on blockchain");
      } else {
        // Disapprove beneficiary
        const disapproveTx = await TrustAidContractInteraction.disapproveCampaign(beneficiaryAddress);
        await disapproveTx.wait();
        
        toast.success("Beneficiary disapproved on blockchain");
      }
      return true;
    } catch (error) {
      console.error("Blockchain operation failed:", error);
      toast.error(`Blockchain operation failed: ${error.message}`);
      return false;
    } finally {
      setProcessingBlockchain(false);
    }
  };

  const handleSubmit = async (status) => {
    if (loading || processingBlockchain) return;
    
    setLoading(true);
    setData({ ...data, applicationApproval: status });

    try {
      // Get beneficiary address from application data
      const beneficiaryAddress = applicationData.application.userId.ethAddress;
      
      // First handle blockchain operations
      const blockchainSuccess = await handleBlockchainApproval(
        beneficiaryAddress, 
        status === "yes"
      );
      
      if (!blockchainSuccess) {
        setLoading(false);
        return;
      }
      
      // Then update backend
      addMutate(
        { applicationApproval: status },
        {
          onSuccess: (response) => {
            toast.success(response?.data?.message);
            router.push("/dashboard/organization/process-application");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
          },
          onSettled: () => {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to process application");
      setLoading(false);
    }
  };
 
  
  

  if (isLoading) return <div>Loading...</div>;
  if (error || !applicationData) return <div className="text-red-500">No application found.</div>;

  const application = applicationData.application;
  const isProcessing = loading || processingBlockchain;

  return (
    <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
      <h1 className="font-bold text-3xl">Beneficiary Application Form</h1>
      <p className="text-sm mt-3 leading-6 text-[#62706b]">
        Below are the details regarding the aid support needed for donation assistance.
      </p>
      {/* Personal Information */}
      <div className="my-5">
        <h1 className="font-semibold text-lg mb-3">Personal Information</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="font-semibold block">Full Name</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.name}</p></div>
          <div><label className="font-semibold block">Age</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.age}</p></div>
          <div><label className="font-semibold block">Gender</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.gender}</p></div>
          <div><label className="font-semibold block">Contact Number</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.contact}</p></div>
          <div><label className="font-semibold block">Address</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.address}</p></div>
        </div>
      </div>

      {/* Occupation and Reason for Assistance */}
      <div className="my-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block">Occupation</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.occupation}</p>
          </div>
          <div>
            <label className="font-semibold block">Reason for Assistance</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.description}</p>
          </div>
        </div>
      </div>

      {/* Amount Breakdown */}
      <h1 className="font-semibold text-lg mb-3">Amount Breakdown</h1>
      <RequestedAmountTable data={application.breakdowns} />

      {/* Total Amount Requested */}
      <label className="font-semibold mb-2 block">Total Amount Requested</label>
      <div className="my-5">
        <p className="text-gray-700 bg-gray-100 p-2 rounded-md">${application.amountRequested}</p>
      </div>

      {/* Financial Information */}
      <div className="my-5">
        <h1 className="font-semibold text-lg mb-3">Financial Information</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold mb-2 block">Monthly Income</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">${application.monthlyIncome}</p>
          </div>
          <div>
            <label className="font-semibold mb-2 block">Source of Income</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.sourceOfIncome}</p>
          </div>
          <div>
            <label className="font-semibold mb-2 block">Other Aid Sources</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.otherAidSources}</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="my-5">
        <h1 className="font-semibold text-lg mb-3">Bank Account Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="font-semibold block">Account Holder</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.accountHolder}</p></div>
          <div><label className="font-semibold block">Account Number</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.accountNumber}</p></div>
          <div><label className="font-semibold block">Bank Name</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.bankName}</p></div>
          <div><label className="font-semibold block">Branch Code</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.branchCode}</p></div>
        </div>
      </div>
      {/* Approval Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          className={`bg-red-600 text-white px-4 py-2 rounded-md ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleSubmit("no")}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Reject Application"}
        </button>
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded-md ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleSubmit("yes")}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Approve Application"}
        </button>
      </div>
    </div>
  );
};

export default ApplicationFormDetails;








// //new with event 
// "use client";
// import React, { useState, useEffect } from "react";
// import { useGetApplicationById } from "../../../hooks/organization-hook";
// import { useApplicationApproval } from "../../../hooks/organization-hook";
// import { useRouter } from "next/navigation"; 
// import { toast } from "react-toastify";
// import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";
// import { ethers } from "ethers";

// const RequestedAmountTable = ({ data }) => {
//   const downloadFile = async (hash) => {
//     const response = await fetch(`${hash}`);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
    
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "file"; // Change filename as needed
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };
  
  
  
//   return (
//     <div className="my-5">
//       <table className="w-full table-auto">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="py-2 px-4 text-left">Purpose</th>
//             <th className="py-2 px-4 text-left">Amount</th>
//             <th className="py-2 px-4 text-left">Description</th>
//             <th className="py-2 px-4 text-left">Document</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index} className="border-t">
//               <td className="py-2 px-4">{item.purpose}</td>
//               <td className="py-2 px-4">${item.amount}</td>
//               <td className="py-2 px-4">{item.description}</td>
//               <td className="py-2 px-4">
//                  {/* <a href={item.documentHash} className="text-blue-500 underline" download>
//                   Download
//                  </a> */}
//                  <a onClick={() => downloadFile(item.documentHash)} className="text-blue-500 underline cursor-pointer">
//                      Download
//                       </a>
//                </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// const ApplicationFormDetails = ({ applicationId }) => {
//   const router = useRouter();
//   const { data: applicationData } = useGetApplicationById(applicationId);
//   const [loading, setLoading] = useState(false);
//   const [processingBlockchain, setProcessingBlockchain] = useState(false);
//   const [campaignId, setCampaignId] = useState(null);

//   const [data, setData] = useState({
//     applicationApproval: "",
//     applicationId: applicationId,
//   });

//   const { mutate: addMutate } = useApplicationApproval(JSON.stringify(data));

//   const handleBlockchainApproval = async (beneficiaryAddress, approve) => {
//     setProcessingBlockchain(true);
//     try {
//       if (approve) {
//         // First approve the beneficiary
//         const approveTx = await TrustAidContractInteraction.approveCampaign(beneficiaryAddress);
//         const receipt = await approveTx.wait();
        
//         // The contract will automatically create a campaign after approval
//         // Listen for the CampaignCreated event in the transaction receipt
//         const campaignCreatedEvent = receipt.events?.find(
//           e => e.event === "CampaignCreated"
//         );
        
//         if (!campaignCreatedEvent) {
//           throw new Error("Campaign creation event not found");
//         }
        
//         const createdCampaignId = campaignCreatedEvent.args.campaignId.toString();
//         setCampaignId(createdCampaignId);
        
//         // Update data with campaignId
//         setData(prev => ({
//           ...prev,
//           campaignId: createdCampaignId
//         }));
        
//         toast.success(`Beneficiary approved and campaign ${createdCampaignId} created`);
//       } else {
//         // Disapprove beneficiary
//         const disapproveTx = await TrustAidContractInteraction.disapproveCampaign(beneficiaryAddress);
//         await disapproveTx.wait();
//         toast.success("Beneficiary disapproved on blockchain");
//       }
//       return true;
//     } catch (error) {
//       console.error("Blockchain operation failed:", error);
//       toast.error(`Blockchain operation failed: ${error.message}`);
//       return false;
//     } finally {
//       setProcessingBlockchain(false);
//     }
//   };

//   const handleSubmit = async (status) => {
//     if (loading || processingBlockchain) return;
    
//     setLoading(true);
    
//     try {
//       // Get beneficiary address from application data
//       const beneficiaryAddress = applicationData.application.userId.ethAddress;
      
//       // First handle blockchain operations
//       const blockchainSuccess = await handleBlockchainApproval(
//         beneficiaryAddress, 
//         status === "yes"
//       );
      
//       if (!blockchainSuccess) {
//         setLoading(false);
//         return;
//       }
      
//       // Prepare data for backend
//       const submissionData = {
//         applicationApproval: status,
//         applicationId: applicationId,
//         ...(campaignId && { campaignId }) // Only include campaignId if approved
//       };
      
//       // Then update backend
//       addMutate(submissionData, {
//         onSuccess: (response) => {
//           toast.success(response?.data?.message);
//           router.push("/dashboard/organization/process-application");
//         },
//         onError: (error) => {
//           toast.error(error.response?.data?.message || "Something went wrong");
//         },
//         onSettled: () => {
//           setLoading(false);
//         }
//       });
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error(error.message || "Failed to process application");
//       setLoading(false);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error || !applicationData) return <div className="text-red-500">No application found.</div>;

//   const application = applicationData.application;
//   const isProcessing = loading || processingBlockchain;

//   return (
//     <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
//       <h1 className="font-bold text-3xl">Beneficiary Application Form</h1>
//       <p className="text-sm mt-3 leading-6 text-[#62706b]">
//         Below are the details regarding the aid support needed for donation assistance.
//       </p>
//       {/* Personal Information */}
//       <div className="my-5">
//         <h1 className="font-semibold text-lg mb-3">Personal Information</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div><label className="font-semibold block">Full Name</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.name}</p></div>
//           <div><label className="font-semibold block">Age</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.age}</p></div>
//           <div><label className="font-semibold block">Gender</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.gender}</p></div>
//           <div><label className="font-semibold block">Contact Number</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.contact}</p></div>
//           <div><label className="font-semibold block">Address</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.address}</p></div>
//         </div>
//       </div>

//       {/* Occupation and Reason for Assistance */}
//       <div className="my-5">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold block">Occupation</label>
//             <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.occupation}</p>
//           </div>
//           <div>
//             <label className="font-semibold block">Reason for Assistance</label>
//             <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.description}</p>
//           </div>
//         </div>
//       </div>

//       {/* Amount Breakdown */}
//       <h1 className="font-semibold text-lg mb-3">Amount Breakdown</h1>
//       <RequestedAmountTable data={application.breakdowns} />

//       {/* Total Amount Requested */}
//       <label className="font-semibold mb-2 block">Total Amount Requested</label>
//       <div className="my-5">
//         <p className="text-gray-700 bg-gray-100 p-2 rounded-md">${application.amountRequested}</p>
//       </div>

//       {/* Financial Information */}
//       <div className="my-5">
//         <h1 className="font-semibold text-lg mb-3">Financial Information</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold mb-2 block">Monthly Income</label>
//             <p className="text-gray-700 bg-gray-100 p-2 rounded-md">${application.monthlyIncome}</p>
//           </div>
//           <div>
//             <label className="font-semibold mb-2 block">Source of Income</label>
//             <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.sourceOfIncome}</p>
//           </div>
//           <div>
//             <label className="font-semibold mb-2 block">Other Aid Sources</label>
//             <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.otherAidSources}</p>
//           </div>
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="my-5">
//         <h1 className="font-semibold text-lg mb-3">Bank Account Details</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div><label className="font-semibold block">Account Holder</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.accountHolder}</p></div>
//           <div><label className="font-semibold block">Account Number</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.accountNumber}</p></div>
//           <div><label className="font-semibold block">Bank Name</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.bankName}</p></div>
//           <div><label className="font-semibold block">Branch Code</label><p className="text-gray-700 bg-gray-100 p-2 rounded-md">{application.bankDetails.branchCode}</p></div>
//         </div>
//       </div>
//       {/* Approval Buttons */}
//       <div className="flex space-x-4 mt-6">
//         <button
//           className={`bg-red-600 text-white px-4 py-2 rounded-md ${
//             isProcessing ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={() => handleSubmit("no")}
//           disabled={isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Reject Application"}
//         </button>
//         <button
//           className={`bg-green-600 text-white px-4 py-2 rounded-md ${
//             isProcessing ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={() => handleSubmit("yes")}
//           disabled={isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Approve Application"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ApplicationFormDetails;




