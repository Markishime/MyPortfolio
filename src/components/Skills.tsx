"use client";

import { siteConfig } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" aria-label="Skills" className="scene py-28 pt-32 sm:py-36">
      <div className="layer depth-1" aria-hidden="true">
        <div className="glow-blob bottom-[10%] left-[8%] h-72 w-72 bg-accent/10" />
      </div>
      <div className="scene-content mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="chapter-index mb-4">05 / Stack</p>
          <h2 className="font-display text-4xl font-extrabold leading-[0.94] tracking-tight text-[oklch(0.95_0.02_220)] sm:text-6xl">
            Languages that stay.
            <span className="mt-2 block text-accent">Tools that move.</span>
          </h2>
        </div>

        <div className="space-y-5">
          {siteConfig.skills.languages.map((lang) => (
            <div key={lang.name}>
              <div className="mb-2 flex justify-between font-mono text-sm">
                <span>{lang.name}</span>
                <span className="text-accent/70">{lang.level}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="skill-fill h-full rounded-full bg-accent"
                  style={{ ["--level" as string]: lang.level / 100 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 grid gap-10 md:grid-cols-3">
          <StackColumn title="Frameworks" items={siteConfig.skills.frameworks} />
          <StackColumn title="Platforms" items={siteConfig.skills.tools} />
          <StackColumn title="Hardware" items={siteConfig.skills.hardware} />
        </div>
      </div>
    </section>
  );
}

function StackColumn({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <p className="chapter-index mb-4">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-white/5 py-2 text-sm text-[oklch(0.82_0.02_220)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
