import { useEffect } from 'react';
import { unlock } from './achievements.js';

// Page-wide eggs: reaching the bottom.
export function useEasterEggs() {
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) unlock('eof');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
