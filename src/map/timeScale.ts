import { ERAS, ERA_BANDS, TIME_BOUNDS } from '../data/eras';

/**
 * Échelle du temps de la carte : chaque ère occupe sa bande (ERA_BANDS), à
 * l'intérieur de laquelle les années sont réparties linéairement. L'échelle
 * est donc linéaire par morceaux : l'Antiquité (2 300 ans) et le XIXᵉ siècle
 * (100 ans) ont des largeurs comparables.
 */
const STOPS: { year: number; x: number }[] = [
  ...ERA_BANDS.map((band) => {
    const era = ERAS.find((e) => e.id === band.era);
    if (!era) throw new Error(`ère inconnue ${band.era}`);
    return { year: era.period.start, x: band.x0 };
  }),
  { year: TIME_BOUNDS.end, x: ERA_BANDS[ERA_BANDS.length - 1].x1 },
];

/** Année → abscisse carte (bornée aux limites de l'atlas). */
export function yearToX(year: number): number {
  if (year <= STOPS[0].year) return STOPS[0].x;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (year <= b.year) return a.x + ((year - a.year) / (b.year - a.year)) * (b.x - a.x);
  }
  return STOPS[STOPS.length - 1].x;
}

/** Abscisse carte → année (réelle, non arrondie). */
export function xToYear(x: number): number {
  if (x <= STOPS[0].x) return STOPS[0].year;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (x <= b.x) return a.year + ((x - a.x) / (b.x - a.x)) * (b.year - a.year);
  }
  return STOPS[STOPS.length - 1].year;
}

/** Arrondit une année réelle pour l'affichage (l'année 0 n'existe pas). */
export function displayYear(y: number): number {
  const r = Math.round(y);
  return r === 0 ? 1 : r;
}

/** Graduations de la frise : quelques années rondes par ère. */
export const YEAR_TICKS = [-1500, -1000, -500, 1, 500, 1000, 1500, 1600, 1700, 1750, 1800, 1850, 1900, 1930, 1960, 1990, 2020];
