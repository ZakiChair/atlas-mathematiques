import { memo, useMemo } from 'react';
import type { Result } from '../data/types';
import type { AtlasLayout, ChildPos } from './layout';
import { levelFor, useViewTransform } from './viewStore';
import { declutter, textWidth, type LabelItem, type Rect } from './declutter';
import { domainNameCenter, domainNameMetrics } from './labelMetrics';
import { shortTheoryName, wrapWords } from './labels';
import { useData } from '../i18n/localize';
import { useLang } from '../i18n/lang';
import { formatLifespan, formatYear } from '../lib/years';
import type { Selection } from '../state/store';

interface Props {
  layout: AtlasLayout;
  selection: Selection | null;
  dimmedIds: Set<string>;
  /** domaines restés vifs pendant une sélection (choisi, liés, amont, aval) ; null : pas de sélection */
  vividDomainIds: Set<string> | null;
  onSelect: (sel: Selection) => void;
}

interface Entry {
  c: ChildPos;
  domainId: string;
  kind: 'featured' | 'figure' | 'result';
  /** résultat majeur ou phare d'une grande figure : visible dès le niveau 2 */
  major?: boolean;
  label: string;
  /** grandes figures : résultat phare et année (niveaux ≥ 1) */
  sub?: string;
  initial?: string;
  color?: string;
  title: string;
}

/** marge hors écran (px) */
const PAD = 160;
/** tailles des noms à l'écran (px) */
const PX = { featured: 13, sub: 10, figure: 12, result: 11, theory: 15 };

/**
 * Médailles des grandes figures et noms de tous les points de la carte
 * (grandes figures, figures ordinaires, résultats), désencombrés à chaque
 * zoom : priorité à l'élément choisi, puis aux grandes figures, aux figures
 * à résultats, aux résultats, enfin aux fiches courtes. Les noms des domaines
 * (niveaux 0-1) et des théories (niveau 1) sont des obstacles.
 */
export const LabelLayer = memo(function LabelLayer({ layout, selection, dimmedIds, vividDomainIds, onSelect }: Props) {
  const { lang } = useLang();
  const data = useData();
  const v = useViewTransform();
  const lvl = levelFor(v.k);

  const entries = useMemo<Entry[]>(() => {
    const resultById = new Map<string, Result>();
    for (const d of data.domains) for (const r of d.results) resultById.set(r.id, r);
    const out: Entry[] = [];
    for (const t of layout.territories) {
      const d = data.domainById[t.id];
      if (!d) continue;
      for (const c of t.children) {
        if (c.kind === 'mathematician') {
          const m = data.mathematicianById[c.id];
          if (!m) continue;
          const life = formatLifespan(m.years, lang, m.yearsApprox);
          if (c.featured && m.featured) {
            const h = resultById.get(m.featured.headlineResultIds[0]);
            out.push({
              c,
              domainId: t.id,
              kind: 'featured',
              label: m.name,
              sub: h ? `${h.title} · ${formatYear(h.year, lang, h.yearApprox)}` : undefined,
              initial: m.id[0].toUpperCase(),
              color: d.map.palette.accent,
              title: `${m.name} (${life}) — ${m.featured.signature.text}`,
            });
          } else out.push({ c, domainId: t.id, kind: 'figure', label: m.name, title: `${m.name} (${life})` });
        } else if (c.kind === 'result') {
          const r = resultById.get(c.id);
          if (!r) continue;
          const headline = d.mathematicians.some((m) => m.featured?.headlineResultIds.includes(r.id));
          out.push({ c, domainId: t.id, kind: 'result', major: r.major || headline, label: `${r.title} (${formatYear(r.year, lang, r.yearApprox)})`, title: r.title });
        }
      }
    }
    return out;
  }, [layout, data, lang]);

  const inView = (x: number, y: number) => {
    const sx = v.x + x * v.k;
    const sy = v.y + y * v.k;
    return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
  };
  const selId = selection && (selection.kind === 'mathematician' || selection.kind === 'result') ? selection.id : null;
  /** rayon des médailles (px) : en vue d'ensemble, il suit le zoom (≈ 7 px sur un grand écran, 3,5 px au plus petit) */
  const medR = lvl === 0 ? Math.max(3.5, Math.min(7, 40 * v.k)) : 10;

  const shown = entries.filter((e) => {
    if (dimmedIds.has(e.domainId) || !inView(e.c.x, e.c.y)) return false;
    if (e.kind === 'featured') return true;
    if (e.kind === 'figure') return lvl >= (e.c.nameLevel ?? 2);
    return lvl >= (e.major ? 2 : 3);
  });

  // obstacles : noms des domaines (niveaux 0-1), noms des théories (niveau 1)
  const obstacles: Rect[] = [];
  if (lvl <= 1) {
    for (const t of layout.territories) {
      const d = data.domainById[t.id];
      if (!d || dimmedIds.has(t.id) || !inView(t.x, t.y)) continue;
      const m = domainNameMetrics(d, t.r, v.k);
      const c = domainNameCenter(t, lvl);
      obstacles.push({ x: v.x + c.x * v.k - m.w / 2, y: v.y + c.y * v.k - m.h / 2, w: m.w, h: m.h });
      if (lvl === 1) {
        for (const ch of t.children) {
          if (ch.kind !== 'theory' || !inView(ch.x, ch.y)) continue;
          const s = d.theories.find((x) => x.id === ch.id);
          if (!s) continue;
          const lines = wrapWords(shortTheoryName(s.name), 18, 2);
          const w = Math.max(...lines.map((l) => textWidth(l, PX.theory)));
          const h = lines.length * PX.theory * 1.15;
          obstacles.push({ x: v.x + ch.x * v.k - w / 2, y: v.y + ch.y * v.k - h / 2, w, h });
        }
      }
    }
  }

  const items: LabelItem[] = shown.map((e) => {
    const x = v.x + e.c.x * v.k;
    const y = v.y + e.c.y * v.k;
    const first = e.c.id === selId ? -1 : null;
    if (e.kind === 'featured') {
      const withSub = lvl >= 1 && !!e.sub;
      const w = Math.max(textWidth(e.label, PX.featured), withSub ? textWidth(e.sub!, PX.sub) : 0);
      return { id: e.c.id, x, y, w, h: withSub ? 31 : 17, priority: first ?? 0, r: medR + 2 };
    }
    if (e.kind === 'figure') return { id: e.c.id, x, y, w: textWidth(e.label, PX.figure), h: 16, priority: first ?? (e.c.nameLevel === 3 ? 3 : 1), r: 4 };
    return { id: e.c.id, x, y, w: textWidth(e.label, PX.result), h: 15, priority: first ?? (e.major ? 1 : 2), r: e.major ? 9 : 6 };
  });
  const placed = declutter(items, obstacles);
  const byId = new Map(shown.map((e) => [e.c.id, e]));
  const muted = (e: Entry) => vividDomainIds !== null && !vividDomainIds.has(e.domainId);
  const select = (e: Entry) => onSelect({ kind: e.kind === 'result' ? 'result' : 'mathematician', id: e.c.id });

  return (
    <g className="label-layer">
      {shown
        .filter((e) => e.kind === 'featured')
        .map((e) => (
          <g
            key={e.c.id}
            className={`medallion${e.c.id === selId ? ' selected' : ''}${muted(e) ? ' muted' : ''}`}
            data-testid="medallion"
            data-id={e.c.id}
            role="button"
            tabIndex={0}
            aria-label={e.title}
            onClick={(ev) => {
              ev.stopPropagation();
              select(e);
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                ev.stopPropagation();
                select(e);
              }
            }}
          >
            <circle className="medal-ring" cx={e.c.x} cy={e.c.y} r={(medR + 2.5) / v.k} stroke={e.color} strokeWidth={0.9 / v.k} />
            <circle className="medal" cx={e.c.x} cy={e.c.y} r={medR / v.k} fill={e.color} />
            {medR >= 7 && (
              <text className="medal-initial" x={e.c.x} y={e.c.y} dy="0.36em" textAnchor="middle" style={{ fontSize: (medR * 1.2) / v.k }}>
                {e.initial}
              </text>
            )}
            <title>{e.title}</title>
          </g>
        ))}
      {placed.map((p) => {
        const e = byId.get(p.id);
        if (!e) return null;
        const size = e.kind === 'featured' ? PX.featured : e.kind === 'figure' ? PX.figure : PX.result;
        const mx = (p.x - v.x) / v.k;
        const my = (p.y - v.y) / v.k;
        return (
          <text
            key={p.id}
            className={`point-label ${e.kind}${e.major ? ' major' : ''}${p.id === selId ? ' selected' : ''}${muted(e) ? ' muted' : ''}`}
            data-testid={e.kind === 'featured' ? 'featured-label' : undefined}
            x={mx}
            y={my + (size * 0.95) / v.k}
            style={{ fontSize: size / v.k }}
            onClick={(ev) => {
              ev.stopPropagation();
              select(e);
            }}
          >
            {e.label}
            {e.kind === 'featured' && lvl >= 1 && e.sub && (
              <tspan className="point-sub" x={mx} dy={`${(PX.sub * 1.45) / v.k}`} style={{ fontSize: PX.sub / v.k }}>
                {e.sub}
              </tspan>
            )}
            <title>{e.title}</title>
          </text>
        );
      })}
    </g>
  );
});
