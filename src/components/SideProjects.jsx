import { useEffect, useRef, useState } from 'react';

const PROJ = [
  { id: 'cronwatch', stack: ['Python', 'APScheduler', 'SQLite', 'Telegram API'], url: '#',
    es: 'Vigila mis cron jobs y avisa por Telegram cuando uno falla o tarda más de la cuenta.', en: 'Watches my cron jobs and pings Telegram when one fails or runs late.' },
  { id: 'tfg-queue', stack: ['asyncio', 'Redis Streams', 'Grafana'], url: '#',
    es: 'TFG: cola de tareas distribuida con reintentos exponenciales y dead-letter queue.', en: 'Final-year project: a distributed task queue with exponential retries and a dead-letter queue.' },
  { id: 'ratelab', stack: ['FastAPI', 'Redis', 'Locust'], url: '#',
    es: 'Banco de pruebas de rate limiting: token bucket, sliding window y fixed window, con benchmarks.', en: 'A rate-limiting testbed: token bucket, sliding window and fixed window, with benchmarks.' },
  { id: 'pgsnap', stack: ['Python', 'boto3', 'PostgreSQL', 'Docker'], url: '#',
    es: 'Backups incrementales de Postgres a S3 con retención configurable y restauración en un comando.', en: 'Incremental Postgres backups to S3 with configurable retention and one-command restore.' },
  { id: 'minorm', stack: ['Python', 'sqlite3', 'pytest'], url: '#',
    es: 'ORM de juguete hecho con metaclases para entender cómo funciona SQLAlchemy por dentro.', en: 'A toy ORM built with metaclasses to understand how SQLAlchemy works inside.' },
  { id: 'cercanias-bot', stack: ['httpx', 'BeautifulSoup', 'cron'], url: '#',
    es: 'Bot de Telegram que avisa de retrasos del tren de cercanías antes de salir de casa.', en: 'A Telegram bot that warns about commuter-train delays before I leave home.' },
];

const T = {
  es: { kicker: 'otros proyectos', title: 'Side quests', intro: 'Proyectos más pequeños: experimentos, herramientas que uso a diario y cosas que hice para entender algo por dentro.', repo: 'ver repo', hint: 'click en la carta de arriba = pop() · pasa el ratón para abrir el abanico' },
  en: { kicker: 'other projects', title: 'Side quests', intro: 'Smaller projects: experiments, tools I use every day and things I built to understand how something works inside.', repo: 'view repo', hint: 'click the top card = pop() · hover to fan the deck' },
};

const N = PROJ.length;
const mono = "'Geist Mono',monospace";
const addr = i => '0x' + (0x7f3a10 + i * 0x40).toString(16);

export default function SideProjects({ lang }) {
  const t = T[lang] || T.es;
  const [order, setOrder] = useState(() => PROJ.map((_, i) => i));
  const [fly, setFly] = useState(null);
  const [fan, setFan] = useState(false);
  const flyRef = useRef(null);
  const fanRef = useRef(false);
  const orderRef = useRef(order);
  const popRef = useRef();
  const flyTimer = useRef();

  const pop = () => {
    if (flyRef.current != null) return;
    flyRef.current = orderRef.current[0];
    setFly(flyRef.current);
    flyTimer.current = setTimeout(() => {
      setFly(null);
      setOrder(o => [...o.slice(1), o[0]]);
    }, 420);
  };
  const push = () => {
    if (flyRef.current != null) return;
    setOrder(o => [o[N - 1], ...o.slice(0, N - 1)]);
  };
  const bringTop = i => setOrder(o => {
    const at = o.indexOf(i);
    return [...o.slice(at), ...o.slice(0, at)];
  });

  useEffect(() => {
    flyRef.current = fly;
    fanRef.current = fan;
    orderRef.current = order;
    popRef.current = pop;
  });

  useEffect(() => {
    const auto = setInterval(() => { if (!fanRef.current) popRef.current(); }, 4500);
    return () => { clearInterval(auto); clearTimeout(flyTimer.current); };
  }, []);

  const top = PROJ[order[0]];

  return (
    <div style={{ background: '#0b0c0a', color: '#f3efe6', padding: '96px 5vw 120px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ font: `500 12px/1 ${mono}`, color: '#c6f24e', letterSpacing: '.06em' }}>03.1 — {t.kicker}</div>
          <h2 style={{ margin: 0, font: "400 clamp(48px,6.5vw,104px)/.9 'Instrument Serif',serif", letterSpacing: '-.02em' }}>{t.title}</h2>
        </div>
        <div style={{ font: `400 13px/1.5 ${mono}`, color: 'rgba(243,239,230,.65)', maxWidth: 380 }}>{t.intro}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 56, alignItems: 'center' }}>
        <div onMouseEnter={() => setFan(true)} onMouseLeave={() => setFan(false)} style={{ position: 'relative', height: 500, maxWidth: 520, width: '100%' }}>
          {PROJ.map((p, i) => {
            const pos = order.indexOf(i), flying = fly === i;
            const tf = flying ? 'translate(130%,-12%) rotate(16deg)'
              : fan ? `translate(${pos * 26}px,${pos * 6}px) rotate(${pos * 5 - 2}deg)`
                : `translate(${pos * 7}px,${pos * -7}px) rotate(${pos * -1.4}deg)`;
            return (
              <button
                key={p.id}
                onClick={() => (pos === 0 ? pop() : bringTop(i))}
                style={{ position: 'absolute', left: 24, top: 40, width: 'min(320px,78%)', height: 400, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, textAlign: 'left', cursor: 'pointer', background: '#11130f', border: `1px solid ${pos === 0 ? '#c6f24e' : 'rgba(198,242,78,.25)'}`, color: '#f3efe6', zIndex: flying ? 50 : N - pos, opacity: flying ? 0 : pos > 3 ? 0 : 1, transform: tf, transformOrigin: '30% 110%', transition: 'transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s,border-color .3s', boxShadow: '0 18px 40px rgba(0,0,0,.45)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 22px/1 'VT323',monospace", color: '#c6f24e' }}>
                  <span>{addr(i)}</span><span>#{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ font: "400 50px/.9 'Instrument Serif',serif", letterSpacing: '-.01em' }}>{p.id}</div>
                  <div style={{ font: "400 14px/1.45 'Geist',sans-serif", color: 'rgba(243,239,230,.78)', textWrap: 'pretty' }}>{p[lang] || p.es}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.stack.map(s => <span key={s} style={{ border: '1px solid rgba(243,239,230,.25)', padding: '5px 8px', font: `500 10px/1 ${mono}`, whiteSpace: 'nowrap', color: 'rgba(243,239,230,.8)' }}>{s}</span>)}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(198,242,78,.35)', font: `400 13px/1 ${mono}` }}>
            <div style={{ padding: '10px 14px', background: '#c6f24e', color: '#0b0c0a', fontWeight: 600, fontSize: 11, letterSpacing: '.04em' }}>CALL STACK · LIFO</div>
            {order.map((i, pos) => (
              <button key={i} onClick={() => bringTop(i)} className="h-tint" style={{ display: 'grid', gridTemplateColumns: '44px 90px minmax(0,1fr)', gap: 10, alignItems: 'center', padding: '11px 14px', border: 0, borderTop: '1px solid rgba(243,239,230,.08)', background: pos === 0 ? '#c6f24e' : 'transparent', color: pos === 0 ? '#0b0c0a' : '#f3efe6', cursor: 'pointer', textAlign: 'left', font: 'inherit', transition: 'background .3s,color .3s' }}>
                <span style={{ color: '#c6f24e' }}>{pos === 0 ? 'SP→' : ''}</span>
                <span style={{ opacity: 0.6 }}>{addr(i)}</span>
                <span>{PROJ[i].id}()</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={pop} className="h-shadow" style={{ background: '#c6f24e', color: '#0b0c0a', border: 0, padding: '13px 18px', font: `600 13px/1 ${mono}`, cursor: 'pointer' }}>pop()</button>
            <button onClick={push} className="h-tint-soft" style={{ background: 'transparent', color: '#c6f24e', border: '1px solid rgba(198,242,78,.5)', padding: '13px 18px', font: `600 13px/1 ${mono}`, cursor: 'pointer' }}>push()</button>
            <a href={top.url} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', padding: '0 6px', font: `500 13px/1 ${mono}`, textDecoration: 'none' }}>{t.repo} {top.id} ↗</a>
          </div>
          <div style={{ font: `400 11px/1 ${mono}`, color: 'rgba(243,239,230,.45)' }}>{t.hint}</div>
        </div>
      </div>
    </div>
  );
}
