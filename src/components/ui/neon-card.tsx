/**
 * Neon Card — Glassmorphism card with animated neon border glow
 * Combines spotlight-card + neon border + glass effect
 */
import { useRef, useState, type ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  noBorder?: boolean;
  pulse?: boolean;
  intensity?: "low" | "medium" | "high";
}

export function NeonCard({
  children,
  className = "",
  glowColor = "rgba(251,191,36,0.15)",
  borderColor = "rgba(251,191,36,0.12)",
  noBorder = false,
  pulse = false,
  intensity = "medium",
}: NeonCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const intensityMap = { low: 0.4, medium: 0.7, high: 1 };
  const mult = intensityMap[intensity];

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: clientX - rect.left, y: clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        setActive(true);
      }}
      onTouchEnd={() => setActive(false)}
      className={`
        relative overflow-hidden rounded-2xl
        ${noBorder ? "" : "border border-white/[0.06]"}
        bg-white/[0.02] backdrop-blur-md
        ${pulse ? "neon-pulse" : ""}
        ${className}
      `}
      style={{
        boxShadow: `0 0 ${pulse ? "20px" : "0px"} ${glowColor.replace("0.15", "0.05")}`,
      }}
    >
      {/* Spotlight glow following touch/mouse */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: active ? mult : 0,
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Animated border glow */}
      {!noBorder && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${borderColor}, transparent 50%, ${borderColor.replace("0.12", "0.06")})`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style>{`
        .neon-pulse {
          animation: neonPulse 3s ease-in-out infinite;
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 10px ${glowColor.replace("0.15", "0.03")}; }
          50% { box-shadow: 0 0 25px ${glowColor.replace("0.15", "0.08")}, 0 0 50px ${glowColor.replace("0.15", "0.03")}; }
        }
      `}</style>
    </div>
  );
}

/**
 * Glowing number badge — for displaying numerology numbers with flair
 */
export function GlowNumber({
  number,
  label,
  color = "#fbbf24",
  size = "md",
  compound,
  onClick,
}: {
  number: number | string;
  label?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  compound?: string;
  onClick?: () => void;
}) {
  const sizes = {
    sm: { box: "h-10 w-10", text: "text-sm", label: "text-[9px]" },
    md: { box: "h-14 w-14", text: "text-xl", label: "text-[10px]" },
    lg: { box: "h-20 w-20", text: "text-3xl", label: "text-xs" },
  };
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`${s.box} flex items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-active:scale-95`}
        style={{
          borderColor: `${color}22`,
          background: `linear-gradient(135deg, ${color}08, ${color}03)`,
          boxShadow: `0 0 15px ${color}10, inset 0 0 15px ${color}05`,
        }}
      >
        <span
          className={`font-display font-bold ${s.text}`}
          style={{
            color,
            textShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
          }}
        >
          {compound || number}
        </span>
      </div>
      {label && (
        <span className={`${s.label} text-white/40 text-center leading-tight max-w-[60px]`}>
          {label}
        </span>
      )}
    </button>
  );
}

/**
 * Animated divider with glow
 */
export function GlowDivider({ color = "#fbbf24", className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`relative h-px w-full my-6 ${className}`}>
      <div className="absolute inset-0 bg-white/[0.04]" />
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/3"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
          boxShadow: `0 0 20px ${color}10`,
        }}
      />
    </div>
  );
}
