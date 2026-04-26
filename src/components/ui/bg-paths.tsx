/**
 * Background Paths — Flowing animated lines inspired by 21st.dev background-paths
 * Subtle decoration for section backgrounds
 */
export function BgPaths({ color = "#fbbf24", count = 5, className = "" }: { color?: string; count?: number; className?: string }) {
  const id = `bp-${Math.random().toString(36).slice(2, 8)}`;
  const paths = Array.from({ length: count }).map((_, i) => {
    const y = 20 + (i * 60) / count;
    const amp = 8 + Math.random() * 12;
    const freq = 0.8 + Math.random() * 0.4;
    const phase = i * 1.2;
    // Create a smooth sine-wave path
    const pts: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      const py = y + Math.sin((x * freq * Math.PI) / 50 + phase) * amp;
      pts.push(`${x},${py}`);
    }
    return `M${pts.join(" L")}`;
  });

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="0.15"
            opacity={0.06 + i * 0.02}
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{
              animation: `drawPath${id} ${6 + i * 0.5}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes drawPath${id} {
          0% { stroke-dashoffset: 200; opacity: 0.02; }
          50% { stroke-dashoffset: 0; opacity: 0.08; }
          100% { stroke-dashoffset: -200; opacity: 0.02; }
        }
      `}</style>
    </div>
  );
}
