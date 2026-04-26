import {
  Home,
  User,
  Calendar,
  Heart,
  MessageCircle,
  BarChart3,
  Users,
} from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";

export type TabId = "home" | "you" | "calendar" | "love" | "people" | "chat" | "chart";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lang?: Lang;
}

const tabs: { id: TabId; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", labelKey: "nav.home", icon: Home },
  { id: "you", labelKey: "nav.you", icon: User },
  { id: "calendar", labelKey: "nav.calendar", icon: Calendar },
  { id: "love", labelKey: "nav.love", icon: Heart },
  { id: "people", labelKey: "nav.people", icon: Users },
  { id: "chat", labelKey: "nav.chat", icon: MessageCircle },
  { id: "chart", labelKey: "nav.chart", icon: BarChart3 },
];

export default function BottomNav({ activeTab, onTabChange, lang: langProp }: BottomNavProps) {
  const { lang: langCtx } = useLanguage();
  const lang = langProp || langCtx;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      {/* Gradient fade above nav */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-[#06060c]/90 to-transparent pointer-events-none" />
      
      {/* Glass morphism background */}
      <div className="relative border-t border-white/[0.06] bg-[#08081a]/80 backdrop-blur-2xl">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />
        
        <div className="mx-auto flex max-w-md items-center justify-around px-1 py-1">
          {tabs.map(({ id, labelKey, icon: Icon }) => {
            const isActive = activeTab === id;
            const label = t(labelKey as any, lang);
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-300 active:scale-90 ${
                  isActive ? "text-amber-400" : "text-white/25 hover:text-white/40"
                }`}
              >
                {/* Active indicator — glowing dot + line */}
                {isActive && (
                  <>
                    <div className="absolute -top-1 h-[2px] w-6 rounded-full bg-amber-400" 
                      style={{ boxShadow: "0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.3)" }} 
                    />
                    {/* Background glow */}
                    <div className="absolute inset-0 rounded-xl bg-amber-400/[0.04]" />
                  </>
                )}
                <Icon className={`relative z-10 h-[18px] w-[18px] transition-all duration-300 ${
                  isActive ? "scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" : ""
                }`} />
                <span className={`relative z-10 text-[8px] font-semibold tracking-wider transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
