import { useEffect, useRef } from 'react';
import { unlock } from './achievements.js';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

// Page-wide eggs: konami code and reaching the bottom.
export function useEasterEggs(onKonami) {
  const konamiRef = useRef(onKonami);
  useEffect(() => { konamiRef.current = onKonami; });

  useEffect(() => {
    let seq = 0;
    const onKey = e => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') { seq = 0; return; }
      const k = e.key.toLowerCase();
      seq = k === KONAMI[seq] ? seq + 1 : k === KONAMI[0] ? 1 : 0;
      if (seq === KONAMI.length) { seq = 0; unlock('konami'); konamiRef.current(); }
    };
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) unlock('eof');
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
