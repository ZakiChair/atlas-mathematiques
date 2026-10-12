import type { Domain, Link } from '../data/types';
import { TRANSMISSION, linkKey } from './upstream';

/**
 * Rang d'un lien candidat au titre d'ascendant principal (ordre lexicographique,
 * le plus petit gagne) : marqué `principal` à la main, filiation avant
 * influence, fait avant interprétation, même champ principal avant champ
 * différent, domaine source le plus récent (début de période).
 */
function rank(l: Link, domainById: Readonly<Record<string, Domain>>): number[] {
  const a = domainById[l.source];
  const b = domainById[l.target];
  return [
    l.principal ? 0 : 1,
    l.kind === 'filiation' ? 0 : 1,
    l.epistemic === 'fait' ? 0 : 1,
    a && b && a.continents[0] === b.continents[0] ? 0 : 1,
    a ? -a.period.start : Infinity,
  ];
}

function better(x: Link, y: Link, domainById: Readonly<Record<string, Domain>>): boolean {
  const rx = rank(x, domainById);
  const ry = rank(y, domainById);
  for (let i = 0; i < rx.length; i++) if (rx[i] !== ry[i]) return rx[i] < ry[i];
  return x.source < y.source; // départage stable, indépendant de l'ordre des données
}

/**
 * Ascendant principal de chaque domaine : parmi ses filiations et influences
 * entrantes, celle qui résume le mieux sa généalogie. Les domaines sans
 * transmission entrante (les sources) n'en ont pas.
 */
export function principalLinks(links: readonly Link[], domainById: Readonly<Record<string, Domain>>): Map<string, Link> {
  const best = new Map<string, Link>();
  for (const l of links) {
    if (!TRANSMISSION.has(l.kind)) continue;
    const cur = best.get(l.target);
    if (!cur || better(l, cur, domainById)) best.set(l.target, l);
  }
  return best;
}

/** Clés des liens dessinés par défaut : les ascendants principaux et toutes les ruptures. */
export function defaultLinkKeys(links: readonly Link[], domainById: Readonly<Record<string, Domain>>): Set<string> {
  const keys = new Set([...principalLinks(links, domainById).values()].map(linkKey));
  for (const l of links) if (l.kind === 'reaction') keys.add(linkKey(l));
  return keys;
}
