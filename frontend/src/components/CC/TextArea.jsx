import React from "react";

const TextArea = ({ name, value, onChange, placeholder, label, rows }) => {
  return (
    <div className="mt-5">
      <p className="font-semibold text-sm text-[#202725] mb-1">{label}</p>
      <textarea
        className="w-full resize-none text-sm p-4 outline-none rounded-md border-2 border-[#d9e4df]"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
      />
    </div>
  );
};

export default TextArea;

