import type { ContinentId, LinkKind } from '../data/types';

/**
 * Teinte de base de chaque champ (degrés HSL) : la même pour son fleuve, ses
 * lacs (palettes des domaines, scripts/palettes.ts) et sa bande dans la frise.
 */
export const FIELD_HUE: Record<ContinentId, number> = {
  nombres: 40, // ocre
  formes: 205, // céruléen
  analyse: 262, // violet
  hasard: 14, // terre cuite
  fondements: 138, // vert sauge
};

export interface FieldColors {
  /** eau du fleuve (lavis moyen) */
  water: string;
  /** berges : trait d'encre teintée */
  bank: string;
  /** libellés (encre foncée de la teinte) */
  ink: string;
  /** lavis clair (frise, pastilles) */
  wash: string;
}

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const FIELD_COLORS = Object.fromEntries(
  (Object.entries(FIELD_HUE) as [ContinentId, number][]).map(([id, h]) => [
    id,
    { water: hsl(h, 50, 73), bank: hsl(h, 40, 44), ink: hsl(h, 55, 27), wash: hsl(h, 52, 85) },
  ]),
) as Record<ContinentId, FieldColors>;

/** Encres des liens entre domaines (courants) : distinctes des eaux des fleuves. */
export const LINK_INK: Record<LinkKind, string> = {
  filiation: '#1f3f5b',
  influence: '#3f6f94',
  affinite: '#7a6a98',
  reaction: '#b5412a',
};

/** Couleur des chaînes amont (sélection) : bleu de Prusse. */
export const UPSTREAM_INK = '#1d5f96';
/** Couleur de l'aval direct (sélection). */
export const DOWNSTREAM_INK = '#8a5a1c';
