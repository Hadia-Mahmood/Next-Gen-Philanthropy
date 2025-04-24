"use client";
import ProofDetails from "@/components/Dashboard/Beneficiary/ProofDetails";
import React from "react";
import { useSearchParams } from "next/navigation";
const page = () => {
  const searchParams = useSearchParams();
    const breakdownId = searchParams.get("breakdownId"); // Get the ID from URL
  
  return (
    <div>
      <ProofDetails breakdownId={breakdownId} />
    </div>
  );
};

export default page;
