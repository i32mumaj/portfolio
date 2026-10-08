import { useEffect, useRef, useState } from 'react';

const SK = [
  { k: 'python', n: 'Python', ver: '3.12', lvl: .9, g: 'py', req: '—', used: 'brev, slate, latch', es: 'Mi lenguaje principal ahora. Backend y scripting.', en: 'My main language now. Backend and scripting.', sinceI: 2 },
  { k: 'fastapi', n: 'FastAPI', ver: '0.11x', lvl: .85, g: 'py', req: 'python, pydantic', used: 'brev, slate, latch', es: 'El framework de mis tres APIs.', en: 'The framework behind my three APIs.', sinceI: 3 },
  { k: 'pydantic', n: 'Pydantic', ver: '2.x', lvl: .75, g: 'py', req: 'python', used: 'brev, slate, latch', es: 'Validación de requests y esquemas.', en: 'Request validation and schemas.', sinceI: 3 },
  { k: 'sqlalchemy', n: 'SQLAlchemy', ver: '2.0', lvl: .75, g: 'py', req: 'python', used: 'brev, slate, latch', es: 'ORM y modelos de datos.', en: 'ORM and data models.', sinceI: 3 },
  { k: 'sqlite', n: 'SQLite', ver: '3', lvl: .7, g: 'tool', req: '—', used: 'brev, slate, latch', es: 'Base de datos de mis proyectos, por ahora.', en: 'Database for my projects, for now.', sinceI: 3 },
  { k: 'postgres', n: 'PostgreSQL', ver: '16', lvl: .65, g: 'tool', req: '—', used: 'brev, slate, latch', es: 'Base de datos relacional para producción.', en: 'Relational database for production.', sinceI: 3 },
  { k: 'docker', n: 'Docker', ver: '27', lvl: .65, g: 'tool', req: '—', used: 'brev, slate, latch', es: 'Contenedores para desplegar mis APIs.', en: 'Containers to deploy my APIs.', sinceI: 3 },
  { k: 'gha', n: 'GitHub Actions', ver: 'CI/CD', lvl: .6, g: 'tool', req: 'git, docker', used: 'brev, slate, latch', es: 'CI/CD: tests, build y despliegue en cada push.', en: 'CI/CD: tests, build and deploy on every push.', sinceI: 3 },
  { k: 'react', n: 'React', ver: '18', lvl: .55, g: 'tool', req: 'javascript', used: 'brev, slate, latch (front)', es: 'Los frontends de mis proyectos.', en: 'The frontends of my projects.', sinceI: 3 },
  { k: 'c', n: 'C', ver: 'C11', lvl: .8, g: 'c', req: 'gcc', used: 'universidad', es: 'Donde empecé: punteros, memoria, malloc y free.', en: 'Where I started: pointers, memory, malloc and free.', sinceI: 0 },
  { k: 'cpp', n: 'C++', ver: 'C++20', lvl: .75, g: 'c', req: 'g++', used: 'universidad', es: 'POO, plantillas, STL y RAII.', en: 'OOP, templates, STL and RAII.', sinceI: 1 },
  { k: 'git', n: 'Git', ver: '2.x', lvl: .75, g: 'tool', req: '—', used: 'todo · everything', es: 'Control de versiones en todo lo que hago.', en: 'Version control on everything.', sinceI: 0 },
  { k: 'linux', n: 'Linux', ver: '6.x', lvl: .7, g: 'tool', req: '—', used: 'todo · everything', es: 'Mi entorno de desarrollo.', en: 'My dev environment.', sinceI: 0 },
];

const ORDER = ['python', 'fastapi', 'pydantic', 'sqlalchemy', 'sqlite', 'postgres', 'docker', 'gha', 'react', 'git', 'linux', 'c', 'cpp'];
const TREE = { python: '├── ', fastapi: '│   ├── ', pydantic: '│   │   └── ', sqlalchemy: '│   └── ', sqlite: '│       ├── ', postgres: '│       └── ', docker: '├── ', gha: '│   └── ', react: '├── ', git: '├── ', linux: '├── ', c: '└── ', cpp: '    └── ' };

const T = {
  es: { reinstall: 'reinstalar', since: 'Desde', years: ['1º de carrera', '2º de carrera', '3º de carrera', '4º de carrera'],
    intro: 'Mis herramientas como dependencias. Pasa el ratón por un paquete para ver dónde lo uso.', foot: 'c y c++ compilados desde el código fuente (gcc).' },
  en: { reinstall: 'reinstall', since: 'Since', years: ['1st year', '2nd year', '3rd year', '4th year'],
    intro: 'My tools as dependencies. Hover a package to see where I use it.', foot: 'c and c++ built from source (gcc).' },
};

const mono = "'Geist Mono',monospace";
const byKey = k => SK.find(s => s.k === k);

export default function Stack({ lang }) {
  const t = T[lang] || T.es;
  const [pip, setPip] = useState(0);
  const [sel, setSel] = useState('python');
  const pipRef = useRef(null);
  const timer = useRef();

  const runPip = () => {
    clearInterval(timer.current);
    setPip(0);
    timer.current = setInterval(() => {
      setPip(p => {
        const n = p + 0.12;
        if (n >= SK.length + 1) clearInterval(timer.current);
        return n;
      });
    }, 40);
  };

  useEffect(() => {
    let started = false;
    const io = new IntersectionObserver(es => {
      if (!started && es.some(e => e.isIntersecting)) { started = true; runPip(); }
    }, { threshold: 0.2 });
    if (pipRef.current) io.observe(pipRef.current);
    return () => { io.disconnect(); clearInterval(timer.current); };
  }, []);

  const rows = ORDER.slice(0, Math.min(ORDER.length, Math.ceil(pip))).map((k, i) => {
    const s = byKey(k), f = Math.max(0, Math.min(1, pip - i));
    return { k, ver: s.ver, c: s.g === 'py' ? '#c6f24e' : '#f3efe6', pct: f < 1 ? Math.round(f * 100) + '%' : '✓' };
  });
  const sk = byKey(sel);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0c0a', color: '#f3efe6', padding: '96px 5vw 100px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, font: "400 clamp(52px,7.5vw,116px)/.9 'Instrument Serif',serif", letterSpacing: '-.02em' }}>pip install <span style={{ fontStyle: 'italic' }}>jorge</span></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', maxWidth: 380 }}>
            <div style={{ font: `400 13px/1.5 ${mono}`, color: 'rgba(243,239,230,.65)' }}>{t.intro}</div>
            <button onClick={runPip} className="h-fill" style={{ background: 'transparent', border: '1px solid #c6f24e', color: '#c6f24e', padding: '9px 12px', font: `600 12px/1 ${mono}`, cursor: 'pointer' }}>↻ {t.reinstall}</button>
          </div>
        </div>

        <div ref={pipRef} className="stack-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>
          <div style={{ border: '1px solid rgba(198,242,78,.45)', background: '#0d0f0b', padding: '20px 22px', font: `400 14px/1.7 ${mono}`, minHeight: 520, minWidth: 0 }}>
            <div style={{ color: '#c6f24e' }}>$ pip install jorge</div>
            {rows.map(r => (
              <div key={r.k} onMouseEnter={() => setSel(r.k)} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 44px', gap: 14, alignItems: 'center', whiteSpace: 'pre', cursor: 'default', padding: '0 6px', margin: '0 -6px', background: sel === r.k ? 'rgba(198,242,78,.1)' : 'transparent' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ color: 'rgba(243,239,230,.4)' }}>{TREE[r.k]}</span>
                  <span style={{ color: r.c }}>{r.k}</span>
                  <span style={{ color: 'rgba(243,239,230,.45)' }}>=={r.ver}</span>
                </span>
                <span style={{ textAlign: 'right', fontSize: 12, color: 'rgba(243,239,230,.55)' }}>{r.pct}</span>
              </div>
            ))}
            {pip >= ORDER.length && (
              <>
                <div style={{ marginTop: 10, color: '#c6f24e' }}>Successfully installed jorge-4.0 ✓</div>
                <div style={{ color: 'rgba(243,239,230,.55)' }}>{t.foot}</div>
              </>
            )}
          </div>

          <div style={{ border: '1px solid rgba(243,239,230,.2)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 90 }}>
            <div style={{ font: `500 11px/1 ${mono}`, color: 'rgba(243,239,230,.55)' }}>pip show {sk.k}</div>
            <div style={{ font: "400 clamp(44px,4.5vw,68px)/.95 'Instrument Serif',serif" }}>{sk.n}</div>
            <div style={{ font: "400 16px/1.45 'Geist',sans-serif", color: 'rgba(243,239,230,.85)' }}>{sk[lang] || sk.es}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', font: `400 12px/1.4 ${mono}` }}>
              <span style={{ color: 'rgba(243,239,230,.5)' }}>Version</span><span>{sk.ver}</span>
              <span style={{ color: 'rgba(243,239,230,.5)' }}>{t.since}</span><span>{t.years[sk.sinceI]}</span>
              <span style={{ color: 'rgba(243,239,230,.5)' }}>Requires</span><span>{sk.req}</span>
              <span style={{ color: 'rgba(243,239,230,.5)' }}>Used-by</span><span style={{ color: '#c6f24e' }}>{sk.used}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
