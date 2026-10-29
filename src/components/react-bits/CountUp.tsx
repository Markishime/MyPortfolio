"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className = "",
  suffix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView && !reduce) motionValue.set(to);
  }, [isInView, motionValue, to, reduce]);

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = `${to}${suffix}`;
      return;
    }
    const unsub = springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
    });
    return () => unsub();
  }, [springValue, suffix, reduce, to]);

  return (
    <span className={className} ref={ref}>
      {from}
      {suffix}
    </span>
  );
}
