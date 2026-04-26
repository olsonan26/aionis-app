import { useRef, useState, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({ children, className = "", spotlightColor = "rgba(251, 191, 36, 0.08)" }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!divRef.current || !e.touches[0]) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
    setOpacity(1);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(251, 191, 36, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
