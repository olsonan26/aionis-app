import { useState, useMemo } from "react";
import {
  buildNameChart,
  generateQuizQuestions,
  scoreQuiz,

  type QuizResult,
} from "@/lib/nameResonanceQuiz";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";
import {
  Dna,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Trophy,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface NameResonanceQuizProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  names: { label: string; fullName: string }[];
  onResult?: (result: QuizResult) => void;
}

export default function NameResonanceQuiz({
  birthDay,
  birthMonth,
  birthYear,
  names,
  onResult,
}: NameResonanceQuizProps) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentAge = new Date().getFullYear() - birthYear;
  void birthMonth; void birthDay; // used in parent for profile context

  const { charts, questions } = useMemo(() => {
    const ch = names.map(n => buildNameChart(n.label, n.fullName));
    const qs = generateQuizQuestions(ch, birthYear, currentAge);
    return { charts: ch, questions: qs };
  }, [names, birthYear, currentAge]);

  const handleAnswer = (yes: boolean) => {
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: yes };
    setAnswers(newAnswers);
    setShowHint(false);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Done — score it
      const r = scoreQuiz(charts, questions, newAnswers);
      setResult(r);
      onResult?.(r);
    }
  };

  // ── Intro Screen ──
  if (!started) {
    return (
      <FadeIn>
        <SpotlightCard className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Dna className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">
            <GradientText>Name Resonance Quiz</GradientText>
          </h2>
          <p className="text-sm text-white/50 mb-4 max-w-md mx-auto">
            Your name creates a unique vibration pattern over time. When someone changes their name — through marriage, adoption, or choice — it shifts the pattern.
          </p>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
            We'll compare {names.length} charts and ask about key moments in your life. Your answers reveal which name vibration is most active.
          </p>
          <div className="space-y-2 mb-6">
            {names.map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-cyan-400" : i === 1 ? "bg-rose-400" : "bg-amber-400"}`} />
                <span className="text-sm text-white/70">{n.label}: <span className="text-white font-medium">{n.fullName}</span></span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-sm hover:bg-purple-500/30 transition-all"
          >
            Begin Quiz <ChevronRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-white/30 mt-3">{questions.length} questions • ~2 minutes</p>
        </SpotlightCard>
      </FadeIn>
    );
  }

  // ── Result Screen ──
  if (result) {
    const winner = result.breakdown[result.winningChartIndex];
    const colors = ["text-cyan-400", "text-rose-400", "text-amber-400"];
    const bgColors = ["bg-cyan-400", "bg-rose-400", "bg-amber-400"];

    return (
      <FadeIn>
        <SpotlightCard className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Your Active Name</h2>
          <p className="text-2xl font-display font-bold mt-2">
            <GradientText>{names[result.winningChartIndex].fullName}</GradientText>
          </p>
          <p className="text-sm text-white/40 mt-1 mb-6">
            {winner.chartLabel} • {result.confidence}% confidence
          </p>
          <div className="space-y-2 mb-6">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`h-3 w-3 rounded-full ${bgColors[i] || "bg-white"}`} />
                <span className="text-sm text-white/60 flex-1 text-left">{b.chartLabel}</span>
                <span className={`text-sm font-bold ${colors[i] || "text-white"}`}>
                  {b.matchedQuestions} matches • score {b.score}
                </span>
                {i === result.winningChartIndex && <Sparkles className="h-4 w-4 text-amber-400" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 max-w-sm mx-auto">
            This name's vibration most closely matches your life experiences. The app will use this chart for your readings.
          </p>
        </SpotlightCard>
      </FadeIn>
    );
  }

  // ── Question Screen ──
  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <FadeIn>
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/40 font-mono">{currentQ + 1}/{questions.length}</span>
        </div>

        <SpotlightCard className="p-6">
          {/* Age/year badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-white/50">Age {q.age}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-white/50">{q.calendarYear}</span>
            </div>
          </div>

          {/* Question */}
          <p className="text-base text-white/80 leading-relaxed mb-6">{q.questionText}</p>

          {/* Hint */}
          {showHint && (
            <FadeIn>
              <div className="rounded-xl bg-purple-400/[0.05] border border-purple-400/10 p-3 mb-4">
                <p className="text-xs text-purple-300/60">{q.hintText}</p>
              </div>
            </FadeIn>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-all"
            >
              <Check className="h-4 w-4" /> Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-sm hover:bg-rose-500/20 transition-all"
            >
              <X className="h-4 w-4" /> No / Not Sure
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Why this question?"}
            </button>
            {currentQ > 0 && (
              <button
                onClick={() => { setCurrentQ(currentQ - 1); setShowHint(false); }}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
          </div>
        </SpotlightCard>
      </div>
    </FadeIn>
  );
}
