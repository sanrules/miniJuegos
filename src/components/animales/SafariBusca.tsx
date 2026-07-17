import confetti from 'canvas-confetti';
import {AnimatePresence, motion} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
import {animals, type Habitat, habitatEmojis, habitatNames} from '../../data/animals.ts';
import {useSpeech} from '../../hooks/useSpeech.ts';
import {playAnimalSound} from '../../utils/animalAudio.ts';
import {BackButton} from '../comunes/BackButton.tsx';

interface SafariBuscaProps {
    onBack: () => void;
}

const GAME_HABITATS: Habitat[] = ['jungle', 'ocean', 'farm', 'forest', 'savanna'];
const ROUNDS_TOTAL = 5;

const gradientMap: Record<Habitat, string> = {
    jungle:  'from-green-600 via-emerald-500 to-lime-400',
    ocean:   'from-blue-800 via-blue-500 to-sky-400',
    farm:    'from-amber-300 via-yellow-200 to-green-300',
    forest:  'from-green-700 via-green-500 to-teal-300',
    savanna: 'from-orange-400 via-yellow-300 to-amber-200',
};

function randomPosition(): { top: string; left: string } {
    return {
        top:  `${20 + Math.random() * 50}%`,
        left: `${5 + Math.random() * 75}%`,
    };
}

export function SafariBusca({onBack}: SafariBuscaProps) {
    const {speak} = useSpeech();
    const [habitat, setHabitat] = useState<Habitat | null>(null);
    const [target, setTarget] = useState<typeof animals[number] | null>(null);
    const [roundAnimals, setRoundAnimals] = useState<
        Array<typeof animals[number] & { pos: { top: string; left: string } }>
    >([]);
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const [shaking, setShaking] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [finished, setFinished] = useState(false);
    const lastTargetRef = useRef<string | null>(null);
    const spokenRef = useRef(false);

    const pool = habitat ? animals.filter(a => a.habitat === habitat) : [];

    const generateRound = useCallback(() => {
        if (pool.length < 2) return;

        const available = pool.filter(a => a.emoji !== lastTargetRef.current);
        const pickPool = available.length > 0 ? available : pool;
        const t = pickPool[Math.floor(Math.random() * pickPool.length)];
        lastTargetRef.current = t.emoji;

        const distractors = pool
            .filter(a => a.emoji !== t.emoji)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        const all = [t, ...distractors].sort(() => Math.random() - 0.5);
        setTarget(t);
        setRoundAnimals(all.map(a => ({...a, pos: randomPosition()})));
        setResult(null);
        setShaking(null);
        spokenRef.current = false;
        setRound(r => r + 1);
    }, [pool]);

    useEffect(() => {
        if (habitat) generateRound();
    }, [habitat]);

    useEffect(() => {
        if (!target || spokenRef.current) return;
        spokenRef.current = true;
        const id = setTimeout(() => speak(`¿Dónde está el ${target.name}?`), 600);
        return () => clearTimeout(id);
    }, [target, speak]);

    const handleTap = useCallback(
        (animal: typeof animals[number]) => {
            if (result || !target) return;
            if (animal.emoji === target.emoji) {
                setResult('correct');
                setScore(s => s + 10);
                playAnimalSound(animal.soundType);
                confetti({particleCount: 40, spread: 60, origin: {y: 0.5}});
                setTimeout(() => speak(`¡Muy bien! ¡${target.name}!`), 200);
                setTimeout(() => {
                    if (round >= ROUNDS_TOTAL) {
                        setFinished(true);
                    } else {
                        generateRound();
                    }
                }, 1500);
            } else {
                setShaking(animal.emoji);
                playAnimalSound(animal.soundType);
                setTimeout(() => {
                    setShaking(null);
                    speak(`Busca al ${target.name}`);
                }, 700);
            }
        },
        [result, target, speak, generateRound, round],
    );

    if (!habitat) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 py-6 px-4">
                <div className="max-w-md mx-auto mb-6">
                    <BackButton onClick={onBack}/>
                </div>
                <main className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <h2 className="text-2xl font-bold text-gray-700 text-center">Elige un hábitat</h2>
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {GAME_HABITATS.map(h => (
                            <button key={h} onClick={() => setHabitat(h)}
                                    className="flex items-center justify-center gap-4 p-8 bg-white/90 rounded-3xl shadow-xl active:scale-95 transition-all border-2 border-transparent hover:border-amber-300">
                                <span className="text-7xl">{habitatEmojis[h]}</span>
                                <span className="text-2xl font-bold text-gray-700">{habitatNames[h]}</span>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (finished) {
        const starCount = Math.min(Math.floor(score / 10), 5);
        return (
            <div
                className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100">
                <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full">
                    <span className="text-7xl block mb-4">🏁</span>
                    <div className="flex gap-2 justify-center mb-6">
                        {Array.from({length: starCount || 1}).map((_, i) => (
                            <span key={i} className="text-3xl">⭐</span>
                        ))}
                    </div>
                    <p className="text-xl font-bold text-gray-700 mb-4">¡Bien hecho!</p>
                    <button onClick={() => {
                        setHabitat(null);
                        setFinished(false);
                        setScore(0);
                        setRound(0);
                    }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-amber-600 active:scale-95 transition-all">
                        <span className="text-xl">🔄</span><span>Otra vez</span>
                    </button>
                </div>
            </div>
        );
    }

    const starCount = Math.min(Math.floor(score / 10), 5);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${gradientMap[habitat]} relative overflow-hidden`}>
            <div className="absolute top-4 left-4 z-50">
                <BackButton onClick={() => {
                    setHabitat(null);
                    setRound(0);
                    setScore(0);
                    setFinished(false);
                }} className="bg-white/80"/>
            </div>
            <div className="absolute top-4 right-4 z-50 flex gap-1">
                {Array.from({length: starCount}).map((_, i) => (
                    <span key={i} className="text-2xl">⭐</span>
                ))}
                <span className="text-white/70 text-lg font-bold ml-2">{round}/{ROUNDS_TOTAL}</span>
            </div>

            <AnimatePresence mode="wait">
                {target && (
                    <motion.div
                        key={`round-${round}`}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="absolute inset-0"
                    >
                        {roundAnimals.map(animal => {
                            const isShaking = shaking === animal.emoji;
                            const isCorrect = result === 'correct' && animal.emoji === target.emoji;
                            return (
                                <motion.button
                                    key={`${round}-${animal.emoji}`}
                                    initial={{scale: 0, opacity: 0}}
                                    animate={
                                        isShaking
                                        ? {x: [0, -10, 10, -8, 8, 0], scale: 1, opacity: 1}
                                        : isCorrect
                                          ? {scale: 1.5, opacity: 0, y: -50}
                                          : {scale: 1, opacity: 1}
                                    }
                                    transition={{duration: isShaking ? 0.35 : isCorrect ? 0.6 : 0.4}}
                                    whileTap={{scale: 1.3}}
                                    onClick={() => handleTap(animal)}
                                    className="absolute z-10 text-7xl md:text-8xl drop-shadow-lg"
                                    style={{top: animal.pos.top, left: animal.pos.left}}
                                >
                                    {animal.emoji}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
