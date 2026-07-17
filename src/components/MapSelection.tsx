import { useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { continents, type Continent, continentNames, continentAnimals, continentColors } from '../data/countries';
import { BackButton } from './BackButton';

interface MapSelectionProps {
  onSelectContinent: (continent: Continent) => void;
  onBack: () => void;
}

export function MapSelection({ onSelectContinent, onBack }: MapSelectionProps) {
  const { speak } = useSpeech();

  const handlePress = useCallback((continent: Continent) => {
    speak(`¡${continentNames[continent]}!`);
    onSelectContinent(continent);
  }, [speak, onSelectContinent]);

  const handleHover = useCallback((continent: Continent) => {
    speak(continentNames[continent]);
  }, [speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <header className="max-w-5xl mx-auto mb-6">
        <BackButton onClick={onBack} />
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