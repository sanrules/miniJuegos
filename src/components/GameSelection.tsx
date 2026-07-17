import type { Continent } from '../data/countries';
import { continentNames, continentAnimals } from '../data/countries';
import { useSpeech } from '../hooks/useSpeech';

export type GameId = 'adivina' | 'parejas' | 'rasca' | 'intruso' | 'lluvia';

interface GameSelectionProps {
  continent: Continent;
  onSelectGame: (game: GameId) => void;
  onBack: () => void;
}

const games: { id: GameId; icon: string; name: string; desc: string; color: string; hoverBorder: string }[] = [
  { id: 'adivina', icon: '🏳️', name: 'Adivina la Bandera', desc: 'Elige la bandera correcta', color: 'hover:border-indigo-200 focus:ring-indigo-300', hoverBorder: '' },
  { id: 'parejas', icon: '🃏', name: 'Hacer Parejas', desc: 'Encuentra las banderas iguales', color: 'hover:border-green-200 focus:ring-green-300', hoverBorder: '' },
  { id: 'rasca', icon: '✋', name: 'Rasca y Descubre', desc: 'Rasca para revelar la bandera', color: 'hover:border-amber-200 focus:ring-amber-300', hoverBorder: '' },
  { id: 'intruso', icon: '🕵️', name: 'El Intruso', desc: 'Encuentra la diferente', color: 'hover:border-rose-200 focus:ring-rose-300', hoverBorder: '' },
  { id: 'lluvia', icon: '🌧️', name: 'Lluvia de Banderas', desc: 'Atrapa las que caen', color: 'hover:border-cyan-200 focus:ring-cyan-300', hoverBorder: '' },
];

export function GameSelection({ continent, onSelectGame, onBack }: GameSelectionProps) {
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all" aria-label="Volver">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">
          <span className="mr-2">{continentAnimals[continent]}</span>
          {continentNames[continent]}
        </h1>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto mt-8">
        <p className="text-center text-xl text-gray-600 mb-8">¿A qué quieres jugar?</p>

        <div className="flex flex-col gap-4">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => {
                speak(`¡${game.name}!`);
                onSelectGame(game.id);
              }}
              className={`flex items-center gap-5 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all border-2 border-transparent ${game.color} focus:outline-none focus:ring-4`}
            >
              <span className="text-4xl md:text-5xl">{game.icon}</span>
              <div className="text-left flex-1">
                <span className="text-lg md:text-xl font-bold text-gray-800">{game.name}</span>
                <p className="text-sm text-gray-500 mt-0.5">{game.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}