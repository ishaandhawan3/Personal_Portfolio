import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  title,
  kicker,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={["relative scroll-mt-20 py-20 sm:py-28", className].filter(Boolean).join(" ")}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/[0.07] pb-5 sm:mb-14">
            <div>
              <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">
                <span className="text-ink-600">{index}</span>
                <span className="h-px w-6 bg-accent/30" />
                <span>{id}</span>
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-white sm:text-[32px]">{title}</h2>
            </div>
            {kicker && (
              <p className="hidden max-w-xs text-right text-[13px] leading-relaxed text-ink-400 sm:block">{kicker}</p>
            )}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
