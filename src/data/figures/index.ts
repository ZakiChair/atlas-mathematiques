import type { Mathematician } from '../types';
import { FIGURES_ANTIQUITE } from './antiquite';
import { FIGURES_MEDIEVAL } from './medieval';
import { FIGURES_RENAISSANCE } from './renaissance';
import { FIGURES_LUMIERES } from './lumieres';
import { FIGURES_DIXNEUVIEME_A } from './dixneuvieme-a';
import { FIGURES_DIXNEUVIEME_B } from './dixneuvieme-b';
import { FIGURES_STRUCTURES_A } from './structures-a';
import { FIGURES_STRUCTURES_B } from './structures-b';
import { FIGURES_CONTEMPORAIN_A } from './contemporain-a';
import { FIGURES_CONTEMPORAIN_B } from './contemporain-b';

/**
 * Fiches courtes de la vague 4 : figures vérifiées sur MacTutor, sans résultat
 * obligatoire, rangées par domaine d'attache (clé : Domain.id). Elles sont
 * ajoutées aux figures de leur domaine au chargement (src/data/index.ts).
 */
export const EXTRA_FIGURES: Record<string, Mathematician[]> = {};
for (const part of [
  FIGURES_ANTIQUITE,
  FIGURES_MEDIEVAL,
  FIGURES_RENAISSANCE,
  FIGURES_LUMIERES,
  FIGURES_DIXNEUVIEME_A,
  FIGURES_DIXNEUVIEME_B,
  FIGURES_STRUCTURES_A,
  FIGURES_STRUCTURES_B,
  FIGURES_CONTEMPORAIN_A,
  FIGURES_CONTEMPORAIN_B,
]) {
  for (const [domainId, list] of Object.entries(part)) (EXTRA_FIGURES[domainId] ??= []).push(...list);
}
