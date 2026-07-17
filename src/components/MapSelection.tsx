import { useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { continents, type Continent, continentNames, continentAnimals, continentColors, countries } from '../data/countries';

interface MapSelectionProps {
  onSelectContinent: (continent: Continent) => void;
}

export function MapSelection({ onSelectContinent }: MapSelectionProps) {
  const { speak, isSupported } = useSpeech();

  const handlePress = useCallback((continent: Continent) => {
    speak(`¡${continentNames[continent]}!`);
    onSelectContinent(continent);
  }, [speak, onSelectContinent]);

  const handleHover = useCallback((continent: Continent) => {
    speak(continentNames[continent]);
  }, [speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          🗺️ Elige tu Continente
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Toca o pasa el ratón por encima para escuchar el nombre
        </p>
        {!isSupported && (
          <p className="mt-4 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg inline-block text-sm">
            ⚠️ Tu navegador no soporta síntesis de voz. Prueba con Chrome, Edge o Safari.
          </p>
        )}
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {continents.map((continent) => (
            <ContinentCard
              key={continent}
              continent={continent}
              onPress={() => handlePress(continent)}
              onHover={() => handleHover(continent)}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>5 continentes · {countries.length} países por descubrir</p>
        </div>
      </main>
    </div>
  );
}

function ContinentCard({
  continent,
  onPress,
  onHover,
}: {
  continent: Continent;
  onPress: () => void;
  onHover: () => void;
}) {
  const animal = continentAnimals[continent];
  const gradientClass = continentColors[continent];

  return (
    <button
      onClick={onPress}
      onMouseEnter={onHover}
      onFocus={onHover}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }}
      className={`
        relative aspect-square min-h-[140px] md:min-h-[180px]
        rounded-3xl shadow-xl
        transition-all duration-300 ease-out
        border-4 border-transparent
        focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2
        flex flex-col items-center justify-center p-6
        bg-gradient-to-br ${gradientClass}
        hover:scale-105 hover:shadow-2xl
      `}
      aria-label={continentNames[continent]}
    >
      <span className="text-6xl md:text-8xl lg:text-9xl filter drop-shadow-lg" aria-hidden="true">
        {animal}
      </span>
      <span className="mt-4 text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
        {continentNames[continent]}
      </span>
    </button>
  );
}