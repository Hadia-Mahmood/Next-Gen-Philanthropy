"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const AboutUs = () => {
  const router = useRouter();
  return (
    <div className="w-full text-[#000]">
      {/* Top Container */}
      <div className="flex lg:flex-row flex-col gap-7 justify-between items-start px-3 md:px-10 pt-6 pb-10 sm:pt-10 sm:pb-16 border-b-[1px] border-[#ddd]">
        {/* Left Container */}
        <div className="flex md:flex-row flex-col gap-5 justify-start items-start lg:items-center lg:w-1/2">
          {/* Left Container */}
          <div className="flex flex-row lg:flex-col md:w-1/3 justify-start items-start lg:items-center">
            <img
              src="/home/contact__avatar.jpg"
              alt="logo"
              className="w-[55px] h-[55px] rounded-full border-[5px] border-[#fff] -mr-2 z-10"
            />
            <span className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[#000] text-[20px] text-[#fff] transition duration-500 ease-in-out hover:bg-[#f29620] cursor-pointer z-0">
              <FaPhoneAlt />
            </span>
          </div>
          {/* Right Container */}
          <div>
            <p className="text-[#62706b] text-[15px] font-poppins font-semibold">
              Blockchain integration ensures the security and immutability of
              these donations, promoting a transparent and accountable system.
            </p>
            <div className="hover_effect flex justify-start items-center gap-3 mt-2 cursor-pointer ">
              <span
                onClick={() => router.push("/")}
                className="text-[#257830] text-[15px] font-semibold font-poppins"
              >
                Contact Us Now
              </span>
              <span className="p-1 rounded-full bg-[#257830] transition duration-500  text-[#fff] ">
                <IoIosArrowRoundForward className="text-[25px] font-bold" />
              </span>{" "}
              <style jsx>{`
                .hover_effect:hover span:nth-child(2) {
                  transform: scale(1.2);
                }
              `}</style>
            </div>
          </div>
        </div>
        {/* Right Container */}
        <div className="lg:-mt-32 flex md:flex-row flex-col gap-5 lg:gap-10">
          {/* First Div */}
          <div className="text-[#fff] bg-[#257830] font-poppins px-4 sm:px-8 py-5 sm:py-7 h-fit lg:w-[320px] rounded-md relative">
            <h1 className="font-semibold text-lg">
              User
              <br className="lg:block hidden" /> Satisfaction
            </h1>
            <p
              onClick={() => router.push("/about")}
              className="mt-3 mb-5 text-sm"
            >
              
              Our transparent blockchain system empowers donors with real-time tracking,
              ensuring every contribution makes a meaningful impact.
            </p>

            <div className="hover_effect flex justify-start items-center gap-3 mt-2 cursor-pointer ">
              <span className="p-0 rounded-full bg-[#fff] transition duration-500  text-[#257830] ">
                <IoIosArrowRoundForward className="text-[23px] font-bold" />
              </span>{" "}
              <style jsx>{`
                .hover_effect:hover span:nth-child(1) {
                  transform: scale(1.2);
                }
              `}</style>
              <span
                onClick={() => router.push("/about")}
                className="text-[#fff] text-[14px] font-semibold font-poppins"
              >
                Explore More
              </span>
            </div>

            <img
              src="/home/about__icon1.png"
              alt="logo"
              className="absolute bottom-2 right-2"
            />
          </div>
          {/* Second Div */}
          <div className="text-[#fff] bg-[#f29620] font-poppins px-4 sm:px-8 py-5 sm:py-7 lg:w-[320px] h-fit rounded-md relative">
            <h1 className="font-semibold text-lg">Charity Management</h1>
            <p className="mt-3 mb-5 text-sm">
              
              TrustAid streamlines charity operations with a blockchain-powered 
              system that ensures transparency and accountability. 
            </p>
            <div className="hover_effect flex justify-start items-center gap-3 mt-2 cursor-pointer ">
              <span className="p-0 rounded-full bg-[#fff] transition duration-500  text-[#f29620] ">
                <IoIosArrowRoundForward className="text-[23px] font-bold" />
              </span>{" "}
              <style jsx>{`
                .hover_effect:hover span:nth-child(1) {
                  transform: scale(1.2);
                }
              `}</style>
              <span className="text-[#fff] text-[14px] font-semibold font-poppins">
                Explore More
              </span>
            </div>
            <img
              src="/home/about__icon2.png"
              alt="logo"
              className="absolute bottom-2 right-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;