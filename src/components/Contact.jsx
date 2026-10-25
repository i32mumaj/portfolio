import { useEffect, useRef, useState } from 'react';
import { GITHUB_URL } from '../config.js';

const T = {
  es: {
    title: 'Contacto', namePh: 'Ada Lovelace', subjectPh: 'Portfolio · tu nombre', bodyPh: 'Hola Jorge, ...',
    hireMsg: 'He llenado el tablero del snake y quiero hablar contigo.', draft: 'borrador', open: 'abrir en mi correo ↗', copy: 'copiar email', copied: 'copiado ✓', empty: 'escribe algo primero',
    opened: 'abriendo tu cliente de correo…', orDirect: 'o directamente:', noMail: 'aún no hay email configurado',
  },
  en: {
    title: 'Contact', namePh: 'Ada Lovelace', subjectPh: 'Portfolio · your name', bodyPh: 'Hi Jorge, ...',
    hireMsg: 'I cleared the snake board and I want to talk to you.', draft: 'draft', open: 'open in my mail ↗', copy: 'copy email', copied: 'copied ✓', empty: 'write something first',
    opened: 'opening your mail client…', orDirect: 'or directly:', noMail: 'no email set yet',
  },
};

const mono = "'Geist Mono',monospace";
const hdr = { color: 'rgba(243,239,230,.45)', whiteSpace: 'nowrap' };

export default function Contact({ lang, email: myEmail, mobile }) {
  const t = T[lang] || T.es;
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const onHire = () => setMsg(t.hireMsg);
    window.addEventListener('jm-hire', onHire);
    return () => window.removeEventListener('jm-hire', onHire);
  }, [t]);

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

  const fs = mobile ? 16 : 14;
  // iOS zooms into fields under 16px, hence the bigger size on phones.
  const lineInput = { background: 'transparent', border: 0, borderBottom: '1px dashed rgba(243,239,230,.25)', color: '#f3efe6', font: 'inherit', padding: '8px 0', outline: 'none', minWidth: 0, caretColor: '#c6f24e' };

  const statusLine = { opened: ['→ ' + t.opened, '#c6f24e'], copied: ['✓ ' + myEmail, '#c6f24e'], empty: ['! ' + t.empty, '#ff8a6a'] }[status];

  return (
    <div style={{ minHeight: mobile ? 0 : '100vh', background: '#0b0c0a', color: '#f3efe6', padding: mobile ? '56px 5vw 96px' : '96px 5vw 80px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, font: "400 clamp(56px,8vw,128px)/.9 'Instrument Serif',serif", letterSpacing: '-.02em' }}>{t.title}</h2>
          </div>
        </div>

        {/* The draft is the form itself: one place to type, so nobody tries to write into a read-only preview. */}
        <div style={{ border: '1px solid rgba(198,242,78,.45)', background: '#0d0f0b', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderBottom: '1px solid rgba(198,242,78,.3)', font: `500 11px/1 ${mono}`, color: '#c6f24e' }}>
            <span>~/drafts/hola.eml</span><span style={{ color: 'rgba(243,239,230,.55)' }}>{t.draft} · {bytes} B</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', gap: mobile ? '4px 12px' : '6px 18px', padding: mobile ? '14px 14px 6px' : '20px 22px 8px', font: `400 ${fs}px/1.4 ${mono}` }}>
            <span style={hdr}>To:</span>
            <span style={{ color: '#c6f24e', padding: '8px 0', overflowWrap: 'anywhere' }}>{myEmail || `<${t.noMail}>`}</span>
            <span style={hdr}>From:</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} className="f-lime" style={lineInput} />
            <span style={hdr}>Subject:</span>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder={`Portfolio · ${name.trim() || '…'}`} className="f-lime" style={lineInput} />
          </div>
          <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={mobile ? 7 : 8} placeholder={t.bodyPh} className="f-lime" style={{ margin: mobile ? '8px 14px 14px' : '10px 22px 20px', background: 'rgba(243,239,230,.03)', border: '1px dashed rgba(243,239,230,.2)', color: '#f3efe6', font: `400 ${fs}px/1.6 ${mono}`, padding: mobile ? 12 : 16, outline: 'none', resize: 'vertical', caretColor: '#c6f24e', minHeight: 160 }} />
          <div style={{ borderTop: '1px dashed rgba(198,242,78,.3)', padding: mobile ? '14px' : '16px 22px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
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

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(198,242,78,.3)', paddingTop: 22 }}>
          <span style={{ font: `500 11px/1 ${mono}`, color: 'rgba(243,239,230,.55)' }}>{t.orDirect}</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener" className="h-fill" style={{ border: '1px solid #c6f24e', padding: '10px 14px', font: `500 13px/1 ${mono}`, textDecoration: 'none' }}>GitHub · github.com/i32mumaj ↗</a>
        </div>
      </div>
    </div>
  );
}
