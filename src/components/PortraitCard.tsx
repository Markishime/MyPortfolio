"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

type PortraitCardProps = {
  src: string;
  name: string;
  role: string;
};

export default function PortraitCard({ src, name, role }: PortraitCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const inner = ref.current?.querySelector(".hero-face-inner");
    if (!inner) return;
    const tween = gsap.to(inner, {
      y: -8,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      className="hero-face-card"
      initial={reduce ? false : { opacity: 0, y: 28, rotateY: -12 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(event) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        ry.set(px * 10);
        rx.set(py * -8);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div className="hero-face-inner">
        <img src={src} alt={name} width={640} height={800} decoding="async" />
        <div className="hero-face-meta">
          <small>{role}</small>
          <strong>{name}</strong>
        </div>
      </div>
    </motion.div>
  );
}
