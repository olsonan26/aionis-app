/**
 * Pulse Ring — a number with animated concentric pulse rings.
 * Creates a futuristic "radar" feel around important numbers.
 */

interface PulseRingProps {
  number: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function PulseRing({ number, color = "#f59e0b", size = "md", label }: PulseRingProps) {
  const sizeMap = { sm: 48, md: 72, lg: 96 };
  const s = sizeMap[size];
  const fontSize = size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s * 1.6, height: s * 1.6 }}>
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full animate-ping"
          style={{
            width: s + i * 20,
            height: s + i * 20,
            border: `1px solid ${color}`,
            opacity: 0.1 - i * 0.025,
            animationDuration: `${2 + i * 0.8}s`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {/* Static ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: s,
          height: s,
          border: `1.5px solid ${color}40`,
          boxShadow: `0 0 20px ${color}10, inset 0 0 20px ${color}08`,
        }}
      />
      {/* Number */}
      <div className="relative flex flex-col items-center">
        <span className={`font-display font-bold ${fontSize}`} style={{ color }}>
          {number}
        </span>
        {label && (
          <span className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: color + "80" }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
