import { memo, useMemo, type CSSProperties } from 'react';
import type { Domain, ResultKind } from '../data/types';
import { organicPath, type TerritoryLayout } from './layout';
import { levelFor, useViewTransform } from './viewStore';
import { useLang } from '../i18n/lang';
import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
import type { VisionId } from '../state/store';
import { KIND_INK, dominantKind, domainHasKind } from './visionPalettes';
import { DOWNSTREAM_INK, UPSTREAM_INK } from './fieldColors';
import { mapLabel, shortTheoryName, wrapWords } from './labels';

interface Props {
  domain: Domain;
  layout: TerritoryLayout;
  selected: boolean;
  selectedChildId?: string;
  dimmed: boolean;
  related: boolean;
  /** génération dans le bassin amont du domaine choisi (0 : hors bassin) */
  upGen: number;
  /** génération dans le bassin aval du domaine choisi (0 : hors bassin) */
  downGen: number;
  vision: VisionId;
  naturesKind: ResultKind | null;
  onSelect: (kind: 'domain' | 'theory' | 'mathematician' | 'result', id: string, territory: TerritoryLayout) => void;
  onHover?: (id: string | null) => void;
}

/** largeur moyenne d'un caractère de Cormorant Garamond semi-gras, en em (bas de casse) */
const CHAR_EM = 0.5;
const LABEL_LINE = 16;

/**
 * Un domaine : cartouche à bord organique (lavis clair, double filet d'encre
 * de la teinte du champ), nom en bas de casse et période. Les anneaux de
 * Prusse et de sépia signalent sa place dans le bassin du domaine choisi.
 */
export const Territory = memo(function Territory({
  domain,
  layout,
  selected,
  selectedChildId,
  dimmed,
  related,
  upGen,
  downGen,
  vision,
  naturesKind,
  onSelect,
  onHover,
}: Props) {
  const { lang } = useLang();
  const { x, y, r } = layout;
  // vision « natures » : la couleur du lac vient de la nature dominante de ses
  // résultats — ou de la nature filtrée quand une pastille est active (le lac
  // la possédant prend alors l'encre de cette nature).
  const kindKey =
    naturesKind !== null && domainHasKind(domain, naturesKind) ? naturesKind : dominantKind(domain.results);
  const kindPalette = vision === 'natures' ? KIND_INK[kindKey] : null;
  const palette = domain.map.palette;
  const stroke = kindPalette?.stroke ?? palette.stroke;
  const accent = kindPalette?.stroke ?? palette.accent;
  const wash = kindPalette?.wash ?? palette.fill;
  const veiled = vision === 'natures' && naturesKind !== null && !domainHasKind(domain, naturesKind);
  // filet intérieur : même contour (même graine), rayon réduit
  const inner = useMemo(() => organicPath(x, y, r - 14, domain.id), [x, y, r, domain.id]);

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

  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}${veiled ? ' veil' : ''}${
    upGen > 0 ? ' chain-up' : ''
  }${downGen > 0 ? ' chain-down' : ''}`;

  // nom : lignes + taille en unités carte pour tenir dans ≈1.6 r. En vue
  // d'ensemble, le CSS impose un plancher de lisibilité à l'écran : le nom peut
  // alors déborder du lac, jusqu'à 2.6 r (--fs-max).
  const lines = wrapWords(mapLabel(domain), LABEL_LINE, 3);
  const longest = Math.max(...lines.map((l) => l.length), 1);
  const fs = Math.min(0.21 * r, (1.6 * r) / (longest * CHAR_EM));
  const fsMax = (2.6 * r) / (longest * CHAR_EM);

  const vars = {
    '--fs': String(fs),
    '--fs-max': String(fsMax),
    '--r': String(r),
    '--accent': accent,
    '--label': stroke,
  } as CSSProperties;

  return (
    <g
      className={cls}
      data-testid="territory"
      data-id={domain.id}
      data-up={upGen > 0 ? Math.min(upGen, 4) : undefined}
      data-down={downGen > 0 ? Math.min(downGen, 4) : undefined}
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
      {/* anneau de sélection, net */}
      {selected && <path className="ring" d={layout.isoPath} stroke={accent} />}
      {/* lavis du cartouche */}
      <path className="fill" d={layout.path} fill={wash} />
      {/* double filet : rive à l'encre, filet intérieur */}
      <path className="edge" d={layout.path} stroke={stroke} />
      <path className="inner" d={inner} stroke={stroke} />
      {/* place dans le bassin du domaine choisi : amont (Prusse) ou aval (sépia) */}
      {(upGen > 0 || downGen > 0) && (
        <path
          className="chain-ring"
          d={layout.isoPath}
          stroke={upGen > 0 ? UPSTREAM_INK : DOWNSTREAM_INK}
          strokeWidth={upGen === 1 || downGen === 1 ? 2.2 : 1.5}
          strokeDasharray={upGen > 1 || downGen > 1 ? '6 5' : undefined}
        />
      )}
      <title>{domain.name}</title>

      {/* bloc entièrement en em : il suit la taille calculée par le CSS (plancher
          écran en vue d'ensemble, plafonds aux niveaux suivants) */}
      <g className="territory-labels">
        <text className="territory-name" x={x} y={y} textAnchor="middle">
          {lines.map((l, i) => (
            <tspan key={i} x={x} dy={i === 0 ? `${-(lines.length - 1) * 0.5 - 0.12}em` : '1em'}>
              {l}
            </tspan>
          ))}
          <tspan className="territory-period" x={x} dy="1.35em">
            {formatPeriod(domain.period, lang)}
          </tspan>
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
                  <path className="theory-blob" d={blob} fill={accent} stroke={stroke} />
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
                <g key={c.id} className={isSel ? 'child-selected' : undefined}>
                  {isSel && <circle className="child-ring" cx={c.x} cy={c.y} stroke={UPSTREAM_INK} />}
                  <circle
                    className="marker-mathematician"
                    cx={c.x}
                    cy={c.y}
                    fill={isSel ? '#1d1a15' : '#fcfaf5'}
                    stroke={isSel ? '#fcfaf5' : stroke}
                    style={{ r: isSel ? 'calc(7px / var(--k))' : 'calc(5px / var(--k))' }}
                  />
                  <text className="child-label mathematician-label" x={c.x} y={c.y} dy={c.vside === 'below' ? '1.7em' : '-0.9em'}>
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

      {/* résultats — niveau 3 : losange à l'encre de leur nature */}
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
                <g key={c.id} className={isSel ? 'child-selected' : undefined}>
                  {isSel && <circle className="child-ring" cx={c.x} cy={c.y} stroke={UPSTREAM_INK} />}
                  <path
                    className={`result-diamond${kindVeil ? ' result-veil' : ''}`}
                    d={d}
                    fill={isSel ? '#1d1a15' : KIND_INK[f.kind].stroke}
                    stroke="#fcfaf5"
                    style={{ transform: 'scale(calc(0.6 / var(--k)))', transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                  <text
                    className="child-label result-label"
                    x={c.x}
                    y={c.y}
                    // style en ligne : l'attribut textAnchor serait écrasé par .child-label
                    style={{ textAnchor: c.anchor ?? 'middle' }}
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
