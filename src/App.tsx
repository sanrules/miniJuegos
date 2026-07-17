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

type Screen =
  | { type: 'map' }
  | { type: 'gameSelection'; continent: Continent }
  | { type: 'game'; game: GameId; continent: Continent };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'map' });

  const continentCountries = (continent: Continent) =>
    countries.filter(c => c.continent === continent);

  switch (screen.type) {
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

      switch (screen.game) {
        case 'adivina':
          return <AdivinaJuego continentCountries={c} onBack={back} />;
        case 'parejas':
          return <ParejasJuego continentCountries={c} onBack={back} />;
        case 'rasca':
          return <RascaJuego continentCountries={c} onBack={back} />;
        case 'intruso':
          return <IntrusoJuego continentCountries={c} onBack={back} />;
        case 'lluvia':
          return <LluviaJuego continentCountries={c} onBack={back} />;
      }
    }
  }
}