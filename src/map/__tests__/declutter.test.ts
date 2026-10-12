import { describe, it, expect } from 'vitest';
import { declutter, textWidth, type LabelItem, type Rect } from '../declutter';
import { computeLayout } from '../layout';
import type { Domain, Mathematician, Result } from '../../data/types';
import { DOMAINS } from '../../data';

const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('désencombrement des noms', () => {
  it('aucun chevauchement, priorités respectées, déterministe', () => {
    const items: LabelItem[] = Array.from({ length: 60 }, (_, i) => ({
      id: `n${i}`,
      x: 100 + (i % 10) * 30,
      y: 100 + Math.floor(i / 10) * 14,
      w: 80,
      h: 14,
      priority: i % 3,
      r: 3,
    }));
    const a = declutter(items);
    expect(declutter([...items].reverse())).toEqual(a);
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) expect(hit(a[i], a[j])).toBe(false);
    // le premier de plus haute priorité est toujours posé
    expect(a.some((p) => p.id === 'n0')).toBe(true);
  });

  it('un obstacle fixe n’est jamais recouvert', () => {
    const items: LabelItem[] = [{ id: 'a', x: 100, y: 100, w: 60, h: 14, priority: 0, r: 3 }];
    const wall: Rect = { x: 104, y: 80, w: 200, h: 60 };
    const placed = declutter(items, [wall]);
    for (const p of placed) expect(hit(p, wall)).toBe(false);
  });
});

/** Domaine synthétique dense : grandes figures, figures à résultats, fiches courtes. */
function denseDomain(featured: number, withResults: number, short: number): Domain {
  const id = 'dense';
  const theories = Array.from({ length: 4 }, (_, j) => ({ id: `${id}-t${j}`, name: `Théorie ${j}`, summary: 's', traits: ['t'] }));
  const fig = (j: number, kind: 'f' | 'r' | 's'): Mathematician => ({
    id: `${id}-${kind}${j}`,
    name: kind === 's' ? `Fiche courte ${j}` : `Figure à résultat ${j}`,
    years: [1800 + j, 1870 + j],
    origin: 'x',
    bio: 'b',
    theoryId: theories[j % 4].id,
    ...(kind === 'f'
      ? { featured: { signature: { kind: 'fait' as const, text: 's', sources: ['katz-history'] }, contributions: [], headlineResultIds: [`${id}-res-f${j}`] } }
      : {}),
  });
  const mathematicians = [
    ...Array.from({ length: featured }, (_, j) => fig(j, 'f')),
    ...Array.from({ length: withResults }, (_, j) => fig(j, 'r')),
    ...Array.from({ length: short }, (_, j) => fig(j, 's')),
  ];
  const results: Result[] = mathematicians
    .filter((m) => !m.id.includes('-s'))
    .map((m) => ({ id: `res-${m.id}`, title: 'R', year: 1850, authorName: m.name, mathematicianId: m.id, kind: 'theoreme', comment: 'c' }));
  return {
    ...DOMAINS[0],
    id,
    era: 'dixneuvieme',
    period: { start: 1800, end: 1900 },
    map: { x: 3000, y: 2200, size: 2, palette: { fill: '#eeeeee', stroke: '#333333', accent: '#666666' } },
    theories,
    mathematicians,
    results,
  };
}

/** Part des noms affichés à un zoom donné (domaine centré, viewport 1440 × 744). */
function shownAt(d: Domain, k: number) {
  const layout = computeLayout([d]);
  const t = layout.territories[0];
  const toScreen = (x: number, y: number) => ({ x: 720 + (x - t.x) * k, y: 372 + (y - t.y) * k });
  const byId = new Map(d.mathematicians.map((m) => [m.id, m]));
  const items: LabelItem[] = t.children
    .filter((c) => c.kind === 'mathematician')
    .map((c) => {
      const m = byId.get(c.id)!;
      const p = toScreen(c.x, c.y);
      const font = c.featured ? 13 : 12;
      return { id: c.id, ...p, w: textWidth(m.name, font), h: font + 4, priority: c.featured ? 0 : c.nameLevel === 2 ? 1 : 2, r: c.featured ? 10 : 3.5 };
    });
  const placed = new Set(declutter(items).map((p) => p.id));
  const share = (pred: (m: Mathematician) => boolean) => {
    const ids = d.mathematicians.filter(pred).map((m) => m.id);
    return ids.filter((id) => placed.has(id)).length / Math.max(1, ids.length);
  };
  return {
    featured: share((m) => !!m.featured),
    withResults: share((m) => !m.featured && !m.id.includes('-s')),
    short: share((m) => m.id.includes('-s')),
  };
}

describe('densité : 42 figures dans un domaine', () => {
  const d = denseDomain(2, 12, 28);
  it.each([1.0, 1.4, 1.8, 2.6, 3.5])('k = %f', (k) => {
    const s = shownAt(d, k);
    console.log(`k=${k} : grandes ${(s.featured * 100).toFixed(0)} %, à résultats ${(s.withResults * 100).toFixed(0)} %, courtes ${(s.short * 100).toFixed(0)} %`);
    expect(s.featured).toBe(1);
  });
  it('tous les points restent dans le disque', () => {
    const t = computeLayout([d]).territories[0];
    for (const c of t.children) expect(Math.hypot(c.x - t.x, c.y - t.y)).toBeLessThanOrEqual(t.r * 0.85 + 1e-6);
  });
});
