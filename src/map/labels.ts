import type { Domain } from '../data/types';

const MAX_LINE = 15;
const MAX_LINES = 3;

/** Coupe un texte en lignes ≤ maxLine caractères (aux espaces), maxLines max. */
export function wrapWords(text: string, maxLine: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLine) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    head.push(lines.slice(maxLines - 1).join(' '));
    return head;
  }
  return lines;
}

/** Coupe le nom en lignes ≤ ~15 caractères (aux espaces), 3 lignes max. */
export function wrapName(name: string): string[] {
  return wrapWords(name.toUpperCase(), MAX_LINE, MAX_LINES);
}

/** Nom inscrit dans le lac : `mapName`, sinon la partie du nom avant « : ». */
export function mapLabel(domain: Pick<Domain, 'name' | 'mapName'>): string {
  return domain.mapName ?? domain.name.split(' : ')[0].trim();
}

/** Nom court d'une théorie pour la carte : la partie avant « : » (le détail reste dans le panneau). */
export function shortTheoryName(name: string): string {
  return name.split(' : ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
}
