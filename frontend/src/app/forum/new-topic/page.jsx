import AddNewTopic from "@/components/Forums/AddNewTopic";
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
      <AddNewTopic />
    </div>
  );
};

export default page;
