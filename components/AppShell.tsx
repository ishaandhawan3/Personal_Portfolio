"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Terminal as TerminalIcon } from "lucide-react";
import { AppContext, type TerminalMode } from "@/components/app-context";
import Terminal, { useTerminalHotkeys } from "@/components/terminal/Terminal";
import ProjectModal from "@/components/ProjectModal";
import BootSequence from "@/components/BootSequence";
import MatrixRain from "@/components/MatrixRain";
import Nav from "@/components/Nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TerminalMode>("hidden");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [effect, setEffect] = useState<"none" | "matrix" | "scan">("none");
  const [booting, setBooting] = useState(true);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("booted") === "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setBooting(false);
      setBooted(true);
    }
  }, []);

  const finishBoot = useCallback(() => {
    setBooting(false);
    setBooted(true);
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      /* private mode */
    }
  }, []);

  const runCommand = useCallback((cmd: string, next: Exclude<TerminalMode, "hidden"> = "full") => {
    setMode(next);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("portfolio:run", { detail: cmd }));
    });
  }, []);

  useTerminalHotkeys(setMode, mode);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        runCommand,
        openProject: setActiveProject,
        activeProject,
        effect,
        setEffect,
        booted,
      }}
    >
      {effect === "matrix" && <MatrixRain />}
      <AnimatePresence>{booting && <BootSequence onDone={finishBoot} />}</AnimatePresence>

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>

      <Nav />
      <main className="relative z-10">{children}</main>
      <Terminal />
      <ProjectModal />

      <AnimatePresence>
        {mode === "hidden" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            onClick={(e) => { e.currentTarget.blur(); setMode("dock"); }}
            className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-ink-900/85 px-4 py-3 font-mono text-[12.5px] text-accent shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-accent/50 hover:bg-accent/[0.1] active:scale-95 sm:bottom-6 sm:right-6"
            aria-label="Open terminal"
          >
            <TerminalIcon className="size-4" />
            <span className="hidden sm:inline">open terminal</span>
            <span className="hidden text-ink-600 md:inline">·</span>
            <kbd className="hidden rounded border border-accent/20 px-1 text-[10px] text-accent/70 md:inline">`</kbd>
          </motion.button>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
}
