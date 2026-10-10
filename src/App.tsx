import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DOMAINS } from './data';
import type { Link } from './data/types';
import { computeLayout } from './map/layout';
import { MapCanvas, LEVEL_K } from './map/MapCanvas';
import { EdgeLabels } from './map/EdgeLabels';
import { boundsFor, domainOf } from './map/bounds';
import type { MapController } from './map/controller';
import { StoreProvider, useStore, type Selection } from './state/store';
import { parseHash, hashFor } from './lib/router';
import { ATLAS_NODES } from './data/nodes';
import { TopBar } from './ui/TopBar';
import { FiltersDrawer, computeDimmed } from './ui/FiltersDrawer';
import { Legend } from './ui/Legend';
import { MethodModal } from './ui/MethodModal';
import { IntroOverlay } from './ui/IntroOverlay';
import { Panel } from './ui/Panel';
import { ZoomControls } from './ui/ZoomControls';
import { LevelIndicator } from './ui/LevelIndicator';
import { LinkPopover, type LinkPopoverData } from './ui/LinkPopover';
import { useIsDesktop } from './ui/useIsDesktop';
import { LangProvider } from './i18n/lang';
import { useData } from './i18n/localize';

const NODE_OK = new Set(ATLAS_NODES.map((n) => `${n.kind}:${n.id}`));

function AtlasApp() {
  const { state, dispatch } = useStore();
  const data = useData();
  const controllerRef = useRef<MapController | null>(null);
  const [controller, setController] = useState<MapController | null>(null);
  const [level, setLevel] = useState(0);
  const [popover, setPopover] = useState<LinkPopoverData | null>(null);
  const layout = useMemo(() => computeLayout(DOMAINS), []);
  const lastHash = useRef<string | null>(null);
  const pendingFly = useRef<Selection | null>(null);

  const onMapReady = useCallback((c: MapController) => setController(c), []);
  const desktop = useIsDesktop();

  const flyTo = useCallback(
    (sel: Selection) => {
      const b = boundsFor(sel, layout);
      if (!b) return;
      const isDesktop = window.innerWidth >= 1024;
      // zone visible nette du panneau : 456 px à droite sur desktop, ~35 % en bas sur mobile
      const inset = isDesktop ? { right: 456 } : { bottom: Math.round(window.innerHeight * 0.35) };
      // sur mobile la sheet mange le bas : fill plus petit
      const fill = sel.kind === 'domain' ? (isDesktop ? 0.6 : 0.42) : 0.5;
      // un domaine atterrit au plus au niveau « Théories » (juste sous le seuil du niveau 2)
      const maxK = sel.kind === 'domain' ? LEVEL_K[1] - 0.08 : undefined;
      controllerRef.current?.zoomToBounds(b, fill, 900, inset, maxK);
    },
    [layout],
  );

  const navigate = useCallback(
    (sel: Selection | null, fly = true) => {
      setPopover(null);
      if (sel && fly) {
        // le contrôleur peut ne pas être prêt au tout premier rendu
        if (controllerRef.current) flyTo(sel);
        else pendingFly.current = sel;
      }
      dispatch({ type: 'select', selection: sel });
    },
    [dispatch, flyTo],
  );

  // À chaque (re)montage de la carte, vole vers la sélection courante : consomme un
  // fly-to en attente (sélection initiale via URL) et résiste au double montage
  // de StrictMode, qui réinitialise le zoom après le premier vol.
  const selectionRef = useRef(state.selection);
  selectionRef.current = state.selection;
  useEffect(() => {
    if (!controller) return;
    const sel = pendingFly.current ?? selectionRef.current;
    pendingFly.current = null;
    if (sel) flyTo(sel);
  }, [controller, flyTo]);

  // hash → sélection (chargement + hashchange)
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash;
      if (h === lastHash.current) return;
      lastHash.current = h;
      const parsed = parseHash(h);
      if (parsed && NODE_OK.has(`${parsed.kind}:${parsed.id}`)) {
        navigate(parsed, true);
      } else if (!parsed) {
        dispatch({ type: 'select', selection: null });
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [navigate, dispatch]);

  // sélection → hash
  useEffect(() => {
    const h = state.selection ? hashFor(state.selection.kind, state.selection.id) : '#/';
    if (window.location.hash !== h) {
      lastHash.current = h;
      history.replaceState(null, '', h);
    }
  }, [state.selection]);

  const dimmedIds = useMemo(() => computeDimmed(state.filters), [state.filters]);
  const visibleCount = data.domains.length - dimmedIds.size;

  const relatedIds = useMemo(() => {
    const set = new Set<string>();
    if (!state.selection) return set;
    const mid = domainOf(state.selection);
    if (!mid) return set;
    for (const l of data.links) {
      if (l.source === mid) set.add(l.target);
      if (l.target === mid) set.add(l.source);
    }
    return set;
  }, [state.selection, data.links]);

  const onLinkClick = useCallback((link: Link, pos: { x: number; y: number }) => {
    setPopover({ link, x: pos.x, y: pos.y });
  }, []);

  return (
    <>
      <div className="atlas-bg" />
      <MapCanvas
        layout={layout}
        filters={state.filters}
        dimmedIds={dimmedIds}
        selection={state.selection}
        relatedIds={relatedIds}
        onSelect={navigate}
        onLinkClick={onLinkClick}
        controllerRef={controllerRef}
        onLevelChange={setLevel}
        onReady={onMapReady}
      />
      <EdgeLabels />
      <TopBar onNavigate={navigate} />
      <FiltersDrawer visibleCount={visibleCount} />
      <Legend />
      <MethodModal />
      <Panel nav={(sel) => navigate(sel, true)} />
      {popover && (
        <LinkPopover data={popover} onClose={() => setPopover(null)} onGo={(id) => navigate({ kind: 'domain', id }, true)} />
      )}
      {/* au-dessus de la gouttière des ères (48 px) ; à gauche du panneau quand il est ouvert */}
      <div
        className={`fixed z-40 ${
          state.selection ? (desktop ? 'right-[476px] bottom-[60px]' : 'right-4 top-32') : 'right-4 bottom-[60px]'
        }`}
      >
        <ZoomControls controller={controller} />
      </div>
      {(desktop || !state.selection) && (
        <div className="fixed bottom-[60px] left-4 z-40">
          <LevelIndicator level={level} controller={controller} />
        </div>
      )}
      <IntroOverlay />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <StoreProvider>
        <AtlasApp />
      </StoreProvider>
    </LangProvider>
  );
}
