import { type ReactNode } from 'react';

export interface GameCard {
  id: string;
  name: string;
}

export interface SharedGameProps {
  pool: GameCard[];
  renderCard: (card: GameCard) => ReactNode;
  onBack: () => void;
  onFinish?: (score: number) => void;
}
