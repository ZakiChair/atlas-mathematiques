import { X } from 'lucide-react';
import type { Link } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';

export interface LinkPopoverData {
  link: Link;
  x: number;
  y: number;
}

export function LinkPopover({ data, onClose, onGo }: { data: LinkPopoverData; onClose: () => void; onGo: (id: string) => void }) {
  const { t } = useLang();
  const { domainById, sourceById } = useData();
  const { link, x, y } = data;
  const src = domainById[link.source];
  const tgt = domainById[link.target];
  const left = Math.min(Math.max(12, x - 160), window.innerWidth - 340);
  const top = Math.min(Math.max(70, y - 80), window.innerHeight - 280);
  return (
    <div className="glass fixed w-80 p-4 z-50" style={{ left, top }} role="dialog" aria-label={t('popover.aria')} data-testid="link-popover">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9ba39c]">{t(LINK_KIND_I18N[link.kind])}</span>
          <h3 className="font-serif text-lg leading-snug">{link.label}</h3>
        </div>
        <button aria-label={t('popover.close')} className="p-1 hover:bg-white/10 rounded shrink-0" onClick={onClose}>
          <X size={15} />
        </button>
      </div>
      <p className="mb-2">
        <span className={link.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}>
          {link.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
        </span>
      </p>
      <p className="text-sm text-[#d6d8cc] mb-3">{link.note}</p>
      {(link.sources ?? []).length > 0 && (
        <p className="text-xs text-[#9ba39c] mb-3">
          {t('popover.sources')} {(link.sources ?? []).map((s) => sourceById[s]?.title ?? s).join(' · ')}
        </p>
      )}
      <div className="flex gap-2">
        {src && (
          <button className="chip" onClick={() => onGo(src.id)}>
            {t('popover.go', { name: src.name })}
          </button>
        )}
        {tgt && (
          <button className="chip" onClick={() => onGo(tgt.id)}>
            {t('popover.go', { name: tgt.name })}
          </button>
        )}
      </div>
    </div>
  );
}
