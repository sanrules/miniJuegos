import { useCallback, useMemo } from 'react';
import { useScrollLock } from '../../hooks/useScrollLock.ts';
import { useAdaptiveLearning } from '../../hooks/useAdaptiveLearning.ts';
import { useLevelGreeting } from '../../hooks/useLevelGreeting.ts';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { FLAG_BASE, handleFlagError } from '../../utils/game.ts';
import { SharedIntruso } from '../comunes/SharedIntruso.tsx';
import type { GameProps } from '../../utils/game.ts';
import type { GameCard } from '../../utils/sharedGame.ts';
import type { Country } from '../../data/countries.ts';

function pickIntrusoSet(pool: Country[]): { set: Country[]; intruder: Country } | null {
  if (pool.length < 4) return null;

  const groups = new Map<string, Country[]>();
  for (const c of [...pool].sort(() => Math.random() - 0.5)) {
    const g = groups.get(c.colorGroup) || [];
    g.push(c);
    groups.set(c.colorGroup, g);
  }

  const valid = Array.from(groups.entries()).filter(([, v]) => v.length >= 3);
  if (valid.length === 0) return null;

  const [color, group] = valid[Math.floor(Math.random() * valid.length)];
  const three = [...group].sort(() => Math.random() - 0.5).slice(0, 3);
  const intruders = pool.filter(c => c.colorGroup !== color).sort(() => Math.random() - 0.5);
  if (intruders.length === 0) return null;

  return { set: three, intruder: intruders[Math.floor(Math.random() * intruders.length)] };
}

export function IntrusoJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  useScrollLock();
  const { speak } = useSpeech();
  useLevelGreeting(level, speak);
  const { adjustWeight } = useAdaptiveLearning(poolCountries);

  const renderCard = useCallback((card: GameCard) => (
    <img src={`${FLAG_BASE}/${card.id.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain" />
  ), []);

  const generateRound = useCallback((_pool: GameCard[]) => {
    let picked = pickIntrusoSet(poolCountries);
    if (!picked) return null;
    const toCard = (c: Country) => ({ id: c.code, name: c.name });
    return {
      cards: [...picked.set, picked.intruder].sort(() => Math.random() - 0.5).map(toCard),
      intruderId: picked.intruder.code,
    };
  }, [poolCountries]);

  const pool: GameCard[] = useMemo(() => poolCountries.map(c => ({ id: c.code, name: c.name })), [poolCountries]);

  return (
    <SharedIntruso
      pool={pool}
      renderCard={renderCard}
      onBack={onBack}
      onFinish={onFinish}
      generateRound={generateRound}
      onAdjust={adjustWeight}
    />
  );
}
