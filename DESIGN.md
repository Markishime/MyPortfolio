# Design

## Color strategy
Committed. One phosphor accent on ink that leans cyan. Never pure black or white.

- Ink: `oklch(0.17 0.028 240)`
- Paper: `oklch(0.93 0.018 220)`
- Accent: `oklch(0.86 0.16 165)` (`#00e8a3`)
- Cool: `oklch(0.78 0.10 210)`
- Muted: `oklch(0.68 0.03 230)`

## Typography
- Display: Bricolage Grotesque (800 / 600)
- Body: Source Sans 3 (400 / 500)
- Mono: Azeret Mono (400 / 500)

Headings are solid paper or accent. No gradient-clipped text.

## Motion
- GPU-safe only: transform, opacity, filter, clip-path
- Desktop full: sticky hero + horizontal work reel
- Lite / touch / save-data: static chapters, stills, fade-ins
- Reduced motion: no parallax, no video, no loops

## Depth
Six layers per scene. Text is depth 4 and never parallaxed.

## Imagery
Real portraits, studio stills, and project frames. Keep photographic backgrounds. Do not cut them out.
