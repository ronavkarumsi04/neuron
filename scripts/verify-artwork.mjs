import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pngs = new Map([
  ["public/neuron-media-artwork-1024.png", 1024],
  ["public/neuron-icon-512.png", 512],
  ["public/neuron-icon-192.png", 192],
  ["src/app/apple-icon.png", 180],
]);

for (const [path, expected] of pngs) {
  const bytes = readFileSync(join(root, path));
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", path + ": PNG signature");
  assert.equal(bytes.readUInt32BE(16), expected, path + ": width");
  assert.equal(bytes.readUInt32BE(20), expected, path + ": height");
  assert.equal(bytes[25], 2, path + ": opaque truecolor PNG");
  assert.ok(bytes.length > 5000, path + ": nonempty artwork");
}
const media = readFileSync(join(root, "src/components/read-aloud.tsx"), "utf8");
assert.match(media, /new MediaMetadata\([\s\S]*neuron-media-artwork-1024\.png[\s\S]*1024x1024[\s\S]*image\/png/);
assert.doesNotMatch(media, /artwork:\s*\[\s*\{[^}]*icon\.svg/);
const manifest = readFileSync(join(root, "src/app/manifest.ts"), "utf8");
assert.match(manifest, /neuron-icon-192\.png/);
assert.match(manifest, /neuron-icon-512\.png/);
console.log("PASS: vector-derived 1024px media art, PNG fallbacks, Apple icon and MediaMetadata");
