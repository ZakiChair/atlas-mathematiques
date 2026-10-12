import type { Mathematician, Domain } from './types';
import { ANTIQUITE } from './domains/antiquite';
import { MEDIEVAL } from './domains/medieval';
import { RENAISSANCE } from './domains/renaissance';
import { LUMIERES } from './domains/lumieres';
import { DIXNEUVIEME_A } from './domains/dixneuvieme-a';
import { DIXNEUVIEME_B } from './domains/dixneuvieme-b';
import { STRUCTURES_A } from './domains/structures-a';
import { STRUCTURES_B } from './domains/structures-b';
import { CONTEMPORAIN_A } from './domains/contemporain-a';
import { CONTEMPORAIN_B } from './domains/contemporain-b';
import { EXTRA_FIGURES } from './figures';

export { ERAS, CONTINENTS, ERA_BANDS, TIME_BOUNDS, MAP_SIZE } from './eras';
export { SOURCES, SOURCE_BY_ID } from './sources';
export { LINKS } from './links';
export * from './types';

/** Tous les domaines, dans l'ordre chronologique des périodes, avec leurs fiches courtes (vague 4). */
export const DOMAINS: Domain[] = [
  ...ANTIQUITE,
  ...MEDIEVAL,
  ...RENAISSANCE,
  ...LUMIERES,
  ...DIXNEUVIEME_A,
  ...DIXNEUVIEME_B,
  ...STRUCTURES_A,
  ...STRUCTURES_B,
  ...CONTEMPORAIN_A,
  ...CONTEMPORAIN_B,
]
  .map((d) => (EXTRA_FIGURES[d.id] ? { ...d, mathematicians: [...d.mathematicians, ...EXTRA_FIGURES[d.id]] } : d))
  .sort((a, b) => a.period.start - b.period.start);

export const DOMAIN_BY_ID: Record<string, Domain> = Object.fromEntries(DOMAINS.map((m) => [m.id, m]));

export const MATHEMATICIAN_BY_ID: Record<string, Mathematician> = Object.fromEntries(
  DOMAINS.flatMap((m) => m.mathematicians.map((f) => [f.id, f] as const)),
);

/** Domaine dans lequel chaque mathématicien·ne est rangé·e (les ids sont uniques globalement). */
export const DOMAIN_OF_MATHEMATICIAN: Record<string, Domain> = Object.fromEntries(
  DOMAINS.flatMap((m) => m.mathematicians.map((f) => [f.id, m] as const)),
);

export { MATHEMATICIAN_LINKS, MATHEMATICIAN_LINKS_BY_ID } from './mathematicianLinks';
