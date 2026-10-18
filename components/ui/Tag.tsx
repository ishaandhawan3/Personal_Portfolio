export default function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-1 font-mono text-[11.5px] leading-none transition-colors",
        accent
          ? "border-accent/25 bg-accent/[0.07] text-accent"
          : "border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/[0.16] hover:text-ink-100",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
