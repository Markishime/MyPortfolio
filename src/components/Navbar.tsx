"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const nodes = siteConfig.navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    nodes.forEach((node) => observer.observe(node));

    const onScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <ProgressBar />

      <motion.nav
        initial={false}
        className={cn(
          "portfolio-nav fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled
            ? "is-scrolled py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="portfolio-nav-inner mx-auto px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <motion.a
            href="#home"
            className="portfolio-logo relative group"
            aria-label="Mark Cuizon, home"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="portfolio-logo-mark" aria-hidden="true">M</span>
            <span className="portfolio-logo-name">Mark Cuizon</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="portfolio-nav-links hidden lg:flex items-center gap-1">
            {siteConfig.navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  activeSection === link.href.slice(1)
                    ? "active"
                    : "hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="portfolio-active-pill absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          <a href="#contact" className="portfolio-contact magnetic-target hidden xl:inline-flex">
            Contact me <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="portfolio-menu-toggle lg:hidden relative w-10 h-10 grid place-items-center"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="portfolio-mobile-menu lg:hidden mx-4 mt-2 rounded-2xl overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-1">
                {siteConfig.navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      activeSection === link.href.slice(1)
                        ? "text-accent bg-accent/10"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/50"
                    )}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={barRef} className="progress-bar" />;
}
