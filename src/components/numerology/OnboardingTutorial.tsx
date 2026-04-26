import { useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ChevronRight, X, Sparkles, Eye, Calendar, Heart, BarChart3 } from "lucide-react";

interface OnboardingTutorialProps {
  firstName: string;
  onComplete: () => void;
}

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to AIONIS",
    body: "This app reveals the hidden patterns in your name and birthday. Everything you see is calculated from real numerological science — not horoscopes, not guesses.",
    color: "from-amber-400/20 to-orange-500/20",
    borderColor: "border-amber-400/20",
  },
  {
    icon: Eye,
    title: "Your Daily Energy",
    body: "The Home screen shows four numbers shaping your day: Daily Essence (how you feel), Personal Day (your environment's theme), Personal Month, and Monthly Combiner. Tap any number to learn what it means.",
    color: "from-cyan-400/20 to-blue-500/20",
    borderColor: "border-cyan-400/20",
  },
  {
    icon: Calendar,
    title: "The Bigger Picture",
    body: "Your Personal Year is the main lens — it sets the theme for everything. Day → Week → Month → Year, each layer nests inside the one above it. We show you the daily hook first, but always keep the yearly context in view.",
    color: "from-emerald-400/20 to-green-500/20",
    borderColor: "border-emerald-400/20",
  },
  {
    icon: Heart,
    title: "Sections Explained",
    body: "Every section has a ⓘ info icon that explains what it means and why it matters. If something sounds negative, don't panic — it's about awareness, not prediction. Knowledge is protection.",
    color: "from-pink-400/20 to-rose-500/20",
    borderColor: "border-pink-400/20",
  },
  {
    icon: BarChart3,
    title: "You're Ready",
    body: "Explore your chart, check daily guidance, and ask the AI chatbot anything about your numbers. In Settings (⚙️), you can toggle number display, switch to Spanish, or edit your profile.",
    color: "from-purple-400/20 to-violet-500/20",
    borderColor: "border-purple-400/20",
  },
];

export default function OnboardingTutorial({ firstName, onComplete }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#06060c]/90 backdrop-blur-lg" />

      <div className="relative w-full max-w-sm">
        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute -top-10 right-0 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/25 hover:text-white/50 transition-colors"
        >
          Skip <X className="h-3 w-3" />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-amber-400" : i < step ? "w-4 bg-amber-400/40" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        <SpotlightCard className="overflow-hidden">
          <div className="p-6 text-center">
            {/* Icon */}
            <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${current.color} border ${current.borderColor}`}>
              <Icon className="h-7 w-7 text-white" />
            </div>

            {/* Title */}
            <h2 className="font-display text-xl font-bold text-white mb-3">
              {step === 0 ? (
                <Typewriter text={`${current.title}, ${firstName}`} speed={50} />
              ) : (
                current.title
              )}
            </h2>

            {/* Body */}
            <p className="text-sm leading-relaxed text-white/50">
              {current.body}
            </p>

            {/* Action */}
            <button
              onClick={() => {
                if (isLast) {
                  onComplete();
                } else {
                  setStep(step + 1);
                }
              }}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-95 ${
                isLast
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1]"
              }`}
            >
              {isLast ? "Let's Go! ✨" : "Next"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
