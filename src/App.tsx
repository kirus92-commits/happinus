import { useMemo, useRef, useState } from 'react';
import NameCard from './components/NameCard';
import RewardedAdModal from './components/RewardedAdModal';
import SajuTable from './components/SajuTable';
import { SURNAMES } from './engine/data';
import { findSurname, recommend, type RecommendResult } from './engine/recommend';
import { showRewardedAd } from './lib/ads';
import { CONFIG } from './lib/config';
import { canWatchAd, grantAd, grantEvent, loadCredits, spend } from './lib/credits';
import { loadFavorites, toggleFavorite } from './lib/favorites';

type Gender = 'm' | 'f' | 'u';
type Tab = 'make' | 'saved';

interface Form {
  surname: string;
  gender: Gender;
  date: string;
  time: string;
  unknownTime: boolean;
  trendiness: number;
}

const INITIAL_FORM: Form = { surname: '', gender: 'u', date: '', time: '', unknownTime: true, trendiness: 0.7 };

export default function App() {
  const [tab, setTab] = useState<Tab>('make');
  const [form, setForm] = useState<Form>(INITIAL_FORM);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [resultKey, setResultKey] = useState('');
  const [page, setPage] = useState(0);
  const [credits, setCredits] = useState(loadCredits);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [adOpen, setAdOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const formKey = JSON.stringify(form);

  const pageItems = useMemo(
    () => result?.candidates.slice(page * CONFIG.pageSize, (page + 1) * CONFIG.pageSize) ?? [],
    [result, page],
  );
  const hasNext = !!result && (page + 1) * CONFIG.pageSize < result.candidates.length;

  const submit = () => {
    setError('');
    if (!findSurname(form.surname)) return setError('목록에서 성(姓)을 선택해 주세요.');
    if (!form.date) return setError('생년월일(또는 출산예정일)을 입력해 주세요.');
    if (!form.unknownTime && !form.time) return setError('태어난 시간을 입력하거나 "시간 모름"을 선택해 주세요.');
    if (credits.remaining <= 0) return setChargeOpen(true);

    const sameInput = result !== null && resultKey === formKey;
    if (sameInput) {
      if (!hasNext) return setError('이 조건의 추천을 모두 보셨어요. 조건을 바꿔 보세요.');
      setPage(page + 1);
    } else {
      const [y, m, d] = form.date.split('-').map(Number);
      const [hh, mm] = form.unknownTime ? [undefined, undefined] : form.time.split(':').map(Number);
      const r = recommend({
        surname: form.surname,
        gender: form.gender,
        trendiness: form.trendiness,
        birth: { year: y, month: m, day: d, hour: hh, minute: mm },
      });
      if (!r) return setError('성(姓)을 확인해 주세요.');
      setResult(r);
      setResultKey(formKey);
      setPage(0);
    }
    setCredits(spend(credits));
  };

  const adResolver = useRef<((rewarded: boolean) => void) | null>(null);

  const watchAd = async () => {
    if (!canWatchAd(credits)) return;
    try {
      const rewarded = await showRewardedAd(
        () => new Promise<boolean>((resolve) => {
          adResolver.current = resolve;
          setAdOpen(true);
        }),
      );
      if (rewarded) {
        setCredits(grantAd(credits));
        setChargeOpen(false);
      }
    } catch {
      setError('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  const adFinished = (rewarded: boolean) => {
    setAdOpen(false);
    adResolver.current?.(rewarded);
    adResolver.current = null;
  };

  const claimEvent = async () => {
    const text = '사주·소리오행·요즘 트렌드까지 보는 아기 이름 추천 앱, 해피너스!';
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        return; // 공유를 취소하면 보상 없음
      }
    } else {
      // 공유 시트가 없는 환경(데스크톱 등)은 링크 문구를 복사해 주고 참여로 인정
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* 복사 권한이 없어도 이벤트 참여는 인정 */
      }
    }
    setCredits(grantEvent(credits));
  };

  const isFav = (id: string, full: string) => favorites.some((f) => f.id === id && f.full === full);

  return (
    <div className="app">
      <header className="top">
        <h1>해피너스 <span>아기이름</span></h1>
        <div className="credit-badge" aria-live="polite">남은 추천 <b>{credits.remaining}</b>회</div>
      </header>

      <nav className="tabs">
        <button className={tab === 'make' ? 'on' : ''} onClick={() => setTab('make')}>이름 짓기</button>
        <button className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}>
          보관함 {favorites.length > 0 && <em>{favorites.length}</em>}
        </button>
      </nav>

      <main>
        {tab === 'make' && (
          <>
            <section className="card form">
              <label>
                성(姓)
                <input list="surnames" value={form.surname} placeholder="예: 김" onChange={(e) => set('surname', e.target.value)} />
                <datalist id="surnames">{SURNAMES.map((s) => <option key={s.ko} value={s.ko}>{s.hanja}</option>)}</datalist>
              </label>

              <fieldset>
                <legend>성별</legend>
                <div className="seg">
                  {([['f', '여아'], ['m', '남아'], ['u', '모름/중성']] as const).map(([v, l]) => (
                    <button key={v} type="button" className={form.gender === v ? 'on' : ''} onClick={() => set('gender', v)}>{l}</button>
                  ))}
                </div>
              </fieldset>

              <label>
                생년월일 (출산예정일도 가능)
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
              </label>

              <label>
                태어난 시간
                <input type="time" value={form.time} disabled={form.unknownTime} onChange={(e) => set('time', e.target.value)} />
              </label>
              <label className="check">
                <input type="checkbox" checked={form.unknownTime} onChange={(e) => set('unknownTime', e.target.checked)} />
                시간 모름 / 아직 몰라요
              </label>

              <label>
                스타일: {form.trendiness >= 0.67 ? '요즘 느낌' : form.trendiness <= 0.33 ? '클래식' : '균형'}
                <input type="range" min={0} max={1} step={0.05} value={form.trendiness} onChange={(e) => set('trendiness', Number(e.target.value))} />
                <span className="range-ends"><i>클래식</i><i>트렌디</i></span>
              </label>

              {error && <p className="error" role="alert">{error}</p>}
              <button className="primary" onClick={submit}>
                {result && resultKey === formKey ? `다음 ${CONFIG.pageSize}개 보기 (1회 사용)` : '이름 추천받기 (1회 사용)'}
              </button>
              {!credits.eventClaimed && (
                <button className="event" onClick={claimEvent}>🎁 이벤트: 친구에게 공유하면 +{CONFIG.eventBonus}회</button>
              )}
            </section>

            {result && (
              <>
                <SajuTable saju={result.saju} />
                <section>
                  <h2 className="list-title">추천 이름 {page * CONFIG.pageSize + 1}–{page * CONFIG.pageSize + pageItems.length}위</h2>
                  {pageItems.map((c, i) => (
                    <NameCard
                      key={c.id}
                      c={c}
                      rank={page * CONFIG.pageSize + i + 1}
                      fav={isFav(c.id, c.full)}
                      onFav={() => setFavorites(toggleFavorite(favorites, c))}
                    />
                  ))}
                </section>
              </>
            )}
          </>
        )}

        {tab === 'saved' && (
          <section>
            {favorites.length === 0 ? (
              <p className="empty">마음에 드는 이름의 ♡를 누르면 여기에 모여요.</p>
            ) : (
              favorites.map((c) => (
                <NameCard key={c.id + c.full} c={c} fav onFav={() => setFavorites(toggleFavorite(favorites, c))} />
              ))
            )}
          </section>
        )}

        <p className="disclaimer">
          사주·소리오행·수리 성명학은 전통 문화 콘텐츠이며 과학적으로 검증된 것이 아닙니다. 재미와 참고용으로 활용해 주세요.
          출생신고 전 한자는 대법원 인명용 한자표로 꼭 확인하세요. 추천 점수는 자체 기준이며, 이름 유행 정보는 샘플 기준입니다.
        </p>
      </main>

      {chargeOpen && (
        <div className="modal-back" onClick={() => setChargeOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>추천 횟수를 모두 사용했어요</h3>
            <p>짧은 광고를 보면 {CONFIG.rewardPerAd}회가 충전돼요.<br />오늘 {credits.adCount}/{CONFIG.dailyAdCap}회 충전했어요.</p>
            <button className="primary" disabled={!canWatchAd(credits)} onClick={watchAd}>
              {canWatchAd(credits) ? '광고 보고 +1회 충전' : '오늘 충전 한도에 도달했어요'}
            </button>
            <button className="ghost" onClick={() => setChargeOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {adOpen && <RewardedAdModal onDone={adFinished} />}
    </div>
  );
}
