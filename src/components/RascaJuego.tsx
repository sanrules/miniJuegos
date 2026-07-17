import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { type Level, levelGreetings } from '../data/countries';
import type { Country } from '../data/countries';

interface RascaJuegoProps {
  level: Level;
  poolCountries: Country[];
  onBack: () => void;
  onFinish?: (score: number) => void;
}

const FLAG_BASE = 'https://flagcdn.com';
const BRUSH_RADIUS = 28;
const REVEAL_THRESHOLD = 0.55;

function getExpertDistractors(target: Country, pool: Country[], count: number): Country[] {
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

export function RascaJuego({ level, poolCountries, onBack, onFinish }: RascaJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(poolCountries);
  const lastCodeRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const pixelsClearedRef = useRef(0);
  const totalPixelsRef = useRef(0);

  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#9CA3AF');
    gradient.addColorStop(0.5, '#6B7280');
    gradient.addColorStop(1, '#9CA3AF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#FBBF24';
    ctx.font = `bold ${Math.min(w, h) * 0.12}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✋ ¡Rasca aquí!', w / 2, h / 2);

    totalPixelsRef.current = w * h;
    pixelsClearedRef.current = 0;
    setRevealed(false);
    setResult(null);
  }, []);

  const generateRound = useCallback(() => {
    const available = poolCountries.filter(c => c.code !== lastCodeRef.current);
    const pool = available.length > 0 ? available : poolCountries;
    const t = getRandomCountry(pool);
    if (!t) return;
    lastCodeRef.current = t.code;

    let distractors: Country[];
    if (level === 'expert') {
      distractors = getExpertDistractors(t, poolCountries, 2);
    } else {
      distractors = poolCountries
        .filter(c => c.code !== t.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    }

    const shuffled = [t, ...distractors].sort(() => Math.random() - 0.5);
    setTarget(t);
    setOptions(shuffled);

    setTimeout(() => {
      if (!greetedRef.current) {
        greetedRef.current = true;
        speak(`${levelGreetings[level]} ¿Qué bandera se esconde? ¡Rasca para descubrir!`);
      } else {
        speak('¿Qué bandera se esconde? ¡Rasca para descubrir!');
      }
    }, 600);
  }, [poolCountries, getRandomCountry, speak, level]);

  useEffect(() => { generateRound(); }, []);

  useEffect(() => {
    if (target) {
      const timer = setTimeout(initCanvas, 100);
      return () => clearTimeout(timer);
    }
  }, [target, initCanvas]);

  const getPos = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

    const rect = container.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
      if (!touch) return null;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const erase = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS * (window.devicePixelRatio || 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    pixelsClearedRef.current += BRUSH_RADIUS * BRUSH_RADIUS * Math.PI;
  }, []);

  const checkRevealed = useCallback(() => {
    if (revealed || totalPixelsRef.current === 0) return;
    const ratio = pixelsClearedRef.current / totalPixelsRef.current;
    if (ratio >= REVEAL_THRESHOLD) setRevealed(true);
  }, [revealed]);

  const handlePointerStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getPos(e as unknown as TouchEvent | MouseEvent);
    if (pos) { erase(pos.x, pos.y); checkRevealed(); }
  }, [erase, checkRevealed]);

  const handlePointerMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e as unknown as TouchEvent | MouseEvent);
    if (pos) { erase(pos.x, pos.y); checkRevealed(); }
  }, [erase, checkRevealed]);

  const handlePointerEnd = useCallback(() => { isDrawingRef.current = false; }, []);

  const handleOption = useCallback((code: string) => {
    if (result || !target) return;
    if (code === target.code) {
      setResult('correct');
      setScore(s => s + 10);
      adjustWeight(target.code, true);
      speak(`🎉 ¡${target.name}!`);
      setTimeout(() => { generateRound(); }, 2000);
    } else {
      setResult('incorrect');
      adjustWeight(target.code, false);
      setTimeout(() => setResult(null), 800);
    }
  }, [result, target, adjustWeight, speak, generateRound]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;
  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-3xl" aria-label="Atrás">⬅️</button>
          <button onClick={() => onFinish?.(score)} className="px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all text-xl">🏁</button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: starCount }).map((_, i) => (
            <span key={i} className="text-2xl">⭐</span>
          ))}
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 mb-6 touch-none select-none"
        >
          {target && (
            <img src={flagUrl(target.code)} alt="" className="absolute inset-0 w-full h-full object-contain p-4" draggable={false} />
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            onTouchStart={handlePointerStart}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerEnd}
            onMouseDown={handlePointerStart}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerEnd}
            onMouseLeave={handlePointerEnd}
          />
        </div>

        {revealed && (
          <div className="grid grid-cols-3 gap-3">
            {options.map(country => {
              const isCorrect = result === 'correct' && country.code === target?.code;
              const isWrong = result === 'incorrect' && country.code !== target?.code;

              return (
                <button
                  key={country.code}
                  onClick={() => handleOption(country.code)}
                  disabled={result === 'correct'}
                  className={`
                    relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all flex items-center justify-center p-2
                    ${isCorrect ? 'border-green-400 bg-green-50 scale-105'
                      : isWrong ? 'border-red-300 animate-shake'
                      : 'border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95 cursor-pointer'}
                  `}
                >
                  <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                  {isCorrect && <span className="absolute text-3xl">🎉</span>}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}