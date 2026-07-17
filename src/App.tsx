import { useState } from 'react';
import { countries, type Country, type Continent, continentNames } from './data/countries';
import { useSpeech } from './hooks/useSpeech';
import { MapSelection } from './components/MapSelection';

function FlagCard({ country, onPress, isSpeaking }: { country: Country; onPress: () => void; isSpeaking?: boolean }) {
  const flagUrl = `https://flagcdn.com/${country.code.toLowerCase()}.svg`;

  return (
    <button
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }}
      className={`
        relative aspect-square min-h-[120px] md:min-h-[160px]
        bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300
        border-4 border-transparent hover:border-blue-300
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
        flex flex-col items-center justify-center p-4
        ${isSpeaking ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
      `}
      aria-label={`Bandera de ${country.name}. Toca para escuchar.`}
      aria-pressed={isSpeaking}
    >
      <img
        src={flagUrl}
        alt=""
        className="aspect-video w-32 object-cover rounded-lg shadow-md"
        loading="lazy"
      />
      <span className="mt-3 text-lg md:text-xl font-bold text-gray-800 text-center px-2">
        {country.name}
      </span>
    </button>
  );
}

function GameScreen({ continent, onBack }: { continent: Continent; onBack: () => void }) {
  const { speak } = useSpeech();
  const filteredCountries = countries.filter(c => c.continent === continent);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakWithState = (text: string) => {
    setIsSpeaking(true);
    speak(text);
    setTimeout(() => setIsSpeaking(false), 1500);
  };

  const generateRound = () => {
    if (filteredCountries.length === 0) return;
    
    const country = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    setCurrentCountry(country);

    const otherCountries = filteredCountries.filter(c => c.code !== country.code);
    const shuffled = [...otherCountries].sort(() => Math.random() - 0.5);
    const selectedOptions = [country, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5);
    setOptions(selectedOptions);

    speakWithState(`¡Esta es la bandera de ${country.name}!`);
  };

  const handleOptionPress = (selected: Country) => {
    const correct = selected.code === currentCountry?.code;

    if (correct) {
      setScore(s => s + 10);
      setMessage(`¡Correcto! Era ${currentCountry?.name}!`);
    } else {
      setMessage(`¡Ups! Era ${currentCountry?.name}. La tuya era ${selected.name}.`);
    }
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      setRound(r => r + 1);
      generateRound();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-6 px-4">
      <header className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          aria-label="Volver al mapa"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex-1 text-center">
          {continentNames[continent]}
        </h1>
        <div className="w-12" />
      </header>

      <main className="max-w-5xl mx-auto">
        {currentCountry && (
          <div className="mb-6 text-center">
            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
              ¿Cuál es la bandera de <span className="text-blue-600">{currentCountry.name}</span>?
            </p>
            <FlagCard
              country={currentCountry}
              onPress={() => speakWithState(`¡Esta es la bandera de ${currentCountry.name}!`)}
              isSpeaking={isSpeaking}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6" role="list" aria-label="Opciones de banderas">
          {options.map((country) => (
            <FlagCard
              key={country.code}
              country={country}
              onPress={() => handleOptionPress(country)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
          <span>Ronda: {round}</span>
          <span>Puntuación: {score}</span>
        </div>

        {showMessage && message && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-lg font-medium shadow-xl animate-bounce-in z-50"
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);

  if (!selectedContinent) {
    return (
      <MapSelection
        onSelectContinent={(continent) => setSelectedContinent(continent)}
      />
    );
  }

  return (
    <GameScreen
      continent={selectedContinent}
      onBack={() => setSelectedContinent(null)}
    />
  );
}