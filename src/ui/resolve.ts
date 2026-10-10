import type { Result, Mathematician, Domain, Theory } from '../data/types';
import type { Selection } from '../state/store';
import { domainOf } from '../map/bounds';
import type { AtlasData } from '../i18n/localize';

export interface Resolved {
  domain?: Domain;
  theory?: Theory;
  mathematician?: Mathematician;
  result?: Result;
  /** Domaine qui définit le mathématicien (peut différer du domaine affiché). */
  mathematicianHome?: Domain;
}

export function resolveSelection(sel: Selection | null, data: AtlasData): Resolved | null {
  if (!sel) return null;
  const mid = domainOf(sel);
  const m = mid ? data.domainById[mid] : undefined;
  if (!m) return null;
  const out: Resolved = { domain: m };
  if (sel.kind === 'theory') out.theory = m.theories.find((s) => s.id === sel.id);
  if (sel.kind === 'mathematician') {
    out.mathematician = m.mathematicians.find((f) => f.id === sel.id);
    if (!out.mathematician) {
      // mathématicien·ne défini·e dans un autre domaine
      for (const other of data.domains) {
        const f = other.mathematicians.find((x) => x.id === sel.id);
        if (f) {
          out.mathematician = f;
          out.mathematicianHome = other;
          break;
        }
      }
    } else out.mathematicianHome = m;
    if (out.mathematician?.theoryId) {
      out.theory =
        m.theories.find((s) => s.id === out.mathematician!.theoryId) ??
        out.mathematicianHome?.theories.find((s) => s.id === out.mathematician!.theoryId);
    }
  }
  if (sel.kind === 'result') {
    out.result = m.results.find((f) => f.id === sel.id);
    if (out.result?.theoryId) out.theory = m.theories.find((s) => s.id === out.result!.theoryId);
    if (out.result?.mathematicianId) {
      out.mathematician =
        m.mathematicians.find((f) => f.id === out.result!.mathematicianId) ?? data.mathematicianById[out.result.mathematicianId];
    }
  }
  return out;
}

/** Liste ordonnée des sources d'un domaine : domain.sources + citées en plus. */
export function sourceOrderFor(m: Domain): string[] {
  const order = [...m.sources];
  for (const s of [...m.methods, ...m.context, ...m.debates]) {
    for (const sid of s.sources ?? []) {
      if (!order.includes(sid)) order.push(sid);
    }
  }
  return order;
}
