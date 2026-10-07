"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useProgress, type Award } from "@/lib/progress";

function Toast({ award }: { award: Award }) {
  const dismiss = useProgress((s) => s.dismissAward);
  useEffect(() => {
    const t = setTimeout(() => dismiss(award.id), 4200);
    return () => clearTimeout(t);
  }, [award.id, dismiss]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="pointer-events-auto flex min-w-64 items-center gap-3 rounded-md border border-rule-strong bg-paper-raised px-4 py-3 shadow-[var(--shadow-lift)]"
    >
      {award.badge ? (
        <>
          <svg aria-hidden viewBox="0 0 24 24" className="size-6 shrink-0 text-signal">
            <path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.3 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5z" fill="currentColor" />
          </svg>
          <div>
            <p className="label !text-signal-ink">Badge unlocked</p>
            <p className="font-medium">{award.badge.name}</p>
          </div>
        </>
      ) : (
        <>
          <span className="font-mono text-lg font-medium text-signal tabular">+{award.xp}</span>
          <div>
            <p className="label">Experience</p>
            <p className="font-medium">{award.levelUp ? `Level up — ${award.levelUp}` : "Neuron activated"}</p>
          </div>
        </>
      )}
    </motion.li>
  );
}

export function AwardToasts() {
  const awards = useProgress((s) => s.awards);
  return (
    <ol
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-50 print:hidden flex flex-col items-end gap-2"
    >
      <AnimatePresence initial={false}>
        {awards.slice(-3).map((a) => (
          <Toast key={a.id} award={a} />
        ))}
      </AnimatePresence>
    </ol>
  );
}
