"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";
export type TextScale = "100" | "112" | "125";

interface SettingsState {
  theme: Theme;
  contrast: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
  textScale: TextScale;
  set: (patch: Partial<Omit<SettingsState, "set">>) => void;
}

export const SETTINGS_KEY = "neuron-settings";

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      contrast: false,
      readableFont: false,
      reduceMotion: false,
      textScale: "100",
      set: (patch) => set(patch),
    }),
    { name: SETTINGS_KEY, version: 1, skipHydration: true },
  ),
);

/** Inline, pre-paint script so saved settings apply before first render (no flash). */
export const settingsBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem("${SETTINGS_KEY}")||"{}").state||{};var d=document.documentElement;var t=s.theme||"system";if(t==="system"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;if(s.contrast)d.dataset.contrast="high";if(s.readableFont)d.dataset.font="readable";if(s.reduceMotion)d.dataset.motion="reduce";if(s.textScale)d.dataset.scale=s.textScale}catch(e){}})();`;
