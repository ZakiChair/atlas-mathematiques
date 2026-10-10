import type { AtlasLayout } from './layout';
import type { Bounds } from './controller';
import type { Selection } from '../state/store';
import { DOMAINS } from '../data';

/** Courant d'appartenance d'une sélection. */
export function domainOf(sel: Selection): string | null {
  if (sel.kind === 'domain') return sel.id;
  for (const m of DOMAINS) {
    if (sel.kind === 'theory' && m.theories.some((s) => s.id === sel.id)) return m.id;
    if (sel.kind === 'mathematician' && (m.mathematicians.some((f) => f.id === sel.id) || m.relatedMathematicianIds?.includes(sel.id))) return m.id;
    if (sel.kind === 'result' && m.results.some((f) => f.id === sel.id)) return m.id;
  }
  return null;
}

/** Emprise idéale d'un nœud pour le fly-to. */
export function boundsFor(sel: Selection, layout: AtlasLayout): Bounds | null {
  const mid = domainOf(sel);
  const t = mid ? layout.byId.get(mid) : undefined;
  if (sel.kind === 'domain') {
    if (!t) return null;
    const m = t.r * 1.15;
    return { x0: t.x - m, y0: t.y - m, x1: t.x + m, y1: t.y + m };
  }
  if (!t) return null;
  const pos = layout.childPos.get(sel.id);
  if (!pos) return { x0: t.x - t.r, y0: t.y - t.r, x1: t.x + t.r, y1: t.y + t.r };
  const pad = sel.kind === 'theory' ? t.r * 0.5 : sel.kind === 'mathematician' ? t.r * 0.24 : t.r * 0.16;
  return { x0: pos.x - pad, y0: pos.y - pad, x1: pos.x + pad, y1: pos.y + pad };
}
