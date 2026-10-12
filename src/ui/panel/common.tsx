import type { ReactNode } from 'react';
import type { Mathematician, Result, Source } from '../../data/types';
import type { Selection } from '../../state/store';
import { useLang } from '../../i18n/lang';
import { useData, type AtlasData } from '../../i18n/localize';
import { formatYear } from '../../lib/years';

export type Nav = (sel: Selection | null) => void;

export function Section({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="mt-6 mb-5" data-testid={testId}>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

/** Médaille d'une grande figure (panneau) : initiale blanche sur la couleur de son champ. */
export function Medallion({ m, color, size = 40 }: { m: Pick<Mathematician, 'id'>; color: string; size?: number }) {
  return (
    <span
      className="medallion-ui"
      style={{ width: size, height: size, background: color, boxShadow: `0 0 0 2px #fffefb, 0 0 0 3px ${color}`, fontSize: size * 0.48 }}
      aria-hidden="true"
    >
      {m.id[0].toUpperCase()}
    </span>
  );
}

export function DomainChips({ ids, color, nav }: { ids: string[]; color: string; nav: Nav }) {
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

export function SourceList({ order, data }: { order: string[]; data: AtlasData }) {
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

export function ResultLine({ r, nav }: { r: Result; nav: Nav }) {
  const { lang } = useLang();
  return (
    <button className="text-sm text-left text-accent hover:underline" onClick={() => nav({ kind: 'result', id: r.id })}>
      {r.title} <span className="text-muted">({formatYear(r.year, lang, r.yearApprox)})</span>
    </button>
  );
}
