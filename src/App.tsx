import { useState, useEffect } from "react";
import Layout from "./components/layout";
import Navbar from "./components/navbar";

export enum TabKey {
  About = "About",
  Projects = "Projects",
  Blog = "Blog",
  Contact = "Contact",
}

function App() {
  const [tab, setTab] = useState<TabKey>(TabKey.About);

  const tabOffsets: { [key in TabKey]: number } = {
    About: 0,
    Projects: 1,
    Blog: 2,
    Contact: 3,
  };

  const baseX = 520;
  const baseW = 221.5;

  const x = baseX + tabOffsets[tab];
  const w = baseW;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      setPosition({ x: e.pageX, y: e.pageY });
    };
    window.addEventListener("mousemove", moveHandler);
    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  const [hue, setHue] = useState(220);
  const primaryColor = `hsl(${hue}, 60%, 25%)`;
  const secondaryColor = `hsl(${hue}, 40%, 15%)`;

  return (
    <main className="relative w-screen h-auto -mt-8">
      <div className="absolute inset-0 bg-blue-500 z-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 30%, #0f172a 70%, #000000 100%)`,
          }}
        />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        {/* <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundColor: "#ffffff", // Tailwind's blue-500
            WebkitMaskImage: `radial-gradient(circle 1000px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 1000px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transition: "mask-image 0.1s, -webkit-mask-image 0.1s",
          }}
        /> */}
      </div>
      <Navbar tab={tab} setTab={setTab} left={x} sliderWidth={w} />
      <Layout
        tab={tab}
        setTab={setTab}
        left={x}
        sliderWidth={w}
        hue={hue}
        onHueChange={setHue}
      />
    </main>
  );
}

export default App;
