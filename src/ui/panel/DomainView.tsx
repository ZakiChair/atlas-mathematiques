import { useMemo } from 'react';
import type { Domain, Link, Mathematician } from '../../data/types';
import { useStore } from '../../state/store';
import { useLang } from '../../i18n/lang';
import { useData, LINK_KIND_I18N } from '../../i18n/localize';
import { formatLifespan, formatPeriod, formatYear } from '../../lib/years';
import { principalLinks } from '../../map/lineage';
import { StatementList } from '../Statement';
import { ResultCard } from '../ResultCard';
import { sourceOrderFor } from '../resolve';
import { BasinSection } from './BasinSection';
import { Medallion, Section, SourceList, type Nav } from './common';

/** au-delà, les figures du domaine sont repliées */
const FIGURES_OPEN = 12;

export function DomainView({ m, nav }: { m: Domain; nav: Nav }) {
  const { state } = useStore();
  const { t, lang } = useLang();
  const data = useData();
  const factsOnly = state.filters.factsOnly;
  const order = sourceOrderFor(m);
  const links = data.links.filter((l) => l.source === m.id || l.target === m.id);
  const main = useMemo(() => principalLinks(data.links, data.domainById), [data.links, data.domainById]);
  const isTransmission = (l: Link) => l.kind === 'filiation' || l.kind === 'influence';
  const linkGroups = [
    { key: 'in', title: t('panel.links.in'), items: links.filter((l) => isTransmission(l) && l.target === m.id) },
    { key: 'out', title: t('panel.links.out'), items: links.filter((l) => isTransmission(l) && l.source === m.id) },
    { key: 'ruptures', title: t('panel.links.ruptures'), items: links.filter((l) => l.kind === 'reaction') },
    { key: 'affinities', title: t('panel.links.affinities'), items: links.filter((l) => l.kind === 'affinite') },
  ];
  const featured = m.mathematicians.filter((f) => f.featured);
  // grandes figures d'abord, puis par année de naissance
  const figures = [...m.mathematicians].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.years[0] - b.years[0]);
  const figureLine = (f: Mathematician) => (
    <li key={f.id}>
      <button className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-ink/5 flex justify-between gap-2" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
        <span className={f.featured ? 'font-semibold' : undefined}>{f.name}</span>
        <span className="text-xs text-muted text-right">
          {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
        </span>
      </button>
    </li>
  );

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
      {featured.length > 0 && (
        <Section title={t('panel.featured')} testId="domain-featured">
          <ul className="space-y-2">
            {featured.map((f) => (
              <li key={f.id}>
                <button className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-ink/5" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
                  <Medallion m={f} color={m.map.palette.accent} size={30} />
                  <span className="min-w-0">
                    <span className="block font-serif font-semibold text-base leading-tight">{f.name}</span>
                    <span className="block text-xs text-muted">{f.featured!.signature.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <BasinSection m={m} nav={nav} />
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
      <Section title={`${t('panel.mathematicians')} (${figures.length})`}>
        <ul className="space-y-1">{figures.slice(0, FIGURES_OPEN).map(figureLine)}</ul>
        {figures.length > FIGURES_OPEN && (
          <details className="mt-1">
            <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
              {t('panel.moreFigures', { n: figures.length - FIGURES_OPEN })}
            </summary>
            <ul className="space-y-1 mt-1">{figures.slice(FIGURES_OPEN).map(figureLine)}</ul>
          </details>
        )}
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
        <Section title={t('panel.links')} testId="domain-links">
          {linkGroups.map(({ key, title, items }) =>
            items.length > 0 ? (
              <div key={key} className="mb-3">
                <h4 className="text-xs uppercase tracking-wider text-muted mb-1">{title}</h4>
                <ul className="space-y-2">
                  {items.map((l) => {
                    const otherId = l.source === m.id ? l.target : l.source;
                    const other = data.domainById[otherId];
                    return (
                      <li key={`${l.source}|${l.target}|${l.kind}`} className="text-sm">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs uppercase tracking-wider text-muted">{t(LINK_KIND_I18N[l.kind])}</span>
                          {other && (
                            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
                              {other.name}
                            </button>
                          )}
                          <span className={l.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}>
                            {l.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
                          </span>
                          {main.get(l.target) === l && <span className="badge-principal">{t('panel.principal')}</span>}
                        </div>
                        <div className="pl-1 text-soft">{l.label}</div>
                        <div className="pl-1 text-xs text-muted">{l.note}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null,
          )}
        </Section>
      )}
      <Section title={t('panel.sources')}>
        <SourceList order={order} data={data} />
      </Section>
    </>
  );
}
