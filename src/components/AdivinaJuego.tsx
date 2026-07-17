import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { useLevelGreeting } from '../hooks/useLevelGreeting';
import { FLAG_BASE, getExpertDistractors, handleFlagError } from '../utils/game';
import type { GameProps } from '../utils/game';
import { countries as allCountries, type Country } from '../data/countries';
import { BackButton } from './BackButton';

const ROUND_TOTAL = 10;

export function AdivinaJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  const greet = useLevelGreeting(level, speak);
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(poolCountries);
  const lastCodeRef = useRef<string | null>(null);
  const usedCodesRef = useRef<Set<string>>(new Set());
  const correctCountRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const scoreRef = useRef(0);
  const finishedRef = useRef(false);

  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCode, setCorrectCode] = useState<string | null>(null);
  const [wrongCodes, setWrongCodes] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const generateRound = useCallback(() => {
    if (usedCodesRef.current.size >= ROUND_TOTAL || usedCodesRef.current.size >= poolCountries.length) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFinished(true);
      setTimeout(() => {
        speak(`¡Terminaste! Acertaste ${correctCountRef.current} de ${ROUND_TOTAL} banderas, con ${incorrectCountRef.current} fallos.`);
      }, 500);
      setTimeout(() => { onFinish?.(scoreRef.current); }, 4000);
      return;
    }

    const available = poolCountries.filter(
      c => !usedCodesRef.current.has(c.code) && c.code !== lastCodeRef.current
    );
    const t = getRandomCountry(available.length > 0 ? available : poolCountries);
    if (!t) return;
    lastCodeRef.current = t.code;

    const distractors = level === 'expert'
      ? getExpertDistractors(t, poolCountries, 3)
      : poolCountries.filter(c => c.code !== t.code).sort(() => Math.random() - 0.5).slice(0, 3);

    if (distractors.length < 3) {
      const fallback = allCountries.filter(
        c => c.code !== t.code && c.difficulty === 1 && !distractors.some(d => d.code === c.code)
      ).sort(() => Math.random() - 0.5);
      for (const c of fallback) {
        if (distractors.length >= 3) break;
        distractors.push(c);
      }
    }

    setTarget(t);
    setOptions([t, ...distractors].sort(() => Math.random() - 0.5));
    setCorrectCode(null);
    setWrongCodes(new Set());

    setTimeout(() => greet(`¿Cuál es la bandera de ${t.name}?`), 600);
  }, [poolCountries, getRandomCountry, speak, onFinish, level, greet, allCountries]);

  useEffect(() => { generateRound(); }, []);

  const handleSelect = useCallback((country: Country) => {
    if (correctCode || !target || wrongCodes.has(country.code)) return;

    if (country.code === target.code) {
      setCorrectCode(country.code);
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
      scoreRef.current += 10;
      setScore(scoreRef.current);
      usedCodesRef.current.add(target.code);
      adjustWeight(target.code, true);
      speak('¡Acertaste!');
      setTimeout(() => { generateRound(); }, 2200);
    } else {
      adjustWeight(target.code, false);
      incorrectCountRef.current += 1;
      setIncorrectCount(incorrectCountRef.current);
      setWrongCodes(prev => new Set(prev).add(country.code));
      setTimeout(() => {
        setWrongCodes(prev => { const next = new Set(prev); next.delete(country.code); return next; });
      }, 800);
    }
  }, [correctCode, target, wrongCodes, adjustWeight, speak, generateRound]);

  const starCount = Math.min(Math.floor(score / 10), 5);

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
          <span className="text-7xl block mb-4">🏁</span>
          <div className="flex gap-2 justify-center mb-6">
            {Array.from({ length: starCount || 1 }).map((_, i) => (<span key={i} className="text-3xl">⭐</span>))}
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">✅ {correctCount}/{ROUND_TOTAL}</p>
          <p className="text-lg text-gray-500 mb-6">❌ {incorrectCount} errores</p>
          <button onClick={onBack} className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-indigo-600 active:scale-95 transition-all"><span className="text-xl">⬅️</span><span>Atrás</span></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: Math.max(starCount, 1) }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md flex items-center gap-1 min-w-[60px]">
          <span className="text-xl">🔢</span>
          <span className="text-lg font-bold text-gray-700">{usedCodesRef.current.size}/{ROUND_TOTAL}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {target && (
          <p className="text-center text-xl md:text-2xl font-bold text-gray-700 mb-8 px-4 leading-relaxed">
            ¿Cuál es la bandera de <span className="text-indigo-600">{target.name}</span>?
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {options.map(country => {
            const isCorrect = correctCode === country.code;
            const isWrong = wrongCodes.has(country.code);
            return (
              <button
                key={country.code}
                onClick={() => handleSelect(country)}
                disabled={!!correctCode}
                className={`relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all duration-300 flex items-center justify-center p-3
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-[1.03] shadow-xl'
                    : isWrong ? 'border-red-300 bg-red-50 animate-shake'
                    : correctCode ? 'opacity-60 border-transparent'
                    : 'border-transparent hover:border-indigo-300 hover:shadow-xl active:scale-[0.97] cursor-pointer'}`}
              >
                <img src={`${FLAG_BASE}/${country.code.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain drop-shadow-sm" />
                {isCorrect && <span className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-2xl"><span className="text-6xl md:text-7xl drop-shadow-lg animate-bounce">🎉</span></span>}
                {isWrong && <span className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl"><span className="text-5xl md:text-6xl opacity-70">❌</span></span>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <button onClick={() => target && speak(`¿Cuál es la bandera de ${target.name}?`)} className="p-4 bg-white rounded-full shadow-lg active:scale-95 transition-all border-2 border-indigo-100">
            <span className="text-3xl">🔊</span>
          </button>
        </div>
      </main>
    </div>
  );
}