"use client";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Select = ({ options, onChange, value, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className=" relative w-full">
      <p className="font-semibold text-sm text-[#202725] mb-1">{label}</p>
      <div className="">
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border-2 border-[#d9e4df] text-sm  p-4  font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value ? (
            <span className="text-[#3b3f3d]">{value}</span>
          ) : (
            <span className="text-[#6c7571]">{placeholder}</span>
          )}
          {isOpen ? (
            <IoIosArrowUp className="text-[22px] text-[#8f9b95] m-0" />
          ) : (
            <IoIosArrowDown className="text-[22px] text-[#8f9b95] m-0" />
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

export default Select;
