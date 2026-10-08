import { Component, createRef } from 'react';
import { clamp01, hash } from '../lib/util.js';

const T = {
  es: { from: 'C / C++', to: 'Python', role: 'Backend Engineer', dDown: 'BAJA', dDone: 'compilado ✓', dScroll: 'HAZ SCROLL PARA COMPILARME', dHint: 'scroll = compilar la memoria · ratón = decodificar · click = malloc() · shift+click = free()' },
  en: { from: 'C / C++', to: 'Python', role: 'Backend Engineer', dDown: 'SCROLL DOWN', dDone: 'compiled ✓', dScroll: 'SCROLL TO COMPILE ME', dHint: 'scroll = compile the memory · mouse = decode · click = malloc() · shift+click = free()' },
};

const CODES = [
  ['#include <stdio.h>', '', 'int main(void) {', '    char *name = "Jorge Muñiz";', '    printf("hola, soy %s\\n", name);', '    return 0;', '}', ''],
  ['#include <iostream>', '#include <string>', '', 'int main() {', '    std::string name{"Jorge Muñiz"};', '    std::cout << "hola, soy " << name;', '    return 0;', '}'],
  ['from fastapi import FastAPI', '', 'app = FastAPI()', '', '@app.get("/jorge")', 'async def jorge():', '    return {"role": "backend",', '            "lang": "python"}'],
];

const SCROLL_PX = 2800;
const MSG = 'JORGE MUÑIZ // BACKEND ENGINEER // PYTHON . FASTAPI . SQLALCHEMY // FORMERLY C & C++ // BREV . SLATE . LATCH // ';
const GLITCH = '!<>-_/[]{}=+*^?#01;:';

function morph(a, b, t, li) {
  const L = Math.max(a.length, b.length);
  let out = '';
  for (let k = 0; k < L; k++) {
    const th = hash(k, li) * 0.6, lt = (t - th) / 0.4;
    out += lt <= 0 ? (a[k] ?? ' ') : lt >= 1 ? (b[k] ?? ' ') : GLITCH[Math.floor(hash(k, li * 31 + Math.floor(t * 30)) * GLITCH.length)];
  }
  return out.replace(/\s+$/, '');
}

function drawName(g, F, x, y1, y2, draw) {
  let maxW = 0, end2 = x;
  [['JORGE', y1, 0, 0], ['MUÑIZ', y2, 1, F * 0.3]].forEach(([word, y, li, indent]) => {
    let cx = x + indent;
    [...word].forEach((ch, k) => {
      const pix = (li === 0 && k === 1) || (li === 1 && k === 2);
      const sz = F * (pix ? 1.08 : 1.32) * (0.97 + hash(k, li + 11) * 0.06);
      g.font = pix ? `400 ${sz}px VT323, monospace` : `${li ? 'italic ' : ''}400 ${sz}px 'Instrument Serif', serif`;
      const w = g.measureText(ch).width;
      if (draw) {
        g.save();
        g.translate(cx + w / 2, y + (hash(k, li + 5) - 0.5) * F * 0.06);
        g.rotate((hash(k, li + 2) - 0.5) * 0.07);
        g.textAlign = 'left';
        g.fillText(ch, -w / 2, 0);
        g.restore();
      }
      cx += w * 0.95;
    });
    maxW = Math.max(maxW, cx - x);
    if (li === 1) end2 = cx;
  });
  return { maxW, end2 };
}

function buildName(W, H, dpr, fs, x, y1, y2) {
  const cv = document.createElement('canvas');
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = '#c6f24e'; g.textAlign = 'left'; g.textBaseline = 'middle';
  const endX = drawName(g, fs, x, y1, y2, true).end2, top = y1 - fs * 0.8, bot = y2 + fs * 0.8;
  g.globalCompositeOperation = 'destination-out';
  g.font = "600 10px 'Geist Mono', monospace"; g.textAlign = 'center';
  for (let yy = top; yy < bot; yy += 14) for (let xx = x; xx < endX + fs; xx += 18) {
    const k = hash(Math.floor(xx), Math.floor(yy));
    g.globalAlpha = 0.25 + k * 0.45;
    g.fillText(Math.floor(k * 256).toString(16).padStart(2, '0'), xx, yy);
  }
  g.globalAlpha = 0.5;
  for (let yy = top; yy < bot; yy += 4) g.fillRect(x - 10, yy, endX - x + fs, 1);
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  return { cv, dpr, fs, x, y1, y2, endX, top, bot };
}

export default class Hero extends Component {
  state = { p: 0 };
  canvasRef = createRef();
  ptrRef = createRef();

  componentDidMount() {
    this._mx = -9999; this._my = -9999;
    this._pt = 0; this._pd = 0;
    this._onMove = e => { this._mx = e.clientX; this._my = e.clientY; };
    this._onDown = e => this.down(e);
    this._onWheel = e => this.wheel(e);
    this._onTS = e => { this._ty = e.touches[0].clientY; };
    this._onTM = e => this.touchMove(e);
    window.addEventListener('mousemove', this._onMove);
    window.addEventListener('mousedown', this._onDown);
    window.addEventListener('wheel', this._onWheel, { passive: false });
    window.addEventListener('touchstart', this._onTS, { passive: true });
    window.addEventListener('touchmove', this._onTM, { passive: false });
    if (document.fonts) {
      document.fonts.ready.then(() => { this._hw = -1; });
      Promise.all([document.fonts.load('40px VT323'), document.fonts.load("italic 40px 'Instrument Serif'"), document.fonts.load("40px 'Instrument Serif'")])
        .then(() => { this._hw = -1; }).catch(() => {});
    }
    const loop = ts => {
      this._raf = requestAnimationFrame(loop);
      try { this.tick(ts); } catch (e) { console.error(e); }
    };
    this._raf = requestAnimationFrame(loop);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('mousemove', this._onMove);
    window.removeEventListener('mousedown', this._onDown);
    window.removeEventListener('wheel', this._onWheel);
    window.removeEventListener('touchstart', this._onTS);
    window.removeEventListener('touchmove', this._onTM);
  }

  wheel(e) {
    if (e.target && e.target.closest && e.target.closest('[data-nohijack]')) return;
    if (window.scrollY > 2) return;
    const dy = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 600 : 1);
    if (!this.captures(dy)) return;
    e.preventDefault();
    this.advance(dy);
  }

  touchMove(e) {
    const y = e.touches[0].clientY, dy = (this._ty - y) * 2;
    if (window.scrollY > 2 || !this.captures(dy)) return;
    e.preventDefault();
    this.advance(dy);
    this._ty = y;
  }

  // The hero keeps the scroll until progress hits an end; at 100% it holds briefly so inertia doesn't skip past.
  captures(dy) {
    if (dy > 0) return this._pt < 1 || performance.now() < (this._holdUntil || 0);
    return this._pt > 0;
  }

  advance(dy) {
    const before = this._pt;
    this._pt = clamp01(before + Math.max(-120, Math.min(120, dy)) / SCROLL_PX);
    if (this._pt >= 1 && before < 1) this._holdUntil = performance.now() + 500;
  }

  down(e) {
    if (e.target !== this.canvasRef.current || !this._heap) return;
    const rc = e.target.getBoundingClientRect();
    this._heap.ripples.push({ x: e.clientX - rc.left, y: e.clientY - rc.top, r: 0, free: e.shiftKey, done: new Uint8Array(this._heap.bytes.length) });
  }

  initHeap(cv) {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cw = W < 900 ? 20 : 24, ch = 18, padL = W < 900 ? 72 : 104, padT = 118;
    const cols = Math.max(8, Math.floor((W - padL - 20) / cw)), rows = Math.max(8, Math.floor((H - padT - 10) / ch));
    const n = cols * rows;
    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) bytes[i] = MSG.charCodeAt(i % MSG.length) & 255;

    const oc = document.createElement('canvas'), s = 0.5;
    oc.width = Math.ceil(cols * cw * s); oc.height = Math.ceil(rows * ch * s);
    const o = oc.getContext('2d');
    o.fillStyle = '#fff'; o.textBaseline = 'middle'; o.textAlign = 'left';
    let F = oc.height * 0.36;
    const w0 = drawName(o, F, 0, 0, 0, false).maxW, lim = oc.width * 0.66;
    if (w0 > lim) F *= lim / w0;
    drawName(o, F, oc.width * 0.02, oc.height * 0.21, oc.height * 0.55, true);
    this._nameL = buildName(W, H, dpr, F / s, padL + oc.width * 0.02 / s, padT + oc.height * 0.21 / s, padT + oc.height * 0.55 / s);

    const img = o.getImageData(0, 0, oc.width, oc.height).data;
    const mask = new Float32Array(n);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const px = Math.min(oc.width - 1, Math.floor((c * cw + cw / 2) * s)), py = Math.min(oc.height - 1, Math.floor((r * ch + ch / 2) * s));
      mask[r * cols + c] = img[(py * oc.width + px) * 4 + 3] / 255;
    }
    const hex = [];
    for (let i = 0; i < 256; i++) hex.push(i.toString(16).padStart(2, '0'));
    const garb = new Uint8Array(n), scat = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      garb[i] = Math.floor(Math.random() * 256);
      scat[i * 2] = (Math.random() - 0.5) * W * 1.6;
      scat[i * 2 + 1] = (Math.random() - 0.5) * H * 1.6;
    }
    this._heap = { ctx, W, H, cw, ch, padL, padT, cols, rows, bytes, garb, scat, mask, heat: new Float32Array(n), ripples: [], hex };
    this._hcv = cv; this._hw = W; this._hh = H;
  }

  tick(ts) {
    const cv = this.canvasRef.current;
    if (!cv) return;
    if (this._hcv !== cv || cv.clientWidth !== this._hw || cv.clientHeight !== this._hh) this.initHeap(cv);
    const h = this._heap;
    const { ctx, W, H, cw, ch, padL, padT, cols, rows, bytes, garb, mask, heat, hex, scat } = h;

    if (Math.abs(this._pd - this._pt) > 1e-4) this._pd += (this._pt - this._pd) * 0.14;
    else this._pd = this._pt;
    if (Math.abs(this._pd - this.state.p) > 0.0003) this.setState({ p: this._pd });

    const p = this._pd, t = ts / 1000;
    const c0 = clamp01(p / 0.2), conv = 1 - Math.pow(1 - c0, 3), scan = clamp01((p - 0.2) / 0.2), dec = clamp01((p - 0.4) / 0.15), fin = clamp01((p - 0.87) / 0.13);
    ctx.fillStyle = '#0b0c0a'; ctx.fillRect(0, 0, W, H);
    const rc = cv.getBoundingClientRect();
    const mx = this._mx - rc.left, my = this._my - rc.top;
    const inside = mx >= 0 && my >= 0 && mx <= W && my <= H;
    const R = W < 900 ? 44 : 56, scanX = padL + scan * cols * cw;
    for (let k = 0; k < 5; k++) heat[Math.floor(Math.random() * bytes.length)] = 0.6;
    h.ripples.forEach(rp => { rp.r += 11; });
    h.ripples = h.ripples.filter(rp => rp.r < Math.hypot(W, H) + 40);

    ctx.font = "500 11px 'Geist Mono', monospace"; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const pr = Math.floor((my - padT) / ch), pc = Math.floor((mx - padL) / cw);
    ctx.globalAlpha = conv;
    for (let r = 0; r < rows; r++) {
      ctx.fillStyle = inside && r === pr ? '#c6f24e' : 'rgba(243,239,230,.24)';
      ctx.fillText((0x7ffd3a00 + r * cols).toString(16).padStart(8, '0'), 16, padT + r * ch + ch / 2);
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'center';

    for (let r = 0; r < rows; r++) {
      const gy = padT + r * ch + ch / 2;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c, gx = padL + c * cw + cw / 2;
        let x = gx + scat[i * 2] * (1 - conv), y = gy + scat[i * 2 + 1] * (1 - conv), dm = 1e9;
        if (inside) {
          const dx = x - mx, dy = y - my;
          dm = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dm < 80) { const f = 1 - dm / 80, k = f * f * 8; x += dx / dm * k; y += dy / dm * k; }
        }
        for (const rp of h.ripples) {
          if (!rp.done[i] && Math.abs(Math.hypot(gx - rp.x, gy - rp.y) - rp.r) < ch) {
            rp.done[i] = 1;
            const nb = rp.free ? 0 : Math.floor(Math.random() * 256);
            bytes[i] = nb; garb[i] = nb; heat[i] = 1;
          }
        }
        if (dm < 10) heat[i] = 0.6;
        const hv = heat[i];
        if (hv > 0.01) heat[i] = hv * 0.95;
        const written = gx < scanX, b = written ? bytes[i] : garb[i], m = written ? mask[i] : 0;
        const prn = (b >= 32 && b < 127) || b >= 160;
        if (dm < R) {
          const k = 1 - dm / R;
          ctx.fillStyle = m > 0.5 ? `rgba(198,242,78,${0.6 + 0.4 * k})` : `rgba(243,239,230,${0.4 + 0.6 * k})`;
          ctx.fillText(prn ? String.fromCharCode(b) : '·', x, y);
        } else if (m > 0.5) {
          const glyph = hash(i, 3) < dec && prn ? String.fromCharCode(b) : hex[b];
          ctx.fillStyle = `rgba(198,242,78,${0.82 + 0.12 * Math.sin(t * 2.2 - c * 0.22 + r * 0.12) + hv * 0.1})`;
          ctx.fillText(glyph, x, y);
        } else {
          const base = (b === 0 ? 0.07 : 0.15) * (0.45 + 0.55 * conv) * (1 - fin * 0.7);
          ctx.fillStyle = hv > 0.04 ? `rgba(198,242,78,${0.12 + hv * 0.75})` : `rgba(243,239,230,${base})`;
          ctx.fillText(hex[b], x, y);
        }
      }
    }

    const nl = this._nameL;
    if (fin > 0 && nl) {
      const burst = Math.sin(t * 0.9) > 0.985 || Math.random() < 0.004 || fin < 0.9;
      const sh = 5, d = nl.dpr;
      ctx.save(); ctx.globalAlpha = fin;
      for (let yy = Math.max(0, Math.floor(nl.top)); yy < Math.min(H, nl.bot); yy += sh) {
        let off = 0;
        if (burst && Math.random() < 0.3) off = (Math.random() - 0.5) * 16 * (fin < 1 ? 1.6 - fin : 1);
        if (inside && Math.abs(yy - my) < 24 && mx > nl.x - 40 && mx < nl.endX + 40) off += (Math.random() - 0.5) * 8;
        ctx.drawImage(nl.cv, 0, yy * d, W * d, sh * d, off, yy, W, sh);
      }
      if (burst) {
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fin * 0.2;
        ctx.drawImage(nl.cv, 0, 0, W * d, H * d, 4, -1, W, H);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = fin * (Math.floor(t * 2) % 2 ? 1 : 0.15); ctx.fillStyle = '#c6f24e';
      ctx.fillRect(nl.endX + nl.fs * 0.08, nl.y2 - nl.fs * 0.36, nl.fs * 0.42, nl.fs * 0.72);
      ctx.restore();
      ctx.font = "500 11px 'Geist Mono', monospace"; ctx.textAlign = 'center';
    }
    if (scan > 0 && scan < 1) {
      ctx.fillStyle = '#c6f24e'; ctx.fillRect(scanX, padT - 6, 2, rows * ch + 6);
      ctx.textAlign = 'left';
      ctx.fillText('write → 0x' + (0x7ffd3a00 + Math.floor(scan * cols)).toString(16), scanX + 8, padT - 16);
    }
    ctx.lineWidth = 1;
    if (inside) { ctx.strokeStyle = 'rgba(198,242,78,.2)'; ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.stroke(); }
    for (const rp of h.ripples) {
      ctx.strokeStyle = rp.free ? 'rgba(243,239,230,.35)' : 'rgba(198,242,78,.35)';
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.stroke();
    }

    const el = this.ptrRef.current;
    if (el) {
      let txt = 'ptr = NULL';
      if (inside && pc >= 0 && pc < cols && pr >= 0 && pr < rows) {
        const i = pr * cols + pc, gx = padL + pc * cw + cw / 2, b = gx < scanX ? bytes[i] : garb[i], p_ = (b >= 32 && b < 127) || b >= 160;
        txt = `ptr = 0x${(0x7ffd3a00 + i).toString(16)}  *ptr = 0x${hex[b]}  '${p_ ? String.fromCharCode(b) : '.'}'`;
      }
      if (el.textContent !== txt) el.textContent = txt;
    }
  }

  render() {
    const t = T[this.props.lang] || T.es;
    const { p } = this.state;

    let fD, tD, mD = 0;
    if (p < 0.57) fD = tD = 0;
    else if (p < 0.7) { fD = 0; tD = 1; mD = (p - 0.57) / 0.13; }
    else if (p < 0.72) fD = tD = 1;
    else if (p < 0.85) { fD = 1; tD = 2; mD = (p - 0.72) / 0.13; }
    else fD = tD = 2;
    const AD = CODES[fD], BD = CODES[tD];
    const codeLines = AD.map((a, i) => {
      const hot = fD !== tD && a !== BD[i] && mD > 0.03 && mD < 0.97;
      return { n: String(i + 1).padStart(2, '0'), text: (fD === tD ? a : morph(a, BD[i], mD, i)) || ' ', color: hot ? '#c6f24e' : '#f3efe6' };
    });
    const stD = p < 0.635 ? 0 : p < 0.785 ? 1 : 2;
    const phD = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.55 ? 2 : p < 0.85 ? 3 : 4;
    const dOp = clamp01((p - 0.4) / 0.08);
    const stamp = clamp01((p - 0.9) / 0.07);
    const pct = Math.round(p * 100);
    const done = p >= 0.99, intro = clamp01(p / 0.04);
    const mono = "'Geist Mono',monospace";
    const hudBox = { background: '#0b0c0a', border: '1px solid rgba(198,242,78,.35)', pointerEvents: 'none' };

    return (
      <div style={{ height: '100vh', background: '#0b0c0a', color: '#f3efe6' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', minHeight: 620, overflow: 'hidden' }}>
          <canvas ref={this.canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />

          <div style={{ position: 'absolute', left: 24, top: 72, display: 'flex', gap: 6, alignItems: 'center', font: `500 11px/1 ${mono}`, pointerEvents: 'none' }}>
            {['malloc', 'write', 'decode', 'transpile', 'serve'].map((label, i) => (
              <div key={label} style={{ padding: '7px 10px', border: '1px solid rgba(198,242,78,.4)', background: i === phD ? '#c6f24e' : '#0b0c0a', color: i === phD ? '#0b0c0a' : '#c6f24e' }}>{label}</div>
            ))}
            <div style={{ padding: '7px 10px', color: '#c6f24e' }}>{pct}%</div>
          </div>

          <div style={{ position: 'absolute', right: 24, top: 120, bottom: 24, display: 'flex', gap: 14, alignItems: 'stretch', pointerEvents: 'none', zIndex: 3, opacity: intro, transition: 'opacity .3s' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 18, font: `600 14px/1 ${mono}`, color: '#c6f24e' }}>
              <span style={{ font: "400 34px/.8 'VT323',monospace", background: '#0b0c0a', padding: '2px 4px' }}>{pct}%</span>
              <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.12em', background: '#0b0c0a', padding: '6px 2px' }}>{done ? t.dDone.toUpperCase() : t.dDown}</span>
            </div>
            <div style={{ width: 22, position: 'relative', background: 'rgba(198,242,78,.14)' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: `${pct}%`, background: '#c6f24e' }} />
              <div style={{ position: 'absolute', left: '50%', top: `${pct}%`, transform: 'translate(-50%,6px)', opacity: done ? 0 : 1 }}>
                <div style={{ fontSize: 28, lineHeight: 1, color: '#c6f24e', animation: 'jmBounce 1.1s ease-in-out infinite' }}>↓</div>
              </div>
            </div>
          </div>

          <div ref={this.ptrRef} style={{ ...hudBox, position: 'absolute', right: 24, top: 72, font: `500 12px/1 ${mono}`, color: '#c6f24e', padding: '8px 10px', whiteSpace: 'pre' }}>ptr = NULL</div>

          <div style={{ ...hudBox, position: 'absolute', left: 24, bottom: 24, maxWidth: 'min(520px,50vw)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, opacity: clamp01((p - 0.15) / 0.1) }}>
            <div style={{ font: `500 11px/1 ${mono}`, color: '#c6f24e' }}>$ ./jorge --serve</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, font: "400 clamp(18px,1.7vw,24px)/1.2 'Geist',sans-serif" }}>
              <span style={{ position: 'relative', opacity: 0.6 }}>
                {t.from}
                <span style={{ position: 'absolute', left: -4, top: '52%', height: 2, background: '#c6f24e', width: `${clamp01((p - 0.72) / 0.13) * 108}%` }} />
              </span>
              <span style={{ fontFamily: mono, color: '#c6f24e' }}>→</span>
              <span style={{ opacity: 0.15 + 0.85 * clamp01((p - 0.75) / 0.12) }}>{t.to} · {t.role}</span>
            </div>
            <div style={{ font: `400 11px/1.5 ${mono}`, opacity: 0.6 }}>{t.dHint}</div>
          </div>

          <div style={{ position: 'absolute', right: 84, bottom: 24, width: 'min(470px,42vw)', opacity: dOp, transform: `translateY(${(1 - dOp) * 40}px)`, pointerEvents: 'none' }}>
            <div style={{ background: '#0b0c0a', border: '1px solid rgba(198,242,78,.5)' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(198,242,78,.5)', font: `500 11px/1 ${mono}` }}>
                {['main.c', 'main.cpp', 'main.py'].map((f, i) => (
                  <div key={f} style={{ padding: '10px 12px', borderRight: '1px solid rgba(198,242,78,.5)', background: i === stD ? '#c6f24e' : 'transparent', color: i === stD ? '#0b0c0a' : '#c6f24e' }}>{f}</div>
                ))}
              </div>
              <div style={{ padding: '14px 0', font: `400 clamp(11px,.95vw,14px)/1.75 ${mono}`, overflow: 'hidden' }}>
                {codeLines.map(ln => (
                  <div key={ln.n} style={{ display: 'flex', gap: 14, padding: '0 14px', whiteSpace: 'pre', color: ln.color }}>
                    <span style={{ opacity: 0.35 }}>{ln.n}</span><span>{ln.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(198,242,78,.5)', padding: '10px 14px', font: `400 11px/1.6 ${mono}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ opacity: 0.55 }}>{['$ gcc main.c -o jorge', '$ g++ -std=c++20 main.cpp', '$ uvicorn main:app'][stD]}</div>
                <div style={{ color: '#c6f24e' }}>{stD < 2 ? 'hola, soy Jorge Muñiz' : 'GET /jorge  →  200 OK'}</div>
              </div>
              <div style={{ height: 3, background: '#c6f24e', width: `${pct}%` }} />
            </div>
            <div style={{ position: 'absolute', right: -8, top: -28, transform: `rotate(-7deg) scale(${1.5 - 0.5 * stamp})`, opacity: stamp, border: '2px solid #c6f24e', color: '#c6f24e', padding: '9px 14px', font: `600 26px/1 ${mono}`, background: '#0b0c0a' }}>200 OK</div>
          </div>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 1 - intro, transform: `scale(${1 + intro * 0.15})`, transition: 'opacity .3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#c6f24e', color: '#0b0c0a', padding: '14px 22px', font: `600 clamp(15px,1.3vw,18px)/1 ${mono}`, whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', animation: 'jmBounce 1.2s ease-in-out infinite' }}>↓</span>{t.dScroll}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
