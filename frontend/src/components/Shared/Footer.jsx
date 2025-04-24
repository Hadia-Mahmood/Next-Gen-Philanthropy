import Link from "next/link";
import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowRoundForward, IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="bg-[#111d19]  font-poppins text-white text-[15px] py-10 px-4 md:px-16">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-10 ">
        {/* Fourth Column */}
        <div className="md:col-span-2">
          <p className="mb-4">
            With transparency and accountability at its core, our platform 
            empowers donors to track their contributions in real-time and see 
            the tangible impact of their generosity. 
          </p>
          <div className="font-bold text-[#f29620]">
            <div className="flex justify-start items-center gap-3 mb-3">
              <IoMdMail className="text-[25px]" />
              <a href="mailto:recy8001@gmail.com" className="hover:underline">
                traceAid@gmail.com
              </a>
            </div>

            <div className="flex justify-start items-center gap-3">
              <FaPhoneAlt className="text-[20px]" />
              <p className="mt-1">+92 322 0217007</p>
            </div>
          </div>
          <div className="flex mt-4"></div>
        </div>

        {/* First Column */}
        <div>
          <h5 className="text-xl font-bold mb-2 sm:mb-6">Company</h5>
          <ul>
            <li className="mb-3 sm:mb-4">
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li className="mb-3 sm:mb-4">
              <Link href="/forum" className="hover:underline">
                Community Forum
              </Link>
            </li>
            <li className="mb-3 sm:mb-4">
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li className="mb-3 sm:mb-4">
              <Link href="/complain" className="hover:underline">
                Complain
              </Link>
              </li>
              <li className="mb-3 sm:mb-4">
              <a 
  href="https://sepolia.etherscan.io/address/0xfbf2811c435ccafe4a6bc28b26cb6a5660b75838" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="hover:underline"
>
  Blockchain Data
</a>
            </li>
          </ul>
        </div>

        {/* Second Column */}
        <div>
          <h5 className="text-xl font-bold mb-2 sm:mb-6">Entities</h5>
          <ul>
            <li className="mb-3 sm:mb-4">
              <a href="#" className="hover:underline">
                Donor
              </a>
            </li>
            <li className="mb-3 sm:mb-4">
              <a href="#" className="hover:underline">
                Admin
              </a>
            </li>
            <li className="mb-3 sm:mb-4">
              <a href="#" className="hover:underline">
                Beneficiary
              </a>
            </li>
            
          </ul>
        </div>

        {/* Fourth Column */}
        <div className="md:col-span-2">
          <h5 className="text-xl font-bold mb-2 sm:mb-6">TrustAid</h5>
          <p className="mb-4">
            
            Every donation is securely recorded on the blockchain, ensuring funds
            are used responsibly and as intended. Join us in building trust, 
            enhancing transparency, and making a difference with every transaction.
            Together, we can create a better future, one block at a time.







          </p>
        </div>
      </div>
      {/* Additional Footer Content */}
    </footer>
  );
};

export default Footer;