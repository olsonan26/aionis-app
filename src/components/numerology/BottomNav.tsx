import {
  Home,
  User,
  Calendar,
  Heart,
  MessageCircle,
  BarChart3,
  Users,
} from "lucide-react";

export type TabId = "home" | "you" | "calendar" | "love" | "people" | "chat" | "chart";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "you", label: "You", icon: User },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "love", label: "Love", icon: Heart },
  { id: "people", label: "People", icon: Users },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "chart", label: "Chart", icon: BarChart3 },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all active:scale-90 ${
                isActive ? "text-amber-400" : "text-white/30"
              }`}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute -top-1 h-0.5 w-6 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              )}
              <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[9px] font-medium tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
