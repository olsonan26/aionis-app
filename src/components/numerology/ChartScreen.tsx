import { FadeIn } from "@/components/ui/fade-in";
import { GradientText } from "@/components/ui/glow-text";
import ForensicChart from "@/components/numerology/ForensicChart";
import { Grid3x3, Info } from "lucide-react";

interface ChartScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

export default function ChartScreen({ profile }: ChartScreenProps) {
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
    </div>
  );
}
