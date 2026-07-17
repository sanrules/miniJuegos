import { useState, useEffect, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import type { Country } from '../data/countries';

interface IntrusoJuegoProps {
  continentCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';

function pickIntrusoSet(pool: Country[]): { set: Country[]; intruder: Country } | null {
  if (pool.length < 4) return null;

  const groups = new Map<string, Country[]>();
  for (const c of pool) {
    const g = groups.get(c.colorGroup) || [];
    g.push(c);
    groups.set(c.colorGroup, g);
  }

  const validGroups = Array.from(groups.entries()).filter(([, v]) => v.length >= 3);
  if (validGroups.length === 0) return null;

  const [groupColor, group] = validGroups[Math.floor(Math.random() * validGroups.length)];

  const shuffled = [...group].sort(() => Math.random() - 0.5);
  const three = shuffled.slice(0, 3);

  const intruders = pool.filter(c => c.colorGroup !== groupColor);
  if (intruders.length === 0) return null;

  const intruder = intruders[Math.floor(Math.random() * intruders.length)];

  return { set: three, intruder };
}

export function IntrusoJuego({ continentCountries, onBack, onFinish }: IntrusoJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight } = useAdaptiveLearning(continentCountries);

  const [cards, setCards] = useState<Country[]>([]);
  const [intruderCode, setIntruderCode] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [shakingCode, setShakingCode] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const generateRound = useCallback(() => {
    const picked = pickIntrusoSet(continentCountries);
    if (!picked) return;

    const shuffled = [...picked.set, picked.intruder].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIntruderCode(picked.intruder.code);
    setResult(null);
    setShakingCode(null);

    setTimeout(() => {
      speak('¡Encuentra la bandera diferente!');
    }, 400);
  }, [continentCountries, speak]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback((country: Country) => {
    if (result) return;

    if (country.code === intruderCode) {
      setResult('correct');
      setScore(s => s + 10);
      adjustWeight(country.code, true);
      speak('¡Correcto! Esa es la diferente');

      const others = cards.filter(c => c.code !== intruderCode);
      others.forEach(c => adjustWeight(c.code, false));

      setTimeout(() => {
        setRound(r => r + 1);
        generateRound();
      }, 2200);
    } else {
      setShakingCode(country.code);
      adjustWeight(intruderCode!, false);
      setTimeout(() => setShakingCode(null), 700);
    }
  }, [result, intruderCode, cards, adjustWeight, speak, generateRound]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-xl text-gray-500">No hay suficientes países para este juego.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-6 px-4">
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center">El Intruso</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 font-medium">Ronda {round}</span>
          <span className="text-rose-600 font-bold">{score} pts</span>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <p className="text-center text-xl md:text-2xl font-bold text-gray-700 mb-8">
          ¡Encuentra la bandera diferente!
        </p>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {cards.map(country => {
            const isCorrect = result === 'correct' && country.code === intruderCode;
            const isWrong = shakingCode === country.code;

            return (
              <button
                key={country.code}
                onClick={() => handleSelect(country)}
                disabled={result === 'correct'}
                className={`
                  relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all
                  flex items-center justify-center p-3
                  ${isCorrect
                    ? 'border-green-400 bg-green-50 scale-105 shadow-xl'
                    : isWrong
                      ? 'border-red-300 bg-red-50 animate-shake'
                      : 'border-transparent hover:border-rose-300 hover:shadow-xl active:scale-95 cursor-pointer'
                  }
                `}
              >
                <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                {isCorrect && <span className="absolute text-5xl drop-shadow-lg animate-bounce">🎉</span>}
                {isWrong && <span className="absolute text-3xl opacity-70">❌</span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => speak('¡Encuentra la bandera diferente!')}
          className="mt-8 mx-auto block px-6 py-3 bg-white text-gray-700 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all border-2 border-rose-100"
        >
          <span className="mr-2 text-xl">🔊</span>
          Repetir
        </button>
      </main>
    </div>
  );
}