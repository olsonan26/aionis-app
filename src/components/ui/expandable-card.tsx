import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  badgeColor?: string;
  className?: string;
  onboardingHint?: string;
}

export function ExpandableCard({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = "bg-amber-400/10 text-amber-400",
  className = "",
  onboardingHint,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showHint, setShowHint] = useState(!!onboardingHint);

  return (
    <SpotlightCard className={`group ${className}`}>
      <button
        onClick={() => {
          setOpen(!open);
          setShowHint(false);
        }}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-amber-400">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-white/90">{title}</span>
            {badge !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-white/40 line-clamp-1">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/30 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Onboarding hint */}
      {showHint && !open && onboardingHint && (
        <div className="mx-4 mb-3 rounded-lg bg-amber-400/5 px-3 py-2 text-xs text-amber-400/70 border border-amber-400/10">
          💡 {onboardingHint}
        </div>
      )}

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          open ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-0">{children}</div>
      </div>
    </SpotlightCard>
  );
}
