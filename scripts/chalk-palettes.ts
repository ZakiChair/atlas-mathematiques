/**
 * Régénère les palettes des 58 domaines pour la DA « ardoise et craie » :
 * une teinte pastel de craie par continent, avec une variation déterministe
 * par domaine (hachage de l'id). Réécrit le littéral `palette: { … }` dans
 * les fichiers d'ère ET dans docs/corpus/BRIEF.md (source de vérité).
 *
 * Usage : npx tsx scripts/chalk-palettes.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { DOMAINS } from '../src/data';
import type { ContinentId } from '../src/data/types';

const HUE: Record<ContinentId, number> = {
  nombres: 45, // jaune craie
  formes: 200, // bleu craie
  analyse: 275, // violet craie
  hasard: 22, // orange craie
  fondements: 130, // vert craie
};

/** Petit hachage stable (FNV-1a) pour un jitter déterministe. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function hsl(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface Palette {
  fill: string;
  stroke: string;
  accent: string;
}

function chalkPalette(id: string, continent: ContinentId): Palette {
  const j = hash(id);
  const dh = (j % 17) - 8; // ±8° de teinte
  const dl = ((j >> 5) % 7) - 3; // ±3 points de luminosité sur le trait
  const h = HUE[continent] + dh;
  return {
    fill: hsl(h, 24, 12),
    stroke: hsl(h, 42, 71 + dl),
    accent: hsl(h, 62, 85 + dl),
  };
}

// ——— calcul des palettes ———
const palettes = new Map<string, Palette>();
for (const d of DOMAINS) {
  palettes.set(d.id, chalkPalette(d.id, d.continents[0]));
}

// ——— application aux fichiers d'ère ———
const ERA_FILES = [
  'antiquite',
  'medieval',
  'renaissance',
  'lumieres',
  'dixneuvieme-a',
  'dixneuvieme-b',
  'structures-a',
  'structures-b',
  'contemporain-a',
  'contemporain-b',
];
const PALETTE_RE = /palette: \{ fill: '#[0-9a-f]{6}', stroke: '#[0-9a-f]{6}', accent: '#[0-9a-f]{6}' \}/;

let appliedData = 0;
for (const f of ERA_FILES) {
  const path = `src/data/domains/${f}.ts`;
  let text = readFileSync(path, 'utf8');
  for (const [id, p] of palettes) {
    const marker = `id: '${id}',`;
    const at = text.indexOf(marker);
    if (at === -1) continue;
    const rest = text.slice(at);
    const m = PALETTE_RE.exec(rest);
    if (!m) throw new Error(`palette introuvable pour ${id} dans ${path}`);
    const next = `palette: { fill: '${p.fill}', stroke: '${p.stroke}', accent: '${p.accent}' }`;
    text = text.slice(0, at) + rest.slice(0, m.index) + next + rest.slice(m.index + m[0].length);
    appliedData++;
  }
  writeFileSync(path, text);
}

// ——— application au brief ———
const briefPath = 'docs/corpus/BRIEF.md';
const lines = readFileSync(briefPath, 'utf8').split('\n');
let appliedBrief = 0;
for (let i = 0; i < lines.length; i++) {
  const head = /^\*\*`([a-z0-9-]+)`\*\*/.exec(lines[i]);
  if (!head) continue;
  const p = palettes.get(head[1]);
  if (!p) continue;
  if (!PALETTE_RE.test(lines[i])) throw new Error(`palette introuvable dans le brief pour ${head[1]}`);
  lines[i] = lines[i].replace(PALETTE_RE, `palette: { fill: '${p.fill}', stroke: '${p.stroke}', accent: '${p.accent}' }`);
  appliedBrief++;
}
writeFileSync(briefPath, lines.join('\n'));

console.log(`palettes craie appliquées : ${appliedData} domaines (données), ${appliedBrief} lignes (brief)`);
for (const c of Object.keys(HUE) as ContinentId[]) {
  const n = DOMAINS.filter((d) => d.continents[0] === c).length;
  console.log(`  ${c} : ${n} domaines, teinte de base ${HUE[c]}°`);
}
