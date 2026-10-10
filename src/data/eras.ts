import type { Era, EraId, Continent } from './types';

export const ERAS: Era[] = [
  {
    id: 'antiquite',
    name: 'Antiquité',
    period: { start: -1800, end: 500 },
    tagline: 'Des tablettes de Babylone aux Éléments : le calcul des scribes, puis l’invention de la preuve.',
  },
  {
    id: 'medieval',
    name: 'Monde médiéval',
    period: { start: 500, end: 1450 },
    tagline: 'Bagdad, l’Inde, la Chine, puis l’Occident latin : le zéro, l’algèbre, les algorithmes.',
  },
  {
    id: 'renaissance',
    name: 'Renaissance et révolution scientifique',
    shortName: 'Renaissance',
    period: { start: 1450, end: 1700 },
    tagline: 'Équations du troisième degré, coordonnées, hasard calculé, calcul infinitésimal.',
  },
  {
    id: 'lumieres',
    name: 'Siècle des Lumières',
    period: { start: 1700, end: 1800 },
    tagline: 'Euler, les Bernoulli, Lagrange, Laplace : l’analyse conquiert la mécanique et le ciel.',
  },
  {
    id: 'dixneuvieme',
    name: 'XIXᵉ siècle',
    period: { start: 1800, end: 1900 },
    tagline: 'Rigueur, abstraction, géométries nouvelles : le siècle qui redéfinit nombre, espace et fonction.',
  },
  {
    id: 'structures',
    name: 'Âge des structures',
    period: { start: 1900, end: 1960 },
    tagline: 'Hilbert, Noether, Gödel, Turing, Bourbaki : axiomes, structures et limites du calcul.',
  },
  {
    id: 'contemporain',
    name: 'Contemporain',
    period: { start: 1960, end: null },
    tagline: 'Ordinateurs, grandes conjectures résolues, ponts entre domaines.',
  },
];

/**
 * Bandes de continents sur l'axe vertical (unités carte), contiguës et de hauteur
 * proportionnelle au nombre de domaines qu'elles accueillent.
 */
export const CONTINENTS: Continent[] = [
  { id: 'nombres', name: 'Nombres et algèbre', shortName: 'Nombres', laneY: 470, y0: 0, y1: 940 },
  { id: 'formes', name: 'Formes et espaces', shortName: 'Formes', laneY: 1400, y0: 940, y1: 1860 },
  { id: 'analyse', name: 'Analyse et mouvement', shortName: 'Analyse', laneY: 2290, y0: 1860, y1: 2720 },
  { id: 'hasard', name: 'Hasard, discret et calcul', shortName: 'Hasard et calcul', laneY: 3230, y0: 2720, y1: 3740 },
  { id: 'fondements', name: 'Logique et fondements', shortName: 'Fondements', laneY: 4120, y0: 3740, y1: 4500 },
];

/**
 * Bandes d'ères sur l'axe horizontal (unités carte). La chronologie n'est
 * qu'approximative : l'axe horizontal ordonne les domaines par ère, l'axe
 * vertical par continent dominant. Les largeurs suivent la densité du corpus,
 * pas la durée des ères (l'Antiquité couvre 2 300 ans, le XIXᵉ siècle cent).
 */
export const ERA_BANDS: { era: EraId; x0: number; x1: number }[] = [
  { era: 'antiquite', x0: 0, x1: 1000 },
  { era: 'medieval', x0: 1000, x1: 1800 },
  { era: 'renaissance', x0: 1800, x1: 2650 },
  { era: 'lumieres', x0: 2650, x1: 3300 },
  { era: 'dixneuvieme', x0: 3300, x1: 4650 },
  { era: 'structures', x0: 4650, x1: 5950 },
  { era: 'contemporain', x0: 5950, x1: 7400 },
];

/** Bornes temporelles de l'atlas (filtres chronologiques). */
export const TIME_BOUNDS = { start: -1800, end: 2025 } as const;

/** Dimensions de l'espace carte en unités virtuelles. */
export const MAP_SIZE = { width: 7400, height: 4500 } as const;
