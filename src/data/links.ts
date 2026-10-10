import type { Link } from './types';
import { LINKS_ANTIQUITE } from './domains/antiquite';
import { LINKS_MEDIEVAL } from './domains/medieval';
import { LINKS_RENAISSANCE } from './domains/renaissance';
import { LINKS_LUMIERES } from './domains/lumieres';
import { LINKS_DIXNEUVIEME_A } from './domains/dixneuvieme-a';
import { LINKS_DIXNEUVIEME_B } from './domains/dixneuvieme-b';
import { LINKS_STRUCTURES_A } from './domains/structures-a';
import { LINKS_STRUCTURES_B } from './domains/structures-b';
import { LINKS_CONTEMPORAIN_A } from './domains/contemporain-a';
import { LINKS_CONTEMPORAIN_B } from './domains/contemporain-b';

/**
 * Liens entre domaines. Chaque lien est déclaré dans le fichier de l'ère de
 * son domaine d'arrivée (`target`) ; la source peut appartenir à une ère
 * antérieure ou à la même ère.
 */
export const LINKS: Link[] = [
  ...LINKS_ANTIQUITE,
  ...LINKS_MEDIEVAL,
  ...LINKS_RENAISSANCE,
  ...LINKS_LUMIERES,
  ...LINKS_DIXNEUVIEME_A,
  ...LINKS_DIXNEUVIEME_B,
  ...LINKS_STRUCTURES_A,
  ...LINKS_STRUCTURES_B,
  ...LINKS_CONTEMPORAIN_A,
  ...LINKS_CONTEMPORAIN_B,
];
