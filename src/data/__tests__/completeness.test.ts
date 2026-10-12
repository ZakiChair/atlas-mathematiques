import { describe, it, expect } from 'vitest';
import { DOMAINS } from '../index';
import { COMPLETENESS, coverage } from '../completeness';

const c = coverage(DOMAINS);
const ratio = (done: number, total: number) => (total === 0 ? 1 : done / total);

describe('complétude du corpus (seuils relevés à chaque vague)', () => {
  it(`au moins ${COMPLETENESS.featuredMin} grandes figures`, () => {
    expect(c.featured).toBeGreaterThanOrEqual(COMPLETENESS.featuredMin);
  });

  it('apports des grandes figures', () => {
    if (COMPLETENESS.contributionsRequired) expect(c.featuredWithContributions).toBe(c.featured);
  });

  it(`intuitions et démonstrations : au moins ${COMPLETENESS.proofsCoverage * 100} %`, () => {
    expect(ratio(c.proofDone, c.proofTargets)).toBeGreaterThanOrEqual(COMPLETENESS.proofsCoverage);
  });

  it(`au moins ${COMPLETENESS.mathematiciansMin} figures`, () => {
    expect(c.mathematicians).toBeGreaterThanOrEqual(COMPLETENESS.mathematiciansMin);
  });

  it(`slugs MacTutor : au moins ${COMPLETENESS.mactutorCoverage * 100} %`, () => {
    expect(ratio(c.withMactutor, c.mathematicians)).toBeGreaterThanOrEqual(COMPLETENESS.mactutorCoverage);
  });
});
