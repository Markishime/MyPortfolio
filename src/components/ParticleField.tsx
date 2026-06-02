"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// Wireframe icosahedron vertices and edges
function getIcosahedronGeometry(radius: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.sqrt(x * x + y * y + z * z);
    return [x / len * radius, y / len * radius, z / len * radius] as [number, number, number];
  });
  const edges = [
    [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
    [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
    [7,8],[7,10],[8,9],[10,11],
  ];
  return { vertices, edges };
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 1.5 : 1));
    let h = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 1.5 : 1));

    const COUNT = 500;
    const particles: Particle[] = [];

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 2 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const ico = getIcosahedronGeometry(120);
    let time = 0;
    const centerX = w / 2;
    const centerY = h / 2;

    // Resize handler
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
      h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
    };
    window.addEventListener("resize", onResize);

    function project(x: number, y: number, z: number, rx: number, ry: number): [number, number] {
      // Rotate Y
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      let x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z1 * sinX;
      return [centerX + x1, centerY + y1];
    }

    function animate() {
      time += 0.005;
      ctx!.clearRect(0, 0, w, h);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const flicker = 0.7 + Math.sin(time * 2 + p.x * 0.01) * 0.3;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 255, 170, ${p.alpha * flicker})`;
        ctx!.fill();
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 6000) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(0, 255, 170, ${0.03 * (1 - dist / 6000)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      // Draw wireframe icosahedron
      const rx = time * 0.6;
      const ry = time * 0.8;

      for (const [a, b] of ico.edges) {
        const [ax, ay] = project(...ico.vertices[a], rx, ry);
        const [bx, by] = project(...ico.vertices[b], rx, ry);
        ctx!.beginPath();
        ctx!.moveTo(ax, ay);
        ctx!.lineTo(bx, by);
        ctx!.strokeStyle = `rgba(0, 255, 170, 0.12)`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      // Draw vertices as dots
      for (const v of ico.vertices) {
        const [px, py] = project(...v, rx, ry);
        ctx!.beginPath();
        ctx!.arc(px, py, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(0, 255, 170, 0.25)";
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
