"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { getGsap } from "@/lib/gsap";
import {
  applyPerfTier,
  detectPerfTier,
  persistMotionPreference,
  type PerfTier,
} from "@/lib/perf";

type ScrollContextValue = {
  tier: PerfTier;
  motionEnabled: boolean;
  setMotionEnabled: (next: boolean) => void;
};

const ScrollContext = createContext<ScrollContextValue>({
  tier: "lite",
  motionEnabled: true,
  setMotionEnabled: () => {},
});

export function useScrollExperience() {
  return useContext(ScrollContext);
}

export default function ScrollEngine({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<PerfTier>("lite");
  const [motionEnabled, setMotion] = useState(true);

  const setMotionEnabled = useCallback((next: boolean) => {
    setMotion(next);
    persistMotionPreference(next);
    const nextTier = next ? detectPerfTier() : "reduced";
    const resolved = next && nextTier === "reduced" ? "lite" : nextTier;
    const applied = next ? resolved : "reduced";
    setTier(applied);
    applyPerfTier(applied);
    const { ScrollTrigger } = getGsap();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    const initial = detectPerfTier();
    setTier(initial);
    setMotion(initial !== "reduced");
    applyPerfTier(initial);

    const { gsap, ScrollTrigger } = getGsap();
    const reduced = initial === "reduced";

    let lenis: Lenis | null = null;
    let onScroll: ((e: Event) => void) | null = null;

    const setProgress = (value: number) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(Math.max(0, Math.min(1, value)))
      );
    };

    const tick = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (!reduced) {
      lenis = new Lenis({
        duration: initial === "full" ? 1.05 : 0.7,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ({ progress }) => setProgress(progress));
    } else {
      onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll(new Event("scroll"));
    }

    const handleAnchor = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const node = document.querySelector(href);
      if (!node) return;
      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(node as HTMLElement, { offset: -80 });
      } else {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoViewPatched(
      arg?: boolean | ScrollIntoViewOptions
    ) {
      if (lenis && this instanceof HTMLElement && this.id) {
        lenis.scrollTo(this, { offset: -80 });
        return;
      }
      nativeScrollIntoView.call(this, arg as boolean);
    };

    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );
    anchors.forEach((anchor) => anchor.addEventListener("click", handleAnchor));

    const refresh = () => ScrollTrigger.refresh();
    const fontsReady = document.fonts?.ready?.then(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      anchors.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchor)
      );
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      fontsReady?.catch(() => undefined);
      Element.prototype.scrollIntoView = nativeScrollIntoView;
      gsap.ticker.remove(tick);
      if (lenis) {
        lenis.destroy();
        window.__lenis = undefined;
      }
    };
  }, []);

  const value = useMemo(
    () => ({ tier, motionEnabled, setMotionEnabled }),
    [tier, motionEnabled, setMotionEnabled]
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
