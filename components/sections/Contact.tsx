"use client";

import { Mail, Github, Linkedin, MapPin, FileText, ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { profile } from "@/lib/data/profile";
import { useApp } from "@/components/app-context";

export default function Contact() {
  const { runCommand } = useApp();
  return (
    <Section id="contact" index="05" title="Have an AI problem worth building?" kicker="Fastest route: email.">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="max-w-lg text-[15.5px] leading-[1.75] text-ink-200 text-balance-pretty">
              I&apos;m open to AI engineering roles and GenAI product work — especially where the model
              is only half the problem and the rest is a system that has to stay up.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="mt-7 space-y-2">
              {profile.availability.map((a) => (
                <li key={a} className="flex items-center gap-3 font-mono text-[13.5px] text-ink-300">
                  <span className="size-1 rounded-full bg-accent/60" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-9 inline-flex items-center gap-2.5 rounded-lg bg-accent px-5 py-3 text-[14px] font-medium text-ink-950 transition hover:bg-accent-dim active:scale-[0.98]"
            >
              <Mail className="size-4" />
              {profile.email}
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/40">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-[11px] text-ink-500">
              contact.txt
            </div>
            <dl className="divide-y divide-white/[0.05]">
              <Row icon={<Mail className="size-4" />} label="email" value={profile.email} href={`mailto:${profile.email}`} />
              <Row
                icon={<Linkedin className="size-4" />}
                label="linkedin"
                value={profile.links.linkedin.replace("https://www.", "")}
                href={profile.links.linkedin}
              />
              <Row
                icon={<Github className="size-4" />}
                label="github"
                value={profile.links.github.replace("https://", "")}
                href={profile.links.github}
              />
              <Row icon={<FileText className="size-4" />} label="resume" value="resume.pdf" href={profile.resumePath} />
              <Row icon={<MapPin className="size-4" />} label="location" value={profile.location} />
            </dl>
            <button
              onClick={() => runCommand("contact")}
              className="w-full border-t border-white/[0.06] px-4 py-3 text-left font-mono text-[12px] text-ink-500 transition hover:text-accent"
            >
              ❯ contact
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Row({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="text-ink-600">{icon}</span>
      <dt className="w-20 shrink-0 font-mono text-[12px] text-ink-500">{label}</dt>
      <dd className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink-100">{value}</dd>
      {href && <ArrowUpRight className="size-3.5 shrink-0 text-ink-600 transition group-hover:text-accent" />}
    </>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/[0.02]"
    >
      {body}
    </a>
  ) : (
    <div className="flex items-center gap-3 px-4 py-3.5">{body}</div>
  );
}
