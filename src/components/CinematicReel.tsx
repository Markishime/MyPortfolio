"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMedia from "./CinematicMedia";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type BleedWork = {
  kind: "bleed";
  src: string;
  video?: string | null;
  objectPosition: string;
  overlayClassName: string;
  align: "start" | "end";
  alt: string;
  kicker: string;
  title: string;
  line: string;
  detail: string;
  href?: string | null;
  hrefLabel?: string;
};

type StillWork = {
  kind: "still";
  src: string;
  objectPosition: string;
  alt: string;
  kicker: string;
  title: string;
  detail: string;
  href?: string | null;
  hrefLabel?: string;
};

type Work = BleedWork | StillWork;

const works: Work[] = [
  {
    kind: "bleed",
    src: "/media/kinestra.jpg",
    video: "/media/kinestra.mp4",
    objectPosition: "62% 46%",
    overlayClassName:
      "bg-gradient-to-r from-[#101116]/90 via-[#101116]/46 to-[#101116]/12",
    align: "start",
    alt: "Athlete training in a warehouse gym for Kinestra",
    kicker: "Fitness OS",
    title: "Kinestra.",
    line: "Train as a system.",
    detail:
      "Workouts, meals, GPS, and a coach that already has last week's data.",
    href: "https://kinestra.web.app/",
    hrefLabel: "kinestra.web.app",
  },
  {
    kind: "bleed",
    src: "/media/ecolock.jpg",
    video: "/media/ecolock.mp4",
    objectPosition: "28% 48%",
    overlayClassName:
      "bg-gradient-to-r from-[#101116]/88 via-[#101116]/42 to-[#101116]/10",
    align: "start",
    alt: "Smart EcoLock on a classroom door",
    kicker: "Classroom lock",
    title: "EcoLock.",
    line: "Answer the door.",
    detail: "RFID, light, and attendance on the same classroom.",
  },
  {
    kind: "bleed",
    src: "/media/lockmate.jpg",
    video: "/media/lockmate.mp4",
    objectPosition: "46% 48%",
    overlayClassName:
      "bg-gradient-to-r from-[#101116]/88 via-[#101116]/40 to-transparent",
    align: "start",
    alt: "LockMate bicycle lock on a rainy Cebu street",
    kicker: "Bicycle lock",
    title: "LockMate.",
    line: "Hold the bike.",
    detail: "GPS, a tamper alarm, and a lock you open from the phone.",
  },
  {
    kind: "bleed",
    src: "/media/orbit-ai.jpg",
    video: "/media/orbit-ai.mp4",
    objectPosition: "50% 55%",
    overlayClassName:
      "bg-gradient-to-r from-[#101116]/86 via-[#101116]/38 to-[#101116]/10",
    align: "start",
    alt: "Orbit AI life OS floating over a desk",
    kicker: "Life OS",
    title: "Orbit.",
    line: "Plan the day.",
    detail: "Tasks, habits, bills, and a planner that writes the next move.",
    href: "https://gen-lang-client-0890430729.web.app/",
    hrefLabel: "Open live",
  },
  {
    kind: "still",
    src: "/media/cropdrive.jpg",
    objectPosition: "50% 42%",
    alt: "CropDrive agronomy across oil palm fields",
    kicker: "CropDrive",
    title: "Fields",
    detail: "Lab reports in. Fertilizer and a three-year ROI out.",
    href: "https://cropdrive.ai",
    hrefLabel: "cropdrive.ai",
  },
  {
    kind: "still",
    src: "/media/simplabots.jpg",
    objectPosition: "72% 42%",
    alt: "Simplabots AI agents for a small business desk",
    kicker: "Simplabots",
    title: "Agents",
    detail: "Calls, mail, copy, and hiring on one set of agents.",
    href: "https://simplabots.com/",
    hrefLabel: "simplabots.com",
  },
  {
    kind: "bleed",
    src: "/media/teambuilder-reel.jpg",
    objectPosition: "38% 52%",
    overlayClassName:
      "bg-gradient-to-r from-[#101116]/86 via-[#101116]/36 to-transparent",
    align: "start",
    alt: "Staffing cost model reviewed in a Cebu office at night",
    kicker: "Team Builder",
    title: "Crews.",
    line: "Price the crew.",
    detail: "An offshore team costed before the pitch.",
    href: "https://mcteambuilder.streamlit.app/",
    hrefLabel: "Open live",
  },
  {
    kind: "still",
    src: "/media/masbate.jpg",
    objectPosition: "22% 40%",
    alt: "MasbateToday coastal story from Cawayan",
    kicker: "MasbateToday",
    title: "Coasts",
    detail: "A province held together by news, weather, and travel.",
    href: "https://masbatetoday.web.app/",
    hrefLabel: "masbatetoday.web.app",
  },
];

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

function glueLast(line: string) {
  const parts = line.split(" ");
  if (parts.length < 2) return line;
  return `${parts.slice(0, -1).join(" ")}\u00a0${parts[parts.length - 1]}`;
}

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
          const stills = gsap.utils.toArray<HTMLElement>(".reel-project-panel");
          const bleeds = gsap.utils.toArray<HTMLElement>(".reel-feature");
          const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

          const horizontal = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance() * 1.08}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          bleeds.forEach((panel) => {
            const copy = panel.querySelector<HTMLElement>(".reel-intro-copy");
            const plate = panel.querySelector<HTMLElement>(".reel-feature-media");

            if (copy) {
              gsap.to(copy, {
                opacity: 0.16,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left left",
                  end: "left -40%",
                  scrub: true,
                },
              });
            }

            if (plate) {
              gsap.fromTo(
                plate,
                { scale: 1.08 },
                {
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: "left 96%",
                    end: "left 20%",
                    scrub: true,
                  },
                }
              );
            }
          });

          stills.forEach((panel) => {
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
      aria-label="Featured work"
      className="cinematic-reel relative overflow-hidden"
    >
      <div ref={trackRef} className="reel-track relative z-10">
        {works.map((work, index) =>
          work.kind === "bleed" ? (
            <BleedPanel key={work.title} work={work} index={index} />
          ) : (
            <StillPanel key={work.title} work={work} index={index} />
          )
        )}
      </div>
    </section>
  );
}

function BleedPanel({ work, index }: { work: BleedWork; index: number }) {
  return (
    <div
      className={cn(
        "reel-feature reel-panel",
        work.align === "end" && "is-end"
      )}
    >
      <div className="reel-feature-media pointer-events-none">
        <CinematicMedia
          image={work.src}
          video={work.video}
          alt={work.alt}
          kenBurns={false}
          objectPosition={work.objectPosition}
          className="h-full w-full"
          overlayClassName={work.overlayClassName}
        />
      </div>

      <div className="reel-panel-index">{indexLabel(index)}</div>

      <div className="reel-intro-inner">
        <motion.div
          className="reel-intro-copy"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="reel-panel-work">{work.kicker}</p>
          <h2 className="reel-title">
            {work.title}
            <span>{glueLast(work.line)}</span>
          </h2>
          <p className="reel-description">{work.detail}</p>
          {work.href ? (
            <a
              className="reel-origin"
              href={work.href}
              target="_blank"
              rel="noreferrer"
            >
              {work.hrefLabel}
            </a>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function StillPanel({ work, index }: { work: StillWork; index: number }) {
  return (
    <motion.article
      className={cn(
        "reel-panel reel-project-panel",
        index % 2 === 1 && "is-flipped"
      )}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="reel-panel-index">{indexLabel(index)}</div>
      <div className="reel-panel-media-wrap">
        <img
          src={work.src}
          alt={work.alt}
          className="reel-panel-media"
          style={{ objectPosition: work.objectPosition }}
        />
        <div className="reel-panel-refraction" />
      </div>
      <div className="reel-panel-copy">
        <p className="reel-panel-work">{work.kicker}</p>
        <h3>{work.title}</h3>
        <p>{work.detail}</p>
        {work.href ? (
          <a
            className="reel-origin"
            href={work.href}
            target="_blank"
            rel="noreferrer"
          >
            {work.hrefLabel}
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
