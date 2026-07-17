import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { animals, type Habitat, habitatNames, habitatEmojis } from '../../data/animals.ts';
import { playAnimalSound } from '../../utils/animalAudio.ts';
import { BackButton } from '../comunes/BackButton.tsx';
interface BosqueSonidosProps {
  onBack: () => void;
}

const GAME_HABITATS: Habitat[] = ['jungle', 'ocean', 'farm', 'forest', 'savanna'];

const gradientMap: Record<Habitat, string> = {
  jungle: 'from-green-600 via-emerald-500 to-lime-400',
  ocean: 'from-blue-800 via-blue-500 to-sky-400',
  farm: 'from-amber-300 via-yellow-200 to-green-300',
  forest: 'from-green-700 via-green-500 to-teal-300',
  savanna: 'from-orange-400 via-yellow-300 to-amber-200',
};

function randomPosition(): { top: string; left: string } {
  return {
    top: `${15 + Math.random() * 55}%`,
    left: `${5 + Math.random() * 75}%`,
  };
}

export function BosqueSonidos({ onBack }: BosqueSonidosProps) {
  const { speak } = useSpeech();
  const [habitat, setHabitat] = useState<Habitat | null>(null);

  const positionedAnimals = useMemo(() => {
    if (!habitat) return [];
    const pool = animals.filter(a => a.habitat === habitat);
    return pool.map(a => ({ ...a, pos: randomPosition() }));
  }, [habitat]);

  if (!habitat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-white py-6 px-4">
        <div className="max-w-md mx-auto mb-6">
          <BackButton onClick={onBack} />
        </div>
        <main className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Elige un hábitat</h2>
          <div className="grid grid-cols-1 gap-4 w-full">
            {GAME_HABITATS.map(h => (
              <button key={h} onClick={() => { setHabitat(h); }}
                className="flex items-center justify-center gap-4 p-8 bg-white/90 rounded-3xl shadow-xl active:scale-95 transition-all border-2 border-transparent hover:border-purple-300">
                <span className="text-7xl">{habitatEmojis[h]}</span>
                <span className="text-2xl font-bold text-gray-700">{habitatNames[h]}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientMap[habitat]} relative overflow-hidden`}>
      <div className="absolute top-4 left-4 z-50">
        <BackButton onClick={() => setHabitat(null)} className="bg-white/80" />
      </div>

      {positionedAnimals.map((animal, i) => (
        <motion.button
          key={animal.emoji}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -8, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 15, delay: i * 0.1 },
            opacity: { delay: i * 0.1 },
            y: {
              repeat: Infinity,
              duration: 2.5 + i * 0.4,
              ease: 'easeInOut',
              delay: i * 0.3,
            },
            rotate: {
              repeat: Infinity,
              duration: 3.5 + i * 0.3,
              ease: 'easeInOut',
            },
          }}
          whileTap={{ scale: 1.5, rotate: [0, -30, 30, -15, 0], transition: { duration: 0.4 } }}
          onClick={() => {
            speechSynthesis.cancel();
            playAnimalSound(animal.soundType);
            speak(animal.name);
          }}
          className="absolute z-10 text-7xl md:text-8xl drop-shadow-lg"
          style={{ top: animal.pos.top, left: animal.pos.left }}
        >
          {animal.emoji}
        </motion.button>
      ))}

      <div className="absolute bottom-8 left-0 right-0 text-center z-50">
        <p className="text-white/60 text-lg font-medium drop-shadow-lg">Toca los animales</p>
      </div>
    </div>
  );
}
