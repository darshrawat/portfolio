"use client";
import React from "react";
import * as THREE from "three";

const SKILLS_CATEGORIES = [
  {
    title: "Development",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Python"]
  },
  {
    title: "3D & Creative",
    skills: ["Three.js", "WebGL", "GLSL", "Blender", "Unreal Engine"]
  },
  {
    title: "Design",
    skills: ["Figma", "UI/UX", "Motion Design", "Branding"]
  }
];

export default function SkillsSection({ scroll }: { scroll: number }) {
  const opacity = THREE.MathUtils.smoothstep(scroll, 0.7, 0.8) * (1 - THREE.MathUtils.smoothstep(scroll, 0.95, 1.0));
  
  const activeSkillIdx = scroll > 0.88 ? 2 : scroll > 0.82 ? 1 : 0;
  const skillsList = ["FIGMA", "ILLUSTRATOR", "ANTIGRAVITY"];

  return (
    <section 
      className="skills-section"
      style={{ opacity, pointerEvents: opacity > 0.1 ? "auto" : "none" }}
    >
      <div className="gradient-window active" style={{ opacity: opacity * 0.6 }} />
      
      <div className="skills-hud">
        <div className="hud-crosshair" />
        
        <div style={{ position: 'absolute', top: '100px', left: '100px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="telemetry-label">Status: Skill_Sync_Active</span>
          <span className="telemetry-label">Phase: 03_Creative_Engine</span>
          <div style={{ width: '100px', height: '1px', background: 'var(--accent)', opacity: 0.3, marginTop: '8px' }} />
        </div>

        <div style={{ position: 'absolute', bottom: '100px', right: '100px', textAlign: 'right' }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>CAPABILITIES_MANIFEST</div>
          <div className="category-title" style={{ fontSize: '48px', color: '#fff', marginBottom: '0' }}>{skillsList[activeSkillIdx]}</div>
          <p className="hero-bio" style={{ maxWidth: '300px', marginTop: '12px' }}>
            Transforming complex ideas into 
            high-fidelity 3D assets and 
            cinematic interaction models.
          </p>
        </div>

        <div style={{ position: 'absolute', left: '100px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {skillsList.map((skill, i) => (
            <div key={skill} style={{ opacity: activeSkillIdx === i ? 1 : 0.2, transition: 'opacity 0.5s' }}>
              <div className="telemetry-label" style={{ marginBottom: '4px' }}>0{i+1} /</div>
              <h3 className="category-title" style={{ fontSize: '24px', color: '#fff', margin: 0 }}>{skill}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
