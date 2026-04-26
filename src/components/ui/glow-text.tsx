import type { ReactNode } from "react";

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function GlowText({ children, className = "", color = "text-amber-400", style }: GlowTextProps) {
  return (
    <span className={`${color} ${className}`} style={{
      textShadow: "0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2), 0 0 80px rgba(251, 191, 36, 0.1)",
      ...style,
    }}>
      {children}
    </span>
  );
}

interface PulseGlowProps {
  children: ReactNode;
  className?: string;
}

export function PulseGlow({ children, className = "" }: PulseGlowProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 animate-pulse rounded-full bg-amber-400/20 blur-xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  animated?: boolean;
}

export function GradientText({ children, className = "", from = "from-amber-300", to = "to-orange-500", animated = false }: GradientTextProps) {
  if (animated) {
    return (
      <span className={`animate-gradient-text bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: "linear-gradient(90deg, #fbbf24, #f97316, #fbbf24, #a78bfa, #fbbf24)",
          backgroundSize: "300% 100%",
          animation: "gradientShift 6s ease-in-out infinite",
        }}
      >
        {children}
        <style>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </span>
    );
  }
  return (
    <span className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

/**
 * Shimmer text — text with a shimmering light sweep effect
 */
export function ShimmerText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent"
        style={{
          backgroundSize: "200% 100%",
          animation: "shimmerText 3s ease-in-out infinite",
        }}
      >
        {children}
      </span>
      <style>{`
        @keyframes shimmerText {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </span>
  );
}
