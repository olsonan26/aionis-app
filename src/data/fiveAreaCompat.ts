/**
 * Five-Area Love Compatibility System
 *
 * Area 1: First Name # — already in loveDescriptions.ts
 * Area 2: Whole Name # (Expression) — how you naturally present in the relationship
 * Area 3: Heart's Desire # (Soul Urge) — deepest compatibility; the MOST important match
 * Area 4: Day of Birth # (1-31 raw) — daily rhythm compatibility
 * Area 5: Whole Birthday # (Birth Force) — core life energy compatibility
 */

export interface AreaMatch {
  area: string;
  label: string;
  icon: string;
  weight: number; // 1-5, Heart's Desire = 5
  userValue: number;
  partnerValue: number;
  userCompound: string;
  partnerCompound: string;
  harmony: "strong" | "moderate" | "challenging";
  description: string;
}

// Number harmony matrix: which numbers naturally resonate
const STRONG_PAIRS: [number, number][] = [
  [1, 5], [1, 3], [1, 9],
  [2, 4], [2, 6], [2, 8],
  [3, 5], [3, 6], [3, 9],
  [4, 6], [4, 8],
  [5, 7], [5, 9],
  [6, 9],
  [7, 4],
];

const CHALLENGING_PAIRS: [number, number][] = [
  [1, 4], [1, 8],
  [2, 5], [2, 9],
  [3, 4], [3, 8],
  [4, 5],
  [6, 7],
  [7, 8],
  [8, 9],
];

function getHarmony(a: number, b: number): "strong" | "moderate" | "challenging" {
  if (a === b) return "strong";
  const check = (pairs: [number, number][]) =>
    pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
  if (check(STRONG_PAIRS)) return "strong";
  if (check(CHALLENGING_PAIRS)) return "challenging";
  return "moderate";
}

/* ═══════════════════════════════════════════════════════
   EXPRESSION (Whole Name) COMPATIBILITY
   ═══════════════════════════════════════════════════════ */

const expressionCompat: Record<string, string> = {
  "same": "You two express yourselves in remarkably similar ways. This creates an instant sense of understanding — you 'get' each other's approach to life, work, and communication. The risk is that you may amplify each other's weaknesses as easily as your strengths. Stay conscious of your shared blind spots.",

  "1-2": "PERSON_A leads with bold independence while PERSON_B brings patience and diplomacy. This can be a powerful combination — PERSON_A provides direction and PERSON_B provides the emotional intelligence to navigate the details. Conflict arises when PERSON_A moves too fast or PERSON_B feels overlooked.",
  "1-3": "Both of you are creative and expressive. PERSON_A initiates and PERSON_B amplifies with charm and social grace. Together you light up any room. The challenge is follow-through — make sure one of you anchors the big ideas into reality.",
  "1-4": "PERSON_A thrives on innovation while PERSON_B values structure and stability. This creates tension but also incredible balance when respected. PERSON_A pushes boundaries; PERSON_B ensures nothing falls apart. Learn to appreciate what the other provides.",
  "1-5": "Dynamic, exciting, and fast-paced — you both love new experiences and hate being boxed in. The energy between you is electric. The danger is burnout or scattered attention. Ground yourselves in shared goals and this partnership becomes unstoppable.",
  "1-6": "PERSON_A is driven by personal vision while PERSON_B is motivated by love and responsibility. When aligned, PERSON_A's ambition is supported by PERSON_B's nurturing strength. When misaligned, PERSON_A may feel controlled and PERSON_B may feel unappreciated.",
  "1-7": "PERSON_A acts on instinct; PERSON_B analyzes deeply before moving. This contrast creates fascinating conversations and mutual growth. PERSON_A learns patience; PERSON_B learns to take leaps. Give each other space to operate differently.",
  "1-8": "Two powerhouses. You both want to lead, achieve, and make an impact. This is either an incredible power couple or a constant power struggle. Success requires clearly defined lanes and genuine respect for each other's authority.",
  "1-9": "PERSON_A is focused on the self and new beginnings; PERSON_B operates from a broader, humanitarian perspective. This combination creates depth — PERSON_A learns compassion while PERSON_B gains decisive energy. Beautiful if ego is kept in check.",
  "2-3": "PERSON_B's expressive energy draws PERSON_A out of their shell. PERSON_A's emotional depth gives PERSON_B something real to anchor to. This is a pairing where feelings flow freely. The work is making sure both feel heard equally.",
  "2-4": "A steady, loyal combination. You both value security, commitment, and doing things right. The foundation you build together is rock-solid. Just make sure routine doesn't replace romance — schedule spontaneity intentionally.",
  "2-5": "PERSON_A craves emotional depth and consistency; PERSON_B craves freedom and variety. This requires real compromise. When it works, PERSON_B helps PERSON_A live more freely and PERSON_A helps PERSON_B connect more deeply.",
  "2-6": "A deeply nurturing match. Both of you prioritize care, family, and emotional well-being. PERSON_B takes on a protective role that PERSON_A appreciates. The risk is codependency — ensure both partners maintain their individual identity.",
  "2-7": "A quiet, intuitive connection. You communicate on wavelengths others can't see. PERSON_B's analytical depth pairs beautifully with PERSON_A's emotional intelligence. Make sure you actually talk, though — don't assume the other always knows.",
  "2-8": "PERSON_B's drive for achievement and PERSON_A's need for partnership can complement well. PERSON_A supports PERSON_B's ambitions with loyalty and care; PERSON_B provides the stability and success PERSON_A values. Balance work and intimacy.",
  "2-9": "PERSON_B's big-picture compassion meets PERSON_A's personal emotional needs. This is a beautiful match when PERSON_B channels their humanitarian energy into the relationship. The risk is PERSON_A feeling like one of many causes rather than the priority.",
  "3-4": "Creative meets practical. PERSON_A brings ideas, joy, and social energy; PERSON_B brings discipline, reliability, and grounding. This partnership thrives when both respect the other's contribution. Friction comes when PERSON_A feels restricted or PERSON_B feels chaos.",
  "3-5": "Fun, magnetic, and social. You're the life of every gathering. Both love stimulation, variety, and expression. The challenge is depth — with so much happening on the surface, make sure you're also building emotional roots together.",
  "3-6": "A warm, expressive connection. PERSON_A brings playfulness and PERSON_B brings devotion. PERSON_B may try to 'perfect' the relationship while PERSON_A just wants to enjoy it. When you meet in the middle, this is beautiful.",
  "3-7": "PERSON_A lives in the social world; PERSON_B lives in the inner world. This is a pairing that can either fascinate or frustrate. The magic happens when PERSON_A helps PERSON_B lighten up and PERSON_B helps PERSON_A find depth.",
  "3-8": "PERSON_A's creativity and PERSON_B's business acumen make a formidable team. Where PERSON_A imagines, PERSON_B executes. The friction is in priorities — PERSON_A wants joy, PERSON_B wants results. Find the overlap.",
  "3-9": "A deeply creative and compassionate match. Both of you feel strongly and express freely. PERSON_B adds wisdom and vision to PERSON_A's enthusiasm. Together you can inspire others. Avoid drama by grounding feelings in clear communication.",
  "4-5": "Structure versus freedom — the classic tension. PERSON_A needs routine and reliability; PERSON_B needs novelty and movement. This works only with intentional effort: structured times together, freedom within agreed boundaries.",
  "4-6": "Rock-solid stability. Both of you value home, loyalty, and doing things right. PERSON_B's nurturing meets PERSON_A's reliability in a combination that's built to last. Add some adventure occasionally — you both tend toward the comfortable.",
  "4-7": "Two thinkers who approach from different angles. PERSON_A is practical and PERSON_B is intuitive. Together you cover every base. This pairing often has quiet, powerful chemistry beneath a calm surface.",
  "4-8": "A power duo for building. PERSON_A provides the plan; PERSON_B provides the drive. Together you can create empires. The risk is becoming all work and no play. Remember to celebrate and connect emotionally.",
  "4-9": "PERSON_A builds structures; PERSON_B transcends them. This is a growth pairing that challenges both of you. PERSON_A learns to let go of rigidity; PERSON_B learns to honor commitments. Respect the difference.",
  "5-6": "PERSON_A wants adventure; PERSON_B wants home. This creates a dynamic push-pull that can be enriching if both flex. PERSON_A brings excitement to PERSON_B's world; PERSON_B provides the anchor PERSON_A secretly needs.",
  "5-7": "An intellectually stimulating pair. PERSON_A explores the outer world; PERSON_B explores the inner world. You'll never bore each other. The challenge is pace — PERSON_A moves fast while PERSON_B needs time to process.",
  "5-8": "Bold and ambitious. PERSON_A brings resourcefulness and adaptability; PERSON_B brings power and strategic vision. This can be an incredible partnership if egos don't clash. Channel your combined energy toward shared goals.",
  "5-9": "Freedom-loving and humanitarian. You both have wide perspectives and dislike being confined. This pairing feels natural and easy. The work is grounding — with all your big-picture thinking, don't forget the everyday details of partnership.",
  "6-7": "Heart versus mind. PERSON_A nurtures through emotion and action; PERSON_B processes through analysis and solitude. PERSON_A may feel shut out; PERSON_B may feel smothered. Bridge the gap by learning each other's love language.",
  "6-8": "Strong and caring. PERSON_A provides warmth and family focus; PERSON_B provides financial security and authority. A classic partnership model that works when neither dominates. Mutual respect is the key.",
  "6-9": "Two deeply caring souls. PERSON_A cares at the personal/family level; PERSON_B cares at the universal level. This is a humanitarian power couple. Ensure PERSON_B doesn't neglect the immediate relationship for larger causes.",
  "7-8": "The strategist meets the mystic. PERSON_B operates in the material world; PERSON_A operates in the world of ideas and spirit. You challenge each other in productive ways. Both need to stay open to the other's realm.",
  "7-9": "Deep, philosophical, and wise. You both seek meaning beyond the surface. Conversations between you are rich and transformative. The risk is over-isolation from the practical world. Balance contemplation with action.",
  "8-9": "Power meets compassion. PERSON_B uses their influence for humanitarian goals; PERSON_A channels drive toward achievement. When aligned, you change the world. When misaligned, PERSON_A sees PERSON_B as impractical, and PERSON_B sees PERSON_A as materialistic.",
};

/* ═══════════════════════════════════════════════════════
   HEART'S DESIRE (Soul Urge) COMPATIBILITY — MOST IMPORTANT
   ═══════════════════════════════════════════════════════ */

const heartCompat: Record<string, string> = {
  "same": "Your deepest motivations are identical. This is powerful — you understand each other's core needs intuitively, often without words. You want the same things from life at the deepest level. This is the strongest indicator of long-term soul compatibility.",

  "1-2": "PERSON_A's soul craves independence and leadership, while PERSON_B's soul seeks partnership and harmony. At the deepest level, PERSON_A needs to feel autonomous while PERSON_B needs to feel connected. The magic is that PERSON_B can give PERSON_A space without losing themselves, and PERSON_A can commit without feeling trapped — if both are emotionally mature.",
  "1-3": "Both souls crave creative self-expression. PERSON_A expresses through action and originality; PERSON_B through art, words, and social connection. You inspire each other's deepest passions. When your creative fires align, the connection is electric.",
  "1-4": "PERSON_A's soul wants freedom to pioneer; PERSON_B's soul wants a stable foundation. These desires seem opposed but are actually complementary — PERSON_A provides excitement and PERSON_B provides security. The growth path is learning to need what the other offers.",
  "1-5": "Two souls that crave experience, movement, and novelty. You'll never bore each other at the deepest level. The risk is that neither wants to be the anchor. Someone needs to choose depth occasionally, or you'll always be chasing the next thrill together.",
  "1-6": "PERSON_A's deepest desire is self-determination; PERSON_B's is to love and be needed. PERSON_B will pour love into PERSON_A — but PERSON_A must be careful not to take it for granted. When PERSON_A channels their independence toward protecting what PERSON_B builds, this bond is unshakable.",
  "1-7": "Two independent souls, but for different reasons. PERSON_A wants autonomy to act; PERSON_B wants solitude to think. You give each other space naturally, which is rare and valuable. Connect intentionally during your together-time — quality over quantity defines this match.",
  "1-8": "Both crave power and impact, but express it differently. PERSON_A leads through initiative; PERSON_B leads through authority. At the heart level, you both want to matter. Channel this shared ambition toward a common vision and you become legendary together.",
  "1-9": "PERSON_A's heart wants to be first; PERSON_B's heart wants to serve the whole. This is a growth pairing at the deepest level — PERSON_A learns that true leadership is service, and PERSON_B learns that self-care isn't selfish.",
  "2-3": "PERSON_A's soul craves deep emotional intimacy; PERSON_B's soul craves joyful expression. PERSON_B lights up PERSON_A's inner world with color and laughter. PERSON_A gives PERSON_B the emotional grounding to express from a real place rather than a performative one.",
  "2-4": "Both souls prioritize security and commitment. You feel safe with each other at the deepest level. This is the match where both people can truly relax. The growth edge is making sure comfort doesn't become complacency.",
  "2-5": "PERSON_A's heart needs emotional safety; PERSON_B's heart needs stimulation. This is the most challenging soul combination — but if you both stretch, PERSON_A discovers that adventure doesn't have to mean chaos, and PERSON_B discovers that commitment doesn't have to mean boredom.",
  "2-6": "Your souls are deeply compatible. Both crave love, nurturing, and emotional richness. PERSON_B naturally provides the devoted care PERSON_A longs for. The risk is losing individual identity inside the cocoon you build. Keep your own passions alive.",
  "2-7": "An intuitive, almost psychic bond at the soul level. PERSON_A feels what PERSON_B thinks. You can sit in silence and communicate volumes. This is a rare match — honor it by being vulnerable even when you could hide behind your mutual understanding.",
  "2-8": "PERSON_A's heart needs partnership and tenderness; PERSON_B's heart needs achievement and control. When PERSON_B softens enough to receive PERSON_A's care, and PERSON_A is strong enough to hold space for PERSON_B's intensity, this is transformative.",
  "2-9": "PERSON_A wants intimate personal love; PERSON_B wants universal love for all. The question is whether PERSON_B can narrow their vast compassion into the one-on-one devotion PERSON_A craves. When they can, this is a deeply soulful match.",
  "3-4": "Joy meets discipline at the soul level. PERSON_A's heart wants to play and create; PERSON_B's heart wants to build and secure. You balance each other's excesses naturally. PERSON_A teaches PERSON_B to lighten up; PERSON_B teaches PERSON_A to follow through.",
  "3-5": "Two free-spirited souls that love life. Your heart energies are highly compatible — both crave expression, experience, and fun. The challenge is building emotional depth beneath the surface sparkle. When you do, this bond has both fire and foundation.",
  "3-6": "PERSON_A's heart needs creative freedom; PERSON_B's heart needs to nurture and perfect. PERSON_B may try to 'improve' PERSON_A's spontaneous nature. When PERSON_B learns to love PERSON_A's wildness, and PERSON_A appreciates PERSON_B's devotion, it's a love story.",
  "3-7": "The artist and the philosopher. At the soul level, you're both seekers — PERSON_A seeks through expression and PERSON_B seeks through contemplation. You fascinate each other. Connect through ideas and creative projects.",
  "3-8": "PERSON_A's soul is light and expressive; PERSON_B's is intense and driven. PERSON_B may find PERSON_A's lightness refreshing — or frustrating. PERSON_A may find PERSON_B's intensity exciting — or exhausting. Mutual respect for different heart-speeds is essential.",
  "3-9": "Both hearts are generous, creative, and emotionally expansive. You understand each other's need to give and express. This is a naturally harmonious soul connection where both feel free to be their fullest selves.",
  "4-5": "The most contrasting soul desires: PERSON_A wants routine, PERSON_B wants change. If you can find the third way — structured adventure, reliable spontaneity — this pairing forces incredible growth. Most people don't make it work; the ones who do are extraordinary.",
  "4-6": "Both hearts prioritize duty, family, and building something real. You share a deep commitment to the people you love. This is a match where trust forms quickly and deepens over time. Add novelty to prevent the relationship from becoming purely functional.",
  "4-7": "Two introspective souls. PERSON_A processes through doing; PERSON_B processes through thinking. You both need personal space and respect each other's boundaries. The connection deepens slowly but becomes very solid once trust is established.",
  "4-8": "Achievement-oriented hearts. You both feel most alive when building something meaningful. Together you can create lasting structures — families, businesses, legacies. Remember to nourish the emotional bond, not just the shared projects.",
  "4-9": "PERSON_A's heart wants to build permanent things; PERSON_B's heart wants to let go and transform. This creates powerful friction that, when embraced, leads to spiritual growth for both. PERSON_A learns impermanence; PERSON_B learns commitment.",
  "5-6": "PERSON_A's soul craves freedom; PERSON_B's craves devotion. The dance between these desires is the entire story of this match. When PERSON_B gives without chains and PERSON_A chooses to stay without being forced, this is the real love story.",
  "5-7": "Two seekers with different methods. PERSON_A explores externally; PERSON_B explores internally. Your combined wisdom covers the entire spectrum of experience. Intellectually, this is one of the most stimulating heart matches.",
  "5-8": "PERSON_A's heart wants freedom; PERSON_B's wants mastery. Both are powerful desires. When directed toward a shared mission, this becomes an unstoppable partnership. Without shared direction, you'll compete for control of the relationship's pace.",
  "5-9": "Two expansive, freedom-loving hearts. You intuitively understand each other's need for space, experience, and meaning. This is an easy, flowing match that benefits from intentional depth-building exercises.",
  "6-7": "PERSON_A nurtures through action and emotion; PERSON_B nurtures through wisdom and insight. At the soul level, you both care deeply — but express it in vastly different ways. Learn each other's love language or risk feeling unloved by someone who actually adores you.",
  "6-8": "PERSON_A's heart is home-centered; PERSON_B's is achievement-centered. Together you build a life that has both warmth and success. The key is ensuring neither value system dominates — both the home and the career deserve equal energy.",
  "6-9": "Two hearts born to serve. PERSON_A serves family and community; PERSON_B serves humanity. Your combined compassion can change the world. Just make sure you're serving each other too, not just your respective missions.",
  "7-8": "PERSON_A seeks truth; PERSON_B seeks power. At the soul level, these can complement beautifully — PERSON_A's wisdom guides PERSON_B's authority. The friction is pace and priority. PERSON_A needs time to process; PERSON_B needs results now.",
  "7-9": "Two old souls. PERSON_A seeks hidden truth; PERSON_B seeks universal meaning. Your conversations reach depths most couples never access. This is a spiritual partnership that transcends the mundane — make sure you also handle mundane life together.",
  "8-9": "PERSON_A wants to build empires; PERSON_B wants to heal the world. When PERSON_A uses their power for PERSON_B's vision, and PERSON_B channels compassion through PERSON_A's structures, you become a force for lasting change.",
};

/* ═══════════════════════════════════════════════════════
   DAY OF BIRTH COMPATIBILITY (1-31 raw → reduced to 1-9)
   ═══════════════════════════════════════════════════════ */

const dayOfBirthCompat: Record<string, string> = {
  "same": "You share the same daily rhythm and natural approach to life. This creates ease in everyday interactions — you naturally sync on timing, energy levels, and daily preferences. Mundane life together flows smoothly.",

  "1-2": "PERSON_A naturally takes charge of daily decisions while PERSON_B handles the emotional nuances. In day-to-day life, this is a practical division that works well. PERSON_A decides where to eat; PERSON_B decides the mood of the evening.",
  "1-3": "Your daily energies are both active and outward-facing. Mornings are animated, plans are spontaneous, and neither of you likes sitting still. Daily life together is fun but can be exhausting — schedule rest intentionally.",
  "1-4": "PERSON_A wants to try new things daily; PERSON_B wants a reliable routine. This daily friction is small but persistent. The solution: a stable weekly structure with room for PERSON_A's spontaneous moments within it.",
  "1-5": "High-energy daily compatibility. You both wake up ready to do something new. Daily life is exciting and fast-paced. The challenge is that neither wants to handle the boring tasks — assign chores clearly.",
  "1-6": "PERSON_A starts the day focused on personal goals; PERSON_B starts it thinking about the household and loved ones. You naturally divide daily responsibilities. Appreciate what the other handles without being asked.",
  "1-7": "PERSON_A is a morning person who hits the ground running; PERSON_B needs quiet time to start the day. Respect each other's daily rhythm — don't force your pace on the other. Meet in the middle by afternoon.",
  "1-8": "Two people who take each day seriously and want to make it count. Your daily energies are both strong and directed. Be careful of power struggles over small decisions — pick your battles wisely.",
  "1-9": "PERSON_A approaches each day with personal ambition; PERSON_B approaches it with awareness of others' needs. Daily life together has both drive and compassion. PERSON_B helps PERSON_A slow down; PERSON_A helps PERSON_B focus.",
  "2-3": "Gentle energy meets vibrant energy in daily life. PERSON_A creates calm; PERSON_B creates excitement. Your daily rhythms are different but complementary — mornings and evenings may be your best connection points.",
  "2-4": "A naturally harmonious daily rhythm. Both of you prefer predictability, comfort, and care in everyday life. Meals are regular, homes are tidy, and routines are respected. Add surprise dates to keep it fresh.",
  "2-5": "Daily life can feel challenging — PERSON_A wants quiet consistency while PERSON_B wants constant stimulation. Small daily compromises prevent this from becoming a source of resentment. Alternate who plans the day.",
  "2-6": "Naturally synced in daily life. Both prioritize home, comfort, and caring for loved ones. Meals together, shared tasks, and emotional check-ins happen organically. This is one of the most harmonious daily rhythms.",
  "2-7": "Both of you appreciate quiet, thoughtful days. You don't need constant activity to feel connected. Shared reading, walks, and meaningful conversations fill your time naturally. Beautiful daily compatibility.",
  "2-8": "PERSON_B's daily drive for productivity can overwhelm PERSON_A's need for gentleness. Find times each day where achievement is paused and connection is the only goal. Evening hours are your sweet spot.",
  "2-9": "Warm, caring daily energy from both sides. PERSON_A cares for the immediate environment; PERSON_B cares broadly. Daily life has a humanitarian flavor — volunteering together or helping neighbors strengthens your bond.",
  "3-4": "PERSON_A wants each day to be interesting; PERSON_B wants each day to be productive. This daily tension is actually healthy — PERSON_A prevents PERSON_B from becoming a workaholic, and PERSON_B helps PERSON_A accomplish real things.",
  "3-5": "Every day is an adventure. You both bring energy, ideas, and social enthusiasm to daily life. Your shared calendar is packed. Make sure to schedule quiet days together — not every day needs to be exciting.",
  "3-6": "PERSON_A brings joy to daily routines; PERSON_B brings care and structure. Meals are a highlight — PERSON_B cooks with love, PERSON_A brings the conversation. Domestic life is warm and lively.",
  "3-7": "PERSON_A fills the day with social energy; PERSON_B needs significant alone time. The key is not taking PERSON_B's need for solitude personally. When PERSON_B emerges, PERSON_A's light meets PERSON_B's depth beautifully.",
  "3-8": "PERSON_A adds lightness to PERSON_B's intense daily schedule. PERSON_B grounds PERSON_A's scattered energy. Daily life works when you appreciate these different contributions rather than judging them.",
  "3-9": "Both of you bring warmth and generosity to each day. Daily life is filled with giving — to each other, to friends, to causes. Beautiful daily compatibility that feeds both hearts.",
  "4-5": "The hardest daily match to navigate. PERSON_A wants the same routine; PERSON_B wants to tear up the routine. Daily life requires constant negotiation. Structure the weekdays, free up the weekends.",
  "4-6": "Effortless daily harmony. Both value a well-run household, consistent routines, and caring for family. You naturally divide responsibilities and rarely fight about daily logistics. A very stable daily life.",
  "4-7": "Quiet, focused daily energy. Neither of you needs constant stimulation. PERSON_A works steadily; PERSON_B thinks deeply. Evenings together are peaceful and intellectually engaging.",
  "4-8": "Productivity is high — you both approach each day as an opportunity to build something. Daily life is organized and efficient. Remember to build in fun — not everything needs to be an accomplishment.",
  "4-9": "PERSON_A's daily routine is disrupted by PERSON_B's spontaneous compassion (suddenly helping a friend, changing plans for a cause). Learn to hold your structure loosely and appreciate PERSON_B's big heart.",
  "5-6": "PERSON_A wants daily freedom; PERSON_B wants daily order at home. This works when PERSON_A has independent time built into the daily schedule and comes home to the warmth PERSON_B creates.",
  "5-7": "Both need independence in their daily routines. PERSON_A needs physical freedom; PERSON_B needs mental space. You naturally give each other room. Come together in the evenings with stories to share.",
  "5-8": "Two dynamic daily energies. PERSON_A explores; PERSON_B executes. Daily life is busy and productive. Make sure 'busy' includes quality time together, not just parallel productivity.",
  "5-9": "Both bring expansive energy to each day. Daily life is outward-facing — events, people, causes, travel. Create daily rituals that are just for the two of you to build intimacy amid the activity.",
  "6-7": "PERSON_A fills the day with care and domestic activity; PERSON_B needs significant contemplative time. Mornings might be separate; evenings together. Respect the rhythm and meet where you naturally overlap.",
  "6-8": "A well-functioning daily partnership. PERSON_A manages the home; PERSON_B manages the career. This traditional division works if both feel valued. Swap roles occasionally to stay connected to each other's worlds.",
  "6-9": "Both approach each day wanting to help others. Your daily life includes acts of service — for family, community, or the world. A deeply fulfilling daily rhythm when you don't forget to serve each other too.",
  "7-8": "PERSON_A needs quiet focus; PERSON_B needs active achievement. Your daily tempos differ. Mornings apart, evenings together works well. Respect that PERSON_A's thinking IS productive, even when it doesn't look like it.",
  "7-9": "Both bring depth and meaning to daily life. You don't do small talk at breakfast. Every day has a quality of significance. Beautiful for both — just make sure you also handle practical daily tasks.",
  "8-9": "PERSON_A drives through each day with ambition; PERSON_B flows through it with awareness. Together your days have both momentum and meaning. The tension is pace — PERSON_A fast, PERSON_B reflective.",
};

/* ═══════════════════════════════════════════════════════
   BIRTH FORCE COMPATIBILITY
   ═══════════════════════════════════════════════════════ */

const birthForceCompat: Record<string, string> = {
  "same": "Your core life energies are identical. You were born carrying the same fundamental vibration, which means you instinctively understand each other's strengths, challenges, and life patterns. This is a powerful bond — you're walking the same path.",

  "1-2": "PERSON_A was born with pioneering energy; PERSON_B was born with cooperative energy. Together you have both the initiative to start things and the diplomacy to sustain them. This is one of the most balanced life-energy combinations.",
  "1-3": "Two creative birth forces. PERSON_A creates through action; PERSON_B creates through expression. Your combined life energy is vibrant and productive. Together you generate ideas AND execute them.",
  "1-4": "PERSON_A's birth energy is about breaking new ground; PERSON_B's is about building on solid ground. You need each other — PERSON_A provides the spark, PERSON_B provides the structure. Mutual respect is essential.",
  "1-5": "Powerful, dynamic birth forces. Both of you were born with restless, active energy. Life together is exciting and constantly evolving. The challenge is creating stability — at least one of you needs to anchor occasionally.",
  "1-6": "PERSON_A was born to lead; PERSON_B was born to love. When PERSON_A leads with heart and PERSON_B loves with strength, this combination creates a beautiful, balanced life together.",
  "1-7": "Independent birth energies. PERSON_A's independence is active; PERSON_B's is contemplative. You give each other freedom naturally. The connection deepens through quality interactions rather than constant togetherness.",
  "1-8": "Two powerful birth forces. You both came into this world ready to make an impact. Together you're formidable — but you must decide to be on the same team. Compete with the world, not each other.",
  "1-9": "PERSON_A's birth force is about the self; PERSON_B's is about the whole. This is a growth-oriented combination that teaches both of you to expand your perspective. Beautiful evolution happens together.",
  "2-3": "PERSON_A's birth energy is sensitive and intuitive; PERSON_B's is expressive and social. Together you bring both depth and lightness to life. PERSON_A provides the emotional anchor; PERSON_B provides the joy.",
  "2-4": "Stable, reliable birth forces. Both of you were born with energy that values loyalty, consistency, and care. Your life together has a deep foundation of trust. Add adventure to keep the spark alive.",
  "2-5": "Contrasting birth energies that create growth through tension. PERSON_A's patient energy is challenged by PERSON_B's restless energy. This combination works when both commit to learning from the other's approach.",
  "2-6": "Harmonious birth forces. Both carry nurturing, love-oriented energy. Life together is centered on home, family, and emotional richness. One of the most naturally compatible birth force combinations.",
  "2-7": "Both birth forces carry introspective, quality-seeking energy. You were born to go deep, not wide. Together your life is rich with meaning, insight, and genuine connection.",
  "2-8": "PERSON_A was born with gentle energy; PERSON_B was born with powerful energy. Together you cover the full spectrum. PERSON_A humanizes PERSON_B's ambition; PERSON_B empowers PERSON_A's sensitivity.",
  "2-9": "Both birth forces are empathetic and service-oriented. PERSON_A serves through personal care; PERSON_B serves through universal compassion. Together your life has deep purpose and meaning.",
  "3-4": "Creative meets structural birth energy. PERSON_A was born to express; PERSON_B was born to build. The life you create together has both inspiration and follow-through — a rare and powerful combination.",
  "3-5": "Two vibrant, outward-facing birth energies. Life is a constant adventure filled with creativity and exploration. Ground this energy with shared goals to prevent it from becoming scattered.",
  "3-6": "Warm, creative birth forces. PERSON_A's expressive energy and PERSON_B's nurturing energy create a home filled with art, love, and laughter. Beautiful life compatibility.",
  "3-7": "Light meets depth. PERSON_A was born with expressive energy; PERSON_B with analytical energy. Your life together has both social richness and intellectual substance.",
  "3-8": "PERSON_A's creative birth energy meets PERSON_B's executive birth energy. Together you can build creative empires. Ensure the creative spirit isn't sacrificed for pure achievement.",
  "3-9": "Two generous, expressive birth forces. Your life together is filled with giving — to each other and to the world. A naturally harmonious and meaningful combination.",
  "4-5": "The most challenging birth force combination. PERSON_A's energy wants to settle; PERSON_B's energy wants to roam. Make it work by creating a stable home base with plenty of room for PERSON_B's adventures.",
  "4-6": "Two of the most stable birth forces. Your life together is built on rock-solid foundations — loyalty, duty, and love. This is a lifetime match when both stay engaged and growing.",
  "4-7": "Grounded and wise. PERSON_A builds the physical; PERSON_B builds the intellectual. Together you create a life of substance and depth. Quiet compatibility that deepens over decades.",
  "4-8": "Two builder birth forces. Everything you touch together becomes substantial. Your combined energy is focused on legacy — building something that lasts. Don't forget to enjoy the journey.",
  "4-9": "PERSON_A's structured energy meets PERSON_B's expansive energy. Your life together oscillates between building and releasing. This creates natural cycles of growth that keep the relationship evolving.",
  "5-6": "Freedom meets responsibility in your birth energies. This creates dynamic tension that, when managed well, gives your life both excitement and stability. Neither should try to change the other.",
  "5-7": "Both born with independent, seeking energy. PERSON_A seeks through experience; PERSON_B seeks through knowledge. Together you explore every dimension of life. Fascinating life partnership.",
  "5-8": "Dynamic and powerful birth forces. Both carry energy that makes things happen. Life together is fast-paced and achievement-oriented. Build in rest and emotional connection intentionally.",
  "5-9": "Expansive, freedom-loving birth forces. You both see the big picture and resist being confined. Life together has a global, meaningful quality. Ground it in daily care for each other.",
  "6-7": "Nurturing meets analytical birth energy. PERSON_A cares through action; PERSON_B cares through understanding. Different expressions of deep love. Learn to receive love in the other's language.",
  "6-8": "PERSON_A's loving birth energy and PERSON_B's powerful birth energy create a partnership that has both heart and strength. Your life together is both warm and accomplished.",
  "6-9": "Two of the most compassionate birth forces. Your life together is defined by love, service, and meaning. You inspire each other to be better. One of the most soulful combinations.",
  "7-8": "Wisdom meets power. PERSON_A was born to understand; PERSON_B was born to achieve. Together your life has both depth and impact. Respect each other's domain.",
  "7-9": "Two spiritual, meaning-seeking birth forces. Your life together transcends the ordinary. Deep conversations, shared growth, and a sense of higher purpose define your bond.",
  "8-9": "Power meets compassion at the birth level. Together you can achieve great things for the greater good. Your combined energy is meant for impact that benefits many people.",
};

/**
 * Build 5-area compatibility analysis
 */
export function buildFiveAreaCompat(
  userName: string,
  userDay: number,
  _userMonth: number,
  _userYear: number,
  userFirstNameVal: number,
  userFirstNameCompound: string,
  userExpression: { value: number; compound: string },
  userSoulUrge: { value: number; compound: string },
  userBirthForce: { value: number; compound: string },
  partnerName: string,
  partnerDay: number,
  _partnerMonth: number,
  _partnerYear: number,
  partnerFirstNameVal: number,
  partnerFirstNameCompound: string,
  partnerExpression: { value: number; compound: string },
  partnerSoulUrge: { value: number; compound: string },
  partnerBirthForce: { value: number; compound: string },
  firstNameLoveDesc: string | null,
): AreaMatch[] {
  const userFirst = userName.split(" ")[0];
  const partnerFirst = partnerName.split(" ")[0] || "Partner";

  function personalize(text: string): string {
    return text
      .replace(/PERSON_A/g, userFirst)
      .replace(/PERSON_B/g, partnerFirst);
  }

  function getDesc(map: Record<string, string>, a: number, b: number): string {
    if (a === b) return personalize(map["same"]);
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    const desc = map[key];
    if (!desc) return `${userFirst} carries the energy of ${a} while ${partnerFirst} carries the energy of ${b}. These numbers interact to create a unique dynamic in your relationship.`;
    // If a > b, we need to swap PERSON_A and PERSON_B since our map always has smaller first
    if (a > b) {
      return desc
        .replace(/PERSON_A/g, "§PARTNER§")
        .replace(/PERSON_B/g, userFirst)
        .replace(/§PARTNER§/g, partnerFirst);
    }
    return personalize(desc);
  }

  // Reduce day of birth to single digit for compatibility lookup
  const reduceDaySimple = (d: number): number => {
    let n = d;
    while (n > 9) n = String(n).split('').reduce((s, c) => s + Number(c), 0);
    return n;
  };

  const userDayReduced = reduceDaySimple(userDay);
  const partnerDayReduced = reduceDaySimple(partnerDay);

  const areas: AreaMatch[] = [
    {
      area: "first_name",
      label: "First Name Number",
      icon: "✍️",
      weight: 2,
      userValue: userFirstNameVal,
      partnerValue: partnerFirstNameVal,
      userCompound: userFirstNameCompound,
      partnerCompound: partnerFirstNameCompound,
      harmony: getHarmony(userFirstNameVal, partnerFirstNameVal),
      description: firstNameLoveDesc || getDesc(expressionCompat, userFirstNameVal, partnerFirstNameVal),
    },
    {
      area: "expression",
      label: "Whole Name Number",
      icon: "📛",
      weight: 3,
      userValue: userExpression.value,
      partnerValue: partnerExpression.value,
      userCompound: userExpression.compound,
      partnerCompound: partnerExpression.compound,
      harmony: getHarmony(userExpression.value, partnerExpression.value),
      description: getDesc(expressionCompat, userExpression.value, partnerExpression.value),
    },
    {
      area: "heart",
      label: "Heart's Desire",
      icon: "💜",
      weight: 5,
      userValue: userSoulUrge.value,
      partnerValue: partnerSoulUrge.value,
      userCompound: userSoulUrge.compound,
      partnerCompound: partnerSoulUrge.compound,
      harmony: getHarmony(userSoulUrge.value, partnerSoulUrge.value),
      description: getDesc(heartCompat, userSoulUrge.value, partnerSoulUrge.value),
    },
    {
      area: "day_of_birth",
      label: "Day of Birth",
      icon: "📅",
      weight: 2,
      userValue: userDay,
      partnerValue: partnerDay,
      userCompound: `Day ${userDay}`,
      partnerCompound: `Day ${partnerDay}`,
      harmony: getHarmony(userDayReduced, partnerDayReduced),
      description: getDesc(dayOfBirthCompat, userDayReduced, partnerDayReduced),
    },
    {
      area: "birth_force",
      label: "Whole Birthday Number",
      icon: "🎂",
      weight: 3,
      userValue: userBirthForce.value,
      partnerValue: partnerBirthForce.value,
      userCompound: userBirthForce.compound,
      partnerCompound: partnerBirthForce.compound,
      harmony: getHarmony(userBirthForce.value, partnerBirthForce.value),
      description: getDesc(birthForceCompat, userBirthForce.value, partnerBirthForce.value),
    },
  ];

  return areas;
}

/**
 * Calculate overall compatibility score from 5 areas
 */
export function calculateOverallCompat(areas: AreaMatch[]): number {
  let totalWeight = 0;
  let weightedScore = 0;

  for (const area of areas) {
    const score = area.harmony === "strong" ? 95 : area.harmony === "moderate" ? 70 : 45;
    weightedScore += score * area.weight;
    totalWeight += area.weight;
  }

  return Math.round(weightedScore / totalWeight);
}
