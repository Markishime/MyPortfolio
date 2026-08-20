"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { readPerfTier } from "@/lib/perf";

interface CinematicMediaProps {
  image: string;
  video?: string | null;
  alt: string;
  className?: string;
  overlayClassName?: string;
  objectPosition?: string;
  priority?: boolean;
  kenBurns?: boolean;
  playing?: boolean;
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
  playing,
}: CinematicMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [allowFx, setAllowFx] = useState(false);
  const [allowKenBurns, setAllowKenBurns] = useState(false);
  const [active, setActive] = useState(priority || playing === true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const reduced = media.matches;
      const tier = readPerfTier();
      setReduceMotion(reduced);
      setAllowFx(!reduced && tier === "high");
      setAllowKenBurns(!reduced && tier === "high");
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (playing !== undefined) {
      setActive(playing);
      return;
    }
    if (priority) {
      setActive(true);
    }
  }, [playing, priority]);

  useEffect(() => {
    if (playing !== undefined || priority || !video || reduceMotion) return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, video, reduceMotion, playing]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    if (active) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active, reduceMotion]);

  const canPlayVideo =
    Boolean(video) && !reduceMotion && (allowFx || playing === true || priority);

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden bg-cyber-deeper", className)}
    >
      {canPlayVideo ? (
        <video
          ref={videoRef}
          poster={image}
          src={video ?? undefined}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload={priority ? "metadata" : "none"}
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            kenBurns && allowKenBurns && "cinematic-kenburns"
          )}
          style={{ objectPosition }}
        />
      )}
      {!canPlayVideo && allowFx && (
        <div className="cinematic-still-light" aria-hidden="true" />
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b14] via-[#060b14]/20 to-transparent",
          overlayClassName
        )}
      />
    </div>
  );
}
