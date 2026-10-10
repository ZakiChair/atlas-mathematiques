import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { LangSwitcher } from '../i18n/LangSwitcher';

export function IntroOverlay() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  if (state.ui.introSeen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t('intro.aria')}>
      <div className="glass max-w-lg mx-4 p-8 text-center">
        <div className="flex justify-end mb-2">
          <LangSwitcher />
        </div>
        <h1 className="font-hand font-bold text-3xl mb-1">
          {t('app.title.a')} <em className="font-note not-italic font-normal">{t('app.title.em')}</em> {t('app.title.b')}
        </h1>
        <p className="text-[#9ba39c] text-sm mb-5">{t('app.subtitle')}</p>
        <p className="text-sm leading-relaxed text-left">{t('intro.body')}</p>
        <button
          className="mt-6 px-6 py-2.5 rounded-xl bg-[#e8c76a] text-[#0a0910] font-bold hover:bg-[#f2e5bb] transition"
          onClick={() => dispatch({ type: 'intro-seen' })}
        >
          {t('intro.cta')}
        </button>
      </div>
    </div>
  );
}
