import { memo } from 'react';
import { MAP_SIZE, CONTINENTS, ERA_BANDS } from '../data/eras';

/**
 * Repères indicatifs dessinés dans le monde : bandes de continents (axe y) et
 * séparateurs d'ères (axe x). Les libellés vivent dans les marges écran (EdgeLabels).
 */
export const Graticule = memo(function Graticule() {
  return (
    <g className="graticule" aria-hidden="true">
      {CONTINENTS.map((r, i) => (
        <rect
          key={r.id}
          className={`continent-band${i % 2 ? ' alt' : ''}`}
          x={0}
          y={r.y0}
          width={MAP_SIZE.width}
          height={r.y1 - r.y0}
        />
      ))}
      {ERA_BANDS.map((band, i) =>
        i > 0 ? <line key={band.era} className="graticule-line" x1={band.x0} y1={0} x2={band.x0} y2={MAP_SIZE.height} /> : null,
      )}
    </g>
  );
});
