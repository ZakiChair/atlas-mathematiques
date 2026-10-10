import type { NodeKind } from '../data/types';

const KIND_TO_PATH: Record<NodeKind, string> = {
  domain: 'domaine',
  theory: 'theorie',
  mathematician: 'mathematicien',
  result: 'resultat',
};
const PATH_TO_KIND: Record<string, NodeKind> = {
  domaine: 'domain',
  theorie: 'theory',
  mathematicien: 'mathematician',
  resultat: 'result',
};

export function hashFor(kind: NodeKind, id: string): string {
  return `#/${KIND_TO_PATH[kind]}/${id}`;
}

export function parseHash(hash: string): { kind: NodeKind; id: string } | null {
  const m = /^#\/(\w+)\/([\w-]+)/.exec(hash);
  if (!m) return null;
  const kind = PATH_TO_KIND[m[1]];
  if (!kind) return null;
  return { kind, id: decodeURIComponent(m[2]) };
}
