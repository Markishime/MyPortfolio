export type PerfTier = "full" | "lite" | "reduced";

export const PERF_STORAGE_KEY = "motionPreference";

export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "lite";

  try {
    if (localStorage.getItem(PERF_STORAGE_KEY) === "off") return "reduced";
  } catch {
    /* private mode */
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  const saveData = Boolean(nav.connection?.saveData);
  const slowNet =
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g";
  const lowMem = (nav.deviceMemory ?? 8) <= 4;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.matchMedia("(max-width: 900px)").matches;

  if (saveData || slowNet || (coarse && small) || (lowMem && lowCores && coarse)) {
    return "lite";
  }

  return "full";
}

export function applyPerfTier(tier: PerfTier) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.perf = tier;
}

export function persistMotionPreference(enabled: boolean) {
  try {
    localStorage.setItem(PERF_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* ignore */
  }
}
