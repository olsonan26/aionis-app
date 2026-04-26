/**
 * Container Scroll Animation — inspired by 21st.dev container-scroll.
 * Elements animate/scale as user scrolls them into view.
 */
import { useRef, useEffect, useState, type ReactNode } from "react";

interface ContainerScrollProps {
  children: ReactNode;
  className?: string;
}

export function ContainerScroll({ children, className = "" }: ContainerScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            setProgress(ratio);
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = 0.85 + progress * 0.15;
  const opacity = 0.3 + progress * 0.7;
  const translateY = (1 - progress) * 30;

  return (
    <div
      ref={ref}
      className={`transition-none ${className}`}
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
