import { X } from 'lucide-react';
import type { ResultKind } from '../data/types';
import { useStore, type VisionId } from '../state/store';
import { useLang } from '../i18n/lang';
import type { UiKey } from '../i18n/ui';
import { KindBadge } from './ResultCard';

const VISION_I18N: Record<VisionId, { name: UiKey; desc: UiKey }> = {
  structure: { name: 'vision.structure', desc: 'vision.structure.desc' },
  filiations: { name: 'vision.filiations', desc: 'vision.filiations.desc' },
  reseaux: { name: 'vision.reseaux', desc: 'vision.reseaux.desc' },
  natures: { name: 'vision.natures', desc: 'vision.natures.desc' },
};
const VISIONS = Object.keys(VISION_I18N) as VisionId[];
const KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];

/** Sélecteur de visions : modes de lecture superposés à la carte. */
export function VisionPanel() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  if (!state.ui.visionOpen) return null;
  return (
    <aside
      data-testid="vision-panel"
      className="glass fixed top-20 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] p-4"
      role="dialog"
      aria-label={t('vision.title')}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="section-title flex-1 !mb-0">{t('vision.title')}</h2>
        <button aria-label={t('vision.close')} className="p-1 hover:bg-white/10 rounded shrink-0" onClick={() => dispatch({ type: 'toggle-ui', key: 'visionOpen' })}>
          <X size={16} />
        </button>
      </div>
      <div className="grid gap-1.5 mt-3">
        {VISIONS.map((v) => {
          const active = state.vision === v;
          return (
            <button
              key={v}
              data-vision={v}
              className={`text-left px-3 py-2 rounded-lg border transition ${
                active ? 'border-[#e8c76a]/60 bg-white/5' : 'border-transparent hover:bg-white/5'
              }`}
              onClick={() => dispatch({ type: 'set-vision', vision: v })}
            >
              <div className="font-hand leading-tight">{t(VISION_I18N[v].name)}</div>
              <div className="text-xs text-[#9ba39c] mt-0.5">{t(VISION_I18N[v].desc)}</div>
            </button>
          );
        })}
      </div>
      {state.vision === 'natures' && (
        <div className="mt-3">
          <h3 className="section-title">{t('legend.results')}</h3>
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => {
              const active = state.naturesKind === k;
              return (
                <button
                  key={k}
                  className={`rounded transition ${active ? 'ring-1 ring-white/70' : 'opacity-55 hover:opacity-100'}`}
                  onClick={() => dispatch({ type: 'set-natures-kind', kind: active ? null : k })}
                >
                  <KindBadge kind={k} />
                </button>
              );
            })}
          </div>
          {state.naturesKind !== null && (
            <button className="chip mt-2" onClick={() => dispatch({ type: 'set-natures-kind', kind: null })}>
              {t('vision.natures.all')}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
