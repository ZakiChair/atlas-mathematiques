import { describe, expect, it } from 'vitest';
import { CONTINENTS, DOMAINS, MAP_SIZE } from '../../data';
import { mapLabel, wrapName } from '../labels';
import { continentLabels } from '../edgeLabelsLayout';

describe('libellés de la carte', () => {
  it('chaque lac porte un nom court : 3 lignes de 15 capitales au plus', () => {
    for (const d of DOMAINS) {
      const lines = wrapName(mapLabel(d));
      expect(lines.length, d.id).toBeLessThanOrEqual(3);
      for (const l of lines) expect(l.length, `${d.id} : « ${l} »`).toBeLessThanOrEqual(15);
    }
  });

  it('nom court : mapName, sinon la partie avant « : »', () => {
    expect(mapLabel({ name: 'Topologie : de l’Analysis situs aux groupes d’homotopie' })).toBe('Topologie');
    expect(mapLabel({ name: 'Analyse fonctionnelle et théorie de la mesure', mapName: 'Analyse fonctionnelle et mesure' })).toBe(
      'Analyse fonctionnelle et mesure',
    );
  });

  it('vue d’ensemble desktop : les cinq champs sont nommés dans la marge, entre titre et frise', () => {
    const [w, h, top, frieze] = [1440, 900, 64, 92];
    const k = Math.min(w / MAP_SIZE.width, (h - top - frieze) / MAP_SIZE.height);
    const v = { k, x: w / 2 - (k * MAP_SIZE.width) / 2, y: top + (h - top - frieze) / 2 - (k * MAP_SIZE.height) / 2, width: w, height: h };
    const labels = continentLabels(v, CONTINENTS, 96, frieze);
    expect(labels.map((l) => l.id)).toEqual(CONTINENTS.map((c) => c.id));
    for (const l of labels) {
      expect(l.pos).toBeGreaterThan(96);
      expect(l.pos).toBeLessThan(h - frieze);
    }
  });
});
