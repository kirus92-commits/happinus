import { CONTROLS, GENERATES, type Element } from './constants';

const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const INITIAL_ELEMENT: Record<string, Element> = {
  ㄱ: '목', ㄲ: '목', ㅋ: '목',
  ㄴ: '화', ㄷ: '화', ㄸ: '화', ㄹ: '화', ㅌ: '화',
  ㅇ: '토', ㅎ: '토',
  ㅅ: '금', ㅆ: '금', ㅈ: '금', ㅉ: '금', ㅊ: '금',
  ㅁ: '수', ㅂ: '수', ㅃ: '수', ㅍ: '수',
};

export function isHangulSyllable(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return c >= 0xac00 && c <= 0xd7a3;
}

export function hasBatchim(ch: string): boolean {
  return isHangulSyllable(ch) && (ch.charCodeAt(0) - 0xac00) % 28 !== 0;
}

/** 소리오행(발음오행): 음절 초성 기준 */
export function soundElement(ch: string): Element {
  const idx = Math.floor((ch.charCodeAt(0) - 0xac00) / 588);
  return INITIAL_ELEMENT[INITIALS[idx]];
}

/** 인접한 두 오행 관계 점수: 상생 +1, 상극 -1, 같음 0 */
function pairScore(a: Element, b: Element): number {
  if (GENERATES[a] === b) return 1;
  if (GENERATES[b] === a) return 0.5;
  if (CONTROLS[a] === b || CONTROLS[b] === a) return -1;
  return 0;
}

/** 성 + 이름 글자들의 소리오행 흐름을 0~1로 평가 */
export function soundHarmony(fullName: string): { score: number; elements: Element[] } {
  const chars = [...fullName].filter(isHangulSyllable);
  const elements = chars.map(soundElement);
  let sum = 0;
  for (let i = 0; i < elements.length - 1; i++) sum += pairScore(elements[i], elements[i + 1]);
  if (elements.length >= 3 && elements.every((e) => e === elements[0])) sum -= 1;
  const span = Math.max(1, elements.length - 1);
  return { score: Math.max(0, Math.min(1, (sum + span) / (2 * span))), elements };
}
