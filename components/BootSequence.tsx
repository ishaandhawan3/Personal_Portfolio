"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects";

const STEPS = [
  "init portfolio-sh 1.0",
  "mount /home/ishaan",
  "load profile … ok",
  `load projects … ${projects.length} found`,
  "link llm · rag · fastapi · asterisk",
  "ready",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= STEPS.length) {
      const t = setTimeout(onDone, 260);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((n) => n + 1), i === 0 ? 180 : 135);
    return () => clearTimeout(t);
  }, [i, onDone]);

  useEffect(() => {
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950"
    >
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" aria-hidden />
      <div className="relative w-full max-w-md px-6 font-mono text-[12.5px] leading-relaxed">
        <div className="mb-4 text-accent">{profile.name.toLowerCase().replace(" ", "-")} · boot</div>
        {STEPS.slice(0, i).map((s) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.16 }}
            className="text-ink-400"
          >
            <span className="text-term">▪</span> {s}
          </motion.div>
        ))}
        <span className="mt-2 inline-block h-3.5 w-1.5 animate-caret bg-accent" aria-hidden />
        <div className="mt-8 text-[11px] text-ink-600">press any key to skip</div>
      </div>
    </motion.div>
  );
}
