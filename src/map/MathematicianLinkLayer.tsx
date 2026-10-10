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

/**
 * Arcs mathématicien ↔ mathématicien : tracés uniquement quand un·e mathématicien·ne est
 * sélectionné·e, entre son marqueur et ceux des mathématicien·nes lié·es, quel que soit
 * leur territoire. Cliquer un arc navigue vers la figure reliée.
 */
export const MathematicianLinkLayer = memo(function MathematicianLinkLayer({ layout, selectedId, onSelect }: Props) {
  const { t } = useLang();
  const { mathematicianById, mathematicianLinksById } = useData();
  if (!selectedId) return null;
  const origin = layout.childPos.get(selectedId);
  const links = mathematicianLinksById[selectedId] ?? [];
  if (!origin || links.length === 0) return null;
  return (
    <g className="mlinks">
      {links.map((l) => {
        const otherId = l.source === selectedId ? l.target : l.source;
        const target = layout.childPos.get(otherId);
        const fm = mathematicianById[otherId];
        if (!target || !fm || target.kind !== 'mathematician') return null;
        const dx = target.x - origin.x;
        const dy = target.y - origin.y;
        const d = Math.hypot(dx, dy) || 1;
        const bend = Math.min(0.16 * d, 300);
        const cx = (origin.x + target.x) / 2 - (dy / d) * bend;
        const cy = (origin.y + target.y) / 2 + (dx / d) * bend;
        const path = `M ${origin.x} ${origin.y} Q ${cx} ${cy} ${target.x} ${target.y}`;
        // milieu de la courbe de Bézier quadratique (t = 0,5)
        const midX = 0.25 * origin.x + 0.5 * cx + 0.25 * target.x;
        const midY = 0.25 * origin.y + 0.5 * cy + 0.25 * target.y;
        return (
          <g key={`${l.source}|${l.target}|${l.kind}`} className={`mlink-group mlink-${l.kind}`}>
            <path className="mlink" d={path} />
            <circle className="mlink-dot" cx={target.x} cy={target.y} r={4} />
            <text className="mlink-label" x={midX} y={midY} dy="-0.5em" textAnchor="middle">
              {t(MATHEMATICIAN_LINK_KIND_I18N[l.kind])} — {fm.name}
            </text>
            <path
              className="link-hit"
              d={path}
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
  );
});
