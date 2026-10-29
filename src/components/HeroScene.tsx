"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { SceneBoundary } from "./ModelScene";

function Sculpture({ moving }: { moving: boolean }) {
  const sculpture = useRef<Group>(null);
  const elapsed = useRef(0);
  useFrame(({ pointer }, delta) => {
    if (!moving || !sculpture.current) return;
    elapsed.current += Math.min(delta, 0.05);
    sculpture.current.rotation.y = elapsed.current * 0.13 + pointer.x * 0.16;
    sculpture.current.rotation.x = MathUtils.lerp(sculpture.current.rotation.x, pointer.y * 0.12, 0.04);
    sculpture.current.position.y = Math.sin(elapsed.current * 0.6) * 0.12;
  });
  return <group ref={sculpture} rotation={[0.1, 0.35, -0.15]}>
    <mesh rotation={[0.4, 0.3, 0.2]}>
      <icosahedronGeometry args={[1.03, 0]} />
      <meshPhysicalMaterial color="#a0b5ac" metalness={0.7} roughness={0.26} clearcoat={1} />
    </mesh>
    <mesh scale={1.08} rotation={[0.4, 0.3, 0.2]}>
      <icosahedronGeometry args={[1.03, 0]} />
      <meshBasicMaterial color="#ddad85" wireframe transparent opacity={0.5} />
    </mesh>
    {[0, 1, 2].map((index) => <group key={index} rotation={[0.6 + index * 0.7, index * 0.9, 0.3]}>
      <mesh>
        <torusGeometry args={[1.65 + index * 0.18, index === 1 ? 0.025 : 0.012, 8, 100]} />
        <meshStandardMaterial color={index === 1 ? "#e8b185" : "#8eaaa1"} metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[1.65 + index * 0.18, 0, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#eac29f" emissive="#d9915d" emissiveIntensity={0.5} />
      </mesh>
    </group>)}
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * (2.25 + i % 3 * 0.15), Math.cos(i * 1.7) * 1.9, Math.sin(i * 1.3) * 1.1]}>
      <sphereGeometry args={[i % 4 === 0 ? 0.025 : 0.012, 6, 6]} />
      <meshBasicMaterial color={i % 2 ? "#e2b18b" : "#a5c4bd"} transparent opacity={0.7} />
    </mesh>)}
  </group>;
}

export default function HeroScene({ moving }: { moving: boolean }) {
  return <div className="hero-three-scene" aria-hidden="true">
    <SceneBoundary fallback={null}>
      <Canvas frameloop={moving ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 0, 6.8], fov: 44 }} gl={{ alpha: true, antialias: true }} fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 3]} intensity={4} color="#f8d7b9" />
        <directionalLight position={[-3, 1, 2]} intensity={2} color="#9ebfb3" />
        <pointLight position={[0, -2, 2]} intensity={8} color="#bc7755" />
        <Sculpture moving={moving} />
      </Canvas>
    </SceneBoundary>
  </div>;
}
