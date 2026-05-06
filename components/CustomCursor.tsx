"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useVelocity, useTransform, AnimatePresence } from "framer-motion";

export type CursorVariant = "default" | "hover" | "text" | "view" | "drag" | "difference";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isVisible, setIsVisible] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  
  const variantRef = useRef<CursorVariant>("default");
  
  // Track variant in ref for stable usage inside callbacks
  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  // Motion Values for immediate tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth trailing lag (physics model)
  const ringX = useSpring(mouseX, { stiffness: 220, damping: 26, mass: 0.55 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 26, mass: 0.55 });

  // Velocity measurements
  const xVelocity = useVelocity(ringX);
  const yVelocity = useVelocity(ringY);

  // Velocity magnitude for stretch & squash
  const speed = useTransform([xVelocity, yVelocity], ([vx, vy]) => {
    return Math.sqrt((vx as number) * (vx as number) + (vy as number) * (vy as number));
  });

  // Calculate stretch (scaleX) and squash (scaleY) based on velocity
  // Cap the stretch at 1.45 and squash at 0.65 for visual realism
  const scaleX = useTransform(speed, [0, 3000], [1, 1.45]);
  const scaleY = useTransform(speed, [0, 3000], [1, 0.65]);

  // Rotate the ring to align its stretch axis with the velocity vector
  const rotate = useTransform([xVelocity, yVelocity], ([vx, vy]) => {
    const x = vx as number;
    const y = vy as number;
    if (Math.abs(x) < 1 && Math.abs(y) < 1) return 0;
    return Math.atan2(y, x) * (180 / Math.PI);
  });

  // Check mounting and touch devices
  useEffect(() => {
    setMounted(true);
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  // Timer for idle hide (fades cursor after inactivity)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    setIsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      // Do not hide if cursor is in an active view or drag state
      if (variantRef.current !== "view" && variantRef.current !== "drag") {
        setIsVisible(false);
      }
    }, 2000);
  };

  useEffect(() => {
    if (isTouchDevice || !mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      resetIdleTimer();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      // Get click position
      const x = e.clientX;
      const y = e.clientY;
      
      // Select appropriate theme color
      let color = "rgba(255, 255, 255, 0.7)";
      if (variantRef.current === "view") {
        color = "rgba(0, 245, 255, 0.85)";
      } else if (variantRef.current === "drag") {
        color = "rgba(255, 0, 128, 0.85)";
      } else if (variantRef.current === "hover") {
        color = "rgba(0, 245, 255, 0.65)";
      }

      setRipples((prev) => [...prev, { id: Date.now() + Math.random(), x, y, color }]);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Event delegation using closest to find interactive zones
      const interactiveEl = target.closest('a, button, [role="button"], .interactive, [data-cursor]');
      const textInputEl = target.closest('input, textarea, [contenteditable="true"]');
      const headingEl = target.closest('h1, h2, h3, .heading-large, .contact-letter, .project-title, .exp-3d-title');

      if (interactiveEl) {
        const cursorType = interactiveEl.getAttribute("data-cursor");
        if (cursorType === "view") {
          setVariant("view");
        } else if (cursorType === "drag") {
          setVariant("drag");
        } else if (cursorType === "difference") {
          setVariant("difference");
        } else {
          setVariant("hover");
        }
      } else if (textInputEl) {
        setVariant("text");
      } else if (headingEl) {
        setVariant("difference");
      } else {
        setVariant("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("click", handleClick);
    document.addEventListener("mouseover", handleMouseOver);

    // Initial timer start
    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseover", handleMouseOver);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [mounted, isTouchDevice, mouseX, mouseY]);

  if (!mounted || isTouchDevice) return null;

  // Variant definitions for trailing outer ring
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(255, 255, 255, 0.0)",
      borderColor: "rgba(255, 255, 255, 0.45)",
      borderWidth: 1.5,
      borderRadius: "50%",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
    },
    hover: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.95)",
      borderWidth: 1.5,
      borderRadius: "50%",
      backdropFilter: "blur(3px)",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.22)",
    },
    text: {
      width: 6,
      height: 36,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderColor: "rgba(255, 255, 255, 0.85)",
      borderWidth: 1,
      borderRadius: "3px",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 8px rgba(255, 255, 255, 0.2)",
    },
    view: {
      width: 84,
      height: 84,
      backgroundColor: "rgba(0, 245, 255, 0.12)",
      borderColor: "rgba(0, 245, 255, 0.85)",
      borderWidth: 1.5,
      borderRadius: "50%",
      backdropFilter: "blur(4px)",
      boxShadow: "0 0 25px rgba(0, 245, 255, 0.35)",
    },
    drag: {
      width: 84,
      height: 84,
      backgroundColor: "rgba(255, 0, 128, 0.12)",
      borderColor: "rgba(255, 0, 128, 0.85)",
      borderWidth: 1.5,
      borderRadius: "50%",
      backdropFilter: "blur(4px)",
      boxShadow: "0 0 25px rgba(255, 0, 128, 0.35)",
    },
    difference: {
      width: 72,
      height: 72,
      backgroundColor: "rgba(255, 255, 255, 1.0)",
      borderColor: "rgba(255, 255, 255, 1.0)",
      borderWidth: 0,
      borderRadius: "50%",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
    }
  };

  // State-based adjustments for central dot
  const getDotStyle = () => {
    const isHidden = variant === "difference" || variant === "text" || variant === "view" || variant === "drag";
    return {
      opacity: isHidden ? 0 : 1,
      scale: isHidden ? 0 : (variant === "hover" ? 0.6 : 1),
      backgroundColor: variant === "hover" ? "#00f5ff" : "#ffffff",
      boxShadow: variant === "hover" ? "0 0 10px rgba(0, 245, 255, 0.7)" : "0 0 10px rgba(255, 255, 255, 0.4)",
    };
  };

  return (
    <>
      {/* 1. CLICK RIPPLES */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
            style={{
              position: "fixed",
              left: ripple.x,
              top: ripple.y,
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: `2px solid ${ripple.color}`,
              boxShadow: `0 0 15px ${ripple.color}`,
              translateX: "-50%",
              translateY: "-50%",
              pointerEvents: "none",
              zIndex: 9998,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* 2. PRECISE RESPONSIVE CENTRAL DOT */}
      <motion.div
        className="custom-cursor-dot"
        animate={{
          ...getDotStyle(),
          opacity: isVisible ? getDotStyle().opacity : 0,
        }}
        style={{
          x: mouseX,
          y: mouseY,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 3. SMOOTH TRAILING SPRING RING (VELOCITY DEFORMED) */}
      <motion.div
        className="custom-cursor-ring"
        variants={ringVariants}
        animate={variant}
        style={{
          x: ringX,
          y: ringY,
          scaleX,
          scaleY,
          rotate,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          mixBlendMode: variant === "difference" ? "difference" : "normal" as any,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.45,
        }}
      >
        <AnimatePresence>
          {variant === "view" && (
            <motion.span
              key="view-label"
              className="custom-cursor-label"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{
                color: "#00f5ff",
                textShadow: "0 0 10px rgba(0, 245, 255, 0.6)",
              }}
            >
              VIEW
            </motion.span>
          )}
          {variant === "drag" && (
            <motion.span
              key="drag-label"
              className="custom-cursor-label"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{
                color: "#ff0080",
                textShadow: "0 0 10px rgba(255, 0, 128, 0.6)",
              }}
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
