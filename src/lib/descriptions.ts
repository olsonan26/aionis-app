/**
 * AIONIS Descriptions — Reading content for all number types
 */

export interface NumberMeaning {
  title: string;
  summary: string;
  keywords: string[];
  advice: string;
}

export const PERSONAL_YEAR_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    title: "New Beginnings",
    summary: "This is the start of a brand new 9-year cycle. Seeds you plant this year determine the trajectory of the next decade. It's time to be bold, initiate new projects, and step into leadership. Trust your instincts and take action — the universe is backing your fresh start.",
    keywords: ["Fresh Start", "Independence", "Leadership", "Initiative"],
    advice: "Start something new. Take the leap you've been considering. This year rewards courage.",
  },
  2: {
    title: "Patience & Partnership",
    summary: "After the rush of the 1 Year, this is a time to slow down and cultivate relationships. Seeds are germinating underground — you won't see results yet, but they are growing. Diplomacy, cooperation, and paying attention to details will serve you well.",
    keywords: ["Patience", "Cooperation", "Sensitivity", "Detail"],
    advice: "Be patient. Build relationships. The results are coming — don't force them.",
  },
  3: {
    title: "Creative Expression",
    summary: "This is your year to shine socially and creatively. The energy supports self-expression, communication, and joy. It's time to get your ideas out into the world. Social connections expand, and creative projects flourish. Don't hold back your voice.",
    keywords: ["Creativity", "Joy", "Communication", "Social"],
    advice: "Express yourself boldly. Write, speak, create, perform. Your voice carries power this year.",
  },
  4: {
    title: "Foundation Building",
    summary: "Time to get serious and do the work. This year is about building solid foundations for everything you started. It requires discipline, organization, and hard work. Don't cut corners — what you build now must be strong enough to support future growth.",
    keywords: ["Discipline", "Hard Work", "Structure", "Foundation"],
    advice: "Roll up your sleeves. Build systems. Organize your life. The work you do now pays off for years.",
  },
  5: {
    title: "Change & Freedom",
    summary: "Expect the unexpected. This dynamic year brings major changes, travel, and new experiences. Your comfort zone will be challenged, and that's exactly the point. Embrace flexibility and adventure. Resist the urge to cling to the old — freedom is calling.",
    keywords: ["Change", "Freedom", "Adventure", "Flexibility"],
    advice: "Say yes to new experiences. Travel if you can. Embrace change — it's leading you somewhere better.",
  },
  6: {
    title: "Love & Responsibility",
    summary: "Home, family, and relationships take center stage. This is a year of love, duty, and service. You may take on more responsibility for others. Domestic matters, community involvement, and nurturing relationships bring fulfillment. Create beauty in your world.",
    keywords: ["Love", "Family", "Responsibility", "Healing"],
    advice: "Focus on relationships and home. Accept responsibility gracefully. Love leads this year.",
  },
  7: {
    title: "Inner Wisdom",
    summary: "This is your sabbatical year — a time to go inward. Study, research, meditate, and seek deeper understanding. The answers you need are within, not in the external world. Solitude isn't loneliness; it's where your greatest insights are born.",
    keywords: ["Reflection", "Wisdom", "Solitude", "Spiritual Growth"],
    advice: "Go inward. Study, meditate, rest. This year's treasures are found in quiet contemplation.",
  },
  8: {
    title: "Power & Achievement",
    summary: "This is your harvest year — the time to reap what you've sown. Career advancement, financial gains, and recognition are all possible. Step into your authority. This year tests your ability to handle power with integrity. Think big.",
    keywords: ["Success", "Money", "Authority", "Recognition"],
    advice: "Claim your power. Negotiate. Invest. This year rewards ambition and integrity.",
  },
  9: {
    title: "Completion & Release",
    summary: "The final year of your 9-year cycle. It's time to let go of what no longer serves you — relationships, habits, projects that have run their course. This clearing makes space for the new cycle beginning next year. Be generous, compassionate, and willing to release.",
    keywords: ["Completion", "Release", "Compassion", "Transformation"],
    advice: "Let go. Forgive. Complete unfinished business. Clear the path for your new beginning.",
  },
};

export const DAILY_ENERGY_MEANINGS: Record<number, { feel: string; environment: string; advice: string }> = {
  1: {
    feel: "You'll feel driven, independent, and motivated to take action. Leadership energy is strong.",
    environment: "The world responds to confidence today. Others look to you for direction.",
    advice: "Start something. Take initiative. Don't wait for permission.",
  },
  2: {
    feel: "Sensitivity is heightened. You're picking up on subtle cues and emotional undercurrents.",
    environment: "Cooperation and diplomacy are favored. Conflicts resolve through listening.",
    advice: "Be patient. Listen more than you speak. Partnerships bring gifts today.",
  },
  3: {
    feel: "Creative energy flows. You feel social, expressive, and inspired.",
    environment: "Communication channels are wide open. Social events shine.",
    advice: "Express yourself. Connect with friends. Create something beautiful.",
  },
  4: {
    feel: "Grounded, practical energy. You want order and progress.",
    environment: "Hard work pays off today. Systems and structures respond well.",
    advice: "Get organized. Do the work. Build something that lasts.",
  },
  5: {
    feel: "Restless and energized. You crave variety and stimulation.",
    environment: "Change is in the air. Expect surprises. Flexibility is key.",
    advice: "Embrace the unexpected. Try something new. Break your routine.",
  },
  6: {
    feel: "Nurturing energy. You want to help, heal, and create harmony.",
    environment: "Home and family matters are highlighted. Beauty matters.",
    advice: "Take care of your people. Create beauty. Accept responsibility with love.",
  },
  7: {
    feel: "Introspective and thoughtful. Your mind craves depth over speed.",
    environment: "Solitude is productive. Research and analysis are favored.",
    advice: "Go deep, not wide. Meditate. Study. Trust your inner knowing.",
  },
  8: {
    feel: "Powerful and ambitious. Material concerns are front and center.",
    environment: "Business and finance are highlighted. Authority matters.",
    advice: "Think big. Make bold decisions. Handle money wisely.",
  },
  9: {
    feel: "Compassionate and reflective. You see the bigger picture.",
    environment: "Endings and completions are favored. Generosity returns tenfold.",
    advice: "Release what's done. Be generous. Look at the big picture.",
  },
};

export const ESS_MEANINGS: Record<number, string> = {
  1: "A year of personal reinvention through your name vibration. Your essence pushes you toward independence.",
  2: "Your name essence brings heightened sensitivity and the need for cooperation this year.",
  3: "Creative expression flows through your essence. Your name vibration amplifies your voice.",
  4: "Your essence demands structure and discipline this year. Build with intention.",
  5: "Your name brings restless change energy. Embrace transformation through your essence.",
  6: "Your essence centers on love and responsibility. Your name vibration nurtures.",
  7: "Deep inner wisdom flows through your essence. Your name pushes you toward truth.",
  8: "Your essence amplifies material power. Your name vibration strengthens authority.",
  9: "Your name essence brings completion energy. Time to release through your vibration.",
};

export const COMBINER_MEANINGS: Record<number, string> = {
  1: "The combination creates a powerful drive toward new beginnings and leadership.",
  2: "The combined energies call for patience, cooperation, and subtle influence.",
  3: "The combination amplifies creative expression and social connection.",
  4: "Combined forces demand building, structure, and serious effort.",
  5: "The combination creates dynamic change energy — expect the unexpected.",
  6: "Combined energies center on love, responsibility, and home.",
  7: "The combination deepens your spiritual and intellectual pursuit.",
  8: "Combined forces amplify power, ambition, and material achievement.",
  9: "The combination brings completion, compassion, and universal perspective.",
};

export const PLANE_DESCRIPTIONS: Record<string, string> = {
  physical: "The Physical Plane (values 4, 5) — How you interact with the material world. Your approach to work, health, routine, and tangible results.",
  mental: "The Mental Plane (values 1, 8) — How you think and process information. Your approach to leadership, authority, and analytical reasoning.",
  emotional: "The Emotional Plane (values 2, 3, 6) — How you feel and connect. Your approach to relationships, creativity, and nurturing.",
  intuitive: "The Intuitive Plane (values 7, 9) — How you sense beyond the visible. Your spiritual gifts, inner knowing, and higher wisdom.",
};

export const NUMBER_KEYWORDS: Record<number, string> = {
  1: "Leadership · Independence · Initiative",
  2: "Cooperation · Sensitivity · Balance",
  3: "Creativity · Expression · Joy",
  4: "Foundation · Discipline · Structure",
  5: "Freedom · Change · Adventure",
  6: "Love · Responsibility · Healing",
  7: "Wisdom · Reflection · Truth",
  8: "Power · Achievement · Abundance",
  9: "Completion · Compassion · Release",
};
