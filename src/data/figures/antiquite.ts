import type { Mathematician } from '../types';

/** Fiches courtes de l’Antiquité, par domaine d’attache (vague 4 ; docs/corpus/BRIEF.md, § 11). */
export const FIGURES_ANTIQUITE: Record<string, Mathematician[]> = {
  'geometrie-grecque': [
    {
      id: 'menechme',
      name: 'Ménechme',
      years: [-380, -320],
      yearsApprox: true,
      origin: 'Athènes',
      bio: 'Élève d’Eudoxe, Ménechme passe pour avoir découvert les sections coniques en cherchant à dupliquer le cube.',
      mactutor: 'Menaechmus',
      sources: ['mactutor'],
    },
  ],
};
