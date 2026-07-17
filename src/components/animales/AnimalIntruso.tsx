import { useCallback } from 'react';
import { animals, type Habitat } from '../../data/animals.ts';
import { SharedIntruso } from '../comunes/SharedIntruso.tsx';
import type { GameCard } from '../../utils/sharedGame.ts';

interface Props {
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const animalCards: GameCard[] = animals.map(a => ({ id: a.emoji, name: a.name }));

function pickIntrusoSet(): { cards: typeof animals; intruder: typeof animals[number] } | null {
  if (animals.length < 4) return null;

  const groups = new Map<Habitat, typeof animals>();
  for (const a of [...animals].sort(() => Math.random() - 0.5)) {
    const g = groups.get(a.habitat) || [];
    g.push(a);
    groups.set(a.habitat, g);
  }

  const valid = Array.from(groups.entries()).filter(([, v]) => v.length >= 3);
  if (valid.length === 0) return null;

  const [, group] = valid[Math.floor(Math.random() * valid.length)];
  const three = [...group].sort(() => Math.random() - 0.5).slice(0, 3);
  const intruders = animals.filter(a => !three.find(t => t.emoji === a.emoji)).sort(() => Math.random() - 0.5);
  if (intruders.length === 0) return null;

  return { cards: three, intruder: intruders[Math.floor(Math.random() * intruders.length)] };
}

export function AnimalIntruso({ onBack, onFinish }: Props) {
  const renderCard = useCallback((card: GameCard) => (
    <span className="text-6xl md:text-7xl">{card.id}</span>
  ), []);

  const generateRound = useCallback((_pool: GameCard[]) => {
    const picked = pickIntrusoSet();
    if (!picked) return null;
    const toCard = (a: typeof animals[number]) => ({ id: a.emoji, name: a.name });
    return {
      cards: [...picked.cards, picked.intruder].sort(() => Math.random() - 0.5).map(toCard),
      intruderId: picked.intruder.emoji,
    };
  }, []);

  return (
    <SharedIntruso
      pool={animalCards}
      renderCard={renderCard}
      onBack={onBack}
      onFinish={onFinish}
      generateRound={generateRound}
    />
  );
}
