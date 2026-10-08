const T = {
  es: {
    h1: 'Hola, soy Jorge. Hago la parte de las webs', h2: 'que no se ve',
    body: 'Estudio 4º de Ingeniería Informática. Empecé programando en C y C++, y ahora me dedico al backend con Python: construyo las APIs y las bases de datos que hacen funcionar una aplicación por detrás.',
  },
  en: {
    h1: "Hi, I'm Jorge. I build the part of the web", h2: 'you never see',
    body: "I'm a 4th-year Computer Engineering student. I started programming in C and C++, and now I focus on backend with Python: I build the APIs and databases that make an app work behind the scenes.",
  },
};

export default function About({ lang }) {
  const t = T[lang] || T.es;
  return (
    <div style={{ background: '#0b0c0a', color: '#f3efe6', padding: '48px 5vw 96px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 900 }}>
        <div style={{ font: "400 clamp(44px,5vw,72px)/1.02 'Instrument Serif',serif", letterSpacing: '-.01em', textWrap: 'pretty' }}>
          {t.h1} <span style={{ fontStyle: 'italic', color: '#c6f24e' }}>{t.h2}</span>.
        </div>
        <div style={{ font: "400 18px/1.6 'Geist',sans-serif", color: 'rgba(243,239,230,.85)', maxWidth: 600, textWrap: 'pretty' }}>{t.body}</div>
      </div>
    </div>
  );
}
