/**
 * 81수리 길흉 (단순화). 널리 쓰이는 길수 목록을 기준으로 길/흉 두 단계로 나눈다.
 * 출시 전에 참고 문헌과 대조해 세분화할 것.
 */
const LUCKY = new Set([
  1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47,
  48, 52, 57, 61, 63, 65, 67, 68, 81,
]);

export function isLuckyNumber(n: number): boolean {
  const k = n > 81 ? ((n - 1) % 80) + 1 : n;
  return LUCKY.has(k);
}

export interface SuriResult {
  score: number; // 0~1
  grades: { label: string; value: number; lucky: boolean }[];
}

/** 원형이정(元亨利貞) 4격 */
export function suriScore(surnameStrokes: number, s1: number, s2: number): SuriResult {
  const items = [
    { label: '원격(이름)', value: s1 + s2, w: 0.25 },
    { label: '형격', value: surnameStrokes + s1, w: 0.2 },
    { label: '이격', value: surnameStrokes + s2, w: 0.2 },
    { label: '정격(총운)', value: surnameStrokes + s1 + s2, w: 0.35 },
  ];
  let score = 0;
  const grades = items.map((it) => {
    const lucky = isLuckyNumber(it.value);
    score += lucky ? it.w : it.w * 0.2;
    return { label: it.label, value: it.value, lucky };
  });
  return { score, grades };
}
