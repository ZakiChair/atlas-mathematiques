import { memo, useMemo } from 'react';
import { CONTINENTS, DOMAIN_BY_ID, ERA_BANDS, MAP_SIZE } from '../data';
import { useData } from '../i18n/localize';
import type { AtlasLayout } from './layout';
import { periodSpan } from './layout';
import { FIELD_COLORS } from './fieldColors';
import { yearToX, YEAR_TICKS } from './timeScale';

/** contre-échelle : glyphes dessinés en pixels écran */
const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box', transformOrigin: '50% 50%' } as const;
/** graduations qui coïncident avec une frontière d'ère : la règle de l'ère suffit */
const ERA_STARTS = new Set(ERA_BANDS.map((b) => b.x0));
const ERA_NAME_Y = 72;
const ERA_NAME_SIZE = 54;
const TICK_Y = 116;

/** Graduation compacte : « −1500 », « 1 », « 1850 ». */
const tickLabel = (y: number) => (y < 0 ? `−${-y}` : String(y));

interface Props {
  layout: AtlasLayout;
}

/**
 * Fond de la carte : les cinq bandes des champs, les ères et les graduations du
 * temps en filigrane, puis la portée de chaque domaine (sa période, posée sur
 * l'axe du temps sous son lac : un trait d'encre de la teinte du domaine, à
 * butées, ouvert vers la droite quand le domaine est toujours actif).
 */
export const LaneLayer = memo(function LaneLayer({ layout }: Props) {
  const { eras } = useData();
  const spans = useMemo(
    () =>
      layout.territories.map((t) => {
        const m = DOMAIN_BY_ID[t.id];
        const [x0, x1] = periodSpan(m);
        return { id: t.id, y: t.y, x0, x1, open: m.period.end === null, approx: !!m.period.approx, ink: m.map.palette.stroke };
      }),
    [layout],
  );
  const ticks = YEAR_TICKS.map((y) => ({ y, x: yearToX(y) })).filter((t) => !ERA_STARTS.has(t.x));

  return (
    <g className="lanes" aria-hidden="true">
      {CONTINENTS.map((c) => (
        <rect key={c.id} className="lane" data-field={c.id} x={0} y={c.y0} width={MAP_SIZE.width} height={c.y1 - c.y0} fill={FIELD_COLORS[c.id].band} />
      ))}
      {CONTINENTS.slice(1).map((c) => (
        <line key={c.id} className="lane-rule" x1={0} x2={MAP_SIZE.width} y1={c.y0} y2={c.y0} />
      ))}
      {ERA_BANDS.map((b, i) => {
        const era = eras.find((e) => e.id === b.era);
        const label = (era?.shortName ?? era?.name ?? '').toUpperCase();
        const bw = b.x1 - b.x0;
        const size = Math.min(ERA_NAME_SIZE, (bw - 90) / Math.max(1, label.length * 0.78));
        return (
          <g key={b.era}>
            {i > 0 && <line className="era-rule" x1={b.x0} x2={b.x0} y1={0} y2={MAP_SIZE.height} />}
            <text className="era-name" x={(b.x0 + b.x1) / 2} y={ERA_NAME_Y} textAnchor="middle" style={{ fontSize: size }}>
              {label}
            </text>
          </g>
        );
      })}
      {ticks.map((t) => (
        <g key={t.y}>
          <line className="tick-rule" x1={t.x} x2={t.x} y1={TICK_Y + 10} y2={MAP_SIZE.height} />
          <text className="tick-year" x={t.x} y={TICK_Y} textAnchor="middle">
            {tickLabel(t.y)}
          </text>
        </g>
      ))}
      <g className="spans">
        {spans.map((s) => (
          <g key={s.id} className={`span${s.approx ? ' approx' : ''}`} style={{ color: s.ink }}>
            <line className="span-line" x1={s.x0} x2={s.x1} y1={s.y} y2={s.y} />
            <g transform={`translate(${s.x0} ${s.y})`}>
              <path className="span-cap" d="M0 -6 V6" style={counterScale} />
            </g>
            <g transform={`translate(${s.x1} ${s.y})`}>
              <path className="span-cap" d={s.open ? 'M-7 -6 L0 0 L-7 6' : 'M0 -6 V6'} style={counterScale} />
            </g>
          </g>
        ))}
      </g>
    </g>
  );
});
