# Visual direction

## Scene

A hiring manager reviews the portfolio on a laptop in the evening, moving from a cinematic spatial opening to clear, quiet project surfaces.

## Palette

Graphite surfaces, warm off-white text, copper highlights, and a restrained sage secondary accent. Copper remains consistent across sections. Define new surface colors in OKLCH and expose matching RGB channels to existing theme utilities.

## Typography

Preserve the established Outfit display face, Manrope navigation, Inter body, and JetBrains Mono technical metadata. Strong scale and weight contrast; no decorative gradient lettering.

## Layout

Use wide, open section containers rather than nested glass panels. The origin story has a prominent left headline and a composed right project mosaic. Separate personal and work experience into two clearly labeled tracks.

## Imagery

The original Pixelated.mp4 video provides subdued atmosphere behind an orbital Three.js sculpture and floating project previews. A static architectural poster, CSS orbital illustration, and project screenshots preserve the composition without WebGL. Preserve Mark's portrait and project assets.

## Interaction

Keep badge dragging and native keyboard activation on the badge itself. Restore the depth carousel with slide controls and autoplay; its selected slide updates the featured project. Project previews, category filters, and technology filters remain usable. Respect reduced motion; avoid automatic palette changes.

The opening uses GSAP entrance and scroll-linked depth, with an explicit pause/resume control. Pause video and continuous rendering offscreen and in hidden tabs. Render still, readable content during server rendering and hydration, then enable optional motion after reading the browser preference. Preserve native vertical scrolling on mobile; do not estimate section heights for anchor navigation.
