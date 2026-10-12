import { MAP_SIZE, TIME_BOUNDS } from '../data/eras';
import type { Domain } from '../data/types';
import { seededRandom } from '../lib/prng';
import { yearToX } from './timeScale';

const BASE_R: Record<number, number> = { 3: 230, 2: 180, 1: 135 };
/** marge de séparation entre deux cercles voisins (chaque côté), unités carte */
export const RELAX_MARGIN = 24;
const MAP_MARGIN = 40;
const CHILD_MAX = 0.85;

/** au-delà de ce nombre de figures, le disque s'agrandit (1,2 % par figure, +35 % au plus) */
export const DENSE_FIGURES = 12;

/** Rayon de base : taille éditoriale, nombre de résultats et nombre de figures (chacun plafonné). */
export function baseRadius(m: Domain): number {
  const r = BASE_R[m.map.size] ?? BASE_R[1];
  const extra = Math.min(0.25, Math.max(0, Math.floor((m.results.length - 8) / 4)) * 0.08);
  const crowd = Math.min(0.35, Math.max(0, m.mathematicians.length - DENSE_FIGURES) * 0.012);
  return r * (1 + extra + crowd);
}

export interface ChildPos {
  kind: 'theory' | 'mathematician' | 'result';
  id: string;
  x: number;
  y: number;
  /** grande figure : son médaillon est dessiné à tous les niveaux (FeaturedLayer) */
  featured?: boolean;
  /** niveau de zoom à partir duquel le nom d'une figure ordinaire est écrit (fiches courtes : 3) */
  nameLevel?: 2 | 3;
}

export interface TerritoryLayout {
  id: string;
  x: number;
  y: number;
  r: number;
  children: ChildPos[];
}

export interface AtlasLayout {
  territories: TerritoryLayout[];
  byId: Map<string, TerritoryLayout>;
  childPos: Map<string, ChildPos>;
}

interface Circle {
  id: string;
  x: number;
  y: number;
  r: number;
}

/** Relaxation déterministe : écarte les cercles (r + marge) par itérations amorties. */
export function relaxCircles(circles: Circle[], iterations = 300): void {
  const clamp = () => {
    for (const c of circles) {
      c.x = Math.min(MAP_SIZE.width - MAP_MARGIN - c.r, Math.max(MAP_MARGIN + c.r, c.x));
      c.y = Math.min(MAP_SIZE.height - MAP_MARGIN - c.r, Math.max(MAP_MARGIN + c.r, c.y));
    }
  };
  const pass = (alpha: number): boolean => {
    let moved = false;
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const minD = a.r + RELAX_MARGIN + b.r + RELAX_MARGIN;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d < minD) {
          if (d < 1e-6) {
            dx = (i - j) * 0.01 || 0.01;
            dy = 0.01;
            d = Math.hypot(dx, dy);
          }
          const push = ((minD - d) / d) * 0.5 * alpha;
          a.x -= dx * push;
          a.y -= dy * push;
          b.x += dx * push;
          b.y += dy * push;
          moved = true;
        }
      }
    }
    return moved;
  };
  for (let iter = 0; iter < iterations; iter++) {
    if (!pass(1 - iter / iterations)) {
      clamp();
      return;
    }
    clamp();
  }
  // phase finale : séparation exacte des résidus
  for (let iter = 0; iter < 150; iter++) {
    if (!pass(1)) break;
    clamp();
  }
}

function clampChild(cx: number, cy: number, r: number, x: number, y: number): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const d = Math.hypot(dx, dy);
  const max = r * CHILD_MAX;
  if (d <= max || d < 1e-6) return [x, y];
  const k = max / d;
  return [cx + dx * k, cy + dy * k];
}

/** Médaillon d'une grande figure et son nom à droite (unités carte, k ≈ 1). */
export const FEATURED_BOX = { w: 170, h: 40, dx: 70 };
/** Case d'une figure ordinaire (unités carte) : assez pour que deux points ne se touchent jamais. */
export const FIGURE_CELL = { w: 46, h: 22 };

/** Boîte fixe (centre, largeur, hauteur), en unités carte. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Emplacements des grandes figures d'un domaine : sous le nom du domaine, dans
 * la moitié basse du disque — une seule au centre-bas, plusieurs en colonne,
 * noms à droite.
 */
export function featuredSlots(n: number, cx: number, cy: number, r: number): [number, number][] {
  if (n === 0) return [];
  if (n === 1) return [[cx - 0.15 * r, cy + 0.28 * r]];
  return Array.from({ length: n }, (_, i) => [cx - 0.2 * r, cy + (0.08 + (0.5 * i) / (n - 1)) * r] as [number, number]);
}



const overlap = (a: Box, b: Box) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;

/**
 * Centres des cases d'une grille à rangées décalées (quinconce) dont la boîte
 * w × h tient entière dans le disque de rayon `radius`.
 */
export function gridCells(cx: number, cy: number, radius: number, w: number, h: number): [number, number][] {
  const out: [number, number][] = [];
  let row = 0;
  for (let y = cy - radius + h / 2; y <= cy + radius - h / 2 + 1e-9; y += h, row++) {
    const shift = row % 2 ? w / 2 : 0;
    for (let x = cx - radius - w + shift; x <= cx + radius; x += w) {
      const inside = [
        [x - w / 2, y - h / 2],
        [x + w / 2, y - h / 2],
        [x - w / 2, y + h / 2],
        [x + w / 2, y + h / 2],
      ].every(([px, py]) => Math.hypot(px - cx, py - cy) <= radius);
      if (inside) out.push([x, y]);
    }
  }
  return out;
}

/**
 * Attribue à chaque élément la case libre la plus proche de son ancre (ordre
 * déterministe : celui de `items`). Une case libre ne recouvre aucune boîte de
 * `blocked`. S'il n'y a plus de case, l'élément reste sur son ancre.
 */
export function assignCells(
  items: readonly { id: string; ax: number; ay: number }[],
  cells: readonly [number, number][],
  blocked: readonly Box[],
  w: number,
  h: number,
): Map<string, [number, number]> {
  const free = cells.filter(([x, y]) => !blocked.some((b) => overlap({ x, y, w, h }, b)));
  const used = new Set<number>();
  const out = new Map<string, [number, number]>();
  for (const it of items) {
    let best = -1;
    let bd = Infinity;
    free.forEach(([x, y], i) => {
      if (used.has(i)) return;
      const d = Math.hypot(x - it.ax, y - it.ay);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    if (best >= 0) {
      used.add(best);
      out.set(it.id, free[best]);
    } else out.set(it.id, [it.ax, it.ay]);
  }
  return out;
}

function layoutChildren(m: Domain, cx: number, cy: number, r: number): ChildPos[] {
  const rand = seededRandom(m.id + ':children');
  const children: ChildPos[] = [];
  const theoryPos = new Map<string, { x: number; y: number }>();
  const mathPos = new Map<string, { x: number; y: number }>();

  // theories sur un anneau à 0.42 r
  const sStart = rand() * Math.PI * 2;
  m.theories.forEach((s, i) => {
    const a = sStart + (i / Math.max(1, m.theories.length)) * Math.PI * 2;
    const [x, y] = clampChild(cx, cy, r, cx + 0.42 * r * Math.cos(a), cy + 0.42 * r * Math.sin(a));
    theoryPos.set(s.id, { x, y });
    children.push({ kind: 'theory', id: s.id, x, y });
  });

  // grandes figures : emplacements fixes dans la moitié basse du disque
  const featured = m.mathematicians.filter((f) => f.featured);
  const slots = featuredSlots(featured.length, cx, cy, r);
  const featuredBoxes: Box[] = [];
  featured.forEach((f, i) => {
    const [x, y] = slots[i];
    mathPos.set(f.id, { x, y });
    children.push({ kind: 'mathematician', id: f.id, x, y, featured: true });
    featuredBoxes.push({ x: x + FEATURED_BOX.dx, y, w: FEATURED_BOX.w, h: FEATURED_BOX.h });
  });

  // figures ordinaires : un point par figure sur une grille fine en quinconce, au plus près de sa
  // théorie (les figures à résultats d'abord, puis les fiches courtes). Les noms ne sont pas posés
  // ici : ils sont désencombrés à l'affichage, zoom par zoom (declutter.ts).
  const authors = new Set(m.results.map((x) => x.mathematicianId));
  const ordinary = [...m.mathematicians.filter((f) => !f.featured)].sort(
    (a, b) => Number(authors.has(b.id)) - Number(authors.has(a.id)) || a.years[0] - b.years[0] || a.id.localeCompare(b.id),
  );
  const anchorOf = (f: Domain['mathematicians'][number], i: number) => {
    const t = f.theoryId ? theoryPos.get(f.theoryId) : undefined;
    if (t) return { id: f.id, ax: t.x, ay: t.y };
    const a = (i / Math.max(1, ordinary.length)) * Math.PI * 2;
    return { id: f.id, ax: cx + 0.55 * r * Math.cos(a), ay: cy + 0.55 * r * Math.sin(a) };
  };
  const cells = assignCells(
    ordinary.map(anchorOf),
    gridCells(cx, cy, CHILD_MAX * r, FIGURE_CELL.w, FIGURE_CELL.h),
    featuredBoxes,
    FIGURE_CELL.w,
    FIGURE_CELL.h,
  );
  for (const f of ordinary) {
    const [x, y] = cells.get(f.id)!;
    mathPos.set(f.id, { x, y });
    children.push({ kind: 'mathematician', id: f.id, x, y, nameLevel: authors.has(f.id) ? 2 : 3 });
  }

  // résultats autour de leur auteur, sinon de leur théorie, sinon du centre
  const resultsByMath = new Map<string, Domain['results']>();
  const resultsByTheory = new Map<string, Domain['results']>();
  const resultsOrphan: Domain['results'] = [];
  for (const f of m.results) {
    if (f.mathematicianId && mathPos.has(f.mathematicianId)) {
      const g = resultsByMath.get(f.mathematicianId) ?? [];
      g.push(f);
      resultsByMath.set(f.mathematicianId, g);
    } else if (f.theoryId && theoryPos.has(f.theoryId)) {
      const g = resultsByTheory.get(f.theoryId) ?? [];
      g.push(f);
      resultsByTheory.set(f.theoryId, g);
    } else resultsOrphan.push(f);
  }
  const placeAround = (px: number, py: number, group: Domain['results'], minR: number, varR: number) => {
    const start = rand() * Math.PI * 2;
    group.forEach((f, i) => {
      const a = start + (i / Math.max(1, group.length)) * Math.PI * 2;
      const rr = (minR + rand() * varR) * r;
      const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
      children.push({ kind: 'result', id: f.id, x, y });
    });
  };
  // résultats d’un mathématicien : éventail dans le demi-plan inférieur (20°–160°, y vers le bas) ;
  // le rayon croît avec le nombre de résultats
  const placeFan = (px: number, py: number, group: Domain['results']) => {
    const n = group.length;
    const rr = Math.max(0.12 * r, 30 + 9 * n);
    group.forEach((f, i) => {
      const deg = n === 1 ? 90 : 20 + (i / (n - 1)) * 140;
      const a = (deg * Math.PI) / 180;
      const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
      children.push({ kind: 'result', id: f.id, x, y });
    });
  };
  for (const [fid, group] of resultsByMath) placeFan(mathPos.get(fid)!.x, mathPos.get(fid)!.y, group);
  for (const [sid, group] of resultsByTheory) placeAround(theoryPos.get(sid)!.x, theoryPos.get(sid)!.y, group, 0.1, 0.08);
  placeAround(cx, cy, resultsOrphan, 0.1, 0.5);

  return children;
}

/** Portée d'un domaine sur l'axe du temps de la carte : [x(début), x(fin)]. */
export function periodSpan(m: Domain): [number, number] {
  return [yearToX(m.period.start), yearToX(m.period.end ?? TIME_BOUNDS.end)];
}

export function computeLayout(domains: Domain[]): AtlasLayout {
  const circles: Circle[] = domains.map((m) => {
    const r = baseRadius(m);
    // un lac est posé sur sa portée : son centre reste à moins d'un demi-rayon
    // de l'intervalle de sa période (la position du brief n'est qu'indicative)
    const [x0, x1] = periodSpan(m);
    return {
      id: m.id,
      x: Math.min(x1 + 0.5 * r, Math.max(x0 - 0.5 * r, m.map.x)),
      y: m.map.y,
      r,
    };
  });
  relaxCircles(circles);

  const territories: TerritoryLayout[] = circles.map((c) => ({
    id: c.id,
    x: c.x,
    y: c.y,
    r: c.r,
    children: layoutChildren(domains.find((m) => m.id === c.id)!, c.x, c.y, c.r),
  }));

  const byId = new Map(territories.map((t) => [t.id, t]));
  const childPos = new Map<string, ChildPos>();
  for (const t of territories) for (const ch of t.children) childPos.set(ch.id, ch);
  return { territories, byId, childPos };
}
