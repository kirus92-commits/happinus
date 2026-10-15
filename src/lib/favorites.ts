import type { NameCandidate } from '../engine/recommend';
import { load, save } from './storage';

const KEY = 'happinus.favorites.v1';

export const loadFavorites = () => load<NameCandidate[]>(KEY, []);

export function toggleFavorite(list: NameCandidate[], c: NameCandidate): NameCandidate[] {
  const next = list.some((f) => f.id === c.id && f.full === c.full)
    ? list.filter((f) => !(f.id === c.id && f.full === c.full))
    : [c, ...list];
  save(KEY, next);
  return next;
}
