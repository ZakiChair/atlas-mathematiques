import { X } from 'lucide-react';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { LEVEL_I18N, useData } from '../i18n/localize';
import type { ResultKind } from '../data/types';
import { KindBadge } from './ResultCard';
import { DOWNSTREAM_INK, FIELD_COLORS, RUPTURE_INK, TRANSMISSION_INK, UPSTREAM_INK } from '../map/fieldColors';

const RESULT_KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];

/** Légende « Galerie » : bandes et disques, médailles, lignées, amont et aval, frise, niveaux, natures, énoncés. */
export function Legend() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const { continents } = useData();
  if (!state.ui.legendOpen) return null;
  return (
    <div
      className="glass fixed bottom-[calc(var(--frieze-h)+60px)] left-4 w-80 max-h-[calc(100dvh-var(--frieze-h)-150px)] overflow-auto panel-scroll p-4 z-40"
      role="dialog"
      aria-label={t('legend.title')}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-title-sm">{t('legend.title')}</h2>
        <button aria-label={t('legend.close')} className="p-1 hover:bg-ink/8 rounded" onClick={() => dispatch({ type: 'toggle-ui', key: 'legendOpen' })}>
          <X size={16} />
        </button>
      </div>

      <h3 className="section-title-sm mb-1.5">{t('legend.read')}</h3>
      <ul className="flex flex-wrap gap-1.5 mb-1.5">
        {continents.map((c) => (
          <li key={c.id} className="chip" style={{ background: FIELD_COLORS[c.id].band, color: FIELD_COLORS[c.id].ink }}>
            {c.shortName ?? c.name}
          </li>
        ))}
      </ul>
      <p className="text-xs text-soft mb-3">{t('legend.read.body')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.featured')}</h3>
      <svg width="100%" height="34" viewBox="0 0 280 34" aria-hidden="true" className="mb-1">
        <circle cx="17" cy="17" r="12.5" fill="none" stroke={FIELD_COLORS.analyse.medal} strokeWidth="0.9" />
        <circle cx="17" cy="17" r="10" fill={FIELD_COLORS.analyse.medal} />
        <text x="17" y="21.5" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight={600} fontSize="12" fill="#fff">
          E
        </text>
        <text x="36" y="15" fontFamily="var(--font-serif)" fontWeight={600} fontSize="13" fill="#1d1b18">
          Leonhard Euler
        </text>
        <text x="36" y="28" fontFamily="var(--font-sans)" fontSize="10" fill="#6a6357">
          Problème de Bâle : ζ(2) = π²/6 · 1735
        </text>
      </svg>
      <p className="text-xs text-soft mb-3">{t('legend.featured.body')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.lineage')}</h3>
      <ul className="space-y-1.5 mb-1.5 text-sm">
        <li className="flex items-center gap-2">
          <svg width="46" height="10" aria-hidden="true">
            <line x1="2" y1="5" x2="36" y2="5" stroke={TRANSMISSION_INK} strokeWidth={1.4} />
            <path d="M44 5 L35 1.5 L35 8.5 Z" fill={TRANSMISSION_INK} />
          </svg>
          {t('legend.transmission')}
        </li>
        <li className="flex items-center gap-2">
          <svg width="46" height="14" aria-hidden="true">
            <line x1="2" y1="7" x2="44" y2="7" stroke={RUPTURE_INK} strokeWidth={1.6} />
            <line x1="23" y1="1" x2="23" y2="13" stroke={RUPTURE_INK} strokeWidth={2.4} strokeLinecap="round" />
          </svg>
          {t('legend.rupture')}
        </li>
      </ul>
      <p className="text-xs text-soft mb-3">{t('legend.lineage.body')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.chain')}</h3>
      <svg width="100%" height="14" viewBox="0 0 280 14" aria-hidden="true" className="mb-1">
        <line x1="4" y1="7" x2="120" y2="7" stroke={UPSTREAM_INK} strokeWidth={2.2} strokeDasharray="10 7" />
        <path d="M128 7 L117 2.5 L117 11.5 Z" fill={UPSTREAM_INK} />
        <line x1="150" y1="7" x2="266" y2="7" stroke={DOWNSTREAM_INK} strokeWidth={2.2} />
        <path d="M274 7 L263 2.5 L263 11.5 Z" fill={DOWNSTREAM_INK} />
      </svg>
      <p className="text-xs text-soft mb-3">{t('legend.chain.body')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.frieze')}</h3>
      <p className="text-xs text-soft mb-3">{t('legend.frieze.body')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.levels')}</h3>
      <p className="text-sm mb-3">{LEVEL_I18N.map((k) => t(k)).join(' · ')}</p>

      <h3 className="section-title-sm mb-1.5">{t('legend.results')}</h3>
      <p className="text-sm mb-3 flex flex-wrap gap-1.5">
        {RESULT_KINDS.map((k) => (
          <KindBadge key={k} kind={k} />
        ))}
      </p>

      <h3 className="section-title-sm mb-1.5">{t('legend.statements')}</h3>
      <p className="text-sm mb-3">
        <span className="badge-fait">{t('statement.fact')}</span> <span className="badge-interp">{t('statement.interp')}</span>
      </p>
      <p className="text-xs italic text-muted">{t('legend.note')}</p>
    </div>
  );
}
