export type PerfTier = "high" | "medium" | "low";

type NetworkNav = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function nav() {
  return navigator as NetworkNav;
}

export function readPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = nav().connection;
  const saveData = Boolean(connection?.saveData);
  const slowNet = /2g/.test(connection?.effectiveType ?? "");
  if (reduceMotion || saveData || slowNet) return "low";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const lowMem = (nav().deviceMemory ?? 8) <= 4;
  const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  if (coarse || narrow || lowMem || lowCpu) return "medium";

  return "high";
}

export function applyPerfDataset(): PerfTier {
  const tier = readPerfTier();
  document.documentElement.dataset.perf = tier;
  return tier;
}

export function canUseMotion(): boolean {
  return readPerfTier() !== "low";
}

export function canUseSmoothScroll(): boolean {
  if (typeof window === "undefined") return false;
  return (
    readPerfTier() === "high" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches
  );
}

export function canUseWebGLLayer(): boolean {
  if (typeof window === "undefined") return false;
  if (readPerfTier() !== "high") return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = nav().connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
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
