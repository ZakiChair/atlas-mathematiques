import type { Domain, Result, ResultKind } from '../data/types';

/**
 * Vision « natures de résultats » : chaque territoire prend la couleur de la
 * nature dominante de ses résultats (teintes craie, fond ardoise).
 */
export const KIND_CHALK: Record<ResultKind, { stroke: string; accent: string }> = {
  theoreme: { stroke: '#e8c76a', accent: '#f4e0a4' },
  conjecture: { stroke: '#c9a0ff', accent: '#e2ccff' },
  concept: { stroke: '#9fc8e0', accent: '#cde6f4' },
  methode: { stroke: '#9ed1a2', accent: '#cfe8d2' },
  texte: { stroke: '#e8b08a', accent: '#f4d4ba' },
  probleme: { stroke: '#ff8f80', accent: '#ffc0b6' },
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
