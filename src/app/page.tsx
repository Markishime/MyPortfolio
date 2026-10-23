"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ThemeProvider from "@/components/ThemeProvider";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const OriginScene = dynamic(() => import("@/components/OriginScene"));
const About = dynamic(() => import("@/components/About"));
const Projects = dynamic(() => import("@/components/Projects"));
const Skills = dynamic(() => import("@/components/Skills"));
const Certifications = dynamic(() => import("@/components/Certifications"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  return (
    <ThemeProvider>
      <CustomCursor />
      <SmoothScroll>
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
