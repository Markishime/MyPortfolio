"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import CinematicMedia from "./CinematicMedia";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: 12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 perspective-grid opacity-30" />
      <div className="absolute inset-0 cinematic-depth-fog pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/[0.04] rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <SectionHeading
          badge="Work"
          title="Featured Projects"
          subtitle="From IoT systems to life OS and adaptive fitness platforms"
        />

        {/* Marquee Tech Stack */}
        <div className="mb-16 overflow-hidden relative">
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-cyber-deeper to-transparent z-10" />
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-cyber-deeper to-transparent z-10" />
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[
              "React.js",
              "Next.js",
              "ESP32",
              "TensorFlow",
              "Firebase",
              "Flutter",
              "Python",
              "LangChain",
              "Gemini AI",
              "Capacitor",
              "Supabase",
              "Node.js",
              "TypeScript",
              "React.js",
              "Next.js",
              "ESP32",
              "TensorFlow",
              "Firebase",
              "Flutter",
              "Python",
              "LangChain",
              "Gemini AI",
              "Capacitor",
              "Supabase",
              "Node.js",
              "TypeScript",
            ].map((tech, i) => (
              <span
                key={i}
                className="text-sm font-mono text-gray-600 uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 3D Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: 1400 }}
        >
          {siteConfig.projects.map((project, i) => {
            const isFeatured =
              project.title === "Orbit AI" || project.title === "Kinestra";
            const wide = isFeatured || i === 0 || i === 5;

            return (
              <motion.div
                key={project.title}
                variants={cardVariants}
                className={wide ? "md:col-span-2 lg:col-span-2" : ""}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TiltCard
                  intensity={isFeatured ? 3 : 4}
                  hoverScale={1.006}
                  className="h-full"
                >
                  <div
                    className={`group relative glass-card cinematic-card rounded-3xl overflow-hidden h-full ${
                      isFeatured ? "cinematic-card-featured" : ""
                    }`}
                  >
                    {/* Depth layers */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-35 transition-opacity duration-700`}
                    />
                    <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 cinematic-border-glow" />

                    {/* Floating orb accent */}
                    <div
                      className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(0,255,170,0.5), transparent 70%)",
                      }}
                    />

                    <CinematicMedia
                      image={project.image}
                      video={project.video}
                      alt={`${project.title} cinematic still`}
                      className={
                        wide
                          ? "h-48 sm:h-60"
                          : "h-40 sm:h-48"
                      }
                      overlayClassName="from-[#071018] via-[#071018]/25 to-transparent"
                    />

                    <div
                      className="relative p-6 sm:p-8 h-full flex flex-col"
                      style={{ transform: "translateZ(8px)" }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className="text-3xl drop-shadow-[0_8px_16px_rgba(0,255,170,0.25)]"
                          style={{ transform: "translateZ(12px)" }}
                        >
                          {project.icon}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-accent/70 bg-accent/5 border border-accent/10">
                          {project.tag}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                        {project.description}
                      </p>

                      <div className="relative z-10 flex gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-gray-400 hover:text-accent border border-gray-700/50 hover:border-accent/30 transition-all duration-300 hover:bg-accent/5"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.73c-2.78.61-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.62.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.94.68 1.9v2.82c0 .27.16.58.67.49A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                            </svg>
                            Code
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-accent bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
