import { describe, it, expect } from 'vitest';
import { validateAtlas } from '../validate';
import { DOMAINS, LINKS, SOURCES, ERAS, CONTINENTS, MATHEMATICIAN_LINKS } from '../index';

describe('validateAtlas', () => {
  it('le corpus actuel est valide', () => {
    const errors = validateAtlas({
      domains: DOMAINS,
      links: LINKS,
      sources: SOURCES,
      eras: ERAS,
      continents: CONTINENTS,
      mathematicianLinks: MATHEMATICIAN_LINKS,
    });
    expect(errors).toEqual([]);
  });
});
