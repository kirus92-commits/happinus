/**
 * ⚠️ 샘플 휴리스틱: 최근 몇 년간 출생신고 이름에서 자주 보이는 음절 경향을
 * 단순화한 것으로, 공식 통계가 아니다. 대법원 전자가족관계등록시스템 등의
 * 연도별 이름 순위 데이터가 확보되면 이 파일을 교체한다.
 */
const MODERN = new Set([
  '서', '하', '지', '아', '유', '이', '도', '시', '우', '은', '예', '윤', '연', '수', '민',
  '준', '현', '율', '온', '안', '채', '소', '다', '나', '가', '라', '해', '로', '재', '태',
  '건', '원', '규', '진', '선', '주', '린', '담', '결', '든', '솜', '래', '람', '늬', '슬',
]);

const DATED = new Set(['순', '숙', '옥', '자', '철', '복', '말', '분', '점', '춘', '갑', '길', '덕', '봉', '석', '식', '출', '필']);

/**
 * 최근 자주 쓰이는 이름 (작성자의 일반 지식에 기반한 샘플 목록 - 공식 순위 아님).
 * 공식 통계로 교체하기 전까지는 '요즘 느낌' 가점용 참고값으로만 쓴다.
 */
const POPULAR = new Set([
  '서윤', '서연', '지안', '하윤', '하은', '지유', '서아', '아윤', '수아', '지아', '이서', '서하',
  '도윤', '서준', '시우', '이준', '은우', '지호', '주원', '유준', '현우', '선우', '서진', '하율',
  '서율', '지율', '도하', '지우', '민준', '유안', '은서', '채원', '소율', '하준', '하진', '지원',
]);

export interface TrendResult {
  score: number; // 0~1
  note: string;
}

export function trendScore(givenName: string): TrendResult {
  const syl = [...givenName];
  if (POPULAR.has(givenName)) return { score: 1, note: '요즘 많이 쓰이는 소리' };

  const modern = syl.filter((s) => MODERN.has(s)).length;
  const dated = syl.filter((s) => DATED.has(s)).length;
  const base = modern >= syl.length ? 0.7 : modern > 0 ? 0.4 : 0.15;
  let score = base - 0.35 * dated;
  if (syl.length === 2 && syl[1] === '이' && !MODERN.has(syl[0])) score -= 0.25; // 동이, 림이 같은 애칭 느낌
  if (syl.length === 2 && syl[0] === syl[1]) score -= 0.1;
  score = Math.max(0, Math.min(1, score));
  const note = dated > 0 ? '다소 예스러운 느낌' : score >= 0.65 ? '요즘 느낌의 소리' : '무난한 소리';
  return { score, note };
}

/** 놀림감/부정적 연상 가능성이 있는 소리 */
const RISKY = ['시발', '씨발', '병신', '바보', '멍청', '똥', '방구', '변태', '도둑', '죽', '꺼져'];

export function isRisky(fullName: string): boolean {
  return RISKY.some((w) => fullName.includes(w));
}
