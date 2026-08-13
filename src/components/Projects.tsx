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

function hrefLabel(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.73c-2.78.61-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.62.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.94.68 1.9v2.82c0 .27.16.58.67.49A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

function LiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  );
}

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

                    <div className="relative flex h-full flex-col">
                    <div className="relative">
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
                    {(project.github || project.live) && (
                      <div className="absolute top-3 right-3 z-20 flex gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub: ${hrefLabel(project.github)}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#071018]/75 text-gray-200 backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            <GitHubIcon className="h-4 w-4" />
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} live site: ${hrefLabel(project.live)}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent backdrop-blur-md transition-colors hover:border-accent/60 hover:bg-accent/25"
                          >
                            <LiveIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                    </div>

                    <div
                      className="relative flex flex-1 flex-col p-6 sm:p-8"
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

                      <div className="relative z-10 mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-w-0 items-center gap-2 rounded-full border border-gray-700/50 px-4 py-2 font-mono text-xs text-gray-300 transition-all duration-300 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
                          >
                            <GitHubIcon className="h-4 w-4 shrink-0" />
                            <span className="shrink-0">GitHub</span>
                            <span className="truncate text-gray-500 group-hover:text-gray-400">
                              {hrefLabel(project.github)}
                            </span>
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-w-0 items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 font-mono text-xs text-accent transition-all duration-300 hover:border-accent/40 hover:bg-accent/10"
                          >
                            <LiveIcon className="h-3 w-3 shrink-0" />
                            <span className="shrink-0">Live</span>
                            <span className="truncate text-accent/70">
                              {hrefLabel(project.live)}
                            </span>
                          </a>
                        )}
                      </div>
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
