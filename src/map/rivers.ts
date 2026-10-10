import * as d3 from 'd3';
import { MAP_SIZE } from '../data/eras';
import type { ContinentId, Domain } from '../data/types';
import type { TerritoryLayout } from './layout';
import { hashSeed } from '../lib/prng';

/**
 * Fleuves de la carte : un par champ (continent). Le cours relie les domaines
 * du champ dans l'ordre de l'axe du temps (convention de représentation, pas
 * une filiation documentée). La largeur traduit le nombre CUMULÉ de résultats
 * recensés dans l'atlas pour ce champ : un fleuve grossit de tout ce qui s'y
 * est déversé en amont, et ne rétrécit jamais.
 */
export interface RiverSample {
  x: number;
  y: number;
  /** largeur du lit (unités carte) */
  w: number;
}

export interface River {
  continent: ContinentId;
  /** domaines traversés, de la source à l'embouchure */
  domainIds: string[];
  samples: RiverSample[];
  /** lit : contour fermé */
  bed: string;
  /** berges (tracés ouverts) pour le trait d'encre */
  banks: [string, string];
  /** filets de courant à l'intérieur du lit */
  currents: string[];
  /** résultats cumulés à l'embouchure */
  total: number;
}

export const RIVER_WIDTH = { min: 14, max: 150 };
const STEP = 14;
/** la contribution d'un domaine monte de son centre jusqu'à 1,2 r en aval */
const FEED = 1.2;
/** évasement de l'embouchure (delta) sur les derniers 260 unités */
const DELTA = 260;

const smoothstep = (t: number) => {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
};

/** Interpolation cubique monotone (Fritsch–Carlson) de y(x) par les points donnés. */
export function monotoneY(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  if (n === 1) return () => ys[0];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

/** Largeur pour un cumul donné (racine : la surface du lit suit le cumul). */
export function widthFor(cumulative: number, maxTotal: number): number {
  if (maxTotal <= 0) return RIVER_WIDTH.min;
  return RIVER_WIDTH.min + (RIVER_WIDTH.max - RIVER_WIDTH.min) * Math.sqrt(Math.max(0, cumulative) / maxTotal);
}

const line = d3.line<[number, number]>().curve(d3.curveBasis);
const closed = d3.line<[number, number]>().curve(d3.curveBasisClosed);

export function computeRivers(domains: Domain[], byId: Map<string, TerritoryLayout>, order: ContinentId[]): River[] {
  const groups = order.map((c) => {
    const members = domains
      .filter((d) => d.continents[0] === c && byId.has(d.id))
      .map((d) => ({ d, t: byId.get(d.id)! }))
      .sort((a, b) => a.t.x - b.t.x);
    const total = members.reduce((s, m) => s + m.d.results.length, 0);
    return { c, members, total };
  });
  const maxTotal = Math.max(1, ...groups.map((g) => g.total));

  return groups
    .filter((g) => g.members.length > 0)
    .map(({ c, members, total }) => {
      const xs = members.map((m) => m.t.x);
      const ys = members.map((m) => m.t.y);
      const yAt = monotoneY(xs, ys);
      const x0 = xs[0];
      const x1 = MAP_SIZE.width;
      // berges irrégulières, déterministes par fleuve
      const seed = hashSeed(`river:${c}`);
      const ph = [(seed % 628) / 100, ((seed >> 10) % 628) / 100, ((seed >> 20) % 628) / 100];
      const wobble = (x: number, k: number) => 0.07 * Math.sin(x / 190 + ph[k]) + 0.04 * Math.sin(x / 67 + ph[(k + 1) % 3]);

      const samples: RiverSample[] = [];
      for (let x = x0; x <= x1 + 0.01; x += STEP) {
        let cum = 0;
        for (const m of members) cum += m.d.results.length * smoothstep((x - m.t.x) / (FEED * m.t.r));
        let w = widthFor(cum, maxTotal);
        if (x > x1 - DELTA) w *= 1 + 0.45 * smoothstep((x - (x1 - DELTA)) / DELTA);
        samples.push({ x, y: yAt(x), w });
      }

      // normales à la ligne médiane (différences centrées)
      const upper: [number, number][] = [];
      const lower: [number, number][] = [];
      const curA: [number, number][] = [];
      const curB: [number, number][] = [];
      for (let i = 0; i < samples.length; i++) {
        const p = samples[Math.max(0, i - 1)];
        const q = samples[Math.min(samples.length - 1, i + 1)];
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const s = samples[i];
        const hu = (s.w / 2) * (1 + wobble(s.x, 0));
        const hl = (s.w / 2) * (1 + wobble(s.x, 1));
        upper.push([s.x - nx * hu, s.y - ny * hu]);
        lower.push([s.x + nx * hl, s.y + ny * hl]);
        curA.push([s.x - nx * hu * 0.42, s.y - ny * hu * 0.42]);
        curB.push([s.x + nx * hl * 0.38, s.y + ny * hl * 0.38]);
      }
      const bed = closed([...upper, ...lower.slice().reverse()]) ?? '';
      return {
        continent: c,
        domainIds: members.map((m) => m.d.id),
        samples,
        bed,
        banks: [line(upper) ?? '', line(lower) ?? ''],
        currents: [line(curA) ?? '', line(curB) ?? ''],
        total,
      };
    });
}
