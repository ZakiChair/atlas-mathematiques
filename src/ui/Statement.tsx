import type { Statement as StatementT } from '../data/types';
import { useLang } from '../i18n/lang';

interface Props {
  statement: StatementT;
  /** Ordre des sources affiché dans le panneau (index → [n]). */
  sourceOrder: string[];
  factsOnly: boolean;
}

export function Statement({ statement, sourceOrder, factsOnly }: Props) {
  const { t } = useLang();
  if (factsOnly && statement.kind === 'interpretation') return null;
  const nums = (statement.sources ?? [])
    .map((s) => sourceOrder.indexOf(s) + 1)
    .filter((n) => n > 0);
  return (
    <li className="text-sm leading-relaxed">
      <span
        className={statement.kind === 'fait' ? 'badge-fait' : 'badge-interp'}
        title={statement.kind === 'fait' ? t('statement.factTitle') : t('statement.interpTitle')}
      >
        {statement.kind === 'fait' ? t('statement.fact') : t('statement.interp')}
      </span>{' '}
      {statement.text}
      {nums.length > 0 && (
        <sup className="text-[#a39c8c]"> [{nums.join(', ')}]</sup>
      )}
    </li>
  );
}

export function StatementList({ statements, sourceOrder, factsOnly }: { statements: StatementT[]; sourceOrder: string[]; factsOnly: boolean }) {
  const { t } = useLang();
  const hidden = factsOnly ? statements.filter((s) => s.kind === 'interpretation').length : 0;
  return (
    <>
      <ul className="space-y-2 list-none p-0 m-0">
        {statements.map((s, i) => (
          <Statement key={i} statement={s} sourceOrder={sourceOrder} factsOnly={factsOnly} />
        ))}
      </ul>
      {hidden > 0 && <p className="text-xs italic text-[#a39c8c] mt-1">{t('statement.hidden', { n: hidden, s: hidden > 1 ? 's' : '' })}</p>}
    </>
  );
}
