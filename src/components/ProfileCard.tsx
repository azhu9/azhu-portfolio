// import React from "react";
import profileImage from "../assets/intro-pic.jpg"; // Replace with actual path or import

interface ProfileProps {
  hue: number;
}

const ProfileCard: React.FC<ProfileProps> = ({ hue }) => {
  const primaryColor = `hsl(${hue}, 90%, 50%)`;

  return (
    <div className="flex flex-col background md:flex-row rounded-3xl p-2 text-white w-full h-full">
      <div className="w-full md:w-auto hidden md:flex justify-center items-center p-4">
        <img
          src={profileImage}
          alt="Andy Zhu"
          className="rounded-xl object-cover lg:w-[375px] md:w-[300px] max-w-full"
        />
      </div>
      <div className="flex w-full text-left p-4 h-full">
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
            Hi, I'm <span style={{ color: `${primaryColor}` }}>Andy Zhu</span>
          </h1>
          <h2 className="text-lg md:text-xl mb-4 text-white ">
            Currently studying{" "}
            <span className="text-red-400">@ Rutgers University</span>
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Pursuing a BS in Computer Science, with a minor in Mathematics.
            Interested in Frontend Development and Software Engineering.
            Passionate about Robotics, Piano, and Technology News. Also an
            enthusiast in interface/web design and 3D modeling. Currently
            seeking Summer 2026 internships!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
