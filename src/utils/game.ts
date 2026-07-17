import type { Country, Level } from '../data/countries';

export const FLAG_BASE = 'https://flagcdn.com';

export const FLAG_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect fill="#e2e8f0" width="100" height="60" rx="6"/><text x="50" y="44" text-anchor="middle" font-size="28" fill="#94a3b8">🏳️</text></svg>'
);

export function handleFlagError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.src = FLAG_PLACEHOLDER;
  img.onerror = null;
}

export interface GameProps {
  level: Level;
  poolCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

export function getExpertDistractors(target: Country, pool: Country[], count: number): Country[] {
  const result: Country[] = [];
  for (const code of target.similar) {
    if (result.length >= count) break;
    const found = pool.find(c => c.code === code);
    if (found) result.push(found);
  }
  if (result.length < count) {
    const sameColor = pool.filter(
      c => c.code !== target.code && c.colorGroup === target.colorGroup && !result.some(r => r.code === c.code)
    ).sort(() => Math.random() - 0.5);
    for (const c of sameColor) {
      if (result.length >= count) break;
      result.push(c);
    }
  }
  if (result.length < count) {
    const random = pool.filter(
      c => c.code !== target.code && !result.some(r => r.code === c.code)
    ).sort(() => Math.random() - 0.5);
    for (const c of random) {
      if (result.length >= count) break;
      result.push(c);
    }
  }
  return result;
}