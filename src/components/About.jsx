import { useEffect, useRef, useState } from 'react';

// *text* marks the words highlighted in lime.
const T = {
  es: {
    h1: 'Hola, soy Jorge. Hago la parte de las webs', h2: 'que no se ve',
    body: [
      'Estudio 4º de Ingeniería Informática en la Universidad de Córdoba. Empecé programando en *C y C++*, y de ahí me viene la manía de querer saber *qué pasa por debajo*: cómo se gestiona la memoria, qué hace de verdad una llamada al sistema, por qué algo va lento.',
      'Ahora me dedico sobre todo al *backend con Python*. Construyo APIs con FastAPI, diseño las bases de datos y me ocupo de lo que el usuario no ve pero nota enseguida cuando falla: *la autenticación, la validación de datos y el rendimiento*.',
      'No me quedo solo en el código. Los proyectos de este portfolio *los despliego yo mismo* en un VPS con Docker y Caddy, y en casa tengo *un servidor propio* donde pruebo las cosas antes de subirlas.',
      'Fuera de la pantalla *me paso horas con el soldador arreglando lo que se rompe*. Eso me ha enseñado a buscar un fallo *paso a paso*, descartando una cosa cada vez, y con un bug se hace igual.',
    ],
  },
  en: {
    h1: "Hi, I'm Jorge. I build the part of the web", h2: 'you never see',
    body: [
      "I'm a 4th-year Computer Engineering student at the University of Córdoba. I started programming in *C and C++*, and that's where my habit of wanting to know *what happens underneath* comes from: how memory is managed, what a system call really does, why something is slow.",
      "These days I mostly work on *backend with Python*. I build APIs with FastAPI, design the databases and take care of what users don't see but notice right away when it breaks: *authentication, data validation and performance*.",
      "I don't stop at the code. *I deploy the projects* in this portfolio myself on a VPS with Docker and Caddy, and at home I run *my own server* where I test things before shipping them.",
      'Away from the screen *I spend hours with a soldering iron fixing whatever breaks*. It taught me to hunt down a fault *step by step*, ruling out one thing at a time, and a bug works the same way.',
    ],
  },
};

const mono = "'Geist Mono',monospace";
const addr = i => '0x' + (0x7ffd3a00 + i * 0x80).toString(16);

function Rich({ text }) {
  return text.split('*').map((part, i) => (i % 2 ? <span key={i} style={{ color: '#c6f24e' }}>{part}</span> : part));
}

export default function About({ lang, mobile }) {
  const t = T[lang] || T.es;
  const [shown, setShown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ background: '#0b0c0a', color: '#f3efe6', padding: mobile ? '40px 5vw 80px' : '56px 5vw 112px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 36 : 56 }}>
        <div style={{ font: `400 ${mobile ? '44px' : 'clamp(56px,6.4vw,104px)'}/1 'Instrument Serif',serif`, letterSpacing: '-.015em', textWrap: 'balance', maxWidth: 1240 }}>
          {t.h1} <span style={{ fontStyle: 'italic', color: '#c6f24e' }}>{t.h2}</span>.
        </div>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: mobile ? 28 : '44px 64px' }}>
          {t.body.map((p, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 18, borderTop: '1px solid rgba(198,242,78,.3)', position: 'relative', opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(24px)', transition: `opacity .6s ${i * 0.12}s, transform .6s cubic-bezier(.2,.8,.2,1) ${i * 0.12}s` }}>
              <span style={{ position: 'absolute', left: 0, top: -1, height: 3, background: '#c6f24e', width: shown ? 56 : 0, transition: `width .5s ${0.2 + i * 0.12}s` }} />
              <span style={{ font: `500 11px/1 ${mono}`, color: 'rgba(198,242,78,.7)' }}>{addr(i)}</span>
              <p style={{ margin: 0, font: `400 ${mobile ? 17 : 19}px/1.6 'Geist',sans-serif`, color: 'rgba(243,239,230,.85)', textWrap: 'pretty' }}><Rich text={p} /></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
