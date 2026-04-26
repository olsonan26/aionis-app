/**
 * Card Stack component — inspired by 21st.dev card-stack.
 * Stacked cards that fan out on interaction.
 */
import { useState } from "react";

interface CardStackProps {
  items: { id: string; content: React.ReactNode }[];
  className?: string;
}

export function CardStack({ items, className = "" }: CardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className={`relative h-[200px] w-full ${className}`} onClick={handleNext}>
      {items.map((item, i) => {
        const offset = ((i - activeIndex + items.length) % items.length);
        const isActive = offset === 0;
        const scale = 1 - offset * 0.04;
        const translateY = offset * -8;
        const opacity = Math.max(0, 1 - offset * 0.2);
        const zIndex = items.length - offset;

        return (
          <div
            key={item.id}
            className="absolute inset-0 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-500 ease-out cursor-pointer overflow-hidden"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: offset > 3 ? 0 : opacity,
              zIndex,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <div className={`p-4 h-full transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
              {item.content}
            </div>
          </div>
        );
      })}
      {/* Dots */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-4 bg-amber-400" : "w-1 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
