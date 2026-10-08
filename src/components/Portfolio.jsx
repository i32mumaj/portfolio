import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../config.js';
import Hero from './Hero.jsx';
import About from './About.jsx';
import Projects from './Projects.jsx';
import SideProjects from './SideProjects.jsx';
import Stack from './Stack.jsx';
import Contact from './Contact.jsx';
import Terminal from './Terminal.jsx';
import { AchievementToasts, Segfault } from './Easter.jsx';
import { useEasterEggs } from '../lib/useEasterEggs.js';
import { unlock } from '../lib/achievements.js';

const sectionBorder = { position: 'relative', borderTop: '1px solid rgba(198,242,78,.25)' };
const TOTAL = '06';
const SECTIONS = {
  es: { about: 'SOBRE MÍ', projects: 'PROYECTOS', side: 'SIDE QUESTS', stack: 'STACK', contact: 'CONTACTO' },
  en: { about: 'ABOUT ME', projects: 'PROJECTS', side: 'SIDE QUESTS', stack: 'STACK', contact: 'CONTACT' },
};
const ROOT_FILTER = 'grayscale(1) sepia(1) hue-rotate(68deg) saturate(4.5) brightness(1.05)';
const GG = ['01110', '10001', '10000', '10111', '10001', '10001', '01110'];
const HEX = '0123456789ABCDEF';

function SectionHeader({ n, label }) {
  const num = { font: "400 44px/1 'VT323',monospace" };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '56px 5vw 0', color: '#c6f24e' }}>
      <span style={num}>{n}</span>
      <span style={{ font: "600 22px/1 'Geist Mono',monospace", letterSpacing: '.06em' }}>{label}</span>
      <span style={{ flex: 1, height: 3, background: '#c6f24e' }} />
      <span style={{ ...num, opacity: 0.6 }}>{n}/{TOTAL}</span>
    </div>
  );
}

// Hex rain that settles into "GG" spelled with 4s and 7s.
function GGRain() {
  const [gt, setGt] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const iv = setInterval(() => setGt((performance.now() - t0) / 1000), 70);
    return () => clearInterval(iv);
  }, []);
  const cells = [];
  for (let y = 0; y < 7; y++) for (let x = 0; x < 15; x++) {
    const gx = x >= 2 && x <= 6 ? x - 2 : x >= 8 && x <= 12 ? x - 8 : -1, on = gx >= 0 && GG[y][gx] === '1';
    const seed = (x * 31 + y * 17) % 97, lock = 0.8 + (seed / 97) * 2, r = Math.floor((gt * 14 + seed * 3) % 256), locked = on && gt > lock;
    cells.push({ ch: locked ? '47'[(x + y) % 2] : HEX[r >> 4], op: locked ? 1 : on && gt > lock - 0.3 ? 0.7 : gt > 3.4 ? 0.08 : 0.15 + (r % 5) / 20 });
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(11,12,10,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15,1fr)', gap: '4px 0', width: 'min(900px,92vw)', font: "400 clamp(28px,4.4vw,60px)/1 'VT323',monospace", textAlign: 'center', color: '#c6f24e' }}>
        {cells.map((c, i) => <span key={i} style={{ opacity: c.op }}>{c.ch}</span>)}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [lang, setLang] = useState('es');
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const [near, setNear] = useState(false);
  const [idle, setIdle] = useState(true);
  const [y, setY] = useState(0);
  const [tick, setTick] = useState(0);
  const [gg, setGg] = useState(false);
  const [root, setRoot] = useState(false);
  const [toast, setToast] = useState(false);
  const [segv, setSegv] = useState(false);
  const openRef = useRef(open);

  useEffect(() => { openRef.current = open; }, [open]);
  useEasterEggs(() => setSegv(true));
  const endSegv = useCallback(() => setSegv(false), []);

  useEffect(() => {
    const onKey = e => {
      const tag = (e.target && e.target.tagName) || '';
      if ((e.key === 'º' || e.key === '`' || e.key === '~' || e.code === 'Backquote') && !(tag === 'INPUT' && !openRef.current)) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && openRef.current) setOpen(false);
    };
    let idleT;
    const onScroll = () => {
      setY(window.scrollY);
      setIdle(false);
      clearTimeout(idleT);
      idleT = setTimeout(() => setIdle(true), 2000);
    };
    const onMove = e => setNear(e.clientY < 120);
    const blink = setInterval(() => setTick(t => t + 1), 530);
    let ggT, toastT;
    const onWin = () => {
      setOpen(false);
      setGg(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      clearTimeout(ggT);
      ggT = setTimeout(() => {
        setGg(false); setRoot(true); setToast(true);
        document.documentElement.style.filter = ROOT_FILTER;
        clearTimeout(toastT);
        toastT = setTimeout(() => setToast(false), 12000);
      }, 5200);
    };
    const onHire = () => {
      setOpen(false);
      setToast(false);
      const el = document.getElementById('contacto');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    };
    window.addEventListener('jm-snake-win', onWin);
    window.addEventListener('jm-hire', onHire);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      clearInterval(blink);
      clearTimeout(idleT);
      clearTimeout(ggT);
      clearTimeout(toastT);
      window.removeEventListener('jm-snake-win', onWin);
      window.removeEventListener('jm-hire', onHire);
      document.documentElement.style.filter = '';
    };
  }, []);

  const inHero = y < window.innerHeight * 0.9;
  const ext = !inHero && (hov || near || idle);
  const toggle = () => setOpen(o => !o);
  const sec = SECTIONS[lang] || SECTIONS.es;
  const pick = id => { if (id === 'en') unlock('english'); setLang(id); };
  const links = { brevUrl: config.brevUrl, slateUrl: config.slateUrl, latchUrl: config.latchUrl };

  return (
    <div style={{ background: '#0b0c0a' }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 120, display: 'flex', gap: 2, padding: 3, background: '#0b0c0a', border: '1px solid rgba(198,242,78,.4)', font: "500 11px/1 'Geist Mono',monospace" }}>
        {['es', 'en'].map(id => (
          <button key={id} onClick={() => pick(id)} style={{ border: 0, cursor: 'pointer', padding: '7px 9px', background: lang === id ? '#c6f24e' : 'transparent', color: lang === id ? '#0b0c0a' : '#c6f24e', font: 'inherit' }}>
            {id.toUpperCase()}
          </button>
        ))}
      </div>

      <section data-screen-label="Hero" style={{ position: 'relative' }}>
        <Hero lang={lang} />
      </section>
      <section data-screen-label="About" style={sectionBorder}>
        <SectionHeader n="02" label={sec.about} />
        <About lang={lang} />
      </section>
      <section data-screen-label="Projects" style={sectionBorder}>
        <SectionHeader n="03" label={sec.projects} />
        <Projects lang={lang} {...links} />
      </section>
      <section data-screen-label="Side projects" style={sectionBorder}>
        <SectionHeader n="04" label={sec.side} />
        <SideProjects lang={lang} />
      </section>
      <section data-screen-label="Stack" style={sectionBorder}>
        <SectionHeader n="05" label={sec.stack} />
        <Stack lang={lang} />
      </section>
      <section id="contacto" data-screen-label="Contact" style={sectionBorder}>
        <SectionHeader n="06" label={sec.contact} />
        <Contact lang={lang} email={config.email} />
      </section>

      {gg && <GGRain />}
      {segv && <Segfault lang={lang} onDone={endSegv} />}
      <AchievementToasts lang={lang} lift={root} />
      {root && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 125, background: '#c6f24e', color: '#0b0c0a', padding: '10px 5vw', font: "600 14px/1.2 'Geist Mono',monospace", display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span>root@jorge:~#</span><span>{lang === 'es' ? 'modo root · recarga la página para salir' : 'root mode · reload the page to exit'}</span>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', left: '50%', bottom: 64, transform: 'translateX(-50%)', zIndex: 126, display: 'flex', alignItems: 'center', gap: 14, maxWidth: 'calc(100vw - 32px)', background: '#0b0c0a', border: '2px solid #c6f24e', boxShadow: '6px 6px 0 #c6f24e', padding: '14px 16px', font: "500 13px/1.4 'Geist Mono',monospace", color: '#f3efe6' }}>
          <button onClick={() => { setToast(false); setOpen(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', background: 'transparent', border: 0, padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit', textAlign: 'left' }}>
            <span style={{ color: '#c6f24e' }}>{lang === 'es' ? '🔓 comando desbloqueado' : '🔓 command unlocked'}</span>
            <span>{lang === 'es' ? 'abre la terminal (º) y escribe ' : 'open the terminal (º) and type '}<span style={{ background: '#c6f24e', color: '#0b0c0a', padding: '2px 6px' }}>hire jorge</span></span>
          </button>
          <button onClick={() => setToast(false)} aria-label="close" style={{ background: 'transparent', border: 0, color: '#c6f24e', cursor: 'pointer', font: "400 22px/1 'Geist Mono',monospace", padding: 4 }}>✕</button>
        </div>
      )}

      <div data-nohijack="1" style={{ position: 'fixed', left: 0, right: 0, top: 0, height: '72vh', zIndex: 110, transform: `translateY(${open ? '0%' : 'calc(-100% - 4px)'})`, transition: 'transform .45s cubic-bezier(.2,.8,.2,1)', background: '#0b0c0a', borderBottom: '2px solid #c6f24e', boxShadow: '0 20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 130px 0 5vw', font: "500 11px/1 'Geist Mono',monospace", color: '#c6f24e' }}>
          <span>~/jorge — tty1</span>
          <button onClick={toggle} className="h-close" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#c6f24e', border: 0, color: '#0b0c0a', padding: '12px 18px', font: "600 15px/1 'Geist Mono',monospace", cursor: 'pointer' }}>
            <span style={{ fontSize: 20, lineHeight: 0.8 }}>✕</span>{lang === 'es' ? 'cerrar [esc]' : 'close [esc]'}
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Terminal open={open} lang={lang} {...links} />
        </div>
      </div>

      <button
        onClick={toggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ position: 'fixed', top: 0, left: '50%', zIndex: 105, transform: `translate(-50%,${inHero ? 'calc(-100% - 4px)' : ext ? '0px' : 'calc(-100% + 12px)'})`, opacity: open || inHero ? 0 : 1, pointerEvents: open || inHero ? 'none' : 'auto', transition: `transform ${ext ? '.6s' : '.35s'} cubic-bezier(.3,1.4,.5,1),opacity .3s`, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
      >
        <span style={{ width: 2, height: hov ? 22 : 10, background: '#c6f24e', transition: 'height .5s cubic-bezier(.3,1.6,.5,1)' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#c6f24e', color: '#0b0c0a', padding: '14px 20px 14px 16px', font: "600 14px/1 'Geist Mono',monospace", whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(198,242,78,.25)' }}>
          <span style={{ font: "400 26px/.6 'VT323',monospace" }}>▼</span>
          <span>{lang === 'es' ? 'abrir terminal' : 'open terminal'}<span style={{ opacity: tick % 2 ? 0 : 1 }}>▌</span></span>
          <span style={{ border: '1.5px solid #0b0c0a', padding: '4px 7px', fontSize: 12 }}>º</span>
        </span>
      </button>
    </div>
  );
}
