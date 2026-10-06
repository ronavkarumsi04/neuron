import { lessonKey, modules, type Module } from "@/content/curriculum";

export interface MapNode {
  key: string;
  module: Module;
  lessonIndex: number;
  x: number;
  y: number;
}

export interface MapCluster {
  module: Module;
  cx: number;
  cy: number;
  nodes: MapNode[];
}

/** Hand-placed cluster centers so the map reads like a drawn diagram, not a force layout. */
const CENTERS: Record<string, [number, number, number]> = {
  foundations: [175, 165, -2.2],
  toolkit: [470, 145, -1.4],
  ethics: [320, 365, -0.6],
  future: [565, 375, -1.9],
};

export const MAP_VIEWBOX = { w: 680, h: 500 };

export function buildMap(): MapCluster[] {
  return modules.map((module) => {
    const [cx, cy, start] = CENTERS[module.id];
    const n = module.lessons.length;
    const radius = module.bonus ? 52 : 74;
    const nodes = module.lessons.map((lesson, i) => {
      const angle = start + (i * Math.PI * 2) / n;
      const wobble = i % 2 === 0 ? 1 : 0.86;
      return {
        key: lessonKey(module.id, lesson.slug),
        module,
        lessonIndex: i,
        x: Math.round(cx + Math.cos(angle) * radius * wobble),
        y: Math.round(cy + Math.sin(angle) * radius * wobble),
      };
    });
    return { module, cx, cy, nodes };
  });
}

/** Long-range synapses between module hubs. */
export const BRIDGES: [string, string][] = [
  ["foundations", "toolkit"],
  ["foundations", "ethics"],
  ["toolkit", "ethics"],
  ["ethics", "future"],
  ["toolkit", "future"],
];
