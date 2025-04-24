import CampaignFill from "@/components/Campaigns";

import Hero from "@/components/Shared/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero
        title="Find Beneficiaries"
        bgImage="/home/hero__slider1.jpg"
        page="showSearch"
      />
      <CampaignFill />
    </div>
  );
};

export default page;
