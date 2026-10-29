import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "../utils/scrollLock";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuCopy,
  LuDownload,
  LuFileText,
  LuFolderOpen,
  LuKeyboard,
  LuMoonStar,
  LuRotateCcw,
  LuSearch,
} from "react-icons/lu";
import { VscGithubAlt } from "react-icons/vsc";
import { RiLinkedinFill } from "react-icons/ri";
import { links, profile, projects } from "../data/content";
import { TabKey, requestLayoutReset } from "../utils/layout.helper";
import { toggleTheme } from "../utils/theme";
import { copyText } from "../utils/clipboard";

interface Command {
  id: string;
  group: string;
  label: string;
  keywords?: string;
  icon: IconType;
  // Return a message to show briefly before the menu closes.
  run: () => void | Promise<string | void>;
}

interface CommandMenuProps {
  onClose: () => void;
  setTab: (tab: TabKey) => void;
  onOpenProject: (id: string) => void;
  onOpenTyping: () => void;
}

const openTab = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

const CommandMenu: React.FC<CommandMenuProps> = ({ onClose, setTab, onOpenProject, onOpenTyping }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...Object.values(TabKey).map((tab) => ({
        id: `tab-${tab}`,
        group: "Go to",
        label: tab,
        keywords: "tab page section",
        icon: LuArrowRight,
        run: () => {
          setTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: "Projects",
        label: p.title,
        keywords: p.tags.join(" "),
        icon: LuFolderOpen,
        run: () => onOpenProject(p.id),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        keywords: `contact mail ${links.emailAddress}`,
        icon: LuCopy,
        run: async () => ((await copyText(links.emailAddress)) ? "Email copied!" : "Couldn't copy email"),
      },
      { id: "view-resume", group: "Actions", label: "View resume", keywords: "cv pdf", icon: LuFileText, run: () => openTab(profile.resume) },
      {
        id: "download-resume",
        group: "Actions",
        label: "Download resume",
        keywords: "cv pdf",
        icon: LuDownload,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = "Andy_Zhu_Resume.pdf";
          a.click();
        },
      },
      { id: "github", group: "Actions", label: "Open GitHub", keywords: "code repos", icon: VscGithubAlt, run: () => openTab(links.github) },
      { id: "linkedin", group: "Actions", label: "Open LinkedIn", keywords: "contact", icon: RiLinkedinFill, run: () => openTab(links.linkedin) },
      { id: "typing", group: "Actions", label: "Take the typing test", keywords: "wpm game speed keyboard", icon: LuKeyboard, run: onOpenTyping },
      { id: "theme", group: "Actions", label: "Toggle dark mode", keywords: "theme light", icon: LuMoonStar, run: toggleTheme },
      { id: "reset", group: "Actions", label: "Reset layout", keywords: "tiles grid drag", icon: LuRotateCcw, run: requestLayoutReset },
    ],
    [setTab, onOpenProject, onOpenTyping]
  );

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return commands.filter((c) => {
      const haystack = `${c.group} ${c.label} ${c.keywords ?? ""}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const unlockScroll = lockScroll();
    return () => {
      unlockScroll();
      // Skip if a command moved focus elsewhere (e.g. into a project modal).
      if (document.activeElement === document.body) previous?.focus();
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = async (command: Command) => {
    const result = await command.run();
    if (result) {
      setMessage(result);
      setTimeout(onClose, 800);
    } else {
      onClose();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="modal-panel tile relative flex !h-auto max-h-[70vh] w-full max-w-xl flex-col !bg-[hsl(var(--bg)/0.95)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line/10 px-4">
          <LuSearch className="shrink-0 text-lg text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, pages, actions…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 rounded-md bg-line/10 px-1.5 py-0.5 text-xs text-muted sm:block">Esc</kbd>
        </div>
        <ul ref={listRef} id="command-list" role="listbox" className="overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results</li>}
          {results.map((c, i) => (
            <li key={c.id}>
              {(i === 0 || results[i - 1].group !== c.group) && (
                <p className="px-3 pb-1 pt-3 text-xs uppercase tracking-wider text-muted">{c.group}</p>
              )}
              <div
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === active}
                data-index={i}
                onMouseMove={() => setActive(i)}
                onClick={() => run(c)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  i === active ? "bg-accent/15 text-fg" : "text-fg/85"
                }`}
              >
                <c.icon className={`shrink-0 text-base ${i === active ? "text-accent" : "text-muted"}`} />
                <span className="flex-1 truncate">{c.label}</span>
                {i === active && <kbd className="text-xs text-muted">↵</kbd>}
              </div>
            </li>
          ))}
        </ul>
        {message && (
          <p role="status" className="border-t border-line/10 px-4 py-2.5 text-center text-sm font-medium text-accent">
            {message}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CommandMenu;
