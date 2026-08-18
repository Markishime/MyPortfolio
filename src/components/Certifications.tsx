"use client";

import { siteConfig } from "@/lib/data";

export default function Certifications() {
  return (
    <section
      id="certifications"
      aria-label="Certifications and hackathons"
      className="scene py-28 sm:py-36 pt-32"
    >
      <div className="scene-content mx-auto max-w-7xl px-6 lg:px-8">
        <p className="chapter-index mb-4">06 / Record</p>
        <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[0.94] tracking-tight text-[oklch(0.95_0.02_220)] sm:text-6xl">
          Rooms I entered.
          <span className="mt-2 block text-accent">Proof I stayed curious.</span>
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {siteConfig.hackathons.map((hack) => (
            <article
              key={hack.name}
              className="border border-white/10 bg-[oklch(0.2_0.03_240_/_0.8)] p-6"
            >
              <p className="chapter-index mb-3">Hackathon</p>
              <h3 className="font-display text-2xl font-extrabold">{hack.name}</h3>
              <p className="mt-2 text-sm text-[oklch(0.7_0.03_220)]">{hack.role}</p>
            </article>
          ))}
        </div>

        <ol className="mt-10 columns-1 gap-x-10 sm:columns-2">
          {siteConfig.certifications.map((cert, index) => (
            <li
              key={cert}
              className="mb-4 break-inside-avoid border-b border-white/8 pb-3 text-sm leading-snug text-[oklch(0.82_0.02_220)]"
            >
              <span className="mr-3 font-mono text-[11px] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {cert}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
