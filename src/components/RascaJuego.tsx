import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { useLevelGreeting } from '../hooks/useLevelGreeting';
import { FLAG_BASE, getExpertDistractors } from '../utils/game';
import type { GameProps } from '../utils/game';
import type { Country } from '../data/countries';

const BRUSH_RADIUS = 28;
const REVEAL_THRESHOLD = 0.55;

export function RascaJuego({ level, poolCountries, onBack, onFinish }: GameProps) {
  const { speak } = useSpeech();
  const greet = useLevelGreeting(level, speak);
  const { adjustWeight, getRandomCountry } = useAdaptiveLearning(poolCountries);
  const lastCodeRef = useRef<string | null>(null);

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
    const t = getRandomCountry(available.length > 0 ? available : poolCountries);
    if (!t) return;
    lastCodeRef.current = t.code;

    const distractors = level === 'expert'
      ? getExpertDistractors(t, poolCountries, 2)
      : poolCountries.filter(c => c.code !== t.code).sort(() => Math.random() - 0.5).slice(0, 2);

    setTarget(t);
    setOptions([t, ...distractors].sort(() => Math.random() - 0.5));
    setTimeout(() => greet('¿Qué bandera se esconde? ¡Rasca para descubrir!'), 600);
  }, [poolCountries, getRandomCountry, greet, level]);

  useEffect(() => { generateRound(); }, []);

  useEffect(() => {
    if (target) {
      const id = setTimeout(initCanvas, 100);
      return () => clearTimeout(id);
    }
  }, [target, initCanvas]);

  const getPos = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;
    const rect = container.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
      if (!touch) return null;
      clientX = touch.clientX; clientY = touch.clientY;
    } else {
      clientX = (e as MouseEvent).clientX; clientY = (e as MouseEvent).clientY;
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
    if (pixelsClearedRef.current / totalPixelsRef.current >= REVEAL_THRESHOLD) setRevealed(true);
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); isDrawingRef.current = true; const p = getPos(e); if (p) { erase(p.x, p.y); checkRevealed(); } };
    const onTouchMove = (e: TouchEvent) => { if (!isDrawingRef.current) return; e.preventDefault(); const p = getPos(e); if (p) { erase(p.x, p.y); checkRevealed(); } };
    const onTouchEnd = () => { isDrawingRef.current = false; };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [erase, checkRevealed]);

  const handleMouseStart = useCallback((e: React.MouseEvent) => {
    isDrawingRef.current = true;
    const pos = getPos(e.nativeEvent);
    if (pos) { erase(pos.x, pos.y); checkRevealed(); }
  }, [erase, checkRevealed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const pos = getPos(e.nativeEvent);
    if (pos) { erase(pos.x, pos.y); checkRevealed(); }
  }, [erase, checkRevealed]);

  const handleMouseEnd = useCallback(() => { isDrawingRef.current = false; }, []);

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

  const starCount = Math.min(Math.floor(score / 10), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Atrás"><span className="text-2xl">⬅️</span><span className="text-sm font-bold text-gray-600">Atrás</span></button>
          <button onClick={() => onFinish?.(score)} className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all" aria-label="Terminar"><span className="text-xl">🏁</span><span className="text-sm font-bold text-gray-600">Terminar</span></button>
        </div>
        <div className="flex gap-1">{Array.from({ length: starCount }).map((_, i) => (<span key={i} className="text-2xl">⭐</span>))}</div>
      </header>

      <main className="max-w-md mx-auto">
        <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 mb-6 touch-none select-none">
          {target && <img src={`${FLAG_BASE}/${target.code.toLowerCase()}.svg`} alt="" className="absolute inset-0 w-full h-full object-contain p-4" draggable={false} />}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={handleMouseStart} onMouseMove={handleMouseMove} onMouseUp={handleMouseEnd} onMouseLeave={handleMouseEnd} />
        </div>

        {revealed && (
          <div className="grid grid-cols-3 gap-3">
            {options.map(country => {
              const isCorrect = result === 'correct' && country.code === target?.code;
              const isWrong = result === 'incorrect' && country.code !== target?.code;
              return (
                <button key={country.code} onClick={() => handleOption(country.code)} disabled={result === 'correct'}
                  className={`relative aspect-[4/3] rounded-xl bg-white shadow-md border-[4px] transition-all flex items-center justify-center p-2
                    ${isCorrect ? 'border-green-400 bg-green-50 scale-105' : isWrong ? 'border-red-300 animate-shake'
                      : 'border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95 cursor-pointer'}`}>
                  <img src={`${FLAG_BASE}/${country.code.toLowerCase()}.svg`} alt="" className="w-full h-full object-contain" />
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