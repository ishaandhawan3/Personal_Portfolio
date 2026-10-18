import { profile } from "@/lib/data/profile";
import { experience } from "@/lib/data/experience";
import { projects, bySlug } from "@/lib/data/projects";
import { stack, growing } from "@/lib/data/stack";
import { diagrams } from "@/lib/data/architecture";
import type { Command, CommandContext, CommandResult } from "./types";

const out = (text: string): CommandResult[number] => ({ tone: "out", text });
const dim = (text: string): CommandResult[number] => ({ tone: "dim", text });
const head = (text: string): CommandResult[number] => ({ tone: "head", text });
const accent = (text: string): CommandResult[number] => ({ tone: "accent", text });
const ok = (text: string): CommandResult[number] => ({ tone: "ok", text });
const err = (text: string): CommandResult[number] => ({ tone: "err", text });
const blank = (): CommandResult[number] => ({ tone: "out", text: "" });
const link = (text: string, href: string): CommandResult[number] => ({ tone: "accent", text, href });
const hint = (text: string, run: string): CommandResult[number] => ({ tone: "dim", text, run });

export const SECTIONS = ["home", "about", "experience", "projects", "stack", "contact"] as const;

/** Last section we navigated away from — powers `cd -`. */
let previousSection: string | null = null;

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));

export const commands: Command[] = [
  {
    name: "help",
    desc: "list every command",
    group: "system",
    run: () => {
      const groups: { key: Command["group"]; label: string }[] = [
        { key: "navigate", label: "navigate" },
        { key: "read", label: "read" },
        { key: "system", label: "system" },
      ];
      const lines: CommandResult = [
        head("Ishaan Dhawan — portfolio shell"),
        dim("Type a command, or press Tab to complete. ↑ / ↓ walks history."),
        blank(),
      ];
      for (const g of groups) {
        lines.push(accent(g.label.toUpperCase()));
        for (const c of commands.filter((x) => x.group === g.key && !x.hidden)) {
          const sig = c.args ? `${c.name} ${c.args}` : c.name;
          lines.push(out(`  ${pad(sig, 22)}${c.desc}`));
        }
        lines.push(blank());
      }
      lines.push(dim("There are a few undocumented ones. You'll find them."));
      return lines;
    },
  },
  {
    name: "ls",
    args: "[dir]",
    desc: "list sections, or contents of one",
    group: "navigate",
    complete: () => [...SECTIONS, "projects", "skills"],
    run: (args) => {
      const target = args[0]?.replace(/\/$/, "");
      if (!target) {
        return [
          dim("drwxr-xr-x   sections/"),
          ...SECTIONS.map((s) => out(`  ${pad(s + "/", 16)}${sectionBlurb(s)}`)),
          blank(),
          hint("→ cd projects", "cd projects"),
        ];
      }
      if (target === "projects") {
        return [
          dim(`${projects.length} projects — \`open <name>\` for the full breakdown`),
          blank(),
          ...projects.map((p) =>
            out(`  ${p.featured ? "★" : " "} ${pad(p.slug, 24)}${p.year}  ${p.kind}`),
          ),
        ];
      }
      if (target === "skills" || target === "stack") {
        return stack.map((g) => out(`  ${pad(g.id, 12)}${g.items.length} entries  — ${g.label}`));
      }
      if ((SECTIONS as readonly string[]).includes(target)) {
        return [dim(`${target}/ is a page section`), hint(`→ cd ${target}`, `cd ${target}`)];
      }
      return [err(`ls: ${target}: no such directory`)];
    },
  },
  {
    name: "cd",
    args: "<section|..|-|~>",
    desc: "scroll to a section — `..` steps back up, `-` returns",
    group: "navigate",
    complete: () => [...SECTIONS, "..", "-", "~"],
    run: (args, ctx) => {
      const raw = args[0]?.replace(/\/+$/, "").toLowerCase() ?? "";
      const here = ctx.current();
      const order: string[] = [...SECTIONS];
      const at = Math.max(0, order.indexOf(here));

      let target = raw;
      if (!raw || raw === "~" || raw === "/") target = "home";
      else if (raw === "..") target = order[Math.max(0, at - 1)];
      else if (raw === "../..") target = order[Math.max(0, at - 2)];
      else if (raw === "-") {
        if (!previousSection) return [{ tone: "err", text: "cd: OLDPWD not set" }];
        target = previousSection;
      }
      else if (raw === "." ) target = here;

      if (!order.includes(target)) {
        return [
          err(`cd: ${raw}: no such section`),
          dim(`try: ${order.join(", ")}  ·  or ..  ·  or -`),
        ];
      }
      if (target === here && raw !== ".") {
        return [dim(target === "home" ? "already at the top" : `already in ${target}/`)];
      }

      previousSection = here;
      ctx.goto(target);
      return [ok(`→ ${target === "home" ? "~" : target + "/"}`)];
    },
  },
  {
    name: "open",
    args: "<project>",
    desc: "open a project's full case study",
    group: "navigate",
    complete: () => projects.map((p) => p.slug),
    run: (args, ctx) => {
      const q = (args[0] ?? "").toLowerCase();
      if (!q) return [err("open: which project?"), hint("→ ls projects", "ls projects")];
      const match =
        bySlug(q) ??
        projects.find((p) => p.slug.includes(q) || p.name.toLowerCase().includes(q));
      if (!match) return [err(`open: ${q}: not found`), hint("→ ls projects", "ls projects")];
      ctx.openProject(match.slug);
      return [ok(`opening ${match.slug} …`), dim(match.summary)];
    },
  },
  {
    name: "whoami",
    desc: "the short version",
    group: "read",
    run: () => [
      accent(`${profile.name} — ${profile.role}`),
      out(profile.headline),
      blank(),
      dim(`location   ${profile.location}`),
      dim(`now        ${experience[0].title} @ ${experience[0].company}`),
      dim(`focus      GenAI · LLM applications · RAG · backend · AI voice infra`),
      dim(`degree     ${profile.education.degree} (${profile.education.period})`),
      blank(),
      hint("→ about", "about"),
    ],
  },
  {
    name: "about",
    desc: "the longer version",
    group: "read",
    run: (_a, ctx) => {
      ctx.goto("about");
      return [head("about"), ...profile.summary.flatMap((p) => [out(p), blank()])];
    },
  },
  {
    name: "experience",
    args: "[n]",
    desc: "work history",
    group: "read",
    run: (args) => {
      const n = args[0] ? Number(args[0]) : undefined;
      const roles = n && !Number.isNaN(n) ? experience.slice(0, n) : experience;
      const lines: CommandResult = [head("experience")];
      for (const r of roles) {
        lines.push(blank());
        lines.push(accent(`${r.title} · ${r.company}`));
        lines.push(dim(`${r.start} – ${r.end}  ·  ${r.location}`));
        for (const p of r.points) lines.push(out(`  ▪ ${p}`));
      }
      return lines;
    },
  },
  {
    name: "skills",
    args: "[group]",
    desc: "technical stack",
    group: "read",
    complete: () => stack.map((g) => g.id),
    run: (args) => {
      const g = args[0]?.toLowerCase();
      if (g) {
        const found = stack.find((s) => s.id === g || s.label.toLowerCase().includes(g));
        if (!found) return [err(`skills: ${g}: unknown group`), dim(`groups: ${stack.map((s) => s.id).join(", ")}`)];
        return [accent(found.label), dim(found.hint), blank(), out(found.items.join("  ·  "))];
      }
      return [
        head("stack"),
        blank(),
        ...stack.flatMap((s) => [accent(pad(s.label, 22) + s.items.slice(0, 4).join(", ") + (s.items.length > 4 ? ` +${s.items.length - 4}` : ""))]),
        blank(),
        dim("currently levelling up: " + growing.join(", ")),
        hint("→ skills genai", "skills genai"),
      ];
    },
  },
  {
    name: "arch",
    args: "[id]",
    desc: "print a system architecture (terminal only)",
    group: "read",
    complete: () => diagrams.map((d) => d.id),
    run: (args) => {
      const id = args[0]?.toLowerCase();
      if (!id) {
        return [
          head("architectures"),
          ...diagrams.map((d) => out(`  ${pad(d.id, 10)}${d.title}`)),
          blank(),
          hint("→ arch voice", "arch voice"),
        ];
      }
      const d = diagrams.find((x) => x.id === id);
      if (!d) return [err(`arch: ${id}: not found`)];
      const lines: CommandResult = [accent(d.title), dim(d.caption), blank()];
      d.nodes.forEach((n, i) => {
        lines.push(out(`  ${n.accent ? "◆" : "◇"} ${n.label}${n.sub ? `  — ${n.sub}` : ""}`));
        if (i < d.nodes.length - 1) lines.push(dim("  │"));
      });
      return lines;
    },
  },
  {
    name: "cat",
    args: "<project>",
    desc: "print a project case study inline",
    group: "read",
    complete: () => projects.map((p) => p.slug),
    run: (args) => {
      const q = (args[0] ?? "").toLowerCase();
      const p = bySlug(q) ?? projects.find((x) => x.slug.includes(q) || x.name.toLowerCase().includes(q));
      if (!p) return [err(`cat: ${q || "?"}: no such project`), hint("→ ls projects", "ls projects")];
      const lines: CommandResult = [
        accent(p.name),
        dim(`${p.kind}  ·  ${p.year}${p.closedSource ? "  ·  closed source" : ""}`),
        blank(),
        out(p.summary),
        blank(),
        accent("# problem"),
        out(p.problem),
        blank(),
        accent("# what I built"),
        ...p.built.map((b) => out(`  ▪ ${b}`)),
        blank(),
        accent("# architecture"),
        ...p.architecture.map((a, i) => out(`  ${i === 0 ? "" : "↓ "}${a}`)),
        blank(),
        accent("# my contribution"),
        out(p.contribution),
      ];
      if (p.metrics?.length) {
        lines.push(blank(), accent("# measured"));
        for (const m of p.metrics) lines.push(out(`  ${pad(m.label, 28)}${m.value}${m.note ? `   (${m.note})` : ""}`));
      }
      if (p.caveat) lines.push(blank(), accent("# the honest caveat"), dim(p.caveat));
      lines.push(blank(), accent("# tech"), out(p.tech.join("  ·  ")));
      if (p.repo) lines.push(blank(), link(p.repo, p.repo));
      return lines;
    },
  },
  {
    name: "contact",
    desc: "how to reach me",
    group: "read",
    run: (_a, ctx) => {
      ctx.goto("contact");
      return [
        head("contact"),
        blank(),
        link(`email      ${profile.email}`, `mailto:${profile.email}`),
        link(`linkedin   ${profile.links.linkedin.replace("https://www.", "")}`, profile.links.linkedin),
        link(`github     ${profile.links.github.replace("https://", "")}`, profile.links.github),
        dim(`location   ${profile.location}`),
        blank(),
        dim("open to: " + profile.availability.join(", ")),
      ];
    },
  },
  {
    name: "resume",
    desc: "open the PDF resume",
    group: "read",
    run: (_a, ctx) => {
      ctx.openUrl(profile.resumePath);
      return [ok("opening resume.pdf …"), dim("If nothing opened, the PDF hasn't been added to /public yet.")];
    },
  },
  {
    name: "github",
    desc: "open GitHub",
    group: "navigate",
    run: (_a, ctx) => {
      ctx.openUrl(profile.links.github);
      return [ok(`→ ${profile.links.github}`)];
    },
  },
  {
    name: "linkedin",
    desc: "open LinkedIn",
    group: "navigate",
    run: (_a, ctx) => {
      ctx.openUrl(profile.links.linkedin);
      return [ok(`→ ${profile.links.linkedin}`)];
    },
  },
  {
    name: "email",
    desc: "start an email",
    group: "navigate",
    run: (_a, ctx) => {
      ctx.openUrl(`mailto:${profile.email}`);
      return [ok(`→ ${profile.email}`)];
    },
  },
  {
    name: "clear",
    desc: "clear the screen",
    group: "system",
    run: (_a, ctx) => {
      ctx.clear();
      return [];
    },
  },
  {
    name: "history",
    desc: "commands this session",
    group: "system",
    run: (_a, ctx) =>
      ctx.history.length
        ? ctx.history.map((h, i) => out(`  ${pad(String(i + 1), 5)}${h}`))
        : [dim("no history yet")],
  },
  {
    name: "neofetch",
    desc: "system info, portfolio edition",
    group: "system",
    run: () => [
      accent("      ╭──────────╮"),
      accent("      │ ◢◤  ◢◤   │   ") ,
      out(`      │  AI/ML   │   ${profile.handle}@portfolio`),
      out(`      │  ◣◢  ◣◢  │   ${"─".repeat(24)}`),
      out(`      ╰──────────╯   role      ${profile.role}`),
      out(`                     company   ${experience[0].company}`),
      out(`                     langs     Python, SQL, C/C++, TS`),
      out(`                     stack     LLM · RAG · FastAPI · Django · Postgres`),
      out(`                     infra     Azure · AWS · GCP · Docker · Linux`),
      out(`                     odd one   Asterisk · PJSIP · LiveKit`),
      out(`                     shell     portfolio-sh 1.0`),
      out(`                     uptime    since 2021`),
      blank(),
    ],
  },
  { name: "pwd", desc: "print working directory", group: "system", run: () => [out("/home/ishaan/portfolio")] },
  {
    name: "tree",
    desc: "the whole site at a glance",
    group: "navigate",
    hidden: true,
    run: () => [
      out("."),
      ...SECTIONS.map((s, i) => out(`${i === SECTIONS.length - 1 ? "└──" : "├──"} ${s}/`)),
    ],
  },
  { name: "date", desc: "current date", group: "system", hidden: true, run: () => [out(new Date().toString())] },
  { name: "uname", desc: "", group: "system", hidden: true, run: () => [out("portfolio-sh 1.0 (next.js; typescript) x86_64")] },
  {
    name: "echo",
    args: "<text>",
    desc: "",
    group: "system",
    hidden: true,
    run: (args) => [out(args.join(" "))],
  },
  {
    name: "exit",
    desc: "close the terminal",
    group: "system",
    run: (_a, ctx) => {
      ctx.close();
      return [];
    },
  },
  {
    name: "sudo",
    args: "<cmd>",
    desc: "",
    group: "fun",
    hidden: true,
    run: (args) =>
      args.join(" ").includes("hire")
        ? [ok("permission granted."), hint("→ contact", "contact")]
        : [
            err(`ishaan is not in the sudoers file. This incident has been reported.`),
            dim("(it hasn't)"),
          ],
  },
  {
    name: "matrix",
    desc: "",
    group: "fun",
    hidden: true,
    run: (_a, ctx) => {
      ctx.setEffect("matrix");
      return [ok("rain on. run `matrix off` to stop."), dim("(or type anything — it's just CSS)")];
    },
  },
  {
    name: "vim",
    desc: "",
    group: "fun",
    hidden: true,
    run: () => [dim("Nice try. :q! works here, though — press Esc.")],
  },
  {
    name: "coffee",
    desc: "",
    group: "fun",
    hidden: true,
    run: () => [out("☕  brewing…"), dim("418 I'm a teapot")],
  },
];

function sectionBlurb(s: string) {
  switch (s) {
    case "home":
      return "the 10-second version";
    case "about":
      return "who I am, in my own words";
    case "experience":
      return "three roles, one of them current";
    case "projects":
      return `${projects.length} projects, ${projects.filter((p) => p.featured).length} featured`;
    case "stack":
      return "what I actually use";
    case "contact":
      return "email, LinkedIn, GitHub";
    default:
      return "";
  }
}

export const commandNames = commands.map((c) => c.name);

export function completions(input: string, ctx: CommandContext): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const q = parts[0] ?? "";
    return commandNames.filter((n) => n.startsWith(q) && n !== q);
  }
  const cmd = commands.find((c) => c.name === parts[0]);
  if (!cmd?.complete) return [];
  const q = parts[parts.length - 1];
  return cmd
    .complete(ctx)
    .filter((o) => o.startsWith(q) && o !== q)
    .map((o) => [...parts.slice(0, -1), o].join(" "));
}

export async function execute(raw: string, ctx: CommandContext): Promise<CommandResult> {
  const input = raw.trim();
  if (!input) return [];
  const [name, ...args] = input.split(/\s+/);
  const lower = name.toLowerCase();

  if (lower === "matrix" && args[0] === "off") {
    ctx.setEffect("none");
    return [ok("rain off.")];
  }
  if (input === "rm -rf /" || input.startsWith("rm -rf")) {
    return [warnLine("nope."), { tone: "dim", text: "This portfolio is append-only." }];
  }
  if (lower === "man") {
    const target = commands.find((c) => c.name === args[0]);
    if (!target) return [{ tone: "err", text: `No manual entry for ${args[0] ?? ""}` }];
    return [
      { tone: "accent", text: `${target.name}${target.args ? " " + target.args : ""}` },
      { tone: "out", text: `  ${target.desc || "undocumented"}` },
    ];
  }

  const cmd = commands.find((c) => c.name === lower);
  if (!cmd) {
    const near = commandNames.find((n) => n.startsWith(lower.slice(0, 2)));
    return [
      { tone: "err", text: `command not found: ${name}` },
      near
        ? { tone: "dim", text: `did you mean \`${near}\`?  ·  \`help\` lists everything`, run: near }
        : { tone: "dim", text: "`help` lists everything", run: "help" },
    ];
  }
  return cmd.run(args, ctx);
}

const warnLine = (text: string): CommandResult[number] => ({ tone: "warn", text });
