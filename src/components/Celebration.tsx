import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/audio';

interface CelebrationProps {
  score: number;
  gameName: string;
  onContinue: () => void;
}

export function Celebration({ score, gameName, onContinue }: CelebrationProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    playSuccessSound();

    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF69B4'],
    });

    requestAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative overflow-hidden"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-8xl mb-4"
          >
            🌟
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            ¡Felicidades!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-1"
          >
            Has jugado a <span className="font-semibold text-gray-700">{gameName}</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
            className="text-5xl font-bold text-yellow-500 my-4"
          >
            {score} pts
          </motion.p>

          <motion.div
            className="flex gap-2 justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {Array.from({ length: Math.min(Math.floor(score / 10) + 1, 5) }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: 'spring' }}
                className="text-3xl"
              >
                ⭐
              </motion.span>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            ¡Seguir jugando!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}