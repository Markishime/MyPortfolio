"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";

export default function LanyardGate({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<"idle" | "swallow">("idle");

  const trigger = useCallback(() => {
    setPhase((current) => (current === "idle" ? "swallow" : current));
  }, []);

  useEffect(() => {
    if (phase !== "swallow") return;
    const timer = window.setTimeout(onEnter, 1500);
    return () => window.clearTimeout(timer);
  }, [phase, onEnter]);

  return (
    <div className={`void-gate ${phase === "swallow" ? "is-swallowing" : ""}`}>
      <div className="void-stars" aria-hidden="true" />
      <div className="void-ring void-ring-a" aria-hidden="true" />
      <div className="void-ring void-ring-b" aria-hidden="true" />
      <div className="blackhole" aria-hidden="true" />

      <div className="void-copy">
        <p>Mark Lloyd Cuizon</p>
        <h1>Pull the badge to enter.</h1>
        <span>Grab the ID and drag it downward until it drops in.</span>
      </div>

      <div className="lanyard-stage">
        <div className="hanging-lanyard">
          <div className="hanging-hook" aria-hidden="true" />
          <motion.div
            className="hanging-swing"
            animate={{ rotate: [-7, 7, -5, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 0, originX: 0.5 }}
          >
            <div className="hanging-strap" aria-hidden="true" />
            <div className="hanging-clip" aria-hidden="true" />
            <motion.button
              type="button"
              className="hanging-card"
              drag="y"
              dragConstraints={{ top: -12, bottom: 280 }}
              dragElastic={0.2}
              whileDrag={{ cursor: "grabbing", scale: 1.03 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 90 || info.velocity.y > 380) trigger();
              }}
              aria-label="Pull the badge to enter"
            >
              <img src="/mark.jpeg" alt={siteConfig.name} />
              <div className="hanging-card-meta">
                <small>Pull down</small>
                <strong>Mark Lloyd Cuizon</strong>
                <span>Full Stack Developer</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <button type="button" className="void-skip" onClick={trigger}>
        Enter the site
      </button>
      <p className="void-hint">{siteConfig.primaryRole} · Cebu</p>
    </div>
  );
}
