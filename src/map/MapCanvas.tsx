import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as d3 from 'd3';
import { MAP_SIZE } from '../data';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';
import type { Link } from '../data/types';
import type { AtlasLayout, TerritoryLayout } from './layout';
import { GalleryBackdrop } from './GalleryBackdrop';
import { Territory } from './Territory';
import { LinkLayer } from './LinkLayer';
import { MathematicianLinkLayer } from './MathematicianLinkLayer';
import { LabelLayer } from './LabelLayer';
import type { MapController, Bounds, ViewportInset } from './controller';
import type { Filters, Selection } from '../state/store';
import type { Chain } from './upstream';
import { domainOf } from './bounds';
import { LEVEL_K, levelFor, publishView } from './viewStore';

export { LEVEL_K, levelFor };

/** zooms absolus visés par les boutons de niveau (le niveau 0 = ajustement) */
const LEVEL_TARGET_K = [0, 0.6, 1.36, 2.4];

/** Vue d'ensemble : la carte centrée dans la bande libre entre les insets haut et bas. */
function fitTransform(svgEl: SVGSVGElement, k: number, inset: { top: number; bottom: number }): d3.ZoomTransform {
  const w = svgEl.clientWidth;
  const h = svgEl.clientHeight;
  const free = Math.max(50, h - inset.top - inset.bottom);
  return d3.zoomIdentity.translate(w / 2 - (k * MAP_SIZE.width) / 2, inset.top + free / 2 - (k * MAP_SIZE.height) / 2).scale(k);
}

interface Props {
  layout: AtlasLayout;
  filters: Filters;
  dimmedIds: Set<string>;
  selection: Selection | null;
  relatedIds: Set<string>;
  /** amont et aval du domaine de la sélection */
  chain: Chain | null;
  /** bandes d'écran occupées par l'interface (barre du haut, frise du bas) : la vue d'ensemble s'ajuste entre elles */
  fitInset: { top: number; bottom: number };
  onSelect: (sel: Selection | null, fly: boolean) => void;
  onLinkClick: (link: Link, pos: { x: number; y: number }) => void;
  controllerRef: MutableRefObject<MapController | null>;
  onLevelChange: (level: number) => void;
  onReady: (controller: MapController) => void;
}

export function MapCanvas({
  layout,
  filters,
  dimmedIds,
  selection,
  relatedIds,
  chain,
  fitInset,
  onSelect,
  onLinkClick,
  controllerRef,
  onLevelChange,
  onReady,
}: Props) {
  const { t } = useLang();
  const { domainById } = useData();
  const svgRef = useRef<SVGSVGElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const kFitRef = useRef(1);
  const levelRef = useRef(0);
  const insetRef = useRef(fitInset);
  insetRef.current = fitInset;
  const refitRef = useRef<() => void>(() => {});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const onHover = useCallback((id: string | null) => setHoveredId(id), []);

  // ——— zoom d3 ———
  useEffect(() => {
    const svgEl = svgRef.current!;
    const worldEl = worldRef.current!;
    const svg = d3.select(svgEl);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const computeFit = () => {
      const w = svgEl.clientWidth || 1;
      const h = Math.max(50, (svgEl.clientHeight || 1) - insetRef.current.top - insetRef.current.bottom);
      return Math.min(w / MAP_SIZE.width, h / MAP_SIZE.height);
    };

    const publish = (t: d3.ZoomTransform) =>
      publishView({ k: t.k, x: t.x, y: t.y, width: svgEl.clientWidth, height: svgEl.clientHeight });

    const setLevel = (k: number) => {
      const lvl = levelFor(k);
      // --k = k absolu (px par unité carte) : les calc(Xpx/var(--k)) sont constants à l'écran
      svgEl.style.setProperty('--k', String(k));
      if (lvl !== levelRef.current) {
        levelRef.current = lvl;
        svgEl.setAttribute('data-level', String(lvl));
        onLevelChange(lvl);
      }
    };

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 60])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        worldEl.setAttribute('transform', event.transform.toString());
        setLevel(event.transform.k);
        publish(event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const fit = () => {
      kFitRef.current = computeFit();
      const k = kFitRef.current;
      zoom.scaleExtent([0.5 * k, 30 * k]);
      return fitTransform(svgEl, k, insetRef.current);
    };

    const t0 = fit();
    svg.call(zoom.transform, t0);
    if (!reduced) {
      // courte animation d'approche depuis un peu plus loin
      svg.call(zoom.transform, t0.scale(0.82));
      svg
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, t0);
    }

    const refit = () => {
      kFitRef.current = computeFit();
      zoom.scaleExtent([0.5 * kFitRef.current, 30 * kFitRef.current]);
    };
    refitRef.current = refit;

    const ro = new ResizeObserver(() => {
      refit();
      const t = d3.zoomTransform(svgEl);
      setLevel(t.k);
      publish(t);
    });
    ro.observe(svgEl);

    // fond : clic = désélection
    const onBgClick = (e: MouseEvent) => {
      if (e.target === svgEl) onSelect(null, false);
    };
    svgEl.addEventListener('click', onBgClick);

    return () => {
      ro.disconnect();
      svgEl.removeEventListener('click', onBgClick);
      svg.on('.zoom', null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // la frise (ou la barre du haut) change de hauteur : nouvel ajustement de référence
  useEffect(() => {
    refitRef.current();
  }, [fitInset.top, fitInset.bottom]);

  // ——— contrôleur exposé ———
  useEffect(() => {
    const svgEl = svgRef.current!;
    controllerRef.current = {
      zoomToBounds(bounds: Bounds, fill = 0.6, duration = 900, inset?: ViewportInset, maxK?: number) {
        const zoom = zoomRef.current!;
        const w = svgEl.clientWidth;
        const h = svgEl.clientHeight;
        const il = inset?.left ?? 0;
        const ir = inset?.right ?? 0;
        const it = inset?.top ?? 0;
        const ib = inset?.bottom ?? 0;
        const vw = Math.max(50, w - il - ir);
        const vh = Math.max(50, h - it - ib);
        const bw = Math.max(1, bounds.x1 - bounds.x0);
        const bh = Math.max(1, bounds.y1 - bounds.y0);
        let k = (fill * Math.min(vw, vh)) / Math.max(bw, bh);
        const [kmin, kmax] = zoom.scaleExtent();
        // plafond optionnel (ex. ne pas dépasser le niveau « Théories »)
        if (maxK) k = Math.min(k, maxK);
        k = Math.min(kmax, Math.max(kmin, k));
        const cx = (bounds.x0 + bounds.x1) / 2;
        const cy = (bounds.y0 + bounds.y1) / 2;
        const tx = il + vw / 2 - k * cx;
        const ty = it + vh / 2 - k * cy;
        const t = d3.zoomIdentity.translate(tx, ty).scale(k);
        d3.select(svgEl).transition().duration(duration).ease(d3.easeCubicInOut).call(zoom.transform, t);
      },
      zoomToLevel(level: number, duration = 700) {
        const zoom = zoomRef.current!;
        const k = level === 0 ? kFitRef.current : LEVEL_TARGET_K[level];
        const cur = d3.zoomTransform(svgEl);
        const cx = (svgEl.clientWidth / 2 - cur.x) / cur.k;
        const cy = (svgEl.clientHeight / 2 - cur.y) / cur.k;
        const t = d3.zoomIdentity.translate(svgEl.clientWidth / 2 - k * cx, svgEl.clientHeight / 2 - k * cy).scale(k);
        d3.select(svgEl).transition().duration(duration).ease(d3.easeCubicInOut).call(zoom.transform, t);
      },
      reset(duration = 800) {
        const zoom = zoomRef.current!;
        const t = fitTransform(svgEl, kFitRef.current, insetRef.current);
        d3.select(svgEl).transition().duration(duration).ease(d3.easeCubicInOut).call(zoom.transform, t);
      },
      panToX(x: number, duration = 450) {
        const zoom = zoomRef.current!;
        const cur = d3.zoomTransform(svgEl);
        const t = d3.zoomIdentity.translate(svgEl.clientWidth / 2 - cur.k * x, cur.y).scale(cur.k);
        if (duration <= 0) d3.select(svgEl).interrupt().call(zoom.transform, t);
        else d3.select(svgEl).transition().duration(duration).ease(d3.easeCubicOut).call(zoom.transform, t);
      },
      getLevel: () => levelRef.current,
    };
    onReady(controllerRef.current);
    return () => {
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controllerRef]);

  const handleSelect = useCallback(
    (kind: Selection['kind'], id: string, _terr: TerritoryLayout) => {
      // fly-to délégué à App : territoire au niveau 0 et tout enfant → vol ;
      // territoire déjà zoomé (niveau ≥ 1) → sélection seule.
      const fly = kind !== 'domain' || levelRef.current === 0;
      onSelect({ kind, id }, fly);
    },
    [onSelect],
  );

  const selectedDomainId = selection ? domainOf(selection) : null;
  const selectedChildId = selection && selection.kind !== 'domain' ? selection.id : undefined;

  const worldClass = `world${selection ? ' dim-others' : ''}`;
  // domaines restés vifs pendant une sélection : le domaine choisi, ses voisins, son amont et son aval
  const vividDomainIds = selectedDomainId
    ? new Set([selectedDomainId, ...relatedIds, ...(chain?.upstream.keys() ?? []), ...(chain?.downstream.keys() ?? [])])
    : null;

  return (
    <svg ref={svgRef} className="atlas-map" data-level="0" role="application" aria-label={t('map.aria')}>
      <g ref={worldRef} className={worldClass}>
        <GalleryBackdrop />
        <LinkLayer
          layout={layout}
          filters={filters}
          dimmedIds={dimmedIds}
          selectedDomainId={selectedDomainId}
          hoveredDomainId={hoveredId}
          chain={chain}
          onLinkClick={onLinkClick}
        />
        <MathematicianLinkLayer
          layout={layout}
          selectedId={selection?.kind === 'mathematician' ? selection.id : null}
          onSelect={(sel) => onSelect(sel, true)}
        />
        {layout.territories.map((t) => {
          const m = domainById[t.id];
          if (!m) return null;
          return (
            <Territory
              key={t.id}
              domain={m}
              layout={t}
              selected={selectedDomainId === t.id}
              selectedChildId={selectedChildId}
              dimmed={dimmedIds.has(t.id)}
              related={relatedIds.has(t.id)}
              upGen={chain?.upstream.get(t.id) ?? 0}
              downGen={chain?.downstream.get(t.id) ?? 0}
              onSelect={handleSelect}
              onHover={onHover}
            />
          );
        })}
        <LabelLayer
          layout={layout}
          selection={selection}
          dimmedIds={dimmedIds}
          vividDomainIds={vividDomainIds}
          onSelect={(sel) => onSelect(sel, true)}
        />
      </g>
    </svg>
  );
}
