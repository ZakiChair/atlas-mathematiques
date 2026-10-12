import { memo, useMemo, type CSSProperties } from 'react';
import type { Domain } from '../data/types';
import type { TerritoryLayout } from './layout';
import { levelFor, useViewTransform } from './viewStore';
import { useLang } from '../i18n/lang';
import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
import { KIND_INK } from './resultKinds';
import { DOWNSTREAM_INK, UPSTREAM_INK } from './fieldColors';
import { shortTheoryName, wrapWords } from './labels';
import { domainNameCenter, domainNameMetrics } from './labelMetrics';

interface Props {
  domain: Domain;
  layout: TerritoryLayout;
  selected: boolean;
  selectedChildId?: string;
  dimmed: boolean;
  related: boolean;
  /** génération dans l'amont du domaine choisi (0 : hors amont) */
  upGen: number;
  /** génération dans l'aval du domaine choisi (0 : hors aval) */
  downGen: number;
  onSelect: (kind: 'domain' | 'theory' | 'mathematician' | 'result', id: string, territory: TerritoryLayout) => void;
  onHover?: (id: string | null) => void;
}

/** marge hors écran (px) au-delà de laquelle les enfants ne sont pas montés dans le DOM */
const PAD = 220;

/**
 * Un domaine, DA « Galerie » : disque pâle sans contour, nom en petites
 * capitales dans le haut du disque (niveaux 0 et 1). Niveau 1 : ses théories ;
 * niveau 2 : le point de chaque figure ordinaire ; niveau 3 : le losange de
 * chaque résultat. Les médailles des grandes figures et tous les noms de
 * points sont posés par LabelLayer, qui les désencombre.
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
  onSelect,
  onHover,
}: Props) {
  const { lang } = useLang();
  const { x, y, r } = layout;
  const palette = domain.map.palette;

  // Re-rendu à chaque frame de zoom (léger) : seuls les enfants du niveau courant
  // ET visibles à l'écran sont montés dans le DOM.
  const v = useViewTransform();
  const lvl = levelFor(v.k);
  const inView = (cx: number, cy: number) => {
    const sx = v.x + cx * v.k;
    const sy = v.y + cy * v.k;
    return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
  };
  /** px écran → unités carte */
  const px = (n: number) => n / v.k;

  const theoryById = useMemo(() => new Map(domain.theories.map((s) => [s.id, s])), [domain]);
  const mathById = useMemo(() => new Map(domain.mathematicians.map((f) => [f.id, f])), [domain]);
  const resultById = useMemo(() => new Map(domain.results.map((f) => [f.id, f])), [domain]);

  const name = domainNameMetrics(domain, r, v.k);
  const nc = domainNameCenter(layout, lvl);

  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}${upGen > 0 ? ' chain-up' : ''}${
    downGen > 0 ? ' chain-down' : ''
  }`;
  const gen = Math.max(upGen, downGen);

  return (
    <g
      className={cls}
      data-testid="territory"
      data-id={domain.id}
      data-up={upGen > 0 ? Math.min(upGen, 4) : undefined}
      data-down={downGen > 0 ? Math.min(downGen, 4) : undefined}
      style={{ '--ink': palette.stroke } as CSSProperties}
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
      {/* place dans l'amont (Prusse) ou l'aval (sépia) du domaine choisi */}
      {gen > 0 && (
        <circle
          className="chain-ring"
          cx={x}
          cy={y}
          r={r + 6}
          stroke={upGen > 0 ? UPSTREAM_INK : DOWNSTREAM_INK}
          strokeWidth={gen === 1 ? 2.2 : 1.5}
          strokeDasharray={gen > 1 ? '6 5' : undefined}
        />
      )}
      {selected && <circle className="ring" cx={x} cy={y} r={r + 10} stroke={palette.stroke} />}
      <circle className="disc" cx={x} cy={y} r={r} fill={palette.fill} />
      <title>
        {domain.name} · {formatPeriod(domain.period, lang)}
      </title>

      {/* nom du domaine : niveaux 0 et 1 (ensuite, il est dans le fil d'Ariane et le panneau) */}
      {lvl <= 1 && (
        <text className="territory-name" x={nc.x} y={nc.y} textAnchor="middle" fill={palette.stroke} style={{ fontSize: px(name.fontPx) }}>
          {name.lines.map((l, i) => (
            <tspan key={i} x={nc.x} dy={i === 0 ? `${-(name.lines.length - 1) * 0.575 + 0.35}em` : '1.15em'}>
              {l}
            </tspan>
          ))}
        </text>
      )}

      {/* théories — niveau 1 seulement */}
      {lvl === 1 &&
        layout.children
          .filter((c) => c.kind === 'theory' && inView(c.x, c.y))
          .map((c) => {
            const s = theoryById.get(c.id);
            if (!s) return null;
            const lines = wrapWords(shortTheoryName(s.name), 18, 2);
            return (
              <g key={c.id}>
                <text className="theory-label" x={c.x} y={c.y} textAnchor="middle" fill={palette.stroke} style={{ fontSize: px(15) }}>
                  {lines.map((l, i, arr) => (
                    <tspan key={i} x={c.x} dy={i === 0 ? `${-(arr.length - 1) * 0.55 + 0.35}em` : '1.1em'}>
                      {l}
                    </tspan>
                  ))}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={px(26)}
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

      {/* figures ordinaires — niveau 2 : un point ; le nom est posé par LabelLayer */}
      {lvl >= 2 &&
        layout.children
          .filter((c) => c.kind === 'mathematician' && !c.featured && inView(c.x, c.y))
          .map((c) => {
            const f = mathById.get(c.id);
            if (!f) return null;
            const isSel = selectedChildId === f.id;
            return (
              <g key={c.id} className={isSel ? 'child-selected' : undefined}>
                {isSel && <circle className="child-ring" cx={c.x} cy={c.y} r={px(9)} stroke={UPSTREAM_INK} strokeWidth={px(1.8)} />}
                <circle className="figure-dot" cx={c.x} cy={c.y} r={px(isSel ? 5 : 3.5)} stroke={palette.stroke} strokeWidth={px(1.3)} />
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={px(9)}
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

      {/* résultats — niveau 3 : losange à l'encre de leur nature ; le titre est posé par LabelLayer */}
      {lvl >= 3 &&
        layout.children
          .filter((c) => c.kind === 'result' && inView(c.x, c.y))
          .map((c) => {
            const f = resultById.get(c.id);
            if (!f) return null;
            const isSel = selectedChildId === f.id;
            const s = px(isSel ? 7 : 5.5);
            const d = `M ${c.x} ${c.y - s} L ${c.x + s} ${c.y} L ${c.x} ${c.y + s} L ${c.x - s} ${c.y} Z`;
            return (
              <g key={c.id} className={isSel ? 'child-selected' : undefined}>
                {isSel && <circle className="child-ring" cx={c.x} cy={c.y} r={px(11)} stroke={UPSTREAM_INK} strokeWidth={px(1.8)} />}
                <path className="result-diamond" d={d} fill={KIND_INK[f.kind]} strokeWidth={px(1)} />
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={px(9)}
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
  );
});
