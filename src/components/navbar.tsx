import { useLayoutEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { TabKey } from "../utils/layout.helper";

export interface NavbarProps {
  tab: TabKey;
  setTab: React.Dispatch<React.SetStateAction<TabKey>>;
  onOpenMenu: () => void;
}

const tabs = Object.values(TabKey);
const shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

const Navbar: React.FC<NavbarProps> = ({ tab, setTab, onOpenMenu }) => {
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const update = () => {
      const active = tabRefs.current[tabs.indexOf(tab)];
      if (active) setSliderStyle({ left: active.offsetLeft, width: active.offsetWidth });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [tab]);

  return (
    <nav className="sticky top-4 z-50 mx-auto mb-8 mt-8 w-full max-w-[540px] px-4">
      <div className="tile relative flex items-center p-1.5 shadow-lg">
        <div
          className="absolute h-[calc(100%-12px)] rounded-[1.1rem] bg-accent/20 ring-1 ring-accent/30"
          style={{
            left: sliderStyle.left,
            width: sliderStyle.width,
            transition: "left 0.38s cubic-bezier(0.4, 0, 0.2, 1), width 0.38s",
          }}
        />
        {tabs.map((key, index) => (
          <button
            key={key}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => setTab(key)}
            aria-current={tab === key ? "page" : undefined}
            className={`relative z-10 h-10 flex-1 rounded-[1.1rem] text-lg transition-colors ${
              tab === key ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {key}
          </button>
        ))}
        <button
          onClick={onOpenMenu}
          aria-label="Open command menu"
          title={`Search (${shortcut})`}
          className="relative z-10 ml-1 flex h-10 shrink-0 items-center gap-2 rounded-[1.1rem] px-3 text-muted transition-colors hover:bg-line/10 hover:text-fg"
        >
          <LuSearch className="text-lg" />
          <kbd className="hidden rounded-md bg-line/10 px-1.5 py-0.5 font-sans text-xs sm:block">{shortcut}</kbd>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
