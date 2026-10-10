import { useMemo } from 'react';
import {
  ERAS,
  CONTINENTS,
  DOMAINS,
  DOMAIN_BY_ID,
  MATHEMATICIAN_BY_ID,
  DOMAIN_OF_MATHEMATICIAN,
  LINKS,
  MATHEMATICIAN_LINKS_BY_ID,
  SOURCE_BY_ID,
} from '../data';
import type {
  AtlasNode,
  Continent,
  Domain,
  Era,
  Link,
  LinkKind,
  Mathematician,
  MathematicianLink,
  Source,
} from '../data/types';
import { buildNodes } from '../data/nodes';
import { EN } from './en';
import { useLang, type Lang } from './lang';
import type { UiKey } from './ui';

export const LINK_KIND_I18N: Record<LinkKind, UiKey> = {
  filiation: 'link.filiation',
  influence: 'link.influence',
  affinite: 'link.affinite',
  reaction: 'link.reaction',
};

export const MATHEMATICIAN_LINK_KIND_I18N: Record<MathematicianLink['kind'], UiKey> = {
  ...LINK_KIND_I18N,
  collaboration: 'link.collaboration',
};

export const LEVEL_I18N: UiKey[] = ['level.0', 'level.1', 'level.2', 'level.3'];

// ——— localisation ponctuelle (cache : un clone par objet et par langue) ———

const domainCache = new WeakMap<Domain, Partial<Record<Lang, Domain>>>();

export function localizeDomain(m: Domain, lang: Lang): Domain {
  if (lang === 'fr') return m;
  const hit = domainCache.get(m);
  if (hit?.[lang]) return hit[lang]!;
  const e = EN.domains[m.id];
  if (!e) return m;
  const out: Domain = {
    ...m,
    name: e.name ?? m.name,
    altNames: e.altNames ?? m.altNames,
    tagline: e.tagline ?? m.tagline,
    summary: e.summary ?? m.summary,
    places: e.places ?? m.places,
    keyDates: m.keyDates.map((k, i) => ({ ...k, text: e.keyDates?.[i] ?? k.text })),
    methods: m.methods.map((s, i) => ({ ...s, text: e.methods?.[i] ?? s.text })),
    context: m.context.map((s, i) => ({ ...s, text: e.context?.[i] ?? s.text })),
    debates: m.debates.map((s, i) => ({ ...s, text: e.debates?.[i] ?? s.text })),
    theories: m.theories.map((s) => {
      const es = e.theories?.[s.id];
      return es ? { ...s, name: es.name ?? s.name, summary: es.summary ?? s.summary, traits: es.traits ?? s.traits } : s;
    }),
    mathematicians: m.mathematicians.map((f) => {
      const ef = e.mathematicians?.[f.id];
      return ef ? { ...f, bio: ef.bio ?? f.bio, origin: ef.origin ?? f.origin } : f;
    }),
    results: m.results.map((f) => {
      const ef = e.results?.[f.id];
      return ef ? { ...f, title: ef.title ?? f.title, statement: ef.statement ?? f.statement, comment: ef.comment ?? f.comment } : f;
    }),
  };
  domainCache.set(m, { ...hit, [lang]: out });
  return out;
}

export function localizeLink(l: Link, lang: Lang): Link {
  if (lang === 'fr') return l;
  const e = EN.links[`${l.source}|${l.target}|${l.kind}`];
  return e ? { ...l, label: e.label ?? l.label, note: e.note ?? l.note } : l;
}

export function localizeMathematicianLink(l: MathematicianLink, lang: Lang): MathematicianLink {
  if (lang === 'fr') return l;
  const e = EN.mathematicianLinks[`${l.source}|${l.target}|${l.kind}`];
  return e ? { ...l, note: e.note ?? l.note } : l;
}

export function localizeEra(e: Era, lang: Lang): Era {
  if (lang === 'fr') return e;
  const t = EN.eras[e.id];
  return t ? { ...e, name: t.name ?? e.name, tagline: t.tagline ?? e.tagline } : e;
}

export function localizeContinent(r: Continent, lang: Lang): Continent {
  if (lang === 'fr') return r;
  const t = EN.continents[r.id];
  return t ? { ...r, name: t.name ?? r.name, shortName: t.shortName ?? r.shortName } : r;
}

export function localizeSource(s: Source, lang: Lang): Source {
  if (lang === 'fr') return s;
  const t = EN.sources[s.id];
  return t ? { ...s, note: t.note ?? s.note } : s;
}

// ——— accès groupé : toutes les données affichables dans une langue ———

export interface AtlasData {
  lang: Lang;
  domains: Domain[];
  domainById: Record<string, Domain>;
  mathematicianById: Record<string, Mathematician>;
  domainOfMathematician: Record<string, Domain>;
  links: Link[];
  mathematicianLinksById: Record<string, MathematicianLink[]>;
  eras: Era[];
  continents: Continent[];
  nodes: AtlasNode[];
  sourceById: Record<string, Source>;
}

const DATA: Partial<Record<Lang, AtlasData>> = {};

export function atlasData(lang: Lang): AtlasData {
  const hit = DATA[lang];
  if (hit) return hit;
  if (lang === 'fr') {
    const data: AtlasData = {
      lang,
      domains: DOMAINS,
      domainById: DOMAIN_BY_ID,
      mathematicianById: MATHEMATICIAN_BY_ID,
      domainOfMathematician: DOMAIN_OF_MATHEMATICIAN,
      links: LINKS,
      mathematicianLinksById: MATHEMATICIAN_LINKS_BY_ID,
      eras: ERAS,
      continents: CONTINENTS,
      nodes: buildNodes(DOMAINS, lang),
      sourceById: SOURCE_BY_ID,
    };
    DATA[lang] = data;
    return data;
  }
  const domains = DOMAINS.map((m) => localizeDomain(m, lang));
  const domainById = Object.fromEntries(domains.map((m) => [m.id, m]));
  const mathematicianById = Object.fromEntries(domains.flatMap((m) => m.mathematicians.map((f) => [f.id, f] as const)));
  const domainOfMathematician = Object.fromEntries(domains.flatMap((m) => m.mathematicians.map((f) => [f.id, m] as const)));
  const data: AtlasData = {
    lang,
    domains,
    domainById,
    mathematicianById,
    domainOfMathematician,
    links: LINKS.map((l) => localizeLink(l, lang)),
    mathematicianLinksById: Object.fromEntries(
      Object.entries(MATHEMATICIAN_LINKS_BY_ID).map(([k, ls]) => [k, ls.map((l) => localizeMathematicianLink(l, lang))]),
    ),
    eras: ERAS.map((e) => localizeEra(e, lang)),
    continents: CONTINENTS.map((r) => localizeContinent(r, lang)),
    nodes: buildNodes(domains, lang),
    sourceById: Object.fromEntries(Object.entries(SOURCE_BY_ID).map(([k, s]) => [k, localizeSource(s, lang)])),
  };
  DATA[lang] = data;
  return data;
}

export function useData(): AtlasData {
  const { lang } = useLang();
  return useMemo(() => atlasData(lang), [lang]);
}
