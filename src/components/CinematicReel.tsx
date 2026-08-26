"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMedia from "./CinematicMedia";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const systems = [
  {
    src: "/media/ecolock.jpg",
    objectPosition: "18% 50%",
    alt: "Smart EcoLock on a classroom door",
    title: "Locks",
    work: "EcoLock",
    detail: "Hardware that senses a room and answers a door.",
  },
  {
    src: "/media/orbit-ai.jpg",
    objectPosition: "50% 55%",
    alt: "Orbit AI life OS floating over a Cebu desk",
    title: "Life OS",
    work: "Orbit AI",
    detail: "Software that plans the day instead of listing it.",
  },
  {
    src: "/media/cropdrive.jpg",
    objectPosition: "50% 62%",
    alt: "CropDrive agronomy across oil palm fields",
    title: "Fields",
    work: "CropDrive",
    detail: "AI that reads soil and writes fertilizer.",
  },
  {
    src: "/media/masbate.jpg",
    objectPosition: "78% 48%",
    alt: "MasbateToday coastal story from Cawayan",
    title: "Coasts",
    work: "MasbateToday",
    detail: "A province held together by news, weather, and travel.",
  },
] as const;

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

          const horizontal = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance() * 1.12}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          gsap.to(".reel-intro-copy", {
            opacity: 0.16,
            ease: "none",
            scrollTrigger: {
              trigger: ".reel-intro",
              containerAnimation: horizontal,
              start: "left left",
              end: "left -35%",
              scrub: true,
            },
          });

          gsap.to(".reel-picture-wrap", {
            opacity: 0,
            y: 24,
            ease: "none",
            scrollTrigger: {
              trigger: ".reel-intro",
              containerAnimation: horizontal,
              start: "left left",
              end: "left -28%",
              scrub: true,
            },
          });

          panels.forEach((panel) => {
            gsap.fromTo(
              panel,
              { opacity: 0.55 },
              {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left 92%",
                  end: "left 48%",
                  scrub: true,
                },
              }
            );

            const still = panel.querySelector<HTMLElement>(".reel-panel-media");
            if (!still) return;
            gsap.fromTo(
              still,
              { scale: 1.1, xPercent: -3 },
              {
                scale: 1,
                xPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left 88%",
                  end: "left 28%",
                  scrub: true,
                },
              }
            );
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
      aria-label="Systems built in Cebu"
      className="cinematic-reel relative overflow-hidden"
    >
      <CinematicMedia
        image="/media/cebu-night.jpg"
        alt="Cebu at night from a wet hillside"
        kenBurns={false}
        objectPosition="46% 62%"
        className="pointer-events-none absolute inset-0"
        overlayClassName="bg-gradient-to-r from-[#101116] via-[#101116]/82 to-[#101116]/58"
      />
      <div className="cinematic-rain pointer-events-none absolute inset-0 z-[1] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-[1] pointer-events-none perspective-grid opacity-30" />

      <div ref={trackRef} className="reel-track relative z-10">
        <div className="reel-intro reel-panel">
          <div className="reel-intro-inner">
            <motion.div
              className="reel-intro-copy"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="reel-title">
                Built in Cebu.
                <span>Shipped as systems.</span>
              </h2>
              <p className="reel-description">
                Hardware, software, and AI treated as one picture:{" "}
                <span className="reel-term">locks</span>,{" "}
                <span className="reel-term">life&nbsp;OS</span>,{" "}
                <span className="reel-term">fields</span>, and{" "}
                <span className="reel-term">coasts</span>.
              </p>
            </motion.div>

            <motion.div
              className="reel-picture-wrap"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="reel-picture" aria-hidden="true">
                {systems.map((system) => (
                  <div key={system.title} className="reel-frame">
                    <img
                      src={system.src}
                      alt=""
                      className="reel-frame-media"
                      style={{ objectPosition: system.objectPosition }}
                    />
                    <span className="reel-frame-label">{system.title}</span>
                  </div>
                ))}
              </div>
              <p className="reel-origin">Minglanilla, Cebu</p>
            </motion.div>
          </div>
        </div>

        {systems.map((system, index) => (
          <motion.article
            key={system.title}
            className={cn(
              "reel-panel reel-project-panel",
              index % 2 === 1 && "is-flipped"
            )}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="reel-panel-index">0{index + 1}</div>
            <div className="reel-panel-media-wrap">
              <img
                src={system.src}
                alt={system.alt}
                className="reel-panel-media"
                style={{ objectPosition: system.objectPosition }}
              />
              <div className="reel-panel-refraction" />
            </div>
            <div className="reel-panel-copy">
              <p className="reel-panel-work">{system.work}</p>
              <h3>{system.title}</h3>
              <p>{system.detail}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
