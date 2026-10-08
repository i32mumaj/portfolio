import { Component, createRef } from 'react';
import { GITHUB_URL } from '../config.js';
import { hash, wait } from '../lib/util.js';

const T = {
  es: {
    title: 'jorge/docs', intro: 'Cada proyecto documentado como en FastAPI. Ejecuta un endpoint y la demo de al lado responde de verdad.',
    brevDesc: 'Acortador de enlaces. Recibe una URL, genera un código corto y redirige con un 307.',
    slateDesc: 'Gastos en grupo al estilo Tricount: apuntas quién paga y calcula cuánto debe cada uno y cómo saldar con el mínimo de transferencias.',
    latchDesc: 'Gestor de contraseñas zero-knowledge: se cifra todo en tu navegador y el servidor solo guarda texto cifrado.',
    open: 'Abrir', sim: 'demo simulada', real: 'cifrado real en tu navegador', shorten: 'acortar', visit: 'visitar →', paid: 'pagó', add: '+ gasto',
    browser: 'tu navegador', server: 'lo que ve el servidor', secret: 'secreto', keyNote: 'la clave se deriva aquí y nunca sale de este dispositivo.',
    live: 'en vivo · desde la demo', execute: 'ejecutar en la demo',
    sum: { b0: 'Crear enlace corto', b1: 'Redirigir', s0: 'Añadir gasto', s1: 'Calcular saldos', l0: 'Guardar secreto cifrado', l1: 'Listar cofre' },
    concepts: ['cena', 'súper', 'gasolina', 'entradas', 'pizza', 'luz'], settled: 'todo cuadrado ✓',
  },
  en: {
    title: 'jorge/docs', intro: 'Each project documented the FastAPI way. Run an endpoint and the demo next to it actually responds.',
    brevDesc: 'Link shortener. Takes a URL, generates a short code and redirects with a 307.',
    slateDesc: 'Tricount-style group expenses: log who paid and it works out what everyone owes and how to settle with the fewest transfers.',
    latchDesc: 'Zero-knowledge password manager: everything is encrypted in your browser and the server only stores ciphertext.',
    open: 'Open', sim: 'simulated demo', real: 'real encryption in your browser', shorten: 'shorten', visit: 'visit →', paid: 'paid', add: '+ expense',
    browser: 'your browser', server: 'what the server sees', secret: 'secret', keyNote: 'the key is derived here and never leaves this device.',
    live: 'live · from the demo', execute: 'run in the demo',
    sum: { b0: 'Create short link', b1: 'Redirect', s0: 'Add expense', s1: 'Compute balances', l0: 'Store encrypted secret', l1: 'List vault' },
    concepts: ['dinner', 'groceries', 'fuel', 'tickets', 'pizza', 'power bill'], settled: 'all settled ✓',
  },
};

const PEOPLE = ['ana', 'marco', 'jorge'];
const METHOD_BG = { GET: '#c6f24e', POST: '#f3efe6', PUT: 'oklch(0.82 0.1 200)' };
const B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const mono = "'Geist Mono',monospace";
const cap = s => s[0].toUpperCase() + s.slice(1);

const rowStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 48, padding: '64px 0', borderTop: '1px solid rgba(198,242,78,.3)' };
const inputStyle = { background: '#0b0c0a', border: '1px solid rgba(243,239,230,.25)', color: '#f3efe6', font: `400 13px/1 ${mono}`, outline: 'none' };

function balances(exp) {
  const paid = { ana: 0, marco: 0, jorge: 0 };
  let tot = 0;
  for (const e of exp) { paid[e.who] += e.amt; tot += e.amt; }
  const share = tot / PEOPLE.length, bal = {};
  PEOPLE.forEach(p => { bal[p] = +(paid[p] - share).toFixed(2); });
  const deb = PEOPLE.filter(p => bal[p] < -0.005).map(p => ({ p, v: -bal[p] }));
  const cre = PEOPLE.filter(p => bal[p] > 0.005).map(p => ({ p, v: bal[p] }));
  const tr = [];
  let i = 0, j = 0;
  while (i < deb.length && j < cre.length) {
    const m = Math.min(deb[i].v, cre[j].v);
    tr.push([deb[i].p, cre[j].p, m]);
    deb[i].v -= m; cre[j].v -= m;
    if (deb[i].v < 0.005) i++;
    if (cre[j].v < 0.005) j++;
  }
  return { bal, tr };
}

function ProjectName({ letters }) {
  return (
    <div style={{ display: 'flex', font: "400 clamp(60px,7vw,110px)/.85 'Instrument Serif',serif", letterSpacing: '-.02em' }}>
      {letters.map((l, i) => <span key={i} style={{ fontFamily: l.ff, fontSize: l.fs, color: l.c }}>{l.ch}</span>)}
    </div>
  );
}

function DocsColumn({ name, label, url, desc, endpoints, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      <ProjectName letters={name} />
      <div style={{ font: "400 16px/1.45 'Geist',sans-serif", color: 'rgba(243,239,230,.85)', maxWidth: 520 }}>{desc}</div>
      <div style={{ font: `400 11px/1 ${mono}`, color: 'rgba(243,239,230,.5)' }}>FastAPI · SQLAlchemy · SQLite · React</div>
      <a href={url} target="_blank" rel="noopener" className="h-open" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: '#c6f24e', color: '#0b0c0a', padding: '22px 24px', textDecoration: 'none', font: `600 18px/1 ${mono}`, transition: 'box-shadow .15s,transform .15s' }}>
        <span>{t.open} {label}</span><span style={{ fontSize: 26, lineHeight: 1 }}>↗</span>
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {endpoints.map(ep => (
          <div key={ep.id} style={{ border: `1px solid ${ep.open ? '#c6f24e' : 'rgba(243,239,230,.18)'}`, background: '#0d0f0b', transition: 'border-color .2s' }}>
            <button onClick={ep.toggle} className="h-row" style={{ width: '100%', display: 'grid', gridTemplateColumns: '62px minmax(0,1fr) auto', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'transparent', border: 0, cursor: 'pointer', color: '#f3efe6', textAlign: 'left', font: `500 13px/1 ${mono}` }}>
              <span style={{ background: METHOD_BG[ep.method], color: '#0b0c0a', padding: '5px 0', textAlign: 'center', fontWeight: 600, fontSize: 11 }}>{ep.method}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.path} <span style={{ color: 'rgba(243,239,230,.5)', fontWeight: 400 }}>— {ep.summary}</span></span>
              <span style={{ color: '#c6f24e', transform: `rotate(${ep.open ? 90 : 0}deg)`, transition: 'transform .2s' }}>▸</span>
            </button>
            {ep.open && (
              <div style={{ borderTop: '1px solid rgba(198,242,78,.25)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, font: `500 11px/1 ${mono}`, color: 'rgba(243,239,230,.55)' }}>
                  <span>response <span style={{ color: '#c6f24e' }}>{ep.status}</span></span>
                  <span style={{ color: '#c6f24e' }}>{t.live}</span>
                </div>
                <pre style={{ margin: 0, background: '#0b0c0a', border: '1px dashed rgba(198,242,78,.3)', padding: 12, font: `400 12px/1.6 ${mono}`, color: '#c6f24e', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{ep.res}</pre>
                <div style={{ display: 'flex' }}>
                  <button onClick={ep.run} className="h-fill" style={{ background: 'transparent', border: '1px solid #c6f24e', color: '#c6f24e', padding: '9px 12px', font: `600 12px/1 ${mono}`, cursor: 'pointer' }}>{t.execute} →</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoPanel({ flash, title, badge, children }) {
  return (
    <div style={{ border: `1px solid ${flash ? '#c6f24e' : 'rgba(198,242,78,.45)'}`, boxShadow: flash ? '0 0 0 4px rgba(198,242,78,.18)' : 'none', transition: 'border-color .3s,box-shadow .3s', background: '#0d0f0b', display: 'flex', flexDirection: 'column', minWidth: 0, alignSelf: 'start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(198,242,78,.3)', font: `500 11px/1 ${mono}`, color: '#c6f24e' }}>
        <span>{title}</span><span style={{ color: 'rgba(243,239,230,.55)' }}>{badge}</span>
      </div>
      {children}
    </div>
  );
}

export default class Projects extends Component {
  state = {
    rev: { brev: 0, slate: 0, latch: 0 }, tick: 0,
    bUrl: 'https://github.com/i32mumaj/portfolio/blob/main/README.md', bDisplay: '', bLog: [], bClicks: 0, bCode: null,
    payer: 'ana', amount: 30, exp: [{ who: 'jorge', amt: 36, k: 0 }, { who: 'ana', amt: 12, k: 1 }],
    lMaster: 'correct-horse-battery', lSecret: 'mi-contraseña-del-wifi', lCipher: '', lIv: '', openEp: null, flash: null,
  };
  pBrev = createRef(); pSlate = createRef(); pLatch = createRef();

  componentDidMount() {
    this._dead = false;
    this._io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { const k = e.target.dataset.p; if (!this.state.rev[k]) this.reveal(k); }
    }), { threshold: 0.35 });
    [this.pBrev, this.pSlate, this.pLatch].forEach(r => r.current && this._io.observe(r.current));
    this._gl = setInterval(() => {
      if (Object.values(this.state.rev).some(v => v > 0 && v < 1) || this._bAnim) this.setState(s => ({ tick: s.tick + 1 }));
    }, 60);
    this.encrypt();
  }

  componentWillUnmount() {
    this._io?.disconnect();
    clearInterval(this._gl); clearTimeout(this._encT); clearTimeout(this._fT);
    this._dead = true;
  }

  t() { return T[this.props.lang] || T.es; }

  reveal(k) {
    const t0 = performance.now(), dur = 1100;
    const step = () => {
      if (this._dead) return;
      const p = Math.min(1, (performance.now() - t0) / dur);
      this.setState(s => ({ rev: { ...s.rev, [k]: Math.max(p, 0.001) } }));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  nameLetters(word, k, pixIdx) {
    const p = this.state.rev[k], G = '01#<>/{}*=;';
    return [...word].map((ch, i) => {
      const done = p >= 1 || p > 0.15 + hash(i, k.length) * 0.7;
      const pix = i === pixIdx;
      return {
        ch: done ? ch : (p === 0 ? ' ' : G[Math.floor(hash(i, this.state.tick) * G.length)]),
        ff: done && !pix ? "'Instrument Serif', serif" : 'VT323, monospace',
        fs: done && !pix ? '1em' : '.86em',
        c: done ? '#f3efe6' : '#c6f24e',
      };
    });
  }

  flash(k) {
    this.setState({ flash: k });
    clearTimeout(this._fT);
    this._fT = setTimeout(() => this.setState({ flash: null }), 900);
  }

  async runBrev() {
    if (this._bAnim) return;
    this._bAnim = true;
    const url = this.state.bUrl.trim() || 'https://example.com';
    const ok = /^https?:\/\/\S+\.\S+/.test(url);
    const log = (txt, c = 'rgba(243,239,230,.7)') => this.setState(s => ({ bLog: [...s.bLog, { txt, c }] }));
    this.setState({ bLog: [], bCode: null, bDisplay: url, bClicks: 0 });
    log('→ POST /api/links');
    await wait(250);
    if (!ok) { log('← 422 Unprocessable Entity · url inválida', '#ff8a6a'); this._bAnim = false; return; }
    log('  pydantic: HttpUrl ✓');
    await wait(200);
    let h = 0;
    for (const c of url) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
    let code = '';
    for (let i = 0; i < 5; i++) { code += B62[h % 62]; h = Math.floor(h / 62) + Math.imul(h, 7) >>> 0; }
    const arr = [...url];
    while (arr.length > 5) {
      arr.splice(Math.floor(Math.random() * arr.length), Math.max(1, Math.floor(arr.length / 12)));
      this.setState({ bDisplay: arr.join('') });
      await wait(28);
    }
    log(`  INSERT INTO links → id ${1000 + (h % 9000)}`);
    for (let f = 0; f < 12; f++) {
      this.setState({ bDisplay: [...code].map((c, i) => f > 4 + i * 1.4 ? c : B62[Math.floor(Math.random() * 62)]).join('') });
      await wait(45);
    }
    this.setState({ bCode: code, bDisplay: `brev/${code}` });
    log('← 201 Created', '#c6f24e');
    this._bAnim = false;
  }

  visitBrev() {
    if (!this.state.bCode) return;
    this.setState(s => ({ bClicks: s.bClicks + 1, bLog: [...s.bLog.slice(-3), { txt: `→ GET /${s.bCode}  ← 307 → ${s.bUrl.slice(0, 34)}…`, c: '#c6f24e' }] }));
  }

  addExpense() {
    this.setState(s => ({ exp: [...s.exp, { who: s.payer, amt: s.amount, k: s.exp.length }] }));
  }

  encrypt() {
    clearTimeout(this._encT);
    this._encT = setTimeout(async () => {
      const { lMaster, lSecret } = this.state;
      const hex = b => [...b].map(x => x.toString(16).padStart(2, '0')).join('');
      let ct, iv;
      try {
        const enc = new TextEncoder();
        this._salt = this._salt || crypto.getRandomValues(new Uint8Array(16));
        const base = await crypto.subtle.importKey('raw', enc.encode(lMaster || ' '), 'PBKDF2', false, ['deriveKey']);
        const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: this._salt, iterations: 100000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
        const ivb = crypto.getRandomValues(new Uint8Array(12));
        ct = hex(new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivb }, key, enc.encode(lSecret))));
        iv = hex(ivb);
      } catch {
        ct = [...Array(48)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        iv = '—';
      }
      const tok = (this._encTok = (this._encTok || 0) + 1);
      for (let f = 0; f <= 14; f++) {
        if (this._dead || tok !== this._encTok) return;
        this.setState({ lIv: iv, lCipher: [...ct].map((c, i) => f >= 14 || hash(i, 9) < f / 14 ? c : '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('') });
        await wait(40);
      }
    }, 220);
  }

  endpoints(k, tr) {
    const st = this.state, t = this.t();
    const last = st.exp[st.exp.length - 1];
    const EP = {
      brev: [
        ['POST', '/api/links', 'b0', st.bCode ? '201 Created' : '—', st.bCode ? `{\n  "code": "${st.bCode}",\n  "short_url": "brev/${st.bCode}",\n  "target": "${st.bUrl}"\n}` : '# pulsa ejecutar', () => this.runBrev()],
        ['GET', '/{code}', 'b1', st.bCode ? '307 Temporary Redirect' : '404 Not Found', st.bCode ? `location: ${st.bUrl}\nclicks: ${st.bClicks}` : '{"detail": "link not found"}', () => this.visitBrev()],
      ],
      slate: [
        ['POST', '/groups/42/expenses', 's0', last ? '201 Created' : '—', last ? `{\n  "paid_by": "${last.who}",\n  "amount": ${last.amt.toFixed(2)},\n  "per_person": ${(last.amt / 3).toFixed(2)}\n}` : '[]', () => this.addExpense()],
        ['GET', '/groups/42/balances', 's1', '200 OK', `{\n  "settle": [${tr.map(([a, b, m]) => `\n    {"from": "${a}", "to": "${b}", "amount": ${m.toFixed(2)}}`).join(',')}${tr.length ? '\n  ' : ''}]\n}`, () => {}],
      ],
      latch: [
        ['PUT', '/vault/items/1', 'l0', '204 No Content', `{\n  "ciphertext": "${(st.lCipher || '').slice(0, 32)}…",\n  "iv": "${st.lIv}"\n}`, () => this.encrypt()],
        ['GET', '/vault/items', 'l1', '200 OK', `{\n  "items": [{"id": 1, "ciphertext": "${(st.lCipher || '').slice(0, 20)}…"}],\n  "server_knows_key": false\n}`, () => {}],
      ],
    };
    return EP[k].map(([method, path, s, status, res, act], i) => {
      const id = k + i, open = st.openEp === id;
      return {
        id, method, path, summary: t.sum[s], open, status, res,
        toggle: () => { this.setState({ openEp: open ? null : id }); if (!open) { act(); this.flash(k); } },
        run: () => { act(); this.flash(k); },
      };
    });
  }

  render() {
    const t = this.t(), st = this.state, lang = this.props.lang;
    const { bal, tr } = balances(st.exp);
    const mx = Math.max(1, ...PEOPLE.map(p => Math.abs(bal[p])));
    const eur = v => Math.abs(v).toFixed(2).replace('.', lang === 'es' ? ',' : '.') + ' €';
    const urls = { brev: this.props.brevUrl || GITHUB_URL, slate: this.props.slateUrl || GITHUB_URL, latch: this.props.latchUrl || GITHUB_URL };
    const bFs = st.bCode ? 40 : (st.bDisplay.length > 30 ? 13 : st.bDisplay.length > 12 ? 20 : 30);
    const settle = tr.length ? tr.map(([a, b, m]) => `${cap(a)} → ${cap(b)}  ${eur(m)}`) : [t.settled];

    return (
      <div style={{ background: '#0b0c0a', color: '#f3efe6', padding: '96px 5vw 120px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', paddingBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, font: "400 clamp(56px,8vw,128px)/.9 'Instrument Serif',serif", letterSpacing: '-.02em' }}>{t.title}</h2>
          </div>
          <div style={{ font: `400 13px/1.5 ${mono}`, color: 'rgba(243,239,230,.65)', maxWidth: 380 }}>{t.intro}</div>
        </div>

        <div ref={this.pBrev} data-p="brev" style={rowStyle}>
          <DocsColumn label="Brev" name={this.nameLetters('Brev', 'brev', 2)} url={urls.brev} desc={t.brevDesc} endpoints={this.endpoints('brev', tr)} t={t} />
          <DemoPanel flash={st.flash === 'brev'} title="POST /api/links" badge={t.sim}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={st.bUrl} onChange={e => this.setState({ bUrl: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') this.runBrev(); }} spellCheck="false" className="f-lime" style={{ ...inputStyle, flex: 1, minWidth: 0, color: '#f3efe6', padding: 12 }} />
                <button onClick={() => this.runBrev()} style={{ background: '#c6f24e', color: '#0b0c0a', border: 0, padding: '0 16px', font: `600 13px/1 ${mono}`, cursor: 'pointer' }}>{t.shorten}</button>
              </div>
              <div style={{ minHeight: 110, border: '1px dashed rgba(198,242,78,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: mono, fontSize: bFs, lineHeight: 1.2, color: st.bCode ? '#c6f24e' : '#f3efe6', wordBreak: 'break-all', textAlign: 'center', transition: 'font-size .25s' }}>{st.bDisplay || '—'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, font: `400 12px/1.5 ${mono}`, minHeight: 72 }}>
                {st.bLog.map((lg, i) => <div key={i} style={{ color: lg.c }}>{lg.txt}</div>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(198,242,78,.2)', paddingTop: 14, font: `500 12px/1 ${mono}` }}>
                <span style={{ color: 'rgba(243,239,230,.65)' }}>clicks: <span style={{ color: '#c6f24e' }}>{st.bClicks}</span></span>
                <button onClick={() => this.visitBrev()} className="h-fill" style={{ background: 'transparent', border: '1px solid #c6f24e', color: '#c6f24e', padding: '8px 12px', font: 'inherit', cursor: 'pointer', opacity: st.bCode ? 1 : 0.35 }}>{t.visit}</button>
              </div>
            </div>
          </DemoPanel>
        </div>

        <div ref={this.pSlate} data-p="slate" style={rowStyle}>
          <DocsColumn label="Slate" name={this.nameLetters('Slate', 'slate', 2)} url={urls.slate} desc={t.slateDesc} endpoints={this.endpoints('slate', tr)} t={t} />
          <DemoPanel flash={st.flash === 'slate'} title="GET /groups/42/balances" badge={t.sim}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', font: `500 12px/1 ${mono}` }}>
                <span style={{ color: 'rgba(243,239,230,.6)' }}>{t.paid}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {PEOPLE.map(p => (
                    <button key={p} onClick={() => this.setState({ payer: p })} style={{ border: '1px solid #c6f24e', padding: '7px 10px', font: 'inherit', cursor: 'pointer', background: st.payer === p ? '#c6f24e' : 'transparent', color: st.payer === p ? '#0b0c0a' : '#c6f24e' }}>{cap(p)}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[12, 30, 48].map(a => (
                    <button key={a} onClick={() => this.setState({ amount: a })} style={{ border: '1px solid rgba(243,239,230,.35)', padding: '7px 10px', font: 'inherit', cursor: 'pointer', background: st.amount === a ? '#f3efe6' : 'transparent', color: st.amount === a ? '#0b0c0a' : '#f3efe6' }}>{a}€</button>
                  ))}
                </div>
                <button onClick={() => this.addExpense()} style={{ background: '#c6f24e', color: '#0b0c0a', border: 0, padding: '8px 12px', font: `600 12px/1 ${mono}`, cursor: 'pointer' }}>{t.add}</button>
                <button onClick={() => this.setState({ exp: [] })} style={{ background: 'transparent', color: 'rgba(243,239,230,.6)', border: 0, padding: '8px 4px', font: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>reset</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, font: `400 12px/1.5 ${mono}`, color: 'rgba(243,239,230,.7)', minHeight: 84 }}>
                {st.exp.slice(-4).map(e => (
                  <div key={e.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span>{cap(e.who)} · {t.concepts[e.k % t.concepts.length]}</span><span style={{ color: '#f3efe6' }}>{eur(e.amt)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(198,242,78,.2)', paddingTop: 14 }}>
                {PEOPLE.map(p => {
                  const v = bal[p];
                  return (
                    <div key={p} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) 84px', alignItems: 'center', gap: 10, font: `500 12px/1 ${mono}` }}>
                      <span>{cap(p)}</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderRight: '1px solid rgba(243,239,230,.4)' }}>
                          <div style={{ height: '100%', background: '#f3efe6', width: `${v < 0 ? Math.abs(v) / mx * 100 : 0}%`, transition: 'width .5s cubic-bezier(.2,.8,.2,1)' }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                          <div style={{ height: '100%', background: '#c6f24e', width: `${v > 0 ? v / mx * 100 : 0}%`, transition: 'width .5s cubic-bezier(.2,.8,.2,1)' }} />
                        </div>
                      </div>
                      <span style={{ textAlign: 'right', color: v > 0 ? '#c6f24e' : '#f3efe6' }}>{(v > 0 ? '+' : v < 0 ? '−' : '') + eur(v)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, font: `500 12px/1.5 ${mono}`, color: '#c6f24e' }}>
                {settle.map(s => <div key={s}>{s}</div>)}
              </div>
            </div>
          </DemoPanel>
        </div>

        <div ref={this.pLatch} data-p="latch" style={{ ...rowStyle, borderBottom: '1px solid rgba(198,242,78,.3)' }}>
          <DocsColumn label="Latch" name={this.nameLetters('Latch', 'latch', 3)} url={urls.latch} desc={t.latchDesc} endpoints={this.endpoints('latch', tr)} t={t} />
          <DemoPanel flash={st.flash === 'latch'} title="AES-256-GCM · PBKDF2" badge={t.real}>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ font: `500 11px/1 ${mono}`, color: '#c6f24e' }}>{t.browser}</div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, font: `400 11px/1 ${mono}`, color: 'rgba(243,239,230,.6)' }}>
                  master password
                  <input value={st.lMaster} onChange={e => { this.setState({ lMaster: e.target.value }); this.encrypt(); }} spellCheck="false" className="f-lime" style={{ ...inputStyle, padding: 10 }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, font: `400 11px/1 ${mono}`, color: 'rgba(243,239,230,.6)' }}>
                  {t.secret}
                  <input value={st.lSecret} onChange={e => { this.setState({ lSecret: e.target.value }); this.encrypt(); }} spellCheck="false" className="f-lime" style={{ ...inputStyle, padding: 10 }} />
                </label>
                <div style={{ font: `400 11px/1.5 ${mono}`, color: 'rgba(243,239,230,.55)' }}>{t.keyNote}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderLeft: '1px dashed rgba(198,242,78,.35)', paddingLeft: 16, minWidth: 0 }}>
                <div style={{ font: `500 11px/1 ${mono}`, color: '#f3efe6' }}>{t.server}</div>
                <div style={{ font: `400 12px/1.5 ${mono}`, color: '#c6f24e', wordBreak: 'break-all', minHeight: 96 }}>{st.lCipher || '…'}</div>
                <div style={{ font: `400 11px/1.5 ${mono}`, color: 'rgba(243,239,230,.6)', wordBreak: 'break-all' }}>iv: {st.lIv || '…'}</div>
                <div style={{ font: `400 11px/1.5 ${mono}`, color: 'rgba(243,239,230,.6)' }}>master_key: <span style={{ color: '#f3efe6' }}>null</span></div>
              </div>
            </div>
          </DemoPanel>
        </div>
      </div>
    );
  }
}
