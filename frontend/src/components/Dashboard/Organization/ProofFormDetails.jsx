"use client";
import React, { useState , useEffect} from "react";
import { useGetBreakdownProofById } from "../../../hooks/organization-hook";
import { useRouter } from "next/navigation"; 
import { toast } from "react-toastify";
import { useProofStatus } from "../../../hooks/organization-hook";
import TrustAidContractInteraction from "@/utils/trustAidContractInteraction";

const FileDisplaySection = ({ label, files, onDownload }) => {
  return (
    <div className="my-3">
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span className="text-gray-700">{file.name}</span>
              <button
                onClick={() => onDownload(file.url)}
                className="text-blue-500 underline"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-200 rounded-md flex flex-col items-center justify-center text-gray-700">
          <p>{label}</p>
        </div>
      )}
    </div>
  );
};

const ProofFormDetails = ({ breakdownProofId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [data, setData] = useState({
    proofStatus: "",
    breakdownProofId: breakdownProofId,
  });
  
  const { mutate: addMutate } = useProofStatus(JSON.stringify(data));

  // Fetch Breakdown Proof Data
  const { data: breakdownProofData, isLoading, error } = useGetBreakdownProofById(breakdownProofId);
  useEffect(() => {
    if (breakdownProofData) {
      console.log("Data loaded:", {
        needId: breakdownProofData.needId,
        address: breakdownProofData.ethAddress,
      });
    }
  }, [breakdownProofData]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const {
    breakdownFileHash,
    usageSummary,
    completionDate,
    thirdPartyVerification,
    
  } = breakdownProofData?.breakdownProof || {};
  
console.log("breakdownProofDataethAddress",breakdownProofData?.ethAddress);
console.log("breakdownProofDataneedId",breakdownProofData?.needId);
  const needId = breakdownProofData?.needId;
  const beneficiaryAddress= breakdownProofData?.ethAddress;
  console.log("Full breakdownProofData:", breakdownProofData);
console.log("needId",needId);
console.log("beneficiaryAddress",beneficiaryAddress);
console.log("Verification values:", {
  needId,
  beneficiaryAddress,
  hasNeedId: !!needId,
  hasAddress: !!beneficiaryAddress
});

  const handleDownload = (ipfsHash) => {
    // Remove gateway prefix if present
    const cleanHash = ipfsHash.replace('https://gateway.pinata.cloud/ipfs/', '');
    const downloadUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
    window.open(downloadUrl, '_blank');
  };

  const handleBlockchainAction = async (action) => {
    console.log("Blockchain action data:", {
      beneficiaryAddress,
      needId,
      action
    });
    if (!beneficiaryAddress ||  needId === undefined || needId === null) {
      toast.error("Missing required data for blockchain operation");
      return false;
    }

    setActionLoading(true);
    try {
      if (action === "approved") {
        await TrustAidContractInteraction.approveProof(beneficiaryAddress, needId);
      } else {
        await TrustAidContractInteraction.rejectProof(beneficiaryAddress, needId);
      }
      return true;
    } catch (error) {
      console.error("Blockchain action failed:", error);
      toast.error(`Failed to ${action} proof on blockchain: ${error.message}`);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    setLoading(true);
    
    try {
      // 1. First perform blockchain action
      const blockchainSuccess = await handleBlockchainAction(status);
      if (!blockchainSuccess) return;

      // 2. Then update backend status
      setData({ ...data, proofStatus: status });
      
      addMutate(
        { proofStatus: status },
        {
          onSuccess: (response) => {
            toast.success(response?.data?.message);
            router.push("/dashboard/organization/process-proofs");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update status");
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to process request");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
      <h1 className="font-bold text-3xl">Aid Support Usage Details</h1>
      <p className="text-sm mt-3 leading-6 text-[#62706b]">
        Below are the details regarding the aid support provided for donation assistance.
      </p>

      {/* Support Documents */}
      <FileDisplaySection
        label="Uploaded Support Documents"
        files={[
          { 
            name: "Proof Document", 
            url: breakdownFileHash || ""
          },
        ]}
        onDownload={handleDownload}
      />

      {/* Other form sections remain the same... */}
      {/* Breakdown Details */}
      <div className="my-5">
        <div className="grid grid-cols-1">
          <div>
            <label className="font-semibold block">Summary Of Usage</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{usageSummary || "No summary available"}</p>
          </div>
        </div>
      </div>

      {/* Completion Date */}
      <div>
        <label className="font-semibold block">Completion Date</label>
        <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{new Date(completionDate).toLocaleDateString()}</p>
      </div>
      {/* Third-Party Verification */}
      <div className="my-5">
        <h1 className="font-bold text-2xl">Third-Party Verification </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold mb-2 block">Third-Party Name</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">
              {thirdPartyVerification?.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="font-semibold mb-2 block">Third-Party Contact Number</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">
              {thirdPartyVerification?.contactNumber || "N/A"}
            </p>
          </div>
          <div>
            <label className="font-semibold mb-2 block">Third-Party Email Address</label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded-md">
              {thirdPartyVerification?.email || "N/A"}
            </p>
          </div>
        </div>
      </div>

      
      {/* Approval Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={() => handleSubmit("rejected")}
          disabled={loading || actionLoading}
        >
          {loading || actionLoading ? "Processing..." : "Reject Proof"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={() => handleSubmit("approved")}
          disabled={loading || actionLoading}
        >
          {loading || actionLoading ? "Processing..." : "Approve Proof"}
        </button>
      </div>
    </div>
  );
};

export default ProofFormDetails;