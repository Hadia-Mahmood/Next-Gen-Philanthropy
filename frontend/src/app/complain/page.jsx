"use client";
import Action from "@/components/Complain/Action";
import dynamic from "next/dynamic";

const ComplainForm = dynamic(
  () => import("@/components/Complain/ComplainForm"),
  {
    ssr: false,
  }
);

import Hero from "@/components/Shared/Hero";

const page = () => {
  return (
    <>
      <Hero title="Make a Complain" bgImage="/home/hero__slider1.jpg" />

      <div className="lg:my-32 md:my-20 my-10 mx-4 sm:mx-10   bg-[#fff] flex lg:flex-row flex-col justify-center gap-10">
        <Action />
        <div className="lg:w-[70%] w-full">
          <ComplainForm />
        </div>
      </div>
    </>
  );
};

export default page;
