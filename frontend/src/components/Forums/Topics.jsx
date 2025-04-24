"use client";
import { topicCardsData } from "@/app/data";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetAllThreads } from "@/hooks/thread-hook";
import Link from "next/link";

const TopicCard = ({ category, title, userName, avatar, date, _id }) => {
  const router = useRouter();
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      onClick={() => router.push(`/forum/${_id}`)}
      className=" bg-[#fff] cursor-pointer font-poppins rounded p-4 sm:p-6 w-full lg:max-w-sm mx-auto transition duration-300 ease-in-out transform  hover:shadow-lg"
    >
      <p className="text-xs uppercase text-gray-500 mb-1 sm:mb-2 break-words">
        {category}
      </p>
      <h3 className="font-semibold text-lg  mb-1 sm:mb-2 break-words">
        {title}
      </h3>
      <div className="flex items-center mt-3">
        <img
          src={avatar}
          alt={userName}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div className="">
          <p className="font-normal text-sm">{userName}</p>
          <p className="text-[10px] -mt-1 text-gray-500">{formatDate(date)}</p>
        </div>
      </div>
    </div>
  );
};

const Topics = () => {
  const { data, isError } = useGetAllThreads();
  console.log({ data, isError });
  return (
    <div className="w-full md:pt-24 pt-12 pb-10 md:pb-16 px-4 md:px-10 font-poppins bg-[#f7f9f8]">
      <div className="md:px-5 flex w-full justify-between md:justify-end items-center gap-5">
        <h6 className="text-center sm:text-base text-sm font-normal text-[#f29620]">
          New to the Community?
        </h6>
        <Link
          href="/forum/new-topic"
          className="bg-[#f29620] hover:bg-[#eba852] sm:text-base text-sm text-white w-fit font-poppins py-2 px-3 md:px-4 rounded"
        >
          Add New Topic
        </Link>
      </div>
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-3 mb-3 text-center text-[#182822] leading-normal">
        Browse community topics
      </h1>
      <div className="pt-7 md:pt-12 w-full">
        <div className="flex flex-wrap  justify-center items-center">
          {data &&
            data?.length > 0 &&
            data?.map((topic, index) => (
              <div key={index} className="md:px-4 mb-4 md:mb-8 w-full lg:w-1/3">
                <TopicCard {...topic} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
