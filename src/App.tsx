import { useState, useCallback } from "react";
import SplashScreen from "@/components/numerology/SplashScreen";
import ProfileFormModal from "@/components/numerology/ProfileFormModal";
import HomeScreen from "@/components/numerology/HomeScreen";
import YouScreen from "@/components/numerology/YouScreen";
import CalendarScreen from "@/components/numerology/CalendarScreen";
import LoveScreen from "@/components/numerology/LoveScreen";
import ChatScreen from "@/components/numerology/ChatScreen";
import PeopleScreen from "@/components/numerology/PeopleScreen";
import ChartScreen from "@/components/numerology/ChartScreen";
import BottomNav, { type TabId } from "@/components/numerology/BottomNav";
import { ProfileForm } from "@/components/numerology/ProfileForm";
import { AnimatedBackground } from "@/components/ui/animated-bg";
import type { NumerologyProfile } from "@/lib/profileStore";
import OnboardingTutorial from "@/components/numerology/OnboardingTutorial";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";

interface UserProfile {
  name: string;
  day: number;
  month: number;
  year: number;
}

const STORAGE_KEY = "aionis_profile";
const FULL_PROFILE_KEY = "aionis_full_profile";

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function loadFullProfile(): NumerologyProfile | null {
  try {
    const raw = localStorage.getItem(FULL_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveFullProfile(profile: NumerologyProfile) {
  localStorage.setItem(FULL_PROFILE_KEY, JSON.stringify(profile));
}

function AppInner() {
  const [showSplash, setShowSplash] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(loadProfile);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { lang: language, setLang: setLanguage } = useLanguage();
  const [showNumbers, setShowNumbers] = useState(() => {
    try { return localStorage.getItem("aionis_show_numbers") === "true"; } catch { return false; }
  });
  const [showTutorial, setShowTutorial] = useState(() => {
    try { return !localStorage.getItem("aionis_tutorial_done"); } catch { return true; }
  });

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleProfileSubmit = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setShowEditProfile(false);
  }, []);

  // Splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Profile form
  if (!profile) {
    return <ProfileFormModal onSubmit={handleProfileSubmit} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Animated shader background */}
      <AnimatedBackground />

      {/* Main content area */}
      <main className="relative z-10 mx-auto max-w-md px-4 pt-4 pb-2">
        {/* Settings button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowSettings(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2m0 18v2m-9-11h2m18 0h2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>

        {/* Screen Router */}
        <div className="min-h-[calc(100vh-6rem)]">
          {activeTab === "home" && <HomeScreen profile={profile} />}
          {activeTab === "you" && <YouScreen profile={profile} />}
          {activeTab === "calendar" && <CalendarScreen profile={profile} />}
          {activeTab === "love" && <LoveScreen profile={profile} />}
          {activeTab === "people" && <PeopleScreen profile={profile} />}
          {activeTab === "chat" && <ChatScreen profile={profile} />}
          {activeTab === "chart" && <ChartScreen profile={profile} />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} lang={language} onTabChange={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "instant" });
      }} />

      {/* ═══ Settings Panel ═══ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-md max-h-[85vh] overflow-auto rounded-t-2xl sm:rounded-2xl bg-[#0a0a14] border border-white/[0.08] p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-semibold text-white">
                {language === "es" ? "Configuración" : "Settings"}
              </h2>
              <button onClick={() => setShowSettings(false)} className="text-white/30 hover:text-white/60 text-xl leading-none">✕</button>
            </div>

            {/* ─── Language Toggle ─── */}
            <div className="mb-5">
              <label className="text-[11px] uppercase tracking-wider text-white/40 mb-2 block">
                {language === "es" ? "Idioma" : "Language"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["en", "es"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                    }}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      language === l
                        ? "bg-amber-400/20 border-amber-400/40 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                        : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
                    }`}
                  >
                    {l === "en" ? "🇺🇸 English" : "🇪🇸 Español"}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Show Numbers Toggle ─── */}
            <div className="mb-5 flex items-center justify-between py-3 border-t border-b border-white/[0.04]">
              <div>
                <p className="text-sm text-white/80">{language === "es" ? "Mostrar valores numéricos" : "Show number values"}</p>
                <p className="text-[10px] text-white/30">{language === "es" ? "Muestra los números en cada sección" : "Display the actual numbers in each section"}</p>
              </div>
              <button
                onClick={() => {
                  const next = !showNumbers;
                  setShowNumbers(next);
                  localStorage.setItem("aionis_show_numbers", String(next));
                }}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  showNumbers ? "bg-amber-400/80" : "bg-white/10"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  showNumbers ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* ─── Edit Profile ─── */}
            <button
              onClick={() => { setShowSettings(false); setShowEditProfile(true); }}
              className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all hover:bg-white/[0.06] mb-3"
            >
              {language === "es" ? "✏️ Editar perfil" : "✏️ Edit Profile"}
            </button>

            {/* ─── Show Tutorial Again ─── */}
            <button
              onClick={() => { setShowSettings(false); setShowTutorial(true); localStorage.removeItem("aionis_tutorial_done"); }}
              className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all hover:bg-white/[0.06] mb-3"
            >
              {language === "es" ? "📖 Mostrar tutorial de nuevo" : "📖 Show Tutorial Again"}
            </button>

            {/* ─── Reset ─── */}
            <button
              onClick={() => {
                const msg = language === "es"
                  ? "¿Borrar todos los datos y empezar de nuevo?"
                  : "Clear all data and start over? This removes your profile.";
                if (confirm(msg)) {
                  localStorage.removeItem(STORAGE_KEY);
                  localStorage.removeItem(FULL_PROFILE_KEY);
                  localStorage.removeItem("aionis_lang");
                  localStorage.removeItem("aionis_show_numbers");
                  setProfile(null);
                  setShowSettings(false);
                }
              }}
              className="w-full text-xs text-red-400/40 hover:text-red-400 transition-colors py-2"
            >
              {language === "es" ? "Restablecer y empezar de nuevo" : "Reset & Start Over"}
            </button>
          </div>
        </div>
      )}

      {/* ═══ Edit Profile Modal ═══ */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditProfile(false)} />
          <div className="relative w-full max-w-md max-h-[85vh] overflow-auto rounded-t-2xl sm:rounded-2xl bg-[#0a0a14] border border-white/[0.08] p-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-white">
                {language === "es" ? "Editar Perfil" : "Edit Profile"}
              </h2>
              <button onClick={() => setShowEditProfile(false)} className="text-white/30 hover:text-white/60 text-xl leading-none">✕</button>
            </div>
            <ProfileForm
              compact
              initial={{
                fullName: profile.name,
                birthMonth: profile.month,
                birthDay: profile.day,
                birthYear: profile.year,
                ...(loadFullProfile() || {}),
              }}
              onSubmit={(np) => {
                saveFullProfile(np);
                handleProfileSubmit({
                  name: np.fullName,
                  day: np.birthDay,
                  month: np.birthMonth,
                  year: np.birthYear,
                });
              }}
            />
          </div>
        </div>
      )}

      {/* ═══ Onboarding Tutorial ═══ */}
      {showTutorial && profile && !showSplash && (
        <OnboardingTutorial
          firstName={profile.name.split(" ")[0]}
          onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem("aionis_tutorial_done", "true");
          }}
        />
      )}

      {/* Global styles */}
      <style>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        /* Smooth transitions */
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
