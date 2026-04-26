import { useRef, useState, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlow?: boolean;
  hoverScale?: boolean;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(251, 191, 36, 0.08)",
  borderGlow = false,
  hoverScale = false,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (clientX: number, clientY: number) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: clientX - rect.left, y: clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        setOpacity(1);
      }}
      onTouchEnd={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.10] hover:bg-white/[0.03] ${
        hoverScale ? "hover:scale-[1.01] active:scale-[0.98]" : ""
      } ${className}`}
    >
      {/* Primary spotlight — larger, softer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Secondary intense glow — smaller, brighter */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-500"
        style={{
          opacity: opacity * 0.6,
          background: `radial-gradient(250px circle at ${position.x}px ${position.y}px, ${spotlightColor.replace(/[\d.]+\)$/, "0.2)")}, transparent 40%)`,
        }}
      />
      {/* Border glow effect */}
      {borderGlow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            opacity: opacity * 0.5,
            boxShadow: `inset 0 0 20px ${spotlightColor}`,
          }}
        />
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
