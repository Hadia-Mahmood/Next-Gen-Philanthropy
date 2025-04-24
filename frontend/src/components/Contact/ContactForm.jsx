"use client";
import React, { useState } from "react";
import Input from "../CC/Input";
import emailjs from "@emailjs/browser";
import TextArea from "../CC/TextArea";
import { IoIosArrowRoundForward } from "react-icons/io";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: process.env.NEXT_PUBLIC_EMAIL_NAME,
          from_email: form.email,
          to_email: process.env.NEXT_PUBLIC_EMAIL_TO,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          toast.success(
            "Thanks for contacting. We will get back to you as soon as possible."
          );

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          toast.error("Looks like something went wrong. Please try again.");
        }
      );
  };

  return (
    <div
      style={{
        boxShadow: "0px 5px 43px 0px rgba(17, 29, 25, 0.12)",
      }}
      className="w-full md:w-[80%] lg:w-[70%] py-10 px-5 sm:p-10 font-poppins"
    >
      <h1 className="font-bold text-2xl">
        Get In Touch !!
      </h1>
      <p className="text-sm mt-3 leading-6 text-[#ffa500]">
        Contact Us And We Will Respond Within The Next Two Working Days.
      </p>
      <form className="w-full mt-10 " onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            onChange={handleChange}
            label="Name"
            type="text"
            placeholder="Please write your name"
            require={true}
            name="name"
          />

          <Input
            onChange={handleChange}
            label="Email"
            type="email"
            placeholder="Please write your email"
            require={true}
            name="email"
          />
        </div>
        <TextArea
          onChange={handleChange}
          placeholder="Enter your text here..."
          rows={6}
          label="Your Query"
          require={true}
          name="message"
        />

        <button
          type="submit"
          className="mt-6 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] transition duration-500 ease-in-out hover:bg-[#257830] text-[#fff] hover:text-[#fff] outline-none border-0 px-7 py-5 rounded-md sm:rounded-sm"
        >
          {loading ? "Submitting ..." : "Submit Request"}
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
  );
};

export default ContactForm;
