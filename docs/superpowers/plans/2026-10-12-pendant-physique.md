# Avenant — résultats clés et pendant physique

Demande du propriétaire (2026-10-12, après les vagues 2–4) : « mettre plus en
avant certains résultats clés et créer le pendant en physique pour comprendre
les interconnexions entre les maths et la physique ».

Arbitrages validés :

- **Forme** : 6ᵉ continent « Physique » sur la même carte (bande sous
  Fondements, hauteur 900, MAP_SIZE 7400 × 5400). Les arcs d'influence
  maths → physique traversent les champs — c'est le cœur de la demande.
- **Périmètre** : ~15 domaines physiques, ~120 figures physicien·nes, mêmes
  schémas que les maths (fiches courtes vérifiées MacTutor, récits
  contexte/portée sourcés, théories, résultats).
- **Résultats clés** : flag `Result.major` — une trentaine éditoriale **plus**
  les résultats phares des 43 grandes figures (déjà désignés) ; rendu en gros
  losange avec titre dès le niveau 2, badge dans la fiche.
- **Physicien·nes** : figures à part entière dans leurs domaines physiques ;
  celles déjà dans l'atlas sont réutilisées par `relatedMathematicianIds`.

## Tâches

### 5.0 Socle technique
- `ContinentId` += `'physique'` ; `CONTINENTS` += bande y0 4500 → y1 5400,
  laneY 4950 ; `MAP_SIZE.height` = 5400 ; `FIELD_HUE.physique` = 175.
- `Result.major?: boolean` ; validation (facultatif, aucune contrainte).
- `src/data/domains/physique-a.ts`, `physique-b.ts`, `physique-c.ts` créés
  (répartition par période, voir § 5.3) ; chargement dans `index.ts`.
- Palettes régénérées (`npx tsx scripts/palettes.ts`) pour les nouveaux
  domaines une fois écrits.

### 5.1 Résultats clés
- Liste éditoriale ~30 (validation propriétaire dans la PR).
- `major: true` posé dans les fichiers d'ère.
- Carte : losange `major` ou phare de grande figure ×1.5, titre posé dès le
  niveau 2 (les autres au niveau 3, inchangé) ; le désencombrement garde la
  priorité au `major` en cas de conflit de nom.
- Fiche résultat : pastille « résultat majeur ».
- Tests : rendu niveau 2, pas de régression e2e.

### 5.2 Domaines physiques (squelettes)
Quinze domaines, écrits par ère dans trois fichiers :

| Fichier | Domaines |
|---|---|
| `physique-a.ts` (av. J.-C. → 1700) | `optique-antique-et-medievale` (Euclide, Alhazen, Grosseteste, Peckham) ; `astronomie-mathematique` (Ptolémée → Copernic, Brahe, Kepler) ; `mecanique-impetus-et-galilee` (Buridan, Oresme, Stevin, Galilée, Torricelli) |
| `physique-b.ts` (1700 → 1900) | `mecanique-celeste` (Clairaut, Lagrange, Laplace, Le Verrier) ; `ondes-et-acoustique` (corde vibrante, Chladni, Doppler) ; `electricite-et-electromagnetisme` (Franklin, Coulomb, Volta, Ørsted, Ampère, Faraday, Maxwell, Heaviside, Hertz) ; `thermodynamique-et-mecanique-statistique` (Carnot, Joule, Kelvin, Clausius, Boltzmann, Gibbs) ; `optique-ondulatoire` (Young, Fresnel, Foucault, Fizeau) |
| `physique-c.ts` (1900 → auj.) | `relativite-et-gravitation` (Einstein, Minkowski, Schwarzschild, Friedmann, Eddington) ; `mecanique-quantique` (Planck, Einstein, Bohr, de Broglie, Heisenberg, Schrödinger, Dirac, Pauli, Born) ; `rayonnement-et-particules` (Röntgen, Becquerel, Curie, Rutherford, Fermi) ; `theorie-quantique-des-champs` (Feynman, Schwinger, Tomonaga, Dyson, Yang, Lee, Weinberg, 't Hooft) ; `physique-statistique-et-matiere-condensee` (Landau, Onsager, Kadanoff, Wilson, Anderson, Parisi) ; `gravitation-et-cosmologie` (Lemaître, Hoyle, Penzias-Wilson, Hawking, Rubin) ; `chaos-physique-et-non-lineaire` (Lorenz, Ruelle, Feigenbaum, Prigogine) |

Chaque domaine : tagline, summary, methods/context/debates sourcés, 2–4
théories, 4–8 résultats physiques avec contexte/portée, `keyDates`,
`relatedMathematicianIds` (figures déjà dans l'atlas : Newton, Maxwell,
Poincaré, Noether, Minkowski…), liens entrants/sortants documentés.

### 5.3 Figures physicien·nes
~120 au total (8–10 par domaine), fiches courtes du modèle § 11 du brief
(bio ≤ 280 car., années MacTutor, slug, `sources: ['mactutor']`), dans
`src/data/figures/physique-a/b/c.ts`. Les physicien·nes déjà figures de
l'atlas ne sont **pas** redéfinis (`relatedMathematicianIds`).

### 5.4 Interconnexions
- Liens de domaines maths → physique et retour (filiation/influence, labels
  explicites : « l'analyse sert le ciel », « la mesure fait la statistique ») ;
  au plus un `principal` par domaine d'arrivée, y compris côté physique.
- Liens de figures croisés (Hilbert ↔ Einstein, Ricci/Grossmann → Einstein,
  Noether → relativité, Wigner → groupes, Itô/Wiener → physique statistique…).
- Quelques grandes figures physiques candidates aux médailles (Newton déjà
  grande figure ; Maxwell, Einstein, Curie, Dirac proposés — validation
  éditoriale).

### 5.5 Verrous et vérifications
- README et brief § 12 mis à jour ; stats régénérées.
- `mactutor --strict` étendu aux domaines physiques ; écarts consignés.
- Suite complète : typecheck, lint, test, build, e2e.
- Densité : niveau 3 sur les domaines physiques les plus denses.
- PR `pendant-physique` → `vagues-corpus` (ou `main` si #2 fusionnée).
