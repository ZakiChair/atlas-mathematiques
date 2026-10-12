import type { Result } from '../../data/types';
import { useStore } from '../../state/store';
import { useLang } from '../../i18n/lang';
import { useData, LINK_KIND_I18N } from '../../i18n/localize';
import { formatYear } from '../../lib/years';
import { Statement, StatementList } from '../Statement';
import { KindBadge } from '../ResultCard';
import { sourceOrder, type Resolved } from '../resolve';
import { ResultLine, Section, SourceList, type Nav } from './common';

export function ResultView({ f, r, nav }: { f: Result; r: Resolved; nav: Nav }) {
  const { state } = useStore();
  const { t, lang } = useLang();
  const data = useData();
  const m = r.domain!;
  const factsOnly = state.filters.factsOnly;
  // énoncés rédigés (intuition, démonstration, récits) : sources numérotées propres à la fiche
  const narrativeOrder = sourceOrder(f.intuition ?? [], f.proof ?? [], f.context ?? [], f.impact ?? []);
  const author = r.mathematician;
  const theory = f.theoryId ? m.theories.find((s) => s.id === f.theoryId) : undefined;
  const also = m.results.filter((x) => x.id !== f.id && (f.theoryId ? x.theoryId === f.theoryId : true)).slice(0, 3);
  // « Ce qui y a conduit » : les repères du domaine qui précèdent, et les héritages reçus
  const before = m.keyDates.filter((k) => k.year < f.year).slice(-2);
  const heritage = data.links.filter((l) => l.target === m.id && (l.kind === 'filiation' || l.kind === 'influence')).slice(0, 3);
  // « Ce que ça a ouvert » : les repères qui suivent, et ce que le domaine a transmis
  const after = m.keyDates.filter((k) => k.year > f.year).slice(0, 2);
  const legacy = data.links.filter((l) => l.source === m.id).slice(0, 3);
  const linkLine = (l: (typeof data.links)[number], outgoing: boolean) => {
    const otherId = outgoing ? l.target : l.source;
    const other = data.domainById[otherId];
    return (
      <li key={`${l.source}|${l.target}|${l.kind}`} className="text-sm">
        <span className="text-xs uppercase tracking-wider text-muted mr-1.5">{t(LINK_KIND_I18N[l.kind])}</span>
        {other && (
          <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
            {other.name}
          </button>
        )}
        <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">{l.label}</span>
      </li>
    );
  };
  return (
    <>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <KindBadge kind={f.kind} />
          {f.major && <span className="badge-major">{t('result.major')}</span>}
          <span className="text-sm text-muted">{formatYear(f.year, lang, f.yearApprox)}</span>
        </div>
        <h2 className="font-serif text-2xl leading-tight">{f.title}</h2>
        {f.altTitle && <p className="font-serif italic text-muted">{f.altTitle}</p>}
        <p className="text-sm text-muted mt-1">
          {author ? (
            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: author.id })}>
              {f.authorName}
            </button>
          ) : (
            f.authorName
          )}
        </p>
        {theory && (
          <p className="text-sm mt-1">
            {t('panel.theory')}{' '}
            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
              {theory.name}
            </button>
          </p>
        )}
      </div>
      {f.statement && (
        <Section title={t('panel.statement')}>
          <p className="text-sm leading-relaxed text-soft font-serif text-[0.95rem] border-l-2 border-accent/40 pl-3">{f.statement}</p>
        </Section>
      )}
      {f.intuition && (
        <Section title={t('panel.intuition')} testId="result-intuition">
          <StatementList statements={f.intuition} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
        </Section>
      )}
      {f.proof && (
        <Section title={t('panel.proof')} testId="result-proof">
          <ol className="proof-steps">
            {f.proof.map((s, i) => (
              <Statement key={i} statement={s} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
            ))}
          </ol>
        </Section>
      )}
      <Section title={t('panel.place')}>
        <p className="text-sm leading-relaxed">{f.comment}</p>
      </Section>
      {(f.context || before.length > 0 || heritage.length > 0) && (
        <Section title={t('panel.resultRoots')} testId="result-context">
          {f.context && (
            <div className="mb-3">
              <StatementList statements={f.context} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
            </div>
          )}
          {f.context && (before.length > 0 || heritage.length > 0) && (
            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
          )}
          {before.length > 0 && (
            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
              {before.map((k, i) => (
                <li key={i} className="text-sm">
                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
                  {k.text}
                </li>
              ))}
            </ol>
          )}
          <ul className="space-y-2">{heritage.map((l) => linkLine(l, false))}</ul>
        </Section>
      )}
      {(f.impact || after.length > 0 || legacy.length > 0) && (
        <Section title={t('panel.resultLegacy')} testId="result-impact">
          {f.impact && (
            <div className="mb-3">
              <StatementList statements={f.impact} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
            </div>
          )}
          {f.impact && (after.length > 0 || legacy.length > 0) && (
            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
          )}
          {after.length > 0 && (
            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
              {after.map((k, i) => (
                <li key={i} className="text-sm">
                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
                  {k.text}
                </li>
              ))}
            </ol>
          )}
          <ul className="space-y-2">{legacy.map((l) => linkLine(l, true))}</ul>
        </Section>
      )}
      <p className="text-sm mt-2">
        {t('panel.domain')}{' '}
        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: m.id })}>
          {m.name}
        </button>
      </p>
      {also.length > 0 && (
        <Section title={t('panel.seeAlso')}>
          <ul className="space-y-1">
            {also.map((x) => (
              <li key={x.id} className="flex items-center gap-2">
                <KindBadge kind={x.kind} />
                <ResultLine r={x} nav={nav} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      {narrativeOrder.length > 0 && (
        <Section title={t('panel.sources')}>
          <SourceList order={narrativeOrder} data={data} />
        </Section>
      )}
    </>
  );
}
