import { describe, it, expect } from 'vitest';
import { DOMAINS, LINKS } from '../../data';
import { chainOf, generations } from '../upstream';

describe('amont et aval d’un domaine', () => {
  it('rigueur de l’analyse : la querelle des infiniment petits est un affluent direct', () => {
    const c = chainOf(LINKS, 'analyse-rigoureuse');
    expect(c.upstream.get('querelle-des-infiniment-petits')).toBe(1);
    expect(c.upstream.has('analyse-rigoureuse')).toBe(false);
    expect(c.depth).toBeGreaterThanOrEqual(2);
  });

  it('les ruptures et les affinités ne transmettent pas', () => {
    const c = chainOf(LINKS, 'analyse-rigoureuse');
    // analyse-eulerienne → analyse-rigoureuse est une rupture : pas d'affluent direct par ce lien
    const viaRupture = LINKS.find((l) => l.source === 'analyse-eulerienne' && l.target === 'analyse-rigoureuse' && l.kind === 'reaction');
    expect(viaRupture).toBeDefined();
    expect([...c.upstreamLinks].every((l) => l.kind === 'filiation' || l.kind === 'influence')).toBe(true);
  });

  it('une source n’a pas d’amont ; elle a un aval', () => {
    const c = chainOf(LINKS, 'calcul-des-scribes');
    expect(c.upstream.size).toBe(0);
    expect(c.downstream.size).toBeGreaterThan(0);
  });

  it('générations ordonnées selon l’ordre donné', () => {
    const c = chainOf(LINKS, 'topologie');
    const gens = generations(c.upstream, DOMAINS.map((d) => d.id));
    expect(gens.length).toBe(c.depth);
    expect(gens.flat().length).toBe(c.upstream.size);
  });
});
