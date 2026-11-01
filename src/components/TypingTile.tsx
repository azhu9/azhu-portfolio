import { LuArrowRight, LuKeyboard } from "react-icons/lu";
import { profile } from "../data/content";
import { readBest } from "./TypingTest";
import { useTap } from "../utils/useTap";

// Small preview tile; tapping it opens the full typing test.
const TypingTile = ({ onOpen }: { onOpen: () => void }) => {
  const tap = useTap(onOpen);
  const visitorBest = readBest();

  return (
    <div {...tap} aria-label="Open typing test" className="project-card tile group flex items-center gap-5 px-6">
      <div className="shrink-0 text-center">
        <p className="font-display text-5xl font-bold leading-none text-accent">{profile.typingWpm}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted">wpm</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
          <LuKeyboard /> Typing test
        </p>
        <p className="mt-1 font-medium leading-snug text-fg">Here's my highest WPM. See if you can beat it.</p>
        {visitorBest > 0 && <p className="mt-1 text-xs text-muted">Your best: {visitorBest} wpm</p>}
      </div>
      <LuArrowRight className="hidden shrink-0 text-xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent sm:block" />
    </div>
  );
};

export default TypingTile;
