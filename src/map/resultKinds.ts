import type { ResultKind } from '../data/types';

/** Encre de chaque nature de résultat (losanges de la carte ; mêmes teintes que les pastilles `.badge-kind-*`). */
export const KIND_INK: Record<ResultKind, string> = {
  theoreme: '#1f4e79',
  conjecture: '#6b4c9a',
  concept: '#2a7383',
  methode: '#3f7a3a',
  texte: '#8a5a1c',
  probleme: '#b23a22',
};
