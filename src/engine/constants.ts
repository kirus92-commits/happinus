export type Element = '목' | '화' | '토' | '금' | '수';
export const ELEMENTS: Element[] = ['목', '화', '토', '금', '수'];

export const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const STEM_ELEMENT: Element[] = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];

export const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCH_ELEMENT: Element[] = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

/** 상생: 목→화→토→금→수→목 */
export const GENERATES: Record<Element, Element> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
/** 상극: 목→토, 토→수, 수→화, 화→금, 금→목 */
export const CONTROLS: Record<Element, Element> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };

export const ELEMENT_COLOR: Record<Element, string> = {
  목: '#4caf7a',
  화: '#e8604c',
  토: '#d6a23c',
  금: '#8a96ab',
  수: '#4a8fd6',
};
