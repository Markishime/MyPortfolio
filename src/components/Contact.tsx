"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/data";

const socialLinks = [
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    value: siteConfig.email,
  },
  {
    label: "Phone",
    href: `tel:${siteConfig.phone}`,
    value: siteConfig.phone,
  },
  {
    label: "LinkedIn",
    href: siteConfig.linkedin,
    value: "Mark Lloyd Cuizon",
  },
  {
    label: "GitHub",
    href: siteConfig.github,
    value: "@Markishime",
  },
];

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="scene py-28 pt-32 sm:py-36">
      <div className="layer depth-0" aria-hidden="true">
        <Image
          src="/media/cebu-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[oklch(0.15_0.026_240_/_0.78)]" />
      </div>

      <div className="scene-content relative mx-auto max-w-5xl px-6 lg:px-8">
        <p className="chapter-index mb-4">07 / Contact</p>
        <h2 className="font-display text-4xl font-extrabold leading-[0.92] tracking-tight text-[oklch(0.95_0.02_220)] sm:text-6xl">
          If the reel fits,
          <span className="mt-2 block text-accent">write the next scene.</span>
        </h2>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex min-h-16 items-center justify-between border border-white/10 bg-[oklch(0.2_0.03_240_/_0.82)] px-5 py-4 transition-colors hover:border-accent/40"
            >
              <span>
                <span className="chapter-index block">{link.label}</span>
                <span className="mt-1 block text-sm text-[oklch(0.9_0.02_220)]">
                  {link.value}
                </span>
              </span>
              <span className="text-accent" aria-hidden>
                →
              </span>
            </a>
          ))}
        </div>

        <a
          href={`mailto:${siteConfig.email}?subject=Let's%20Collaborate`}
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold text-[oklch(0.16_0.03_240)]"
        >
          Send a message
        </a>
      </div>
    </section>
  );
}
