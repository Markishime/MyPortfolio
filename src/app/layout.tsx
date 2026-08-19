import type { Metadata } from "next";
import { galada, inter, jetbrainsMono, manrope, outfit } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark Lloyd Cuizon | Full Stack Developer & Computer Engineer",
  description:
    "Portfolio of Mark Lloyd Cuizon, Full Stack Developer and Computer Engineer. Building the future with code, circuits, and intelligence.",
  keywords: [
    "Full Stack Developer",
    "Computer Engineer",
    "AI Developer",
    "Portfolio",
    "Mark Lloyd Cuizon",
    "Next.js",
    "Embedded Systems",
    "Machine Learning",
  ],
  authors: [{ name: "Mark Lloyd Cuizon" }],
  openGraph: {
    title: "Mark Lloyd Cuizon | Full Stack Developer & Computer Engineer",
    description:
      "Building the future with code, circuits, and intelligence.",
    type: "website",
  },
  icons: {
    icon: "/mark.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-identity="fullstack">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} ${galada.variable} ${manrope.variable} font-sans antialiased noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
