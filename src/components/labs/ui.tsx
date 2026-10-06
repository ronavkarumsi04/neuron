import clsx from "clsx";

export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-rule-strong px-4 text-ink-2 transition-colors duration-150 hover:bg-paper-sunk hover:text-ink disabled:cursor-not-allowed disabled:opacity-40",
  quiet: "text-sm text-ink-2 underline underline-offset-4 hover:text-ink",
};

export function Panel({ title, label, children, className }: { title?: string; label?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-md border border-rule-strong bg-paper-raised", className)}>
      {(title || label) && (
        <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3 sm:px-5">
          {title && <h2 className="font-medium text-ink">{title}</h2>}
          {label && <span className="label">{label}</span>}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Done({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="flex items-start gap-2 border-l-2 border-green pl-3 text-ink">
      <svg aria-hidden viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-green"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>{children}</span>
    </p>
  );
}
