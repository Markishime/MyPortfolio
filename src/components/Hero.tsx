"use client";
import Image from "next/image";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { supportsWebGL2 } from "@/lib/perf";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const introduced = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [allow3D, setAllow3D] = useState(false);
  const moving = !paused && !reduced && active && visible;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setAllow3D(!connection?.saveData && supportsWebGL2());
    return () => { preference.removeEventListener("change", sync); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (moving) video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [moving]);

  useEffect(() => {
    if (paused) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (!introduced.current) {
        gsap.from(".hero-reveal", { y: 26, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "all" });
        introduced.current = true;
      }
      gsap.to(".hero-spatial-art", { y: 90, rotateX: 8, scale: 0.94, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 } });
      gsap.to(".hero-film", { yPercent: 15, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });
    }, root);
    return () => media.revert();
  }, [paused]);

  return <section ref={root} id="home" className={`hero-spatial${paused ? " is-paused" : ""}`}>
    <div className="hero-film" aria-hidden="true">
      <video ref={video} src="/media/Pixelated.mp4" poster="/media/coastal-structure.webp" muted loop playsInline preload="none" />
    </div>
    <div className="hero-spatial-grid" aria-hidden="true" />
    <div className="hero-spatial-layout">
      <div className="hero-spatial-copy">
        <p className="hero-spatial-eyebrow hero-reveal"><span /> Independent developer / Cebu, PH</p>
        <h1 className="hero-spatial-title hero-reveal">Ideas into<br /><em>experiences.</em></h1>
        <p className="hero-spatial-name hero-reveal">Mark Lloyd Cuizon <span>Full Stack Developer & AI Developer</span></p>
        <p className="hero-spatial-description hero-reveal">I connect design, code, and intelligence to build digital things that feel a little more human.</p>
        <div className="hero-spatial-actions hero-reveal">
          <a href="#projects" className="hero-spatial-primary">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href="#contact" className="hero-spatial-secondary">Let’s build something <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="hero-spatial-proof hero-reveal"><strong>{siteConfig.projectsBuilt}<span>built projects</span></strong><i /><p>Software. Hardware. Intelligence.<br /><span>One curious mind behind it all.</span></p></div>
      </div>
      <div className="hero-spatial-art" aria-label="Orbital sculpture with floating previews of selected projects" role="group">
        <div className="hero-art-coordinates" aria-hidden="true"><span>EXPERIMENT 001</span><span>FORM × FUNCTION</span></div>
        <div className="hero-orbit-fallback" aria-hidden="true"><div /><div /><div /><span /></div>
        {allow3D && <HeroScene moving={moving} />}
        <a className="hero-project-plane hero-plane-one" href="https://marcimetzger-kohl.vercel.app/" target="_blank" rel="noopener noreferrer">
          <Image src="/media/marci-metzger.jpg" alt="Marci Metzger real estate website" width="1600" height="1000" sizes="(max-width: 650px) 160px, 300px" />
          <span><small>01 / WEB EXPERIENCE</small>Marci Metzger <ArrowUpRight size={15} aria-hidden="true" /></span>
        </a>
        <a className="hero-project-plane hero-plane-two" href="https://cropdrive.ai" target="_blank" rel="noopener noreferrer">
          <Image src="/media/cropdrive.jpg" alt="CropDrive AI agriculture platform" width="1600" height="1000" sizes="(max-width: 650px) 160px, 300px" />
          <span><small>02 / APPLIED INTELLIGENCE</small>CropDrive AI <ArrowUpRight size={15} aria-hidden="true" /></span>
        </a>
        <span className="hero-orbit-label" aria-hidden="true">BUILT TO EXPLORE</span>
      </div>
    </div>
    <div className="hero-spatial-bottom">
      <a href="#projects"><ArrowDown size={16} aria-hidden="true" /> Scroll into the work</a>
      <span className="hero-spatial-status"><i /> Available for meaningful collaborations</span>
      <button type="button" disabled={reduced} aria-pressed={paused || reduced} onClick={() => setPaused((value) => !value)}>
        {paused || reduced ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
      </button>
    </div>
  </section>;
}
