"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AtmosphereParticles } from "./AtmosphereParticles";
import { KickShockwave } from "./KickShockwave";
import { LabSpatialWorld } from "./LabSpatialWorld";
import { canvasStore } from "@/lib/canvas-state";

function CameraRig() {
  useFrame((state, delta) => {
    const { pointer, isImpactActive, impactProgress } = canvasStore.get();

    // Subtle 2.5D camera parallax
    const targetX = pointer.x * 0.45;
    const targetY = pointer.y * 0.35;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3);

    // Camera recoil shake during kick impact
    if (isImpactActive && impactProgress > 0 && impactProgress < 0.8) {
      const shakeIntensity = (1 - impactProgress) * 0.35;
      state.camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      state.camera.position.y += (Math.random() - 0.5) * shakeIntensity;
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.4 - impactProgress * 0.6, delta * 8);
    } else {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.0, delta * 2);
    }

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function SceneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      canvasStore.setPointer(x, y);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#070709"]} />
        <CameraRig />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 4]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[-4, -3, 2]} intensity={0.3} color="#ffffff" />
        <AtmosphereParticles count={380} />
        <KickShockwave />
        <LabSpatialWorld />
      </Canvas>
    </div>
  );
}
