"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cinematicRuntime } from "./runtime";

const accent = new THREE.Color();
const cool = new THREE.Color();
const fogTarget = new THREE.Color("#101116");
const dummy = new THREE.Object3D();

function syncColors() {
  accent.setRGB(
    cinematicRuntime.accentR / 255,
    cinematicRuntime.accentG / 255,
    cinematicRuntime.accentB / 255
  );
  cool.setRGB(
    cinematicRuntime.coolR / 255,
    cinematicRuntime.coolG / 255,
    cinematicRuntime.coolB / 255
  );
}

function heroFade(scroll: number) {
  return THREE.MathUtils.smoothstep(0.16, 0.02, scroll);
}

function CameraRig() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const s = cinematicRuntime.scroll;
    const mx = cinematicRuntime.mouseX;
    const my = cinematicRuntime.mouseY;
    const k = 1 - Math.exp(-delta * 2.2);
    camera.position.x += (1.15 + mx * 0.45 + s * 0.2 - camera.position.x) * k;
    camera.position.y += (0.18 - my * 0.28 - s * 0.6 - camera.position.y) * k;
    camera.position.z += (6.8 + s * 3.2 - camera.position.z) * k;
    camera.lookAt(0.8 + mx * 0.4, my * 0.2 - s * 0.4, 0);
  });

  return null;
}

function Atmosphere() {
  const key = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.FogExp2("#101116", 0.055), []);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [fog, scene]);

  useFrame(() => {
    syncColors();
    const fade = 0.45 + heroFade(cinematicRuntime.scroll) * 0.55;
    if (key.current) {
      key.current.color.lerp(accent, 0.12);
      key.current.intensity = (8 + cinematicRuntime.energy * 6) * fade;
    }
    if (fill.current) {
      fill.current.color.lerp(cool, 0.12);
      fill.current.intensity = 4 * fade;
    }
    fogTarget.set("#101116").lerp(accent, 0.06);
    fog.color.lerp(fogTarget, 0.08);
    fog.density = 0.05 + cinematicRuntime.scroll * 0.04;
  });

  return (
    <>
      <hemisphereLight args={["#c9d4de", "#141216", 0.28]} />
      <ambientLight intensity={0.12} />
      <pointLight ref={key} position={[2.8, 1.4, 2.4]} distance={16} decay={2} />
      <pointLight ref={fill} position={[-3.4, -0.6, 1.2]} distance={14} decay={2} />
    </>
  );
}

function HeroForms() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    syncColors();
    const t = state.clock.elapsedTime;
    const fade = heroFade(cinematicRuntime.scroll);
    group.current.visible = fade > 0.02;
    group.current.rotation.y += delta * 0.08;
    group.current.position.set(1.62, 0.18 + Math.sin(t * 0.4) * 0.08, -1.05);
    group.current.scale.setScalar(0.9 * fade);
    if (core.current) {
      core.current.rotation.x += delta * 0.12;
      core.current.rotation.z -= delta * 0.05;
    }
    if (wire.current) wire.current.rotation.y -= delta * 0.07;
    if (ringA.current) ringA.current.rotation.x = 1.18 + Math.sin(t * 0.18) * 0.06;
    if (coreMat.current) {
      coreMat.current.emissive.lerp(accent, 0.12);
      coreMat.current.color.lerp(accent, 0.08);
      coreMat.current.opacity = 0.34 * fade;
      coreMat.current.emissiveIntensity = 0.26 * fade;
    }
    if (wireMat.current) {
      wireMat.current.color.lerp(cool, 0.1);
      wireMat.current.opacity = 0.42 * fade;
    }
    if (ringMat.current) {
      ringMat.current.color.lerp(cool, 0.1);
      ringMat.current.opacity = 0.32 * fade;
    }
  });

  return (
    <group ref={group} position={[1.85, 0.2, -1.6]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#ff6b55"
          metalness={0.65}
          roughness={0.28}
          emissive="#ff6b55"
          emissiveIntensity={0.18}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={wire} scale={1.06}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial ref={wireMat} color="#a9d8e8" wireframe transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <mesh ref={ringA} rotation={[1.18, 0.25, 0.3]}>
        <torusGeometry args={[1.85, 0.008, 8, 96]} />
        <meshBasicMaterial ref={ringMat} color="#a9d8e8" transparent opacity={0.32} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 47) % 100) / 12 - 4,
        y: ((i * 31) % 100) / 14 - 2.6,
        z: -3 - ((i * 13) % 14) * 0.28,
        s: 0.02 + (i % 5) * 0.006,
        p: i * 0.37,
      })),
    [count]
  );

  useFrame((state) => {
    const inst = mesh.current;
    if (!inst) return;
    syncColors();
    const t = state.clock.elapsedTime;
    const fade = 0.35 + heroFade(cinematicRuntime.scroll) * 0.65;
    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i];
      dummy.position.set(
        seed.x + Math.sin(t * 0.18 + seed.p) * 0.22 + cinematicRuntime.mouseX * 0.2,
        seed.y + Math.cos(t * 0.14 + seed.p) * 0.18 - cinematicRuntime.scroll * 1.4,
        seed.z
      );
      dummy.scale.setScalar(seed.s * (0.7 + Math.sin(t * 1.1 + seed.p) * 0.12));
      dummy.rotation.set(t * 0.12 + seed.p, t * 0.1, 0);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    if (material.current) {
      material.current.color.lerp(accent, 0.1);
      material.current.opacity = 0.28 * fade;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial ref={material} color="#ff6b55" transparent opacity={0.28} depthWrite={false} />
    </instancedMesh>
  );
}

function useHeroClusterMounted() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const should = cinematicRuntime.scroll < 0.16;
      setMounted((prev) => (prev === should ? prev : should));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return mounted;
}

export default function CinematicScene() {
  const heroMounted = useHeroClusterMounted();
  const count = cinematicRuntime.quality === "high" ? 36 : 16;

  return (
    <>
      <CameraRig />
      <Atmosphere />
      {heroMounted && cinematicRuntime.quality === "high" ? <HeroForms /> : null}
      <Dust count={count} />
    </>
  );
}
