import { analyzeBalance, type ElementBalance } from './balance';
import { ELEMENTS, type Element } from './constants';
import { HANGUL_NAMES, HANJA, SURNAMES, type Gender, type Hanja, type Surname } from './data';
import { computeSaju, type BirthInput, type Saju } from './saju';
import { hasBatchim, soundElement, soundHarmony } from './sound';
import { suriScore } from './suri';
import { isRisky, trendScore } from './trend';

export interface RecommendInput {
  surname: string;
  gender: 'm' | 'f' | 'u';
  birth: BirthInput;
  /** 0 = 클래식, 1 = 트렌디 */
  trendiness: number;
}

export interface NameCandidate {
  id: string;
  given: string;
  full: string;
  hanja?: string; // 예: 瑞允
  meanings: string[];
  total: number; // 0~100
  breakdown: { label: string; score: number; note: string }[];
  elements: Element[];
  isPureKorean: boolean;
}

export interface RecommendResult {
  saju: Saju;
  balance: ElementBalance;
  surname: Surname;
  candidates: NameCandidate[];
}

export function findSurname(ko: string): Surname | undefined {
  return SURNAMES.find((s) => s.ko === ko.trim());
}

const genderOk = (want: RecommendInput['gender'], g: Gender) => want === 'u' || g === 'u' || g === want;

/** 이름 글자들의 오행이 사주에서 부족한 기운을 얼마나 채우는지 (0~1) */
function fillScore(balance: ElementBalance, els: Element[]): number {
  const gain = els.reduce((s, e) => s + balance.need[e], 0);
  const topNeeds = [...ELEMENTS].map((e) => balance.need[e]).sort((a, b) => b - a);
  const best = topNeeds.slice(0, els.length).reduce((s, n) => s + n, 0) || 1;
  const overload = els.filter((e) => balance.excess.includes(e)).length * 0.25;
  return Math.max(0, Math.min(1, gain / best - overload));
}

function pronunciationScore(given: string): { score: number; note: string } {
  const syl = [...given];
  const batchim = syl.filter(hasBatchim).length;
  let score = 1;
  if (batchim >= 2) score -= 0.2;
  if (syl.length === 2 && soundElement(syl[0]) === soundElement(syl[1])) score -= 0.1;
  return { score, note: batchim >= 2 ? '받침이 많아 다소 무거움' : '부드럽게 발음됨' };
}

function build(
  input: RecommendInput,
  surname: Surname,
  balance: ElementBalance,
  given: string,
  hanjaPair: [Hanja, Hanja] | null,
  korean: { meaning: string } | null,
): NameCandidate | null {
  const full = surname.ko + given;
  if (isRisky(full)) return null;

  const sound = soundHarmony(full);
  const trend = trendScore(given);
  // 트렌디 쪽 설정이면 촌스럽게 느껴질 수 있는 이름은 후보에서 제외
  if (input.trendiness >= 0.4 && trend.score < 0.45) return null;
  const pron = pronunciationScore(given);
  const fillEls: Element[] = hanjaPair ? [hanjaPair[0].e, hanjaPair[1].e] : [...given].map(soundElement);
  const fill = fillScore(balance, fillEls);

  const tw = 10 + 20 * input.trendiness;
  const parts: { label: string; score: number; w: number; note: string }[] = [
    {
      label: '사주 오행 보완',
      score: fill,
      w: 35,
      note: hanjaPair ? `${fillEls.join('·')} 기운으로 보완` : `소리 ${fillEls.join('·')} 기운 (한자 없음)`,
    },
    { label: '소리오행 조화', score: sound.score, w: 20, note: sound.elements.join('→') },
    { label: '요즘 느낌', score: trend.score, w: tw, note: trend.note },
    { label: '발음', score: pron.score, w: 10, note: pron.note },
  ];
  if (hanjaPair) {
    const suri = suriScore(surname.strokes, hanjaPair[0].s, hanjaPair[1].s);
    parts.push({
      label: '획수(수리)',
      score: suri.score,
      w: 15,
      note: suri.grades.map((g) => `${g.value}${g.lucky ? '길' : '흉'}`).join(' '),
    });
  }
  const wsum = parts.reduce((s, p) => s + p.w, 0);
  const total = Math.round((parts.reduce((s, p) => s + p.score * p.w, 0) / wsum) * 100);

  return {
    id: hanjaPair ? `${given}-${hanjaPair[0].h}${hanjaPair[1].h}` : `${given}-ko`,
    given,
    full,
    hanja: hanjaPair ? hanjaPair[0].h + hanjaPair[1].h : undefined,
    meanings: hanjaPair ? hanjaPair.map((h) => `${h.h}(${h.r}) ${h.m}`) : [korean!.meaning],
    total,
    breakdown: parts.map((p) => ({ label: p.label, score: Math.round(p.score * 100), note: p.note })),
    elements: fillEls,
    isPureKorean: !hanjaPair,
  };
}

/** 모든 후보를 점수순으로 정렬해 반환. 같은 소리(이름)는 가장 점수 높은 한자 조합만 남긴다. */
export function recommend(input: RecommendInput): RecommendResult | null {
  const surname = findSurname(input.surname);
  if (!surname) return null;
  const saju = computeSaju(input.birth);
  const balance = analyzeBalance(saju);

  const pool = HANJA.filter((h) => genderOk(input.gender, h.g));
  const all: NameCandidate[] = [];

  for (const a of pool) {
    for (const b of pool) {
      if (a.h === b.h && a.r !== b.r) continue;
      if (a.h === b.h) continue;
      const c = build(input, surname, balance, a.r + b.r, [a, b], null);
      if (c) all.push(c);
    }
  }
  for (const k of HANGUL_NAMES) {
    if (!genderOk(input.gender, k.g)) continue;
    const c = build(input, surname, balance, k.name, null, { meaning: k.meaning });
    if (c) all.push(c);
  }

  all.sort((x, y) => y.total - x.total || x.given.localeCompare(y.given, 'ko'));

  const bestByGiven = new Map<string, NameCandidate>();
  for (const c of all) if (!bestByGiven.has(c.given)) bestByGiven.set(c.given, c);

  // 첫 글자가 한쪽으로 쏠리지 않도록 다양성 제한 (첫 글자당 최대 3개)
  const perFirst = new Map<string, number>();
  const candidates: NameCandidate[] = [];
  for (const c of bestByGiven.values()) {
    const first = c.given[0];
    const n = perFirst.get(first) ?? 0;
    if (n >= 3) continue;
    perFirst.set(first, n + 1);
    candidates.push(c);
  }
  return { saju, balance, surname, candidates };
}
