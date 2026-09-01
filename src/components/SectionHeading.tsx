"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, inView, staggerFast } from "@/lib/motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={inView}
      variants={staggerFast}
      className={cn("text-center mb-10 lg:mb-12", className)}
    >
      {badge && (
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="section-kicker inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full" />
          {badge}
        </motion.span>
      )}
      <motion.h2
        variants={reduce ? undefined : fadeUp}
        className="section-display-title"
      >
        <span>{title}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="section-subtitle"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
