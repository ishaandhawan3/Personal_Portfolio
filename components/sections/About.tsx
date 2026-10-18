import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { profile } from "@/lib/data/profile";
import { growing } from "@/lib/data/stack";
import Tag from "@/components/ui/Tag";

export default function About() {
  return (
    <Section id="about" index="01" title="About" kicker="Short version: I build the model and the system around it.">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div className="space-y-5">
          {profile.summary.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-[15.5px] leading-[1.75] text-ink-200 text-balance-pretty sm:text-base">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.015] p-5 font-mono text-[13px] leading-relaxed text-ink-300">
              <span className="text-ink-600">{"// how I think about the work"}</span>
              <br />
              A model is a component. The thing that makes it useful is everything else:
              schemas, validation, retries, routing, observability, and a database row
              somebody can change at 2am without redeploying.
            </div>
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal delay={0.1}>
            <Meta label="education" value={profile.education.degree} sub={`${profile.education.school} · ${profile.education.period}`} />
          </Reveal>
          <Reveal delay={0.16}>
            <Meta label="based in" value={profile.location} />
          </Reveal>
          <Reveal delay={0.22}>
            <div>
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
                levelling up
              </h3>
              <div className="flex flex-wrap gap-2">
                {growing.map((g) => (
                  <Tag key={g}>{g}</Tag>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Meta({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">{label}</h3>
      <p className="text-[14.5px] leading-snug text-ink-100">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-ink-400">{sub}</p>}
    </div>
  );
}
