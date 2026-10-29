import { useCallback, useEffect, useState } from "react";
import Layout from "./components/layout";
import Navbar from "./components/navbar";
import ProjectModal from "./components/ProjectModal";
import CommandMenu from "./components/CommandMenu";
import Modal from "./components/Modal";
import TypingTest from "./components/TypingTest";
import { TabKey } from "./utils/layout.helper";
import { profile, projects } from "./data/content";

const DEFAULT_HUE = 210;

function readHue() {
  try {
    const raw = localStorage.getItem("hue");
    const stored = Number(raw);
    return raw !== null && stored >= 0 && stored < 360 ? stored : DEFAULT_HUE;
  } catch {
    return DEFAULT_HUE;
  }
}

function App() {
  const [tab, setTab] = useState<TabKey>(TabKey.About);
  const [hue, setHue] = useState(readHue);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typingOpen, setTypingOpen] = useState(false);
  const openProject = projects.find((p) => p.id === openProjectId);
  const closeProject = useCallback(() => setOpenProjectId(null), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openTyping = useCallback(() => setTypingOpen(true), []);
  const closeTyping = useCallback(() => setTypingOpen(false), []);

  // Ctrl+K / Cmd+K toggles the command menu from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenProjectId(null);
        setTypingOpen(false);
        setMenuOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The hue drives every accent color via the --hue CSS variable.
  useEffect(() => {
    document.documentElement.style.setProperty("--hue", String(hue));
    try {
      localStorage.setItem("hue", String(hue));
    } catch {
      // storage unavailable
    }
  }, [hue]);

  return (
    <>
      <div className="backdrop" aria-hidden />
      <main className="relative">
        <Navbar tab={tab} setTab={setTab} onOpenMenu={() => setMenuOpen(true)} />
        <Layout tab={tab} hue={hue} onHueChange={setHue} onOpenProject={setOpenProjectId} onOpenTyping={openTyping} />
      </main>
      {openProject && <ProjectModal project={openProject} onClose={closeProject} />}
      {typingOpen && (
        <Modal label="Typing test" onClose={closeTyping}>
          <TypingTest targetWpm={profile.typingWpm} />
        </Modal>
      )}
      {menuOpen && <CommandMenu onClose={closeMenu} setTab={setTab} onOpenProject={setOpenProjectId} onOpenTyping={openTyping} />}
    </>
  );
}

export default App;
