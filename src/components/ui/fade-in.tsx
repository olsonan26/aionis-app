import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}

export function FadeIn({ children, delay = 0, duration = 600, direction = "up", className = "", once = true }: FadeInProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, once]);

  const transforms = {
    up: "translate3d(0, 24px, 0)",
    down: "translate3d(0, -24px, 0)",
    left: "translate3d(24px, 0, 0)",
    right: "translate3d(-24px, 0, 0)",
    none: "translate3d(0, 0, 0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : transforms[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export function Stagger({ children, staggerDelay = 80, direction = "up", className = "" }: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <FadeIn key={i} delay={i * staggerDelay} direction={direction}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
