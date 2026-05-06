"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EDUCATION_DATA = [
  {
    id: 1,
    school: "APS,Udhampur & KV NO.1, Udhampur",
    degree: "Primary & Secondary Education",
    duration: "2011 — 2021",
    desc: "Acquired fundamental analytical and creative skills during early schooling, establishing a strong academic foundation.",
    x: 30,
    y: 35,
    depth: 1.0,
  },
  {
    id: 2,
    school: "Graphic Era Hill University, Dehradun",
    degree: "Bachelor of Design UX/ID",
    duration: "Expected Graduation By 2029",
    desc: "Specializing in User Experience design, custom digital interaction models, human-computer interaction, and design systems.",
    x: 65,
    y: 55,
    depth: 0.7,
  },
];

// Connection paths between nodes (index pairs)
const CONNECTIONS = [
  { from: 0, to: 1 },
];

export default function EducationSection() {
  const [scroll, setScroll] = useState(0);
  const [activeNode, setActiveNode] = useState(-1);

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.data && e.data.type === 'scroll') {
        const s = e.data.value;
        const active = s >= 0.73 && s <= 0.92;
        if (active) {
          setScroll(s);
        } else if (scroll !== 0 && (s < 0.73 || s > 0.92)) {
          setScroll(0);
        }
      }
    };
    window.addEventListener('message', handleScroll);
    return () => window.removeEventListener('message', handleScroll);
  }, [scroll]);

  // Map global scroll (0.77 – 0.89) into local 0–1 (local range: 0.12)
  const localScroll = Math.max(0, Math.min(1, (scroll - 0.77) / 0.12));

  // Opacity envelope
  const fadeIn = Math.min(1, Math.max(0, (scroll - 0.74) / 0.04));
  const fadeOut = Math.min(1, Math.max(0, (0.91 - scroll) / 0.04));
  const opacity = fadeIn * fadeOut;

  const isVisible = scroll > 0.74 && scroll < 0.91;

  useEffect(() => {
    if (!isVisible) {
      setActiveNode(-1);
      return;
    }
    // Activate nodes sequentially based on scroll
    if (localScroll > 0.6) setActiveNode(1);
    else if (localScroll > 0.2) setActiveNode(0);
    else setActiveNode(-1);
  }, [localScroll, isVisible]);

  // SVG path computation
  const svgPaths = useMemo(() => {
    return CONNECTIONS.map((conn) => {
      const from = EDUCATION_DATA[conn.from];
      const to = EDUCATION_DATA[conn.to];
      // Curved path between nodes
      const midX = (from.x + to.x) / 2;
      const midY = Math.min(from.y, to.y) - 15;
      return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
    });
  }, []);

  // Path draw progress
  const pathProgress = Math.min(1, localScroll * 2.5);

  if (!isVisible) return null;

  return (
    <div className="edu-section" style={{ opacity }}>
      {/* DARK BACKDROP — blocks WebGL bleed-through */}
      <div className="section-backdrop" />

      {/* BACKGROUND STAR FIELD */}
      <div className="edu-stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="edu-star"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.3) % 4}s`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* SCANLINE GRID OVERLAY */}
      <div
        className="edu-grid-overlay"
        style={{ opacity: localScroll * 0.15 }}
      />

      {/* Dynamic Section Heading */}
      <div className="cinematic-header">
        <div className="cinematic-phase">PHASE_05 // CONSTELLATION</div>
        <h2 className="cinematic-title">
          ACADEMIC <span className="title-accent">EDUCATION</span>
        </h2>
        <div className="cinematic-line" />
      </div>

      {/* SECTION LABEL */}
      <div className="edu-label">
        <span className="edu-mono">EDUCATION_CONSTELLATION</span>
        <div className="edu-label-line" style={{ width: `${pathProgress * 60}px` }} />
      </div>

      {/* SVG CONNECTION LINES */}
      <svg className="edu-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {svgPaths.map((d, i) => (
          <React.Fragment key={i}>
            {/* Glow layer */}
            <path
              d={d}
              fill="none"
              stroke="rgba(0, 245, 255, 0.15)"
              strokeWidth="0.8"
              strokeDasharray="200"
              strokeDashoffset={200 - pathProgress * 200}
              filter="url(#glow)"
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
            {/* Main line */}
            <path
              d={d}
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="0.15"
              strokeDasharray="200"
              strokeDashoffset={200 - pathProgress * 200}
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </React.Fragment>
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* CONSTELLATION NODES */}
      {EDUCATION_DATA.map((node, i) => {
        const isActive = activeNode === i;
        const nodeVisible = localScroll > (i * 0.3 + 0.1);
        const parallaxX = (localScroll - 0.5) * (node.depth * 8);
        const parallaxY = (localScroll - 0.5) * (node.depth * 5);

        return (
          <motion.div
            key={node.id}
            className={`edu-node ${isActive ? "edu-node-active" : ""}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              x: parallaxX,
              y: parallaxY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: nodeVisible ? (isActive ? 1 : 0.7) : 0,
              opacity: nodeVisible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Core glow */}
            <div className="edu-node-core">
              <div className="edu-node-ring" />
              <div className="edu-node-dot" />
              {/* Orbiting particles */}
              <div className="edu-orbit edu-orbit-1" />
              <div className="edu-orbit edu-orbit-2" />
            </div>

            {/* Detail panel — shows when active */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="edu-detail"
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="edu-detail-line" />
                  <div className="edu-detail-content">
                    <span className="edu-mono edu-dim">{node.duration}</span>
                    <h3 className="edu-school">{node.school}</h3>
                    <h4 className="edu-degree">{node.degree}</h4>
                    <p className="edu-desc">{node.desc}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always-visible mini label */}
            {!isActive && nodeVisible && (
              <div className="edu-mini-label">
                <span className="edu-mono">{node.school.split(" ")[0]}</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* BOTTOM STATUS */}
      <div className="edu-status">
        <span className="edu-mono edu-dim">NODES: {EDUCATION_DATA.length}</span>
        <span className="edu-mono edu-dim">
          ACTIVE: {activeNode >= 0 ? `0${activeNode + 1}` : "—"}
        </span>
        <span className="edu-mono edu-dim">
          PHASE: 05_EDUCATION_MAP
        </span>
      </div>
    </div>
  );
}
