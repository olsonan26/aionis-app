import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function SectionExplainer({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-start gap-2 w-full text-left rounded-lg bg-white/[0.02] border border-white/[0.06] px-3 py-2 mb-3 transition-all hover:bg-white/[0.04]"
    >
      <HelpCircle className="h-3.5 w-3.5 mt-0.5 text-amber-400/60 shrink-0" />
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/60">
          What is {title}?
        </span>
        {open && (
          <p className="mt-1 text-[11px] leading-relaxed text-white/40">{description}</p>
        )}
      </div>
    </button>
  );
}
