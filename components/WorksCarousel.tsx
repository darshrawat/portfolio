"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, Text, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

const projects = [
  { id: 1, title: "CYBER_LOGIC", image: "https://picsum.photos/seed/1/800/1200" },
  { id: 2, title: "NEURAL_LINK", image: "https://picsum.photos/seed/2/800/1200" },
  { id: 3, title: "OBSIDIAN_CORE", image: "https://picsum.photos/seed/3/800/1200" },
  { id: 4, title: "VOID_ENGINE", image: "https://picsum.photos/seed/4/800/1200" },
  { id: 5, title: "SYNAPSE_GRID", image: "https://picsum.photos/seed/5/800/1200" },
  { id: 6, title: "DATA_STORM", image: "https://picsum.photos/seed/6/800/1200" },
];

function Card({ url, title, position, rotation }: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={mesh}>
        <planeGeometry args={[4, 6]} />
        <Image url={url} transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
}

export default function WorksCarousel() {
  const groupRef = useRef<THREE.Group>(null!);
  const { scrollYProgress } = useScroll();
  
  const radius = 8;
  const count = projects.length;
  
  useFrame((state, delta) => {
    // Map scroll progress to rotation
    const targetRotation = scrollYProgress.get() * Math.PI * 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <Card
            key={project.id}
            url={project.image}
            title={project.title}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
          />
        );
      })}
    </group>
  );
}
