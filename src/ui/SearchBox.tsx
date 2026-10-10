import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { search, KIND_I18N, KIND_ORDER } from '../lib/search';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';
import type { AtlasNode, NodeKind } from '../data/types';

interface Props {
  onPick: (node: AtlasNode) => void;
  autoFocus?: boolean;
}

export function SearchBox({ onPick, autoFocus }: Props) {
  const { t } = useLang();
  const { nodes } = useData();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q, nodes), [q, nodes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setCursor(0), [q]);

  const pick = (n: AtlasNode) => {
    onPick(n);
    setQ('');
    setOpen(false);
    inputRef.current?.blur();
  };

  // aplatissement pour la navigation clavier
  const flat = results;

  return (
    <div className="relative w-full max-w-md" role="search">
      <div className="glass flex items-center gap-2 px-3 py-2">
        <Search size={16} className="text-[#a39c8c] shrink-0" />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setCursor((c) => Math.min(flat.length - 1, c + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setCursor((c) => Math.max(0, c - 1));
            } else if (e.key === 'Enter' && flat[cursor]) {
              pick(flat[cursor].node);
            } else if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={t('search.placeholder')}
          aria-label={t('search.aria')}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="search-results"
          className="bg-transparent outline-none w-full text-sm placeholder:text-[#a39c8c]/70"
        />
      </div>
      {open && results.length > 0 && (
        <div id="search-results" role="listbox" className="glass absolute left-0 right-0 top-full mt-2 max-h-96 overflow-auto panel-scroll p-2 z-50">
          {KIND_ORDER.map((kind: NodeKind) => {
            const group = results.filter((r) => r.node.kind === kind);
            if (!group.length) return null;
            return (
              <div key={kind} className="mb-2 last:mb-0">
                <div className="text-[0.65rem] uppercase tracking-widest text-[#a39c8c] px-2 pt-1">{t(KIND_I18N[kind])}</div>
                {group.map((r) => {
                  const idx = flat.indexOf(r);
                  return (
                    <button
                      key={`${r.node.kind}:${r.node.id}`}
                      role="option"
                      aria-selected={idx === cursor}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex justify-between gap-2 ${idx === cursor ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => pick(r.node)}
                    >
                      <span className="truncate">{r.node.label}</span>
                      <span className="text-xs text-[#a39c8c] shrink-0">{r.node.sublabel}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
