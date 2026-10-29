"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, useEffect, useRef, type ReactNode } from "react";
import { Group } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollModel({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    if (!group.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(group.current!.rotation, { y: -0.2 }, {
        y: 0.35, ease: "none", onUpdate: invalidate,
        scrollTrigger: { trigger: gl.domElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });
    return () => { media.revert(); };
  }, [gl, invalidate]);
  return <group ref={group}>{children}</group>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="model-fallback">3D rendering is unavailable. Explore the projects below.</p>
      : this.props.children;
  }
}

function Box({ position, scale, color }: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}) {
  return <mesh position={position} scale={scale}>
    <boxGeometry />
    <meshStandardMaterial color={color} roughness={0.38} metalness={0.25} />
  </mesh>;
}

function Architecture() {
  return <group>
    <Box position={[0, -0.65, 0]} scale={[3.5, 0.16, 2.8]} color="#c3b7a4" />
    <Box position={[0, 0.8, 0]} scale={[3.1, 0.18, 2.4]} color="#efe5d5" />
    <Box position={[-1.35, 0.05, 0]} scale={[0.16, 1.5, 2.3]} color="#b5684e" />
    <Box position={[0.1, 0.05, -1.05]} scale={[2.8, 1.5, 0.14]} color="#8b9f96" />
    <Box position={[0.3, 0.02, -0.1]} scale={[1.7, 1.3, 0.12]} color="#7c9da5" />
    {[0, 1.35].map((x) => <Box key={x} position={[x, 0.05, 1]} scale={[0.07, 1.5, 0.07]} color="#473a33" />)}
    <Box position={[0.4, -0.45, 0.5]} scale={[1.25, 0.26, 0.5]} color="#e1c6a3" />
    <Box position={[1.7, -0.73, 0.35]} scale={[0.7, 0.08, 1.9]} color="#6c9696" />
  </group>;
}

function Circuit() {
  return <group rotation={[0.15, 0, 0]}>
    <Box position={[0, -0.15, 0]} scale={[2.8, 0.12, 2.2]} color="#365f50" />
    <Box position={[0, 0.05, 0]} scale={[1.1, 0.3, 1.1]} color="#292d32" />
    {Array.from({ length: 8 }, (_, i) => [-1, 1].map((side) => (
      <Box key={`${i}-${side}`} position={[(i - 3.5) * 0.13, 0, side * 0.64]} scale={[0.06, 0.07, 0.2]} color="#d7b477" />
    )))}
    {[-0.95, 0.95].map((x) => <group key={x}>
      <Box position={[x, 0.01, 0]} scale={[0.25, 0.2, 1.65]} color="#22292b" />
      {Array.from({ length: 7 }, (_, i) => <Box key={i} position={[x, 0.2, (i - 3) * 0.23]} scale={[0.06, 0.22, 0.06]} color="#d7b477" />)}
    </group>)}
  </group>;
}

export default function ModelScene({ model, rotation, zoom, spinning }: {
  model: string; rotation: number; zoom: number; spinning: boolean;
}) {
  return <SceneBoundary>
    <Canvas frameloop={spinning ? "always" : "demand"} dpr={[1, 1.5]}
      camera={{ position: [4, 3, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      fallback={<p className="model-fallback">Your browser does not support interactive 3D.</p>}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 6, 3]} intensity={3} />
      <directionalLight position={[-3, 2, -2]} intensity={1.5} color="#b7d6d0" />
      <ScrollModel><group rotation={[0, rotation, 0]} scale={zoom}>
        {model === "architecture" ? <Architecture /> : <Circuit />}
      </group></ScrollModel>
      <OrbitControls key={model} makeDefault enablePan={false} enableZoom={false}
        autoRotate={spinning} autoRotateSpeed={0.7} minPolarAngle={0.25} maxPolarAngle={Math.PI / 2}
        enableDamping />
    </Canvas>
  </SceneBoundary>;
}
