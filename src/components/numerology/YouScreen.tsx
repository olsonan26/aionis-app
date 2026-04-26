import { useMemo, useState, useEffect } from "react";
import NameResonanceQuiz from "./NameResonanceQuiz";
import type { NumerologyProfile } from "@/lib/profileStore";
import {
  calculateCoreNumbers,
  calculatePMEIPlanes,
  calculateMindMode,
  calculateCalledNameValue,
  reduceToSingle,
  expandNamePart,
  getLetterValue,
  personalYear,
  compoundTrail,
} from "@/lib/numerology";
import { PLANE_DESCRIPTIONS, NUMBER_KEYWORDS } from "@/lib/descriptions";
import {
  birthForceDescriptions,
  balanceNumberDescriptions,
  lifePathDescriptions,
  expressionDescriptions,
  soulUrgeDescriptions,
} from "@/data/readings";
import { MIND_MODE_DESCRIPTIONS } from "@/lib/mindMode";
import { MIND_MODE_FULL } from "@/data/mindModeFull";
import { getCareerGuidance } from "@/data/careerGuidance";
import {
  NUM_COLORS,
  FULL_NAME_DESCRIPTIONS,
  MINDS_DEFAULT_MODE,
} from "@/data/viContent";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { FadeIn } from "@/components/ui/fade-in";
// import { GradientText } from "@/components/ui/glow-text";
import {
  User,
  Star,
  Brain,
  Heart,
  Zap,
  Shield,
  Target,
  Gem,
  Sparkles,
  BarChart3,
  Eye,
  Briefcase,
  Info,
  FileText,
  Compass,
  Scale,
  AlertTriangle,
} from "lucide-react";

interface YouScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

export default function YouScreen({ profile }: YouScreenProps) {
  // Load full profile to check for name changes
  const [fullProfile, setFullProfile] = useState<NumerologyProfile | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("aionis_full_profile");
      if (raw) setFullProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const hasNameChange = fullProfile?.nameChanged && (fullProfile?.maidenName || fullProfile?.marriedName);
  const quizNames = useMemo(() => {
    if (!hasNameChange || !fullProfile) return [];
    const names: { label: string; fullName: string }[] = [
      { label: "Birth Name", fullName: fullProfile.fullName },
    ];
    if (fullProfile.marriedName) {
      names.push({ label: "Current Name", fullName: fullProfile.marriedName });
    }
    return names;
  }, [fullProfile, hasNameChange]);

  const core = useMemo(() => calculateCoreNumbers(profile.name, profile.day, profile.month, profile.year), [profile]);
  const planes = useMemo(() => calculatePMEIPlanes(profile.name), [profile.name]);
  const mindMode = useMemo(() => calculateMindMode(profile.name, profile.day), [profile.name, profile.day]);
  const calledName = useMemo(() => {
    const firstName = profile.name.split(" ")[0];
    return calculateCalledNameValue(firstName);
  }, [profile.name]);
  const career = useMemo(() => getCareerGuidance(core.ultimateGoal.value), [core.ultimateGoal.value]);

  // Full name reduction for VI descriptions
  const fullNameValue = useMemo(() => {
    let total = 0;
    for (const ch of profile.name.toUpperCase()) {
      if (/[A-Z]/.test(ch)) {
        const vals: Record<string, number> = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8 };
        total += vals[ch] || 0;
      }
    }
    return reduceToSingle(total);
  }, [profile.name]);

  const fullNameProfile = FULL_NAME_DESCRIPTIONS[fullNameValue];
  const mindText = MINDS_DEFAULT_MODE[mindMode?.value || 0] || MIND_MODE_DESCRIPTIONS[mindMode?.value || 0] || "";
  const mindTextFull = MIND_MODE_FULL[mindMode?.value || 0] || "";

  const firstName = profile.name.split(" ")[0];

  const coreNumbersList = [
    {
      label: "Ultimate Goal",
      number: core.ultimateGoal,
      icon: <Target className="h-5 w-5" />,
      color: "text-amber-400",
      colorHex: "#f59e0b",
      description: lifePathDescriptions?.[core.ultimateGoal.value] || `Your life's ultimate purpose vibrates at ${core.ultimateGoal.value}.`,
      hint: "Your life's highest calling — the mountain you're here to climb",
    },
    {
      label: "Expression",
      number: core.expression,
      icon: <Star className="h-5 w-5" />,
      color: "text-violet-400",
      colorHex: "#a78bfa",
      description: expressionDescriptions?.[core.expression.value] || `Your natural talents and abilities vibrate at ${core.expression.value}.`,
      hint: "How the world sees your talents — the energy you project naturally",
    },
    {
      label: "Soul Urge",
      number: core.soulUrge,
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-400",
      colorHex: "#f472b6",
      description: soulUrgeDescriptions?.[core.soulUrge.value] || `Your deepest desires vibrate at ${core.soulUrge.value}.`,
      hint: "Your deepest inner motivation — what your soul truly craves",
    },
    {
      label: "Birth Force",
      number: core.birthForce,
      icon: <Zap className="h-5 w-5" />,
      color: "text-cyan-400",
      colorHex: "#22d3ee",
      description: birthForceDescriptions?.[String(core.birthForce.value)]?.summary || `Your birth force energy vibrates at ${core.birthForce.value}.`,
      hint: "The raw energy you were born with — your natural power signature",
    },
    {
      label: "Balance",
      number: core.balance,
      icon: <Shield className="h-5 w-5" />,
      color: "text-emerald-400",
      colorHex: "#34d399",
      description: balanceNumberDescriptions?.[String(core.balance.value)]?.summary || `Your balance number vibrates at ${core.balance.value}.`,
      hint: "Your stress response toolkit — how to find center when life shakes you",
    },
  ];

  const planeConfig = [
    { key: "physical", label: "Physical", icon: <Zap className="h-4 w-4" />, color: "bg-red-500", textColor: "text-red-400" },
    { key: "mental", label: "Mental", icon: <Brain className="h-4 w-4" />, color: "bg-blue-500", textColor: "text-blue-400" },
    { key: "emotional", label: "Emotional", icon: <Heart className="h-4 w-4" />, color: "bg-pink-500", textColor: "text-pink-400" },
    { key: "intuitive", label: "Intuitive", icon: <Eye className="h-4 w-4" />, color: "bg-purple-500", textColor: "text-purple-400" },
  ];

  const maxPlane = Math.max(...Object.values(planes.counts));
  const geniusPlanes = Object.entries(planes.counts).filter(([_, v]) => v === maxPlane && maxPlane > 0);

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Profile Header */}
      <FadeIn>
        <SpotlightCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.03] via-transparent to-violet-500/[0.03]" />
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-amber-400/[0.04] blur-3xl" />

          <div className="relative flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 shadow-lg shadow-amber-400/5">
              <span className="font-display text-2xl font-bold text-amber-400">{firstName[0]}</span>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-sm text-white/40">
                Born {profile.month}/{profile.day}/{profile.year} · Age {new Date().getFullYear() - profile.year}
              </p>
              <div className="mt-1.5 flex gap-1.5">
                {coreNumbersList.slice(0, 3).map((c) => (
                  <span key={c.label} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px]" style={{ color: c.colorHex }}>
                    {c.label.split(" ")[0]} {c.number.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* ═══ Name Resonance Quiz (shows if user has multiple names) ═══ */}
      {hasNameChange && quizNames.length >= 2 && (
        <FadeIn delay={100}>
          <NameResonanceQuiz
            birthDay={profile.day}
            birthMonth={profile.month}
            birthYear={profile.year}
            names={quizNames}
            onResult={(result) => {
              // Save which name won
              if (fullProfile) {
                const updated = { ...fullProfile, primaryName: result.winningChartIndex === 0 ? "birth" as const : "married" as const };
                localStorage.setItem("aionis_full_profile", JSON.stringify(updated));
              }
            }}
          />
        </FadeIn>
      )}

      {/* ═══ Full Name Profile (from VI) ═══ */}
      {fullNameProfile && (
        <FadeIn delay={80}>
          <ExpandableCard
            title="Your Full Name Profile"
            subtitle={`Expression ${fullNameValue} — Who you are at your core`}
            icon={<span style={{ color: NUM_COLORS.CORE.color }}><FileText className="h-5 w-5" /></span>}
            badge={fullNameValue}
            badgeColor="bg-purple-300/10 text-purple-300"
            defaultOpen={true}
            onboardingHint="This profile is derived from your full birth name — it reveals your natural wiring, strengths, and blind spots"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.CORE.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.CORE.color }}>Overview</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{fullNameProfile.overview}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Work Style</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{fullNameProfile.workStyle}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NUM_COLORS.ESS.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: NUM_COLORS.ESS.color }}>Abilities</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{fullNameProfile.abilities}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Not Suited For</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{fullNameProfile.notSuited}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Watch For</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">{fullNameProfile.negativeTraits}</p>
              </div>
            </div>
          </ExpandableCard>
        </FadeIn>
      )}

      {/* Core Numbers */}
      <FadeIn delay={100}>
        <div>
          <h3 className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
            <Gem className="h-3.5 w-3.5" /> Your Core Numbers
          </h3>
          <div className="space-y-2.5">
            {coreNumbersList.map((item, i) => (
              <FadeIn key={item.label} delay={150 + i * 60}>
                <ExpandableCard
                  title={item.label}
                  subtitle={NUMBER_KEYWORDS[item.number.value] || ""}
                  icon={<span style={{ color: item.colorHex }}>{item.icon}</span>}
                  badge={item.number.value}
                  badgeColor={`bg-white/5 ${item.color}`}
                  onboardingHint={item.hint}
                >
                  <div className="space-y-3">
                    {item.number.compound && (
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <span>Compound trail:</span>
                        <span className="font-mono text-white/50">{item.number.compound}</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
                  </div>
                </ExpandableCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* PMEI Planes */}
      <FadeIn delay={500}>
        <div>
          <h3 className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
            <BarChart3 className="h-3.5 w-3.5" /> PMEI Planes of Expression
          </h3>

          {/* Section tooltip */}
          <div className="flex gap-2 items-start rounded-xl bg-white/[0.02] border border-white/[0.05] p-2.5 mb-2.5">
            <Info className="h-3.5 w-3.5 text-white/25 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-white/30">
              Your name's letters map to four planes: Physical, Mental, Emotional, and Intuitive.
              The dominant plane reveals your "genius factor" — your strongest natural mode of processing.
            </p>
          </div>

          <SpotlightCard>
            <div className="p-4 space-y-4">
              {geniusPlanes.length > 0 && geniusPlanes.length < 4 && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-400/[0.06] border border-amber-400/10 px-3 py-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-amber-400">
                    Genius Factor: <span className="font-semibold capitalize">{geniusPlanes.map(([k]) => k).join(" & ")}</span> Plane{geniusPlanes.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {planeConfig.map((plane) => {
                const count = planes.counts[plane.key as keyof typeof planes.counts] || 0;
                const pct = maxPlane > 0 ? (count / maxPlane) * 100 : 0;
                const desc = PLANE_DESCRIPTIONS[plane.key];
                const isGenius = count === maxPlane && maxPlane > 0;

                return (
                  <div key={plane.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={plane.textColor}>{plane.icon}</span>
                        <span className="text-sm font-medium text-white/70">{plane.label}</span>
                        {isGenius && (
                          <span className="text-[9px] rounded-full bg-amber-400/10 text-amber-400 px-1.5 py-0.5">GENIUS</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-white/50">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${plane.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(pct, 5)}%`, opacity: 0.7 }}
                      />
                    </div>
                    {desc && <p className="mt-1 text-[10px] text-white/30">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        </div>
      </FadeIn>

      {/* Mind's Default Mode + Hidden Strategy */}
      <FadeIn delay={600}>
        <ExpandableCard
          title="Mind's Default Mode"
          subtitle={mindMode?.title || `Mode ${mindMode?.value}`}
          icon={<Brain className="h-5 w-5 text-violet-400" />}
          badge={mindMode?.value}
          badgeColor="bg-violet-400/10 text-violet-400"
          defaultOpen={true}
          onboardingHint="Your mind's natural resting state — how you think when you're not trying to think"
        >
          <div className="space-y-4">
            {mindMode?.compound && (
              <div className="text-xs text-white/30">
                Compound: <span className="font-mono text-white/50">{mindMode.compound}</span>
              </div>
            )}
            {/* Full description (all paragraphs) */}
            {mindTextFull ? (
              mindTextFull.split(/\n/).filter(Boolean).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-white/60">
                  {para.trim().charAt(0).toUpperCase() + para.trim().slice(1)}
                </p>
              ))
            ) : (
              <p className="text-sm leading-relaxed text-white/60">{mindText}</p>
            )}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* Mind's Hidden Strategy */}
      <FadeIn delay={620}>
        <ExpandableCard
          title="Mind's Hidden Strategy"
          subtitle="How your mind protects you — and where it trips you up"
          icon={<Eye className="h-5 w-5 text-purple-400" />}
          badgeColor="bg-purple-400/10 text-purple-400"
          onboardingHint="Your mind has a built-in survival strategy. Understanding it is the key to growth."
        >
          <div className="space-y-3">
            {mindTextFull ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">The Hidden Trap</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">
                  {/* Extract the "hidden" part — typically the 2nd paragraph */}
                  {mindTextFull.split(/\n/).filter(Boolean)[1]?.trim() || "Your mind's survival strategy works brilliantly most of the time — but under pressure, it can become the very thing holding you back."}
                </p>
                <div className="flex items-center gap-2 mb-1 mt-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">The Reset</span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">
                  {mindTextFull.split(/\n/).filter(Boolean)[2]?.trim() || "Understanding this pattern is the first step. When you catch it happening, you gain the power to choose a different response."}
                </p>
              </>
            ) : (
              <p className="text-sm text-white/50 italic">Full hidden strategy analysis unlocks with the premium Mind Mode profile.</p>
            )}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* Called Name Energy */}
      <FadeIn delay={650}>
        <ExpandableCard
          title="Called Name Energy"
          subtitle={`${firstName} = ${calledName?.value}`}
          icon={<User className="h-5 w-5 text-cyan-400" />}
          badge={calledName?.value}
          badgeColor="bg-cyan-400/10 text-cyan-400"
          onboardingHint="The energy people send to you every time they say your first name"
        >
          <div className="space-y-2">
            {calledName?.compound && (
              <div className="text-xs text-white/30">
                Compound: <span className="font-mono text-white/50">{calledName.compound}</span>
              </div>
            )}
            <p className="text-sm leading-relaxed text-white/60">
              Every time someone calls you "{firstName}", they activate the vibration of {calledName?.value}.
              {NUMBER_KEYWORDS[calledName?.value || 0] && ` This carries the energy of ${NUMBER_KEYWORDS[calledName?.value || 0]?.toLowerCase()}.`}
            </p>
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* Career Guidance */}
      {career && (
        <FadeIn delay={700}>
          <ExpandableCard
            title="Career Guidance"
            subtitle={`Birth Force ${core.birthForce.value} career path`}
            icon={<Briefcase className="h-5 w-5 text-emerald-400" />}
            onboardingHint="Career insights based on your Birth Force number"
          >
            <div className="space-y-3">
              {(career as any).title && (
                <span className="text-sm font-semibold text-white/80">{(career as any).title}</span>
              )}
              {(career as any).description && (
                <p className="text-sm text-white/60">{(career as any).description}</p>
              )}
              {(career as any).careerIdeas && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Career Ideas</span>
                  <p className="mt-1 text-sm text-white/50">{(career as any).careerIdeas.join(". ")}</p>
                </div>
              )}
              {(career as any).keyToSuccess && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Key to Success</span>
                  <p className="mt-1 text-sm text-white/60">{(career as any).keyToSuccess}</p>
                </div>
              )}
              {(career as any).thingsToKeepInMind && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Keep in Mind</span>
                  <p className="mt-1 text-sm text-white/60">{(career as any).thingsToKeepInMind}</p>
                </div>
              )}
            </div>
          </ExpandableCard>
        </FadeIn>
      )}

      {/* ═══ WHO AM I / MY PURPOSE ═══ */}
      <FadeIn delay={720}>
        <ExpandableCard
          title="Who Am I / My Purpose"
          subtitle={`Life Path ${core.ultimateGoal.value} — Your reason for being`}
          icon={<Compass className="h-5 w-5 text-amber-400" />}
          badge={core.ultimateGoal.value}
          badgeColor="bg-amber-400/10 text-amber-400"
          onboardingHint="Your Life Path number reveals the broad strokes of your journey — the lessons you're here to learn and the gifts you're here to share."
        >
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Your Life Path</span>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{lifePathDescriptions[core.ultimateGoal.value] || ""}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Your Expression</span>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{expressionDescriptions[core.ultimateGoal.value] || ""}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">What Drives You (Soul Urge)</span>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{soulUrgeDescriptions[core.soulUrge?.value || core.ultimateGoal.value] || ""}</p>
            </div>
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ MY GROWTH EDGE (WEAKNESS) ═══ */}
      <FadeIn delay={740}>
        <ExpandableCard
          title="My Growth Edge"
          subtitle="Where you tend to stumble — and how to rise"
          icon={<AlertTriangle className="h-5 w-5 text-orange-400" />}
          badgeColor="bg-orange-400/10 text-orange-400"
          onboardingHint="Every number has a shadow side. Understanding yours turns your biggest vulnerability into your greatest strength."
        >
          <div className="space-y-3">
            {(() => {
              const su = soulUrgeDescriptions[core.soulUrge?.value || core.ultimateGoal.value] || "";
              const riskMatch = su.match(/(The risk[s]? (?:is|are)|The danger is|The traps are|Your risks are|The shadow|Your shadow)(.*?)(?:Your task|The work|The antidote|The medicine|The practice|The solution|When you|$)/si);
              const growthMatch = su.match(/(Your task|The work is|The antidote|The medicine|The practice|The solution is|The growth path)(.*?)(?:When you|Choose|Surround|$)/si);
              return (
                <>
                  <div className="rounded-xl bg-orange-400/[0.04] border border-orange-400/10 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Watch For</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">
                      {riskMatch ? (riskMatch[1] + riskMatch[2]).trim() : "Pay attention to moments when your greatest strength becomes rigid or automatic. That's where your growth edge lives."}
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-400/[0.04] border border-emerald-400/10 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">The Path Forward</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">
                      {growthMatch ? (growthMatch[1] + growthMatch[2]).trim() : "Growth comes from catching these patterns in the moment. Each time you notice, you gain power to choose differently."}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ BALANCE IN TIMES OF STRESS ═══ */}
      <FadeIn delay={760}>
        <ExpandableCard
          title="Balance in Times of Stress"
          subtitle={`Balance Number ${core.balance?.value || "—"}`}
          icon={<Scale className="h-5 w-5 text-cyan-400" />}
          badge={core.balance?.value}
          badgeColor="bg-cyan-400/10 text-cyan-400"
          onboardingHint="When life pushes you to the edge, your Balance Number reveals exactly how to regain your footing. This is your emergency protocol."
        >
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-white/60">
              {balanceNumberDescriptions[String(core.balance?.value || "1")]?.description || "Your balance energy gives you a specific toolkit for managing stress and conflict."}
            </p>
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ BIRTH FORCE ═══ */}
      <FadeIn delay={780}>
        <ExpandableCard
          title="Your Birth Force"
          subtitle={`Birth Force ${core.birthForce.value} — Your natural abilities`}
          icon={<Zap className="h-5 w-5 text-yellow-400" />}
          badge={core.birthForce.value}
          badgeColor="bg-yellow-400/10 text-yellow-400"
          onboardingHint="Your Birth Force is the energy you were born with — your natural talents that are always available to you."
        >
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-white/60">
              {birthForceDescriptions[String(core.birthForce.value)]?.description || ""}
            </p>
          </div>
        </ExpandableCard>
      </FadeIn>

      {/* ═══ MY DANGER WINDOWS ═══ */}
      <FadeIn delay={800}>
        {(() => {
          // Build danger windows from essence line + PY analysis
          const currentYear = new Date().getFullYear();
          const age = currentYear - profile.year;
          const parts = profile.name.trim().split(/\s+/).filter(Boolean);
          const cycles = parts.map(expandNamePart).filter((s) => s.length > 0);

          interface DangerWindow {
            ageStart: number;
            yearStart: number;
            type: string;
            severity: "high" | "medium";
            description: string;
            color: string;
          }

          const dangerWindows: DangerWindow[] = [];

          // Scan from current age to +5 years ahead
          for (let a = Math.max(1, age - 1); a <= age + 5; a++) {
            const year = profile.year + a;
            const py = personalYear(profile.day, profile.month, year);
            const pyTrail = compoundTrail(profile.day + profile.month + year);

            // Get active letters at this age
            let essSum = 0;
            let letters = "";
            for (const cyc of cycles) {
              if (cyc.length === 0) continue;
              const letter = cyc[(a - 1) % cyc.length];
              essSum += getLetterValue(letter);
              letters += letter;
            }
            const essTrail = compoundTrail(essSum);

            // Check for karmic debt numbers in PY
            const karmicPY = pyTrail.includes("/13") || pyTrail.includes("/14") || pyTrail.includes("/16") || pyTrail.includes("/19");
            const karmicEss = essTrail.includes("/13") || essTrail.includes("/14") || essTrail.includes("/16") || essTrail.includes("/19");

            // Check for S transit
            const hasS = letters.includes("S");
            // Check VA pattern
            const hasVA = letters.includes("V") && letters.includes("A");

            // Build danger descriptions
            if (hasVA) {
              dangerWindows.push({
                ageStart: a, yearStart: year, type: "VA Pattern",
                severity: "high", color: "text-red-400",
                description: `Major environmental upheaval indicated at age ${a} (${year}). The VA pattern signals significant changes to your physical environment — moves, relocations, or sudden shifts in living/working conditions. Prepare for disruption and have contingency plans ready.`
              });
            }
            if (hasS && (py === 4 || py === 8 || py === 9)) {
              dangerWindows.push({
                ageStart: a, yearStart: year, type: "Emotional Storm",
                severity: "high", color: "text-orange-400",
                description: `Heightened emotional vulnerability at age ${a} (${year}). Letter S transiting with PY ${py} creates intense emotional energy — relationships may be tested, health requires attention, and emotional reactions can lead to regrettable decisions. Practice patience and avoid major commitments during emotional peaks.`
              });
            }
            if (karmicPY) {
              const kNum = pyTrail.match(/(13|14|16|19)/)?.[1];
              const kDesc: Record<string, string> = {
                "13": "Karmic 13 in your Personal Year signals hard work with little reward — shortcuts will backfire. Discipline and persistence are your only path through.",
                "14": "Karmic 14 brings temptation and the risk of excess. Freedom feels urgent but reckless choices now create lasting consequences. Moderation is critical.",
                "16": "Karmic 16 can bring sudden downfalls or humbling events. Ego-driven decisions are especially dangerous. Stay humble and honest.",
                "19": "Karmic 19 tests your independence — you may feel alone or unsupported. The lesson is to lead without dominating and to ask for help when needed."
              };
              dangerWindows.push({
                ageStart: a, yearStart: year, type: `Karmic ${kNum} Year`,
                severity: "medium", color: "text-amber-400",
                description: `${kDesc[kNum || "13"]} This energy is active throughout ${year} (age ${a}).`
              });
            }
            if (karmicEss) {
              dangerWindows.push({
                ageStart: a, yearStart: year, type: "Karmic Essence",
                severity: "medium", color: "text-amber-400",
                description: `Your Essence line carries karmic energy at age ${a} (${year}). ${essTrail.includes("/16") ? "Watch for ego-related setbacks." : essTrail.includes("/13") ? "Hard work periods require extra discipline." : essTrail.includes("/14") ? "Temptation and overindulgence risk." : "Independence lessons intensify."}`
              });
            }
          }

          if (dangerWindows.length === 0) return null;

          return (
            <ExpandableCard
              title="My Danger Windows"
              subtitle={`${dangerWindows.length} alert${dangerWindows.length > 1 ? "s" : ""} in the next 5 years`}
              icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
              badge={dangerWindows.length}
              badgeColor="bg-red-400/10 text-red-400"
              onboardingHint="These are periods where your chart shows converging challenging energies. Being aware of them gives you the power to prepare and navigate wisely."
            >
              <div className="space-y-3">
                {dangerWindows.map((dw, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`h-2 w-2 rounded-full ${dw.severity === "high" ? "bg-red-400" : "bg-amber-400"}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${dw.color}`}>{dw.type}</span>
                      <span className="text-[10px] text-white/30 ml-auto">Age {dw.ageStart} · {dw.yearStart}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{dw.description}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          );
        })()}
      </FadeIn>

      {/* ═══ THE SCIENCE BEHIND THIS APP ═══ */}
      <FadeIn delay={850}>
        <ExpandableCard
          title="The Science Behind This App"
          subtitle="Why numbers reveal patterns in your life"
          icon={<Info className="h-5 w-5 text-blue-400" />}
          badgeColor="bg-blue-400/10 text-blue-400"
          onboardingHint="Curious how this works? This section explains the foundations behind numerological pattern recognition."
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Pythagorean Number System</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                This app uses the Pythagorean numerology system, which maps each letter of the alphabet to a number 1-9. This system dates back to the Greek mathematician Pythagoras (570–495 BC), who believed that mathematical relationships underpin all of nature. His school discovered that musical harmonics, planetary orbits, and natural phenomena all follow numerical patterns — and proposed that the same patterns influence human life through the vibrations embedded in names and dates.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Cyclical Pattern Recognition</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Your Personal Year, Month, and Day cycles are calculated by reducing your birth date combined with the current calendar date. These cycles follow a repeating 9-year pattern, similar to how seasons cycle through nature. Research in chronobiology — the study of biological rhythms — shows that humans are deeply affected by cyclical patterns. Your numerological cycles map these patterns to give you awareness of the energetic "season" you are in, helping you work with the flow rather than against it.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Name Vibration & the Essence Line</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Every letter in your name carries a specific numerical vibration that cycles through your life at a pace determined by its value. The Essence Line — a core feature of this app — tracks which letters are active at each age of your life, creating a unique timeline of influences. Studies in psycholinguistics demonstrate that names influence self-concept and social perception. Your Essence Line goes deeper: it maps the rhythmic unfolding of name energies across your entire lifespan, revealing periods of change, challenge, and opportunity.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Compound Numbers & Karmic Patterns</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Numbers like 13, 14, 16, and 19 are called "karmic debt" numbers because they carry the energy of unresolved lessons. When these appear in your chart, they indicate areas where extra awareness and discipline are needed. The compound trail (e.g., "29/11/2") shows the full reduction pathway, revealing hidden layers of meaning. Master numbers (11, 22, 33) carry amplified potential — they represent higher-octave energy that can manifest as either exceptional ability or intense pressure.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">How to Use This Information</span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                This app is a tool for self-awareness, not prediction. The patterns in your chart highlight tendencies, strengths, and timing — giving you the advantage of awareness. Think of it like a weather forecast: knowing rain is likely helps you prepare, but you still choose whether to carry an umbrella. The most powerful use of numerology is noticing when your lived experience aligns with your chart patterns — that alignment builds trust in the system and helps you make better-informed decisions about timing, relationships, and personal growth.
              </p>
            </div>
          </div>
        </ExpandableCard>
      </FadeIn>
    </div>
  );
}
