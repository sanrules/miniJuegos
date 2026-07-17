import { useCallback, useRef } from 'react';
import { type Level, levelGreetings } from '../data/countries';

export function useLevelGreeting(level: Level, speak: (text: string) => void) {
  const greetedRef = useRef(false);

  const greet = useCallback((gameText: string) => {
    if (!greetedRef.current) {
      greetedRef.current = true;
      speak(`${levelGreetings[level]} ${gameText}`);
    } else {
      speak(gameText);
    }
  }, [level, speak]);

  return greet;
}