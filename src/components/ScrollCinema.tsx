"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CINEMA = {
  // Tune these four values to change global motion intensity without editing timelines.
  sectionDepth: 150,
  sectionTilt: 7,
  scrub: 1.15,
  velocityClamp: 2400,
};

export default function ScrollCinema() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const moveSceneX = gsap.quickTo(scene, "rotationY", {
        duration: 0.8,
        ease: "power3.out",
      });
      const moveSceneY = gsap.quickTo(scene, "rotationX", {
        duration: 0.8,
        ease: "power3.out",
      });

      const onPointerMove = (event: PointerEvent) => {
        moveSceneX((event.clientX / window.innerWidth - 0.5) * 5);
        moveSceneY((event.clientY / window.innerHeight - 0.5) * -3);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(".magnetic-target");
        const cleanups = targets.map((target) => {
          const moveX = gsap.quickTo(target, "x", { duration: 0.55, ease: "power3.out" });
          const moveY = gsap.quickTo(target, "y", { duration: 0.55, ease: "power3.out" });

          const onMove = (event: PointerEvent) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            moveX(x * 0.16);
            moveY(y * 0.2);
            target.style.setProperty("--magnet-x", `${50 + (x / rect.width) * 100}%`);
            target.style.setProperty("--magnet-y", `${50 + (y / rect.height) * 100}%`);
          };
          const onLeave = () => {
            moveX(0);
            moveY(0);
            target.style.removeProperty("--magnet-x");
            target.style.removeProperty("--magnet-y");
          };

          target.addEventListener("pointermove", onMove);
          target.addEventListener("pointerleave", onLeave);
          return () => {
            target.removeEventListener("pointermove", onMove);
            target.removeEventListener("pointerleave", onLeave);
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      });

      media.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          const sections = gsap.utils.toArray<HTMLElement>(
            "main > section:not(#home):not(.cinematic-reel)"
          );

          sections.forEach((section, index) => {
            section.classList.add("cinema-section");
            const content = section.querySelector<HTMLElement>(
              ":scope > div:last-child"
            );
            if (!content) return;

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 94%",
                end: "bottom 8%",
                scrub: CINEMA.scrub,
              },
            });

            timeline
              .fromTo(
                content,
                {
                  y: 120,
                  z: -CINEMA.sectionDepth,
                  rotateX: CINEMA.sectionTilt,
                  rotateY: index % 2 === 0 ? -2.5 : 2.5,
                  opacity: 0.38,
                  filter: "blur(5px)",
                },
                {
                  y: 0,
                  z: 0,
                  rotateX: 0,
                  rotateY: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.42,
                  ease: "power3.out",
                }
              )
              .to(content, {
                y: -70,
                z: -90,
                rotateX: -4,
                opacity: 0.62,
                filter: "blur(2px)",
                duration: 0.58,
                ease: "power2.in",
              });

            const heading = section.querySelector<HTMLElement>(
              ".section-display-title"
            );
            if (heading) {
              gsap.fromTo(
                heading,
                { clipPath: "inset(0 0 100% 0)", rotateX: 35, y: 45 },
                {
                  clipPath: "inset(0 0 0% 0)",
                  rotateX: 0,
                  y: 0,
                  ease: "power4.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 88%",
                    end: "top 52%",
                    scrub: 0.75,
                  },
                }
              );
            }
          });

          gsap.utils.toArray<HTMLElement>(".glass-card").forEach((card) => {
            gsap.fromTo(
              card,
              { rotateX: 10, rotateY: -4, z: -70, opacity: 0.45 },
              {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  end: "top 66%",
                  scrub: 0.7,
                },
              }
            );
          });

          const contact = document.querySelector<HTMLElement>("#contact");
          const contactCards = contact?.querySelectorAll<HTMLElement>(".glass-card");
          if (contact && contactCards?.length) {
            gsap.from(contactCards, {
              x: (index) => (index % 2 === 0 ? -160 : 160),
              y: 80,
              rotateY: (index) => (index % 2 === 0 ? 18 : -18),
              scale: 0.82,
              opacity: 0,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contact,
                start: "top 78%",
                end: "center 58%",
                scrub: 0.9,
              },
            });
          }

          return () => sections.forEach((section) => section.classList.remove("cinema-section"));
        }
      );

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const velocityXTo = gsap.quickTo(scene, "scaleX", {
          duration: 0.5,
          ease: "power3.out",
        });
        const velocityYTo = gsap.quickTo(scene, "scaleY", {
          duration: 0.5,
          ease: "power3.out",
        });
        const lightTo = gsap.quickTo(scene, "opacity", {
          duration: 0.45,
          ease: "power2.out",
        });

        const velocityTrigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const velocity = Math.min(
              Math.abs(self.getVelocity()),
              CINEMA.velocityClamp
            );
            const normalized = velocity / CINEMA.velocityClamp;
            document.documentElement.style.setProperty(
              "--scroll-energy",
              normalized.toFixed(3)
            );
            const velocityScale = 1 + normalized * 0.035;
            velocityXTo(velocityScale);
            velocityYTo(velocityScale);
            lightTo(0.72 + normalized * 0.28);
          },
        });

        gsap.to(".cinema-ring", {
          rotateZ: 220,
          z: 180,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.4 },
        });
        gsap.to(".cinema-particle", {
          yPercent: (index) => (index % 2 === 0 ? -240 : 210),
          xPercent: (index) => ((index % 5) - 2) * 28,
          rotateZ: 180,
          stagger: 0.018,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.1 },
        });

        return () => velocityTrigger.kill();
      });

      return () => window.removeEventListener("pointermove", onPointerMove);
    });

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      media.revert();
      document.documentElement.style.removeProperty("--scroll-energy");
    };
  }, []);

  return (
    <div ref={sceneRef} className="scroll-cinema" aria-hidden="true">
      <div className="cinema-fog cinema-fog-a" />
      <div className="cinema-fog cinema-fog-b" />
      <div className="cinema-ring cinema-ring-a" />
      <div className="cinema-ring cinema-ring-b" />
      <div className="cinema-ring cinema-ring-c" />
      <div className="cinema-particles">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="cinema-particle"
            style={{
              "--particle-x": `${(index * 47) % 100}%`,
              "--particle-y": `${(index * 31) % 100}%`,
              "--particle-z": `${-220 + (index % 8) * 55}px`,
              "--particle-size": `${2 + (index % 4)}px`,
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}