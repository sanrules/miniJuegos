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
import { WorldSelector } from './components/WorldSelector';
import { Celebration } from './components/Celebration';


type Screen =
  | { type: 'worldSelector' }
  | { type: 'atlas' }
  | { type: 'level' }
  | { type: 'map'; level: Level }
  | { type: 'gameSelection'; level: Level; continent: Continent | null }
  | { type: 'game'; level: Level; game: GameId; continent: Continent | null }
  | { type: 'celebration'; score: number; game: GameId; level: Level; continent: Continent | null }
  | { type: 'animalesWorld' };

function getPool(level: Level, continent: Continent | null): Country[] {
  if (level === 'explorer') return countries.filter(c => c.difficulty === 1);
  if (level === 'continents' && continent) return countries.filter(c => c.continent === continent);
  return countries;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'worldSelector' });
  const navigateRef = useRef(false);
  const navigate = useCallback((s: Screen) => {
    if (navigateRef.current) return;
    navigateRef.current = true;
    setScreen(s);
    setTimeout(() => { navigateRef.current = false; }, 400);
  }, []);

  switch (screen.type) {
    case 'worldSelector':
      return <WorldSelector
        onSelectFlags={() => navigate({ type: 'level' })}
        onSelectAnimals={() => navigate({ type: 'animalesWorld' })}
        onSelectAtlas={() => navigate({ type: 'atlas' })} />;

    case 'atlas':
      return <AtlasInteractivo onBack={() => navigate({ type: 'worldSelector' })} />;

    case 'level':
      return (
        <LevelSelection onSelect={(level) => {
          if (level === 'continents') navigate({ type: 'map', level });
          else navigate({ type: 'gameSelection', level, continent: null });
        }} onBack={() => navigate({ type: 'worldSelector' })} />
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

    case 'animalesWorld':
      return <AnimalesJuego level="explorer" poolCountries={countries}
        onBack={() => navigate({ type: 'worldSelector' })}
        onFinish={(score) => navigate({ type: 'celebration', score, game: 'animales', level: 'explorer', continent: null })} />;

    case 'celebration':
      return (
        <Celebration score={screen.score}
          onContinue={() => navigate({ type: 'gameSelection', level: screen.level, continent: screen.continent })} />
      );
  }
}