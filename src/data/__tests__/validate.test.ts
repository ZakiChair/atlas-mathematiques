import { describe, it, expect } from 'vitest';
import { validateAtlas } from '../validate';
import { DOMAINS, LINKS, SOURCES, ERAS, CONTINENTS, MATHEMATICIAN_LINKS } from '../index';
import type { Domain, Mathematician, Result, Statement } from '../types';

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

// ——— grandes figures, intuitions, démonstrations, ascendants principaux ———

/** Corpus où la figure `id` est modifiée par `patch` (dans son domaine d'attache). */
function withMathematician(id: string, patch: Partial<Mathematician>): Domain[] {
  return DOMAINS.map((d) =>
    d.mathematicians.some((m) => m.id === id)
      ? { ...d, mathematicians: d.mathematicians.map((m) => (m.id === id ? { ...m, ...patch } : m)) }
      : d,
  );
}

/** Corpus où le résultat `id` est modifié par `patch`. */
function withResultId(id: string, patch: Partial<Result>): Domain[] {
  return DOMAINS.map((d) =>
    d.results.some((r) => r.id === id) ? { ...d, results: d.results.map((r) => (r.id === id ? { ...r, ...patch } : r)) } : d,
  );
}

const S: Statement = { kind: 'fait', text: 'Un énoncé sourcé.', sources: ['katz-history'] };
const SIG: Statement = { kind: 'fait', text: 'Fait des fonctions l’objet de l’analyse.', sources: ['bottazzini-higher-calculus'] };

describe('validateAtlas : grandes figures', () => {
  const featured = (patch: Partial<NonNullable<Mathematician['featured']>> = {}) =>
    withMathematician('euler', { featured: { signature: SIG, contributions: [], headlineResultIds: ['probleme-de-bale'], ...patch } });

  it('grande figure valide (sans apports : vague 2 pas encore passée) acceptée', () => {
    expect(validateAtlas({ ...base, domains: featured() })).toEqual([]);
  });

  it('signature de plus de 90 caractères refusée', () => {
    const errors = validateAtlas({ ...base, domains: featured({ signature: { ...SIG, text: 'x'.repeat(91) } }) });
    expect(errors.some((e) => e.includes('signature trop longue (91 > 90'))).toBe(true);
  });

  it('un seul apport refusé, deux acceptés', () => {
    expect(validateAtlas({ ...base, domains: featured({ contributions: [S] }) }).some((e) => e.includes('2 à 4 apports attendus (1)'))).toBe(true);
    expect(validateAtlas({ ...base, domains: featured({ contributions: [S, S] }) })).toEqual([]);
  });

  it('résultat phare inconnu ou attribué à une autre figure refusé', () => {
    const errors = validateAtlas({ ...base, domains: featured({ headlineResultIds: ['inexistant', 'theoreme-des-quatre-carres'] }) });
    expect(errors.some((e) => e.includes('résultat phare inconnu « inexistant »'))).toBe(true);
    expect(errors.some((e) => e.includes('« theoreme-des-quatre-carres » n’est pas attribué à euler'))).toBe(true);
  });

  it('résultat phare situé dans un autre domaine que la figure accepté', () => {
    // sept-ponts-de-konigsberg est dans geometrie-des-lumieres, Euler dans analyse-eulerienne
    expect(validateAtlas({ ...base, domains: featured({ headlineResultIds: ['probleme-de-bale', 'sept-ponts-de-konigsberg'] }) })).toEqual([]);
  });

  it('slug MacTutor non conforme refusé', () => {
    const errors = validateAtlas({ ...base, domains: withMathematician('euler', { mactutor: 'Euler Leonhard' }) });
    expect(errors.some((e) => e.includes('slug MacTutor non conforme'))).toBe(true);
  });
});

describe('validateAtlas : intuitions et démonstrations', () => {
  it('intuition et démonstration sourcées acceptées sur un théorème', () => {
    expect(validateAtlas({ ...base, domains: withResultId('probleme-de-bale', { intuition: [S], proof: [S, S, S] }) })).toEqual([]);
  });

  it('démonstration de deux étapes refusée', () => {
    const errors = validateAtlas({ ...base, domains: withResultId('probleme-de-bale', { proof: [S, S] }) });
    expect(errors.some((e) => e.includes('démonstration : 3 à 6 étapes (2)'))).toBe(true);
  });

  it('démonstration ou intuition sur un texte refusées', () => {
    const errors = validateAtlas({ ...base, domains: withResultId('elements-euclide', { intuition: [S], proof: [S, S, S] }) });
    expect(errors.some((e) => e.includes('intuition sans objet pour un texte'))).toBe(true);
    expect(errors.some((e) => e.includes('démonstration réservée aux théorèmes'))).toBe(true);
  });

  it('étape de démonstration sans source refusée', () => {
    const errors = validateAtlas({
      ...base,
      domains: withResultId('probleme-de-bale', { proof: [S, S, { kind: 'fait', text: 'Étape non sourcée.' }] }),
    });
    expect(errors.some((e) => e.includes('démonstration #2 : aucune source'))).toBe(true);
  });
});

describe('validateAtlas : ascendants principaux', () => {
  it('au plus un ascendant principal par domaine, et seulement sur une transmission', () => {
    const toCalcul = LINKS.filter((l) => l.target === 'naissance-du-calcul' && (l.kind === 'filiation' || l.kind === 'influence'));
    const affinity = LINKS.find((l) => l.kind === 'affinite')!;
    const marked = new Set([toCalcul[0], toCalcul[1], affinity]);
    const links = LINKS.map((l) => (marked.has(l) ? { ...l, principal: true as const } : l));
    const errors = validateAtlas({ ...base, links, domains: DOMAINS });
    expect(errors.some((e) => e.includes('plusieurs ascendants principaux pour naissance-du-calcul'))).toBe(true);
    expect(errors.some((e) => e.includes('un ascendant principal est une filiation ou une influence (affinite)'))).toBe(true);
  });
});
