"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/data";

const selections = ["CropDrive AI", "Simplabots", "Kinestra", "Soda+"];
const projects = selections.map((title) => siteConfig.projects.find((project) => project.title === title)!);

export default function OriginScene() {
  const reduce = useReducedMotion();

  return (
    <section id="origin" className="origin-scene" aria-labelledby="origin-title">
      <div className="origin-layout portfolio-section-wrap">
        <motion.div
          className="origin-copy"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="origin-location"><span aria-hidden="true" />Minglanilla · Cebu · Philippines</p>
          <h2 id="origin-title">From Cebu<span>to working<br />systems.</span></h2>
          <p className="origin-description">
            Rooted in curiosity. Built to be useful. I turn complex problems into
            considered digital products, from AI for agriculture to tools for everyday life.
          </p>
          <a href="#projects" className="origin-work-link">Explore the projects <ArrowDownRight size={20} aria-hidden="true" /></a>
          <div className="origin-disciplines" aria-label="Areas of work">
            <span>Full stack</span><span>Applied AI</span><span>Embedded systems</span>
          </div>
        </motion.div>

        <div className="origin-showcase">
          <div className="origin-showcase-header"><span>A few things I’ve built</span><span>Selected / 01–04</span></div>
          <div className="origin-mosaic">
            {projects.map((project, index) => (
              <motion.a
                key={project.title}
                href={project.live!}
                target="_blank"
                rel="noopener noreferrer"
                className={`origin-project origin-project-${index + 1}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`${project.title}, open live project`}
              >
                <div className="origin-project-image"><img src={project.image} alt={`${project.title} interface`} loading="lazy" /></div>
                <div className="origin-project-caption">
                  <span><small>{project.tag}</small><strong>{project.title}</strong></span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
              </motion.a>
            ))}
          </div>
          <p className="origin-showcase-footer"><span aria-hidden="true">↳</span> Ideas made tangible. Explore the full collection below.</p>
        </div>
      </div>
    </section>
  );
}
