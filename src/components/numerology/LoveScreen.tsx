import { useState, useMemo } from "react";
import {
  calculateCoreNumbers,
  calculateDailyEssence,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateMonthlyCombiner,
  calculateCalledNameValue,
  reduceToSingle,
} from "@/lib/numerology";
import { loveDescriptions } from "@/data/loveDescriptions";
import { getCouplesDailyAdvice } from "@/data/coupleDynamics";
import {
  yearlyEssenceMarriageAdvice as marriageYearly,
  pmeMarriageAdvice as marriagePME,
  mcomMarriageAdvice as marriageMCOM,
} from "@/data/marriageAdvice";
import { buildFiveAreaCompat, calculateOverallCompat, type AreaMatch } from "@/data/fiveAreaCompat";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";
import {
  Heart,
  Sparkles,
  UserPlus,
  ArrowRight,
  Flame,
  MessageCircleHeart,
  Star,
  User,
  Info,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface LoveScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

export default function LoveScreen({ profile }: LoveScreenProps) {
  const [partnerName, setPartnerName] = useState("");
  const [partnerDay, setPartnerDay] = useState("");
  const [partnerMonth, setPartnerMonth] = useState("");
  const [partnerYear, setPartnerYear] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  const userCore = useMemo(() => calculateCoreNumbers(profile.name, profile.day, profile.month, profile.year), [profile]);
  const userFirstName = useMemo(() => calculateCalledNameValue(profile.name.split(" ")[0] || ""), [profile.name]);

  const partnerCore = useMemo(() => {
    if (!partnerName || !partnerDay || !partnerMonth || !partnerYear) return null;
    return calculateCoreNumbers(partnerName, parseInt(partnerDay), parseInt(partnerMonth), parseInt(partnerYear));
  }, [partnerName, partnerDay, partnerMonth, partnerYear]);

  const partnerFirstNameVal = useMemo(() => {
    if (!partnerName) return null;
    return calculateCalledNameValue(partnerName.split(" ")[0] || "");
  }, [partnerName]);

  const hasBirthday = Boolean(partnerDay && partnerMonth && partnerYear);

  const compatibility = useMemo(() => {
    if (!partnerCore || !partnerFirstNameVal) return null;

    const uFN = userFirstName;
    const pFN = partnerFirstNameVal;

    // Get first name love reading
    const fnKey = `${uFN.value}-${pFN.value}`;
    const fnRevKey = `${pFN.value}-${uFN.value}`;
    let firstNameLoveDesc = loveDescriptions.get(fnKey) || loveDescriptions.get(fnRevKey) || null;

    // Replace generic labels with actual names
    if (firstNameLoveDesc) {
      const userFirst = profile.name.split(" ")[0];
      const partnerFirst = partnerName.split(" ")[0] || "Partner";
      firstNameLoveDesc = firstNameLoveDesc
        .replace(new RegExp(`\\b${uFN.value}a\\b`, "gi"), userFirst)
        .replace(new RegExp(`\\b${pFN.value}b\\b`, "gi"), partnerFirst)
        .replace(new RegExp(`\\b${uFN.value}A\\b`, "g"), userFirst)
        .replace(new RegExp(`\\b${pFN.value}B\\b`, "g"), partnerFirst)
        .replace(/\bperson A\b/gi, userFirst)
        .replace(/\bperson B\b/gi, partnerFirst)
        .replace(/\bpartner A\b/gi, userFirst)
        .replace(/\bpartner B\b/gi, partnerFirst)
        .replace(/\bthe first person\b/gi, userFirst)
        .replace(/\bthe second person\b/gi, partnerFirst)
        .replace(/\bthe first partner\b/gi, userFirst)
        .replace(/\bthe second partner\b/gi, partnerFirst);
    }

    // Build 5-area compatibility
    const areas = buildFiveAreaCompat(
      profile.name,
      profile.day,
      profile.month,
      profile.year,
      uFN.value,
      uFN.compound,
      userCore.expression,
      userCore.soulUrge,
      userCore.birthForce,
      partnerName,
      parseInt(partnerDay),
      parseInt(partnerMonth),
      parseInt(partnerYear),
      pFN.value,
      pFN.compound,
      partnerCore.expression,
      partnerCore.soulUrge,
      partnerCore.birthForce,
      firstNameLoveDesc,
    );

    const overallScore = calculateOverallCompat(areas);

    // Today's couple dynamics
    const today = new Date();
    const userDE = calculateDailyEssence(
      profile.name, profile.day, profile.month, profile.year,
      today.getDate(), today.getMonth() + 1, today.getFullYear()
    );
    const partnerDE = calculateDailyEssence(
      partnerName, parseInt(partnerDay), parseInt(partnerMonth), parseInt(partnerYear),
      today.getDate(), today.getMonth() + 1, today.getFullYear()
    );
    const worldDE = reduceToSingle(today.getDate() + (today.getMonth() + 1) + today.getFullYear());

    let coupleAdvice = null;
    try {
      coupleAdvice = getCouplesDailyAdvice(userDE.value, partnerDE.value, worldDE);
    } catch (_e) { /* skip */ }

    return {
      areas,
      overallScore,
      coupleAdvice,
      userDE: userDE.value,
      partnerDE: partnerDE.value,
    };
  }, [partnerCore, partnerFirstNameVal, profile, partnerName, partnerDay, partnerMonth, partnerYear, userCore, userFirstName]);

  const firstName = profile.name.split(" ")[0];
  const partnerFirstName = partnerName.split(" ")[0] || "Partner";

  const handleCalculate = () => {
    if (partnerName) {
      setShowResults(true);
      setExpandedArea(null);
    }
  };

  const harmonyColor = (h: AreaMatch["harmony"]) => {
    if (h === "strong") return { bg: "bg-emerald-400/10", text: "text-emerald-400", border: "border-emerald-400/20", label: "Strong Match" };
    if (h === "moderate") return { bg: "bg-amber-400/10", text: "text-amber-400", border: "border-amber-400/20", label: "Moderate Match" };
    return { bg: "bg-rose-400/10", text: "text-rose-400", border: "border-rose-400/20", label: "Growth Area" };
  };

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Header */}
      <FadeIn>
        <div className="text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 mb-2">
            <Heart className="h-3 w-3 text-pink-400" />
            <span className="text-xs font-semibold text-pink-400">Love & Compatibility</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            Discover Your <GradientText from="from-pink-400" to="to-rose-500">Connection</GradientText>
          </h2>
          <p className="mt-1 text-sm text-white/40">
            5-area compatibility analysis across names, hearts, and birthdays
          </p>
        </div>
      </FadeIn>

      {/* Section Info */}
      <FadeIn delay={50}>
        <div className="flex gap-2 items-start rounded-xl bg-pink-400/[0.04] border border-pink-400/10 p-3">
          <Info className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-white/40">
            We compare <strong className="text-white/50">five key areas</strong> between you and your partner: First Name Number, Whole Name Number, Heart's Desire (the most important for deep compatibility), Day of Birth, and Whole Birthday Number. Enter their name — and birthday if you know it — to unlock the full reading.
          </p>
        </div>
      </FadeIn>

      {/* Your Numbers */}
      <FadeIn delay={100}>
        <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.06)">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{firstName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20">
                <span className="font-display text-xl font-bold text-amber-400">{firstName[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{firstName}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[10px] text-cyan-400/60">First: {userFirstName.value}</span>
                  <span className="text-[10px] text-violet-400/60">Whole: {userCore.expression.value}</span>
                  <span className="text-[10px] text-pink-400/60">Heart: {userCore.soulUrge.value}</span>
                  <span className="text-[10px] text-amber-400/60">Day: {profile.day}</span>
                  <span className="text-[10px] text-emerald-400/60">Bday: {userCore.birthForce.value}</span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* Partner Input */}
      <FadeIn delay={200}>
        <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.06)">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-pink-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">Partner Details</span>
            </div>

            <input
              type="text"
              placeholder="Partner's full name"
              value={partnerName}
              onChange={(e) => { setPartnerName(e.target.value); setShowResults(false); }}
              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-pink-500/30 focus:outline-none focus:ring-1 focus:ring-pink-500/20"
            />

            <p className="text-[10px] text-white/25 px-1">Birthday optional — enter it for the full 5-area reading</p>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Month"
                value={partnerMonth}
                onChange={(e) => { setPartnerMonth(e.target.value); setShowResults(false); }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-pink-500/30 focus:outline-none"
                min={1}
                max={12}
              />
              <input
                type="number"
                placeholder="Day"
                value={partnerDay}
                onChange={(e) => { const v = e.target.value; if (v.length <= 2) { setPartnerDay(v); setShowResults(false); } }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-pink-500/30 focus:outline-none"
                min={1}
                max={31}
              />
              <input
                type="number"
                placeholder="Year"
                value={partnerYear}
                onChange={(e) => { setPartnerYear(e.target.value); setShowResults(false); }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-pink-500/30 focus:outline-none"
                min={1920}
                max={2010}
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={!partnerName}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
            >
              <Sparkles className="h-4 w-4" />
              {hasBirthday ? "Reveal Full Compatibility" : "Match Names"}
            </button>
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* ═══════════ RESULTS ═══════════ */}
      {showResults && compatibility && (
        <>
          {/* Overall Score */}
          <FadeIn delay={100}>
            <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.08)" className="border-pink-500/20">
              <div className="p-5 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/20">
                      <span className="font-display text-xl font-bold text-amber-400">{firstName[0]}</span>
                    </div>
                    <p className="mt-1 text-xs text-amber-400/70 font-medium">{firstName}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
                    <ArrowRight className="h-3 w-3 text-white/20 mt-0.5" />
                  </div>

                  <div className="text-center">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-pink-400/10 border border-pink-400/20">
                      <span className="font-display text-xl font-bold text-pink-400">{partnerFirstName[0]}</span>
                    </div>
                    <p className="mt-1 text-xs text-pink-400/70 font-medium">{partnerFirstName}</p>
                  </div>
                </div>

                {/* Score ring */}
                <div className="relative mx-auto w-24 h-24 mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#loveGrad)" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(compatibility.overallScore / 100) * 264} 264`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="loveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-white">{compatibility.overallScore}%</span>
                  </div>
                </div>

                <p className="text-sm text-white/50">
                  Overall Compatibility
                </p>
                <p className="text-[10px] text-white/25 mt-1">
                  {!hasBirthday ? "Based on name numbers only — add birthday for full analysis" : "Based on all 5 compatibility areas"}
                </p>
              </div>
            </SpotlightCard>
          </FadeIn>

          {/* ═══ 5-Area Breakdown ═══ */}
          <FadeIn delay={150}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-pink-400">
                  5-Area Breakdown
                </span>
              </div>

              {compatibility.areas.map((area, idx) => {
                // If no birthday, only show first_name and expression areas (name-based)
                if (!hasBirthday && !["first_name", "expression", "heart"].includes(area.area)) return null;
                if (!hasBirthday && area.area === "heart" && !partnerName) return null;

                const colors = harmonyColor(area.harmony);
                const isOpen = expandedArea === area.area;

                return (
                  <FadeIn key={area.area} delay={200 + idx * 50}>
                    <button
                      onClick={() => setExpandedArea(isOpen ? null : area.area)}
                      className="w-full text-left"
                    >
                      <SpotlightCard className="overflow-hidden">
                        <div className="p-3.5">
                          {/* Header row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <span className="text-lg">{area.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-white/80">{area.label}</span>
                                  {area.area === "heart" && (
                                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400 font-semibold uppercase tracking-wider">
                                      Most Important
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] text-amber-400/60 font-mono">
                                    {firstName}: {area.userCompound || area.userValue}
                                  </span>
                                  <span className="text-[10px] text-white/15">×</span>
                                  <span className="text-[10px] text-pink-400/60 font-mono">
                                    {partnerFirstName}: {area.partnerCompound || area.partnerValue}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                                {colors.label}
                              </span>
                              <ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </div>

                          {/* Expanded description */}
                          {isOpen && (
                            <div className="mt-3 pt-3 border-t border-white/[0.05]">
                              <p className="text-sm leading-relaxed text-white/55">{area.description}</p>
                            </div>
                          )}
                        </div>
                      </SpotlightCard>
                    </button>
                  </FadeIn>
                );
              })}
            </div>
          </FadeIn>

          {/* Partner's Core Numbers */}
          {partnerCore && hasBirthday && (
            <FadeIn delay={400}>
              <ExpandableCard
                title={`${partnerFirstName}'s Core Numbers`}
                subtitle="Their numerological profile"
                icon={<Star className="h-5 w-5 text-pink-400" />}
                onboardingHint="Understanding your partner's core numbers helps you relate better"
              >
                <div className="space-y-2">
                  {[
                    { label: "First Name", value: partnerFirstNameVal?.value, compound: partnerFirstNameVal?.compound, color: "text-cyan-400" },
                    { label: "Whole Name (Expression)", value: partnerCore.expression.value, compound: partnerCore.expression.compound, color: "text-violet-400" },
                    { label: "Heart's Desire (Soul Urge)", value: partnerCore.soulUrge.value, compound: partnerCore.soulUrge.compound, color: "text-pink-400" },
                    { label: "Day of Birth", value: parseInt(partnerDay), compound: `Day ${partnerDay}`, color: "text-amber-400" },
                    { label: "Whole Birthday (Birth Force)", value: partnerCore.birthForce.value, compound: partnerCore.birthForce.compound, color: "text-emerald-400" },
                    { label: "Ultimate Goal", value: partnerCore.ultimateGoal.value, compound: partnerCore.ultimateGoal.compound, color: "text-white/60" },
                    { label: "Balance", value: partnerCore.balance.value, compound: partnerCore.balance.compound, color: "text-white/40" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-sm text-white/60">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        {item.compound && <span className="text-[10px] text-white/25 font-mono">{item.compound}</span>}
                        <span className={`font-display font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ExpandableCard>
            </FadeIn>
          )}

          {/* Today's Couple Dynamics */}
          {compatibility.coupleAdvice && hasBirthday && (
            <FadeIn delay={450}>
              <ExpandableCard
                title="Today's Couple Energy"
                subtitle={`${firstName} DE ${compatibility.userDE} × ${partnerFirstName} DE ${compatibility.partnerDE}`}
                icon={<Flame className="h-5 w-5 text-orange-400" />}
                defaultOpen={true}
                onboardingHint="How your daily energies interact as a couple today"
              >
                <div className="space-y-3">
                  {compatibility.coupleAdvice.userInsight && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{firstName}'s Energy</span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">{compatibility.coupleAdvice.userInsight}</p>
                    </div>
                  )}
                  {compatibility.coupleAdvice.partnerSupport && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">Supporting {partnerFirstName}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">{compatibility.coupleAdvice.partnerSupport}</p>
                    </div>
                  )}
                  {(compatibility.coupleAdvice as any)?.together && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Together Today</span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">{(compatibility.coupleAdvice as any).together}</p>
                    </div>
                  )}
                  {(compatibility.coupleAdvice as any)?.dateIdea && (
                    <div className="rounded-xl bg-pink-400/[0.04] border border-pink-400/10 p-3">
                      <p className="text-xs text-pink-300/60">💡 Date Idea: {(compatibility.coupleAdvice as any).dateIdea}</p>
                    </div>
                  )}
                </div>
              </ExpandableCard>
            </FadeIn>
          )}

          {/* ═══ ABOUT MY SPOUSE AND I ═══ */}
          {hasBirthday && (
            <FadeIn delay={500}>
              <ExpandableCard
                title={`About ${firstName} & ${partnerFirstName}`}
                subtitle="Relationship guidance for your journey together"
                icon={<MessageCircleHeart className="h-5 w-5 text-rose-400" />}
                badgeColor="bg-rose-400/10 text-rose-400"
                onboardingHint="Personalized marriage and partnership advice based on both your numerological energies this year and month."
              >
                <div className="space-y-4">
                  {(() => {
                    const now = new Date();
                    const userPY = calculatePersonalYear(profile.day, profile.month, now.getFullYear()).value;
                    const pm = calculatePersonalMonth(userPY, now.getMonth() + 1);
                    const userPME = pm.value;
                    const userMCOM = calculateMonthlyCombiner(userPY, now.getMonth() + 1).value;
                    return (
                      <>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Your Year Together (PY {userPY})</span>
                          </div>
                          <p className="text-sm leading-relaxed text-white/60">
                            {marriageYearly[userPY] || "Focus on growing together this year."}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Your Inner State This Month (PME {userPME})</span>
                          </div>
                          <p className="text-sm leading-relaxed text-white/60">
                            {marriagePME[userPME] || marriagePME[userPME > 9 ? userPME : 1] || "Be present with each other this month."}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Your Environment This Month (MCOM {userMCOM})</span>
                          </div>
                          <p className="text-sm leading-relaxed text-white/60">
                            {marriageMCOM[userMCOM] || marriageMCOM[userMCOM > 9 ? userMCOM : 1] || "Navigate this month's energy together."}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </ExpandableCard>
            </FadeIn>
          )}
        </>
      )}

      {/* Empty state */}
      {!showResults && (
        <FadeIn delay={300}>
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/5 border border-pink-500/10 mb-4">
              <Heart className="h-7 w-7 text-pink-400/30" />
            </div>
            <p className="text-sm text-white/30">
              Enter your partner's name to get started — add their birthday for the full 5-area compatibility reading
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
