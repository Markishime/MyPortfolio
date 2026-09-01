"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./AnimatedList.css";

function AnimatedItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ y: 18, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 18, opacity: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={`scroll-list-container ${className}`.trim()}>
      <div className="scroll-list no-scrollbar">
        {items.map((item, index) => (
          <AnimatedItem key={item} index={index}>
            <div className="item">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="item-text">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </div>
  );
}
