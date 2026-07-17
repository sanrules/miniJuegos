import type { Continent, Level } from '../data/countries';
import { continentNames, continentAnimals, levelEmojis, levelNames } from '../data/countries';
export type GameId = 'adivina' | 'parejas' | 'rasca' | 'intruso' | 'lluvia';

interface GameSelectionProps {
  level: Level;
  continent: Continent | null;
  onSelectGame: (game: GameId) => void;
  onBack: () => void;
}

const games: { id: GameId; icon: string; color: string }[] = [
  { id: 'adivina', icon: '🏳️', color: 'hover:border-indigo-200 focus:ring-indigo-300' },
  { id: 'parejas', icon: '🃏', color: 'hover:border-green-200 focus:ring-green-300' },
  { id: 'rasca', icon: '✋', color: 'hover:border-amber-200 focus:ring-amber-300' },
  { id: 'intruso', icon: '🕵️', color: 'hover:border-rose-200 focus:ring-rose-300' },
  { id: 'lluvia', icon: '🌧️', color: 'hover:border-cyan-200 focus:ring-cyan-300' },
];

export function GameSelection({ level, continent, onSelectGame, onBack }: GameSelectionProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 px-4">
      <header className="max-w-3xl mx-auto mb-6 flex items-center">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-3xl"
          aria-label="Atrás"
        >
          ⬅️
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">
          <span className="mr-2">{levelEmojis[level]}</span>
          {levelNames[level]}
          {continent && <><span className="mx-2">·</span>{continentAnimals[continent]} {continentNames[continent]}</>}
        </h1>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto mt-8">
        <div className="flex flex-col gap-4">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => { onSelectGame(game.id); }}
              className={`flex items-center justify-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.97] transition-all border-2 border-transparent ${game.color} focus:outline-none focus:ring-4`}
            >
              <span className="text-6xl md:text-7xl">{game.icon}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}