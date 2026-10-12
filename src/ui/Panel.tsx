import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useIsDesktop } from './useIsDesktop';
import { useStore } from '../state/store';
import { Breadcrumb } from './Breadcrumb';
import { Sheet } from './Sheet';
import { resolveSelection } from './resolve';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';
import { DomainView } from './panel/DomainView';
import { TheoryView } from './panel/TheoryView';
import { MathematicianView } from './panel/MathematicianView';
import { ResultView } from './panel/ResultView';
import type { Nav } from './panel/common';

/** Panneau de détail (desktop) ou feuille (mobile) de la sélection. */
export function Panel({ nav }: { nav: Nav }) {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const sel = state.selection;
  const desktop = useIsDesktop();

  useEffect(() => {
    if (!sel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'select', selection: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, dispatch]);

  if (!sel) return null;
  const r = resolveSelection(sel, data);
  if (!r?.domain) return null;

  const close = () => dispatch({ type: 'select', selection: null });

  const content = (
    <div className="p-5">
      <div className="flex items-start justify-between gap-2">
        <Breadcrumb selection={sel} onNavigate={nav} />
        <button aria-label={t('panel.close')} className="p-1 hover:bg-ink/8 rounded shrink-0" onClick={close}>
          <X size={16} />
        </button>
      </div>
      {sel.kind === 'domain' && <DomainView m={r.domain} nav={nav} />}
      {sel.kind === 'theory' && r.theory && <TheoryView s={r.theory} m={r.domain} nav={nav} />}
      {sel.kind === 'mathematician' && r.mathematician && <MathematicianView f={r.mathematician} r={r} nav={nav} />}
      {sel.kind === 'result' && r.result && <ResultView f={r.result} r={r} nav={nav} />}
    </div>
  );

  if (!desktop) {
    return <Sheet onClose={close}>{content}</Sheet>;
  }
  return (
    <aside data-testid="panel" className="glass fixed top-20 right-4 bottom-4 w-[440px] overflow-auto panel-scroll z-40" role="complementary" aria-label={t('panel.aria')}>
      {content}
    </aside>
  );
}
