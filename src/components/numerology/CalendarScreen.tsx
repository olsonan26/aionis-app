import { useState, useMemo } from "react";
import {
  calculateDailyEssence,
  calculatePersonDay,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateMonthlyCombiner,
} from "@/lib/numerology";
import { dailyEssenceMeanings } from "@/data/readings";
import { DAILY_ENERGY_MEANINGS } from "@/lib/descriptions";
import { NUM_COLORS, PME_DESCRIPTIONS, PM_DESCRIPTIONS } from "@/data/viContent";
import { getPMEReading } from "@/data/pmeReadings";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { FadeIn } from "@/components/ui/fade-in";
import { GlowText, GradientText } from "@/components/ui/glow-text";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sun,
  Eye,
  Heart,
  Shield,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface CalendarScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CAUTION_COMPOUNDS = [13, 16, 19];

export default function CalendarScreen({ profile }: CalendarScreenProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  // Build calendar grid
  const calendarData = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return { firstDay, daysInMonth, weeks };
  }, [viewMonth, viewYear]);

  // Monthly context
  const monthContext = useMemo(() => {
    const py = calculatePersonalYear(profile.day, profile.month, viewYear);
    const pm = calculatePersonalMonth(py.value, viewMonth + 1);
    const pmeVal = ((py.value + pm.value - 1) % 9) + 1;
    const pmeReading = getPMEReading(pmeVal, pm.value);
    return { py, pm, pmeVal, pmeReading };
  }, [profile, viewMonth, viewYear]);

  // Compute daily essences for entire month
  const monthEssences = useMemo(() => {
    const result: Record<number, { de: { value: number; compound: string }; pd: { value: number; compound: string } }> = {};
    for (let d = 1; d <= calendarData.daysInMonth; d++) {
      const de = calculateDailyEssence(profile.name, profile.day, profile.month, profile.year, d, viewMonth + 1, viewYear);
      const pd = calculatePersonDay(profile.day, profile.month, d, viewMonth + 1, viewYear);
      result[d] = { de, pd };
    }
    return result;
  }, [profile, viewMonth, viewYear, calendarData.daysInMonth]);

  // Selected day details
  const selectedDetails = useMemo(() => {
    if (!selectedDay || !monthEssences[selectedDay]) return null;
    const { de, pd } = monthEssences[selectedDay];
    const py = calculatePersonalYear(profile.day, profile.month, viewYear);
    const pm = calculatePersonalMonth(py.value, viewMonth + 1);
    const mcom = calculateMonthlyCombiner(de.value, pm.value);
    const deMeaning = dailyEssenceMeanings?.[String(de.value)];
    const dailyEnergy = DAILY_ENERGY_MEANINGS[de.value];

    const compParts = de.compound ? de.compound.split("/").map(Number) : [];
    const hasCaution = compParts.some((n) => CAUTION_COMPOUNDS.includes(n));

    const dayDate = new Date(viewYear, viewMonth, selectedDay);
    const dayName = dayDate.toLocaleDateString("en-US", { weekday: "long" });

    return { de, pd, py, pm, mcom, deMeaning, dailyEnergy, hasCaution, dayName };
  }, [selectedDay, monthEssences, profile, viewMonth, viewYear]);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      {/* Month Navigation */}
      <FadeIn>
        <div className="flex items-center justify-between px-1">
          <button onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] active:scale-95">
            <ChevronLeft className="h-4 w-4 text-white/60" />
          </button>
          <div className="text-center">
            <h2 className="font-display text-lg font-bold text-white">
              <GradientText>{MONTH_NAMES[viewMonth]}</GradientText> {viewYear}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-[10px]" style={{ color: NUM_COLORS.PM.color }}>PM {monthContext.pm.value}</span>
              <span className="text-white/10">·</span>
              <span className="text-[10px]" style={{ color: NUM_COLORS.PME.color }}>PME {monthContext.pmeVal}</span>
              <span className="text-white/10">·</span>
              <span className="text-[10px]" style={{ color: NUM_COLORS.PY.color }}>PY {monthContext.py.value}</span>
            </div>
          </div>
          <button onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] active:scale-95">
            <ChevronRight className="h-4 w-4 text-white/60" />
          </button>
        </div>
      </FadeIn>

      {/* Monthly Overview */}
      <FadeIn delay={60}>
        <ExpandableCard
          title={`${MONTH_NAMES[viewMonth]} Overview`}
          subtitle={`PME ${monthContext.pmeVal} + PM ${monthContext.pm.value}`}
          icon={<span style={{ color: NUM_COLORS.PM.color }}><Layers className="h-5 w-5" /></span>}
          onboardingHint="Your monthly energy context — the backdrop for all daily readings this month"
        >
          <div className="space-y-3">
            {PME_DESCRIPTIONS[monthContext.pmeVal] && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.PME.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.PME.color }}>
                    Inner State: {PME_DESCRIPTIONS[monthContext.pmeVal].title}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{PME_DESCRIPTIONS[monthContext.pmeVal].text}</p>
              </div>
            )}
            {PM_DESCRIPTIONS[monthContext.pm.value] && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.PM.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.PM.color }}>
                    Outer Theme: {PM_DESCRIPTIONS[monthContext.pm.value].title}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{PM_DESCRIPTIONS[monthContext.pm.value].text}</p>
              </div>
            )}
            {monthContext.pmeReading && (
              <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
                <p className="text-xs italic leading-relaxed text-white/40">{monthContext.pmeReading.summary}</p>
              </div>
            )}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* Calendar Grid */}
      <FadeIn delay={100}>
        <SpotlightCard>
          <div className="p-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-[9px] uppercase tracking-wider text-white/30 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            {calendarData.weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-0.5">
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="aspect-square" />;

                  const ess = monthEssences[day];
                  const isSelected = day === selectedDay;
                  const isTodayCell = isToday(day);
                  const deVal = ess?.de.value || 0;
                  const compParts = ess?.de.compound ? ess.de.compound.split("/").map(Number) : [];
                  const hasCaution = compParts.some((n) => CAUTION_COMPOUNDS.includes(n));

                  return (
                    <button
                      key={di}
                      onClick={() => setSelectedDay(day)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all active:scale-90 ${
                        isSelected
                          ? "border ring-1"
                          : isTodayCell
                          ? "bg-white/[0.06] border border-white/10"
                          : "hover:bg-white/[0.03]"
                      }`}
                      style={isSelected ? { borderColor: NUM_COLORS.DE.color + '60', boxShadow: `0 0 8px ${NUM_COLORS.DE.color}20`, backgroundColor: NUM_COLORS.DE.color + '15' } : undefined}
                    >
                      <span className={`text-[10px] ${isTodayCell ? "text-amber-400 font-bold" : "text-white/40"}`}>
                        {day}
                      </span>
                      <span className="text-sm font-bold" style={{ color: NUM_COLORS.DE.color }}>
                        {deVal}
                      </span>
                      {hasCaution && (
                        <div className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* Color Legend */}
      <FadeIn delay={150}>
        <div className="flex items-center justify-center gap-3 flex-wrap px-4">
          {[
            { label: "DE", colorKey: 'DE' as const },
            { label: "PY", colorKey: 'PY' as const },
            { label: "PM", colorKey: 'PM' as const },
            { label: "COM", colorKey: 'COM' as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NUM_COLORS[item.colorKey].color }} />
              <span className="text-[9px] font-bold" style={{ color: NUM_COLORS[item.colorKey].color }}>{item.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 text-red-400">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-[9px]">caution</span>
          </div>
        </div>
      </FadeIn>

      {/* Selected Day Details */}
      {selectedDay && selectedDetails && (
        <FadeIn key={selectedDay}>
          <div className="space-y-3">
            {/* Day header */}
            <div className="flex items-center gap-2 px-1">
              <Calendar className="h-4 w-4" style={{ color: NUM_COLORS.DE.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.DE.color }}>
                {selectedDetails.dayName}, {MONTH_NAMES[viewMonth]} {selectedDay}
              </span>
            </div>

            {/* Quick numbers — COLOR CODED */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Daily Essence", value: selectedDetails.de.value, compound: selectedDetails.de.compound, colorKey: 'DE' as const },
                { label: "Personal Day", value: selectedDetails.pd.value, compound: selectedDetails.pd.compound, colorKey: 'CORE' as const },
                { label: "Combiner", value: selectedDetails.mcom.value, compound: selectedDetails.mcom.compound, colorKey: 'COM' as const },
              ].map((item) => (
                <SpotlightCard key={item.label} className="overflow-hidden">
                  <div className="p-2.5 text-center" style={{ backgroundColor: NUM_COLORS[item.colorKey].bg }}>
                    <span className="text-[9px] uppercase tracking-wider text-white/30">{item.label}</span>
                    <GlowText className="block font-display text-2xl font-bold" style={{ color: NUM_COLORS[item.colorKey].color }}>
                      {String(item.value)}
                    </GlowText>
                    {item.compound && <span className="text-[9px] text-white/20">{item.compound}</span>}
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* Caution alert */}
            {selectedDetails.hasCaution && (
              <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.08)" className="border-red-500/20">
                <div className="flex gap-3 p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-400">Caution Day</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Compound {selectedDetails.de.compound} detected. Slow down, double-check details, and prioritize safety.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            )}

            {/* Rich reading */}
            {selectedDetails.deMeaning && (
              <ExpandableCard
                title={`Essence ${selectedDetails.de.value} Reading`}
                icon={<span style={{ color: NUM_COLORS.DE.color }}><Sun className="h-5 w-5" /></span>}
                defaultOpen={true}
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.DE.color }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.DE.color }}>Overview</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{selectedDetails.deMeaning.summary}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.ESS.color }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.ESS.color }}>Lean Into This</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{selectedDetails.deMeaning.positive}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Watch For</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{selectedDetails.deMeaning.caution}</p>
                  </div>
                </div>
              </ExpandableCard>
            )}

            {/* Feel / Environment / Advice */}
            {selectedDetails.dailyEnergy && (
              <div className="space-y-2">
                {[
                  { icon: <Heart className="h-4 w-4" />, label: "How You'll Feel", text: selectedDetails.dailyEnergy.feel, colorKey: 'PME' as const },
                  { icon: <Eye className="h-4 w-4" />, label: "Your Environment", text: selectedDetails.dailyEnergy.environment, colorKey: 'CY' as const },
                  { icon: <Shield className="h-4 w-4" />, label: "Today's Advice", text: selectedDetails.dailyEnergy.advice, colorKey: 'DE' as const },
                ].map((item) => (
                  <SpotlightCard key={item.label} className="p-3.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS[item.colorKey].color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS[item.colorKey].color }}>{item.label}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
