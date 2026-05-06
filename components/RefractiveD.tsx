"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useTransform } from "framer-motion";

export default function RefractiveD() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to rotation and scale
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [2.5, 3.5, 2.5]);

  useFrame((state, delta) => {
    meshRef.current.rotation.y = rotationY.get();
    meshRef.current.scale.setScalar(scale.get());
  });

  // Create a custom D shape using a Shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, 1);
    s.bezierCurveTo(0.8, 1, 0.8, 0, 0, 0);
    return s;
  }, []);

  const extrudeSettings = {
    steps: 2,
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[-0.5, -0.5, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#c9f7ff"
        />
      </mesh>
    </Float>
  );
}
