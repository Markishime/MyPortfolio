"use client";

import CinematicMedia from "./CinematicMedia";

export default function CinematicReel() {
  return (
    <section
      aria-label="Cinematic showreel"
      className="scene relative min-h-[62vh] overflow-hidden"
    >
      <div className="layer depth-0">
        <CinematicMedia
          image="/media/hero-studio.jpg"
          video="/media/hero-studio.mp4"
          alt="Cinematic Cebu workbench in the rain"
          className="pointer-events-none absolute inset-0"
          overlayClassName="from-[oklch(0.15_0.026_240)] via-[oklch(0.15_0.026_240_/_0.5)] to-[oklch(0.15_0.026_240_/_0.62)]"
        />
      </div>

      <div className="scene-content mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
        <p className="chapter-index mb-4">03 / Reel</p>
        <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[0.94] text-[oklch(0.95_0.02_220)] sm:text-6xl">
          Hardware, software,
          <span className="mt-2 block text-accent">one continuous take.</span>
        </h2>
      </div>
    </section>
  );
}
