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
import Skills from "./Skills";

import { VscGithubAlt } from "react-icons/vsc";
import { BsMailboxFlag } from "react-icons/bs";
import { RiLinkedinFill } from "react-icons/ri";

interface LayoutProps {
  tab: TabKey;
  setTab: React.Dispatch<React.SetStateAction<TabKey>>;
  left?: number;
  sliderWidth?: number;
}

function Layout({ tab }: LayoutProps) {
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
        return <ProfileCard />;
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
      default:
        return <Block keyProp={"Tile " + key} />;
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

const Block = ({ keyProp }: { keyProp: string }) => {
  const [label, keyPart] = keyProp.split(" ");

  return (
    <div
      style={{
        backgroundColor: "rgba(20, 20, 20, 0.65)",
        backdropFilter: "blur(8px)", // Optional for soft-glass look
        border: "1px solid rgba(255, 255, 255, 0.1)", // Optional subtle border
        opacity: "0.7",
      }}
      className="h-full w-full flex flex-col justify-center items-center p-6 text-[var(--black-1)] rounded-3xl"
    >
      <span>
        <span className="normal-case">{label}</span>{" "}
        <span className="uppercase">{keyPart}</span>
      </span>
    </div>
  );
};

export default Layout;
