"use client";

import Link from "next/link";
import { useMemo } from "react";
import { lessonKey, modules } from "@/content/curriculum";
import { BRIDGES, buildMap, MAP_VIEWBOX, type MapNode } from "@/lib/map-layout";
import { strengthOf, type Strength } from "@/lib/memory";
import { coreComplete, useProgress } from "@/lib/progress";

type NodeState = "done" | "next" | "open" | "locked";

const TONE: Record<string, string> = {
  cobalt: "var(--cobalt)",
  green: "var(--green)",
  plum: "var(--plum)",
  gold: "var(--gold)",
};

export function useNodeStates() {
  const completed = useProgress((s) => s.completed);
  const memory = useProgress((s) => s.memory);
  return useMemo(() => {
    const done = new Set(completed);
    const coreDone = coreComplete(completed);
    const states = new Map<string, NodeState>();
    let nextAssigned = false;
    for (const m of modules) {
      const locked = m.bonus && !coreDone;
      m.lessons.forEach((l, i) => {
        const key = lessonKey(m.id, l.slug);
        if (done.has(key)) states.set(key, "done");
        else if (locked) states.set(key, "locked");
        else if (!nextAssigned && (i === 0 || done.has(lessonKey(m.id, m.lessons[i - 1].slug)))) {
          states.set(key, "next");
          nextAssigned = true;
        } else states.set(key, "open");
      });
    }
    const strength = new Map<string, Strength>();
    for (const key of completed) strength.set(key, strengthOf(memory[key]));
    const due = [...strength.values()].filter((v) => v !== "fresh").length;
    return { states, strength, doneCount: done.size, due };
  }, [completed, memory]);
}

const FADE: Record<Strength, number> = { fresh: 1, fading: 0.55, faded: 0.28 };

function Neuron({ node, state, strength = "fresh" }: { node: MapNode; state: NodeState; strength?: Strength }) {
  const lesson = node.module.lessons[node.lessonIndex];
  const color = TONE[node.module.tone];
  const r = 9;
  const label = `${lesson.title}, module ${node.module.number}. ${
    { done: "Completed", next: "Up next", open: "Not started", locked: "Locked" }[state]
  }${state === "done" && strength !== "fresh" ? `, ${strength}: review due` : ""}`;
  const fade = state === "done" ? FADE[strength] : 1;

  const body = (
    <g className="group">
      {state === "next" && (
        <circle cx={node.x} cy={node.y} r={r} fill="none" stroke="var(--signal)" strokeWidth="1.5" className="pulse" style={{ ["--r0" as string]: `${r}px` }} />
      )}
      <circle cx={node.x} cy={node.y} r={r + 9} fill="transparent" />
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill={state === "done" ? color : "var(--paper-raised)"}
        fillOpacity={fade}
        stroke={state === "next" ? "var(--signal)" : state === "locked" ? "var(--rule-strong)" : color}
        strokeWidth={state === "next" ? 2.5 : 1.5}
        strokeDasharray={state === "locked" ? "2 3" : undefined}
        className="transition-[r] duration-200 group-hover:[r:11px] group-focus-visible:[r:11px]"
      />
      {state === "done" && <circle cx={node.x} cy={node.y} r={3} fill="var(--paper-raised)" />}
      {state === "done" && strength !== "fresh" && (
        <circle cx={node.x} cy={node.y} r={r + 4} fill="none" stroke={color} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 3" />
      )}
    </g>
  );

  if (state === "locked") {
    return (
      <g role="img" aria-label={label}>
        <title>{label}</title>
        {body}
      </g>
    );
  }
  return (
    <Link href={`/modules/${node.module.id}/${lesson.slug}`} aria-label={label} className="outline-none">
      <title>{label}</title>
      {body}
    </Link>
  );
}

export function BrainMap({ className, showLabels = true }: { className?: string; showLabels?: boolean }) {
  const clusters = useMemo(buildMap, []);
  const { states, strength } = useNodeStates();
  const hub = (id: string) => clusters.find((c) => c.module.id === id)!;

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
      className={className}
      role="group"
      aria-label="Brain map of every lesson. Each circle is a lesson; filled circles are complete, and pale ones are fading and due for review."
    >
      <g stroke="var(--rule-strong)" strokeWidth="1" fill="none">
        {BRIDGES.map(([a, b]) => {
          const A = hub(a);
          const B = hub(b);
          const mx = (A.cx + B.cx) / 2;
          const my = (A.cy + B.cy) / 2 - 30;
          return <path key={`${a}-${b}`} d={`M${A.cx},${A.cy} Q${mx},${my} ${B.cx},${B.cy}`} strokeDasharray="1 5" strokeLinecap="round" />;
        })}
      </g>

      {clusters.map(({ module, cx, cy, nodes }) => {
        const color = TONE[module.tone];
        return (
          <g key={module.id}>
            {nodes.map((n, i) => {
              const s = states.get(n.key);
              const prev = nodes[(i - 1 + nodes.length) % nodes.length];
              const prevDone = states.get(prev.key) === "done";
              const live = s === "done";
              const op = live ? FADE[strength.get(n.key) ?? "fresh"] : 1;
              return (
                <g key={`e-${n.key}`}>
                  <line x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={live ? color : "var(--rule)"} strokeOpacity={op} strokeWidth={live ? 1.5 : 1} className={live ? "synapse-live" : undefined} />
                  {i > 0 && (
                    <line x1={prev.x} y1={prev.y} x2={n.x} y2={n.y} stroke={live && prevDone ? color : "var(--rule)"} strokeWidth="1" />
                  )}
                </g>
              );
            })}
            <rect x={cx - 7} y={cy - 7} width="14" height="14" transform={`rotate(45 ${cx} ${cy})`} fill="var(--paper)" stroke={color} strokeWidth="1.5" />
            {showLabels && (
              <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.08em" fill="var(--ink-3)">
                <text x={cx} y={cy - (module.bonus ? 70 : 96)} textAnchor="middle">
                  <tspan fill={color}>{module.number}</tspan> {module.title.toUpperCase()}
                </text>
              </g>
            )}
            {nodes.map((n) => (
              <Neuron key={n.key} node={n} state={states.get(n.key) ?? "open"} strength={strength.get(n.key)} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
