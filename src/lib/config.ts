export const CONFIG = {
  /** 최초 무료 추천 횟수 */
  initialFree: 3,
  /** 이벤트(공유 등) 참여 시 1회 추가되는 횟수 → 총 5회 */
  eventBonus: 2,
  /** 보상형 광고 1회 시청당 충전 횟수 */
  rewardPerAd: 1,
  /** 하루 광고 시청 충전 상한 */
  dailyAdCap: 10,
  /** 한 번에 보여줄 이름 개수 */
  pageSize: 10,
  /** 'mock' = 웹 테스트용 가짜 광고, 'admob' = 실제 AdMob(네이티브 연동 후) */
  adMode: 'mock' as 'mock' | 'admob',
};
