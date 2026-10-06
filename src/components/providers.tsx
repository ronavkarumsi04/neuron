"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { AwardToasts } from "@/components/award-toasts";
import { TourBar } from "@/components/judge/tour-bar";
import { useJudge } from "@/lib/judge";
import { useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";

function useApplySettings() {
  const { theme, contrast, readableFont, reduceMotion, textScale } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const toggle = (key: string, on: boolean, value: string) => {
      if (on) root.dataset[key] = value;
      else delete root.dataset[key];
    };
    toggle("contrast", contrast, "high");
    toggle("font", readableFont, "readable");
    toggle("motion", reduceMotion, "reduce");
    toggle("scale", textScale !== "100", textScale);
  }, [contrast, readableFont, reduceMotion, textScale]);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useSettings.persist.rehydrate();
    void useProgress.persist.rehydrate();
    void useJudge.persist.rehydrate();
  }, []);
  useApplySettings();
  const reduceMotion = useSettings((s) => s.reduceMotion);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      {children}
      <AwardToasts />
      <TourBar />
    </MotionConfig>
  );
}
