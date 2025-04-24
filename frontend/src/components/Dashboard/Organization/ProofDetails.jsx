"use client";

import React from "react";

import { useGetBreakdownProof } from "../../../hooks/beneficiary-hook"; 


const FileDisplaySection = ({ label, files }) => {
  return (
    <div className="my-3">
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span className="text-gray-700">{file.name}</span>
              <a
                href={file.url} // assuming files have a url
                className="text-blue-500 underline"
                download
              >
                Download
              </a>
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

const Proof_Details = ({ breakdownId }) => {
  console.log("breakdownId", breakdownId);
  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useGetBreakdownProof(breakdownId);

  console.log("applicationData", applicationData);

  if (applicationLoading) return <div>Loading...</div>;
  if (applicationError || !applicationData) return <div className="text-red-500">No proof found.</div>;
  const uurl = applicationData.breakdownFileHash
  console.log("url",uurl);
  return (
    <div className="p-4 sm:p-5 md:p-10 bg-[#fff] rounded-md font-poppins">
      <h1 className="font-bold text-3xl">Aid Support Usage Details</h1>
      <p className="text-sm mt-3 leading-6 text-[#62706b]">
        Below are the details regarding the aid support provided.
      </p>

      {/* Proof Status */}
      <div className="my-5">
        <label className="font-semibold mb-2 block">Proof Status</label>
        <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{applicationData.proofStatus}</p>
      </div>

       <FileDisplaySection
        label=" Support Documents"
        files={[
          { name: "Proof Document", url: uurl || "/mock-document.pdf" },
        ]}
      />


      {/* Summary of Aid Usage */}
      <div className="my-5">
        <label className="font-semibold mb-2 block">Summary of Usage</label>
        <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{applicationData.usageSummary}</p>
      </div>

      {/* Completion Date */}
      <div className="my-5">
        <label className="font-semibold mb-2 block">Completion Date</label>
        <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{new Date(applicationData.completionDate).toLocaleDateString()}</p>
      </div>

      {/* Third-Party Verification */}
      <div className="my-5">
        <h2 className="font-semibold text-lg mb-3">Third-Party Verification</h2>
        <div className="mb-3">
          <label className="font-semibold block">Third-Party Name</label>
          <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{applicationData.thirdPartyVerification.name}</p>
        </div>
        <div className="mb-3">
          <label className="font-semibold block">Third-Party Contact Number</label>
          <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{applicationData.thirdPartyVerification.contactNumber}</p>
        </div>
        <div className="mb-3">
          <label className="font-semibold block">Third-Party Email Address</label>
          <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{applicationData.thirdPartyVerification.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Proof_Details;