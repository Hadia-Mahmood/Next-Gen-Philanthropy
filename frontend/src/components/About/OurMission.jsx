"use client";
import { aboutaccordionOurMissionData, howItWorksHomeData } from "@/app/data";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="mb-2 mt-5 w-full">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full px-4 py-3 text-[15px] text-white bg-[#32A632] hover:bg-green-600 rounded-md focus:outline-none"
      >
        <span className="text-[15px]">{title}</span>
        <span className="text-lg">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-4 mt-2 border text-[#63716c] text-[15px] rounded-md bg-white">
          {content}
        </div>
      )}
    </div>
  );
};

const OurMission = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-10 md:py-20 lg:py-36 px-4 md:px-10 lg:px-20">
      {/* Top Container */}

      <div className="flex lg:flex-row flex-col justify-between items-start gap-10 mt-10 lg:mt-20">
        {/* Left Container */}
        <div
          style={{
            background:
              "url('/home/how__it__works1.jpg') no-repeat center center/cover",
          }}
          className="lg:w-[60%] w-full h-[550px] sm:h-[650px] lg:h-[550px] rounded-3xl relative lg:sticky lg:top-20 lg:bottom-0"
        >
          <div className="absolute lg:-left-12 bottom-5 lg:bottom-28 w-[90%] sm:w-[80%] md:w-[90%] lg:w-full  lg:h-48 flex justify-center items-stretch">
            <div className="w-[25%] lg:w-[15%] bg-[#f29620] grid place-items-center rounded-s-xl cursor-pointer transition duration-500 ease-in-out hover:bg-[#257830]">
              <FaPlay className="text-[20px] text-[#fff]" />
            </div>
            <div className="w-full flex lg:flex-row gap-4 lg:gap-unset  flex-col justify-center items-center rounded-e-xl py-5  lg:py-10 bg-[#fff]">
              {howItWorksHomeData.map((item) => (
                <div
                  key={item.title}
                  className="px-7 flex flex-col justify-center items-center border-r-gray-300 lg:border-r-2"
                >
                  <img
                    src={item.imageSrc}
                    alt="logo"
                    className="transition duration-400 sm:w-[70px] w-[50px] lg:w-fit ease-in-out hover:scale-110"
                  />
                  <h1 className="lg:mt-3 text-center text-[#182822] sm:text-base text-[13px] lg:font-semibold font-poppins">
                    {item.title}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Container */}
        <div className="lg:w-[40%] font-poppins ">
          <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl sm:text-left text-center mb-4 text-[#182822] leading-normal">
            Our Mission
          </h1>

          <p className=" text-[#63716c]">
            This innovative approach not only minimizes the ecological footprint
            but also contributes to a cleaner, healthier environment for current
            and future generations
          </p>

          {/* Accordion */}
          <div className="w-full">
            {aboutaccordionOurMissionData.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.title}
                content={item.content}
                isOpen={openIndex === index}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;
