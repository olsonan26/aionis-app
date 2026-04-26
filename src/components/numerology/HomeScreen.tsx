import { useMemo, useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { tx } from "@/lib/i18n";
import {
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateDailyEssence,
  calculatePersonDay,
  calculateMonthlyCombiner,
} from "@/lib/numerology";
import {
  dailyEssenceMeanings,
  personalYearMeanings,
  warningPatterns,
} from "@/data/readings";
import { DAILY_ENERGY_MEANINGS, PERSONAL_YEAR_MEANINGS } from "@/lib/descriptions";
import { NUM_COLORS, ESS_DESCRIPTIONS, PME_DESCRIPTIONS, PM_DESCRIPTIONS } from "@/data/viContent";
import { MONTHLY_GUIDANCE } from "@/data/monthlyGuidance";
import { getPMEReading } from "@/data/pmeReadings";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";
import { NumberReveal } from "@/components/ui/animated-counter";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { GlowBorder, ShimmerLine } from "@/components/ui/glow-border";
import { BgPaths } from "@/components/ui/bg-paths";
import { SectionExplainer } from "@/components/ui/section-explainer";
import { NumberSpiral } from "@/components/ui/number-spiral";
import { PulseRing } from "@/components/ui/pulse-ring";
import { ContainerScroll } from "@/components/ui/container-scroll";
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  Sun,
  Moon,
  Eye,
  Zap,
  Heart,
  Shield,
  TrendingUp,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  // HelpCircle — now in SectionExplainer
} from "lucide-react";

interface HomeScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ─── Section Explainer Component ─── */
// SectionExplainer imported from @/components/ui/section-explainer

export default function HomeScreen({ profile }: HomeScreenProps) {
  const { lang } = useLanguage();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();
  const [showAllMonths, setShowAllMonths] = useState(false);

  // Refs for scroll-to-section
  const dailyRef = useRef<HTMLDivElement>(null);
  const personalDayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const combinerRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const calculations = useMemo(() => {
    const py = calculatePersonalYear(profile.day, profile.month, currentYear);
    const pm = calculatePersonalMonth(py.value, currentMonth);
    const de = calculateDailyEssence(profile.name, profile.day, profile.month, profile.year, currentDay, currentMonth, currentYear);
    const pd = calculatePersonDay(profile.day, profile.month, currentDay, currentMonth, currentYear);
    const mcom = calculateMonthlyCombiner(de.value, pm.value);
    const age = currentYear - profile.year;

    const activeWarnings = warningPatterns.filter((w: any) => {
      if (w.level === "day") {
        if (w.type === "compound" && de.compound) {
          const compParts = de.compound.split("/");
          return compParts.some((p: string) => parseInt(p) === w.num);
        }
        if (w.type === "value") return de.value === w.num || (de.compound && de.compound.includes(String(w.num)));
      }
      if (w.level === "month" && w.match) {
        const m = w.match;
        let matches = true;
        if (m.py !== undefined && m.py !== py.value) matches = false;
        if (m.pm !== undefined && m.pm !== pm.value) matches = false;
        if (m.ess !== undefined && m.ess !== de.value) matches = false;
        return matches;
      }
      return false;
    });

    const essValue = de.value;
    const pmeValue = ((essValue + pm.value - 1) % 9) + 1;
    const pmeReading = getPMEReading(pmeValue, pm.value);

    return { py, pm, de, pd, mcom, age, activeWarnings, pmeValue, pmeReading };
  }, [profile, currentDay, currentMonth, currentYear]);

  const { py, pm, de, pd, mcom, age, activeWarnings, pmeValue, pmeReading } = calculations;

  const pyMeaning = personalYearMeanings?.[String(py.value)] || null;
  const deMeaning = dailyEssenceMeanings?.[String(de.value)] || null;
  const monthForecast = pyMeaning?.monthlyForecasts?.[MONTH_NAMES[currentMonth]] || null;

  const pyEssDesc = ESS_DESCRIPTIONS[py.value];
  const pyFallback = PERSONAL_YEAR_MEANINGS[py.value];
  const dailyEnergy = DAILY_ENERGY_MEANINGS[de.value];
  const pmeDesc = PME_DESCRIPTIONS[pmeValue];
  const pmDesc = PM_DESCRIPTIONS[pm.value];

  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const firstName = profile.name.split(" ")[0];
  const monthName = MONTH_NAMES[currentMonth];

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* ═══ Greeting ═══ */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4">
          <BgPaths color="#fbbf24" count={4} className="opacity-50" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40">{dateStr}</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white">
                Hello, <GradientText>{firstName}</GradientText>
              </h1>
              <p className="text-[10px] text-white/25 mt-0.5">
                Born {MONTH_NAMES[profile.month]} {profile.day}, {profile.year}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/20 shadow-lg shadow-amber-400/5">
              <span className="font-display text-lg font-bold text-amber-400">{firstName[0]}</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ═══ Year Context Reminder (small, always visible) ═══ */}
      <FadeIn delay={50}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <PulseRing number={py.value} color={NUM_COLORS.PY.color} size="sm" label="PY" />
          <span className="text-[11px] text-white/40 flex-1">
            Your {currentYear} Personal Year is <span className="font-semibold" style={{ color: NUM_COLORS.PY.color }}>{py.value}</span>
            {pyFallback?.title ? ` — ${pyFallback.title}` : ""}. Keep this in mind as you read today's energy.
          </span>
        </div>
      </FadeIn>

      {/* ═══ TODAY'S ENERGY GRID — TAPPABLE ═══ */}
      <FadeIn delay={100}>
        <div>
          <h3 className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
            <Zap className="h-3.5 w-3.5" /> In Today's Energy
          </h3>
          <SectionExplainer
            title="Today's Energy"
            description="These four numbers represent the different energies influencing your life right now. Tap any one to jump to its detailed reading below. The first tells you how you're likely feeling today, the second reveals the theme of your environment, the third shows how you'll likely feel this month, and the fourth tells you what to focus on this month."
          />
          <GlowBorder color={NUM_COLORS.DE.color} speed={6}>
          <div className="grid grid-cols-2 gap-2.5 p-3">
            {[
              { label: tx("home.energyGrid.de", lang), value: de.value, compound: de.compound, colorKey: 'DE' as const, icon: <Sun className="h-4 w-4" />, ref: dailyRef },
              { label: tx("home.energyGrid.pd", lang), value: pd.value, compound: pd.compound, colorKey: 'CORE' as const, icon: <Eye className="h-4 w-4" />, ref: personalDayRef },
              { label: "How You're Likely to Feel This Month", value: pm.value, compound: pm.compound, colorKey: 'PM' as const, icon: <Moon className="h-4 w-4" />, ref: monthRef },
              { label: "What You Should Focus On This Month", value: mcom.value, compound: mcom.compound, colorKey: 'MCOM' as const, icon: <TrendingUp className="h-4 w-4" />, ref: combinerRef },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.ref)}
                className="text-left active:scale-[0.97] transition-transform"
              >
                <SpotlightCard className="overflow-hidden">
                  <div className="p-3.5 rounded-2xl" style={{ backgroundColor: NUM_COLORS[item.colorKey].bg }}>
                    <div className="flex items-center gap-1.5" style={{ color: NUM_COLORS[item.colorKey].color }}>
                      {item.icon}
                      <span className="text-[9px] font-semibold uppercase tracking-wide leading-tight">{item.label}</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-bold" style={{ color: NUM_COLORS[item.colorKey].color }}>
                        {item.value}
                      </span>
                      {item.compound && (
                        <span className="text-xs text-white/30">{item.compound}</span>
                      )}
                    </div>
                    <span className="text-[9px] text-white/20 mt-1 block">Tap to read more ↓</span>
                  </div>
                </SpotlightCard>
              </button>
            ))}
          </div>
          </GlowBorder>
          <ShimmerLine color={NUM_COLORS.DE.color} />
        </div>
      </FadeIn>

      {/* ═══ ⚠️ CAUTION ALERTS ═══ */}
      {activeWarnings.length > 0 && (
        <FadeIn delay={150}>
          <div className="flex flex-col gap-2">
            <SectionExplainer
              title={tx("home.caution", lang)}
              description="Red warnings appear when certain compound numbers (like 13, 16, or 19) show up in your chart. These aren't bad — they're just reminders to be more mindful. Think of them as yellow traffic lights, not red ones. They highlight areas where extra awareness can help you navigate the day more smoothly."
            />
            {activeWarnings.slice(0, 3).map((w: any, i: number) => (
              <SpotlightCard key={i} spotlightColor="rgba(239, 68, 68, 0.08)" className="border-red-500/20">
                <div className="flex gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-400">{w.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">{w.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ═══ DAILY GUIDANCE — SHOWN FIRST (Day info) ═══ */}
      <div ref={dailyRef}>
        <FadeIn delay={200}>
          <div>
            <h3 className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              <BookOpen className="h-3.5 w-3.5" /> Today's Reading — {dateStr}
            </h3>
            <p className="mb-3 px-1 text-[10px] text-white/25">This is your Day energy. It changes every day.</p>
            <SectionExplainer
              title={tx("home.energyGrid.de", lang)}
              description={`Your Daily Essence (DE) is calculated from your full name, birthday, and today's date. It tells you the specific energy you're working with today, ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. This is the first thing to check when you open the app — it's your personal weather forecast for the day.`}
            />

            {deMeaning && (
              <ExpandableCard
                title="Today's Reading"
                subtitle={`Essence ${de.value} for ${dateStr}`}
                icon={<span style={{ color: NUM_COLORS.DE.color }}><Sparkles className="h-5 w-5" /></span>}
                defaultOpen={true}
                onboardingHint="Your personalized reading for today based on your numbers"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.DE.color }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.DE.color }}>Overview</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{deMeaning.summary}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Lean Into This</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{deMeaning.positive}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Watch For</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{deMeaning.caution}</p>
                  </div>
                </div>
              </ExpandableCard>
            )}

            {dailyEnergy && (
              <div className="mt-2.5 space-y-2">
                {[
                  { icon: <Heart className="h-4 w-4" />, label: `How You'll Feel Today (${dateStr})`, text: dailyEnergy.feel, color: NUM_COLORS.PME.color },
                  { icon: <Eye className="h-4 w-4" />, label: "Your Environment Today", text: dailyEnergy.environment, color: NUM_COLORS.CY.color },
                  { icon: <Shield className="h-4 w-4" />, label: "Today's Advice", text: dailyEnergy.advice, color: NUM_COLORS.DE.color },
                ].map((item) => (
                  <SpotlightCard key={item.label} className="p-3.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* ═══ WEEKLY OUTLOOK ═══ */}
      <FadeIn delay={210}>
        <ExpandableCard
          title={tx("home.weeklyOutlook", lang)}
          subtitle={`${MONTH_NAMES[currentMonth]} ${today.getDate()} – ${today.getDate() + 6}`}
          icon={<Calendar className="h-4 w-4 text-cyan-400" />}
          accentColor="rgba(6,182,212,0.15)"
          defaultOpen={false}
          onboardingHint="See the energy patterns for the rest of this week at a glance."
        >
          <div className="space-y-2 mt-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(today);
              d.setDate(d.getDate() + i);
              const weekDE = calculateDailyEssence(profile.name, profile.day, profile.month, profile.year, d.getDate(), d.getMonth() + 1, d.getFullYear());
              const weekPD = calculatePersonDay(profile.day, profile.month, d.getDate(), d.getMonth() + 1, d.getFullYear());
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
              const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const isToday = i === 0;
              return (
                <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                  isToday ? "bg-cyan-400/[0.06] border border-cyan-400/10" : "bg-white/[0.02]"
                }`}>
                  <div className="w-12 shrink-0">
                    <p className={`text-[10px] font-semibold ${isToday ? "text-cyan-400" : "text-white/40"}`}>{dayName}</p>
                    <p className="text-[9px] text-white/25">{dateLabel}</p>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <PulseRing number={weekDE.value} color={NUM_COLORS.DE.color} size="sm" label="DE" />
                    <PulseRing number={weekPD.value} color={NUM_COLORS.CORE.color} size="sm" label="PD" />
                  </div>
                  {isToday && <span className="text-[8px] text-cyan-400 font-semibold uppercase tracking-wider">Today</span>}
                </div>
              );
            })}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ PERSONAL DAY section ═══ */}
      <div ref={personalDayRef}>
        <FadeIn delay={220}>
          <SectionExplainer
            title={tx("home.energyGrid.pd", lang)}
            description={`Your Personal Day number is calculated from your birth day, birth month, and today's calendar date. It reveals the specific opportunities and challenges that today (${dateStr}) brings to you personally — separate from the broader monthly energy.`}
          />
          <SpotlightCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NUM_COLORS.CORE.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.CORE.color }}>
                  Personal Day — {dateStr}
                </span>
              </div>
              <NumberReveal number={pd.value} compound={pd.compound} size="sm" />
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Your Personal Day number is <span className="font-semibold text-white/70">{pd.value}</span>
              {pd.compound ? ` (from ${pd.compound})` : ""}.
              This energy shapes the specific events and interactions you'll encounter today.
            </p>
          </SpotlightCard>
        </FadeIn>
      </div>

      {/* ═══ MONTHLY READING (PME + PM) ═══ */}
      <div ref={monthRef}>
        <FadeIn delay={280}>
          <div>
            <h3 className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Calendar className="h-3.5 w-3.5" /> {monthName} {currentYear} — Monthly Reading
            </h3>
            <p className="mb-3 px-1 text-[10px] text-white/25">This is your Month energy. It covers all of {monthName}.</p>
            <SectionExplainer
              title="How You're Likely to Feel This Month"
              description={`Your Personal Month is derived from your Personal Year (${py.value}) and the current month (${monthName}). It describes the overall theme, opportunities, and energy you'll be working with throughout ${monthName} ${currentYear}. While your daily energy shifts each day, this monthly energy stays constant and sets the backdrop for everything you experience this month.`}
            />

            {pmeDesc && (
              <ExpandableCard
                title={pmeDesc.title}
                subtitle={`Personal Month Essence ${pmeValue} — What's happening inside you in ${monthName}`}
                icon={<span style={{ color: NUM_COLORS.PME.color }}><Heart className="h-5 w-5" /></span>}
                badge={pmeValue}
                badgeColor="bg-rose-400/10 text-rose-400"
                defaultOpen={true}
                onboardingHint={`Your Personal Month Essence describes your inner emotional state and the deeper lesson you're processing throughout ${monthName}`}
              >
                <p className="text-sm leading-relaxed text-white/60">{pmeDesc.text}</p>
              </ExpandableCard>
            )}

            {pmDesc && (
              <div className="mt-2.5">
                <ExpandableCard
                  title={pmDesc.title}
                  subtitle={`Personal Month ${pm.value} — What's happening around you in ${monthName}`}
                  icon={<span style={{ color: NUM_COLORS.PM.color }}><Eye className="h-5 w-5" /></span>}
                  badge={pm.value}
                  badgeColor="bg-blue-400/10 text-blue-400"
                  onboardingHint={`Your Personal Month describes the outer circumstances, opportunities, and demands showing up around you in ${monthName}`}
                >
                  <p className="text-sm leading-relaxed text-white/60">{pmDesc.text}</p>
                </ExpandableCard>
              </div>
            )}

            {/* Full PME Reading (the 81 combo) */}
            <div ref={combinerRef}>
              {pmeReading && (
                <div className="mt-2.5">
                  <SectionExplainer
                    title="What You Should Focus On This Month"
                    description={`This combines your inner emotional state (PME ${pmeValue}) with your outer environment (PM ${pm.value}) to give you specific, actionable guidance for ${monthName}. This is where the real depth lives — it tells you how to navigate the tension between what you're feeling and what's happening around you.`}
                  />
                  <ExpandableCard
                    title={`${monthName} Monthly Bridge`}
                    subtitle={`PME ${pmeValue} + PM ${pm.value} → PMC ${pmeReading.pmc}`}
                    icon={<span style={{ color: NUM_COLORS.MCOM.color }}><Layers className="h-5 w-5" /></span>}
                    badge={pmeReading.pmc}
                    badgeColor="bg-emerald-400/10 text-emerald-400"
                    onboardingHint={`This is your complete ${monthName} reading — how your inner world meets your outer world`}
                  >
                    <div className="space-y-4">
                      {[
                        { label: `How You Feel in ${monthName}`, text: pmeReading.feel, color: NUM_COLORS.PME.color },
                        { label: `Your Environment in ${monthName}`, text: pmeReading.env, color: NUM_COLORS.PM.color },
                        { label: `${monthName}'s Lesson`, text: pmeReading.lesson, color: "rgb(251, 191, 36)" },
                        { label: `${monthName}'s Main Challenge`, text: pmeReading.challenge, color: "rgb(251, 146, 60)" },
                        { label: "Best Approach", text: pmeReading.approach, color: NUM_COLORS.ESS.color },
                        { label: "Warning", text: pmeReading.warning, color: "rgb(248, 113, 113)" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/[0.05]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">If You Handle {monthName} Well</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/60">{pmeReading.achieve}</p>
                      </div>
                      {pmeReading.summary && (
                        <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
                          <p className="text-xs italic leading-relaxed text-white/50">{pmeReading.summary}</p>
                        </div>
                      )}
                    </div>
                  </ExpandableCard>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Monthly Forecast from data.ts */}
      {monthForecast && (
        <FadeIn delay={350}>
          <ExpandableCard
            title={`${monthName} ${currentYear} Forecast`}
            subtitle={`How ${monthName} fits into your Personal Year ${py.value}`}
            icon={<Calendar className="h-5 w-5" />}
            badge={`PY ${py.value}`}
            onboardingHint={`This forecast shows what ${monthName} specifically looks like within the context of your ${currentYear} Personal Year`}
          >
            <p className="text-sm leading-relaxed text-white/60">{monthForecast}</p>
          </ExpandableCard>
        </FadeIn>
      )}

      {/* ═══ PERSONAL YEAR (the big picture — last) ═══ */}
      <FadeIn delay={400}>
        <ContainerScroll>
          <div>
            <h3 className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Sun className="h-3.5 w-3.5" /> {currentYear} — Your Personal Year
            </h3>
            <p className="mb-3 px-1 text-[10px] text-white/25">This is your Year energy. It's the most important lens — everything else flows from this.</p>
            <SectionExplainer
              title="Personal Year"
              description={`Your Personal Year (PY) is THE most important number to understand. It's calculated from your birth day, birth month, and the current year (${currentYear}). It sets the overall theme for your entire year. Think of it as the landscape you're walking through — your monthly and daily energies are the weather, but this is the terrain. Always read your daily and monthly readings through the lens of your Personal Year.`}
            />
            <SpotlightCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.04] via-transparent to-purple-500/[0.04]" />

              <div className="relative p-5">
                {/* Number Spiral hero */}
                <div className="flex justify-center mb-4">
                  <NumberSpiral centerNumber={py.value} color={NUM_COLORS.PY.color} size={140} />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NUM_COLORS.PY.color }} />
                    <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: NUM_COLORS.PY.color }}>
                      Personal Year {currentYear}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {pyMeaning?.title || pyFallback?.title || `Year of ${py.value}`}
                  </h2>
                </div>

                {/* Full description — never cut off */}
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {pyEssDesc || pyMeaning?.generalIndicators || pyFallback?.summary || ""}
                </p>

                {pyFallback?.keywords && (
                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {pyFallback.keywords.map((kw: string) => (
                      <span key={kw} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {pyFallback?.advice && (
                  <p className="mt-3 text-xs italic text-amber-400/60 text-center">💡 {pyFallback.advice}</p>
                )}
              </div>
            </SpotlightCard>
          </div>
        </ContainerScroll>
      </FadeIn>

      {/* ═══ Year at a Glance with Monthly Descriptions ═══ */}
      <FadeIn delay={450}>
        <ExpandableCard
          title={`${currentYear} Year at a Glance`}
          subtitle="See every month's energy in your personal year"
          icon={<Sun className="h-5 w-5" />}
          onboardingHint="Each month within your Personal Year has its own PME and PM energy. Tap to see titles for each month."
        >
          <div className="space-y-2">
            {Array.from({ length: 12 }, (_, i) => {
              const m = i + 1;
              const pmVal = calculatePersonalMonth(py.value, m);
              const isCurrentMonth = m === currentMonth;
              const monthPmeVal = ((de.value + pmVal.value - 1) % 9) + 1;
              const show = showAllMonths || m <= 3 || isCurrentMonth;

              if (!show) return null;

              return (
                <div
                  key={m}
                  className={`rounded-xl p-3 transition-all ${
                    isCurrentMonth
                      ? "bg-amber-400/[0.06] border border-amber-400/20"
                      : "bg-white/[0.02] border border-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isCurrentMonth ? "text-amber-400" : "text-white/60"}`}>
                        {MONTH_NAMES[m]}
                      </span>
                      {isCurrentMonth && (
                        <span className="text-[9px] rounded-full bg-amber-400/10 text-amber-400 px-1.5 py-0.5">NOW</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span style={{ color: NUM_COLORS.PM.color }}>PM {pmVal.value}</span>
                      <span style={{ color: NUM_COLORS.PME.color }}>PME {monthPmeVal}</span>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/40">
                    {PME_DESCRIPTIONS[monthPmeVal]?.title} · {PM_DESCRIPTIONS[pmVal.value]?.title}
                  </p>
                </div>
              );
            })}

            {!showAllMonths && (
              <button
                onClick={() => setShowAllMonths(true)}
                className="flex items-center justify-center gap-1 w-full py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Show all 12 months
              </button>
            )}
            {showAllMonths && (
              <button
                onClick={() => setShowAllMonths(false)}
                className="flex items-center justify-center gap-1 w-full py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                Show less
              </button>
            )}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ MONTHLY GUIDANCE (all 12 months for current PY) ═══ */}
      <FadeIn delay={480}>
        <div>
          <h3 className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
            <BookOpen className="h-3.5 w-3.5" /> Monthly Guidance — PY {py.value}
          </h3>
          <p className="mb-3 px-1 text-[10px] text-white/25">
            Your month-by-month forecast for this Personal Year. Tap any month to read the full guidance.
          </p>
          <SectionExplainer
            title="Monthly Guidance"
            description="These are your 12 monthly forecasts specific to your Personal Year number. Each month carries its own energy that interacts with your yearly theme. Read the current month first, but also look ahead to prepare for what's coming."
          />
          <div className="space-y-2">
            {MONTH_NAMES.slice(1).map((mName, idx) => {
              const mIdx = idx + 1;
              const isCurrent = mIdx === currentMonth;
              const guidanceText = MONTHLY_GUIDANCE[py.value]?.[mName] || "";
              if (!guidanceText) return null;
              // Show first sentence as preview
              const firstSentence = guidanceText.split(/[.!?]/)[0] + ".";
              return (
                <ExpandableCard
                  key={mName}
                  title={mName}
                  subtitle={isCurrent ? "← Current month" : firstSentence.slice(0, 80) + (firstSentence.length > 80 ? "..." : "")}
                  icon={
                    <span className={isCurrent ? "text-amber-400" : "text-white/30"}>
                      <Calendar className="h-4 w-4" />
                    </span>
                  }
                  badge={String(mIdx).padStart(2, "0")}
                  badgeColor={isCurrent ? "bg-amber-400/15 text-amber-400" : "bg-white/5 text-white/30"}
                  defaultOpen={isCurrent}
                >
                  <div className="space-y-3">
                    {guidanceText.split(/\n\n+/).filter(Boolean).map((para, pi) => (
                      <p key={pi} className="text-sm leading-relaxed text-white/60">
                        {para.trim().charAt(0).toUpperCase() + para.trim().slice(1)}
                      </p>
                    ))}
                  </div>
                </ExpandableCard>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Color Legend */}
      <FadeIn delay={500}>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-3 w-3 text-white/30" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Color Guide</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(NUM_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: val.color }} />
                <span className="text-[9px] text-white/30">{val.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Age Info */}
      <FadeIn delay={550}>
        <div className="flex items-center justify-center gap-2 text-xs text-white/20">
          <span>Age {age}</span>
          <span>·</span>
          <span style={{ color: NUM_COLORS.PY.color }}>PY {py.value}</span>
          <span>·</span>
          <span style={{ color: NUM_COLORS.PM.color }}>PM {pm.value}</span>
          <span>·</span>
          <span style={{ color: NUM_COLORS.DE.color }}>DE {de.value}</span>
        </div>
      </FadeIn>
    </div>
  );
}
