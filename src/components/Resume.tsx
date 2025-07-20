// import React from "react";
import { TfiDownload } from "react-icons/tfi";
import { RxOpenInNewWindow } from "react-icons/rx";

const Resume = () => {
  return (
    <div className="background flex justify-between items-center py-8 text-3xl px-10">
      <h1 className="text-3xl md:text-4xl font-semibold">Resume</h1>
      <div className="flex gap-4 text-3xl">
        <RxOpenInNewWindow className="" />
        <TfiDownload className="" />
      </div>
    </div>
  );
};

export default Resume;
