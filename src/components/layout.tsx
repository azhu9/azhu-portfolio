import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Responsive, type Layouts } from "react-grid-layout";
import {
  TabKey,
  breakpoints,
  cols,
  ROW_HEIGHT,
  GAP,
  tileIdsFor,
  projectTileId,
  loadLayouts,
  saveLayouts,
  clearLayouts,
  defaultLayouts,
  RESET_EVENT,
  requestLayoutReset,
  type Breakpoint,
} from "../utils/layout.helper";
import { links, projects } from "../data/content";

import ProfileCard from "./ProfileCard";
import Resume from "./Resume";
import Status from "./Status";
import IconBox from "./IconBox";
import Experience from "./Experience";
import Skills from "./Skills";
import Project from "./Project";
import Controls from "./Controls";
import Slider from "./Slider";
import GitHubTile from "./GitHubTile";
import TypingTile from "./TypingTile";

import rutgers from "../assets/rutgers.png";

import { VscGithubAlt } from "react-icons/vsc";
import { BsMailboxFlag } from "react-icons/bs";
import { RiLinkedinFill } from "react-icons/ri";

// Measures the grid container ourselves instead of using RGL's WidthProvider,
// which relies solely on ResizeObserver and can report 0 until it fires.
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return [ref, width] as const;
}

// Dragging is only enabled for mouse/trackpad users on wider screens, so
// touch users can scroll the page normally.
const DRAG_QUERY = "(pointer: fine) and (min-width: 768px)";

function useCanDrag() {
  const [canDrag, setCanDrag] = useState(() => window.matchMedia(DRAG_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(DRAG_QUERY);
    const onChange = () => setCanDrag(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return canDrag;
}

// Moves a soft accent glow along tile borders under the cursor by updating
// each tile's --mx/--my (see .tile::before in index.css).
function useCursorGlow(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const tile of root.querySelectorAll<HTMLElement>(".tile")) {
          const rect = tile.getBoundingClientRect();
          tile.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          tile.style.setProperty("--my", `${e.clientY - rect.top}px`);
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

// Tiles fade in one after another on the first load of a browser session.
const INTRO_KEY = "intro-played";

function useIntro() {
  const [intro] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_KEY);
    } catch {
      return false;
    }
  });
  const [active, setActive] = useState(intro);
  useEffect(() => {
    if (!intro) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // storage unavailable; intro may replay
    }
    const id = setTimeout(() => setActive(false), 2000);
    return () => clearTimeout(id);
  }, [intro]);
  return active;
}

const breakpointFor = (width: number): Breakpoint =>
  width >= breakpoints.lg ? "lg" : width >= breakpoints.md ? "md" : "sm";

interface LayoutProps {
  tab: TabKey;
  hue: number;
  onHueChange: (hue: number) => void;
  onOpenProject: (id: string) => void;
  onOpenTyping: () => void;
}

function Layout({ tab, hue, onHueChange, onOpenProject, onOpenTyping }: LayoutProps) {
  // Layouts are tied to the tab they were loaded for. When the tab changes they
  // are swapped during render, so the new tab's tiles never render against the
  // old tab's layout.
  const [current, setCurrent] = useState(() => ({ tab, layouts: loadLayouts(tab) }));
  let { layouts } = current;
  if (current.tab !== tab) {
    layouts = loadLayouts(tab);
    setCurrent({ tab, layouts });
  }
  const setLayouts = (next: Layouts) => setCurrent({ tab, layouts: next });
  const dragged = useRef(false);
  const canDrag = useCanDrag();
  const [containerRef, width] = useContainerWidth();
  // RGL positions tiles without transforms on its first render, so tile
  // animations stay off until it has settled to avoid a fly-in on load.
  const [animate, setAnimate] = useState(false);
  const measured = width > 0;
  const intro = useIntro();
  useCursorGlow(containerRef);

  useEffect(() => {
    if (!measured) return;
    const id = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(id);
  }, [measured]);

  const handleLayoutChange = (_: unknown, all: Layouts) => {
    if (!dragged.current) return;
    dragged.current = false;
    saveLayouts(tab, all);
    setLayouts(all);
  };

  // The Reset button and the command menu both go through this event.
  useEffect(() => {
    const onReset = () => {
      clearLayouts(tab);
      setCurrent({ tab, layouts: defaultLayouts(tab) });
    };
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, [tab]);

  // Intro stagger order follows the tiles' visual position (top to bottom).
  const introOrder = new Map(
    [...(layouts[breakpointFor(width)] ?? [])]
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((l, i) => [l.i, i])
  );

  const renderTile = (id: string) => {
    switch (id) {
      case "logo":
        return (
          <div className="tile flex items-center justify-center" title="Rutgers University">
            <img src={rutgers} alt="Rutgers University" draggable={false} className="h-10 w-auto" />
          </div>
        );
      case "controls":
        return <Controls canDrag={canDrag} onReset={requestLayoutReset} />;
      case "hue":
        return <Slider hue={hue} onHueChange={onHueChange} />;
      case "hero":
        return <ProfileCard />;
      case "resume":
        return <Resume />;
      case "status":
        return <Status />;
      case "github":
        return <IconBox icon={<VscGithubAlt />} label="GitHub" link={links.github} />;
      case "linkedin":
        return <IconBox icon={<RiLinkedinFill />} label="LinkedIn" link={links.linkedin} />;
      case "email":
        return <IconBox icon={<BsMailboxFlag />} label="Email" link={links.email} copy={links.emailAddress} />;
      case "experience":
        return <Experience />;
      case "skills":
        return <Skills />;
      case "activity":
        return <GitHubTile />;
      case "typing":
        return <TypingTile onOpen={onOpenTyping} />;
      default: {
        const project = projects.find((p) => projectTileId(p.id) === id);
        return project ? <Project {...project} onOpen={() => onOpenProject(project.id)} /> : null;
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-2 pb-16">
      <div ref={containerRef}>
        {width > 0 && (
          <Responsive
            width={width}
            className={`${canDrag ? "can-drag" : ""} ${animate ? "" : "no-anim"} ${intro ? "intro" : ""}`}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={ROW_HEIGHT}
            margin={[GAP, GAP]}
            layouts={layouts}
            isDraggable={canDrag}
            isResizable={false}
            draggableCancel="a, button, input, .no-drag"
            onDragStop={() => (dragged.current = true)}
            onLayoutChange={handleLayoutChange}
          >
            {tileIdsFor(tab).map((id) => (
              <div key={id} style={{ "--i": Math.min(introOrder.get(id) ?? 0, 16) } as React.CSSProperties}>
                {renderTile(id)}
              </div>
            ))}
          </Responsive>
        )}
      </div>
    </div>
  );
}

export default Layout;
