// import React from 'react'

interface ProjectProps {
  image: JSX.Element;
  title: string;
  description: string;
  liveLink?: string;
  github: string;
}

const Project: React.FC<ProjectProps> = ({
  image,
  title,
  description,
  liveLink,
  github,
}) => {
  return (
    <div className="background p-4 relative">
      <div className="">{image}</div>
      <h1 className="mt-4 font-semibold text-2xl">{title}</h1>
      <div className="mt-2">
        <a className="text-base text-gray-300">{description}</a>
      </div>
      <div className="absolute bottom-6 left-4 text-sm gap-4 w-full">
        <a
          className="bg-black py-2 px-6 my-4 mr-4 rounded-lg"
          href={github}
          target="_blank"
        >
          Github
        </a>
        <a
          className="bg-black py-2 px-6 my-4 mr-4 rounded-lg"
          href={liveLink}
          target="_blank"
        >
          Live Link
        </a>
      </div>
    </div>
  );
};

export default Project;
