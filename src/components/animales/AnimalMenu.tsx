import { useSpeech } from '../../hooks/useSpeech.ts';
import { BackButton } from '../comunes/BackButton.tsx';

interface AnimalMenuProps {
  onSelectBosque: () => void;
  onSelectSafari: () => void;
  onSelectParejas: () => void;
  onSelectRasca: () => void;
  onSelectIntruso: () => void;
  onBack: () => void;
}

const games = [
  { id: 'bosque', icon: '🌿', title: 'Bosque de los Sonidos', desc: 'Toca y escucha los animales', action: 'onSelectBosque' as const },
  { id: 'safari', icon: '🐾', title: 'Safari: Busca, Busca', desc: 'Encuentra al animal que te piden', action: 'onSelectSafari' as const },
  { id: 'parejas', icon: '🃏', title: 'Parejas Animales', desc: 'Encuentra las parejas de animales', action: 'onSelectParejas' as const },
  { id: 'rasca', icon: '✋', title: 'Rasca Animales', desc: 'Descubre el animal oculto', action: 'onSelectRasca' as const },
  { id: 'intruso', icon: '🕵️', title: 'Intruso Animal', desc: 'Encuentra el animal diferente', action: 'onSelectIntruso' as const },
];

export function AnimalMenu({ onSelectBosque, onSelectSafari, onSelectParejas, onSelectRasca, onSelectIntruso, onBack }: AnimalMenuProps) {
  const { speak } = useSpeech();

  const handlers: Record<string, () => void> = {
    onSelectBosque, onSelectSafari, onSelectParejas, onSelectRasca, onSelectIntruso,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 py-6 px-4">
      <div className="max-w-md mx-auto mb-6">
        <BackButton onClick={onBack} />
      </div>
      <main className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Elige un juego</h2>
        {games.map(game => (
          <button key={game.id} onClick={() => { speechSynthesis.cancel(); speak(`¡${game.title}!`); handlers[game.action](); }}
            className="w-full flex items-center gap-4 p-6 bg-white/90 rounded-3xl shadow-xl active:scale-95 transition-all border-2 border-transparent hover:border-emerald-300">
            <span className="text-6xl">{game.icon}</span>
            <div className="text-left">
              <span className="text-xl font-bold text-gray-700 block">{game.title}</span>
              <span className="text-sm text-gray-500">{game.desc}</span>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}
