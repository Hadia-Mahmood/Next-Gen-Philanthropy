"use client";
import { useUserSignup } from "../../hooks/auth-hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// slider
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { signupSliderImages } from "@/app/data";
import Link from "next/link";
import { FaUpload } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { ethers } from "ethers";

const SignUp = () => {
  const allowedSubDivision = {
    south: ["garden", "liyari", "saddar", "aram bagh", "civil line"],
    east: [
      "gulzar e hijri",
      "jamshed quarters",
      "ferozabad",
      "gulshan e iqbal",
    ],
    west: ["orangi", "mangopir", "mominabad"],
    korangi: ["korangi", "landhi", "model colony", "shah faisal"],
    malir: ["airport", "gadap", "ibrahim hyderi", "murad memon", "shah mureed"],
    central: [
      "gulberg",
      "liaquatabad",
      "new karachi",
      "nazimabad",
      "north nazimabad",
    ],
    keamari: ["baldia", "site", "harbour", "mauripur"],
  };

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const districtOptions = ["malir", "DistrictB", "DistrictC"];
  const subDivisionOptions = ["airport", "DivisionB", "DivisionC"];
  const [avatar, setAvatar] = useState(null);
  const [nicPreview, setNicPreview] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("");
 
  const [userData, setUserData] = useState({
    
    name: "",
    email: "",
    password: "",
    role: "",
    district: "",
    subDivison: "",
    area: "",
    avatar: "",
    cnic: "",
    address: "",
  });

  const { mutate: addMutate } = useUserSignup(
    JSON.stringify({ ...userData, ethAddress: defaultAccount })
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
    console.log("handleInput");
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const subDivisions = allowedSubDivision[userData.district];

  const handleSubmit = async (event) => {
    console.log(userData);
    event.preventDefault();
    setIsLoading(true);
    addMutate(
      {},
      {
        onSuccess: (response) => {
          toast.success(response?.data?.message);
          router.push("/login");
          setIsLoading(false);
        },
        onError: (response) => {
          toast.error(response.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleAvatarChange = (event) => {
    console.log("handleAvatar");
    const { name, value } = event.target;
    if (name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        console.log("handleAvatar22");
        if (reader.readyState === 2) {
          setUserData({ ...userData, [name]: reader.result });
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleAddressChange2 = async (event) => {
    const { name, value } = event.target;
    if (name === "avatara") {
      const reader = new FileReader();

      reader.onload = () => {
        console.log("handleAvatar222");
        if (reader.readyState === 2) {
          setUserData({ ...userData, [name]: reader.result });
          setNicPreview(reader.result);
        }
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
  };

  const removeNICAvatar = () => {
    setNicPreview(null);
  };

  // =========================
  // Matamask wallet connection
  // =========================
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
    <div className=" flex items-center justify-center w-full font-poppins ">
      <div className="w-full  bg-[#D0F0C0] flex rounded-[15px] sm:rounded-[20px] flex-col lg:flex-row ">
        <div className="lg:w-[45%] sm:p-unset  lg:flex hidden items-center justify-center rounded-[15px] sm:rounded-[20px] w-full mx-auto relative ">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            slidesPerView={1}
            spaceBetween={1}
            slidesPerGroup={1}
            autoplay={true}
            pagination={true}
            slideActiveClass="activeSlide"
            className="hero__caurosel w-[70%]  sm:w-[80%] mx-auto lg:w-[70%]"
          >
            {signupSliderImages.map((slide, index) => (
              <SwiperSlide key={index} className="z-10">
                <div className="h-[200px] rounded-2xl mx-auto w-full lg:h-[420px] relative">
                  <img
                    src={slide.image}
                    alt="logo"
                    className="w-full h-full rounded-2xl"
                  />
                </div>
                <div className="h-7 sm:h-10"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="lg:w-[55%] border-solid  bg-white sm:px-6 px-4 rounded-[15px] sm:rounded-[20px] pt-5 pb-5 w-full">
          <p className="text-[#32A632] font-satisfy text-[12px] sm:text-[16px] lg:text-xl ">
            Welcome
          </p>
          <h2 className="font-extrabold font-paralucent text-[20px]  lg:text-3xl">
            Sign up with Us
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="my-3">
              {avatar ? (
                <div className="">
                  <div className="w-24 h-24 mx-auto relative">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="rounded-full w-full h-full  "
                    />
                    <button
                      onClick={removeAvatar}
                      className="absolute  top-0 right-0 p-[5px] bg-gray-200 rounded-full"
                    >
                      <RxCross1 className="text-[#000] text-[14px] " />
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="w-full h-32 bg-gray-200 rounded-md flex flex-col items-center  justify-center text-gray-700">
                    <FaUpload className="text-2xl" />
                    <p>Upload your image</p>
                    <p className="text-xs mt-2">
                      Click to browse your image here
                    </p>
                  </div>
                </label>
              )}
              <input
                id="avatar-upload"
                required
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="col-span-2 mb-4">
              <div
                className="text-[10px]  py-3 lg:text-base cursor-pointer px-2 md:px-4 text-center w-full rounded-lg  bg-[#EAEAEA]"
                onClick={connectwalletHandler}
              >
                {/* {defaultAccount
                  ? "Address: " + defaultAccount
                  : " Connect your wallet"} */}
                  {defaultAccount ? defaultAccount : " Connect your wallet"}
              </div>
            </div>

            <div className="sm:grid flex flex-col sm:grid-cols-2 gap-4 ">
              <input
                type="text"
                placeholder="Enter Your name"
                name="name"
                required
                onChange={handleInputChange}
                className="text-[10px] py-3 lg:text-base px-2 md:px-4 w-full outline-none  rounded-lg bg-[#EAEAEA]"
              />
              <input
                type="email"
                placeholder="Enter Your Email Address"
                name="email"
                required
                onChange={handleInputChange}
                className="text-[10px] py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA]"
              />
              <input
                type="password"
                placeholder="Enter Your Password"
                name="password"
                required
                onChange={handleInputChange}
                className="text-[10px] py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA]"
              />

              <input
                type="text"
                placeholder="area"
                name="area"
                required
                onChange={handleInputChange}
                className="text-[10px] py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA]"
              />

              <div>
                <select
                  id="district-select"
                  name="district"
                  required
                  value={userData.district}
                  onChange={handleSelectChange}
                  className="text-[10px] col-span-2 py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA]"
                >
                  <option value="">Select District</option>
                  {Object.keys(allowedSubDivision).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  id="subDivision-select"
                  required
                  name="subDivison"
                  value={userData.subDivison}
                  onChange={handleSelectChange}
                  className="text-[10px] col-span-2 py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA]"
                  disabled={!userData.district}
                >
                  <option value="">Select SubDivision</option>
                  {subDivisions &&
                    subDivisions.map((subDivision, index) => (
                      <option key={index} value={subDivision}>
                        {subDivision}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* <div className="my-3">
              {nicPreview ? (
                <div className="">
                  <div className="w-full sm:w-[300px] h-32 mx-auto relative">
                    <img
                      src={nicPreview}
                      alt="Avatar"
                      className="rounded-sm w-full h-full  "
                    />
                    <button
                      onClick={removeNICAvatar}
                      className="absolute  top-0 right-0 p-[5px] bg-gray-200 rounded-full"
                    >
                      <RxCross1 className="text-[#000] text-[14px] " />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label htmlFor="address-upload" className="cursor-pointer">
                    <div className="w-full h-32 bg-gray-200 rounded-md flex flex-col items-center  justify-center text-gray-700">
                      <FaUpload className="text-2xl" />
                      <p className="text-center sm:text-base text-[14px]">
                        Upload your Cnic For Address Verification
                      </p>
                      <p className="text-xs mt-2">
                        Click to browse your image here
                      </p>
                    </div>
                  </label>

                  <input
                    id="address-upload"
                    required
                    name="avatara"
                    type="file"
                    accept="image/*"
                    onChange={handleAddressChange2}
                    className="hidden"
                  />
                </>
              )}
            </div> */}
             
              <div className="col-span-2 mb-4">
              
                <input
                type="text"
                placeholder="CNIC number"
                name="cnic"
                required
                onChange={handleInputChange}
                className="text-[10px] py-3 lg:text-base px-2 md:px-4 w-full outline-none rounded-lg  bg-[#EAEAEA] mt-2"
              />
              
            </div>

            <div>
              <select
                 name="role"
                 required
                 onChange={handleInputChange}
                 className="mt-2 py-3 px-2 md:px-4 w-full outline-none rounded-lg bg-[#EAEAEA]"
              >
                      <option value="" disabled selected>
                          Select Role
                      </option>
                      <option value="donor">Donor</option>
                      <option value="beneficiary">Beneficiary</option>
              </select>
            </div>

            <div className="grid place-items-center mt-3">
              {isLoading ? (
                <button
                  type="submit"
                  className="mt-6 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] transition duration-500 ease-in-out outline-none border-0 px-7 py-5 rounded-sm"
                  disabled
                >
                  <FaSpinner className="animate-spin mr-2 text-white" />
                  <span className={"text-white"}>Loading...</span>
                </button>
              ) : (
                <button
                  type="submit"
                  // onClick={resetForm}
                  className="lg:mt-6 mt-2 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 lg:py-5 py-3 rounded-md"
                >
                  Sign Up
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

          <p className="text-center my-2 font-semibold  text-[10px] lg:text-sm">
            Already With Us?
            <Link
              href="/login"
              className="text-[#32A632] ml-1 underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

const Select = ({ options, onChange, value, name, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Wrapper function to integrate with Formik
  const handleSelect = (option) => {
    const changeEvent = {
      target: {
        name: name,
        value: option,
      },
    };
    onChange(changeEvent);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="">
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-xl bg-[#D4D4D433] text-sm p-3 font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value ? (
            <span className="text-[#000]">{value}</span>
          ) : (
            <span className={` ${error ? "text-[#ffb8b8]" : "text-[#9ca3af]"}`}>
              {placeholder}
            </span>
          )}
          {isOpen ? (
            <IoIosArrowUp className="text-[22px] text-[#9ca3af] m-0" />
          ) : (
            <IoIosArrowDown className="text-[22px] text-[#9ca3af] m-0" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                className="block w-full text-left px-4 py-2 text-sm text-[#6c7571] hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
