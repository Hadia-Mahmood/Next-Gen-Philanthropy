"use client";
import CampaignDetails from "@/components/Dashboard/Beneficiary/ProgressReport";
import BreakdownReport from "@/components/Dashboard/Beneficiary/BreakdownReport";
import React from "react";

import { useSearchParams } from "next/navigation";
const page = () => {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId"); // Get the ID from URL

  return (
    <div>
      <CampaignDetails applicationId={applicationId}  />
      <BreakdownReport applicationId={applicationId} />

 
    </div>
  );
};

export default page;
