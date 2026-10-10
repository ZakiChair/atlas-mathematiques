import { describe, it, expect } from 'vitest';
import { search } from '../search';

describe('search', () => {
  it('« gauss » → Carl Friedrich Gauss premier des mathématiciens', () => {
    const r = search('gauss');
    expect(r.length).toBeGreaterThan(0);
    const mathematiciens = r.filter((x) => x.node.kind === 'mathematician');
    expect(mathematiciens.length).toBeGreaterThan(0);
    expect(mathematiciens[0].node.label).toBe('Carl Friedrich Gauss');
  });

  it('« elements » (sans accent) → les Éléments d’Euclide', () => {
    const r = search('elements');
    expect(r.some((x) => x.node.id === 'elements-euclide' && x.node.kind === 'result')).toBe(true);
  });

  it('« theorie des ensembles » → le domaine', () => {
    const r = search('theorie des ensembles');
    expect(r[0].node.kind).toBe('domain');
    expect(r[0].node.id).toBe('theorie-des-ensembles');
  });

  it('« Fermat » → le mathématicien avant les résultats', () => {
    // les groupes sont ordonnés domaine → théorie → mathématicien → résultat
    const r = search('Fermat');
    const premierMath = r.findIndex((x) => x.node.kind === 'mathematician');
    const premierResultat = r.findIndex((x) => x.node.kind === 'result');
    expect(premierMath).toBeGreaterThanOrEqual(0);
    expect(premierResultat).toBeGreaterThanOrEqual(0);
    expect(premierMath).toBeLessThan(premierResultat);
    expect(r[premierMath].node.label).toContain('Fermat');
  });

  it('limite à 6 résultats par groupe', () => {
    const r = search('le');
    const byKind = new Map<string, number>();
    for (const x of r) byKind.set(x.node.kind, (byKind.get(x.node.kind) ?? 0) + 1);
    for (const n of byKind.values()) expect(n).toBeLessThanOrEqual(6);
  });

  it('chaîne vide → aucun résultat', () => {
    expect(search('')).toEqual([]);
    expect(search('   ')).toEqual([]);
  });
});
