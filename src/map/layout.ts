import * as d3 from 'd3';
import { MAP_SIZE, TIME_BOUNDS } from '../data/eras';
import type { Domain } from '../data/types';
import { seededRandom } from '../lib/prng';
import { yearToX } from './timeScale';

const BASE_R: Record<number, number> = { 3: 230, 2: 180, 1: 135 };
/** marge de séparation entre deux cercles voisins (chaque côté), unités carte */
export const RELAX_MARGIN = 24;
const MAP_MARGIN = 40;
const CHILD_MAX = 0.85;

export function baseRadius(m: Domain): number {
  const r = BASE_R[m.map.size] ?? BASE_R[1];
  const extra = Math.min(0.25, Math.max(0, Math.floor((m.results.length - 8) / 4)) * 0.08);
  return r * (1 + extra);
}

/** Chemin organique déterministe : 12-16 points, rayon bruité, Catmull-Rom fermé. */
export function organicPath(cx: number, cy: number, r: number, seed: string, wobble = 0.18): string {
  const rand = seededRandom(seed);
  const n = 12 + Math.floor(rand() * 5);
  const startAngle = rand() * Math.PI * 2;
  // bruit basse fréquence : mélange de 2 harmoniques + jitter
  const ph1 = rand() * Math.PI * 2;
  const ph2 = rand() * Math.PI * 2;
  const amp1 = wobble * 0.55;
  const amp2 = wobble * 0.45;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = startAngle + (i / n) * Math.PI * 2;
    const jit = (rand() - 0.5) * wobble * 0.6;
    const f = 1 - wobble + amp1 * (0.5 + 0.5 * Math.sin(2 * a + ph1)) + amp2 * (0.5 + 0.5 * Math.sin(3 * a + ph2)) + jit;
    const rr = r * f;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  const line = d3.line<[number, number]>().curve(d3.curveCatmullRomClosed.alpha(0.5));
  return line(pts) ?? '';
}

export interface ChildPos {
  kind: 'theory' | 'mathematician' | 'result';
  id: string;
  x: number;
  y: number;
  /** ancrage du libellé (results en éventail : à droite, en dessous, à gauche du marqueur) */
  anchor?: 'start' | 'middle' | 'end';
  /** mathématiciens : libellé au-dessus ou au-dessous du marqueur, à l’opposé du centre de la théorie */
  vside?: 'above' | 'below';
}

export interface TerritoryLayout {
  id: string;
  x: number;
  y: number;
  r: number;
  path: string;
  isoPath: string;
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

/** Boîte d’un libellé de mathématicien (unités carte, calibrée pour k ≈ 1 au niveau « Mathématiciens »). */
const MATHEMATICIAN_BOX = { w: 118, h: 42, dy: 24 };
/** Boîte du libellé d’une théorie aux niveaux 2-3 (décalé sous le centre du blob). */
const THEORY_BOX = { w: 110, h: 34, dy: 22 };

/**
 * Écarte les libellés de mathématiciens entre eux et des libellés de théories, par
 * répulsion de boîtes le long de l'axe de moindre recouvrement. Déterministe.
 */
export function separateMathematicianLabels(fms: ChildPos[], theories: { x: number; y: number }[], cx: number, cy: number, r: number): void {
  const boxY = (c: ChildPos) => c.y + (c.vside === 'below' ? MATHEMATICIAN_BOX.dy : -MATHEMATICIAN_BOX.dy);
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let i = 0; i < fms.length; i++) {
      for (let j = i + 1; j < fms.length; j++) {
        const a = fms[i];
        const b = fms[j];
        const dx = b.x - a.x;
        const dy = boxY(b) - boxY(a);
        const ox = MATHEMATICIAN_BOX.w - Math.abs(dx);
        const oy = MATHEMATICIAN_BOX.h - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy) {
          const sgn = dx >= 0 ? 1 : -1;
          a.x -= (sgn * ox) / 2;
          b.x += (sgn * ox) / 2;
        } else {
          const sgn = dy >= 0 ? 1 : -1;
          a.y -= (sgn * oy) / 2;
          b.y += (sgn * oy) / 2;
        }
      }
      // libellés de theories : obstacles fixes
      for (const sp of theories) {
        const a = fms[i];
        const dx = a.x - sp.x;
        const dy = boxY(a) - (sp.y + THEORY_BOX.dy);
        const ox = (MATHEMATICIAN_BOX.w + THEORY_BOX.w) / 2 - Math.abs(dx);
        const oy = (MATHEMATICIAN_BOX.h + THEORY_BOX.h) / 2 - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy) a.x += (dx >= 0 ? 1 : -1) * ox;
        else a.y += (dy >= 0 ? 1 : -1) * oy;
      }
    }
    for (const c of fms) {
      const [x, y] = clampChild(cx, cy, r, c.x, c.y);
      c.x = x;
      c.y = y;
    }
    if (!moved) return;
  }
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

  // mathématiciens groupés autour de leur théorie, sinon anneau 0.62 r
  const byTheory = new Map<string, Domain['mathematicians']>();
  const orphans: Domain['mathematicians'] = [];
  for (const f of m.mathematicians) {
    if (f.theoryId && theoryPos.has(f.theoryId)) {
      const g = byTheory.get(f.theoryId) ?? [];
      g.push(f);
      byTheory.set(f.theoryId, g);
    } else orphans.push(f);
  }
  const mathChildren: ChildPos[] = [];
  for (const [sid, group] of byTheory) {
    const sp = theoryPos.get(sid)!;
    const st = m.theories.findIndex((s) => s.id === sid);
    const start = (st + 1) * 1.7 + rand() * 0.5;
    group.forEach((f, i) => {
      const a = start + (i / Math.max(1, group.length)) * Math.PI * 2;
      const rr = (0.24 + rand() * 0.08) * r;
      const [x, y] = clampChild(cx, cy, r, sp.x + rr * Math.cos(a), sp.y + rr * Math.sin(a));
      mathChildren.push({ kind: 'mathematician', id: f.id, x, y, vside: y < sp.y ? 'above' : 'below' });
    });
  }
  const oStart = rand() * Math.PI * 2;
  orphans.forEach((f, i) => {
    const a = oStart + (i / Math.max(1, orphans.length)) * Math.PI * 2;
    const [x, y] = clampChild(cx, cy, r, cx + 0.62 * r * Math.cos(a), cy + 0.62 * r * Math.sin(a));
    mathChildren.push({ kind: 'mathematician', id: f.id, x, y, vside: 'above' });
  });
  separateMathematicianLabels(mathChildren, [...theoryPos.values()], cx, cy, r);
  for (const c of mathChildren) {
    mathPos.set(c.id, { x: c.x, y: c.y });
    children.push(c);
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
  // le rayon croît avec le nombre de results et les libellés s'ancrent du côté extérieur
  const placeFan = (px: number, py: number, group: Domain['results']) => {
    const n = group.length;
    const rr = Math.max(0.12 * r, 30 + 9 * n);
    group.forEach((f, i) => {
      const deg = n === 1 ? 90 : 20 + (i / (n - 1)) * 140;
      const a = (deg * Math.PI) / 180;
      const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
      const anchor = deg < 75 ? 'start' : deg > 105 ? 'end' : 'middle';
      children.push({ kind: 'result', id: f.id, x, y, anchor });
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
    path: organicPath(c.x, c.y, c.r, c.id),
    // même seed → même forme, rayon r + 18
    isoPath: organicPath(c.x, c.y, c.r + 18, c.id),
    children: layoutChildren(domains.find((m) => m.id === c.id)!, c.x, c.y, c.r),
  }));

  const byId = new Map(territories.map((t) => [t.id, t]));
  const childPos = new Map<string, ChildPos>();
  for (const t of territories) for (const ch of t.children) childPos.set(ch.id, ch);
  return { territories, byId, childPos };
}
