import type { Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';
import type { Period } from '../data/types';

/**
 * Formatage des années de l'atlas. Les années négatives sont des dates avant
 * notre ère : −300 → « 300 av. J.-C. » (FR) / « 300 BC » (EN). Dans une période
 * entièrement antérieure à notre ère, seule la borne de fin porte la mention.
 */
export function formatYear(year: number, lang: Lang, approx = false): string {
  const ca = approx ? UI[lang]['period.ca'] : '';
  if (year < 0) return `${ca}${-year} ${UI[lang]['period.bc']}`;
  return `${ca}${year}`;
}

export function formatPeriod(p: Period | undefined, lang: Lang): string {
  if (!p) return '';
  const ca = p.approx ? UI[lang]['period.ca'] : '';
  const bc = UI[lang]['period.bc'];
  if (p.end === null) return `${ca}${formatYear(p.start, lang)} – ${UI[lang]['period.today']}`;
  if (p.start < 0 && p.end < 0) return `${ca}${-p.start} – ${-p.end} ${bc}`;
  if (p.start < 0) return `${ca}${-p.start} ${bc} – ${p.end}`;
  return `${ca}${p.start} – ${p.end}`;
}

/** Années de vie : « 1777 – 1855 », « ca. 325 – 265 av. J.-C. », « né·e en 1953 ». */
export function formatLifespan(years: [number, number | null], lang: Lang, approx = false): string {
  const ca = approx ? UI[lang]['period.ca'] : '';
  const [birth, death] = years;
  if (death === null) return UI[lang]['panel.born'].replace('{year}', `${ca}${formatYear(birth, lang)}`);
  return `${ca}${formatPeriod({ start: birth, end: death }, lang)}`;
}
