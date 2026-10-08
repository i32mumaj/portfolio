import { useEffect, useRef, useState } from 'react';
import { config } from '../config.js';
import Hero from './Hero.jsx';
import About from './About.jsx';
import Projects from './Projects.jsx';
import SideProjects from './SideProjects.jsx';
import Stack from './Stack.jsx';
import Contact from './Contact.jsx';
import Terminal from './Terminal.jsx';

const sectionBorder = { position: 'relative', borderTop: '1px solid rgba(198,242,78,.25)' };
const TOTAL = '06';
const SECTIONS = {
  es: { about: 'SOBRE MÍ', projects: 'PROYECTOS', side: 'SIDE QUESTS', stack: 'STACK', contact: 'CONTACTO' },
  en: { about: 'ABOUT ME', projects: 'PROJECTS', side: 'SIDE QUESTS', stack: 'STACK', contact: 'CONTACT' },
};

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

export default function Portfolio() {
  const [lang, setLang] = useState('es');
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const [near, setNear] = useState(false);
  const [idle, setIdle] = useState(true);
  const [y, setY] = useState(0);
  const [tick, setTick] = useState(0);
  const openRef = useRef(open);

  useEffect(() => { openRef.current = open; }, [open]);

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
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      clearInterval(blink);
      clearTimeout(idleT);
    };
  }, []);

  const inHero = y < window.innerHeight * 0.9;
  const ext = !inHero && (hov || near || idle);
  const toggle = () => setOpen(o => !o);
  const sec = SECTIONS[lang] || SECTIONS.es;
  const links = { brevUrl: config.brevUrl, slateUrl: config.slateUrl, latchUrl: config.latchUrl };

  return (
    <div style={{ background: '#0b0c0a' }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 120, display: 'flex', gap: 2, padding: 3, background: '#0b0c0a', border: '1px solid rgba(198,242,78,.4)', font: "500 11px/1 'Geist Mono',monospace" }}>
        {['es', 'en'].map(id => (
          <button key={id} onClick={() => setLang(id)} style={{ border: 0, cursor: 'pointer', padding: '7px 9px', background: lang === id ? '#c6f24e' : 'transparent', color: lang === id ? '#0b0c0a' : '#c6f24e', font: 'inherit' }}>
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
      <section data-screen-label="Contact" style={sectionBorder}>
        <SectionHeader n="06" label={sec.contact} />
        <Contact lang={lang} email={config.email} />
      </section>

      <div data-nohijack="1" style={{ position: 'fixed', left: 0, right: 0, top: 0, height: '72vh', zIndex: 110, transform: `translateY(${open ? '0%' : 'calc(-100% - 4px)'})`, transition: 'transform .45s cubic-bezier(.2,.8,.2,1)', background: '#0b0c0a', borderBottom: '2px solid #c6f24e', boxShadow: '0 20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 130px 0 5vw', font: "500 11px/1 'Geist Mono',monospace", color: '#c6f24e' }}>
          <span>~/jorge — tty1</span>
          <button onClick={toggle} style={{ background: 'transparent', border: '1px solid rgba(198,242,78,.5)', color: '#c6f24e', padding: '6px 10px', font: 'inherit', cursor: 'pointer' }}>
            {lang === 'es' ? 'cerrar [esc]' : 'close [esc]'}
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
