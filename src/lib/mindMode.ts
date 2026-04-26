/**
 * Mind Mode Calculator — from Vibrational Identity
 * Algorithm: First Name (reduced) + Day of Birth → Final (reduced)
 */

import { getLetterValue } from "./numerology";

function mmReduce(n: number): number {
  let v = n;
  while (v > 9 && v !== 11 && v !== 22) {
    v = String(v).split("").reduce((s, d) => s + Number.parseInt(d, 10), 0);
  }
  return v;
}

export interface MindModeResult {
  nameSum: number;
  nameReduced: number;
  totalSum: number;
  finalMode: number;
  description: string;
}

export function calcMindMode(firstName: string, dayOfBirth: number): MindModeResult {
  const nameStr = firstName.toUpperCase().replace(/[^A-Z]/g, "");
  let nameSum = 0;
  for (const char of nameStr) {
    nameSum += getLetterValue(char);
  }
  const nameReduced = mmReduce(nameSum);
  const totalSum = nameReduced + dayOfBirth;
  const finalMode = mmReduce(totalSum);

  return {
    nameSum,
    nameReduced,
    totalSum,
    finalMode,
    description: MIND_MODE_DESCRIPTIONS[finalMode] || "Your mind carries a unique combination of energies that defies simple categorization. This rare pattern suggests extraordinary potential for original thinking.",
  };
}

export const MIND_MODE_DESCRIPTIONS: Record<number, string> = {
  1: "Your mind learned early on to stand on its own. You are highly original and self-directed. When you lock onto an idea, your brain tunnels in with intense focus, cutting through noise. Under stress, this creates tunnel vision that can block success. Your brilliant bounce-back resilience is a core survival strategy. When your body gets tight with the urge to push through alone, pause — you don't have to fight the world to be safe anymore.",

  2: "Your mind takes the subtle path. You feel the energy in the room, sensing the quiet things people aren't saying. You're amazing at seeing everyone's point of view. But holding all those perspectives creates a freeze when it's time to decide. Beneath this overwhelm is a massive gift — you naturally know how to mediate, coordinate, and plan. Practice making tiny choices just for you.",

  3: "Your mind is like a fast-moving river — it doesn't flow in a straight line. If your thoughts seem scattered, your brain is built to explore, testing different possibilities. You process the world in stories and patterns, not checklists. You need just enough structure to land safely. You unlock a fresh angle when everyone else is stuck. Give your brilliant, wild mind a safe home to build from.",

  4: "Your mind loves steps, rules, and order. To your nervous system, chaos feels like danger. Your brain protects you by being prepared, thinking things through from start to finish. When faced with new, untested ideas, your nervous system can feel incredibly uncomfortable — not because you lack imagination, but because your mind is designed to protect you from chaos.",

  5: "Your mind was built for rapid movement — highly flexible, adaptable, and incredibly fast. Where others see a dead end, your brain instantly finds a hidden door. But this lightning-fast mind has a hidden shadow: under pressure, your brain can confuse 'escaping' with 'winning.' True freedom isn't always running away; sometimes it's having the courage to stay.",

  6: "Your mind is deeply focused on relationships and connection. Before any choice, your brain asks: 'How will this affect the people around me?' You notice tiny emotional details everyone else misses. But caring so deeply about fairness can pull you into losing the big picture. Practice saying: 'I care deeply, but this is not mine to fix.'",

  7: "Your mind refuses simple, easy answers. Simple doesn't feel safe. Your brain needs to dig down to the absolute truth, pulling on the thread until you understand how everything connects. This deep seeking creates hidden perfectionism that can silently ruin your peace. Practice looking at something 'good enough' and telling your brain, 'This is safe.'",

  8: "Your mind lives entirely in the big picture. You easily mix hard logic with giant dreams, seeing the final outcome with perfect clarity. But seeing the finish line so clearly makes patience your biggest trigger. Your true power unlocks when you learn to gently bring others along. Ask them what they need to feel safe. Walk with them instead of dragging them.",

  9: "Your mind acts like a quiet, brilliant observer. When you walk into a room, your nervous system immediately reads what people expect, hope for, and fear. You strip away what's fake and let the real truth reveal itself. Your biggest invitation is to trust your own voice sooner. The world desperately needs exactly what you're holding back.",

  11: "Your mind doesn't take the stairs — it takes the elevator. You get answers like a sudden flash of light. Your nervous system absorbs patterns faster than your conscious brain can explain. People might demand to know how you got your answer, but for you it's a direct knowing. Trust your own gut, even when others don't get it.",

  22: "Your mind carries a rare blend: giant vision mixed with heavy structure. You don't just imagine wild things; you know how to build the foundation. Right underneath your practical logic is deep intuition. When you combine felt awareness with building skills, you become unstoppable. But you don't have to carry the whole world to be worthy of taking up space.",
};

export const MIND_MODE_TITLES: Record<number, string> = {
  1: "The Pioneer Mind",
  2: "The Diplomat Mind",
  3: "The Creative Mind",
  4: "The Architect Mind",
  5: "The Explorer Mind",
  6: "The Guardian Mind",
  7: "The Seeker Mind",
  8: "The Visionary Mind",
  9: "The Sage Mind",
  11: "The Intuitive Mind",
  22: "The Master Builder Mind",
};
