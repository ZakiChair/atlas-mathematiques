import type { Link } from '../data/types';
import { DOMAIN_BY_ID } from '../data';
import type { TerritoryLayout } from './layout';
import { hashSeed } from '../lib/prng';

/**
 * Tracé des liens entre domaines, lu comme un arbre généalogique : un lien
 * sort de son domaine d'origine par le côté qui regarde vers l'arrivée (l'est,
 * le plus souvent : le temps va de gauche à droite), file en S à tangentes
 * horizontales et entre dans le domaine d'arrivée par le côté opposé. Les
 * liens presque verticaux (domaines contemporains de champs différents) font
 * de même entre les côtés nord et sud. Quand la courbe traverserait un lac
 * tiers, elle est bombée (déterministe) jusqu'à l'éviter.
 */
export interface LinkGeometry {
  link: Link;
  /** Bézier cubique M … C … */
  d: string;
  /** Point milieu (t = 0,5) pour la barre des ruptures et le libellé. */
  mid: { x: number; y: number };
  /** Angle de la tangente au milieu (pour la barre perpendiculaire). */
  midAngle: number;
  /** Angle de la tangente en t = 1 (pour la pointe de flèche dessinée). */
  endAngle: number;
  /** Axe du tracé : ports est/ouest (`h`) ou nord/sud (`v`). */
  axis: 'h' | 'v';
  /** Bombement retenu (unités carte, signé), 0 si le tracé direct passait. */
  bow: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  r: number;
}

type P = [number, number];

/** tangentes : les points de contrôle sont à cette fraction de la portée */
const ALPHA = 0.5;
/** biais des ports vers l'axe du tracé (0 : pôle exact, 1 : direction réelle) */
const PORT_BIAS = 0.45;
/** marge autour d'un lac tiers (unités carte) */
const CLEARANCE = 30;
/** bombements essayés, par amplitude croissante */
const BOWS = [150, 300, 450, 600, 800];
const SAMPLES = 24;

function bezierAt(t: number, p0: P, c1: P, c2: P, p1: P): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1];
  const dx = 3 * u * u * (c1[0] - p0[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (p1[0] - c2[0]);
  const dy = 3 * u * u * (c1[1] - p0[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (p1[1] - c2[1]);
  return { x, y, angle: Math.atan2(dy, dx) };
}

function controls(axis: 'h' | 'v', p0: P, p1: P, bow: number): [P, P] {
  if (axis === 'h') {
    const s = p1[0] >= p0[0] ? 1 : -1;
    const reach = ALPHA * Math.abs(p1[0] - p0[0]);
    return [
      [p0[0] + s * reach, p0[1] + bow],
      [p1[0] - s * reach, p1[1] + bow],
    ];
  }
  const s = p1[1] >= p0[1] ? 1 : -1;
  const reach = ALPHA * Math.abs(p1[1] - p0[1]);
  return [
    [p0[0] + bow, p0[1] + s * reach],
    [p1[0] + bow, p1[1] - s * reach],
  ];
}

/** Nombre de lacs tiers traversés par la courbe (échantillonnée). */
function hits(p0: P, c1: P, c2: P, p1: P, obstacles: readonly Obstacle[]): number {
  let n = 0;
  for (const o of obstacles) {
    const limit = o.r + CLEARANCE;
    for (let i = 1; i < SAMPLES; i++) {
      const q = bezierAt(i / SAMPLES, p0, c1, c2, p1);
      if (Math.hypot(q.x - o.x, q.y - o.y) < limit) {
        n++;
        break;
      }
    }
  }
  return n;
}

/**
 * Géométrie d'un lien entre deux territoires. `obstacles` : les autres lacs
 * (la source et la cible en sont exclues automatiquement).
 */
export function linkGeometry(link: Link, a: TerritoryLayout, b: TerritoryLayout, obstacles: readonly Obstacle[] = []): LinkGeometry {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  if (Math.hypot(dx, dy) < 1e-6) {
    dx = 1;
    dy = 0;
  }
  const axis: 'h' | 'v' = Math.abs(dx) >= 0.7 * Math.abs(dy) ? 'h' : 'v';
  // port : point du bord dans la direction de l'autre domaine, rabattue vers l'axe
  const bx = axis === 'h' ? dx : PORT_BIAS * dx;
  const by = axis === 'h' ? PORT_BIAS * dy : dy;
  const bl = Math.hypot(bx, by) || 1;
  const ux = bx / bl;
  const uy = by / bl;
  const p0: P = [a.x + ux * a.r, a.y + uy * a.r];
  const p1: P = [b.x - ux * b.r, b.y - uy * b.r];

  // obstacles plausibles : dans l'enveloppe du tracé élargie du plus grand bombement
  const maxBow = BOWS[BOWS.length - 1];
  const minX = Math.min(p0[0], p1[0]) - maxBow;
  const maxX = Math.max(p0[0], p1[0]) + maxBow;
  const minY = Math.min(p0[1], p1[1]) - maxBow;
  const maxY = Math.max(p0[1], p1[1]) + maxBow;
  const near = obstacles.filter(
    (o) => o.id !== a.id && o.id !== b.id && o.x + o.r > minX && o.x - o.r < maxX && o.y + o.r > minY && o.y - o.r < maxY,
  );

  // côté préféré du bombement : déterministe par lien
  const side = hashSeed(`${link.source}|${link.target}|${link.kind}`) % 2 === 0 ? 1 : -1;
  const candidates = [0, ...BOWS.flatMap((v) => [side * v, -side * v])];
  let best: { bow: number; c: [P, P]; n: number } | null = null;
  for (const bow of candidates) {
    const c = controls(axis, p0, p1, bow);
    const n = near.length ? hits(p0, c[0], c[1], p1, near) : 0;
    if (!best || n < best.n) best = { bow, c, n };
    if (n === 0) break;
  }
  const { bow, c } = best!;
  const [c1, c2] = c;
  const mid = bezierAt(0.5, p0, c1, c2, p1);
  const endAngle = Math.atan2(p1[1] - c2[1], p1[0] - c2[0]);
  return {
    link,
    d: `M ${p0[0]} ${p0[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p1[0]} ${p1[1]}`,
    mid: { x: mid.x, y: mid.y },
    midAngle: mid.angle,
    endAngle,
    axis,
    bow,
    x1: p0[0],
    y1: p0[1],
    x2: p1[0],
    y2: p1[1],
  };
}

/** Géométrie de tous les liens dont les deux bouts sont placés, en évitant les lacs tiers. */
export function computeLinkGeometries(links: readonly Link[], byId: Map<string, TerritoryLayout>, territories: readonly TerritoryLayout[]): LinkGeometry[] {
  const obstacles: Obstacle[] = territories.map((t) => ({ id: t.id, x: t.x, y: t.y, r: t.r }));
  const out: LinkGeometry[] = [];
  for (const l of links) {
    const a = byId.get(l.source);
    const b = byId.get(l.target);
    if (a && b) out.push(linkGeometry(l, a, b, obstacles));
  }
  return out;
}

/** Lien transversal : les deux domaines appartiennent à des ères différentes. */
export function isTransversal(l: Link): boolean {
  const a = DOMAIN_BY_ID[l.source];
  const b = DOMAIN_BY_ID[l.target];
  return !!a && !!b && a.era !== b.era;
}
