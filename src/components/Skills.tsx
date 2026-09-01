"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import OptionWheel from "./react-bits/OptionWheel";

const CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "AI & ML",
  "Mobile",
  "Data & Cloud",
  "Embedded",
  "Dev Tools",
  "Engineering",
  "Professional",
] as const;

const CATEGORY_SKILLS = {
  Languages: siteConfig.skills.languages,
  Frontend: siteConfig.skills.frontend,
  Backend: siteConfig.skills.backend,
  "AI & ML": siteConfig.skills.artificialIntelligence,
  Mobile: siteConfig.skills.mobile,
  "Data & Cloud": siteConfig.skills.databasesCloud,
  Embedded: siteConfig.skills.embedded,
  "Dev Tools": siteConfig.skills.developmentTools,
  Engineering: siteConfig.skills.softwareEngineering,
  Professional: siteConfig.skills.professional,
} as const;

const CORE_STACK = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Python",
  "JavaScript (ES6+)",
  "REST APIs",
  "AI Agents",
  "LangChain",
  "FastAPI",
  "Firebase",
  "Supabase",
  "PostgreSQL",
  "React Native",
  "ESP32",
];

export default function Skills() {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Languages");

  return (
    <section id="skills" className="relative py-24 lg:py-28 overflow-hidden section-cinematic">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 cinematic-depth-fog pointer-events-none opacity-50" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative glass-panel rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          badge="Expertise"
          title="Skills & Technologies"
          subtitle="The stack I ship with — spin the wheel for the rest of the toolkit"
        />

        <div className="core-stack mb-10">
          {CORE_STACK.map((item) => (
            <span key={item} className="core-chip">
              {item}
            </span>
          ))}
        </div>

        <motion.div
          className="skills-wheel-stage"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-panel rounded-[2rem] overflow-hidden">
            <OptionWheel
              items={[...CATEGORIES]}
              defaultSelected={0}
              fontSize={1.55}
              inset={36}
              tilt={8}
              blur={1.4}
              fade={0.28}
              textColor="#6b6560"
              activeColor="#1b1915"
              onChange={(_, item) => setCategory(item as (typeof CATEGORIES)[number])}
            />
          </div>

          <TiltCard intensity={reduce ? 0 : 6} className="h-full">
            <motion.div
              key={category}
              initial={reduce ? false : { opacity: 0, rotateY: 12, y: 16 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-[2rem] p-8 h-full min-h-[420px]"
            >
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                Selected layer
              </p>
              <h3 className="mb-6 text-2xl font-display font-bold text-foreground">{category}</h3>

              <div className="flex flex-wrap gap-3">
                {CATEGORY_SKILLS[category].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2.5 rounded-2xl text-sm font-mono text-foreground/80 glass border border-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
