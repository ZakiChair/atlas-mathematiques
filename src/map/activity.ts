import { MAP_SIZE } from '../data/eras';
import type { ContinentId, Domain } from '../data/types';
import { yearToX } from './timeScale';

export interface Activity {
  /** largeur d'une tranche, en unités carte */
  step: number;
  /** résultats recensés par tranche de l'axe de la carte, pour chaque champ */
  series: Record<ContinentId, number[]>;
}

/**
 * Activité des champs : résultats de l'atlas comptés par tranche de l'axe
 * horizontal de la carte (et non par année : la frise suit l'échelle de la
 * carte, où chaque ère a sa largeur). Le champ d'un résultat est le champ
 * principal de son domaine.
 */
export function activity(domains: readonly Domain[], order: readonly ContinentId[], bins: number): Activity {
  const step = MAP_SIZE.width / bins;
  const series = Object.fromEntries(order.map((c) => [c, new Array<number>(bins).fill(0)])) as Record<ContinentId, number[]>;
  for (const d of domains) {
    const s = series[d.continents[0]];
    if (!s) continue;
    for (const r of d.results) {
      const i = Math.min(bins - 1, Math.max(0, Math.floor(yearToX(r.year) / step)));
      s[i] += 1;
    }
  }
  return { step, series };
}

/** Lissage par noyau triangulaire (rayon en tranches) ; la somme est conservée hors des bords. */
export function smooth(values: readonly number[], radius: number): number[] {
  if (radius <= 0) return [...values];
  const w: number[] = [];
  for (let k = -radius; k <= radius; k++) w.push(radius + 1 - Math.abs(k));
  const total = w.reduce((a, b) => a + b, 0);
  return values.map((_, i) => {
    let s = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = i + k;
      if (j >= 0 && j < values.length) s += values[j] * w[k + radius];
    }
    return s / total;
  });
}
