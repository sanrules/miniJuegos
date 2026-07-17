import { useState } from 'react';
import { countries, type Continent } from './data/countries';
import { MapSelection } from './components/MapSelection';
import { GameSelection } from './components/GameSelection';
import type { GameId } from './components/GameSelection';
import { AdivinaJuego } from './components/AdivinaJuego';
import { ParejasJuego } from './components/ParejasJuego';
import { RascaJuego } from './components/RascaJuego';
import { IntrusoJuego } from './components/IntrusoJuego';
import { LluviaJuego } from './components/LluviaJuego';
import { Celebration } from './components/Celebration';
import { useSpeech } from './hooks/useSpeech';

const gameNames: Record<GameId, string> = {
  adivina: 'Adivina la Bandera',
  parejas: 'Hacer Parejas',
  rasca: 'Rasca y Descubre',
  intruso: 'El Intruso',
  lluvia: 'Lluvia de Banderas',
};

type Screen =
  | { type: 'welcome' }
  | { type: 'map' }
  | { type: 'gameSelection'; continent: Continent }
  | { type: 'game'; game: GameId; continent: Continent }
  | { type: 'celebration'; score: number; game: GameId; continent: Continent };

function WelcomeScreen({ onPlay }: { onPlay: () => void }) {
  const { speak } = useSpeech();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
      onClick={() => speak('¡Mini Juegos!')}
    >
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">🎌</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
          Mini Juegos
        </h1>
        <p className="text-xl text-white/80 mb-10">
          ¡Aprende banderas jugando!
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            speak('¡A jugar!');
            onPlay();
          }}
          className="inline-flex items-center gap-4 px-12 py-5 bg-green-400 hover:bg-green-300 text-white rounded-full text-2xl font-bold shadow-2xl hover:shadow-green-400/50 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="text-3xl">▶️</span>
          ¡Jugar!
        </button>
      </div>
      <p className="mt-12 text-white/40 text-sm text-center">
        Toca cualquier cosa para escuchar
      </p>
    </div>
  );
}

const continentCountries = (continent: Continent) =>
  countries.filter(c => c.continent === continent);

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'welcome' });

  switch (screen.type) {
    case 'welcome':
      return <WelcomeScreen onPlay={() => setScreen({ type: 'map' })} />;

    case 'map':
      return (
        <MapSelection
          onSelectContinent={(continent) => setScreen({ type: 'gameSelection', continent })}
        />
      );

    case 'gameSelection':
      return (
        <GameSelection
          continent={screen.continent}
          onSelectGame={(game) => setScreen({ type: 'game', game, continent: screen.continent })}
          onBack={() => setScreen({ type: 'map' })}
        />
      );

    case 'game': {
      const c = continentCountries(screen.continent);
      const back = () => setScreen({ type: 'gameSelection', continent: screen.continent });
      const finish = (score: number) => setScreen({
        type: 'celebration',
        score,
        game: screen.game,
        continent: screen.continent,
      });

      switch (screen.game) {
        case 'adivina':
          return <AdivinaJuego continentCountries={c} onBack={back} onFinish={finish} />;
        case 'parejas':
          return <ParejasJuego continentCountries={c} onBack={back} onFinish={finish} />;
        case 'rasca':
          return <RascaJuego continentCountries={c} onBack={back} onFinish={finish} />;
        case 'intruso':
          return <IntrusoJuego continentCountries={c} onBack={back} onFinish={finish} />;
        case 'lluvia':
          return <LluviaJuego continentCountries={c} onBack={back} onFinish={finish} />;
      }
    }

    case 'celebration':
      return (
        <Celebration
          score={screen.score}
          gameName={gameNames[screen.game]}
          onContinue={() => setScreen({ type: 'gameSelection', continent: screen.continent })}
        />
      );
  }
}