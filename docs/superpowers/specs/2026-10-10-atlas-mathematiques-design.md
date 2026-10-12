# Atlas des mathématiques — spécification de design

Date : 2026-10-10. Statut : implémenté (v0.4, direction « Galerie » ; socle de la
refonte livré, vagues de corpus 2 à 4 en cours — voir
`docs/superpowers/plans/2026-10-12-refonte-galerie.md`).

## 1. Intention

Un atlas interactif de l’histoire des mathématiques, dérivé du moteur
d’`atlas-cinema` (typographie Fraunces + DM Sans), dont la direction
artistique sert la lecture des lignées et des grandes figures. Le lecteur visé est curieux
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
- **Vertical : cinq champs** — Nombres (arithmétique, algèbre), Formes
  (géométrie, topologie), Analyse et mouvement, Hasard et calcul (probabilités,
  statistique, combinatoire, informatique), Fondements (logique, ensembles,
  philosophie). Chaque champ a une teinte de base (`FIELD_HUE` dans
  `src/map/fieldColors.ts` : nombres 40°, formes 207°, analyse 265°, hasard 14°,
  fondements 140°) déclinée en bande pâle, disques des domaines (palettes
  régénérées par `scripts/palettes.ts`), médailles et frise.

Enrichissements optionnels du modèle (`src/data/types.ts`, détail au § 6 du
dossier de passation) : `Featured` (signature, apports, résultats phares) sur une
grande figure ; `Result.intuition` et `Result.proof` ; `Link.principal` ;
`Mathematician.sources` et `mactutor`. Les seuils de complétude sont fixés par
`COMPLETENESS` (`src/data/completeness.ts`).

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
croisées, bornes chronologiques, présence de faits et d’interprétations, sources,
et les règles de forme nouvelles : signature d’une grande figure de 90 caractères
au plus, 0 ou 2 à 4 apports, 1 à 3 résultats phares attribués à la figure,
intuition de 1 à 2 énoncés, démonstration de 3 à 6 réservée aux théorèmes,
conjectures et problèmes, au plus un lien `principal` par domaine d’arrivée, slug
MacTutor. `completeness.ts` porte les seuils de complétude relevés à la fin de
chaque vague. `scripts/check-era.ts <fichier>` isole les erreurs d’un fichier
pendant la rédaction.

## 5. Interface

Reprise du moteur d’atlas-cinema : zoom D3 à seuils absolus, panneau de détail
(desktop) ou feuille (mobile), recherche sans accents (Ctrl/⌘ K), filtres
(période avec années négatives, champs, « Liens entre domaines », faits
seulement), légende, méthode, réseau des mathématicien·nes (arcs sur la carte
quand une figure est sélectionnée), URL synchronisée (`#/domaine/:id`,
`#/theorie/:id`, `#/mathematicien/:id`, `#/resultat/:id`), interface FR/EN
(corpus FR seulement).

Direction artistique « Galerie » (v0.4) :

- **Planche murale claire** : fond blanc cassé `#fbfaf7` ; cinq bandes de champs
  très pâles `hsl(h 45% 96%)` ; filet entre les bandes, frontières d’ères en
  pointillé, années en filigrane (les ères sont nommées par la frise).
- **Domaines** : disques parfaits sans contour aux palettes régénérées (`fill`
  disque, `stroke` encre du nom, `accent` médaille), qui s’effacent quand on
  zoome dedans ; nom en DM Sans grasse, capitales, 1 à 3 lignes, masqué aux
  niveaux 2 et 3.
- **Grandes figures** : médaille de la couleur `accent` du domaine, initiale
  blanche en Fraunces, nom en Fraunces 600 ; dès le niveau 1, le résultat phare
  et son année sous le nom ; infobulle (nom, années, signature).
- **Figures ordinaires et résultats** : point de 3,5 px et nom en DM Sans ;
  losange de la couleur de la nature, titre et année.
- **Liens** : transmission `#45413a` à pointe pleine, rupture `#b5412a` barrée ;
  amont `#1d5f96`, aval `#9a5b16`.
- **Lignées principales** : par défaut, seuls les ascendants principaux (un par
  domaine, marqué `principal` ou calculé par `lineage.ts`) et les ruptures sont
  tracés ; le survol ou la sélection d’un domaine montre tous ses liens ; les
  affinités ne sont jamais tracées (panneau seulement). Interrupteur de filtres
  « Lignées principales / Tous les liens ».
- **Désencombrement** : positions fixes calculées par `layout.ts`
  (`featuredSlots`, grille `FIGURE_CELL` en quinconce, éventails de résultats) ;
  noms posés à chaque zoom par `declutter.ts` / `LabelLayer.tsx` selon la
  priorité (élément choisi, grandes figures, figures à résultats, résultats,
  fiches courtes), sans jamais se chevaucher ni recouvrir un marqueur ou un
  obstacle.
- **Frise d’activité** (`activity.ts`, `ActivityFrieze.tsx`) : silhouette empilée
  des cinq champs aux couleurs Galerie (résultats par tranche d’abscisse, lissés),
  ères nommées, fenêtre synchronisée avec la vue, période du domaine choisi ;
  clic, glisser ou flèches pour se déplacer dans le temps.
- **Fiches** : grande figure (médaille, signature, « Apports », « Résultats
  phares », biographie, lien MacTutor, réseau) ; résultat (« D’où vient l’idée »,
  « Idée de la démonstration », récits « Ce qui y a conduit » / « Ce que ça a
  ouvert ») ; domaine (« Grandes figures », « Amont et aval »).
- **Interface épurée** : plus de visions ; légende réécrite ; introduction et
  méthode réécrites (clé `atlas.intro.v2`, affichée une fois après la refonte).

Détail : partie II du dossier de passation
`docs/superpowers/plans/2026-10-12-refonte-galerie.md`.

## 6. Validation

`npm run typecheck`, `npm run lint`, `npm test` (validation du corpus, complétude,
recherche, layout — grille, emplacements des grandes figures, corpus réel sans
chevauchement —, désencombrement, métriques des noms, lignées, amont et aval,
libellés, lecture MacTutor), `npm run build`, `npm run test:e2e` (Playwright
desktop + mobile, captures dans `e2e/artifacts/` ; dont les quatre points de
vigilance : noms sans chevauchement, résultat phare d’un autre domaine, anglais,
faits seulement).

## 7. Hors périmètre

Traduction anglaise du corpus, portraits, export imprimable, démonstrations
formelles (LaTeX), désencombrement des libellés de liens.
