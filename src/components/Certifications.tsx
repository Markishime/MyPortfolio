"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { fadeUp, inView, staggerCards } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./react-bits/SpotlightCard";
import TiltedCard from "./react-bits/TiltedCard";
import AnimatedList from "./react-bits/AnimatedList";

export default function Certifications() {
  const reduce = useReducedMotion();

  return (
    <section id="certifications" className="relative py-24 lg:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative glass-panel rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          badge="Recognition"
          title="Certifications & Hackathons"
          subtitle="The paper trail — hackathons, courses, and the work they led to."
        />

        <motion.div
          className="cert-layout"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltedCard
            imageSrc="/mark.jpeg"
            altText="Mark Lloyd Cuizon ID"
            captionText="CE · 2025"
            containerHeight="460px"
            containerWidth="100%"
            imageHeight="460px"
            imageWidth="100%"
            rotateAmplitude={14}
            scaleOnHover={1.06}
            showMobileWarning={false}
            displayOverlayContent
            overlayContent={
              <div className="id-overlay">
                <small>ID CARD</small>
                <strong>Mark Lloyd Cuizon</strong>
                <span>Full Stack Developer</span>
              </div>
            }
          />

          <div>
            <p className="kicker mb-4">Certificates</p>
            <AnimatedList items={[...siteConfig.certifications]} />
          </div>
        </motion.div>

        <p className="kicker mb-4 mt-12">Hackathons</p>
        <motion.div
          className="hack-grid"
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={inView}
          variants={staggerCards}
        >
          {siteConfig.hackathons.map((hack, index) => (
            <motion.div key={hack.name} variants={reduce ? undefined : fadeUp}>
              <SpotlightCard className="min-h-[160px] flex flex-col justify-between">
                <span className="meta">0{index + 1}</span>
                <div>
                  <h4>{hack.name}</h4>
                  <p>{hack.role}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
