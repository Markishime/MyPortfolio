"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMedia from "./CinematicMedia";

gsap.registerPlugin(ScrollTrigger);

const stills = [
  { src: "/media/orbit-ai.jpg", alt: "Orbit AI life OS scene", title: "Intelligence", detail: "AI systems that organize real life" },
  { src: "/media/ecolock.jpg", alt: "Smart EcoLock corridor", title: "Embedded", detail: "Hardware that senses and responds" },
  { src: "/media/lockmate.jpg", alt: "LockMate bicycle at night", title: "Connected", detail: "Security that lives beyond the screen" },
  { src: "/media/masbate.jpg", alt: "Masbate coastline at dusk", title: "Human", detail: "Technology grounded in place" },
];

export default function CinematicReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          const panels = gsap.utils.toArray<HTMLElement>(".reel-panel");
          const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

          // One pinned camera move carries the viewer through the complete project reel.
          const horizontal = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance() * 1.12}`,
              pin: true,
              scrub: 1.05,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Each panel assembles in depth as the horizontal camera approaches it.
          panels.forEach((panel, index) => {
            const mediaElement = panel.querySelector<HTMLElement>(".reel-panel-media");
            gsap.fromTo(
              panel,
              { rotateY: index === 0 ? 0 : 24, rotateX: 7, z: -180, opacity: index === 0 ? 1 : 0.42 },
              {
                rotateY: -8,
                rotateX: 0,
                z: 40,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left 92%",
                  end: "right 34%",
                  scrub: 0.8,
                },
              }
            );
            if (mediaElement) {
              gsap.fromTo(
                mediaElement,
                { scale: 1.18, xPercent: -5 },
                {
                  scale: 1,
                  xPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                }
              );
            }
          });
        }
      );
    }, section);

    return () => {
      context.revert();
      media.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showreel"
      aria-label="Cinematic showreel"
      className="cinematic-reel relative overflow-hidden"
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

      <div ref={trackRef} className="reel-track relative z-10">
        <div className="reel-intro reel-panel">
          <motion.div
            initial={{ opacity: 0, y: 34, z: -80 }}
            whileInView={{ opacity: 1, y: 0, z: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="reel-kicker">Showreel · Scroll to travel</p>
            <h2 className="reel-title">
              Built in Cebu.
              <span>Shipped as systems.</span>
            </h2>
            <p className="reel-description">
              Hardware, software, and AI treated as one picture: locks, life OS,
              fields, and coasts.
            </p>
          </motion.div>
        </div>

        {stills.map((still, index) => (
          <article key={still.src} className="reel-panel reel-project-panel">
            <div className="reel-panel-index">0{index + 1}</div>
            <div className="reel-panel-media-wrap">
              <img src={still.src} alt={still.alt} className="reel-panel-media" />
              <div className="reel-panel-refraction" />
            </div>
            <div className="reel-panel-copy">
              <h3>{still.title}</h3>
              <p>{still.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
