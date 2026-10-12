import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import type { NodeKind, ContinentId } from '../data/types';
import { TIME_BOUNDS } from '../data/eras';

export interface Selection {
  kind: NodeKind;
  id: string;
}

export interface Filters {
  period: [number, number];
  continents: ContinentId[];
  factsOnly: boolean;
  /** Tous les liens de transmission et de rupture, au lieu des seules lignées principales. */
  allLinks: boolean;
}

export interface UiState {
  filtersOpen: boolean;
  legendOpen: boolean;
  methodOpen: boolean;
  introSeen: boolean;
}

export interface AtlasState {
  selection: Selection | null;
  filters: Filters;
  ui: UiState;
}

export type Action =
  | { type: 'select'; selection: Selection | null }
  | { type: 'set-period'; period: [number, number] }
  | { type: 'toggle-continent'; continent: ContinentId }
  | { type: 'set-continents'; continents: ContinentId[] }
  | { type: 'toggle-facts-only' }
  | { type: 'set-all-links'; allLinks: boolean }
  | { type: 'reset-filters' }
  | { type: 'toggle-ui'; key: 'filtersOpen' | 'legendOpen' | 'methodOpen' }
  | { type: 'close-ui' }
  | { type: 'intro-seen' };

/** v2 : la refonte « Galerie » remontre l'introduction une fois. */
const INTRO_KEY = 'atlas.intro.v2';

const DEFAULT_FILTERS: Filters = {
  period: [TIME_BOUNDS.start, TIME_BOUNDS.end],
  continents: [],
  factsOnly: false,
  allLinks: false,
};

export function initialState(): AtlasState {
  let introSeen = false;
  try {
    introSeen = typeof localStorage !== 'undefined' && localStorage.getItem(INTRO_KEY) === '1';
  } catch {
    /* stockage indisponible : l'introduction s'affiche */
  }
  return {
    selection: null,
    filters: DEFAULT_FILTERS,
    ui: { filtersOpen: false, legendOpen: false, methodOpen: false, introSeen },
  };
}

export function reducer(state: AtlasState, action: Action): AtlasState {
  switch (action.type) {
    case 'select':
      return { ...state, selection: action.selection };
    case 'set-period':
      return { ...state, filters: { ...state.filters, period: action.period } };
    case 'toggle-continent': {
      const has = state.filters.continents.includes(action.continent);
      const continents = has
        ? state.filters.continents.filter((r) => r !== action.continent)
        : [...state.filters.continents, action.continent];
      return { ...state, filters: { ...state.filters, continents } };
    }
    case 'set-continents':
      return { ...state, filters: { ...state.filters, continents: action.continents } };
    case 'toggle-facts-only':
      return { ...state, filters: { ...state.filters, factsOnly: !state.filters.factsOnly } };
    case 'set-all-links':
      return { ...state, filters: { ...state.filters, allLinks: action.allLinks } };
    case 'reset-filters':
      return { ...state, filters: DEFAULT_FILTERS };
    case 'toggle-ui':
      return { ...state, ui: { ...state.ui, [action.key]: !state.ui[action.key] } };
    case 'close-ui':
      return { ...state, ui: { ...state.ui, filtersOpen: false, legendOpen: false, methodOpen: false } };
    case 'intro-seen': {
      try {
        localStorage.setItem(INTRO_KEY, '1');
      } catch {
        /* ignore */
      }
      return { ...state, ui: { ...state.ui, introSeen: true } };
    }
    default:
      return state;
  }
}

interface Store {
  state: AtlasState;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore hors de StoreProvider');
  return s;
}
