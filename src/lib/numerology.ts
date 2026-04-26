/**
 * AIONIS Numerology Engine — Merged from AIONIS + Vibrational Identity
 * Pure calculation logic. No DOM, no framework.
 */

// ─── Letter → Number Mapping (Pythagorean) ───
export const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

export const VOWELS = new Set(["A","E","I","O","U"]);
export const MASTER_NUMBERS = [11, 22, 33];
export const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19];

export function getLetterValue(ch: string): number {
  return LETTER_VALUES[ch.toUpperCase()] || 0;
}

export function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toUpperCase());
}

// ─── Reduction Helpers ───

export function reduceToSingle(n: number): number {
  let num = Math.abs(Number(n) || 0);
  while (num > 9) {
    num = String(num).split("").reduce((a, d) => a + Number.parseInt(d, 10), 0);
  }
  return num === 0 ? 9 : num;
}

export function compoundTrail(n: number): string {
  const start = Math.abs(Number(n) || 0);
  if (start <= 9) return String(start || 9);

  const steps: number[] = [];
  let cur = start;

  // Reduce until we hit a 2-digit or single-digit number first
  // Never show 3+ digit numbers in the trail
  while (cur > 99) {
    cur = String(cur).split("").reduce((a, d) => a + Number.parseInt(d, 10), 0);
  }
  // Now cur is 2-digit or less — start the visible trail here
  if (cur > 9) steps.push(cur);

  let brokeOnMaster = false;
  while (cur > 9) {
    if (cur === 11 || cur === 22 || cur === 33) { brokeOnMaster = true; break; }
    cur = String(cur).split("").reduce((a, d) => a + Number.parseInt(d, 10), 0);
    steps.push(cur);
  }
  if (brokeOnMaster) {
    const final = String(cur).split("").reduce((a, d) => a + Number.parseInt(d, 10), 0);
    steps.push(final);
  }

  // If only single digit, just show it
  if (steps.length === 0) return String(cur);

  const unique = steps.filter((v, i) => i === 0 || v !== steps[i - 1]);
  return unique.join("/");
}

export function reduceWithChain(n: number): { value: number; compound: string } {
  if (Number.isNaN(n)) return { value: 0, compound: "0" };
  if (n >= 0 && n <= 9) return { value: n, compound: String(n) };
  return { value: reduceToSingle(n), compound: compoundTrail(n) };
}

// ─── Name Expansion (Essence Cycles) ───

export function expandNamePart(word: string): string {
  const clean = word.toUpperCase().replace(/[^A-Z]/g, "");
  let out = "";
  for (const ch of clean) {
    const v = getLetterValue(ch);
    if (v > 0) out += ch.repeat(v);
  }
  return out;
}

// ─── Essence (ESS) ───

export function yearEssence(fullName: string, birthYear: number, targetYear: number): number {
  const age = targetYear - birthYear;
  if (age <= 0) return 0;
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const cycles = parts.map(expandNamePart).filter(s => s.length > 0);
  let sum = 0;
  for (const cyc of cycles) {
    const letter = cyc[(age - 1) % cyc.length];
    sum += getLetterValue(letter);
  }
  return reduceToSingle(sum);
}

export function yearEssenceCompound(fullName: string, birthYear: number, targetYear: number): { value: number; compound: string } {
  const age = targetYear - birthYear;
  if (age <= 0) return { value: 0, compound: "0" };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const cycles = parts.map(expandNamePart).filter(s => s.length > 0);
  let sum = 0;
  for (const cyc of cycles) {
    const letter = cyc[(age - 1) % cyc.length];
    sum += getLetterValue(letter);
  }
  return { value: reduceToSingle(sum), compound: compoundTrail(sum) };
}

// ─── Personal Year / Month ───

export function personalYear(birthDay: number, birthMonth: number, year: number): number {
  return reduceToSingle(birthDay + birthMonth + year);
}

export function personalYearCompound(birthDay: number, birthMonth: number, year: number): { value: number; compound: string } {
  const raw = birthDay + birthMonth + year;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

export function personalMonth(py: number, monthNum: number): number {
  return reduceToSingle(py + monthNum);
}

export function personalMonthCompound(py: number, monthNum: number): { value: number; compound: string } {
  const raw = py + monthNum;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

// ─── Personal Month Essence (PME) ───

export function personalMonthEssence(ess: number, pm: number): number {
  return reduceToSingle(ess + pm);
}

// ─── Combiners ───

export function yearlyCombiner(ess: number, py: number): { value: number; compound: string } {
  const raw = ess + py;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

export function monthlyCombiner(pme: number, pm: number): { value: number; compound: string } {
  const raw = pme + pm;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

// ─── Personal Day + Daily Essence (from AIONIS) ───

export function personDay(pm: number, day: number): { value: number; compound: string } {
  const raw = pm + reduceToSingle(day);
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

export function dailyEssence(pme: number, pm: number, day: number): { value: number; compound: string } {
  const pd = pm + reduceToSingle(day);
  const total = pd + pme;
  return { value: reduceToSingle(total), compound: compoundTrail(total) };
}

// ─── Calendar Year ───
export function calendarYear(year: number): { value: number; compound: string } {
  return { value: reduceToSingle(year), compound: compoundTrail(year) };
}

// ─── Core Numbers ───

export function getNameValue(name: string, type: "all" | "vowels" | "consonants"): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      const v = getLetterValue(ch);
      const vow = isVowel(ch);
      if (type === "all" || (type === "vowels" && vow) || (type === "consonants" && !vow)) {
        sum += v;
      }
    }
  }
  return sum;
}

export interface CoreNumber {
  name: string;
  value: number;
  compound: string;
  description: string;
}

export function getCoreNumbers(fullName: string, birthDay: number, birthMonth: number, birthYear: number): CoreNumber[] {
  // Expression
  const exprSum = getNameValue(fullName, "all");
  const expr = reduceWithChain(exprSum);

  // Birth Force  
  const birthStr = `${birthDay}${birthMonth}${birthYear}`;
  const bfSum = birthStr.split("").map(Number).reduce((a, b) => a + b, 0);
  const bf = reduceWithChain(bfSum);

  // Ultimate Goal = Birthday reduced + Expression reduced
  const bdaySum = birthMonth + birthDay + birthYear;
  const bdayReduced = reduceWithChain(bdaySum);
  const ugSum = bdayReduced.value + expr.value;
  const ug = reduceWithChain(ugSum);

  // Soul Urge (vowels only)
  const suSum = getNameValue(fullName, "vowels");
  const su = reduceWithChain(suSum);

  // Balance Number (initials)
  const initials = fullName.trim().toUpperCase().split(/\s+/).map(n => n[0]).join("");
  const balSum = getNameValue(initials, "all");
  const bal = reduceWithChain(balSum);

  return [
    { name: "Ultimate Goal", value: ug.value, compound: ug.compound, description: getCoreDescription("Ultimate Goal", ug.value) },
    { name: "Expression", value: expr.value, compound: expr.compound, description: getCoreDescription("Expression", expr.value) },
    { name: "Soul Urge", value: su.value, compound: su.compound, description: getCoreDescription("Soul Urge", su.value) },
    { name: "Birth Force", value: bf.value, compound: bf.compound, description: getCoreDescription("Birth Force", bf.value) },
    { name: "Balance", value: bal.value, compound: bal.compound, description: getCoreDescription("Balance", bal.value) },
  ];
}

function getCoreDescription(type: string, value: number): string {
  const descs: Record<string, Record<number, string>> = {
    "Ultimate Goal": {
      1: "Your ultimate purpose is to become a leader and pioneer. You are here to learn self-reliance and individuality.",
      2: "Your ultimate goal is to master diplomacy and cooperation. You thrive as a peacemaker.",
      3: "Your ultimate goal centers on creative self-expression and inspiring joy in others.",
      4: "You are here to build lasting foundations through discipline, order, and practical effort.",
      5: "Your purpose revolves around freedom, adaptability, and embracing life's changes.",
      6: "You are destined to nurture, heal, and create harmony in your community.",
      7: "Your ultimate goal is the pursuit of wisdom, truth, and spiritual understanding.",
      8: "You are here to master the material world — power, achievement, and abundance.",
      9: "Your purpose is humanitarian service — completion, compassion, and universal love.",
    },
    Expression: {
      1: "You express yourself as a natural leader — independent, innovative, and pioneering.",
      2: "Your expression is diplomatic, gentle, and deeply cooperative.",
      3: "You express through creativity, communication, and artistic talent.",
      4: "Your expression is grounded, methodical, and built on hard work.",
      5: "You express through versatility, adventure, and dynamic communication.",
      6: "Your expression radiates nurturing energy, responsibility, and artistic vision.",
      7: "You express through analytical thinking, spiritual depth, and quiet wisdom.",
      8: "Your expression channels authority, ambition, and material mastery.",
      9: "You express through compassion, universal understanding, and creative service.",
    },
    "Soul Urge": {
      1: "Deep down, you crave independence and the freedom to lead your own path.",
      2: "Your heart yearns for partnership, peace, and emotional connection.",
      3: "Your soul craves joyful self-expression and creative freedom.",
      4: "Your deepest desire is for stability, security, and meaningful work.",
      5: "Your soul thirsts for freedom, travel, and sensory experience.",
      6: "Your heart desires love, family, and creating beauty in the world.",
      7: "Your soul craves solitude, truth, and deep spiritual understanding.",
      8: "Deep down, you desire power, recognition, and material success.",
      9: "Your soul yearns to serve humanity and leave a meaningful legacy.",
    },
    "Birth Force": {
      1: "Born with the energy of leadership — you entered life ready to forge new paths.",
      2: "Born with the gift of sensitivity — you sense what others miss.",
      3: "Born with creative fire — self-expression is your natural birthright.",
      4: "Born with determination — you build things that last.",
      5: "Born restless and free — change is your natural element.",
      6: "Born to nurture — you carry the energy of the healer and protector.",
      7: "Born with a seeker's mind — you question everything to find truth.",
      8: "Born with executive energy — you naturally command respect.",
      9: "Born with old-soul wisdom — compassion flows through everything you do.",
    },
    Balance: {
      1: "When stressed, stand firm in your individuality. Trust your instincts.",
      2: "When off-balance, seek harmony through cooperation and patience.",
      3: "Restore balance through creative expression — write, speak, create.",
      4: "Ground yourself through routine, structure, and practical action.",
      5: "Find balance by embracing change rather than resisting it.",
      6: "Restore harmony by focusing on family and acts of service.",
      7: "Rebalance through solitude, meditation, and inner reflection.",
      8: "Regain balance by taking charge and organizing your environment.",
      9: "Find balance through letting go, forgiveness, and compassion.",
    },
  };
  return descs[type]?.[value] || `The energy of ${value} in your ${type} position brings unique gifts to explore.`;
}

// ─── PMEI Planes of Expression ───

export type PlaneName = "physical" | "mental" | "emotional" | "intuitive";

const PLANE_BY_VALUE: Record<number, PlaneName> = {
  1: "mental", 2: "emotional", 3: "emotional",
  4: "physical", 5: "physical", 6: "emotional",
  7: "intuitive", 8: "mental", 9: "intuitive"
};

export interface PlaneData {
  name: PlaneName;
  vowels: number;
  consonants: number;
  count: number;
  percent: string;
}

export interface PlanesResult {
  total: number;
  planes: PlaneData[];
  geniusFactor: PlaneName | null;
}

export function buildPlanesData(fullName: string): PlanesResult {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const buckets: Record<PlaneName, { vowels: number; consonants: number }> = {
    physical: { vowels: 0, consonants: 0 },
    mental: { vowels: 0, consonants: 0 },
    emotional: { vowels: 0, consonants: 0 },
    intuitive: { vowels: 0, consonants: 0 },
  };

  for (const ch of letters) {
    const val = getLetterValue(ch);
    const plane = PLANE_BY_VALUE[val];
    if (!plane) continue;
    if (isVowel(ch)) buckets[plane].vowels++;
    else buckets[plane].consonants++;
  }

  const total = letters.length;
  const pct = (n: number) => total > 0 ? ((n / total) * 100).toFixed(1) : "0";
  const planeOrder: PlaneName[] = ["physical", "mental", "emotional", "intuitive"];

  const planes: PlaneData[] = planeOrder.map(name => {
    const b = buckets[name];
    const count = b.vowels + b.consonants;
    return { name, vowels: b.vowels, consonants: b.consonants, count, percent: pct(count) };
  });

  let geniusFactor: PlaneName | null = null;
  for (const p of planes) {
    if (planes.every(o => o.name === p.name || p.count >= o.count + 2)) {
      geniusFactor = p.name;
      break;
    }
  }

  return { total, planes, geniusFactor };
}

// ─── Called Name Value ───

export function calledNameValue(fullName: string): { value: number; compound: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 1) return { value: 0, compound: "0" };
  const firstName = parts[0];
  const firstSum = getNameValue(firstName, "all");
  const firstReduced = reduceWithChain(firstSum);
  return firstReduced;
}

// ─── Full Timeline Slice for a Date ───

export interface TimelineSlice {
  date: Date;
  py: { value: number; compound: string };
  pm: { value: number; compound: string };
  ess: { value: number; compound: string };
  pme: number;
  yearlyCom: { value: number; compound: string };
  monthlyCom: { value: number; compound: string };
  personDay: { value: number; compound: string };
  dailyEss: { value: number; compound: string };
}

export function getSliceForDate(
  fullName: string,
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  date: Date
): TimelineSlice {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  const pyVal = personalYear(birthDay, birthMonth, y);
  const pyC = personalYearCompound(birthDay, birthMonth, y);
  const pmVal = personalMonth(pyVal, m);
  const pmC = personalMonthCompound(pyVal, m);
  const essC = yearEssenceCompound(fullName, birthYear, y);
  const pmeVal = personalMonthEssence(essC.value, pmVal);
  const yCom = yearlyCombiner(essC.value, pyVal);
  const mCom = monthlyCombiner(pmeVal, pmVal);
  const pd = personDay(pmVal, d);
  const de = dailyEssence(pmeVal, pmVal, d);

  return {
    date,
    py: pyC,
    pm: pmC,
    ess: essC,
    pme: pmeVal,
    yearlyCom: yCom,
    monthlyCom: mCom,
    personDay: pd,
    dailyEss: de,
  };
}

// ─── Build full chart data (from VI chart-engine) ───

export interface MonthData {
  monthNum: number;
  ess: number;
  PM: number; pmCompound: string;
  PME: number; pmeCompound: string;
  MCOM: number; mcomCompound: string;
}

export interface YearData {
  age: number;
  year: number;
  ess: number; essCompound: string;
  PY: number; pyCompound: string;
  CY: number; cyCompound: string;
  COM: number | null; comCompound: string;
  months: MonthData[];
}

export function buildChartData(
  fullName: string,
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  maxAge = 90
): YearData[] {
  const yearly: YearData[] = [];

  for (let age = 0; age <= maxAge; age++) {
    const year = birthYear + age;
    const ess = age === 0 ? 0 : yearEssence(fullName, birthYear, year);
    const essC = age === 0 ? "0" : compoundTrail(yearEssence(fullName, birthYear, year));
    const py = personalYear(birthDay, birthMonth, year);
    const pyC = compoundTrail(birthDay + birthMonth + year);
    const cy = reduceToSingle(year);
    const cyC = compoundTrail(year);
    const com = age === 0 ? null : reduceToSingle(ess + py);
    const comC = age === 0 ? "" : compoundTrail(ess + py);

    const months: MonthData[] = [];
    for (let m = 1; m <= 12; m++) {
      const pm = personalMonth(py, m);
      const pmC = compoundTrail(py + m);
      const pme = personalMonthEssence(ess, pm);
      const pmeC = compoundTrail(ess + pm);
      const mcom = reduceToSingle(pme + pm);
      const mcomC = compoundTrail(pme + pm);
      months.push({
        monthNum: m, ess,
        PM: pm, pmCompound: pmC,
        PME: pme, pmeCompound: pmeC,
        MCOM: mcom, mcomCompound: mcomC,
      });
    }

    yearly.push({
      age, year, ess, essCompound: essC,
      PY: py, pyCompound: pyC,
      CY: cy, cyCompound: cyC,
      COM: com, comCompound: comC,
      months,
    });
  }

  return yearly;
}

// ─── Current Age ───
export function currentAge(birthDay: number, birthMonth: number, birthYear: number): number {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const mDiff = (today.getMonth() + 1) - birthMonth;
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDay)) age--;
  return Math.max(0, age);
}

// ===== CONVENIENCE WRAPPERS =====
// These match the API used by screen components

export function letterValue(ch: string): number {
  return getLetterValue(ch);
}

export function calculatePersonalYear(birthDay: number, birthMonth: number, year: number): { value: number; compound: string } {
  return personalYearCompound(birthDay, birthMonth, year);
}

export function calculatePersonalMonth(py: number, monthNum: number): { value: number; compound: string } {
  return personalMonthCompound(py, monthNum);
}

export function calculateDailyEssence(
  fullName: string,
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  day: number,
  month: number,
  year: number
): { value: number; compound: string } {
  const py = personalYear(birthDay, birthMonth, year);
  const pm = personalMonth(py, month);
  const ess = yearEssence(fullName, birthYear, year);
  const pme = personalMonthEssence(ess, pm);
  return dailyEssence(pme, pm, day);
}

export function calculatePersonDay(
  birthDay: number,
  birthMonth: number,
  day: number,
  month: number,
  year: number
): { value: number; compound: string } {
  const py = personalYear(birthDay, birthMonth, year);
  const pm = personalMonth(py, month);
  return personDay(pm, day);
}

export function calculateMonthlyCombiner(
  deValue: number,
  pmValue: number
): { value: number; compound: string } {
  return monthlyCombiner(deValue, pmValue);
}

export function calculateCoreNumbers(
  fullName: string,
  birthDay: number,
  birthMonth: number,
  birthYear: number
): {
  ultimateGoal: { value: number; compound: string };
  expression: { value: number; compound: string };
  soulUrge: { value: number; compound: string };
  birthForce: { value: number; compound: string };
  balance: { value: number; compound: string };
} {
  const cores = getCoreNumbers(fullName, birthDay, birthMonth, birthYear);
  // getCoreNumbers returns CoreNumber[] with { name, value, compound, description }
  const get = (searchName: string) => {
    const found = cores.find(c => c.name.toLowerCase().includes(searchName.toLowerCase()));
    return found ? { value: found.value, compound: found.compound } : { value: 0, compound: "" };
  };
  return {
    ultimateGoal: get("ultimate") || get("life") || get("goal") || { value: cores[0]?.value || 0, compound: cores[0]?.compound || "" },
    expression: get("expression") || { value: cores[1]?.value || 0, compound: cores[1]?.compound || "" },
    soulUrge: get("soul") || get("urge") || { value: cores[2]?.value || 0, compound: cores[2]?.compound || "" },
    birthForce: get("birth") || get("force") || { value: cores[3]?.value || 0, compound: cores[3]?.compound || "" },
    balance: get("balance") || { value: cores[4]?.value || 0, compound: cores[4]?.compound || "" },
  };
}

export function calculatePMEIPlanes(fullName: string): {
  counts: { physical: number; mental: number; emotional: number; intuitive: number };
  geniusFactor: PlaneName | null;
} {
  const result = buildPlanesData(fullName);
  const findPlane = (name: PlaneName) => result.planes.find(p => p.name === name);
  return {
    counts: {
      physical: findPlane("physical")?.count || 0,
      mental: findPlane("mental")?.count || 0,
      emotional: findPlane("emotional")?.count || 0,
      intuitive: findPlane("intuitive")?.count || 0,
    },
    geniusFactor: result.geniusFactor,
  };
}

export function calculateMindMode(
  fullName: string,
  birthDay: number
): { value: number; compound: string; title: string } | null {
  // Mind Mode = sum of first name letters + birth day, reduced
  const firstName = fullName.split(/\s+/)[0] || "";
  const nameVal = [...firstName.toUpperCase().replace(/[^A-Z]/g, "")].reduce((s, c) => s + getLetterValue(c), 0);
  const total = nameVal + birthDay;
  const reduced = reduceWithChain(total);
  return {
    value: reduced.value,
    compound: reduced.compound,
    title: `Mind Mode ${reduced.value}`,
  };
}

export function calculateCalledNameValue(firstName: string): { value: number; compound: string } {
  return calledNameValue(firstName);
}
