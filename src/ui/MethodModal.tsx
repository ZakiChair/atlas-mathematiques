import { X } from 'lucide-react';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';

export function MethodModal() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  if (!state.ui.methodOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t('method.title')} onClick={() => dispatch({ type: 'toggle-ui', key: 'methodOpen' })}>
      <div className="glass max-w-xl mx-4 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">{t('method.title')}</h2>
          <button aria-label={t('method.close')} className="p-1 hover:bg-white/10 rounded" onClick={() => dispatch({ type: 'toggle-ui', key: 'methodOpen' })}>
            <X size={18} />
          </button>
        </div>
        <p className="text-sm leading-relaxed">{t('method.body')}</p>
      </div>
    </div>
  );
}
