import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { useLevelGreeting } from '../hooks/useLevelGreeting';
import { FLAG_BASE, getExpertDistractors, handleFlagError } from '../utils/game';
import type { GameProps } from '../utils/game';
import type { Country } from '../data/countries';
import { BackButton } from './BackButton';

const GRID_COLS = 4;
const GRID_ROWS = 3;
const TOTAL_BLOCKS = GRID_COLS * GRID_ROWS;
const AUTO_REVEAL_THRESHOLD = Math.floor(TOTAL_BLOCKS * 0.7);

export function RascaJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  const greet = useLevelGreeting(level, speak);
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(poolCountries);
  const lastCodeRef = useRef<string | null>(null);

  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [clearedBlocks, setClearedBlocks] = useState<Set<number>>(new Set());

  const generateRound = useCallback(() => {
    const available = poolCountries.filter(c => c.code !== lastCodeRef.current);
    const t = getRandomCountry(available.length > 0 ? available : poolCountries);
    if (!t) return;
    lastCodeRef.current = t.code;

    const distractors = level === 'expert'
      ? getExpertDistractors(t, poolCountries, 2)
      : poolCountries.filter(c => c.code !== t.code).sort(() => Math.random() - 0.5).slice(0, 2);

    setTarget(t);
    setOptions([t, ...distractors].sort(() => Math.random() - 0.5));
    setRevealed(false);
    setResult(null);
    setClearedBlocks(new Set());
    setTimeout(() => greet('¿Qué bandera se esconde? ¡Toca los bloques para descubrir!'), 600);
  }, [poolCountries, getRandomCountry, greet, level]);

  useEffect(() => { generateRound(); }, []);

  const handleBlockTap = useCallback((index: number) => {
    if (revealed || result) return;
    const next = new Set(clearedBlocks);
    next.add(index);
    setClearedBlocks(next);
    if (next.size >= AUTO_REVEAL_THRESHOLD) {
      setRevealed(true);
    }
  }, [clearedBlocks, revealed, result]);

  const handleOption = useCallback((country: Country) => {
    if (result || !target) return;
    if (country.code === target.code) {
      setResult('correct');
      setRevealed(true);
      setScore(s => s + 10);
      adjustWeight(target.code, true);
      speak(`¡Muy bien! ¡${target.name}!`);
      setTimeout(() => { generateRound(); }, 2000);
    } else {
      setResult('incorrect');
      adjustWeight(target.code, false);
      setTimeout(() => setResult(null), 800);
    }
  }, [result, target, adjustWeight, speak, generateRound]);

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
            <img src={`${FLAG_BASE}/${target.code.toLowerCase()}.svg`} alt="" onError={handleFlagError}
              className="absolute inset-0 w-full h-full object-contain p-4" draggable={false} />
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
          {options.map(country => {
            const isCorrect = result === 'correct' && country.code === target?.code;
            const isWrong = result === 'incorrect' && country.code !== target?.code;
            return (
              <button key={country.code} onClick={() => handleOption(country)} disabled={result === 'correct'}
                className={`relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all flex items-center justify-center p-2
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-105' : isWrong ? 'border-red-300 animate-shake'
                    : 'border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95 cursor-pointer'}`}>
                <img src={`${FLAG_BASE}/${country.code.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain" />
                {isCorrect && <span className="absolute text-3xl">🎉</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
