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

const DUMP = ['7ffd3a00  4a 4f 52 47 45 20 4d 55  c3 91 49 5a 00 00 00 00', '7ffd3a10  de ad be ef 00 00 00 00  ff ff ff ff ff ff ff ff', '7ffd3a20  00 00 00 00 00 00 00 00  ?? ?? ?? ?? ?? ?? ?? ??'];

const CORRUPT_MS = 15000;

// Fake crash: colours go wrong and the page keeps working for a while, glitching harder
// until it segfaults, dumps core and "reboots".
export function Segfault({ lang, onDone }) {
  const [ph, setPh] = useState(0);
  const [fx, setFx] = useState({ k: 0, bars: [], jit: 0 });
  useEffect(() => {
    const html = document.documentElement, base = html.style.filter, t0 = performance.now();
    const iv = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / CORRUPT_MS), t = performance.now() / 1000;
      const flash = Math.random() < k * k * 0.25;
      html.style.filter = `${base} hue-rotate(${150 + 50 * Math.sin(t * 1.3)}deg) saturate(${1.4 + k * 1.6})${flash ? ' invert(1)' : ''}`;
      const n = Math.random() < 0.15 + k * 0.7 ? Math.ceil(k * 7 * Math.random()) : 0;
      setFx({ k, jit: (Math.random() - 0.5) * 6 * k, bars: Array.from({ length: n }, () => ({ y: Math.random() * 100, h: 0.4 + Math.random() * (1 + k * 7), x: (Math.random() - 0.5) * 40 * k, inv: Math.random() < 0.5 })) });
    }, 90);
    const ts = [
      setTimeout(() => { clearInterval(iv); html.style.filter = base; setPh(1); }, CORRUPT_MS),
      setTimeout(() => setPh(2), CORRUPT_MS + 2200),
      setTimeout(onDone, CORRUPT_MS + 3200),
    ];
    return () => { clearInterval(iv); ts.forEach(clearTimeout); html.style.filter = base; };
  }, [onDone]);

  if (ph === 0) {
    const pct = Math.round(fx.k * 100);
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 140, pointerEvents: 'none' }}>
        {fx.bars.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${b.y}%`, height: `${b.h}%`, transform: `translateX(${b.x}px)`, backdropFilter: b.inv ? 'invert(1)' : 'hue-rotate(90deg) saturate(3)', background: b.inv ? 'transparent' : 'rgba(255,0,170,.12)' }} />
        ))}
        <div style={{ position: 'absolute', left: 16, bottom: 16, background: '#0b0c0a', border: '1px solid #ff8a6a', color: '#ff8a6a', padding: '8px 10px', font: `500 12px/1.4 ${mono}`, transform: `translateX(${fx.jit}px)` }}>
          {lang === 'en' ? 'heap corruption detected' : 'corrupción de memoria detectada'} · {pct}%
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 140, background: '#000', color: '#c6f24e', padding: '10vh 6vw', display: 'flex', flexDirection: 'column', gap: 10, font: `400 clamp(13px,1.3vw,17px)/1.6 ${mono}` }}>
      <div style={{ color: '#ff8a6a', font: "400 clamp(30px,4vw,56px)/1 'VT323',monospace" }}>Segmentation fault (core dumped)</div>
      <div style={{ opacity: 0.6 }}>jorge.dev[4242]: segfault at 0 ip 00005591a3c2 sp 00007ffd3a00 error 6</div>
      {DUMP.map(l => <div key={l} style={{ opacity: 0.8 }}>{l}</div>)}
      {ph === 2 && <div style={{ marginTop: 16 }}>{lang === 'en' ? 'rebooting jorge.dev…' : 'reiniciando jorge.dev…'}<span style={{ animation: 'jmBlink 1s steps(1) infinite' }}>▌</span></div>}
    </div>
  );
}
