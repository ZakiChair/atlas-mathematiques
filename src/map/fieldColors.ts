import type { ContinentId, LinkKind } from '../data/types';

/**
 * Teinte de base de chaque champ (degrés HSL) : la même pour sa bande, ses
 * lacs (palettes des domaines, scripts/palettes.ts), ses portées et sa part
 * de la frise.
 */
export const FIELD_HUE: Record<ContinentId, number> = {
  nombres: 40, // ocre
  formes: 207, // cobalt
  analyse: 265, // violet
  hasard: 14, // terre cuite
  fondements: 140, // vert sauge
};

export interface FieldColors {
  /** encre du champ : contours, libellés, portées */
  ink: string;
  /** bande du champ (fond très pâle, posé en transparence) */
  band: string;
  /** lavis clair (frise, pastilles) */
  wash: string;
  /** pigment vif (repères, sélection) */
  accent: string;
}

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const FIELD_COLORS = Object.fromEntries(
  (Object.entries(FIELD_HUE) as [ContinentId, number][]).map(([id, h]) => [
    id,
    { ink: hsl(h, 50, 30), band: hsl(h, 48, 90), wash: hsl(h, 45, 84), accent: hsl(h, 58, 44) },
  ]),
) as Record<ContinentId, FieldColors>;

/**
 * Encres des liens entre domaines. La transmission (filiation, influence) est
 * à l'encre neutre, comme les traits d'un arbre généalogique ; l'affinité est
 * un gris violacé ; la rupture, la sanguine. Le bleu de Prusse et le sépia
 * sont réservés au bassin du domaine choisi (amont, aval).
 */
export const LINK_INK: Record<LinkKind, string> = {
  filiation: '#2a2621',
  influence: '#4d473e',
  affinite: '#7f758d',
  reaction: '#b5412a',
};

/** Bassin amont du domaine choisi : bleu de Prusse. */
export const UPSTREAM_INK = '#1d5f96';
/** Bassin aval du domaine choisi : sépia. */
export const DOWNSTREAM_INK = '#9a5b16';
