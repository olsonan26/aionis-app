/**
 * Name Resonance Quiz Engine
 * 
 * Generates charts for multiple names, identifies key transit points
 * (letter transitions, S/A appearances, VA patterns), and creates
 * questions to determine which chart best matches a person's life.
 */

import { getLetterValue, expandNamePart, reduceToSingle, compoundTrail } from "./numerology";

// ── Types ──────────────────────────────────────────────────────────────

export interface NameChart {
  label: string;           // e.g. "Birth Name" or "Married Name"
  fullName: string;
  essenceValues: number[];  // index = age (0 unused)
  essenceCompounds: string[];
  letterRows: string[][];  // letterRows[partIdx][age] = active letter
  activeLetters: string[]; // activeLetters[age] = all letters concatenated
}

export interface TransitEvent {
  age: number;
  calendarYear: number;
  chartIndex: number;      // which chart this is from
  chartLabel: string;
  type: "S_transit" | "A_transit" | "VA_pattern" | "essence_shift" | "power_number";
  essenceValue: number;
  letters: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  age: number;
  calendarYear: number;
  questionText: string;
  hintText: string;        // what the pattern suggests
  chartIndex: number;      // which chart this validates if answered "yes"
  weight: number;          // how significant this event is (1-3)
}

export interface QuizResult {
  winningChartIndex: number;
  winningChartLabel: string;
  scores: number[];
  confidence: number;      // 0-100%
  breakdown: { chartLabel: string; score: number; matchedQuestions: number }[];
}

// ── Build Chart ────────────────────────────────────────────────────────

export function buildNameChart(label: string, fullName: string, maxAge = 80): NameChart {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const cycles = parts.map(expandNamePart).filter(s => s.length > 0);

  const essenceValues: number[] = [0];
  const essenceCompounds: string[] = [""];
  const activeLetters: string[] = [""];

  for (let age = 1; age <= maxAge; age++) {
    let sum = 0;
    let letters = "";
    for (const cyc of cycles) {
      const letter = cyc[(age - 1) % cyc.length];
      sum += getLetterValue(letter);
      letters += letter;
    }
    essenceValues.push(reduceToSingle(sum));
    essenceCompounds.push(compoundTrail(sum));
    activeLetters.push(letters);
  }

  // Build letter rows per name part
  const letterRows = parts.map(word => {
    const cycle = expandNamePart(word);
    const row = [""];
    for (let age = 1; age <= maxAge; age++) {
      row.push(cycle.length ? cycle[(age - 1) % cycle.length] : "");
    }
    return row;
  });

  return { label, fullName, essenceValues, essenceCompounds, letterRows, activeLetters };
}

// ── Find Transit Events ────────────────────────────────────────────────

export function findTransitEvents(
  chart: NameChart,
  chartIndex: number,
  birthYear: number,
  startAge = 1,
  endAge = 60
): TransitEvent[] {
  const events: TransitEvent[] = [];

  for (let age = Math.max(startAge, 2); age <= Math.min(endAge, chart.essenceValues.length - 1); age++) {
    const letters = chart.activeLetters[age] || "";
    const prevLetters = chart.activeLetters[age - 1] || "";
    const essValue = chart.essenceValues[age];
    const calYear = birthYear + age;

    // Check for S transit (letter S appearing)
    if (letters.includes("S") && !prevLetters.includes("S")) {
      events.push({
        age, calendarYear: calYear, chartIndex, chartLabel: chart.label,
        type: "S_transit", essenceValue: essValue, letters,
        description: `Letter S enters at age ${age} — emotional event, relationship shift, or instability`
      });
    }

    // Check for A transit (letter A appearing)
    if (letters.includes("A") && !prevLetters.includes("A")) {
      events.push({
        age, calendarYear: calYear, chartIndex, chartLabel: chart.label,
        type: "A_transit", essenceValue: essValue, letters,
        description: `Letter A enters at age ${age} — new beginning, independence, change`
      });
    }

    // Check for VA pattern (V and A both active)
    if (letters.includes("V") && letters.includes("A")) {
      if (!(prevLetters.includes("V") && prevLetters.includes("A"))) {
        events.push({
          age, calendarYear: calYear, chartIndex, chartLabel: chart.label,
          type: "VA_pattern", essenceValue: essValue, letters,
          description: `VA pattern at age ${age} — major environmental change, move, or life upheaval`
        });
      }
    }

    // Check for essence number shift (different from previous year)
    const prevEss = chart.essenceValues[age - 1];
    if (essValue !== prevEss) {
      // Only flag major shifts (to/from master numbers or big jumps)
      if (essValue === 11 || essValue === 22 || prevEss === 11 || prevEss === 22 ||
          Math.abs(essValue - prevEss) >= 5) {
        events.push({
          age, calendarYear: calYear, chartIndex, chartLabel: chart.label,
          type: "essence_shift", essenceValue: essValue, letters,
          description: `Essence shifts from ${prevEss} to ${essValue} at age ${age}`
        });
      }
    }
  }

  return events;
}

// ── Generate Quiz Questions ────────────────────────────────────────────

const EVENT_QUESTIONS: Record<string, (age: number, year: number) => { q: string; h: string }> = {
  S_transit: (age, year) => ({
    q: `Around age ${age} (${year}), did you experience a strong emotional event — a new relationship, breakup, health scare, or emotional turning point?`,
    h: "The letter S entering your chart signals heightened emotional energy — relationships, emotional shifts, or health events often surface here."
  }),
  A_transit: (age, year) => ({
    q: `Around age ${age} (${year}), did you start something new — a new chapter, new independence, a bold move, or a break from the past?`,
    h: "The letter A represents new beginnings and the drive for independence. This is often when people make life-changing first moves."
  }),
  VA_pattern: (age, year) => ({
    q: `Around age ${age} (${year}), did you experience a major change in your living situation or environment — a move, relocation, or big shift in your surroundings?`,
    h: "The VA pattern is a powerful indicator of environmental upheaval. Moves, relocations, or major changes to your physical world often happen here."
  }),
  essence_shift: (age, year) => ({
    q: `Around age ${age} (${year}), did you feel a noticeable shift in the overall energy or direction of your life?`,
    h: "A large essence number shift often corresponds to a change in the feel and rhythm of your daily life."
  }),
  power_number: (age, year) => ({
    q: `Around age ${age} (${year}), did something unusually significant or intense happen in your life?`,
    h: "Power numbers amplify everything. Events during these periods tend to be more impactful and memorable."
  }),
};

export function generateQuizQuestions(
  charts: NameChart[],
  birthYear: number,
  currentAge: number
): QuizQuestion[] {
  const allEvents: TransitEvent[] = [];
  
  charts.forEach((chart, idx) => {
    const events = findTransitEvents(chart, idx, birthYear, 4, currentAge);
    allEvents.push(...events);
  });

  // Sort by age, prefer more significant events
  const weightMap: Record<string, number> = {
    VA_pattern: 3, S_transit: 3, A_transit: 2, power_number: 2, essence_shift: 1
  };

  // Group events by age range (within 2 years of each other)
  // Pick the most significant events, deduplicate
  const selectedAges = new Set<string>();
  const questions: QuizQuestion[] = [];

  // Sort by weight descending, then by age
  const sorted = allEvents.sort((a, b) => {
    const wa = weightMap[a.type] || 1;
    const wb = weightMap[b.type] || 1;
    if (wb !== wa) return wb - wa;
    return a.age - b.age;
  });

  for (const event of sorted) {
    // Skip if we already have a question within 2 years for the same chart
    const key = `${event.chartIndex}-${Math.floor(event.age / 3)}`;
    if (selectedAges.has(key)) continue;
    selectedAges.add(key);

    const gen = EVENT_QUESTIONS[event.type];
    if (!gen) continue;

    const { q, h } = gen(event.age, event.calendarYear);
    questions.push({
      id: `${event.chartIndex}-${event.type}-${event.age}`,
      age: event.age,
      calendarYear: event.calendarYear,
      questionText: q,
      hintText: h,
      chartIndex: event.chartIndex,
      weight: weightMap[event.type] || 1,
    });

    if (questions.length >= 10) break; // Cap at 10 questions
  }

  // Sort final questions by age for a natural flow
  return questions.sort((a, b) => a.age - b.age);
}

// ── Score Results ──────────────────────────────────────────────────────

export function scoreQuiz(
  charts: NameChart[],
  questions: QuizQuestion[],
  answers: Record<string, boolean> // question.id -> yes/no
): QuizResult {
  const scores = charts.map(() => 0);
  const matchCounts = charts.map(() => 0);

  for (const q of questions) {
    if (answers[q.id] === true) {
      scores[q.chartIndex] += q.weight;
      matchCounts[q.chartIndex]++;
    }
  }

  const maxScore = Math.max(...scores);
  const totalPossible = questions.reduce((sum, q) => sum + q.weight, 0);
  const winnerIdx = scores.indexOf(maxScore);

  // Confidence: how much the winner leads
  const secondBest = Math.max(...scores.filter((_, i) => i !== winnerIdx), 0);
  const confidence = totalPossible > 0
    ? Math.round(((maxScore - secondBest) / totalPossible) * 100 + 50)
    : 50;

  return {
    winningChartIndex: winnerIdx,
    winningChartLabel: charts[winnerIdx]?.label || "Unknown",
    scores,
    confidence: Math.min(confidence, 100),
    breakdown: charts.map((c, i) => ({
      chartLabel: c.label,
      score: scores[i],
      matchedQuestions: matchCounts[i],
    })),
  };
}
