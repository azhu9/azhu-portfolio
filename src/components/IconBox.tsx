import React from "react";

interface IconProps {
  icon: JSX.Element;
  link: string;
}

const IconBox: React.FC<IconProps> = ({ icon, link }) => {
  return (
    <a
      target="_blank"
      href={link}
      className="text-7xl background flex items-center justify-center"
    >
      <div>{icon}</div>
    </a>
  );
};

export default IconBox;
