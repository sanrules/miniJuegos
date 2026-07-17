import {useRef} from 'react';
import {type Level, levelBackgrounds, levelEmojis, levelGreetings, levelNames} from '../data/countries';
import {useSpeech} from '../hooks/useSpeech';
import { BackButton } from './BackButton';

interface LevelSelectionProps {
    onSelect: (level: Level) => void;
    onBack: () => void;
}

const levels: Level[] = ['explorer', 'continents', 'world', 'expert'];

export function LevelSelection({onSelect, onBack}: LevelSelectionProps) {
    const {speak} = useSpeech();
    const navigatingRef = useRef(false);

    return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <BackButton onClick={onBack} />
      </div>
      <main className="max-w-lg mx-auto w-full">
                <div className="grid grid-cols-1 gap-5">
                    {levels.map(level => (
                        <button
                            key={level}
                            onClick={() => {
                                if (navigatingRef.current) return;
                                navigatingRef.current = true;
                                speak(levelGreetings[level]);
                                setTimeout(() => onSelect(level), 800);
                            }}
                            className={`
                relative w-full aspect-[3/1] min-h-[120px]
                rounded-3xl shadow-xl
                transition-all duration-300 ease-out
                border-4 border-white/60
                focus:outline-none focus:ring-4 focus:ring-yellow-300
                flex flex-col items-center justify-center gap-2
                bg-gradient-to-br ${levelBackgrounds[level]}
                hover:scale-[1.03] hover:shadow-2xl active:scale-[0.97]
              `}
                        >
              <span className="text-7xl md:text-8xl filter drop-shadow-lg">
                {levelEmojis[level]}
              </span>
                            <span className="text-xl font-bold text-white drop-shadow-lg">
                {levelNames[level]}
              </span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}