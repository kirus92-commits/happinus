import { useState } from 'react';
import { ELEMENT_COLOR } from '../engine/constants';
import type { NameCandidate } from '../engine/recommend';

interface Props {
  c: NameCandidate;
  rank?: number;
  fav: boolean;
  onFav: () => void;
}

export default function NameCard({ c, rank, fav, onFav }: Props) {
  const [open, setOpen] = useState(false);

  const share = async () => {
    const text = `${c.full}${c.hanja ? ` (${c.hanja})` : ''} - 해피너스 아기이름 ${c.total}점`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* 사용자가 공유를 취소한 경우 등 */
    }
  };

  return (
    <article className="name-card">
      <div className="name-head" onClick={() => setOpen(!open)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}>
        {rank !== undefined && <span className="rank">{rank}</span>}
        <div className="name-main">
          <div className="name-ko">{c.full}</div>
          <div className="name-sub">
            {c.hanja ? `${c.hanja} · ` : '순우리말 · '}
            {c.elements.map((e, i) => (
              <span key={i} className="dot" style={{ background: ELEMENT_COLOR[e] }} title={e} />
            ))}
          </div>
        </div>
        <div className="score"><b>{c.total}</b><small>점</small></div>
      </div>
      <button className={`fav ${fav ? 'on' : ''}`} onClick={onFav} aria-label="보관">{fav ? '♥' : '♡'}</button>
      {open && (
        <div className="name-body">
          <ul className="meanings">
            {c.meanings.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <table className="breakdown">
            <tbody>
              {c.breakdown.map((b) => (
                <tr key={b.label}>
                  <td>{b.label}</td>
                  <td className="bd-bar"><div style={{ width: `${b.score}%` }} /></td>
                  <td className="bd-note">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="ghost" onClick={share}>공유 / 복사</button>
        </div>
      )}
    </article>
  );
}
