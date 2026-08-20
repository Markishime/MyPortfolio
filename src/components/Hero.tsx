"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { siteConfig } from "@/lib/data";
import { readPerfTier } from "@/lib/perf";
import { THEMES, type ThemeId } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";

const disciplines = [THEMES.fullstack, THEMES.engineer, THEMES.ai] as const;

const orbitNodes = [
  { label: "Python", className: "orbit-node-1" },
  { label: "Next.js", className: "orbit-node-2" },
  { label: "Gemini", className: "orbit-node-3" },
  { label: "ESP32", className: "orbit-node-4" },
  { label: "Firebase", className: "orbit-node-5" },
  { label: "React", className: "orbit-node-6" },
  { label: "Node", className: "orbit-node-7" },
  { label: "ML", className: "orbit-node-8" },
  { label: "SQL", className: "orbit-node-9" },
];

const motionFilms = {
  fullstack: [
    { title: "Orbit AI", video: "/media/orbit-ai.mp4", image: "/media/orbit-ai.jpg" },
    { title: "Kinestra", video: "/media/kinestra.mp4", image: "/media/kinestra.jpg" },
  ],
  engineer: [
    { title: "Smart EcoLock", video: "/media/ecolock.mp4", image: "/media/ecolock.jpg" },
    { title: "LockMate", video: "/media/lockmate.mp4", image: "/media/lockmate.jpg" },
  ],
  ai: [
    { title: "Orbit AI", video: "/media/orbit-ai.mp4", image: "/media/orbit-ai.jpg" },
    { title: "Kinestra AI", video: "/media/kinestra.mp4", image: "/media/kinestra.jpg" },
  ],
} as const;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const reduceMotionPref = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [liteMedia, setLiteMedia] = useState(true);
  const reduceMotion = hydrated ? Boolean(reduceMotionPref) : false;
  const stillsOnly = reduceMotion || liteMedia;
  const { identity, setIdentity } = useTheme();
  const mouseRef = useRef({ x: 0, y: 0, px: -1000, py: -1000 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const [isSwitching, setIsSwitching] = useState(false);
  const [filmIndex, setFilmIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  useEffect(() => {
    setHydrated(true);
    setLiteMedia(
      window.matchMedia("(max-width: 900px)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        readPerfTier() !== "high"
    );
  }, []);

  useEffect(() => {
    if (reduceMotion || liteMedia) return;
    const timer = window.setInterval(() => {
      setFilmIndex((current) => (current + 1) % 2);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reduceMotion, liteMedia]);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("is-away", !entry.isIntersecting);
        section.querySelectorAll("video").forEach((video) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.08 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || liteMedia) return;
    const section = containerRef.current;
    if (!section) return;

    const nodes = Array.from(section.querySelectorAll<HTMLElement>(".orbit-node"));
    let frame = 0;
    let inView = true;

    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
        px: event.clientX,
        py: event.clientY,
      };
    };

    const animate = (now: number) => {
      if (!inView) {
        frame = 0;
        return;
      }
      const current = currentMouseRef.current;
      const target = mouseRef.current;
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      section.style.setProperty("--pointer-x", `${current.x * 48}px`);
      section.style.setProperty("--pointer-y", `${current.y * 48}px`);

      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate3d(${current.x * 22}px, ${current.y * 18}px, 0) rotateX(${-current.y * 7}deg) rotateY(${current.x * 9}deg)`;
      }

      const t = now * 0.001;
      nodes.forEach((node, index) => {
        const floatY = Math.sin(t + index * 0.8) * 10;
        const px = current.x * (10 + index * 2);
        const py = current.y * (8 + index) + floatY;
        node.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${Math.sin(index + t * 0.4) * 5}deg)`;
      });

      frame = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !frame) frame = requestAnimationFrame(animate);
      },
      { threshold: 0.08 }
    );
    io.observe(section);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(animate);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion, liteMedia]);

  const selectIdentity = (next: ThemeId) => {
    if (next === identity || isSwitching) return;
    setIsSwitching(true);
    setFilmIndex(0);
    setIdentity(next, { lock: true });
    window.setTimeout(() => setIsSwitching(false), 520);
  };

  const activeFilms = motionFilms[identity];
  const portraitLabel = `${siteConfig.name}, ${siteConfig.primaryRole} and ${siteConfig.secondaryRole}`;

  return (
    <section
      ref={containerRef}
      id="home"
      data-identity={identity}
      className={`portfolio-hero ${isSwitching ? "is-switching" : ""}`}
    >
      <motion.div
        className="hero-motion-backdrop"
        style={{
          y: reduceMotion || liteMedia ? 0 : mediaY,
          scale: reduceMotion || liteMedia ? 1 : mediaScale,
        }}
        aria-hidden="true"
      >
        {stillsOnly ? (
          <img
            src="/media/hero-studio.jpg"
            alt=""
            className={reduceMotion ? undefined : "cinematic-kenburns"}
          />
        ) : (
          <video
            src="/media/hero-studio.mp4"
            poster="/media/hero-studio.jpg"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
          />
        )}
        <div className="hero-media-wash" />
      </motion.div>

      {!liteMedia && !reduceMotion && (
      <div className="neural-field" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, index) => (
          <motion.span
            key={index}
            style={{ "--trace-index": index } as CSSProperties}
            animate={{
              opacity: [0.12, 0.55, 0.12],
              scaleX: [0.72, 1.06, 0.72],
              x: [0, index % 2 === 0 ? 34 : -34, 0],
            }}
            transition={{
              duration: 5 + index * 0.45,
              delay: index * 0.22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      )}

      {!liteMedia && !reduceMotion && (
      <div className="hero-film-layer" aria-hidden="true">
        <AnimatePresence mode="popLayout">
          {activeFilms.map((film, index) => (
            <motion.figure
              key={`${identity}-${film.title}-${filmIndex}`}
              className={`hero-film hero-film-${index + 1}`}
              initial={{ opacity: 0, scale: 0.72, rotate: index === 0 ? -14 : 12 }}
              animate={{
                opacity: index === filmIndex ? 0.78 : 0.32,
                scale: index === filmIndex ? 1 : 0.84,
                rotate: index === 0 ? -7 : 8,
                y: index === filmIndex ? [0, -12, 0] : [0, 8, 0],
              }}
              exit={{ opacity: 0, scale: 0.65 }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 6 + index, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {stillsOnly || index !== filmIndex ? (
                <img src={film.image} alt="" />
              ) : (
                <video
                  src={film.video}
                  poster={film.image}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
              <figcaption>{film.title}</figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
      )}

      {!reduceMotion && (
        <div className="hero-bubbles" aria-hidden="true">
          {Array.from({ length: liteMedia ? 5 : 8 }).map((_, index) => (
            <span
              key={index}
              style={{
                "--bubble-left": `${(index * 37) % 100}%`,
                "--bubble-size": `${8 + (index % 5) * 7}px`,
                "--bubble-delay": `${-(index % 8) * 1.3}s`,
                "--bubble-duration": `${8 + (index % 5)}s`,
              } as CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="hero-orbit-field" aria-hidden="true">
        {orbitNodes.map((node) => (
          <div key={node.label} className={`orbit-node ${node.className}`}>
            <span>{node.label}</span>
          </div>
        ))}
      </div>

      <motion.div
        className="hero-layout"
        style={{
          y: reduceMotion || liteMedia ? 0 : contentY,
          opacity: reduceMotion || liteMedia ? 1 : contentOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy"
        >
          <div className="availability-pill">
            <span /> Cebu, Philippines · Available worldwide
          </div>
          <p className="hero-overline">
            {siteConfig.primaryRole} · {siteConfig.secondaryRole}
          </p>
          <h1 className="hero-title">
            <span>Mark</span>
            <strong>Lloyd Cuizon</strong>
          </h1>
          <p className="hero-manifesto">{siteConfig.description}</p>
          <div className="hero-actions">
            <a href="#projects" className="hero-primary-action magnetic-target">
              Explore my work <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact" className="hero-text-action">Start a conversation</a>
          </div>
          <div className="hero-credential">
            <span className="credential-mark">CE</span>
            <span>
              <small>{siteConfig.education.degree}</small>
              {siteConfig.education.school}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.86, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hero-portrait-stage"
        >
          <div className="portrait-halo" />
          <div ref={portraitRef} className="portrait-shell">
            {stillsOnly ? (
              <img
                src="/media/hero-portrait.jpg"
                alt={portraitLabel}
              />
            ) : (
              <video
                src="/media/hero-portrait.mp4"
                poster="/media/hero-portrait.jpg"
                aria-label={portraitLabel}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            )}
            <div className="portrait-sheen" />
          </div>
          <div className="portrait-caption">
            <span>Professional identity</span>
            <strong>{siteConfig.primaryRole}</strong>
            <em>{siteConfig.secondaryRole}</em>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hero-selector"
        >
          <div className="discipline-cards" aria-label="Professional titles">
            {disciplines.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => selectIdentity(item.id)}
                className={identity === item.id ? "active" : ""}
                aria-pressed={identity === item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="discipline-number">
                  {item.rank === "Primary" ? "01" : item.rank === "Secondary" ? "02" : "03"}
                </span>
                <span className="discipline-symbol" aria-hidden="true">
                  {item.symbol}
                </span>
                <span className="discipline-copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
              </motion.button>
            ))}
          </div>
          <div className="selector-arrows" aria-hidden="true">
            <span>01</span><span>02</span><span>03</span>
          </div>
          <h2 className="hero-side-title">
            <span>Ideas into</span>
            working systems.
          </h2>
        </motion.div>
      </motion.div>

      <a href="#about" className="hero-scroll-cue">
        <span>Scroll to discover</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
