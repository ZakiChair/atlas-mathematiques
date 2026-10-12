import { describe, it, expect } from 'vitest';
import { DOMAINS } from '../../data';
import { domainNameMetrics, DOMAIN_NAME_PX } from '../labelMetrics';

describe('nom des domaines', () => {
  it('taille bornée, à toutes les échelles', () => {
    for (const d of DOMAINS) {
      for (const k of [0.05, 0.165, 0.6, 2]) {
        const m = domainNameMetrics(d, 200, k);
        expect(m.fontPx).toBeGreaterThanOrEqual(DOMAIN_NAME_PX.min);
        expect(m.fontPx).toBeLessThanOrEqual(DOMAIN_NAME_PX.max);
        expect(m.lines.length).toBeLessThanOrEqual(3);
      }
    }
  });
  it('plus le disque est grand à l’écran, plus le nom est grand (jusqu’au plafond)', () => {
    const d = DOMAINS[0];
    expect(domainNameMetrics(d, 200, 0.4).fontPx).toBeGreaterThanOrEqual(domainNameMetrics(d, 200, 0.2).fontPx);
  });
});
