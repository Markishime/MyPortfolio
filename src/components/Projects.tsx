"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";
import CinematicMedia from "./CinematicMedia";

type Project = (typeof siteConfig.projects)[number];
type Lane = "all" | "ai" | "embedded" | "web";

const LANES: { id: Lane; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "web", label: "Web" },
  { id: "embedded", label: "Embedded" },
];

function lede(text: string) {
  const sentence = text.split(/(?<=\.)\s/)[0];
  return sentence.length > 220 ? `${sentence.slice(0, 200).trim()}…` : sentence;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.73c-2.78.61-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.62.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.94.68 1.9v2.82c0 .27.16.58.67.49A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;

  return (
    <article className="project-row grid items-center gap-8 border-t border-white/10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
      <div
        className={cn(
          "lg:col-span-7",
          reversed && "lg:order-2"
        )}
      >
        <CinematicMedia
          image={project.image}
          video={project.video}
          alt={`${project.title} in motion`}
          kenBurns
          className="aspect-[16/10] w-full"
          sizes="(max-width: 1024px) 100vw, 58vw"
          overlayClassName="from-[oklch(0.15_0.026_240_/_0.35)] via-transparent to-transparent"
        />
      </div>

      <div className={cn("lg:col-span-5", reversed && "lg:order-1")}>
        <p className="chapter-index mb-4">
          {number} / {project.tag}
        </p>
        <h3 className="font-display text-3xl font-extrabold tracking-tight text-[oklch(0.96_0.02_220)] sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[oklch(0.76_0.03_220)]">
          {lede(project.description)}
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(0.62_0.03_220)]">
          {project.stack.join("  ·  ")}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm text-accent transition-opacity hover:opacity-80"
            >
              View live
              <span aria-hidden className="ml-2">
                →
              </span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-[oklch(0.78_0.03_220)] transition-colors hover:text-accent"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [lane, setLane] = useState<Lane>("all");

  const visible = useMemo(
    () =>
      siteConfig.projects.filter((project) =>
        lane === "all" ? true : (project.lanes as readonly string[]).includes(lane)
      ),
    [lane]
  );

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="scene scene-work"
    >
      <div className="scene-stage mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <header className="max-w-3xl">
          <p className="chapter-index mb-3">04 / Work</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-[oklch(0.95_0.02_220)] sm:text-6xl">
            Systems in motion.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[oklch(0.74_0.03_220)]">
            Nine shipped pieces. Scroll the reel. Each frame plays as it enters.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects">
          {LANES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLane(item.id)}
              aria-pressed={lane === item.id}
              className={cn(
                "min-h-11 rounded-full border px-4 text-xs uppercase tracking-wider",
                lane === item.id
                  ? "border-accent/40 bg-accent/15 text-accent"
                  : "border-white/10 text-[oklch(0.7_0.03_220)] hover:border-accent/30 hover:text-accent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {visible.map((project, index) => (
            <ProjectRow key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
