import { useLang, type Lang } from './lang';

const LANGS: Lang[] = ['fr', 'en'];

export function LangSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="glass flex items-center text-xs font-medium" role="group" aria-label={t('lang.switch')}>
      {LANGS.map((l) => (
        <button
          key={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-2 uppercase tracking-wide transition rounded-lg ${
            lang === l ? 'text-accent font-bold' : 'text-muted hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
