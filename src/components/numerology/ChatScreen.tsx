import { useState, useRef, useEffect, useMemo } from "react";
import {
  calculateCoreNumbers,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateDailyEssence,
  calculatePersonDay,
  calculatePMEIPlanes,
  calculateMindMode,
  calculateCalledNameValue,
  calculateMonthlyCombiner,
} from "@/lib/numerology";
import {
  dailyEssenceMeanings,
  personalYearMeanings,
  monthlyCombinerMeanings,
} from "@/data/readings";
import { DAILY_ENERGY_MEANINGS, PERSONAL_YEAR_MEANINGS } from "@/lib/descriptions";
import { MIND_MODE_DESCRIPTIONS } from "@/lib/mindMode";
import { FadeIn } from "@/components/ui/fade-in";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
} from "lucide-react";

interface ChatScreenProps {
  profile: { name: string; day: number; month: number; year: number };
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Build the full context about this person
function buildPersonContext(profile: { name: string; day: number; month: number; year: number }) {
  const today = new Date();
  const cm = today.getMonth() + 1;
  const cd = today.getDate();
  const cy = today.getFullYear();
  const firstName = profile.name.split(" ")[0];

  const core = calculateCoreNumbers(profile.name, profile.day, profile.month, profile.year);
  const py = calculatePersonalYear(profile.day, profile.month, cy);
  const pm = calculatePersonalMonth(py.value, cm);
  const de = calculateDailyEssence(profile.name, profile.day, profile.month, profile.year, cd, cm, cy);
  const pd = calculatePersonDay(profile.day, profile.month, cd, cm, cy);
  const mcom = calculateMonthlyCombiner(de.value, pm.value);
  const planes = calculatePMEIPlanes(profile.name);
  const mind = calculateMindMode(profile.name, profile.day);
  const called = calculateCalledNameValue(firstName);
  const age = cy - profile.year;

  const pyMeaning = personalYearMeanings?.[String(py.value)];
  const deMeaning = dailyEssenceMeanings?.[String(de.value)];
  const mcomMeaning = monthlyCombinerMeanings?.[String(mcom.value)];
  const monthForecast = pyMeaning?.monthlyForecasts?.[MONTH_NAMES[cm]];
  const dailyEnergy = DAILY_ENERGY_MEANINGS[de.value];
  const pyDesc = PERSONAL_YEAR_MEANINGS[py.value];
  const mindDesc = MIND_MODE_DESCRIPTIONS[mind?.value || 0];

  return `You are a wise, warm numerology advisor. You know EVERYTHING about ${firstName}'s chart.

TODAY: ${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}

=== ${firstName.toUpperCase()}'S PROFILE ===
Full Name: ${profile.name}
Born: ${profile.month}/${profile.day}/${profile.year} (Age ${age})

=== CORE NUMBERS ===
- Ultimate Goal (Life Path): ${core.ultimateGoal.value}${core.ultimateGoal.compound ? ` (${core.ultimateGoal.compound})` : ""}
- Expression: ${core.expression.value}${core.expression.compound ? ` (${core.expression.compound})` : ""}
- Soul Urge: ${core.soulUrge.value}${core.soulUrge.compound ? ` (${core.soulUrge.compound})` : ""}
- Birth Force: ${core.birthForce.value}${core.birthForce.compound ? ` (${core.birthForce.compound})` : ""}
- Balance Number: ${core.balance.value}${core.balance.compound ? ` (${core.balance.compound})` : ""}

=== PMEI PLANES ===
Physical: ${planes.counts.physical} | Mental: ${planes.counts.mental} | Emotional: ${planes.counts.emotional} | Intuitive: ${planes.counts.intuitive}
Genius Factor: ${(() => { const max = Math.max(...Object.values(planes.counts)); return Object.entries(planes.counts).filter(([_, v]) => v === max).map(([k]) => k).join(", "); })()}

=== MIND'S DEFAULT MODE ===
Mode: ${mind?.value}${mind?.compound ? ` (${mind.compound})` : ""}
${mindDesc ? `Description: ${mindDesc}` : ""}

=== CALLED NAME (${firstName}) ===
Value: ${called?.value}${called?.compound ? ` (${called.compound})` : ""}

=== TODAY'S ENERGIES ===
Personal Year: ${py.value} — "${pyMeaning?.title || pyDesc?.title || ""}"
${pyMeaning?.generalIndicators ? `PY Overview: ${pyMeaning.generalIndicators.slice(0, 300)}` : ""}
Personal Month: ${pm.value}
Daily Essence: ${de.value}${de.compound ? ` (${de.compound})` : ""}
${deMeaning ? `Today's Summary: ${deMeaning.summary}` : ""}
${deMeaning ? `Today's Positive: ${deMeaning.positive}` : ""}
${deMeaning ? `Today's Caution: ${deMeaning.caution}` : ""}
${dailyEnergy ? `Feel: ${dailyEnergy.feel}` : ""}
${dailyEnergy ? `Environment: ${dailyEnergy.environment}` : ""}
${dailyEnergy ? `Advice: ${dailyEnergy.advice}` : ""}
Personal Day: ${pd.value}
Monthly Combiner: ${mcom.value}
${mcomMeaning ? `Combiner Summary: ${mcomMeaning.summary}` : ""}

=== THIS MONTH'S FORECAST ===
${monthForecast || "Not available"}

=== INSTRUCTIONS ===
- Always reference ${firstName}'s specific numbers and chart when answering
- If they ask "why does my week feel off?" look at their daily essence, personal month, and any warning patterns
- Be specific: mention exact numbers, planes, modes
- Be warm and insightful, not generic
- Keep responses concise but rich — 2-4 paragraphs max
- Use their first name naturally
- If you don't know something specific, guide them based on the numbers you DO know`;
}

export default function ChatScreen({ profile }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const systemContext = useMemo(() => buildPersonContext(profile), [profile]);
  const firstName = profile.name.split(" ")[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestedQuestions = [
    "Why does my week feel off?",
    "What should I focus on today?",
    "Tell me about my Ultimate Goal",
    "What's my biggest strength?",
    "How's this month looking for me?",
    "Explain my Mind Mode",
  ];

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Use AI to generate response based on full chart context
      const response = await generateResponse(systemContext, newMessages);
      setMessages([...newMessages, { role: "assistant" as const, content: response }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant" as const,
          content: `Hey ${firstName}, I had a moment there. Let me try again — ask me anything about your chart and I'll give you the full picture. 🔮`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3 px-1 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
            <Bot className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">Ask My Reading</h2>
            <p className="text-xs text-white/40">AI that knows your entire chart</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Online</span>
          </div>
        </div>
      </FadeIn>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 px-1 pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
      >
        {messages.length === 0 ? (
          <FadeIn delay={100}>
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 animate-pulse rounded-full bg-violet-500/10 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20">
                  <Sparkles className="h-7 w-7 text-violet-400" />
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Hey {firstName} 👋
              </h3>
              <p className="text-sm text-white/40 mb-6 max-w-[280px]">
                I know everything about your chart — your numbers, patterns, and energies. Ask me anything.
              </p>

              {/* Suggested Questions */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-xs text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-all active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-violet-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white/90 border border-amber-500/10"
                    : "bg-white/[0.04] text-white/70 border border-white/[0.06]"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 mt-0.5">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 mt-0.5">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/[0.06] pt-3 pb-1">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about your chart..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-30 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Local AI response generation using chart context
async function generateResponse(systemContext: string, messages: Message[]): Promise<string> {
  // For now, use smart pattern matching on the chart data
  // This will be upgraded to use an actual LLM API
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
  
  // Extract data from context
  const lines = systemContext.split("\n");
  const getLine = (prefix: string) => lines.find((l) => l.includes(prefix))?.split(prefix)?.[1]?.trim() || "";
  const getName = () => {
    const match = systemContext.match(/Full Name: (.+)/);
    return match?.[1]?.split(" ")[0] || "friend";
  };
  const name = getName();

  // Parse key numbers
  const ugMatch = systemContext.match(/Ultimate Goal.*?: (\d+)/);
  const bfMatch = systemContext.match(/Birth Force: (\d+)/);
  const suMatch = systemContext.match(/Soul Urge: (\d+)/);
  const exMatch = systemContext.match(/Expression: (\d+)/);
  const pyMatch = systemContext.match(/Personal Year: (\d+)/);
  const deMatch = systemContext.match(/Daily Essence: (\d+)/);
  const pmMatch = systemContext.match(/Personal Month: (\d+)/);
  const mindMatch = systemContext.match(/Mode: (\d+)/);
  const geniusMatch = systemContext.match(/Genius Factor: (.+)/);

  const ug = ugMatch?.[1] || "?";
  const bf = bfMatch?.[1] || "?";
  const su = suMatch?.[1] || "?";
  const ex = exMatch?.[1] || "?";
  const py = pyMatch?.[1] || "?";
  const de = deMatch?.[1] || "?";
  const pm = pmMatch?.[1] || "?";
  const mm = mindMatch?.[1] || "?";
  const genius = geniusMatch?.[1] || "";

  // Extract readings
  const summaryMatch = systemContext.match(/Today's Summary: (.+)/);
  const cautionMatch = systemContext.match(/Today's Caution: (.+)/);
  const positiveMatch = systemContext.match(/Today's Positive: (.+)/);
  const feelMatch = systemContext.match(/Feel: (.+)/);
  const adviceMatch = systemContext.match(/Advice: (.+)/);
  const forecastMatch = systemContext.match(/THIS MONTH'S FORECAST ===\n(.+)/);
  const pyOverviewMatch = systemContext.match(/PY Overview: (.+)/);
  const mindDescMatch = systemContext.match(/Description: (.+)/);

  // Smart response routing
  if (lastMsg.includes("week") && (lastMsg.includes("off") || lastMsg.includes("weird") || lastMsg.includes("wrong") || lastMsg.includes("hard"))) {
    return `${name}, let me look at what's happening in your chart right now.\n\nYour Daily Essence is sitting at ${de} today, and your Personal Month is ${pm} inside a Personal Year of ${py}. ${summaryMatch?.[1] ? `Here's what that ${de} energy means: ${summaryMatch[1]}` : ""}\n\n${cautionMatch?.[1] ? `The thing to watch for: ${cautionMatch[1]}` : ""}\n\n${forecastMatch?.[1] ? `Looking at this month's bigger picture: ${forecastMatch[1].slice(0, 300)}` : ""}\n\nThe off feeling often comes when your daily energy clashes with your monthly rhythm. With DE ${de} and PM ${pm}, ${parseInt(de) !== parseInt(pm) ? "these are different energies pulling you in separate directions — that tension is real and it's temporary." : "these energies are actually aligned, so the 'off' feeling might be coming from external circumstances rather than your numbers."}`;
  }

  if (lastMsg.includes("focus") || lastMsg.includes("today") || lastMsg.includes("should i")) {
    return `Here's what your chart says about today, ${name}:\n\n${summaryMatch?.[1] ? `Your Daily Essence ${de} is telling you: ${summaryMatch[1]}` : `Your Daily Essence is ${de} today.`}\n\n${positiveMatch?.[1] ? `✨ *Lean into this:* ${positiveMatch[1]}` : ""}\n\n${adviceMatch?.[1] ? `💡 *My advice:* ${adviceMatch[1]}` : ""}\n\n${feelMatch?.[1] ? `You'll likely feel: ${feelMatch[1]}` : ""}`;
  }

  if (lastMsg.includes("ultimate goal") || lastMsg.includes("life path") || lastMsg.includes("purpose")) {
    return `${name}, your Ultimate Goal number is ${ug}. This is the mountain you're here to climb — it's not just a number, it's your life's blueprint.\n\nWith a ${ug} Ultimate Goal, ${parseInt(ug) === 1 ? "you're here to lead, innovate, and pioneer new paths" : parseInt(ug) === 2 ? "you're here to connect, harmonize, and bring people together" : parseInt(ug) === 3 ? "you're here to create, express, and inspire through your voice" : parseInt(ug) === 4 ? "you're here to build solid foundations and create lasting systems" : parseInt(ug) === 5 ? "you're here to experience freedom, change, and teach through adventure" : parseInt(ug) === 6 ? "you're here to nurture, heal, and create harmony in your community" : parseInt(ug) === 7 ? "you're here to seek truth, develop wisdom, and share deep insights" : parseInt(ug) === 8 ? "you're here to master material abundance and empower others" : "you're here to serve humanity, complete cycles, and transform"}\n\nYour Expression (${ex}) is HOW you deliver on that goal. Your Soul Urge (${su}) is WHY you want it deep down. And your Birth Force (${bf}) is the raw energy you bring to the table. Together, these four numbers paint your complete picture.`;
  }

  if (lastMsg.includes("strength") || lastMsg.includes("strong") || lastMsg.includes("good at")) {
    return `${name}, let me break down your strengths from the chart:\n\n⚡ *Birth Force ${bf}* — This is your natural power. ${parseInt(bf) === 1 ? "You're a natural leader who doesn't need permission to start." : parseInt(bf) === 2 ? "You read people and situations with uncanny accuracy." : parseInt(bf) === 3 ? "Your creativity and communication are weapons-grade." : parseInt(bf) === 4 ? "You build things that last — systems, structures, empires." : parseInt(bf) === 5 ? "You adapt to anything and turn change into opportunity." : parseInt(bf) === 6 ? "You heal rooms just by walking in. People trust you instinctively." : parseInt(bf) === 7 ? "Your analytical mind sees what others miss." : parseInt(bf) === 8 ? "You understand power, money, and how to move mountains." : "You see the big picture when everyone else is lost in details."}\n\n🧠 *Genius Factor: ${genius}* — This is where your name gives you an extra edge. Your dominant plane means you process the world primarily through ${genius.includes("physical") ? "action and tangible results" : genius.includes("mental") ? "logic and strategic thinking" : genius.includes("emotional") ? "feelings and relational intelligence" : "intuition and higher perception"}.\n\n🎯 *Mind Mode ${mm}* — ${mindDescMatch?.[1] ? mindDescMatch[1].slice(0, 200) : "This is how your mind naturally rests and processes information."}`;
  }

  if (lastMsg.includes("month") || lastMsg.includes("forecast") || lastMsg.includes("ahead")) {
    return `${name}, here's your month breakdown:\n\n📅 *Personal Month ${pm}* inside *Personal Year ${py}* ("${getLine('Personal Year:')}".split('"')[1] || ""}).\n\n${forecastMatch?.[1] ? forecastMatch[1] : "Your monthly forecast shows a period of " + (parseInt(pm) <= 3 ? "initiation and creative energy" : parseInt(pm) <= 6 ? "building and responsibility" : "reflection and strategic preparation") + "."}\n\n${pyOverviewMatch?.[1] ? `\nBigger picture for this year: ${pyOverviewMatch[1]}` : ""}`;
  }

  if (lastMsg.includes("mind") || lastMsg.includes("mode") || lastMsg.includes("think")) {
    return `${name}, your Mind's Default Mode is ${mm}. Think of this as your brain's screensaver — the pattern your thoughts default to when you're not actively directing them.\n\n${mindDescMatch?.[1] ? mindDescMatch[1] : `With a ${mm} Mind Mode, your subconscious naturally gravitates toward ${parseInt(mm) === 1 ? "independence and new ideas" : parseInt(mm) === 2 ? "harmony and partnership" : parseInt(mm) === 3 ? "creative expression" : parseInt(mm) === 4 ? "order and structure" : parseInt(mm) === 5 ? "freedom and variety" : parseInt(mm) === 6 ? "nurturing and responsibility" : parseInt(mm) === 7 ? "analysis and introspection" : parseInt(mm) === 8 ? "power and achievement" : "completion and service"}.`}\n\nThis affects everything — how you daydream, what worries you at 3am, and what solutions pop into your head first.`;
  }

  // Default comprehensive response
  return `${name}, here's what I see in your chart right now:\n\n🔢 You're running a *Personal Year ${py}* with *Daily Essence ${de}* today. ${summaryMatch?.[1] ? summaryMatch[1] : ""}\n\n${positiveMatch?.[1] ? `✨ *Lean into:* ${positiveMatch[1]}` : ""}\n\n${cautionMatch?.[1] ? `⚠️ *Watch for:* ${cautionMatch[1]}` : ""}\n\nYour core numbers (UG: ${ug}, EX: ${ex}, SU: ${su}, BF: ${bf}) and your ${genius} Genius Factor all influence how you experience this energy.\n\nWhat specifically would you like to explore deeper? I can break down any number, explain your month ahead, or help you understand why something feels the way it does. 🔮`;
}
