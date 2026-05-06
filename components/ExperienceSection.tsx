"use client";

import React, { useRef, useEffect, useState } from "react";

export const EXPERIENCE_DATA = [
  {
    id: 1,
    title: "UI/UX Student",
    company: "Self-Directed / Academic",
    duration: "2025 — Present",
    timecode: "00:01:00",
    desc: "Designing and prototyping modern, high-fidelity user experiences. Crafting highly interactive user interfaces, establishing custom layout design systems, and modeling premium WebGL-powered 3D scrollytelling environments.",
    tags: ["UI/UX Design", "Figma", "Research", "Interaction Design"],
  },
];

export default function ExperienceSection() {
  const [scroll, setScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.data && e.data.type === 'scroll') {
        const s = e.data.value;
        const visible = s > 0.58 && s < 0.79;
        if (visible) {
          setScroll(s);
          setIsVisible(true);

          const localS = Math.max(0, Math.min(1, (s - 0.63) / 0.13));
          setSectionProgress(localS);

          const idx = Math.min(
            EXPERIENCE_DATA.length - 1,
            Math.floor(localS * EXPERIENCE_DATA.length)
          );
          setActiveIndex(idx);
        } else if (isVisible) {
          setIsVisible(false);
          setScroll(0);
        }
      }
    };
    window.addEventListener('message', handleScroll);
    return () => window.removeEventListener('message', handleScroll);
  }, [isVisible]);

  // Map global scroll (0.63 – 0.76) into local 0–1
  const localScroll = Math.max(0, Math.min(1, (scroll - 0.63) / 0.13));

  // Compute timecode from progress
  const totalSeconds = Math.floor(localScroll * 222);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const ff = String(Math.floor((localScroll * 222 * 30) % 30)).padStart(2, "0");
  const timecode = `${mm}:${ss}:${ff}`;

  // Opacity envelope: fade in 0.58-0.63, fade out 0.76-0.79
  const fadeIn = Math.min(1, Math.max(0, (scroll - 0.58) / 0.05));
  const fadeOut = Math.min(1, Math.max(0, (0.79 - scroll) / 0.03));
  const opacity = fadeIn * fadeOut;

  if (!isVisible) return null;

  return (
    <div
      className="exp-section"
      style={{ opacity, pointerEvents: "none" }}
    >
      {/* Fullscreen Viewport Tech Frame Overlay */}
      <div className="exp-viewport-frame">
        {/* Animated Corner Brackets */}
        <div className="frame-corner frame-corner-tl" />
        <div className="frame-corner frame-corner-tr" />
        <div className="frame-corner frame-corner-bl" />
        <div className="frame-corner frame-corner-br" />

        {/* Animated Border Lines */}
        <div className="frame-line frame-line-top" />
        <div className="frame-line frame-line-bottom" />
        <div className="frame-line frame-line-left" />
        <div className="frame-line frame-line-right" />

        {/* Dynamic Framing Telemetry Overlay */}
        <div className="frame-telemetry-left">
          <span className="frame-mono-tag">SYS_W_960</span>
          <span className="frame-mono-tag">SYS_H_660</span>
          <span className="frame-mono-tag">FOV_45_STABLE</span>
        </div>
        <div className="frame-telemetry-right">
          <span className="frame-mono-tag">CAM_DISTANCE_520</span>
          <span className="frame-mono-tag">ROT_Y_AUTO_ACTIVE</span>
          <span className="frame-mono-tag">LENS_REFRACTIVE_MODE</span>
        </div>

        {/* Center Target view-finder brackets */}
        <div className="frame-reticle">
          <div className="reticle-bracket bracket-tl" />
          <div className="reticle-bracket bracket-tr" />
          <div className="reticle-bracket bracket-bl" />
          <div className="reticle-bracket bracket-br" />
          <div className="reticle-center" />
        </div>
      </div>

      {/* Dynamic Section Heading */}
      <div className="cinematic-header">
        <div className="cinematic-phase">PHASE_04 // PROFESSIONAL</div>
        <h2 className="cinematic-title">
          EXPERIENCE <span className="title-accent">

          </span>
        </h2>
        <div className="cinematic-line" />
      </div>

      {/* 2D HUD SCRUBBER OVERLAY — Floats on top of the beautiful WebGL Scene */}
      <div className="exp-scrubber" style={{ pointerEvents: "auto" }}>
        <div className="exp-scrubber-label">
          <span className="exp-mono">EXPERIENCE_TIMELINE</span>
          <span className="exp-mono exp-accent">{timecode}</span>
        </div>
        <div className="exp-scrubber-track">
          <div
            className="exp-scrubber-fill"
            style={{ width: `${sectionProgress * 100}%` }}
          />
          <div
            className="exp-scrubber-head"
            style={{ left: `${sectionProgress * 100}%` }}
          />
          {/* Tick marks */}
          {EXPERIENCE_DATA.map((_, i) => (
            <div
              key={i}
              className="exp-scrubber-tick"
              style={{ left: `${((i + 0.5) / EXPERIENCE_DATA.length) * 100}%` }}
            />
          ))}
        </div>
        <div className="exp-scrubber-indices">
          {EXPERIENCE_DATA.map((_, i) => (
            <span
              key={i}
              className={`exp-mono exp-idx ${activeIndex === i ? "exp-idx-active" : ""}`}
            >
              0{i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM STATUS BAR */}
      <div className="exp-status" style={{ pointerEvents: "auto" }}>
        <span className="exp-mono exp-dim">PHASE: 04_EXPERIENCE_REEL</span>
        <span className="exp-mono exp-dim">
          {activeIndex + 1} / {EXPERIENCE_DATA.length} HOLOGRAPHIC ENTRIES
        </span>
        <span className="exp-mono exp-accent">▶ WEBGL SCRUBBING ACTIVE</span>
      </div>
    </div>
  );
}
