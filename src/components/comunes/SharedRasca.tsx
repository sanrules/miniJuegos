import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { BackButton } from './BackButton';
import type { GameCard } from '../../utils/sharedGame';
import type { ReactNode } from 'react';

interface Props {
  pool: GameCard[];
  renderCard: (card: GameCard) => ReactNode;
  onBack: () => void;
  onFinish?: (score: number) => void;
  generateRound: (pool: GameCard[]) => { target: GameCard; options: GameCard[] };
  onAdjust?: (id: string, success: boolean) => void;
}

const GRID_COLS = 4;
const GRID_ROWS = 3;
const TOTAL_BLOCKS = GRID_COLS * GRID_ROWS;
const AUTO_REVEAL_THRESHOLD = Math.floor(TOTAL_BLOCKS * 0.7);

export function SharedRasca({ pool, renderCard, onBack, onFinish, generateRound, onAdjust }: Props) {
  const { speak } = useSpeech();
  const lastIdRef = useRef<string | null>(null);

  const [target, setTarget] = useState<GameCard | null>(null);
  const [options, setOptions] = useState<GameCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [clearedBlocks, setClearedBlocks] = useState<Set<number>>(new Set());

  const nextRound = useCallback(() => {
    const available = pool.filter(c => c.id !== lastIdRef.current);
    const round = generateRound(available.length > 0 ? available : pool);
    lastIdRef.current = round.target.id;
    setTarget(round.target);
    setOptions(round.options);
    setRevealed(false);
    setResult(null);
    setClearedBlocks(new Set());
    setTimeout(() => speak('¿Qué se esconde? ¡Toca los bloques para descubrir!'), 600);
  }, [pool, generateRound, speak]);

  useEffect(() => { nextRound(); }, []);

  const handleBlockTap = useCallback((index: number) => {
    if (revealed || result) return;
    const next = new Set(clearedBlocks);
    next.add(index);
    setClearedBlocks(next);
    if (next.size >= AUTO_REVEAL_THRESHOLD) {
      setRevealed(true);
    }
  }, [clearedBlocks, revealed, result]);

  const handleOption = useCallback((card: GameCard) => {
    if (result || !target) return;
    if (card.id === target.id) {
      setResult('correct');
      setRevealed(true);
      setScore(s => s + 10);
      onAdjust?.(target.id, true);
      speak(`¡Muy bien! ¡${target.name}!`);
      setTimeout(() => { nextRound(); }, 2000);
    } else {
      setResult('incorrect');
      onAdjust?.(target.id, false);
      setTimeout(() => setResult(null), 800);
    }
  }, [result, target, speak, nextRound]);

  if (pool.length < 2) {
    return <div className="min-h-screen flex items-center justify-center p-4"><span className="text-6xl">😕</span></div>;
  }

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="flex gap-1">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}</div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 mb-6">
          {target && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {renderCard(target)}
            </div>
          )}

          <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1 p-1">
            {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => {
              const isCleared = clearedBlocks.has(i);
              return (
                <motion.button
                  key={i}
                  onClick={() => handleBlockTap(i)}
                  animate={{ opacity: isCleared ? 0 : 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-gray-400 rounded-xl flex items-center justify-center cursor-pointer active:scale-95"
                  style={{ pointerEvents: isCleared ? 'none' : 'auto' }}
                >
                  <span className="text-2xl md:text-3xl">❓</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map(card => {
            const isCorrect = result === 'correct' && card.id === target?.id;
            const isWrong = result === 'incorrect' && card.id !== target?.id;
            return (
              <button key={card.id} onClick={() => handleOption(card)} disabled={result === 'correct'}
                className={`relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all flex items-center justify-center p-2
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-105' : isWrong ? 'border-red-300 animate-shake'
                    : 'border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95 cursor-pointer'}`}>
                {renderCard(card)}
                {isCorrect && <span className="absolute text-3xl">🎉</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
