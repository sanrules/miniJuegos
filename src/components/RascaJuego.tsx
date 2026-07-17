import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import type { Country } from '../data/countries';

interface RascaJuegoProps {
  continentCountries: Country[];
  onBack: () => void;
}

const FLAG_BASE = 'https://flagcdn.com';
const BRUSH_RADIUS = 28;
const REVEAL_THRESHOLD = 0.55;

export function RascaJuego({ continentCountries, onBack }: RascaJuegoProps) {
  const { speak } = useSpeech();
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(continentCountries);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const pixelsClearedRef = useRef(0);
  const totalPixelsRef = useRef(0);

  const [target, setTarget] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [round, setRound] = useState(1);
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
    const t = getRandomCountry(continentCountries);
    if (!t) return;

    const distractors = continentCountries
      .filter(c => c.code !== t.code)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const shuffled = [t, ...distractors].sort(() => Math.random() - 0.5);
    setTarget(t);
    setOptions(shuffled);

    setTimeout(() => {
      speak(`¿Qué bandera se esconde? ¡Rasca para descubrir!`);
    }, 400);
  }, [continentCountries, getRandomCountry, speak]);

  useEffect(() => {
    generateRound();
  }, []);

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
    if (ratio >= REVEAL_THRESHOLD) {
      setRevealed(true);
    }
  }, [revealed]);

  const handlePointerStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getPos(e as unknown as TouchEvent | MouseEvent);
    if (pos) {
      erase(pos.x, pos.y);
      checkRevealed();
    }
  }, [erase, checkRevealed]);

  const handlePointerMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e as unknown as TouchEvent | MouseEvent);
    if (pos) {
      erase(pos.x, pos.y);
      checkRevealed();
    }
  }, [erase, checkRevealed]);

  const handlePointerEnd = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const handleOption = useCallback((code: string) => {
    if (result || !target) return;
    if (code === target.code) {
      setResult('correct');
      setScore(s => s + 10);
      adjustWeight(target.code, true);
      speak(`¡Correcto! Era ${target.name}`);
      setTimeout(() => {
        setRound(r => r + 1);
        generateRound();
      }, 2000);
    } else {
      setResult('incorrect');
      adjustWeight(target.code, false);
      setTimeout(() => setResult(null), 800);
    }
  }, [result, target, adjustWeight, speak, generateRound]);

  const flagUrl = (code: string) => `${FLAG_BASE}/${code.toLowerCase()}.svg`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Volver">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center">Rasca y Descubre</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 font-medium">Ronda {round}</span>
          <span className="text-amber-600 font-bold">{score} pts</span>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <p className="text-center text-gray-600 mb-4">
          {revealed ? '¿Qué bandera es?' : '¡Rasca con el dedo para descubrir!'}
        </p>

        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 mb-6 touch-none select-none"
        >
          {target && (
            <img
              src={flagUrl(target.code)}
              alt=""
              className="absolute inset-0 w-full h-full object-contain p-4"
              draggable={false}
            />
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
                    relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all
                    flex items-center justify-center p-2
                    ${isCorrect
                      ? 'border-green-400 bg-green-50 scale-105'
                      : isWrong
                        ? 'border-red-300 animate-shake'
                        : 'border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95 cursor-pointer'
                    }
                  `}
                >
                  <img src={flagUrl(country.code)} alt="" className="w-full h-full object-contain" />
                  {isCorrect && <span className="absolute text-3xl">✅</span>}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}