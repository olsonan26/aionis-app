/**
 * Background Paths — Animated flowing SVG lines
 * Inspired by 21st.dev background-paths
 * Creates subtle, flowing geometric paths behind content
 */
import { useEffect, useRef } from "react";

interface BackgroundPathsProps {
  className?: string;
  opacity?: number;
  color?: string;
  pathCount?: number;
}

export function BackgroundPaths({ 
  className = "",
  opacity = 0.04,
  color = "rgba(251,191,36,VAR)",
  pathCount = 6,
}: BackgroundPathsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;
    
    const animate = () => {
      t += 0.002;
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll<SVGPathElement>("path[data-flow]");
        paths.forEach((path, i) => {
          const offset = i * 100 + Math.sin(t + i * 0.5) * 50;
          path.style.strokeDashoffset = `${offset}`;
          // Subtle opacity pulsing
          const pulseOpacity = 0.3 + Math.sin(t * 0.5 + i * 0.8) * 0.2;
          path.style.opacity = `${pulseOpacity}`;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Generate flowing bezier curves
  const generatePath = (seed: number, height: number) => {
    const y = (height / (pathCount + 1)) * (seed + 1);
    const variance = height * 0.15;
    const cp1y = y + Math.sin(seed * 1.5) * variance;
    const cp2y = y - Math.cos(seed * 2.3) * variance;
    return `M -50 ${y} C 150 ${cp1y}, 250 ${cp2y}, 450 ${y + Math.sin(seed * 0.7) * 30}`;
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {Array.from({ length: pathCount }).map((_, i) => (
          <path
            key={i}
            data-flow
            d={generatePath(i, 800)}
            fill="none"
            stroke={color.replace("VAR", "1")}
            strokeWidth={0.5 + i * 0.1}
            strokeDasharray="8 12"
            strokeLinecap="round"
          />
        ))}
        {/* Accent circles at intersections */}
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={`c${i}`}
            cx={100 + i * 120}
            cy={200 + i * 180}
            r={1.5}
            fill={color.replace("VAR", "0.6")}
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1;2.5;1"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

/**
 * Floating particles that drift upward — adds life to sections
 */
export function FloatingParticles({ count = 15, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 2;
        const left = 5 + Math.random() * 90;
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 12;
        const colors = ["#fbbf24", "#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-5%",
              backgroundColor: color,
              opacity: 0.15 + Math.random() * 0.15,
              animation: `particleRise ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes particleRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-120vh) translateX(${Math.random() > 0.5 ? '' : '-'}40px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
