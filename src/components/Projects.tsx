"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { easeOutExpo, inViewCard } from "@/lib/motion";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import CinematicMedia from "./CinematicMedia";

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
  wide,
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
  wide: boolean;
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
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={inViewCard}
      transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      whileHover={reduce ? undefined : { y: -8 }}
      className={cn(
        "group relative h-full overflow-hidden rounded-3xl glass-card cinematic-card",
        featured && "cinematic-card-featured",
        open && "ring-1 ring-accent/35",
        wide && "md:col-span-2 lg:col-span-2"
      )}
      onMouseEnter={() => onPreview(true)}
      onMouseLeave={() => onPreview(false)}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20 group-focus-within:opacity-20`}
      />

      <div className="relative flex h-full flex-col">
        <div className="relative">
          <CinematicMedia
            image={project.image}
            video={project.video}
            alt={`${project.title} preview`}
            kenBurns={!project.video}
            playing={previewing || open}
            className={wide ? "h-48 sm:h-56" : "h-40 sm:h-48"}
            overlayClassName="from-[#071018] via-[#071018]/25 to-transparent"
          />

          {project.video && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="absolute bottom-3 left-3 z-20 rounded-full border border-white/15 bg-[#071018]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-gray-200 backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent"
              aria-pressed={previewing || open}
            >
              {previewing || open ? "Previewing" : "Preview"}
            </button>
          )}

          <div className="absolute top-3 right-3 z-20 flex gap-2">
            {featured && (
              <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                Featured
              </span>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} on GitHub`}
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
                aria-label={`Open ${project.title} live site`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent backdrop-blur-md transition-colors hover:border-accent/60 hover:bg-accent/25"
              >
                <LiveIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6 sm:p-8">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-3xl">{project.icon}</span>
            <span className="rounded-full border border-accent/10 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent/70">
              {project.tag}
            </span>
          </div>

          <h3 className="mb-3 font-display text-xl font-bold text-white transition-colors duration-200 group-hover:text-accent sm:text-2xl">
            {project.title}
          </h3>

          <p
            className={cn(
              "mb-4 text-sm leading-relaxed text-gray-400",
              !open && "line-clamp-3"
            )}
          >
            {project.description}
          </p>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="mb-5 self-start font-mono text-[11px] uppercase tracking-wider text-accent/80 transition-colors hover:text-accent"
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
                  "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                  activeTech === item
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-accent/30 hover:text-accent"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative z-10 mt-auto flex flex-wrap gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-700/50 px-4 py-2 font-mono text-xs text-gray-300 transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
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
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 font-mono text-xs text-accent transition-colors hover:border-accent/45 hover:bg-accent/15"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Live
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [lane, setLane] = useState<Lane>("all");
  const [tech, setTech] = useState<string | null>(null);
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  const visible = useMemo(
    () => siteConfig.projects.filter((project) => matchesProject(project, lane, tech)),
    [lane, tech]
  );

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
    <section id="projects" className="relative overflow-hidden py-32">
      <div className="perspective-grid absolute inset-0 opacity-20" />
      <div className="cinematic-depth-fog pointer-events-none absolute inset-0" />
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Work"
          title="Featured Projects"
          subtitle="From connected systems to life OS and adaptive fitness platforms"
        />

        <div className="mb-6 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects">
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
                onClick={() => setLane(item.id)}
                aria-pressed={lane === item.id}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                  lane === item.id
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-white/10 text-gray-400 hover:border-accent/25 hover:text-accent"
                )}
              >
                {item.label}
                <span className="ml-2 text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-12 flex flex-wrap gap-2" role="toolbar" aria-label="Filter by stack">
          {techOptions.map(([item, count]) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleTech(item)}
              aria-pressed={tech === item}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                tech === item
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-white/10 text-gray-500 hover:border-accent/25 hover:text-accent"
              )}
            >
              {item}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          ))}
          {tech && (
            <button
              type="button"
              onClick={() => setTech(null)}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-gray-500 underline-offset-4 hover:text-accent hover:underline"
            >
              Clear stack
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-white/10 px-6 py-10 text-sm text-gray-400">
            No projects match that mix. Clear the stack filter or pick another lane.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => {
              const featured =
                project.title === "Orbit AI" || project.title === "Kinestra";
              const wide = featured || i === 0 || i === 5;

              return (
                <ProjectCard
                  key={project.title}
                  project={project}
                  wide={wide}
                  featured={featured}
                  open={openTitle === project.title}
                  previewing={previewTitle === project.title}
                  activeTech={tech}
                  delay={Math.min(i, 3) * 0.07}
                  onToggle={() =>
                    setOpenTitle((current) =>
                      current === project.title ? null : project.title
                    )
                  }
                  onPreview={(next) =>
                    setPreviewTitle(next ? project.title : null)
                  }
                  onTech={toggleTech}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
