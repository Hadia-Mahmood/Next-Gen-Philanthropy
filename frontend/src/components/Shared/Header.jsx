"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStateContext } from "@/app/StateContext";
import Login from "./Login";
import SignUp from "./Signup";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import ProfileDropdown from "../Dashboard/ProfileDropdown";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaSortDown } from "react-icons/fa6";

const headerLinks = [
  {
    linkText: "Home",
    linkTo: "/",
  },
  {
    linkText: "Donate",
    linkTo: "/find-beneficiary",
  },
  {
    linkText: "Success Stories",
    linkTo: "/find-beneficiary",
  },
];

const dropDownLinks = [
  {
    linkText: "About Us",
    linkTo: "/",
  },
  {
    linkText: "Community Forum",
    linkTo: "/forum",
  },
  {
    linkText: "Contact Us",
    linkTo: "/",
  },
];

function DropdownMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" flex justify-center items-center gap-1  "
      >
        More <FaSortDown className="-mt-[6px] text-[18px] " />
      </button>
      {dropdownOpen && (
        <div className="absolute -left-4 mt-2 w-48 bg-white border border-gray-200 shadow-lg">
          {dropDownLinks.map((item, index) => (
            <div
              onClick={toggleDropdown}
              key={index}
              className="flex hover:bg-gray-100   justify-start w-full items-start flex-col"
            >
              <Link
                className={`px-4 py-2 ${
                  pathname === item.linkTo ? "text-[#32A632]" : "text-[#000]"
                }`}
                key={index}
                href={item.linkTo}
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isLoggedIn,
    setIsLoggedIn,
    setUser,
    openLoginModal,
    openSignupModal,
  } = useStateContext();
  const [openNavbar, setOpenNavbar] = useState(false);

  const handleNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      setIsLoggedIn(true);
      const decodedCookieValue = jwt.decode(token.substring(7));
      setUser(decodedCookieValue);
    }
  }, [isLoggedIn]);

  return (
    <div className="bg-[#fff] font-poppins py-3 border-b-[1px] text-[#000] block z-50  sticky top-0 left-0 right-0 backdrop-saturate-200 backdrop-blur-2xl bg-opacity-90">
      <div className="w-[95%] sm:w-[90%] mx-auto flex justify-between items-center">
        <div className="flex w-full justify-between items-center  lg:gap-16">
          <div className="lg:flex justify-start items-center gap-3  hidden ">
            <Link href="/">
              <img
                src="/shared/header__logo.png"
                alt="logo"
                className="w-[50px]"
              />
            </Link>
            <h1 className="text-[#000]">TrustAid</h1>
          </div>

          <div className="lg:hidden flex jusify-start items-center gap-3">
            <Link href="/">
              <img
                src="/shared/header__logo.png"
                alt="logo"
                className="w-[50px]"
              />
            </Link>
            <h1 className="text-[#000] text-[15px]">TrustAid</h1>
          </div>

          <div className="hidden lg:flex justify-start items-center gap-10">
            <div className="flex justify-start items-center gap-10">
              {headerLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-start items-start flex-col"
                >
                  <Link
                    className={`${
                      pathname === item.linkTo
                        ? "text-[#32A632]"
                        : "text-[#000]"
                    }`}
                    key={index}
                    href={item.linkTo}
                  >
                    {item.linkText}
                  </Link>

                  {pathname === item.linkTo && (
                    <div className="bg-[#32A632] h-[2px] rounded-full -mb-1 w-[80%]"></div>
                  )}
                </div>
              ))}
            </div>

            <DropdownMenu />
          </div>

          <div className="flex justify-between items-center gap-3 md:gap-5">
            <div className="flex justify-between items-center gap-3 md:gap-5">
              
              {isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <button
                  className="outline-none lg:text-base text-[14px] py-[5px] sm:py-2 px-3 sm:px-4  rounded-[40px] bg-[#32A632] text-[#fff]"
                  onClick={() => router.push("/login")}
                >
                  Login/Signup
                </button>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <RxHamburgerMenu
                className="lg:hidden block cursor-pointer"
                onClick={handleNavbar}
              />

              {openLoginModal && <Login />}
              {openSignupModal && <SignUp />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dawer */}
      {openNavbar && (
        <div
          className="block  basis-full overflow-hidden  lg:hidden w-[90%] mx-auto"
          style={{ height: "auto" }}
        >
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 ">
            {headerLinks.map((item) => (
              <li
                key={item.linkTo}
                onClick={handleNavbar}
                className={`text-[#000] block antialiased font-sans text-sm leading-normal  p-1  lg:transition-transform lg:hover:scale-105`}
              >
                <Link className="flex items-center" href={item.linkTo}>
                  {item.linkText}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={"/complain"}
            onClick={handleNavbar}
            className="transition duration-600 ease-in-out  text-center text-sm py-2 px-4  text-[#000] bg-[#32A632] hover:shadow-lg block w-full mb-2 rounded-[16px] capitalize shadow-none"
          >
            <span>Make a Request</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
