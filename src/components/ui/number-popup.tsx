import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

interface NumberPopupProps {
  /** The compound trail string to display, e.g. "20/2" */
  trail: string;
  /** What this number represents */
  label: string;
  /** Description of what this number means */
  description: string;
  /** Color class for the badge */
  color?: string;
  /** Optional className for the trigger */
  className?: string;
  children?: ReactNode;
}

export function NumberPopup({
  trail,
  label,
  description,
  color = "text-amber-400",
  className = "",
  children,
}: NumberPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        {children || (
          <span className={`underline decoration-dotted underline-offset-2 font-mono font-bold ${color}`}>
            {trail}
          </span>
        )}
      </button>

      {/* Popup overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Card */}
          <div
            className="relative w-full max-w-sm rounded-2xl bg-[#161625] border border-white/[0.08] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Number badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] font-display text-lg font-bold ${color}`}>
                {trail.split("/").pop()}
              </div>
              <div>
                <div className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{label}</div>
                <div className="font-mono text-sm text-white/50">{trail}</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-white/60">{description}</p>
          </div>
        </div>
      )}
    </>
  );
}
