"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function TransitionOverlay() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.data && e.data.type === 'scroll') {
        const s = e.data.value;
        const active = s >= 0.49 && s <= 0.61;
        if (active) {
          setScroll(s);
        } else if (scroll !== 0 && (s < 0.49 || s > 0.61)) {
          // ensure it resets to 0 when completely out of bounds so it doesn't hold old active state
          setScroll(0);
        }
      }
    };
    window.addEventListener('message', handleScroll);
    return () => window.removeEventListener('message', handleScroll);
  }, [scroll]);

  // Active only during the transition window (0.50 to 0.60)
  const isVisible = scroll >= 0.49 && scroll <= 0.61;
  const localT = Math.max(0, Math.min(1, (scroll - 0.50) / 0.10));

  // Divide localT into:
  // - Inward Transition: 0.0 -> 0.45 (panels close)
  // - Locked / Laser sweep / Telemetry active: 0.45 -> 0.55
  // - Outward Transition: 0.55 -> 1.0 (panels open)

  const p1T_in = Math.max(0, Math.min(1, localT / 0.45));
  const p1T_out = Math.max(0, Math.min(1, (localT - 0.55) / 0.45));

  const p2T_in = Math.max(0, Math.min(1, (localT - 0.04) / 0.41));
  const p2T_out = Math.max(0, Math.min(1, (localT - 0.55) / 0.41));

  const p3T_in = Math.max(0, Math.min(1, (localT - 0.08) / 0.37));
  const p3T_out = Math.max(0, Math.min(1, (localT - 0.55) / 0.37));

  const p4T_in = Math.max(0, Math.min(1, (localT - 0.12) / 0.33));
  const p4T_out = Math.max(0, Math.min(1, (localT - 0.55) / 0.33));

  // Cubic Bezier easeInOut curve for cinematic inertia
  const easeInOutCubic = (x: number) => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  const p1Width = easeInOutCubic(p1T_in) * 100;
  const p1Left = easeInOutCubic(p1T_out) * 100;

  const p2Width = easeInOutCubic(p2T_in) * 100;
  const p2Right = easeInOutCubic(p2T_out) * 100;

  const p3Width = easeInOutCubic(p3T_in) * 100;
  const p3Left = easeInOutCubic(p3T_out) * 100;

  const p4Width = easeInOutCubic(p4T_in) * 100;
  const p4Right = easeInOutCubic(p4T_out) * 100;

  // The telemetry HUD opacity peaks perfectly at 0.50
  const hudOpacity = Math.max(0, 1 - Math.abs(localT - 0.5) * 5.0);

  // Laser scanner Y coordinate (0% to 100%) during the middle phase
  const laserProgress = Math.max(0, Math.min(1, (localT - 0.40) / 0.20));
  const laserY = laserProgress * 100;

  // Cybernetic neon strobe/flash effect
  const strobeOpacity = Math.pow(Math.max(0, 1 - Math.abs(localT - 0.5) * 8), 3) * 0.15;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[85]" style={{ overflow: "hidden" }}>
      
      {/* CYBERNETIC NEON STROBE FLASH */}
      <div 
        className="absolute inset-0 bg-[#00f5ff] mix-blend-screen z-[88]"
        style={{ opacity: strobeOpacity }}
      />

      {/* PANEL 1: Top Quarter (Slides left to right) */}
      <div 
        className="absolute bg-[#030406]/98 border-b border-accent/15 backdrop-blur-xl"
        style={{
          top: 0,
          left: `${p1Left}%`,
          width: `${p1Width}%`,
          height: "25.5vh", // slight overlap to prevent thin blank gaps
        }}
      >
        <div className="absolute bottom-1 left-8 font-mono text-[8px] text-white/5 tracking-[0.2em]">SEG_01_INIT_SEQUENCE</div>
      </div>

      {/* PANEL 2: Second Quarter (Slides right to left) */}
      <div 
        className="absolute bg-[#030406]/98 border-b border-accent/15 backdrop-blur-xl"
        style={{
          top: "25vh",
          right: `${p2Right}%`,
          width: `${p2Width}%`,
          height: "25.5vh",
        }}
      >
        <div className="absolute bottom-1 right-8 font-mono text-[8px] text-white/5 tracking-[0.2em]">SEG_02_SYSTEM_ALLOCATION</div>
      </div>

      {/* PANEL 3: Third Quarter (Slides left to right) */}
      <div 
        className="absolute bg-[#030406]/98 border-b border-accent/15 backdrop-blur-xl"
        style={{
          top: "50vh",
          left: `${p3Left}%`,
          width: `${p3Width}%`,
          height: "25.5vh",
        }}
      >
        <div className="absolute bottom-1 left-8 font-mono text-[8px] text-white/5 tracking-[0.2em]">SEG_03_COMPILING_TIMELINE</div>
      </div>

      {/* PANEL 4: Bottom Quarter (Slides right to left) */}
      <div 
        className="absolute bg-[#030406]/98 backdrop-blur-xl"
        style={{
          top: "75vh",
          right: `${p4Right}%`,
          width: `${p4Width}%`,
          height: "25.5vh",
        }}
      >
        <div className="absolute top-2 right-8 font-mono text-[8px] text-white/5 tracking-[0.2em]">SEG_04_ESTABLISHING_FEED</div>
      </div>

      {/* GLOWING CYAN SCANNER LASER BEAM */}
      {localT > 0.38 && localT < 0.62 && (
        <div 
          className="absolute left-0 right-0 h-[2px] bg-accent z-[89]"
          style={{
            top: `${laserY}%`,
            boxShadow: "0 0 15px #00f5ff, 0 0 30px rgba(0, 245, 255, 0.7), 0 0 50px rgba(0, 245, 255, 0.4)",
            opacity: Math.sin(laserProgress * Math.PI),
          }}
        />
      )}

      {/* CENTRAL DIGITAL TELEMETRY OVERLAY */}
      <div 
        className="absolute inset-0 flex flex-col justify-center items-center z-[90] pointer-events-none"
        style={{ opacity: hudOpacity }}
      >
        {/* Glowing holographic reticle */}
        <div className="relative w-48 h-48 flex justify-center items-center mb-8">
          <div className="absolute inset-0 border border-accent/10 rounded-full animate-[spin_16s_linear_infinite]" />
          <div className="absolute inset-3 border border-dashed border-accent/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-8 border border-accent/60 rounded-full flex justify-center items-center">
            <span className="font-mono text-accent text-xs font-bold tracking-[0.25em] animate-pulse">PHASE_04</span>
          </div>
          
          {/* Neon Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/70" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/70" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent/70" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent/70" />
        </div>

        {/* Cinematic telemetry data readouts */}
        <div className="text-center font-mono space-y-2 px-6 max-w-[320px]">
          <div className="text-accent text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
            SYSTEM_UPGRADE_INITIATED
          </div>
          <div className="w-full h-[1px] bg-accent/20" />
          <div className="text-white/60 text-[9px] tracking-widest leading-relaxed">
            COMPILING HISTORICAL RECORDS...
            <br />
            MEM_SECTOR_04_EXP // SYNC_OK
          </div>
          <div className="text-white/20 text-[8px] tracking-wider uppercase">
            PROTOCOL_V9.0_ACTIVE
          </div>
        </div>
      </div>

    </div>
  );
}
