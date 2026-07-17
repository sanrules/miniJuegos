import { useState, useEffect, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import type { Country } from '../data/countries';

interface ParejasJuegoProps {
  continentCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';
const PAIRS_COUNT = 4;

export function ParejasJuego({ continentCountries, onBack, onFinish }: ParejasJuegoProps) {
  const { speak } = useSpeech();

  const [countries, setCountries] = useState<Country[]>([]);
  const [bottomRow, setBottomRow] = useState<Country[]>([]);
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [solvedCodes, setSolvedCodes] = useState<Set<string>>(new Set());
  const [shakingCode, setShakingCode] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    if (continentCountries.length < PAIRS_COUNT) return;

    const picked: Country[] = [];
    const pool = [...continentCountries];

    for (let i = 0; i < PAIRS_COUNT; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx]);
      pool.splice(idx, 1);
    }

    setCountries(picked);
    const shuffled = [...picked].sort(() => Math.random() - 0.5);
    setBottomRow(shuffled);
    setSelectedTop(null);
    setSolvedCodes(new Set());
    setShakingCode(null);
    setGameOver(false);
  }, [continentCountries]);

  useEffect(() => {
    initGame();
  }, []);

  const handleTopTap = useCallback((country: Country) => {
    if (solvedCodes.has(country.code)) return;
    setSelectedTop(country.code);
    speak(`¡${country.name}!`);
  }, [solvedCodes, speak]);

  const handleBottomTap = useCallback((country: Country) => {
    if (solvedCodes.has(country.code)) return;

    if (!selectedTop) {
      speak(`¡${country.name}!`);
      return;
    }

    if (country.code === selectedTop) {
      speak(`¡${country.name}! ¡Acertaste!`);
      const updated = new Set(solvedCodes);
      updated.add(country.code);
      setSolvedCodes(updated);
      setSelectedTop(null);
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
  }, [selectedTop, solvedCodes, speak]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  if (continentCountries.length < PAIRS_COUNT) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-xl text-gray-500">No hay suficientes países en este continente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Volver">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button
            onClick={() => onFinish?.(score)}
            className="px-3 py-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-sm font-medium text-gray-600"
          >
            🏁
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center">Hacer Parejas</h1>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto">
        <p className="text-center text-gray-600 mb-6">
          Toca una bandera de arriba y busca su pareja abajo
        </p>

        <div className="mb-2 text-sm font-medium text-gray-500 px-2">
          {selectedTop ? 'Ahora toca su pareja abajo ↓' : 'Toca una bandera de arriba ↑'}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {countries.map(country => {
            const isSolved = solvedCodes.has(country.code);
            const isSelected = selectedTop === country.code;

            return (
              <button
                key={`top-${country.code}`}
                onClick={() => handleTopTap(country)}
                disabled={isSolved}
                className={`
                  relative aspect-[4/3] rounded-xl bg-white shadow-md
                  border-[4px] transition-all duration-300
                  flex items-center justify-center p-2
                  ${isSolved
                    ? 'border-green-400 bg-green-50 opacity-60'
                    : isSelected
                      ? 'border-yellow-400 shadow-yellow-200 scale-105 ring-2 ring-yellow-300'
                      : 'border-transparent hover:border-yellow-300 hover:shadow-lg active:scale-95 cursor-pointer'
                  }
                `}
                aria-label={isSolved ? `${country.name} - Resuelto` : country.name}
              >
                <img
                  src={flagUrl(country.code)}
                  alt=""
                  className="w-full h-full object-contain"
                />
                {isSolved && (
                  <span className="absolute text-2xl">✅</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-6" />

        <div className="mb-2 text-sm font-medium text-gray-500 px-2">
          Parejas (toca la que corresponde)
        </div>

        <div className="grid grid-cols-4 gap-3">
          {bottomRow.map(country => {
            const isSolved = solvedCodes.has(country.code);
            const isShaking = shakingCode === country.code;

            return (
              <button
                key={`bottom-${country.code}`}
                onClick={() => handleBottomTap(country)}
                disabled={isSolved}
                className={`
                  relative aspect-[4/3] rounded-xl bg-white shadow-md
                  border-[4px] transition-all duration-300
                  flex items-center justify-center p-2
                  ${isSolved
                    ? 'border-green-400 bg-green-50 opacity-60'
                    : isShaking
                      ? 'border-red-300 bg-red-50 animate-shake'
                      : 'border-transparent hover:border-green-300 hover:shadow-lg active:scale-95 cursor-pointer'
                  }
                `}
                aria-label={isSolved ? `${country.name} - Resuelto` : country.name}
              >
                <img
                  src={flagUrl(country.code)}
                  alt=""
                  className="w-full h-full object-contain"
                />
                {isSolved && (
                  <span className="absolute text-2xl">✅</span>
                )}
              </button>
            );
          })}
        </div>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
              <span className="text-7xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Completaste todas!</h2>
              <p className="text-gray-500 mb-6">Has encontrado todas las parejas</p>
              <button
                onClick={initGame}
                className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 active:scale-95 transition-all"
              >
                Jugar de nuevo
              </button>
              <button
                onClick={onBack}
                className="block mx-auto mt-3 text-gray-500 hover:text-gray-700 underline text-sm"
              >
                Volver al menú
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}