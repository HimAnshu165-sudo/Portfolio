"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { canvasStore } from "@/lib/canvas-state";

const shockwaveVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shockwaveFragmentShader = `
  uniform float uProgress;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    if (p <= 0.001 || p >= 0.999) {
      discard;
    }
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Expanding ring from center
    float ringRadius = p * 0.48;
    float ringThickness = 0.06 * (1.0 - p * 0.6);
    
    float ring = smoothstep(ringRadius - ringThickness, ringRadius, dist) -
                 smoothstep(ringRadius, ringRadius + ringThickness, dist);
                 
    // Fade out as ring expands
    float alpha = max(0.0, ring * (1.0 - p) * 1.8);
    
    // Core burst flash
    float coreFlash = smoothstep(0.18, 0.0, dist) * (1.0 - smoothstep(0.0, 0.35, p)) * 0.9;
    
    vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), coreFlash);
    
    gl_FragColor = vec4(col, clamp(alpha + coreFlash, 0.0, 1.0));
  }
`;

export function KickShockwave() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0.0 },
    uColor: { value: new THREE.Color("#f59e0b") },
  }), []);

  useFrame(() => {
    const { isImpactActive, impactProgress } = canvasStore.get();
    if (!meshRef.current) return;

    if (isImpactActive && impactProgress > 0 && impactProgress < 1) {
      meshRef.current.visible = true;
      const clamped = Math.max(0, Math.min(1, impactProgress));
      uniforms.uProgress.value = clamped;
      const scale = 3.5 + clamped * 6.5;
      meshRef.current.scale.set(scale, scale, 1);
    } else {
      meshRef.current.visible = false;
      uniforms.uProgress.value = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} visible={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={shockwaveVertexShader}
        fragmentShader={shockwaveFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
