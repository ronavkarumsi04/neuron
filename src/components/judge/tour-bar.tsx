"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TOUR, useJudge } from "@/lib/judge";

export function TourBar() {
  const { active, step, minimized, go, exit, setMinimized } = useJudge();
  const router = useRouter();
  const pathname = usePathname();
  if (!active) return null;
  const stop = TOUR[step];
  const here = pathname === stop.href;
  const move = (n: number) => {
    go(n);
    router.push(TOUR[Math.max(0, Math.min(TOUR.length - 1, n))].href);
  };

  if (minimized)
    return (
      <button type="button" onClick={() => setMinimized(false)} className="fixed bottom-4 left-4 z-40 print:hidden inline-flex min-h-11 items-center gap-2 rounded-sm border border-ink bg-paper-raised px-4 font-mono text-xs uppercase tracking-wide text-ink shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)]">
        <span className="size-2 rounded-full bg-signal" aria-hidden />
        Judge tour · {step + 1}/{TOUR.length}
      </button>
    );

  return (
    <section aria-label="Judge tour" className="fixed inset-x-3 bottom-3 z-40 print:hidden rounded-md border border-ink bg-paper-raised shadow-[0_16px_40px_-20px_rgb(0_0_0/0.45)] sm:inset-x-auto sm:left-4 sm:w-[25rem]">
      <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <p className="label flex items-center gap-2 !text-ink">
          <span className="size-2 rounded-full bg-signal" aria-hidden />
          Judge tour · {step + 1}/{TOUR.length}
          <span className="text-ink-3">· {stop.meets}</span>
        </p>
        <button type="button" onClick={() => setMinimized(true)} className="rounded-sm px-1.5 text-sm text-ink-3 hover:text-ink" aria-label="Minimize tour">
          –
        </button>
      </header>
      <div className="px-4 py-3" aria-live="polite">
        <h2 className="font-display text-[1.45rem] leading-tight">{stop.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{stop.text}</p>
        {!here && (
          <Link href={stop.href} className="mt-2 inline-block text-sm text-signal-ink underline underline-offset-4">
            Go to this stop
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-rule px-4 py-2.5">
        <div className="mr-auto flex gap-1" aria-hidden>
          {TOUR.map((_, i) => (
            <span key={i} className={`h-1 w-3 rounded-full ${i <= step ? "bg-ink" : "bg-rule-strong"}`} />
          ))}
        </div>
        <button type="button" onClick={exit} className="min-h-9 whitespace-nowrap px-1.5 text-sm text-ink-3 hover:text-ink">End tour</button>
        <button type="button" disabled={step === 0} onClick={() => move(step - 1)} className="min-h-9 rounded-sm border border-rule-strong px-3 text-sm disabled:opacity-40">Back</button>
        {step < TOUR.length - 1 ? (
          <button type="button" onClick={() => move(step + 1)} className="min-h-9 rounded-sm bg-ink px-3 text-sm font-medium text-paper">Next</button>
        ) : (
          <button type="button" onClick={exit} className="min-h-9 rounded-sm bg-ink px-3 text-sm font-medium text-paper">Finish</button>
        )}
      </div>
    </section>
  );
}

export function StartTour({ className, children = "Start the 3-minute tour" }: { className?: string; children?: React.ReactNode }) {
  const start = useJudge((s) => s.start);
  const router = useRouter();
  return (
    <button type="button" className={className} onClick={() => { start(); router.push(TOUR[0].href); }}>
      {children}
    </button>
  );
}
