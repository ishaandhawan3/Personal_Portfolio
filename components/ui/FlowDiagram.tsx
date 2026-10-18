"use client";

import { motion, useReducedMotion } from "motion/react";

export type FlowNode = { label: string; sub?: string; accent?: boolean };

export default function FlowDiagram({
  nodes,
  compact = false,
}: {
  nodes: FlowNode[];
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <ol className="relative flex flex-col">
      {nodes.map((n, i) => (
        <li key={`${n.label}-${i}`} className="relative">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.42, delay: Math.min(i * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className={[
              "group relative flex items-start gap-3 rounded-lg border px-3.5 transition-colors",
              compact ? "py-2.5" : "py-3",
              n.accent
                ? "border-accent/25 bg-accent/[0.05]"
                : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.14]",
            ].join(" ")}
          >
            <span
              className={[
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                n.accent ? "bg-accent" : "bg-ink-400 group-hover:bg-accent/70",
              ].join(" ")}
            />
            <div className="min-w-0">
              <div className={["font-mono text-[13px]", n.accent ? "text-accent" : "text-ink-100"].join(" ")}>
                {n.label}
              </div>
              {n.sub && <div className="mt-0.5 text-[12px] leading-snug text-ink-400">{n.sub}</div>}
            </div>
          </motion.div>
          {i < nodes.length - 1 && (
            <div className="relative ml-[22px] h-5" aria-hidden>
              <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/[0.14] to-white/[0.05]" />
              <motion.span
                className="absolute left-[-2px] size-[5px] rounded-full bg-accent/80"
                initial={{ top: 0, opacity: 0 }}
                whileInView={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                viewport={{ once: false }}
                transition={{
                  duration: 1.6,
                  delay: i * 0.18,
                  repeat: reduce ? 0 : Infinity,
                  repeatDelay: 2.2,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
