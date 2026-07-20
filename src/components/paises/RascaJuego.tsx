import { useCallback, useRef } from 'react';
import { useAdaptiveLearning } from '../../hooks/useAdaptiveLearning.ts';
import { useLevelGreeting } from '../../hooks/useLevelGreeting.ts';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { useScrollLock } from '../../hooks/useScrollLock.ts';
import { FLAG_BASE, getExpertDistractors, handleFlagError } from '../../utils/game.ts';
import { SharedRasca } from '../comunes/SharedRasca.tsx';
import type { GameProps } from '../../utils/game.ts';
import type { GameCard } from '../../utils/sharedGame.ts';
import type { Country } from '../../data/countries.ts';

export function RascaJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  useScrollLock(true);
  useLevelGreeting(level, speak);
  const { getRandomCountry, adjustWeight } = useAdaptiveLearning(poolCountries);
  const lastCodeRef = useRef<string | null>(null);

  const renderCard = useCallback((card: GameCard) => (
    <img src={`${FLAG_BASE}/${card.id.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain" />
  ), []);

  const generateRound = useCallback((_pool: GameCard[]) => {
    const available = poolCountries.filter(c => c.code !== lastCodeRef.current);
    const t = getRandomCountry(available.length > 0 ? available : poolCountries);
    if (!t) return { target: { id: '', name: '' }, options: [] };

    lastCodeRef.current = t.code;

    const distractors: Country[] = level === 'expert'
      ? getExpertDistractors(t, poolCountries, 2)
      : poolCountries.filter(c => c.code !== t.code).sort(() => Math.random() - 0.5).slice(0, 2);

    const toCard = (c: Country) => ({ id: c.code, name: c.name });
    return {
      target: toCard(t),
      options: [t, ...distractors].sort(() => Math.random() - 0.5).map(toCard),
    };
  }, [poolCountries, getRandomCountry, level]);

  const pool: GameCard[] = poolCountries.map(c => ({ id: c.code, name: c.name }));

  return (
    <SharedRasca
      pool={pool}
      renderCard={renderCard}
      onBack={onBack}
      onFinish={onFinish}
      generateRound={generateRound}
      onAdjust={adjustWeight}
    />
  );
}
