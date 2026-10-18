"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Github, ExternalLink, Lock, ArrowRight } from "lucide-react";
import { bySlug } from "@/lib/data/projects";
import { useApp } from "@/components/app-context";
import Tag from "@/components/ui/Tag";
import FlowDiagram from "@/components/ui/FlowDiagram";

export default function ProjectModal() {
  const { activeProject, openProject } = useApp();
  const project = activeProject ? bySlug(activeProject) : undefined;

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openProject(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, openProject]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain bg-ink-950/80 p-0 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => openProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
        >
          <motion.article
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-0 w-full max-w-3xl rounded-none border-white/[0.07] bg-ink-900 sm:my-4 sm:rounded-2xl sm:border"
          >
            <header className="sticky top-0 z-10 flex items-start gap-4 rounded-t-2xl border-b border-white/[0.06] bg-ink-900/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent/80">
                  {project.kind} · {project.year}
                </p>
                <h2 className="mt-1 text-xl font-medium tracking-tight text-white sm:text-2xl">{project.name}</h2>
              </div>
              <button
                onClick={() => openProject(null)}
                className="ml-auto shrink-0 rounded-lg border border-white/[0.07] p-2 text-ink-400 transition hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="space-y-8 px-5 py-6 sm:px-7 sm:py-8">
              <p className="text-[15px] leading-relaxed text-ink-200 text-balance-pretty">{project.summary}</p>

              {project.metrics && (
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="bg-ink-900 p-4">
                      <div className="font-mono text-lg text-accent">{m.value}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-ink-400">{m.label}</div>
                      {m.note && <div className="mt-1 text-[11px] leading-snug text-ink-600">{m.note}</div>}
                    </div>
                  ))}
                </div>
              )}

              <Block title="Problem">
                <p className="leading-relaxed text-ink-300">{project.problem}</p>
              </Block>

              <Block title="What I built">
                <ul className="space-y-2.5">
                  {project.built.map((b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-ink-300">
                      <ArrowRight className="mt-1 size-3.5 shrink-0 text-accent/60" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Architecture">
                <FlowDiagram nodes={project.architecture.map((label) => ({ label }))} compact />
              </Block>

              <Block title="My contribution">
                <p className="leading-relaxed text-ink-300">{project.contribution}</p>
              </Block>

              {project.caveat && (
                <Block title="The honest caveat">
                  <p className="rounded-xl border border-warn/20 bg-warn/[0.04] p-4 text-[13.5px] leading-relaxed text-ink-300">
                    {project.caveat}
                  </p>
                </Block>
              )}

              <Block title="Tech">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Block>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-3.5 py-2 text-[13px] text-ink-100 transition hover:border-accent/50 hover:text-accent"
                  >
                    <Github className="size-4" /> Source
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] px-3.5 py-2 text-[13px] text-ink-400">
                    <Lock className="size-3.5" />
                    {project.closedSource ? "Closed source — production work" : "No public repo yet"}
                  </span>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-3.5 py-2 text-[13px] text-ink-100 transition hover:border-accent/50 hover:text-accent"
                  >
                    <ExternalLink className="size-4" /> Live
                  </a>
                )}
                <span className="ml-auto font-mono text-[11px] text-ink-600">esc to close</span>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">{title}</h3>
      {children}
    </section>
  );
}
