"use client";
import { toast } from "react-toastify";
import { useUserResetPassword } from "../../hooks/auth-hook";
import { IoIosArrowRoundForward } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ResetPassword = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [userData, setUserData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const { mutate: addMutate } = useUserResetPassword(
    JSON.stringify({ token, newPassword: userData?.newPassword })
  );

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
          setTimeout(() => {
            router.push("/login");
          }, 600);
        },
        onError: (response) => {
          toast.error(response.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className=" rounded-xl font-poppins  border-2 px-3 sm:px-5 lg:px-7 pt-4 sm:pt-7 lg:pt-12 pb-4 lg:pb-7 bg-[#fff] w-full h-full ">
      <h2 className="font-paralucent text-center text-[20px] lg:text-3xl">
        Reset Your Password
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-4 flex flex-col gap-y-4">
          <input
            type="password"
            name="newPassword"
            required
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="text-[10px] lg:text-base px-2 md:px-4 w-full py-3 rounded-lg outline-none bg-[#EAEAEA]"
          />

          <input
            type="password"
            name="confirmNewPassword"
            required
            onChange={handleInputChange}
            pattern={userData?.newPassword}
            placeholder="Confirm your password"
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
              <span className={"text-white"}>Resetting...</span>
            </button>
          ) : (
            <button
              type="submit"
              // onClick={resetForm}
              className=" w-full flex justify-center items-center font-semibold text-sm sm:text-lg gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 lg:py-3 py-3 rounded-md"
            >
              Reset Password
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

export default ResetPassword;
