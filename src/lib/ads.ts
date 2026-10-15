import { CONFIG } from './config';

/**
 * 보상형 광고 추상화.
 * - mock: 웹 개발용. UI(RewardedAdModal)가 카운트다운을 보여준 뒤 true 반환
 * - admob: Capacitor AdMob 플러그인 연동 지점 (README의 '광고 연동' 참고)
 */
export async function showRewardedAd(mockPlayer: () => Promise<boolean>): Promise<boolean> {
  if (CONFIG.adMode === 'admob') {
    // TODO: @capacitor-community/admob 설치 후
    //   await AdMob.prepareRewardVideoAd({ adId }); const r = await AdMob.showRewardVideoAd();
    //   return !!r;  (보상 지급 이벤트 기준)
    throw new Error('AdMob이 아직 연동되지 않았습니다.');
  }
  return mockPlayer();
}
