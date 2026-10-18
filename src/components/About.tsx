"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { fadeUp, inView, staggerCards } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import TiltedCard from "./react-bits/TiltedCard";
import CountUp from "./react-bits/CountUp";

const stats = [
  { value: siteConfig.projectsBuilt, suffix: "", label: "Projects Built" },
  { value: siteConfig.hackathons.length, suffix: "", label: "Hackathons" },
  { value: 11, suffix: "+", label: "Certifications" },
];

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative py-24 lg:py-28 overflow-hidden section-cinematic tone-coral">
      <div className="portfolio-section-wrap">
        <SectionHeading
          badge="About"
          title="An engineer. A hands-on builder."
          subtitle="Connecting software, hardware, and intelligence from Cebu, Philippines."
        />

        <div className="about-layout">
          <motion.div
            className="about-portrait"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7 }}
          >
            <TiltedCard
              imageSrc="/mark.jpeg"
              altText="Mark Lloyd Cuizon"
              captionText="Mark Lloyd Cuizon"
              containerHeight="440px"
              containerWidth="100%"
              imageHeight="440px"
              imageWidth="100%"
              rotateAmplitude={reduce ? 0 : 5}
              scaleOnHover={reduce ? 1 : 1.02}
              showMobileWarning={false}
              showTooltip
            />
            <p className="about-portrait-caption">Minglanilla, Cebu <span>Based here. Building everywhere.</span></p>
          </motion.div>

          <motion.div
            className="about-copy"
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={inView}
            variants={staggerCards}
          >
            <motion.p className="kicker" variants={reduce ? undefined : fadeUp}>The person behind the projects</motion.p>
            <motion.h3 variants={reduce ? undefined : fadeUp}>{siteConfig.name}</motion.h3>
            <motion.p variants={reduce ? undefined : fadeUp}>
              I’m a Full Stack Developer, AI Developer, and Computer Engineer. I build
              practical tools across web, mobile, and embedded systems, connecting
              ideas to software people can actually use.
            </motion.p>

            <motion.div className="experience-tracks" variants={reduce ? undefined : fadeUp}>
              {siteConfig.experience.map((experience, index) => (
                <div className="experience-track" key={experience.type}>
                  <span className="experience-index" aria-hidden="true">0{index + 1}</span>
                  <h4>{experience.type} experience</h4>
                  <p className="experience-duration">{experience.duration}</p>
                  <p className="experience-detail">{experience.detail}</p>
                </div>
              ))}
            </motion.div>

            <motion.div className="about-education" variants={reduce ? undefined : fadeUp}>
              <span>Education</span>
              <strong>{siteConfig.education.degree}</strong>
              <p>{siteConfig.education.school} <span>· {siteConfig.education.years}</span></p>
            </motion.div>
          </motion.div>
        </div>

        <dl className="about-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd><CountUp to={stat.value} suffix={stat.suffix} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
