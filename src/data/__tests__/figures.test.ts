import { describe, it, expect } from 'vitest';
import { DOMAINS, DOMAIN_BY_ID } from '../index';
import { EXTRA_FIGURES } from '../figures';
import { normalizeText } from '../../lib/normalize';
import { computeLayout } from '../../map/layout';

describe('fiches courtes (vague 4)', () => {
  const extras = Object.values(EXTRA_FIGURES).flat();

  it('rangées dans un domaine existant', () => {
    for (const id of Object.keys(EXTRA_FIGURES)) expect(DOMAIN_BY_ID[id], id).toBeDefined();
  });

  it('chacune a sa biographie MacTutor, cite MacTutor et tient en 280 caractères', () => {
    for (const m of extras) {
      expect(m.mactutor, m.id).toBeTruthy();
      expect(m.sources ?? [], m.id).toContain('mactutor');
      expect(m.bio.length, m.id).toBeLessThanOrEqual(280);
    }
  });

  it('pas deux figures du même nom dans tout l’atlas', () => {
    const seen = new Map<string, string>();
    for (const d of DOMAINS) {
      for (const m of d.mathematicians) {
        const key = normalizeText(m.name);
        expect(seen.get(key), `${m.id} porte le même nom que ${seen.get(key)}`).toBeUndefined();
        seen.set(key, m.id);
      }
    }
  });

  it('une fiche courte a son point sur la carte, et son nom au niveau 3', () => {
    const layout = computeLayout(DOMAINS);
    for (const m of extras) expect(layout.childPos.get(m.id)?.nameLevel, m.id).toBe(3);
  });
});
