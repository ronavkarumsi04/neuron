export interface Applicant { south: boolean; skill: number; ability: number; internship: boolean; past: boolean }
export interface Fixes { rebalance: boolean; dropZip: boolean; dropInternship: boolean; relabel: boolean }

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const QUALIFIED = 60;
export const qualified = (a: Applicant) => a.ability >= QUALIFIED;

function people(n: number, south: boolean, seed: number): Applicant[] {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const g = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
    const ability = 62 + g * 14;
    const g2 = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
    const skill = Math.max(20, Math.min(100, Math.round(ability + g2 * 5)));
    const internship = r() < (south ? 0.12 : 0.5) + (skill - 62) / 300;
    const noise = (r() - 0.5) * 10;
    const past = skill + (internship ? 8 : 0) - (south ? 14 : 0) + noise >= 64;
    return { south, skill, ability, internship, past };
  });
}

const POOL_NORTH = people(400, false, 11);
const POOL_SOUTH = people(400, true, 12);
export const TEST = [...people(150, false, 21), ...people(150, true, 22)];

export const FEATURES = ["Skill test score", "Prior internship", "ZIP code (Southside)"] as const;

function featurize(a: Applicant, f: Fixes) {
  return [(a.skill - 62) / 14, f.dropInternship ? 0 : +a.internship, f.dropZip ? 0 : +a.south];
}

export function trainingSet(f: Fixes) {
  return f.rebalance ? [...POOL_NORTH.slice(0, 200), ...POOL_SOUTH.slice(0, 200)] : [...POOL_NORTH.slice(0, 340), ...POOL_SOUTH.slice(0, 60)];
}

export function run(f: Fixes) {
  const data = trainingSet(f);
  const xs = data.map((a) => featurize(a, f));
  const ys = data.map((a) => (f.relabel ? +qualified(a) : +a.past));
  const w = [0, 0, 0];
  let b = 0;
  for (let it = 0; it < 600; it++) {
    const g = [0, 0, 0];
    let gb = 0;
    for (let n = 0; n < xs.length; n++) {
      const z = b + w[0] * xs[n][0] + w[1] * xs[n][1] + w[2] * xs[n][2];
      const e = 1 / (1 + Math.exp(-z)) - ys[n];
      for (let k = 0; k < 3; k++) g[k] += e * xs[n][k];
      gb += e;
    }
    for (let k = 0; k < 3; k++) w[k] -= (1.0 * g[k]) / xs.length;
    b -= (1.0 * gb) / xs.length;
  }
  const decide = (a: Applicant) => {
    const x = featurize(a, f);
    return b + w[0] * x[0] + w[1] * x[1] + w[2] * x[2] > 0;
  };
  const group = (south: boolean) => {
    const g = TEST.filter((a) => a.south === south);
    const q = g.filter(qualified);
    const accepted = g.filter(decide);
    return {
      people: g.map((a) => ({ skill: a.skill, accepted: decide(a), qualified: qualified(a) })),
      acceptRate: accepted.length / g.length,
      missed: q.filter((a) => !decide(a)).length / q.length,
      correct: g.filter((a) => decide(a) === qualified(a)).length,
    };
  };
  const north = group(false);
  const south = group(true);
  return {
    weights: w,
    north,
    south,
    accuracy: (north.correct + south.correct) / TEST.length,
    gap: Math.abs(north.missed - south.missed),
    trainCounts: { north: data.filter((a) => !a.south).length, south: data.filter((a) => a.south).length },
  };
}
