"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: () => <p className="model-fallback">Loading interactive model…</p>,
});
gsap.registerPlugin(ScrollTrigger);

export default function ModelViewer() {
  const root = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [model, setModel] = useState("architecture");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [reset, setReset] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(node);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setReduced(preference.matches); if (preference.matches) setSpinning(false); };
    sync();
    preference.addEventListener("change", sync);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".model-workbench", {
        y: 24, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 80%", once: true },
      });
      gsap.fromTo(".model-scroll-line", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: node, start: "top 80%", end: "bottom 35%", scrub: 0.7 },
      });
    }, node);
    const resize = new ResizeObserver(() => ScrollTrigger.refresh());
    resize.observe(node);
    return () => { observer.disconnect(); resize.disconnect(); media.revert(); preference.removeEventListener("change", sync); };
  }, []);

  return <section ref={root} id="playground" className="relative py-24 lg:py-28">
    <div className="portfolio-section-wrap">
      <SectionHeading badge="Interactive lab" title="A different dimension."
        subtitle="Explore two small studies in form and engineering. Pick a model, then make it your own view." />
      <div className="model-workbench glass-panel">
        <div className="model-toolbar" role="group" aria-label="Choose a 3D model">
          {[['architecture', 'Coastal pavilion'], ['circuit', 'Embedded board']].map(([value, label]) =>
            <button key={value} type="button" aria-pressed={model === value}
              onClick={() => { setModel(value); setRotation(0); setZoom(1); }}>{label}</button>)}
          <span className="model-engine">THREE.JS / REAL-TIME 3D</span>
        </div>
        <div className="model-stage" role="img" aria-label={`Interactive 3D ${model === 'architecture' ? 'coastal pavilion' : 'embedded circuit board'}. Use the buttons below to rotate and zoom.`}>
          {near && <ModelScene key={reset} model={model} rotation={rotation} zoom={zoom} spinning={spinning && !reduced} />}
          <span className="model-stage-label" aria-hidden="true">{model === 'architecture' ? '01 / SPACE & STRUCTURE' : '02 / CIRCUITS & SYSTEMS'}</span>
        </div>
        <div className="model-controls" role="group" aria-label="3D view controls">
          <p>Drag to orbit · use controls to explore</p>
          <button type="button" onClick={() => setRotation((v) => v - Math.PI / 6)}>Rotate left</button>
          <button type="button" onClick={() => setRotation((v) => v + Math.PI / 6)}>Rotate right</button>
          <button type="button" disabled={zoom <= 0.7} onClick={() => setZoom((v) => Math.max(0.7, v - 0.15))}>Zoom out</button>
          <button type="button" disabled={zoom >= 1.6} onClick={() => setZoom((v) => Math.min(1.6, v + 0.15))}>Zoom in</button>
          <button type="button" disabled={reduced} aria-pressed={spinning} onClick={() => setSpinning((v) => !v)}>{spinning ? 'Pause spin' : 'Auto spin'}</button>
          <button type="button" onClick={() => { setRotation(0); setZoom(1); setSpinning(false); setReset((v) => v + 1); }}>Reset view</button>
        </div>
        <div className="model-scroll-line" aria-hidden="true" />
      </div>
    </div>
  </section>;
}
