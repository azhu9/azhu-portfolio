// import React from 'react'

const xpData = [
  {
    date: "9/23 - Present",
    company: "Rutgers VEXU",
    title: "President / Software Engineering Lead",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos tenetur qui nisi eveniet iusto impedit nemo ullam explicabo, minus atque dolore velit sint esse labore! Natus blanditiis maxime sed officia incidunt recusandae aut esse! Voluptas, recusandae officia. Nam exercitationem omnis dolore excepturi architecto facilis delectus rem officiis deleniti odit. Sunt.",
  },
  {
    date: "4/25 - Present",
    company: "Rutgers IEEE",
    title: "Webmaster - Frontend Engineer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos tenetur qui nisi eveniet iusto impedit nemo ullam explicabo, minus atque dolore velit sint esse labore! Natus blanditiis maxime sed officia incidunt recusandae aut esse! Voluptas, recusandae officia. Nam exercitationem omnis dolore excepturi architecto facilis delectus rem officiis deleniti odit. Sunt.",
  },
  {
    date: "6/24 - 8/24",
    company: "Innovation Foundry",
    title: "Technology Instructor",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos tenetur qui nisi eveniet iusto impedit nemo ullam explicabo, minus atque dolore velit sint esse labore! Natus blanditiis maxime sed officia incidunt recusandae aut esse! Voluptas, recusandae officia. Nam exercitationem omnis dolore excepturi architecto facilis delectus rem officiis deleniti odit. Sunt.",
  },
  {
    date: "6/22 - 8/22",
    company: "All Star Code",
    title: "Summer Scholar: Cohort Representative",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos tenetur qui nisi eveniet iusto impedit nemo ullam explicabo, minus atque dolore velit sint esse labore! Natus blanditiis maxime sed officia incidunt recusandae aut esse! Voluptas, recusandae officia. Nam exercitationem omnis dolore excepturi architecto facilis delectus rem officiis deleniti odit. Sunt.",
  },
];

const Experience = () => {
  return (
    <div className="flex flex-col border background bg-black/50">
      <div className="p-8 font-bold">
        <p className="dark:text-gray-400 text-gray-600 text-sm font-light mb-2 tracking-wide">
          Where have I worked?
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white text-black mb-4">
          My Experience
        </h1>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        <ol className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 px-8">
          {xpData.map((xp, index) => (
            <li key={index} className="relative -ms-1.5 flex items-start gap-4">
              <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

              <div className="-mt-2">
                <time className="text-xs/none font-medium dark:text-gray-400 text-gray-600">
                  {xp.date}
                </time>
                <h3 className="text-base font-semibold dark:text-white text-black">
                  {xp.company}
                </h3>
                <h3 className="text-xl font-bold dark:text-white text-black">
                  {xp.title}
                </h3>

                <p className="mt-2 text-sm dark:text-white text-black">
                  {xp.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Experience;
