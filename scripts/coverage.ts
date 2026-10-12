/**
 * Avancement du corpus de la refonte « Galerie » (grandes figures, apports,
 * intuitions et démonstrations, figures, slugs MacTutor).
 *
 *   npx tsx scripts/coverage.ts                       résumé
 *   npx tsx scripts/coverage.ts --todo lumieres       résultats de ce fichier d'ère encore sans intuition ou démonstration
 *   npx tsx scripts/coverage.ts --featured            grandes figures encore sans apports
 */
import { DOMAINS } from '../src/data';
import type { Domain } from '../src/data/types';
import { coverage, hasProofMaterial } from '../src/data/completeness';

const ERA_EXPORTS: Record<string, string> = {
  antiquite: 'ANTIQUITE',
  medieval: 'MEDIEVAL',
  renaissance: 'RENAISSANCE',
  lumieres: 'LUMIERES',
  'dixneuvieme-a': 'DIXNEUVIEME_A',
  'dixneuvieme-b': 'DIXNEUVIEME_B',
  'structures-a': 'STRUCTURES_A',
  'structures-b': 'STRUCTURES_B',
  'contemporain-a': 'CONTEMPORAIN_A',
  'contemporain-b': 'CONTEMPORAIN_B',
};

const c = coverage(DOMAINS);
const pct = (a: number, b: number) => `${b === 0 ? 100 : Math.round((100 * a) / b)} %`;
console.log(`grandes figures : ${c.featured}, dont ${c.featuredWithContributions} avec leurs apports`);
console.log(`intuitions et démonstrations : ${c.proofDone} / ${c.proofTargets} (${pct(c.proofDone, c.proofTargets)})`);
console.log(`figures : ${c.mathematicians}, dont ${c.withMactutor} avec un slug MacTutor (${pct(c.withMactutor, c.mathematicians)})`);

const todo = process.argv.indexOf('--todo');
if (todo > 0) {
  const file = process.argv[todo + 1];
  if (!ERA_EXPORTS[file]) {
    console.error(`fichier d'ère inconnu : ${file} (${Object.keys(ERA_EXPORTS).join(', ')})`);
    process.exit(2);
  }
  const mod = (await import(`../src/data/domains/${file}.ts`)) as Record<string, Domain[]>;
  const ids = new Set(mod[ERA_EXPORTS[file]].map((d) => d.id));
  console.log(`\nà rédiger dans ${file}.ts :`);
  for (const d of DOMAINS.filter((x) => ids.has(x.id))) {
    for (const r of d.results) {
      if ((r.kind === 'theoreme' || r.kind === 'conjecture' || r.kind === 'probleme') && !hasProofMaterial(r)) {
        console.log(`  ${d.id} · ${r.id} [${r.kind}] ${r.title} (${r.year})`);
      }
    }
  }
}
if (process.argv.includes('--featured')) {
  console.log('\ngrandes figures sans apports :');
  for (const d of DOMAINS) for (const m of d.mathematicians) if (m.featured && m.featured.contributions.length === 0) console.log(`  ${d.id} · ${m.id}`);
}
