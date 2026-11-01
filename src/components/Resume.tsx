import { TfiDownload } from "react-icons/tfi";
import { RxOpenInNewWindow } from "react-icons/rx";
import { profile } from "../data/content";

const Resume = () => {
  return (
    <div className="tile flex items-center justify-between px-8">
      <h2 className="font-display text-2xl font-semibold text-fg md:text-3xl">Resume</h2>
      <div className="flex gap-4 text-2xl text-fg">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View resume"
          title="View"
          className="opacity-60 transition-opacity hover:text-accent hover:opacity-100"
        >
          <RxOpenInNewWindow />
        </a>
        <a
          href={profile.resume}
          download="Andy_Zhu_Resume.pdf"
          aria-label="Download resume"
          title="Download"
          className="opacity-60 transition-opacity hover:text-accent hover:opacity-100"
        >
          <TfiDownload />
        </a>
      </div>
    </div>
  );
};

export default Resume;
