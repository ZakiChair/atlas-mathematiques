# Atlas des mathématiques — spécification de design

Date : 2026-10-10. Statut : implémenté (v0.1).

## 1. Intention

Un atlas interactif de l’histoire des mathématiques, dans la direction artistique
de la maison (carte imaginaire sombre, papier et encre, typographie Cormorant
Garamond + DM Sans), dérivé du moteur d’`atlas-cinema`. Le lecteur visé est curieux
et non spécialiste : les énoncés sont donnés en langage courant, les
interprétations historiographiques sont distinguées des faits documentés, et
chaque notice renvoie à des sources réelles.

## 2. Modèle

Quatre niveaux de lecture, révélés par le zoom sémantique :

| Niveau | Objet | Exemple |
| --- | --- | --- |
| 0 | **Domaine** : une tradition, une école ou une branche à une époque | Théorie des nombres de Fermat |
| 1 | **Théorie** : sous-domaine, méthode ou programme | Descente infinie et équations diophantiennes |
| 2 | **Mathématicien·ne** : figure représentative, rattachée à un seul domaine | Pierre de Fermat |
| 3 | **Résultat** : théorème, conjecture, concept, méthode, texte ou problème | Petit théorème de Fermat |

Axes de la carte (`src/data/eras.ts`) :

- **Horizontal : sept ères** — Antiquité (−1800 → 500), Monde médiéval (500 → 1450),
  Renaissance et révolution scientifique (1450 → 1700), Siècle des Lumières
  (1700 → 1800), XIXᵉ siècle (1800 → 1900), Âge des structures (1900 → 1960),
  Contemporain (1960 → aujourd’hui). Bandes d’ères `ERA_BANDS` sur un espace carte
  de 7400 × 4500 unités.
- **Vertical : cinq continents** — Nombres (arithmétique, algèbre), Formes
  (géométrie, topologie), Analyse et mouvement, Hasard et calcul (probabilités,
  statistique, combinatoire, informatique), Fondements (logique, ensembles,
  philosophie). Chaque continent a une famille de teintes : ors et ocres,
  sarcelle et cyan, violets et indigo, roses et corail, verts et sauge.

Années : entiers, négatives avant notre ère, l’année 0 n’existe pas ;
`lib/years.ts` formate « 300 av. J.-C. », « ca. », « aujourd’hui ».

## 3. Régime épistémique

Chaque `Statement` est typé `fait` ou `interpretation` et cite ses sources. Un
fait est datable et documenté (publication, lettre, contenu vérifiable d’un
théorème). Une interprétation est une lecture historiographique, signée quand
c’est possible (« pour André Weil, … »). Les liens entre domaines portent le même
statut ; une affinité est toujours interprétative. Les résultats portent une
nature (`ResultKind`) rendue par un badge coloré : théorème (or), conjecture
(violet), concept (bleu), méthode (vert), texte (orange), problème (rouge).

## 4. Corpus

58 domaines répartis en dix fichiers d’ère (`src/data/domains/*.ts`), écrits en
parallèle à partir du brief éditorial `docs/corpus/BRIEF.md`, qui fixe pour
chaque domaine son identifiant, sa position, sa palette, ses figures canoniques
(définies dans un seul domaine d’attache, réutilisées ailleurs par
`relatedMathematicianIds`) et ses résultats obligatoires. La bibliographie socle
(`CORE_SOURCES`) est complétée par des sources spécialisées propres à chaque
fichier. `validate.ts` (exécuté par `npm test`) vérifie identifiants, références
croisées, bornes chronologiques, présence de faits et d’interprétations, sources.
`scripts/check-era.ts <fichier>` isole les erreurs d’un fichier pendant la rédaction.

## 5. Interface

Reprise du moteur d’atlas-cinema : zoom D3 à seuils absolus, panneau de détail
(desktop) ou feuille (mobile), recherche sans accents (Ctrl/⌘ K), filtres
(période avec années négatives, continents, types de liens, liens transversaux,
faits seulement), légende (liens, niveaux, natures des résultats, énoncés),
méthode, réseau des mathématicien·nes (arcs sur la carte quand une figure est
sélectionnée), URL synchronisée (`#/domaine/:id`, `#/theorie/:id`,
`#/mathematicien/:id`, `#/resultat/:id`), interface FR/EN (corpus FR seulement).

Direction artistique « tableau noir » (v0.2) : ardoise sombre, territoires à la
craie pastel (une teinte par continent, régénérée par `scripts/chalk-palettes.ts`),
hachures d’orientation distincte par continent, titres manuscrits (Kalam) et
annotations (Caveat) ; les panneaux gardent un serif éditorial (Cormorant).
Quatre **visions** de lecture : structure (neutre), filiations & ruptures (les
autres liens s’effacent), réseaux de figures (toile en filigrane), natures de
résultats (territoires colorés par nature dominante, voile sur les autres).
Les fiches résultats ajoutent « Ce qui y a conduit » et « Ce que ça a ouvert »,
dérivés des dates clés et des liens du domaine.

## 6. Validation

`npm run typecheck`, `npm run lint`, `npm test` (validation du corpus, recherche,
layout), `npm run build`, `npm run test:e2e` (Playwright desktop + mobile,
captures dans `e2e/artifacts/`).

## 7. Hors périmètre (v0.1)

Traduction anglaise du corpus, enrichissement externe (portraits Wikidata),
frise chronologique dédiée, export imprimable.
