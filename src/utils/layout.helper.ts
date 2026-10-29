import type { Layout, Layouts } from "react-grid-layout";
import { projects } from "../data/content";

export enum TabKey {
  About = "About",
  Projects = "Projects",
  Contact = "Contact",
}

export type Breakpoint = "lg" | "md" | "sm";
type Size = [w: number, h: number];

export const breakpoints: Record<Breakpoint, number> = { lg: 1200, md: 768, sm: 0 };
export const cols: Record<Breakpoint, number> = { lg: 6, md: 4, sm: 2 };
export const ROW_HEIGHT = 80;
export const GAP = 16;

// Default tile sizes in grid units (columns x rows) for each breakpoint.
const sizes: Record<string, Record<Breakpoint, Size>> = {
  logo: { lg: [1, 1], md: [1, 1], sm: [1, 1] },
  controls: { lg: [2, 1], md: [1, 1], sm: [1, 1] },
  hue: { lg: [3, 1], md: [2, 1], sm: [2, 1] },
  hero: { lg: [4, 4], md: [4, 4], sm: [2, 6] },
  resume: { lg: [2, 1], md: [2, 1], sm: [2, 1] },
  status: { lg: [2, 3], md: [2, 3], sm: [2, 3] },
  github: { lg: [1, 2], md: [1, 1], sm: [1, 1] },
  linkedin: { lg: [1, 2], md: [1, 1], sm: [1, 1] },
  email: { lg: [1, 2], md: [2, 1], sm: [2, 1] },
  experience: { lg: [3, 12], md: [2, 10], sm: [2, 12] },
  skills: { lg: [3, 5], md: [2, 5], sm: [2, 5] },
  activity: { lg: [3, 3], md: [2, 3], sm: [2, 4] },
  typing: { lg: [3, 2], md: [2, 2], sm: [2, 2] },
  project: { lg: [2, 5], md: [2, 5], sm: [2, 5] },
};

export const projectTileId = (id: string) => `project:${id}`;
const projectTiles = projects.map((p) => projectTileId(p.id));
const featuredTiles = projects.filter((p) => p.featured).map((p) => projectTileId(p.id));

type Override = Partial<Record<Breakpoint, Size>>;
type TileOrder = (string | [string, Override])[];

// Order tiles are packed in for each tab, with optional per-tab size overrides.
const tabOrders: Record<TabKey, TileOrder> = {
  [TabKey.About]: [
    "logo", "controls", "hue",
    "hero", "resume", "status",
    "github", "linkedin", "email",
    "experience", "skills", "activity", "typing",
    ...featuredTiles,
  ],
  [TabKey.Projects]: [
    "logo", "controls", "hue",
    ...projectTiles,
    "experience", "skills", "activity", "typing",
    "github", "linkedin", "email",
    "hero", "resume", "status",
  ],
  [TabKey.Contact]: [
    "logo", "controls", "hue",
    ["github", { lg: [2, 2] }],
    ["linkedin", { lg: [2, 2] }],
    ["email", { lg: [2, 2] }],
    ["status", { lg: [3, 3] }],
    ["resume", { lg: [3, 1] }],
    "experience",
    "skills",
    "activity",
    "typing",
    ["hero", { lg: [6, 4] }],
    ...featuredTiles,
  ],
};

// Tiles shown on each tab (the Projects tab shows every project, the others
// only featured ones).
export const tileIdsFor = (tab: TabKey) =>
  tabOrders[tab].map((t) => (typeof t === "string" ? t : t[0]));

const sizeFor = (id: string, bp: Breakpoint, override?: Override): Size =>
  override?.[bp] ?? sizes[id.startsWith("project:") ? "project" : id][bp];

// Skyline packing: each tile goes to the highest spot it fits, leftmost on ties.
function pack(order: TileOrder, bp: Breakpoint): Layout[] {
  const heights = new Array(cols[bp]).fill(0);
  return order.map((entry) => {
    const [id, override] = typeof entry === "string" ? [entry] : entry;
    const [w, h] = sizeFor(id, bp, override);
    let bestX = 0;
    let bestY = Infinity;
    for (let x = 0; x + w <= cols[bp]; x++) {
      const y = Math.max(...heights.slice(x, x + w));
      if (y < bestY) {
        bestX = x;
        bestY = y;
      }
    }
    for (let x = bestX; x < bestX + w; x++) heights[x] = bestY + h;
    return { i: id, x: bestX, y: bestY, w, h };
  });
}

export const defaultLayouts = (tab: TabKey): Layouts => ({
  lg: pack(tabOrders[tab], "lg"),
  md: pack(tabOrders[tab], "md"),
  sm: pack(tabOrders[tab], "sm"),
});

// Saved layouts persist in localStorage, one set per tab.
const STORAGE_KEY = "azhu-layouts-v2";

type SavedLayouts = Partial<Record<TabKey, Layouts>>;

function readSaved(): SavedLayouts {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeSaved(saved: SavedLayouts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // storage unavailable; layouts just won't persist
  }
}

// A saved layout is only reused if it has exactly the current tiles at their
// current sizes, so adding a project or resizing a tile falls back to the
// generated layout.
function isValid(tab: TabKey, layouts: Layouts | undefined): layouts is Layouts {
  if (!layouts) return false;
  const defaults = defaultLayouts(tab);
  const signature = (layout: Layout[]) =>
    layout.map((l) => `${l.i}:${l.w}x${l.h}`).sort().join();
  return (Object.keys(cols) as Breakpoint[]).every(
    (bp) => !!layouts[bp] && signature(layouts[bp]) === signature(defaults[bp])
  );
}

export function loadLayouts(tab: TabKey): Layouts {
  const saved = readSaved()[tab];
  return isValid(tab, saved) ? saved : defaultLayouts(tab);
}

export function saveLayouts(tab: TabKey, layouts: Layouts) {
  writeSaved({ ...readSaved(), [tab]: layouts });
}

// Lets other UI (e.g. the command menu) reset the current tab's layout.
export const RESET_EVENT = "portfolio:reset-layout";
export const requestLayoutReset = () => window.dispatchEvent(new Event(RESET_EVENT));

export function clearLayouts(tab: TabKey) {
  const saved = readSaved();
  delete saved[tab];
  writeSaved(saved);
}
