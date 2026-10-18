"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Lock, Star, Terminal as TerminalIcon } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { featuredProjects, otherProjects, type Project } from "@/lib/data/projects";
import { useApp } from "@/components/app-context";

export default function Projects() {
  const { openProject, runCommand } = useApp();
  return (
    <Section
      id="projects"
      index="03"
      title="Projects"
      kicker="Production systems first. Click any card for the full case study."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((p, i) => (
          <Reveal
            key={p.slug}
            delay={i * 0.05}
            className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}
          >
            <Card project={p} onOpen={() => openProject(p.slug)} large={i === 0} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            also built
          </h3>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2">
            {otherProjects.map((p) => (
              <button
                key={p.slug}
                onClick={() => openProject(p.slug)}
                className="group flex items-start gap-4 bg-ink-950 p-5 text-left transition hover:bg-ink-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-[14.5px] font-medium text-ink-100 transition group-hover:text-accent">
                      {p.name}
                    </h4>
                    <span className="font-mono text-[11px] text-ink-600">{p.year}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-400">{p.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[11px] text-ink-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <button
          onClick={() => runCommand("ls projects")}
          className="mt-8 inline-flex items-center gap-2 font-mono text-[12.5px] text-ink-400 transition hover:text-accent"
        >
          <TerminalIcon className="size-3.5" />
          or browse them in the shell: <span className="text-accent">ls projects</span>
        </button>
      </Reveal>
    </Section>
  );
}

function Card({ project, onOpen, large }: { project: Project; onOpen: () => void; large?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={onOpen}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/40 p-5 text-left transition-colors hover:border-accent/30 sm:p-6"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(94,234,212,0.06), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative flex items-center gap-2">
        <Star className="size-3 fill-accent text-accent" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent/80">
          {project.kind}
        </span>
        {project.closedSource && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10.5px] text-ink-600">
            <Lock className="size-3" /> closed
          </span>
        )}
      </div>

      <h3
        className={[
          "relative mt-3 font-medium tracking-tight text-white transition group-hover:text-accent",
          large ? "text-xl sm:text-2xl" : "text-[17px]",
        ].join(" ")}
      >
        {project.name}
      </h3>

      <p
        className={[
          "relative mt-3 leading-relaxed text-ink-300 text-balance-pretty",
          large ? "max-w-2xl text-[14.5px]" : "text-[13.5px]",
        ].join(" ")}
      >
        {project.summary}
      </p>

      {large && project.metrics && (
        <div className="relative mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {project.metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <div className="font-mono text-[15px] text-accent">{m.value}</div>
              <div className="text-[10.5px] uppercase tracking-wider text-ink-500">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="relative mt-auto pt-5">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, large ? 7 : 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {project.tech.length > (large ? 7 : 4) && (
            <span className="self-center font-mono text-[11px] text-ink-600">
              +{project.tech.length - (large ? 7 : 4)}
            </span>
          )}
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-500 transition group-hover:text-accent">
          case study
          <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.button>
  );
}
