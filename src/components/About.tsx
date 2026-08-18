"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { getGsap } from "@/lib/gsap";
import { useScrollExperience } from "./ScrollEngine";

const manifesto =
  "Two years building systems that treat hardware, software, and AI as one picture. I ship practical work: locks that know who is in the room, a life OS that plans the day, fields that read their own soil.";

const stats = [
  { value: "9", label: "Shipped systems" },
  { value: "3", label: "Hackathons" },
  { value: "11", label: "Certificates" },
  { value: String(siteConfig.experienceYears), label: "Years building" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { tier } = useScrollExperience();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text || tier === "reduced") return;

    const words = Array.from(text.querySelectorAll<HTMLElement>("[data-word]"));
    const { ScrollTrigger } = getGsap();

    const trigger = ScrollTrigger.create({
      trigger: text,
      start: "top 78%",
      end: "bottom 38%",
      scrub: 0.45,
      onUpdate: (self) => {
        const lit = Math.round(self.progress * words.length);
        words.forEach((word, index) => {
          word.classList.toggle("is-on", index <= lit);
        });
      },
    });

    return () => trigger.kill();
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className="scene py-28 sm:py-36 pt-32"
    >
      <div className="layer depth-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.86_0.16_165_/_0.06),transparent_55%)]" />
      </div>
      <div className="layer depth-1" aria-hidden="true">
        <div className="glow-blob right-[8%] top-[20%] h-[22rem] w-[22rem] bg-cyan-300/10" />
      </div>
      <div
        className="layer depth-2 hidden lg:block"
        aria-hidden="true"
      >
        <p className="ghost-type absolute -right-8 top-10">02</p>
      </div>

      <div className="scene-content mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="chapter-index mb-5">02 / Two years</p>
          <h2 className="font-display text-4xl font-extrabold leading-[0.92] tracking-tight text-[oklch(0.95_0.02_220)] sm:text-6xl">
            Built in Cebu.
            <span className="mt-2 block text-accent">Shipped as systems.</span>
          </h2>
          <p
            ref={textRef}
            aria-label={manifesto}
            className="mt-8 max-w-xl text-xl leading-relaxed sm:text-2xl"
          >
            {manifesto.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                data-word
                aria-hidden="true"
                className="word-lit mr-[0.28em] inline-block"
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div className="flex items-end gap-5">
            <div className="relative h-36 w-28 overflow-hidden rounded-sm sm:h-48 sm:w-36">
              <Image
                src="/media/mark-cinematic.jpg"
                alt="Mark Lloyd Cuizon"
                fill
                sizes="144px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold">{siteConfig.name}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[oklch(0.74_0.03_220)]">
                {siteConfig.education.degree}
                <br />
                {siteConfig.education.school}
                <br />
                {siteConfig.location}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="chapter-index">{stat.label}</dt>
                <dd className="mt-2 font-display text-5xl font-extrabold tracking-tight text-[oklch(0.95_0.02_220)]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
