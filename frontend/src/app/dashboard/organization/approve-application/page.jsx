"use client";
import ApplicationFormDetails from "@/components/Dashboard/Organization/ApplicationFormDetails";
import React from "react";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
      const applicationId = searchParams.get("applicationId"); // Get the ID from URL
    
  return (
    <div>
      
      
      <ApplicationFormDetails applicationId={applicationId} />
    </div>
  ); 
};

export default page;
