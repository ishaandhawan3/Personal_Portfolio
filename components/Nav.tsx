"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Terminal as TerminalIcon, FileText, Github, Linkedin } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { SECTIONS } from "@/lib/terminal/commands";
import { useApp, scrollToSection } from "@/components/app-context";

const NAV = SECTIONS.filter((s) => s !== "home");

export default function Nav() {
  const { setMode, mode } = useApp();
  const [active, setActive] = useState<string>("home");
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        solid ? "border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl" : "border-b border-transparent",
      ].join(" ")}
    >
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent via-accent/60 to-transparent"
        aria-hidden
      />
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-5 sm:h-16 sm:px-8">
        <button
          onClick={() => scrollToSection("home")}
          className="group flex items-center gap-2.5 font-mono text-[13px] tracking-tight"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/70" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          <span className="text-white">ishaan</span>
          <span className="hidden text-ink-600 sm:inline">dhawan</span>
        </button>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((s) => (
            <li key={s}>
              <button
                onClick={() => scrollToSection(s)}
                className={[
                  "relative rounded-md px-3 py-1.5 font-mono text-[12.5px] transition-colors",
                  active === s ? "text-accent" : "text-ink-400 hover:text-ink-100",
                ].join(" ")}
              >
                {active === s && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md border border-accent/20 bg-accent/[0.07]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{s}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <IconLink href={profile.links.github} label="GitHub">
            <Github className="size-4" />
          </IconLink>
          <IconLink href={profile.links.linkedin} label="LinkedIn">
            <Linkedin className="size-4" />
          </IconLink>
          <IconLink href={profile.resumePath} label="Resume" newTab>
            <FileText className="size-4" />
          </IconLink>
          <button
            onClick={(e) => { e.currentTarget.blur(); setMode(mode === "hidden" ? "full" : "hidden"); }}
            className="ml-1 inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.07] px-2.5 py-1.5 font-mono text-[12px] text-accent transition hover:border-accent/50 hover:bg-accent/[0.12] active:scale-[0.97]"
            aria-label="Toggle terminal"
          >
            <TerminalIcon className="size-3.5" />
            <span className="hidden sm:inline">terminal</span>
            <kbd className="hidden rounded border border-accent/20 px-1 text-[10px] text-accent/70 md:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}

function IconLink({
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
      title={label}
      className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.05] hover:text-white"
    >
      {children}
    </a>
  );
}
