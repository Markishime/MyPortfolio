"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPScrollReveal(options?: {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll("[data-gsap]");
      if (!elements) return;

      gsap.from(elements, {
        y: options?.y ?? 60,
        opacity: 0,
        duration: options?.duration ?? 1,
        stagger: options?.stagger ?? 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: options?.start ?? "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [options?.y, options?.duration, options?.stagger, options?.start]);

  return containerRef;
}

export function useGSAPTextSplit() {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current.textContent || "";
    textRef.current.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="inline-block" style="opacity:0;transform:translateY(40px)">${char === " " ? "&nbsp;" : char}</span>`
      )
      .join("");

    const chars = textRef.current.querySelectorAll("span");

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return textRef;
}

export function useGSAPParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export function useGSAPCounter(end: number, duration: number = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        textContent: 0,
        duration,
        ease: "power1.inOut",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
        },
      });
    });

    return () => ctx.revert();
  }, [end, duration]);

  return ref;
}
