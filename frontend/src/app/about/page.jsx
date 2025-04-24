import OurMission from "@/components/About/OurMission";
import Welcome from "@/components/About/Welcome";
import Hero from "@/components/Shared/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero title="About Us" bgImage="/about/about__hero.jpg" />
      <Welcome />
      <OurMission />
      
    </div>
  );
};

export default page;
