import { memo, useMemo, type CSSProperties } from 'react';
import type { Domain, ResultKind } from '../data/types';
import { organicPath, type TerritoryLayout } from './layout';
import { LITE } from './lite';
import { levelFor, useViewTransform } from './viewStore';
import { useLang } from '../i18n/lang';
import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
import type { VisionId } from '../state/store';
import { KIND_CHALK, dominantKind, domainHasKind } from './visionPalettes';

const MAX_LINE = 15;
const MAX_LINES = 3;

/** Coupe un texte en lignes ≤ maxLine caractères (aux espaces), maxLines max. */
export function wrapWords(text: string, maxLine: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLine) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    head.push(lines.slice(maxLines - 1).join(' '));
    return head;
  }
  return lines;
}

/** Coupe le nom en lignes ≤ ~15 caractères (aux espaces), 3 lignes max. */
export function wrapName(name: string): string[] {
  return wrapWords(name.toUpperCase(), MAX_LINE, MAX_LINES);
}

/** Nom court d'une théorie pour la carte : la partie avant « : » (le détail reste dans le panneau). */
export function shortTheoryName(name: string): string {
  return name.split(' : ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
}

interface Props {
  domain: Domain;
  layout: TerritoryLayout;
  selected: boolean;
  selectedChildId?: string;
  dimmed: boolean;
  related: boolean;
  vision: VisionId;
  naturesKind: ResultKind | null;
  onSelect: (kind: 'domain' | 'theory' | 'mathematician' | 'result', id: string, territory: TerritoryLayout) => void;
  onHover?: (id: string | null) => void;
}

export const Territory = memo(function Territory({ domain, layout, selected, selectedChildId, dimmed, related, vision, naturesKind, onSelect, onHover }: Props) {
  const { lang } = useLang();
  const { x, y, r } = layout;
  // vision « natures » : la couleur du territoire vient de la nature dominante de
  // ses résultats — ou de la nature filtrée quand une pastille est active (le
  // territoire la possédant se teinte alors de cette nature).
  const kindKey =
    naturesKind !== null && domainHasKind(domain, naturesKind) ? naturesKind : dominantKind(domain.results);
  const kindPalette = vision === 'natures' ? KIND_CHALK[kindKey] : null;
  const palette = domain.map.palette;
  const stroke = kindPalette?.stroke ?? palette.stroke;
  const accent = kindPalette?.accent ?? palette.accent;
  const veiled = vision === 'natures' && naturesKind !== null && !domainHasKind(domain, naturesKind);

  // Re-rendu à chaque frame de zoom/pan (léger : tests booléens seulement) pour
  // ne monter dans le DOM que les enfants du niveau courant ET visibles à
  // l'écran — sans ça, ~5 000 nœuds masqués (opacity:0) pèsent sur le mobile.
  const v = useViewTransform();
  const lvl = levelFor(v.k);
  const PAD = 220; // px écran : les libellés débordent sans apparaître brutalement
  const inView = (cx: number, cy: number) => {
    const sx = v.x + cx * v.k;
    const sy = v.y + cy * v.k;
    return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
  };
  const showTheories = lvl >= 1;
  const showMathematicians = lvl >= 2;
  const showResults = lvl >= 3;

  const theoryById = useMemo(() => new Map(domain.theories.map((s) => [s.id, s])), [domain]);
  const mathById = useMemo(() => new Map(domain.mathematicians.map((f) => [f.id, f])), [domain]);
  const resultById = useMemo(() => new Map(domain.results.map((f) => [f.id, f])), [domain]);

  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}${veiled ? ' veil' : ''}`;

  // nom : lignes + taille en unités carte pour tenir dans ≈1.55 r
  // (Kalam est plus large qu'un serif : facteur 0.7 par caractère)
  const lines = wrapName(domain.name);
  const longest = Math.max(...lines.map((l) => l.length), 1);
  const fs = Math.min(0.19 * r, (1.55 * r) / (longest * 0.7));
  // interligne en em : suit la taille effective (réduite par CSS aux niveaux ≥ 1)
  const lineH = fs * 1.05;
  const nameTop = y - ((lines.length - 1) * lineH) / 2 - (lines.length > 0 ? fs * 0.1 : 0);

  const vars = {
    '--fs': String(fs),
    '--r': String(r),
    '--accent': accent,
  } as CSSProperties;

  return (
    <g
      className={cls}
      data-testid="territory"
      data-id={domain.id}
      style={vars}
      tabIndex={0}
      role="button"
      aria-label={domain.name}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onSelect('domain', domain.id, layout);
        }
      }}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => onHover?.(domain.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(domain.id)}
      onBlur={() => onHover?.(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect('domain', domain.id, layout);
      }}
    >
      {/* halo de sélection — flou coûteux : réservé au desktop ; sur mobile,
          monté seulement à la sélection et sans flou */}
      {(selected || !LITE) && (
        <path
          className="halo"
          d={layout.path}
          fill="none"
          stroke={accent}
          strokeWidth={8}
          strokeOpacity={0.55}
          strokeLinecap="round"
          filter={LITE ? undefined : 'url(#halo-blur)'}
        />
      )}
      {/* aplat ardoise + grain (feTurbulence : desktop seulement) */}
      <path
        className="fill"
        d={layout.path}
        fill={kindPalette ? kindPalette.stroke : palette.fill}
        fillOpacity={kindPalette ? 0.12 : 0.8}
        filter={LITE ? undefined : 'url(#paper-grain)'}
      />
      {/* hachures de craie, orientation par continent */}
      <path className="hatch" d={layout.path} fill={`url(#hatch-${domain.continents[0]})`} />
      {/* liseré de craie (dessin tremblé léger sur desktop) */}
      <path
        className="edge"
        d={layout.path}
        fill="none"
        stroke={stroke}
        strokeWidth={selected ? 3.4 : 1.8}
        strokeOpacity={0.9}
        strokeLinecap="round"
        filter={LITE ? undefined : 'url(#chalk-edge)'}
      />
      {/* isoligne pointillée (même forme, r + 18) */}
      <path d={layout.isoPath} fill="none" stroke={stroke} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="5 7" strokeLinecap="round" />
      <title>{domain.name}</title>

      <g className="territory-labels">
        <text className="territory-name" x={x} y={nameTop} textAnchor="middle">
          {lines.map((l, i) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : '1.05em'}>
              {l}
            </tspan>
          ))}
        </text>
        <text className="territory-period" x={x} y={nameTop + lines.length * lineH - fs * 0.1}>
          {formatPeriod(domain.period, lang)}
        </text>
      </g>

      {/* théories — niveau 1 */}
      <g className="layer layer-1">
        {showTheories &&
          layout.children
          .filter((c) => c.kind === 'theory' && inView(c.x, c.y))
          .map((c) => {
            const s = theoryById.get(c.id);
            if (!s) return null;
            const blob = organicPath(c.x, c.y, r * 0.16, `theory:${c.id}`, 0.22);
            return (
              <g key={c.id}>
                <path d={blob} fill={accent} fillOpacity={0.16} stroke={accent} strokeOpacity={0.5} strokeWidth={1.2} />
                <text className="child-label theory-label" x={c.x} y={c.y} fill={stroke}>
                  {wrapWords(shortTheoryName(s.name), 18, 2).map((l, i, arr) => (
                    <tspan key={i} x={c.x} dy={i === 0 ? `${-(arr.length - 1) * 0.55}em` : '1.1em'}>
                      {l}
                    </tspan>
                  ))}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={r * 0.18}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('theory', s.id, layout);
                  }}
                >
                  <title>
                    {s.name}
                    {s.period ? ` · ${formatPeriod(s.period, lang)}` : ''}
                  </title>
                </circle>
              </g>
            );
          })}
      </g>

      {/* mathématicien·nes — niveau 2 */}
      <g className="layer layer-2">
        {showMathematicians &&
          layout.children
          .filter((c) => c.kind === 'mathematician' && inView(c.x, c.y))
          .map((c) => {
            const f = mathById.get(c.id);
            if (!f) return null;
            const isSel = selectedChildId === f.id;
            return (
              <g key={c.id}>
                <circle
                  className="marker-mathematician"
                  cx={c.x}
                  cy={c.y}
                  fill={isSel ? accent : '#edeee6'}
                  fillOpacity={isSel ? 1 : 0.85}
                  stroke={isSel ? '#fff' : stroke}
                  style={{ r: isSel ? 'calc(7px / var(--k))' : 'calc(5px / var(--k))' }}
                />
                <text className="child-label mathematician-label" x={c.x} y={c.y} fill="#edeee6" dy={c.vside === 'below' ? '1.7em' : '-0.9em'}>
                  {f.name}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={Math.max(14, r * 0.08)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('mathematician', f.id, layout);
                  }}
                >
                  <title>
                    {f.name} ({formatLifespan(f.years, lang, f.yearsApprox)})
                  </title>
                </circle>
              </g>
            );
          })}
      </g>

      {/* résultats — niveau 3 (colorés par nature dans la vision « natures ») */}
      <g className="layer layer-3">
        {showResults &&
          layout.children
          .filter((c) => c.kind === 'result' && inView(c.x, c.y))
          .map((c) => {
            const f = resultById.get(c.id);
            if (!f) return null;
            const isSel = selectedChildId === f.id;
            const kindVeil = vision === 'natures' && naturesKind !== null && f.kind !== naturesKind;
            const s = 14;
            const d = `M ${c.x} ${c.y - s} L ${c.x + s} ${c.y} L ${c.x} ${c.y + s} L ${c.x - s} ${c.y} Z`;
            return (
              <g key={c.id}>
                <path
                  className={`result-diamond${kindVeil ? ' result-veil' : ''}`}
                  d={d}
                  fill={kindPalette ? KIND_CHALK[f.kind].stroke : isSel ? accent : '#edeee6'}
                  fillOpacity={0.9}
                  stroke={stroke}
                  style={{ transform: 'scale(calc(0.55 / var(--k)))', transformBox: 'fill-box', transformOrigin: 'center' }}
                />
                <text
                  className="child-label result-label"
                  x={c.x}
                  y={c.y}
                  textAnchor={c.anchor ?? 'middle'}
                  dx={c.anchor === 'start' ? '0.9em' : c.anchor === 'end' ? '-0.9em' : 0}
                  dy={c.anchor && c.anchor !== 'middle' ? '0.35em' : '1.6em'}
                >
                  {f.title} ({formatYear(f.year, lang, f.yearApprox)})
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={Math.max(10, r * 0.05)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('result', f.id, layout);
                  }}
                >
                  <title>
                    {f.title} ({formatYear(f.year, lang, f.yearApprox)})
                  </title>
                </circle>
              </g>
            );
          })}
      </g>
    </g>
  );
});
