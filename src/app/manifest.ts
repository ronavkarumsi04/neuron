import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neuron: Learn how AI actually works",
    short_name: "Neuron",
    description: "An interactive AI learning portal for high school students.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      // Raster fallbacks for device launchers that do not support SVG icons.
      { src: "/neuron-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/neuron-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
