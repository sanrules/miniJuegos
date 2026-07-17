import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { BackButton } from './BackButton';
import type { SharedGameProps } from '../../utils/sharedGame';

const PAIRS_COUNT = 4;

export function SharedParejas({ pool, renderCard, onBack, onFinish }: SharedGameProps) {
  const { speak } = useSpeech();
  const lastIdRef = useRef<string | null>(null);
  const scoreRef = useRef(0);

  const [cards, setCards] = useState<typeof pool>([]);
  const [bottomRow, setBottomRow] = useState<typeof pool>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<'top' | 'bottom' | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    if (pool.length < PAIRS_COUNT) return;

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const last = lastIdRef.current;
    const picked = last
      ? (shuffled.filter(c => c.id !== last).length >= PAIRS_COUNT ? shuffled.filter(c => c.id !== last) : shuffled).slice(0, PAIRS_COUNT)
      : shuffled.slice(0, PAIRS_COUNT);

    lastIdRef.current = picked[0].id;
    setCards(picked);
    setBottomRow([...picked].sort(() => Math.random() - 0.5));
    setSelectedId(null);
    setSelectedRow(null);
    setSolvedIds(new Set());
    setShakingId(null);
    setGameOver(false);
    setTimeout(() => speak(PAIRS_COUNT === 4 ? 'Selecciona las parejas' : 'Selecciona los pares'), 600);
  }, [pool, speak]);

  useEffect(() => { initGame(); }, []);

  const handleTap = useCallback((card: typeof pool[number], row: 'top' | 'bottom') => {
    if (solvedIds.has(card.id)) return;

    if (selectedId === null || selectedRow === null) {
      setSelectedId(card.id);
      setSelectedRow(row);
      speak(`¡${card.name}!`);
      return;
    }

    if (selectedRow === row) {
      setSelectedId(card.id);
      speak(`¡${card.name}!`);
      return;
    }

    if (card.id === selectedId) {
      speak('¡Acertaste!');
      const updated = new Set(solvedIds);
      updated.add(card.id);
      setSolvedIds(updated);
      setSelectedId(null);
      setSelectedRow(null);
      scoreRef.current += 10;
      setScore(scoreRef.current);

      if (updated.size === PAIRS_COUNT) {
        setTimeout(() => {
          setGameOver(true);
          onFinish?.(scoreRef.current);
        }, 600);
      }
    } else {
      setShakingId(card.id);
      setTimeout(() => setShakingId(null), 700);
    }
  }, [selectedId, selectedRow, solvedIds, speak]);

  if (pool.length < PAIRS_COUNT) {
    return <div className="min-h-screen flex items-center justify-center p-4"><span className="text-6xl">😕</span></div>;
  }

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="flex gap-1">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}</div>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto">
        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map(card => {
            const isSolved = solvedIds.has(card.id);
            const isSelected = selectedId === card.id && selectedRow === 'top';
            return (
              <button key={`top-${card.id}`} onClick={() => handleTap(card, 'top')} disabled={isSolved}
                className={`relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all duration-300 flex items-center justify-center p-2
                  ${isSolved ? 'border-green-400 bg-green-50 opacity-60' : isSelected
                    ? 'border-yellow-400 shadow-yellow-200 scale-105 ring-2 ring-yellow-300'
                    : 'border-transparent hover:border-yellow-300 hover:shadow-lg active:scale-95 cursor-pointer'}`}>
                {renderCard(card)}
                {isSolved && <span className="absolute text-2xl">✅</span>}
              </button>
            );
          })}
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        <div className="grid grid-cols-4 gap-3">
          {bottomRow.map(card => {
            const isSolved = solvedIds.has(card.id);
            const isShaking = shakingId === card.id;
            const isSelected = selectedId === card.id && selectedRow === 'bottom';
            return (
              <button key={`bottom-${card.id}`} onClick={() => handleTap(card, 'bottom')} disabled={isSolved}
                className={`relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all duration-300 flex items-center justify-center p-2
                  ${isSolved ? 'border-green-400 bg-green-50 opacity-60' : isShaking
                    ? 'border-red-300 bg-red-50 animate-shake' : isSelected
                    ? 'border-yellow-400 shadow-yellow-200 scale-105 ring-2 ring-yellow-300'
                    : 'border-transparent hover:border-green-300 hover:shadow-lg active:scale-95 cursor-pointer'}`}>
                {renderCard(card)}
                {isSolved && <span className="absolute text-2xl">✅</span>}
              </button>
            );
          })}
        </div>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
              <span className="text-7xl block mb-4">🎉</span>
              <div className="flex gap-2 justify-center mb-6">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-3xl">⭐</span>))}</div>
              <button onClick={initGame} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all"><span className="text-xl">🔄</span><span>Otra vez</span></button>
              <button onClick={onBack} className="block mx-auto mt-3 text-lg opacity-60 text-gray-500">⬅️ Atrás</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
