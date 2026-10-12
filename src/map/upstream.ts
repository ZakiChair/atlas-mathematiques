import type { Link, LinkKind } from '../data/types';

/**
 * Liens qui « transmettent » : continuité directe ou reprise documentée. Les
 * affinités (parentés reconnues après coup) et les réactions (ruptures) ne
 * font partie ni de l'amont ni de l'aval.
 */
export const TRANSMISSION: ReadonlySet<LinkKind> = new Set<LinkKind>(['filiation', 'influence']);

/** Clé stable d'un lien (les liens localisés sont des copies des originaux). */
export const linkKey = (l: Link) => `${l.source}|${l.target}|${l.kind}`;

export interface Chain {
  /** domaine amont → génération (1 = affluent direct) */
  upstream: Map<string, number>;
  /** liens de transmission qui composent le bassin amont */
  upstreamLinks: Set<Link>;
  /** domaine aval → génération (1 = alimenté directement) */
  downstream: Map<string, number>;
  /** liens de transmission qui composent le bassin aval */
  downstreamLinks: Set<Link>;
  /** nombre de générations remontées */
  depth: number;
  /** nombre de générations descendues */
  downDepth: number;
}

/**
 * Parcours en largeur depuis `id` le long des liens de transmission, dans le
 * sens donné (`from` : bout du lien par lequel on arrive sur un domaine déjà
 * atteint, `to` : bout que l'on découvre). La génération retenue est la plus
 * courte ; le domaine de départ n'est jamais inclus (cycles).
 */
function walk(links: readonly Link[], id: string, from: 'source' | 'target', to: 'source' | 'target') {
  const adj = new Map<string, Link[]>();
  for (const l of links) {
    if (!TRANSMISSION.has(l.kind)) continue;
    const g = adj.get(l[from]) ?? [];
    g.push(l);
    adj.set(l[from], g);
  }
  const gens = new Map<string, number>();
  const used = new Set<Link>();
  let frontier = [id];
  let depth = 0;
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const u of frontier) {
      for (const l of adj.get(u) ?? []) {
        const v = l[to];
        if (v === id) continue;
        used.add(l);
        if (!gens.has(v)) {
          gens.set(v, depth + 1);
          next.push(v);
        }
      }
    }
    if (next.length > 0) depth++;
    frontier = next;
  }
  return { gens, used, depth };
}

/**
 * Bassin d'un domaine : en amont, tout ce qui y conduit par transmission, de
 * proche en proche ; en aval, tout ce qu'il a nourri, de proche en proche.
 */
export function chainOf(links: readonly Link[], id: string): Chain {
  const up = walk(links, id, 'target', 'source');
  const down = walk(links, id, 'source', 'target');
  return {
    upstream: up.gens,
    upstreamLinks: up.used,
    downstream: down.gens,
    downstreamLinks: down.used,
    depth: up.depth,
    downDepth: down.depth,
  };
}

/** Domaines d'un bassin groupés par génération (1, 2, …), dans l'ordre donné. */
export function generations(gens: ReadonlyMap<string, number>, order: readonly string[]): string[][] {
  let depth = 0;
  for (const g of gens.values()) depth = Math.max(depth, g);
  const out: string[][] = Array.from({ length: depth }, () => []);
  for (const id of order) {
    const g = gens.get(id);
    if (g) out[g - 1].push(id);
  }
  return out;
}
