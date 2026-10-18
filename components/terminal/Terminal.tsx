"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Maximize2, Minimize2, X, TerminalIcon, CornerDownLeft } from "lucide-react";
import { execute, completions, SECTIONS } from "@/lib/terminal/commands";
import type { CommandContext, Line, Tone } from "@/lib/terminal/types";
import { profile } from "@/lib/data/profile";
import { useApp, scrollToSection, currentSection, type TerminalMode } from "@/components/app-context";

const toneClass: Record<Tone, string> = {
  out: "text-ink-200",
  dim: "text-ink-400",
  accent: "text-accent",
  ok: "text-term",
  warn: "text-warn",
  err: "text-danger",
  head: "text-white font-medium",
  in: "text-ink-100",
};

const QUICK = ["help", "whoami", "ls projects", "open dionce-telephony", "skills", "cd ..", "contact"];

let uid = 0;
const nextId = () => `l${uid++}`;

const WELCOME: Omit<Line, "id">[] = [
  { tone: "head", text: `portfolio-sh 1.0 — ${profile.name}` },
  { tone: "dim", text: `${profile.role} · ${profile.location}` },
  { tone: "out", text: "" },
  { tone: "dim", text: "Type `help` for commands, `ls` for sections, or just scroll." },
  { tone: "out", text: "" },
];

export default function Terminal() {
  const { mode, setMode, setEffect, openProject } = useApp();
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>(() => WELCOME.map((l) => ({ ...l, id: nextId() })));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ctx = useMemo<CommandContext>(
    () => ({
      current: () => currentSection([...SECTIONS]),
      goto: (id) => {
        const ok = scrollToSection(id);
        if (ok && mode === "full") setMode("dock");
        return ok;
      },
      openProject: (slug) => {
        openProject(slug);
        if (mode === "full") setMode("dock");
        return true;
      },
      clear: () => setLines([]),
      close: () => setMode("hidden"),
      maximize: () => setMode("full"),
      setEffect,
      openUrl: (url) => {
        if (url.startsWith("mailto:")) window.location.href = url;
        else window.open(url, "_blank", "noopener,noreferrer");
      },
      history,
      sections: [...SECTIONS],
    }),
    [history, mode, openProject, setEffect, setMode],
  );

  const push = useCallback((items: Omit<Line, "id">[]) => {
    if (!items.length) return;
    setLines((prev) => [...prev, ...items.map((l) => ({ ...l, id: nextId() }))]);
  }, []);

  const submit = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      setInput("");
      setHistIdx(null);
      push([{ tone: "in", text: value }]);
      if (!value) return;
      setHistory((h) => (h[h.length - 1] === value ? h : [...h, value]));
      setBusy(true);
      const result = await execute(value, ctx);
      // a beat, so it feels like something ran
      await new Promise((r) => setTimeout(r, reduce ? 0 : 90));
      setBusy(false);
      push(result);
    },
    [ctx, push, reduce],
  );

  // external commands (nav buttons, hero chips)
  useEffect(() => {
    const handler = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      if (typeof cmd === "string") void submit(cmd);
    };
    window.addEventListener("portfolio:run", handler as EventListener);
    return () => window.removeEventListener("portfolio:run", handler as EventListener);
  }, [submit]);

  // autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, busy]);

  // focus on open
  useEffect(() => {
    if (mode !== "hidden") {
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 220);
      return () => clearTimeout(t);
    }
  }, [mode]);

  const ghost = useMemo(() => {
    if (!input.trim()) return "";
    const [first] = completions(input, ctx);
    return first && first.startsWith(input) ? first.slice(input.length) : "";
  }, [input, ctx]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void submit(input);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const opts = completions(input, ctx);
      if (opts.length === 1) setInput(opts[0] + " ");
      else if (opts.length > 1) {
        setInput(opts[0]);
        push([{ tone: "dim", text: opts.slice(0, 12).join("   ") }]);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
      return;
    }
    if (e.key === "ArrowRight" && ghost && inputRef.current?.selectionStart === input.length) {
      e.preventDefault();
      setInput(input + ghost);
      return;
    }
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setMode(mode === "full" ? "dock" : "hidden");
    }
  };

  const isFull = mode === "full";

  const hidden = mode === "hidden";

  return (
    <>
      {
        <motion.div
          key="terminal"
          initial={false}
          animate={
            hidden
              ? { opacity: 0, y: 26, scale: 0.98 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
          aria-hidden={hidden}
          className={[
            "fixed z-50 flex flex-col overflow-hidden rounded-xl glass shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]",
            hidden ? "pointer-events-none invisible" : "visible",
            isFull
              ? "inset-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-6 lg:inset-x-[max(1.5rem,calc((100vw-1100px)/2))] lg:inset-y-10"
              : "inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] h-[min(58dvh,460px)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(640px,calc(100vw-3rem))] sm:h-[400px]",
          ].join(" ")}
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
          role="region"
          aria-label="Interactive terminal"
        >
          {/* title bar */}
          <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] bg-ink-900/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); setMode("hidden"); }}
                className="size-3 rounded-full bg-[#ff5f57] transition hover:brightness-125"
                aria-label="Close terminal"
              />
              <button
                onClick={(e) => { e.stopPropagation(); setMode("dock"); }}
                className="size-3 rounded-full bg-[#febc2e] transition hover:brightness-125"
                aria-label="Minimize terminal"
              />
              <button
                onClick={(e) => { e.stopPropagation(); setMode(isFull ? "dock" : "full"); }}
                className="size-3 rounded-full bg-[#28c840] transition hover:brightness-125"
                aria-label="Maximize terminal"
              />
            </div>
            <div className="ml-2 flex min-w-0 items-center gap-2 font-mono text-[11px] text-ink-400">
              <TerminalIcon className="size-3.5 shrink-0 text-accent/70" />
              <span className="truncate">{profile.handle}@portfolio — ~/{isFull ? "" : ""}</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <IconBtn label={isFull ? "Restore" : "Expand"} onClick={() => setMode(isFull ? "dock" : "full")}>
                {isFull ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </IconBtn>
              <IconBtn label="Minimize" onClick={() => setMode("hidden")}>
                <Minus className="size-3.5" />
              </IconBtn>
            </div>
          </div>

          {/* output */}
          <div
            ref={scrollRef}
            className="relative flex-1 overflow-y-auto px-3 py-3 font-mono text-[12.5px] leading-[1.65] sm:px-4 sm:text-[13px]"
          >
            <div className="pointer-events-none absolute inset-0 noise opacity-[0.025]" aria-hidden />
            {lines.map((l, i) => (
              <TerminalLine key={l.id} line={l} index={i} reduce={!!reduce} />
            ))}
            {busy && <span className="inline-block h-4 w-2 animate-caret bg-accent align-middle" aria-hidden />}
          </div>

          {/* quick chips */}
          <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-white/[0.06] px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={(e) => { e.stopPropagation(); void submit(q); }}
                className="shrink-0 rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 font-mono text-[11px] text-ink-300 transition hover:border-accent/40 hover:bg-accent/[0.07] hover:text-accent active:scale-[0.97]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* prompt */}
          <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.06] bg-ink-900/50 px-3 py-2.5 font-mono text-[13px] sm:px-4">
            <Prompt />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                aria-label="Terminal input"
                className="w-full bg-transparent text-ink-100 caret-accent outline-none focus:outline-none focus-visible:outline-none placeholder:text-ink-600"
                placeholder="type a command…"
              />
              {ghost && (
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-ink-600">
                  <span className="invisible">{input}</span>
                  <span>{ghost}</span>
                </span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); void submit(input); }}
              className="hidden shrink-0 items-center gap-1 rounded-md border border-white/[0.07] px-2 py-1 text-[11px] text-ink-400 transition hover:text-accent sm:flex"
              aria-label="Run command"
            >
              <CornerDownLeft className="size-3" /> run
            </button>
          </div>
        </motion.div>
      }
    </>
  );
}

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-accent">{profile.handle}</span>
      <span className="text-ink-600">@</span>
      <span className="text-ink-300">portfolio</span>
      <span className="text-ink-600"> ❯</span>
    </span>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-ink-400 transition hover:bg-white/[0.05] hover:text-ink-100"
    >
      {children}
    </button>
  );
}

function TerminalLine({ line, index, reduce }: { line: Line; index: number; reduce: boolean }) {
  const body = (() => {
    if (line.tone === "in") {
      return (
        <span className="flex gap-2">
          <Prompt />
          <span className="text-ink-100">{line.text}</span>
        </span>
      );
    }
    if (line.href) {
      return (
        <a
          href={line.href}
          target={line.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:decoration-accent"
        >
          {line.text}
        </a>
      );
    }
    if (line.run) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("portfolio:run", { detail: line.run }));
          }}
          className="text-left text-ink-400 transition hover:text-accent"
        >
          {line.text}
        </button>
      );
    }
    return <span className={toneClass[line.tone]}>{line.text || " "}</span>;
  })();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: reduce ? 0 : Math.min(index * 0.004, 0.08) }}
      className="whitespace-pre-wrap break-words"
    >
      {body}
    </motion.div>
  );
}

export function useTerminalHotkeys(setMode: (m: TerminalMode) => void, mode: TerminalMode) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setMode(mode === "hidden" ? "full" : "hidden");
        return;
      }
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setMode(mode === "hidden" ? "dock" : "hidden");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, setMode]);
}
