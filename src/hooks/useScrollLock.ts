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
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.touchAction = 'auto';
      
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('gesturestart', handleGesture);
    };
  }, [enabled]);
}
