"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Fires Plausible engagement goals: scroll_50, scroll_90, time_on_page_30s. */
export function ScrollTracking() {
  useEffect(() => {
    const fired = new Set<string>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      if (pct >= 50 && !fired.has("50")) {
        fired.add("50");
        track("scroll_50");
      }
      if (pct >= 90 && !fired.has("90")) {
        fired.add("90");
        track("scroll_90");
      }
      if (fired.has("50") && fired.has("90")) {
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => track("time_on_page_30s"), 30000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
