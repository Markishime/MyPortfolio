"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("text-center mb-16", className)}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-accent/80 glass mb-4 uppercase tracking-widest shadow-[0_0_24px_rgba(0,255,170,0.08)]">
          <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight">
        <span className="gradient-text cinematic-title-glow">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
