import type { Mathematician } from '../types';

/** Fiches courtes des figures physiques (av. J.-C. → 1700), rangées par domaine. */
export const FIGURES_PHYSIQUE_A: Record<string, Mathematician[]> = {
  'optique-antique-et-medievale': [
    {
      id: 'anthemius',
      name: 'Anthemius de Tralles',
      years: [474, 534],
      yearsApprox: true,
      origin: 'Tralles et Constantinople',
      bio: 'Architecte de Sainte-Sophie (avec Isidore de Milet), Anthemius écrit aussi un traité sur les miroirs ardents, où il démontre la propriété de la parabole de concentrer les rayons parallèles en son foyer.',
      theoryId: 'oa-optique-geometrique-antique',
      mactutor: 'Anthemius',
      sources: ['mactutor'],
    },
    {
      id: 'hunayn-ibn-ishaq',
      name: 'Hunayn ibn Isḥāq',
      years: [808, 873],
      origin: 'Bagdad',
      bio: 'Grand traducteur de la Maison de la sagesse, Hunayn rend en arabe Galien et les Éléments d’Euclide ; son Livre des dix traités de l’œil est la première anatomie systématique de l’organe de la vision.',
      theoryId: 'oa-science-de-la-vision',
      mactutor: 'Hunayn',
      sources: ['mactutor'],
    },
  ],
};
