import { X } from 'lucide-react';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { LEVEL_I18N } from '../i18n/localize';
import type { LinkKind, ResultKind } from '../data/types';
import type { UiKey } from '../i18n/ui';
import { KindBadge } from './ResultCard';

const RESULT_KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];

const SAMPLES: { kind: LinkKind; labelKey: UiKey; dash?: string }[] = [
  { kind: 'filiation', labelKey: 'legend.filiation' },
  { kind: 'influence', labelKey: 'legend.influence', dash: '8 5' },
  { kind: 'affinite', labelKey: 'legend.affinite', dash: '2 5' },
  { kind: 'reaction', labelKey: 'legend.reaction' },
];

const COLORS: Record<LinkKind, string> = { filiation: '#e8c76a', influence: '#9fc8e0', affinite: '#c9a0ff', reaction: '#ff7a5c' };

export function Legend() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  if (!state.ui.legendOpen) return null;
  return (
    <div className="glass fixed bottom-24 left-4 w-72 p-4 z-40" role="dialog" aria-label={t('legend.title')}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif text-lg">{t('legend.title')}</h2>
        <button aria-label={t('legend.close')} className="p-1 hover:bg-white/10 rounded" onClick={() => dispatch({ type: 'toggle-ui', key: 'legendOpen' })}>
          <X size={16} />
        </button>
      </div>
      <h3 className="text-xs uppercase tracking-widest text-[#9ba39c] mb-1.5">{t('legend.links')}</h3>
      <ul className="space-y-1.5 mb-3">
        {SAMPLES.map((s) => (
          <li key={s.kind} className="flex items-center gap-2 text-sm">
            <svg width="44" height="10" aria-hidden="true">
              <line x1="2" y1="5" x2="42" y2="5" stroke={COLORS[s.kind]} strokeWidth={2} strokeDasharray={s.dash} />
            </svg>
            {t(s.labelKey)}
          </li>
        ))}
      </ul>
      <p className="text-xs text-[#9ba39c] mb-3">{t('legend.hint')}</p>
      <h3 className="text-xs uppercase tracking-widest text-[#9ba39c] mb-1.5">{t('legend.levels')}</h3>
      <p className="text-sm mb-3">{LEVEL_I18N.map((k) => t(k)).join(' · ')}</p>
      <h3 className="text-xs uppercase tracking-widest text-[#9ba39c] mb-1.5">{t('legend.results')}</h3>
      <p className="text-sm mb-3 flex flex-wrap gap-1.5">
        {RESULT_KINDS.map((k) => (
          <KindBadge key={k} kind={k} />
        ))}
      </p>
      <h3 className="text-xs uppercase tracking-widest text-[#9ba39c] mb-1.5">{t('legend.statements')}</h3>
      <p className="text-sm mb-3">
        <span className="badge-fait">{t('statement.fact')}</span> <span className="badge-interp">{t('statement.interp')}</span>
      </p>
      <p className="text-xs italic text-[#9ba39c]">{t('legend.note')}</p>
    </div>
  );
}
