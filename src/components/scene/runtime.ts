import type { ThemeId } from "@/lib/theme";

/**
 * Shared mutable bus between ThemeProvider (DOM/CSS) and the R3F frame loop.
 * Mutating these fields is cheap and avoids React re-renders at 60fps.
 */
export const cinematicRuntime = {
  scroll: 0,
  energy: 0,
  mouseX: 0,
  mouseY: 0,
  accentR: 255,
  accentG: 107,
  accentB: 85,
  coolR: 169,
  coolG: 216,
  coolB: 232,
  identity: "fullstack" as ThemeId,
  quality: "high" as "high" | "low",
};
