import { DOMAINS, DOMAIN_BY_ID } from './index';
import type { AtlasNode, Domain } from './types';
import { normalizeText } from '../lib/normalize';
import { formatYear } from '../lib/years';
import type { Lang } from '../i18n/lang';

function nodesForDomain(m: Domain, lang: Lang): AtlasNode[] {
  // en mode EN, le texte de recherche inclut aussi les libellés FR d'origine :
  // « théorie des nombres » doit retrouver « number theory ».
  const raw = lang === 'fr' ? m : (DOMAIN_BY_ID[m.id] ?? m);
  const nodes: AtlasNode[] = [
    {
      kind: 'domain',
      id: m.id,
      label: m.name,
      sublabel: m.places.join(', '),
      domainId: m.id,
      searchText: normalizeText(
        [m.name, raw.name, ...(m.altNames ?? []), ...(raw.altNames ?? []), ...m.places, ...(raw.places ?? [])].join(' '),
      ),
    },
  ];
  const rawTheories = new Map(raw.theories.map((s) => [s.id, s]));
  for (const s of m.theories) {
    nodes.push({
      kind: 'theory',
      id: s.id,
      label: s.name,
      sublabel: m.name,
      domainId: m.id,
      theoryId: s.id,
      searchText: normalizeText(`${s.name} ${rawTheories.get(s.id)?.name ?? ''} ${s.traits.join(' ')}`),
    });
  }
  const rawMathematicians = new Map(raw.mathematicians.map((f) => [f.id, f]));
  for (const f of m.mathematicians) {
    nodes.push({
      kind: 'mathematician',
      id: f.id,
      label: f.name,
      sublabel: `${f.origin} · ${m.name}`,
      domainId: m.id,
      theoryId: f.theoryId,
      mathematicianId: f.id,
      searchText: normalizeText(`${f.name} ${f.origin} ${rawMathematicians.get(f.id)?.origin ?? ''}`),
    });
  }
  for (const f of m.results) {
    nodes.push({
      kind: 'result',
      id: f.id,
      label: f.title,
      sublabel: `${f.authorName} · ${formatYear(f.year, lang, f.yearApprox)}`,
      domainId: m.id,
      theoryId: f.theoryId,
      mathematicianId: f.mathematicianId,
      searchText: normalizeText([f.title, f.altTitle ?? '', f.authorName].join(' ')),
    });
  }
  return nodes;
}

export function buildNodes(domains: Domain[], lang: Lang): AtlasNode[] {
  return domains.flatMap((m) => nodesForDomain(m, lang));
}

export const ATLAS_NODES: AtlasNode[] = buildNodes(DOMAINS, 'fr');
