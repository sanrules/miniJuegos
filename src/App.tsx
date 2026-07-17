import { useState, useRef, useCallback } from 'react';
import { countries, type Level, type Continent, type Country } from './data/countries';
import { LevelSelection } from './components/LevelSelection';
import { MapSelection } from './components/MapSelection';
import { GameSelection } from './components/GameSelection';
import type { GameId } from './components/GameSelection';
import { AdivinaJuego } from './components/AdivinaJuego';
import { ParejasJuego } from './components/ParejasJuego';
import { RascaJuego } from './components/RascaJuego';
import { IntrusoJuego } from './components/IntrusoJuego';
import { PuzleJuego } from './components/PuzleJuego';
import { AnimalesJuego } from './components/AnimalesJuego';
import { AtlasInteractivo } from './components/AtlasInteractivo';
import { Celebration } from './components/Celebration';
import { useSpeech } from './hooks/useSpeech';
import { motion } from 'framer-motion';

type Screen =
  | { type: 'welcome' }
  | { type: 'atlas' }
  | { type: 'level' }
  | { type: 'map'; level: Level }
  | { type: 'gameSelection'; level: Level; continent: Continent | null }
  | { type: 'game'; level: Level; game: GameId; continent: Continent | null }
  | { type: 'celebration'; score: number; game: GameId; level: Level; continent: Continent | null };

function WelcomeScreen({ onPlay, onAtlas }: { onPlay: () => void; onAtlas: () => void }) {
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" onClick={() => speak('¡Mini Juegos!')}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }} className="text-center max-w-md">
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-8xl mb-6">🎌</motion.div>
        <p className="text-xl text-white/80 mb-10">¡Aprende banderas jugando!</p>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={(e) => { e.stopPropagation(); speak('¡A jugar!'); onPlay(); }}
          className="inline-flex items-center gap-3 px-10 py-5 bg-green-400 hover:bg-green-300 text-white rounded-full text-3xl font-bold shadow-2xl hover:shadow-green-400/50 transition-all mb-4">
          <span className="text-4xl">▶️</span><span>¡Jugar!</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={(e) => { e.stopPropagation(); speak('🗺️ Atlas'); onAtlas(); }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-white rounded-full text-2xl font-bold shadow-2xl hover:shadow-amber-400/50 transition-all">
          <span className="text-3xl">🗺️</span><span>Atlas</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

function getPool(level: Level, continent: Continent | null): Country[] {
  if (level === 'explorer') return countries.filter(c => c.difficulty === 1);
  if (level === 'continents' && continent) return countries.filter(c => c.continent === continent);
  return countries;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'welcome' });
  const navigateRef = useRef(false);
  const navigate = useCallback((s: Screen) => {
    if (navigateRef.current) return;
    navigateRef.current = true;
    setScreen(s);
    setTimeout(() => { navigateRef.current = false; }, 400);
  }, []);

  switch (screen.type) {
    case 'welcome':
      return <WelcomeScreen onPlay={() => navigate({ type: 'level' })} onAtlas={() => navigate({ type: 'atlas' })} />;

    case 'atlas':
      return <AtlasInteractivo onBack={() => navigate({ type: 'welcome' })} />;

    case 'level':
      return (
        <LevelSelection onSelect={(level) => {
          if (level === 'continents') navigate({ type: 'map', level });
          else navigate({ type: 'gameSelection', level, continent: null });
        }} onBack={() => navigate({ type: 'welcome' })} />
      );

    case 'map':
      return (
        <MapSelection onSelectContinent={(continent) => navigate({ type: 'gameSelection', level: screen.level, continent })}
          onBack={() => navigate({ type: 'level' })} />
      );

    case 'gameSelection':
      return (
        <GameSelection level={screen.level} continent={screen.continent}
          onSelectGame={(game) => navigate({ type: 'game', level: screen.level, game, continent: screen.continent })}
          onBack={() => navigate({ type: 'level' })} />
      );

    case 'game': {
      const pool = getPool(screen.level, screen.continent);
      const back = () => navigate({ type: 'gameSelection', level: screen.level, continent: screen.continent });
      const finish = (score: number) => navigate({ type: 'celebration', score, game: screen.game, level: screen.level, continent: screen.continent });
      const shared = { level: screen.level, poolCountries: pool, onBack: back, onFinish: finish };

      switch (screen.game) {
        case 'adivina': return <AdivinaJuego {...shared} />;
        case 'parejas': return <ParejasJuego {...shared} />;
        case 'rasca': return <RascaJuego {...shared} />;
        case 'intruso': return <IntrusoJuego {...shared} />;
        case 'puzle': return <PuzleJuego {...shared} />;
        case 'animales': return <AnimalesJuego {...shared} />;
      }
      return null;
    }

    case 'celebration':
      return (
        <Celebration score={screen.score}
          onContinue={() => navigate({ type: 'gameSelection', level: screen.level, continent: screen.continent })} />
      );
  }
}