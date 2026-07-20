import { useCallback } from 'react';
import { useLevelGreeting } from '../../hooks/useLevelGreeting.ts';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { FLAG_BASE, handleFlagError } from '../../utils/game.ts';
import { SharedParejas } from '../comunes/SharedParejas.tsx';
import type { GameProps } from '../../utils/game.ts';
import type { GameCard } from '../../utils/sharedGame.ts';

export function ParejasJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  useLevelGreeting(level, speak);

  const renderCard = useCallback((card: GameCard) => (
    <img src={`${FLAG_BASE}/${card.id.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain" />
  ), []);

  const pool: GameCard[] = poolCountries.map(c => ({ id: c.code, name: c.name }));

  return <SharedParejas pool={pool} renderCard={renderCard} onBack={onBack} onFinish={onFinish} />;
}
