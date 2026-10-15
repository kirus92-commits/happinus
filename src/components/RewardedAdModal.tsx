import { useEffect, useState } from 'react';

interface Props {
  seconds?: number;
  onDone: (rewarded: boolean) => void;
}

/** 웹 테스트용 가짜 보상형 광고. 실제 앱에서는 AdMob 전면 영상으로 대체된다. */
export default function RewardedAdModal({ seconds = 5, onDone }: Props) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <div className="modal-back">
      <div className="modal ad-modal">
        <div className="ad-box">광고 영역 (테스트)<br /><small>실제 앱에서는 AdMob 영상 광고가 재생됩니다</small></div>
        {left > 0 ? (
          <p className="hint">{left}초 후 보상을 받을 수 있어요</p>
        ) : (
          <button className="primary" onClick={() => onDone(true)}>보상 받기 (+1회)</button>
        )}
        <button className="ghost" onClick={() => onDone(false)}>닫기</button>
      </div>
    </div>
  );
}
