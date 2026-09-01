"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { fadeUp, inView, riseScale, staggerCards } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./react-bits/SpotlightCard";
import TiltedCard from "./react-bits/TiltedCard";
import CountUp from "./react-bits/CountUp";

const stats = [
  { value: 6, suffix: "+", label: "Projects Built" },
  { value: 3, suffix: "", label: "Hackathons" },
  { value: 11, suffix: "+", label: "Certifications" },
  { value: 2, suffix: "", label: "Years Experience" },
];

const copyLines = [
  "An adaptable Full Stack Developer and Computer Engineer with hands-on experience in web development, mobile development, embedded systems, machine learning, and AI. I build practical solutions that connect hardware and software, from connected devices to platforms people actually use.",
  "Strong technical ability, a dedicated work ethic, and clear communication — focused on measurable impact in fast-moving teams.",
];

export default function About() {
  const reduce = useReducedMotion();
  const list = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: inView,
        variants: staggerCards,
      };
  const card = reduce
    ? {}
    : {
        variants: fadeUp,
        whileHover: { y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section id="about" className="relative py-24 lg:py-28 overflow-hidden section-cinematic">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative glass-panel rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          badge="About"
          title="About Me"
          subtitle="Bridging hardware and software with practical, impactful solutions"
        />

        <div className="about-layout">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -48, rotate: -4 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0, rotate: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltedCard
              imageSrc="/mark.jpeg"
              altText="Mark Lloyd Cuizon"
              captionText="Mark Lloyd Cuizon"
              containerHeight="420px"
              containerWidth="100%"
              imageHeight="420px"
              imageWidth="100%"
              rotateAmplitude={reduce ? 0 : 12}
              scaleOnHover={reduce ? 1 : 1.05}
              showMobileWarning={false}
              showTooltip
            />
          </motion.div>

          <motion.div
            className="about-copy"
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={inView}
            variants={staggerCards}
          >
            <motion.p className="kicker" variants={reduce ? undefined : fadeUp}>
              Computer Engineer
            </motion.p>
            <motion.h3 variants={reduce ? undefined : riseScale}>{siteConfig.name}</motion.h3>
            {copyLines.map((line) => (
              <motion.p key={line.slice(0, 24)} variants={reduce ? undefined : fadeUp}>
                {line}
              </motion.p>
            ))}
          </motion.div>
        </div>

        <motion.div className="about-grid" {...list}>
          <motion.div {...card}>
            <SpotlightCard className="h-full min-h-[160px]">
              <p className="kicker">Education</p>
              <h4>{siteConfig.education.degree}</h4>
              <p>{siteConfig.education.school}</p>
              <p className="meta">{siteConfig.education.years}</p>
            </SpotlightCard>
          </motion.div>
          <motion.div {...card}>
            <SpotlightCard className="h-full min-h-[160px]">
              <p className="kicker">Location</p>
              <h4>Cebu, Philippines</h4>
              <p>Minglanilla, Cebu City</p>
            </SpotlightCard>
          </motion.div>
          {stats.map((stat, index) => (
            <motion.div key={stat.label} {...card}>
              <SpotlightCard className="h-full min-h-[140px] text-center flex flex-col items-center justify-center">
                <motion.span
                  className="stat-value"
                  initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                  whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                  viewport={inView}
                  transition={{ duration: 0.55, delay: 0.12 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </motion.span>
                <span className="stat-label">{stat.label}</span>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
