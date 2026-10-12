import { memo, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import * as d3 from 'd3';
import { CONTINENTS, DOMAINS, ERA_BANDS, MAP_SIZE, TIME_BOUNDS } from '../data';
import type { ContinentId, Domain } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';
import { formatYear } from '../lib/years';
import type { MapController } from './controller';
import { activity, smooth } from './activity';
import { FIELD_COLORS } from './fieldColors';
import { displayYear, xToYear, yearToX, YEAR_TICKS } from './timeScale';
import { useViewTransform } from './viewStore';

const BINS = 120;
const PAD_L = 30;
const PAD_R = 14;
const ORDER: ContinentId[] = CONTINENTS.map((c) => c.id);

interface Props {
  controller: MapController | null;
  height: number;
  /** marge droite réservée (panneau ouvert) */
  right: number;
  selectedDomain: Domain | null;
}

/** Graduation compacte : « −1500 », « 1 », « 1850 ». */
const tickLabel = (y: number) => (y < 0 ? `−${-y}` : String(y));

/**
 * Frise d'activité des cinq champs : un courant par champ, épais du nombre de
 * résultats recensés par tranche de la carte. Même échelle du temps que la
 * carte ; la fenêtre encadre la portion visible ; clic ou glisser = déplacer la
 * carte à cette époque.
 */
export const ActivityFrieze = memo(function ActivityFrieze({ controller, height, right, selectedDomain }: Props) {
  const { t, lang } = useLang();
  const { eras, continents } = useData();
  const v = useViewTransform();
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => activity(DOMAINS, ORDER, BINS), []);
  const compact = height < 70;
  const top = compact ? 4 : 18;
  const bottom = height - 15;
  const plotW = Math.max(10, width - PAD_L - PAD_R);
  const sx = (mapX: number) => PAD_L + (mapX / MAP_SIZE.width) * plotW;
  const toMapX = (px: number) => Math.min(MAP_SIZE.width, Math.max(0, ((px - PAD_L) / plotW) * MAP_SIZE.width));

  const streams = useMemo(() => {
    if (width === 0) return [];
    const smoothed = Object.fromEntries(ORDER.map((c) => [c, smooth(data.series[c], 2)]));
    const rows = Array.from({ length: BINS }, (_, i) => Object.fromEntries(ORDER.map((c) => [c, smoothed[c][i]])));
    const stacked = d3.stack<Record<string, number>>().keys(ORDER).offset(d3.stackOffsetSilhouette)(rows);
    const lo = d3.min(stacked, (s) => d3.min(s, (p) => p[0])) ?? 0;
    const hi = d3.max(stacked, (s) => d3.max(s, (p) => p[1])) ?? 1;
    const y = d3.scaleLinear().domain([lo, hi]).range([bottom - 2, top + 2]);
    const xAt = (i: number) => PAD_L + ((i + 0.5) / BINS) * plotW;
    const area = d3
      .area<d3.SeriesPoint<Record<string, number>>>()
      .x((_, i) => xAt(i))
      .y0((p) => y(p[0]))
      .y1((p) => y(p[1]))
      .curve(d3.curveBasis);
    return stacked.map((s) => ({ c: s.key as ContinentId, d: area(s) ?? '' }));
  }, [data, width, plotW, top, bottom]);

  // fenêtre : portion de l'axe du temps visible sur la carte
  const wx0 = Math.max(0, -v.x / v.k);
  const wx1 = Math.min(MAP_SIZE.width, (v.width - v.x) / v.k);

  const pan = (clientX: number, animated: boolean) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || !controller) return;
    controller.panToX(toMapX(clientX - box.left), animated ? 450 : 0);
  };
  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    drag.current = { startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (box) setHover(toMapX(e.clientX - box.left));
    if (!drag.current) return;
    if (Math.abs(e.clientX - drag.current.startX) > 3) drag.current.moved = true;
    if (drag.current.moved) pan(e.clientX, false);
  };
  const onUp = (e: PointerEvent<SVGSVGElement>) => {
    if (drag.current && !drag.current.moved) pan(e.clientX, true);
    drag.current = null;
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!controller || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    const step = (wx1 - wx0) * 0.25 * (e.key === 'ArrowLeft' ? -1 : 1);
    controller.panToX(Math.min(MAP_SIZE.width, Math.max(0, (wx0 + wx1) / 2 + step)), 300);
  };

  // graduations : on saute celles qui chevaucheraient la précédente
  const ticks: number[] = [];
  for (const y of YEAR_TICKS) {
    const px = sx(yearToX(y));
    if (ticks.length === 0 || px - sx(yearToX(ticks[ticks.length - 1])) > 38) ticks.push(y);
  }
  const hoverBin = hover === null ? null : Math.min(BINS - 1, Math.floor(hover / data.step));
  const continentName = new Map(continents.map((c) => [c.id, c.shortName ?? c.name]));
  const sel = selectedDomain ? { x0: yearToX(selectedDomain.period.start), x1: yearToX(selectedDomain.period.end ?? TIME_BOUNDS.end) } : null;

  return (
    <div ref={boxRef} className="frieze" style={{ right, height }} data-testid="frieze">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="slider"
          tabIndex={0}
          aria-label={t('frieze.aria')}
          aria-valuemin={TIME_BOUNDS.start}
          aria-valuemax={TIME_BOUNDS.end}
          aria-valuenow={displayYear(xToYear((wx0 + wx1) / 2))}
          aria-valuetext={formatYear(displayYear(xToYear((wx0 + wx1) / 2)), lang)}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
        >
          {ERA_BANDS.map((b, i) => {
            const era = eras.find((e) => e.id === b.era);
            const label = (era?.shortName ?? era?.name ?? '').toUpperCase();
            const bw = sx(b.x1) - sx(b.x0);
            return (
              <g key={b.era}>
                {i > 0 && <line x1={sx(b.x0)} x2={sx(b.x0)} y1={compact ? 2 : 4} y2={bottom} stroke="rgba(70,55,30,0.25)" strokeDasharray="2 4" />}
                {!compact && label.length * 8.4 < bw - 6 && (
                  <text className="frieze-era" x={(sx(b.x0) + sx(b.x1)) / 2} y={12} textAnchor="middle">
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          {streams.map((s) => (
            <path key={s.c} d={s.d} fill={FIELD_COLORS[s.c].wash} stroke={FIELD_COLORS[s.c].ink} strokeOpacity={0.45} strokeWidth={0.7} />
          ))}
          {sel && <rect className="frieze-selected" x={sx(sel.x0)} y={top} width={Math.max(2, sx(sel.x1) - sx(sel.x0))} height={bottom - top} rx={2} />}
          {/* hors fenêtre : voile de papier */}
          <rect x={PAD_L} y={top - 2} width={Math.max(0, sx(wx0) - PAD_L)} height={bottom - top + 4} fill="rgba(251,250,247,0.65)" />
          <rect x={sx(wx1)} y={top - 2} width={Math.max(0, PAD_L + plotW - sx(wx1))} height={bottom - top + 4} fill="rgba(251,250,247,0.65)" />
          <rect className="frieze-window" x={sx(wx0)} y={top - 2} width={Math.max(2, sx(wx1) - sx(wx0))} height={bottom - top + 4} rx={3} />
          {ticks.map((y) => (
            <text key={y} className="frieze-tick" x={sx(yearToX(y))} y={height - 3} textAnchor="middle">
              {tickLabel(y)}
            </text>
          ))}
          {hover !== null && <line x1={sx(hover)} x2={sx(hover)} y1={top - 2} y2={bottom + 2} stroke="#26231d" strokeWidth={1} strokeOpacity={0.55} />}
        </svg>
      )}
      {hover !== null && hoverBin !== null && (
        <div
          className="glass absolute px-2.5 py-1.5 text-xs whitespace-nowrap pointer-events-none"
          style={{ left: Math.min(Math.max(8, sx(hover) - 120), width - 250), bottom: height + 6 }}
          role="status"
        >
          <span className="font-serif italic font-semibold text-sm mr-2">≈ {formatYear(displayYear(xToYear(hover)), lang)}</span>
          {ORDER.map((c) => (
            <span key={c} className="mr-2">
              <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ background: FIELD_COLORS[c].wash, border: `1px solid ${FIELD_COLORS[c].ink}` }} />
              {continentName.get(c)} {data.series[c][hoverBin]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
