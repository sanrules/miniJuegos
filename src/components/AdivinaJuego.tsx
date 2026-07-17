import { useState, useEffect, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import type { Country } from '../data/countries';

interface AdivinaJuegoProps {
  continentCountries: Country[];
  onBack: () => void;
}

const FLAG_BASE = 'https://flagcdn.com';

export function AdivinaJuego({ continentCountries, onBack }: AdivinaJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(continentCountries);

  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCode, setCorrectCode] = useState<string | null>(null);
  const [wrongCodes, setWrongCodes] = useState<Set<string>>(new Set());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const generateRound = useCallback(() => {
    const t = getRandomCountry(continentCountries);
    if (!t) return;

    const distractors = continentCountries
      .filter(c => c.code !== t.code)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const shuffled = [t, ...distractors].sort(() => Math.random() - 0.5);

    setTarget(t);
    setOptions(shuffled);
    setCorrectCode(null);
    setWrongCodes(new Set());

    setTimeout(() => {
      speak(`¿Cuál es la bandera de ${t.name}?`);
    }, 300);
  }, [continentCountries, getRandomCountry, speak]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback((country: Country) => {
    if (correctCode || !target) return;
    if (wrongCodes.has(country.code)) return;

    if (country.code === target.code) {
      setCorrectCode(country.code);
      setScore(s => s + 10);
      adjustWeight(target.code, true);
      speak(`¡Correcto! ¡${target.name}!`);

      setTimeout(() => {
        setRound(r => r + 1);
        generateRound();
      }, 2200);
    } else {
      adjustWeight(target.code, false);
      setWrongCodes(prev => new Set(prev).add(country.code));

      setTimeout(() => {
        setWrongCodes(prev => {
          const next = new Set(prev);
          next.delete(country.code);
          return next;
        });
      }, 800);
    }
  }, [correctCode, target, wrongCodes, adjustWeight, speak, generateRound]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  const repeatQuestion = () => {
    if (target) speak(`¿Cuál es la bandera de ${target.name}?`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Volver">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center">Adivina la Bandera</h1>
        <button
          onClick={repeatQuestion}
          className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
          aria-label="Repetir pregunta"
        >
          <span className="text-2xl">🔊</span>
        </button>
      </header>

      <main className="max-w-lg mx-auto">
        {target && (
          <p className="text-center text-xl md:text-2xl font-bold text-gray-700 mb-8 px-4 leading-relaxed">
            ¿Cuál es la bandera de{' '}
            <span className="text-indigo-600">{target.name}</span>?
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
                className={`
                  relative aspect-[4/3] rounded-2xl bg-white shadow-lg
                  border-[5px] transition-all duration-300
                  flex items-center justify-center p-3
                  ${isCorrect
                    ? 'border-green-400 bg-green-50 scale-[1.03] shadow-xl'
                    : isWrong
                      ? 'border-red-300 bg-red-50 animate-shake'
                      : correctCode
                        ? 'opacity-60 border-transparent'
                        : 'border-transparent hover:border-indigo-300 hover:shadow-xl active:scale-[0.97] cursor-pointer'
                  }
                `}
                aria-label={
                  isCorrect
                    ? `${country.name} - Correcto`
                    : isWrong
                      ? `${country.name} - Incorrecto`
                      : country.name
                }
              >
                <img
                  src={flagUrl(country.code)}
                  alt=""
                  className="w-full h-full object-contain drop-shadow-sm"
                />

                {isCorrect && (
                  <span className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-2xl">
                    <span className="text-6xl md:text-7xl drop-shadow-lg animate-bounce">✅</span>
                  </span>
                )}

                {isWrong && (
                  <span className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl">
                    <span className="text-5xl md:text-6xl opacity-70">❌</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={repeatQuestion}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-700 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all border-2 border-indigo-100"
          >
            <span className="text-2xl">🔊</span>
            Repetir
          </button>
          <span className="text-gray-500 font-medium">Ronda {round}</span>
          <span className="text-indigo-600 font-bold">{score} pts</span>
        </div>
      </main>
    </div>
  );
}