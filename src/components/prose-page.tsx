export function ProsePage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10">
      <p className="label">{eyebrow}</p>
      <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">{intro}</p>
      <div className="lesson-prose mt-10">{children}</div>
    </div>
  );
}
