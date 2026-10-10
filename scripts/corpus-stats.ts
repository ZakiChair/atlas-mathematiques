/**
 * Statistiques du corpus, prêtes à coller dans le README (repère `CORPUS-STATS`).
 *
 *   npx tsx scripts/corpus-stats.ts
 */
import { DOMAINS, ERAS, LINKS, MATHEMATICIAN_LINKS, SOURCES } from '../src/data';
import type { EraId } from '../src/data/types';

const theories = DOMAINS.reduce((n, d) => n + d.theories.length, 0);
const mathematicians = DOMAINS.reduce((n, d) => n + d.mathematicians.length, 0);
const results = DOMAINS.reduce((n, d) => n + d.results.length, 0);
const keyDates = DOMAINS.reduce((n, d) => n + d.keyDates.length, 0);

const perEra = ERAS.map((e) => {
  const n = DOMAINS.filter((d) => d.era === (e.id as EraId)).length;
  return `${e.name.toLowerCase()} ${n}`;
}).join(', ');

const kinds = new Map<string, number>();
for (const d of DOMAINS) for (const r of d.results) kinds.set(r.kind, (kinds.get(r.kind) ?? 0) + 1);
const kindsText = [...kinds.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([k, n]) => `${n} ${k}`)
  .join(', ');

console.log(
  `${DOMAINS.length} domaines (${perEra}), ${theories} théories, ${mathematicians} figures, ` +
    `${results} résultats commentés (${kindsText}), ${keyDates} repères chronologiques, ` +
    `${LINKS.length} liens entre domaines, ${MATHEMATICIAN_LINKS.length} liens entre figures, ` +
    `${SOURCES.length} sources (livres, articles, textes primaires, archives web).`,
);
