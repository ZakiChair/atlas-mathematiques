import type { Result, ResultKind } from '../data/types';
import { useLang } from '../i18n/lang';
import type { UiKey } from '../i18n/ui';
import { formatYear } from '../lib/years';

export const RESULT_KIND_I18N: Record<ResultKind, UiKey> = {
  theoreme: 'result.theoreme',
  conjecture: 'result.conjecture',
  concept: 'result.concept',
  methode: 'result.methode',
  texte: 'result.texte',
  probleme: 'result.probleme',
};

/** Pastille de nature du résultat (théorème, conjecture, concept…). */
export function KindBadge({ kind, className }: { kind: ResultKind; className?: string }) {
  const { t } = useLang();
  return <span className={`badge-kind badge-kind-${kind}${className ? ` ${className}` : ''}`}>{t(RESULT_KIND_I18N[kind])}</span>;
}

/** Carte de résultat marquant : nature + titre + auteur + commentaire. */
export function ResultCard({ result, onClick }: { result: Result; onClick: () => void }) {
  const { lang } = useLang();
  return (
    <button className="w-full text-left glass p-2.5 hover:border-white/30 transition flex gap-3" onClick={onClick}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <KindBadge kind={result.kind} />
          <span className="text-xs text-[#9ba39c]">{formatYear(result.year, lang, result.yearApprox)}</span>
        </div>
        <div className="text-sm font-medium leading-snug mt-1">{result.title}</div>
        {result.altTitle && <div className="text-xs italic text-[#9ba39c] truncate">{result.altTitle}</div>}
        <div className="text-xs text-[#9ba39c]">{result.authorName}</div>
        <p className="text-xs text-[#d6d8cc] mt-1">{result.comment}</p>
      </div>
    </button>
  );
}
