export const GRID = 16;
const D = GRID * GRID;
const H = 32;

export interface Net {
  k: number;
  w1: Float32Array;
  b1: Float32Array;
  w2: Float32Array;
  b2: Float32Array;
}

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
}

export function makeNet(k: number, seed = 7): Net {
  const r = rng(seed);
  const w1 = new Float32Array(H * D).map(() => gauss(r) * Math.sqrt(2 / D));
  const w2 = new Float32Array(k * H).map(() => gauss(r) * Math.sqrt(2 / H));
  return { k, w1, b1: new Float32Array(H), w2, b2: new Float32Array(k) };
}

export function forward(net: Net, x: Float32Array) {
  const h = new Float32Array(H);
  for (let j = 0; j < H; j++) {
    let s = net.b1[j];
    const o = j * D;
    for (let i = 0; i < D; i++) s += net.w1[o + i] * x[i];
    h[j] = s > 0 ? s : 0;
  }
  const z = new Float32Array(net.k);
  let max = -Infinity;
  for (let c = 0; c < net.k; c++) {
    let s = net.b2[c];
    for (let j = 0; j < H; j++) s += net.w2[c * H + j] * h[j];
    z[c] = s;
    if (s > max) max = s;
  }
  let sum = 0;
  for (let c = 0; c < net.k; c++) sum += z[c] = Math.exp(z[c] - max);
  for (let c = 0; c < net.k; c++) z[c] /= sum;
  return { h, p: z };
}

export function trainEpoch(net: Net, xs: Float32Array[], ys: number[], lr: number, seed: number) {
  const r = rng(seed);
  const order = xs.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  let loss = 0;
  let correct = 0;
  const dh = new Float32Array(H);
  for (const n of order) {
    const x = xs[n];
    const y = ys[n];
    const { h, p } = forward(net, x);
    loss -= Math.log(p[y] + 1e-9);
    let best = 0;
    for (let c = 1; c < net.k; c++) if (p[c] > p[best]) best = c;
    if (best === y) correct++;
    dh.fill(0);
    for (let c = 0; c < net.k; c++) {
      const dz = p[c] - (c === y ? 1 : 0);
      for (let j = 0; j < H; j++) {
        dh[j] += net.w2[c * H + j] * dz;
        net.w2[c * H + j] -= lr * dz * h[j];
      }
      net.b2[c] -= lr * dz;
    }
    for (let j = 0; j < H; j++) {
      if (h[j] <= 0) continue;
      const g = dh[j];
      net.b1[j] -= lr * g;
      const o = j * D;
      for (let i = 0; i < D; i++) if (x[i]) net.w1[o + i] -= lr * g * x[i];
    }
  }
  return { loss: loss / xs.length, acc: correct / xs.length };
}

export function hiddenWeights(net: Net, j: number) {
  return net.w1.subarray(j * D, (j + 1) * D);
}

export function shift(x: Float32Array, dx: number, dy: number) {
  const out = new Float32Array(D);
  for (let y = 0; y < GRID; y++)
    for (let xx = 0; xx < GRID; xx++) {
      const sx = xx - dx;
      const sy = y - dy;
      if (sx >= 0 && sx < GRID && sy >= 0 && sy < GRID) out[y * GRID + xx] = x[sy * GRID + sx];
    }
  return out;
}

export type Pt = [number, number];

export function rasterize(strokes: Pt[][]): Float32Array | null {
  const pts = strokes.flat();
  if (pts.length < 2) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const span = Math.max(maxX - minX, maxY - minY, 24);
  const half = span / 2 + span * 0.16 + 4;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const R = GRID * 2;
  const c = document.createElement("canvas");
  c.width = c.height = R;
  const ctx = c.getContext("2d")!;
  ctx.lineCap = ctx.lineJoin = "round";
  ctx.lineWidth = R * 0.1;
  ctx.strokeStyle = "#000";
  const map = ([x, y]: Pt): Pt => [((x - cx + half) / (2 * half)) * R, ((y - cy + half) / (2 * half)) * R];
  for (const s of strokes) {
    if (!s.length) continue;
    ctx.beginPath();
    const [x0, y0] = map(s[0]);
    ctx.moveTo(x0, y0);
    if (s.length === 1) ctx.lineTo(x0 + 0.1, y0);
    for (const p of s.slice(1)) ctx.lineTo(...map(p));
    ctx.stroke();
  }
  const img = ctx.getImageData(0, 0, R, R).data;
  const out = new Float32Array(D);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      let a = 0;
      for (let oy = 0; oy < 2; oy++) for (let ox = 0; ox < 2; ox++) a += img[((y * 2 + oy) * R + x * 2 + ox) * 4 + 3];
      out[y * GRID + x] = a / (4 * 255);
    }
  return out;
}

export type ShapeKind = "circle" | "triangle" | "zigzag";

export function sampleShape(kind: ShapeKind, r: () => number = Math.random): Pt[][] {
  const j = () => (r() - 0.5) * 6;
  const cx = 120 + (r() - 0.5) * 40;
  const cy = 120 + (r() - 0.5) * 40;
  if (kind === "circle") {
    const rx = 45 + r() * 40;
    const ry = rx * (0.75 + r() * 0.5);
    const a0 = r() * Math.PI * 2;
    const turn = 0.92 + r() * 0.15;
    return [Array.from({ length: 34 }, (_, i): Pt => {
      const a = a0 + (i / 33) * Math.PI * 2 * turn;
      return [cx + Math.cos(a) * rx + j(), cy + Math.sin(a) * ry + j()];
    })];
  }
  if (kind === "triangle") {
    const size = 50 + r() * 40;
    const rot = (r() - 0.5) * 0.8 - Math.PI / 2;
    const v = [0, 1, 2, 0].map((k): Pt => [cx + Math.cos(rot + (k * 2 * Math.PI) / 3) * size, cy + Math.sin(rot + (k * 2 * Math.PI) / 3) * size]);
    const pts: Pt[] = [];
    for (let k = 0; k < 3; k++)
      for (let t = 0; t < 10; t++) pts.push([v[k][0] + ((v[k + 1][0] - v[k][0]) * t) / 10 + j(), v[k][1] + ((v[k + 1][1] - v[k][1]) * t) / 10 + j()]);
    pts.push(v[3]);
    return [pts];
  }
  const peaks = 3 + Math.floor(r() * 3);
  const w = 120 + r() * 60;
  const h = 30 + r() * 40;
  return [Array.from({ length: peaks * 2 + 1 }, (_, i): Pt => [cx - w / 2 + (i / (peaks * 2)) * w + j(), cy + (i % 2 ? -h / 2 : h / 2) + j()])];
}
