"use client";

import { useRef, useEffect, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  size: number;
  hue: number;
}

interface Floater {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
}

function getIcosahedron(radius: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.sqrt(x * x + y * y + z * z);
    return [(x / len) * radius, (y / len) * radius, (z / len) * radius] as [
      number,
      number,
      number,
    ];
  });
  const edges = [
    [0, 1],
    [0, 5],
    [0, 7],
    [0, 10],
    [0, 11],
    [1, 5],
    [1, 7],
    [1, 8],
    [1, 9],
    [2, 3],
    [2, 4],
    [2, 6],
    [2, 10],
    [2, 11],
    [3, 4],
    [3, 6],
    [3, 8],
    [3, 9],
    [4, 5],
    [4, 9],
    [4, 11],
    [5, 9],
    [5, 11],
    [6, 7],
    [6, 8],
    [6, 10],
    [7, 8],
    [7, 10],
    [8, 9],
    [10, 11],
  ];
  return { vertices, edges };
}

function getOctahedron(radius: number) {
  const vertices: [number, number, number][] = [
    [0, radius, 0],
    [0, -radius, 0],
    [radius, 0, 0],
    [-radius, 0, 0],
    [0, 0, radius],
    [0, 0, -radius],
  ];
  const edges = [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [4, 3],
    [3, 5],
    [5, 2],
  ];
  return { vertices, edges };
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
    };
    resize();

    const STAR_COUNT = Math.min(380, Math.floor((w * h) / 3500));
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 1.4,
        y: (Math.random() - 0.5) * h * 1.4,
        z: Math.random() * 900 + 80,
        pz: 0,
        size: Math.random() * 1.6 + 0.3,
        hue: Math.random() > 0.7 ? 190 : 160,
      });
    }

    const floaters: Floater[] = [];
    for (let i = 0; i < 90; i++) {
      floaters.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 2 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.45 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const ico = getIcosahedron(Math.min(w, h) * 0.14);
    const octa = getOctahedron(Math.min(w, h) * 0.07);
    let time = 0;

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", resize);

    const rotatePoint = (
      x: number,
      y: number,
      z: number,
      rx: number,
      ry: number
    ): [number, number, number] => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return [x1, y1, z2];
    };

    const project = (
      x: number,
      y: number,
      z: number,
      ox: number,
      oy: number,
      fov = 420
    ): [number, number, number] => {
      const scale = fov / (fov + z);
      return [ox + x * scale, oy + y * scale, scale];
    };

    const drawMesh = (
      mesh: { vertices: [number, number, number][]; edges: number[][] },
      ox: number,
      oy: number,
      rx: number,
      ry: number,
      color: string,
      alpha: number
    ) => {
      const projected = mesh.vertices.map((v) => {
        const [x, y, z] = rotatePoint(v[0], v[1], v[2], rx, ry);
        return project(x, y, z + 40, ox, oy, 380);
      });

      ctx.lineWidth = 1;
      for (const [a, b] of mesh.edges) {
        const [ax, ay, as] = projected[a];
        const [bx, by, bs] = projected[b];
        const depth = (as + bs) / 2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = color.replace("ALPHA", String(alpha * depth * 1.2));
        ctx.stroke();
      }

      for (const [px, py, s] of projected) {
        ctx.beginPath();
        ctx.arc(px, py, 1.5 + s * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = color.replace("ALPHA", String(alpha * s * 1.6));
        ctx.fill();
      }
    };

    const drawHorizon = () => {
      const m = mouseRef.current;
      const vanishY = cy + 80 + m.y * 30;
      const vanishX = cx + m.x * 40;

      // Floor grid vanishing into depth
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, vanishY - 20, w, h - vanishY + 20);
      ctx.clip();

      for (let i = 1; i <= 18; i++) {
        const t = i / 18;
        const y = vanishY + Math.pow(t, 1.6) * (h - vanishY);
        const a = 0.035 * (1 - t);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = `rgba(0, 255, 170, ${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = -14; i <= 14; i++) {
        const edgeX = cx + i * (w * 0.12);
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(edgeX, h + 40);
        const a = 0.03 * (1 - Math.abs(i) / 16);
        ctx.strokeStyle = `rgba(34, 211, 238, ${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Soft horizon glow
      const grad = ctx.createLinearGradient(0, vanishY - 60, 0, vanishY + 40);
      grad.addColorStop(0, "rgba(0, 255, 170, 0)");
      grad.addColorStop(0.5, "rgba(0, 255, 170, 0.04)");
      grad.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, vanishY - 60, w, 100);
    };

    function animate() {
      time += 0.008;
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;

      ctx!.clearRect(0, 0, w, h);

      // Atmospheric radial vignette wash
      const wash = ctx!.createRadialGradient(cx, cy * 0.85, 40, cx, cy, Math.max(w, h) * 0.7);
      wash.addColorStop(0, "rgba(0, 40, 50, 0.12)");
      wash.addColorStop(0.5, "rgba(6, 11, 20, 0)");
      wash.addColorStop(1, "rgba(6, 11, 20, 0.35)");
      ctx!.fillStyle = wash;
      ctx!.fillRect(0, 0, w, h);

      drawHorizon();

      // 3D starfield with warp trails
      for (const s of stars) {
        s.pz = s.z;
        s.z -= 2.2 + Math.abs(m.x) * 0.8;
        if (s.z < 20) {
          s.z = 900 + Math.random() * 100;
          s.x = (Math.random() - 0.5) * w * 1.4;
          s.y = (Math.random() - 0.5) * h * 1.4;
          s.pz = s.z;
        }

        const offsetX = m.x * 40;
        const offsetY = m.y * 30;
        const [sx, sy, sc] = project(s.x + offsetX * 0.3, s.y + offsetY * 0.3, s.z, cx, cy, 280);
        const [px, py] = project(s.x + offsetX * 0.3, s.y + offsetY * 0.3, s.pz, cx, cy, 280);

        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

        const depthAlpha = Math.min(1, (900 - s.z) / 700) * 0.85;
        ctx!.beginPath();
        ctx!.moveTo(px, py);
        ctx!.lineTo(sx, sy);
        ctx!.strokeStyle = `hsla(${s.hue}, 90%, 65%, ${depthAlpha * 0.35})`;
        ctx!.lineWidth = sc * s.size * 0.8;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(sx, sy, Math.max(0.4, sc * s.size), 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${s.hue}, 95%, 70%, ${depthAlpha})`;
        ctx!.fill();
      }

      // Ambient floaters + connections
      for (const p of floaters) {
        p.x += p.vx + m.x * 0.15 * p.z;
        p.y += p.vy + m.y * 0.12 * p.z;
        p.pulse += 0.02;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const flicker = 0.65 + Math.sin(p.pulse) * 0.35;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 255, 170, ${p.alpha * flicker})`;
        ctx!.fill();
      }

      for (let i = 0; i < floaters.length; i++) {
        for (let j = i + 1; j < floaters.length; j++) {
          const dx = floaters[i].x - floaters[j].x;
          const dy = floaters[i].y - floaters[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 7000) {
            ctx!.beginPath();
            ctx!.moveTo(floaters[i].x, floaters[i].y);
            ctx!.lineTo(floaters[j].x, floaters[j].y);
            ctx!.strokeStyle = `rgba(0, 255, 170, ${0.04 * (1 - dist / 7000)})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }

      // Central wireframe body with mouse parallax
      const bodyX = cx + m.x * 55;
      const bodyY = cy * 0.92 + m.y * 35;
      drawMesh(
        ico,
        bodyX,
        bodyY,
        time * 0.45 + m.y * 0.3,
        time * 0.65 + m.x * 0.4,
        "rgba(0, 255, 170, ALPHA)",
        0.22
      );

      // Secondary satellite mesh
      const satX = cx + Math.cos(time * 0.35) * Math.min(w, h) * 0.28 + m.x * 20;
      const satY = cy + Math.sin(time * 0.35) * Math.min(w, h) * 0.12 + m.y * 15;
      drawMesh(
        octa,
        satX,
        satY,
        time * 0.9,
        -time * 1.1,
        "rgba(34, 211, 238, ALPHA)",
        0.18
      );

      // Soft bloom discs behind geometry
      ctx!.beginPath();
      ctx!.arc(bodyX, bodyY, Math.min(w, h) * 0.16, 0, Math.PI * 2);
      const bloom = ctx!.createRadialGradient(
        bodyX,
        bodyY,
        10,
        bodyX,
        bodyY,
        Math.min(w, h) * 0.16
      );
      bloom.addColorStop(0, "rgba(0, 255, 170, 0.06)");
      bloom.addColorStop(1, "rgba(0, 255, 170, 0)");
      ctx!.fillStyle = bloom;
      ctx!.fill();

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <div className="absolute inset-0 z-0 cinematic-stage">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
      <div className="cinematic-vignette pointer-events-none absolute inset-0" />
      <div className="cinematic-scanlines pointer-events-none absolute inset-0" />
    </div>
  );
}
