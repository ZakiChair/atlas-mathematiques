import { X } from 'lucide-react';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { LEVEL_I18N } from '../i18n/localize';
import type { LinkKind, ResultKind } from '../data/types';
import type { UiKey } from '../i18n/ui';
import { KindBadge } from './ResultCard';
import { DOWNSTREAM_INK, FIELD_COLORS, LINK_INK, UPSTREAM_INK } from '../map/fieldColors';

const RESULT_KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];

const SAMPLES: { kind: LinkKind; labelKey: UiKey; dash?: string }[] = [
  { kind: 'filiation', labelKey: 'legend.filiation' },
  { kind: 'influence', labelKey: 'legend.influence', dash: '8 5' },
  { kind: 'affinite', labelKey: 'legend.affinite', dash: '2 5' },
  { kind: 'reaction', labelKey: 'legend.reaction' },
];

export function Legend() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
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
      <h3 className="section-title-sm mb-1.5">{t('legend.rivers')}</h3>
      {/* un fleuve qui s'élargit en traversant deux lacs */}
      <svg width="100%" height="46" viewBox="0 0 280 46" aria-hidden="true" className="mb-1.5">
        <path d="M6 23 C 60 21, 90 19, 140 21 S 230 24, 276 23 L 276 37 C 230 38, 190 36, 140 31 S 60 25, 6 25 Z" fill={FIELD_COLORS.formes.water} fillOpacity={0.7} />
        <ellipse cx="78" cy="23" rx="30" ry="16" fill="hsl(205 46% 89%)" stroke={FIELD_COLORS.formes.ink} strokeWidth={1} />
        <ellipse cx="196" cy="26" rx="34" ry="17" fill="hsl(205 46% 89%)" stroke={FIELD_COLORS.formes.ink} strokeWidth={1} />
        <text x="272" y="15" textAnchor="end" fontSize="13" fontStyle="italic" fontWeight={600} fontFamily="var(--font-serif)" fill={FIELD_COLORS.formes.ink}>
          n
        </text>
      </svg>
      <p className="text-xs text-soft mb-3">{t('legend.rivers.body')}</p>
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
      <h3 className="section-title-sm mb-1.5">{t('legend.links')}</h3>
      <ul className="space-y-1.5 mb-3">
        {SAMPLES.map((s) => (
          <li key={s.kind} className="flex items-center gap-2 text-sm">
            <svg width="44" height="10" aria-hidden="true">
              <line x1="2" y1="5" x2="42" y2="5" stroke={LINK_INK[s.kind]} strokeWidth={2} strokeDasharray={s.dash} />
            </svg>
            {t(s.labelKey)}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted mb-3">{t('legend.hint')}</p>
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
