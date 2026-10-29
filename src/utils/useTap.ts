import { useRef } from "react";

// Props that make a draggable tile act like a button: a press that barely
// moved (not a drag) or Enter/Space triggers onTap. Clicks on the tile's own
// links and buttons are left alone.
export function useTap(onTap: () => void) {
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  return {
    role: "button",
    tabIndex: 0,
    onPointerDown: (e: React.PointerEvent) => {
      pressStart.current = { x: e.clientX, y: e.clientY };
    },
    onClick: (e: React.MouseEvent) => {
      const start = pressStart.current;
      const moved = start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5;
      if (moved || (e.target as HTMLElement).closest("a, button")) return;
      onTap();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      onTap();
    },
  };
}
