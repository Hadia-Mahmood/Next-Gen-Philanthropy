"use client";
import React, { useState } from "react";
import Input from "../CC/Input";
import TextArea from "../CC/TextArea";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useStateContext } from "@/app/StateContext";
import { useCreateThread } from "@/hooks/thread-hook";
import { toast } from "react-toastify";

const AddNewTopic = () => {
  const [textValue, setTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useStateContext();

  const [userData, setUserData] = useState({
    userId: user?._id,
    userName: user?.name,
    title: "",
    tcontent: "",
    avatar: user?.image,
  });
  const { mutate: addMutate } = useCreateThread(JSON.stringify(userData));
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    console.log(userData.title);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    addMutate(
      {},
      {
        onSuccess: (response) => {
          console.log(response);
          toast.success(response?.data?.message);

          setIsLoading(false);
        },
        onError: (response) => {
          console.error("An error occurred:");
          console.log(response);
          console.log(response.response.data.message);
          toast.error(response.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="py-16 md:py-24 lg:py-32 font-poppins bg-[#f7f9f8]">
      <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto px-5 py-10 md:p-10 font-poppins rounded bg-[#fff]">
        <h1 className="font-bold text-xl md:text-2xl">
          Create and New Post and let the community Help you!!
        </h1>
        <p className="text-sm mt-3 leading-6 text-[#ffa500]">
          Contact Us And the community will Respond ASAP.
        </p>
        <form className="w-full mt-10 " onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Title"
              type="text"
              name="title"
              placeholder="Please write your Title"
              onChange={handleInputChange}
            />
          </div>
          <TextArea
            onChange={handleInputChange}
            name="tcontent"
            placeholder="Enter your text here..."
            rows={6}
            label="Your Content"
          />

          <button className="mt-6 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 py-5 rounded-md sm:rounded-sm">
            Submit Topic
            <span className="p-0 rounded-full bg-[#fff]  transition duration-500 text-[#20332c] ">
              <IoIosArrowRoundForward className="text-[27px] font-bold" />
            </span>{" "}
            <style jsx>{`
              button:hover span {
                background-color: #fff;
                color: #257830;
              }
            `}</style>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewTopic;
