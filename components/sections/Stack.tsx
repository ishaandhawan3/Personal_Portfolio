"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { stack } from "@/lib/data/stack";
import { useApp } from "@/components/app-context";

export default function Stack() {
  const [active, setActive] = useState(stack[0].id);
  const { runCommand } = useApp();
  const group = stack.find((g) => g.id === active) ?? stack[0];

  return (
    <Section id="stack" index="04" title="Technical stack" kicker="What I reach for, grouped by what it's for.">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-14">
        <Reveal>
          <ul className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stack.map((g) => (
              <li key={g.id} className="shrink-0 lg:shrink">
                <button
                  onMouseEnter={() => setActive(g.id)}
                  onFocus={() => setActive(g.id)}
                  onClick={() => setActive(g.id)}
                  className={[
                    "relative w-full rounded-lg px-3.5 py-2.5 text-left font-mono text-[13px] transition-colors",
                    active === g.id ? "text-accent" : "text-ink-400 hover:text-ink-100",
                  ].join(" ")}
                >
                  {active === g.id && (
                    <motion.span
                      layoutId="stack-pill"
                      className="absolute inset-0 rounded-lg border border-accent/20 bg-accent/[0.06]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center justify-between gap-3">
                    {g.label}
                    <span className="text-[11px] text-ink-600">{g.items.length}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="min-h-[240px] rounded-xl border border-white/[0.07] bg-white/[0.012] p-6 sm:p-8">
            <motion.div key={group.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-medium tracking-tight text-white">{group.label}</h3>
                <span className="font-mono text-[12px] text-ink-500">— {group.hint}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.022, 0.3) }}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-[13px] text-ink-200 transition-colors hover:border-accent/30 hover:bg-accent/[0.06] hover:text-accent"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
              <button
                onClick={() => runCommand(`skills ${group.id}`)}
                className="mt-7 font-mono text-[12px] text-ink-500 transition hover:text-accent"
              >
                ❯ skills {group.id}
              </button>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
