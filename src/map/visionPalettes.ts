import type { Domain, Result, ResultKind } from '../data/types';

/**
 * Vision « natures de résultats » : chaque lac prend l'encre de la nature
 * dominante de ses résultats (mêmes teintes que les pastilles `.badge-kind-*`).
 * `wash` : lavis clair du lac ; `stroke` : encre du contour et des libellés.
 */
export const KIND_INK: Record<ResultKind, { stroke: string; wash: string }> = {
  theoreme: { stroke: '#1f4e79', wash: '#d3e1ee' },
  conjecture: { stroke: '#6b4c9a', wash: '#e2d9ef' },
  concept: { stroke: '#2a7383', wash: '#d2e8ea' },
  methode: { stroke: '#3f7a3a', wash: '#dceada' },
  texte: { stroke: '#8a5a1c', wash: '#f0e2cc' },
  probleme: { stroke: '#b23a22', wash: '#f4d9d0' },
};

/** Nature dominante des résultats du domaine (à égalité : la première atteinte). */
export function dominantKind(results: Result[]): ResultKind {
  const counts = new Map<ResultKind, number>();
  let best: ResultKind = 'theoreme';
  let max = 0;
  for (const r of results) {
    const n = (counts.get(r.kind) ?? 0) + 1;
    counts.set(r.kind, n);
    if (n > max) {
      max = n;
      best = r.kind;
    }
  }
  return best;
}

/** Le domaine contient-il au moins un résultat de cette nature ? */
export function domainHasKind(m: Domain, kind: ResultKind): boolean {
  return m.results.some((r) => r.kind === kind);
}
