import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { FLAG_BASE, handleFlagError } from '../utils/game';
import type { GameProps } from '../utils/game';
import type { Country } from '../data/countries';
import { animals } from '../data/animals';
import { BackButton } from './BackButton';

const ROUNDS_TOTAL = 5;

export function AnimalesJuego({ poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  const [animal, setAnimal] = useState<typeof animals[number] | null>(null);
  const [targetCode, setTargetCode] = useState<string | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);

  const generateRound = useCallback(() => {
    if (round >= ROUNDS_TOTAL) {
      setFinished(true);
      setTimeout(() => onFinish?.(score), 1000);
      return;
    }

    const a = animals[Math.floor(Math.random() * animals.length)];
    const code = a.countryCodes[Math.floor(Math.random() * a.countryCodes.length)];
    const targetCountry = poolCountries.find(c => c.code === code);
    const others = poolCountries.filter(c => c.code !== code).sort(() => Math.random() - 0.5).slice(0, 1);

    if (!targetCountry || others.length === 0) return;
    setAnimal(a);
    setTargetCode(code);
    setOptions([targetCountry, ...others].sort(() => Math.random() - 0.5));
    setResult(null);
    setRound(r => r + 1);
    setTimeout(() => speak(`¡Hola! Soy un ${a.name} y vivo aquí. ¿Cuál es mi bandera?`), 600);
  }, [poolCountries, speak, round, score, onFinish]);

  useEffect(() => { generateRound(); }, []);

  const handleSelect = useCallback((country: Country) => {
    if (result || !targetCode) return;
    speak(country.name);
    if (country.code === targetCode) {
      setResult('correct');
      setScore(s => s + 10);
      speak('¡Muy bien!');
      setTimeout(() => { generateRound(); }, 2200);
    } else {
      setResult('incorrect');
      setTimeout(() => setResult(null), 800);
    }
  }, [result, targetCode, speak, generateRound]);

  if (finished) {
    const starCount = Math.min(Math.floor(score / 10), 5);
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
          <span className="text-7xl block mb-4">🏁</span>
          <div className="flex gap-2 justify-center mb-6">{Array.from({ length: starCount || 1 }).map((_, i) => (<span key={i} className="text-3xl">⭐</span>))}</div>
          <button onClick={onBack} className="inline-flex items-center gap-2 px-8 py-3 bg-pink-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-pink-600 active:scale-95 transition-all"><span className="text-xl">⬅️</span><span>Atrás</span></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="bg-white/80 rounded-xl px-4 py-2 shadow-md text-lg font-bold text-gray-600">{round}/{ROUNDS_TOTAL}</div>
      </header>

      <main className="max-w-md mx-auto flex flex-col items-center justify-center gap-8 min-h-[60vh]">
        <AnimatePresence mode="wait">
          {animal && (
            <motion.div key={animal.emoji} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 150, damping: 12 }}
              className={`text-8xl md:text-9xl ${result === 'correct' ? 'animate-bounce' : 'animate-float'}`}>
              {animal.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map(country => {
            const isCorrect = result === 'correct' && country.code === targetCode;
            const isWrong = result === 'incorrect' && country.code !== targetCode;
            return (
              <button key={country.code} onClick={() => handleSelect(country)} disabled={!!result}
                className={`relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all flex items-center justify-center p-4
                  ${isCorrect ? 'border-green-400 bg-green-50 scale-105 shadow-xl' : isWrong ? 'border-red-300 bg-red-50 animate-shake' : 'border-transparent hover:border-pink-300 hover:shadow-xl active:scale-95 cursor-pointer'}`}>
                <img src={`${FLAG_BASE}/${country.code.toLowerCase()}.svg`} alt="" onError={handleFlagError} className="w-full h-full object-contain" draggable={false} />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}