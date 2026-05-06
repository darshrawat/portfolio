"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { PROJECTS } from "../components/Scene";
import TransitionOverlay from "../components/TransitionOverlay";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import ContactSection from "../components/ContactSection";

export default function PortfolioPage() {
  useEffect(() => {
    // ALCHE BUTTER-SMOOTH HIGH-INERTIA SCROLL (Controlled Speed & 120FPS Performance)
    const lenis = new Lenis({
      lerp: 0.035, // Slower, silky deceleration drift
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.70, // Physically reduces scroll distance per mouse-wheel tick for majestic speed
      touchMultiplier: 1.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Direct DOM access elements (cached for peak speed)
    const heroOverlay = document.getElementById("hero-overlay");
    const projectOverlay = document.getElementById("project-overlay");
    const hudIndex = document.getElementById("hud-index");
    const hudDate = document.getElementById("hud-date");
    const hudTitle = document.getElementById("hud-title");
    const hudDesc = document.getElementById("hud-desc");
    const hudTags = document.getElementById("hud-tags");
    const sceneEl = document.querySelector('.scene-wrapper') as HTMLElement;
    const hudEl = document.querySelector('.alche-hud') as HTMLElement;

    lenis.on("scroll", (e: any) => {
      const scrollValue = e.animatedScroll / (document.body.scrollHeight - window.innerHeight);

      // Global message broadcast (highly performant event propagation, no React state overhead)
      window.postMessage({
        type: "scroll",
        value: scrollValue
      }, "*");

      // 1. HERO ABOUT-ME OPACITY: Stay visible, fade between 0.12 and 0.22
      const hOpacity = 1 - Math.max(0, Math.min(1, (scrollValue - 0.12) / 0.10));
      if (heroOverlay) heroOverlay.style.opacity = hOpacity.toString();

      // 2. PROJECT HUD SYNC — active between 0.22 and 0.50
      const projectStart = 0.22;
      const projectSpacing = 0.025;
      const projectMultiplier = 5.5;

      let bestIdx = -1;
      let maxOpacity = 0;

      PROJECTS.forEach((_, i) => {
        const rawT = (scrollValue - projectStart - i * projectSpacing) * projectMultiplier;
        if (rawT > 0 && rawT < 1) {
          const opacity = 1 - Math.abs(rawT - 0.5) * 4;
          if (opacity > maxOpacity) {
            maxOpacity = opacity;
            bestIdx = i;
          }
        }
      });

      // Direct DOM content updates to avoid React reconciliation completely
      if (bestIdx !== -1) {
        const proj = PROJECTS[bestIdx];
        if (hudIndex) hudIndex.textContent = `0${bestIdx + 1} //`;
        if (hudDate) hudDate.textContent = proj.date;
        if (hudTitle) hudTitle.textContent = proj.title;
        if (hudDesc) hudDesc.textContent = proj.description;
        if (hudTags) {
          hudTags.innerHTML = proj.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
        }
      }

      const isProjectActive = scrollValue >= 0.22 && scrollValue <= 0.50;
      const hudOpacity = scrollValue > 0.50
        ? Math.max(0, 1 - (scrollValue - 0.50) / 0.05)
        : (isProjectActive ? Math.max(0, Math.min(1, maxOpacity)) : 0);

      if (projectOverlay) {
        projectOverlay.style.opacity = hudOpacity.toString();
        // Enable/disable pointer events to prevent clicking through when invisible
        projectOverlay.style.pointerEvents = hudOpacity > 0.1 ? "auto" : "none";
      }

      // 3. CANVAS FADE OUT: Fades out only when entering Education at 0.79 (stays visible through Hero, Projects, and Experience!)
      const sceneFade = scrollValue > 0.79 ? Math.max(0, 1 - (scrollValue - 0.79) / 0.05) : 1;
      if (sceneEl) sceneEl.style.opacity = sceneFade.toString();
      if (hudEl) hudEl.style.opacity = sceneFade.toString();
    });

    const handleMouseMove = (e: MouseEvent) => {
      window.postMessage({
        type: "mouse",
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }, "*");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div style={{ height: "1400vh", position: "relative" }}>

      {/* HERO ABOUT-ME OVERLAY */}
      <div id="hero-overlay" className="hero-overlay" style={{ opacity: 1 }}>
        <div className="hero-left">
          <div className="hero-label">PORTFOLIO — 2026</div>
          <div className="hero-role">UI/UX Designer</div>
          <div className="hero-role">&amp; Creative Developer</div>
          <div className="hero-divider" />
          <div className="hero-meta">
            <span>Based in Dehradun, IN</span>
            <span>Available for Freelance</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-label">ABOUT</div>
          <p className="hero-bio">
            Crafting immersive digital experiences
            at the intersection of design, code,
            and interactive storytelling.
          </p>
          <div className="hero-divider" />
          <div className="hero-label" style={{ marginBottom: '8px' }}>TOOLS & SKILLS</div>
          <div className="hero-skills">
            <span>Figma</span>
            <span>Adobe Illustrator</span>
            <span>Google Antigravity</span>
            <span>UI/UX Design</span>
            <span>Wireframe</span>
            <span>Prototyping</span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-scroll-hint">
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>

      {/* PROJECT DETAILS OVERLAY */}
      <div
        id="project-overlay"
        className="project-overlay"
        style={{
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <div className="project-hud">
          <div className="hud-top">
            <span id="hud-index" className="mono">01 //</span>
            <span id="hud-date" className="mono">2025 01.17</span>
          </div>
          <h2 id="hud-title" className="project-title">SILENT BRUTALISM // 01</h2>
          <p id="hud-desc" className="project-desc">A study on minimalist concrete structures and the intersection of shadow and architectural geometry.</p>
          <div id="hud-tags" className="project-tags">
            <span className="tag">Architecture</span>
            <span className="tag">Photography</span>
            <span className="tag">Minimalism</span>
          </div>
        </div>
      </div>

      {/* CINEMATIC TRANSITION OVERLAY */}
      <TransitionOverlay />

      {/* NEW SECTIONS — Scroll-driven */}
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </div>
  );
}
