import SpecificPost from "@/components/Forums/SpecificPost";
import Hero from "@/components/Shared/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero
        title="Learn. Share. Discuss."
        bgImage="/home/hero__slider1.jpg"
        page="forum"
      />
      <SpecificPost />
    </div>
  );
};

export default page;
