import React, { useState } from "react";
import { copyText } from "../utils/clipboard";

interface IconProps {
  icon: JSX.Element;
  label: string;
  link: string;
  copy?: string; // copy this text on click instead of following the link
}

const contentClass = "group flex flex-col items-center gap-1 rounded-xl p-2 text-fg";

const IconBox: React.FC<IconProps> = ({ icon, label, link, copy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copy) return;
    if (await copyText(copy)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.location.href = link;
    }
  };

  const content = (
    <>
      <span className="text-4xl transition-colors group-hover:text-accent lg:text-6xl">{icon}</span>
      <span className={`text-xs ${copied ? "font-medium text-accent" : "text-muted"}`}>
        {copied ? "Copied!" : label}
      </span>
    </>
  );

  return (
    // Only the icon itself is clickable, so the rest of the tile can still be dragged.
    <div className="tile flex items-center justify-center">
      {copy ? (
        <button onClick={handleCopy} aria-label={`Copy ${label.toLowerCase()} address`} title={copy} className={contentClass}>
          {content}
        </button>
      ) : (
        <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label} className={contentClass}>
          {content}
        </a>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </div>
  );
};

export default IconBox;
