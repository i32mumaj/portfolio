import { useEffect, useState } from 'react';
import { ACHIEVEMENTS, FINAL, unlockedCount } from '../lib/achievements.js';

const mono = "'Geist Mono',monospace";

export function AchievementToasts({ lang, lift }) {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const timers = [];
    const onUnlock = e => {
      const key = Date.now() + Math.random();
      setToasts(t => [...t, { key, id: e.detail.id, n: unlockedCount() }]);
      timers.push(setTimeout(() => setToasts(t => t.filter(x => x.key !== key)), e.detail.id === FINAL.id ? 9000 : 5000));
    };
    window.addEventListener('jm-achievement', onUnlock);
    return () => { window.removeEventListener('jm-achievement', onUnlock); timers.forEach(clearTimeout); };
  }, []);

  const L = lang === 'en' ? 'en' : 'es';
  return (
    <div style={{ position: 'fixed', right: 16, bottom: lift ? 60 : 16, zIndex: 127, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none', maxWidth: 'calc(100vw - 32px)' }}>
      {toasts.map(({ key, id, n }) => {
        const final = id === FINAL.id, a = final ? FINAL : ACHIEVEMENTS.find(x => x.id === id);
        if (!a) return null;
        const [title, desc] = a[L];
        return (
          <div key={key} style={{ background: final ? '#c6f24e' : '#0b0c0a', color: final ? '#0b0c0a' : '#f3efe6', border: '2px solid #c6f24e', boxShadow: `5px 5px 0 ${final ? '#f3efe6' : '#c6f24e'}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 260, animation: 'jmToastIn .35s cubic-bezier(.2,.8,.2,1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, font: `500 11px/1 ${mono}`, color: final ? '#0b0c0a' : '#c6f24e' }}>
              <span>{L === 'en' ? '🏆 achievement unlocked' : '🏆 logro desbloqueado'}</span>
              <span>{final ? '★' : `${n}/${ACHIEVEMENTS.length}`}</span>
            </div>
            <div style={{ font: "400 28px/1 'Instrument Serif',serif" }}>{title}</div>
            <div style={{ font: `400 12px/1.4 ${mono}`, opacity: 0.75 }}>{desc}</div>
          </div>
        );
      })}
    </div>
  );
}
