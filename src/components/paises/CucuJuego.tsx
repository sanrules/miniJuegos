import confetti from 'canvas-confetti';
import {AnimatePresence, motion} from 'framer-motion';
import {useCallback, useEffect, useState} from 'react';
import type {Country} from '../../data/countries.ts';
import {useAdaptiveLearning} from '../../hooks/useAdaptiveLearning.ts';
import {useSpeech} from '../../hooks/useSpeech.ts';
import type {GameProps} from '../../utils/game.ts';
import {FLAG_BASE, handleFlagError} from '../../utils/game.ts';
import {BackButton} from '../comunes/BackButton';
import { useScrollLock } from '../../hooks/useScrollLock.ts';

interface Spot {
    emoji: string;
    label: string;
}

const spots: Spot[] = [
    {emoji: '🌳', label: 'árbol'},
    {emoji: '☁️', label: 'nube'},
    {emoji: '🪨', label: 'roca'},
];

const surprises = ['🐦', '🐿️', '🦊', '🐸', '🦋'];

export function CucuJuego({poolCountries, onBack, onFinish}: GameProps) {
    const {speak} = useSpeech();
    const {getRandomCountry} = useAdaptiveLearning(poolCountries);
    useScrollLock(true);

    function shuffleSpots(): Spot[] {
        return [...spots].sort(() => Math.random() - 0.5);
    }

    const [roundSpots, setRoundSpots] = useState<Spot[]>(() => shuffleSpots());
    const [target, setTarget] = useState<Country | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [shakingIndex, setShakingIndex] = useState<number | null>(null);
    const [surpriseEmoji, setSurpriseEmoji] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [flagFlying, setFlagFlying] = useState(false);

    const generateRound = useCallback(() => {
        const t = getRandomCountry(poolCountries);
        if (!t) return;
        setTarget(t);
        setRoundSpots(shuffleSpots());
        setRevealed(false);
        setShakingIndex(null);
        setSurpriseEmoji(null);
        setFlagFlying(false);
        setTimeout(() => speak('¿Dónde se esconde la bandera? ¡Búscala!'), 600);
    }, [poolCountries, getRandomCountry, speak]);

    useEffect(() => { generateRound(); }, []);

    const handleTap = useCallback((index: number) => {
        if (revealed || !target) return;
        if (index === 0) {
            setRevealed(true);
            setFlagFlying(true);
            setScore(s => s + 10);
            confetti({particleCount: 40, spread: 60, origin: {y: 0.5}});
            setTimeout(() => speak(`¡Muy bien! ¡Cucú! ¡${target.name}!`), 500);
            setTimeout(() => { generateRound(); }, 3000);
        } else {
            setShakingIndex(index);
            setSurpriseEmoji(surprises[Math.floor(Math.random() * surprises.length)]);
            setTimeout(() => {
                setShakingIndex(null);
                setSurpriseEmoji(null);
            }, 800);
        }
    }, [revealed, target, speak, generateRound]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 px-4">
            <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BackButton onClick={onBack}/>
                    <button onClick={() => onFinish?.(score)}
                            className="flex items-center gap-1.5 px-3 py-3 bg-white rounded-xl shadow-md active:scale-95 transition-all"
                            aria-label="Terminar"><span className="text-xl">🏁</span><span
                        className="text-sm font-bold text-gray-600">Terminar</span></button>
                </div>
            </header>

            <main className="max-w-lg mx-auto min-h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {target && !revealed && (
                        <motion.div key="hiding" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                    className="grid grid-cols-3 gap-4 w-full">
                            {roundSpots.map((spot, i) => {
                                const isShaking = shakingIndex === i;
                                const isCorrectSpot = i === 0;
                                return (
                                    <motion.button key={`${target.code}-${i}`} onClick={() => handleTap(i)}
                                                   animate={isShaking ? {
                                                       x:      [0, -12, 12, -8, 8, 0],
                                                       rotate: [0, -8, 8, -5, 5, 0]
                                                   } : {}}
                                                   transition={{duration: 0.35}}
                                                   className={`relative flex flex-col items-center justify-center aspect-square rounded-3xl bg-white shadow-lg border-4 overflow-hidden
                      ${isShaking ? 'border-red-300' : 'border-transparent hover:border-emerald-300'} active:scale-95 transition-colors`}>
                                        {isCorrectSpot && (
                                            <div
                                                className="absolute inset-0 flex items-start justify-end overflow-hidden p-1">
                                                <img src={`${FLAG_BASE}/${target.code.toLowerCase()}.svg`} alt=""
                                                     onError={handleFlagError}
                                                     className="w-1/3 h-1/3 object-contain -mr-2 -mt-2 opacity-80"
                                                     draggable={false}/>
                                            </div>
                                        )}
                                        <span className="text-6xl md:text-7xl relative z-10">{spot.emoji}</span>
                                        <AnimatePresence>
                                            {isShaking && surpriseEmoji && (
                                                <motion.span key="s" initial={{scale: 0, y: 10}}
                                                             animate={{scale: 1, y: -15}} exit={{scale: 0}}
                                                             className="absolute -top-2 text-3xl z-20">{surpriseEmoji}</motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}

                    {target && revealed && (
                        <motion.div key="revealed" initial={{scale: 0}} animate={{scale: 1}}
                                    transition={{type: 'spring', stiffness: 150, damping: 12}}
                                    className="flex flex-col items-center gap-6 w-full">
                            <motion.div initial={{y: -200, opacity: 0}} animate={{y: 0, opacity: 1}}
                                        transition={{delay: 0.2}}
                                        className="flex gap-3">
                                {roundSpots.map((spot, i) => (
                                    <motion.span key={i}
                                                 animate={i === 0 && flagFlying ? {
                                                     y:       -300,
                                                     opacity: 0,
                                                     rotate:  30
                                                 } : {}}
                                                 transition={{duration: 0.6, ease: 'easeIn'}}
                                                 className="text-4xl">{spot.emoji}</motion.span>
                                ))}
                            </motion.div>
                            <motion.img initial={{scale: 0, rotate: -180}} animate={{scale: 1, rotate: 0}}
                                        transition={{type: 'spring', stiffness: 120, damping: 10, delay: 0.4}}
                                        src={`${FLAG_BASE}/${target.code.toLowerCase()}.svg`} alt=""
                                        onError={handleFlagError}
                                        className="w-56 h-40 object-contain drop-shadow-xl rounded-2xl bg-white p-3 shadow-xl"
                                        draggable={false}/>
                            <motion.span initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                                         transition={{delay: 0.7}}
                                         className="text-3xl font-bold text-gray-700">{target.name}</motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
