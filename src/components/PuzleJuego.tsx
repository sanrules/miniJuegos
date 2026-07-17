import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { FLAG_BASE } from '../utils/game';
import type { GameProps } from '../utils/game';
import type { Country } from '../data/countries';

function flagUrl(code: string) {
  return `${FLAG_BASE}/${code.toLowerCase()}.svg`;
}

function HalfBackground({ code, side, className }: { code: string; side: 'left' | 'right'; className?: string }) {
  return (
    <div className={className}
      style={{
        backgroundImage: `url(${flagUrl(code)})`,
        backgroundPosition: side === 'left' ? '0% 50%' : '100% 50%',
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

export function PuzleJuego({ poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  const { getRandomCountry } = useAdaptiveLearning(poolCountries);
  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrongCode, setWrongCode] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const generateRound = useCallback(() => {
    const t = getRandomCountry(poolCountries);
    if (!t) return;
    const distractor = poolCountries.filter(c => c.code !== t.code).sort(() => Math.random() - 0.5)[0];
    if (!distractor) return;
    setTarget(t);
    setOptions([t, distractor].sort(() => Math.random() - 0.5));
    setSolved(false);
    setWrongCode(null);
    setTimeout(() => speak('¡Oh, no! La bandera se ha roto. ¿Me ayudas a arreglarla?'), 600);
  }, [poolCountries, getRandomCountry, speak]);

  useEffect(() => { generateRound(); }, []);

  const handleSelect = useCallback((country: Country) => {
    if (solved || !target) return;
    if (country.code === target.code) {
      setSolved(true);
      setScore(s => s + 10);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      speak(`🎉 ¡${target.name}!`);
      setTimeout(() => generateRound(), 2500);
    } else {
      setWrongCode(country.code);
      setTimeout(() => setWrongCode(null), 600);
    }
  }, [solved, target, speak, generateRound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-sky-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Atrás"><span className="text-2xl">⬅️</span><span className="text-sm font-bold text-gray-600">Atrás</span></button>
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {target && (
          <div className="relative w-full max-w-[320px] mx-auto mb-6">
            <div className="flex rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200" style={{ height: 200 }}>
              <HalfBackground code={target.code} side="left" className="w-1/2 h-full bg-gray-50" />
              <div className="w-1/2 flex items-center justify-center bg-gray-50 border-l-2 border-dashed border-gray-300 overflow-hidden">
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div key="piece" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-full h-full">
                      <HalfBackground code={target.code} side="right" className="w-full h-full" />
                    </motion.div>
                  ) : (
                    <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl opacity-30">🧩</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {options.map(country => {
            const isWrong = wrongCode === country.code;
            return (
              <button key={country.code} onClick={() => handleSelect(country)} disabled={solved}
                className={`relative aspect-[4/3] rounded-2xl bg-white shadow-lg border-[5px] transition-all flex items-center justify-center overflow-hidden
                  ${solved && country.code === target?.code ? 'border-green-400 bg-green-50 scale-105 shadow-xl' : isWrong ? 'border-red-300 bg-red-50 animate-shake' : 'border-transparent hover:border-cyan-300 hover:shadow-xl active:scale-95 cursor-pointer'}`}>
                <HalfBackground code={country.code} side="right" className="w-1/2 h-full" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}