"use client";

import { motion } from "framer-motion";
import CinematicMedia from "./CinematicMedia";

const stills = [
  { src: "/media/orbit-ai.jpg", alt: "Orbit AI life OS scene" },
  { src: "/media/ecolock.jpg", alt: "Smart EcoLock corridor" },
  { src: "/media/lockmate.jpg", alt: "LockMate bicycle at night" },
  { src: "/media/masbate.jpg", alt: "Masbate coastline at dusk" },
];

export default function CinematicReel() {
  return (
    <section
      aria-label="Cinematic showreel"
      className="relative h-[46vh] min-h-[320px] max-h-[560px] overflow-hidden"
    >
      <CinematicMedia
        image="/media/hero-studio.jpg"
        video="/media/hero-studio.mp4"
        alt="Cinematic Cebu workbench in the rain"
        className="pointer-events-none absolute inset-0"
        overlayClassName="from-[#060b14] via-[#060b14]/55 to-[#060b14]/70"
      />
      <div className="cinematic-rain pointer-events-none absolute inset-0 z-[1] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-[1] pointer-events-none perspective-grid opacity-30" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent/80 mb-3">
            Showreel
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white cinematic-title-shadow leading-[0.95]">
            Built in Cebu.
            <span className="block text-accent/90 mt-1">Shipped as systems.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-md">
            Hardware, software, and AI treated as one picture: locks, life OS,
            fields, and coasts.
          </p>
        </motion.div>

        <div
          className="hidden md:flex gap-4 self-end w-full max-w-3xl"
          style={{ perspective: 1200 }}
        >
          {stills.map((still, i) => (
            <motion.div
              key={still.src}
              initial={{ opacity: 0, y: 30, rotateY: -18 }}
              whileInView={{ opacity: 1, y: 0, rotateY: -8 + i * 3 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.08 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative h-28 flex-1 overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={still.src}
                alt={still.alt}
                className="h-full w-full object-cover cinematic-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
