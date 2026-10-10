import { describe, it, expect } from 'vitest';
import { CONTINENTS, DOMAINS, ERA_BANDS, ERAS, LINKS, MAP_SIZE } from '../../data';
import type { Link } from '../../data/types';
import { computeLayout } from '../layout';
import { computeRivers, monotoneY, RIVER_WIDTH } from '../rivers';
import { xToYear, yearToX } from '../timeScale';
import { chainOf, generations, TRANSMISSION } from '../upstream';
import { activity, smooth } from '../activity';

const ORDER = CONTINENTS.map((c) => c.id);

describe('échelle du temps', () => {
  it('chaque ère commence au bord gauche de sa bande', () => {
    for (const band of ERA_BANDS) {
      const era = ERAS.find((e) => e.id === band.era)!;
      expect(yearToX(era.period.start)).toBeCloseTo(band.x0, 6);
    }
  });

  it('croissante, bornée, et inverse de xToYear', () => {
    let prev = -Infinity;
    for (let y = -2000; y <= 2100; y += 7) {
      const x = yearToX(y);
      expect(x).toBeGreaterThanOrEqual(prev);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(MAP_SIZE.width);
      prev = x;
    }
    for (let y = -1790; y <= 2020; y += 13) expect(xToYear(yearToX(y))).toBeCloseTo(y, 6);
  });
});

describe('fleuves', () => {
  const layout = computeLayout(DOMAINS);
  const rivers = computeRivers(DOMAINS, layout.byId, ORDER);

  it('interpolation monotone : passe par les points sans dépassement', () => {
    const xs = [0, 100, 250, 400];
    const ys = [10, 80, 60, 60];
    const f = monotoneY(xs, ys);
    xs.forEach((x, i) => expect(f(x)).toBeCloseTo(ys[i], 9));
    for (let x = 0; x <= 400; x += 5) {
      const i = x <= 100 ? 0 : x <= 250 ? 1 : 2;
      expect(f(x)).toBeGreaterThanOrEqual(Math.min(ys[i], ys[i + 1]) - 1e-9);
      expect(f(x)).toBeLessThanOrEqual(Math.max(ys[i], ys[i + 1]) + 1e-9);
    }
  });

  it('un fleuve par champ, de son premier domaine à la mer', () => {
    expect(rivers.map((r) => r.continent)).toEqual(ORDER);
    for (const r of rivers) {
      const members = DOMAINS.filter((d) => d.continents[0] === r.continent);
      expect(new Set(r.domainIds)).toEqual(new Set(members.map((d) => d.id)));
      expect(r.total).toBe(members.reduce((s, d) => s + d.results.length, 0));
      const first = Math.min(...members.map((d) => layout.byId.get(d.id)!.x));
      expect(r.samples[0].x).toBeCloseTo(first, 6);
      expect(r.samples[r.samples.length - 1].x).toBeGreaterThan(MAP_SIZE.width - 14);
      expect(r.bed.length).toBeGreaterThan(100);
    }
  });

  it('la largeur ne décroît jamais et reste dans ses bornes', () => {
    for (const r of rivers) {
      for (let i = 1; i < r.samples.length; i++) {
        expect(r.samples[i].x).toBeGreaterThan(r.samples[i - 1].x);
        expect(r.samples[i].w).toBeGreaterThanOrEqual(r.samples[i - 1].w - 1e-9);
      }
      expect(r.samples[0].w).toBeGreaterThanOrEqual(RIVER_WIDTH.min);
      expect(r.samples[r.samples.length - 1].w).toBeLessThanOrEqual(RIVER_WIDTH.max * 1.45 + 1e-9);
    }
  });

  it('le cours traverse chaque lac de son champ', () => {
    for (const r of rivers) {
      for (const id of r.domainIds) {
        const t = layout.byId.get(id)!;
        const s = r.samples.reduce((a, b) => (Math.abs(b.x - t.x) < Math.abs(a.x - t.x) ? b : a));
        expect(Math.hypot(s.x - t.x, s.y - t.y)).toBeLessThan(t.r * 0.5);
      }
    }
  });

  it('déterministe', () => {
    expect(computeRivers(DOMAINS, layout.byId, ORDER)).toEqual(rivers);
  });
});

describe('chaîne amont', () => {
  const link = (source: string, target: string, kind: Link['kind'] = 'filiation'): Link => ({
    source,
    target,
    kind,
    epistemic: 'fait',
    label: '',
    note: '',
  });

  it('remonte les liens de transmission par générations, sans affinités ni réactions', () => {
    const links = [link('a', 'b'), link('b', 'c', 'influence'), link('x', 'c', 'affinite'), link('y', 'b', 'reaction'), link('a', 'c'), link('c', 'd')];
    const ch = chainOf(links, 'c');
    expect([...ch.upstream]).toEqual([
      ['b', 1],
      ['a', 1],
    ]);
    expect(ch.depth).toBe(1);
    expect(ch.upstreamLinks.size).toBe(3);
    expect([...ch.downstream]).toEqual(['d']);
    expect(generations(ch, ['a', 'b', 'c', 'd'])).toEqual([['a', 'b']]);
  });

  it('termine sur un cycle et n’inclut pas le domaine choisi', () => {
    const links = [link('a', 'b'), link('b', 'a'), link('c', 'a')];
    const ch = chainOf(links, 'a');
    expect(ch.upstream.has('a')).toBe(false);
    expect(ch.upstream.get('b')).toBe(1);
    expect(ch.upstream.get('c')).toBe(1);
    expect(ch.downstream).toEqual(new Set(['b']));
  });

  it('corpus réel : chaque amont est relié par une chaîne de transmission', () => {
    for (const d of DOMAINS) {
      const ch = chainOf(LINKS, d.id);
      for (const l of ch.upstreamLinks) expect(TRANSMISSION.has(l.kind)).toBe(true);
      for (const [id, g] of ch.upstream) {
        expect(g).toBeGreaterThanOrEqual(1);
        expect(g).toBeLessThanOrEqual(ch.depth);
        if (g > 1) {
          // un lien vers un domaine de la génération précédente (ou vers le domaine choisi)
          expect(LINKS.some((l) => l.source === id && TRANSMISSION.has(l.kind) && ch.upstream.get(l.target) === g - 1)).toBe(true);
        } else {
          expect(LINKS.some((l) => l.source === id && l.target === d.id && TRANSMISSION.has(l.kind))).toBe(true);
        }
      }
    }
  });
});

describe('activité des champs', () => {
  it('chaque résultat est compté une fois, dans le champ de son domaine', () => {
    const a = activity(DOMAINS, ORDER, 74);
    const total = ORDER.reduce((s, c) => s + a.series[c].reduce((x, y) => x + y, 0), 0);
    expect(total).toBe(DOMAINS.reduce((s, d) => s + d.results.length, 0));
    for (const c of ORDER) expect(a.series[c]).toHaveLength(74);
  });

  it('lissage : conserve la masse loin des bords', () => {
    const v = [0, 0, 0, 6, 0, 0, 0];
    const s = smooth(v, 2);
    expect(s.reduce((x, y) => x + y, 0)).toBeCloseTo(6, 9);
    expect(s[3]).toBeGreaterThan(s[2]);
    expect(s[2]).toBeCloseTo(s[4], 9);
  });
});
