import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { LETTER_DESCRIPTIONS } from "@/data/letterDescriptions";

interface LetterPopupProps {
  letter: string;
  color?: string;
  className?: string;
  children?: ReactNode;
}

export function LetterPopup({ letter, color = "#fbbf24", className = "", children }: LetterPopupProps) {
  const [open, setOpen] = useState(false);
  const info = LETTER_DESCRIPTIONS[letter.toUpperCase()];

  if (!info) return <span className={className}>{children || letter}</span>;

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`font-bold active:scale-90 transition-transform ${className}`}
        style={{ color }}
      >
        {children || letter}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-[#0e0e1a] border border-white/[0.08] p-5 pb-8 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, color }}
                >
                  {letter.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Letter {letter.toUpperCase()}</p>
                  <p className="text-sm font-semibold text-white/70">
                    Value: {info.value} · {info.type === "vowel" ? "Vowel" : "Consonant"}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full bg-white/[0.05]">
                <X className="h-4 w-4 text-white/40" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/50">{info.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
