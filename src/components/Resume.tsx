// import React from "react";
import { TfiDownload } from "react-icons/tfi";
import { RxOpenInNewWindow } from "react-icons/rx";

const Resume = () => {
  return (
    <div className="background flex justify-between items-center py-8 text-3xl px-10">
      <h1 className="text-3xl md:text-4xl font-semibold dark:text-white text-black">
        Resume
      </h1>
      <div className="flex gap-4 text-3xl dark:text-white text-black">
        <a
          href="/public/assets/Andy_Zhu_Resume_2025.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Resume"
          className="hover:opacity-100 opacity-60 duration-400"
        >
          <RxOpenInNewWindow />
        </a>
        <a
          href="/public/assets/Andy_Zhu_Resume_2025.pdf"
          download="Andy_Zhu_Resume_2025.pdf"
          aria-label="Download Resume"
          className="hover:opacity-100 opacity-60 duration-400"
        >
          <TfiDownload />
        </a>
      </div>
    </div>
  );
};

export default Resume;
