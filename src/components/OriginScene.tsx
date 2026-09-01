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
    style: { top: "10%", left: "5%", width: "min(24vw, 300px)", aspectRatio: "0.72" },
    from: { x: -80, y: -40, rotate: -8, z: -120 },
  },
  {
    src: "/media/orbit-ai.jpg",
    kicker: "Life OS",
    label: "Orbit AI",
    style: { top: "14%", right: "6%", width: "min(28vw, 360px)", aspectRatio: "1.4" },
    from: { x: 90, y: -30, rotate: 7, z: -80 },
  },
  {
    src: "/media/cropdrive.jpg",
    kicker: "Precision Ag",
    label: "CropDrive",
    style: { bottom: "9%", left: "11%", width: "min(30vw, 380px)", aspectRatio: "1.45" },
    from: { x: -60, y: 70, rotate: 5, z: -60 },
  },
  {
    src: "/media/ecolock.jpg",
    kicker: "Hardware",
    label: "EcoLock",
    style: { bottom: "8%", right: "12%", width: "min(22vw, 270px)", aspectRatio: "0.86" },
    from: { x: 70, y: 50, rotate: -6, z: -100 },
  },
];

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
        <motion.div
          className="absolute inset-0"
          style={{
            rotateX: reduce ? 0 : rotateX,
            z: reduce ? 0 : stageZ,
            scale: reduce ? 1 : scale,
            opacity: reduce ? 1 : fade,
            transformStyle: "preserve-3d",
          }}
        >
          {plates.map((plate) => (
            <motion.figure
              key={plate.label}
              className="origin-plate glass-panel"
              style={plate.style}
              initial={reduce ? false : { ...plate.from, opacity: 0 }}
              whileInView={reduce ? undefined : { x: 0, y: 0, rotate: 0, z: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="origin-plate-media">
                <img src={plate.src} alt={plate.label} />
              </div>
              <figcaption>
                <small>{plate.kicker}</small>
                <strong>{plate.label}</strong>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <div className="origin-copy glass-panel rounded-[2rem] px-8 py-10">
          <p className="kicker">Chapter 01</p>
          <h2>From Cebu to working systems.</h2>
          <p>
            Kinestra, Orbit AI, CropDrive, and EcoLock — product stills and hardware, shipped as
            software people can hold.
          </p>
        </div>
      </div>
    </section>
  );
}
