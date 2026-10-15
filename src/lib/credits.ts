import { CONFIG } from './config';
import { load, save } from './storage';

export interface CreditState {
  /** 남은 추천 횟수 */
  remaining: number;
  eventClaimed: boolean;
  adDate: string;
  adCount: number;
}

const KEY = 'happinus.credits.v1';
const today = () => new Date().toISOString().slice(0, 10);

export function loadCredits(): CreditState {
  const s = load<CreditState>(KEY, {
    remaining: CONFIG.initialFree,
    eventClaimed: false,
    adDate: today(),
    adCount: 0,
  });
  return s.adDate === today() ? s : { ...s, adDate: today(), adCount: 0 };
}

export function persist(s: CreditState): CreditState {
  save(KEY, s);
  return s;
}

export const canWatchAd = (s: CreditState) => s.adCount < CONFIG.dailyAdCap;

export function spend(s: CreditState): CreditState {
  return persist({ ...s, remaining: Math.max(0, s.remaining - 1) });
}

export function grantAd(s: CreditState): CreditState {
  return persist({ ...s, remaining: s.remaining + CONFIG.rewardPerAd, adCount: s.adCount + 1 });
}

export function grantEvent(s: CreditState): CreditState {
  if (s.eventClaimed) return s;
  return persist({ ...s, remaining: s.remaining + CONFIG.eventBonus, eventClaimed: true });
}
