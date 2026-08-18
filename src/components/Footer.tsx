"use client";

import { siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <p className="font-display text-lg font-extrabold text-accent">
          MLC / 2026
        </p>
        <nav className="flex flex-wrap justify-center gap-5" aria-label="Footer">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-[oklch(0.62_0.03_220)] hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="font-mono text-xs text-[oklch(0.55_0.03_220)]">
          Two years. Built by {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}
