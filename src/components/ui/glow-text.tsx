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
}

export function GradientText({ children, className = "", from = "from-amber-300", to = "to-orange-500" }: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
