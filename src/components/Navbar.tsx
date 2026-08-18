"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsScrolled(window.scrollY > 40);
        const sections = document.querySelectorAll<HTMLElement>("section[id]");
        const y = window.scrollY + 130;
        sections.forEach((section) => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (y >= top && y < top + height) {
            setActiveSection(section.id);
          }
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="progress-bar" />
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-[background,padding] duration-300",
          isScrolled || isMobileOpen
            ? "bg-[oklch(0.16_0.03_240)] py-3 shadow-[0_1px_0_oklch(0.86_0.16_165_/_0.14)]"
            : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="#home" className="font-display text-2xl font-extrabold text-accent">
            MLC
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {siteConfig.navLinks.map((link) => {
              const id = link.href.slice(1);
              const active = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "text-accent"
                      : "text-[oklch(0.72_0.03_220)] hover:text-[oklch(0.95_0.02_220)]"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-expanded={isMobileOpen}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-accent" />
            <span className="block h-0.5 w-6 bg-accent" />
            <span className="block h-0.5 w-6 bg-accent" />
          </button>
        </div>

        {isMobileOpen && (
          <nav
            className="mx-4 mt-2 rounded-sm border border-white/10 bg-[oklch(0.16_0.03_240)] p-3 md:hidden"
            aria-label="Mobile"
          >
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block min-h-11 px-4 py-3 text-sm text-[oklch(0.92_0.02_220)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
