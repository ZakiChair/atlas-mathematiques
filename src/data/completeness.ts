import type { Domain, Result } from './types';

/**
 * Seuils de complétude du corpus, relevés à la fin de chaque vague de la
 * refonte (docs/superpowers/plans/2026-10-12-refonte-galerie.md). La forme
 * des données est contrôlée en permanence par validate.ts ; ces seuils
 * disent seulement jusqu'où le contenu est déjà écrit.
 */
export const COMPLETENESS = {
  /** nombre minimal de grandes figures (sous-projet 1 : liste éditoriale) */
  featuredMin: 40,
  /** toute grande figure a 2 à 4 apports (vague 2) */
  contributionsRequired: true,
  /** part des théorèmes dotés d'une intuition et d'une démonstration, et des conjectures et problèmes dotés d'une intuition (vague 3) */
  proofsCoverage: 1,
  /** nombre minimal de figures (vague 4) */
  mathematiciansMin: 1150,
  /** part des figures dotées d'un slug MacTutor (vague 4) */
  mactutorCoverage: 0.85,
};

/** Un résultat est « complet » pour la vague 3 : théorème → intuition + démonstration ; conjecture, problème → intuition. */
export function hasProofMaterial(r: Result): boolean {
  if (r.kind === 'theoreme') return (r.intuition?.length ?? 0) > 0 && (r.proof?.length ?? 0) > 0;
  if (r.kind === 'conjecture' || r.kind === 'probleme') return (r.intuition?.length ?? 0) > 0;
  return true;
}

export interface Coverage {
  featured: number;
  featuredWithContributions: number;
  proofTargets: number;
  proofDone: number;
  mathematicians: number;
  withMactutor: number;
}

/** Mesure de l'avancement du corpus (utilisée par le test de complétude et par scripts/coverage.ts). */
export function coverage(domains: readonly Domain[]): Coverage {
  const figures = domains.flatMap((d) => d.mathematicians);
  const featured = figures.filter((m) => m.featured);
  const targets = domains.flatMap((d) => d.results).filter((r) => r.kind === 'theoreme' || r.kind === 'conjecture' || r.kind === 'probleme');
  return {
    featured: featured.length,
    featuredWithContributions: featured.filter((m) => (m.featured?.contributions.length ?? 0) >= 2).length,
    proofTargets: targets.length,
    proofDone: targets.filter(hasProofMaterial).length,
    mathematicians: figures.length,
    withMactutor: figures.filter((m) => m.mactutor).length,
  };
}
