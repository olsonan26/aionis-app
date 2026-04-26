import { useMemo, useState, useRef, useEffect } from "react";
import { reduceToSingle, calculatePersonalYear, calculateDailyEssence } from "@/lib/numerology";

interface WaveformProps {
  name: string;
  day: number;
  month: number;
  year: number;
}

const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const VOWELS = "AEIOU";

function nameToNumber(n: string) {
  let s = 0; for (const c of n.toUpperCase()) if (LETTER_VALUES[c]) s += LETTER_VALUES[c]; return reduceToSingle(s);
}
function vowelNumber(n: string) {
  let s = 0; for (const c of n.toUpperCase()) if (VOWELS.includes(c) && LETTER_VALUES[c]) s += LETTER_VALUES[c]; return reduceToSingle(s);
}
function consonantNumber(n: string) {
  let s = 0; for (const c of n.toUpperCase()) if (!VOWELS.includes(c) && LETTER_VALUES[c]) s += LETTER_VALUES[c]; return reduceToSingle(s);
}

const NUM_COLORS: Record<number, string> = {
  1: "#f59e0b", 2: "#a78bfa", 3: "#34d399", 4: "#60a5fa",
  5: "#f472b6", 6: "#fb923c", 7: "#818cf8", 8: "#fbbf24", 9: "#e879f9",
};

export default function EnergySigWaveform({ name, day, month, year }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [tapped, setTapped] = useState<string | null>(null);

  const data = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const firstName = name.split(" ")[0];

    const bf = reduceToSingle(month + day + year);
    const expression = nameToNumber(name);
    const soulUrge = vowelNumber(name);
    const personality = consonantNumber(name);
    const py = calculatePersonalYear(day, month, currentYear);
    const de = calculateDailyEssence(name, day, month, year, currentDay, currentMonth, currentYear);

    // Each number contributes a frequency and amplitude
    const waves = [
      { label: "Birth Force", num: bf, freq: bf * 0.3, amp: 1.0, phase: 0, color: NUM_COLORS[bf] || "#fff" },
      { label: "Expression", num: expression, freq: expression * 0.25, amp: 0.7, phase: Math.PI * 0.3, color: NUM_COLORS[expression] || "#fff" },
      { label: "Soul Urge", num: soulUrge, freq: soulUrge * 0.35, amp: 0.6, phase: Math.PI * 0.6, color: NUM_COLORS[soulUrge] || "#fff" },
      { label: "Personality", num: personality, freq: personality * 0.2, amp: 0.4, phase: Math.PI * 0.9, color: NUM_COLORS[personality] || "#fff" },
      { label: "Personal Year", num: py.value, freq: py.value * 0.4, amp: 0.5, phase: Math.PI * 1.2, color: NUM_COLORS[py.value] || "#fff" },
      { label: "Daily Essence", num: de.value, freq: de.value * 0.5, amp: 0.3, phase: Math.PI * 1.5, color: NUM_COLORS[de.value] || "#fff" },
    ];

    return { waves, bf, expression, soulUrge, personality, py, de, firstName };
  }, [name, day, month, year]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 360;
    const H = 240;
    canvas.width = W * 2; // retina
    canvas.height = H * 2;
    ctx.scale(2, 2);

    let t = 0;
    const animate = () => {
      t += 0.015;
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Center line
      const midY = H / 2;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

      // Draw each wave layer
      data.waves.forEach((wave, wi) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5 - wi * 0.15;
        ctx.globalAlpha = 0.4 + (1 - wi / data.waves.length) * 0.4;

        for (let x = 0; x < W; x++) {
          const xNorm = x / W;
          // Composite wave
          const y = midY +
            Math.sin(xNorm * Math.PI * 2 * wave.freq + t + wave.phase) * 40 * wave.amp +
            Math.sin(xNorm * Math.PI * 4 * wave.freq * 0.5 + t * 1.3 + wave.phase) * 15 * wave.amp;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;

      // Combined waveform (white, semi-transparent)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      for (let x = 0; x < W; x++) {
        const xNorm = x / W;
        let combined = 0;
        data.waves.forEach(wave => {
          combined +=
            Math.sin(xNorm * Math.PI * 2 * wave.freq + t + wave.phase) * 40 * wave.amp * 0.3 +
            Math.sin(xNorm * Math.PI * 4 * wave.freq * 0.5 + t * 1.3 + wave.phase) * 15 * wave.amp * 0.3;
        });
        const y = midY + combined;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Floating particles along waves
      data.waves.forEach((wave, wi) => {
        const px = ((t * 30 + wi * 60) % W);
        const pxNorm = px / W;
        const py = midY +
          Math.sin(pxNorm * Math.PI * 2 * wave.freq + t + wave.phase) * 40 * wave.amp +
          Math.sin(pxNorm * Math.PI * 4 * wave.freq * 0.5 + t * 1.3 + wave.phase) * 15 * wave.amp;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = wave.color;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [data]);

  return (
    <div className="relative">
      <div className="text-center mb-3">
        <h3 className="font-display text-sm font-bold text-white/80 uppercase tracking-widest">
          Your Energy Signature
        </h3>
        <p className="text-[10px] text-white/30 mt-0.5">A unique frequency pattern from your numbers — no two are alike</p>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#06060c]">
        <canvas
          ref={canvasRef}
          style={{ width: 360, height: 240 }}
          className="w-full"
        />

        {/* Number labels on the right edge */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-1">
          {data.waves.map((w, i) => (
            <button
              key={i}
              onClick={() => setTapped(tapped === w.label ? null : w.label)}
              className="flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-black/50 backdrop-blur-sm border border-white/[0.06] transition-all hover:border-white/20"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
              <span className="text-[8px] font-bold" style={{ color: w.color }}>{w.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
        {data.waves.map((w, i) => (
          <button
            key={i}
            onClick={() => setTapped(tapped === w.label ? null : w.label)}
            className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="inline-block w-2 h-[2px] rounded-full" style={{ backgroundColor: w.color }} />
            {w.label}
          </button>
        ))}
      </div>

      {/* Tapped info */}
      {tapped && (() => {
        const w = data.waves.find(x => x.label === tapped);
        if (!w) return null;
        return (
          <div className="mt-3 mx-auto max-w-[280px] rounded-2xl bg-[#0a0a14]/95 border border-white/[0.08] backdrop-blur-lg p-3 text-center animate-in fade-in duration-200">
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{w.label}</div>
            <div className="text-2xl font-display font-bold" style={{ color: w.color }}>{w.num}</div>
            <p className="text-xs text-white/50 mt-1">
              {w.label === "Birth Force" && "Your core frequency — the dominant wave in your signature."}
              {w.label === "Expression" && "How your energy presents outward — your visible vibration."}
              {w.label === "Soul Urge" && "The hidden undertone — what drives you beneath the surface."}
              {w.label === "Personality" && "The modulation others perceive when they first meet you."}
              {w.label === "Personal Year" && "This year's overlay frequency — it shifts annually."}
              {w.label === "Daily Essence" && "Today's micro-frequency — changes every day."}
            </p>
            <button onClick={() => setTapped(null)} className="mt-2 text-[10px] text-white/20">dismiss</button>
          </div>
        );
      })()}

      <p className="text-center text-[9px] text-white/15 mt-2">
        Higher numbers = higher frequency · Stronger numbers = larger amplitude
      </p>
    </div>
  );
}
