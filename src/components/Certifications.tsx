"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { easeOut, fadeUp, inView } from "@/lib/motion";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  const reduce = useReducedMotion();
  const cardReveal = reduce
    ? {}
    : {
        initial: fadeUp.hidden,
        whileInView: fadeUp.visible,
        viewport: inView,
      };

  return (
    <section id="certifications" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <SectionHeading
          badge="Recognition"
          title="Certifications & Hackathons"
          subtitle="Continuous learning and competitive problem-solving"
        />

        {/* Hackathons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {siteConfig.hackathons.map((hack, i) => (
            <motion.div
              key={hack.name}
              {...cardReveal}
              transition={reduce ? undefined : { duration: 0.5, delay: i * 0.06, ease: easeOut }}
              whileHover={reduce ? undefined : { y: -5 }}
              className="glass-card rounded-3xl p-6 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a48.454 48.454 0 0 1-7.54 0"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-display font-bold text-white mb-1">
                  {hack.name}
                </h4>
                <p className="text-xs font-mono text-gray-400">{hack.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteConfig.certifications.map((cert, i) => (
            <motion.div
              key={cert}
              {...cardReveal}
              transition={reduce ? undefined : { duration: 0.45, delay: (i % 3) * 0.05, ease: easeOut }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/20 hover:bg-accent/[0.03] transition-all duration-300 cursor-default"
            >
              <div className="mt-0.5 w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg
                  className="w-3.5 h-3.5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-snug">
                  {cert}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
