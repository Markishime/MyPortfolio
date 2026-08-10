"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import SectionHeading from "./SectionHeading";

const stats = [
  { value: "6+", label: "Projects Built" },
  { value: "3", label: "Hackathons" },
  { value: "11+", label: "Certifications" },
  { value: "4", label: "Years Experience" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden section-cinematic">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 cinematic-depth-fog pointer-events-none opacity-60" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <SectionHeading
          badge="About"
          title="About Me"
          subtitle="Bridging hardware and software with practical, impactful solutions"
        />

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="bento-grid"
        >
          {/* Profile Card - Large */}
          <motion.div
            variants={itemVariants}
            className="bento-item-wide glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8"
          >
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-accent/20 to-cyber/20 flex items-center justify-center overflow-hidden border border-accent/20">
                <img
                  src="/mark.jpeg"
                  alt="Mark Lloyd Cuizon"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span class="text-5xl">👨‍💻</span>';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-cyber-dark text-xs font-bold">CE</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                {siteConfig.name}
              </h3>
              <p className="text-gray-400 leading-relaxed font-mono text-sm">
                An adaptable Computer Engineer with hands-on experience in web
                development, mobile development, embedded systems, machine
                learning, and AI. I build practical solutions that connect
                hardware and software, from IoT security systems to AI-powered
                platforms.
              </p>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
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
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono text-accent/60 uppercase tracking-wider mb-1">
                Education
              </p>
              <h4 className="text-lg font-display font-semibold text-white mb-1">
                {siteConfig.education.degree}
              </h4>
              <p className="text-sm text-gray-400">{siteConfig.education.school}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {siteConfig.education.years}
              </p>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cyber/10 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-cyber"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono text-cyber/60 uppercase tracking-wider mb-1">
                Location
              </p>
              <h4 className="text-lg font-display font-semibold text-white">
                Cebu, Philippines
              </h4>
              <p className="text-sm text-gray-400">Minglanilla, Cebu City</p>
            </div>
          </motion.div>

          {/* Stats Row */}
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center"
            >
              <span className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}

          {/* Philosophy Card - Wide */}
          <motion.div
            variants={itemVariants}
            className="bento-item-wide glass-card rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
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
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
            </div>
            <p className="text-gray-400 leading-relaxed relative z-10">
              I bring strong technical ability, a dedicated work ethic, and
              effective communication skills. Focused on delivering measurable
              impact in fast-moving, collaborative teams — whether it&apos;s shipping
              AI platforms, building IoT prototypes, or crafting full-stack
              applications.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
