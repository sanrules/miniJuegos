import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { type Level, levelGreetings } from '../data/countries';
import type { Country } from '../data/countries';

interface LluviaJuegoProps {
  level: Level;
  poolCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';
const FALL_SPEED = 0.38;
const FLAG_SIZE = 80;
const SPAWN_INTERVAL = 2800;

interface FallingFlag {
  id: number;
  code: string;
  x: number;
  y: number;
}

function getExpertRandoms(target: Country, pool: Country[], count: number): Country[] {
  const result: Country[] = [];
  for (const code of target.similar) {
    if (result.length >= count) break;
    const found = pool.find(c => c.code === code);
    if (found) result.push(found);
  }
  if (result.length < count) {
    const sameColor = pool.filter(
      c => c.code !== target.code && c.colorGroup === target.colorGroup && !result.some(r => r.code === c.code)
    ).sort(() => Math.random() - 0.5);
    for (const c of sameColor) {
      if (result.length >= count) break;
      result.push(c);
    }
  }
  if (result.length < count) {
    const random = pool.filter(
      c => c.code !== target.code && !result.some(r => r.code === c.code)
    ).sort(() => Math.random() - 0.5);
    for (const c of random) {
      if (result.length >= count) break;
      result.push(c);
    }
  }
  return result;
}

export function LluviaJuego({ level, poolCountries, onBack, onFinish }: LluviaJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(poolCountries);
  const lastTargetRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  const [target, setTarget] = useState<Country | null>(null);
  const [flags, setFlags] = useState<FallingFlag[]>([]);
  const [caught, setCaught] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const activeTargetRef = useRef<string | null>(null);
  const spokenTargetRef = useRef<string | null>(null);

  const pickNewTarget = useCallback(() => {
    const available = poolCountries.filter(c => c.code !== lastTargetRef.current);
    const pool = available.length > 0 ? available : poolCountries;
    const t = getRandomCountry(pool);
    if (!t) return null;
    lastTargetRef.current = t.code;
    return t;
  }, [poolCountries, getRandomCountry]);

  useEffect(() => {
    const t = pickNewTarget();
    if (!t) return;
    setTarget(t);
    activeTargetRef.current = t.code;
    spokenTargetRef.current = null;
  }, []);

  useEffect(() => {
    if (!target || spokenTargetRef.current === target.code) return;
    spokenTargetRef.current = target.code;

    const delay = setTimeout(() => {
      if (!greetedRef.current) {
        greetedRef.current = true;
        speak(`${levelGreetings[level]} ¡Atrapa las banderas de ${target.name}!`);
      } else {
        speak(`¡Atrapa las banderas de ${target.name}!`);
      }
    }, 700);
    return () => clearTimeout(delay);
  }, [target, speak, level]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      setFlags([]);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (gameOver || !target) return;

    const spawn = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const codes = [target.code];
      let randoms: Country[];
      if (level === 'expert') {
        randoms = getExpertRandoms(target, poolCountries, 2);
      } else {
        randoms = poolCountries
          .filter(c => c.code !== target.code)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
      }

      const pool = [...codes, ...randoms.map(c => c.code)].sort(() => Math.random() - 0.5);

      const maxX = container.clientWidth - FLAG_SIZE;
      const startX = Math.random() * maxX;

      idCounterRef.current++;
      const newFlag: FallingFlag = {
        id: idCounterRef.current,
        code: pool[Math.floor(Math.random() * pool.length)],
        x: Math.max(0, startX),
        y: -FLAG_SIZE,
      };

      setFlags(prev => [...prev, newFlag]);
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawn);
  }, [gameOver, target, poolCountries, level]);

  useEffect(() => {
    if (gameOver) return;

    let rafId: number;
    const animate = () => {
      setFlags(prev => {
        const next = prev
          .map(f => ({ ...f, y: f.y + FALL_SPEED }))
          .filter(f => {
            const container = containerRef.current;
            return container ? f.y < container.clientHeight : true;
          });
        return next;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [gameOver]);

  const handleTap = useCallback((flag: FallingFlag) => {
    if (gameOver) return;
    if (caught.has(`${flag.id}`)) return;

    const isCorrect = flag.code === activeTargetRef.current;
    if (isCorrect) {
      setCaught(prev => new Set(prev).add(`${flag.id}`));
      setScore(s => s + 10);
      adjustWeight(flag.code, true);

      setFlags(prev => prev.filter(f => f.id !== flag.id));

      const newTarget = pickNewTarget();
      if (newTarget) {
        setTarget(newTarget);
        activeTargetRef.current = newTarget.code;
        spokenTargetRef.current = null;

        setTimeout(() => {
          speak(`¡Ahora atrapa las de ${newTarget.name}!`);
        }, 1000);
      }
    } else {
      adjustWeight(activeTargetRef.current!, false);
    }
  }, [gameOver, caught, adjustWeight, pickNewTarget, speak]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;
  const starCount = Math.min(Math.floor(score / 10), 5);

  if (poolCountries.length < 3) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-6xl">😕</span>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
          <span className="text-7xl block mb-4">🎉</span>
          <div className="flex gap-2 justify-center mb-6">
            {Array.from({ length: starCount }).map((_, i) => (
              <span key={i} className="text-3xl">⭐</span>
            ))}
          </div>
          <button onClick={onBack} className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-blue-600 active:scale-95 transition-all">⬅️</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-6 px-4 overflow-hidden">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-3xl" aria-label="Atrás">⬅️</button>
          <button onClick={() => onFinish?.(score)} className="px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-xl">🏁</button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: starCount }).map((_, i) => (
            <span key={i} className="text-2xl">⭐</span>
          ))}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md">
          <span className="text-2xl">⏱️</span>
          <span className="text-xl font-bold text-gray-700 ml-1">{timeLeft}</span>
        </div>
      </header>

      {target && (
        <div className="text-center mb-2">
          <span className="text-lg text-gray-500">🎯</span>
        </div>
      )}

      <main
        ref={containerRef}
        className="relative max-w-md mx-auto h-[65vh] bg-gradient-to-b from-blue-100/50 to-transparent rounded-3xl overflow-hidden border-2 border-blue-100 touch-none select-none"
      >
        {flags.map(flag => (
          <button
            key={flag.id}
            onClick={() => handleTap(flag)}
            className="absolute transition-opacity duration-200 active:scale-110"
            style={{
              left: flag.x,
              top: flag.y,
              width: FLAG_SIZE,
              height: FLAG_SIZE,
            }}
          >
            <img
              src={flagUrl(flag.code)}
              alt=""
              className="w-full h-full object-contain drop-shadow-md rounded-lg bg-white/80 p-1"
              draggable={false}
            />
          </button>
        ))}
      </main>
    </div>
  );
}