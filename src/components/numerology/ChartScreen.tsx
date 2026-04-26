import { useLanguage } from "@/lib/LanguageContext";
import { tx } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { SectionExplainer } from "@/components/ui/section-explainer";
import { PulseRing } from "@/components/ui/pulse-ring";
import ForensicChart from "@/components/numerology/ForensicChart";
import {
  buildStackedChart,
  findDiagonalPatterns,
} from "@/lib/numerology";
import {
  Grid3x3,
  Info,
  Layers,
  TrendingUp,
  UserPlus,
  Zap,
  RefreshCw,
  BarChart2,
} from "lucide-react";

interface ChartScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

const PATTERN_ICONS: Record<string, typeof Zap> = {
  ascending: TrendingUp,
  descending: TrendingUp,
  mirror: RefreshCw,
  repeat: Layers,
};
const PATTERN_COLORS: Record<string, string> = {
  ascending: "#10b981",
  descending: "#f59e0b",
  mirror: "#a855f7",
  repeat: "#3b82f6",
};

export default function ChartScreen({ profile }: ChartScreenProps) {
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [stackPeople, setStackPeople] = useState<
    Array<{ name: string; fullName: string; birthDay: number; birthMonth: number; birthYear: number }>
  >([]);
  const [stackName, setStackName] = useState("");
  const [stackBday, setStackBday] = useState({ m: "", d: "", y: "" });
  const [stackYear, setStackYear] = useState(currentYear);

  // Diagonal patterns for the user
  const diagonalPatterns = useMemo(
    () =>
      findDiagonalPatterns(
        profile.name,
        profile.day,
        profile.month,
        profile.year,
        profile.year, // from birth
        currentYear + 5
      ),
    [profile, currentYear]
  );

  // Stacked chart data
  const stackedData = useMemo(() => {
    if (stackPeople.length === 0) return [];
    const allPeople = [
      { name: profile.name.split(" ")[0], fullName: profile.name, birthDay: profile.day, birthMonth: profile.month, birthYear: profile.year },
      ...stackPeople,
    ];
    return buildStackedChart(allPeople, stackYear);
  }, [profile, stackPeople, stackYear]);

  const addStackPerson = () => {
    const m = parseInt(stackBday.m);
    const d = parseInt(stackBday.d);
    const y = parseInt(stackBday.y);
    if (!stackName.trim() || !m || !d || !y) return;
    setStackPeople(prev => [
      ...prev,
      { name: stackName.split(" ")[0], fullName: stackName, birthDay: d, birthMonth: m, birthYear: y },
    ]);
    setStackName("");
    setStackBday({ m: "", d: "", y: "" });
  };

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Header */}
      <FadeIn>
        <div className="px-1">
          <div className="flex items-center gap-2 mb-1">
            <Grid3x3 className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
              Forensic Chart
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            <GradientText>Numerological</GradientText> Blueprint
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Your complete age-by-age essence map with letter transits, yearly rows, and monthly breakdowns
          </p>
        </div>
      </FadeIn>

      {/* Section Tooltip */}
      <FadeIn delay={50}>
        <div className="flex gap-2 items-start rounded-xl bg-amber-400/[0.04] border border-amber-400/10 p-3">
          <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-400">What is the Forensic Chart?</p>
            <p className="text-[11px] leading-relaxed text-white/40">
              This chart maps your entire life through letter cycles, yearly essences, and monthly breakdowns.
              Each row represents a different energy layer — scroll horizontally to explore your timeline.
              The green neon box highlights the current year in the monthly section.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* The Forensic Chart */}
      <FadeIn delay={100}>
        <ForensicChart
          name={profile.name}
          day={profile.day}
          month={profile.month}
          year={profile.year}
        />
      </FadeIn>

      {/* ═══ DIAGONAL READING ═══ */}
      <SectionExplainer
        title={tx("chart.diagonalReading", lang)}
        description="The diagonal reading looks at patterns that emerge when you read your chart diagonally across ages. Ascending number sequences suggest momentum and growth. Repeating numbers amplify that energy's theme. A 9-to-1 transition marks a major life reset — the end of one cycle and the birth of something new."
      />
      <FadeIn delay={150}>
        <ExpandableCard
          title={tx("chart.diagonalReading", lang)}
          subtitle="Life pattern analysis across your timeline"
          icon={<BarChart2 className="h-4 w-4 text-purple-400" />}
          defaultOpen={false}
        >
          <div className="space-y-2 mt-3">
            <div className="flex gap-2 items-start rounded-lg bg-purple-400/[0.04] border border-purple-400/10 p-2.5">
              <Info className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-white/40">
                Diagonal reading reveals hidden patterns by scanning across your chart — ascending sequences, repeating energies, and cycle transitions (like 9→1 new beginnings).
              </p>
            </div>
            {diagonalPatterns.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-4">
                No major diagonal patterns found in your current range. This is normal — patterns emerge over longer periods.
              </p>
            ) : (
              diagonalPatterns.map((pat, i) => {
                const PatIcon = PATTERN_ICONS[pat.type] || Zap;
                const color = PATTERN_COLORS[pat.type] || "#fbbf24";
                return (
                  <SpotlightCard key={i} spotlightColor={`${color}22`} className="p-3">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <PatIcon className="h-4 w-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
                            Age {pat.startAge}–{pat.endAge}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">
                            {pat.type}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">{pat.description}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })
            )}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ STACKED CHART COMPARISON ═══ */}
      <SectionExplainer
        title={tx("chart.stackedChart", lang)}
        description="Stacking charts lets you overlay two or more people's numbers side by side for any given year. You can see where your Personal Years, Essences, and Combiners align or clash. This is powerful for understanding relationship dynamics, family timing, and why certain years feel more connected or challenging with specific people."
      />
      <FadeIn delay={200}>
        <ExpandableCard
          title={tx("chart.stackedChart", lang)}
          subtitle="Compare charts side by side for any year"
          icon={<Layers className="h-4 w-4 text-cyan-400" />}
          defaultOpen={false}
        >
          <div className="space-y-3 mt-3">
            <div className="flex gap-2 items-start rounded-lg bg-cyan-400/[0.04] border border-cyan-400/10 p-2.5">
              <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-white/40">
                Stacking charts overlays two or more people's yearly data for the same year. This reveals how energies interact — partnerships, family dynamics, and shared cycles.
              </p>
            </div>

            {/* Add person form */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-wider text-white/40">Add a person to compare</span>
              </div>
              <input
                value={stackName}
                onChange={e => setStackName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-400/30"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={stackBday.m}
                  onChange={e => setStackBday(p => ({ ...p, m: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                  placeholder="MM"
                  className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-400/30 text-center"
                />
                <input
                  value={stackBday.d}
                  onChange={e => setStackBday(p => ({ ...p, d: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                  placeholder="DD"
                  className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-400/30 text-center"
                />
                <input
                  value={stackBday.y}
                  onChange={e => setStackBday(p => ({ ...p, y: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  placeholder="YYYY"
                  className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-400/30 text-center"
                />
              </div>
              <button
                onClick={addStackPerson}
                className="w-full py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold transition-all active:scale-95 hover:bg-cyan-400/15"
              >
                + Add Person
              </button>
            </div>

            {/* Year selector */}
            {stackPeople.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">Year:</span>
                  <div className="flex gap-1">
                    {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                      <button
                        key={y}
                        onClick={() => setStackYear(y)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          stackYear === y
                            ? "bg-cyan-400/20 border border-cyan-400/30 text-cyan-400"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/30"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stacked results */}
                <div className="space-y-2">
                  {stackedData.map((entry, i) => (
                    <SpotlightCard key={i} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold text-white">{entry.name}</span>
                          <span className="text-[10px] text-white/30 ml-2">Age {entry.age}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center rounded-lg bg-white/[0.03] p-2">
                          <p className="text-[9px] text-white/30 mb-0.5">Essence</p>
                          <PulseRing number={entry.essence.value} color="#fbbf24" size="sm" label="ESS" />
                        </div>
                        <div className="text-center rounded-lg bg-white/[0.03] p-2">
                          <p className="text-[9px] text-white/30 mb-0.5">PY</p>
                          <PulseRing number={entry.py.value} color="#3b82f6" size="sm" label="PY" />
                        </div>
                        <div className="text-center rounded-lg bg-white/[0.03] p-2">
                          <p className="text-[9px] text-white/30 mb-0.5">Combiner</p>
                          <PulseRing number={entry.combiner.value} color="#a855f7" size="sm" label="COM" />
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>

                {/* Remove people */}
                <div className="flex flex-wrap gap-1">
                  {stackPeople.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setStackPeople(prev => prev.filter((_, j) => j !== i))}
                      className="text-[9px] px-2 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      ✕ {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </ExpandableCard>
      </FadeIn>
    </div>
  );
}
