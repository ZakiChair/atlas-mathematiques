import type { Source } from './types';
import { CORE_SOURCES } from './sources-core';
import { SOURCES_ANTIQUITE } from './domains/antiquite';
import { SOURCES_MEDIEVAL } from './domains/medieval';
import { SOURCES_RENAISSANCE } from './domains/renaissance';
import { SOURCES_LUMIERES } from './domains/lumieres';
import { SOURCES_DIXNEUVIEME_A } from './domains/dixneuvieme-a';
import { SOURCES_DIXNEUVIEME_B } from './domains/dixneuvieme-b';
import { SOURCES_STRUCTURES_A } from './domains/structures-a';
import { SOURCES_STRUCTURES_B } from './domains/structures-b';
import { SOURCES_CONTEMPORAIN_A } from './domains/contemporain-a';
import { SOURCES_CONTEMPORAIN_B } from './domains/contemporain-b';

/**
 * Registre des sources. Les identifiants sont référencés par les domaines,
 * les énoncés et les liens. Le socle (sources-core.ts) rassemble les histoires
 * générales et les recueils de textes ; chaque fichier d'ère ajoute ses
 * sources spécialisées (monographies, articles, éditions de textes).
 */
export { CORE_SOURCES };

export const SOURCES: Source[] = [
  ...CORE_SOURCES,
  ...SOURCES_ANTIQUITE,
  ...SOURCES_MEDIEVAL,
  ...SOURCES_RENAISSANCE,
  ...SOURCES_LUMIERES,
  ...SOURCES_DIXNEUVIEME_A,
  ...SOURCES_DIXNEUVIEME_B,
  ...SOURCES_STRUCTURES_A,
  ...SOURCES_STRUCTURES_B,
  ...SOURCES_CONTEMPORAIN_A,
  ...SOURCES_CONTEMPORAIN_B,
];

export const SOURCE_BY_ID: Record<string, Source> = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
