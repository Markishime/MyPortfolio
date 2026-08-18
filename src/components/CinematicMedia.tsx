"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CinematicMediaProps {
  image: string;
  video?: string | null;
  alt: string;
  className?: string;
  overlayClassName?: string;
  objectPosition?: string;
  priority?: boolean;
  kenBurns?: boolean;
  sizes?: string;
}

export default function CinematicMedia({
  image,
  video,
  alt,
  className,
  overlayClassName,
  objectPosition = "50% 50%",
  priority = false,
  kenBurns = true,
  sizes,
}: CinematicMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const allowVideo = Boolean(video) && !reduceMotion;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !allowVideo) return;
    if (inView) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, allowVideo]);

  useEffect(() => {
    const onVis = () => {
      const el = videoRef.current;
      if (!el || !allowVideo) return;
      if (document.hidden) el.pause();
      else if (inView) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [inView, allowVideo]);

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden bg-[oklch(0.16_0.03_240)]", className)}
    >
      {allowVideo ? (
        <video
          ref={videoRef}
          poster={image}
          src={video ?? undefined}
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? (priority ? "100vw" : "(max-width: 768px) 100vw, 58vw")}
          quality={75}
          className={cn("object-cover", kenBurns && !reduceMotion && "cinematic-kenburns")}
          style={{ objectPosition }}
        />
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.15_0.026_240)] via-[oklch(0.15_0.026_240_/_0.15)] to-transparent",
          overlayClassName
        )}
      />
    </div>
  );
}
