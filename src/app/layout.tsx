import type { Metadata } from "next";
import { display, mono, sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark Lloyd Cuizon | Computer Engineer & AI Developer",
  description:
    "Two years building systems with code, circuits, and intelligence. Portfolio of Mark Lloyd Cuizon — Computer Engineer, Full-Stack Developer, and AI Developer.",
  keywords: [
    "Computer Engineer",
    "AI Developer",
    "Full-Stack Developer",
    "Portfolio",
    "Mark Lloyd Cuizon",
    "IoT",
    "Machine Learning",
    "Next.js",
  ],
  authors: [{ name: "Mark Lloyd Cuizon" }],
  openGraph: {
    title: "Mark Lloyd Cuizon | Computer Engineer & AI Developer",
    description:
      "Two years building systems with code, circuits, and intelligence.",
    type: "website",
    images: ["/media/hero-portrait.jpg"],
  },
};

const bootScript = `(function(){try{var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var off=false;try{off=localStorage.getItem('motionPreference')==='off'}catch(e){}var coarse=window.matchMedia('(pointer: coarse)').matches;var small=window.innerWidth<900;var save=navigator.connection&&navigator.connection.saveData;var mem=navigator.deviceMemory||8;var cores=navigator.hardwareConcurrency||8;var tier=(m||off)?'reduced':(save||(coarse&&small)||(mem<=4&&cores<=4&&coarse))?'lite':'full';document.documentElement.dataset.perf=tier;}catch(e){document.documentElement.dataset.perf='lite'}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/media/hero-portrait.jpg"
          type="image/jpeg"
        />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased noise-overlay`}
      >
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
