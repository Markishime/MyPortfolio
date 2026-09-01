"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ThemeProvider from "@/components/ThemeProvider";
import LanyardGate from "@/components/LanyardGate";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const CinematicCanvas = dynamic(
  () => import("@/components/scene/CinematicCanvas"),
  { ssr: false }
);

const ScrollCinema = dynamic(() => import("@/components/ScrollCinema"), {
  ssr: false,
});

const OriginScene = dynamic(() => import("@/components/OriginScene"));
const About = dynamic(() => import("@/components/About"));
const Projects = dynamic(() => import("@/components/Projects"));
const Skills = dynamic(() => import("@/components/Skills"));
const Certifications = dynamic(() => import("@/components/Certifications"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);

  if (!entered) {
    return (
      <ThemeProvider>
        <LanyardGate onEnter={enter} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CustomCursor />
      <SmoothScroll>
        <CinematicCanvas />
        <ScrollCinema />
        <Navbar />
        <main>
          <Hero />
          <OriginScene />
          <About />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </SmoothScroll>
    </ThemeProvider>
  );
}
