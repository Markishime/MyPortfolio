"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cinematicRuntime } from "@/components/scene/runtime";
import {
  THEMES,
  type RGB,
  type ThemeId,
  lerpRgb,
  nextTheme,
  writeThemeColors,
  writeThemeRgb,
} from "@/lib/theme";

type ThemeContextValue = {
  identity: ThemeId;
  locked: boolean;
  setIdentity: (id: ThemeId, options?: { lock?: boolean }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const fallbackTheme: ThemeContextValue = {
  identity: "fullstack",
  locked: false,
  setIdentity: () => {},
};

export function useTheme() {
  return useContext(ThemeContext) ?? fallbackTheme;
}

const AUTO_CYCLE_MS = 9000;

function paletteOf(id: ThemeId) {
  return THEMES[id];
}

function toLive(id: ThemeId) {
  const p = paletteOf(id);
  return {
    accent: p.accent,
    cool: p.cool,
    inner: p.inner,
    mid: p.mid,
    outer: p.outer,
    onAccent: p.onAccent,
  };
}

type LivePalette = ReturnType<typeof toLive>;

function settled(a: LivePalette, b: LivePalette) {
  const close = (x: RGB, y: RGB) =>
    Math.abs(x[0] - y[0]) < 0.5 && Math.abs(x[1] - y[1]) < 0.5 && Math.abs(x[2] - y[2]) < 0.5;
  return (
    close(a.accent, b.accent) &&
    close(a.cool, b.cool) &&
    close(a.inner, b.inner)
  );
}

function publishRgb(live: LivePalette, energy: number, identity: ThemeId) {
  writeThemeRgb(
    live.accent,
    live.cool,
    live.inner,
    live.mid,
    live.outer,
    live.onAccent,
    energy
  );
  cinematicRuntime.accentR = live.accent[0];
  cinematicRuntime.accentG = live.accent[1];
  cinematicRuntime.accentB = live.accent[2];
  cinematicRuntime.coolR = live.cool[0];
  cinematicRuntime.coolG = live.cool[1];
  cinematicRuntime.coolB = live.cool[2];
  cinematicRuntime.energy = energy;
  cinematicRuntime.identity = identity;
}

function commitIdentity(id: ThemeId) {
  const live = toLive(id);
  writeThemeColors(live.accent, live.cool, live.inner, live.mid, live.outer, live.onAccent);
  return live;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<ThemeId>("fullstack");
  const [locked, setLocked] = useState(false);
  const identityRef = useRef<ThemeId>("fullstack");
  const lockedRef = useRef(false);
  const kickRef = useRef<() => void>(() => {});

  const setIdentity = useCallback((id: ThemeId, options?: { lock?: boolean }) => {
    identityRef.current = id;
    setIdentityState(id);
    document.documentElement.dataset.identity = id;
    commitIdentity(id);
    if (options?.lock) {
      lockedRef.current = true;
      setLocked(true);
    }
    kickRef.current();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let running = false;
    let lastY = window.scrollY;
    const displayed: LivePalette = { ...toLive("fullstack") };

    const readScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      cinematicRuntime.scroll = window.scrollY / max;
      const pulse = Math.min(Math.abs(window.scrollY - lastY) / 28, 1);
      lastY = window.scrollY;
      cinematicRuntime.energy += (pulse - cinematicRuntime.energy) * 0.12;
    };

    const tick = () => {
      const target = toLive(identityRef.current);
      displayed.accent = lerpRgb(displayed.accent, target.accent, 0.22);
      displayed.cool = lerpRgb(displayed.cool, target.cool, 0.22);
      displayed.inner = lerpRgb(displayed.inner, target.inner, 0.22);
      displayed.mid = lerpRgb(displayed.mid, target.mid, 0.22);
      displayed.outer = lerpRgb(displayed.outer, target.outer, 0.22);
      displayed.onAccent = lerpRgb(displayed.onAccent, target.onAccent, 0.22);
      cinematicRuntime.energy *= 0.9;
      publishRgb(displayed, cinematicRuntime.energy, identityRef.current);
      if (settled(displayed, target) && cinematicRuntime.energy < 0.02) {
        running = false;
        publishRgb(target, 0, identityRef.current);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    kickRef.current = kick;

    const onScroll = () => {
      readScroll();
      if (cinematicRuntime.energy > 0.02) kick();
    };

    document.documentElement.dataset.identity = identityRef.current;
    commitIdentity(identityRef.current);
    publishRgb(displayed, 0, identityRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    const onPointer = (event: PointerEvent) => {
      cinematicRuntime.mouseX = event.clientX / window.innerWidth - 0.5;
      cinematicRuntime.mouseY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let cycleTimer = 0;
    if (!reduceMotion.matches) {
      cycleTimer = window.setInterval(() => {
        if (lockedRef.current) return;
        const next = nextTheme(identityRef.current);
        identityRef.current = next;
        setIdentityState(next);
        document.documentElement.dataset.identity = next;
        commitIdentity(next);
        kick();
      }, AUTO_CYCLE_MS);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(cycleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const value = useMemo(
    () => ({ identity, locked, setIdentity }),
    [identity, locked, setIdentity]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
