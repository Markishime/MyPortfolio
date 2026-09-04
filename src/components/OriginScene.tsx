"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plates = [
  {
    src: "/media/kinestra.jpg",
    kicker: "Fitness + AI",
    label: "Kinestra",
    href: "https://kinestra.web.app/",
    className: "origin-plate-a",
    from: { x: -80, y: -40, rotate: -8, z: -120 },
  },
  {
    src: "/media/soda-plus.jpg",
    kicker: "Web Experience",
    label: "Soda+",
    href: "https://soda-plus.vercel.app/",
    className: "origin-plate-b",
    from: { x: 90, y: -30, rotate: 7, z: -80 },
  },
  {
    src: "/media/cropdrive.jpg",
    kicker: "Precision Ag",
    label: "CropDrive",
    href: "https://cropdrive.ai",
    className: "origin-plate-c",
    from: { x: -60, y: 70, rotate: 5, z: -60 },
  },
  {
    src: "/media/simplabots.jpg",
    kicker: "Agents",
    label: "AI Assistant",
    href: "https://simplabots.com/",
    className: "origin-plate-d",
    from: { x: 70, y: 50, rotate: -6, z: -100 },
  },
];

const systems = ["Kinestra", "Soda+", "CropDrive", "AI Assistant"];

export default function OriginScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const stageZ = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const fade = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    if (reduce) return;
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".origin-plate-media").forEach((el, index) => {
        gsap.to(el, {
          yPercent: index % 2 === 0 ? -12 : 10,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
      gsap.from(".origin-copy", {
        y: 28,
        opacity: 0.35,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={ref} id="origin" className="origin-scene">
      <div className="origin-sticky">
        <div className="origin-atmosphere" aria-hidden="true">
          <img src="/media/cebu-night.jpg" alt="" />
          <div className="origin-atmosphere-wash" />
        </div>

        <motion.div
          className="origin-glow"
          style={{ y: reduce ? 0 : glowY }}
          aria-hidden="true"
        />

        <motion.div
          className="origin-stage"
          style={{
            rotateX: reduce ? 0 : rotateX,
            z: reduce ? 0 : stageZ,
            scale: reduce ? 1 : scale,
            opacity: reduce ? 1 : fade,
            transformStyle: "preserve-3d",
          }}
        >
          {plates.map((plate, index) => (
            <motion.figure
              key={plate.label}
              className={`origin-plate glass-panel ${plate.className}`}
              initial={reduce ? false : { ...plate.from, opacity: 0 }}
              whileInView={reduce ? undefined : { x: 0, y: 0, rotate: 0, z: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={plate.href}
                target="_blank"
                rel="noopener noreferrer"
                className="origin-plate-link"
                aria-label={`${plate.label}, open live project`}
              >
                <div className="origin-plate-media">
                  <img src={plate.src} alt="" />
                </div>
                <span className="origin-plate-caption">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{plate.kicker}</small>
                  <strong>{plate.label}</strong>
                </span>
              </a>
            </motion.figure>
          ))}
        </motion.div>

        <div className="origin-copy glass-panel">
          <p className="origin-chapter">
            <span>01</span> Chapter · Minglanilla, Cebu
          </p>
          <h2>
            From Cebu
            <em>to working systems.</em>
          </h2>
          <p>
            Kinestra, Soda+, CropDrive, and an AI Assistant — product stills
            and shipped software people can actually use.
          </p>
          <ul className="origin-systems">
            {systems.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
