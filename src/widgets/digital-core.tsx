"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { usePreferences } from "@/features/preferences/preferences-provider";

const POINT_COUNT = 620;
const SHAPE_COUNT = 6;

type PointSeed = {
  a: number;
  b: number;
  c: number;
  radius: number;
};

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function targetForShape(
  shape: number,
  seed: PointSeed,
  index: number,
  time: number,
): [number, number, number] {
  const { a, b, c, radius } = seed;

  switch (shape) {
    case 0: {
      const pulse = 1 + Math.sin(time * 0.9 + index * 0.08) * 0.035;
      return [
        Math.sin(a) * Math.cos(b) * radius * pulse,
        Math.sin(b) * radius * pulse,
        Math.cos(a) * Math.cos(b) * radius * pulse,
      ];
    }
    case 1: {
      const grid = Math.ceil(Math.sqrt(POINT_COUNT));
      const column = index % grid;
      const row = Math.floor(index / grid);
      return [
        (column / grid - 0.5) * 5.2,
        (row / grid - 0.5) * 5.2,
        Math.sin(column * 0.46 + time * 0.5) * 0.22,
      ];
    }
    case 2:
      return [
        (a / (Math.PI * 2) - 0.5) * 6.2,
        Math.sin(a * 2 + time * 0.55) * 1.5 + (b / Math.PI) * 0.5,
        Math.cos(a * 1.5 + c) * 1.25,
      ];
    case 3: {
      const t = index / POINT_COUNT;
      const angle = t * Math.PI * 13 + time * 0.18;
      return [
        Math.cos(angle) * (1.15 + c),
        (t - 0.5) * 6,
        Math.sin(angle) * (1.15 + c),
      ];
    }
    case 4: {
      const major = 2.05 + Math.cos(b * 3) * 0.22;
      return [
        (major + Math.cos(b) * 0.55) * Math.cos(a),
        Math.sin(b) * 0.55,
        (major + Math.cos(b) * 0.55) * Math.sin(a),
      ];
    }
    default: {
      const tightRadius = 0.35 + c * 0.7;
      return [
        Math.sin(a) * Math.cos(b) * tightRadius,
        Math.sin(b) * tightRadius,
        Math.cos(a) * Math.cos(b) * tightRadius,
      ];
    }
  }
}

function CorePoints({
  color,
  reducedMotion,
}: {
  color: string;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  const seeds = useMemo<PointSeed[]>(
    () =>
      Array.from({ length: POINT_COUNT }, (_, index) => ({
        a: seeded(index, 1) * Math.PI * 2,
        b: (seeded(index, 2) - 0.5) * Math.PI,
        c: seeded(index, 3),
        radius: 1.15 + seeded(index, 4) * 1.35,
      })),
    [],
  );

  const positions = useMemo(() => {
    const array = new Float32Array(POINT_COUNT * 3);
    seeds.forEach((seed, index) => {
      const [x, y, z] = targetForShape(0, seed, index, 0);
      array[index * 3] = x;
      array[index * 3 + 1] = y;
      array[index * 3 + 2] = z;
    });
    return array;
  }, [seeds]);

  useEffect(() => {
    function updateScroll() {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = available > 0 ? window.scrollY / available : 0;
    }

    function updatePointer(event: PointerEvent) {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    const time = reducedMotion ? 0 : clock.elapsedTime;
    const scaled = Math.min(scrollProgress.current * SHAPE_COUNT, SHAPE_COUNT - 1);
    const currentShape = Math.floor(scaled);
    const nextShape = Math.min(currentShape + 1, SHAPE_COUNT - 1);
    const mix = THREE.MathUtils.smoothstep(scaled - currentShape, 0, 1);
    const attribute = points.geometry.attributes.position;
    const positionArray = attribute.array as Float32Array;

    for (let index = 0; index < POINT_COUNT; index += 1) {
      const from = targetForShape(
        currentShape,
        seeds[index],
        index,
        time,
      );
      const to = targetForShape(nextShape, seeds[index], index, time);
      const offset = index * 3;
      const speed = Math.min(delta * 3.4, 1);

      positionArray[offset] = THREE.MathUtils.lerp(
        positionArray[offset],
        THREE.MathUtils.lerp(from[0], to[0], mix),
        speed,
      );
      positionArray[offset + 1] = THREE.MathUtils.lerp(
        positionArray[offset + 1],
        THREE.MathUtils.lerp(from[1], to[1], mix),
        speed,
      );
      positionArray[offset + 2] = THREE.MathUtils.lerp(
        positionArray[offset + 2],
        THREE.MathUtils.lerp(from[2], to[2], mix),
        speed,
      );
    }

    attribute.needsUpdate = true;
    const pointerFactor = reducedMotion ? 0 : 0.12;
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      time * 0.035 + mouse.current.x * pointerFactor,
      0.04,
    );
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      mouse.current.y * pointerFactor,
      0.04,
    );
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.034}
          sizeAttenuation
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <CoreRings color={color} reducedMotion={reducedMotion} />
    </group>
  );
}

function CoreRings({
  color,
  reducedMotion,
}: {
  color: string;
  reducedMotion: boolean;
}) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current || reducedMotion) return;
    ringRef.current.rotation.z = clock.elapsedTime * 0.055;
    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.18;
  });

  const linePoints = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 47) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * 2.9,
          Math.sin(angle) * 2.9,
          Math.sin(angle * 3) * 0.08,
        );
      }),
    [],
  );

  return (
    <group ref={ringRef}>
      <Line
        points={linePoints}
        color={color}
        lineWidth={0.5}
        transparent
        opacity={0.34}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.26} />
      </mesh>
      <mesh rotation={[Math.PI / 2.55, 0.3, 0]}>
        <torusGeometry args={[1.82, 0.008, 8, 140]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Scene({
  color,
  secondary,
  reducedMotion,
}: {
  color: string;
  secondary: string;
  reducedMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Float
        speed={reducedMotion ? 0 : 0.8}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.18}
      >
        <CorePoints color={color} reducedMotion={reducedMotion} />
        <mesh rotation={[0.65, 0.2, 0.5]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshBasicMaterial
            color={secondary}
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </Float>
    </>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function DigitalCore() {
  const { theme } = usePreferences();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSupported(hasWebGL()));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    const motionFrame = window.requestAnimationFrame(update);
    media.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(motionFrame);
      media.removeEventListener("change", update);
    };
  }, []);

  const color = theme === "dark" ? "#ccef54" : "#355f40";
  const secondary = theme === "dark" ? "#66a8ff" : "#bd5e38";

  return (
    <div className="digital-core" aria-hidden="true">
      <div className="digital-core__hud">
        <span>CORE / 01</span>
        <span>SCROLL LINKED</span>
      </div>
      {supported ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7.8], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Scene
            color={color}
            secondary={secondary}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      ) : (
        <div className="digital-core__fallback">
          <div />
          <div />
          <div />
        </div>
      )}
    </div>
  );
}
