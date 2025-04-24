"use client";
import ProofFormDetails from "@/components/Dashboard/Organization/ProofFormDetails";
import React from "react";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const breakdownProofId = searchParams.get("breakdownProofId"); // Get the ID from URL
      
  return (
    <div>
      <ProofFormDetails breakdownProofId={breakdownProofId}/>
    </div>
  );
};

export default page;
