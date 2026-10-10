import { memo, useMemo } from 'react';
import { CONTINENTS, DOMAINS, MAP_SIZE } from '../data';
import type { AtlasLayout } from './layout';
import type { VisionId } from '../state/store';
import { computeRivers } from './rivers';
import { FIELD_COLORS } from './fieldColors';

/**
 * « Mer » du présent : un lavis elliptique centré au-delà du bord droit, posé
 * sur les embouchures (les fleuves s'y dissolvent) et qui déborde de la carte
 * sans bord visible.
 */
const SEA = { x: MAP_SIZE.width - 520, y: -1500, width: 1820, height: MAP_SIZE.height + 3000 };

interface Props {
  layout: AtlasLayout;
  vision: VisionId;
  hasSelection: boolean;
}

/**
 * Les cinq fleuves, sous les lacs : lit en lavis, berges et filets de courant
 * à l'encre de la teinte du champ ; à l'embouchure, le nombre de résultats
 * recensés dans le champ (la largeur du lit en est la traduction).
 */
export const RiverLayer = memo(function RiverLayer({ layout, vision, hasSelection }: Props) {
  const rivers = useMemo(
    () =>
      computeRivers(
        DOMAINS,
        layout.byId,
        CONTINENTS.map((c) => c.id),
      ),
    [layout],
  );
  return (
    <g className={`rivers vision-${vision}${hasSelection ? ' has-selection' : ''}`} aria-hidden="true">
      {rivers.map((r) => {
        const c = FIELD_COLORS[r.continent];
        return (
          <g key={r.continent} className="river" data-field={r.continent}>
            <path className="river-bed" d={r.bed} fill={c.water} fillOpacity={0.6} />
            {r.currents.map((d, i) => (
              <path key={`c${i}`} className="river-current" d={d} stroke={c.bank} />
            ))}
            {r.banks.map((d, i) => (
              <path key={`b${i}`} className="river-bank" d={d} stroke={c.bank} />
            ))}
          </g>
        );
      })}
      <rect className="river-sea" {...SEA} fill="url(#sea-wash)" />
      {rivers.map((r) => {
        const mouth = r.samples[r.samples.length - 1];
        return (
          <text key={r.continent} className="river-tally" x={MAP_SIZE.width - 78} y={mouth.y} dy="0.35em" fill={FIELD_COLORS[r.continent].ink}>
            {r.total}
          </text>
        );
      })}
    </g>
  );
});
