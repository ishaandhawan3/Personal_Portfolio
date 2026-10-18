import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { experience } from "@/lib/data/experience";

export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      title="Experience"
      kicker="Three roles, one company I grew inside, one current."
    >
      <div className="relative">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-white/[0.08] to-transparent sm:left-[9px]"
          aria-hidden
        />
        <div className="space-y-12 sm:space-y-16">
          {experience.map((role, i) => (
            <Reveal key={role.id} delay={i * 0.05}>
              <article className="relative pl-8 sm:pl-10">
                <span
                  className={[
                    "absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border sm:size-[19px]",
                    role.current ? "border-accent/50 bg-accent/15" : "border-white/[0.12] bg-ink-900",
                  ].join(" ")}
                  aria-hidden
                >
                  <span className={["size-1.5 rounded-full", role.current ? "bg-accent" : "bg-ink-400"].join(" ")} />
                  {role.current && (
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/30" />
                  )}
                </span>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-medium tracking-tight text-white sm:text-xl">{role.title}</h3>
                  <span className="font-mono text-[13px] text-accent">{role.company}</span>
                  {role.current && (
                    <span className="rounded-full border border-term/25 bg-term/[0.07] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-term">
                      current
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[12px] text-ink-500">
                  {role.start} – {role.end} · {role.location}
                </p>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-200 text-balance-pretty">{role.blurb}</p>

                <ul className="mt-5 space-y-2.5">
                  {role.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-300">
                      <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent/50" aria-hidden />
                      <span className="max-w-3xl">{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {role.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
