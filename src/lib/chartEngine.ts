/**
 * Lettrology Chart Engine — ported from VI chart-engine.js
 * Pure calculation logic for the forensic chart grid
 */

const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const VOWELS = new Set(['A','E','I','O','U']);

export function getLetterValue(ch: string): number {
  return LETTER_VALUES[ch.toUpperCase()] || 0;
}

export function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toUpperCase());
}

export function reduceToSingle(n: number): number {
  let num = Math.abs(n || 0);
  while (num > 9) {
    num = String(num).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return num === 0 ? 9 : num;
}

export function compoundTrail(n: number): string {
  const start = Math.abs(n || 0);
  if (start <= 9) return String(start || 9);
  const steps = [start];
  let cur = start;
  let brokeOnMaster = false;
  while (cur > 9) {
    if (cur === 11 || cur === 22 || cur === 33) { brokeOnMaster = true; break; }
    cur = String(cur).split('').reduce((a, d) => a + parseInt(d, 10), 0);
    steps.push(cur);
  }
  if (brokeOnMaster) {
    const final = String(cur).split('').reduce((a, d) => a + parseInt(d, 10), 0);
    steps.push(final);
  }
  const unique = steps.filter((v, i) => i === 0 || v !== steps[i - 1]);
  return unique.join('/');
}

function expandNamePart(word: string): string {
  const clean = word.toUpperCase().replace(/[^A-Z]/g, '');
  let out = '';
  for (const ch of clean) {
    const v = getLetterValue(ch);
    if (v > 0) out += ch.repeat(v);
  }
  return out;
}

// ESS row for ages 0..maxAge
export function buildEssenceRow(fullName: string, maxAge = 120) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const cycles = parts.map(expandNamePart).filter(s => s.length > 0);
  const values = [0];
  const compounds = [''];
  for (let age = 1; age <= maxAge; age++) {
    let sum = 0;
    for (const cyc of cycles) {
      const letter = cyc[(age - 1) % cyc.length];
      sum += getLetterValue(letter);
    }
    values.push(reduceToSingle(sum));
    compounds.push(compoundTrail(sum));
  }
  return { values, compounds, cycles };
}

// Letter rows per name part
export function buildLetterRows(fullName: string, maxAge = 120): string[][] {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.map(word => {
    const cycle = expandNamePart(word);
    const row = [''];
    for (let age = 1; age <= maxAge; age++) {
      row.push(cycle.length ? cycle[(age - 1) % cycle.length] : '');
    }
    return row;
  });
}

function calcPY(birthDay: number, birthMonth: number, year: number) {
  const raw = birthDay + birthMonth + year;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

function calcCY(year: number) {
  return { value: reduceToSingle(year), compound: compoundTrail(year) };
}

function calcYearlyCOM(ess: number, py: number) {
  const raw = ess + py;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

function calcPM(py: number, monthNum: number) {
  const raw = py + monthNum;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

function calcPME(ess: number, pm: number) {
  const raw = ess + pm;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

function calcMCOM(pme: number, pm: number) {
  const raw = pme + pm;
  return { value: reduceToSingle(raw), compound: compoundTrail(raw) };
}

export function getPowerNumber(trail: string): number | null {
  if (!trail) return null;
  for (const v of String(trail).split('/').slice(0, -1)) {
    if (v === '11' || v === '13' || v === '16') return parseInt(v);
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// Monthly data for a single year-age entry
// ═══════════════════════════════════════════════════════
export interface MonthData {
  monthNum: number;
  ess: number; essCompound: string;
  PM: number; pmCompound: string;
  PME: number; pmeCompound: string;
  MCOM: number; mcomCompound: string;
  PY: number; pyCompound: string;
  CY: number; cyCompound: string;
}

export interface YearData {
  age: number;
  year: number;
  ess: number; essCompound: string;
  PY: number; pyCompound: string;
  CY: number; cyCompound: string;
  COM: number | null; comCompound: string;
  letters: string[];
  months: MonthData[];
}

// ═══════════════════════════════════════════════════════
// FULL CHART DATA — yearly + monthly rows
// ═══════════════════════════════════════════════════════
export function buildChartData(
  fullName: string,
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  maxAge = 120
): YearData[] {
  const { values: essValues, compounds: essCompounds } = buildEssenceRow(fullName, maxAge);
  const letterRows = buildLetterRows(fullName, maxAge);

  const getActive = (val: number, comp: string) => {
    if (!comp) return val;
    const parts = String(comp).split('/');
    for (const p of parts.slice(0, -1)) {
      if (p === '11' || p === '13' || p === '16' || p === '19') return parseInt(p);
    }
    return val;
  };

  const yearly: YearData[] = [];
  for (let age = 0; age <= maxAge; age++) {
    const year = birthYear + age;
    const ess = essValues[age];
    const essC = essCompounds[age];
    const py = calcPY(birthDay, birthMonth, year);
    const cy = calcCY(year);
    const pyActive = getActive(py.value, py.compound);
    const com = age === 0
      ? { value: null as number | null, compound: '' }
      : calcYearlyCOM(ess, pyActive);

    const months: MonthData[] = [];
    for (let m = 1; m <= 12; m++) {
      const pm = calcPM(pyActive, m);
      const pmActive = getActive(pm.value, pm.compound);
      const pme = calcPME(ess, pmActive);
      const pmeActive = getActive(pme.value, pme.compound);
      const mcom = calcMCOM(pmeActive, pmActive);
      months.push({
        monthNum: m,
        ess, essCompound: essC,
        PM: pm.value, pmCompound: pm.compound,
        PME: pme.value, pmeCompound: pme.compound,
        MCOM: mcom.value, mcomCompound: mcom.compound,
        PY: py.value, pyCompound: py.compound,
        CY: cy.value, cyCompound: cy.compound,
      });
    }

    yearly.push({
      age, year,
      ess, essCompound: essC,
      PY: py.value, pyCompound: py.compound,
      CY: cy.value, cyCompound: cy.compound,
      COM: com.value, comCompound: com.compound,
      letters: letterRows.map(row => row[age] || ''),
      months,
    });
  }

  return yearly;
}

// ═══════════════════════════════════════════════════════
// HEADER DATA (name breakdown + UG)
// ═══════════════════════════════════════════════════════
export interface HeaderData {
  fullName: string;
  wordReductions: { word: string; total: number; totalTrail: string; vowelSum: number; vowelTrail: string }[];
  overallVowelReduction: string;
  overallTotalReduction: string;
  monthReduced: number;
  dayReduced: number;
  yearDigitSum: number;
  yearReduced: number;
  birthdayTrail: string;
  ugTrail: string;
}

export function buildHeaderData(fullName: string, birthDay: number, birthMonth: number, birthYear: number): HeaderData {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  let totalVowelSum = 0;
  let totalSum = 0;

  const wordReductions = parts.map(word => {
    let wVowel = 0, wTotal = 0;
    for (const ch of word.toUpperCase()) {
      if (/[A-Z]/.test(ch)) {
        const v = getLetterValue(ch);
        wTotal += v;
        if (isVowel(ch)) wVowel += v;
      }
    }
    totalVowelSum += wVowel;
    totalSum += wTotal;
    return { word, total: wTotal, totalTrail: compoundTrail(wTotal), vowelSum: wVowel, vowelTrail: compoundTrail(wVowel) };
  });

  const monthReduced = reduceToSingle(birthMonth);
  const dayReduced = reduceToSingle(birthDay);
  const yearDigitSum = String(birthYear).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  const yearReduced = reduceToSingle(yearDigitSum);
  const birthdayRaw = monthReduced + dayReduced + yearDigitSum;
  const ugRaw = totalSum + birthdayRaw;

  return {
    fullName,
    wordReductions,
    overallVowelReduction: compoundTrail(totalVowelSum),
    overallTotalReduction: compoundTrail(totalSum),
    monthReduced, dayReduced, yearDigitSum, yearReduced,
    birthdayTrail: compoundTrail(birthdayRaw),
    ugTrail: compoundTrail(ugRaw),
  };
}

export function currentAge(birthDay: number, birthMonth: number, birthYear: number): number {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const mDiff = (today.getMonth() + 1) - birthMonth;
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDay)) age--;
  return Math.max(0, age);
}

// ═══════════════════════════════════════════════════════
// PLANES OF EXPRESSION
// ═══════════════════════════════════════════════════════
const PLANE_BY_VALUE: Record<number, string> = {
  1: 'mental', 2: 'emotional', 3: 'emotional',
  4: 'physical', 5: 'physical', 6: 'emotional',
  7: 'intuitive', 8: 'mental', 9: 'intuitive',
};

export interface PlaneInfo {
  name: string;
  vowels: number;
  consonants: number;
  count: number;
  percent: string;
}

export function buildPlanesData(fullName: string) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const buckets: Record<string, { vowels: number; consonants: number }> = {
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
  const pct = (n: number) => total > 0 ? ((n / total) * 100).toFixed(1) : '0';

  const planeOrder = ['physical', 'mental', 'emotional', 'intuitive'];
  const planes: PlaneInfo[] = planeOrder.map(name => {
    const b = buckets[name];
    const count = b.vowels + b.consonants;
    return { name, vowels: b.vowels, consonants: b.consonants, count, percent: pct(count) };
  });

  let geniusFactor: string | null = null;
  for (const p of planes) {
    if (planes.every(o => o.name === p.name || p.count >= o.count + 2)) {
      geniusFactor = p.name;
      break;
    }
  }

  return { total, planes, geniusFactor };
}
