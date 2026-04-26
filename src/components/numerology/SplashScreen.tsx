import { useEffect, useState } from "react";
import { GradientText } from "@/components/ui/glow-text";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => onComplete(), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-[100px] transition-all duration-[2000ms]"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
            transform: phase >= 1 ? "scale(1.5)" : "scale(0.3)",
            opacity: phase >= 1 ? 1 : 0,
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full blur-[80px] transition-all duration-[2000ms] delay-300"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            transform: phase >= 1 ? "scale(1.3)" : "scale(0.3)",
            opacity: phase >= 1 ? 1 : 0,
          }}
        />
      </div>

      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-amber-400/30"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: phase >= 1 ? 1 : 0,
              transition: "opacity 1s",
            }}
          />
        ))}
      </div>

      {/* Logo / Symbol */}
      <div
        className="relative mb-8 transition-all duration-1000"
        style={{
          transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.5) translateY(20px)",
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        {/* Outer ring */}
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="0.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/10 to-amber-400/5 border border-amber-400/20">
              <span className="font-display text-2xl font-bold text-amber-400" style={{
                textShadow: "0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.3)",
              }}>
                A
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        className="text-center transition-all duration-700"
        style={{
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          opacity: phase >= 2 ? 1 : 0,
        }}
      >
        <h1 className="font-display text-4xl font-bold tracking-tight">
          <GradientText>AIONIS</GradientText>
        </h1>
      </div>

      {/* Tagline */}
      <div
        className="mt-3 text-center transition-all duration-700 delay-200"
        style={{
          transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
          opacity: phase >= 3 ? 1 : 0,
        }}
      >
        <p className="text-sm text-white/40 tracking-wider">
          Know Your Numbers. Own Your Path.
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="mt-8 h-0.5 w-32 overflow-hidden rounded-full bg-white/[0.05] transition-opacity duration-500"
        style={{ opacity: phase >= 2 ? 1 : 0 }}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-[1500ms] ease-out"
          style={{ width: phase >= 3 ? "100%" : phase >= 2 ? "60%" : "0%" }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}
