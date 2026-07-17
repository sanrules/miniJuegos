import { useState } from 'react';
import { countries, type Level, type Continent, type Country } from './data/countries';
import { LevelSelection } from './components/LevelSelection';
import { MapSelection } from './components/MapSelection';
import { GameSelection } from './components/GameSelection';
import type { GameId } from './components/GameSelection';
import { AdivinaJuego } from './components/AdivinaJuego';
import { ParejasJuego } from './components/ParejasJuego';
import { RascaJuego } from './components/RascaJuego';
import { IntrusoJuego } from './components/IntrusoJuego';
import { LluviaJuego } from './components/LluviaJuego';
import { PuzleJuego } from './components/PuzleJuego';
import { CucuJuego } from './components/CucuJuego';
import { AnimalesJuego } from './components/AnimalesJuego';
import { Celebration } from './components/Celebration';
import { useSpeech } from './hooks/useSpeech';
import { motion } from 'framer-motion';

type Screen =
  | { type: 'welcome' }
  | { type: 'level' }
  | { type: 'map'; level: Level }
  | { type: 'gameSelection'; level: Level; continent: Continent | null }
  | { type: 'game'; level: Level; game: GameId; continent: Continent | null }
  | { type: 'celebration'; score: number; game: GameId; level: Level; continent: Continent | null };

function WelcomeScreen({ onPlay }: { onPlay: () => void }) {
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" onClick={() => speak('¡Mini Juegos!')}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }} className="text-center max-w-md">
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-8xl mb-6">🎌</motion.div>
        <p className="text-xl text-white/80 mb-10">¡Aprende banderas jugando!</p>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={(e) => { e.stopPropagation(); speak('¡A jugar!'); onPlay(); }}
          className="inline-flex items-center gap-3 px-10 py-5 bg-green-400 hover:bg-green-300 text-white rounded-full text-3xl font-bold shadow-2xl hover:shadow-green-400/50 transition-all">
          <span className="text-4xl">▶️</span><span>¡Jugar!</span>
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

  switch (screen.type) {
    case 'welcome':
      return <WelcomeScreen onPlay={() => setScreen({ type: 'level' })} />;

    case 'level':
      return (
        <LevelSelection onSelect={(level) => {
          if (level === 'continents') setScreen({ type: 'map', level });
          else setScreen({ type: 'gameSelection', level, continent: null });
        }} />
      );

    case 'map':
      return (
        <MapSelection onSelectContinent={(continent) => setScreen({ type: 'gameSelection', level: screen.level, continent })}
          onBack={() => setScreen({ type: 'level' })} />
      );

    case 'gameSelection':
      return (
        <GameSelection level={screen.level} continent={screen.continent}
          onSelectGame={(game) => setScreen({ type: 'game', level: screen.level, game, continent: screen.continent })}
          onBack={() => setScreen({ type: 'level' })} />
      );

    case 'game': {
      const pool = getPool(screen.level, screen.continent);
      const back = () => setScreen({ type: 'gameSelection', level: screen.level, continent: screen.continent });
      const finish = (score: number) => setScreen({ type: 'celebration', score, game: screen.game, level: screen.level, continent: screen.continent });
      const shared = { level: screen.level, poolCountries: pool, onBack: back, onFinish: finish };

      switch (screen.game) {
        case 'adivina': return <AdivinaJuego {...shared} />;
        case 'parejas': return <ParejasJuego {...shared} />;
        case 'rasca': return <RascaJuego {...shared} />;
        case 'intruso': return <IntrusoJuego {...shared} />;
        case 'lluvia': return <LluviaJuego {...shared} />;
        case 'puzle': return <PuzleJuego {...shared} />;
        case 'cucu': return <CucuJuego {...shared} />;
        case 'animales': return <AnimalesJuego {...shared} />;
      }
      return null;
    }

    case 'celebration':
      return (
        <Celebration score={screen.score}
          onContinue={() => setScreen({ type: 'gameSelection', level: screen.level, continent: screen.continent })} />
      );
  }
}