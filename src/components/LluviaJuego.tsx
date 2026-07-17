import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import type { Country } from '../data/countries';

interface LluviaJuegoProps {
  continentCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';

interface FallingFlag {
  id: number;
  country: Country;
  x: number;
  y: number;
  speed: number;
  isTarget: boolean;
  caught: boolean;
}

const ROUND_DURATION = 20000;
const SPAWN_INTERVAL = 1400;
const FALL_SPEED = 0.15;

let flagIdCounter = 0;

export function LluviaJuego({ continentCountries, onBack, onFinish }: LluviaJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(continentCountries);

  const containerRef = useRef<HTMLDivElement>(null);
  const flagsRef = useRef<FallingFlag[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const roundStartRef = useRef(0);
  const scoreRef = useRef(0);

  const [target, setTarget] = useState<Country | null>(null);
  const [flags, setFlags] = useState<FallingFlag[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const generateRound = useCallback(() => {
    const t = getRandomCountry(continentCountries);
    if (!t) return;

    setTarget(t);
    flagsRef.current = [];
    setFlags([]);
    setGameOver(false);
    setPlaying(true);
    roundStartRef.current = performance.now();
    lastSpawnRef.current = 0;

    speak(`¡Atrapa las banderas de ${t.name}!`);
  }, [continentCountries, getRandomCountry, speak]);

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (!playing || !target) return;

    const spawnFlag = () => {
      const isTarget = Math.random() < 0.4;
      let country: Country;

      if (isTarget) {
        country = target;
      } else {
        const others = continentCountries.filter(c => c.code !== target.code);
        country = others.length > 0
          ? others[Math.floor(Math.random() * others.length)]
          : target;
      }

      const flag: FallingFlag = {
        id: ++flagIdCounter,
        country,
        x: Math.random() * 80 + 10,
        y: -15,
        speed: FALL_SPEED + Math.random() * 0.08,
        isTarget,
        caught: false,
      };

      flagsRef.current = [...flagsRef.current, flag];
    };

    const loop = (now: number) => {
      if (!playing) return;

      const elapsed = now - roundStartRef.current;
      const remaining = Math.max(0, ROUND_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setPlaying(false);
        setGameOver(true);
        onFinish?.(scoreRef.current);
        return;
      }

      if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
        lastSpawnRef.current = now;
        if (flagsRef.current.length < 10) {
          spawnFlag();
        }
      }

      flagsRef.current = flagsRef.current
        .map(f => ({ ...f, y: f.y + f.speed }))
        .filter(f => f.y < 110 && !f.caught);

      setFlags([...flagsRef.current]);
      rafRef.current = requestAnimationFrame(loop);
    };

    lastSpawnRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [playing, target, continentCountries]);

  const handleTap = useCallback((flag: FallingFlag) => {
    if (flag.caught || !playing) return;

    if (flag.isTarget) {
      flag.caught = true;
      setScore(s => { const n = s + 10; scoreRef.current = n; return n; });
      adjustWeight(flag.country.code, true);
      speak(`¡${flag.country.name}!`);
    } else {
      flagsRef.current = flagsRef.current.map(f =>
        f.id === flag.id ? { ...f, caught: false } : f
      );
      adjustWeight(target!.code, false);
    }
  }, [playing, adjustWeight, speak, target]);

  const playAgain = () => {
    setScore(0);
    scoreRef.current = 0;
    setRound(r => r + 1);
    generateRound();
  };

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  const formatTime = (ms: number) => Math.ceil(ms / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-4 px-4 overflow-hidden">
      <header className="max-w-3xl mx-auto mb-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 bg-white/80 rounded-xl shadow-md" aria-label="Volver">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button
            onClick={() => onFinish?.(score)}
            className="px-3 py-2 bg-white/80 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-sm font-medium text-gray-600"
          >
            🏁
          </button>
        </div>
        <h1 className="text-lg md:text-xl font-bold text-gray-800 flex-1 text-center">Lluvia de Banderas</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 font-medium">Ronda {round}</span>
          <span className="text-cyan-600 font-bold">{score} pts</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto relative">
        {target && (
          <div className="text-center mb-2 relative z-10">
            <p className="text-base md:text-lg font-bold text-gray-700">
              ¡Atrapa: <span className="text-cyan-600">{target.name}</span>!
            </p>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(timeLeft / ROUND_DURATION) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{formatTime(timeLeft)}s</span>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="relative w-full h-[70vh] bg-gradient-to-b from-sky-100 to-white rounded-2xl shadow-inner overflow-hidden touch-none select-none"
        >
          {target && (
            <div className="absolute top-2 right-2 z-20 bg-white/80 px-3 py-1 rounded-full text-sm shadow">
              🎯 {target.name}
            </div>
          )}

          {flags.map(flag => (
            <button
              key={flag.id}
              onClick={() => handleTap(flag)}
              className="absolute w-[18%] aspect-[4/3] transition-opacity duration-200 cursor-pointer"
              style={{
                left: `${flag.x}%`,
                top: `${flag.y}%`,
                opacity: flag.caught ? 0 : 1,
                pointerEvents: flag.caught ? 'none' : 'auto',
                willChange: 'transform',
              }}
              aria-label={flag.country.name}
            >
              <img
                src={flagUrl(flag.country.code)}
                alt=""
                className="w-full h-full object-contain drop-shadow-md pointer-events-none"
                draggable={false}
              />
            </button>
          ))}

          {!playing && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <p className="text-xl font-bold text-white drop-shadow-lg">Preparando...</p>
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={() => target && speak(`¡Atrapa las banderas de ${target.name}!`)}
            className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium hover:shadow-lg active:scale-95 transition-all"
            disabled={!target}
          >
            <span className="mr-1">🔊</span> Repetir
          </button>
        </div>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
              <span className="text-7xl block mb-4">⏰</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Tiempo terminado!</h2>
              <p className="text-4xl font-bold text-cyan-600 mb-2">{score} pts</p>
              <p className="text-gray-500 mb-6">Has atrapado {Math.round(score / 10)} banderas</p>
              <button
                onClick={playAgain}
                className="px-8 py-3 bg-cyan-500 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-cyan-600 active:scale-95 transition-all"
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