import { memo } from 'react';
import { useViewTransform } from './viewStore';
import { continentLabels } from './edgeLabelsLayout';
import { useData } from '../i18n/localize';
import { FIELD_COLORS } from './fieldColors';
import type { ContinentId } from '../data/types';

/**
 * Marge gauche de la carte, en espace écran : le nom de chaque champ, dans
 * l'encre de son fleuve (les ères sont nommées par la frise). `top` / `bottom` :
 * bandes d'écran occupées par l'interface.
 */
export const EdgeLabels = memo(function EdgeLabels({ top, bottom }: { top: number; bottom: number }) {
  const v = useViewTransform();
  const { continents } = useData();
  const labels = continentLabels(v, continents, top, bottom);
  return (
    <div className="edge-labels" aria-hidden="true">
      {labels.map((l) => (
        <span key={l.id} className="edge-continent" style={{ top: l.pos, color: FIELD_COLORS[l.id as ContinentId]?.ink }}>
          {l.text}
        </span>
      ))}
    </div>
  );
});
