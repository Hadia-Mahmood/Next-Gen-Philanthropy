"use client";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUserForgotPassword } from "../../hooks/auth-hook";
import { IoIosArrowBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
  });

  const { mutate: addMutate } = useUserForgotPassword(JSON.stringify(userData));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    addMutate(
      {},
      {
        onSuccess: (response) => {
          toast.success(response?.data?.message);

          setIsLoading(false);
        },
        onError: (response) => {
          toast.error(response.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className=" rounded-xl font-poppins relative border-2 px-3 sm:px-5 lg:px-7 pt-4 sm:pt-7 lg:pt-12 pb-4 lg:pb-7 bg-[#fff] w-full h-full ">
      <Link className="" href="/login">
        <IoIosArrowBack className="absolute  top-5 left-1 sm:left-5 text-[25px]" />
      </Link>

      <h2 className="font-paralucent text-center text-[20px] lg:text-3xl">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <input
            type="email"
            name="email"
            required
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="text-[10px] lg:text-base px-2 md:px-4 w-full py-3 rounded-lg outline-none bg-[#EAEAEA]"
          />
        </div>

        <div className="grid place-items-center mt-4  font-poppins">
          {isLoading ? (
            <button
              type="submit"
              className=" w-full flex justify-center items-center font-semibold text-sm sm:text-lg gap-3 bg-[#20332c] transition duration-500 ease-in-out outline-none border-0 px-7 lg:py-3 py-3 rounded-md"
              disabled
            >
              <FaSpinner className="animate-spin mr-2 text-white" />
              <span className={"text-white"}>Sending...</span>
            </button>
          ) : (
            <button
              type="submit"
              // onClick={resetForm}
              className=" w-full flex justify-center items-center font-semibold text-sm sm:text-lg gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 lg:py-3 py-3 rounded-md"
            >
              Send Reset Link
              <span className="p-0 rounded-full bg-[#fff] transition duration-500 text-[#20332c]">
                <IoIosArrowRoundForward className="text-[27px] font-bold" />
              </span>{" "}
              <style jsx>{`
                button:hover span {
                  background-color: #fff;
                  color: #257830;
                }
              `}</style>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
