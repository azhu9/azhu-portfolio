import { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { TabKey } from "../App";
import {
  ContactLayouts,
  AboutLayout,
  ProjectsLayouts,
  keys,
} from "../utils/layout.helper";

import ProfileCard from "./ProfileCard";
import Resume from "./Resume";
import Map from "./Map";
import IconBox from "./IconBox";
import Experience from "./Experience";
import Skills from "./Skills";
import Project from "./Project";
import ThemeToggle from "./ThemeToggle";
import Slider from "./Slider";

import vex from "../assets/vexbots.webp";
import rieee from "../assets/rieeeSS.png";
import scar from "../assets/scarSS.png";
import rutgers from "../assets/rutgers.png";
import portfolio from "../assets/portfolio.png";
import ruopen from "../assets/ruopen.png";
import belt from "../assets/beltcalc.png";

import { VscGithubAlt } from "react-icons/vsc";
import { BsMailboxFlag } from "react-icons/bs";
import { RiLinkedinFill } from "react-icons/ri";

interface LayoutProps {
  tab: TabKey;
  setTab: React.Dispatch<React.SetStateAction<TabKey>>;
  left?: number;
  sliderWidth?: number;
  hue: number;
  onHueChange: (hue: number) => void;
}

function Layout({ tab, hue, onHueChange }: LayoutProps) {
  const [currentlayout, setCurrentLayout] = useState(AboutLayout);

  useEffect(() => {
    switch (tab) {
      case TabKey.Projects:
        setCurrentLayout(ProjectsLayouts);
        break;
      case TabKey.About:
        setCurrentLayout(AboutLayout);
        break;
      case TabKey.Contact:
        setCurrentLayout(ContactLayouts);
        break;
      default:
        setCurrentLayout(AboutLayout);
    }
  }, [tab]);

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const renderTileContent = (key: string) => {
    switch (key) {
      case "a":
        return <ProfileCard hue={hue} />;
      case "b":
        return <Resume />;
      case "c":
        return <Map />;
      case "d":
        return (
          <IconBox icon={<VscGithubAlt />} link="https://github.com/azhu9" />
        );
      case "e":
        return (
          <IconBox icon={<BsMailboxFlag />} link="mailto:azhu625@gmail.com" />
        );
      case "f":
        return (
          <IconBox
            icon={<RiLinkedinFill />}
            link="https://www.linkedin.com/in/azhu0/"
          />
        );
      case "g":
        return <Skills />;
      case "h":
        return <Experience />;
      case "i":
        return (
          <Project
            image={
              <img
                src={rieee}
                className=" h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="Rutgers IEEE Website"
            description="As the Webmaster of Rutgers IEEE, I created a new club website using ReactJS and TailwindCSS front end. Utilized UI components from flowbite-react and Meraki UI, and implemented lazy loading techniques to optimize image loading."
            liveLink="https://rieee.vercel.app/"
            github="https://github.com/azhu9/rieee"
          />
        );
      case "j":
        return (
          <Project
            image={
              <img
                src={scar}
                className="h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="Rutgers VEXU Website"
            description="Built a new static website for Rutgers VEXU Robotics club using ReactJS and TailwindCSS used to display team history and sponsors. Updated with statistics of matches played and awards won at each competition."
            liveLink="https://www.scarrobotics.com/"
            github="https://github.com/azhu9/VEX-SCAR-Website"
          />
        );
      case "l":
        return (
          <Project
            image={
              <img
                src={vex}
                className="h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="Rutgers VEXU Programming Library"
            description="A Programming Library written in C++ for the VEXU Robotics Competition. This library includes driver control of robot movement and controller macros. Additionally it contains autonomous algorithms including PID and an Odometry feedback loop."
            liveLink="link"
            github="https://github.com/azhu9/VEX25-SCAR-24in"
          />
        );
      case "k":
        return (
          <Project
            image={
              <img
                src={portfolio}
                className=" h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="Andy Zhu Portfolio Website"
            description="A portfolio website built to display projects and experience. Made using React, TypeScript, TailwindCSS and react-grid-layout. Made to be responsive across all platforms."
            liveLink="https://www.azhu.dev/"
            github="https://github.com/azhu9/azhu-portfolio"
          />
        );
      case "m":
        return (
          <Project
            image={
              <img
                src={ruopen}
                className=" h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="RU Open"
            description="A Full Stack Application that allows Rutgers Students to find out if a given classroom has a class. Made with NextJS, Tailwind, and Supabase. Data pulled using a Python Webscraper on Rutgers Class Directories."
            liveLink="https://ruopen.vercel.app/"
            github="https://github.com/azhu9/ruopen"
          />
        );
      case "n":
        return (
          <Project
            image={
              <img
                src={belt}
                className=" h-64 md:h-72 lg:h-80 w-full object-cover rounded-2xl"
              />
            }
            title="Timing Belt Calculator"
            description="A simple tool used to calculate tolerances and sizes for HTD 9mm, 15mm, and GT2 9mm type timing belts. Actively used by VEXU Team SCAR in our robot design process. Made with React and ShadCN"
            liveLink="https://belt-calculator.vercel.app/"
            github="https://github.com/azhu9/vex-belt-wizard"
          />
        );
      case "x":
        return <Block />;
      case "y":
        return <ThemeToggle />;
      case "z":
        return <Slider hue={hue} onHueChange={onHueChange} />;
      default:
        return <Block />;
    }
  };

  return (
    <div className="w-auto max-w-[1280px] mx-auto flex justify-between b-10">
      <ResponsiveReactGridLayout
        className="m-auto w-full"
        breakpoints={{ xl: 1920, lg: 1200, md: 768, sm: 480, xs: 200 }}
        cols={{ xl: 6, lg: 6, md: 4, sm: 2, xs: 2 }}
        rowHeight={188}
        layouts={currentlayout}
      >
        {keys.map((key) => (
          <div
            key={key}
            className="flex justify-center items-center shadow-[inset_0_0_0_2px_rgba(0,0,0,0)] rounded-3.5xl text-2xl text-[#FFFFFF] visible cursor-grab active:cursor-grabbing fade-in"
          >
            {renderTileContent(key)}
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

const Block = ({}) => {
  return (
    <div className="background flex items-center justify-center">
      <img src={rutgers} className="h-auto max-w-8" />
    </div>
  );
};

export default Layout;
