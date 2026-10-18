"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Github, Linkedin, Mail, Terminal as TerminalIcon } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { experience } from "@/lib/data/experience";
import { useApp, scrollToSection } from "@/components/app-context";

const ROTATING = [
  "LLM applications",
  "RAG pipelines",
  "AI voice infrastructure",
  "FastAPI backends",
  "document intelligence",
];

export default function Hero() {
  const { runCommand, booted } = useApp();
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(reduce ? ROTATING[0] : "");

  useEffect(() => {
    if (reduce) return;
    const word = ROTATING[idx];
    let i = 0;
    let dir: 1 | -1 = 1;
    const tick = () => {
      i += dir;
      setTyped(word.slice(0, i));
      if (dir === 1 && i >= word.length) {
        dir = -1;
        return window.setTimeout(tick, 1700);
      }
      if (dir === -1 && i <= 0) {
        setIdx((n) => (n + 1) % ROTATING.length);
        return;
      }
      return window.setTimeout(tick, dir === 1 ? 42 : 22);
    };
    const t = window.setTimeout(tick, 420);
    return () => window.clearTimeout(t);
  }, [idx, reduce]);

  const delay = booted ? 0 : 0.1;

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_75%_55%_at_50%_35%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-10%] size-[70vw] max-w-[760px] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.10),transparent_62%)] blur-xl" />
        <div className="absolute bottom-[-20%] right-[-10%] size-[46vw] max-w-[560px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.07),transparent_65%)] blur-2xl" />
        <div className="absolute inset-0 noise opacity-[0.03]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[11.5px] text-ink-300"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-term/70" />
              <span className="relative size-1.5 rounded-full bg-term" />
            </span>
            <span className="truncate">
              {experience[0].title} @ {experience[0].company}
            </span>
            <span className="hidden text-ink-600 sm:inline">·</span>
            <span className="hidden sm:inline">{profile.location}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: delay + 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.3rem,7vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white"
          >
            Ishaan Dhawan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: delay + 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl text-[clamp(1.05rem,2.4vw,1.4rem)] leading-snug tracking-tight text-ink-100 text-balance-pretty"
          >
            AI Engineer building intelligent systems that{" "}
            <span className="text-accent">actually ship.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: delay + 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl leading-relaxed text-ink-300 text-balance-pretty"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay + 0.26 }}
            className="mt-6 font-mono text-[13px] text-ink-400"
          >
            <span className="text-ink-600">focus:</span>{" "}
            <span className="text-term">{typed}</span>
            <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-[1px] animate-caret bg-term/80" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay + 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-2.5"
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13.5px] font-medium text-ink-950 transition hover:bg-accent-dim active:scale-[0.98]"
            >
              View projects
              <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={() => runCommand("whoami")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-[13.5px] text-ink-100 transition hover:border-accent/40 hover:text-accent active:scale-[0.98]"
            >
              <TerminalIcon className="size-4" />
              Run <code className="font-mono text-accent">whoami</code>
            </button>
            <div className="flex items-center gap-1 sm:ml-1">
              <Social href={profile.links.github} label="GitHub">
                <Github className="size-4" />
              </Social>
              <Social href={profile.links.linkedin} label="LinkedIn">
                <Linkedin className="size-4" />
              </Social>
              <Social href={`mailto:${profile.email}`} label="Email" newTab={false}>
                <Mail className="size-4" />
              </Social>
            </div>
          </motion.div>
        </div>

        {/* terminal teaser */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(94,234,212,0.07),transparent_70%)] blur-lg" aria-hidden />
          <button
            onClick={() => runCommand("help")}
            className="group relative block w-full overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900/70 text-left backdrop-blur-xl transition hover:border-accent/30"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
              <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
              <span className="size-2.5 rounded-full bg-[#28c840]/70" />
              <span className="ml-2 font-mono text-[11px] text-ink-500">ishaan@portfolio — ~</span>
            </div>
            <div className="space-y-1.5 px-4 py-5 font-mono text-[12.5px] leading-relaxed">
              <Row cmd="whoami" out={`${profile.role} · ${profile.location}`} />
              <Row cmd="ls projects" out="★ dionce-telephony  ★ doc-intelligence  ★ rag-pdf-parser  …" />
              <Row cmd="cat dionce-telephony" out="PSTN → Asterisk → LiveKit → AI agent → LLM" />
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-accent">❯</span>
                <span className="text-ink-500 transition group-hover:text-ink-300">
                  click to open the shell
                </span>
                <span className="inline-block h-3.5 w-[7px] translate-y-[1px] animate-caret bg-accent" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/[0.03] to-transparent" aria-hidden />
          </button>

        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollToSection("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-600 transition hover:text-accent lg:flex"
        aria-label="Scroll to about"
      >
        scroll
        <ArrowDown className="size-3.5 animate-bounce" />
      </motion.button>
    </section>
  );
}

function Row({ cmd, out }: { cmd: string; out: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-accent">❯</span>
        <span className="text-ink-100">{cmd}</span>
      </div>
      <div className="pl-4 text-ink-400">{out}</div>
    </div>
  );
}

function Social({
  href,
  label,
  children,
  newTab = true,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-lg border border-transparent p-2.5 text-ink-400 transition hover:border-white/[0.08] hover:text-white"
    >
      {children}
    </a>
  );
}
