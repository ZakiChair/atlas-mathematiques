/**
 * Contrôle d'un fichier d'ère pendant la rédaction du corpus.
 *
 *   npx tsx scripts/check-era.ts antiquite
 *   npx tsx scripts/check-era.ts dixneuvieme-a --all   (affiche aussi les erreurs des autres fichiers)
 *
 * Valide le corpus, puis ne garde que les erreurs qui concernent le fichier
 * demandé. Les fichiers d'ère sont importés un par un : un fichier encore en
 * cours de rédaction (syntaxe ou objet incomplet) est ignoré avec un avertis-
 * sement au lieu de faire échouer le contrôle. Les références vers des ids
 * annoncés dans docs/corpus/BRIEF.md mais encore absents du corpus (définis
 * dans un fichier pas encore rédigé) sont signalées comme « attendues ».
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateAtlas } from '../src/data/validate';
import { ERAS, CONTINENTS } from '../src/data/eras';
import { CORE_SOURCES } from '../src/data/sources-core';
import type { Domain, Link, MathematicianLink, Source } from '../src/data/types';

const FILES: Record<string, { mod: string; domains: string; sources: string; links: string; mlinks: string }> = {
  antiquite: { mod: '../src/data/domains/antiquite', domains: 'ANTIQUITE', sources: 'SOURCES_ANTIQUITE', links: 'LINKS_ANTIQUITE', mlinks: 'MATHEMATICIAN_LINKS_ANTIQUITE' },
  medieval: { mod: '../src/data/domains/medieval', domains: 'MEDIEVAL', sources: 'SOURCES_MEDIEVAL', links: 'LINKS_MEDIEVAL', mlinks: 'MATHEMATICIAN_LINKS_MEDIEVAL' },
  renaissance: { mod: '../src/data/domains/renaissance', domains: 'RENAISSANCE', sources: 'SOURCES_RENAISSANCE', links: 'LINKS_RENAISSANCE', mlinks: 'MATHEMATICIAN_LINKS_RENAISSANCE' },
  lumieres: { mod: '../src/data/domains/lumieres', domains: 'LUMIERES', sources: 'SOURCES_LUMIERES', links: 'LINKS_LUMIERES', mlinks: 'MATHEMATICIAN_LINKS_LUMIERES' },
  'dixneuvieme-a': { mod: '../src/data/domains/dixneuvieme-a', domains: 'DIXNEUVIEME_A', sources: 'SOURCES_DIXNEUVIEME_A', links: 'LINKS_DIXNEUVIEME_A', mlinks: 'MATHEMATICIAN_LINKS_DIXNEUVIEME_A' },
  'dixneuvieme-b': { mod: '../src/data/domains/dixneuvieme-b', domains: 'DIXNEUVIEME_B', sources: 'SOURCES_DIXNEUVIEME_B', links: 'LINKS_DIXNEUVIEME_B', mlinks: 'MATHEMATICIAN_LINKS_DIXNEUVIEME_B' },
  'structures-a': { mod: '../src/data/domains/structures-a', domains: 'STRUCTURES_A', sources: 'SOURCES_STRUCTURES_A', links: 'LINKS_STRUCTURES_A', mlinks: 'MATHEMATICIAN_LINKS_STRUCTURES_A' },
  'structures-b': { mod: '../src/data/domains/structures-b', domains: 'STRUCTURES_B', sources: 'SOURCES_STRUCTURES_B', links: 'LINKS_STRUCTURES_B', mlinks: 'MATHEMATICIAN_LINKS_STRUCTURES_B' },
  'contemporain-a': { mod: '../src/data/domains/contemporain-a', domains: 'CONTEMPORAIN_A', sources: 'SOURCES_CONTEMPORAIN_A', links: 'LINKS_CONTEMPORAIN_A', mlinks: 'MATHEMATICIAN_LINKS_CONTEMPORAIN_A' },
  'contemporain-b': { mod: '../src/data/domains/contemporain-b', domains: 'CONTEMPORAIN_B', sources: 'SOURCES_CONTEMPORAIN_B', links: 'LINKS_CONTEMPORAIN_B', mlinks: 'MATHEMATICIAN_LINKS_CONTEMPORAIN_B' },
  'physique-a': { mod: '../src/data/domains/physique-a', domains: 'PHYSIQUE_A', sources: 'SOURCES_PHYSIQUE_A', links: 'LINKS_PHYSIQUE_A', mlinks: 'MATHEMATICIAN_LINKS_PHYSIQUE_A' },
  'physique-b': { mod: '../src/data/domains/physique-b', domains: 'PHYSIQUE_B', sources: 'SOURCES_PHYSIQUE_B', links: 'LINKS_PHYSIQUE_B', mlinks: 'MATHEMATICIAN_LINKS_PHYSIQUE_B' },
  'physique-c': { mod: '../src/data/domains/physique-c', domains: 'PHYSIQUE_C', sources: 'SOURCES_PHYSIQUE_C', links: 'LINKS_PHYSIQUE_C', mlinks: 'MATHEMATICIAN_LINKS_PHYSIQUE_C' },
  'physique-d': { mod: '../src/data/domains/physique-d', domains: 'PHYSIQUE_D', sources: 'SOURCES_PHYSIQUE_D', links: 'LINKS_PHYSIQUE_D', mlinks: 'MATHEMATICIAN_LINKS_PHYSIQUE_D' },
};

const file = process.argv[2];
const showAll = process.argv.includes('--all');
if (!file || !FILES[file]) {
  console.error(`Usage : npx tsx scripts/check-era.ts <${Object.keys(FILES).join('|')}> [--all]`);
  process.exit(2);
}

interface Loaded {
  domains: Domain[];
  sources: Source[];
  links: Link[];
  mlinks: MathematicianLink[];
  truncated: boolean;
}

const loaded = new Map<string, Loaded>();
const unreadable: string[] = [];
for (const [name, f] of Object.entries(FILES)) {
  try {
    const m = (await import(f.mod)) as Record<string, unknown>;
    const raw = (m[f.domains] ?? []) as Domain[];
    // défense contre un fichier en cours d'écriture : objets incomplets écartés
    const sane = raw.filter(
      (d) =>
        d &&
        Array.isArray(d.theories) &&
        Array.isArray(d.mathematicians) &&
        Array.isArray(d.results) &&
        Array.isArray(d.keyDates) &&
        Array.isArray(d.methods) &&
        Array.isArray(d.context) &&
        Array.isArray(d.debates),
    );
    loaded.set(name, {
      domains: sane,
      sources: ((m[f.sources] ?? []) as Source[]).filter((s) => s && s.id),
      links: ((m[f.links] ?? []) as Link[]).filter((l) => l && l.source && l.target),
      mlinks: ((m[f.mlinks] ?? []) as MathematicianLink[]).filter((l) => l && l.source && l.target),
      truncated: sane.length !== raw.length,
    });
  } catch {
    unreadable.push(name);
  }
}

const mine = loaded.get(file);
if (!mine) {
  console.error(`Le fichier ${file}.ts est illisible (syntaxe en cours d'écriture ?).`);
  process.exit(2);
}

const localIds = new Set<string>();
for (const d of mine.domains) {
  localIds.add(d.id);
  d.theories.forEach((t) => localIds.add(t.id));
  d.mathematicians.forEach((m) => localIds.add(m.id));
  d.results.forEach((r) => localIds.add(r.id));
}

const brief = readFileSync(resolve(process.cwd(), 'docs/corpus/BRIEF.md'), 'utf8');
const briefIds = new Set([...brief.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*)`/g)].map((m) => m[1]));

const domains = [...loaded.values()].flatMap((l) => l.domains);
const links = [...loaded.values()].flatMap((l) => l.links);
const mlinks = [...loaded.values()].flatMap((l) => l.mlinks);
const sources = [...CORE_SOURCES, ...[...loaded.values()].flatMap((l) => l.sources)];

const knownIds = new Set<string>();
for (const d of domains) {
  knownIds.add(d.id);
  d.mathematicians.forEach((m) => knownIds.add(m.id));
}
sources.forEach((s) => knownIds.add(s.id));

const errors = validateAtlas({
  domains,
  links,
  sources,
  eras: ERAS,
  continents: CONTINENTS,
  mathematicianLinks: mlinks,
});

const concerns = (msg: string) =>
  showAll || [...localIds].some((id) => msg.includes(`« ${id} »`) || msg.includes(` ${id} `) || msg.includes(` ${id}→`) || msg.includes(`→${id}`) || msg.includes(` ${id} :`) || msg.includes(` ${id})`));
const missingRef = (msg: string): string | null => {
  const m = msg.match(/(?:inconnue?|inexistant(?: globalement)?) « ([a-z0-9-]+) »|« ([a-z0-9-]+) » inexistant/);
  return m ? (m[1] ?? m[2]) : null;
};

const hard: string[] = [];
const expected: string[] = [];
for (const e of errors) {
  if (!concerns(e)) continue;
  const ref = missingRef(e);
  if (ref && briefIds.has(ref) && !knownIds.has(ref)) expected.push(e);
  else hard.push(e);
}

if (unreadable.length) console.log(`(fichiers illisibles, ignorés : ${unreadable.join(', ')})`);
const truncated = [...loaded.entries()].filter(([, l]) => l.truncated).map(([n]) => n);
if (truncated.length) console.log(`(fichiers partiellement écrits, objets incomplets ignorés : ${truncated.join(', ')})`);

console.log(`\n# ${file} : ${mine.domains.length} domaine(s)\n`);
for (const d of mine.domains) {
  const statements = [...d.methods, ...d.context, ...d.debates];
  const faits = statements.filter((s) => s.kind === 'fait').length;
  const interp = statements.length - faits;
  console.log(
    `- ${d.id} : ${d.theories.length} théories, ${d.mathematicians.length} figures, ${d.results.length} résultats, ` +
      `${d.keyDates.length} repères, ${d.sources.length} sources, énoncés ${faits} faits / ${interp} interprétations`,
  );
}
const inLinks = links.filter((l) => localIds.has(l.target)).length;
const inMl = mlinks.filter((l) => localIds.has(l.target)).length;
console.log(`- liens entrants : ${inLinks} entre domaines, ${inMl} entre figures`);

if (expected.length) {
  console.log(`\n## Références attendues (ids du brief définis dans un autre fichier, pas encore rédigé) : ${expected.length}`);
  for (const e of expected) console.log(`  · ${e}`);
}
console.log(`\n## Erreurs à corriger dans ${file} : ${hard.length}`);
for (const e of hard) console.log(`  ✗ ${e}`);
process.exit(hard.length ? 1 : 0);
