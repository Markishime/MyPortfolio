"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { fadeUp, inView, staggerCards } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import dynamic from "next/dynamic";

const SpecularButton = dynamic(() => import("./react-bits/SpecularButton"), {
  ssr: false,
  loading: () => (
    <span className="inline-flex min-h-12 items-center rounded-full border border-foreground/15 bg-white/70 px-8 py-4 text-sm text-foreground">
      Send a Message
    </span>
  ),
});

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
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="relative py-24 lg:py-28 overflow-hidden section-cinematic tone-rose">
      <div className="absolute inset-0 cinematic-depth-fog pointer-events-none" />
      <div className="absolute inset-0 section-tint pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative glass-panel rounded-[2rem] p-6 sm:p-10">
        <SectionHeading
          badge="Contact"
          title="Let's Connect"
          subtitle="Ready to collaborate on cutting-edge tech projects?"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 glass-stage"
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={inView}
          variants={staggerCards}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variants={reduce ? undefined : fadeUp}
            >
              <TiltCard intensity={reduce ? 0 : 8} className="h-full">
                <div className="glass-card rounded-3xl p-6 h-full">
                  <p className="text-xs font-mono text-foreground/50 uppercase tracking-wider mb-1">
                    {link.label}
                  </p>
                  <p className="text-sm font-medium text-foreground">{link.value}</p>
                </div>
              </TiltCard>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-foreground/55 text-sm font-mono mb-6">Or send me a message directly</p>
          <SpecularButton
            size="lg"
            radius={999}
            tint="#ffffff"
            tintOpacity={0.6}
            blur={18}
            textColor="#1b1915"
            lineColor="#1b1915"
            autoAnimate
            onClick={() => {
              window.location.href = `mailto:${siteConfig.email}?subject=Let's%20Collaborate`;
            }}
          >
            Send a Message
          </SpecularButton>
        </motion.div>
      </div>
    </section>
  );
}
