/**
 * GlowBorder — Animated gradient border that sweeps around a container
 * Inspired by 21st.dev spotlight + radial-orbital-timeline
 * Creates a "everything is connected" futuristic feel
 */
import { type ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  color?: string;
  speed?: number;
  className?: string;
}

export function GlowBorder({
  children,
  color = "#fbbf24",
  speed = 4,
  className = "",
}: GlowBorderProps) {
  const id = `gb-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={`relative ${className}`}>
      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color}40, ${color}80, ${color}40, transparent)`,
            animation: `spinGlow${id} ${speed}s linear infinite`,
          }}
        />
      </div>
      {/* Background fill */}
      <div className="relative rounded-2xl bg-[#0a0a14]/95 backdrop-blur-sm">
        {children}
      </div>
      <style>{`
        @keyframes spinGlow${id} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * FloatingOrb — A decorative animated orb for section backgrounds
 */
interface FloatingOrbProps {
  color: string;
  size?: number;
  className?: string;
}

export function FloatingOrb({ color, size = 120, className = "" }: FloatingOrbProps) {
  const id = `fo-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <>
      <div
        className={`absolute rounded-full blur-[60px] opacity-[0.07] pointer-events-none ${className}`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          animation: `floatOrb${id} 8s ease-in-out infinite`,
        }}
      />
      <style>{`
        @keyframes floatOrb${id} {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10px, -15px) scale(1.1); }
          66% { transform: translate(-8px, 10px) scale(0.95); }
        }
      `}</style>
    </>
  );
}

/**
 * ShimmerLine — Animated loading/decorative shimmer line
 */
export function ShimmerLine({ color = "#fbbf24", width = "100%" }: { color?: string; width?: string }) {
  const id = `sl-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <>
      <div
        className="h-[1px] overflow-hidden rounded-full"
        style={{ width }}
      >
        <div
          className="h-full w-[200%]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color}00 20%, ${color}40 50%, ${color}00 80%, transparent 100%)`,
            animation: `shimmerLine${id} 3s ease-in-out infinite`,
          }}
        />
      </div>
      <style>{`
        @keyframes shimmerLine${id} {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </>
  );
}
