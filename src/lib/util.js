export const clamp01 = x => Math.max(0, Math.min(1, x));

export function hash(i, j) {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(j + 7, 1597334677);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export const wait = ms => new Promise(r => setTimeout(r, ms));
