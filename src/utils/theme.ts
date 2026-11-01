import { useSyncExternalStore } from "react";

// The initial theme is applied by the inline script in index.html (before
// React loads) so the page never flashes the wrong theme. This module keeps
// every toggle (theme switch, command menu) in sync after that.
const EVENT = "themechange";

const isDark = () => document.documentElement.classList.contains("dark");

export function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // storage unavailable
  }
  window.dispatchEvent(new Event(EVENT));
}

export const toggleTheme = () => setDark(!isDark());

export function useIsDark() {
  return useSyncExternalStore((onChange) => {
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, isDark);
}
