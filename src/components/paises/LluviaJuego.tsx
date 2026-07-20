import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { useAdaptiveLearning } from '../../hooks/useAdaptiveLearning.ts';
import { useLevelGreeting } from '../../hooks/useLevelGreeting.ts';
import { useScrollLock } from '../../hooks/useScrollLock.ts';
import { FLAG_BASE, getExpertDistractors, handleFlagError } from '../../utils/game.ts';
import type { GameProps } from '../../utils/game.ts';
import type { Country } from '../../data/countries.ts';
import {BackButton} from "../comunes/BackButton.tsx";

const FALL_SPEED = 0.38;
const FLAG_SIZE = 80;
const SPAWN_INTERVAL = 2800;

interface FallingFlag {
  id: number;
  code: string;
  x: number;
  y: number;
}

export function LluviaJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  useScrollLock(true);
  const greet = useLevelGreeting(level, speak);
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

  const pickNewTarget = useCallback(() => {
    const available = poolCountries.filter(c => c.code !== lastTargetRef.current);
    const t = getRandomCountry(available.length > 0 ? available : poolCountries);
    if (!t) return null;
    lastTargetRef.current = t.code;
    return t;
  }, [poolCountries, getRandomCountry]);

  useEffect(() => {
    const t = pickNewTarget();
    if (!t) return;
    setTarget(t);
    activeTargetRef.current = t.code;
  }, []);

  useEffect(() => {
    if (!target || greetedRef.current) return;
    greetedRef.current = true;
    const id = setTimeout(() => greet(`¡Atrapa las banderas de ${target.name}!`), 700);
    return () => clearTimeout(id);
  }, [target, greet]);

  useEffect(() => {
    if (timeLeft <= 0) { setGameOver(true); setFlags([]); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  useEffect(() => {
    if (gameOver || !target) return;
    const spawn = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const codes = [target.code];
      const randoms = level === 'expert'
        ? getExpertDistractors(target, poolCountries, 2).map(c => c.code)
        : poolCountries.filter(c => c.code !== target.code).sort(() => Math.random() - 0.5).slice(0, 2).map(c => c.code);

      const pool = [...codes, ...randoms].sort(() => Math.random() - 0.5);
      const maxX = container.clientWidth - FLAG_SIZE;

      idCounterRef.current++;
      setFlags(prev => [...prev, {
        id: idCounterRef.current,
        code: pool[Math.floor(Math.random() * pool.length)],
        x: Math.max(0, Math.random() * maxX),
        y: -FLAG_SIZE,
      }]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawn);
  }, [gameOver, target, poolCountries, level]);

  useEffect(() => {
    if (gameOver) return;
    let rafId: number;
    const animate = () => {
      setFlags(prev => {
        const container = containerRef.current;
        const h = container ? container.clientHeight : Infinity;
        return prev.map(f => ({ ...f, y: f.y + FALL_SPEED })).filter(f => f.y < h);
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [gameOver]);

  const handleTap = useCallback((flag: FallingFlag) => {
    if (gameOver || caught.has(`${flag.id}`)) return;
    if (flag.code === activeTargetRef.current) {
      setCaught(prev => new Set(prev).add(`${flag.id}`));
      setScore(s => s + 10);
      adjustWeight(flag.code, true);
      setFlags(prev => prev.filter(f => f.id !== flag.id));
      const newTarget = pickNewTarget();
      if (newTarget) {
        setTarget(newTarget);
        activeTargetRef.current = newTarget.code;
        setTimeout(() => speak(`¡Ahora atrapa las de ${newTarget.name}!`), 1000);
      }
    } else {
      adjustWeight(activeTargetRef.current!, false);
    }
  }, [gameOver, caught, adjustWeight, pickNewTarget, greet]);

  const starCount = Math.min(Math.floor(score / 10), 5);

  if (poolCountries.length < 3) {
    return <div className="min-h-screen flex items-center justify-center"><span className="text-6xl">😕</span></div>;
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full animate-bounce-in">
          <span className="text-7xl block mb-4">🎉</span>
          <div className="flex gap-2 justify-center mb-6">
            {Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-3xl">⭐</span>))}
          </div>
          <button onClick={onBack} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-blue-600 active:scale-95 transition[...]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-6 px-4 overflow-hidden">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="[...]
        </div>
        <div className="flex gap-1">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}</div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md">
          <span className="text-2xl">⏱️</span>
          <span className="text-xl font-bold text-gray-700 ml-1">{timeLeft}</span>
        </div>
      </header>

      <main ref={containerRef} className="relative max-w-md mx-auto h-[65vh] bg-gradient-to-b from-blue-100/50 to-transparent rounded-3xl overflow-hidden border-2 border-blue-100 touch-none select-non[...]
        {flags.map(flag => (
          <button key={flag.id} onClick={() => handleTap(flag)}
            className="absolute transition-opacity duration-200 active:scale-110"
            style={{ left: flag.x, top: flag.y, width: FLAG_SIZE, height: FLAG_SIZE }}>
            <img src={`${FLAG_BASE}/${flag.code.toLowerCase()}.svg`} alt="" onError={handleFlagError}
              className="w-full h-full object-contain drop-shadow-md rounded-lg bg-white/80 p-1" draggable={false} />
          </button>
        ))}
      </main>
    </div>
  );
}
