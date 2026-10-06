import { Component, createRef } from 'react';
import { GITHUB_URL } from '../config.js';

const PAL = { fg: 'oklch(0.88 0.1 125)', dim: 'oklch(0.64 0.07 125)', acc: '#c6f24e', ok: '#f3efe6', err: 'oklch(0.72 0.19 35)' };

const S = {
  es: {
    help: ['comandos:', '  whoami            quién soy', '  projects          mis proyectos (con enlace)', '  open <proyecto>   abrir brev | slate | latch', '  curl <proyecto>   llamar a su API (simulado)', '  gcc main.c        compilar como en los viejos tiempos', '  snake             ya sabes', '  cat about.txt     sobre mí', '  sudo …            inténtalo', '  clear · history · lang en · date'],
    who: ['Jorge Muñiz — Backend Engineer', '4º de Ingeniería Informática.', 'Empecé con C y C++. Ahora me especializo en backend con Python: FastAPI, SQLAlchemy.'],
    about: ['# about.txt', 'Me gusta entender qué pasa por debajo: memoria, punteros, syscalls.', 'Eso lo aprendí con C/C++. Ahora lo aplico diseñando APIs en Python.', 'Stack actual: Python · FastAPI · SQLAlchemy · SQLite · React (front).'],
    brev: 'Acortador de enlaces', slate: 'Gastos en grupo, quién debe cuánto', latch: 'Gestor de contraseñas zero-knowledge',
    open: 'abrir ↗', opening: 'abriendo', usage: 'uso: curl brev | slate | latch', projHint: 'prueba: open brev · curl latch',
    nf: 'comando no encontrado', tryHelp: "prueba 'help'", warn: "main.c:4:10: warning: unused variable 'tiempo_libre' [-Wunused-variable]",
    segHint: '// por eso ahora escribo Python.', sudoNo: 'visitor is not in the sudoers file. This incident will be reported.',
    sudoYes: 'vale, tú ganas. acceso root concedido.', sudoHint: "pista: ahora prueba 'rm -rf /'", rmNo: 'rm: permiso denegado (prueba sudo primero)',
    rmJoke: '…es broma. Todo sigue en su sitio.', exit: 'no puedes irte todavía. escribe projects.', snakeHelp: 'snake — flechas / WASD · q para salir',
    over: 'game over · puntos', record: 'nuevo récord', pyHint: 'aquí no hay intérprete de Python, pero mis APIs sí lo usan: prueba curl brev.',
    boot: ['JM-BIOS v4.0  (c) 2026', 'memory test ............ 16384K OK', 'mounting /home/jorge .... ok', 'starting uvicorn ........ ok', '', 'Jorge Muñiz — Backend Engineer (Python)', "escribe 'help' o pulsa un comando de abajo."],
  },
  en: {
    help: ['commands:', '  whoami            who I am', '  projects          my projects (with links)', '  open <project>    open brev | slate | latch', '  curl <project>    call its API (simulated)', '  gcc main.c        compile like the old days', '  snake             you know', '  cat about.txt     about me', '  sudo …            give it a try', '  clear · history · lang es · date'],
    who: ['Jorge Muñiz — Backend Engineer', '4th year, Computer Engineering.', 'Started with C and C++. Now specialising in Python backend: FastAPI, SQLAlchemy.'],
    about: ['# about.txt', 'I like knowing what happens underneath: memory, pointers, syscalls.', 'C/C++ taught me that. Now I apply it designing APIs in Python.', 'Current stack: Python · FastAPI · SQLAlchemy · SQLite · React (front).'],
    brev: 'Link shortener', slate: 'Group expenses, who owes whom', latch: 'Zero-knowledge password manager',
    open: 'open ↗', opening: 'opening', usage: 'usage: curl brev | slate | latch', projHint: 'try: open brev · curl latch',
    nf: 'command not found', tryHelp: "try 'help'", warn: "main.c:4:10: warning: unused variable 'free_time' [-Wunused-variable]",
    segHint: "// that's why I write Python now.", sudoNo: 'visitor is not in the sudoers file. This incident will be reported.',
    sudoYes: 'fine, you win. root access granted.', sudoHint: "hint: now try 'rm -rf /'", rmNo: 'rm: permission denied (try sudo first)',
    rmJoke: '…just kidding. Everything is still there.', exit: "you can't leave yet. type projects.", snakeHelp: 'snake — arrows / WASD · q to quit',
    over: 'game over · score', record: 'new record', pyHint: 'no Python interpreter here, but my APIs run on it: try curl brev.',
    boot: ['JM-BIOS v4.0  (c) 2026', 'memory test ............ 16384K OK', 'mounting /home/jorge .... ok', 'starting uvicorn ........ ok', '', 'Jorge Muñiz — Backend Engineer (Python)', "type 'help' or click a command below."],
  },
};

const API = {
  brev: { m: 'POST', path: '/api/links', body: '{"url": "https://github.com/i32mumaj"}', st: '201 Created', res: ['{', '  "code": "x7Kq2",', '  "short_url": "/x7Kq2",', '  "target": "https://github.com/i32mumaj",', '  "clicks": 0', '}'] },
  slate: { m: 'GET', path: '/api/groups/42/balances', st: '200 OK', res: ['{', '  "group": "piso-2026",', '  "settle": [', '    {"from": "ana",   "to": "jorge", "amount": 12.50},', '    {"from": "marco", "to": "jorge", "amount": 7.25}', '  ]', '}'] },
  latch: { m: 'GET', path: '/api/vault/items', st: '200 OK', res: ['{', '  "items": [', '    {"id": 1, "ciphertext": "9f3a…c21e", "nonce": "b81d…"},', '    {"id": 2, "ciphertext": "44e0…7a9b", "nonce": "0c3f…"}', '  ],', '  "server_knows_master_key": false', '}'] },
};

const CHIPS = ['help', 'whoami', 'projects', 'curl brev', 'curl slate', 'curl latch', 'gcc main.c', 'snake', 'sudo su'];
const COMPLETIONS = ['help', 'whoami', 'projects', 'open brev', 'open slate', 'open latch', 'curl brev', 'curl slate', 'curl latch', 'gcc main.c', 'snake', 'sudo su', 'cat about.txt', 'cat main.c', 'clear', 'history', 'rm -rf /'];
const C_SRC = ['#include <stdio.h>', '', 'int main(void) {', '    int tiempo_libre = 0;', '    char *name = "Jorge Muñiz";', '    printf("hola, soy %s\\n", name);', '    return *(int *)0;  /* oops */', '}'];
const PROMPT = 'jorge@portfolio:~$ ';
const SNAKE_CELL = 2;

export default class Terminal extends Component {
  state = { lang: null, langFrom: null, lines: [], input: '', busy: false, snake: false };
  scrollRef = createRef(); inputRef = createRef(); snakeRef = createRef();

  // A `lang` typed in the terminal wins until the page-level language changes again.
  lang() {
    const { lang, langFrom } = this.state;
    return (lang && langFrom === this.props.lang ? lang : this.props.lang) || 'es';
  }
  S() { return S[this.lang()] || S.es; }
  url(k) { return this.props[k + 'Url'] || GITHUB_URL; }

  // Resolves after `ms`, or rejects if the terminal was reset meanwhile.
  w(ms) {
    const t = this._tok;
    return new Promise((res, rej) => setTimeout(() => (t === this._tok ? res() : rej('cancel')), ms));
  }
  out(text, role = 'fg', extra = {}) {
    const id = ++this._id;
    this.setState(s => ({ lines: [...s.lines, { id, text, role, ...extra }].slice(-300) }));
  }
  setLast(text, role) {
    this.setState(s => {
      const l = s.lines.slice(), last = l[l.length - 1];
      if (last) l[l.length - 1] = { ...last, text, role: role ?? last.role };
      return { lines: l };
    });
  }
  async many(arr, role = 'fg', d = 30) { for (const x of arr) { this.out(x, role); await this.w(d); } }
  focus() { setTimeout(() => { const el = this.inputRef.current; if (el) el.focus({ preventScroll: true }); }, 0); }

  componentDidMount() {
    this._id = 0; this._tok = 0; this._hist = []; this._hi = 0; this._sudo = 0; this._root = false; this._booted = false;
    this._key = e => this.snakeKey(e);
    window.addEventListener('keydown', this._key);
  }

  componentWillUnmount() {
    this._tok++;
    clearInterval(this._sn);
    window.removeEventListener('keydown', this._key);
  }

  componentDidUpdate(pp) {
    const L = this.lang();
    if (this._lastL && L !== this._lastL && this._booted) {
      this._lastL = L;
      this.reboot();
      return;
    }
    this._lastL = L;
    if (this.props.open && !pp.open) {
      if (!this._booted) { this._booted = true; this.boot(); }
      this.focus();
    }
    const el = this.scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  reboot() {
    this._tok++;
    clearInterval(this._sn);
    this._g = null;
    this.setState({ lines: [], snake: false, busy: false, input: '' }, () => this.boot());
  }

  async boot() {
    this.setState({ busy: true });
    try {
      for (const l of this.S().boot) {
        this.out(l, l.startsWith('Jorge') ? 'acc' : l.includes('ok') || l.includes('OK') ? 'fg' : 'dim');
        await this.w(l ? 170 : 90);
      }
      this.setState({ busy: false });
      this.focus();
    } catch { /* cancelled */ }
  }

  async run(raw) {
    const cmd = raw.trim();
    this.out(raw, 'fg', { pre: PROMPT, preRole: 'acc' });
    this.setState({ input: '' });
    if (!cmd) return;
    this._hist.push(cmd); this._hi = this._hist.length;
    this.setState({ busy: true });
    try { await this.sh(cmd); } catch (e) { if (e !== 'cancel') console.error(e); return; }
    if (!this.state.snake) { this.setState({ busy: false }); this.focus(); }
  }

  async sh(cmd) {
    const S = this.S();
    const [c0, ...args] = cmd.split(/\s+/);
    const c = c0.toLowerCase(), a = args.join(' ').toLowerCase();
    switch (c) {
      case 'help': return this.many(S.help, 'fg', 18);
      case 'whoami': return this.many(S.who, 'fg', 40);
      case 'ls': if (a.startsWith('proj')) return this.projects(); return this.out('about.txt   main.c   projects/   snake*', 'acc');
      case 'cat':
        if (a.includes('about')) return this.many(S.about, 'fg', 30);
        if (a.includes('main')) return this.many(C_SRC, 'dim', 20);
        return this.out(`cat: ${a || '?'}: No such file or directory`, 'err');
      case 'projects': case 'cd': return this.projects();
      case 'open': return this.open(a);
      case 'curl': case 'http': case 'httpie': return this.curl(a);
      case 'gcc': case 'cc': case 'g++': case 'make': case 'clang': return this.gcc();
      case './jorge': case './a.out':
        this.out('hola, soy Jorge Muñiz', 'ok'); await this.w(500); this.out('Segmentation fault (core dumped)', 'err'); return;
      case 'snake': return this.startSnake();
      case 'sudo': return this.sudo();
      case 'su': return this.sudo();
      case 'rm': return this.rm(a);
      case 'clear': case 'cls': this.setState({ lines: [] }); return;
      case 'echo': return this.out(args.join(' '));
      case 'date': return this.out(new Date().toString());
      case 'history': return this.many(this._hist.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`), 'dim', 10);
      case 'lang':
        if (a === 'es' || a === 'en') { this.setState({ lang: a, langFrom: this.props.lang }); return this.out(`lang = ${a}`, 'ok'); }
        return this.out('lang es | en', 'dim');
      case 'exit': case 'logout': return this.out(S.exit, 'acc');
      case 'python': case 'python3': return this.out(S.pyHint, 'dim');
      case 'vim': case 'nano': case 'emacs': return this.out(':q!', 'dim');
      default: this.out(`${c0}: ${S.nf}. ${S.tryHelp}`, 'err');
    }
  }

  async projects() {
    const S = this.S();
    for (const k of ['brev', 'slate', 'latch']) {
      this.out(`  ${k.padEnd(7)} ${S[k]}  ·  FastAPI, SQLAlchemy, SQLite  `, 'fg', { href: this.url(k), linkText: S.open });
      await this.w(80);
    }
    this.out(S.projHint, 'dim');
  }

  pick(a) { return ['brev', 'slate', 'latch'].find(k => a.includes(k)); }

  async open(a) {
    const S = this.S(), k = this.pick(a);
    if (!k) return this.out('open brev | slate | latch', 'dim');
    this.out(`${S.opening} ${this.url(k)} …`, 'ok');
    window.open(this.url(k), '_blank', 'noopener');
  }

  async curl(a) {
    const S = this.S(), k = this.pick(a);
    if (!k) return this.out(S.usage, 'dim');
    const r = API[k];
    const req = [`> ${r.m} ${r.path} HTTP/1.1`, '> Host: localhost:8000', '> Accept: application/json']
      .concat(r.body ? ['> Content-Type: application/json', '>', `> ${r.body}`] : ['>']);
    await this.many(req, 'dim', 45);
    this.out('… ', 'dim');
    for (let i = 0; i < 6; i++) { await this.w(70); this.setLast('… ' + '·'.repeat(i + 1)); }
    const ms = (2 + Math.random() * 6).toFixed(1);
    this.setLast(`< HTTP/1.1 ${r.st}  (${ms} ms)`, 'ok');
    this.out('< content-type: application/json', 'dim');
    this.out('<', 'dim');
    await this.many(r.res, 'acc', 35);
    this.out('', 'fg', { href: this.url(k), linkText: `→ ${k} ${S.open}` });
  }

  async gcc() {
    const S = this.S();
    this.out('gcc -Wall -O2 main.c -o jorge', 'dim');
    this.out('', 'fg');
    for (let i = 0; i <= 20; i++) { this.setLast(`[${'#'.repeat(i)}${'.'.repeat(20 - i)}] ${i * 5}%`, 'fg'); await this.w(45); }
    this.out(S.warn, 'acc'); await this.w(250);
    this.out('./jorge', 'dim'); await this.w(300);
    this.out('hola, soy Jorge Muñiz', 'ok'); await this.w(700);
    this.out('Segmentation fault (core dumped)', 'err'); await this.w(600);
    this.out(S.segHint, 'dim');
  }

  async sudo() {
    const S = this.S();
    this._sudo++;
    this.out('[sudo] password for visitor: ', 'fg');
    for (let i = 1; i <= 6; i++) { await this.w(90); this.setLast('[sudo] password for visitor: ' + '*'.repeat(i)); }
    await this.w(400);
    if (this._sudo < 3) return this.out(S.sudoNo, 'err');
    this._root = true;
    this.out(S.sudoYes, 'ok');
    this.out(S.sudoHint, 'dim');
  }

  async rm(a) {
    const S = this.S();
    if (!a.includes('-rf') && !a.includes('-fr')) return this.out('rm: missing operand', 'err');
    if (!this._root) return this.out(S.rmNo, 'err');
    for (const f of ['/usr/bin/gcc', '/usr/lib/libc.so.6', '/home/jorge/tfg/', '/home/jorge/.bash_history', '/etc/passwd', '/var/lib/sqlite/brev.db', '/var/lib/sqlite/slate.db', '/boot/vmlinuz']) {
      this.out(`removed '${f}'`, 'err');
      await this.w(110);
    }
    await this.w(700);
    this.out(S.rmJoke, 'ok');
  }

  startSnake() {
    this.out(this.S().snakeHelp, 'dim');
    this._g = { W: 22, H: 14, s: [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }], d: { x: 1, y: 0 }, nd: { x: 1, y: 0 }, f: { x: 16, y: 5 }, sc: 0 };
    this.setState({ snake: true, busy: true });
    clearInterval(this._sn);
    this._sn = setInterval(() => this.snakeStep(), 105);
    return new Promise(res => { this._snakeDone = res; });
  }

  snakeKey(e) {
    if (!this.state.snake || !this._g) return;
    const k = e.key.toLowerCase(), g = this._g;
    const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
    if (k === 'q' || k === 'escape') { e.preventDefault(); this.snakeEnd(); return; }
    if (map[k]) {
      e.preventDefault();
      const [x, y] = map[k];
      if (x !== -g.d.x || y !== -g.d.y) g.nd = { x, y };
    }
  }

  snakeStep() {
    const g = this._g;
    if (!g) return;
    g.d = g.nd;
    const h = { x: g.s[0].x + g.d.x, y: g.s[0].y + g.d.y };
    if (h.x < 0 || h.y < 0 || h.x >= g.W || h.y >= g.H || g.s.some(p => p.x === h.x && p.y === h.y)) { this.snakeEnd(); return; }
    g.s.unshift(h);
    if (h.x === g.f.x && h.y === g.f.y) {
      g.sc++;
      do { g.f = { x: Math.floor(Math.random() * g.W), y: Math.floor(Math.random() * g.H) }; } while (g.s.some(p => p.x === g.f.x && p.y === g.f.y));
    } else g.s.pop();
    const el = this.snakeRef.current;
    if (!el) return;
    // ASCII only (VT323 draws box-drawing glyphs wider), two chars per cell so cells are square.
    const edge = '+' + '-'.repeat(g.W * SNAKE_CELL) + '+';
    const rows = [`score ${String(g.sc).padStart(3, '0')}`, edge];
    for (let y = 0; y < g.H; y++) {
      let r = '|';
      for (let x = 0; x < g.W; x++) {
        const i = g.s.findIndex(p => p.x === x && p.y === y);
        r += i === 0 ? '@@' : i > 0 ? '[]' : (g.f.x === x && g.f.y === y) ? '<>' : '  ';
      }
      rows.push(r + '|');
    }
    rows.push(edge);
    el.textContent = rows.join('\n');
    const sc = this.scrollRef.current;
    if (sc) sc.scrollTop = sc.scrollHeight;
  }

  snakeEnd() {
    clearInterval(this._sn);
    const g = this._g;
    this._g = null;
    if (!g) return;
    const S = this.S();
    let best = 0;
    try { best = +localStorage.getItem('jm_snake_best') || 0; } catch { /* storage unavailable */ }
    this.setState({ snake: false, busy: false });
    this.out(`${S.over} ${g.sc}`, 'acc');
    if (g.sc > best) {
      try { localStorage.setItem('jm_snake_best', String(g.sc)); } catch { /* storage unavailable */ }
      if (g.sc > 0) this.out(`${S.record}: ${g.sc}`, 'ok');
    }
    this.focus();
    if (this._snakeDone) { this._snakeDone(); this._snakeDone = null; }
  }

  complete() {
    const v = this.state.input, hit = COMPLETIONS.filter(w => w.startsWith(v));
    if (hit.length === 1) this.setState({ input: hit[0] });
    else if (hit.length > 1) this.out(hit.join('   '), 'dim');
  }

  async typeIn(cmd) {
    if (this.state.busy) return;
    this.setState({ busy: true });
    const tok = this._tok;
    for (let i = 1; i <= cmd.length; i++) {
      this.setState({ input: cmd.slice(0, i) });
      await new Promise(r => setTimeout(r, 22));
      if (tok !== this._tok) return;
    }
    this.setState({ busy: false }, () => this.run(cmd));
  }

  onKey = e => {
    if (this.state.busy) return;
    if (e.key === 'Enter') { e.preventDefault(); this.run(this.state.input); }
    else if (e.key === 'Tab') { e.preventDefault(); this.complete(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (this._hi > 0) { this._hi--; this.setState({ input: this._hist[this._hi] || '' }); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (this._hi < this._hist.length) { this._hi++; this.setState({ input: this._hist[this._hi] || '' }); } }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); this.setState({ lines: [] }); }
  };

  render() {
    const { lines, input, busy, snake } = this.state;
    const showInput = !busy || (!snake && input.length > 0);
    return (
      <div style={{ height: '100%', minHeight: 0, background: '#0b0c0a', padding: '24px 5vw 40px', display: 'flex' }}>
        <div onClick={() => this.focus()} style={{ flex: 1, minWidth: 0, position: 'relative', borderRadius: 24, background: '#0d0f0b', boxShadow: 'inset 0 0 140px rgba(0,0,0,.85),0 0 0 12px #16190f,0 0 0 13px #2c3320', overflow: 'hidden', display: 'flex', flexDirection: 'column', font: "400 23px/1.22 'VT323',monospace", color: PAL.fg, textShadow: '0 0 7px oklch(0.88 0.1 125 / .45)' }}>
          <div ref={this.scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '30px 36px 12px', scrollbarWidth: 'none' }}>
            {lines.map(ln => (
              <div key={ln.id} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '1.22em', color: PAL[ln.role] || PAL.fg }}>
                <span style={{ color: PAL[ln.preRole] || PAL.acc }}>{ln.pre || ''}</span>
                {ln.text}
                {ln.href && <a href={ln.href} target="_blank" rel="noopener" style={{ color: '#c6f24e' }}>{ln.linkText}</a>}
              </div>
            ))}
            {snake && <pre ref={this.snakeRef} style={{ margin: '6px 0', font: 'inherit', lineHeight: '18px', color: '#c6f24e' }} />}
            {showInput && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ color: '#c6f24e', whiteSpace: 'nowrap' }}>jorge@portfolio:~$</span>
                <input ref={this.inputRef} value={input} onChange={e => this.setState({ input: e.target.value })} onKeyDown={this.onKey} spellCheck="false" autoComplete="off" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: 'inherit', font: 'inherit', textShadow: 'inherit', caretColor: '#c6f24e', padding: 0 }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', padding: '12px 36px 16px', borderTop: '1px dashed oklch(0.88 0.1 125 / .3)', fontSize: 19 }}>
            {CHIPS.map(label => (
              <button key={label} onClick={e => { e.stopPropagation(); this.typeIn(label); }} className="h-chip" style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', color: PAL.dim, textShadow: 'inherit' }}>[{label}]</button>
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,.28) 3px)' }} />
        </div>
      </div>
    );
  }
}
