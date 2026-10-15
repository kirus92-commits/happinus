import {
  BRANCHES_HANJA,
  BRANCHES_KO,
  BRANCH_ELEMENT,
  STEMS_HANJA,
  STEMS_KO,
  STEM_ELEMENT,
  type Element,
} from './constants';

export interface BirthInput {
  year: number;
  month: number; // 1-12
  day: number;
  /** 한국 표준시 기준 시각. 모르면 undefined */
  hour?: number;
  minute?: number;
}

export interface Pillar {
  stem: number; // 0-9
  branch: number; // 0-11
  stemKo: string;
  branchKo: string;
  stemHanja: string;
  branchHanja: string;
  stemElement: Element;
  branchElement: Element;
}

export interface Saju {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

const KST_OFFSET_MS = 9 * 3600 * 1000;
const rad = (d: number) => (d * Math.PI) / 180;
const mod = (n: number, m: number) => ((n % m) + m) % m;

function makePillar(stem: number, branch: number): Pillar {
  return {
    stem,
    branch,
    stemKo: STEMS_KO[stem],
    branchKo: BRANCHES_KO[branch],
    stemHanja: STEMS_HANJA[stem],
    branchHanja: BRANCHES_HANJA[branch],
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
  };
}

/** 태양의 겉보기 황경(도). Meeus 저정밀 공식, 오차 약 0.01° (절기 시각 ±15분 내외). */
export function sunLongitude(utcMs: number): number {
  const jd = utcMs / 86400000 + 2440587.5;
  const t = (jd - 2451545) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(rad(m)) +
    (0.019993 - 0.000101 * t) * Math.sin(rad(2 * m)) +
    0.000289 * Math.sin(rad(3 * m));
  const omega = 125.04 - 1934.136 * t;
  return mod(l0 + c - 0.00569 - 0.00478 * Math.sin(rad(omega)), 360);
}

/**
 * 사주 4주 계산 (외부 라이브러리 없음).
 * - 연주/월주: 태양 황경 기준 절기(입춘=315°, 이후 30°마다 월 전환)
 * - 일주: 율리우스 일수 기준 60갑자 (2000-01-01 = 무오일)
 * - 시주: 2시간 단위, 23시~01시 = 자시. 23시대는 당일 일주로 계산(야자시 설).
 * 시각은 한국 표준시(KST) 기준이며 진태양시 보정은 하지 않는다.
 */
export function computeSaju(input: BirthInput): Saju {
  const { year, month, day } = input;
  const hasTime = input.hour !== undefined;
  const hour = input.hour ?? 12;
  const minute = input.minute ?? 0;

  // 절기 판정용 시각 (시간 모르면 정오로 가정)
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - KST_OFFSET_MS;
  const lambda = sunLongitude(utcMs);

  // 연주: 입춘(315°) 이전의 1~2월이면 전년도
  const sajuYear = month <= 2 && lambda < 315 ? year - 1 : year;
  const yearIdx = mod(sajuYear - 4, 60);
  const yearStem = yearIdx % 10;
  const yearBranch = yearIdx % 12;

  // 월주: 인월(0) ~ 축월(11)
  const monthOffset = Math.floor(mod(lambda - 315, 360) / 30);
  const monthBranch = (2 + monthOffset) % 12;
  const monthStem = ((yearStem % 5) * 2 + 2 + monthOffset) % 10;

  // 일주
  const jdn = Date.UTC(year, month - 1, day) / 86400000 + 2440588;
  const dayIdx = mod(jdn + 49, 60);
  const dayStem = dayIdx % 10;
  const dayBranch = dayIdx % 12;

  // 시주
  let hourPillar: Pillar | null = null;
  if (hasTime) {
    const hb = Math.floor((hour * 60 + minute + 60) / 120) % 12;
    const hs = ((dayStem % 5) * 2 + hb) % 10;
    hourPillar = makePillar(hs, hb);
  }

  return {
    year: makePillar(yearStem, yearBranch),
    month: makePillar(monthStem, monthBranch),
    day: makePillar(dayStem, dayBranch),
    hour: hourPillar,
  };
}
