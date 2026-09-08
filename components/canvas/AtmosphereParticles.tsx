"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { canvasStore } from "@/lib/canvas-state";

export function AtmosphereParticles({ count = 400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities, baseColors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across a 3D box
      pos[i3] = (Math.random() - 0.5) * 16;
      pos[i3 + 1] = (Math.random() - 0.5) * 12;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      vel[i3] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.003;

      // Warm amber to subtle cool silver/white
      const isWarm = Math.random() > 0.65;
      if (isWarm) {
        cols[i3] = 0.96; // R
        cols[i3 + 1] = 0.62; // G
        cols[i3 + 2] = 0.08; // B
      } else {
        cols[i3] = 0.85;
        cols[i3 + 1] = 0.85;
        cols[i3 + 2] = 0.9;
      }
    }
    return [pos, vel, cols];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const { pointer, isImpactActive, impactProgress, hoveredProjectId, activeSection } = canvasStore.get();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    const speedMult = isImpactActive ? 8.0 : hoveredProjectId ? 2.5 : activeSection === "contact" ? 0.3 : 1.0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      posArray[i3] += velocities[i3] * speedMult + pointer.x * 0.004;
      posArray[i3 + 1] += velocities[i3 + 1] * speedMult - pointer.y * 0.004;
      posArray[i3 + 2] += velocities[i3 + 2] * speedMult;

      // Wrap around bounds
      if (posArray[i3] > 8) posArray[i3] = -8;
      if (posArray[i3] < -8) posArray[i3] = 8;
      if (posArray[i3 + 1] > 6) posArray[i3 + 1] = -6;
      if (posArray[i3 + 1] < -6) posArray[i3 + 1] = 6;
      if (posArray[i3 + 2] > 5) posArray[i3 + 2] = -5;
      if (posArray[i3 + 2] < -5) posArray[i3 + 2] = 5;

      // If kick impact is active, push particles outward radially
      if (isImpactActive && impactProgress > 0) {
        const dx = posArray[i3];
        const dy = posArray[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        posArray[i3] += (dx / dist) * 0.08 * impactProgress;
        posArray[i3 + 1] += (dy / dist) * 0.08 * impactProgress;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[baseColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
