"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;
    let tracking = false;

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      if (Math.abs(rx - x) > 0.2 || Math.abs(ry - y) > 0.2) {
        frame = requestAnimationFrame(tick);
        return;
      }
      tracking = false;
      frame = 0;
    };

    const moveCursor = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (tracking) return;
      tracking = true;
      frame = requestAnimationFrame(tick);
    };

    const handleHoverStart = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a, button, [role='button'], input, textarea, [data-cursor-hover]")) {
        ring.classList.add("hover");
      }
    };
    const handleHoverEnd = () => ring.classList.remove("hover");

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseout", handleHoverEnd);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
