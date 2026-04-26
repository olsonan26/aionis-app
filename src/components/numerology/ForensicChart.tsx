import { useMemo, useRef, useEffect } from "react";
import {
  buildChartData,
  buildHeaderData,
  buildLetterRows,
  currentAge,
} from "@/lib/chartEngine";
import { NUM_COLORS } from "@/data/viContent";
import { NumberPopup } from "@/components/ui/number-popup";
import { LetterPopup } from "@/components/ui/letter-popup";
import {
  expressionDescriptions,
  soulUrgeDescriptions,
  birthForceDescriptions,
} from "@/data/readings";
import { reduceToSingle } from "@/lib/numerology";

const MONTH_SHORT = ["J","F","M","A","M","J","J","A","S","O","N","D"];

interface ForensicChartProps {
  name: string;
  day: number;
  month: number;
  year: number;
}

/** Color for a cell value based on row type */
function cellColor(type: keyof typeof NUM_COLORS): string {
  return NUM_COLORS[type].color;
}

export default function ForensicChart({ name, day, month, year }: ForensicChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const age = currentAge(day, month, year);
  const chartData = useMemo(() => buildChartData(name, day, month, year, Math.max(age + 20, 80)), [name, day, month, year, age]);
  const header = useMemo(() => buildHeaderData(name, day, month, year), [name, day, month, year]);
  // letterRows reserved for future name letter timeline
  useMemo(() => buildLetterRows(name, Math.max(age + 20, 80)), [name, age]);
  const currentYear = new Date().getFullYear();

  // Show a window of ±10 years around current age for the yearly chart
  const startAge = Math.max(1, age - 10);
  const endAge = Math.min(chartData.length - 1, age + 10);
  const yearWindow = chartData.slice(startAge, endAge + 1);

  // Show 3 years for the monthly chart (prev, current, next)
  const monthStartIdx = Math.max(0, age - 1);
  const monthEndIdx = Math.min(chartData.length - 1, age + 1);
  const monthWindow = chartData.slice(monthStartIdx, monthEndIdx + 1);

  // Auto-scroll to current age on mount
  useEffect(() => {
    if (scrollRef.current) {
      const colWidth = 28;
      const targetCol = age - startAge;
      const offset = Math.max(0, targetCol * colWidth - scrollRef.current.clientWidth / 2 + colWidth / 2);
      scrollRef.current.scrollLeft = offset;
    }
  }, [age, startAge]);

  useEffect(() => {
    if (monthScrollRef.current) {
      const currentYearIdx = monthWindow.findIndex(d => d.year === currentYear);
      if (currentYearIdx > 0) {
        const colWidth = 28;
        const offset = currentYearIdx * 12 * colWidth;
        monthScrollRef.current.scrollLeft = Math.max(0, offset - 20);
      }
    }
  }, [currentYear, monthWindow]);

  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  return (
    <div className="space-y-6 pb-4">
      {/* Header — Name Breakdown */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 overflow-x-auto">
        <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Name Blueprint</div>

        {/* Vowel row (Heart's Desire / Soul Urge) */}
        <div className="font-mono text-xs flex gap-0 mb-0.5">
          {name.split('').map((ch, i) => {
            if (/[A-Za-z]/.test(ch) && 'AEIOUaeiou'.includes(ch)) {
              const v = { A:1,E:5,I:9,O:6,U:3 }[ch.toUpperCase()] || 0;
              return <span key={i} className="w-[14px] text-center text-purple-300">{v}</span>;
            }
            return <span key={i} className="w-[14px] text-center">&nbsp;</span>;
          })}
          <span className="ml-2">
            <NumberPopup
              trail={header.overallVowelReduction}
              label="Heart's Desire (Soul Urge)"
              description={soulUrgeDescriptions[reduceToSingle(parseInt(header.overallVowelReduction.split('/')[0]))] || `Your Heart's Desire ${header.overallVowelReduction} reveals your deepest inner motivation — what you truly want from life at a soul level.`}
              color="text-purple-300"
              className="text-purple-300/60 text-xs"
            >
              <span className="font-mono underline decoration-dotted underline-offset-2">= {header.overallVowelReduction}</span>
            </NumberPopup>
          </span>
        </div>

        {/* Name letters */}
        <div className="font-mono text-xs flex gap-0 mb-0.5">
          {name.split('').map((ch, i) => (
            <span key={i} className="w-[14px] text-center text-white/70">{ch}</span>
          ))}
        </div>

        {/* All values (Expression / Whole Name) */}
        <div className="font-mono text-xs flex gap-0 mb-0.5">
          {name.split('').map((ch, i) => {
            if (/[A-Za-z]/.test(ch)) {
              const v = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8 }[ch.toUpperCase()] || 0;
              return <span key={i} className="w-[14px] text-center text-amber-400/70">{v}</span>;
            }
            return <span key={i} className="w-[14px] text-center">&nbsp;</span>;
          })}
          <span className="ml-2">
            <NumberPopup
              trail={header.overallTotalReduction}
              label="Expression (Whole Name)"
              description={expressionDescriptions[reduceToSingle(parseInt(header.overallTotalReduction.split('/')[0]))] || `Your Expression Number ${header.overallTotalReduction} reveals how you naturally present yourself to the world — your talents, abilities, and the way others perceive you.`}
              color="text-amber-400"
              className="text-amber-400/60 text-xs"
            >
              <span className="font-mono underline decoration-dotted underline-offset-2">= {header.overallTotalReduction}</span>
            </NumberPopup>
          </span>
        </div>

        {/* Word totals — tappable per name part */}
        <div className="font-mono text-xs flex gap-0 mt-1">
          {header.wordReductions.map((w: any, i: number) => {
            const reduced = reduceToSingle(parseInt(w.totalTrail.split('/')[0]));
            const isFirst = i === 0;
            const wordLabel = isFirst ? "First Name Number" : i === header.wordReductions.length - 1 ? "Last Name Number" : `Name Part ${i + 1}`;
            return (
              <span key={i} style={{ width: `${w.word.length * 14}px` }} className="text-center">
                <NumberPopup
                  trail={w.totalTrail}
                  label={wordLabel}
                  description={isFirst
                    ? `Your First Name Number (${w.totalTrail}) is derived from "${w.word}". ${expressionDescriptions[reduced] || "This number reveals the initial impression you give and the energy you project through your everyday identity."}`
                    : `The number for "${w.word}" is ${w.totalTrail}. This part of your name contributes to your overall Expression and adds specific qualities to your personality profile.`
                  }
                  color="text-white/50"
                  className="text-white/40 text-xs"
                >
                  <span className="underline decoration-dotted underline-offset-2">{w.totalTrail}</span>
                </NumberPopup>
              </span>
            );
          })}
        </div>

        {/* Birthday & UG — both tappable */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <NumberPopup
            trail={header.birthdayTrail}
            label="Whole Birthday Number (Birth Force)"
            description={birthForceDescriptions[String(reduceToSingle(parseInt(header.birthdayTrail.split('/')[0])))]?.description || `Your Birth Force ${header.birthdayTrail} is calculated from your full birthday. It represents your natural abilities and the energy you were born with.`}
            color="text-white/60"
            className="text-white/40"
          >
            <span className="underline decoration-dotted underline-offset-2">{month}/{day}/{year}</span>
            <span className="ml-1 text-white/25">· Age {age}</span>
            <span className="ml-1.5 text-cyan-400/60 font-mono">BF: {header.birthdayTrail}</span>
          </NumberPopup>
          <div className="flex items-center gap-2">
            <span className="text-white/40">UG:</span>
            <NumberPopup
              trail={header.ugTrail}
              label="Ultimate Goal"
              description={`Your Ultimate Goal ${header.ugTrail} is the sum of your Expression (name) and your Birth Force (birthday). It represents your life's ultimate purpose — the highest potential you can achieve when you fully integrate your natural abilities with your learned skills. This is the destination your entire chart points toward.`}
              color="text-amber-400"
            >
              <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono font-bold">
                {header.ugTrail}
              </span>
            </NumberPopup>
          </div>
        </div>
      </div>

      {/* Age Range Labels */}
      <div className="flex gap-2 text-[10px] text-white/25 font-mono px-1">
        <span>0 ~ {Math.floor(age * 0.4)}</span>
        <span>{Math.floor(age * 0.4) + 1} ~ {Math.floor(age * 0.65)}</span>
        <span>{Math.floor(age * 0.65) + 1} ~ {Math.floor(age * 0.85)}</span>
        <span>{Math.floor(age * 0.85) + 1} ~ ∞</span>
      </div>

      {/* ═══════ YEARLY CHART ═══════ */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="text-xs text-white/30 uppercase tracking-wider">Yearly Timeline</div>
          <div className="text-[10px] text-white/20 font-mono">Ages {startAge}–{endAge}</div>
        </div>

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-3">
          <table className="border-collapse font-mono text-[11px] mx-2" style={{ minWidth: yearWindow.length * 28 }}>
            <tbody>
              {/* Age tens row */}
              <tr>
                {yearWindow.map(d => (
                  <td key={d.age} className={`w-7 h-5 text-center text-white/20 ${d.age === age ? 'font-bold text-amber-400' : ''}`}>
                    {d.age % 10 === 0 ? Math.floor(d.age / 10) : ''}
                  </td>
                ))}
              </tr>

              {/* Age ones row */}
              <tr>
                {yearWindow.map(d => (
                  <td key={d.age} className={`w-7 h-5 text-center ${d.age === age ? 'font-bold text-amber-400' : 'text-white/40'}`}>
                    {d.age % 10}
                  </td>
                ))}
              </tr>

              {/* Letter rows (up to 3 name parts) — color coded */}
              {nameParts.slice(0, 3).map((_, pi) => (
                <tr key={`letter-${pi}`}>
                  {yearWindow.map(d => {
                    const letter = d.letters[pi] || '';
                    const up = letter.toUpperCase();
                    const isHighlight = up === 'A' || up === 'S';
                    const letterColor = isHighlight ? '#facc15' : (['#ef4444', '#06b6d4', '#10b981'][pi] || '#888');
                    return (
                      <td
                        key={d.age}
                        className={`w-7 h-5 text-center ${
                          d.age === age ? 'bg-amber-400/10' : ''
                        }`}
                      >
                        {letter ? (
                          <LetterPopup letter={letter} color={letterColor} className={`text-[11px] ${isHighlight ? 'font-bold' : ''}`}>
                            {letter}
                          </LetterPopup>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Separator dots */}
              {Array.from({ length: 7 }).map((_, si) => (
                <tr key={`sep-${si}`}>
                  {yearWindow.map(d => (
                    <td key={d.age} className={`w-7 h-2 text-center text-[8px] ${d.age === age ? 'bg-amber-400/5' : ''}`}>
                      <span className="text-red-400/30">:</span>
                    </td>
                  ))}
                </tr>
              ))}

              {/* ESS row */}
              <tr>
                {yearWindow.map(d => (
                  <td
                    key={d.age}
                    className={`w-7 h-6 text-center font-bold ${d.age === age ? 'bg-amber-400/10' : ''}`}
                    style={{ color: cellColor('ESS') }}
                    title={`ESS: ${d.essCompound}`}
                  >
                    {d.age > 0 ? d.ess : ''}
                  </td>
                ))}
              </tr>

              {/* COM row */}
              <tr>
                {yearWindow.map(d => (
                  <td
                    key={d.age}
                    className={`w-7 h-6 text-center ${d.age === age ? 'bg-amber-400/10' : ''}`}
                    style={{ color: cellColor('COM') }}
                    title={d.comCompound ? `COM: ${d.comCompound}` : ''}
                  >
                    {d.COM !== null ? d.COM : ''}
                  </td>
                ))}
              </tr>

              {/* PY row */}
              <tr>
                {yearWindow.map(d => (
                  <td
                    key={d.age}
                    className={`w-7 h-6 text-center ${d.age === age ? 'bg-amber-400/10' : ''}`}
                    style={{ color: cellColor('PY') }}
                    title={`PY: ${d.pyCompound}`}
                  >
                    {d.PY}
                  </td>
                ))}
              </tr>

              {/* CY row */}
              <tr>
                {yearWindow.map(d => (
                  <td
                    key={d.age}
                    className={`w-7 h-6 text-center ${d.age === age ? 'bg-amber-400/10' : ''}`}
                    style={{ color: cellColor('CY') }}
                  >
                    {d.CY}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Row labels */}
          <div className="absolute right-2 text-[9px] font-mono" style={{ top: 'auto' }}>
            {/* Labels drawn inside the scrollable area as last column */}
          </div>
        </div>

        {/* Row legend */}
        <div className="px-4 pb-3 flex flex-wrap gap-3 text-[10px]">
          <span style={{ color: cellColor('ESS') }}>● ESS</span>
          <span style={{ color: cellColor('COM') }}>● COM</span>
          <span style={{ color: cellColor('PY') }}>● PY</span>
          <span style={{ color: cellColor('CY') }}>● CY</span>
        </div>
      </div>

      {/* ═══════ MONTHLY CHART ═══════ */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="text-xs text-white/30 uppercase tracking-wider">Monthly Breakdown</div>
          <div className="text-[10px] text-white/20 font-mono">{monthWindow[0]?.year}–{monthWindow[monthWindow.length - 1]?.year}</div>
        </div>

        <div ref={monthScrollRef} className="overflow-x-auto scrollbar-hide pb-3">
          <table className="border-collapse font-mono text-[11px] mx-2" style={{ minWidth: monthWindow.length * 12 * 28 }}>
            <tbody>
              {/* ESS row (monthly) */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((m, mi) => (
                    <td
                      key={`ess-${yi}-${mi}`}
                      className={`w-7 h-6 text-center font-bold ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}`}
                      style={{ color: cellColor('ESS'), borderTop: d.year === currentYear ? '2px solid rgba(16,185,129,0.4)' : undefined }}
                    >
                      {m.ess}
                    </td>
                  ))
                ))}
              </tr>

              {/* PME row */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((m, mi) => (
                    <td
                      key={`pme-${yi}-${mi}`}
                      className={`w-7 h-6 text-center ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}`}
                      style={{ color: cellColor('PME') }}
                      title={`PME: ${m.pmeCompound}`}
                    >
                      {m.PME}
                    </td>
                  ))
                ))}
              </tr>

              {/* MCOM row */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((m, mi) => (
                    <td
                      key={`mcom-${yi}-${mi}`}
                      className={`w-7 h-6 text-center ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}`}
                      style={{ color: cellColor('MCOM') }}
                      title={`MCOM: ${m.mcomCompound}`}
                    >
                      {m.MCOM}
                    </td>
                  ))
                ))}
              </tr>

              {/* PM row */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((m, mi) => (
                    <td
                      key={`pm-${yi}-${mi}`}
                      className={`w-7 h-6 text-center ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}`}
                      style={{ color: cellColor('PM') }}
                      title={`PM: ${m.pmCompound}`}
                    >
                      {m.PM}
                    </td>
                  ))
                ))}
              </tr>

              {/* Calendar Month labels (J F M A M J J A S O N D) */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((_m, mi) => (
                    <td
                      key={`cm-${yi}-${mi}`}
                      className={`w-7 h-6 text-center text-cyan-400/70 ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}`}
                    >
                      {MONTH_SHORT[mi]}
                    </td>
                  ))
                ))}
              </tr>

              {/* PY row */}
              <tr>
                {monthWindow.map((d, yi) => (
                  d.months.map((m, mi) => (
                    <td
                      key={`py-${yi}-${mi}`}
                      className={`w-7 h-6 text-center font-bold ${
                        d.year === currentYear ? 'bg-emerald-400/[0.04]' : ''
                      } ${d.year === currentYear && mi === 0 ? 'border-l-2 border-emerald-400/40' : ''}
                        ${d.year === currentYear && mi === 11 ? 'border-r-2 border-emerald-400/40' : ''}
                      `}
                      style={{ color: cellColor('PY'), borderBottom: d.year === currentYear ? '2px solid rgba(16,185,129,0.4)' : undefined }}
                    >
                      {m.PY}
                    </td>
                  ))
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Year labels */}
        <div className="flex justify-around px-4 pb-2">
          {monthWindow.map(d => (
            <div
              key={d.year}
              className={`text-center text-xs font-mono ${
                d.year === currentYear
                  ? 'text-emerald-400 font-bold'
                  : 'text-white/30'
              }`}
            >
              {d.year}
            </div>
          ))}
        </div>

        {/* Row legend */}
        <div className="px-4 pb-3 flex flex-wrap gap-3 text-[10px]">
          <span style={{ color: cellColor('ESS') }}>● ESS</span>
          <span style={{ color: cellColor('PME') }}>● PME</span>
          <span style={{ color: cellColor('MCOM') }}>● MCOM</span>
          <span style={{ color: cellColor('PM') }}>● PM</span>
          <span className="text-cyan-400/70">● CM</span>
          <span style={{ color: cellColor('PY') }}>● PY</span>
        </div>

        {/* Neon box indicator legend */}
        <div className="px-4 pb-3 text-[10px] text-white/25">
          <span className="inline-block w-3 h-3 border-2 border-emerald-400/40 rounded-sm mr-1 align-middle" />
          = Current year indicator
        </div>
      </div>

      {/* ═══════ LIFETIME VIEW ═══════ */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="px-4 pt-3 pb-2">
          <div className="text-xs text-white/30 uppercase tracking-wider">Lifetime Overview</div>
        </div>

        <div className="overflow-x-auto scrollbar-hide pb-3">
          <div className="px-2">
            {/* Decade markers */}
            <div className="flex font-mono text-[9px] text-white/20">
              {Array.from({ length: Math.ceil(chartData.length / 10) }).map((_, i) => (
                <span key={i} className="flex-shrink-0" style={{ width: `${10 * 6}px` }}>{i}</span>
              ))}
            </div>

            {/* Age numbers */}
            <div className="flex font-mono text-[7px] text-white/15 leading-tight">
              {chartData.slice(0, Math.min(80, chartData.length)).map(d => (
                <span key={d.age} className="flex-shrink-0 w-[6px] text-center">{d.age % 10}</span>
              ))}
            </div>

            {/* Letter rows compressed */}
            {nameParts.slice(0, 3).map((_, pi) => (
              <div key={pi} className="flex font-mono text-[7px] leading-tight">
                {chartData.slice(0, Math.min(80, chartData.length)).map(d => (
                  <span
                    key={d.age}
                    className={`flex-shrink-0 w-[6px] text-center ${d.age === age ? 'bg-amber-400/20' : ''}`}
                    style={{ color: ['#ef4444', '#06b6d4', '#10b981'][pi] || '#888' }}
                  >
                    {d.letters[pi] || ''}
                  </span>
                ))}
              </div>
            ))}

            {/* ESS compressed */}
            <div className="flex font-mono text-[7px] leading-tight mt-0.5">
              {chartData.slice(0, Math.min(80, chartData.length)).map(d => (
                <span
                  key={d.age}
                  className={`flex-shrink-0 w-[6px] text-center ${d.age === age ? 'bg-amber-400/20' : ''}`}
                  style={{ color: cellColor('ESS') }}
                >
                  {d.age > 0 ? d.ess : ''}
                </span>
              ))}
            </div>

            {/* PY compressed */}
            <div className="flex font-mono text-[7px] leading-tight">
              {chartData.slice(0, Math.min(80, chartData.length)).map(d => (
                <span
                  key={d.age}
                  className={`flex-shrink-0 w-[6px] text-center ${d.age === age ? 'bg-amber-400/20' : ''}`}
                  style={{ color: cellColor('PY') }}
                >
                  {d.PY}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
