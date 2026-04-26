/**
 * Animated shader-like background with moving gradient orbs.
 * Inspired by 21st.dev animated-shader-background.
 */
import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.003;
      if (ref.current) {
        const el = ref.current;
        const orbs = el.querySelectorAll<HTMLDivElement>("[data-orb]");
        orbs.forEach((orb, i) => {
          const speed = 0.5 + i * 0.3;
          const radius = 15 + i * 8;
          const x = 50 + Math.sin(t * speed + i * 1.2) * radius;
          const y = 50 + Math.cos(t * speed * 0.7 + i * 0.9) * radius;
          orb.style.left = `${x}%`;
          orb.style.top = `${y}%`;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary amber orb */}
      <div
        data-orb
        className="absolute h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03] blur-[120px]"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
      />
      {/* Purple orb */}
      <div
        data-orb
        className="absolute h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.025] blur-[100px]"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
      />
      {/* Cyan orb */}
      <div
        data-orb
        className="absolute h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02] blur-[80px]"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
      />
      {/* Rose orb */}
      <div
        data-orb
        className="absolute h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.015] blur-[90px]"
        style={{ background: "radial-gradient(circle, #f43f5e, transparent 70%)" }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
