import { useMemo, useState, useRef, useEffect } from "react";
import { reduceToSingle, calculatePersonalYear, calculatePersonalMonth, calculateDailyEssence } from "@/lib/numerology";

interface SoulMapProps {
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

interface StarNode {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  x: number;
  y: number;
  size: number; // radius
  color: string;
  category: "identity" | "timing" | "expression";
  description: string;
}

export default function SoulMapConstellation({ name, day, month, year }: SoulMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [tappedStar, setTappedStar] = useState<StarNode | null>(null);

  const { stars, connections, bgStars } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const firstName = name.split(" ")[0];

    const bf = reduceToSingle(month + day + year);
    const expression = nameToNumber(name);
    const soulUrge = vowelNumber(name);
    const personality = consonantNumber(name);
    const firstNameNum = nameToNumber(firstName);
    const py = calculatePersonalYear(day, month, currentYear);
    const pm = calculatePersonalMonth(py.value, currentMonth);
    const de = calculateDailyEssence(name, day, month, year, currentDay, currentMonth, currentYear);
    const dayOfBirth = reduceToSingle(day);

    const W = 360, H = 360;
    const CX = W / 2, CY = H / 2;

    // Position nodes in a meaningful layout
    // Identity cluster (center-top)
    // Timing cluster (right)
    // Expression cluster (left)
    const stars: StarNode[] = [
      { id: "bf", label: "Birth Force", shortLabel: "BF", value: bf, x: CX, y: CY - 10, size: 16, color: NUM_COLORS[bf], category: "identity",
        description: "The gravitational center of your soul map — your core identity number." },
      { id: "su", label: "Soul Urge", shortLabel: "SU", value: soulUrge, x: CX - 55, y: CY - 60, size: 12, color: NUM_COLORS[soulUrge], category: "identity",
        description: "Your deepest desire — what your soul truly craves." },
      { id: "exp", label: "Expression", shortLabel: "EXP", value: expression, x: CX + 55, y: CY - 55, size: 12, color: NUM_COLORS[expression], category: "expression",
        description: "Your natural talents — how you express yourself to the world." },
      { id: "per", label: "Personality", shortLabel: "PER", value: personality, x: CX + 80, y: CY + 20, size: 10, color: NUM_COLORS[personality], category: "expression",
        description: "Your outer mask — the first impression others get." },
      { id: "fn", label: "First Name", shortLabel: "FN", value: firstNameNum, x: CX - 75, y: CY + 15, size: 10, color: NUM_COLORS[firstNameNum], category: "identity",
        description: `The vibration of "${firstName}" — your everyday energy.` },
      { id: "dob", label: "Day of Birth", shortLabel: "DOB", value: dayOfBirth, x: CX - 30, y: CY + 70, size: 9, color: NUM_COLORS[dayOfBirth], category: "identity",
        description: "Your birthday talent — a natural gift you carry." },
      { id: "py", label: "Personal Year", shortLabel: "PY", value: py.value, x: CX + 90, y: CY - 70, size: 11, color: NUM_COLORS[py.value], category: "timing",
        description: `Your ${currentYear} energy theme — the annual lens.` },
      { id: "pm", label: "Personal Month", shortLabel: "PM", value: pm.value, x: CX + 105, y: CY + 70, size: 8, color: NUM_COLORS[pm.value], category: "timing",
        description: "This month's energy layer — a sub-theme within your year." },
      { id: "de", label: "Daily Essence", shortLabel: "DE", value: de.value, x: CX + 40, y: CY + 85, size: 7, color: NUM_COLORS[de.value], category: "timing",
        description: "Today's micro-energy — how you're likely feeling right now." },
    ];

    // Add some random jitter based on the numbers (deterministic)
    const seed = bf * 1000 + expression * 100 + soulUrge * 10 + personality;
    stars.forEach((s, i) => {
      const jx = ((seed * (i + 1) * 7) % 20) - 10;
      const jy = ((seed * (i + 1) * 13) % 16) - 8;
      s.x = Math.max(30, Math.min(W - 30, s.x + jx));
      s.y = Math.max(30, Math.min(H - 30, s.y + jy));
    });

    // Connections: connect every star to BF, and similar numbers to each other
    const connections: { from: StarNode; to: StarNode; strength: number }[] = [];
    for (let i = 0; i < stars.length; i++) {
      // Connect to BF (center)
      if (stars[i].id !== "bf") {
        const same = stars[i].value === bf ? 1 : 0.2;
        connections.push({ from: stars[0], to: stars[i], strength: same });
      }
      // Connect matching values
      for (let j = i + 1; j < stars.length; j++) {
        if (stars[i].value === stars[j].value && stars[i].id !== "bf" && stars[j].id !== "bf") {
          connections.push({ from: stars[i], to: stars[j], strength: 0.8 });
        }
        // Same category connections (lighter)
        if (stars[i].category === stars[j].category && stars[i].id !== "bf" && stars[j].id !== "bf" && stars[i].value !== stars[j].value) {
          const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (dist < 120) {
            connections.push({ from: stars[i], to: stars[j], strength: 0.1 });
          }
        }
      }
    }

    // Background stars (decorative)
    const bgStars = Array.from({ length: 80 }, (_, i) => ({
      x: ((seed * (i + 7) * 31) % W),
      y: ((seed * (i + 3) * 17) % H),
      size: 0.5 + ((seed * (i + 1)) % 3) * 0.4,
      twinkleSpeed: 2 + ((seed * i) % 4),
      opacity: 0.1 + ((seed * i * 7) % 20) / 100,
    }));

    return { stars, connections, bgStars };
  }, [name, day, month, year]);

  // Canvas animation for background stars and connection pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 360, H = 360;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);

    let t = 0;
    const animate = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      // Background stars twinkling
      bgStars.forEach(s => {
        const flicker = s.opacity * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${flicker})`;
        ctx.fill();
      });

      // Draw connections with pulse effect
      connections.forEach((c, ci) => {
        const pulsePos = (t * 0.5 + ci * 0.3) % 1;
        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.lineTo(c.to.x, c.to.y);
        ctx.strokeStyle = `rgba(255,255,255,${c.strength * 0.12})`;
        ctx.lineWidth = c.strength * 1.5;
        ctx.stroke();

        // Pulse dot traveling along the connection
        if (c.strength > 0.3) {
          const px = c.from.x + (c.to.x - c.from.x) * pulsePos;
          const py = c.from.y + (c.to.y - c.from.y) * pulsePos;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          const color = c.strength > 0.7 ? c.from.color : "rgba(255,255,255,0.3)";
          ctx.fillStyle = color;
          ctx.globalAlpha = c.strength * 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // Draw star nodes with glow
      stars.forEach(s => {
        const pulse = 1 + 0.08 * Math.sin(t * 2 + s.value);

        // Outer glow
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        gradient.addColorStop(0, s.color + "30");
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = s.color + "40";
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Number text
        ctx.fillStyle = s.color;
        ctx.font = `bold ${Math.max(8, s.size * 0.9)}px Georgia, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(s.value), s.x, s.y);

        // Label below
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = `600 ${Math.max(6, s.size * 0.45)}px system-ui`;
        ctx.fillText(s.shortLabel, s.x, s.y + s.size + 7);
      });

      // Nebula effect (subtle colored fog)
      stars.forEach(s => {
        if (s.size > 10) {
          const nebulaGrad = ctx.createRadialGradient(s.x, s.y, s.size, s.x, s.y, s.size * 6);
          nebulaGrad.addColorStop(0, s.color + "08");
          nebulaGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 6, 0, Math.PI * 2);
          ctx.fillStyle = nebulaGrad;
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [stars, connections, bgStars]);

  // Handle tap on canvas
  const handleTap = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 360 / rect.width;
    const scaleY = 360 / rect.height;
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Find closest star
    let closest: StarNode | null = null;
    let closestDist = Infinity;
    stars.forEach(s => {
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < s.size * 2.5 && d < closestDist) {
        closest = s;
        closestDist = d;
      }
    });
    setTappedStar(closest);
  };

  return (
    <div className="relative">
      <div className="text-center mb-3">
        <h3 className="font-display text-sm font-bold text-white/80 uppercase tracking-widest">
          Your Soul Map
        </h3>
        <p className="text-[10px] text-white/30 mt-0.5">A constellation of your numbers — tap any star to learn more</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#030308]">
        <canvas
          ref={canvasRef}
          style={{ width: 360, height: 360 }}
          className="w-full"
          onClick={handleTap}
          onTouchStart={handleTap}
        />

        {/* Category labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-amber-400/40">★ Identity</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-blue-400/40">★ Timing</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-pink-400/40">★ Expression</span>
        </div>
      </div>

      {/* Tapped star info */}
      {tappedStar && (
        <div className="mt-3 mx-auto max-w-[280px] rounded-2xl bg-[#0a0a14]/95 border border-white/[0.08] backdrop-blur-lg p-3 text-center animate-in fade-in duration-200">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{tappedStar.label}</div>
          <div className="text-2xl font-display font-bold" style={{ color: tappedStar.color }}>{tappedStar.value}</div>
          <p className="text-xs text-white/50 mt-1">{tappedStar.description}</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="text-[8px] uppercase tracking-wider" style={{ color: tappedStar.color }}>
              {tappedStar.category}
            </span>
          </div>
          <button onClick={() => setTappedStar(null)} className="mt-2 text-[10px] text-white/20">dismiss</button>
        </div>
      )}

      <p className="text-center text-[9px] text-white/15 mt-2">
        Brighter lines = stronger resonance between numbers · Larger stars = more influential numbers
      </p>
    </div>
  );
}
