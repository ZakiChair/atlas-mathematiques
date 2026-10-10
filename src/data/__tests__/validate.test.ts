import { describe, it, expect } from 'vitest';
import { validateAtlas } from '../validate';
import { DOMAINS, LINKS, SOURCES, ERAS, CONTINENTS, MATHEMATICIAN_LINKS } from '../index';
import type { Domain, Result } from '../types';

const base = {
  links: LINKS,
  sources: SOURCES,
  eras: ERAS,
  continents: CONTINENTS,
  mathematicianLinks: MATHEMATICIAN_LINKS,
};

/** Corpus où le premier résultat du premier domaine est remplacé par `patch`. */
function withResult(patch: Partial<Result>): Domain[] {
  const [first, ...rest] = DOMAINS;
  const [r0, ...others] = first.results;
  return [{ ...first, results: [{ ...r0, ...patch }, ...others] }, ...rest];
}

describe('validateAtlas', () => {
  it('le corpus actuel est valide', () => {
    expect(validateAtlas({ ...base, domains: DOMAINS })).toEqual([]);
  });

  it('récit : contexte sans portée refusé', () => {
    const errors = validateAtlas({
      ...base,
      domains: withResult({ context: [{ kind: 'fait', text: 'Un problème posé.', sources: ['katz-history'] }], impact: undefined }),
    });
    expect(errors.some((e) => e.includes('récit incomplet'))).toBe(true);
  });

  it('récit : énoncé sans source ou à source inconnue refusé', () => {
    const errors = validateAtlas({
      ...base,
      domains: withResult({
        context: [{ kind: 'fait', text: 'Un problème posé.' }],
        impact: [{ kind: 'interpretation', text: 'Une portée.', sources: ['source-inventee'] }],
      }),
    });
    expect(errors.some((e) => e.includes('aucune source'))).toBe(true);
    expect(errors.some((e) => e.includes('source inconnue « source-inventee »'))).toBe(true);
  });

  it('récit complet et sourcé accepté', () => {
    const errors = validateAtlas({
      ...base,
      domains: withResult({
        context: [{ kind: 'fait', text: 'Un problème posé.', sources: ['katz-history'] }],
        impact: [{ kind: 'interpretation', text: 'Une portée.', sources: ['katz-history'] }],
      }),
    });
    expect(errors).toEqual([]);
  });
});
