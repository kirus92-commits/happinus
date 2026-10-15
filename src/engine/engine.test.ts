import { describe, expect, it } from 'vitest';
import { computeSaju } from './saju';
import { recommend } from './recommend';
import { soundHarmony } from './sound';

const label = (p: { stemHanja: string; branchHanja: string } | null) => (p ? p.stemHanja + p.branchHanja : null);

describe('computeSaju', () => {
  it('2000-01-01 정오 = 己卯 丙子 戊午 戊午', () => {
    const s = computeSaju({ year: 2000, month: 1, day: 1, hour: 12, minute: 0 });
    expect([label(s.year), label(s.month), label(s.day), label(s.hour)]).toEqual(['己卯', '丙子', '戊午', '戊午']);
  });

  it('입춘 전후로 연주가 바뀐다 (2024-02-04 입춘)', () => {
    const before = computeSaju({ year: 2024, month: 2, day: 4, hour: 12, minute: 0 });
    const after = computeSaju({ year: 2024, month: 2, day: 4, hour: 20, minute: 0 });
    expect(label(before.year)).toBe('癸卯');
    expect(label(after.year)).toBe('甲辰');
    expect(label(after.month)).toBe('丙寅');
  });

  it('1984-02-05 = 甲子年 丙寅月', () => {
    const s = computeSaju({ year: 1984, month: 2, day: 5, hour: 12, minute: 0 });
    expect(label(s.year)).toBe('甲子');
    expect(label(s.month)).toBe('丙寅');
  });

  it('시간을 모르면 시주가 없다', () => {
    expect(computeSaju({ year: 2025, month: 5, day: 5 }).hour).toBeNull();
  });
});

describe('soundHarmony', () => {
  it('상생 흐름이 상극보다 높다', () => {
    // 김(ㄱ 목) → 도(ㄷ 화) → 윤(ㅇ 토): 목→화→토 상생
    expect(soundHarmony('김도윤').score).toBe(1);
    expect(soundHarmony('김도윤').score).toBeGreaterThan(soundHarmony('김서준').score);
  });
});

describe('recommend', () => {
  it('후보를 점수순으로 반환하고 알 수 없는 성은 null', () => {
    const r = recommend({
      surname: '김', gender: 'f', trendiness: 0.7,
      birth: { year: 2026, month: 3, day: 10, hour: 9, minute: 30 },
    });
    expect(r).not.toBeNull();
    const c = r!.candidates;
    expect(c.length).toBeGreaterThan(20);
    for (let i = 1; i < c.length; i++) expect(c[i - 1].total).toBeGreaterThanOrEqual(c[i].total);
    expect(recommend({ surname: '쀍', gender: 'u', trendiness: 0.5, birth: { year: 2026, month: 1, day: 1 } })).toBeNull();
  });

  it('트렌디 설정에서는 상위 후보가 어색한 애칭형 이름이 아니다', () => {
    const r = recommend({
      surname: '김', gender: 'f', trendiness: 0.8,
      birth: { year: 2026, month: 11, day: 20 },
    })!;
    const top = r.candidates.slice(0, 10).map((c) => c.given);
    expect(top).not.toContain('동이');
    expect(top).not.toContain('림이');
    expect(r.candidates.length).toBeGreaterThan(10);
  });
});
