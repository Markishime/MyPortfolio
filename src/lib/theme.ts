/**
 * Hero-driven theme tokens.
 *
 * The active identity (Full Stack Developer | Computer Engineer | AI Developer) owns a
 * complementary palette. ThemeProvider writes these channels onto <html> as
 * CSS custom properties; every section, control, and the Three.js layer
 * reads the same variables. No component should hard-code an accent hex.
 */

export type ThemeId = "fullstack" | "engineer" | "ai";
export type RGB = readonly [number, number, number];

export type ThemePalette = {
  id: ThemeId;
  title: string;
  rank: "Primary" | "Secondary" | "Tertiary";
  detail: string;
  symbol: string;
  accent: RGB;
  cool: RGB;
  inner: RGB;
  mid: RGB;
  outer: RGB;
  onAccent: RGB;
};

export const THEMES: Record<ThemeId, ThemePalette> = {
  fullstack: {
    id: "fullstack",
    title: "Full Stack Developer",
    rank: "Primary",
    detail: "Next.js · React · Node",
    symbol: "FS",
    accent: [255, 107, 85],
    cool: [169, 216, 232],
    inner: [107, 61, 54],
    mid: [46, 39, 38],
    outer: [16, 17, 22],
    onAccent: [24, 25, 31],
  },
  engineer: {
    id: "engineer",
    title: "Computer Engineer",
    rank: "Secondary",
    detail: "Embedded · Systems · C++",
    symbol: "CE",
    accent: [169, 216, 232],
    cool: [255, 107, 85],
    inner: [90, 160, 184],
    mid: [29, 53, 64],
    outer: [18, 20, 28],
    onAccent: [16, 17, 22],
  },
  ai: {
    id: "ai",
    title: "AI Developer",
    rank: "Tertiary",
    detail: "Agents · Gemini · Python",
    symbol: "AI",
    accent: [191, 255, 92],
    cool: [177, 126, 255],
    inner: [80, 111, 45],
    mid: [34, 42, 31],
    outer: [14, 17, 18],
    onAccent: [18, 22, 18],
  },
};

export const THEME_IDS: ThemeId[] = ["fullstack", "engineer", "ai"];
export const THEME_TRANSITION_MS = 480;

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function channel(rgb: RGB) {
  return `${rgb[0].toFixed(1)} ${rgb[1].toFixed(1)} ${rgb[2].toFixed(1)}`;
}

/** Color tokens: written on identity change so @property can interpolate 480ms. */
export function writeThemeColors(
  accent: RGB,
  cool: RGB,
  inner: RGB,
  mid: RGB,
  outer: RGB,
  onAccent: RGB
) {
  const root = document.documentElement;
  root.style.setProperty("--theme-accent", `rgb(${channel(accent)})`);
  root.style.setProperty("--theme-cool", `rgb(${channel(cool)})`);
  root.style.setProperty("--theme-inner", `rgb(${channel(inner)})`);
  root.style.setProperty("--theme-mid", `rgb(${channel(mid)})`);
  root.style.setProperty("--theme-outer", `rgb(${channel(outer)})`);
  root.style.setProperty("--theme-on-accent", `rgb(${channel(onAccent)})`);
}

/** RGB channels: rAF-lerped so Tailwind opacity utilities (bg-accent/10) stay in sync. */
export function writeThemeRgb(
  accent: RGB,
  cool: RGB,
  inner: RGB,
  mid: RGB,
  outer: RGB,
  onAccent: RGB,
  energy: number
) {
  const root = document.documentElement;
  root.style.setProperty("--theme-accent-rgb", channel(accent));
  root.style.setProperty("--theme-cool-rgb", channel(cool));
  root.style.setProperty("--theme-inner-rgb", channel(inner));
  root.style.setProperty("--theme-mid-rgb", channel(mid));
  root.style.setProperty("--theme-outer-rgb", channel(outer));
  root.style.setProperty("--theme-on-accent-rgb", channel(onAccent));
  root.style.setProperty("--scroll-energy", energy.toFixed(3));
  root.style.setProperty("--theme-glow", `rgb(${channel(accent)} / ${0.18 + energy * 0.22})`);
}

export function nextTheme(id: ThemeId): ThemeId {
  const current = THEME_IDS.indexOf(id);
  return THEME_IDS[(current + 1) % THEME_IDS.length];
}
