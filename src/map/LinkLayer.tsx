import { memo, useMemo, type CSSProperties } from 'react';
import type { Link } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';
import { computeLinkGeometries } from './links';
import type { AtlasLayout } from './layout';
import type { Filters } from '../state/store';
import { linkKey, type Chain } from './upstream';
import { defaultLinkKeys } from './lineage';
import { DOWNSTREAM_INK, RUPTURE_INK, TRANSMISSION_INK, UPSTREAM_INK } from './fieldColors';

const DEG = 180 / Math.PI;
/** contre-échelle : la géométrie dessinée reste en pixels écran */
const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box' } as const;
/** opacité d'un lien de l'amont ou de l'aval selon la génération de son bout le plus lointain */
const CHAIN_OPACITY = [1, 1, 0.74, 0.54, 0.4];

interface Props {
  layout: AtlasLayout;
  filters: Filters;
  dimmedIds: Set<string>;
  selectedDomainId: string | null;
  hoveredDomainId: string | null;
  chain: Chain | null;
  onLinkClick: (link: Link, pos: { x: number; y: number }) => void;
}

/**
 * Liens entre domaines, en deux styles seulement : la transmission (filiation
 * ou influence, trait d'encre et pointe) et la rupture (sanguine barrée). Par
 * défaut, seules les lignées principales (un ascendant par domaine) et les
 * ruptures sont tracées ; « Tous les liens » montre toutes les transmissions.
 * Survoler ou choisir un domaine montre tous ses liens ; le choisir colore
 * son amont (Prusse) et son aval (sépia). Les affinités ne sont pas tracées :
 * elles sont dans le panneau, avec le statut fait / interprétation.
 */
export const LinkLayer = memo(function LinkLayer({ layout, filters, dimmedIds, selectedDomainId, hoveredDomainId, chain, onLinkClick }: Props) {
  const { t } = useLang();
  const { links, domainById } = useData();
  const drawable = useMemo(() => links.filter((l) => l.kind !== 'affinite'), [links]);
  const geoms = useMemo(() => computeLinkGeometries(drawable, layout.byId, layout.territories), [layout, drawable]);
  const defaults = useMemo(() => defaultLinkKeys(links, domainById), [links, domainById]);
  // les liens localisés sont des copies : on compare par clé
  const upKeys = useMemo(() => new Set(chain ? [...chain.upstreamLinks].map(linkKey) : []), [chain]);
  const downKeys = useMemo(() => new Set(chain ? [...chain.downstreamLinks].map(linkKey) : []), [chain]);

  const focusId = selectedDomainId ?? hoveredDomainId;
  const layerCls = `links-layer layer${selectedDomainId ? ' has-selection' : hoveredDomainId ? ' has-hover' : ''}`;

  return (
    <g className={layerCls}>
      {geoms.map((g) => {
        const l = g.link;
        const key = linkKey(l);
        const inUp = upKeys.has(key);
        const inDown = downKeys.has(key);
        const inChain = inUp || inDown;
        const incident = focusId !== null && (l.source === focusId || l.target === focusId);
        const principal = defaults.has(key);
        if (!(inChain || incident || principal || filters.allLinks)) return null;
        if (dimmedIds.has(l.source) || dimmedIds.has(l.target)) return null;
        if (filters.factsOnly && l.epistemic === 'interpretation' && !inChain) return null;
        const isSel = selectedDomainId !== null && (l.source === selectedDomainId || l.target === selectedDomainId);
        const rupture = l.kind === 'reaction';
        const ink = inUp ? UPSTREAM_INK : inDown ? DOWNSTREAM_INK : rupture ? RUPTURE_INK : TRANSMISSION_INK;
        const gen = inUp ? (chain?.upstream.get(l.source) ?? 1) : inDown ? (chain?.downstream.get(l.target) ?? 1) : 0;
        const style = inChain ? ({ '--chain-o': String(CHAIN_OPACITY[Math.min(gen, 4)]) } as CSSProperties) : undefined;
        const cls = `link-group ${rupture ? 'rupture' : 'transmission'}${principal ? ' principal' : ''}${isSel ? ' selected-link' : ''}${
          !isSel && incident ? ' hover-link' : ''
        }${inChain ? ` chain-link ${inUp ? 'chain-up' : 'chain-down'}` : ''}`;
        return (
          <g key={key} className={cls} style={style} data-kind={l.kind}>
            <path className="link" d={g.d} stroke={ink} />
            {!rupture && (
              <g transform={`translate(${g.x2} ${g.y2}) rotate(${g.endAngle * DEG})`}>
                <path className="arrow" d="M0 0 L-10 -4.2 L-10 4.2 Z" fill={ink} style={{ ...counterScale, transformOrigin: '100% 50%' }} />
              </g>
            )}
            {/* barre perpendiculaire des ruptures (≈ 14 px écran) */}
            {rupture && (
              <g transform={`translate(${g.mid.x} ${g.mid.y}) rotate(${(g.midAngle + Math.PI / 2) * DEG})`}>
                <line x1={0} y1={-7} x2={0} y2={7} stroke={RUPTURE_INK} strokeWidth={3} strokeLinecap="round" style={{ ...counterScale, transformOrigin: '50% 50%' }} />
              </g>
            )}
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
