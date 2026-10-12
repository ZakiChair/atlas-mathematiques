import { describe, it, expect } from 'vitest';
import { DOMAINS, DOMAIN_BY_ID, LINKS } from '../../data';
import type { Link } from '../../data/types';
import { principalLinks, defaultLinkKeys } from '../lineage';

const ROOTS = ['calcul-des-scribes', 'logique-antique', 'mathematiques-chinoises-anciennes', 'querelle-des-infiniment-petits'];

describe('lignées principales', () => {
  const main = principalLinks(LINKS, DOMAIN_BY_ID);

  it('un ascendant principal par domaine ayant une transmission entrante ; aucun pour les sources', () => {
    for (const d of DOMAINS) {
      const hasIncoming = LINKS.some((l) => l.target === d.id && (l.kind === 'filiation' || l.kind === 'influence'));
      expect(main.has(d.id), d.id).toBe(hasIncoming);
    }
    for (const r of ROOTS) expect(main.has(r), r).toBe(false);
    expect(main.size).toBe(DOMAINS.length - ROOTS.length);
  });

  it('quelques généalogies attendues', () => {
    expect(main.get('analyse-eulerienne')?.source).toBe('naissance-du-calcul');
    expect(main.get('mecanique-analytique')?.source).toBe('analyse-eulerienne');
    expect(main.get('arithmetique-gaussienne')?.source).toBe('theorie-des-nombres-lumieres');
    expect(main.get('topologie')?.source).toBe('geometries-non-euclidiennes');
  });

  it('indépendant de l’ordre des liens', () => {
    const reversed = principalLinks([...LINKS].reverse(), DOMAIN_BY_ID);
    for (const [target, l] of main) expect(reversed.get(target)?.source, target).toBe(l.source);
  });

  it('règle : marqué à la main > filiation > fait > même champ > source la plus récente', () => {
    const mk = (source: string, kind: Link['kind'], epistemic: Link['epistemic'], principal?: true): Link => ({
      source,
      target: 'analyse-rigoureuse',
      kind,
      epistemic,
      label: 'l',
      note: 'n',
      ...(principal ? { principal } : {}),
    });
    const pick = (links: Link[]) => principalLinks(links, DOMAIN_BY_ID).get('analyse-rigoureuse')?.source;
    // filiation avant influence
    expect(pick([mk('analyse-eulerienne', 'influence', 'fait'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
    // fait avant interprétation
    expect(pick([mk('analyse-eulerienne', 'filiation', 'interpretation'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
    // même champ (analyse) avant champ différent (fondements)
    expect(pick([mk('querelle-des-infiniment-petits', 'filiation', 'fait'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
    // à égalité, la source la plus récente
    expect(pick([mk('naissance-du-calcul', 'filiation', 'fait'), mk('analyse-eulerienne', 'filiation', 'fait')])).toBe('analyse-eulerienne');
    // le marquage manuel l'emporte sur tout
    expect(pick([mk('analyse-eulerienne', 'filiation', 'fait'), mk('querelle-des-infiniment-petits', 'influence', 'interpretation', true)])).toBe(
      'querelle-des-infiniment-petits',
    );
    // une rupture ou une affinité n'est jamais ascendant principal
    expect(pick([mk('analyse-eulerienne', 'reaction', 'fait'), mk('naissance-du-calcul', 'affinite', 'interpretation')])).toBeUndefined();
  });

  it('liens par défaut : ascendants principaux + ruptures', () => {
    const keys = defaultLinkKeys(LINKS, DOMAIN_BY_ID);
    expect(keys.size).toBe(main.size + LINKS.filter((l) => l.kind === 'reaction').length);
  });
});
