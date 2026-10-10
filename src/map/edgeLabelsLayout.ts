import type { Continent } from '../data/types';
import type { ViewTransform } from './viewStore';

/** noms des champs (.edge-continent : 11 px, interlettrage 0.2em) : ≈ 9.2 px mesurés par capitale */
const CHAR_W = 9.5;
const PAD = 8;
/** dépassement toléré d'un libellé hors de sa bande (fraction de sa longueur) */
const OVERFLOW = 0.15;
/** marge sous le dernier libellé */
const BOTTOM_MARGIN = 10;

export interface EdgeLabel {
  id: string;
  /** centre du libellé le long de l'axe (px écran) */
  pos: number;
  text: string;
}

/**
 * Place un libellé de longueur `len` dans l'intervalle visible [a, b] : centré si
 * possible, sinon décalé après le libellé précédent (`lastEnd`). Un dépassement
 * de OVERFLOW·len hors de l'intervalle est toléré ; au-delà, le libellé est masqué.
 */
export function placeLabel(a: number, b: number, len: number, lastEnd: number): number | null {
  const slack = OVERFLOW * len;
  if (b - a + 2 * slack < len) return null;
  let c = (a + b) / 2;
  if (c - len / 2 < lastEnd + 4) c = lastEnd + 4 + len / 2;
  if (c + len / 2 > b + slack) return null;
  return c;
}

/**
 * Noms des champs dans la marge gauche (axe vertical). Un libellé n'est gardé que
 * si la portion visible de sa bande peut à peu près le contenir et s'il ne
 * recouvre pas le précédent. `topReserved` / `bottomReserved` : bandes d'écran
 * occupées par l'interface (titre en haut ; frise ou feuille de détail en bas).
 */
export function continentLabels(v: ViewTransform, continents: Continent[], topReserved = 0, bottomReserved = 0): EdgeLabel[] {
  const out: EdgeLabel[] = [];
  let lastEnd = topReserved;
  const limit = v.height - BOTTOM_MARGIN - bottomReserved;
  for (const r of continents) {
    const text = (r.shortName ?? r.name).toUpperCase();
    const len = text.length * CHAR_W + PAD;
    const y0 = Math.max(topReserved, v.y + r.y0 * v.k);
    const y1 = Math.min(limit, v.y + r.y1 * v.k);
    const c = placeLabel(y0, y1, len, lastEnd);
    if (c === null || c + len / 2 > limit) continue;
    lastEnd = c + len / 2;
    out.push({ id: r.id, pos: c, text });
  }
  return out;
}
