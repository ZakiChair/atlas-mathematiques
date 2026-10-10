import { useEffect, useMemo, type ReactNode } from 'react';
import { useIsDesktop } from './useIsDesktop';
import { X, ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';
import type { Mathematician, Domain, Source, Theory, Result } from '../data/types';
import { chainOf, generations } from '../map/upstream';
import { DOWNSTREAM_INK, UPSTREAM_INK } from '../map/fieldColors';
import { useStore, type Selection } from '../state/store';
import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
import { StatementList } from './Statement';
import { ResultCard, KindBadge } from './ResultCard';
import { Breadcrumb } from './Breadcrumb';
import { Sheet } from './Sheet';
import { resolveSelection, sourceOrderFor, type Resolved } from './resolve';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N, MATHEMATICIAN_LINK_KIND_I18N, type AtlasData } from '../i18n/localize';

type Nav = (sel: Selection | null) => void;

function Section({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="mt-6 mb-5" data-testid={testId}>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

function DomainChips({ ids, color, nav }: { ids: string[]; color: string; nav: Nav }) {
  const data = useData();
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const d = data.domainById[id];
        if (!d) return null;
        return (
          <button key={id} className="chip hover:border-accent/60 hover:text-accent transition" onClick={() => nav({ kind: 'domain', id })}>
            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
            {d.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Bassin amont d'un domaine : ce qui y conduit par filiation ou influence,
 * génération par génération, puis ce qu'il alimente directement.
 */
function UpstreamSection({ m, nav }: { m: Domain; nav: Nav }) {
  const { t, lang } = useLang();
  const data = useData();
  const chain = useMemo(() => chainOf(data.links, m.id), [data.links, m.id]);
  // ordre chronologique des domaines (data.domains est trié par début de période)
  const order = useMemo(() => data.domains.map((d) => d.id), [data.domains]);
  const gens = generations(chain, order);
  const n = chain.upstream.size;
  const oldest = order.find((id) => chain.upstream.has(id));
  const oldestDomain = oldest ? data.domainById[oldest] : undefined;
  const down = order.filter((id) => chain.downstream.has(id));
  const deeper = gens.slice(2);
  const deeperCount = deeper.reduce((s, g) => s + g.length, 0);
  return (
    <Section title={t('panel.upstream')} testId="upstream">
      {n === 0 ? (
        <p className="text-sm text-soft">{t('panel.upstream.none')}</p>
      ) : (
        <>
          <p className="text-sm text-soft mb-2">
            {t('panel.upstream.summary', { n, s: n > 1 ? 's' : '', g: chain.depth, gs: chain.depth > 1 ? 's' : '' })}
            {oldestDomain && (
              <>
                {' '}
                {t('panel.upstream.oldest', { name: oldestDomain.name, period: formatPeriod(oldestDomain.period, lang) })}
              </>
            )}
          </p>
          {gens.slice(0, 2).map((ids, i) => (
            <div key={i} className="mb-2">
              <div className="text-xs uppercase tracking-wider text-muted mb-1">
                {i === 0 ? t('panel.upstream.gen1') : t('panel.upstream.gen', { g: i + 1 })}
              </div>
              <DomainChips ids={ids} color={UPSTREAM_INK} nav={nav} />
            </div>
          ))}
          {deeperCount > 0 && (
            <details className="mb-2">
              <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
                {t('panel.upstream.deeper', { n: deeperCount })}
              </summary>
              {deeper.map((ids, i) => (
                <div key={i} className="mt-1.5">
                  <div className="text-xs text-muted mb-1">{t('panel.upstream.gen', { g: i + 3 })}</div>
                  <DomainChips ids={ids} color={UPSTREAM_INK} nav={nav} />
                </div>
              ))}
            </details>
          )}
        </>
      )}
      {down.length > 0 && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.downstream')}</div>
          <DomainChips ids={down} color={DOWNSTREAM_INK} nav={nav} />
        </div>
      )}
      <p className="text-xs italic text-muted mt-2">{t('panel.upstream.hint')}</p>
    </Section>
  );
}

function SourceList({ order, data }: { order: string[]; data: AtlasData }) {
  const { t } = useLang();
  return (
    <ol className="list-decimal pl-5 space-y-1.5 text-sm">
      {order.map((sid) => {
        const s: Source | undefined = data.sourceById[sid];
        if (!s) return <li key={sid} className="text-muted">{sid}</li>;
        return (
          <li key={sid}>
            {s.author}, <em>{s.title}</em>
            {s.year ? `, ${s.year}` : ''}
            {s.publisher ? `, ${s.publisher}` : ''}
            {s.note ? ` — ${s.note}` : ''}
            {s.url ? (
              <>
                {' '}
                <a href={s.url} target="_blank" rel="noreferrer" className="text-accent underline">
                  {t('panel.sourceLink')}
                </a>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function ResultLine({ r, nav }: { r: Result; nav: Nav }) {
  const { lang } = useLang();
  return (
    <button className="text-sm text-left text-accent hover:underline" onClick={() => nav({ kind: 'result', id: r.id })}>
      {r.title} <span className="text-muted">({formatYear(r.year, lang, r.yearApprox)})</span>
    </button>
  );
}

function DomainView({ m, nav }: { m: Domain; nav: Nav }) {
  const { state } = useStore();
  const { t, lang } = useLang();
  const data = useData();
  const factsOnly = state.filters.factsOnly;
  const order = sourceOrderFor(m);
  const links = data.links.filter((l) => l.source === m.id || l.target === m.id);

  return (
    <>
      <div className="h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${m.map.palette.fill}, ${m.map.palette.accent})` }} />
      <h2 className="font-serif text-3xl leading-tight">{m.name}</h2>
      {m.altNames && m.altNames.length > 0 && <p className="text-xs text-muted mt-0.5">{t('panel.also')} {m.altNames.join(' · ')}</p>}
      <p className="font-serif italic text-soft mt-1">{m.tagline}</p>
      <p className="text-sm text-muted mt-1">
        {formatPeriod(m.period, lang)} · {m.places.join(', ')} ·{' '}
        {m.continents.map((r) => data.continents.find((x) => x.id === r)?.name ?? r).join(', ')}
      </p>

      <Section title={t('panel.brief')}>
        <p className="text-sm leading-relaxed">{m.summary}</p>
      </Section>
      <UpstreamSection m={m} nav={nav} />
      <Section title={t('panel.methods')}>
        <StatementList statements={m.methods} sourceOrder={order} factsOnly={factsOnly} />
      </Section>
      <Section title={t('panel.context')}>
        <StatementList statements={m.context} sourceOrder={order} factsOnly={factsOnly} />
      </Section>
      <Section title={t('panel.debates')}>
        <StatementList statements={m.debates} sourceOrder={order} factsOnly={factsOnly} />
      </Section>
      <Section title={t('panel.keyDates')}>
        <ol className="border-l border-ink/15 pl-4 space-y-1.5">
          {m.keyDates.map((k, i) => (
            <li key={i} className="text-sm">
              <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
              {k.text}
            </li>
          ))}
        </ol>
      </Section>
      <Section title={t('panel.theories')}>
        <div className="grid gap-2">
          {m.theories.map((s) => (
            <button key={s.id} className="text-left glass p-3 hover:border-ink/30 transition" onClick={() => nav({ kind: 'theory', id: s.id })}>
              <div className="font-serif text-base">{s.name} <span className="text-xs text-muted">{s.period ? formatPeriod(s.period, lang) : ''}</span></div>
              <p className="text-xs text-muted mt-0.5">{s.summary}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {s.traits.slice(0, 4).map((tr) => (
                  <span key={tr} className="chip !text-[0.65rem] !py-0">{tr}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Section>
      <Section title={t('panel.mathematicians')}>
        <ul className="space-y-1">
          {m.mathematicians.map((f) => (
            <li key={f.id}>
              <button className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-ink/5 flex justify-between gap-2" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
                <span>{f.name}</span>
                <span className="text-xs text-muted text-right">
                  {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={t('panel.resultsKey')}>
        <ul className="space-y-2">
          {m.results.map((f) => (
            <li key={f.id}>
              <ResultCard result={f} onClick={() => nav({ kind: 'result', id: f.id })} />
            </li>
          ))}
        </ul>
      </Section>
      {links.length > 0 && (
        <Section title={t('panel.links')}>
          <ul className="space-y-2">
            {links.map((l, i) => {
              const otherId = l.source === m.id ? l.target : l.source;
              const other = data.domainById[otherId];
              const Icon = l.kind === 'affinite' ? ArrowLeftRight : l.source === m.id ? ArrowRight : ArrowLeft;
              return (
                <li key={i} className="text-sm">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className="text-muted shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-muted">{t(LINK_KIND_I18N[l.kind])}</span>
                    {other && (
                      <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
                        {other.name}
                      </button>
                    )}
                    <span className={l.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}>
                      {l.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
                    </span>
                  </div>
                  <div className="pl-5 text-soft">{l.label}</div>
                  <div className="pl-5 text-xs text-muted">{l.note}</div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      <Section title={t('panel.sources')}>
        <SourceList order={order} data={data} />
      </Section>
    </>
  );
}

function TheoryView({ s, m, nav }: { s: Theory; m: Domain; nav: Nav }) {
  const { t, lang } = useLang();
  const mathematicians = m.mathematicians.filter((f) => f.theoryId === s.id);
  const results = m.results.filter((f) => f.theoryId === s.id);
  return (
    <>
      <h2 className="font-serif text-2xl">{s.name}</h2>
      {s.period && <p className="text-sm text-muted">{formatPeriod(s.period, lang)}</p>}
      <p className="text-sm mt-2">{s.summary}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {s.traits.map((tr) => (
          <span key={tr} className="chip">{tr}</span>
        ))}
      </div>
      {mathematicians.length > 0 && (
        <Section title={t('panel.mathematicians')}>
          <ul className="space-y-1">
            {mathematicians.map((f) => (
              <li key={f.id}>
                <button className="text-sm text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {results.length > 0 && (
        <Section title={t('panel.results')}>
          <ul className="space-y-1">
            {results.map((f) => (
              <li key={f.id}>
                <ResultLine r={f} nav={nav} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <button className="chip mt-2" onClick={() => nav({ kind: 'domain', id: m.id })}>
        {t('panel.backTo', { name: m.name })}
      </button>
    </>
  );
}

function MathematicianView({ f, r, nav }: { f: Mathematician; r: Resolved; nav: Nav }) {
  const { t, lang } = useLang();
  const data = useData();
  const home = r.mathematicianHome ?? r.domain!;
  const theory = f.theoryId ? home.theories.find((s) => s.id === f.theoryId) : undefined;
  const also = data.domains.filter((m) => m.id !== home.id && m.relatedMathematicianIds?.includes(f.id));
  const network = (data.mathematicianLinksById[f.id] ?? []).map((l) => {
    const otherId = l.source === f.id ? l.target : l.source;
    return { link: l, other: data.mathematicianById[otherId], home: data.domainOfMathematician[otherId], outgoing: l.source === f.id };
  });
  // résultats dans tous les domaines, groupés par domaine
  const resultsByDomain = data.domains
    .map((m) => ({ m, results: m.results.filter((x) => x.mathematicianId === f.id) }))
    .filter((g) => g.results.length > 0);
  return (
    <>
      <h2 className="font-serif text-2xl">{f.name}</h2>
      <p className="text-sm text-muted">
        {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
      </p>
      <p className="text-sm mt-2">{f.bio}</p>
      {theory && (
        <p className="text-sm mt-2">
          {t('panel.theory')}{' '}
          <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
            {theory.name}
          </button>
        </p>
      )}
      {resultsByDomain.length > 0 && (
        <Section title={t('panel.results')}>
          {resultsByDomain.map(({ m: gm, results }) => (
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
                  {oh && oh.id !== home.id && (
                    <>
                      {' '}
                      <span className="text-muted">
                        (
                        <button className="hover:text-accent" onClick={() => nav({ kind: 'domain', id: oh.id })}>
                          {oh.name}
                        </button>
                        )
                      </span>
                    </>
                  )}
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
    </>
  );
}

function ResultView({ f, r, nav }: { f: Result; r: Resolved; nav: Nav }) {
  const { state } = useStore();
  const { t, lang } = useLang();
  const data = useData();
  const m = r.domain!;
  const factsOnly = state.filters.factsOnly;
  // récits rédigés (grands résultats) : sources numérotées propres à la fiche
  const narrative = [...(f.context ?? []), ...(f.impact ?? [])];
  const narrativeOrder = [...new Set(narrative.flatMap((s) => s.sources ?? []))];
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
