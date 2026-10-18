"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { useTheme } from "./ThemeProvider";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const { identity } = useTheme();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.22]);

  useEffect(() => {
    const section = containerRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.08 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section
      ref={containerRef}
      id="home"
      data-identity={identity}
      className="portfolio-hero hero-cinematic-scroll hero-minimal"
    >
      <div className="hero-sticky-stage">
        <motion.div
          className="hero-motion-backdrop"
          style={{
            y: reduceMotion ? 0 : mediaY,
            scale: reduceMotion ? 1 : mediaScale,
          }}
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            src="/media/Pixelated.mp4"
            poster={reduceMotion ? "/media/coastal-structure.webp" : undefined}
            muted
            autoPlay={!reduceMotion}
            loop
            playsInline
            preload="auto"
            className="hero-pixel-video"
          />
          <div className="hero-media-wash" />
        </motion.div>

        <motion.div
          className="hero-layout"
          style={{
            y: reduceMotion ? 0 : contentY,
            opacity: reduceMotion ? 1 : contentOpacity,
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hero-copy"
          >
            <div className="availability-pill">
              <span /> Cebu, Philippines · Available worldwide
            </div>
            <p className="hero-overline">
              {siteConfig.primaryRole} · {siteConfig.secondaryRole}
            </p>
            <h1 className="hero-title">
              <span>Mark</span>
              <strong>Lloyd Cuizon</strong>
            </h1>
            <p className="hero-manifesto">{siteConfig.description}</p>
            <div className="hero-actions">
              <a href="#projects" className="hero-primary-action">
                Explore my work <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a href="#contact" className="hero-text-action">
                Start a conversation
              </a>
            </div>
          </motion.div>
          <div className="hero-location-note"><span>Built on curiosity.</span><span>Grounded in Cebu.</span></div>
        </motion.div>

        <a href="#about" className="hero-scroll-cue">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
