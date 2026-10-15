import type { Element } from './constants';

/**
 * ⚠️ 샘플 데이터: 획수(원획)와 자원오행은 출시 전에 대법원 인명용 한자표 및
 * 신뢰할 수 있는 성명학 자료로 반드시 검증/교체해야 한다.
 * 데이터 구조만 유지하면 엔진은 그대로 동작한다.
 */

export interface Surname {
  ko: string;
  hanja: string;
  strokes: number;
}

export const SURNAMES: Surname[] = [
  { ko: '김', hanja: '金', strokes: 8 }, { ko: '이', hanja: '李', strokes: 7 },
  { ko: '박', hanja: '朴', strokes: 6 }, { ko: '최', hanja: '崔', strokes: 11 },
  { ko: '정', hanja: '鄭', strokes: 19 }, { ko: '강', hanja: '姜', strokes: 9 },
  { ko: '조', hanja: '趙', strokes: 14 }, { ko: '윤', hanja: '尹', strokes: 4 },
  { ko: '장', hanja: '張', strokes: 11 }, { ko: '임', hanja: '林', strokes: 8 },
  { ko: '한', hanja: '韓', strokes: 17 }, { ko: '오', hanja: '吳', strokes: 7 },
  { ko: '서', hanja: '徐', strokes: 10 }, { ko: '신', hanja: '申', strokes: 5 },
  { ko: '권', hanja: '權', strokes: 22 }, { ko: '황', hanja: '黃', strokes: 12 },
  { ko: '안', hanja: '安', strokes: 6 }, { ko: '송', hanja: '宋', strokes: 7 },
  { ko: '류', hanja: '柳', strokes: 9 }, { ko: '홍', hanja: '洪', strokes: 10 },
  { ko: '전', hanja: '田', strokes: 5 }, { ko: '고', hanja: '高', strokes: 10 },
  { ko: '문', hanja: '文', strokes: 4 }, { ko: '양', hanja: '梁', strokes: 11 },
  { ko: '손', hanja: '孫', strokes: 10 }, { ko: '배', hanja: '裵', strokes: 14 },
  { ko: '백', hanja: '白', strokes: 5 }, { ko: '허', hanja: '許', strokes: 11 },
  { ko: '남', hanja: '南', strokes: 9 }, { ko: '심', hanja: '沈', strokes: 8 },
  { ko: '노', hanja: '盧', strokes: 16 }, { ko: '하', hanja: '河', strokes: 9 },
  { ko: '곽', hanja: '郭', strokes: 15 }, { ko: '성', hanja: '成', strokes: 6 },
  { ko: '차', hanja: '車', strokes: 7 }, { ko: '주', hanja: '朱', strokes: 6 },
  { ko: '우', hanja: '禹', strokes: 9 }, { ko: '구', hanja: '具', strokes: 8 },
  { ko: '민', hanja: '閔', strokes: 12 }, { ko: '유', hanja: '劉', strokes: 15 },
  { ko: '나', hanja: '羅', strokes: 19 }, { ko: '진', hanja: '陳', strokes: 16 },
  { ko: '지', hanja: '池', strokes: 7 }, { ko: '엄', hanja: '嚴', strokes: 20 },
  { ko: '채', hanja: '蔡', strokes: 17 }, { ko: '원', hanja: '元', strokes: 4 },
  { ko: '천', hanja: '千', strokes: 3 }, { ko: '방', hanja: '方', strokes: 4 },
  { ko: '공', hanja: '孔', strokes: 4 }, { ko: '현', hanja: '玄', strokes: 5 },
  { ko: '변', hanja: '卞', strokes: 4 }, { ko: '여', hanja: '呂', strokes: 7 },
  { ko: '추', hanja: '秋', strokes: 9 }, { ko: '도', hanja: '都', strokes: 16 },
  { ko: '석', hanja: '石', strokes: 5 }, { ko: '선', hanja: '宣', strokes: 9 },
  { ko: '설', hanja: '薛', strokes: 19 }, { ko: '마', hanja: '馬', strokes: 10 },
  { ko: '길', hanja: '吉', strokes: 6 }, { ko: '연', hanja: '延', strokes: 7 },
  { ko: '위', hanja: '魏', strokes: 18 }, { ko: '명', hanja: '明', strokes: 8 },
  { ko: '기', hanja: '奇', strokes: 8 }, { ko: '왕', hanja: '王', strokes: 5 },
  { ko: '금', hanja: '琴', strokes: 12 }, { ko: '옥', hanja: '玉', strokes: 5 },
  { ko: '탁', hanja: '卓', strokes: 8 }, { ko: '국', hanja: '國', strokes: 11 },
  { ko: '어', hanja: '魚', strokes: 11 }, { ko: '은', hanja: '殷', strokes: 10 },
  { ko: '용', hanja: '龍', strokes: 16 },
  // 복성
  { ko: '남궁', hanja: '南宮', strokes: 19 }, { ko: '황보', hanja: '皇甫', strokes: 16 },
  { ko: '선우', hanja: '鮮于', strokes: 20 }, { ko: '제갈', hanja: '諸葛', strokes: 31 },
  { ko: '독고', hanja: '獨孤', strokes: 24 },
];

export type Gender = 'm' | 'f' | 'u';

export interface Hanja {
  h: string;
  r: string; // 음
  m: string; // 뜻
  s: number; // 원획
  e: Element;
  g: Gender;
}

export const HANJA: Hanja[] = [
  // 수(水)
  { h: '河', r: '하', m: '강, 큰 물', s: 9, e: '수', g: 'u' },
  { h: '潤', r: '윤', m: '윤택할', s: 16, e: '수', g: 'u' },
  { h: '洙', r: '수', m: '물가', s: 10, e: '수', g: 'u' },
  { h: '浩', r: '호', m: '넓고 클', s: 11, e: '수', g: 'm' },
  { h: '海', r: '해', m: '바다', s: 11, e: '수', g: 'u' },
  { h: '泰', r: '태', m: '클, 편안할', s: 10, e: '수', g: 'm' },
  { h: '雨', r: '우', m: '비', s: 8, e: '수', g: 'u' },
  { h: '雪', r: '설', m: '눈', s: 11, e: '수', g: 'f' },
  { h: '霖', r: '림', m: '단비', s: 16, e: '수', g: 'u' },
  // 목(木)
  { h: '林', r: '림', m: '수풀', s: 8, e: '목', g: 'u' },
  { h: '樹', r: '수', m: '나무, 세울', s: 16, e: '목', g: 'u' },
  { h: '桐', r: '동', m: '오동나무', s: 10, e: '목', g: 'u' },
  { h: '松', r: '송', m: '소나무', s: 8, e: '목', g: 'm' },
  { h: '柏', r: '백', m: '잣나무', s: 9, e: '목', g: 'm' },
  { h: '梅', r: '매', m: '매화', s: 11, e: '목', g: 'f' },
  { h: '柔', r: '유', m: '부드러울', s: 9, e: '목', g: 'f' },
  { h: '秀', r: '수', m: '빼어날', s: 7, e: '목', g: 'u' },
  { h: '芽', r: '아', m: '싹', s: 10, e: '목', g: 'u' },
  { h: '英', r: '영', m: '꽃부리, 영특할', s: 11, e: '목', g: 'u' },
  { h: '芝', r: '지', m: '지초', s: 10, e: '목', g: 'f' },
  { h: '彬', r: '빈', m: '빛날, 문무를 겸비할', s: 11, e: '목', g: 'm' },
  { h: '榮', r: '영', m: '영화로울', s: 14, e: '목', g: 'u' },
  { h: '東', r: '동', m: '동녘', s: 8, e: '목', g: 'm' },
  { h: '材', r: '재', m: '재목, 재능', s: 7, e: '목', g: 'u' },
  // 화(火)
  { h: '智', r: '지', m: '지혜', s: 12, e: '화', g: 'u' },
  { h: '昭', r: '소', m: '밝을', s: 9, e: '화', g: 'u' },
  { h: '昊', r: '호', m: '넓은 하늘', s: 8, e: '화', g: 'm' },
  { h: '昱', r: '욱', m: '빛날', s: 9, e: '화', g: 'm' },
  { h: '炫', r: '현', m: '밝을', s: 9, e: '화', g: 'u' },
  { h: '旻', r: '민', m: '하늘', s: 8, e: '화', g: 'u' },
  { h: '映', r: '영', m: '비칠', s: 9, e: '화', g: 'u' },
  { h: '明', r: '명', m: '밝을', s: 8, e: '화', g: 'u' },
  { h: '星', r: '성', m: '별', s: 9, e: '화', g: 'u' },
  { h: '晨', r: '신', m: '새벽', s: 11, e: '화', g: 'u' },
  { h: '然', r: '연', m: '그러할, 자연', s: 12, e: '화', g: 'u' },
  { h: '夏', r: '하', m: '여름, 클', s: 10, e: '화', g: 'u' },
  { h: '彩', r: '채', m: '채색', s: 11, e: '화', g: 'f' },
  { h: '俊', r: '준', m: '준걸', s: 9, e: '화', g: 'm' },
  // 토(土)
  { h: '允', r: '윤', m: '진실할, 믿을', s: 4, e: '토', g: 'u' },
  { h: '安', r: '안', m: '편안할', s: 6, e: '토', g: 'u' },
  { h: '宇', r: '우', m: '집, 하늘', s: 6, e: '토', g: 'm' },
  { h: '宙', r: '주', m: '집, 시간', s: 8, e: '토', g: 'u' },
  { h: '宥', r: '유', m: '너그러울', s: 9, e: '토', g: 'u' },
  { h: '宣', r: '선', m: '베풀, 밝힐', s: 9, e: '토', g: 'u' },
  { h: '峻', r: '준', m: '높을', s: 10, e: '토', g: 'm' },
  { h: '崇', r: '숭', m: '높일', s: 11, e: '토', g: 'm' },
  { h: '圭', r: '규', m: '서옥, 홀', s: 6, e: '토', g: 'm' },
  { h: '基', r: '기', m: '터, 근본', s: 11, e: '토', g: 'm' },
  { h: '在', r: '재', m: '있을', s: 6, e: '토', g: 'u' },
  { h: '均', r: '균', m: '고를', s: 7, e: '토', g: 'm' },
  { h: '道', r: '도', m: '길, 도리', s: 16, e: '토', g: 'u' },
  { h: '娟', r: '연', m: '예쁠', s: 10, e: '토', g: 'f' },
  { h: '禹', r: '우', m: '임금 이름, 클', s: 9, e: '토', g: 'm' },
  // 금(金)
  { h: '瑞', r: '서', m: '상서로울', s: 14, e: '금', g: 'u' },
  { h: '銀', r: '은', m: '은', s: 14, e: '금', g: 'f' },
  { h: '鉉', r: '현', m: '솥귀, 삼공', s: 13, e: '금', g: 'm' },
  { h: '錫', r: '석', m: '주석, 줄', s: 16, e: '금', g: 'm' },
  { h: '書', r: '서', m: '글, 책', s: 10, e: '금', g: 'u' },
  { h: '剛', r: '강', m: '굳셀', s: 10, e: '금', g: 'm' },
  { h: '利', r: '이', m: '이로울', s: 7, e: '금', g: 'u' },
  { h: '琳', r: '림', m: '아름다운 옥', s: 13, e: '금', g: 'f' },
  { h: '瑛', r: '영', m: '옥빛', s: 16, e: '금', g: 'f' },
  { h: '瑜', r: '유', m: '아름다운 옥', s: 14, e: '금', g: 'f' },
  { h: '敏', r: '민', m: '민첩할', s: 11, e: '금', g: 'u' },
  { h: '賢', r: '현', m: '어질', s: 15, e: '금', g: 'm' },
  // 토/화/목 추가
  { h: '始', r: '시', m: '처음, 비로소', s: 8, e: '토', g: 'u' },
  { h: '律', r: '율', m: '법칙, 조화', s: 9, e: '화', g: 'u' },
  { h: '辰', r: '진', m: '별, 때', s: 7, e: '토', g: 'u' },
  { h: '元', r: '원', m: '으뜸', s: 4, e: '목', g: 'u' },
];

export interface HangulName {
  name: string;
  meaning: string;
  g: Gender;
}

/** 순우리말 이름 (뜻이 확실한 것만). 한자 없이 소리오행만 평가한다. */
export const HANGUL_NAMES: HangulName[] = [
  { name: '다온', meaning: '좋은 일이 모두 온다', g: 'u' },
  { name: '가온', meaning: '세상의 중심', g: 'u' },
  { name: '나래', meaning: '날개', g: 'u' },
  { name: '보람', meaning: '좋은 결과, 값어치', g: 'u' },
  { name: '하늬', meaning: '서쪽에서 부는 바람', g: 'u' },
  { name: '라온', meaning: '즐거운', g: 'u' },
  { name: '해든', meaning: '해가 든', g: 'u' },
  { name: '다솜', meaning: '사랑', g: 'f' },
  { name: '소담', meaning: '생김새가 탐스러움', g: 'f' },
  { name: '아라', meaning: '바다의 옛말', g: 'u' },
  { name: '한결', meaning: '한결같이', g: 'u' },
  { name: '슬기', meaning: '지혜', g: 'u' },
  { name: '이슬', meaning: '맑고 투명한 물방울', g: 'f' },
  { name: '노을', meaning: '해 질 녘의 붉은 빛', g: 'u' },
  { name: '보라', meaning: '보랏빛', g: 'f' },
  { name: '하람', meaning: '하늘과 사람 (신조어)', g: 'u' },
];
