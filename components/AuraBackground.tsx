"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AuraBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: -2,
      background: "#010204", 
      overflow: "hidden",
      pointerEvents: "none"
    }}>
      {/* BREATHING BASE - Constant Opacity */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, #0a0d14 0%, #010204 100%)",
      }} />

      {/* STATIC GRID LAYER */}
      <motion.div 
        animate={{ 
          x: mouse.x, 
          y: mouse.y,
        }}
        transition={{ type: "spring", stiffness: 20, damping: 30 }}
        style={{
          position: "absolute",
          inset: "-10%",
          opacity: 0.1,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 245, 255, 0.5) 0.5px, transparent 0.5px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.5) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "100px 100px",
          maskImage: "radial-gradient(circle at center, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 75%)",
        }}
      >
        {/* Intersection Markers */}
        <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(0, 245, 255, 0.8) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
            backgroundPosition: "-0.5px -0.5px",
          }} 
        />
      </motion.div>

      {/* STATIC SPATIAL ELEMENTS */}
      <div style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: "40%",
          height: "60%",
          background: "linear-gradient(to bottom, rgba(0, 245, 255, 0.03), transparent)",
          filter: "blur(100px)",
          opacity: 0.5
        }}
      />

      {/* HEAVY STABLE VIGNETTE */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 40%, #010204 100%)",
        opacity: 0.9
      }} />
    </div>
  );
}
