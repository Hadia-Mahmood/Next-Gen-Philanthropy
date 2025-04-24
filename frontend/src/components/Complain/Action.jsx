"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const Action = () => {
  return (
    <div className="lg:w-[30%] w-full hidden lg:block mx-auto lg:h-fit lg:sticky lg:top-20 lg:bottom-0 rounded-2xl bg-[#257830] sm:px-10 px-5 py-7 sm:py-20 font-poppins text-[#fff]">
      <h1 className="font-semibold text-xl">
        Trusted And Reliable  Collection!
      </h1>
      <p className="text-sm mt-3 leading-6">
        The platform becomes a catalyst for positive change, encouraging
        responsible  practices while rewarding users for their
        contributions to a sustainable future.
      </p>
      <button className="sm:mt-6 mt-4 flex justify-center items-center font-semibold text-sm gap-3 bg-[#fff] transition duration-500 ease-in-out hover:bg-[#20332c] text-[#20332c] hover:text-[#fff] outline-none border-0 lg:py-5 py-3 px-7 rounded-md">
        Get Started Now
        <span className="p-0 rounded-full bg-[#20332c]  transition duration-500 text-[#fff] ">
          <IoIosArrowRoundForward className="text-[27px] font-bold" />
        </span>{" "}
        <style jsx>{`
          button:hover span {
            background-color: #fff;
            color: #20332c;
          }
        `}</style>
      </button>
      <div className="font-poppins text-[#fff] mt-5 sm:mt-10">
        <p className="flex justify-start items-center sm:gap-6 gap-3 mb-2">
          <MdMarkEmailUnread className="text-[25px]" />

          <a
            href="mailto:recy8001@gmail.com"
            className="cursor-pointer sm:text-base text-sm"
          >
            trustAid8001@gmail.com
          </a>
        </p>
        <p className="flex justify-start items-center sm:gap-6 gap-3 ">
          <FaPhone className="text-[21px]" />
          <span className="cursor-pointer sm:text-base text-sm">
            +92 3234211
          </span>
        </p>
      </div>
    </div>
  );
};

export default Action;
