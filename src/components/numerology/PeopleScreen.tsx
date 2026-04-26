import { useState, useMemo, useCallback } from "react";
import {
  calculateCoreNumbers,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateMonthlyCombiner,
  calculateDailyEssence,
  calculateCalledNameValue,
} from "@/lib/numerology";
import { birthForceDescriptions, expressionDescriptions, soulUrgeDescriptions } from "@/data/readings";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";

import {
  UserPlus,
  Users,
  Baby,
  Trash2,
  Eye,
  Sparkles,
  BookOpen,
  Heart,
  Star,
  Info,
  ChevronRight,
  Save,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SAVED CHARTS STORAGE
   ═══════════════════════════════════════════════════════ */

interface SavedChart {
  id: string;
  name: string;
  day: number;
  month: number;
  year: number;
  relationship: "person" | "child" | "friend" | "family" | "coworker";
  createdAt: number;
}

const SAVED_CHARTS_KEY = "aionis_saved_charts";

function loadSavedCharts(): SavedChart[] {
  try {
    const raw = localStorage.getItem(SAVED_CHARTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveSavedCharts(charts: SavedChart[]) {
  localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(charts));
}

/* ═══════════════════════════════════════════════════════
   CHILD GUIDANCE DATA
   ═══════════════════════════════════════════════════════ */

const childGuidance: Record<number, { strength: string; challenge: string; parentTip: string }> = {
  1: {
    strength: "Natural leader with strong independence. This child has a pioneering spirit — they want to do things their own way and will resist being told what to do without understanding why.",
    challenge: "Can be stubborn, impatient, or overly dominant with other children. May struggle with teamwork or taking direction.",
    parentTip: "Give them choices rather than commands. Let them lead age-appropriate decisions. Channel their independence into constructive projects. Praise initiative, but gently teach that listening to others is also a form of strength."
  },
  2: {
    strength: "Emotionally sensitive, intuitive, and naturally diplomatic. This child picks up on the feelings of everyone around them and craves harmony in the home.",
    challenge: "Can be overly sensitive to criticism, indecisive, or prone to people-pleasing. May internalize conflict and become anxious in tense environments.",
    parentTip: "Create a peaceful home environment. Validate their feelings rather than dismissing them as 'too sensitive.' Encourage them to voice their own needs. Teach them that conflict is normal and doesn't mean something is wrong."
  },
  3: {
    strength: "Creative, expressive, and joyful. This child lights up a room with their imagination, storytelling, and natural charm. They thrive with art, music, and social interaction.",
    challenge: "Can scatter their energy, exaggerate, or struggle with follow-through. May use humor to avoid difficult emotions.",
    parentTip: "Provide creative outlets — art supplies, instruments, writing journals. Help them finish what they start before beginning something new. When they use humor to deflect, gently redirect to the real feeling underneath."
  },
  4: {
    strength: "Reliable, methodical, and detail-oriented. This child builds things carefully and takes pride in doing things right. They value routine and structure.",
    challenge: "Can be rigid, resistant to change, or overly focused on rules. May struggle with transitions or unexpected changes in plans.",
    parentTip: "Provide consistent routines and advance notice of changes. Celebrate their thoroughness. Gradually expose them to flexibility by making small changes fun. Teach them that mistakes are learning opportunities, not failures."
  },
  5: {
    strength: "Adventurous, curious, and adaptable. This child wants to experience everything and learns through hands-on exploration. They're naturally resourceful and quick-thinking.",
    challenge: "Can be restless, impulsive, or struggle with boundaries. May resist routine and seek stimulation constantly.",
    parentTip: "Channel their energy into structured adventures — sports, travel, new hobbies. Set clear but not restrictive boundaries. Rotate activities to prevent boredom. Teach them that freedom comes with responsibility."
  },
  6: {
    strength: "Nurturing, responsible, and family-oriented. This child naturally takes care of others and wants everyone to be happy. They have a strong sense of right and wrong.",
    challenge: "Can become a little caretaker too early, taking on others' problems. May be perfectionistic or overly critical of themselves.",
    parentTip: "Let them be a child — don't let them parent their siblings or take on adult responsibilities. Praise effort, not perfection. Show them that they deserve care too, not just the act of giving it."
  },
  7: {
    strength: "Deep thinker, analytical, and intuitive. This child asks 'why?' constantly and needs time alone to process their thoughts. They often have a rich inner world.",
    challenge: "Can isolate themselves, seem aloof, or struggle with social situations. May overthink and become anxious about things they can't control.",
    parentTip: "Respect their need for alone time — it's not antisocial, it's how they recharge. Answer their questions honestly (even when they're hard). Encourage social activities without forcing them. Introduce meditation or journaling early."
  },
  8: {
    strength: "Ambitious, confident, and naturally authoritative. This child is a born achiever who sets goals and works toward them with impressive determination.",
    challenge: "Can be controlling, materialistic, or struggle with losing. May equate their worth with achievement or possessions.",
    parentTip: "Teach them that who they are matters more than what they accomplish. Give them leadership opportunities with clear boundaries. Model healthy relationships with money and power. Celebrate character qualities, not just achievements."
  },
  9: {
    strength: "Compassionate, wise beyond their years, and emotionally generous. This child feels deeply for others and has a natural sense of justice and fairness.",
    challenge: "Can be overly idealistic, prone to disappointment, or give too much of themselves. May struggle with letting go of people or situations.",
    parentTip: "Validate their big feelings and idealism — don't tell them to 'toughen up.' Channel their compassion into age-appropriate service (helping at shelters, etc). Teach them healthy boundaries: caring doesn't mean carrying everyone's pain."
  },
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface PeopleScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

export default function PeopleScreen({ profile }: PeopleScreenProps) {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>(loadSavedCharts);
  const [viewingChart, setViewingChart] = useState<SavedChart | null>(null);
  const [mode, setMode] = useState<"list" | "add" | "view">("list");

  // Add form state
  const [inputName, setInputName] = useState("");
  const [inputDay, setInputDay] = useState("");
  const [inputMonth, setInputMonth] = useState("");
  const [inputYear, setInputYear] = useState("");
  const [inputRelationship, setInputRelationship] = useState<SavedChart["relationship"]>("person");

  // Number popup state
  const [popup, setPopup] = useState<{ title: string; desc: string } | null>(null);

  const resetForm = useCallback(() => {
    setInputName("");
    setInputDay("");
    setInputMonth("");
    setInputYear("");
    setInputRelationship("person");
  }, []);

  const handleSave = useCallback(() => {
    if (!inputName || !inputDay || !inputMonth || !inputYear) return;
    const newChart: SavedChart = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: inputName,
      day: parseInt(inputDay),
      month: parseInt(inputMonth),
      year: parseInt(inputYear),
      relationship: inputRelationship,
      createdAt: Date.now(),
    };
    const updated = [...savedCharts, newChart];
    setSavedCharts(updated);
    saveSavedCharts(updated);
    setViewingChart(newChart);
    setMode("view");
    resetForm();
  }, [inputName, inputDay, inputMonth, inputYear, inputRelationship, savedCharts, resetForm]);

  const handleDelete = useCallback((id: string) => {
    const updated = savedCharts.filter((c) => c.id !== id);
    setSavedCharts(updated);
    saveSavedCharts(updated);
    if (viewingChart?.id === id) {
      setViewingChart(null);
      setMode("list");
    }
  }, [savedCharts, viewingChart]);

  const handleViewChart = useCallback((chart: SavedChart) => {
    setViewingChart(chart);
    setMode("view");
  }, []);

  // Current person's computed data
  const personData = useMemo(() => {
    if (!viewingChart) return null;
    const { name, day, month, year } = viewingChart;
    const core = calculateCoreNumbers(name, day, month, year);
    const now = new Date();
    const py = calculatePersonalYear(day, month, now.getFullYear());
    const pm = calculatePersonalMonth(py.value, now.getMonth() + 1);
    const mc = calculateMonthlyCombiner(py.value, now.getMonth() + 1);
    const de = calculateDailyEssence(name, day, month, year, now.getDate(), now.getMonth() + 1, now.getFullYear());
    const calledName = calculateCalledNameValue(name.split(" ")[0] || "");
    const isChild = viewingChart.relationship === "child";
    const bfSingle = core.birthForce.value;
    const childInfo = isChild ? childGuidance[bfSingle] || childGuidance[9] : null;
    return { core, py, pm, mc, de, calledName, isChild, childInfo, name, day, month, year };
  }, [viewingChart]);

  const firstName = viewingChart?.name.split(" ")[0] || "Person";

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentMonthName = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const relIcons: Record<string, string> = {
    person: "👤",
    child: "🧒",
    friend: "🫂",
    family: "👪",
    coworker: "💼",
  };

  return (
    <div className="flex flex-col gap-5 pb-24 pt-2">
      {/* Number popup */}
      {popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setPopup(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#161625] border border-white/[0.08] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPopup(null)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors">✕</button>
            <div className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">{popup.title}</div>
            <p className="text-sm leading-relaxed text-white/60">{popup.desc}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <FadeIn>
        <div className="text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 mb-2">
            <Users className="h-3 w-3 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400">People & Charts</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            <GradientText from="from-violet-400" to="to-cyan-400">Insight Into Others</GradientText>
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Look up anyone's numerology — friends, family, children, coworkers
          </p>
        </div>
      </FadeIn>

      {/* Section explainer */}
      <FadeIn delay={50}>
        <div className="flex gap-2 items-start rounded-xl bg-violet-400/[0.04] border border-violet-400/10 p-3">
          <Info className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-white/40">
            Enter anyone's name and birthday to see their core numbers, current personal year, and what's happening in their life right now. Save charts to quickly check back on the people in your life. <strong className="text-white/50">For children</strong>, select "My Child" to unlock parenting-specific guidance.
          </p>
        </div>
      </FadeIn>

      {/* ═══ MODE: LIST ═══ */}
      {mode === "list" && (
        <>
          {/* Add New Button */}
          <FadeIn delay={100}>
            <button
              onClick={() => setMode("add")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              Look Up Someone New
            </button>
          </FadeIn>

          {/* Saved Charts List */}
          {savedCharts.length > 0 && (
            <FadeIn delay={200}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Save className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-400">
                    Saved Charts ({savedCharts.length})
                  </span>
                </div>

                {savedCharts.map((chart) => {
                  const core = calculateCoreNumbers(chart.name, chart.day, chart.month, chart.year);
                  const py = calculatePersonalYear(chart.day, chart.month, currentYear);

                  return (
                    <SpotlightCard key={chart.id} spotlightColor="rgba(139, 92, 246, 0.06)">
                      <div className="p-3.5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 border border-violet-400/20 text-lg">
                          {relIcons[chart.relationship] || "👤"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{chart.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-white/30">
                              BF {core.birthForce.value} · PY {py.value} · UG {core.ultimateGoal.value}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewChart(chart)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-400 hover:bg-violet-400/20 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${chart.name}'s chart?`)) handleDelete(chart.id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </FadeIn>
          )}

          {/* Empty state */}
          {savedCharts.length === 0 && (
            <FadeIn delay={200}>
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/5 border border-violet-500/10 mb-4">
                  <Users className="h-7 w-7 text-violet-400/30" />
                </div>
                <p className="text-sm text-white/30">
                  No saved charts yet. Look up someone to get started!
                </p>
              </div>
            </FadeIn>
          )}
        </>
      )}

      {/* ═══ MODE: ADD ═══ */}
      {mode === "add" && (
        <FadeIn delay={100}>
          <SpotlightCard spotlightColor="rgba(139, 92, 246, 0.06)">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Look Up Someone</span>
                </div>
                <button
                  onClick={() => { setMode("list"); resetForm(); }}
                  className="text-[10px] text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                placeholder="Full name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
              />

              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="Month" value={inputMonth} onChange={(e) => setInputMonth(e.target.value)} min={1} max={12}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none" />
                <input type="number" placeholder="Day" value={inputDay} onChange={(e) => { if (e.target.value.length <= 2) setInputDay(e.target.value); }} min={1} max={31}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none" />
                <input type="number" placeholder="Year" value={inputYear} onChange={(e) => setInputYear(e.target.value)} min={1920} max={2025}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white text-center placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none" />
              </div>

              {/* Relationship selector */}
              <div className="flex flex-wrap gap-1.5">
                {(["person", "child", "friend", "family", "coworker"] as const).map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setInputRelationship(rel)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all ${
                      inputRelationship === rel
                        ? "bg-violet-400/20 text-violet-400 border border-violet-400/30"
                        : "bg-white/[0.04] text-white/30 border border-white/[0.06] hover:text-white/50"
                    }`}
                  >
                    <span>{relIcons[rel]}</span>
                    <span className="capitalize">{rel === "child" ? "My Child" : rel}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSave}
                disabled={!inputName || !inputDay || !inputMonth || !inputYear}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-30"
              >
                <Sparkles className="h-4 w-4" />
                Save & View Chart
              </button>
            </div>
          </SpotlightCard>
        </FadeIn>
      )}

      {/* ═══ MODE: VIEW ═══ */}
      {mode === "view" && viewingChart && personData && (
        <>
          {/* Back button */}
          <FadeIn delay={50}>
            <button
              onClick={() => { setViewingChart(null); setMode("list"); }}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ChevronRight className="h-3 w-3 rotate-180" />
              Back to saved charts
            </button>
          </FadeIn>

          {/* Person Header */}
          <FadeIn delay={100}>
            <SpotlightCard spotlightColor="rgba(139, 92, 246, 0.08)">
              <div className="p-4 text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-violet-400/10 border border-violet-400/20 mb-3 text-2xl">
                  {relIcons[viewingChart.relationship] || "👤"}
                </div>
                <h3 className="font-display text-lg font-bold text-white">{viewingChart.name}</h3>
                <p className="text-xs text-white/30 mt-0.5">
                  Born {MONTHS[viewingChart.month - 1]} {viewingChart.day}, {viewingChart.year}
                </p>

                {/* Quick numbers row */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[
                    { label: "Birth Force", val: personData.core.birthForce.compound, color: "text-cyan-400", desc: (birthForceDescriptions as any)[personData.core.birthForce.value]?.description || "" },
                    { label: "Expression", val: personData.core.expression.compound, color: "text-violet-400", desc: expressionDescriptions[personData.core.expression.value] || "" },
                    { label: "Heart's Desire", val: personData.core.soulUrge.compound, color: "text-pink-400", desc: soulUrgeDescriptions[personData.core.soulUrge.value] || "" },
                    { label: "UG", val: personData.core.ultimateGoal.compound, color: "text-amber-400", desc: "" },
                    { label: "PY", val: String(personData.py.value), color: "text-emerald-400", desc: "" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => item.desc && setPopup({ title: `${firstName}'s ${item.label}`, desc: item.desc })}
                      className="text-center"
                    >
                      <div className={`font-display text-lg font-bold ${item.color}`}>{item.val}</div>
                      <div className="text-[8px] text-white/25 leading-tight">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </FadeIn>

          {/* ═══ CHILD-SPECIFIC: Parenting Guidance ═══ */}
          {personData.isChild && personData.childInfo && (
            <FadeIn delay={150}>
              <ExpandableCard
                title={`Helping ${firstName}`}
                subtitle="Parenting guidance based on their core energy"
                icon={<Baby className="h-5 w-5 text-pink-400" />}
                defaultOpen={true}
                onboardingHint={`Personalized parenting guidance for a Birth Force ${personData.core.birthForce.value} child.`}
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Their Natural Strength</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{personData.childInfo.strength}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Their Growth Challenge</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{personData.childInfo.challenge}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">How to Support Them</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{personData.childInfo.parentTip}</p>
                  </div>
                </div>
              </ExpandableCard>
            </FadeIn>
          )}

          {/* Current Personal Year */}
          <FadeIn delay={200}>
            <ExpandableCard
              title={`${firstName}'s ${currentYear}`}
              subtitle={`Personal Year ${personData.py.value}`}
              icon={<Star className="h-5 w-5 text-emerald-400" />}
              defaultOpen={true}
              onboardingHint={`What ${firstName} is experiencing this year based on their personal year cycle.`}
            >
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Personal Year {personData.py.value}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{`${firstName} is in a Personal Year ${personData.py.value} cycle.`}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">{currentMonthName} (PM {personData.pm.value})</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{`Personal Month ${personData.pm.value} energy is active for ${firstName} this month.`}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Monthly Combiner {personData.mc.value}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{`Monthly Combiner ${personData.mc.value} — this blends the year and month energies.`}</p>
                </div>
              </div>
            </ExpandableCard>
          </FadeIn>

          {/* Core Profile */}
          <FadeIn delay={250}>
            <ExpandableCard
              title={`${firstName}'s Core Numbers`}
              subtitle="Their complete numerological profile"
              icon={<BookOpen className="h-5 w-5 text-cyan-400" />}
              onboardingHint={`A breakdown of all core numbers derived from ${firstName}'s name and birthday.`}
            >
              <div className="space-y-2">
                {[
                  { label: "First Name", value: personData.calledName.value, compound: personData.calledName.compound, color: "text-cyan-400" },
                  { label: "Expression (Whole Name)", value: personData.core.expression.value, compound: personData.core.expression.compound, color: "text-violet-400", desc: expressionDescriptions[personData.core.expression.value] },
                  { label: "Heart's Desire (Soul Urge)", value: personData.core.soulUrge.value, compound: personData.core.soulUrge.compound, color: "text-pink-400", desc: soulUrgeDescriptions[personData.core.soulUrge.value] },
                  { label: "Birth Force", value: personData.core.birthForce.value, compound: personData.core.birthForce.compound, color: "text-emerald-400", desc: (birthForceDescriptions as any)[personData.core.birthForce.value]?.description },
                  { label: "Ultimate Goal", value: personData.core.ultimateGoal.value, compound: personData.core.ultimateGoal.compound, color: "text-amber-400" },
                  { label: "Balance", value: personData.core.balance?.value || 0, compound: personData.core.balance?.compound || "—", color: "text-white/40" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => (item as any).desc && setPopup({ title: `${firstName}'s ${item.label}`, desc: (item as any).desc })}
                    className="w-full flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 text-left"
                  >
                    <span className="text-sm text-white/60">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/20 font-mono">{item.compound}</span>
                      <span className={`font-display font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ExpandableCard>
          </FadeIn>

          {/* Today's Energy */}
          <FadeIn delay={300}>
            <ExpandableCard
              title={`${firstName}'s Today`}
              subtitle={`Daily Essence ${personData.de.value} — How they're likely feeling`}
              icon={<Sparkles className="h-5 w-5 text-amber-400" />}
              onboardingHint={`Based on ${firstName}'s personal cycles for today.`}
            >
              <p className="text-sm leading-relaxed text-white/60">
                {`${firstName} is experiencing a Daily Essence of ${personData.de.value} today.`}
              </p>
            </ExpandableCard>
          </FadeIn>


          {/* Relationship to YOU */}
          {viewingChart.relationship !== "person" && (
            <FadeIn delay={400}>
              <ExpandableCard
                title={`${firstName} & ${profile.name.split(" ")[0]}`}
                subtitle={`How your energies interact as ${viewingChart.relationship === "child" ? "parent & child" : viewingChart.relationship}`}
                icon={<Heart className="h-5 w-5 text-pink-400" />}
                onboardingHint="Quick comparison of your core numbers with theirs."
              >
                <div className="space-y-2">
                  {(() => {
                    const yourCore = calculateCoreNumbers(profile.name, profile.day, profile.month, profile.year);
                    const pairs = [
                      { label: "Birth Force", you: yourCore.birthForce.value, them: personData.core.birthForce.value },
                      { label: "Expression", you: yourCore.expression.value, them: personData.core.expression.value },
                      { label: "Heart's Desire", you: yourCore.soulUrge.value, them: personData.core.soulUrge.value },
                    ];
                    return pairs.map((pair) => (
                      <div key={pair.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                        <span className="text-sm text-white/60">{pair.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-400 font-mono">You: {pair.you}</span>
                          <span className="text-[10px] text-white/15">×</span>
                          <span className="text-xs text-violet-400 font-mono">{firstName}: {pair.them}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                            pair.you === pair.them ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/25"
                          }`}>
                            {pair.you === pair.them ? "Match!" : ""}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </ExpandableCard>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
