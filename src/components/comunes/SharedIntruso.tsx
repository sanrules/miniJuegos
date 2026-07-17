import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { BackButton } from './BackButton';
import type { GameCard } from '../../utils/sharedGame';
import type { ReactNode } from 'react';

interface Props {
  pool: GameCard[];
  renderCard: (card: GameCard) => ReactNode;
  onBack: () => void;
  onFinish?: (score: number) => void;
  generateRound: (pool: GameCard[]) => { cards: GameCard[]; intruderId: string } | null;
  onAdjust?: (id: string, success: boolean) => void;
}

export function SharedIntruso({ pool, renderCard, onBack, onFinish, generateRound, onAdjust }: Props) {
  const { speak } = useSpeech();
  const lastIdsRef = useRef<Set<string>>(new Set());

  const [cards, setCards] = useState<GameCard[]>([]);
  const [intruderId, setIntruderId] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const nextRound = useCallback(() => {
    let picked = generateRound(pool);
    let attempts = 0;
    while (picked && attempts < 5) {
      const codes = new Set([...picked.cards.map(c => c.id)]);
      if ([...codes].filter(c => lastIdsRef.current.has(c)).length <= 1) break;
      picked = generateRound(pool);
      attempts++;
    }
    if (!picked) return;

    const allIds = picked.cards.map(c => c.id);
    lastIdsRef.current = new Set(allIds);
    setCards(picked.cards);
    setIntruderId(picked.intruderId);
    setResult(null);
    setShakingId(null);
    setTimeout(() => speak('¡Encuentra el diferente!'), 600);
  }, [pool, generateRound, speak]);

  useEffect(() => { nextRound(); }, []);

  const handleSelect = useCallback((card: GameCard) => {
    if (result || !intruderId) return;
    if (card.id === intruderId) {
      setResult('correct');
      setScore(s => s + 10);
      onAdjust?.(card.id, true);
      cards.filter(c => c.id !== intruderId).forEach(c => onAdjust?.(c.id, false));
      speak('¡Muy bien! ¡Ese es el diferente!');
      setTimeout(() => { nextRound(); }, 2200);
    } else {
      setShakingId(card.id);
      onAdjust?.(intruderId, false);
      setTimeout(() => setShakingId(null), 700);
    }
  }, [result, intruderId, cards, onAdjust, speak, nextRound]);

  if (cards.length === 0) {
    return <div className="min-h-screen flex items-center justify-center p-4"><span className="text-6xl">😕</span></div>;
  }

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="flex gap-1">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}</div>
        <button onClick={() => speak('¡Encuentra el diferente!')} className="p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-2xl" aria-label="Repetir">🔊</button>
      </header>

      <main className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {cards.map(card => {
            const isCorrect = result === 'correct' && card.id === intruderId;
            const isWrong = shakingId === card.id;
            return (
              <button key={card.id} onClick={() => handleSelect(card)} disabled={result === 'correct'}
                className={`relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all flex items-center justify-center p-3
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-105 shadow-xl' : isWrong ? 'border-red-300 bg-red-50 animate-shake'
                    : 'border-transparent hover:border-rose-300 hover:shadow-xl active:scale-95 cursor-pointer'}`}>
                {renderCard(card)}
                {isCorrect && <span className="absolute text-5xl drop-shadow-lg animate-bounce">🎉</span>}
                {isWrong && <span className="absolute text-3xl opacity-70">❌</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-center">
          <button onClick={() => speak('¡Encuentra el diferente!')} className="p-4 bg-white rounded-full shadow-lg active:scale-95 transition-all border-2 border-rose-100">
            <span className="text-3xl">🔊</span>
          </button>
        </div>
      </main>
    </div>
  );
}
