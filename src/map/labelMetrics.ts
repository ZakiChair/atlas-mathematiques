import type { Domain } from '../data/types';
import { mapLabel, wrapName } from './labels';

/** largeur moyenne d'une capitale de DM Sans grasse, interlettrage de 0,06 em compris, en em */
export const CAP_EM = 0.72;
/** bornes de la taille du nom d'un domaine à l'écran (px) */
export const DOMAIN_NAME_PX = { min: 8, max: 15 };

export interface DomainNameMetrics {
  lines: string[];
  /** taille du nom à l'écran (px) */
  fontPx: number;
  /** boîte du nom à l'écran (px) */
  w: number;
  h: number;
}

/**
 * Nom d'un domaine sur la carte : 1 à 3 lignes de 15 capitales au plus, à une
 * taille d'écran qui suit le disque (la ligne la plus longue occupe ≈ 1,5 r),
 * bornée entre 8 et 15 px. Sert au dessin du nom (Territory) et au
 * désencombrement des autres noms (LabelLayer), qui l'évitent.
 */
export function domainNameMetrics(domain: Pick<Domain, 'name' | 'mapName'>, r: number, k: number): DomainNameMetrics {
  const lines = wrapName(mapLabel(domain));
  const longest = Math.max(...lines.map((l) => l.length), 1);
  const fit = (1.5 * r * k) / (longest * CAP_EM);
  const fontPx = Math.max(DOMAIN_NAME_PX.min, Math.min(DOMAIN_NAME_PX.max, fit));
  return { lines, fontPx, w: longest * CAP_EM * fontPx, h: lines.length * fontPx * 1.15 };
}

/** Centre du nom d'un domaine (unités carte) : haut du disque, plus haut encore à partir du niveau 1. */
export function domainNameCenter(t: { x: number; y: number; r: number }, level: number): { x: number; y: number } {
  return { x: t.x, y: t.y - (level >= 1 ? 0.74 : 0.42) * t.r };
}
