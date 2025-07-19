import React from "react";
import profileImage from "../assets/placeholder.jpg"; // Replace with actual path or import

const ProfileCard = () => {
  return (
    <div className="flex flex-col background md:flex-row rounded-3xl p-2 text-white w-full h-full hover:scale-[102%] transition-all duration-400 ease-in-out">
      <div className="w-full md:w-auto hidden md:flex justify-center items-center p-4">
        <img
          src={profileImage}
          alt="Andy Zhu"
          className="rounded-xl object-cover w-[300px] max-w-full"
        />
      </div>
      <div className="flex items-center w-full text-left p-4">
        <div>
          <h1 className="text-2xl md:text-5xl font-bold mb-2">
            Hi, I'm <span className="text-blue-600">Andy Zhu</span>
          </h1>
          <h2 className="text-lg md:text-xl mb-4">
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
