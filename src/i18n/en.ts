/**
 * Traductions anglaises du corpus. Toute clé absente retombe sur le texte
 * français à l'affichage ; l'interface (src/i18n/ui.ts) est, elle, entièrement
 * traduite. Le corpus EN pourra être produit plus tard par un script de
 * traduction dédié ; en attendant, EN reste vide et l'anglais n'affecte que
 * l'interface.
 */

export interface EnDomain {
  name?: string;
  altNames?: string[];
  tagline?: string;
  summary?: string;
  places?: string[];
  keyDates?: string[];
  methods?: string[];
  context?: string[];
  debates?: string[];
  theories?: Record<string, { name?: string; summary?: string; traits?: string[] }>;
  mathematicians?: Record<string, { bio?: string; origin?: string }>;
  results?: Record<string, { title?: string; statement?: string; comment?: string }>;
}

export interface EnData {
  eras: Record<string, { name?: string; tagline?: string }>;
  continents: Record<string, { name?: string; shortName?: string }>;
  domains: Record<string, EnDomain>;
  /** clé : `${source}|${target}|${kind}` */
  links: Record<string, { label?: string; note?: string }>;
  /** clé : `${source}|${target}|${kind}` */
  mathematicianLinks: Record<string, { note?: string }>;
  sources: Record<string, { note?: string }>;
}

export const EMPTY_EN: EnData = {
  eras: {},
  continents: {},
  domains: {},
  links: {},
  mathematicianLinks: {},
  sources: {},
};

export const EN: EnData = {
  ...EMPTY_EN,
  eras: {
    antiquite: { name: 'Antiquity', tagline: 'From Babylonian tablets to the Elements: the scribes’ reckoning, then the invention of proof.' },
    medieval: { name: 'Medieval world', tagline: 'Baghdad, India, China, then the Latin West: zero, algebra, algorithms.' },
    renaissance: { name: 'Renaissance and scientific revolution', tagline: 'Cubic equations, coordinates, calculated chance, the calculus.' },
    lumieres: { name: 'Age of Enlightenment', tagline: 'Euler, the Bernoullis, Lagrange, Laplace: analysis conquers mechanics and the heavens.' },
    dixneuvieme: { name: '19th century', tagline: 'Rigour, abstraction, new geometries: the century that redefined number, space and function.' },
    structures: { name: 'Age of structures', tagline: 'Hilbert, Noether, Gödel, Turing, Bourbaki: axioms, structures and the limits of computation.' },
    contemporain: { name: 'Contemporary', tagline: 'Computers, great conjectures settled, bridges between fields.' },
  },
  continents: {
    nombres: { name: 'Numbers and algebra', shortName: 'Numbers' },
    formes: { name: 'Shapes and spaces', shortName: 'Shapes' },
    analyse: { name: 'Analysis and motion', shortName: 'Analysis' },
    hasard: { name: 'Chance, discrete and computation', shortName: 'Chance and computation' },
    fondements: { name: 'Logic and foundations', shortName: 'Foundations' },
  },
};
