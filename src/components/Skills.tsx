"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { easeOut, fadeUp, inView, staggerCards } from "@/lib/motion";
import SectionHeading from "./SectionHeading";

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export default function Skills() {
  const reduce = useReducedMotion();
  const cardReveal = reduce ? {} : { variants: fadeUp };
  const chipViewport = { once: true, amount: 0.2 };

  return (
    <section id="skills" className="relative py-32 overflow-hidden section-cinematic">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 cinematic-depth-fog pointer-events-none opacity-50" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Floating Orbs */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-accent/5 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-cyber/5 rounded-full blur-[120px] animate-float" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <SectionHeading
          badge="Expertise"
          title="Skills & Technologies"
          subtitle="The tools and technologies I use to bring ideas to life"
        />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={inView}
          variants={staggerCards}
        >
          {/* Programming Languages with Bars */}
          <motion.div
            {...cardReveal}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Languages
              </h3>
            </div>

            <div className="space-y-5">
              {siteConfig.skills.languages.map((lang) => (
                <motion.div
                  key={lang.name}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.4, ease: easeOut }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-mono text-gray-300">
                      {lang.name}
                    </span>
                    <span className="text-xs font-mono text-accent/60">
                      {lang.level}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.3,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-cyber"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Frameworks */}
          <motion.div
            {...cardReveal}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Frameworks & Libraries
              </h3>
            </div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={chipViewport}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {siteConfig.skills.frameworks.map((fw) => (
                <motion.span
                  key={fw}
                  variants={chipVariants}
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                    boxShadow: "0 8px 20px rgb(var(--theme-accent-rgb) / 0.16)",
                  }}
                  className="px-4 py-2.5 rounded-2xl text-sm font-mono text-gray-300 glass border border-white/5 hover:border-accent/30 hover:text-accent transition-colors cursor-default"
                >
                  {fw}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Tools & Platforms */}
          <motion.div
            {...cardReveal}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Tools & Platforms
              </h3>
            </div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={chipViewport}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {siteConfig.skills.tools.map((tool) => (
                <motion.span
                  key={tool}
                  variants={chipVariants}
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                    boxShadow: "0 8px 20px rgba(34, 211, 238, 0.1)",
                  }}
                  className="px-4 py-2.5 rounded-2xl text-sm font-mono text-gray-300 glass border border-white/5 hover:border-cyber/30 hover:text-cyber transition-colors cursor-default"
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Hardware */}
          <motion.div
            {...cardReveal}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Microcontrollers & Sensors
              </h3>
            </div>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={chipViewport}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {siteConfig.skills.hardware.map((hw) => (
                <motion.div
                  key={hw}
                  variants={chipVariants}
                  whileHover={{ scale: 1.03, x: 4 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-mono text-gray-300 bg-white/[0.02] border border-white/5 hover:border-amber-400/20 hover:text-amber-300 transition-all cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                  {hw}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
