import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { type Level, levelGreetings } from '../data/countries';
import type { Country } from '../data/countries';

interface ParejasJuegoProps {
  level: Level;
  poolCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';
const PAIRS_COUNT = 4;

export function ParejasJuego({ level, poolCountries, onBack, onFinish }: ParejasJuegoProps) {
  const { speak } = useSpeech();
  const lastCodeRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [bottomRow, setBottomRow] = useState<Country[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<'top' | 'bottom' | null>(null);
  const [solvedCodes, setSolvedCodes] = useState<Set<string>>(new Set());
  const [shakingCode, setShakingCode] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    if (poolCountries.length < PAIRS_COUNT) return;

    const pool = [...poolCountries].sort(() => Math.random() - 0.5);
    let picked: Country[];
    const last = lastCodeRef.current;

    if (last) {
      const withoutLast = pool.filter(c => c.code !== last);
      if (withoutLast.length >= PAIRS_COUNT) {
        picked = withoutLast.slice(0, PAIRS_COUNT);
      } else {
        picked = pool.slice(0, PAIRS_COUNT);
      }
    } else {
      picked = pool.slice(0, PAIRS_COUNT);
    }

    lastCodeRef.current = picked[0].code;

    setCountries(picked);
    const shuffled = [...picked].sort(() => Math.random() - 0.5);
    setBottomRow(shuffled);
    setSelectedCode(null);
    setSelectedRow(null);
    setSolvedCodes(new Set());
    setShakingCode(null);
    setGameOver(false);

    setTimeout(() => {
      if (!greetedRef.current) {
        greetedRef.current = true;
        speak(`${levelGreetings[level]} Selecciona las parejas de banderas`);
      } else {
        speak('Selecciona las parejas de banderas');
      }
    }, 600);
  }, [poolCountries, speak, level]);

  useEffect(() => { initGame(); }, []);

  const handleTap = useCallback((country: Country, row: 'top' | 'bottom') => {
    if (solvedCodes.has(country.code)) return;

    if (selectedCode === null || selectedRow === null) {
      setSelectedCode(country.code);
      setSelectedRow(row);
      speak(`¡${country.name}!`);
      return;
    }

    if (selectedRow === row) {
      setSelectedCode(country.code);
      speak(`¡${country.name}!`);
      return;
    }

    if (country.code === selectedCode) {
      speak('¡Acertaste!');
      const updated = new Set(solvedCodes);
      updated.add(country.code);
      setSolvedCodes(updated);
      setSelectedCode(null);
      setSelectedRow(null);
      setScore(s => s + 10);

      if (updated.size === PAIRS_COUNT) {
        setTimeout(() => {
          setGameOver(true);
          onFinish?.(score + 10);
        }, 600);
      }
    } else {
      setShakingCode(country.code);
      setTimeout(() => setShakingCode(null), 700);
    }
  }, [selectedCode, selectedRow, solvedCodes, speak]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  if (poolCountries.length < PAIRS_COUNT) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <span className="text-6xl">😕</span>
      </div>
    );
  }

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-3xl" aria-label="Atrás">⬅️</button>
          <button onClick={() => onFinish?.(score)} className="px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-xl">🏁</button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: starCount }).map((_, i) => (
            <span key={i} className="text-2xl">⭐</span>
          ))}
        </div>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto">
        <div className="grid grid-cols-4 gap-3 mb-8">
          {countries.map(country => {
            const isSolved = solvedCodes.has(country.code);
            const isSelected = selectedCode === country.code && selectedRow === 'top';

            return (
              <button
                key={`top-${country.code}`}
                onClick={() => handleTap(country, 'top')}
                disabled={isSolved}
                className={`
                  relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all duration-300 flex items-center justify-center p-2
                  ${isSolved ? 'border-green-400 bg-green-50 opacity-60'
                    : isSelected ? 'border-yellow-400 shadow-yellow-200 scale-105 ring-2 ring-yellow-300'
                    : 'border-transparent hover:border-yellow-300 hover:shadow-lg active:scale-95 cursor-pointer'}
                `}
              >
                <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                {isSolved && <span className="absolute text-2xl">✅</span>}
              </button>
            );
          })}
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        <div className="grid grid-cols-4 gap-3">
          {bottomRow.map(country => {
            const isSolved = solvedCodes.has(country.code);
            const isShaking = shakingCode === country.code;
            const isSelected = selectedCode === country.code && selectedRow === 'bottom';

            return (
              <button
                key={`bottom-${country.code}`}
                onClick={() => handleTap(country, 'bottom')}
                disabled={isSolved}
                className={`
                  relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all duration-300 flex items-center justify-center p-2
                  ${isSolved ? 'border-green-400 bg-green-50 opacity-60'
                    : isShaking ? 'border-red-300 bg-red-50 animate-shake'
                    : isSelected ? 'border-yellow-400 shadow-yellow-200 scale-105 ring-2 ring-yellow-300'
                    : 'border-transparent hover:border-green-300 hover:shadow-lg active:scale-95 cursor-pointer'}
                `}
              >
                <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                {isSolved && <span className="absolute text-2xl">✅</span>}
              </button>
            );
          })}
        </div>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
              <span className="text-7xl block mb-4">🎉</span>
              <div className="flex gap-2 justify-center mb-6">
                {Array.from({ length: starCount }).map((_, i) => (
                  <span key={i} className="text-3xl">⭐</span>
                ))}
              </div>
              <button onClick={initGame} className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all">🔄</button>
              <button onClick={onBack} className="block mx-auto mt-3 text-2xl opacity-60">⬅️</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}