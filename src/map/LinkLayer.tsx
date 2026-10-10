import { memo, useMemo } from 'react';
import type { Link, LinkKind } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';
import { linkGeometry, isTransversal, type LinkGeometry } from './links';
import type { AtlasLayout } from './layout';
import type { Filters, VisionId } from '../state/store';

const DEG = 180 / Math.PI;
/** contre-échelle : la géométrie dessinée reste en pixels écran */
const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box' } as const;

interface Props {
  layout: AtlasLayout;
  filters: Filters;
  vision: VisionId;
  dimmedIds: Set<string>;
  selectedDomainId: string | null;
  hoveredDomainId: string | null;
  onLinkClick: (link: Link, pos: { x: number; y: number }) => void;
}

const ARROW_COLOR: Record<LinkKind, string> = {
  filiation: '#e8c76a',
  influence: '#9fc8e0',
  affinite: '#c9a0ff',
  reaction: '#ff7a5c',
};

export const LinkLayer = memo(function LinkLayer({ layout, filters, vision, dimmedIds, selectedDomainId, hoveredDomainId, onLinkClick }: Props) {
  const { t } = useLang();
  const { links } = useData();
  const geoms = useMemo(() => {
    const out: LinkGeometry[] = [];
    for (const l of links) {
      const a = layout.byId.get(l.source);
      const b = layout.byId.get(l.target);
      if (a && b) out.push(linkGeometry(l, a, b));
    }
    return out;
  }, [layout, links]);

  const focusId = selectedDomainId ?? hoveredDomainId;
  const layerCls = `links-layer layer vision-${vision}${selectedDomainId ? ' has-selection' : hoveredDomainId ? ' has-hover' : ''}`;

  return (
    <g className={layerCls}>
      {geoms.map((g) => {
        const l = g.link;
        // vision « filiations & ruptures » : on ne garde que les généalogies et les ruptures
        if (vision === 'filiations' && l.kind !== 'filiation' && l.kind !== 'reaction') return null;
        if (!filters.linkKinds[l.kind]) return null;
        if (dimmedIds.has(l.source) || dimmedIds.has(l.target)) return null;
        const transversal = isTransversal(l);
        if (filters.transversalOnly && !transversal) return null;
        const factsDim = filters.factsOnly && l.epistemic === 'interpretation';
        const isSel = selectedDomainId !== null && (l.source === selectedDomainId || l.target === selectedDomainId);
        const isHover = !isSel && focusId !== null && (l.source === focusId || l.target === focusId);
        const groupCls = `link-group${transversal ? ' transversal' : ''}${factsDim ? ' facts-dim' : ''}${isSel ? ' selected-link' : ''}${isHover ? ' hover-link' : ''}`;
        const hasArrow = l.kind === 'influence' || l.kind === 'reaction';
        return (
          <g key={`${l.source}|${l.target}|${l.kind}`} className={groupCls}>
            <path className={`link link-${l.kind}`} d={g.d} />
            {/* pointe de flèche dessinée (≈11 px écran), origine = pointe sur le bord cible */}
            {hasArrow && (
              <g transform={`translate(${g.x2} ${g.y2}) rotate(${g.endAngle * DEG})`}>
                <path d="M0 0 L-11 -4.5 L-11 4.5 Z" fill={ARROW_COLOR[l.kind]} style={{ ...counterScale, transformOrigin: '100% 50%' }} />
              </g>
            )}
            {/* barre perpendiculaire des ruptures (≈14 px écran) */}
            {l.kind === 'reaction' && (
              <g transform={`translate(${g.mid.x} ${g.mid.y}) rotate(${(g.midAngle + Math.PI / 2) * DEG})`}>
                <line x1={0} y1={-7} x2={0} y2={7} stroke="#ff7a5c" strokeWidth={3} strokeLinecap="round" style={{ ...counterScale, transformOrigin: '50% 50%' }} />
              </g>
            )}
            {/* libellé au milieu de la courbe, uniquement pour les liens du domaine sélectionné */}
            {isSel && (
              <text className="link-label" x={g.mid.x} y={g.mid.y} dy="-0.6em" textAnchor="middle" fill={ARROW_COLOR[l.kind]}>
                {t(LINK_KIND_I18N[l.kind])} — {l.label}
              </text>
            )}
            <path
              className="link-hit"
              d={g.d}
              onClick={(e) => {
                e.stopPropagation();
                onLinkClick(l, { x: e.clientX, y: e.clientY });
              }}
            >
              <title>
                {t(LINK_KIND_I18N[l.kind])} — {l.label}
              </title>
            </path>
          </g>
        );
      })}
    </g>
  );
});
