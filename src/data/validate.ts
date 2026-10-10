import type { Continent, Domain, Era, Link, MathematicianLink, Source } from './types';
import { MAP_SIZE } from './eras';

export interface AtlasInput {
  domains: Domain[];
  links: Link[];
  sources: Source[];
  eras: Era[];
  continents: Continent[];
  mathematicianLinks?: MathematicianLink[];
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validation du corpus : renvoie une liste de messages d'erreur lisibles. */
export function validateAtlas(input: AtlasInput): string[] {
  const errors: string[] = [];
  const { domains, links, sources, eras, continents, mathematicianLinks } = input;

  const eraIds = new Set(eras.map((e) => e.id));
  const continentIds = new Set(continents.map((c) => c.id));
  const sourceIds = new Set<string>();
  for (const s of sources) {
    if (sourceIds.has(s.id)) errors.push(`source dupliquée « ${s.id} »`);
    sourceIds.add(s.id);
    if (!SLUG.test(s.id)) errors.push(`source ${s.id} : identifiant non conforme (minuscules, chiffres, tirets)`);
  }

  // ids uniques globalement par type ; le préfixe ne sert que de clé d'unicité,
  // la forme (slug) est testée sur l'id brut
  const allIds = new Map<string, string>();
  const claim = (key: string, id: string, ctx: string) => {
    if (!SLUG.test(id)) errors.push(`${ctx} : identifiant « ${id} » non conforme (minuscules, chiffres, tirets)`);
    const prev = allIds.get(key);
    if (prev) errors.push(`id dupliqué « ${id} » (${prev} et ${ctx})`);
    else allIds.set(key, ctx);
  };

  const domainIds = new Set<string>();
  const globalMathematicianIds = new Set<string>();

  for (const m of domains) {
    domainIds.add(m.id);
    claim(`domain:${m.id}`, m.id, `domaine ${m.id}`);
    for (const s of m.theories) claim(`theory:${s.id}`, s.id, `théorie ${s.id} (domaine ${m.id})`);
    for (const f of m.mathematicians) {
      claim(`mathematician:${f.id}`, f.id, `mathématicien ${f.id} (domaine ${m.id})`);
      globalMathematicianIds.add(f.id);
    }
    for (const f of m.results) claim(`result:${f.id}`, f.id, `résultat ${f.id} (domaine ${m.id})`);
  }

  const checkSources = (ids: string[] | undefined, ctx: string) => {
    for (const sid of ids ?? []) {
      if (!sourceIds.has(sid)) errors.push(`${ctx} : source inconnue « ${sid} »`);
    }
  };

  for (const m of domains) {
    const ctx = `domaine ${m.id}`;
    if (!eraIds.has(m.era)) errors.push(`${ctx} : ère inconnue « ${m.era} »`);
    if (m.continents.length === 0) errors.push(`${ctx} : aucun continent`);
    for (const c of m.continents) {
      if (!continentIds.has(c)) errors.push(`${ctx} : continent inconnu « ${c} »`);
    }
    if (m.period.start > (m.period.end ?? Infinity)) {
      errors.push(`${ctx} : period.start (${m.period.start}) > period.end (${m.period.end})`);
    }
    if (m.period.start === 0 || m.period.end === 0) errors.push(`${ctx} : l'année 0 n'existe pas`);
    if (!m.summary.trim()) errors.push(`${ctx} : summary vide`);
    if (!m.tagline.trim()) errors.push(`${ctx} : tagline vide`);
    if (m.places.length === 0) errors.push(`${ctx} : aucun lieu (places)`);
    for (const c of [m.map.palette.fill, m.map.palette.stroke, m.map.palette.accent]) {
      if (!HEX.test(c)) errors.push(`${ctx} : couleur invalide « ${c} »`);
    }
    if (m.map.x < 0 || m.map.x > MAP_SIZE.width || m.map.y < 0 || m.map.y > MAP_SIZE.height) {
      errors.push(`${ctx} : position carte (${m.map.x},${m.map.y}) hors bornes`);
    }
    if (m.theories.length < 2) errors.push(`${ctx} : moins de 2 théories (${m.theories.length})`);
    if (m.mathematicians.length < 3) errors.push(`${ctx} : moins de 3 mathématiciens (${m.mathematicians.length})`);
    if (m.results.length < 4) errors.push(`${ctx} : moins de 4 résultats (${m.results.length})`);
    if (m.keyDates.length < 3) errors.push(`${ctx} : moins de 3 repères (${m.keyDates.length})`);
    if (m.sources.length < 2) errors.push(`${ctx} : moins de 2 sources (${m.sources.length})`);
    checkSources(m.sources, ctx);

    const theoryIds = new Set(m.theories.map((s) => s.id));
    const mathematicianIds = new Set(m.mathematicians.map((f) => f.id));
    const related = new Set(m.relatedMathematicianIds ?? []);

    const statements = [...m.methods, ...m.context, ...m.debates];
    if (!statements.some((s) => s.kind === 'fait')) {
      errors.push(`${ctx} : aucun énoncé « fait » dans methods/context/debates`);
    }
    if (!statements.some((s) => s.kind === 'interpretation')) {
      errors.push(`${ctx} : aucun énoncé « interpretation » dans methods/context/debates`);
    }
    statements.forEach((s, i) => {
      if (!s.text.trim()) errors.push(`${ctx} énoncé #${i} : texte vide`);
      checkSources(s.sources, `${ctx} énoncé #${i}`);
    });

    for (const f of m.mathematicians) {
      if (f.theoryId && !theoryIds.has(f.theoryId)) {
        errors.push(`${ctx} : mathématicien ${f.id} : theoryId inconnu « ${f.theoryId} »`);
      }
      if (f.years[1] !== null && f.years[0] >= f.years[1]) {
        errors.push(`${ctx} : mathématicien ${f.id} : années invalides (${f.years[0]}, ${f.years[1]})`);
      }
      if (f.years[0] === 0 || f.years[1] === 0) errors.push(`${ctx} : mathématicien ${f.id} : l'année 0 n'existe pas`);
      if (!f.bio.trim()) errors.push(`${ctx} : mathématicien ${f.id} : bio vide`);
    }
    // tolérance : un résultat peut précéder ou suivre un peu les bornes du domaine
    // (les bornes des traditions anciennes sont larges, celles des écoles récentes serrées).
    const span = (m.period.end ?? 2030) - m.period.start;
    const slack = span > 500 ? 150 : 15;
    const lo = m.period.start - slack;
    const hi = (m.period.end ?? 2030) + slack;
    for (const f of m.results) {
      if (f.theoryId && !theoryIds.has(f.theoryId)) {
        errors.push(`${ctx} : résultat ${f.id} : theoryId inconnu « ${f.theoryId} »`);
      }
      if (f.mathematicianId) {
        const ok =
          mathematicianIds.has(f.mathematicianId) ||
          (related.has(f.mathematicianId) && globalMathematicianIds.has(f.mathematicianId));
        if (!ok) {
          if (related.has(f.mathematicianId)) {
            errors.push(`${ctx} : résultat ${f.id} : relatedMathematicianId « ${f.mathematicianId} » inexistant globalement`);
          } else {
            errors.push(`${ctx} : résultat ${f.id} : mathematicianId inconnu « ${f.mathematicianId} »`);
          }
        }
      }
      if (f.year === 0) errors.push(`${ctx} : résultat ${f.id} : l'année 0 n'existe pas`);
      if (f.year < lo || f.year > hi) {
        errors.push(`${ctx} : résultat ${f.id} : année ${f.year} hors [${lo}, ${hi}]`);
      }
      if (!f.comment.trim()) errors.push(`${ctx} : résultat ${f.id} : commentaire vide`);
    }
    for (const rid of m.relatedMathematicianIds ?? []) {
      if (!globalMathematicianIds.has(rid)) {
        errors.push(`${ctx} : relatedMathematicianId inexistant « ${rid} »`);
      }
      if (mathematicianIds.has(rid)) {
        errors.push(`${ctx} : relatedMathematicianId « ${rid} » est déjà défini dans ce domaine`);
      }
    }
  }

  const linkKeys = new Set<string>();
  for (const l of links) {
    const ctx = `lien ${l.source}→${l.target}`;
    if (!domainIds.has(l.source)) errors.push(`${ctx} : source inconnue « ${l.source} »`);
    if (!domainIds.has(l.target)) errors.push(`${ctx} : target inconnue « ${l.target} »`);
    if (l.source === l.target) errors.push(`${ctx} : auto-lien interdit`);
    const key = `${l.source}|${l.target}|${l.kind}`;
    if (linkKeys.has(key)) errors.push(`${ctx} (${l.kind}) : doublon`);
    linkKeys.add(key);
    if (l.kind === 'affinite' && l.epistemic !== 'interpretation') {
      errors.push(`${ctx} : une affinité est toujours une interprétation`);
    }
    checkSources(l.sources, ctx);
  }

  const mlKeys = new Set<string>();
  for (const l of mathematicianLinks ?? []) {
    const ctx = `lien mathématicien ${l.source}→${l.target}`;
    if (!globalMathematicianIds.has(l.source)) errors.push(`${ctx} : source inconnue « ${l.source} »`);
    if (!globalMathematicianIds.has(l.target)) errors.push(`${ctx} : cible inconnue « ${l.target} »`);
    if (l.source === l.target) errors.push(`${ctx} : auto-lien interdit`);
    const key = `${l.source}|${l.target}|${l.kind}`;
    if (mlKeys.has(key)) errors.push(`${ctx} (${l.kind}) : doublon`);
    mlKeys.add(key);
  }

  return errors;
}
