
import { useEffect } from 'react';

export function useHotkeys(key: string, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Parse the key combination
      const isCtrl = key.toLowerCase().includes('ctrl');
      const keyWithoutModifiers = key.toLowerCase().replace('ctrl+', '');
      
      if (isCtrl && event.ctrlKey && event.key.toLowerCase() === keyWithoutModifiers) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
}
