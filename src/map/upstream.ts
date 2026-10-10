import type { Link, LinkKind } from '../data/types';

/**
 * Liens qui « transmettent » : continuité directe ou reprise documentée. Les
 * affinités (parentés reconnues après coup) et les réactions (ruptures) ne
 * font pas partie du cours amont.
 */
export const TRANSMISSION: ReadonlySet<LinkKind> = new Set<LinkKind>(['filiation', 'influence']);

/** Clé stable d'un lien (les liens localisés sont des copies des originaux). */
export const linkKey = (l: Link) => `${l.source}|${l.target}|${l.kind}`;

export interface Chain {
  /** domaine amont → génération (1 = affluent direct) */
  upstream: Map<string, number>;
  /** liens de transmission qui composent le bassin amont */
  upstreamLinks: Set<Link>;
  /** domaines alimentés directement par le domaine choisi */
  downstream: Set<string>;
  downstreamLinks: Set<Link>;
  /** nombre de générations remontées */
  depth: number;
}

/**
 * Bassin versant d'un domaine : tout ce qui y conduit par des liens de
 * transmission, en remontant de proche en proche (parcours en largeur, la
 * génération retenue est la plus courte).
 */
export function chainOf(links: readonly Link[], id: string): Chain {
  const into = new Map<string, Link[]>();
  for (const l of links) {
    if (!TRANSMISSION.has(l.kind)) continue;
    const g = into.get(l.target) ?? [];
    g.push(l);
    into.set(l.target, g);
  }
  const upstream = new Map<string, number>();
  const upstreamLinks = new Set<Link>();
  let frontier = [id];
  let depth = 0;
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const u of frontier) {
      for (const l of into.get(u) ?? []) {
        if (l.source === id) continue;
        upstreamLinks.add(l);
        if (!upstream.has(l.source)) {
          upstream.set(l.source, depth + 1);
          next.push(l.source);
        }
      }
    }
    if (next.length > 0) depth++;
    frontier = next;
  }
  const downstreamLinks = new Set(links.filter((l) => l.source === id && TRANSMISSION.has(l.kind)));
  const downstream = new Set([...downstreamLinks].map((l) => l.target));
  return { upstream, upstreamLinks, downstream, downstreamLinks, depth };
}

/** Domaines amont groupés par génération (1, 2, …), dans l'ordre donné. */
export function generations(chain: Chain, order: readonly string[]): string[][] {
  const out: string[][] = Array.from({ length: chain.depth }, () => []);
  for (const id of order) {
    const g = chain.upstream.get(id);
    if (g) out[g - 1].push(id);
  }
  return out;
}
