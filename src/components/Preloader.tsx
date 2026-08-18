"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("mlc-reel") === "1";
    if (reduced || seen || document.documentElement.dataset.perf === "reduced") {
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("mlc-reel", "1");
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[oklch(0.15_0.026_240)]"
      role="status"
      aria-live="polite"
      aria-label="Loading reel"
    >
      <div className="text-center">
        <p className="font-display text-5xl font-extrabold text-accent">MLC</p>
        <p className="mt-3 font-mono text-xs tracking-[0.28em] text-[oklch(0.62_0.03_220)]">
          02 YEARS
        </p>
      </div>
    </div>
  );
}
