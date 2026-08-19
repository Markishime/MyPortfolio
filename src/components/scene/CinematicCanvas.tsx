"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cinematicRuntime } from "./runtime";
import CinematicScene from "./CinematicScene";

function canUseWebGL() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const ok = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    canvas.remove();
    return ok;
  } catch {
    return false;
  }
}

function detectQuality(): "high" | "low" {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (memory <= 4 || cores <= 4) return "low";
  return "high";
}

function DprGuard({ cap }: { cap: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ t: 0, n: 0, dpr: cap });

  useFrame((_, delta) => {
    acc.current.t += delta;
    acc.current.n += 1;
    if (acc.current.t < 1) return;
    const fps = acc.current.n / acc.current.t;
    acc.current.t = 0;
    acc.current.n = 0;
    const next = fps < 48 ? 1 : fps < 56 ? Math.min(1.25, cap) : cap;
    if (next !== acc.current.dpr) {
      acc.current.dpr = next;
      setDpr(next);
    }
  });

  return null;
}

/**
 * Deferred WebGL layer. Drei is intentionally unused so the client bundle
 * does not pull troika/hls/bvh helpers. Theme colors come from cinematicRuntime.
 */
export default function CinematicCanvas() {
  const [enabled, setEnabled] = useState(false);
  const [loop, setLoop] = useState<"always" | "never">("always");
  const loopRef = useRef(true);

  useEffect(() => {
    let idleId = 0;
    let timeoutId = 0;
    const start = () => {
      if (!canUseWebGL()) {
        document.documentElement.dataset.webgl = "off";
        return;
      }
      cinematicRuntime.quality = detectQuality();
      document.documentElement.dataset.webgl = "on";
      setEnabled(true);
    };

    const ric = window.requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    if (ric) idleId = ric(start, { timeout: 1400 });
    else timeoutId = window.setTimeout(start, 700);

    return () => {
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
      document.documentElement.dataset.webgl = "off";
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const sync = () => {
      const should = cinematicRuntime.scroll < 0.2 && !document.hidden;
      if (should !== loopRef.current) {
        loopRef.current = should;
        setLoop(should ? "always" : "never");
      }
    };
    window.addEventListener("scroll", sync, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled]);

  if (!enabled) return null;

  const high = cinematicRuntime.quality === "high";

  return (
    <div className="cinematic-webgl" aria-hidden="true">
      <Canvas
        frameloop={loop}
        dpr={high ? [1, 1.5] : [1, 1.15]}
        gl={{
          alpha: true,
          antialias: high,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0.55, 0.12, 6.2], fov: 40, near: 0.2, far: 60 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <DprGuard cap={high ? 1.5 : 1.15} />
        <CinematicScene />
      </Canvas>
    </div>
  );
}
