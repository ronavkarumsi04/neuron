"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { AwardToasts } from "@/components/award-toasts";
import { TourBar } from "@/components/judge/tour-bar";
import { RankWatcher } from "@/components/rank-watcher";
import { useJudge } from "@/lib/judge";
import { lessonKey, modules } from "@/content/curriculum";
import { labs } from "@/content/labs";
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

const OFFLINE_ROUTES = [
  "/", "/map", "/labs", "/profile", "/review", "/assessment", "/glossary", "/certificate", "/about", "/educators", "/judge",
  ...modules.map((m) => `/modules/${m.id}`),
  ...modules.flatMap((m) => m.lessons.map((l) => `/modules/${lessonKey(m.id, l.slug)}`)),
  ...labs.map((l) => `/labs/${l.id}`),
];

function registerOffline() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID}`)
    .then(() => navigator.serviceWorker.ready)
    .then((reg) => {
      const run = () => reg.active?.postMessage({ type: "precache", urls: OFFLINE_ROUTES });
      if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 5000 });
      else setTimeout(run, 3000);
      navigator.serviceWorker.addEventListener("controllerchange", () =>
        navigator.serviceWorker.controller?.postMessage({ type: "precache", urls: OFFLINE_ROUTES }),
      );
    })
    .catch(() => {});
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useSettings.persist.rehydrate();
    void useProgress.persist.rehydrate();
    void useJudge.persist.rehydrate();
    registerOffline();
  }, []);
  useApplySettings();
  const reduceMotion = useSettings((s) => s.reduceMotion);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      {children}
      <RankWatcher />
      <AwardToasts />
      <TourBar />
    </MotionConfig>
  );
}
