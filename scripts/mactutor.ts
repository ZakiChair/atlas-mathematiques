/**
 * Contrôle des figures contre l'archive MacTutor (University of St Andrews) :
 * la page de biographie existe, et les années de vie de l'atlas concordent
 * avec les siennes (tolérance de 15 ans si l'une des deux dates est approchée).
 *
 *   npx tsx scripts/mactutor.ts                    toutes les figures dotées d'un slug
 *   npx tsx scripts/mactutor.ts --domain <id>      un seul domaine
 *   npx tsx scripts/mactutor.ts --strict           code de sortie 1 au moindre écart (vague 4)
 *   npx tsx scripts/mactutor.ts --suggest <id>     figures du domaine sans slug : slugs candidats vérifiés
 *   npx tsx scripts/mactutor.ts --text <slug>      biographie en texte brut (--max <n> caractères, défaut 6000)
 *
 * Les pages sont mises en cache dans scripts/.cache/mactutor/ (ignoré par git).
 * Le script signale ; il ne corrige jamais les données : un écart se tranche
 * à la main, sources à l'appui (et se signale au propriétaire).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { DOMAINS } from '../src/data';
import type { Mathematician } from '../src/data/types';
import { compareYears, parseLifeYears } from '../src/lib/mactutor';
import { normalizeText } from '../src/lib/normalize';

const BASE = 'https://mathshistory.st-andrews.ac.uk/Biographies/';
const CACHE = 'scripts/.cache/mactutor';
mkdirSync(CACHE, { recursive: true });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Page de biographie (cache local), ou null si elle n'existe pas. */
async function biography(slug: string): Promise<string | null> {
  const file = `${CACHE}/${slug.replace(/[^A-Za-z0-9_-]/g, '_')}.html`;
  if (existsSync(file)) return readFileSync(file, 'utf8');
  await sleep(300); // courtoisie envers le serveur
  const res = await fetch(`${BASE}${slug}/`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${slug} : HTTP ${res.status}`);
  const html = await res.text();
  writeFileSync(file, html);
  return html;
}

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const strict = process.argv.includes('--strict');
const domainId = arg('--domain');
const suggestFor = arg('--suggest');

if (suggestFor) {
  const d = DOMAINS.find((x) => x.id === suggestFor);
  if (!d) throw new Error(`domaine inconnu : ${suggestFor}`);
  for (const m of d.mathematicians.filter((x) => !x.mactutor)) {
    const words = normalizeText(m.name).split(' ').filter((w) => w.length > 1);
    const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
    const last = cap(words[words.length - 1] ?? '');
    const candidates = [...new Set([last, `${last}_${cap(words[0] ?? '')}`])];
    const found: string[] = [];
    for (const slug of candidates) if (await biography(slug)) found.push(slug);
    console.log(`${m.id.padEnd(28)} ${found.length ? found.join(' | ') : '(aucun candidat : chercher à la main sur MacTutor)'}`);
  }
  process.exit(0);
}

const textSlug = arg('--text');
if (textSlug) {
  const html = await biography(textSlug);
  if (!html) {
    console.error(`${textSlug} : page introuvable`);
    process.exit(1);
  }
  const stripTags = (s: string) => s.replace(/<(?:[^"'<>]|"[^"]*"|'[^']*')*>/g, '');
  const decode = (s: string) =>
    s
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '’')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  const clean = (s: string) => decode(stripTags(s)).replace(/[ \t]+/g, ' ').trim();
  const dd = (label: string) => {
    const m = html.match(new RegExp(`<dt>${label}</dt>\\s*<dd>([\\s\\S]*?)</dd>`));
    return m ? clean(m[1]) : null;
  };
  for (const label of ['Born', 'Died', 'Summary']) {
    const v = dd(label);
    if (v) console.log(`${label} : ${v}`);
  }
  const max = Number(arg('--max') ?? 6000);
  const bioHtml = (() => {
    const i = html.indexOf('<h3>Biography</h3>');
    if (i < 0) return '';
    const rest = html.slice(i + '<h3>Biography</h3>'.length);
    const j = rest.indexOf('<hr');
    return j < 0 ? rest : rest.slice(0, j);
  })();
  const bioText = decode(
    stripTags(bioHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/blockquote>/gi, '\n')),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  console.log();
  console.log(bioText.length > max ? `${bioText.slice(0, max)} […]` : bioText);
  const written = html.match(/Written by([\s\S]{0,400}?)(?:<\/p>|<\/div>|<br|<hr|$)/);
  const writtenText = written ? clean(written[1]) : '';
  if (writtenText) console.log(`\nWritten by ${writtenText}`);
  console.log(`Longueur : ${bioText.length} caractères`);
  process.exit(0);
}

const figures: { domain: string; m: Mathematician }[] = DOMAINS.filter((d) => !domainId || d.id === domainId).flatMap((d) =>
  d.mathematicians.filter((m) => m.mactutor).map((m) => ({ domain: d.id, m })),
);
let bad = 0;
for (const { domain, m } of figures) {
  const html = await biography(m.mactutor!);
  if (!html) {
    bad++;
    console.log(`✗ ${domain} · ${m.id} : page introuvable (${m.mactutor})`);
    continue;
  }
  const { verdict, detail } = compareYears(m.years, !!m.yearsApprox, parseLifeYears(html));
  if (verdict === 'ok') continue;
  bad++;
  console.log(`✗ ${domain} · ${m.id} : ${detail}`);
}
console.log(`${figures.length} figure(s) contrôlée(s), ${bad} écart(s).`);
process.exit(strict && bad > 0 ? 1 : 0);
