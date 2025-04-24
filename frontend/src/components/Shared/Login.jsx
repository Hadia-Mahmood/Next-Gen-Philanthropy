"use client";
import { FaTimes } from "react-icons/fa";
import { useStateContext } from "@/app/StateContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUserLogin } from "../../hooks/auth-hook";
import { IoIosArrowRoundForward } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ethers } from "ethers";

const Login = () => {
  const [defaultAccount, setDefaultAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setOpenSignupModal, setOpenLoginModal } =
    useStateContext();

  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { mutate: addMutate } = useUserLogin(JSON.stringify(userData));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!defaultAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    addMutate(
      {},
      {
        onSuccess: (response) => {
          toast.success(response?.data?.message);
          setOpenLoginModal(false);
          setIsLoggedIn(true);
          if (
            pathname !== "/" ||
            pathname !== "/signup" ||
            pathname !== "/login" ||
            pathname !== "/forgot-password" ||
            pathname.startsWith !== "/reset-password"
          ) {
            router.back();
          }
          setIsLoading(false);
        },
        onError: (response) => {
          toast.error(response.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  const connectwalletHandler = () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner());
      });
    } else {
      toast.error("Please Install Metamask!!!");
    }
  };
  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();
    setDefaultAccount(address);
  };

  return (
    <div className=" flex items-center justify-center w-full h-full ">
      <div className="  bg-white rounded-xl  ">
        <div className="w-full mx-auto border-2 rounded-xl">
          <div className="px-4 lg:px-8">
            <h2 className="font-paralucent text-center text-[20px] lg:text-3xl mt-7 lg:my-4">
              Login
            </h2>

            <div className="col-span-2 mb-4">
              <div
                className="text-[10px]  py-3 lg:text-base cursor-pointer px-2 md:px-4 text-center w-full rounded-lg  bg-[#EAEAEA]"
                onClick={connectwalletHandler}
              >
                {defaultAccount ? defaultAccount : " Connect your wallet"}
              </div>
            </div>

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
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="text-[10px]  py-3 lg:text-base px-2 md:px-4 w-full rounded-lg outline-none mt-3 bg-[#EAEAEA]"
                />
              </div>

              <p className="mt-4 mb-2 font-poppins text-xs  ">
                Forgot your password?
                <Link
                  className="font-semibold text-sm text-[#32A632] mx-1"
                  href="/forgot-password"
                >
                  Click
                </Link>
                here to reset it.
              </p>

              <div className="grid place-items-center mt-2  font-poppins">
                {isLoading ? (
                  <button
                    type="submit"
                    className=" w-full flex justify-center items-center font-semibold text-sm sm:text-lg gap-3 bg-[#20332c] transition duration-500 ease-in-out outline-none border-0 px-7 lg:py-3 py-3 rounded-md"
                    disabled
                  >
                    <FaSpinner className="animate-spin mr-2 text-white" />
                    <span className={"text-white"}>Loading...</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    // onClick={resetForm}
                    className=" w-full flex justify-center items-center font-semibold text-sm sm:text-lg gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 lg:py-3 py-3 rounded-md"
                  >
                    login
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
            <p className="text-center my-4 sm:mt-4 font-semibold  text-[10px] lg:text-sm">
              Not With Us?
              <Link
                href="/signup"
                className="text-[#32A632] ml-1 underline cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
