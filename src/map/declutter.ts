/**
 * Désencombrement des noms, en espace écran : à chaque zoom, les noms sont
 * posés par ordre de priorité ; un nom qui recouvrirait un nom déjà posé (ou
 * un obstacle fixe) essaie les autres côtés de son point, puis est masqué.
 * Aucun chevauchement à aucun zoom ; plus on zoome, plus il y a de noms.
 */

export interface LabelItem {
  id: string;
  /** position du point (px écran) */
  x: number;
  y: number;
  /** taille du nom (px écran) */
  w: number;
  h: number;
  /** plus petit = posé en premier */
  priority: number;
  /** rayon du marqueur (px écran) : le nom est posé juste à côté */
  r: number;
}

export type Side = 'right' | 'left' | 'above' | 'below';

export interface PlacedLabel {
  id: string;
  side: Side;
  /** boîte du nom posé (px écran, coin haut-gauche) */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SIDES: Side[] = ['right', 'left', 'above', 'below'];
const GAP = 4;

function boxFor(it: LabelItem, side: Side): Rect {
  switch (side) {
    case 'right':
      return { x: it.x + it.r + GAP, y: it.y - it.h / 2, w: it.w, h: it.h };
    case 'left':
      return { x: it.x - it.r - GAP - it.w, y: it.y - it.h / 2, w: it.w, h: it.h };
    case 'above':
      return { x: it.x - it.w / 2, y: it.y - it.r - GAP - it.h, w: it.w, h: it.h };
    case 'below':
      return { x: it.x - it.w / 2, y: it.y + it.r + GAP, w: it.w, h: it.h };
  }
}

const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * Pose les noms par priorité croissante (puis par id, pour le déterminisme).
 * `obstacles` : zones déjà occupées (noms de domaines, marqueurs, interface).
 */
export function declutter(items: readonly LabelItem[], obstacles: readonly Rect[] = []): PlacedLabel[] {
  const order = [...items].sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  // les marqueurs eux-mêmes sont des obstacles : un nom ne cache pas le point d'une autre figure
  const taken: Rect[] = [...obstacles, ...items.map((it) => ({ x: it.x - it.r, y: it.y - it.r, w: 2 * it.r, h: 2 * it.r }))];
  const out: PlacedLabel[] = [];
  for (const it of order) {
    for (const side of SIDES) {
      const b = boxFor(it, side);
      // son propre marqueur ne compte pas
      if (taken.some((t) => hit(b, t) && !(Math.abs(t.x + t.w / 2 - it.x) < 1e-6 && Math.abs(t.y + t.h / 2 - it.y) < 1e-6))) continue;
      taken.push(b);
      out.push({ id: it.id, side, ...b });
      break;
    }
  }
  return out;
}

/** Largeur estimée d'un nom (px) : DM Sans, ≈ 0,55 em par caractère. */
export const textWidth = (text: string, fontPx: number) => Math.ceil(text.length * fontPx * 0.55) + 4;
