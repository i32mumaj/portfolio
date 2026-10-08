const KEY = 'jm_achievements';

// [title, what you did, hint shown while still locked]
export const ACHIEVEMENTS = [
  { id: 'snake', es: ['Tablero lleno', 'ganaste al snake', 'llena el tablero del snake'], en: ['Board cleared', 'beat snake', 'fill the snake board'] },
  { id: 'cheater', es: ['IDDQD', 'usaste el modo dios', 'la consola del navegador sabe algo'], en: ['IDDQD', 'used god mode', 'the browser console knows something'] },
  { id: 'hire', es: ['Contratado', 'ejecutaste hire jorge', 'gana primero, luego contrata'], en: ['Hired', 'ran hire jorge', 'win first, then hire'] },
  { id: 'sudo', es: ['Persistente', 'conseguiste sudo', 'si no te dejan, insiste'], en: ['Persistent', 'got sudo', "if they say no, insist"] },
  { id: 'rmrf', es: ['Sin miedo', 'rm -rf / como root', 'un gran poder conlleva…'], en: ['Fearless', 'rm -rf / as root', 'with great power…'] },
  { id: 'konami', es: ['Core dumped', 'rompiste la web', '↑ ↑ ↓ ↓ …'], en: ['Core dumped', 'crashed the site', '↑ ↑ ↓ ↓ …'] },
  { id: 'english', es: ['Bilingüe', 'cambiaste el idioma', 'habla otro idioma'], en: ['Bilingual', 'switched language', 'speak another language'] },
  { id: 'eof', es: ['EOF', 'llegaste al final', 'llega hasta abajo del todo'], en: ['EOF', 'reached the end', 'scroll all the way down'] },
];
export const FINAL = { id: 'all', es: ['100%', 'lo has encontrado todo. Ahora sí, hablemos.'], en: ['100%', "you found everything. Now let's talk."] };

let mem = null;
function load() {
  if (mem) return mem;
  try { mem = new Set(JSON.parse(localStorage.getItem(KEY)) || []); } catch { mem = new Set(); }
  return mem;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify([...mem])); } catch { /* storage unavailable */ }
}

export function isUnlocked(id) { return load().has(id); }
export function unlockedCount() { return ACHIEVEMENTS.filter(a => load().has(a.id)).length; }

export function unlock(id) {
  const s = load();
  if (s.has(id)) return;
  s.add(id);
  save();
  window.dispatchEvent(new CustomEvent('jm-achievement', { detail: { id } }));
  if (id !== FINAL.id && unlockedCount() === ACHIEVEMENTS.length) setTimeout(() => unlock(FINAL.id), 1200);
}

export function resetAchievements() {
  mem = new Set();
  save();
}
