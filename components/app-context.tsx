"use client";

import { createContext, useContext } from "react";

export type TerminalMode = "hidden" | "dock" | "full";

export type AppApi = {
  mode: TerminalMode;
  setMode: (m: TerminalMode) => void;
  /** Open the terminal (full screen) and run a command in it. */
  runCommand: (cmd: string, mode?: Exclude<TerminalMode, "hidden">) => void;
  openProject: (slug: string | null) => void;
  activeProject: string | null;
  effect: "none" | "matrix" | "scan";
  setEffect: (e: "none" | "matrix" | "scan") => void;
  booted: boolean;
};

export const AppContext = createContext<AppApi | null>(null);

export function useApp(): AppApi {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppShell>");
  return ctx;
}

/** Which section is currently under the top of the viewport. */
export function currentSection(ids: string[]): string {
  const probe = 120;
  let best = "home";
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) return id;
    if (r.top <= probe) best = id;
  }
  return best;
}

export function scrollToSection(id: string): boolean {
  const target = id === "home" ? document.body : document.getElementById(id);
  if (!target) return false;
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }
  const y = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
  return true;
}
