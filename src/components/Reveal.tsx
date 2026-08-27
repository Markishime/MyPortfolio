"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { easeOutExpo, inViewCard, riseScale } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, scale: 0.98 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={inViewCard}
      transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      variants={reduce ? undefined : riseScale}
    >
      {children}
    </motion.div>
  );
}
