/**
 * SplashScreen — Premium animated loading experience
 * Features: WebGL shader bg, golden spiral animation, typewriter text, particle field
 * Inspired by 21st.dev spiral-animation + animated-shader-hero
 */
import { useEffect, useState, useRef } from "react";
import { GradientText } from "@/components/ui/glow-text";

interface SplashScreenProps {
  onComplete: () => void;
}

/* ─── Golden Spiral Canvas ─── */
function GoldenSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let frame: number;
    let t = 0;

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Draw Fibonacci spiral
      const PHI = 1.618033988749;
      const maxAngle = 6 * Math.PI;
      const points = 300;

      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const progress = i / points;
        const angle = progress * maxAngle + t * 0.5;
        const r = 3 * Math.pow(PHI, (angle / (2 * Math.PI)) * 0.8);

        if (r > size * 0.45) break;

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Animated gradient stroke
      const grad = ctx.createLinearGradient(0, 0, size, size);
      const shift = (Math.sin(t) + 1) / 2;
      grad.addColorStop(0, `rgba(251, 191, 36, ${0.6 + shift * 0.3})`);
      grad.addColorStop(0.4, `rgba(139, 92, 246, ${0.4 + shift * 0.2})`);
      grad.addColorStop(0.7, `rgba(6, 182, 212, ${0.3 + shift * 0.2})`);
      grad.addColorStop(1, `rgba(251, 191, 36, ${0.1})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Orbiting dots on the spiral
      for (let d = 0; d < 5; d++) {
        const dotProgress = ((t * 0.3 + d * 0.2) % 1);
        const dotAngle = dotProgress * maxAngle;
        const dotR = 3 * Math.pow(PHI, (dotAngle / (2 * Math.PI)) * 0.8);

        if (dotR < size * 0.45) {
          const dx = cx + dotR * Math.cos(dotAngle + t * 0.5);
          const dy = cy + dotR * Math.sin(dotAngle + t * 0.5);
          const dotSize = 2 + Math.sin(t * 2 + d) * 1;

          ctx.beginPath();
          ctx.arc(dx, dy, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${0.6 - d * 0.1})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(dx, dy, dotSize * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(dx, dy, 0, dx, dy, dotSize * 3);
          glow.addColorStop(0, `rgba(251, 191, 36, 0.3)`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      // Sacred geometry: concentric circles
      for (let c = 0; c < 3; c++) {
        const cr = 40 + c * 30;
        const rotateAlpha = 0.03 + Math.sin(t + c * 0.5) * 0.02;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${rotateAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="relative z-10" />;
}

/* ─── Particle Field ─── */
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.3,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4",
            opacity: p.opacity,
            animation: `splashParticle ${6 / p.speed}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes splashParticle {
          0%, 100% { transform: translate(0, 0); opacity: var(--p-opacity, 0.2); }
          25% { transform: translate(${Math.random() > 0.5 ? '' : '-'}15px, -20px); }
          50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}10px, 10px); opacity: calc(var(--p-opacity, 0.2) * 1.5); }
          75% { transform: translate(15px, -10px); }
        }
      `}</style>
    </div>
  );
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);
  const [typeText, setTypeText] = useState("");
  const fullText = "Know Your Numbers. Own Your Path.";

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => onComplete(), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Typewriter effect
  useEffect(() => {
    if (phase < 3) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypeText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#04040a]" />

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[150px]"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent 60%)" }}
          />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px]"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }}
          />
          <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] blur-[100px]"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent 60%)" }}
          />
        </div>
      </div>

      {/* Particle field */}
      <ParticleField />

      {/* Golden Spiral */}
      <div
        className="relative z-10 mb-6 transition-all duration-[1500ms]"
        style={{
          transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.3) rotate(-90deg)",
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        <GoldenSpiral />

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-1000"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.1), rgba(251,191,36,0.02))",
              border: "1px solid rgba(251,191,36,0.15)",
              boxShadow: "0 0 40px rgba(251,191,36,0.1), inset 0 0 30px rgba(251,191,36,0.05)",
              transform: phase >= 2 ? "scale(1)" : "scale(0.5)",
              opacity: phase >= 2 ? 1 : 0,
            }}
          >
            <span
              className="font-serif text-3xl font-bold text-amber-400"
              style={{
                textShadow: "0 0 30px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3)",
              }}
            >
              A
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        className="relative z-10 text-center transition-all duration-700"
        style={{
          transform: phase >= 2 ? "translateY(0)" : "translateY(15px)",
          opacity: phase >= 2 ? 1 : 0,
        }}
      >
        <h1 className="font-serif text-5xl font-bold tracking-tight">
          <GradientText>AIONIS</GradientText>
        </h1>
      </div>

      {/* Typewriter tagline */}
      <div
        className="relative z-10 mt-4 h-6 text-center transition-opacity duration-500"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        <p className="text-sm tracking-[0.2em] text-white/40">
          {typeText}
          {typeText.length < fullText.length && (
            <span className="animate-pulse text-amber-400/80">|</span>
          )}
        </p>
      </div>

      {/* Loading progress */}
      <div
        className="relative z-10 mt-10 transition-opacity duration-500"
        style={{ opacity: phase >= 2 ? 1 : 0 }}
      >
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className="h-full rounded-full transition-all duration-[2000ms] ease-out"
            style={{
              width: phase >= 4 ? "100%" : phase >= 3 ? "70%" : phase >= 2 ? "30%" : "0%",
              background: "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)",
              boxShadow: "0 0 10px rgba(251,191,36,0.5)",
            }}
          />
        </div>
      </div>

      {/* Fade out overlay */}
      <div
        className="absolute inset-0 z-20 bg-[#0a0a0f] pointer-events-none transition-opacity duration-500"
        style={{ opacity: phase >= 4 ? 1 : 0 }}
      />

      <style>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
    </div>
  );
}
