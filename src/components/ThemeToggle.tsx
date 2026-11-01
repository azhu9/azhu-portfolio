import { LuMoon, LuSun } from "react-icons/lu";
import { toggleTheme, useIsDark } from "../utils/theme";

const ThemeToggle = () => {
  const isDark = useIsDark();

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      className="relative h-8 w-14 shrink-0 rounded-full bg-line/15 ring-1 ring-line/15"
    >
      <span
        className={`absolute top-1 grid size-6 place-content-center rounded-full bg-fg text-[hsl(var(--bg))] transition-all ${
          isDark ? "left-7" : "left-1"
        }`}
      >
        {isDark ? <LuMoon size={14} /> : <LuSun size={14} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
