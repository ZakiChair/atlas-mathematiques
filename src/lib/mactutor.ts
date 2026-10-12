/**
 * Lecture des années de naissance et de mort d'une biographie MacTutor
 * (https://mathshistory.st-andrews.ac.uk/Biographies/<slug>/). La page porte
 * `<dt>Born</dt><dd>15 April 1707 <br/> …` et `<dt>Died</dt><dd>…` ; formes
 * rencontrées : « about 325 BC », « March 415 », « 10 June 0940 », « 598 ».
 */
export interface LifeYear {
  year: number;
  approx: boolean;
}

export interface LifeYears {
  born: LifeYear | null;
  died: LifeYear | null;
}

function field(html: string, label: 'Born' | 'Died'): string | null {
  const m = html.replace(/\s+/g, ' ').match(new RegExp(`<dt>\\s*${label}\\s*</dt>\\s*<dd>([^<]*)`));
  return m ? m[1].trim() : null;
}

/** « about 325 BC » → −325 (approx), « 10 June 0940 » → 940, « March 415 » → 415. */
export function parseYear(text: string): LifeYear | null {
  const m = text.match(/(about|c\.|circa)?\s*(?:\d{1,2}(?:st|nd|rd|th)?\s+)?(?:[A-Z][a-z]+\s+)?(\d{1,4})\s*(BC)?/);
  if (!m) return null;
  const n = Number(m[2]);
  if (!Number.isFinite(n) || n === 0) return null;
  return { year: m[3] ? -n : n, approx: !!m[1] };
}

export function parseLifeYears(html: string): LifeYears {
  const b = field(html, 'Born');
  const d = field(html, 'Died');
  return { born: b ? parseYear(b) : null, died: d ? parseYear(d) : null };
}

export type Verdict = 'ok' | 'ecart' | 'manquant';

/**
 * Compare les années de l'atlas à celles de MacTutor. Tolérance : 0 an pour deux
 * dates précises, 15 ans si l'une des deux est approximative. Un vivant de l'atlas
 * (mort = null) doit être sans date de mort chez MacTutor, et réciproquement.
 */
export function compareYears(atlas: [number, number | null], approx: boolean, mt: LifeYears): { verdict: Verdict; detail: string } {
  if (!mt.born) return { verdict: 'manquant', detail: 'naissance illisible sur MacTutor' };
  const tol = (a: boolean) => (approx || a ? 15 : 0);
  const msgs: string[] = [];
  if (Math.abs(atlas[0] - mt.born.year) > tol(mt.born.approx)) msgs.push(`naissance ${atlas[0]} ≠ ${mt.born.year}`);
  if (atlas[1] === null && mt.died) msgs.push(`vivant·e dans l’atlas, mort·e en ${mt.died.year} sur MacTutor`);
  if (atlas[1] !== null && !mt.died) msgs.push(`mort·e en ${atlas[1]} dans l’atlas, sans date de mort sur MacTutor`);
  if (atlas[1] !== null && mt.died && Math.abs(atlas[1] - mt.died.year) > tol(mt.died.approx)) msgs.push(`mort ${atlas[1]} ≠ ${mt.died.year}`);
  return msgs.length ? { verdict: 'ecart', detail: msgs.join(' ; ') } : { verdict: 'ok', detail: '' };
}
