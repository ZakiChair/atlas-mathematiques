import { describe, it, expect } from 'vitest';
import { parseLifeYears, parseYear, compareYears } from '../mactutor';

const page = (born: string, died?: string) =>
  `<dl>\n    <dt>Born</dt>\n    <dd>\n      ${born} <br />  <a href="../../Map/#X">X</a>\n    </dd>${
    died ? `\n    <dt>Died</dt>\n    <dd>\n      ${died} <br /> Y\n    </dd>` : ''
  }</dl>`;

describe('années MacTutor', () => {
  it('formes de dates rencontrées', () => {
    expect(parseYear('15 April 1707')).toEqual({ year: 1707, approx: false });
    expect(parseYear('about 325 BC')).toEqual({ year: -325, approx: true });
    expect(parseYear('March 415')).toEqual({ year: 415, approx: false });
    expect(parseYear('10 June 0940')).toEqual({ year: 940, approx: false });
    expect(parseYear('18th March 2026')).toEqual({ year: 2026, approx: false });
    expect(parseYear('598')).toEqual({ year: 598, approx: false });
  });

  it('page complète, vivant·e sans « Died »', () => {
    expect(parseLifeYears(page('15 April 1707', '18 September 1783'))).toEqual({
      born: { year: 1707, approx: false },
      died: { year: 1783, approx: false },
    });
    expect(parseLifeYears(page('11 April 1953'))).toEqual({ born: { year: 1953, approx: false }, died: null });
  });

  it('comparaison : exacte pour des dates précises, ±15 ans si l’une est approximative', () => {
    const euler = parseLifeYears(page('15 April 1707', '18 September 1783'));
    expect(compareYears([1707, 1783], false, euler).verdict).toBe('ok');
    expect(compareYears([1708, 1783], false, euler).verdict).toBe('ecart');
    const hypatie = parseLifeYears(page('about 370', 'March 415'));
    expect(compareYears([355, 415], true, hypatie).verdict).toBe('ok');
    expect(compareYears([1953, null], false, parseLifeYears(page('11 April 1953'))).verdict).toBe('ok');
    expect(compareYears([1953, 2020], false, parseLifeYears(page('11 April 1953'))).verdict).toBe('ecart');
  });
});
