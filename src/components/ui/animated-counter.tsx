import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ value, duration = 1200, className = "", suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;
    
    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

interface NumberRevealProps {
  number: number;
  compound?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

export function NumberReveal({ number, compound, size = "lg", color = "text-amber-400", className = "" }: NumberRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const sizes = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-18 h-18 text-4xl",
    xl: "w-24 h-24 text-5xl",
  };

  return (
    <div ref={ref} className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`${sizes[size]} ${color} flex items-center justify-center rounded-full border border-current/20 bg-current/5 font-display font-bold transition-all duration-700 ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {visible ? <AnimatedCounter value={number} duration={800} /> : 0}
      </div>
      {compound && (
        <span className={`text-xs text-white/40 transition-opacity duration-500 delay-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          {compound}
        </span>
      )}
    </div>
  );
}
