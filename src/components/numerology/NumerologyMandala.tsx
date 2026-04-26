import { useMemo, useState } from "react";
import {
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateDailyEssence,
  reduceToSingle,
} from "@/lib/numerology";

interface MandalaProps {
  name: string;
  day: number;
  month: number;
  year: number;
}

// ─── Letter → Number mapping ───
const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const VOWELS = "AEIOU";

function nameToNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) if (LETTER_VALUES[ch]) sum += LETTER_VALUES[ch];
  return reduceToSingle(sum);
}

function vowelNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) if (VOWELS.includes(ch) && LETTER_VALUES[ch]) sum += LETTER_VALUES[ch];
  return reduceToSingle(sum);
}

function consonantNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) if (!VOWELS.includes(ch) && LETTER_VALUES[ch]) sum += LETTER_VALUES[ch];
  return reduceToSingle(sum);
}

// ─── Color palette per number (1-9) ───
const NUMBER_GLOW: Record<number, { color: string; glow: string; bg: string }> = {
  1: { color: "#f59e0b", glow: "rgba(245,158,11,0.5)", bg: "rgba(245,158,11,0.15)" },
  2: { color: "#a78bfa", glow: "rgba(167,139,250,0.5)", bg: "rgba(167,139,250,0.15)" },
  3: { color: "#34d399", glow: "rgba(52,211,153,0.5)", bg: "rgba(52,211,153,0.15)" },
  4: { color: "#60a5fa", glow: "rgba(96,165,250,0.5)", bg: "rgba(96,165,250,0.15)" },
  5: { color: "#f472b6", glow: "rgba(244,114,182,0.5)", bg: "rgba(244,114,182,0.15)" },
  6: { color: "#fb923c", glow: "rgba(251,146,60,0.5)", bg: "rgba(251,146,60,0.15)" },
  7: { color: "#818cf8", glow: "rgba(129,140,248,0.5)", bg: "rgba(129,140,248,0.15)" },
  8: { color: "#fbbf24", glow: "rgba(251,191,36,0.5)", bg: "rgba(251,191,36,0.15)" },
  9: { color: "#e879f9", glow: "rgba(232,121,249,0.5)", bg: "rgba(232,121,249,0.15)" },
};

// ─── PMEI classification per letter ───
function classifyPMEI(name: string): { P: number; M: number; E: number; I: number } {
  const counts = { P: 0, M: 0, E: 0, I: 0 };
  const physical = "DEWM";
  const mental = "AHJN";
  const emotional = "BIORS";
  const intuitive = "CFGKLPQTUVXYZ";
  for (const ch of name.toUpperCase()) {
    if (physical.includes(ch)) counts.P++;
    else if (mental.includes(ch)) counts.M++;
    else if (emotional.includes(ch)) counts.E++;
    else if (intuitive.includes(ch)) counts.I++;
  }
  return counts;
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function NumerologyMandala({ name, day, month, year }: MandalaProps) {
  const [tappedNode, setTappedNode] = useState<string | null>(null);
  
  const data = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const firstName = name.split(" ")[0];
    
    const bf = reduceToSingle(month + day + year);
    const expression = nameToNumber(name);
    const soulUrge = vowelNumber(name);
    const personality = consonantNumber(name);
    const firstNameNum = nameToNumber(firstName);
    const py = calculatePersonalYear(day, month, currentYear);
    const pm = calculatePersonalMonth(py.value, currentMonth);
    const de = calculateDailyEssence(name, day, month, year, new Date().getDate(), currentMonth, currentYear);
    const pmei = classifyPMEI(name);
    const pmeiTotal = pmei.P + pmei.M + pmei.E + pmei.I || 1;
    
    // Monthly energies for outer ring
    const monthlyPMs = Array.from({length: 12}, (_, i) => 
      calculatePersonalMonth(py.value, i + 1)
    );
    
    return {
      bf, expression, soulUrge, personality, firstNameNum, py, pm, de,
      pmei, pmeiTotal, monthlyPMs, firstName, currentYear, currentMonth
    };
  }, [name, day, month, year]);

  const CX = 180;
  const CY = 180;

  // Core 5 numbers positioned as pentagon points
  const coreNumbers = [
    { label: "Expression", short: "EXP", value: data.expression, angle: -90 },
    { label: "Soul Urge", short: "SU", value: data.soulUrge, angle: -90 + 72 },
    { label: "Birth Force", short: "BF", value: data.bf, angle: -90 + 144 },
    { label: "Personal Year", short: "PY", value: data.py.value, angle: -90 + 216 },
    { label: "First Name", short: "FN", value: data.firstNameNum, angle: -90 + 288 },
  ];

  const INNER_R = 72;
  const OUTER_R = 148;
  const MID_R = 112;
  const PMEI_R = 92;

  // Positions for core number nodes
  const corePositions = coreNumbers.map(n => {
    const rad = (n.angle * Math.PI) / 180;
    return { ...n, x: CX + INNER_R * Math.cos(rad), y: CY + INNER_R * Math.sin(rad) };
  });

  // Monthly positions on outer ring
  const monthPositions = Array.from({length: 12}, (_, i) => {
    const angle = -90 + i * 30;
    const rad = (angle * Math.PI) / 180;
    return {
      x: CX + OUTER_R * Math.cos(rad),
      y: CY + OUTER_R * Math.sin(rad),
      pm: data.monthlyPMs[i],
      month: MONTH_NAMES[i],
      isCurrent: i + 1 === data.currentMonth,
      angle,
    };
  });

  // PMEI quadrant arcs
  const pmeiData = [
    { label: "Physical", key: "P" as const, value: data.pmei.P, color: "#f59e0b", startAngle: -45, sweepAngle: 90 },
    { label: "Mental", key: "M" as const, value: data.pmei.M, color: "#60a5fa", startAngle: 45, sweepAngle: 90 },
    { label: "Emotional", key: "E" as const, value: data.pmei.E, color: "#f472b6", startAngle: 135, sweepAngle: 90 },
    { label: "Intuitive", key: "I" as const, value: data.pmei.I, color: "#a78bfa", startAngle: 225, sweepAngle: 90 },
  ];

  // Draw arc path
  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  // Connection lines between harmonious numbers (same number = strong connection)
  const connections: { from: number; to: number; strength: number }[] = [];
  for (let i = 0; i < corePositions.length; i++) {
    for (let j = i + 1; j < corePositions.length; j++) {
      const a = corePositions[i].value;
      const b = corePositions[j].value;
      if (a === b) connections.push({ from: i, to: j, strength: 1 });
      else if (Math.abs(a - b) === 3 || Math.abs(a - b) === 6) connections.push({ from: i, to: j, strength: 0.6 });
      else if ((a + b) === 10) connections.push({ from: i, to: j, strength: 0.4 });
    }
  }

  const bfGlow = NUMBER_GLOW[data.bf] || NUMBER_GLOW[1];

  return (
    <div className="relative">
      {/* Title */}
      <div className="text-center mb-3">
        <h3 className="font-display text-sm font-bold text-white/80 uppercase tracking-widest">
          Your Numerological Blueprint
        </h3>
        <p className="text-[10px] text-white/30 mt-0.5">Tap any element to explore</p>
      </div>

      <div className="relative mx-auto" style={{ width: 360, height: 360 }}>
        <svg viewBox="0 0 360 360" className="w-full h-full">
          <defs>
            {/* Glow filters */}
            <filter id="mandala-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="mandala-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial gradient for center */}
            <radialGradient id="center-glow">
              <stop offset="0%" stopColor={bfGlow.glow} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Rotating animation */}
            <animateTransform
              xlinkHref="#outer-ring-group"
              attributeName="transform"
              type="rotate"
              from={`0 ${CX} ${CY}`}
              to={`360 ${CX} ${CY}`}
              dur="120s"
              repeatCount="indefinite"
            />
          </defs>

          {/* ═══ Background circles ═══ */}
          <circle cx={CX} cy={CY} r={OUTER_R + 16} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={MID_R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <circle cx={CX} cy={CY} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

          {/* ═══ Sacred geometry lines (faint hexagram) ═══ */}
          {[0, 60, 120].map(a => {
            const r1 = (a * Math.PI) / 180;
            const r2 = ((a + 180) * Math.PI) / 180;
            return (
              <line key={a}
                x1={CX + OUTER_R * Math.cos(r1)} y1={CY + OUTER_R * Math.sin(r1)}
                x2={CX + OUTER_R * Math.cos(r2)} y2={CY + OUTER_R * Math.sin(r2)}
                stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"
              />
            );
          })}

          {/* ═══ PMEI Quadrant Arcs ═══ */}
          {pmeiData.map((q) => {
            const pct = q.value / data.pmeiTotal;
            const thickness = 3 + pct * 10;
            return (
              <g key={q.key}>
                {/* Background arc */}
                <path
                  d={arcPath(CX, CY, PMEI_R, q.startAngle, q.startAngle + q.sweepAngle)}
                  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={14}
                  strokeLinecap="round"
                />
                {/* Filled arc proportional to count */}
                <path
                  d={arcPath(CX, CY, PMEI_R, q.startAngle, q.startAngle + q.sweepAngle * pct)}
                  fill="none" stroke={q.color} strokeWidth={thickness}
                  strokeLinecap="round" opacity={0.5}
                  filter="url(#mandala-glow)"
                >
                  <animate attributeName="stroke-width" values={`${thickness};${thickness+2};${thickness}`} dur="3s" repeatCount="indefinite" />
                </path>
                {/* PMEI label */}
                {(() => {
                  const midAngle = q.startAngle + q.sweepAngle / 2;
                  const labelR = PMEI_R + 14;
                  const rad = (midAngle * Math.PI) / 180;
                  return (
                    <text
                      x={CX + labelR * Math.cos(rad)}
                      y={CY + labelR * Math.sin(rad)}
                      textAnchor="middle" dominantBaseline="central"
                      fill={q.color} fontSize="7" fontWeight="600" opacity={0.6}
                    >
                      {q.key} {q.value}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* ═══ Connection lines between harmonious core numbers ═══ */}
          {connections.map((c, i) => {
            const from = corePositions[c.from];
            const to = corePositions[c.to];
            const color = NUMBER_GLOW[from.value]?.color || "#fff";
            return (
              <line key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={color} strokeWidth={c.strength * 2}
                opacity={c.strength * 0.35}
                strokeDasharray={c.strength < 0.8 ? "4 4" : "none"}
              >
                <animate attributeName="opacity"
                  values={`${c.strength*0.2};${c.strength*0.45};${c.strength*0.2}`}
                  dur={`${3 + i}s`} repeatCount="indefinite"
                />
              </line>
            );
          })}

          {/* ═══ Pentagon outline connecting core numbers ═══ */}
          <polygon
            points={corePositions.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75"
          />

          {/* ═══ Outer ring: 12 monthly markers ═══ */}
          <g id="outer-ring-group">
            {monthPositions.map((mp, i) => {
              const pmColor = NUMBER_GLOW[mp.pm.value]?.color || "#fff";
              return (
                <g key={i} onClick={() => setTappedNode(tappedNode === `month-${i}` ? null : `month-${i}`)}>
                  {/* Month dot */}
                  <circle cx={mp.x} cy={mp.y} r={mp.isCurrent ? 10 : 7}
                    fill={mp.isCurrent ? NUMBER_GLOW[mp.pm.value]?.bg || "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"}
                    stroke={pmColor} strokeWidth={mp.isCurrent ? 1.5 : 0.5}
                    opacity={mp.isCurrent ? 1 : 0.5}
                    filter={mp.isCurrent ? "url(#mandala-glow)" : undefined}
                  />
                  {/* PM number inside */}
                  <text x={mp.x} y={mp.y} textAnchor="middle" dominantBaseline="central"
                    fill={pmColor} fontSize={mp.isCurrent ? "9" : "7"} fontWeight="700"
                    opacity={mp.isCurrent ? 1 : 0.6}
                  >
                    {mp.pm.value}
                  </text>
                  {/* Month label outside */}
                  {(() => {
                    const labelR = OUTER_R + 14;
                    const rad = (mp.angle * Math.PI) / 180;
                    return (
                      <text
                        x={CX + labelR * Math.cos(rad)}
                        y={CY + labelR * Math.sin(rad)}
                        textAnchor="middle" dominantBaseline="central"
                        fill={mp.isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}
                        fontSize="6" fontWeight={mp.isCurrent ? "700" : "400"}
                        letterSpacing="0.5"
                      >
                        {mp.month.toUpperCase()}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>

          {/* ═══ Core number nodes ═══ */}
          {corePositions.map((n, i) => {
            const glow = NUMBER_GLOW[n.value] || NUMBER_GLOW[1];
            const isActive = tappedNode === `core-${i}`;
            return (
              <g key={i} onClick={() => setTappedNode(isActive ? null : `core-${i}`)}
                 style={{ cursor: "pointer" }}>
                {/* Glow circle */}
                <circle cx={n.x} cy={n.y} r={18} fill={glow.bg} stroke={glow.color}
                  strokeWidth={isActive ? 2 : 1} opacity={isActive ? 1 : 0.8}
                  filter="url(#mandala-glow)"
                >
                  <animate attributeName="r" values="17;19;17" dur="4s" repeatCount="indefinite" />
                </circle>
                {/* Number */}
                <text x={n.x} y={n.y - 2} textAnchor="middle" dominantBaseline="central"
                  fill={glow.color} fontSize="14" fontWeight="800" fontFamily="Georgia, serif"
                >
                  {n.value}
                </text>
                {/* Label */}
                <text x={n.x} y={n.y + 10} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(255,255,255,0.4)" fontSize="5" fontWeight="600"
                  letterSpacing="0.5"
                >
                  {n.short}
                </text>
              </g>
            );
          })}

          {/* ═══ Center: Birth Force ═══ */}
          <g onClick={() => setTappedNode(tappedNode === "bf" ? null : "bf")}
             style={{ cursor: "pointer" }}>
            {/* Outer glow */}
            <circle cx={CX} cy={CY} r={36} fill="url(#center-glow)" opacity={0.5}>
              <animate attributeName="r" values="34;38;34" dur="5s" repeatCount="indefinite" />
            </circle>
            {/* Main circle */}
            <circle cx={CX} cy={CY} r={26} fill="rgba(10,10,15,0.9)" stroke={bfGlow.color}
              strokeWidth="2" filter="url(#mandala-glow-strong)"
            >
              <animate attributeName="stroke-width" values="1.5;2.5;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Inner ring decoration */}
            <circle cx={CX} cy={CY} r={20} fill="none" stroke={bfGlow.color}
              strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3"
            >
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`}
                dur="30s" repeatCount="indefinite"
              />
            </circle>
            {/* BF Number */}
            <text x={CX} y={CY - 3} textAnchor="middle" dominantBaseline="central"
              fill={bfGlow.color} fontSize="22" fontWeight="800"
              fontFamily="'Playfair Display', Georgia, serif"
            >
              {data.bf}
            </text>
            {/* Label */}
            <text x={CX} y={CY + 13} textAnchor="middle" dominantBaseline="central"
              fill="rgba(255,255,255,0.35)" fontSize="5" fontWeight="700"
              letterSpacing="1"
            >
              BIRTH FORCE
            </text>
          </g>

          {/* ═══ Orbiting particle ═══ */}
          <circle r="2" fill={bfGlow.color} opacity="0.6">
            <animateMotion
              path={`M ${CX + MID_R} ${CY} A ${MID_R} ${MID_R} 0 1 1 ${CX + MID_R - 0.01} ${CY}`}
              dur="20s" repeatCount="indefinite"
            />
          </circle>
          <circle r="1.5" fill="#a78bfa" opacity="0.4">
            <animateMotion
              path={`M ${CX - INNER_R} ${CY} A ${INNER_R} ${INNER_R} 0 1 0 ${CX - INNER_R + 0.01} ${CY}`}
              dur="15s" repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* ═══ Tapped Node Info Popup ═══ */}
        {tappedNode && (
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[280px] rounded-2xl bg-[#0a0a14]/95 border border-white/[0.08] backdrop-blur-lg p-3 text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            {tappedNode === "bf" && (
              <>
                <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Birth Force</div>
                <div className="text-2xl font-display font-bold" style={{ color: bfGlow.color }}>{data.bf}</div>
                <p className="text-xs text-white/50 mt-1">The core of who you are — calculated from your full birthday. This number is the foundation everything else builds upon.</p>
              </>
            )}
            {tappedNode.startsWith("core-") && (() => {
              const idx = parseInt(tappedNode.split("-")[1]);
              const n = coreNumbers[idx];
              const g = NUMBER_GLOW[n.value] || NUMBER_GLOW[1];
              return (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{n.label}</div>
                  <div className="text-2xl font-display font-bold" style={{ color: g.color }}>{n.value}</div>
                  <p className="text-xs text-white/50 mt-1">
                    {n.label === "Expression" && "How you naturally present yourself — your talents and abilities."}
                    {n.label === "Soul Urge" && "Your deepest inner motivation — what you truly want from life."}
                    {n.label === "Birth Force" && "The core energy you were born with."}
                    {n.label === "Personal Year" && `Your ${data.currentYear} theme — the lens for everything this year.`}
                    {n.label === "First Name" && `The energy of "${data.firstName}" — your everyday vibration.`}
                  </p>
                </>
              );
            })()}
            {tappedNode.startsWith("month-") && (() => {
              const idx = parseInt(tappedNode.split("-")[1]);
              const mp = monthPositions[idx];
              const g = NUMBER_GLOW[mp.pm.value] || NUMBER_GLOW[1];
              return (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{MONTH_NAMES[idx]} {data.currentYear}</div>
                  <div className="text-lg font-display font-bold" style={{ color: g.color }}>Personal Month {mp.pm.value}</div>
                  <p className="text-xs text-white/50 mt-1">
                    {mp.isCurrent ? "This is your current month's energy." : `The energy theme for ${MONTH_NAMES[idx]}.`}
                  </p>
                </>
              );
            })()}
            <button onClick={() => setTappedNode(null)} className="mt-2 text-[10px] text-white/20 hover:text-white/40">dismiss</button>
          </div>
        )}
      </div>

      {/* ═══ Legend ═══ */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 px-4">
        <span className="text-[9px] text-white/25">
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: "#f59e0b" }} />P = Physical
        </span>
        <span className="text-[9px] text-white/25">
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: "#60a5fa" }} />M = Mental
        </span>
        <span className="text-[9px] text-white/25">
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: "#f472b6" }} />E = Emotional
        </span>
        <span className="text-[9px] text-white/25">
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: "#a78bfa" }} />I = Intuitive
        </span>
      </div>
      <div className="text-center mt-1">
        <p className="text-[9px] text-white/15">
          Lines connect harmonious numbers · Outer ring = monthly personal months · Arcs = PMEI balance
        </p>
      </div>
    </div>
  );
}
