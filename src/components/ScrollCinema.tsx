"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyPerfDataset } from "@/lib/perf";

gsap.registerPlugin(ScrollTrigger);

const CINEMA = {
  scrub: true as const,
  particleCount: 8,
};

export default function ScrollCinema() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const tier = applyPerfDataset();

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        "(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          if (tier !== "high") return;

          const sections = gsap.utils.toArray<HTMLElement>(
            "main > section:not(#home):not(.cinematic-reel)"
          );

          sections.forEach((section) => {
            section.classList.add("cinema-section");
            const content = section.querySelector<HTMLElement>(
              ":scope > div:last-child"
            );
            if (!content) return;

            gsap.fromTo(
              content,
              { y: 48, opacity: 0.72 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 92%",
                  end: "top 42%",
                  scrub: CINEMA.scrub,
                },
              }
            );
          });

          const contact = document.querySelector<HTMLElement>("#contact");
          const contactCards = contact?.querySelectorAll<HTMLElement>(".glass-card");
          if (contact && contactCards?.length) {
            gsap.from(contactCards, {
              y: 36,
              opacity: 0,
              stagger: 0.06,
              ease: "none",
              scrollTrigger: {
                trigger: contact,
                start: "top 82%",
                end: "top 48%",
                scrub: CINEMA.scrub,
              },
            });
          }

          gsap.to(".cinema-ring", {
            rotateZ: 160,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          });

          return () =>
            sections.forEach((section) => section.classList.remove("cinema-section"));
        }
      );

      return undefined;
    });

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      media.revert();
    };
  }, []);

  const particleCount = CINEMA.particleCount;

  return (
    <div ref={sceneRef} className="scroll-cinema" aria-hidden="true">
      <div className="cinema-fog cinema-fog-a" />
      <div className="cinema-fog cinema-fog-b" />
      <div className="cinema-ring cinema-ring-a" />
      <div className="cinema-ring cinema-ring-b" />
      <div className="cinema-ring cinema-ring-c" />
      <div className="cinema-particles">
        {Array.from({ length: particleCount }).map((_, index) => (
          <span
            key={index}
            className="cinema-particle"
            style={{
              "--particle-x": `${(index * 47) % 100}%`,
              "--particle-y": `${(index * 31) % 100}%`,
              "--particle-size": `${2 + (index % 3)}px`,
              "--particle-delay": `${-(index % 6) * 1.4}s`,
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
