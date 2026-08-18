"use client";

import dynamic from "next/dynamic";
import ScrollEngine from "@/components/ScrollEngine";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CinematicReel from "@/components/CinematicReel";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function Home() {
  return (
    <ScrollEngine>
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <CinematicReel />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ScrollEngine>
  );
}
