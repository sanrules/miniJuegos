import { useCallback } from 'react';
import { animals } from '../../data/animals.ts';
import { SharedParejas } from '../comunes/SharedParejas.tsx';
import type { GameCard } from '../../utils/sharedGame.ts';

interface Props {
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const animalCards: GameCard[] = animals.map(a => ({ id: a.emoji, name: a.name }));

export function AnimalParejas({ onBack, onFinish }: Props) {
  const renderCard = useCallback((card: GameCard) => (
    <span className="text-5xl md:text-6xl">{card.id}</span>
  ), []);

  return <SharedParejas pool={animalCards} renderCard={renderCard} onBack={onBack} onFinish={onFinish} />;
}
