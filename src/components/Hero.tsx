"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/data";
import { getGsap } from "@/lib/gsap";
import CinematicMedia from "./CinematicMedia";
import { useScrollExperience } from "./ScrollEngine";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { tier } = useScrollExperience();
  const [roleIndex, setRoleIndex] = useState(0);

  useLayoutEffect(() => {
    if (tier === "reduced") return;
    const id = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % siteConfig.roles.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [tier]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || tier !== "full") return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const media = section.querySelector<HTMLElement>("[data-hero-media]");
      const ghost = section.querySelector<HTMLElement>("[data-hero-ghost]");

      if (media) {
        gsap.to(media, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
      if (ghost) {
        gsap.to(ghost, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Hero"
      className="scene scene-hero"
    >
      <div className="scene-stage flex items-center">
        <div className="layer depth-0" data-depth="0" data-hero-media>
          <CinematicMedia
            image="/media/hero-portrait.jpg"
            video="/media/hero-portrait.mp4"
            alt="Mark Lloyd Cuizon, cinematic studio portrait"
            priority
            objectPosition="78% 18%"
            className="pointer-events-none absolute inset-0"
            overlayClassName="from-[oklch(0.15_0.026_240)] via-transparent to-transparent"
          />
        </div>

        <div className="layer depth-1" data-depth="1" aria-hidden="true">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.026_240)] via-[oklch(0.15_0.026_240_/_0.78)] to-transparent md:via-[oklch(0.15_0.026_240_/_0.68)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.15_0.026_240)] via-transparent to-[oklch(0.15_0.026_240_/_0.4)]" />
          <div className="cinematic-vignette pointer-events-none absolute inset-0" />
          <div className="glow-blob left-[8%] top-[18%] h-[26rem] w-[26rem] bg-accent/25" />
          <div className="glow-blob bottom-[8%] left-[22%] h-[18rem] w-[18rem] bg-cyan-300/15" />
        </div>

        <div className="layer depth-2" data-depth="2" aria-hidden="true">
          <p
            data-hero-ghost
            className="ghost-type absolute -left-[4vw] top-[12%] hidden lg:block"
          >
            02 YRS
          </p>
          <div
            data-hero-grid
            className="perspective-grid absolute inset-x-0 bottom-0 h-1/2 opacity-30"
          />
        </div>

        <div className="layer depth-5 hidden md:block" aria-hidden="true">
          <span className="float-mote left-[18%] top-[28%]" />
          <span className="float-mote left-[24%] top-[62%] [animation-delay:-2s]" />
          <span className="float-mote left-[42%] top-[22%] [animation-delay:-4s]" />
          <span className="float-mote right-[18%] top-[36%] [animation-delay:-1s]" />
        </div>

        <div className="scene-content mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div data-hero-copy className="max-w-xl">
            <p className="chapter-index mb-6 inline-flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              01 / Available
            </p>

            <h1
              className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight text-[oklch(0.95_0.02_220)] sm:text-7xl lg:text-8xl"
              aria-label="Mark Lloyd Cuizon"
            >
              <span className="block">Mark Lloyd</span>
              <span className="mt-2 block text-accent">Cuizon</span>
            </h1>

            <p className="mt-6 h-8 overflow-hidden font-mono text-lg text-[oklch(0.74_0.03_220)] sm:text-xl">
              <span key={roleIndex} className="block">
                {siteConfig.roles[roleIndex]}
              </span>
            </p>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[oklch(0.78_0.03_220)]">
              Two years shipping{" "}
              <span className="text-accent">code</span>,{" "}
              <span className="text-cyan-300">circuits</span>, and intelligence
              as one picture.
            </p>

            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href="#projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[oklch(0.16_0.03_240)] transition-transform duration-200 hover:translate-y-[-1px]"
              >
                Enter the reel
                <span aria-hidden>→</span>
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center rounded-full border border-accent/35 px-7 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                Write to me
              </a>
            </div>
          </div>
        </div>

        <p className="chapter-index pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          Scroll
        </p>
      </div>
    </section>
  );
}
