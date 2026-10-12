import type { Domain, Theory } from '../../data/types';
import { useLang } from '../../i18n/lang';
import { formatPeriod } from '../../lib/years';
import { ResultLine, Section, type Nav } from './common';

export function TheoryView({ s, m, nav }: { s: Theory; m: Domain; nav: Nav }) {
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
