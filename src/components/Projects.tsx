"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { easeOutExpo, inViewCard } from "@/lib/motion";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import CinematicMedia from "./CinematicMedia";
import TiltCard from "./TiltCard";
import DepthCarousel from "./react-bits/DepthCarousel";

type Project = (typeof siteConfig.projects)[number];
type Lane = "all" | "ai" | "embedded" | "web";

const LANES: { id: Lane; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "web", label: "Web" },
  { id: "embedded", label: "Embedded" },
];

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

function matchesProject(project: Project, lane: Lane, tech: string | null) {
  if (tech && !(project.stack as readonly string[]).includes(tech)) return false;
  if (lane === "all") return true;
  return (project.lanes as readonly string[]).includes(lane);
}

function ProjectCard({
  project,
  featured,
  open,
  previewing,
  activeTech,
  delay,
  onToggle,
  onPreview,
  onTech,
}: {
  project: Project;
  featured: boolean;
  open: boolean;
  previewing: boolean;
  activeTech: string | null;
  delay: number;
  onToggle: () => void;
  onPreview: (next: boolean) => void;
  onTech: (tech: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40, rotateX: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={inViewCard}
      transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      className="project-card-shell h-full"
    >
      <TiltCard className="h-full" intensity={reduce ? 0 : 7} hoverScale={1.02}>
        <div
          className={cn(
            "group relative flex h-full flex-col overflow-hidden rounded-3xl glass-card cinematic-card",
            featured && "cinematic-card-featured",
            open && "ring-1 ring-accent/35"
          )}
          onMouseEnter={() => onPreview(true)}
          onMouseLeave={() => onPreview(false)}
        >
          <CinematicMedia
            image={project.image}
            video={project.video}
            alt={`${project.title} preview`}
            kenBurns={!project.video}
            playing={previewing || open}
            className="h-44 sm:h-52"
            overlayClassName="from-[#071018] via-[#071018]/25 to-transparent"
          />
          <div className="relative flex flex-1 flex-col p-6 sm:p-8 pb-20 sm:pb-24">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-3xl">{project.icon}</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent/80">
                {project.tag}
              </span>
            </div>
            <h3 className="mb-3 font-display text-xl font-bold text-foreground group-hover:text-accent sm:text-2xl">
              {project.title}
            </h3>
            <p className={cn("mb-4 text-sm leading-relaxed text-foreground/70", !open && "line-clamp-3")}>
              {project.description}
            </p>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="mb-5 self-start font-mono text-[11px] uppercase tracking-wider text-accent/80 hover:text-accent"
            >
              {open ? "Show less" : "Read more"}
            </button>
            <div className="mb-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onTech(item)}
                  aria-pressed={activeTech === item}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                    activeTech === item
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-foreground/10 bg-white/40 text-foreground/55 hover:border-accent/30 hover:text-accent"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
      <div className="project-card-actions">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-cta"
          >
            <GitHubIcon className="h-4 w-4 shrink-0" />
            GitHub
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="project-cta project-cta-live"
          >
            <LiveIcon className="h-3.5 w-3.5" />
            Live
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const [lane, setLane] = useState<Lane>("all");
  const [tech, setTech] = useState<string | null>(null);
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const visible = useMemo(
    () => siteConfig.projects.filter((project) => matchesProject(project, lane, tech)),
    [lane, tech]
  );

  const carouselItems = useMemo(
    () =>
      visible.map((project) => ({
        image: project.image,
        alt: project.title,
        title: project.title,
        tag: project.tag,
      })),
    [visible]
  );

  const activeProject = visible[Math.min(activeIndex, Math.max(visible.length - 1, 0))];

  const techOptions = useMemo(() => {
    const counts = new Map<string, number>();
    siteConfig.projects.forEach((project) => {
      if (lane !== "all" && !(project.lanes as readonly string[]).includes(lane)) return;
      project.stack.forEach((item) => {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      });
    });
    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [lane]);

  const toggleTech = (value: string) => {
    setTech((current) => (current === value ? null : value));
  };

  return (
    <section id="projects" className="relative overflow-hidden py-24 lg:py-28 tone-indigo">
      <div className="perspective-grid absolute inset-0 opacity-20" />
      <div className="cinematic-depth-fog pointer-events-none absolute inset-0" />
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute inset-0 section-tint pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 glass-panel rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          badge="Work"
          title="Featured Projects"
          subtitle="From connected systems to life OS and adaptive fitness platforms"
        />

        <motion.div
          className="projects-depth-stage glass-panel"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={inViewCard}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          {carouselItems.length > 0 && (
            <DepthCarousel
              key={`${lane}-${tech ?? "all"}`}
              items={carouselItems}
              cardWidth={320}
              cardHeight={420}
              radius={22}
              depth={240}
              spread={96}
              tilt={24}
              autoplay={!reduce}
              autoplayDelay={3800}
              onChange={(index) => setActiveIndex(index)}
            />
          )}
        </motion.div>

        {activeProject && (
          <motion.div
            className="project-feature-panel glass-panel mb-12 overflow-hidden rounded-3xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={inViewCard}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <CinematicMedia
              image={activeProject.image}
              video={activeProject.video}
              alt={`${activeProject.title} featured preview`}
              playing={!reduce}
              className="project-feature-media"
              overlayClassName="project-feature-overlay"
            />
            <div className="project-feature-copy">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent/80">
                Selected project · {activeProject.tag}
              </p>
              <h3 className="mb-3 font-display text-3xl text-foreground sm:text-4xl">{activeProject.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-foreground/70 sm:text-base">
                {activeProject.description}
              </p>
              <div className="relative z-10 mb-6 flex flex-wrap gap-2">
                {activeProject.stack.map((item) => (
                  <span key={item} className="project-feature-chip">{item}</span>
                ))}
              </div>
              <div className="relative z-10 flex flex-wrap gap-3">
                {activeProject.live && (
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-cta project-cta-live"
                  >
                    <LiveIcon className="h-3.5 w-3.5" />
                    Live
                  </a>
                )}
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-cta"
                  >
                    <GitHubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="mb-6 flex flex-wrap gap-2"
          role="toolbar"
          aria-label="Filter projects"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={inViewCard}
          transition={{ duration: 0.45, ease: easeOutExpo }}
        >
          {LANES.map((item) => {
            const count =
              item.id === "all"
                ? siteConfig.projects.length
                : siteConfig.projects.filter((project) =>
                    (project.lanes as readonly string[]).includes(item.id)
                  ).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setLane(item.id);
                  setActiveIndex(0);
                }}
                aria-pressed={lane === item.id}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur-xl",
                  lane === item.id
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-foreground/10 bg-white/50 text-foreground/55 hover:border-accent/25 hover:text-accent"
                )}
              >
                {item.label}
                <span className="ml-2 text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          className="mb-12 flex flex-wrap gap-2"
          role="toolbar"
          aria-label="Filter by stack"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={inViewCard}
          transition={{ duration: 0.45, delay: 0.05, ease: easeOutExpo }}
        >
          {techOptions.map(([item, count]) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleTech(item)}
              aria-pressed={tech === item}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider backdrop-blur-xl",
                tech === item
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-foreground/10 bg-white/50 text-foreground/50 hover:border-accent/25 hover:text-accent"
              )}
            >
              {item}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          ))}
        </motion.div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-foreground/10 bg-white/50 px-6 py-10 text-sm text-foreground/55">
            No projects match that mix. Clear the stack filter or pick another lane.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 glass-stage">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                featured={project.title === "Soda+" || project.title === "Kinestra"}
                open={openTitle === project.title}
                previewing={previewTitle === project.title}
                activeTech={tech}
                delay={Math.min(i, 3) * 0.07}
                onToggle={() =>
                  setOpenTitle((current) => (current === project.title ? null : project.title))
                }
                onPreview={(next) => setPreviewTitle(next ? project.title : null)}
                onTech={toggleTech}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
