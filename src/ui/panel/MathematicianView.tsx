import type { Mathematician, Result } from '../../data/types';
import { useStore } from '../../state/store';
import { useLang } from '../../i18n/lang';
import { useData, MATHEMATICIAN_LINK_KIND_I18N } from '../../i18n/localize';
import { formatLifespan } from '../../lib/years';
import { Statement, StatementList } from '../Statement';
import { ResultCard, KindBadge } from '../ResultCard';
import { sourceOrder, type Resolved } from '../resolve';
import { Medallion, ResultLine, Section, SourceList, type Nav } from './common';

const MACTUTOR_URL = 'https://mathshistory.st-andrews.ac.uk/Biographies/';

/**
 * Fiche d'une figure. Grande figure : médaille, signature, apports, résultats
 * phares, puis la biographie et les autres résultats. Figure ordinaire ou fiche
 * courte : biographie, résultats éventuels, réseau.
 */
export function MathematicianView({ f, r, nav }: { f: Mathematician; r: Resolved; nav: Nav }) {
  const { state } = useStore();
  const { t, lang } = useLang();
  const data = useData();
  const factsOnly = state.filters.factsOnly;
  const home = r.mathematicianHome ?? r.domain!;
  const theory = f.theoryId ? home.theories.find((s) => s.id === f.theoryId) : undefined;
  const also = data.domains.filter((m) => m.id !== home.id && m.relatedMathematicianIds?.includes(f.id));
  const network = (data.mathematicianLinksById[f.id] ?? []).map((l) => {
    const otherId = l.source === f.id ? l.target : l.source;
    return { link: l, other: data.mathematicianById[otherId], home: data.domainOfMathematician[otherId], outgoing: l.source === f.id };
  });
  const featured = f.featured;
  const headlineIds = new Set(featured?.headlineResultIds ?? []);
  const allResults = data.domains.flatMap((m) => m.results.filter((x) => x.mathematicianId === f.id).map((x) => ({ m, x })));
  const headlines = (featured?.headlineResultIds ?? [])
    .map((id) => allResults.find((e) => e.x.id === id)?.x)
    .filter((x): x is Result => !!x);
  // autres résultats, groupés par domaine
  const others = data.domains
    .map((m) => ({ m, results: m.results.filter((x) => x.mathematicianId === f.id && !headlineIds.has(x.id)) }))
    .filter((g) => g.results.length > 0);
  const order = sourceOrder(featured ? [featured.signature, ...featured.contributions] : [], [{ sources: f.sources }]);

  return (
    <>
      <div className="flex items-center gap-4">
        {featured ? <Medallion m={f} color={home.map.palette.accent} size={44} /> : null}
        <div className="min-w-0">
          <h2 className="font-serif text-3xl leading-tight">{f.name}</h2>
          <p className="text-sm text-muted">
            {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
          </p>
        </div>
      </div>
      {featured && (
        <ul className="list-none p-0 mt-3 signature" data-testid="signature">
          <Statement statement={featured.signature} sourceOrder={order} factsOnly={factsOnly} />
        </ul>
      )}
      {featured && featured.contributions.length > 0 && (
        <Section title={t('panel.contributions')} testId="contributions">
          <StatementList statements={featured.contributions} sourceOrder={order} factsOnly={factsOnly} />
        </Section>
      )}
      {headlines.length > 0 && (
        <Section title={t('panel.headlines')} testId="headlines">
          <ul className="space-y-2">
            {headlines.map((x) => (
              <li key={x.id}>
                <ResultCard result={x} onClick={() => nav({ kind: 'result', id: x.id })} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section title={t('panel.bio')}>
        <p className="text-sm leading-relaxed">{f.bio}</p>
        {theory && (
          <p className="text-sm mt-2">
            {t('panel.theory')}{' '}
            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
              {theory.name}
            </button>
          </p>
        )}
        {f.mactutor && (
          <p className="text-sm mt-2">
            <a className="text-accent underline" href={`${MACTUTOR_URL}${f.mactutor}/`} target="_blank" rel="noreferrer">
              {t('panel.mactutor')}
            </a>
          </p>
        )}
      </Section>
      {others.length > 0 && (
        <Section title={featured ? t('panel.otherResults') : t('panel.results')}>
          {others.map(({ m: gm, results }) => (
            <div key={gm.id} className="mb-2">
              <div className="text-xs uppercase tracking-wider text-muted mb-0.5">
                <button className="hover:text-accent" onClick={() => nav({ kind: 'domain', id: gm.id })}>
                  {gm.name}
                </button>
              </div>
              <ul className="space-y-1 pl-2">
                {results.map((x) => (
                  <li key={x.id} className="flex items-center gap-2">
                    <KindBadge kind={x.kind} />
                    <ResultLine r={x} nav={nav} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {network.length > 0 && (
        <Section title={t('panel.network')}>
          <ul className="space-y-1.5">
            {network.map(({ link, other, home: oh, outgoing }) =>
              other ? (
                <li key={`${link.source}|${link.target}|${link.kind}`} className="text-sm">
                  <span className="text-xs uppercase tracking-wider text-muted mr-2">{t(MATHEMATICIAN_LINK_KIND_I18N[link.kind])}</span>
                  <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: other.id })}>
                    {other.name}
                  </button>
                  {link.epistemic && (
                    <span className={`ml-2 ${link.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}`}>
                      {link.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
                    </span>
                  )}
                  {oh && oh.id !== home.id && <span className="text-muted"> · {oh.name}</span>}
                  <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">
                    {!outgoing && link.kind !== 'collaboration' && link.kind !== 'affinite' ? `${other.name} → ${f.name} : ` : ''}
                    {link.note}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        </Section>
      )}
      <p className="text-sm">
        {t('panel.domain')}{' '}
        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: home.id })}>
          {home.name}
        </button>
      </p>
      {also.length > 0 && (
        <p className="text-sm mt-1">
          {t('panel.alsoActive')}{' '}
          {also.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: a.id })}>
                {a.name}
              </button>
            </span>
          ))}
        </p>
      )}
      {order.length > 0 && (
        <Section title={t('panel.sources')}>
          <SourceList order={order} data={data} />
        </Section>
      )}
    </>
  );
}
