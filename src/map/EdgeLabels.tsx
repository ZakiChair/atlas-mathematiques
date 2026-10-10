import { memo } from 'react';
import { useViewTransform } from './viewStore';
import { eraLabels, continentLabels } from './edgeLabelsLayout';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';

/** Marges de la carte : noms de continents à gauche, ères en bas, en espace écran. */
export const EdgeLabels = memo(function EdgeLabels() {
  const v = useViewTransform();
  const { lang } = useLang();
  const { eras, continents } = useData();
  const continentLabelsOut = continentLabels(v, continents);
  const eraLabelsOut = eraLabels(v, eras, lang);
  return (
    <div className="edge-labels" aria-hidden="true">
      {continentLabelsOut.map((l) => (
        <span key={l.id} className="edge-continent" style={{ top: l.pos }}>
          {l.lines[0]}
        </span>
      ))}
      {eraLabelsOut.map((l) => (
        <span key={l.id} className="edge-era" style={{ left: l.pos }}>
          <span className="edge-era-name">{l.lines[0]}</span>
          <span className="edge-era-range">{l.lines[1]}</span>
        </span>
      ))}
    </div>
  );
});
