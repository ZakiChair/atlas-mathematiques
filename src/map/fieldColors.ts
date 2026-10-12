import type { ContinentId } from '../data/types';

/**
 * Teinte de base de chaque champ (degrés HSL) : la même pour sa bande, les
 * disques de ses domaines (palettes, scripts/palettes.ts), les médailles de ses
 * grandes figures et sa part de la frise.
 */
export const FIELD_HUE: Record<ContinentId, number> = {
  nombres: 40, // ocre
  formes: 207, // cobalt
  analyse: 265, // violet
  hasard: 14, // terre cuite
  fondements: 140, // vert sauge
  physique: 175, // sarcelle
};

export interface FieldColors {
  /** encre du champ : noms des domaines, nom du champ dans la marge */
  ink: string;
  /** bande du champ, en fond de carte */
  band: string;
  /** lavis de la frise et des pastilles */
  wash: string;
  /** médaille d'une grande figure */
  medal: string;
}

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const FIELD_COLORS = Object.fromEntries(
  (Object.entries(FIELD_HUE) as [ContinentId, number][]).map(([id, h]) => [
    id,
    { ink: hsl(h, 45, 30), band: hsl(h, 45, 96), wash: hsl(h, 45, 84), medal: hsl(h, 55, 36) },
  ]),
) as Record<ContinentId, FieldColors>;

/** Encre des liens de transmission (filiation, influence) : neutre, comme un trait de généalogie. */
export const TRANSMISSION_INK = '#45413a';
/** Encre des ruptures : sanguine. */
export const RUPTURE_INK = '#b5412a';
/** Amont du domaine choisi : bleu de Prusse. */
export const UPSTREAM_INK = '#1d5f96';
/** Aval du domaine choisi : sépia. */
export const DOWNSTREAM_INK = '#9a5b16';
