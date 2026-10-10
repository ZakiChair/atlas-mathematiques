import { useEffect, useState } from 'react';
import { SlidersHorizontal, Info, BookOpen, Search, X } from 'lucide-react';
import { useStore } from '../state/store';
import { SearchBox } from './SearchBox';
import { LangSwitcher } from '../i18n/LangSwitcher';
import { useLang } from '../i18n/lang';
import type { AtlasNode } from '../data/types';
import type { Selection } from '../state/store';

interface Props {
  onNavigate: (sel: Selection | null, fly?: boolean) => void;
}

export function TopBar({ onNavigate }: Props) {
  const { dispatch } = useStore();
  const { t } = useLang();
  const [mobileSearch, setMobileSearch] = useState(false);
  const pick = (n: AtlasNode) => {
    onNavigate({ kind: n.kind, id: n.id }, true);
    setMobileSearch(false);
  };

  useEffect(() => {
    if (!mobileSearch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSearch(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 pointer-events-none">
      <div className="pointer-events-auto shrink-0">
        <h1 className="font-serif text-xl sm:text-2xl leading-none">
          {t('app.title.a')} <em className="font-light">{t('app.title.em')}</em> {t('app.title.b')}
        </h1>
        <p className="text-[0.7rem] text-[#a39c8c] hidden sm:block">{t('app.subtitle')}</p>
      </div>
      <div className="flex-1 pointer-events-auto hidden sm:flex justify-center">
        <SearchBox onPick={pick} />
      </div>
      <div className="pointer-events-auto flex gap-2 shrink-0 ml-auto sm:ml-0">
        <button
          className="glass p-2.5 hover:bg-white/10 sm:hidden"
          aria-label={t('nav.search')}
          data-testid="search-open"
          onClick={() => setMobileSearch(true)}
        >
          <Search size={17} />
        </button>
        <button className="glass p-2.5 hover:bg-white/10" aria-label={t('nav.filters')} onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })}>
          <SlidersHorizontal size={17} />
        </button>
        <button className="glass p-2.5 hover:bg-white/10" aria-label={t('nav.legend')} onClick={() => dispatch({ type: 'toggle-ui', key: 'legendOpen' })}>
          <BookOpen size={17} />
        </button>
        <button className="glass p-2.5 hover:bg-white/10" aria-label={t('nav.method')} onClick={() => dispatch({ type: 'toggle-ui', key: 'methodOpen' })}>
          <Info size={17} />
        </button>
        <LangSwitcher />
      </div>
      {mobileSearch && (
        <div className="fixed inset-0 z-50 bg-[#0a0910]/95 p-4 pointer-events-auto" role="dialog" aria-modal="true" aria-label={t('nav.searchDialog')} data-testid="search-overlay">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SearchBox onPick={pick} autoFocus />
            </div>
            <button className="glass p-2.5 shrink-0" aria-label={t('nav.closeSearch')} onClick={() => setMobileSearch(false)}>
              <X size={17} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
