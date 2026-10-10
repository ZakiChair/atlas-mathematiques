import type { MathematicianLink } from './types';
import { MATHEMATICIAN_LINKS_ANTIQUITE } from './domains/antiquite';
import { MATHEMATICIAN_LINKS_MEDIEVAL } from './domains/medieval';
import { MATHEMATICIAN_LINKS_RENAISSANCE } from './domains/renaissance';
import { MATHEMATICIAN_LINKS_LUMIERES } from './domains/lumieres';
import { MATHEMATICIAN_LINKS_DIXNEUVIEME_A } from './domains/dixneuvieme-a';
import { MATHEMATICIAN_LINKS_DIXNEUVIEME_B } from './domains/dixneuvieme-b';
import { MATHEMATICIAN_LINKS_STRUCTURES_A } from './domains/structures-a';
import { MATHEMATICIAN_LINKS_STRUCTURES_B } from './domains/structures-b';
import { MATHEMATICIAN_LINKS_CONTEMPORAIN_A } from './domains/contemporain-a';
import { MATHEMATICIAN_LINKS_CONTEMPORAIN_B } from './domains/contemporain-b';

/**
 * Liens entre mathématicien·nes, à travers les domaines et les époques.
 * kind : 'filiation' (maître/élève, thèse dirigée), 'influence' (lecture
 * décisive, problème repris), 'collaboration' (travail commun, correspondance
 * suivie), 'affinite' (parenté reconnue après coup), 'reaction' (querelle,
 * opposition de méthode). Chaque lien est déclaré dans le fichier de l'ère
 * de sa cible.
 */
export const MATHEMATICIAN_LINKS: MathematicianLink[] = [
  ...MATHEMATICIAN_LINKS_ANTIQUITE,
  ...MATHEMATICIAN_LINKS_MEDIEVAL,
  ...MATHEMATICIAN_LINKS_RENAISSANCE,
  ...MATHEMATICIAN_LINKS_LUMIERES,
  ...MATHEMATICIAN_LINKS_DIXNEUVIEME_A,
  ...MATHEMATICIAN_LINKS_DIXNEUVIEME_B,
  ...MATHEMATICIAN_LINKS_STRUCTURES_A,
  ...MATHEMATICIAN_LINKS_STRUCTURES_B,
  ...MATHEMATICIAN_LINKS_CONTEMPORAIN_A,
  ...MATHEMATICIAN_LINKS_CONTEMPORAIN_B,
];

/** Index par mathématicien·ne (source et cible). */
export const MATHEMATICIAN_LINKS_BY_ID: Record<string, MathematicianLink[]> = {};
for (const l of MATHEMATICIAN_LINKS) {
  (MATHEMATICIAN_LINKS_BY_ID[l.source] ??= []).push(l);
  (MATHEMATICIAN_LINKS_BY_ID[l.target] ??= []).push(l);
}
