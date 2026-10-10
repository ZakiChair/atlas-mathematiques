import { describe, it, expect } from 'vitest';
import { computeLayout, baseRadius, RELAX_MARGIN } from '../layout';
import { DOMAINS, MAP_SIZE } from '../../data';
import type { Domain } from '../../data/types';
import { seededRandom } from '../../lib/prng';

/** Génère un jeu synthétique de n domaines très denses. */
function syntheticDomains(n: number): Domain[] {
  const rand = seededRandom('synthetic');
  const out: Domain[] = [];
  for (let i = 0; i < n; i++) {
    const theories = Array.from({ length: 2 + Math.floor(rand() * 4) }, (_, j) => ({
      id: `m${i}-s${j}`,
      name: `Theory ${j}`,
      summary: 's',
      traits: ['t'],
    }));
    const mathematicians = Array.from({ length: 6 + Math.floor(rand() * 6) }, (_, j) => ({
      id: `m${i}-f${j}`,
      name: `Math ${j}`,
      years: [1900, 1980] as [number, number | null],
      origin: 'x',
      bio: 'b',
      theoryId: rand() < 0.8 ? theories[Math.floor(rand() * theories.length)].id : undefined,
    }));
    const results = Array.from({ length: 10 + Math.floor(rand() * 6) }, (_, j) => ({
      id: `m${i}-fi${j}`,
      title: `Result ${j}`,
      year: 1960,
      authorName: 'x',
      kind: 'theoreme' as const,
      comment: 'c',
      mathematicianId: rand() < 0.8 ? mathematicians[Math.floor(rand() * mathematicians.length)].id : undefined,
      theoryId: rand() < 0.5 ? theories[Math.floor(rand() * theories.length)].id : undefined,
    }));
    out.push({
      id: `m${i}`,
      name: `Domaine ${i}`,
      era: 'structures',
      period: { start: 1900 + (i % 40), end: 1960 },
      continents: ['nombres'],
      places: ['X'],
      // positions volontairement serrées pour stresser la relaxation
      map: {
        x: 400 + (i % 8) * 400 + rand() * 120,
        y: 400 + Math.floor(i / 8) * 450 + rand() * 120,
        size: (1 + Math.floor(rand() * 3)) as 1 | 2 | 3,
        palette: { fill: '#223344', stroke: '#aabbcc', accent: '#ffcc66' },
      },
      tagline: 't',
      summary: 's',
      methods: [{ kind: 'fait', text: 'x' }],
      context: [{ kind: 'interpretation', text: 'y' }],
      debates: [],
      keyDates: [],
      theories,
      mathematicians,
      results,
      sources: [],
    });
  }
  return out;
}

function checkLayout(moves: Domain[]) {
  const a = computeLayout(moves);
  const b = computeLayout(moves);
  // déterminisme
  expect(a).toEqual(b);
  // centres dans les bornes
  for (const t of a.territories) {
    expect(t.x).toBeGreaterThanOrEqual(0);
    expect(t.x).toBeLessThanOrEqual(MAP_SIZE.width);
    expect(t.y).toBeGreaterThanOrEqual(0);
    expect(t.y).toBeLessThanOrEqual(MAP_SIZE.height);
    expect(t.path.length).toBeGreaterThan(10);
    // enfants ≤ 0.85 r
    for (const c of t.children) {
      expect(Math.hypot(c.x - t.x, c.y - t.y)).toBeLessThanOrEqual(t.r * 0.85 + 1e-6);
    }
  }
  // pas de chevauchement de cercles (r + marge de chaque côté)
  for (let i = 0; i < a.territories.length; i++) {
    for (let j = i + 1; j < a.territories.length; j++) {
      const t1 = a.territories[i];
      const t2 = a.territories[j];
      const d = Math.hypot(t1.x - t2.x, t1.y - t2.y);
      expect(d).toBeGreaterThanOrEqual(t1.r + t2.r + 2 * RELAX_MARGIN - 1);
    }
  }
  return a;
}

describe('computeLayout', () => {
  it('corpus réel : déterministe, borné, sans chevauchement', () => {
    checkLayout(DOMAINS);
  });

  it('40 domaines synthétiques denses : convergence bornée', () => {
    const moves = syntheticDomains(40);
    const layout = checkLayout(moves);
    expect(layout.territories).toHaveLength(40);
  });

  it('baseRadius croît avec le nombre de résultats (plafonné)', () => {
    const m = DOMAINS[0];
    const r0 = baseRadius({ ...m, results: m.results.slice(0, 8) });
    const r1 = baseRadius({ ...m, results: [...m.results, ...m.results] });
    expect(r1).toBeGreaterThanOrEqual(r0);
    expect(r1).toBeLessThanOrEqual(r0 * 1.26);
  });
});
