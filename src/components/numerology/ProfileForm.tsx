import { useState } from "react";
import type { NumerologyProfile } from "../../lib/profileStore";
import { Shield, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  onSubmit: (profile: NumerologyProfile) => void;
  initial?: NumerologyProfile | null;
  compact?: boolean;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function ProfileForm({ onSubmit, initial, compact }: Props) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [month, setMonth] = useState(initial?.birthMonth?.toString() || "");
  const [day, setDay] = useState(initial?.birthDay?.toString() || "");
  const [year, setYear] = useState(initial?.birthYear?.toString() || "");
  const [nameChanged, setNameChanged] = useState<boolean | null>(initial?.nameChanged ?? null);
  const [maidenName, setMaidenName] = useState(initial?.maidenName || "");
  const [marriedName, setMarriedName] = useState(initial?.marriedName || "");
  const [preferredName, setPreferredName] = useState(initial?.preferredName || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    const name = fullName.trim();
    if (!name || name.split(/\s+/).length < 2) {
      setError("Please enter your full birth name (first and last)");
      setStep(1);
      return;
    }

    const m = Number.parseInt(month);
    const d = Number.parseInt(day);
    const y = Number.parseInt(year);

    if (!m || m < 1 || m > 12) { setError("Please select your birth month"); setStep(2); return; }
    if (!d || d < 1 || d > 31) { setError("Please enter your birth day (1-31)"); setStep(2); return; }
    if (!y || y < 1900 || y > new Date().getFullYear()) { setError("Please enter a valid birth year"); setStep(2); return; }

    onSubmit({
      fullName: name,
      birthMonth: m,
      birthDay: d,
      birthYear: y,
      nameChanged: nameChanged ?? false,
      maidenName: maidenName.trim() || undefined,
      marriedName: marriedName.trim() || undefined,
      preferredName: preferredName.trim() || undefined,
    });
  };

  /* ─── Compact edit form ─── */
  if (compact) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3">
        <div>
          <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1 block">Full Birth Name</label>
          <input
            type="text"
            placeholder="Full Birth Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 text-sm"
          />
        </div>
        {(nameChanged || maidenName) && (
          <div>
            <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1 block">Maiden / Previous Last Name</label>
            <input
              type="text"
              placeholder="Previous last name"
              value={maidenName}
              onChange={e => setMaidenName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>
        )}
        <div>
          <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1 block">Preferred Name / Nickname (optional)</label>
          <input
            type="text"
            placeholder="What do people call you?"
            value={preferredName}
            onChange={e => setPreferredName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-amber-400/50 appearance-none"
          >
            <option value="" className="bg-[#1a1a2e]">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1} className="bg-[#1a1a2e]">{m.slice(0, 3)}</option>
            ))}
          </select>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Day"
            value={day}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); setDay(v); }}
            min={1} max={31}
            maxLength={2}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-400/50"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Year"
            value={year}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setYear(v); }}
            min={1900} max={2026}
            maxLength={4}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-400/50"
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Update Profile
        </button>
      </form>
    );
  }

  /* ─── Full multi-step signup ─── */
  return (
    <div className="min-h-[100dvh] bg-[#0a0a14] flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === step ? "w-8 bg-amber-400" : s < step ? "w-4 bg-amber-400/40" : "w-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* ═══ STEP 1: Name ═══ */}
      {step === 1 && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full border border-amber-400/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">✦</span>
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">What's Your Name?</h1>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              We need your <span className="text-white/60 font-medium">full birth certificate name</span> to calculate your numbers accurately. This includes your first, middle (if any), and last name at birth.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Full Birth Name</label>
              <input
                type="text"
                placeholder="e.g. John Michael Smith"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                autoFocus
              />
              <p className="text-white/25 text-xs mt-1.5">
                Use the name exactly as it appears on your birth certificate.
                {" "}If you have a maiden name or a name you go by, we'll ask about that next.
              </p>
            </div>

            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">
                Have you ever changed your last name?
              </label>
              <p className="text-white/25 text-xs mb-2">
                This applies to anyone — through marriage, personal choice, or any other reason. Both names matter in numerology.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNameChanged(true)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    nameChanged === true
                      ? "bg-amber-400/20 border-2 border-amber-400/50 text-amber-400"
                      : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20"
                  }`}
                >
                  Yes, I have
                </button>
                <button
                  type="button"
                  onClick={() => setNameChanged(false)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    nameChanged === false
                      ? "bg-amber-400/20 border-2 border-amber-400/50 text-amber-400"
                      : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {nameChanged && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Maiden / Previous Last Name</label>
                  <input
                    type="text"
                    placeholder="Your last name before the change"
                    value={maidenName}
                    onChange={e => setMaidenName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                  <p className="text-white/25 text-xs mt-1">
                    Your birth name represents the core of who you are. Your new name adds tools to your identity — like gaining new abilities.
                  </p>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Current Full Name (after change)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Smith Johnson"
                    value={marriedName}
                    onChange={e => setMarriedName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">
                Preferred Name / Nickname <span className="text-white/20">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="What do people call you?"
                value={preferredName}
                onChange={e => setPreferredName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              <p className="text-white/25 text-xs mt-1">
                If people call you something different than your birth name (e.g. "Lexi" instead of "Alexandria"), let us know.
              </p>
            </div>
          </div>

          {error && step === 1 && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={() => {
              const name = fullName.trim();
              if (!name || name.split(/\s+/).length < 2) {
                setError("Please enter your full birth name (first and last)");
                return;
              }
              setError("");
              setStep(2);
            }}
            className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ═══ STEP 2: Birthday ═══ */}
      {step === 2 && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full border border-amber-400/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🗓</span>
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">When Were You Born?</h1>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              Your date of birth determines your Personal Year, month cycles, and daily energy patterns.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Date of Birth</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-white focus:outline-none focus:border-amber-400/50 transition-colors appearance-none"
                >
                  <option value="" className="bg-[#1a1a2e]">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1} className="bg-[#1a1a2e]">{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Day"
                  value={day}
                  onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); setDay(v); }}
                  min={1} max={31}
                  maxLength={2}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Year"
                  value={year}
                  onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setYear(v); }}
                  min={1900} max={2026}
                  maxLength={4}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {error && step === 2 && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-shrink-0 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium py-4 px-5 rounded-xl transition-all flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => {
                const m = Number.parseInt(month);
                const d = Number.parseInt(day);
                const y = Number.parseInt(year);
                if (!m || m < 1 || m > 12) { setError("Please select your birth month"); return; }
                if (!d || d < 1 || d > 31) { setError("Please enter your birth day"); return; }
                if (!y || y < 1900 || y > new Date().getFullYear()) { setError("Please enter a valid year"); return; }
                setError("");
                setStep(3);
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Confirm & Privacy ═══ */}
      {step === 3 && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full border border-amber-400/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">Ready to Discover</h1>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              Confirm your information below. You can always edit this later in Settings.
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3 mb-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">Birth Name</span>
                <span className="text-sm text-white font-medium">{fullName}</span>
              </div>
              {nameChanged && maidenName && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Previous Last Name</span>
                  <span className="text-sm text-white/70">{maidenName}</span>
                </div>
              )}
              {nameChanged && marriedName && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Current Name</span>
                  <span className="text-sm text-white/70">{marriedName}</span>
                </div>
              )}
              {preferredName && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Goes By</span>
                  <span className="text-sm text-white/70">{preferredName}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">Born</span>
                <span className="text-sm text-white font-medium">
                  {MONTHS[Number(month) - 1]} {day}, {year}
                </span>
              </div>
            </div>

            {/* Privacy Disclaimer */}
            <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-400/[0.04] border border-emerald-400/10">
              <Shield className="h-5 w-5 text-emerald-400/60 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-400/80 mb-0.5">Your Data is Protected</p>
                <p className="text-[11px] leading-relaxed text-white/35">
                  Your personal information is stored securely on your device and is never shared with third parties.
                  We use it only to calculate your numerological readings. You can edit or delete your data at any time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-shrink-0 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium py-4 px-5 rounded-xl transition-all flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all text-base"
            >
              Reveal My Numbers ✦
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
