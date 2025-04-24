"use client";
import { useUploadImage } from "../../hooks/image-hook";
import React, { useState } from "react";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    usageSummary: "i used it in picnic",
  });

  const { mutate: addMutate } = useUploadImage(
    JSON.stringify({ ...data }) // No need to stringify file object
  );

  const handleAvatarChange = (event) => {
    console.log("handleImage");
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    
    if (!file) {
      console.log("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("usageSummary", data.usageSummary);

    console.log("Uploading", formData);

    addMutate(formData, {
      onSuccess: (response) => {
        console.log("OnSuccess", response);
      },
      onError: (error) => {
        console.log("OnError", error);
      },
    });
  };

  return (
    <div>
      <form className="w-full mt-10" onSubmit={handleImageUpload}>
        <input
          id="avatar-upload"
          name="image"
          required
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <button
          type="submit"
          className="mt-6 w-full flex justify-center items-center font-semibold text-sm gap-3 bg-[#20332c] text-white px-7 py-5 rounded-sm hover:bg-[#257830]"
        >
          Submit Proof
        </button>
      </form>
    </div>
  );
};

export default UploadImage;
