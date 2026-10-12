import { memo } from 'react';
import type { AtlasLayout } from './layout';
import type { Selection } from '../state/store';
import { useLang } from '../i18n/lang';
import { useData, MATHEMATICIAN_LINK_KIND_I18N } from '../i18n/localize';

interface Props {
  layout: AtlasLayout;
  /** Mathematician.id sélectionné, sinon null. */
  selectedId: string | null;
  onSelect: (sel: Selection) => void;
}

interface Point {
  x: number;
  y: number;
}

/** Arc de Bézier quadratique entre deux positions de figures (courbure modérée). */
function arcPath(origin: Point, target: Point): { d: string; midX: number; midY: number } {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const d = Math.hypot(dx, dy) || 1;
  const bend = Math.min(0.16 * d, 300);
  const cx = (origin.x + target.x) / 2 - (dy / d) * bend;
  const cy = (origin.y + target.y) / 2 + (dx / d) * bend;
  return {
    d: `M ${origin.x} ${origin.y} Q ${cx} ${cy} ${target.x} ${target.y}`,
    // milieu de la courbe de Bézier quadratique (t = 0,5)
    midX: 0.25 * origin.x + 0.5 * cx + 0.25 * target.x,
    midY: 0.25 * origin.y + 0.5 * cy + 0.25 * target.y,
  };
}

/** Arcs entre la figure choisie et les figures liées (filiation, influence, collaboration, rupture). */
export const MathematicianLinkLayer = memo(function MathematicianLinkLayer({ layout, selectedId, onSelect }: Props) {
  const { t } = useLang();
  const { mathematicianById, mathematicianLinksById } = useData();

  const origin = selectedId ? layout.childPos.get(selectedId) : undefined;
  const selectedLinks = selectedId ? (mathematicianLinksById[selectedId] ?? []) : [];

  return (
    <>
      {origin && selectedLinks.length > 0 && (
        <g className="mlinks">
          {selectedLinks.map((l) => {
            const otherId = l.source === selectedId ? l.target : l.source;
            const target = layout.childPos.get(otherId);
            const fm = mathematicianById[otherId];
            if (!target || !fm || target.kind !== 'mathematician') return null;
            const { d, midX, midY } = arcPath(origin, target);
            return (
              <g key={`${l.source}|${l.target}|${l.kind}`} className={`mlink-group mlink-${l.kind}`}>
                <path className="mlink" d={d} />
                <circle className="mlink-dot" cx={target.x} cy={target.y} r={4} />
                <text className="mlink-label" x={midX} y={midY} dy="-0.5em" textAnchor="middle">
                  {t(MATHEMATICIAN_LINK_KIND_I18N[l.kind])} — {fm.name}
                </text>
                <path
                  className="link-hit"
                  d={d}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ kind: 'mathematician', id: otherId });
                  }}
                >
                  <title>
                    {t(MATHEMATICIAN_LINK_KIND_I18N[l.kind])} — {fm.name} · {l.note}
                  </title>
                </path>
              </g>
            );
          })}
        </g>
      )}
    </>
  );
});
