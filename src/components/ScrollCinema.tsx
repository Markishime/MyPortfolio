"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyPerfDataset } from "@/lib/perf";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCinema() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const tier = applyPerfDataset();

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".core-chip", {
          y: 16,
          opacity: 0,
          stagger: 0.04,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: "#skills", start: "top 78%" },
        });

        if (tier === "high") {
          gsap.to(".cinema-ring", {
            rotateZ: 140,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          });
        }

        return undefined;
      });

      return undefined;
    });

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      media.revert();
    };
  }, []);

  return (
    <div ref={sceneRef} className="scroll-cinema" aria-hidden="true">
      <div className="cinema-fog cinema-fog-a" />
      <div className="cinema-fog cinema-fog-b" />
      <div className="cinema-ring cinema-ring-a" />
      <div className="cinema-ring cinema-ring-b" />
      <div className="cinema-ring cinema-ring-c" />
      <div className="cinema-particles">
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className="cinema-particle"
            style={
              {
                "--particle-x": `${(index * 47) % 100}%`,
                "--particle-y": `${(index * 31) % 100}%`,
                "--particle-size": `${2 + (index % 3)}px`,
                "--particle-delay": `${-(index % 6) * 1.4}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
