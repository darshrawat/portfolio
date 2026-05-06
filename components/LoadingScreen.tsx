"use client";
import React, { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Reduced from 1000
          }, 200); // Reduced from 500
          return 100;
        }
        return prev + 2; // Incremented faster
      });
    }, 10); // Sped up interval
    return () => clearInterval(interval);
  }, [onComplete]);


  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center p-8 pointer-events-auto transition-opacity duration-1000"
      style={{ opacity: percent === 100 ? 0 : 1 }}
    >
      <div className="w-full max-w-[300px] flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="technical-label text-[10px] opacity-80 uppercase">System_Initialize</span>
            <span className="technical-label text-[7px] opacity-20 uppercase">Core_V7_WebGL_Shader</span>
          </div>
          <span className="technical-label text-[12px] accent-glow">{percent}%</span>
        </div>

        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_10px_rgba(0,245,255,0.5)] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between">
          <div className="technical-label text-[6px] opacity-20 tracking-tighter">ALCHE // KERNEL_BOOT_042</div>
          <div className="technical-label text-[6px] opacity-20 tracking-tighter">DARSH_PORTFOLIO_STABLE</div>
        </div>
      </div>
    </div>
  );
}
