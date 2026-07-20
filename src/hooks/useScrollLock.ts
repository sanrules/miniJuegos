import { useEffect } from 'react';

export function useScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Bloquear scroll en documentElement y body
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.height = '100dvh';
    
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.height = '100dvh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';

    // Prevenir gestos de zoom y scroll
    const handleWheel = (e: WheelEvent) => e.preventDefault();
    const handleTouchMove = (e: TouchEvent) => e.preventDefault();
    const handleGesture = (e: Event) => e.preventDefault();

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('gesturestart', handleGesture, { passive: false });

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';

      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('gesturestart', handleGesture);
    };
  }, [enabled]);
}
