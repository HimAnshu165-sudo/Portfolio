"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { canvasStore } from "@/lib/canvas-state";
import { PROFILE } from "@/data/profile";

interface TokenNode {
  name: string;
  category: string;
  basePos: [number, number, number];
  pos: THREE.Vector3;
  targetPos: THREE.Vector3;
  size: number;
  color: string;
}

export function LabSpatialWorld() {
  const groupRef = useRef<THREE.Group>(null);

  // Define nodes and relationships
  const { nodes, connections } = useMemo(() => {
    const rawTokens = PROFILE.labTokens;
    const items: TokenNode[] = rawTokens.map((token, i) => {
      // Distribute in a spherical/elliptical cloud with organic coordinates
      const angle = (i / rawTokens.length) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.9;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.6;
      const y = Math.sin(angle) * (radius * 0.65) + (Math.random() - 0.5) * 0.5;
      const z = token.depth * 1.8;

      let color = "#d4d4d8";
      if (token.category === "creative") color = "#f59e0b"; // Warm amber
      else if (token.category === "stack") color = "#e4e4e7"; // White/silver
      else if (token.category === "backend") color = "#a1a1aa"; // Zinc
      else if (token.category === "motion") color = "#fbbf24"; // Gold
      else if (token.category === "ai") color = "#38bdf8"; // Cyan

      const size = token.size === "large" ? 0.28 : token.size === "medium" ? 0.21 : 0.16;

      return {
        name: token.name,
        category: token.category,
        basePos: [x, y, z],
        pos: new THREE.Vector3(x, y, z),
        targetPos: new THREE.Vector3(x, y, z),
        size,
        color,
      };
    });

    // Semantic connections
    const links: [number, number][] = [
      // WebGL -> Three.js -> GSAP -> Framer
      [0, 11], // WEBGL - THREE.JS
      [11, 4], // THREE.JS - GSAP
      [4, 5],  // GSAP - FRAMER
      // NEXT.JS -> REACT -> FULL STACK
      [1, 10], // NEXT.JS - REACT
      [1, 2],  // NEXT.JS - POSTGRESQL
      [2, 3],  // POSTGRESQL - NEON
      [10, 12], // REACT - FULL STACK
      [12, 1],  // FULL STACK - NEXT.JS
      // AI & DEPLOYMENT
      [6, 7],  // CI/CD - DEPLOYMENT
      [8, 9],  // AI WORKFLOWS - GOOGLE FLOW
      [11, 13], // THREE.JS - SHADERS
      [1, 14], // NEXT.JS - TYPESCRIPT
    ];

    return { nodes: items, connections: links };
  }, []);

  const linePoints = useMemo(() => {
    return connections.map(([fromIdx, toIdx]) => [
      nodes[fromIdx].pos,
      nodes[toIdx].pos,
    ]);
  }, [connections, nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { activeSection, pointer } = canvasStore.get();

    // Lab is visible during "lab" and transitioning sections
    const isLabActive = activeSection === "lab";
    const targetOpacity = isLabActive ? 1 : 0;
    
    // Smooth fade
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      isLabActive ? 0 : -10,
      delta * 3
    );

    if (!isLabActive) return;

    // Mouse interaction physics: repulsion and gentle drift
    const mouseV = new THREE.Vector3(pointer.x * 4, -pointer.y * 3, 0);

    nodes.forEach((node) => {
      const dist = node.pos.distanceTo(mouseV);
      // Repulsion or attraction
      if (dist < 2.5) {
        const force = (2.5 - dist) * 0.4;
        const dir = node.pos.clone().sub(mouseV).normalize();
        node.targetPos.x = node.basePos[0] + dir.x * force;
        node.targetPos.y = node.basePos[1] + dir.y * force;
      } else {
        node.targetPos.x = node.basePos[0] + Math.sin(state.clock.elapsedTime * 0.8 + node.basePos[2]) * 0.1;
        node.targetPos.y = node.basePos[1] + Math.cos(state.clock.elapsedTime * 0.8 + node.basePos[0]) * 0.1;
      }

      node.pos.lerp(node.targetPos, delta * 4);
    });

    // Subtle overall rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.18,
      delta * 2
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.12,
      delta * 2
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* 3D Words */}
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <Text
            fontSize={node.size}
            color={node.color}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
            fillOpacity={0.9}
          >
            {node.name}
          </Text>
        </group>
      ))}

      {/* Abstract semantic dynamic connection lines */}
      {connections.map(([fromIdx, toIdx], i) => (
        <Line
          key={i}
          points={[nodes[fromIdx].pos, nodes[toIdx].pos]}
          color="#f59e0b"
          lineWidth={0.65}
          transparent
          opacity={0.18}
        />
      ))}
    </group>
  );
}
