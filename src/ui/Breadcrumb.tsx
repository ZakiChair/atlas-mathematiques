import type { Selection } from '../state/store';
import { domainOf } from '../map/bounds';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';

interface Props {
  selection: Selection;
  onNavigate: (sel: Selection | null) => void;
}

export function Breadcrumb({ selection, onNavigate }: Props) {
  const { t } = useLang();
  const { domainById } = useData();
  const mid = domainOf(selection);
  const m = mid ? domainById[mid] : undefined;
  const items: { label: string; sel: Selection | null }[] = [{ label: t('app.title.a'), sel: null }];
  if (m) items.push({ label: m.name, sel: { kind: 'domain', id: m.id } });
  const trail: { label: string; sel: Selection }[] = [];
  if (m) {
    if (selection.kind === 'theory') {
      const s = m.theories.find((x) => x.id === selection.id);
      if (s) trail.push({ label: s.name, sel: selection });
    } else if (selection.kind === 'mathematician') {
      const f = m.mathematicians.find((x) => x.id === selection.id);
      if (f?.theoryId) {
        const s = m.theories.find((x) => x.id === f.theoryId);
        if (s) trail.push({ label: s.name, sel: { kind: 'theory', id: s.id } });
      }
      trail.push({ label: f?.name ?? selection.id, sel: selection });
    } else if (selection.kind === 'result') {
      const f = m.results.find((x) => x.id === selection.id);
      if (f?.theoryId) {
        const s = m.theories.find((x) => x.id === f.theoryId);
        if (s) trail.push({ label: s.name, sel: { kind: 'theory', id: s.id } });
      }
      if (f?.mathematicianId) {
        const fm = m.mathematicians.find((x) => x.id === f.mathematicianId);
        if (fm) trail.push({ label: fm.name, sel: { kind: 'mathematician', id: fm.id } });
      }
      trail.push({ label: f?.title ?? selection.id, sel: selection });
    }
  }
  items.push(...trail);

  return (
    <nav aria-label={t('panel.breadcrumb')} className="text-xs text-[#9ba39c] mb-3 flex flex-wrap items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <span className="mx-1.5 opacity-60">›</span>}
          <button
            className={i === items.length - 1 ? 'text-[#edeee6] font-medium' : 'hover:text-[#e8c76a]'}
            onClick={() => onNavigate(it.sel)}
          >
            {it.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
