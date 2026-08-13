"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/data";
import ParticleField from "./ParticleField";
import CinematicMedia from "./CinematicMedia";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 0.88]);
  const rotateX = useTransform(scrollYProgress, [0, 0.55], [0, 8]);
  const blur = useTransform(scrollYProgress, [0, 0.55], [0, 6]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % siteConfig.roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center lg:justify-start overflow-hidden"
    >
      <CinematicMedia
        image="/media/hero-portrait.jpg"
        video="/media/hero-portrait.mp4"
        alt="Mark Lloyd Cuizon, cinematic studio portrait"
        priority
        objectPosition="78% 18%"
        className="pointer-events-none absolute inset-0 z-0"
        overlayClassName="from-[#060b14]/50 via-transparent to-transparent"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#060b14]/50 md:hidden" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#060b14] via-[#060b14]/78 to-[#060b14]/15 md:via-[#060b14]/70 md:to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#060b14] via-transparent to-[#060b14]/35" />
      <div className="cinematic-vignette pointer-events-none absolute inset-0 z-[1]" />

      {/* Cinematic 3D stage */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-25">
        <ParticleField />
      </div>

      {/* Atmospheric light volumes */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-[18%] left-[12%] w-[26rem] h-[26rem] bg-accent/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] left-[20%] w-[20rem] h-[20rem] bg-cyber/8 rounded-full blur-[120px] animate-pulse-glow [animation-delay:1.2s]" />
      </div>

      {/* Perspective floor cue */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-[1] pointer-events-none perspective-grid opacity-20" />

      {/* Content — camera dolly on scroll */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
          rotateX,
          filter,
          transformPerspective: 1200,
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center lg:text-left"
      >
        <div className="max-w-xl mx-auto lg:mx-0">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, z: -40 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 shadow-[0_0_30px_rgba(0,255,170,0.08)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-mono text-accent/80">
            Available for opportunities
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-4 leading-[0.95]">
            <span className="block text-white cinematic-title-shadow">
              Mark Lloyd
            </span>
            <span className="block gradient-text mt-2 cinematic-title-glow">
              Cuizon
            </span>
          </h1>
        </motion.div>

        {/* Animated Role */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="h-10 mt-6 mb-8 overflow-hidden"
        >
          <motion.div
            key={roleIndex}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl font-mono text-gray-400"
          >
            {`{ ${siteConfig.roles[roleIndex]} }`}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
        >
          Building the future with{" "}
          <span className="text-accent">code</span>,{" "}
          <span className="text-cyber">circuits</span>, and{" "}
          <span className="text-violet-400">intelligence</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 rounded-full bg-accent text-cyber-dark font-semibold text-sm overflow-hidden transition-shadow hover:shadow-[0_0_40px_rgba(0,255,170,0.4)]"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              Explore My Work
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/10 transition-all hover:border-accent/50 hover:shadow-[0_0_28px_rgba(0,255,170,0.15)] backdrop-blur-sm"
          >
            Get in Touch
          </motion.a>
        </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-gray-600/80 flex justify-center pt-1.5 shadow-[0_0_20px_rgba(0,255,170,0.1)]">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-2 rounded-full bg-accent"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
