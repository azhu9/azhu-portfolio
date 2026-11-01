import { LuRotateCcw } from "react-icons/lu";
import ThemeToggle from "./ThemeToggle";

interface ControlsProps {
  canDrag: boolean;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ canDrag, onReset }) => {
  return (
    <div className="tile flex items-center justify-center gap-4 px-4">
      <ThemeToggle />
      {canDrag && (
        <button
          onClick={onReset}
          title="Tiles are draggable — click to reset this tab's layout"
          aria-label="Reset layout"
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-muted transition-colors hover:text-accent"
        >
          <LuRotateCcw />
          <span className="hidden lg:inline">Reset layout</span>
        </button>
      )}
    </div>
  );
};

export default Controls;
