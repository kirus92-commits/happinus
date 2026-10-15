import { ELEMENTS, type Element } from './constants';
import type { Saju } from './saju';

export interface ElementBalance {
  scores: Record<Element, number>;
  /** 부족한 순서대로 정렬된 오행 */
  weakest: Element[];
  /** 과다한 오행 */
  excess: Element[];
  /** 오행별 보완 필요도 (0~1) */
  need: Record<Element, number>;
}

/**
 * 오행 분포 분석 (단순화된 방식).
 * 천간 1점, 지지 1점, 월지(계절)는 1.5배. 지장간·합충은 반영하지 않는다.
 * 전통 명리의 '용신'과는 다른, 이름 추천용 참고 지표다.
 */
export function analyzeBalance(saju: Saju): ElementBalance {
  const scores: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const pillars = [saju.year, saju.month, saju.day, saju.hour].filter((p) => p !== null);
  for (const p of pillars) {
    scores[p.stemElement] += 1;
    scores[p.branchElement] += p === saju.month ? 1.5 : 1;
  }
  const total = ELEMENTS.reduce((s, e) => s + scores[e], 0);
  const avg = total / 5;

  const need = {} as Record<Element, number>;
  for (const e of ELEMENTS) {
    need[e] = Math.max(0, Math.min(1, (avg - scores[e]) / avg));
  }
  const weakest = [...ELEMENTS].sort((a, b) => scores[a] - scores[b]);
  const excess = ELEMENTS.filter((e) => scores[e] >= avg * 1.8);
  return { scores, weakest, excess, need };
}
