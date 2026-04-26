/**
 * Animated Background — Premium dark gradient mesh with flowing orbs
 * This is the global background for the entire app
 * Enhanced with WebGL-inspired effects, particle field, and grid overlay
 */
import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.002;
      if (ref.current) {
        const orbs = ref.current.querySelectorAll<HTMLDivElement>("[data-orb]");
        orbs.forEach((orb, i) => {
          const speed = 0.3 + i * 0.2;
          const radius = 12 + i * 6;
          const x = 50 + Math.sin(t * speed + i * 1.5) * radius;
          const y = 50 + Math.cos(t * speed * 0.6 + i * 1.1) * radius;
          orb.style.left = `${x}%`;
          orb.style.top = `${y}%`;
          // Subtle size pulse
          const scale = 1 + Math.sin(t * 0.5 + i * 0.7) * 0.1;
          orb.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });

        // Animate particles
        const particles = ref.current.querySelectorAll<HTMLDivElement>("[data-particle]");
        particles.forEach((p, i) => {
          const py = parseFloat(p.dataset.baseY || "50");
          const px = parseFloat(p.dataset.baseX || "50");
          const newY = py + Math.sin(t * 0.5 + i * 0.3) * 5;
          const newX = px + Math.cos(t * 0.4 + i * 0.5) * 3;
          p.style.top = `${newY}%`;
          p.style.left = `${newX}%`;
          p.style.opacity = `${0.15 + Math.sin(t + i) * 0.1}`;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060c] via-[#0a0a14] to-[#08081a]" />

      {/* Primary amber orb */}
      <div
        data-orb
        className="absolute h-[450px] w-[450px] rounded-full opacity-[0.04] blur-[140px]"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 65%)" }}
      />
      {/* Purple orb */}
      <div
        data-orb
        className="absolute h-[380px] w-[380px] rounded-full opacity-[0.035] blur-[120px]"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 65%)" }}
      />
      {/* Cyan orb */}
      <div
        data-orb
        className="absolute h-[300px] w-[300px] rounded-full opacity-[0.025] blur-[100px]"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent 65%)" }}
      />
      {/* Rose orb */}
      <div
        data-orb
        className="absolute h-[250px] w-[250px] rounded-full opacity-[0.02] blur-[100px]"
        style={{ background: "radial-gradient(circle, #f43f5e, transparent 65%)" }}
      />
      {/* Emerald accent */}
      <div
        data-orb
        className="absolute h-[200px] w-[200px] rounded-full opacity-[0.015] blur-[80px]"
        style={{ background: "radial-gradient(circle, #10b981, transparent 65%)" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const baseX = 10 + Math.random() * 80;
        const baseY = 10 + Math.random() * 80;
        const size = 1 + Math.random() * 2;
        const colors = ["#fbbf24", "#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"];
        return (
          <div
            key={i}
            data-particle
            data-base-x={baseX}
            data-base-y={baseY}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${baseX}%`,
              top: `${baseY}%`,
              backgroundColor: colors[i % colors.length],
              opacity: 0.15,
            }}
          />
        );
      })}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(4,4,10,0.4) 100%)",
        }}
      />
    </div>
  );
}
