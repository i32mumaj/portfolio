import { useEffect, useRef } from 'react';
import { unlock } from './achievements.js';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

// Page-wide eggs: konami code, tab switch and reaching the bottom.
export function useEasterEggs(lang, onKonami) {
  const langRef = useRef(lang);
  const konamiRef = useRef(onKonami);
  useEffect(() => { langRef.current = lang; konamiRef.current = onKonami; });

  useEffect(() => {
    let seq = 0, title = document.title, away = false, titleT;
    const onKey = e => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') { seq = 0; return; }
      const k = e.key.toLowerCase();
      seq = k === KONAMI[seq] ? seq + 1 : k === KONAMI[0] ? 1 : 0;
      if (seq === KONAMI.length) { seq = 0; unlock('konami'); konamiRef.current(); }
    };
    const onVis = () => {
      if (document.hidden) {
        clearTimeout(titleT);
        if (!away) title = document.title;
        away = true;
        document.title = langRef.current === 'en' ? 'SIGSTOP · come back soon' : 'SIGSTOP · vuelve pronto';
      } else if (away) {
        away = false;
        document.title = 'SIGCONT ▶';
        unlock('sigstop');
        titleT = setTimeout(() => { document.title = title; }, 1500);
      }
    };
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) unlock('eof');
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(titleT);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
