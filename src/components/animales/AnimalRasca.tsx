import { useCallback, useRef } from 'react';
import { animals } from '../../data/animals.ts';
import { SharedRasca } from '../comunes/SharedRasca.tsx';
import type { GameCard } from '../../utils/sharedGame.ts';

interface Props {
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const animalCards: GameCard[] = animals.map(a => ({ id: a.emoji, name: a.name }));

export function AnimalRasca({ onBack, onFinish }: Props) {
  const lastIdRef = useRef<string | null>(null);

  const renderCard = useCallback((card: GameCard) => (
    <span className="text-7xl md:text-8xl">{card.id}</span>
  ), []);

  const generateRound = useCallback((_pool: GameCard[]) => {
    const available = animals.filter(a => a.emoji !== lastIdRef.current);
    const pickPool = available.length > 0 ? available : animals;
    const target = pickPool[Math.floor(Math.random() * pickPool.length)];
    lastIdRef.current = target.emoji;

    const distractors = animals
      .filter(a => a.emoji !== target.emoji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const toCard = (a: typeof animals[number]) => ({ id: a.emoji, name: a.name });
    return {
      target: toCard(target),
      options: [target, ...distractors].sort(() => Math.random() - 0.5).map(toCard),
    };
  }, []);

  return (
    <SharedRasca
      pool={animalCards}
      renderCard={renderCard}
      onBack={onBack}
      onFinish={onFinish}
      generateRound={generateRound}
    />
  );
}
