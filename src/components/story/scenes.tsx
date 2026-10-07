import { buildMap, MAP_VIEWBOX } from "@/lib/map-layout";
import { RANKS } from "@/lib/rank";
import { RankEmblem } from "@/components/rank-emblem";
import { toneVar } from "@/lib/tone";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Remap t from [a, b] to [0, 1]. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (t: number) => 1 - (1 - t) ** 3;
const f2 = (n: number) => n.toFixed(2);
const draw = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });

const W = 600;
const H = 600;

function Svg({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden data-scene={label}>
      {children}
    </svg>
  );
}

function Mono({ x, y, children, anchor = "start", fill = "var(--ink-3)", size = 12 }: {
  x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; fill?: string; size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontFamily="var(--font-geist-mono), monospace" letterSpacing="0.04em">
      {children}
    </text>
  );
}

/* 01 — one neuron: weights grow, the weighted sum crosses the threshold, it fires. */
export function NeuronScene({ t }: { t: number }) {
  const x = [0.8, 0.3, 0.6];
  const target = [0.9, -0.4, 0.7];
  const g = ease(seg(t, 0.05, 0.7));
  const w = target.map((v) => v * g);
  const b = 0.1;
  const z = w.reduce((s, wi, i) => s + wi * x[i], 0) + b;
  const y = 1 / (1 + Math.exp(-6 * (z - 0.5)));
  const fire = seg(t, 0.7, 0.9);
  const ys = [170, 300, 430];
  return (
    <Svg label="neuron">
      {ys.map((yy, i) => (
        <g key={i}>
          <path d={`M132 ${yy} C 220 ${yy}, 230 300, 286 300`} fill="none" stroke={w[i] < 0 ? "var(--cobalt)" : "var(--ink)"} strokeWidth={1 + Math.abs(w[i]) * 7} strokeOpacity={0.25 + Math.abs(w[i]) * 0.75} strokeLinecap="round" />
          <circle cx={110} cy={yy} r={22} fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={1.5} />
          <Mono x={110} y={yy + 4} anchor="middle" fill="var(--ink)" size={13}>{x[i]}</Mono>
          <Mono x={110} y={yy - 30} anchor="middle">x{i + 1}</Mono>
          <Mono x={150} y={yy - 30} fill={w[i] < 0 ? "var(--cobalt)" : "var(--ink-2)"}>
            w{i + 1}={f2(w[i])}
          </Mono>
        </g>
      ))}
      {fire > 0 && <circle cx={340} cy={300} r={56 + fire * 60} fill="none" stroke="var(--signal)" strokeWidth={2} opacity={(1 - fire) * 0.8 + 0.1} />}
      <circle cx={340} cy={300} r={56} fill={fire > 0 ? "var(--signal)" : "var(--paper-raised)"} fillOpacity={fire > 0 ? 0.15 + fire * 0.85 : 1} stroke={fire > 0 ? "var(--signal)" : "var(--ink)"} strokeWidth={2} />
      <text x={340} y={312} textAnchor="middle" fontFamily="var(--font-instrument), serif" fontSize={34} fill={fire > 0.5 ? "var(--paper)" : "var(--ink)"}>Σ</text>
      <path d="M396 300 H500" stroke={fire > 0 ? "var(--signal)" : "var(--rule-strong)"} strokeWidth={2 + y * 4} strokeLinecap="round" />
      <path d="M492 292 L504 300 L492 308" fill="none" stroke={fire > 0 ? "var(--signal)" : "var(--rule-strong)"} strokeWidth={2} />
      <Mono x={512} y={296} fill="var(--ink)" size={14}>{f2(y)}</Mono>
      <Mono x={512} y={314}>output</Mono>
      <g transform="translate(300 530)">
        <Mono x={0} y={0} anchor="middle" fill="var(--ink-2)" size={13}>
          {`σ(${f2(w[0])}·0.8 ${w[1] < 0 ? "−" : "+"} ${f2(Math.abs(w[1]))}·0.3 + ${f2(w[2])}·0.6 + 0.10)`}
        </Mono>
        <Mono x={0} y={24} anchor="middle" fill={fire > 0 ? "var(--signal-ink)" : "var(--ink-3)"} size={13}>
          {fire > 0 ? "→ fires" : "→ below threshold"}
        </Mono>
      </g>
    </Svg>
  );
}

/* 02 — use it well: an AI answer gets fact-checked line by line, then disclosed. */
export function CheckScene({ t }: { t: number }) {
  const claims = [
    { text: "The Eiffel Tower is in Paris.", ok: true },
    { text: "It was finished in 1889.", ok: true },
    { text: "It was designed by Eiffel’s daughter.", ok: false },
  ];
  const stamp = seg(t, 0.72, 0.85);
  return (
    <Svg label="check">
      <rect x={60} y={96} width={480} height={300} rx={6} fill="var(--paper-raised)" stroke="var(--rule-strong)" />
      <Mono x={84} y={128}>AI ANSWER · UNVERIFIED</Mono>
      <path d="M60 142 H540" stroke="var(--rule)" />
      {claims.map((c, i) => {
        const p = seg(t, 0.12 + i * 0.18, 0.26 + i * 0.18);
        const y0 = 190 + i * 64;
        return (
          <g key={i}>
            <text x={84} y={y0} fontSize={19} fill="var(--ink)" fontFamily="var(--font-geist), sans-serif">{c.text}</text>
            {!c.ok && <path d={`M84 ${y0 + 8} H${84 + 342 * p}`} stroke="var(--signal)" strokeWidth={2.5} strokeLinecap="round" />}
            <g opacity={p}>
              <circle cx={506} cy={y0 - 6} r={14} fill={c.ok ? "var(--green)" : "var(--signal)"} />
              <path d={c.ok ? `M499 ${y0 - 6} l5 5 l9 -10` : `M500 ${y0 - 12} l12 12 M512 ${y0 - 12} l-12 12`} stroke="var(--paper)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
              <Mono x={84} y={y0 + 28} fill={c.ok ? "var(--green)" : "var(--signal-ink)"} size={11}>
                {c.ok ? "✓ matches 2 sources" : "✗ no source supports this · hallucination"}
              </Mono>
            </g>
          </g>
        );
      })}
      <g opacity={stamp} transform={`translate(300 470) rotate(${-4 + stamp * 2}) scale(${1.25 - stamp * 0.25})`}>
        <rect x={-210} y={-38} width={420} height={76} rx={4} fill="none" stroke="var(--plum)" strokeWidth={2} />
        <Mono x={0} y={-8} anchor="middle" fill="var(--plum)" size={13}>DISCLOSED · AI USED FOR RESEARCH ONLY</Mono>
        <Mono x={0} y={16} anchor="middle" fill="var(--plum)" size={11}>“Eiffel Tower facts” prompt. ChatGPT, OpenAI, 2026.</Mono>
      </g>
    </Svg>
  );
}

/* 03 — a network: edges wire in layer by layer, signals travel, loss falls. */
const LAYERS = [3, 5, 5, 2];
const LX = [90, 230, 370, 510];
const nodeY = (n: number, i: number) => 220 + (i - (n - 1) / 2) * 66;
const pseudo = (a: number, b: number) => {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export function NetworkScene({ t }: { t: number }) {
  const lossP = seg(t, 0.35, 0.9);
  const pts = Array.from({ length: 41 }, (_, i) => {
    const e = i / 40;
    const l = 0.06 + 0.94 * Math.exp(-4.2 * e) + (pseudo(i, 3) - 0.5) * 0.05 * (1 - e);
    return [90 + e * 420, 540 - clamp(l) * 96] as const;
  });
  const shown = Math.max(1, Math.round(lossP * 40));
  const loss = 2.31 * (0.06 + 0.94 * Math.exp(-4.2 * lossP));
  const travel = (t * 5) % 1;
  return (
    <Svg label="network">
      {LAYERS.slice(0, -1).map((n, L) => {
        const p = ease(seg(t, L * 0.12, L * 0.12 + 0.22));
        return Array.from({ length: n }, (_, i) =>
          Array.from({ length: LAYERS[L + 1] }, (_, j) => {
            const wgt = pseudo(L * 10 + i, j);
            const live = t > 0.45 && wgt > 0.62;
            return (
              <path key={`${L}-${i}-${j}`} d={`M${LX[L]} ${nodeY(n, i)} L${LX[L + 1]} ${nodeY(LAYERS[L + 1], j)}`}
                stroke={live ? "var(--signal)" : "var(--ink)"} strokeOpacity={live ? 0.8 : 0.12 + wgt * 0.3} strokeWidth={0.6 + wgt * 2.2} {...draw(p)} />
            );
          }),
        );
      })}
      {t > 0.45 && LAYERS.slice(0, -1).map((n, L) =>
        Array.from({ length: n }, (_, i) =>
          Array.from({ length: LAYERS[L + 1] }, (_, j) => {
            if (pseudo(L * 10 + i, j) <= 0.62) return null;
            const k = (travel + L * 0.33) % 1;
            const x0 = LX[L], y0 = nodeY(n, i), x1 = LX[L + 1], y1 = nodeY(LAYERS[L + 1], j);
            return <circle key={`d${L}-${i}-${j}`} cx={x0 + (x1 - x0) * k} cy={y0 + (y1 - y0) * k} r={3} fill="var(--signal)" />;
          }),
        ),
      )}
      {LAYERS.map((n, L) =>
        Array.from({ length: n }, (_, i) => {
          const on = seg(t, L * 0.12, L * 0.12 + 0.1);
          return <circle key={`n${L}-${i}`} cx={LX[L]} cy={nodeY(n, i)} r={11} fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={1.5} opacity={on} />;
        }),
      )}
      {["input", "hidden", "hidden", "output"].map((l, i) => <Mono key={i} x={LX[i]} y={64} anchor="middle">{l}</Mono>)}
      <g opacity={seg(t, 0.3, 0.4)}>
        <path d="M90 540 H510 M90 440 V540" stroke="var(--rule-strong)" />
        <path d={`M${pts.slice(0, shown + 1).map(([x, y]) => `${x} ${y}`).join(" L")}`} fill="none" stroke="var(--signal)" strokeWidth={2} />
        <Mono x={90} y={430}>LOSS</Mono>
        <Mono x={510} y={430} anchor="end" fill="var(--ink)" size={13}>{loss.toFixed(2)}</Mono>
        <Mono x={510} y={562} anchor="end">epoch {Math.round(lossP * 40)}/40</Mono>
      </g>
    </Svg>
  );
}

/* 04 — attention: the last word looks back, then a next-word distribution forms. */
const TOKENS = ["The", "cat", "sat", "on", "the"];
const ATTN = [0.05, 0.46, 0.18, 0.09, 0.22];
const NEXT: [string, number][] = [["mat", 0.61], ["floor", 0.17], ["sofa", 0.09], ["moon", 0.02]];

export function AttentionScene({ t }: { t: number }) {
  const tx = (i: number) => 74 + i * 92;
  const arcs = ease(seg(t, 0.08, 0.45));
  const bars = ease(seg(t, 0.45, 0.75));
  const pick = seg(t, 0.78, 0.9);
  const q = tx(4);
  return (
    <Svg label="attention">
      <Mono x={300} y={44} anchor="middle">softmax(QKᵀ / √d) · V</Mono>
      {TOKENS.slice(0, 4).map((_, i) => {
        const x = tx(i);
        const h = 30 + (4 - i) * 18;
        return (
          <g key={i}>
            <path d={`M${q} 168 Q ${(q + x) / 2} ${168 - h * 1.6} ${x} 168`} fill="none" stroke="var(--rust)" strokeWidth={1 + ATTN[i] * 16} strokeOpacity={0.35 + ATTN[i]} strokeLinecap="round" {...draw(arcs)} />
            <Mono x={x} y={238} anchor="middle" fill="var(--rust)" size={11}>{arcs > 0.9 ? ATTN[i].toFixed(2) : ""}</Mono>
          </g>
        );
      })}
      {TOKENS.map((w, i) => (
        <g key={i}>
          <rect x={tx(i) - 40} y={172} width={80} height={44} rx={4} fill={i === 4 ? "var(--rust)" : "var(--paper-raised)"} fillOpacity={i === 4 ? 0.12 : 1} stroke={i === 4 ? "var(--rust)" : "var(--rule-strong)"} />
          <text x={tx(i)} y={200} textAnchor="middle" fontSize={18} fill="var(--ink)" fontFamily="var(--font-geist), sans-serif">{w}</text>
        </g>
      ))}
      <g opacity={pick}>
        <rect x={tx(5) - 40 - 18} y={172} width={80} height={44} rx={4} fill="var(--signal)" />
        <text x={tx(5) - 18} y={200} textAnchor="middle" fontSize={18} fill="var(--paper)" fontFamily="var(--font-geist), sans-serif">mat</text>
      </g>
      <Mono x={74 - 40} y={286}>NEXT-WORD PROBABILITY</Mono>
      {NEXT.map(([w, p], i) => {
        const y = 314 + i * 52;
        const full = 400;
        return (
          <g key={w}>
            <text x={34} y={y + 21} fontSize={17} fill="var(--ink)" fontFamily="var(--font-geist), sans-serif">{w}</text>
            <rect x={110} y={y + 4} width={full} height={24} fill="var(--paper-sunk)" />
            <rect x={110} y={y + 4} width={full * p * bars} height={24} fill={i === 0 ? "var(--signal)" : "var(--ink)"} fillOpacity={i === 0 ? 0.9 : 0.35} />
            <Mono x={110 + full * p * bars + 8} y={y + 21} fill="var(--ink-2)" size={12}>{(p * bars).toFixed(2)}</Mono>
          </g>
        );
      })}
    </Svg>
  );
}

/* 05 — weights: a named tensor fills in, then gets quantized from bf16 to int4. */
const N = 12;
const cell = (i: number, j: number) => Math.sin(i * 1.7 + j * 0.9) * Math.cos(j * 0.37 + i * 0.21) * 0.9 + (pseudo(i, j) - 0.5) * 0.3;

export function WeightsScene({ t }: { t: number }) {
  const fill = seg(t, 0, 0.45);
  const qt = ease(seg(t, 0.55, 0.85));
  const size = 26;
  const ox = 300 - (N * size) / 2;
  const oy = 120;
  const mb = 33.6 - (33.6 - 8.4) * qt;
  return (
    <Svg label="weights">
      <Mono x={ox} y={70} fill="var(--ink)" size={13}>layers.0.attn.q_proj.weight</Mono>
      <Mono x={ox} y={92}>shape [4096, 4096] · 16.8M params</Mono>
      {Array.from({ length: N * N }, (_, k) => {
        const i = Math.floor(k / N), j = k % N;
        if (k / (N * N) > fill) return null;
        const v = clamp(cell(i, j), -1, 1);
        const q = Math.round(v * 2) / 2;
        const shown = v + (q - v) * qt;
        return (
          <rect key={k} x={ox + j * size} y={oy + i * size} width={size - 2} height={size - 2}
            fill={shown >= 0 ? "var(--signal)" : "var(--cobalt)"} fillOpacity={0.08 + Math.abs(shown) * 0.82} />
        );
      })}
      <rect x={ox - 1} y={oy - 1} width={N * size} height={N * size} fill="none" stroke="var(--rule-strong)" />
      <Mono x={ox} y={oy + N * size + 28}>{qt > 0.5 ? "int4 · 4 bits/weight" : "bf16 · 16 bits/weight"}</Mono>
      <Mono x={ox + N * size} y={oy + N * size + 28} anchor="end" fill="var(--ink)" size={14}>{mb.toFixed(1)} MB</Mono>
      <g transform={`translate(${ox} ${oy + N * size + 46})`}>
        <rect width={N * size} height={8} fill="var(--paper-sunk)" />
        <rect width={(N * size * mb) / 33.6} height={8} fill="var(--olive)" />
      </g>
    </Svg>
  );
}

/* 06 — an agent: a loop of observe → think → act → check, with a guarded tool. */
const STEPS = ["observe", "think", "act", "check"];
const LOG = [
  "› observe  “find 3 sources on coral bleaching”",
  "› think    need search, then summarize",
  "› act      search(“coral bleaching 2025”)",
  "› check    3 results, all cited ✓",
];

export function AgentScene({ t }: { t: number }) {
  const cx = 300, cy = 240, r = 138;
  const pos = seg(t, 0.05, 0.85) * 4;
  const ang = (k: number) => -Math.PI / 2 + (k * Math.PI) / 2;
  const dotA = ang(pos);
  const cur = Math.min(3, Math.floor(pos));
  return (
    <Svg label="agent">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rule-strong)" strokeDasharray="4 6" />
      <path d={`M${cx} ${cy - r} A ${r} ${r} 0 ${pos > 2 ? 1 : 0} 1 ${cx + r * Math.cos(dotA)} ${cy + r * Math.sin(dotA)}`} fill="none" stroke="var(--slate)" strokeWidth={3} opacity={pos > 0.01 ? 1 : 0} />
      <circle cx={cx + r * Math.cos(dotA)} cy={cy + r * Math.sin(dotA)} r={7} fill="var(--signal)" />
      {STEPS.map((s, k) => {
        const a = ang(k);
        const on = k <= cur && pos > 0;
        return (
          <g key={s}>
            <rect x={cx + r * Math.cos(a) - 50} y={cy + r * Math.sin(a) - 18} width={100} height={36} rx={18} fill={k === cur ? "var(--ink)" : "var(--paper-raised)"} stroke={on ? "var(--ink)" : "var(--rule-strong)"} />
            <Mono x={cx + r * Math.cos(a)} y={cy + r * Math.sin(a) + 4} anchor="middle" fill={k === cur ? "var(--paper)" : "var(--ink)"} size={12}>{s.toUpperCase()}</Mono>
          </g>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="var(--font-instrument), serif" fontSize={30} fill="var(--ink)">agent</text>
      <Mono x={cx} y={cy + 20} anchor="middle">step {Math.min(4, Math.floor(pos) + 1)} / max 8</Mono>
      <g transform="translate(46 420)">
        {["search()", "summarize()", "send_email()"].map((tool, i) => (
          <g key={tool} transform={`translate(${i * 172} 0)`}>
            <rect width={160} height={30} rx={4} fill="var(--paper-raised)" stroke={i === 2 ? "var(--signal)" : "var(--rule-strong)"} strokeDasharray={i === 2 ? "4 3" : undefined} />
            <Mono x={12} y={20} fill="var(--ink)" size={12}>{tool}</Mono>
            {i === 2 && <Mono x={0} y={48} fill="var(--signal-ink)" size={10}>⚠ NEEDS HUMAN APPROVAL</Mono>}
          </g>
        ))}
      </g>
      {LOG.map((l, i) => (
        <g key={i} opacity={seg(pos, i, i + 0.4)}>
          <Mono x={46} y={500 + i * 22} fill={i === cur ? "var(--ink)" : "var(--ink-3)"} size={12}>{l}</Mono>
        </g>
      ))}
    </Svg>
  );
}

/* 07 — the brain map lights up lesson by lesson while the rank climbs. */
const clusters = buildMap();
const allNodes = clusters.flatMap((c) => c.nodes.map((n) => ({ ...n, cx: c.cx, cy: c.cy })));

export function MapScene({ t }: { t: number }) {
  const lit = seg(t, 0.05, 0.85) * allNodes.length;
  const rating = Math.round(seg(t, 0.05, 0.85) * RANKS[RANKS.length - 1].min);
  let ri = 0;
  for (let i = 0; i < RANKS.length; i++) if (rating >= RANKS[i].min) ri = i;
  const rank = RANKS[ri];
  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} className="absolute inset-y-0 left-0 h-full" aria-hidden data-scene="map" style={{ width: `${(MAP_VIEWBOX.w / MAP_VIEWBOX.h) * 100}%`, maxWidth: "68%" }}>
        {allNodes.map((n, k) => (
          <path key={`e${k}`} d={`M${n.cx} ${n.cy} L${n.x} ${n.y}`} stroke={k < lit ? toneVar(n.module.tone) : "var(--rule)"} strokeWidth={k < lit ? 2 : 1} />
        ))}
        {clusters.map((c) => (
          <circle key={c.module.id} cx={c.cx} cy={c.cy} r={9} fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={1.5} />
        ))}
        {allNodes.map((n, k) => (
          <circle key={k} cx={n.x} cy={n.y} r={k < lit ? 13 : 10} fill={k < lit ? toneVar(n.module.tone) : "var(--paper-raised)"} stroke={k < lit ? toneVar(n.module.tone) : "var(--rule-strong)"} strokeWidth={1.5} strokeDasharray={k < lit ? undefined : "3 3"} />
        ))}
      </svg>
      <div className="absolute right-0 top-1/2 flex w-[34%] -translate-y-1/2 flex-col items-center text-center" aria-hidden>
        <RankEmblem rank={rank} className="w-[min(7rem,80%)]" />
        <span className="mt-3 font-display text-[clamp(1.1rem,2.2vw,1.75rem)] leading-tight">{rank.name}</span>
        <span className="label mt-2 tabular">{rating} rating</span>
        <span className="label mt-1 tabular">{Math.min(allNodes.length, Math.floor(lit))}/{allNodes.length} lessons</span>
      </div>
    </div>
  );
}
