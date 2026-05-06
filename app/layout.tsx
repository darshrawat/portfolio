"use client";

import React, { useEffect, useState } from "react";
import { Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
import LoadingScreen from "@/components/LoadingScreen";
import AuraBackground from "@/components/AuraBackground";
import CustomCursor from "@/components/CustomCursor";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [quat, setQuat] = useState({ x: 0, y: 0, z: 0, w: 1 });
  const [velocity, setVelocity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'telemetry') {
        setQuat(e.data.data);
        if (e.data.velocity !== undefined) setVelocity(e.data.velocity);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <html lang="en" className={`${bodoni.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: "black", margin: 0, color: "white", overflowX: "hidden" }}>
        
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

        <CustomCursor />

        <div className="grain-overlay" />
        <AuraBackground />

        {/* NATIVE REACT 3D ENGINE */}
        <div className="scene-wrapper" style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 0, 
          opacity: isLoading ? 0 : 1, 
          transition: 'opacity 1s ease-in'
        }}>
          <Scene />
        </div>

        {/* ALCHE CORE HUD */}
        <div className="alche-hud fixed inset-0 z-[100] pointer-events-none p-6 flex flex-col justify-between overflow-hidden">
          <header className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-accent" />
                <div className="technical-label opacity-80 uppercase tracking-[0.3em] text-[9px] font-bold">Alche // Darsh_Core_V9.0</div>
              </div>
            </div>
            <div className="flex gap-8 items-start">
               <div className="technical-label text-[8px] opacity-40 uppercase">
                  X: {quat.x.toFixed(2)} | Y: {quat.y.toFixed(2)} | Z: {quat.z.toFixed(2)}
               </div>
            </div>
          </header>

          <footer className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="technical-label text-[7px] opacity-40 uppercase tracking-widest">Material_Render_Data</div>
              <div className="flex items-center gap-4">
                 <div className="w-24 h-[1px] bg-accent/20 relative">
                    <div className="absolute inset-0 bg-accent w-[85%]" />
                 </div>
                 <span className="technical-label text-[6px] opacity-20">0.85_REFRACTION</span>
              </div>
            </div>
          </footer >
        </div>

        <main style={{ position: "relative", zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
