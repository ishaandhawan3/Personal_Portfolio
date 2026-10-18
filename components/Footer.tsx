import { profile } from "@/lib/data/profile";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 font-mono text-[11.5px] text-ink-600 sm:flex-row sm:items-center sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="hidden sm:inline">·</span>
        <span>Next.js · TypeScript · Tailwind · Motion</span>
        <span className="sm:ml-auto">
          press <kbd className="rounded border border-white/10 px-1 text-ink-400">`</kbd> for the shell
        </span>
      </div>
    </footer>
  );
}
