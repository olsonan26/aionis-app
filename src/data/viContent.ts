/**
 * Vibrational Identity Content — Essence descriptions, Full Name descriptions,
 * Mind's Default Mode, and PME Reading System
 */

// ══════════════════════════════════════════════════════════
// COLOR CODING SYSTEM — consistent across the entire app
// ══════════════════════════════════════════════════════════
export const NUM_COLORS = {
  ESS:  { label: 'Essence',          color: '#10b981', bg: 'rgba(16,185,129,0.12)', text: 'text-emerald-400', border: 'border-emerald-400/30' },
  PY:   { label: 'Personal Year',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: 'text-blue-400',    border: 'border-blue-400/30' },
  COM:  { label: 'Combiner',         color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', text: 'text-violet-400',  border: 'border-violet-400/30' },
  CY:   { label: 'Calendar Year',    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  text: 'text-cyan-400',    border: 'border-cyan-400/30' },
  PM:   { label: 'Personal Month',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: 'text-blue-400',    border: 'border-blue-400/30' },
  PME:  { label: 'Month Essence',    color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  text: 'text-rose-400',    border: 'border-rose-400/30' },
  MCOM: { label: 'Month Combiner',   color: '#10b981', bg: 'rgba(16,185,129,0.12)', text: 'text-emerald-400', border: 'border-emerald-400/30' },
  DE:   { label: 'Daily Essence',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: 'text-amber-400',   border: 'border-amber-400/30' },
  CORE: { label: 'Core Number',      color: '#c084fc', bg: 'rgba(192,132,252,0.12)',text: 'text-purple-300',  border: 'border-purple-300/30' },
} as const;

export type NumColorKey = keyof typeof NUM_COLORS;

// ══════════════════════════════════════════════════════════
// ESSENCE DESCRIPTIONS (from VI Supabase — Condensed Ess Text)
// ══════════════════════════════════════════════════════════
export const ESS_DESCRIPTIONS: Record<number, string> = {
  1: "This is a period where you feel a strong need for independence, change, and the freedom to pursue your own ideas. You may feel drawn toward new opportunities, new people, and new ways of working that allow you more autonomy. Your ability to trust yourself, take initiative, and handle resistance from others may be tested, but this can also be a time of real growth if you stay focused and avoid impulsive detours.",
  2: "You are entering a quieter period that calls for patience, care, and a more thoughtful approach to life. This is a time where cooperation with others can benefit you greatly, but rushing, pressure, or emotional strain can create setbacks. You may feel delayed, overlooked, or emotionally stretched at times, so it is important to move steadily, protect your health, and stay grounded in the process.",
  3: "This is a more creative and expressive period for you, where your imagination, enthusiasm, and talents want room to grow. You may feel inspired to explore artistic, social, or uplifting pursuits, and this can be a very rewarding time if you channel your energy well. At the same time, your emotions may feel stronger than usual, so balance is important if you want to stay productive and avoid wasting time or energy.",
  4: "This is a serious and practical period that asks more of you in work, structure, planning, and responsibility. You may feel pressure to get organized, manage important matters well, and build something more stable in your life. It can feel demanding, but if you stay disciplined, careful, and committed, this time can help you create lasting improvements and stronger foundations.",
  5: "This is a time of change, movement, and a desire for more freedom in your life. You may feel restless, eager for new experiences, and ready to break out of routines that no longer fit you. Opportunities can appear quickly now, but the key is to stay honest, focused, and thoughtful so that change leads to growth instead of confusion or unnecessary loss.",
  6: "This period places more responsibility in your hands and may call you to care for others, lead, manage, or improve what is around you. You may feel the urge to strengthen your work, home, or personal life by bringing more order, support, and guidance into it. This can be a productive and meaningful time, especially when you lead with integrity and use your efforts to lift more than just yourself.",
  7: "This is a reflective and inward period where you may question your direction, your purpose, and what needs to change in your life. You may feel quieter, more reserved, or mentally stretched as you search for deeper understanding and growth. This can be a powerful time for learning, research, personal development, and insight, but it is important not to let isolation, discouragement, or emotional heaviness take over.",
  8: "This is a strong period for achievement, leadership, and managing larger responsibilities. You may feel driven to take command, handle bigger projects, and move toward tangible success in business or work. There is real potential here, but it requires discipline, balance, and wise decision-making, especially in financial and professional matters where mistakes could carry weight.",
  9: "This is a demanding but important period where you may need to clear out what no longer serves you and take on greater responsibility. You may be called to manage complex situations, make difficult decisions, and think on a broader level than usual. If you stay honest, fair, and focused on the greater good, this time can bring meaningful rewards, growth, and long-term benefit.",
};

// ══════════════════════════════════════════════════════════
// PME DESCRIPTIONS (Personal Month Essence)
// ══════════════════════════════════════════════════════════
export const PME_DESCRIPTIONS: Record<number, { title: string; text: string }> = {
  1: { title: "Breaking Old Patterns and Beginning Again", text: "You may be feeling a strong pull toward something new. There is an inner drive to break away from old habits and begin again. You may feel bold, restless for change, or impatient with the way things have been. Fear and self-doubt may surface, but underneath them is a genuine desire to grow." },
  2: { title: "Slow Down and Stay Steady", text: "You may be feeling more sensitive and emotionally tuned in than usual. There is a need to slow down, be patient, and let things unfold without rushing. You may feel quieter inside, more aware of other people's energy, and more in need of calm and balance." },
  3: { title: "Open Up to New Possibilities", text: "You may be feeling more creative, inspired, and open to possibility. Ideas may be flowing, and there is an inner sense that something good is forming. You may feel lighter, more hopeful, and more socially engaged. Enthusiasm is rising, and you want to express yourself more freely." },
  4: { title: "Be Intentional and Manage Your Energy Well", text: "You may be feeling the weight of responsibility and the need for order. There is an inner call to get serious, be more disciplined, and stop letting old habits run the show. You may feel focused but also somewhat heavy, as if life is asking you to build something that requires real effort." },
  5: { title: "Stay Grounded While Life Speeds Up", text: "You may be feeling restless, curious, and hungry for something different. There is a strong inner pull toward freedom, variety, and new experiences. You may feel like you have outgrown your current routine and want more movement, more options, and more stimulation." },
  6: { title: "Take Responsibility for What Matters", text: "You may be feeling a deeper sense of duty and emotional investment in the people and situations around you. There is an inner call to step up, take care of what matters, and bring more order and love into your immediate environment. You may feel protective, nurturing, or burdened by how much needs your attention." },
  7: { title: "Reflect, Listen, and Learn About Yourself", text: "You may be feeling more inward and reflective. There is less interest in noise and more desire for depth, truth, and understanding. You may feel like pulling back from the world to think, process, or simply be alone with your thoughts. Something inside is asking to be understood before you act." },
  8: { title: "Stay Balanced and Pay Attention to Cause and Effect", text: "You may be feeling a strong sense of purpose and drive. There is an inner awareness that your choices carry real weight right now. You may feel ambitious, focused on results, and aware that how you handle things will have clear consequences. There is power in your state, but it requires balance." },
  9: { title: "Finish What Is Overdue and Let Go of the Past", text: "You may be feeling the pull of endings and emotional completion. There is a sense that something needs to be finished, released, or forgiven before you can fully move on. You may feel more emotional than usual, more compassionate, or more aware of what no longer belongs in your future." },
};

// ══════════════════════════════════════════════════════════
// PM DESCRIPTIONS (Personal Month — outer environment)
// ══════════════════════════════════════════════════════════
export const PM_DESCRIPTIONS: Record<number, { title: string; text: string }> = {
  1: { title: "Start the New Chapter Calmly", text: "Life is opening a new door. New opportunities, fresh ideas, or a change in direction may appear in your environment. The world around you is encouraging you to begin something, take initiative, or step into unfamiliar territory." },
  2: { title: "Communicate Carefully and Stay Emotionally Balanced", text: "Life is asking for careful communication, patience, and attention to detail. Situations may require tact, cooperation, or delicate handling. The environment is testing your ability to listen, be diplomatic, and work with others without losing your emotional balance." },
  3: { title: "Let Joy and Connection Help You Move Forward", text: "Life is bringing social energy, creative opportunities, and moments of connection or joy. The environment may feel lighter, more expressive, or more socially active. New people, conversations, or creative openings may appear." },
  4: { title: "Deal with Reality Directly and Build Better Structure", text: "Life is putting practical realities directly in front of you. Work demands, financial matters, structural issues, or responsibilities that require discipline and effort are showing up. The environment is serious and requires honest, grounded attention." },
  5: { title: "Take Action, Stay Flexible, and Don't Neglect What Matters", text: "Life is moving fast. Changes, opportunities, social activity, or unexpected events may arrive quickly. The environment is energetic, varied, and possibly unpredictable. Flexibility and adaptability are needed to navigate the pace." },
  6: { title: "Care for Home, Family, and Emotional Responsibility", text: "Life is calling your attention to home, family, health, or close relationships. The environment may feel emotionally demanding, requiring you to give more of yourself, support others, or take responsibility for matters that affect the people closest to you." },
  7: { title: "Step Back and See the Truth More Clearly", text: "Life is slowing down and asking you to look deeper. The environment may feel quieter, or situations may arise that require careful thought, research, or honest evaluation rather than quick action. Things may not be as they appear on the surface." },
  8: { title: "Be Objective, Set Boundaries, and Finish What Needs Finishing", text: "Life is bringing matters of money, authority, business, or practical power to the forefront. The environment demands objectivity, strong boundaries, and careful management. Unfinished business may surface, and the consequences of past actions may become visible." },
  9: { title: "Let the Results Show and Release What Is Done", text: "Life is closing a chapter. Results from past efforts may appear, endings may become clear, and the environment may ask you to let go, complete, or serve others as part of a natural conclusion. What is finished is asking to be released." },
};

// ══════════════════════════════════════════════════════════
// MIND'S DEFAULT MODE (Free Version Teasers)
// ══════════════════════════════════════════════════════════
export const MINDS_DEFAULT_MODE: Record<number, string> = {
  1: "Your mind learned early on to stand on its own. You are highly original and self-directed. You do not let other people's loud voices or confident opinions change your inner truth. When you lock onto an idea, your brain tunnels in with intense focus, cutting through the noise so you don't get stuck. It is a brilliant survival skill. But under stress, this intense focus creates a very specific \"tunnel vision\" that can actually block your success. There is a hidden cost to moving this fast, and a secret to how your mind perfectly resets itself...",
  2: "Your mind does not just take the loud, obvious path; it takes the subtle one. You don't only think in cold facts. You feel the energy in the room, and your nervous system is always sensing the quiet things people are not saying out loud. Because of this, you are amazing at seeing everyone's point of view. But holding all those perspectives creates a unique trap for your brain. When it comes time to make a decision, your mind tends to freeze in a very specific way...",
  3: "Your mind is like a fast-moving river. It does not flow in a straight line, and it isn't supposed to. If your thoughts seem scattered, it is not because you are unfocused or broken. Your brain is simply built to explore, constantly testing out different possibilities to find the safest or best route. You process the world in stories and patterns, not boring checklists. This makes you incredibly original. But without one crucial element, your brilliant ideas will stay scattered forever...",
  4: "Your mind loves steps, rules, and order. To your nervous system, chaos feels like danger. So, your brain brilliantly protects you by being prepared, thinking things through from start to finish. You are the steady anchor everyone else relies on when life gets messy or panicked. But what happens when this deep need for safety starts holding you back? There is a specific way your mind reacts to untested ideas, and understanding this hidden reflex is the key to unlocking your true growth...",
  5: "Your mind was built for rapid movement. It is highly flexible, adaptable, and incredibly fast. Where other people see a dead end or a brick wall, your brain instantly finds a hidden door. You can read a room in seconds and change your plan just as fast — a brilliant survival skill for unpredictable times. But this lightning-fast mind has a hidden shadow. When the pressure is on, your brain can easily confuse \"escaping\" with \"winning.\"...",
  6: "Your mind is deeply focused on relationships and connection. Before you make a choice, your brain automatically asks: \"How will this affect the people around me?\" You notice the tiny emotional details and quiet shifts that everyone else misses. Your mind is perfectly built to defend, teach, and care. But because you care so deeply about making things fair, your nervous system often gets pulled into a specific, painful trap...",
  7: "Your mind refuses to be satisfied with simple, easy answers. Simple does not feel safe to you. Your brain needs to dig down to the absolute truth to feel secure, pulling on the thread until you understand how everything connects. You easily spot the root cause of a problem long before other people do. This deep seeking makes your mind brilliant, but it also creates a hidden perfectionism that can silently ruin your peace...",
  8: "Your mind lives entirely in the big picture. You are a visionary thinker who doesn't just want to fix a small problem; you want to completely change the system. You easily mix hard logic with giant dreams, seeing the final outcome with perfect clarity. But because you see the finish line so clearly, your nervous system has a massive trigger: patience...",
  9: "Your mind acts like a quiet, brilliant observer. When you walk into a room, your nervous system immediately reads what people expect, hope for, and fear. Because you take in so much data, you usually stay quiet at first, letting others speak. Then, you easily spot the real truth that everyone else missed. Your mind is incredibly wise. But there is a specific, hidden reason you hide your own voice when it matters most...",
  11: "Your mind does not take the stairs; it takes the elevator. You do not rely on step-by-step logic. Instead, you get answers like a sudden flash of light in a dark room. Your nervous system is absorbing patterns much faster than your conscious brain can explain. Because of this, people might misunderstand you, and you may have even been taught to doubt your own gut. But your direct, felt knowing is real...",
  22: "Your mind carries a very rare and powerful blend: giant vision mixed with heavy structure. You do not just imagine wild, beautiful things; you actually know how to design them and build the foundation in the dirt. You naturally hold both the grand blueprint and the heavy bricks. But carrying this kind of mental weight creates a unique tension in your nervous system...",
};

// ══════════════════════════════════════════════════════════
// FULL NAME DESCRIPTIONS (from VI — Profile Overviews)
// ══════════════════════════════════════════════════════════
export interface FullNameProfile {
  overview: string;
  workStyle: string;
  abilities: string;
  notSuited: string;
  negativeTraits: string;
}

export const FULL_NAME_DESCRIPTIONS: Record<number, FullNameProfile> = {
  1: {
    overview: "You operate best when you steer your own ship. Autonomy brings your system online. You naturally scan for what is unfinished, assess the shortest viable path, and move without waiting to be told. Initiative is not a mood for you, it is your baseline. People trust you with outcomes because you carry responsibility as if it belongs to you. When there is a blank page or an unclear frontier, your mind wakes up. You orient, choose, and advance. Too much oversight dulls your edge, while freedom sharpens it and turns effort into momentum.",
    workStyle: "You work from an inner engine that prefers clean lines and direct motion. You rarely need hand holding because you expect to figure things out as you go. You take an idea, build a skeleton quickly, and fill in details while moving. Others often experience you as decisive and energetic because you convert thought into action before friction accumulates. When you choose a target you narrow your focus and remove distractions, which makes you look single minded. You are capable of sustained output, but you do your best work when the environment respects pace, clarity, and ownership.",
    abilities: "You excel in first-in roles, start-ups, new initiatives, turnarounds, and any project that requires someone to define the game while playing it. You can hold uncertainty without freezing and you make useful calls with limited data. Your originality shows up in method rather than flash. You find an approach that fits how your brain organizes problems, then you protect that approach so you can deliver.",
    notSuited: "Highly subordinate roles that restrict judgment will compress you. If a culture prizes consensus over clarity, you will feel caged. Environments that punish initiative, or reward playing small to avoid blame, will slowly turn your strengths into frustration.",
    negativeTraits: "Your common risks are premature action, contempt for process, and taking command when the landscape does not support it. If you launch before you are ready, you invite accidents, reputational bruises, and learning curves that demand time you could have saved.",
  },
  2: {
    overview: "You bring steadiness, patience, and the capacity to notice what others skip. You prefer harmony that is earned through careful attention, not through avoidance. Order is soothing for you, because order signals safety and integrity. You like things to have a proper place and a correct sequence, not from fussiness, but from respect for how quality is created. People confide in you because you listen fully before you speak.",
    workStyle: "You prepare before you begin. You organize tools, confirm instructions, and create a workspace that allows accuracy. You prefer a measured pace because accuracy requires time and you are unwilling to pay for speed with mistakes. You move through tasks methodically and keep momentum by eliminating small confusions early.",
    abilities: "Detail is your friend. You can track fine points without losing the whole. Mediation and counseling suit you because you can hold multiple perspectives while protecting dignity. You are skilled at evaluation, triage, and calibration.",
    notSuited: "Environments that prize blunt authority, aggressive confrontation, or performative dominance will exhaust you. Roles that require hard selling, especially cold outreach without a consultative frame, misuse your temperament.",
    negativeTraits: "Your inner life can become so private that isolation grows around you. Secrecy for protection can slide into secrecy that erodes trust. Radical ideas are not the issue, acting them out without testing impact is the risk.",
  },
  3: {
    overview: "You are expressive, imaginative, and emotionally resonant. You lift the tone of rooms and projects by adding color, story, humor, and rhythm. Communication is not just what you do, it is how you metabolize experience. You come alive when you can translate feeling into form. People experience you as bright, quick, and engaging.",
    workStyle: "You like to make things vivid. You look at a bland idea and ask how it could be felt, seen, or heard more clearly. You are excellent in roles that need a creative specialist who can shape raw material into something people want.",
    abilities: "You can carry a concept from spark to finished expression. You write, speak, design, compose, perform, improvise, or orchestrate others who do. Advertising, media, content, design, education, entertainment, and public-facing roles benefit from your presence.",
    notSuited: "Work that suppresses expression or isolates you in repetitive tasks with no human contact will flatten your energy. You can become reactive under prolonged pressure that does not honor feeling.",
    negativeTraits: "Oversensitivity, gossip, and careless speech are your main hazards. Words carry consequences and your words move people. Protect that power.",
  },
  4: {
    overview: "You are grounded, practical, and committed to workmanship. You like to know how things function and you take satisfaction in making them function better. You prefer a hands-on relationship with your craft and you give loyalty where fairness and clarity are present.",
    workStyle: "You work step by step. You check, measure, and verify. You rarely cut corners because you know that shortcuts create callbacks. Your output may not be the fastest, but it tends to be the most reliable.",
    abilities: "You build things that last. Construction, engineering, finance, operations, logistics, systems design, and project management all suit your wiring. You are the backbone of any organization.",
    notSuited: "Chaotic, poorly managed environments with shifting priorities and unclear expectations will frustrate you deeply. You need structure to perform.",
    negativeTraits: "Rigidity, stubbornness, and a tendency to confuse familiarity with safety. When change arrives, your instinct to resist can delay adaptation.",
  },
  5: {
    overview: "You are adaptable, resourceful, and energized by variety. You learn quickly, adjust fast, and thrive where monotony would destroy others. Freedom is not a luxury for you, it is a requirement for healthy function.",
    workStyle: "You rotate between tasks, interests, and modes of expression. You are a natural multitasker who keeps energy high by switching contexts. You prefer dynamic environments where no two days look the same.",
    abilities: "Sales, marketing, travel, media, entertainment, writing, public relations, and any role requiring persuasion, adaptability, or audience engagement. You connect with people effortlessly.",
    notSuited: "Slow, bureaucratic environments with rigid hierarchies and endless approval chains will drain your life force. You need movement and autonomy.",
    negativeTraits: "Inconsistency, overindulgence, and a tendency to leave things half-finished. Your hunger for the new can sabotage the good you already have.",
  },
  6: {
    overview: "You are responsible, nurturing, and drawn to service. You see what needs to be done and you do it, often before being asked. Community, family, and the wellbeing of others are central to your identity.",
    workStyle: "You create environments where others feel supported and safe. You manage with empathy and hold teams together through care, consistency, and moral clarity.",
    abilities: "Teaching, counseling, healthcare, social work, interior design, hospitality, and any role where human connection and quality of service matter. You set the emotional tone.",
    notSuited: "Highly competitive environments that reward individual achievement at the expense of group welfare will conflict with your values.",
    negativeTraits: "Over-giving, martyrdom, and a need to control others through care. When your help becomes a chain rather than a gift, relationships suffer.",
  },
  7: {
    overview: "You are analytical, perceptive, and drawn to the truth beneath the surface. You question what others accept, and you need understanding before you can commit. Your mind is your primary instrument.",
    workStyle: "You prefer depth over breadth. You investigate, research, analyze, and refine. You work best alone or in small, focused groups where quality of thought is valued over speed of output.",
    abilities: "Research, analysis, science, technology, writing, philosophy, psychology, and any field where deep thinking produces better outcomes. You are the mind behind the curtain.",
    notSuited: "Loud, social, high-pressure sales environments or roles that require constant small talk and surface-level interaction.",
    negativeTraits: "Isolation, cynicism, and intellectual arrogance. When your need for understanding becomes a refusal to engage, you lose the human connection that grounds your insights.",
  },
  8: {
    overview: "You are ambitious, strategic, and built for leadership at scale. You see systems, power structures, and leverage points that others miss. You are drawn to large goals and willing to put in the work to achieve them.",
    workStyle: "You delegate, organize, and manage complexity. You make decisions quickly and hold yourself accountable for results. You prefer to lead and you lead with authority.",
    abilities: "Business, finance, law, real estate, politics, executive management, and any role requiring strategic vision, financial acumen, and the ability to handle high-stakes decisions.",
    notSuited: "Roles that lack autonomy, authority, or meaningful challenge. You need scope to operate and consequences that match your effort.",
    negativeTraits: "Workaholism, material obsession, and a tendency to equate worth with achievement. When power becomes the goal instead of the tool, relationships and health suffer.",
  },
  9: {
    overview: "You are compassionate, wise, and oriented toward the greater good. You see life in broad terms and you are drawn to causes, communities, and ideas that serve more than just yourself. You carry a quiet authority that comes from understanding.",
    workStyle: "You work with purpose. You need to believe in what you do, or your energy collapses. You are capable of extraordinary output when the mission aligns with your values.",
    abilities: "Education, healing, counseling, creative arts, humanitarian work, law, politics, and any field where wisdom, empathy, and broad perspective improve outcomes.",
    notSuited: "Petty, small-minded environments focused solely on profit without purpose. You need meaning in your work.",
    negativeTraits: "Emotional volatility, self-righteousness, and a tendency to lose yourself in others' problems. Setting boundaries is essential to sustain your gifts.",
  },
};
