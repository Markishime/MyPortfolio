"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className,
  intensity = 12,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 };
  const rx = useSpring(
    useTransform(my, [-0.5, 0.5], [intensity, -intensity]),
    springConfig
  );
  const ry = useSpring(
    useTransform(mx, [-0.5, 0.5], [-intensity, intensity]),
    springConfig
  );
  const glareX = useSpring(useTransform(mx, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(my, [-0.5, 0.5], [0, 100]), springConfig);
  const scaleTarget = useMotionValue(1);
  const scale = useSpring(scaleTarget, springConfig);

  const glareBackground = useTransform(
    [glareX, glareY] as MotionValue<number>[],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.16) 0%, transparent 55%)`
  );

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const onEnter = () => {
    setHovering(true);
    scaleTarget.set(1.025);
  };

  const onLeave = () => {
    setHovering(false);
    scaleTarget.set(1);
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            opacity: hovering ? 0.7 : 0,
            background: glareBackground,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </motion.div>
  );
}
