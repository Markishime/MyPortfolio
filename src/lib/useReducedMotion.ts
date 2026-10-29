"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function snapshot() { return window.matchMedia(query).matches; }
// Render readable, still content on the server and during hydration. The client
// enables optional motion only after its actual preference is available.
function serverSnapshot() { return true; }
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
