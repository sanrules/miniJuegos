import { useSpeech } from '../hooks/useSpeech';
import { motion } from 'framer-motion';

interface WorldSelectorProps {
  onSelectFlags: () => void;
  onSelectAnimals: () => void;
  onSelectAtlas: () => void;
}

export function WorldSelector({ onSelectFlags, onSelectAnimals, onSelectAtlas }: WorldSelectorProps) {
  const { speak } = useSpeech();

  const handleFlags = () => {
    speechSynthesis.cancel();
    speak('¡Mundo Banderas! ¡Vamos a viajar!');
    onSelectFlags();
  };

  const handleAnimals = () => {
    speechSynthesis.cancel();
    speak('¡Mundo Animales! ¡A jugar con los animales!');
    onSelectAnimals();
  };

  const handleAtlas = () => {
    speechSynthesis.cancel();
    speak('🗺️ Atlas');
    onSelectAtlas();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative">
      <button onClick={handleFlags}
        className="bg-gradient-to-br from-blue-400 via-sky-400 to-indigo-500 flex flex-col items-center justify-center p-8 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        <motion.span
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl md:text-9xl mb-6"
        >
          🌍
        </motion.span>
        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
          Mundo Banderas
        </span>
        <span className="text-white/70 text-lg md:text-xl mt-2 text-center">
          ¡Aprende banderas!
        </span>
      </button>

      <button onClick={handleAnimals}
        className="bg-gradient-to-br from-emerald-400 via-green-400 to-green-600 flex flex-col items-center justify-center p-8 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        <motion.span
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl md:text-9xl mb-6"
        >
          🦁
        </motion.span>
        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
          Mundo Animales
        </span>
        <span className="text-white/70 text-lg md:text-xl mt-2 text-center">
          ¡Descubre animales!
        </span>
      </button>

      <div className="absolute top-4 right-4 z-10">
        <button onClick={handleAtlas}
          className="p-3 bg-white/90 rounded-xl shadow-md backdrop-blur-sm active:scale-95 transition-all text-2xl"
          aria-label="Atlas"
        >
          🗺️
        </button>
      </div>
    </div>
  );
}
