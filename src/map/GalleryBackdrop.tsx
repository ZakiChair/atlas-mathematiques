import { memo } from 'react';
import { CONTINENTS, ERA_BANDS, MAP_SIZE } from '../data';
import { FIELD_COLORS } from './fieldColors';
import { yearToX, YEAR_TICKS } from './timeScale';

/** graduations qui coïncident avec une frontière d'ère : la règle de l'ère suffit */
const ERA_STARTS = new Set(ERA_BANDS.map((b) => b.x0));
const TICK_Y = 116;

/** Graduation compacte : « −1500 », « 1 », « 1850 ». */
const tickLabel = (y: number) => (y < 0 ? `−${-y}` : String(y));

/**
 * Fond de la carte « Galerie » : les cinq bandes des champs, très pâles, les
 * frontières des ères et quelques années en filigrane (les ères sont nommées
 * par la frise). Tout le reste est posé dessus.
 */
export const GalleryBackdrop = memo(function GalleryBackdrop() {
  const ticks = YEAR_TICKS.map((y) => ({ y, x: yearToX(y) })).filter((t) => !ERA_STARTS.has(t.x));
  return (
    <g className="backdrop" aria-hidden="true">
      {CONTINENTS.map((c) => (
        <rect key={c.id} className="lane" data-field={c.id} x={0} y={c.y0} width={MAP_SIZE.width} height={c.y1 - c.y0} fill={FIELD_COLORS[c.id].band} />
      ))}
      {CONTINENTS.slice(1).map((c) => (
        <line key={c.id} className="lane-rule" x1={0} x2={MAP_SIZE.width} y1={c.y0} y2={c.y0} />
      ))}
      {ERA_BANDS.slice(1).map((b) => (
        <line key={b.era} className="era-rule" x1={b.x0} x2={b.x0} y1={0} y2={MAP_SIZE.height} />
      ))}
      {ticks.map((t) => (
        <g key={t.y}>
          <line className="tick-rule" x1={t.x} x2={t.x} y1={TICK_Y + 10} y2={MAP_SIZE.height} />
          <text className="tick-year" x={t.x} y={TICK_Y} textAnchor="middle">
            {tickLabel(t.y)}
          </text>
        </g>
      ))}
    </g>
  );
});
