import { analyzeBalance } from '../engine/balance';
import { ELEMENTS, ELEMENT_COLOR } from '../engine/constants';
import type { Pillar, Saju } from '../engine/saju';

function Cell({ p, title }: { p: Pillar | null; title: string }) {
  return (
    <div className="pillar">
      <div className="pillar-title">{title}</div>
      {p ? (
        <>
          <div className="pillar-char" style={{ color: ELEMENT_COLOR[p.stemElement] }}>
            {p.stemHanja}
            <small>{p.stemKo}</small>
          </div>
          <div className="pillar-char" style={{ color: ELEMENT_COLOR[p.branchElement] }}>
            {p.branchHanja}
            <small>{p.branchKo}</small>
          </div>
        </>
      ) : (
        <div className="pillar-empty">시간<br />모름</div>
      )}
    </div>
  );
}

export default function SajuTable({ saju }: { saju: Saju }) {
  const b = analyzeBalance(saju);
  const max = Math.max(...ELEMENTS.map((e) => b.scores[e]), 1);
  return (
    <section className="card">
      <h2>사주 · 오행 분포</h2>
      <div className="pillars">
        <Cell p={saju.hour} title="시주" />
        <Cell p={saju.day} title="일주" />
        <Cell p={saju.month} title="월주" />
        <Cell p={saju.year} title="연주" />
      </div>
      <div className="bars">
        {ELEMENTS.map((e) => (
          <div className="bar-row" key={e}>
            <span className="bar-label" style={{ color: ELEMENT_COLOR[e] }}>{e}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(b.scores[e] / max) * 100}%`, background: ELEMENT_COLOR[e] }} />
            </div>
            <span className="bar-num">{b.scores[e]}</span>
          </div>
        ))}
      </div>
      <p className="hint">
        보완하면 좋은 기운: <b>{b.weakest.slice(0, 2).join(' · ')}</b>
        {b.excess.length > 0 && <> / 이미 강한 기운: {b.excess.join(' · ')}</>}
      </p>
    </section>
  );
}
