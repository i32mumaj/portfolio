import { useEffect, useRef, useState } from 'react';
import { GITHUB_URL } from '../config.js';

const T = {
  es: {
    kicker: 'contacto', intro: 'Escribe aquí y te abro tu cliente de correo con el mensaje ya redactado. Si no usas ninguno, copia mi dirección.',
    name: 'tu nombre', subject: 'asunto', body: 'mensaje', namePh: 'Ada Lovelace', subjectPh: 'Portfolio · tu nombre', bodyPh: 'Hola Jorge, ...',
    draft: 'borrador', open: 'abrir en mi correo ↗', copy: 'copiar email', copied: 'copiado ✓', empty: 'escribe algo primero',
    opened: 'abriendo tu cliente de correo…', orDirect: 'o directamente:', noMail: 'aún no hay email configurado',
  },
  en: {
    kicker: 'contact', intro: "Write here and I'll open your mail client with the message ready to go. If you don't use one, copy my address.",
    name: 'your name', subject: 'subject', body: 'message', namePh: 'Ada Lovelace', subjectPh: 'Portfolio · your name', bodyPh: 'Hi Jorge, ...',
    draft: 'draft', open: 'open in my mail ↗', copy: 'copy email', copied: 'copied ✓', empty: 'write something first',
    opened: 'opening your mail client…', orDirect: 'or directly:', noMail: 'no email set yet',
  },
};

const mono = "'Geist Mono',monospace";
const labelStyle = { display: 'flex', flexDirection: 'column', gap: 8, font: `500 11px/1 ${mono}`, color: 'rgba(243,239,230,.6)' };
const fieldStyle = { background: '#0d0f0b', border: '1px solid rgba(243,239,230,.25)', color: '#f3efe6', font: "400 16px/1 'Geist',sans-serif", padding: 14, outline: 'none' };
const hdr = { color: 'rgba(243,239,230,.45)' };

export default function Contact({ lang, email: myEmail }) {
  const t = T[lang] || T.es;
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = s => {
    setStatus(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(null), 2200);
  };

  const subj = subject.trim() || `Portfolio · ${name.trim() || '…'}`;
  const body = msg.trim() ? msg + (name.trim() ? `\n\n— ${name.trim()}` : '') : '';
  const ready = !!(myEmail && msg.trim());
  const href = myEmail ? `mailto:${myEmail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}` : GITHUB_URL;
  const bytes = new TextEncoder().encode(subj + body).length;

  const onOpen = e => {
    if (!ready) { e.preventDefault(); if (myEmail) flash('empty'); return; }
    flash('opened');
  };
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(myEmail); flash('copied'); } catch { /* clipboard unavailable */ }
  };

  const statusLine = { opened: ['→ ' + t.opened, '#c6f24e'], copied: ['✓ ' + myEmail, '#c6f24e'], empty: ['! ' + t.empty, '#ff8a6a'] }[status];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0c0a', color: '#f3efe6', padding: '96px 5vw 80px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ font: `500 12px/1 ${mono}`, color: '#c6f24e' }}>05 — {t.kicker}</div>
            <h2 style={{ margin: 0, font: "400 clamp(56px,8vw,128px)/.9 'Instrument Serif',serif", letterSpacing: '-.02em' }}>
              mailto:<span style={{ fontStyle: 'italic' }}>jorge</span>
            </h2>
          </div>
          <div style={{ font: `400 13px/1.5 ${mono}`, color: 'rgba(243,239,230,.65)', maxWidth: 420 }}>{t.intro}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 28, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={labelStyle}>{t.name}
              <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} className="f-lime" style={fieldStyle} />
            </label>
            <label style={labelStyle}>{t.subject}
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder={t.subjectPh} className="f-lime" style={fieldStyle} />
            </label>
            <label style={labelStyle}>{t.body}
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={7} placeholder={t.bodyPh} className="f-lime" style={{ ...fieldStyle, lineHeight: 1.45, resize: 'vertical' }} />
            </label>
          </div>

          <div style={{ border: '1px solid rgba(198,242,78,.45)', background: '#0d0f0b', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(198,242,78,.3)', font: `500 11px/1 ${mono}`, color: '#c6f24e' }}>
              <span>~/drafts/hola.eml</span><span style={{ color: 'rgba(243,239,230,.55)' }}>{t.draft} · {bytes} B</span>
            </div>
            <pre style={{ margin: 0, padding: '18px 16px', minHeight: 260, whiteSpace: 'pre-wrap', wordBreak: 'break-word', font: `400 13px/1.65 ${mono}`, color: '#f3efe6' }}>
              <span style={hdr}>To:      </span><span style={{ color: '#c6f24e' }}>{myEmail || `<${t.noMail}>`}</span>{'\n'}
              <span style={hdr}>Subject: </span>{subj}{'\n'}
              <span style={hdr}>X-From:  </span>{lang === 'en' ? 'portfolio contact section' : 'sección de contacto del portfolio'}{'\n\n'}
              {body || <span style={{ color: 'rgba(243,239,230,.3)' }}>{t.bodyPh}</span>}
              <span style={{ color: '#c6f24e', animation: 'jmBlink 1s steps(1) infinite' }}>▌</span>
            </pre>
            <div style={{ borderTop: '1px dashed rgba(198,242,78,.3)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={href} onClick={onOpen} target={myEmail ? undefined : '_blank'} rel="noopener" className={ready ? 'h-lift' : undefined} style={{ background: '#c6f24e', color: '#0b0c0a', padding: '14px 20px', font: `600 13px/1 ${mono}`, textDecoration: 'none', opacity: ready || !myEmail ? 1 : 0.45, transition: 'transform .15s,opacity .2s' }}>
                  {myEmail ? t.open : 'GitHub ↗'}
                </a>
                {myEmail && (
                  <button onClick={onCopy} className="h-fill" style={{ background: 'transparent', border: '1px solid #c6f24e', color: '#c6f24e', padding: '13px 16px', font: `600 13px/1 ${mono}`, cursor: 'pointer' }}>
                    {status === 'copied' ? t.copied : t.copy}
                  </button>
                )}
              </div>
              <div style={{ minHeight: 16, font: `400 12px/1.4 ${mono}`, color: statusLine ? statusLine[1] : 'transparent', transition: 'color .2s' }}>
                {statusLine ? statusLine[0] : '·'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(198,242,78,.3)', paddingTop: 22 }}>
          <span style={{ font: `500 11px/1 ${mono}`, color: 'rgba(243,239,230,.55)' }}>{t.orDirect}</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener" className="h-fill" style={{ border: '1px solid #c6f24e', padding: '10px 14px', font: `500 13px/1 ${mono}`, textDecoration: 'none' }}>GitHub · github.com/i32mumaj ↗</a>
        </div>
      </div>
    </div>
  );
}
