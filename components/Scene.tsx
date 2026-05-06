"use client";

import React, { useMemo, useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment, Grid, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { EXPERIENCE_DATA } from "./ExperienceSection";

extend({ TextGeometry });


export const PROJECTS = [
  { 
    id: 1, 
    title: 'SILENT BRUTALISM // 01', 
    date: '2025 01.17', 
    description: 'A study on minimalist concrete structures and the intersection of shadow and architectural geometry.', 
    tags: ['Architecture', 'Photography', 'Minimalism'],
    img: "/proj1.png" 
  },
  { 
    id: 2, 
    title: 'OBSIDIAN FLORA V.0', 
    date: '2024 11.02', 
    description: 'Hyper-detailed close-up exploration of digital organic forms and glowing fiber-optic structures.', 
    tags: ['CGI', 'Nature', 'Experimental'],
    img: "/proj2.png" 
  },
  { 
    id: 3, 
    title: 'URBAN VOID // TOKYO', 
    date: '2024 08.24', 
    description: 'Cinematic night exploration of futuristic urban environments and vibrant neon reflections.', 
    tags: ['Urban', 'Cinematic', 'Lighting'],
    img: "/proj3.png" 
  },
  { 
    id: 4, 
    title: 'GLITCH AESTHETIC LAB', 
    date: '2024 05.12', 
    description: 'Abstract digital glitch exploration focusing on fragmented geometric forms and cyan light.', 
    tags: ['Motion', 'Glitch', 'Digital Art'],
    img: "/proj4.png" 
  },
  { 
    id: 5, 
    title: 'THE NEBULA MONOLITH', 
    date: '2024 02.15', 
    description: 'Massive obsidian structure study set within a high-fidelity cinematic desert environment.', 
    tags: ['Sci-Fi', 'Environment', 'CGI'],
    img: "/proj5.png" 
  },
];

// Shared mutable scroll state to prevent React state re-renders during high-frequency scroll events
const globalScroll = { value: 0 };

function ProjectCard({ url, index }: { url: string, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);

  // ALCHE STYLE: Realistic architectural bend (Radius 300)
  const bentGeo = useMemo(() => {
    // ALCHE STYLE: Widescreen panoramic panels
    const geo = new THREE.CylinderGeometry(1200, 1200, 110, 64, 1, true, -0.09, 0.18);
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -1200));
    return geo;
  }, []);

  // Slightly larger geometry for the white border frame (exactly 0.72 units margin on all 4 sides)
  const borderGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1200, 1200, 111.44, 64, 1, true, -0.0906, 0.1812);
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -1200));
    return geo;
  }, []);

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) return;

    const scroll = globalScroll.value;

    if (scroll > 0.50) {
      groupRef.current.scale.set(0, 0, 0);
      return;
    }

    // ALCHE STUDIO STYLE: Projects appear AFTER "WORKS" text is visible
    // Synchronized range: 0.22 – 0.50 (all cards completed before 0.50)
    // Tighter spacing (0.025 instead of 0.04) and slower progression (5.5 multiplier instead of 9.0)
    // This allows multiple cards to be on screen at once with ultra-tight gaps and premium timing!
    const spacing = 0.025;
    const multiplier = 5.5;
    const startOffset = 0.22;
    const rawT = THREE.MathUtils.clamp((scroll - startOffset - index * spacing) * multiplier, 0, 1);

    // Easing for cinematic inertia
    const t = rawT < 0.5 
      ? 4 * rawT * rawT * rawT 
      : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
    
    // IMMERSIVE ORBIT: Cards sweep very close to camera
    const angle = (0.45 - t * 0.9) * Math.PI; 
    const orbitRadius = 420; 
    const zCenter = -380;
    // Peak z = -380 + 420 = 40 (only 100 units from camera!)
    
    const x = Math.sin(angle) * 300; // Tighter sweep through center
    const z = zCenter + Math.cos(angle) * orbitRadius; 
    
    // Diagonal ascent: bottom-right to top-left
    const y = (t - 0.5) * 50 - 5;
    
    groupRef.current.position.set(x, y, z);
    
    // COVER FLOW: Cards tilt as they sweep past
    groupRef.current.rotation.y = angle * 0.5;
    groupRef.current.rotation.z = (t - 0.5) * -0.12;
    groupRef.current.rotation.x = Math.sin(t * Math.PI) * 0.03;
    
    // OPACITY: Quick fade in, holds near-full, quick fade out
    const opacity = Math.pow(Math.sin(t * Math.PI), 0.2);
    // @ts-ignore
    meshRef.current.material.opacity = opacity;
    if (borderRef.current) {
      // @ts-ignore
      borderRef.current.material.opacity = opacity * 0.9; // Premium slightly translucent border glow
    }
    
    // SCALE: Cards fill ~65-70% of viewport at peak
    const s = 0.2 + Math.sin(t * Math.PI) * 0.45; 
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef}>
      {/* SOLID WHITE BORDER - rendered slightly behind/aligned with cylinder segment */}
      <mesh ref={borderRef} geometry={borderGeo} renderOrder={9}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          side={THREE.DoubleSide} 
          polygonOffset 
          polygonOffsetFactor={1} 
          polygonOffsetUnits={1} 
        />
      </mesh>

      {/* PROJECT IMAGE */}
      <mesh ref={meshRef} geometry={bentGeo} renderOrder={10}>
        <meshBasicMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide} 
          polygonOffset 
          polygonOffsetFactor={-1} 
          polygonOffsetUnits={-1} 
        />
      </mesh>
    </group>
  );
}


// PRELOAD: First 3 Projects for Instant Boot
PROJECTS.slice(0, 3).forEach(proj => useTexture.preload(proj.img));

function Monolith({ font }: { font: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  let lastUpdate = 0;

  const dGeo = useMemo(() => {
    const geo = new TextGeometry('D', { font, size: 130, height: 45, curveSegments: 12, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 0.4 });
    geo.computeBoundingBox();
    geo.center();
    return geo;
  }, [font]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: any) => {
      if (e.data.type === 'mouse') {
        setMouse({ x: e.data.x, y: e.data.y });
      }
    };
    window.addEventListener('message', handleMouse);
    return () => window.removeEventListener('message', handleMouse);
  }, []);

  const autoSpinAngle = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const scroll = globalScroll.value;
    
    // Smoothly fade out mouse influence between scroll 0.12 and 0.22
    const mouseInfluence = 1 - THREE.MathUtils.smoothstep(scroll, 0.12, 0.22);
    
    // PHASE 2 START: Increment auto-spin only when we reach the WORKS phase
    if (scroll > 0.12) {
      autoSpinAngle.current += delta * 0.6; // Controlled speed
    }
    
    let targetRotY = (mouse.x * 1.2 * mouseInfluence) + autoSpinAngle.current;
    let targetRotX = (-mouse.y * 0.4 * mouseInfluence) + (Math.sin(state.clock.elapsedTime * 0.5) * 0.05 * (1 - mouseInfluence));
    
    // Smooth interpolation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);

    // HYPERSPEED DIMENSIONAL WARP COLLAPSE: Spin up insanely and shrink scale during 0.50 to 0.57
    if (scroll > 0.57) {
      meshRef.current.scale.set(0, 0, 0);
    } else if (scroll > 0.50) {
      const warpT = THREE.MathUtils.smoothstep(scroll, 0.50, 0.57);
      meshRef.current.rotation.y += delta * 15 * warpT;
      meshRef.current.rotation.z += delta * 10 * warpT;
      
      const s = 1 - warpT;
      meshRef.current.scale.set(s, s, s);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }

    const now = performance.now();
    if (now - lastUpdate > 100) {
        window.postMessage({
            type: 'telemetry',
            data: { x: meshRef.current.quaternion.x, y: meshRef.current.quaternion.y, z: meshRef.current.quaternion.z, w: meshRef.current.quaternion.w }
        }, '*');
        lastUpdate = now;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.05}>
      <mesh ref={meshRef} position={[0, 0, -280]} geometry={dGeo}>
        <MeshTransmissionMaterial 
          backside 
          samples={16} 
          resolution={1024} 
          thickness={30} 
          chromaticAberration={0.05} 
          anisotropy={0.1} 
          distortion={0} 
          distortionScale={0} 
          temporalDistortion={0} 
          ior={1.5}
          color="#ffffff"
          transmission={1}
          roughness={0} 
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  );
}

// HERO NAME: Cinematic squeeze-out as user scrolls
function NameText({ geometry }: { geometry: THREE.BufferGeometry }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const scroll = globalScroll.value;
    // Transition from scroll 0.12 to 0.22
    const t = THREE.MathUtils.smoothstep(scroll, 0.12, 0.22);
    
    // LIQUID SHIMMER: Dissolve forward into the camera
    const push = Math.pow(t, 2) * 200;
    meshRef.current.position.set(0, 0, -300 + push);
    
    // Scale up through the lens
    meshRef.current.scale.set(1 + t * 3, 1 + t * 3, 1);
    
    // @ts-ignore
    meshRef.current.material.opacity = (1 - t) * 1.0;
    // @ts-ignore
    meshRef.current.material.emissiveIntensity = 1.5 + t * 10;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -300]} geometry={geometry}>
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={1.5} 
        transparent 
        metalness={0.8} 
        roughness={0.1} 
      />
    </mesh>
  );
}

// WORKS TEXT: Scales up from center with rotation settle
function WorksText({ font }: { font: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const worksGeo = useMemo(() => {
    const geo = new TextGeometry('WORKS', { font, size: 90, height: 0.5, curveSegments: 8 });
    geo.computeBoundingBox();
    geo.center();
    return geo;
  }, [font]);

  useFrame(() => {
    if (!meshRef.current) return;
    const scroll = globalScroll.value;
    // Appear from scroll 0.10 to 0.24, Fade out as projects appear (0.24 to 0.38)
    const fadeIn = THREE.MathUtils.smoothstep(scroll, 0.10, 0.24);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(scroll, 0.24, 0.38);
    // @ts-ignore
    meshRef.current.material.opacity = fadeIn * fadeOut * 1.0;
    
    // LIQUID SHIMMER: Emerge through a ripple of light
    const s = 0.8 + fadeIn * 0.2; 
    meshRef.current.scale.set(s, s, s);
    
    // Subtle chromatic weave
    meshRef.current.rotation.z = (1 - fadeIn) * 0.2;
    
    // Deep focus emergence with high-inertia easing
    meshRef.current.position.z = THREE.MathUtils.lerp(-550, -380, Math.pow(fadeIn, 1.2));
    
    // @ts-ignore
    meshRef.current.material.emissiveIntensity = Math.pow(fadeIn, 2) * 3.0;
    // @ts-ignore
    meshRef.current.material.opacity = fadeIn * fadeOut * 1.0;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -380]} geometry={worksGeo}>
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={0} 
        transparent 
        metalness={0.8} 
        roughness={0.1} 
      />
    </mesh>
  );
}

// CAMERA ZOOM-OUT & CINEMATIC HYPERSPEED WARP
function CameraController() {
  useFrame(({ camera }) => {
    const scroll = globalScroll.value;
    
    // Zoom out from 140 to 190 as scroll enters works section (0.08 to 0.22)
    const zoomT = THREE.MathUtils.smoothstep(scroll, 0.08, 0.22);
    let z = THREE.MathUtils.lerp(140, 190, zoomT);
    let y = 0;
    let roll = 0;

    if (scroll > 0.50 && scroll <= 0.57) {
      // 1. HYPERSPEED WARP COLLAPSE: Spin up and pull back
      const warpT = THREE.MathUtils.smoothstep(scroll, 0.50, 0.57);
      z = THREE.MathUtils.lerp(190, 550, warpT * warpT); // Quadratic acceleration
      roll = THREE.MathUtils.lerp(0, -Math.PI * 0.25, warpT * warpT);
    } else if (scroll > 0.57 && scroll <= 0.79) {
      // 2. EXPERIENCE STABILIZATION: Roll back to flat, zoom in slightly, drop camera down to center cards
      const expT = THREE.MathUtils.smoothstep(scroll, 0.57, 0.63);
      z = THREE.MathUtils.lerp(550, 480, expT);
      roll = THREE.MathUtils.lerp(-Math.PI * 0.25, 0, expT);
      y = THREE.MathUtils.lerp(0, -10, expT);
    } else if (scroll > 0.79) {
      // 3. EDUCATION EXIT OUT-ZOOM
      const eduT = THREE.MathUtils.smoothstep(scroll, 0.79, 0.85);
      z = THREE.MathUtils.lerp(480, 520, eduT);
      y = THREE.MathUtils.lerp(-10, -50, eduT);
    }

    camera.position.z = z;
    camera.position.y = y;
    camera.rotation.z = roll;
  });
  return null;
}

// Helper function for Framer-style spring mechanics with NaN protection
function updateSpring(
  current: number,
  target: number,
  velocityRef: { current: number },
  stiffness: number,
  damping: number,
  dt: number
) {
  if (isNaN(current) || isNaN(velocityRef.current)) {
    velocityRef.current = 0;
    return target;
  }
  const force = stiffness * (target - current) - damping * velocityRef.current;
  velocityRef.current += force * dt;
  return current + velocityRef.current * dt;
}

// 3D HOLOGRAPHIC EXPERIENCE SCREEN CARDS
function Experience3DCard({ item, index }: { item: any, index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bgMeshRef = useRef<THREE.Mesh>(null);
  const borderMeshRef = useRef<THREE.Mesh>(null);
  const lerpedScroll = useRef<number | null>(null);

  // Velocity refs for Framer-style spring physical simulation
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const velZRef = useRef(0);
  const velScaleRef = useRef(0);
  const velRotXRef = useRef(0);
  const velRotYRef = useRef(0);
  const velRotZRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const rawScroll = globalScroll.value;

    // Run spring physics in a wider range for flawless entrance & exit animations
    const isPhysicsActive = rawScroll >= 0.52 && rawScroll <= 0.84;

    if (!isPhysicsActive) {
      groupRef.current.position.set(0, 1200, -300);
      groupRef.current.scale.set(0.001, 0.001, 0.001);
      groupRef.current.rotation.set(-Math.PI * 0.4, 0, 0);

      velXRef.current = 0;
      velYRef.current = 0;
      velZRef.current = 0;
      velScaleRef.current = 0;
      velRotXRef.current = 0;
      velRotYRef.current = 0;
      velRotZRef.current = 0;

      lerpedScroll.current = null;
      return;
    }

    // Define spring targets based on scroll phase
    let targetX = 0;
    let targetY = -10;
    let targetZ = -60;
    let targetScale = 0.001;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;

    // Determine the distance factor from active card center
    let dist = 0;

    if (rawScroll < 0.58) {
      // ENTRANCE PHASE: Hover high and remain flat/folded
      targetX = 0;
      targetY = 1200;
      targetZ = -300;
      targetScale = 0.001;
      targetRotX = -Math.PI * 0.4;
      targetRotY = 0;
      targetRotZ = 0;
      dist = 1.0; // considered far
    } else if (rawScroll > 0.80) {
      // EXIT PHASE: Sink beneath screen and tilt forward
      targetX = 0;
      targetY = -1200;
      targetZ = -300;
      targetScale = 0.001;
      targetRotX = Math.PI * 0.4;
      targetRotY = 0;
      targetRotZ = 0;
      dist = 1.0; // considered far
    } else {
      // ACTIVE TIMELINE VIEW: Custom track coordinate calculations
      if (lerpedScroll.current === null) {
        lerpedScroll.current = rawScroll;
      }
      lerpedScroll.current = THREE.MathUtils.lerp(lerpedScroll.current, rawScroll, 0.08);
      const scroll = lerpedScroll.current;

      const localScroll = Math.max(0, Math.min(1, (scroll - 0.63) / 0.13));
      const length = EXPERIENCE_DATA.length;
      const centerT = length === 1 ? 0.50 : 0.15 + index * (0.70 / (length - 1));
      dist = localScroll - centerT;

      targetX = dist * -500;
      targetY = -10;
      targetZ = -60 - Math.abs(dist) * 160;
      targetScale = 0.62 - Math.abs(dist) * 0.18;
      targetRotY = dist * -0.65; // Dramatic cover flow angle
      targetRotZ = dist * -0.12; // Dynamic lean
      targetRotX = -0.05 + Math.sin(state.clock.getElapsedTime() * 0.8 + index) * 0.012; // slow idle drift
    }

    // Solve Framer-style spring equations using a substepped integrator for 100% stability
    const dt = Math.min(0.03, delta);
    const substeps = 4;
    const sdt = dt / substeps;

    for (let step = 0; step < substeps; step++) {
      // Position spring: smooth elastic slide
      const curPos = groupRef.current.position;
      curPos.x = updateSpring(curPos.x, targetX, velXRef, 140, 15, sdt);
      curPos.y = updateSpring(curPos.y, targetY, velYRef, 140, 15, sdt);
      curPos.z = updateSpring(curPos.z, targetZ, velZRef, 140, 15, sdt);

      // Scale spring: majestic elastic pop
      const curScale = groupRef.current.scale;
      const nextS = updateSpring(curScale.x, targetScale, velScaleRef, 150, 15, sdt);
      curScale.set(nextS, nextS, nextS);

      // Rotation spring: organic angular snap back
      const curRot = groupRef.current.rotation;
      curRot.x = updateSpring(curRot.x, targetRotX, velRotXRef, 110, 12, sdt);
      curRot.y = updateSpring(curRot.y, targetRotY, velRotYRef, 110, 12, sdt);
      curRot.z = updateSpring(curRot.z, targetRotZ, velRotZRef, 110, 12, sdt);
    }

    // Card background & border opacities
    const cardOpacity = Math.max(0, 1 - Math.abs(dist) * 2.2);

    if (bgMeshRef.current) {
      // @ts-ignore
      bgMeshRef.current.material.opacity = cardOpacity * 0.85;
    }
    if (borderMeshRef.current) {
      // @ts-ignore
      borderMeshRef.current.material.opacity = cardOpacity * 0.95;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Glass Screen Backdrop */}
      <mesh ref={bgMeshRef} position={[0, 0, -2]}>
        <planeGeometry args={[160, 115]} />
        <meshPhysicalMaterial
          color="#060913"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.85}
          transmission={0.6}
          thickness={5}
        />
      </mesh>

      {/* 3D Neon Border */}
      <mesh ref={borderMeshRef} position={[0, 0, -1.8]}>
        <planeGeometry args={[162, 117]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.9}
          wireframe
        />
      </mesh>

      {/* HTML Content Overlay: Doubled distanceFactor to 360 to achieve crisp, razor-sharp vector text rendering */}
      <Html transform distanceFactor={360} pointerEvents="none" center>
        <div className="exp-3d-html-card">
          <div className="exp-3d-header">
            <span className="exp-3d-mono">{item.timecode}</span>
            <span className="exp-3d-mono exp-3d-accent">{item.duration}</span>
          </div>

          <div className="exp-3d-body">
            <h3 className="exp-3d-title">{item.title}</h3>
            <h4 className="exp-3d-company">{item.company}</h4>
            <p className="exp-3d-desc">{item.desc}</p>
          </div>

          <div className="exp-3d-tags">
            {item.tags.map((tag: string) => (
              <span key={tag} className="exp-3d-tag">{tag}</span>
            ))}
          </div>

          {/* Cyber decoration corners */}
          <div className="exp-3d-corner exp-3d-corner-tl" />
          <div className="exp-3d-corner exp-3d-corner-tr" />
          <div className="exp-3d-corner exp-3d-corner-bl" />
          <div className="exp-3d-corner exp-3d-corner-br" />
        </div>
      </Html>
    </group>
  );
}

function Experience3D() {
  return (
    <group>
      {EXPERIENCE_DATA.map((item, i) => (
        <Experience3DCard key={item.id} item={item} index={i} />
      ))}
    </group>
  );
}

// OPTIMIZED LIGHT TRANSITION COMPONENT
function TransitionLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!lightRef.current) return;
    const scroll = globalScroll.value;
    lightRef.current.intensity = THREE.MathUtils.smoothstep(scroll, 0.15, 0.25) * (1 - THREE.MathUtils.smoothstep(scroll, 0.25, 0.35)) * 50;
  });
  return <pointLight ref={lightRef} position={[0, 0, -200]} color="#ffffff" />;
}

// HIGH-END CINEMATIC INTERACTIVE WEBGL VORTEX
function ContactParticles3D() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1800; // Dense and stunning particle count

  // Generate stable coordinates, velocities, and noise offsets
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Swirling organic spiral distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 220;
      const height = (Math.random() - 0.5) * 40;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Orbit speed and custom attributes
      vels[i * 3] = radius;                      // Velocity X = Orbit radius
      vels[i * 3 + 1] = angle;                   // Velocity Y = Current angle
      vels[i * 3 + 2] = 0.4 + Math.random() * 1.8; // Velocity Z = Orbital angular speed
    }
    return [pos, vels];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const scroll = globalScroll.value;

    // Active in phase 06 (scroll >= 0.81)
    const isActive = scroll >= 0.81;
    if (!isActive) {
      pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;

    const localScroll = Math.max(0, Math.min(1, (scroll - 0.81) / 0.12));
    
    // Set opacity: fade in and expand
    // @ts-ignore
    pointsRef.current.material.opacity = localScroll * 0.75;

    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    // Map mouse position (-1 to 1) to canvas coordinates
    const targetX = state.pointer.x * 120;
    const targetY = state.pointer.y * 80;

    for (let i = 0; i < count; i++) {
      const radius = velocities[i * 3];
      let angle = velocities[i * 3 + 1];
      const speed = velocities[i * 3 + 2];

      // Swirl rotation around the central axis
      angle += speed * 0.005;
      velocities[i * 3 + 1] = angle;

      // Calculate base swirl coordinates
      const swirlX = Math.cos(angle) * radius;
      const swirlZ = Math.sin(angle) * radius;
      const swirlY = Math.sin(time * 0.4 + radius * 0.025) * 12;

      // Magnetic pull to user mouse client pointer coordinates
      const dx = targetX - swirlX;
      const dy = targetY - swirlY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Intense pull radius: warping closer particles
      const pullRadius = 180;
      const force = Math.max(0, 1 - dist / pullRadius) * 45 * localScroll;

      // Apply coordinates using smooth dampening
      posArr[i * 3] = THREE.MathUtils.lerp(posArr[i * 3], swirlX + (dx / (dist + 0.01)) * force, 0.06);
      posArr[i * 3 + 1] = THREE.MathUtils.lerp(posArr[i * 3 + 1], swirlY + (dy / (dist + 0.01)) * force, 0.06);
      posArr[i * 3 + 2] = THREE.MathUtils.lerp(posArr[i * 3 + 2], swirlZ, 0.06);
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, -10, -90]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={2.2}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent() {
  const [font, setFont] = useState<any>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (f) => setFont(f));
    const handleScroll = (e: any) => { 
      if (e.data && e.data.type === 'scroll') {
        globalScroll.value = e.data.value; 
      }
    };
    window.addEventListener('message', handleScroll);
    return () => window.removeEventListener('message', handleScroll);
  }, []);

  const nameGeo = useMemo(() => {
    if (!font) return null;
    const geo = new TextGeometry('DARSH', { font, size: 100, height: 0.5, curveSegments: 8 });
    geo.computeBoundingBox();
    geo.center();
    return geo;
  }, [font]);

  if (!font || !nameGeo) return null;

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={2.5} />
      
      <TransitionLight />
      
      <pointLight position={[50, 50, -50]} intensity={25} color="#ffffff" />
      <pointLight position={[-50, -50, -50]} intensity={25} color="#ffffff" />
      <spotLight position={[0, 100, 0]} intensity={5} angle={0.5} penumbra={1} />
      <directionalLight position={[0, 50, 0]} intensity={2} />
      
      <Grid 
        infiniteGrid 
        fadeDistance={120} 
        fadeStrength={5} 
        cellSize={10} 
        sectionSize={50} 
        sectionThickness={1} 
        sectionColor="#111" 
        cellColor="#020202" 
        position={[0, -60, 0]} 
      />

      <CameraController />

      <NameText geometry={nameGeo} />

      <WorksText font={font} />

      <Monolith font={font} />
      
      {PROJECTS.map((proj, i) => (
        <ProjectCard key={proj.id} url={proj.img} index={i} />
      ))}

      <Experience3D />

      <ContactParticles3D />
    </>
  );
}

export default function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0 }}>
      <Canvas 
        className="scene-canvas"
        camera={{ position: [0, 0, 140], fov: 45 }} 
        dpr={[1, 1.2]} // Very conservative for ultra-smoothness
        gl={{ 
          powerPreference: "high-performance", 
          antialias: true, 
          alpha: true,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false
        }}>

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

    </div>
  );
}
