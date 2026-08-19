"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import ThemeProvider from "@/components/ThemeProvider";

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

const About = dynamic(() => import("@/components/About"));
const CinematicReel = dynamic(() => import("@/components/CinematicReel"));
const Projects = dynamic(() => import("@/components/Projects"));
const Skills = dynamic(() => import("@/components/Skills"));
const Certifications = dynamic(() => import("@/components/Certifications"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  return (
    <ThemeProvider>
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <CinematicCanvas />
        <ScrollCinema />
        <Navbar />
        <main>
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
      </SmoothScroll>
    </ThemeProvider>
  );
}
