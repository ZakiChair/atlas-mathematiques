import { useMemo } from 'react';
import type { Domain } from '../../data/types';
import { chainOf, generations } from '../../map/upstream';
import { DOWNSTREAM_INK, UPSTREAM_INK } from '../../map/fieldColors';
import { formatPeriod } from '../../lib/years';
import { useLang } from '../../i18n/lang';
import type { UiKey } from '../../i18n/ui';
import { useData } from '../../i18n/localize';
import { DomainChips, Section, type Nav } from './common';

/** Générations d'un bassin : les deux premières à découvert, les suivantes repliées. */
function Generations({ gens, color, firstKey, nav }: { gens: string[][]; color: string; firstKey: UiKey; nav: Nav }) {
  const { t } = useLang();
  const deeper = gens.slice(2);
  const deeperCount = deeper.reduce((s, g) => s + g.length, 0);
  return (
    <>
      {gens.slice(0, 2).map((ids, i) => (
        <div key={i} className="mb-2">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">{i === 0 ? t(firstKey) : t('panel.basin.gen', { g: i + 1 })}</div>
          <DomainChips ids={ids} color={color} nav={nav} />
        </div>
      ))}
      {deeperCount > 0 && (
        <details className="mb-2">
          <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
            {t('panel.basin.deeper', { n: deeperCount })}
          </summary>
          {deeper.map((ids, i) => (
            <div key={i} className="mt-1.5">
              <div className="text-xs text-muted mb-1">{t('panel.basin.gen', { g: i + 3 })}</div>
              <DomainChips ids={ids} color={color} nav={nav} />
            </div>
          ))}
        </details>
      )}
    </>
  );
}

/**
 * Bassin d'un domaine : en amont, ce qui y conduit par filiation ou influence,
 * génération par génération ; en aval, ce qu'il a nourri, de proche en proche.
 */
export function BasinSection({ m, nav }: { m: Domain; nav: Nav }) {
  const { t, lang } = useLang();
  const data = useData();
  const chain = useMemo(() => chainOf(data.links, m.id), [data.links, m.id]);
  // ordre chronologique des domaines (data.domains est trié par début de période)
  const order = useMemo(() => data.domains.map((d) => d.id), [data.domains]);
  const upGens = generations(chain.upstream, order);
  const downGens = generations(chain.downstream, order);
  const nUp = chain.upstream.size;
  const nDown = chain.downstream.size;
  const oldest = order.find((id) => chain.upstream.has(id));
  const oldestDomain = oldest ? data.domainById[oldest] : undefined;
  const latest = [...order].reverse().find((id) => chain.downstream.has(id));
  const latestDomain = latest ? data.domainById[latest] : undefined;
  return (
    <Section title={t('panel.basin')} testId="basin">
      <div data-testid="upstream">
        <h4 className="font-serif text-base mt-1 mb-1" style={{ color: UPSTREAM_INK }}>
          {t('panel.upstream')}
        </h4>
        {nUp === 0 ? (
          <p className="text-sm text-soft mb-2">{t('panel.upstream.none')}</p>
        ) : (
          <>
            <p className="text-sm text-soft mb-2">
              {t('panel.upstream.summary', { n: nUp, s: nUp > 1 ? 's' : '', g: chain.depth, gs: chain.depth > 1 ? 's' : '' })}
              {oldestDomain && (
                <>
                  {' '}
                  {t('panel.upstream.oldest', { name: oldestDomain.name, period: formatPeriod(oldestDomain.period, lang) })}
                </>
              )}
            </p>
            <Generations gens={upGens} color={UPSTREAM_INK} firstKey="panel.upstream.gen1" nav={nav} />
          </>
        )}
      </div>
      <div data-testid="downstream" className="mt-3">
        <h4 className="font-serif text-base mb-1" style={{ color: DOWNSTREAM_INK }}>
          {t('panel.downstream')}
        </h4>
        {nDown === 0 ? (
          <p className="text-sm text-soft mb-2">{t('panel.downstream.none')}</p>
        ) : (
          <>
            <p className="text-sm text-soft mb-2">
              {t('panel.downstream.summary', { n: nDown, s: nDown > 1 ? 's' : '', g: chain.downDepth, gs: chain.downDepth > 1 ? 's' : '' })}
              {latestDomain && (
                <>
                  {' '}
                  {t('panel.downstream.latest', { name: latestDomain.name, period: formatPeriod(latestDomain.period, lang) })}
                </>
              )}
            </p>
            <Generations gens={downGens} color={DOWNSTREAM_INK} firstKey="panel.downstream.gen1" nav={nav} />
          </>
        )}
      </div>
      <p className="text-xs italic text-muted mt-2">{t('panel.basin.hint')}</p>
    </Section>
  );
}
