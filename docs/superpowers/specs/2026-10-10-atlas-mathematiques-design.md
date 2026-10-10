# Atlas des mathématiques — spécification de design

Date : 2026-10-10. Statut : implémenté (v0.3, direction « Fleuves et confluences »).

## 1. Intention

Un atlas interactif de l’histoire des mathématiques, dérivé du moteur
d’`atlas-cinema` (typographie Cormorant Garamond + DM Sans), dont la direction
artistique sert la lecture de l’évolution : les champs sont des fleuves qui
grossissent avec le temps et se nourrissent les uns les autres. Le lecteur visé est curieux
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
  philosophie). Chaque continent a une teinte d’aquarelle (`src/map/fieldColors.ts`,
  palettes des domaines régénérées par `scripts/palettes.ts`) : ocre, céruléen,
  violet, terre cuite, vert sauge.

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

Direction artistique « Fleuves et confluences » (v0.3, remplace le « tableau
noir » de la v0.2) : carte ancienne à l’encre et à l’aquarelle sur papier crème.

- **Fleuves** (`rivers.ts`, `RiverLayer.tsx`) : un par champ, de la source (le
  premier domaine du champ) à la « mer » du présent. La ligne médiane passe par
  les lacs du champ triés par abscisse (interpolation monotone) ; la largeur
  traduit le cumul des résultats recensés en amont, d’où un fleuve qui ne fait
  que grossir ; le total est inscrit à l’embouchure. Lit en lavis, berges et
  filets de courant à l’encre de la teinte du champ.
- **Lacs** : les domaines, lavis à bord irrégulier (filtre de bruit, desktop
  seulement), pigment accumulé à la rive, ligne d’eau, rive à l’encre. Le nom
  inscrit est court (`mapName`, sinon la partie du nom avant « : ») ; en vue
  d’ensemble, un plancher de lisibilité l’autorise à déborder du lac.
- **Bassin amont** (`upstream.ts`) : pour le domaine choisi, parcours en largeur
  des liens de filiation et d’influence remontant vers ses sources ; chaque
  génération a son anneau (plein puis pointillé) et ses courants animés bleu de
  Prusse, de plus en plus pâles ; l’aval direct est en sépia. Fiche « En amont » :
  affluents par génération, source la plus ancienne, aval direct.
- **Frise d’activité** (`activity.ts`, `ActivityFrieze.tsx`) : silhouette empilée
  des cinq champs (résultats par tranche d’abscisse, lissés), ères nommées,
  fenêtre synchronisée avec la vue, période du domaine choisi ; clic, glisser ou
  flèches pour se déplacer dans le temps (`panToX` du contrôleur). Elle remplace
  les libellés d’ères en marge ; la vue d’ensemble s’ajuste entre la barre du
  haut et la frise.
- **Récits** : 174 grands résultats portent `context` (« Ce qui y a conduit ») et
  `impact` (« Ce que ça a ouvert »), énoncés typés et sourcés (brief, § 8),
  suivis des repères et liens dérivés du domaine (« Dans l’atlas »).

Quatre **visions** de lecture : fleuves (vue par défaut), filiations & ruptures
(les fleuves pâlissent, les autres liens s’effacent), réseaux de figures (toile
en filigrane), natures de résultats (lacs à l’encre de la nature dominante, voile
sur les autres).

## 6. Validation

`npm run typecheck`, `npm run lint`, `npm test` (validation du corpus, recherche,
layout, fleuves et bassin amont, libellés), `npm run build`, `npm run test:e2e`
(Playwright desktop + mobile, captures dans `e2e/artifacts/`).

## 7. Hors périmètre

Traduction anglaise du corpus, enrichissement externe (portraits Wikidata),
export imprimable.
