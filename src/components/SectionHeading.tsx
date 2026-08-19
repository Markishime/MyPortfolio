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
        <span className="section-kicker inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-4">
          <span className="w-1.5 h-1.5 rounded-full" />
          {badge}
        </span>
      )}
      <h2 className="section-display-title text-5xl sm:text-6xl lg:text-7xl">
        <span>{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
