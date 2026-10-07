"use client";

import type { LabId } from "@/content/labs";
import { getModule, lockReason, type ModuleId } from "@/content/curriculum";
import { useModuleLocked, useProgress, XP } from "@/lib/progress";
import { BiasLab } from "./bias-lab";
import { Capstone } from "./capstone";
import { Hallucination } from "./hallucination";
import { IntegritySim } from "./integrity-sim";
import { PromptLab } from "./prompt-lab";
import { TeachTheMachine } from "./teach-the-machine";

const LABS: Record<LabId, () => React.ReactNode> = {
  "teach-the-machine": TeachTheMachine,
  "prompt-lab": PromptLab,
  "spot-the-hallucination": Hallucination,
  "bias-lab": BiasLab,
  "integrity-sim": IntegritySim,
  capstone: Capstone,
};

export function LabRunner({ id, moduleId }: { id: LabId; moduleId: ModuleId }) {
  const locked = useModuleLocked(moduleId);
  const Lab = LABS[id];
  if (locked)
    return (
      <div className="mt-10 rounded-md border border-dashed border-rule-strong p-6 text-ink-2">
        <p className="label">Locked</p>
        <p className="mt-2">{lockReason(getModule(moduleId)!)}</p>
      </div>
    );
  return <Lab />;
}

export function LabStatus({ id }: { id: LabId }) {
  const done = useProgress((s) => s.labs.includes(id));
  return done ? (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-green">
      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Complete
    </span>
  ) : (
    <span className="font-mono text-xs uppercase tracking-wider text-ink-3">
      +{XP.lab} XP
    </span>
  );
}
