"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const LETTERS = "LET'S TALK".split("");

// Pre-computed random starting positions for each letter
const LETTER_ORIGINS = LETTERS.map((_, i) => ({
  x: Math.sin(i * 2.7 + 1.3) * 600,
  y: Math.cos(i * 1.9 + 0.7) * 400,
  rotate: Math.sin(i * 3.1) * 180,
  scale: 0.3 + Math.random() * 0.4,
}));

const SOCIAL_LINKS = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/darsh-singhal-24426521a/", angle: 0 },
  { label: "GITHUB", href: "https://github.com/DarshSinghal", angle: 72 },
  { label: "TWITTER", href: "https://x.com/DarshSinghal07", angle: 144 },
  { label: "DRIBBBLE", href: "https://dribbble.com/Darsh_Singhal07", angle: 216 },
  { label: "EMAIL", href: "mailto:darshsinghal07@gmail.com", angle: 288 },
];

export default function ContactSection() {
  const [scroll, setScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [pulseTriggered, setPulseTriggered] = useState(false);

  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth local variables managed in refs for 120 FPS render loops
  const localScrollRef = useRef(0);
  const orbitProgressRef = useRef(0);
  const assemblyProgressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.data && e.data.type === 'scroll') {
        const s = e.data.value;
        const active = s >= 0.85;
        if (active) {
          setScroll(s);
          const localS = Math.max(0, Math.min(1, (s - 0.89) / 0.11));
          localScrollRef.current = localS;
          assemblyProgressRef.current = Math.min(1, localS * 2.5);
          orbitProgressRef.current = Math.max(0, Math.min(1, (localS - 0.3) / 0.4));
        } else if (scroll !== 0 && s < 0.85) {
          setScroll(0);
          localScrollRef.current = 0;
          assemblyProgressRef.current = 0;
          orbitProgressRef.current = 0;
        }
      }
    };
    window.addEventListener('message', handleScroll);
    return () => window.removeEventListener('message', handleScroll);
  }, [scroll]);

  // Local scroll calculations for footer & rendering triggers
  const localScroll = Math.max(0, Math.min(1, (scroll - 0.89) / 0.11));
  const fadeIn = Math.min(1, Math.max(0, (scroll - 0.86) / 0.04));
  const opacity = fadeIn;
  const isVisible = scroll > 0.86;
  const assemblyProgress = Math.min(1, localScroll * 2.5);
  const orbitProgress = Math.max(0, Math.min(1, (localScroll - 0.3) / 0.4));
  const footerProgress = Math.max(0, Math.min(1, (localScroll - 0.6) / 0.3));

  // Pulse wave trigger
  useEffect(() => {
    if (localScroll > 0.15 && !pulseTriggered) {
      setPulseTriggered(true);
    }
    if (localScroll < 0.05) {
      setPulseTriggered(false);
    }
  }, [localScroll, pulseTriggered]);

  // Mouse tracking for magnetic pull calculations
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x: nx, y: ny });
    mouseRef.current = { x: nx, y: ny };
  }, []);

  // direct-DOM high-frequency render ticker
  useEffect(() => {
    if (!isVisible) return;

    let animId = 0;
    let time = 0;
    const orbitRadius = 180;

    const tick = () => {
      time += 0.012; // slowly increment time for smooth drift waves

      // 1. UPDATE ORBIT NODE COORDINATES & MULTI-OCTAVE DRIFT
      SOCIAL_LINKS.forEach((link, i) => {
        const el = linksRef.current[i];
        if (!el) return;

        // Base circular orbit with scroll speed multiplier
        const angleRad = ((link.angle + localScrollRef.current * 40) * Math.PI) / 180;
        const r = orbitRadius * orbitProgressRef.current;
        const x = Math.cos(angleRad) * r;
        const y = Math.sin(angleRad) * r;

        // Independent, lazy organic floating offset
        const driftX = Math.sin(time * 1.25 + i * 1.9) * 14 + Math.cos(time * 0.65 + i * 1.2) * 8;
        const driftY = Math.cos(time * 1.45 + i * 3.1) * 14 + Math.sin(time * 0.75 + i * 1.6) * 8;

        // Mouse magnetic pull calculation
        const targetX = mouseRef.current.x * 100;
        const targetY = mouseRef.current.y * 100;
        const dx = targetX - (x + driftX);
        const dy = targetY - (y + driftY);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Pull radius threshold
        const pullRadius = 240;
        const force = Math.max(0, 1 - dist / pullRadius) * 24 * orbitProgressRef.current;
        const magnetX = mouseRef.current.x * force;
        const magnetY = mouseRef.current.y * force;

        // Compose final coordinate translate
        const finalX = x + driftX + magnetX;
        const finalY = y + driftY + magnetY;

        el.style.transform = `translate(${finalX}px, ${finalY}px)`;
        el.style.opacity = `${orbitProgressRef.current}`;
      });

      // 2. UPDATE KINETIC LETTERS
      if (assemblyProgressRef.current < 0.99) {
        LETTERS.forEach((letter, i) => {
          const el = lettersRef.current[i];
          if (!el) return;

          const origin = LETTER_ORIGINS[i];
          const t = Math.min(1, Math.max(0, assemblyProgressRef.current * 1.35 - i * 0.085));

          // Spring elasticity
          const eased = t < 1
            ? 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * ((2 * Math.PI) / 3))
            : 1;

          const currentX = origin.x * (1 - eased);
          const currentY = origin.y * (1 - eased);
          const currentRotate = origin.rotate * (1 - eased);
          const currentScale = origin.scale + (1 - origin.scale) * eased;
          const letterOpacity = Math.min(1, t * 3.5);

          el.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotate}deg) scale(${currentScale})`;
          el.style.opacity = `${letterOpacity}`;
        });
      } else {
        // Subtle magnetic sway when fully assembled
        LETTERS.forEach((letter, i) => {
          const el = lettersRef.current[i];
          if (!el) return;

          // Only sway if there is no active GSAP hover kinetic animation running
          if (!gsap.isTweening(el)) {
            const swayFactor = 4 * (1 - Math.abs(i / LETTERS.length - 0.5));
            const swayX = mouseRef.current.x * swayFactor;
            const swayY = mouseRef.current.y * swayFactor;
            el.style.transform = `translate(${swayX}px, ${swayY}px)`;
            el.style.opacity = "1";
          }
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVisible]);

  // Interactive GSAP ripple kinetic wave animation on letter hover
  const handleLetterHover = (index: number) => {
    if (assemblyProgressRef.current < 0.90) return; // interact only when letters are assembled

    const indices = [index - 1, index, index + 1];
    indices.forEach((idx, offset) => {
      const el = lettersRef.current[idx];
      if (!el) return;

      const delay = Math.abs(offset - 1) * 0.04;
      const amount = (2 - Math.abs(offset - 1)) * -14; // spring elastic leap

      gsap.to(el, {
        y: amount,
        scale: 1.15,
        color: "#00f5ff",
        textShadow: "0 0 15px rgba(0, 245, 255, 0.8)",
        duration: 0.22,
        ease: "power2.out",
        delay,
        onComplete: () => {
          gsap.to(el, {
            y: 0,
            scale: 1,
            color: "#ffffff",
            textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
            duration: 0.45,
            ease: "elastic.out(1.1, 0.35)",
          });
        }
      });
    });
  };

  if (!isVisible) return null;

  // Footer typewriter text
  const footerText = "Based in Dehradun, IN — Available for Freelance";
  const visibleChars = Math.floor(footerProgress * footerText.length);

  return (
    <div
      ref={containerRef}
      className="contact-section-v2"
      style={{ opacity }}
      onMouseMove={handleMouseMove}
    >
      {/* DARK BACKDROP — blocks WebGL bleed-through */}
      <div className="section-backdrop" />

      {/* CONCENTRIC GRAVITATIONAL RINGS */}
      <div className="contact-rings">
        {[1, 2, 3, 4].map((ring) => (
          <div
            key={ring}
            className="contact-ring"
            style={{
              width: `${ring * 200 + 100}px`,
              height: `${ring * 200 + 100}px`,
              opacity: Math.max(0, assemblyProgress - ring * 0.15) * 0.12,
              animationDelay: `${ring * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* RADIAL PULSE WAVE */}
      <AnimatePresence>
        {pulseTriggered && (
          <motion.div
            className="contact-pulse"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            onAnimationComplete={() => setPulseTriggered(false)}
          />
        )}
      </AnimatePresence>

      {/* LABEL */}
      <div className="contact-label">
        <span className="contact-mono">06 / CONNECT</span>
      </div>

      {/* ASSEMBLING LETTERS */}
      <div className="contact-title-container">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              lettersRef.current[i] = el;
            }}
            className={`contact-letter ${letter === " " ? "contact-space" : ""}`}
            onMouseEnter={() => handleLetterHover(i)}
            style={{
              transition: "color 0.25s ease, text-shadow 0.25s ease",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>

      {/* ORBITAL SOCIAL LINKS */}
      <div className="contact-orbit-container">
        {SOCIAL_LINKS.map((link, i) => (
          <div
            key={link.label}
            ref={(el) => {
              linksRef.current[i] = el;
            }}
            className="contact-orbit-wrapper"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              pointerEvents: "auto",
            }}
          >
            <motion.a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-orbit-link"
              data-cursor="view"
              whileHover={{
                scale: 1.18,
                borderColor: "#00f5ff",
                backgroundColor: "rgba(0, 245, 255, 0.18)",
                boxShadow: "0 0 32px rgba(0, 245, 255, 0.55), inset 0 0 15px rgba(0, 245, 255, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 16 }}
            >
              <span className="contact-orbit-label">{link.label}</span>
            </motion.a>
          </div>
        ))}
      </div>

      {/* FOOTER — TYPEWRITER */}
      <div className="contact-footer">
        <div className="contact-footer-line" />
        <div className="contact-footer-text">
          <span className="contact-mono">
            {footerText.slice(0, visibleChars)}
            <span className="contact-cursor">|</span>
          </span>
        </div>
        <div className="contact-footer-meta">
          <span className="contact-mono contact-dim">© 2026 DARSH</span>
          <span className="contact-mono contact-dim">ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </div>
  );
}
