import CampaignDetails from "@/components/Campaigns/SpecificCampaign";
import React from "react";
import Header from "@/components/Shared/Header";
const page = ({ params }) => {
  return (
    <div>
      {/* <Header/> */}
      <CampaignDetails campaignID={params?.id} />
    </div>
  );
};

export default page;
