import type { Metadata } from "next";
import { inter, jetbrainsMono, outfit } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark Lloyd Cuizon | Computer Engineer & AI Developer",
  description:
    "Portfolio of Mark Lloyd Cuizon — Computer Engineer, Full-Stack Developer, and AI Developer. Building the future with code, circuits, and intelligence.",
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
      "Building the future with code, circuits, and intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
