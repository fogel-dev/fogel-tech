"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { usePreferences } from "@/features/preferences/preferences-provider";

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDistortion;

  void main() {
    vec3 p = position;
    float phase = uProgress * 6.28318;
    float waveA = sin(p.x * 3.2 + uTime * 0.85 + phase);
    float waveB = sin(p.y * 4.1 - uTime * 0.62);
    float waveC = cos(p.z * 3.6 + uTime * 0.48 - phase);
    float distortion = (waveA + waveB + waveC) / 3.0;
    float breath = sin(uTime * 0.72) * 0.035;
    p += normal * (distortion * (0.14 + uProgress * 0.18) + breath);
    p.x *= 1.0 + sin(phase) * 0.18;
    p.y *= 1.0 + cos(phase * 0.7) * 0.12;

    vec4 worldPosition = modelMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vPosition = worldPosition.xyz;
    vDistortion = distortion;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDistortion;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.6);
    float scan = smoothstep(0.42, 0.58, sin(vPosition.y * 16.0 - uTime * 1.8) * 0.5 + 0.5);
    vec3 color = mix(uColorA, uColorB, fresnel + vDistortion * 0.22);
    color += scan * uColorB * 0.12;
    float alpha = 0.12 + fresnel * 0.72 + scan * 0.06;
    gl_FragColor = vec4(color, alpha);
  }
`;

function KineticObject({
  primary,
  secondary,
  reducedMotion,
}: {
  primary: string;
  secondary: string;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color(primary) },
      uColorB: { value: new THREE.Color(secondary) },
    }),
    [primary, secondary],
  );

  useEffect(() => {
    function updateProgress() {
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      progress.current = available > 0 ? window.scrollY / available : 0;
    }

    function updatePointer(event: PointerEvent) {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const shell = shellRef.current;
    const material = materialRef.current;
    const orbit = orbitRef.current;
    if (!group || !shell || !material || !orbit) return;

    const time = reducedMotion ? 0 : clock.elapsedTime;
    const targetProgress = progress.current;
    material.uniforms.uTime.value = time;
    material.uniforms.uProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uProgress.value,
      targetProgress,
      Math.min(delta * 2.4, 1),
    );
    material.uniforms.uColorA.value.lerp(new THREE.Color(primary), 0.06);
    material.uniforms.uColorB.value.lerp(new THREE.Color(secondary), 0.06);

    const pointerStrength = reducedMotion ? 0 : 0.45;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -pointer.current.y * pointerStrength + targetProgress * 1.8,
      0.035,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      pointer.current.x * pointerStrength + time * 0.08,
      0.035,
    );
    group.rotation.z = targetProgress * Math.PI * 1.2;

    const pulse = 1 + Math.sin(time * 0.55) * 0.025;
    group.scale.setScalar(pulse);
    shell.rotation.y = -time * 0.12;
    shell.rotation.x = time * 0.07;
    orbit.rotation.z = time * 0.045;
    orbit.rotation.y = targetProgress * Math.PI;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[2.18, 5]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={shellRef} scale={1.055}>
        <icosahedronGeometry args={[2.18, 2]} />
        <meshBasicMaterial
          color={primary}
          wireframe
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      <OrbitSystem ref={orbitRef} color={secondary} />
      <ParticleHalo color={primary} />
    </group>
  );
}

const OrbitSystem = ({
  color,
  ref,
}: {
  color: string;
  ref: React.Ref<THREE.Group>;
}) => {
  const rings = useMemo(
    () =>
      [2.85, 3.25, 3.72].map((radius, ringIndex) =>
        Array.from({ length: 96 }, (_, index) => {
          const angle = (index / 95) * Math.PI * 2;
          return new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            Math.sin(angle * (ringIndex + 2)) * 0.14,
          );
        }),
      ),
    [],
  );

  return (
    <group ref={ref}>
      <Line points={rings[0]} color={color} lineWidth={0.65} opacity={0.38} transparent />
      <Line
        points={rings[1]}
        color={color}
        lineWidth={0.35}
        opacity={0.2}
        transparent
        rotation={[1.15, 0.2, 0.5]}
      />
      <Line
        points={rings[2]}
        color={color}
        lineWidth={0.25}
        opacity={0.14}
        transparent
        rotation={[0.4, 1.05, 0.2]}
      />
    </group>
  );
};

function ParticleHalo({ color }: { color: string }) {
  const positions = useMemo(() => {
    const result = new Float32Array(1000 * 3);
    for (let index = 0; index < 1000; index += 1) {
      const angle = index * 2.399963;
      const radius = 2.8 + ((index * 37) % 100) / 100 * 2.2;
      result[index * 3] = Math.cos(angle) * radius;
      result[index * 3 + 1] =
        (Math.sin(index * 12.9898) * 0.5 + 0.5 - 0.5) * 5.2;
      result[index * 3 + 2] = Math.sin(angle) * radius * 0.42;
    }
    return result;
  }, []);

  return (
    <points rotation={[0.15, 0, 0.25]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.018}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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

  const primary = theme === "dark" ? "#eef3ff" : "#11182b";
  const secondary = theme === "dark" ? "#346cff" : "#1645d8";

  return (
    <div className="digital-core" aria-hidden="true">
      <div className="digital-core__readout digital-core__readout--left">
        <span>EF / KINETIC OBJECT</span>
        <span>REALTIME WEBGL</span>
      </div>
      <div className="digital-core__readout digital-core__readout--right">
        <span>POINTER / SCROLL</span>
        <span>2026.06</span>
      </div>
      {supported ? (
        <Canvas
          dpr={[1, 1.65]}
          camera={{ position: [0, 0, 9.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <KineticObject
            primary={primary}
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
