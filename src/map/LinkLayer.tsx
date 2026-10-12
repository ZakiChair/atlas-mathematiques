import { memo, useMemo, type CSSProperties } from 'react';
import type { Link } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';
import { computeLinkGeometries, isTransversal } from './links';
import type { AtlasLayout } from './layout';
import type { Filters, VisionId } from '../state/store';
import { linkKey, type Chain } from './upstream';
import { DOWNSTREAM_INK, LINK_INK, UPSTREAM_INK } from './fieldColors';

const DEG = 180 / Math.PI;
/** contre-échelle : la géométrie dessinée reste en pixels écran */
const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box' } as const;
/** opacité d'un courant du bassin selon la génération de son bout le plus lointain */
const CHAIN_OPACITY = [1, 1, 0.74, 0.54, 0.4];

interface Props {
  layout: AtlasLayout;
  filters: Filters;
  vision: VisionId;
  dimmedIds: Set<string>;
  selectedDomainId: string | null;
  hoveredDomainId: string | null;
  chain: Chain | null;
  onLinkClick: (link: Link, pos: { x: number; y: number }) => void;
}

/**
 * Liens entre domaines, lus comme les traits d'une généalogie : l'encre va du
 * pâle (origine) au plein (arrivée), la pointe marque l'arrivée. La filiation
 * est un trait plein à pointe pleine, l'influence un trait plus fin à pointe
 * ouverte, l'affinité un pointillé sans sens, la rupture une sanguine barrée.
 * Les interprétations sont tiretées ; les faits, continus.
 */
export const LinkLayer = memo(function LinkLayer({ layout, filters, vision, dimmedIds, selectedDomainId, hoveredDomainId, chain, onLinkClick }: Props) {
  const { t } = useLang();
  const { links } = useData();
  const geoms = useMemo(() => computeLinkGeometries(links, layout.byId, layout.territories), [layout, links]);
  // les liens localisés sont des copies : on compare par clé
  const upKeys = useMemo(() => new Set(chain ? [...chain.upstreamLinks].map(linkKey) : []), [chain]);
  const downKeys = useMemo(() => new Set(chain ? [...chain.downstreamLinks].map(linkKey) : []), [chain]);

  const focusId = selectedDomainId ?? hoveredDomainId;
  const layerCls = `links-layer layer vision-${vision}${selectedDomainId ? ' has-selection' : hoveredDomainId ? ' has-hover' : ''}`;

  return (
    <g className={layerCls}>
      <defs>
        {geoms.map((g, i) => (
          <linearGradient key={i} id={`lg-${i}`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
            <stop offset="0" stopColor={LINK_INK[g.link.kind]} stopOpacity={0.28} />
            <stop offset="0.6" stopColor={LINK_INK[g.link.kind]} stopOpacity={0.8} />
            <stop offset="1" stopColor={LINK_INK[g.link.kind]} stopOpacity={1} />
          </linearGradient>
        ))}
      </defs>
      {geoms.map((g, i) => {
        const l = g.link;
        const key = linkKey(l);
        const inUp = upKeys.has(key);
        const inDown = downKeys.has(key);
        const inChain = inUp || inDown;
        // vision « filiations & ruptures » : on ne garde que les généalogies et les ruptures (et le bassin choisi)
        if (vision === 'filiations' && l.kind !== 'filiation' && l.kind !== 'reaction' && !inChain) return null;
        if (!filters.linkKinds[l.kind]) return null;
        if (dimmedIds.has(l.source) || dimmedIds.has(l.target)) return null;
        const transversal = isTransversal(l);
        if (filters.transversalOnly && !transversal && !inChain) return null;
        const factsDim = filters.factsOnly && l.epistemic === 'interpretation';
        const isSel = selectedDomainId !== null && (l.source === selectedDomainId || l.target === selectedDomainId);
        const isHover = !isSel && focusId !== null && (l.source === focusId || l.target === focusId);
        const groupCls = `link-group kind-${l.kind} epi-${l.epistemic}${transversal ? ' transversal' : ''}${factsDim ? ' facts-dim' : ''}${
          isSel ? ' selected-link' : ''
        }${isHover ? ' hover-link' : ''}${inUp ? ' chain-link chain-up' : ''}${inDown ? ' chain-link chain-down' : ''}`;
        const gen = inUp ? (chain?.upstream.get(l.source) ?? 1) : inDown ? (chain?.downstream.get(l.target) ?? 1) : 0;
        const style = inChain ? ({ '--chain-o': String(CHAIN_OPACITY[Math.min(gen, 4)]) } as CSSProperties) : undefined;
        const ink = inUp ? UPSTREAM_INK : inDown ? DOWNSTREAM_INK : LINK_INK[l.kind];
        // sens de lecture : toute transmission et toute rupture portent une pointe ; l'affinité n'a pas de sens
        const arrow = l.kind === 'affinite' ? null : l.kind === 'influence' && !inChain ? 'open' : 'full';
        return (
          <g key={key} className={groupCls} style={style}>
            <path className={`link link-${l.kind}`} d={g.d} stroke={`url(#lg-${i})`} />
            {arrow && (
              <g transform={`translate(${g.x2} ${g.y2}) rotate(${g.endAngle * DEG})`}>
                {arrow === 'full' ? (
                  <path className="arrow-full" d="M0 0 L-11 -4.5 L-11 4.5 Z" fill={ink} style={{ ...counterScale, transformOrigin: '100% 50%' }} />
                ) : (
                  <path
                    className="arrow-open"
                    d="M-10 -5 L0 0 L-10 5"
                    fill="none"
                    stroke={ink}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ ...counterScale, transformOrigin: '100% 50%' }}
                  />
                )}
              </g>
            )}
            {/* barre perpendiculaire des ruptures (≈14 px écran) */}
            {l.kind === 'reaction' && (
              <g transform={`translate(${g.mid.x} ${g.mid.y}) rotate(${(g.midAngle + Math.PI / 2) * DEG})`}>
                <line
                  x1={0}
                  y1={-7}
                  x2={0}
                  y2={7}
                  stroke={LINK_INK.reaction}
                  strokeWidth={3}
                  strokeLinecap="round"
                  style={{ ...counterScale, transformOrigin: '50% 50%' }}
                />
              </g>
            )}
            {/* libellé au milieu de la courbe, uniquement pour les liens du domaine sélectionné */}
            {isSel && (
              <text className="link-label" x={g.mid.x} y={g.mid.y} dy="-0.6em" textAnchor="middle" fill={ink}>
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
