import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { type Level, levelGreetings } from '../data/countries';
import type { Country } from '../data/countries';

interface IntrusoJuegoProps {
  level: Level;
  poolCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';

function pickIntrusoSet(pool: Country[]): { set: Country[]; intruder: Country } | null {
  if (pool.length < 4) return null;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const groups = new Map<string, Country[]>();
  for (const c of shuffled) {
    const g = groups.get(c.colorGroup) || [];
    g.push(c);
    groups.set(c.colorGroup, g);
  }

  const validGroups = Array.from(groups.entries()).filter(([, v]) => v.length >= 3);
  if (validGroups.length === 0) return null;

  const [groupColor, group] = validGroups[Math.floor(Math.random() * validGroups.length)];

  const groupShuffled = [...group].sort(() => Math.random() - 0.5);
  const three = groupShuffled.slice(0, 3);

  const intruders = pool.filter(c => c.colorGroup !== groupColor).sort(() => Math.random() - 0.5);
  if (intruders.length === 0) return null;

  const intruder = intruders[Math.floor(Math.random() * intruders.length)];

  return { set: three, intruder };
}

export function IntrusoJuego({ level, poolCountries, onBack, onFinish }: IntrusoJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight } = useAdaptiveLearning(poolCountries);
  const lastCodesRef = useRef<Set<string>>(new Set());
  const greetedRef = useRef(false);

  const [cards, setCards] = useState<Country[]>([]);
  const [intruderCode, setIntruderCode] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [shakingCode, setShakingCode] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const generateRound = useCallback(() => {
    let picked = pickIntrusoSet(poolCountries);
    if (!picked) return;

    let attempts = 0;
    const lastCodes = lastCodesRef.current;

    while (picked && attempts < 5) {
      const codes = new Set([...picked.set.map(c => c.code), picked.intruder.code]);
      const overlap = [...codes].filter(c => lastCodes.has(c));
      if (overlap.length <= 1) break;
      picked = pickIntrusoSet(poolCountries);
      attempts++;
    }

    if (!picked) return;

    const allCodes = [...picked.set.map(c => c.code), picked.intruder.code];
    lastCodesRef.current = new Set(allCodes);

    const shuffled = [...picked.set, picked.intruder].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIntruderCode(picked.intruder.code);
    setResult(null);
    setShakingCode(null);

    setTimeout(() => {
      if (!greetedRef.current) {
        greetedRef.current = true;
        speak(`${levelGreetings[level]} ¡Encuentra la bandera diferente!`);
      } else {
        speak('¡Encuentra la bandera diferente!');
      }
    }, 600);
  }, [poolCountries, speak, level]);

  useEffect(() => { generateRound(); }, []);

  const handleSelect = useCallback((country: Country) => {
    if (result) return;

    if (country.code === intruderCode) {
      setResult('correct');
      setScore(s => s + 10);
      adjustWeight(country.code, true);
      speak('🎉 ¡Esa es la diferente!');

      cards.filter(c => c.code !== intruderCode).forEach(c => adjustWeight(c.code, false));

      setTimeout(() => { generateRound(); }, 2200);
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
        <span className="text-6xl">😕</span>
      </div>
    );
  }

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-6 px-4">
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
        <button onClick={() => speak('¡Encuentra la bandera diferente!')} className="p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-2xl" aria-label="Repetir">🔊</button>
      </header>

      <main className="max-w-md mx-auto">
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
                  relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all flex items-center justify-center p-3
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-105 shadow-xl'
                    : isWrong ? 'border-red-300 bg-red-50 animate-shake'
                    : 'border-transparent hover:border-rose-300 hover:shadow-xl active:scale-95 cursor-pointer'}
                `}
              >
                <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                {isCorrect && <span className="absolute text-5xl drop-shadow-lg animate-bounce">🎉</span>}
                {isWrong && <span className="absolute text-3xl opacity-70">❌</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <button onClick={() => speak('¡Encuentra la bandera diferente!')} className="p-4 bg-white rounded-full shadow-lg active:scale-95 transition-all border-2 border-rose-100">
            <span className="text-3xl">🔊</span>
          </button>
        </div>
      </main>
    </div>
  );
}