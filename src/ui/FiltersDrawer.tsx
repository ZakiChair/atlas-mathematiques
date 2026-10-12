import { X, RotateCcw } from 'lucide-react';
import { TIME_BOUNDS, DOMAINS } from '../data';
import type { ContinentId } from '../data/types';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';
import { formatYear } from '../lib/years';


export function FiltersDrawer({ visibleCount }: { visibleCount: number }) {
  const { state, dispatch } = useStore();
  const { t, lang } = useLang();
  const { eras, continents } = useData();
  const { filters, ui } = state;
  if (!ui.filtersOpen) return null;

  const [start, end] = filters.period;

  return (
    <aside className="glass fixed top-20 right-4 w-80 max-h-[calc(100%-7rem)] overflow-auto panel-scroll p-4 z-[45]" aria-label={t('filters.title')}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title-sm">{t('filters.title')}</h2>
        <button aria-label={t('filters.close')} className="p-1 hover:bg-ink/8 rounded" onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })}>
          <X size={16} />
        </button>
      </div>

      <section className="mb-4">
        <h3 className="section-title-sm mb-2">
          {t('filters.period', { start: formatYear(start, lang), end: formatYear(end, lang) })}
        </h3>
        <div className="flex flex-col gap-1" data-testid="period-filter">
          <label className="text-xs text-muted flex justify-between">
            {t('filters.start')}
            <input
              type="range"
              min={TIME_BOUNDS.start}
              max={TIME_BOUNDS.end}
              value={start}
              aria-label={t('filters.startYear')}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), end);
                dispatch({ type: 'set-period', period: [v, end] });
              }}
              className="w-40 accent-[#1f4e79]"
            />
          </label>
          <label className="text-xs text-muted flex justify-between">
            {t('filters.end')}
            <input
              type="range"
              min={TIME_BOUNDS.start}
              max={TIME_BOUNDS.end}
              value={end}
              aria-label={t('filters.endYear')}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), start);
                dispatch({ type: 'set-period', period: [start, v] });
              }}
              className="w-40 accent-[#1f4e79]"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {eras.map((e) => {
            const eraEnd = e.period.end ?? TIME_BOUNDS.end;
            const active = start === e.period.start && end === eraEnd;
            return (
              <button
                key={e.id}
                className={`chip ${active ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'set-period', period: [e.period.start, eraEnd] })}
              >
                {e.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-4">
        <h3 className="section-title-sm mb-2">{t('filters.continents')}</h3>
        <div className="flex flex-wrap gap-1.5">
          {continents.map((r) => {
            const active = filters.continents.includes(r.id);
            return (
              <button key={r.id} className={`chip ${active ? 'active' : ''}`} onClick={() => dispatch({ type: 'toggle-continent', continent: r.id })}>
                {r.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-4">
        <h3 className="section-title-sm mb-2">{t('filters.links')}</h3>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('filters.links')} data-testid="links-mode">
          <button
            role="radio"
            aria-checked={!filters.allLinks}
            className={`chip ${!filters.allLinks ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'set-all-links', allLinks: false })}
          >
            {t('filters.links.principal')}
          </button>
          <button
            role="radio"
            aria-checked={filters.allLinks}
            className={`chip ${filters.allLinks ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'set-all-links', allLinks: true })}
          >
            {t('filters.links.all')}
          </button>
        </div>
        <p className="text-xs text-muted mt-1.5">{t('filters.links.hint')}</p>
      </section>

      <section className="mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.factsOnly}
            onChange={() => dispatch({ type: 'toggle-facts-only' })}
            className="accent-[#2e6b46]"
            data-testid="facts-only"
          />
          {t('filters.factsOnly')}
        </label>
      </section>

      <div className="flex items-center justify-between border-t border-ink/10 pt-3">
        <span className="text-xs text-muted">{t('filters.visible', { n: visibleCount, s: visibleCount > 1 ? 's' : '' })}</span>
        <button className="chip" onClick={() => dispatch({ type: 'reset-filters' })}>
          <RotateCcw size={12} /> {t('filters.reset')}
        </button>
      </div>
    </aside>
  );
}

/** Calcule l'ensemble des domaines estompés par les filtres. */
export function computeDimmed(filters: { period: [number, number]; continents: ContinentId[] }): Set<string> {
  const [start, end] = filters.period;
  const set = new Set<string>();
  for (const m of DOMAINS) {
    const mEnd = m.period.end ?? TIME_BOUNDS.end;
    const periodOk = m.period.start <= end && mEnd >= start;
    const continentOk = filters.continents.length === 0 || m.continents.some((r) => filters.continents.includes(r));
    if (!periodOk || !continentOk) set.add(m.id);
  }
  return set;
}
