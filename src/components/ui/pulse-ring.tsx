/**
 * Pulse Ring — Enhanced number display with animated concentric pulse rings
 * Creates a futuristic "radar" feel around important numbers
 */

interface PulseRingProps {
  number: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  compound?: string;
}

export function PulseRing({ number, color = "#f59e0b", size = "md", label, compound }: PulseRingProps) {
  const sizeMap = { sm: 44, md: 68, lg: 92 };
  const s = sizeMap[size];
  const fontSize = size === "sm" ? "text-base" : size === "md" ? "text-2xl" : "text-4xl";
  const id = `pr-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s * 1.5, height: s * 1.5 }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: s * 1.2,
          height: s * 1.2,
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
        }}
      />

      {/* Pulse rings with custom animation */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s + i * 18,
            height: s + i * 18,
            border: `1px solid ${color}`,
            opacity: 0,
            animation: `pulseRing${id} ${2 + i * 0.7}s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.5}s infinite`,
          }}
        />
      ))}

      {/* Static ring with gradient */}
      <div
        className="absolute rounded-full"
        style={{
          width: s,
          height: s,
          border: `1.5px solid ${color}30`,
          boxShadow: `0 0 15px ${color}0a, 0 0 30px ${color}05, inset 0 0 15px ${color}05`,
        }}
      />

      {/* Inner subtle ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: s - 10,
          height: s - 10,
          border: `0.5px solid ${color}15`,
        }}
      />

      {/* Number + label */}
      <div className="relative flex flex-col items-center">
        <span
          className={`font-bold ${fontSize}`}
          style={{
            color,
            fontFamily: "'Playfair Display', Georgia, serif",
            textShadow: `0 0 15px ${color}40`,
          }}
        >
          {number}
        </span>
        {compound && (
          <span className="text-[8px] text-white/25 -mt-0.5">{compound}</span>
        )}
        {label && (
          <span className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: color + "60" }}>
            {label}
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulseRing${id} {
          0% { opacity: 0.12; transform: scale(1); }
          70% { opacity: 0; }
          100% { opacity: 0; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
