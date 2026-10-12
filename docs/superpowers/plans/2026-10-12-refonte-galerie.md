# Refonte « Galerie » de l’Atlas des mathématiques — dossier de passation

> **Pour l’agent exécutant (Devin).** Ce fichier contient tout ce qu’il faut pour finir le projet : le contexte, les décisions du propriétaire (Zaki), la spécification, le plan tâche par tâche, le contenu déjà rédigé et vérifié, et, en annexe D, **le code du sous-projet 1 sous forme de correctif déjà testé** (typecheck, lint, 58 tests unitaires et 44 tests de bout en bout au vert sur une copie du dépôt).
> Exécuter les tâches **dans l’ordre**, en cochant les cases `- [ ]`. **Chaque tâche se termine par les vérifications indiquées et par un commit.** Ne jamais passer outre une vérification qui échoue. Dans les cas marqués **POINT D’ARRÊT**, demander l’avis du propriétaire avant de continuer.
> Avec Claude Code et les compétences *superpowers*, utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans`.

**Objectif :** remplacer la DA « Fleuves et confluences » par la DA **« Galerie »**, plus claire. On simplifie les liens entre courants (un ascendant principal par domaine), on met en avant une quarantaine de **grandes figures** (médaille sur la carte, phrase-signature, apports, résultats phares). On ajoute l’**intuition** et l’**idée de la démonstration** d’environ 260 résultats, et on porte l’atlas à environ **1 200 figures** vérifiées sur MacTutor.

**Architecture :** le moteur React + D3 est conservé : carte temps × champs, zoom sémantique à quatre niveaux, panneau ou feuille. Le rendu est refait :
- les domaines deviennent des disques pâles ;
- les médailles et **tous les noms de points** (figures, résultats) passent par une couche unique qui les **désencombre en espace écran à chaque zoom**, sans aucun chevauchement ;
- les liens se réduisent à deux styles (transmission, rupture) et, par défaut, aux lignées principales.

Le schéma de données s’enrichit de champs optionnels, contrôlés en permanence par `validate.ts` (forme). Des **seuils de complétude** sont relevés à la fin de chaque vague de corpus.

**Pile :** React 19, Vite 8, TypeScript 6, D3 7, Tailwind 4, Vitest 5, Playwright, oxlint. Polices : Fraunces (titres, noms) et DM Sans (texte, étiquettes), via `@fontsource`.

**Spécification :** partie II de ce document. Elle remplace la direction artistique décrite au § 5 de `docs/superpowers/specs/2026-10-10-atlas-mathematiques-design.md`.

---

## Contraintes globales

Elles s’appliquent à **toutes** les tâches.

- Langue du code, des commentaires et du corpus : **français**. Interface FR/EN (`src/i18n/ui.ts`) ; le corpus n’est pas traduit (repli automatique sur le français).
- Lire `AGENTS.md` et `docs/corpus/BRIEF.md` (§ 1 à 4 et § 8) avant toute modification de données.
- **Jamais de source, de date ni de citation inventée.** Tout énoncé nouveau est un `Statement` typé `fait` ou `interpretation` et cite au moins une source **existant** dans le registre (`src/data/sources-core.ts`, ou le `SOURCES_X` du fichier d’ère). En cas de doute : `approx: true` ou `yearsApprox: true`, « vers », ou omission. On n’ajoute une source au registre que si elle existe réellement (auteur, titre, année, éditeur vérifiables).
- Typographie : apostrophe ’, guillemets « », espace avant « : » et « ; », siècles en « XIXᵉ siècle ». Années : entiers, négatives avant notre ère, **jamais 0**.
- Identifiants : slugs `minuscules-et-tirets`, uniques par type dans tout l’atlas. Une figure est définie dans **un seul** domaine (ailleurs : `relatedMathematicianIds`).
- Bornes du schéma (vérifiées par `validate.ts`) :
  - signature d’une grande figure : 90 caractères au plus ;
  - apports : 0 ou 2 à 4 (0 tant que la vague 2 n’est pas passée) ;
  - résultats phares : 1 à 3, attribués à la figure ;
  - intuition : 1 à 2 énoncés, sans objet pour un `texte` ;
  - démonstration : 3 à 6 étapes, réservée à `theoreme`, `conjecture`, `probleme` ;
  - au plus un lien `principal` par domaine d’arrivée, sur une filiation ou une influence.
- Grandes figures : **2 au plus par domaine**, sinon les médailles se chevauchent en vue d’ensemble.
- Niveaux de zoom inchangés : `LEVEL_K = [0.36, 1.0, 1.8]` (`src/map/viewStore.ts`).
- À la fin de chaque tâche : `npm run typecheck` (0 erreur, sauf exception écrite dans la tâche), `npm run lint` (0 erreur ; les avertissements existants sont tolérés), `npm test`. Plus `npm run test:e2e` quand la tâche le demande.
- Ne pas éditer à la main `e2e/artifacts/` ni `dist/`. Le dossier `.superpowers/` (maquettes) est ignoré par git.

## Points de vigilance

Ce sont les entrées les plus susceptibles de casser. Chacune est épinglée par un test dans la tâche indiquée.

1. **Chevauchement des noms** sur un écran moyen ou sur mobile, en vue d’ensemble. Aucun nom ne doit en recouvrir un autre ; une médaille sans nom garde son infobulle et son `aria-label`. Tests : `src/map/__tests__/declutter.test.ts` (tâche 1.2) et e2e « les noms des grandes figures ne se chevauchent pas » (tâche 1.4).
2. **Résultat phare situé dans un autre domaine** que la figure (Euler → « Les sept ponts de Königsberg », dans *Géométrie des Lumières*). Le clic doit ouvrir la bonne fiche et voler vers le bon domaine. Tests : validation (tâche 1.1) et e2e (tâche 1.4).
3. **Langue anglaise.** Signature, apports, intuitions et démonstrations retombent sur le français sans planter ; les titres de sections sont traduits. Test e2e (tâche 1.4).
4. **« N’afficher que les faits ».** Une signature typée `interpretation` (Fermat) disparaît, le nom reste ; les liens interprétatifs quittent la carte, sauf ceux de l’amont et de l’aval. Test e2e (tâche 1.4).
5. **Fiche courte** (figure sans résultat, vague 4). Elle a son point au niveau 2, son nom au niveau 3, une fiche lisible (biographie, lien MacTutor, domaine), et ne casse rien si `theoryId` est absent. Test : `src/data/__tests__/figures.test.ts` (tâche 4.2).

Limite connue, acceptée : les **libellés de liens**, affichés seulement pour le domaine choisi, ne participent pas au désencombrement et peuvent toucher un nom. À reprendre plus tard si besoin.

---

# Partie I — Contexte

## 1. Point de départ

- `main` contient la v0.3 « Fleuves et confluences » (commit `1a105be`) :
  - 58 domaines, 176 théories, 428 figures, 647 résultats, 182 liens entre domaines, 148 liens entre figures, 223 sources ;
  - une vue d’ensemble où les 182 liens forment une toile dense ;
  - des figures qui n’apparaissent qu’au niveau 2, en points de 5 px tous identiques.
- Le working tree du propriétaire contenait une refonte **inachevée**, « Lignées » : bandes, portées, liens généalogiques, aval sur plusieurs générations, `BasinSection`. Elle n’était pas commitée, le typecheck échouait avec 7 erreurs et son CSS n’avait jamais été écrit. **Ce travail est la base du correctif** (annexe D) : il doit être commité sur la branche de travail avant de commencer (tâche 1.0). Le correctif en réutilise l’aval multi-générations, le panneau « Amont et aval » et le tracé des liens qui évite les disques.

## 2. Demande du propriétaire

Mots du propriétaire, dans l’ordre :

> « Revoie entièrement la DA du projet en simplifiant les liens entre les courants mathématiques, en mettant plus en avant certains mathématiciens, avec leurs grands résultats et ce qu’ils ont pu apporter. »
>
> « Parfait, cette DA est plus claire [la DA « Galerie »]. Ajoute les démonstrations des résultats et/ou ce qui a permis de les intuiter, complète avec énormément plus de mathématiciens. »

## 3. Décisions validées par le propriétaire

| Sujet | Décision |
|---|---|
| DA | **Galerie** : planche murale claire ; domaines en disques pâles sans contour ; grandes figures en **médailles** à leur initiale, avec nom et résultat phare ; lignées en traits fins à pointe. (Alternatives écartées : « Constellations », fond nuit ; « Frise des vies », lignes de vie à la Priestley.) |
| Place des figures | Premier plan : environ 40 grandes figures **visibles dès la vue d’ensemble** ; les autres figures apparaissent au zoom. |
| Sélection | **Liste éditoriale** (annexe A), équilibrée entre ères, champs et aires culturelles, inscrite dans les données (champ `featured`) et dans le brief. |
| Apports | Pour chaque grande figure : une **phrase-signature** (affichée sur la carte et dans la fiche), **2 à 4 énoncés « Apports »** typés et sourcés, **1 à 3 résultats phares**. |
| Liens | **Lignées principales** : par défaut, un seul lien entrant par domaine (son ascendant principal) plus les ruptures. Deux styles seulement : transmission et rupture. Survoler ou choisir un domaine montre tous ses liens. Affinités et statut fait / interprétation : dans le panneau. |
| Interface | On **épure** : les quatre « Visions » sont supprimées, remplacées par l’interrupteur « Lignées principales / Tous les liens » dans les filtres. On garde la frise d’activité, l’amont et l’aval à la sélection, les filtres et la recherche. |
| Démonstrations | Pour environ **260 résultats** (tous les théorèmes, conjectures et problèmes) : « **D’où vient l’idée** » (1 à 2 énoncés) et « **Idée de la démonstration** » (3 à 6 étapes en langage courant), typés et sourcés. |
| Figures | Environ **1 200 au total** (environ 800 de plus), en **fiches courtes vérifiées** : nom, années, lieu, bio de 1 à 2 phrases, domaine, slug MacTutor contrôlé par script. Aucun résultat obligatoire. |
| Stratégie | **Le socle d’abord** (sous-projet 1 : schéma, DA, carte, fiches), **puis trois vagues de corpus** (2 : apports ; 3 : démonstrations ; 4 : figures), chacune validée et commitée séparément. |

## 4. Ce qui a déjà été vérifié

Le sous-projet 1 a été prototypé sur une copie isolée du dépôt (working tree « Lignées » compris), avec les résultats suivants :

- **Typecheck** à 0 erreur, **lint** sans erreur, **58 tests unitaires** (54 pour le socle, plus 4 pour les fiches courtes).
- **44 tests e2e** au vert, desktop et mobile, avec les données d’exemple insérées.
- La règle des **ascendants principaux** donne 54 lignées sur le corpus actuel. Les 4 sources (domaines sans ascendant) sont `calcul-des-scribes`, `logique-antique`, `mathematiques-chinoises-anciennes` et `querelle-des-infiniment-petits`. Avec les 10 ruptures, la vue d’ensemble trace **64 liens au lieu de 182**.
- Sur un domaine fictif de 42 figures (2 grandes, 12 à résultats, 28 fiches courtes), le **désencombrement** ne produit aucun chevauchement à aucun zoom, et affiche :

  | Zoom | Grandes figures | Figures à résultats | Fiches courtes |
  |---|---|---|---|
  | k = 1,4 | 100 % | 92 % | 71 % |
  | k = 1,8 | 100 % | 100 % | 96 % |
  | k ≥ 2,6 | 100 % | 100 % | 100 % |

- Le **contrôle MacTutor** lit les formats de dates réels (« about 325 BC », « March 415 », « 10 June 0940 », personne vivante) et accepte les slugs à parenthèses (`Bernoulli_Nicolaus(II)`). Il signale déjà un écart réel dans le corpus : **Brahmagupta**, mort en 668 selon l’atlas, en 670 selon MacTutor. Un écart se **signale au propriétaire**, il ne se corrige pas d’office.
- Les **43 signatures** de l’annexe A tiennent en 90 caractères au plus, citent des sources du registre, et leurs résultats phares existent et sont attribués à la bonne figure.

---

# Partie II — Spécification

## 5. Découpage et ordre

1. **Sous-projet 1 — Socle** (code) : schéma, validation, complétude, lignées, DA Galerie, désencombrement, fiches, e2e ; plus la liste des grandes figures et trois exemples complets de démonstration.
2. **Vague 2 — Apports** des grandes figures (42 restantes ; Euler est rédigé).
3. **Vague 3 — Intuitions et démonstrations** (260 restantes sur 263).
4. **Vague 4 — Fiches courtes** (environ 800 ; cible de 1 224 figures) et contrôle MacTutor.

Recommandation : fusionner le socle dans `main`, puis ouvrir une PR par vague. Les vagues 3 et 4 se découpent par fichier d’ère et peuvent avancer en parallèle (fichiers indépendants).

## 6. Modèle de données

```ts
// src/data/types.ts — ajouts (tous optionnels : le corpus actuel reste valide)
interface Mathematician {
  // … champs existants
  featured?: Featured;      // grande figure
  sources?: string[];       // références biographiques (registre), p. ex. ['mactutor']
  mactutor?: string;        // slug : https://mathshistory.st-andrews.ac.uk/Biographies/<slug>/
}
interface Featured {
  signature: Statement;          // son apport en une ligne, 90 caractères au plus
  contributions: Statement[];    // « Apports » : 2 à 4 (vide tant que la vague 2 n’est pas passée)
  headlineResultIds: string[];   // 1 à 3 résultats de la figure ; le premier s’affiche sur la carte
}
interface Result {
  // … champs existants
  intuition?: Statement[];  // « D’où vient l’idée » : 1 à 2
  proof?: Statement[];      // « Idée de la démonstration » : 3 à 6 étapes
}
interface Link {
  // … champs existants
  principal?: true;         // ascendant principal choisi à la main
}
```

**Forme** (`src/data/validate.ts`, bloquante en permanence) : bornes de la section « Contraintes globales », énoncés typés et sourcés dans le registre, résultats phares existants et attribués à la figure (le résultat peut vivre dans un autre domaine), slug MacTutor au format `^[A-Za-z0-9_'()-]+$`.

**Complétude** (`src/data/completeness.ts`, objet `COMPLETENESS`, test `src/data/__tests__/completeness.test.ts`) : des seuils relevés à la fin de chaque sous-projet ou vague.

| Seuil | Initial | Après |
|---|---|---|
| `featuredMin` | 0 | 40 (tâche 1.3) |
| `contributionsRequired` | `false` | `true` (tâche 2.7) |
| `proofsCoverage` | 0 | 1 (tâche 3.11). Un théorème doit avoir intuition et démonstration ; une conjecture ou un problème, une intuition. |
| `mathematiciansMin` | 428 | 1 150 (tâche 4.14) |
| `mactutorCoverage` | 0 | 0,85 (tâche 4.14) |

**Calculé, sans saisie :**
- l’ascendant principal (`src/map/lineage.ts`, `principalLinks`). Règle : un lien marqué `principal` l’emporte ; sinon filiation avant influence, fait avant interprétation, même champ principal avant champ différent, source la plus récente, puis ordre alphabétique de la source (résultat indépendant de l’ordre des données) ;
- le niveau où apparaît le nom d’une figure (`ChildPos.nameLevel` : 2 si elle a des résultats, 3 sinon).

**Rangement :**
- la grande figure se décrit sur l’objet de la figure, dans son fichier d’ère ;
- les fiches courtes vont dans `src/data/figures/<ère>.ts` (objet `{ [domainId]: Mathematician[] }`), fusionnées au chargement (tâche 4.2) ;
- la liste des grandes figures et les chartes de rédaction entrent dans `docs/corpus/BRIEF.md` (tâche 1.5).

## 7. DA « Galerie »

- **Fond** `#fbfaf7`. Cinq **bandes** de champs très pâles : `hsl(h 45% 96%)` avec `h` = nombres 40, formes 207, analyse 265, hasard 14, fondements 140 (`FIELD_HUE`). Filet `#e2ddd2` entre les bandes ; frontières d’ères en pointillé `#d8d2c6` ; quelques années en filigrane `#9a9284`. Les ères sont nommées par la frise, pas sur la carte.
- **Domaines** : disques parfaits sans contour. Palettes régénérées par `scripts/palettes.ts` (formule « Galerie » : `fill` = disque, `stroke` = encre du nom, `accent` = médaille). Le disque s’efface (`fill-opacity: .45`) quand on zoome dedans (niveaux 2 et 3).
- **Nom d’un domaine** : DM Sans grasse, capitales, interlettrage 0,06 em, 1 à 3 lignes de 15 capitales au plus. Taille d’écran proportionnelle au disque et bornée entre 8 et 15 px (`domainNameMetrics`). En haut du disque, encore plus haut au niveau 1, masqué aux niveaux 2 et 3.
- **Médaille** d’une grande figure : disque de la couleur `accent` du domaine, filet extérieur, initiale blanche en Fraunces (première lettre de l’identifiant). Rayon : il suit le zoom en vue d’ensemble (entre 3,5 et 7 px), 10 px ensuite. Nom en Fraunces 600, 13 px ; dès le niveau 1, le résultat phare et son année en DM Sans 10 px sous le nom. Infobulle : nom, années, signature.
- **Figure ordinaire** : point de 3,5 px (blanc cassé, filet de l’encre du domaine), nom en DM Sans 12 px.
- **Résultat** : losange de la couleur de sa nature (`KIND_INK`), titre et année en DM Sans 11 px.
- **Liens** : transmission en `#45413a` (1,3 px) avec pointe pleine à l’arrivée ; rupture en sanguine `#b5412a` (1,6 px) barrée en son milieu. Amont en bleu de Prusse `#1d5f96`, aval en sépia `#9a5b16`, traits animés dans le sens de la transmission.
- **Interface** : cartes blanches `#fffefb`, filet `#e2ddd2`, rayon 12 px, ombre légère, sans flou d’arrière-plan. Accent `#1d5f96`. Titres de sections en Fraunces 600.

## 8. La carte, niveau par niveau

| Niveau (k absolu) | Visible |
|---|---|
| 0 · Domaines (< 0,36) | bandes, disques et noms des domaines, médailles et noms des grandes figures (désencombrés), lignées principales et ruptures |
| 1 · Théories (0,36 – 1) | + noms des théories (Fraunces italique 15 px) ; les grandes figures gagnent leur résultat phare |
| 2 · Mathématiciens (1 – 1,8) | + points des figures ordinaires ; noms des figures à résultats ; plus de noms de domaines ni de théories |
| 3 · Résultats (≥ 1,8) | + losanges des résultats et leurs titres ; noms des fiches courtes |

Ordre des couches : fond → liens entre domaines → arcs entre figures (figure choisie) → disques et marqueurs (`Territory`) → médailles et noms (`LabelLayer`).

## 9. Lignées

- **Par défaut** : les ascendants principaux (54) et les ruptures (10), opacité 0,55 (ruptures 0,4).
- **Survol d’un domaine** : tous ses liens de transmission et de rupture apparaissent (0,9).
- **Domaine choisi** : tous ses liens à pleine opacité avec leur libellé ; amont et aval colorés de génération en génération, d’autant plus pâles qu’ils sont lointains ; les autres liens presque effacés.
- **Filtres** : « Lignées principales / Tous les liens ». « Tous les liens » montre les 160 transmissions et ruptures ; les **affinités ne sont jamais tracées** (elles sont dans le panneau). « N’afficher que les faits » retire les liens interprétatifs, sauf ceux de l’amont et de l’aval.
- **Panneau du domaine** : liens regroupés en « Transmissions reçues », « Transmissions données », « Ruptures » et « Affinités », avec badge fait / interprétation et étiquette « lignée principale ».

## 10. Grandes figures et noms : désencombrement

- **Positions fixes** (`src/map/layout.ts`), calculées une fois :
  - les grandes figures sont placées dans la moitié basse du disque (`featuredSlots` : une au centre-bas, deux en colonne) ;
  - chaque figure ordinaire reçoit une case d’une grille fine en quinconce (`FIGURE_CELL` 46 × 22), la plus proche de sa théorie : les figures à résultats d’abord, puis les fiches courtes (`gridCells`, `assignCells`) ;
  - les résultats sont posés en éventail sous leur auteur, comme avant.
- **Noms dynamiques** (`src/map/declutter.ts`, `src/map/LabelLayer.tsx`). À chaque zoom, les noms des points visibles sont posés par priorité : élément choisi, grandes figures, figures à résultats, résultats, fiches courtes. Chaque nom essaie la droite, la gauche, le dessus puis le dessous de son point, et il est masqué s’il recouvrirait un autre nom, un marqueur, ou un obstacle (noms des domaines aux niveaux 0 et 1, noms des théories au niveau 1). Largeur estimée : `textWidth` (0,55 em par caractère + 4 px), validée par le test e2e de non-chevauchement.

## 11. Densité (~1 200 figures)

- `baseRadius` : le disque grandit de 1,2 % par figure au-delà de 12, et de 35 % au plus.
- Cible de figures par domaine (vague 4) :

  | Taille du domaine | Antiquité et monde médiéval | Autres ères |
  |---|---|---|
  | 3 | 18 | 28 |
  | 2 | 14 | 20 |
  | 1 | 10 | 12 |

  Soit 1 224 figures (détail à la tâche 4.3). Si `computeLayout` n’arrive plus à séparer les disques (test « corpus réel : … sans chevauchement »), réduire d’abord le plafond de croissance, puis agrandir `MAP_SIZE` en conservant les proportions des bandes.

## 12. Fiches (panneau ou feuille)

Le panneau est éclaté en `src/ui/panel/` : `common.tsx`, `BasinSection.tsx`, `DomainView.tsx`, `TheoryView.tsx`, `MathematicianView.tsx`, `ResultView.tsx`. `Panel.tsx` ne garde que la coquille.

- **Grande figure** :
  - en-tête avec médaille, nom, années, lieu ;
  - signature en italique avec son badge ;
  - « Apports » ;
  - « Résultats phares » en cartes cliquables ;
  - « Biographie » (bio, théorie, lien « Biographie détaillée sur MacTutor » si `mactutor`) ;
  - « Autres résultats » par domaine ;
  - « Réseau » ; domaine et « Aussi actif·ve dans » ;
  - sources numérotées (signature, apports, `sources`).
- **Figure ordinaire ou fiche courte** : même fiche, sans médaille, signature, apports ni résultats phares.
- **Résultat** :
  - nature, année, titre, auteur, théorie ;
  - « Énoncé » ;
  - **« D’où vient l’idée »** ;
  - **« Idée de la démonstration »**, en étapes numérotées avec badges ;
  - « Place dans le domaine » ;
  - « Ce qui y a conduit » et « Ce que ça a ouvert » (récits existants, puis « Dans l’atlas ») ;
  - sources numérotées.
- **Domaine** : « En bref », puis « **Grandes figures** » (médaille, nom, signature), « Amont et aval » (le `BasinSection` de « Lignées »), méthodes, contexte, débats, repères, théories, « Mathématiciens (n) » (grandes figures d’abord, puis par année de naissance, repliés au-delà de 12), résultats marquants, liens regroupés, sources.

## 13. Interface

- **Barre du haut** : le bouton « Visions » disparaît.
- **Filtres** : période, champs, « Liens entre domaines » (lignées principales / tous les liens), « N’afficher que les faits ». Le tiroir passe **au-dessus** du panneau (`z-[45]`) ; auparavant, il s’ouvrait dessous quand une fiche était ouverte.
- **Légende** réécrite : lire la carte (pastilles des champs), grandes figures (médaille d’exemple), lignées (transmission, rupture), amont et aval, frise, niveaux, natures, énoncés.
- **Introduction** et **Méthode** réécrites (FR/EN). La clé de l’introduction passe à `atlas.intro.v2`, pour qu’elle s’affiche une fois après la refonte.
- **Frise** aux couleurs Galerie (`wash` et `ink` des champs).

## 14. Retraits

Sont supprimés :
- `src/ui/VisionPanel.tsx` et `src/map/visionPalettes.ts` (les couleurs de natures passent dans `src/map/resultKinds.ts`) ;
- l’état `vision`, `naturesKind`, `visionOpen`, `linkKinds` et `transversalOnly` ;
- le mode « réseaux » de `MathematicianLinkLayer` ;
- les contours organiques (`organicPath`) ;
- `LaneLayer` (remplacé par `GalleryBackdrop`) ;
- le grain de papier et la police Cormorant Garamond.

## 15. i18n

Clés supprimées :
- `nav.visions` et toutes les `vision.*` ;
- `filters.linkTypes`, `filters.transversal*` ;
- `legend.links`, `legend.hint`, `legend.lanes*`, `legend.filiation`, `legend.influence`, `legend.affinite`, `legend.reaction`, `legend.fact`, `legend.interp`.

Clés ajoutées, en FR et EN :
- `filters.links*` ;
- `legend.read*`, `legend.featured*`, `legend.lineage*`, `legend.transmission`, `legend.rupture` ;
- `panel.featured`, `panel.contributions`, `panel.headlines`, `panel.bio`, `panel.otherResults`, `panel.mactutor`, `panel.intuition`, `panel.proof`, `panel.moreFigures`, `panel.links.*`, `panel.principal`.

Clés réécrites : `intro.body`, `method.body`.

## 16. Chartes de rédaction

### 16.1 Grandes figures (sous-projet 1 et vague 2)

- **Signature** : son apport en une ligne, au plus 90 caractères, verbe au présent (« Fonde… », « Démontre… »).
  - Typée `fait` si elle décrit ce qui a été fait (« Publie la résolution générale… (1545) ») ;
  - `interpretation` si elle juge (« refonde », « unifie », « achève »).
- **Apports** : 2 à 4 énoncés, chacun une ou deux phrases. Ils disent ce que la figure a **changé** : concepts, méthodes, notations, manières de démontrer, institutions, élèves, écoles.
  - Ils **complètent** la bio sans la répéter.
  - Les jugements de portée sont typés `interpretation` et attribués quand c’est possible (« pour Weil, … »).
  - Sources : celles du domaine d’attache, celles des récits de ses résultats, `mactutor` et les histoires générales du socle.
  - Modèle : les apports d’Euler (annexe B).
- **Résultats phares** : 1 à 3 de ses résultats, le plus emblématique d’abord (il s’affiche sur la carte). Ils peuvent appartenir à n’importe quel domaine.

### 16.2 Intuitions et démonstrations (vague 3)

- **« D’où vient l’idée »** (1 à 2 énoncés) : ce qui rend le résultat plausible ou visible. Un exemple, une figure, une analogie, un calcul numérique, une intuition physique, ou la manière dont l’auteur l’a deviné.
  - **Ne pas répéter** le récit « Ce qui y a conduit » (`context`), qui raconte le problème posé et la situation historique.
  - L’heuristique d’un auteur documentée par une source est un `fait` ; une reconstruction d’historien, une `interpretation`.
- **« Idée de la démonstration »** (3 à 6 étapes) : les étapes logiques en **langage courant**, une ou deux phrases chacune, avec au plus quelques symboles Unicode (x², √2, π, ∑, ≤, ∈). Pas de LaTeX.
  - Une étape de preuve est un `fait`.
  - Pour une preuve très technique (Wiles, Perelman, classification des groupes simples) : donner l’**architecture** de la preuve (grandes étapes, outils), sans prétendre la refaire.
- **Selon la nature du résultat :**
  - théorème : intuition et démonstration ;
  - conjecture : intuition (pourquoi on y croit : vérifications numériques, heuristiques, cas particuliers) ; une démonstration seulement si elle a été démontrée **et** qu’aucun autre résultat de l’atlas ne porte déjà cette preuve (sinon, la citer dans l’intuition) ;
  - problème : intuition (pourquoi il est difficile, comment on l’aborde), et une démonstration s’il a été résolu.
- **Sources** : celles déjà citées par le résultat (récits) ou par son domaine, puis les ouvrages du socle (`stillwell-history`, `katz-history`, `hairer-wanner-analysis`, `weil-number-theory`, `gowers-companion`…).
- **Relecture obligatoire** avant chaque commit :
  - le contenu mathématique est-il exact ?
  - chaque énoncé est-il couvert par **sa** source ?
  - n’y a-t-il ni date ni attribution sans source ?
  - le texte est-il distinct de `statement`, `comment` et `context` ?
- Modèles : annexe B (infinité des nombres premiers, problème de Bâle, petit théorème de Fermat).

### 16.3 Fiches courtes (vague 4)

- **Qui** : une figure qui a une biographie MacTutor **et** une contribution mathématique réelle dans le champ et la période d’un domaine de l’atlas.
  - On écarte les mécènes, les éditeurs sans œuvre propre et les doublons.
  - On veille à la diversité (femmes, mondes non européens), sans forcer.
  - Domaine d’attache : celui de la contribution principale ; ailleurs, `relatedMathematicianIds` si utile.
- **Champs** : `id` (slug du nom usuel français), `name` (forme française usuelle pour l’Antiquité et le Moyen Âge, graphie d’origine avec diacritiques pour les modernes), `years`, `yearsApprox` si MacTutor dit « about » ou si la date est débattue, `origin` (ville, culture ou pays d’activité), `bio`, `mactutor`, `sources: ['mactutor']` (et d’autres sources du registre si utilisées), `theoryId` si évident.
- **Bio** : 1 à 2 phrases, 280 caractères au plus, **rédigées par nous** (jamais copiées ni traduites mot à mot de MacTutor), avec uniquement des faits présents dans la biographie MacTutor ou dans une source du registre.
- **Années** : celles de MacTutor (av. J.-C. en négatif). `npx tsx scripts/mactutor.ts --domain <id> --strict` doit passer pour chaque domaine touché.
- **Modèle** : `src/data/figures/antiquite.ts`, ci-dessous, vérifié sur MacTutor (« Born about 380 BC, Died about 320 BC », « pupil of Eudoxus », coniques découvertes en cherchant à dupliquer le cube) :

```ts
'geometrie-grecque': [
  {
    id: 'menechme',
    name: 'Ménechme',
    years: [-380, -320],
    yearsApprox: true,
    origin: 'Athènes',
    bio: 'Élève d’Eudoxe, Ménechme passe pour avoir découvert les sections coniques en cherchant à dupliquer le cube.',
    mactutor: 'Menaechmus',
    sources: ['mactutor'],
  },
],
```

## 17. Critères d’acceptation (fin du projet)

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` et `npm run test:e2e` au vert.
- `COMPLETENESS` à ses valeurs finales : `featuredMin: 40`, `contributionsRequired: true`, `proofsCoverage: 1`, `mathematiciansMin: 1150`, `mactutorCoverage: 0.85`.
- `npx tsx scripts/mactutor.ts --strict` au vert, ou écarts consignés dans `docs/corpus/ecarts-mactutor.md` et tranchés par le propriétaire.
- README, `docs/corpus/BRIEF.md`, `AGENTS.md` et la spec à jour ; statistiques du corpus régénérées par `npx tsx scripts/corpus-stats.ts`.

## 18. Hors périmètre

Traduction anglaise du corpus, portraits, export imprimable, démonstrations formelles (LaTeX), désencombrement des libellés de liens.

---

# Partie III — Plan d’implémentation

## Carte des fichiers

| Fichier | Rôle | Tâche |
|---|---|---|
| `src/data/types.ts` | `Featured`, champs `featured`, `sources`, `mactutor`, `intuition`, `proof`, `principal` | 1.1 |
| `src/data/validate.ts` | règles de forme (`SIGNATURE_MAX`, `checkStatements`, résultats phares, intuition et démonstration, `principal`, slug) | 1.1 |
| `src/data/completeness.ts` | `COMPLETENESS`, `coverage()`, `hasProofMaterial()` | 1.1 |
| `src/map/lineage.ts` | `principalLinks()`, `defaultLinkKeys()` | 1.1 |
| `src/lib/mactutor.ts` | `parseYear`, `parseLifeYears`, `compareYears` | 1.1 |
| `src/map/layout.ts` | disques, `featuredSlots`, `gridCells`, `assignCells`, `nameLevel`, rayon selon le nombre de figures | 1.2 |
| `src/map/declutter.ts` | `declutter()`, `textWidth()` : pose des noms sans chevauchement | 1.2 |
| `src/map/labelMetrics.ts` | `domainNameMetrics()`, `domainNameCenter()` | 1.2 |
| `src/map/Territory.tsx` | disque, nom, théories, points, losanges | 1.2 |
| `src/map/LabelLayer.tsx` | médailles et noms désencombrés | 1.2 |
| `src/map/LinkLayer.tsx` | deux styles, lignées principales, survol, sélection, amont et aval | 1.2 |
| `src/map/GalleryBackdrop.tsx` | bandes, ères, années (remplace `LaneLayer.tsx`) | 1.2 |
| `src/map/fieldColors.ts`, `src/map/resultKinds.ts` | couleurs Galerie, encres des liens, couleurs des natures | 1.2 |
| `src/state/store.tsx` | sans visions, avec `filters.allLinks` | 1.2 |
| `src/ui/panel/*`, `src/ui/Panel.tsx` | fiches | 1.2 |
| `src/ui/FiltersDrawer.tsx`, `Legend.tsx`, `TopBar.tsx`, `src/i18n/ui.ts`, `src/index.css`, `index.html`, `package.json` | interface, textes, styles, polices | 1.2 |
| `scripts/palettes.ts`, `src/data/domains/*.ts`, `docs/corpus/BRIEF.md` | palettes « Galerie » régénérées | 1.2 |
| `e2e/atlas.spec.ts` | e2e de la refonte et points de vigilance | 1.4 |
| `scripts/seed-galerie.ts` (temporaire) | insertion des grandes figures et des exemples | 1.3 |
| `scripts/coverage.ts` | avancement du corpus | 2.0 |
| `scripts/mactutor.ts` | contrôle MacTutor en ligne de commande | 4.1 |
| `src/data/figures/*.ts`, `src/data/__tests__/figures.test.ts` | fiches courtes | 4.2 |

## Sous-projet 1 — Socle

### Tâche 1.0 : préparer la branche

**Préalable, à faire par le propriétaire avant de confier le dépôt :** commiter le travail en cours « Lignées » tel quel sur une branche `refonte-galerie`, avec ce dossier, puis la pousser :

```bash
git switch -c refonte-galerie
git add -A
git commit -m "wip : DA « Lignées » (inachevée, base de la refonte « Galerie »)"
git push -u origin refonte-galerie
```

- [ ] **Étape 1 : vérifier l’état de départ**

```bash
git switch refonte-galerie
git log --oneline -2          # attendu : « wip : DA « Lignées » … », puis 1a105be
test -f src/map/LaneLayer.tsx && test ! -f src/map/RiverLayer.tsx && echo "état de départ conforme"
npm ci
npm test                      # attendu : 4 fichiers, 16 tests verts
npm run typecheck             # attendu : 7 erreurs (ActivityFrieze.tsx ×4, Legend.tsx ×3), corrigées en 1.2
```

S’il y a un écart (fichier absent, autre nombre d’erreurs) : **POINT D’ARRÊT**, le signaler au propriétaire.

- [ ] **Étape 2 : extraire le correctif de l’annexe D et vérifier qu’il s’applique**

```bash
awk '/^````diff$/{f=1;next} /^````$/{if(f)exit} f' docs/superpowers/plans/2026-10-12-refonte-galerie.md > /tmp/galerie.patch
wc -l < /tmp/galerie.patch                          # attendu : 6547
shasum -a 256 /tmp/galerie.patch                    # attendu : voir l’annexe D
git apply --check /tmp/galerie.patch && echo "le correctif s’applique"
```

Pas de commit pour cette tâche.

### Tâche 1.1 : modèle de données, validation, complétude, lignées, analyse MacTutor

**Fichiers :**
- Modifier : `src/data/types.ts`, `src/data/validate.ts`
- Créer : `src/data/completeness.ts`, `src/map/lineage.ts`, `src/lib/mactutor.ts`
- Tests : `src/data/__tests__/validate.test.ts` (11 cas ajoutés), `src/data/__tests__/completeness.test.ts`, `src/map/__tests__/lineage.test.ts`, `src/map/__tests__/upstream.test.ts`, `src/lib/__tests__/mactutor.test.ts`

**Interfaces produites :**
- `Featured`, `Mathematician.featured | sources | mactutor`, `Result.intuition | proof`, `Link.principal` (`src/data/types.ts`)
- `SIGNATURE_MAX = 90` (`src/data/validate.ts`)
- `COMPLETENESS`, `coverage(domains): Coverage`, `hasProofMaterial(r: Result): boolean` (`src/data/completeness.ts`)
- `principalLinks(links, domainById): Map<string, Link>`, `defaultLinkKeys(links, domainById): Set<string>` (`src/map/lineage.ts`)
- `parseYear(text): LifeYear | null`, `parseLifeYears(html): LifeYears`, `compareYears(years, approx, mt): { verdict: 'ok' | 'ecart' | 'manquant'; detail }` (`src/lib/mactutor.ts`)

- [ ] **Étape 1 : poser les tests d’abord**

```bash
git apply --include='src/data/__tests__/*' --include='src/map/__tests__/lineage.test.ts' \
  --include='src/map/__tests__/upstream.test.ts' --include='src/lib/__tests__/*' /tmp/galerie.patch
```

- [ ] **Étape 2 : vérifier qu’ils échouent**

Commande : `npx vitest run`

Attendu : échecs. Modules introuvables (`../completeness`, `../lineage`, `../mactutor`) et règles de validation absentes (par exemple « signature trop longue » non signalée). `upstream.test.ts` passe déjà : il fixe le comportement de l’amont et de l’aval existants.

- [ ] **Étape 3 : appliquer l’implémentation**

```bash
git apply --include='src/data/types.ts' --include='src/data/validate.ts' --include='src/data/completeness.ts' \
  --include='src/map/lineage.ts' --include='src/lib/mactutor.ts' /tmp/galerie.patch
```

- [ ] **Étape 4 : vérifier**

```bash
npx vitest run                # attendu : 8 fichiers, 44 tests verts
npm run typecheck             # attendu : les 7 mêmes erreurs qu’à la tâche 1.0, aucune nouvelle
```

- [ ] **Étape 5 : commiter**

```bash
git add src/data src/map/lineage.ts src/map/__tests__ src/lib
git commit -m "Modèle « Galerie » : grandes figures, intuitions, démonstrations, ascendants principaux, contrôle MacTutor"
```

### Tâche 1.2 : DA « Galerie », carte, noms désencombrés, fiches, interface

**Fichiers :** tout le reste du correctif, sauf `e2e/`. Composants de la carte et du panneau, état, styles, textes, palettes, `package.json`. Suppressions : `src/map/LaneLayer.tsx`, `src/map/visionPalettes.ts`, `src/ui/VisionPanel.tsx`.

**Interfaces :**
- Utilise `principalLinks` et `defaultLinkKeys` (1.1).
- Produit :
  - `ChildPos.featured?: boolean` et `ChildPos.nameLevel?: 2 | 3` ;
  - `declutter(items: LabelItem[], obstacles?: Rect[]): PlacedLabel[]` et `textWidth(text, fontPx)` ;
  - `domainNameMetrics(domain, r, k)` et `domainNameCenter(t, level)` ;
  - `Filters.allLinks: boolean` et l’action `{ type: 'set-all-links'; allLinks: boolean }` ;
  - les composants `LabelLayer`, `GalleryBackdrop` et `src/ui/panel/*`.

- [ ] **Étape 1 : poser les tests de placement et de désencombrement, vérifier qu’ils échouent**

```bash
git apply --include='src/map/__tests__/declutter.test.ts' --include='src/map/__tests__/labelMetrics.test.ts' \
  --include='src/map/__tests__/layout.test.ts' /tmp/galerie.patch
npx vitest run src/map        # attendu : échec (modules ../declutter et ../labelMetrics introuvables)
```

- [ ] **Étape 2 : appliquer le reste du correctif, hors e2e et hors fichiers de la tâche 1.1**

```bash
git apply --exclude='src/data/types.ts' --exclude='src/data/validate.ts' --exclude='src/data/completeness.ts' \
  --exclude='src/data/__tests__/*' --exclude='src/map/lineage.ts' --exclude='src/map/__tests__/*' \
  --exclude='src/lib/*' --exclude='e2e/*' /tmp/galerie.patch
npm install                   # installe @fontsource/fraunces, retire @fontsource/cormorant-garamond, met à jour package-lock.json
```

- [ ] **Étape 3 : vérifier**

```bash
npm run typecheck             # attendu : 0 erreur
npm run lint                  # attendu : 0 erreur (avertissements « only-export-components » existants tolérés)
npm test                      # attendu : 10 fichiers, 54 tests verts
npm run build                 # attendu : build sans erreur
```

- [ ] **Étape 4 : contrôle visuel**

Lancer `npm run dev` et ouvrir `http://localhost:5173`. Attendu :
- un fond blanc cassé et cinq bandes pâles ;
- des disques sans contour, nommés en petites capitales ;
- 64 liens fins (gris à pointe, ruptures sanguines barrées) ;
- **aucune médaille** pour l’instant (elles arrivent en 1.3) ;
- au zoom, des points et des noms qui ne se chevauchent jamais ;
- dans les filtres, « Lignées principales / Tous les liens » ;
- plus de bouton « Visions ».

- [ ] **Étape 5 : commiter**

```bash
git add -A
git commit -m "DA « Galerie » : disques, lignées principales, noms désencombrés, fiches enrichies, visions retirées"
```

### Tâche 1.3 : liste des grandes figures et exemples complets — POINT D’ARRÊT

**Fichiers :**
- Créer puis supprimer : `scripts/seed-galerie.ts` (annexe B)
- Modifier : les 10 fichiers `src/data/domains/*.ts` (par le script) et `src/data/completeness.ts`

- [ ] **Étape 1 : faire valider l’annexe A par le propriétaire.** Ajouts, retraits, signatures, résultats phares. Remplaçants proposés : Hypatie (`hypatie`), Mādhava (`madhava`), Ada Lovelace (`lovelace`), Nicole Oresme (`oresme`), Omar Khayyam (`omar-khayyam`). Règles : 2 grandes figures au plus par domaine ; chaque résultat phare existe et a pour `mathematicianId` la figure ; signature en 90 caractères au plus, typée et sourcée.
- [ ] **Étape 2 :** créer `scripts/seed-galerie.ts` avec le code de l’annexe B, en reportant les modifications validées dans `FEATURED`.
- [ ] **Étape 3 : exécuter**

```bash
npx tsx scripts/seed-galerie.ts      # attendu : une ligne par figure et par résultat, sans erreur
npx tsx scripts/seed-galerie.ts      # attendu : erreur « déjà présent » (le script refuse de doublonner)
```

- [ ] **Étape 4 :** dans `src/data/completeness.ts`, passer `featuredMin: 0` à `featuredMin: 40` (ou au nombre validé).
- [ ] **Étape 5 : vérifier**

```bash
npm test                      # attendu : 54 tests verts, dont « au moins 40 grandes figures »
npm run typecheck
```

Contrôle visuel : 43 médailles sur la carte, avec nom et résultat phare au niveau 1. La fiche d’Euler montre sa signature, ses apports et ses résultats phares. La fiche « Problème de Bâle » montre « D’où vient l’idée » et « Idée de la démonstration ».

- [ ] **Étape 6 : supprimer le script et commiter**

```bash
rm scripts/seed-galerie.ts
git add src/data
git commit -m "Grandes figures : liste éditoriale, signatures, résultats phares ; trois démonstrations modèles"
```

### Tâche 1.4 : tests de bout en bout

**Fichiers :** `e2e/atlas.spec.ts`, depuis le correctif.

Le correctif remplace le test « fleuves et frise » par un test de frise, et ajoute :
- médailles et lignées par défaut ;
- l’interrupteur « Tous les liens » ;
- la fiche d’une grande figure ;
- intuition et démonstration ;
- les quatre points de vigilance : noms sans chevauchement, résultat phare d’un autre domaine, anglais, « faits seulement ».

- [ ] **Étape 1 : appliquer et lancer**

```bash
git apply --include='e2e/*' /tmp/galerie.patch
npm run test:e2e              # attendu : 44 réussis, 2 ignorés (tests réservés au mobile ou au desktop), desktop et mobile
```

- [ ] **Étape 2 :** relire les captures dans `e2e/artifacts/` (vue initiale, grande figure, démonstration, amont et aval).
- [ ] **Étape 3 : commiter**

```bash
git add e2e/atlas.spec.ts
git commit -m "e2e : grandes figures, lignées principales, démonstrations, points de vigilance"
```

### Tâche 1.5 : documentation

- [ ] **`README.md`** :
  - remplacer les paragraphes « fleuves », « visions » et « Fleuves et confluences » par la DA Galerie (§ 7 à 13) ;
  - navigation : médailles, interrupteur des liens, fiches enrichies ;
  - architecture : `lineage.ts`, `declutter.ts`, `labelMetrics.ts`, `LabelLayer.tsx`, `GalleryBackdrop.tsx`, `src/ui/panel/`, `completeness.ts`, `mactutor.ts` ;
  - régénérer la ligne de statistiques avec `npx tsx scripts/corpus-stats.ts`.
- [ ] **`docs/superpowers/specs/2026-10-10-atlas-mathematiques-design.md`** : statut « v0.4, direction Galerie » ; résumer en quelques lignes la DA, les lignées principales, les grandes figures, les démonstrations et les fiches courtes ; renvoyer à ce dossier pour le détail.
- [ ] **`docs/corpus/BRIEF.md`** :
  - ajouter un § 9 « Grandes figures » (charte 16.1, plus le tableau de l’annexe A tel que validé) ;
  - un § 10 « Intuitions et démonstrations » (charte 16.2, plus les trois modèles) ;
  - un § 11 « Fiches courtes et MacTutor » (charte 16.3, plus les cibles par domaine de la tâche 4.3).
- [ ] **`AGENTS.md`** : sous « Corpus », ajouter les règles de forme de la section « Contraintes globales » et la règle des 2 grandes figures par domaine.
- [ ] **Vérifier et commiter**

```bash
npm test && npm run typecheck
git add README.md docs AGENTS.md
git commit -m "Documentation de la refonte « Galerie »"
```

### Tâche 1.6 : vérification finale du socle et livraison

- [ ] **Étape 1 : tout relancer**

```bash
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

Attendu : tout vert.

- [ ] **Étape 2 :** pousser et ouvrir une PR « Refonte « Galerie » : socle » vers `main`. Demander au propriétaire s’il fusionne avant les vagues (recommandé).

## Vague 2 — Apports des grandes figures

### Tâche 2.0 : outil d’avancement

- [ ] Créer `scripts/coverage.ts` (annexe C.1).
- [ ] Lancer `npx tsx scripts/coverage.ts` et `npx tsx scripts/coverage.ts --featured`. Attendu : 43 grandes figures, dont 1 avec ses apports ; 42 sans apports.
- [ ] Dans `AGENTS.md`, ajouter la commande à la liste.
- [ ] Commiter : `git commit -m "Outil d’avancement du corpus"`.

### Tâches 2.1 à 2.6 : apports, ère par ère

| Tâche | Figures (identifiants) | Fichiers d’ère |
|---|---|---|
| 2.1 | `euclide`, `archimede`, `aristote`, `diophante`, `liu-hui`, `brahmagupta`, `al-khwarizmi`, `ibn-al-haytham`, `qin-jiushao`, `fibonacci` | `antiquite`, `medieval` |
| 2.2 | `cardan`, `viete`, `fermat`, `descartes`, `pascal`, `newton`, `leibniz` | `renaissance` |
| 2.3 | `d-alembert`, `lagrange`, `laplace`, `legendre` | `lumieres` |
| 2.4 | `gauss`, `cauchy`, `galois`, `riemann`, `cantor`, `boole`, `kovalevskaia` | `dixneuvieme-a`, `dixneuvieme-b` |
| 2.5 | `hilbert`, `poincare`, `noether`, `ramanujan`, `kolmogorov`, `godel`, `turing` | `structures-a`, `structures-b` |
| 2.6 | `grothendieck`, `erdos`, `mandelbrot`, `wiles`, `perelman`, `mirzakhani`, `cohen` | `contemporain-a`, `contemporain-b` |

Pour chaque tâche :

- [ ] **Étape 1 : rassembler le matériau de chaque figure** : sa bio, tous ses résultats (y compris dans d’autres domaines) et leurs récits, les sources de son domaine, sa page MacTutor.
- [ ] **Étape 2 : rédiger** 2 à 4 énoncés dans `featured.contributions`, selon la charte 16.1 et sur le modèle d’Euler (fichier `lumieres.ts`).
- [ ] **Étape 3 : vérifier**

```bash
npx tsx scripts/check-era.ts <fichier>      # attendu : « Erreurs à corriger … : 0 »
npm test
```

- [ ] **Étape 4 : relire avec la liste de la charte 16.1** (exactitude, une source qui couvre chaque énoncé, pas de répétition de la bio, typage).
- [ ] **Étape 5 : commiter** : `git commit -m "Apports des grandes figures : <ère>"`.

### Tâche 2.7 : verrou de la vague 2

- [ ] Dans `src/data/completeness.ts`, passer `contributionsRequired: false` à `true`.
- [ ] Vérifier : `npm test` est vert et `npx tsx scripts/coverage.ts` affiche « 43, dont 43 avec leurs apports ».
- [ ] Commiter : `git commit -m "Vague 2 terminée : toutes les grandes figures ont leurs apports"`.

## Vague 3 — Intuitions et démonstrations

### Tâches 3.1 à 3.10 : un fichier d’ère par tâche

| Tâche | Fichier | À rédiger |
|---|---|---|
| 3.1 | `antiquite` | 16 |
| 3.2 | `medieval` | 15 |
| 3.3 | `renaissance` | 14 |
| 3.4 | `lumieres` | 27 |
| 3.5 | `dixneuvieme-a` | 23 |
| 3.6 | `dixneuvieme-b` | 20 |
| 3.7 | `structures-a` | 38 |
| 3.8 | `structures-b` | 24 |
| 3.9 | `contemporain-a` | 48 |
| 3.10 | `contemporain-b` | 35 |

Le compte exclut les trois modèles déjà rédigés.

Pour chaque tâche :

- [ ] **Étape 1 : lister les résultats à traiter** avec `npx tsx scripts/coverage.ts --todo <fichier>`.
- [ ] **Étape 2 : rédiger** `intuition` et `proof` selon la charte 16.2, en suivant les modèles. Ajouter les champs à la fin de l’objet résultat, après `impact` s’il existe.
- [ ] **Étape 3 : vérifier**

```bash
npx tsx scripts/check-era.ts <fichier>      # attendu : 0 erreur
npx tsx scripts/coverage.ts --todo <fichier>  # attendu : liste vide
npm test
```

- [ ] **Étape 4 : relire** avec la liste de la charte 16.2. En cas de doute sur une étape ou une attribution, retirer l’énoncé plutôt que de l’inventer, et le signaler au propriétaire dans la description du commit.
- [ ] **Étape 5 (facultative) :** relever `proofsCoverage` au taux atteint, arrondi au dixième inférieur, pour verrouiller l’avancée.
- [ ] **Étape 6 : commiter** : `git commit -m "Intuitions et démonstrations : <fichier>"`.

### Tâche 3.11 : verrou de la vague 3

- [ ] Passer `proofsCoverage` à `1`.
- [ ] Lancer `npm test && npm run test:e2e`.
- [ ] Commiter : `git commit -m "Vague 3 terminée : intuitions et démonstrations pour tous les théorèmes, conjectures et problèmes"`.

## Vague 4 — Fiches courtes et MacTutor

### Tâche 4.1 : contrôle MacTutor et slugs des figures existantes

**Fichiers :**
- Créer : `scripts/mactutor.ts` (annexe C.2) et `docs/corpus/ecarts-mactutor.md`
- Modifier : `src/data/domains/*.ts` (ajout de `mactutor` aux figures existantes) et `AGENTS.md`

- [ ] **Étape 1 :** créer le script. Le cache `scripts/.cache/` est déjà ignoré par git.
- [ ] **Étape 2 : trouver les slugs, domaine par domaine.** Lancer `npx tsx scripts/mactutor.ts --suggest <domaine>`, puis ajouter `mactutor: '<slug>'` à chaque figure trouvée. Quand aucun candidat ne sort, chercher à la main sur MacTutor : un nom anglais (`Bernoulli_Johann` pour Jean Bernoulli) ou une graphie particulière (`DAlembert`, `Abul-Wafa`). Si la figure n’a pas de page MacTutor, ne pas mettre de slug.
- [ ] **Étape 3 : lancer `npx tsx scripts/mactutor.ts`** et recopier chaque écart dans `docs/corpus/ecarts-mactutor.md` (figure, valeurs de l’atlas et de MacTutor, sources du domaine). **Ne pas modifier les années existantes** : POINT D’ARRÊT, le propriétaire tranche (exemple déjà connu : Brahmagupta, 668 contre 670).
- [ ] **Étape 4 :** dans `AGENTS.md`, ajouter les commandes `scripts/mactutor.ts`.
- [ ] **Étape 5 : vérifier et commiter**

```bash
npm test
git commit -m "Slugs MacTutor des figures existantes ; écarts à trancher"
```

### Tâche 4.2 : chargement des fiches courtes

**Fichiers :**
- Créer : `src/data/figures/index.ts`, les 10 fichiers `src/data/figures/<ère>.ts`, `src/data/__tests__/figures.test.ts`
- Modifier : `src/data/index.ts`

- [ ] **Étape 1 : écrire le test d’abord.** Créer `src/data/__tests__/figures.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { DOMAINS, DOMAIN_BY_ID } from '../index';
import { EXTRA_FIGURES } from '../figures';
import { normalizeText } from '../../lib/normalize';
import { computeLayout } from '../../map/layout';

describe('fiches courtes (vague 4)', () => {
  const extras = Object.values(EXTRA_FIGURES).flat();

  it('rangées dans un domaine existant', () => {
    for (const id of Object.keys(EXTRA_FIGURES)) expect(DOMAIN_BY_ID[id], id).toBeDefined();
  });

  it('chacune a sa biographie MacTutor, cite MacTutor et tient en 280 caractères', () => {
    for (const m of extras) {
      expect(m.mactutor, m.id).toBeTruthy();
      expect(m.sources ?? [], m.id).toContain('mactutor');
      expect(m.bio.length, m.id).toBeLessThanOrEqual(280);
    }
  });

  it('pas deux figures du même nom dans tout l’atlas', () => {
    const seen = new Map<string, string>();
    for (const d of DOMAINS) {
      for (const m of d.mathematicians) {
        const key = normalizeText(m.name);
        expect(seen.get(key), `${m.id} porte le même nom que ${seen.get(key)}`).toBeUndefined();
        seen.set(key, m.id);
      }
    }
  });

  it('une fiche courte a son point sur la carte, et son nom au niveau 3', () => {
    const layout = computeLayout(DOMAINS);
    for (const m of extras) expect(layout.childPos.get(m.id)?.nameLevel, m.id).toBe(3);
  });
});
```

Lancer `npx vitest run src/data/__tests__/figures.test.ts`. Attendu : échec, module `../figures` introuvable.

- [ ] **Étape 2 : créer `src/data/figures/index.ts`**

```ts
import type { Mathematician } from '../types';
import { FIGURES_ANTIQUITE } from './antiquite';
import { FIGURES_MEDIEVAL } from './medieval';
import { FIGURES_RENAISSANCE } from './renaissance';
import { FIGURES_LUMIERES } from './lumieres';
import { FIGURES_DIXNEUVIEME_A } from './dixneuvieme-a';
import { FIGURES_DIXNEUVIEME_B } from './dixneuvieme-b';
import { FIGURES_STRUCTURES_A } from './structures-a';
import { FIGURES_STRUCTURES_B } from './structures-b';
import { FIGURES_CONTEMPORAIN_A } from './contemporain-a';
import { FIGURES_CONTEMPORAIN_B } from './contemporain-b';

/**
 * Fiches courtes de la vague 4 : figures vérifiées sur MacTutor, sans résultat
 * obligatoire, rangées par domaine d'attache (clé : Domain.id). Elles sont
 * ajoutées aux figures de leur domaine au chargement (src/data/index.ts).
 */
export const EXTRA_FIGURES: Record<string, Mathematician[]> = {};
for (const part of [
  FIGURES_ANTIQUITE,
  FIGURES_MEDIEVAL,
  FIGURES_RENAISSANCE,
  FIGURES_LUMIERES,
  FIGURES_DIXNEUVIEME_A,
  FIGURES_DIXNEUVIEME_B,
  FIGURES_STRUCTURES_A,
  FIGURES_STRUCTURES_B,
  FIGURES_CONTEMPORAIN_A,
  FIGURES_CONTEMPORAIN_B,
]) {
  for (const [domainId, list] of Object.entries(part)) (EXTRA_FIGURES[domainId] ??= []).push(...list);
}
```

- [ ] **Étape 3 : créer les dix fichiers d’ère.** Chacun exporte `FIGURES_<ÈRE>` vide, sur ce modèle :

```ts
import type { Mathematician } from '../types';

/** Fiches courtes du siècle des Lumières, par domaine d’attache (vague 4 ; docs/corpus/BRIEF.md, § 11). */
export const FIGURES_LUMIERES: Record<string, Mathematician[]> = {};
```

Noms des exports :
- `FIGURES_ANTIQUITE`, `FIGURES_MEDIEVAL`, `FIGURES_RENAISSANCE`, `FIGURES_LUMIERES` ;
- `FIGURES_DIXNEUVIEME_A`, `FIGURES_DIXNEUVIEME_B` ;
- `FIGURES_STRUCTURES_A`, `FIGURES_STRUCTURES_B` ;
- `FIGURES_CONTEMPORAIN_A`, `FIGURES_CONTEMPORAIN_B`.

Dans `antiquite.ts`, mettre la fiche de Ménechme (charte 16.3).

- [ ] **Étape 4 : fusionner au chargement** dans `src/data/index.ts`. Ajouter `import { EXTRA_FIGURES } from './figures';`, puis remplacer la fin de la définition de `DOMAINS` :

```ts
/** Tous les domaines, dans l'ordre chronologique des périodes, avec leurs fiches courtes (vague 4). */
export const DOMAINS: Domain[] = [
  ...ANTIQUITE,
  // … (inchangé)
  ...CONTEMPORAIN_B,
]
  .map((d) => (EXTRA_FIGURES[d.id] ? { ...d, mathematicians: [...d.mathematicians, ...EXTRA_FIGURES[d.id]] } : d))
  .sort((a, b) => a.period.start - b.period.start);
```

- [ ] **Étape 5 : vérifier**

```bash
npm test                      # attendu : 11 fichiers, tous verts (4 nouveaux cas)
npm run typecheck
npx tsx scripts/mactutor.ts --domain geometrie-grecque --strict    # attendu : 0 écart pour Ménechme
```

- [ ] **Étape 6 : commiter** : `git commit -m "Fiches courtes : chargement, contrôles, premier exemple (Ménechme)"`.

### Tâches 4.3 à 4.12 : fiches courtes, un fichier d’ère par tâche

Cibles par domaine (figures actuelles → cible), soit 1 224 figures au total :

| Tâche | Fichier | Domaines |
|---|---|---|
| 4.3 | `antiquite` (+59) | calcul-des-scribes 3→14, geometrie-grecque 6→18, arithmetique-grecque 5→14, logique-antique 5→10, mathematiques-hellenistiques 6→18, mathematiques-chinoises-anciennes 4→14 |
| 4.4 | `medieval` (+53) | mathematiques-indiennes 7→18, algebre-arabe 6→18, geometrie-arabe 6→14, algebre-chinoise-song-yuan 5→14, occident-latin-medieval 6→14, logique-scolastique 5→10 |
| 4.5 | `renaissance` (+131) | perspective-et-cartographie 6→20, algebre-renaissance 7→28, methode-et-caracteristique 4→12, logarithmes-et-calcul-numerique 7→20, theorie-des-nombres-fermat 4→20, naissance-du-calcul 7→28, geometrie-analytique 5→28, naissance-des-probabilites 5→20 |
| 4.6 | `lumieres` (+91) | querelle-des-infiniment-petits 5→12, analyse-eulerienne 6→28, probabilites-classiques 5→20, theorie-des-nombres-lumieres 4→20, geometrie-des-lumieres 5→20, mecanique-analytique 4→20 |
| 4.7 | `dixneuvieme-a` (+92) | arithmetique-gaussienne 8→28, algebre-des-groupes 10→28, analyse-rigoureuse 9→28, geometrie-projective-et-algebrique 7→20, geometries-non-euclidiennes 6→28 |
| 4.8 | `dixneuvieme-b` (+63) | physique-mathematique-xixe 6→20, statistique-xixe 6→20, logique-mathematique-xixe 9→20, theorie-des-ensembles 4→28 |
| 4.9 | `structures-a` (+96) | algebre-moderne 6→28, geometrie-algebrique-classique 6→20, topologie 10→28, theorie-des-nombres-xxe 10→20, analyse-fonctionnelle 8→28, edp-et-physique-mathematique 8→20 |
| 4.10 | `structures-b` (+70) | fondements-hilbert-brouwer 11→20, probabilites-modernes 10→28, statistique-mathematique 11→20, calculabilite 7→28, bourbaki 7→20 |
| 4.11 | `contemporain-a` (+80) | systemes-dynamiques-et-chaos 10→20, theorie-des-nombres-contemporaine 12→28, algebre-contemporaine 11→20, geometrie-algebrique-moderne 8→28, topologie-et-geometrie-contemporaines 13→28, analyse-contemporaine 10→20 |
| 4.12 | `contemporain-b` (+61) | calcul-scientifique-et-preuves-assistees 11→20, combinatoire 11→20, cryptographie-et-codes 11→20, probabilites-et-statistique-contemporaines 11→20, complexite-et-informatique-theorique 12→28, logique-et-ensembles-contemporains 11→20 |

Une cible est un **plafond indicatif**, pas un quota à remplir coûte que coûte. Pour l’Antiquité et le monde médiéval surtout, on s’arrête quand les figures documentées manquent.

Pour chaque tâche :

- [ ] **Étape 1 : établir la liste des candidats** pour chaque domaine (charte 16.3). Vérifier que chacun a une page MacTutor, et qu’aucun n’est déjà dans l’atlas (recherche par nom dans `src/data`).
- [ ] **Étape 2 : rédiger les fiches** dans `src/data/figures/<fichier>.ts`, sur le modèle de Ménechme.
- [ ] **Étape 3 : contrôler**

```bash
npx tsx scripts/mactutor.ts --domain <domaine> --strict    # pour chaque domaine touché ; attendu : 0 écart
npm test                                                    # doublons de noms, bornes, validation
npx tsx scripts/coverage.ts
```

- [ ] **Étape 4 : contrôle visuel.** `npm run dev`, zoomer au niveau 2 puis 3 sur le domaine le plus dense du fichier. Les points ne se recouvrent pas ; les noms apparaissent progressivement, sans chevauchement.
- [ ] **Étape 5 : commiter** : `git commit -m "Fiches courtes : <fichier>"`.

### Tâche 4.13 : densité et performance

- [ ] **Étape 1 :** lancer `npm test`. Le test « corpus réel : déterministe, borné, sans chevauchement » de `layout.test.ts` doit passer. Sinon : réduire le plafond de croissance de `baseRadius` (`0.35` → `0.25`), puis, si besoin, agrandir `MAP_SIZE` et les bandes `CONTINENTS` et `ERA_BANDS` dans les mêmes proportions. Relancer tous les tests.
- [ ] **Étape 2 :** lancer `npm run test:e2e`. Tout doit rester vert ; les captures montrent la nouvelle densité.
- [ ] **Étape 3 :** vérifier la fluidité du zoom sur mobile (profil `mobile` de Playwright, ou appareil réel). Si le défilement saccade au niveau 3, limiter les noms désencombrés aux points à l’écran (c’est déjà le cas : marge `PAD` de 160 px) et réduire la marge.
- [ ] **Étape 4 : commiter** les éventuels réglages.

### Tâche 4.14 : verrou de la vague 4

- [ ] Dans `COMPLETENESS`, passer `mathematiciansMin` à `1150` et `mactutorCoverage` à `0.85`.
- [ ] Mettre à jour les statistiques du README avec `npx tsx scripts/corpus-stats.ts`.
- [ ] Lancer `npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e`.
- [ ] Commiter : `git commit -m "Vague 4 terminée : 1 200 figures vérifiées sur MacTutor"`, puis ouvrir la PR.

## Clôture

- [ ] Vérifier un à un les critères d’acceptation du § 17.
- [ ] Faire relire par le propriétaire `docs/corpus/ecarts-mactutor.md` et les messages de commit qui signalent des énoncés retirés faute de source sûre.

---

# Annexes

## Annexe A — Grandes figures proposées (à faire valider, tâche 1.3)

43 figures, deux au plus par domaine. Pour chacune, la signature indique entre parenthèses son type, **f** (fait) ou **i** (interprétation).

| Ère | Figure (`id`) | Signature | Sources de la signature | Résultats phares (le premier sur la carte) |
|---|---|---|---|---|
| Antiquité | Euclide (`euclide`) | Organise la géométrie et l’arithmétique grecques en un édifice déductif : les Éléments. (f) | vitrac-euclide, heath-greek | elements-euclide, infinite-des-nombres-premiers, cinquieme-postulat |
| Antiquité | Archimède (`archimede`) | Mesure le cercle, la sphère et la parabole par exhaustion, et fonde la statique. (f) | heath-archimedes, heath-greek | mesure-du-cercle, de-la-sphere-et-du-cylindre, la-methode-archimede |
| Antiquité | Aristote (`aristote`) | Crée la logique formelle, la syllogistique, et la théorie de la science démonstrative. (f) | kneale-logic, sep | syllogistique, seconds-analytiques |
| Antiquité | Diophante (`diophante`) | Résout en nombres rationnels des centaines de problèmes indéterminés : les Arithmétiques. (f) | sesiano-diophante, heath-greek | arithmetica-diophante |
| Antiquité | Liu Hui (`liu-hui`) | Justifie les procédures des Neuf Chapitres et calcule π par polygones successifs. (f) | chemla-neuf-chapitres, martzloff-chine | algorithme-du-cercle-de-liu-hui, commentaire-de-liu-hui |
| Médiéval | Brahmagupta (`brahmagupta`) | Donne les règles du calcul avec le zéro et les nombres négatifs (628). (f) | plofker-india, katz-sourcebook | brahmasphutasiddhanta, formule-de-brahmagupta |
| Médiéval | al-Khwārizmī (`al-khwarizmi`) | Fait de la résolution des équations une discipline, l’al-jabr, d’où vient « algèbre ». (i) | rashed-al-khwarizmi, rashed-sciences-arabes | kitab-al-jabr, livre-du-calcul-indien |
| Médiéval | Ibn al-Haytham (`ibn-al-haytham`) | Refonde l’optique par la géométrie et l’expérience ; mesure le paraboloïde. (f) | sabra-optics, rashed-infinitesimales | kitab-al-manazir, probleme-d-alhazen, volume-du-paraboloide-ibn-al-haytham |
| Médiéval | Qin Jiushao (`qin-jiushao`) | Résout les systèmes de restes (méthode dayan) et les équations jusqu’au degré dix. (f) | libbrecht-qin, martzloff-chine | methode-dayan, extraction-de-racines-qin-jiushao, shushu-jiuzhang |
| Médiéval | Fibonacci (`fibonacci`) | Enseigne à l’Occident latin le calcul en chiffres indo-arabes (Liber abaci, 1202). (f) | sigler-liber-abaci, burnett-numerals | liber-abaci, suite-de-fibonacci, liber-quadratorum |
| Renaissance | Cardan (`cardan`) | Publie la résolution générale des équations du 3ᵉ et du 4ᵉ degré (Ars magna, 1545). (f) | cardano-ars-magna, stedall-from-cardano | formule-de-cardan, ars-magna, liber-de-ludo-aleae |
| Renaissance | Viète (`viete`) | Introduit le calcul littéral : des lettres pour les inconnues et pour les données. (f) | stedall-from-cardano, katz-history | in-artem-analyticem-isagoge, de-aequationum-recognitione-et-emendatione |
| Renaissance | Fermat (`fermat`) | Refonde l’arithmétique des entiers : petit théorème, descente infinie, dernier théorème. (i) | weil-number-theory, mahoney-fermat | petit-theoreme-de-fermat, dernier-theoreme-de-fermat, descente-infinie |
| Renaissance | Descartes (`descartes`) | Fait de l’algèbre l’instrument de la géométrie : La Géométrie (1637). (f) | bos-redefining, katz-history | la-geometrie-descartes, regle-des-signes-de-descartes |
| Renaissance | Pascal (`pascal`) | Fonde avec Fermat le calcul des chances (1654) ; construit la Pascaline. (f) | hacking-emergence, hald-history-1750 | correspondance-pascal-fermat, traite-du-triangle-arithmetique, pascaline |
| Renaissance | Newton (`newton`) | Invente le calcul des fluxions et des séries, et l’applique à la gravitation (1687). (f) | whiteside-newton, guicciardini-newton | serie-du-binome, principia-mathematica-newton, de-analysi |
| Renaissance | Leibniz (`leibniz`) | Publie le premier le calcul différentiel (1684) et lui donne ses notations d et ∫. (f) | hofmann-leibniz, edwards-calculus | nova-methodus, characteristica-universalis, machine-arithmetique-de-leibniz |
| Lumières | Euler (`euler`) | Fait des fonctions l’objet de l’analyse et lui donne ses notations : f(x), e, i, π, Σ. (f) | bottazzini-higher-calculus, hairer-wanner-analysis | probleme-de-bale, introductio-in-analysin-infinitorum, sept-ponts-de-konigsberg |
| Lumières | d’Alembert (`d-alembert`) | Écrit la première équation aux dérivées partielles de la physique : les cordes vibrantes. (f) | bottazzini-higher-calculus, dieudonne-abrege | equation-des-cordes-vibrantes, article-limite-encyclopedie, traite-de-dynamique |
| Lumières | Lagrange (`lagrange`) | Réécrit la mécanique en pur calcul, sans aucune figure (Méchanique analitique, 1788). (f) | dieudonne-abrege, stedall-sourcebook | mecanique-analytique-lagrange, theoreme-des-quatre-carres, stabilite-du-systeme-solaire |
| Lumières | Laplace (`laplace`) | Achève la mécanique céleste newtonienne et donne aux probabilités leur forme analytique. (i) | gillispie-laplace, stigler-statistics | traite-de-mecanique-celeste, theorie-analytique-des-probabilites, theoreme-central-limite-laplace |
| Lumières | Legendre (`legendre`) | Énonce la loi de réciprocité quadratique et publie les moindres carrés (1805). (f) | weil-number-theory, stigler-statistics | loi-de-reciprocite-quadratique-enonce, methode-des-moindres-carres, essai-sur-la-theorie-des-nombres |
| XIXᵉ | Gauss (`gauss`) | Unifie la théorie des nombres (1801) et fonde la géométrie intrinsèque des surfaces. (i) | goldstein-schappacher-schwermer, gray-worlds | disquisitiones-arithmeticae, theorema-egregium, demonstration-de-la-reciprocite-quadratique |
| XIXᵉ | Cauchy (`cauchy`) | Refonde l’analyse sur les limites (Cours d’analyse, 1821) et crée le calcul des résidus. (f) | grabiner-cauchy, bottazzini-higher-calculus | cours-d-analyse, theoreme-des-residus |
| XIXᵉ | Galois (`galois`) | Lie la résolubilité d’une équation par radicaux à la structure d’un groupe. (f) | kleiner-abstract-algebra, neumann-galois | theorie-de-galois, memoire-de-galois |
| XIXᵉ | Riemann (`riemann`) | Fonde la géométrie des variétés (1854) et relie les nombres premiers à la fonction zêta. (f) | laugwitz-riemann, gray-worlds | hypothese-de-riemann, habilitationsvortrag-riemann, surfaces-de-riemann |
| XIXᵉ | Cantor (`cantor`) | Crée la théorie des ensembles et montre qu’il existe des infinis de tailles différentes. (f) | dauben-cantor, ferreiros-labyrinth | non-denombrabilite-des-reels, argument-diagonal, hypothese-du-continu |
| XIXᵉ | Boole (`boole`) | Traduit la logique en algèbre : les lois de la pensée comme calcul sur 0 et 1 (1854). (f) | machale-boole, grattan-guinness-search | the-laws-of-thought, the-mathematical-analysis-of-logic |
| XIXᵉ | Kovalevskaïa (`kovalevskaia`) | Démontre l’existence de solutions analytiques pour une large classe d’EDP. (f) | kline-thought, bottazzini-higher-calculus | theoreme-de-cauchy-kovalevskaia |
| Structures | Hilbert (`hilbert`) | Axiomatise la géométrie, pose 23 problèmes au siècle (1900) et fonde la métamathématique. (f) | reid-hilbert, gray-hilbert-challenge | problemes-de-hilbert, grundlagen-der-geometrie, theoreme-de-la-base-de-hilbert |
| Structures | Poincaré (`poincare`) | Fonde la topologie algébrique et l’étude qualitative des équations différentielles. (f) | dieudonne-topology, gowers-companion | analysis-situs, conjecture-de-poincare, sur-le-probleme-des-trois-corps |
| Structures | Noether (`noether`) | Relie symétries et lois de conservation (1918), puis refonde l’algèbre sur les structures. (i) | dick-noether, corry-structures | theoreme-de-noether, idealtheorie-in-ringbereichen, theoreme-de-brauer-hasse-noether |
| Structures | Ramanujan (`ramanujan`) | Autodidacte aux carnets de formules ; avec Hardy, compte asymptotiquement les partitions. (f) | kanigel-ramanujan, gowers-companion | formule-asymptotique-des-partitions, conjecture-de-ramanujan, lettre-de-ramanujan-a-hardy |
| Structures | Kolmogorov (`kolmogorov`) | Fixe les axiomes du calcul des probabilités (Grundbegriffe, 1933). (f) | von-plato-creating, shafer-vovk-grundbegriffe | grundbegriffe-der-wahrscheinlichkeitsrechnung, theoreme-d-extension-de-kolmogorov, methodes-analytiques-de-kolmogorov |
| Structures | Gödel (`godel`) | Montre qu’une théorie cohérente assez riche contient des énoncés indécidables (1931). (f) | dawson-godel, van-heijenoort | theoremes-d-incompletude, theoreme-de-completude, fonctions-recursives-generales |
| Structures | Turing (`turing`) | Définit la machine qui porte son nom et prouve l’indécidabilité de l’arrêt (1936). (f) | hodges-turing, davis-universal | on-computable-numbers, probleme-de-l-arret, machine-de-turing-universelle |
| Contemporain | Grothendieck (`grothendieck`) | Refonde la géométrie algébrique sur les schémas, les topos et de nouvelles cohomologies. (i) | jackson-grothendieck, dieudonne-geometrie-algebrique | schemas, elements-de-geometrie-algebrique, theoreme-de-riemann-roch-grothendieck |
| Contemporain | Erdős (`erdos`) | Fonde la méthode probabiliste (1947) et, avec Rényi, la théorie des graphes aléatoires. (f) | alon-spencer-probabilistic, hoffman-erdos | methode-probabiliste, graphes-aleatoires-d-erdos-renyi |
| Contemporain | Mandelbrot (`mandelbrot`) | Forge la notion de fractale et fait de l’ordinateur un instrument d’exploration. (i) | mandelbrot-fractal-geometry, gleick-chaos | ensemble-de-mandelbrot, les-objets-fractals |
| Contemporain | Wiles (`wiles`) | Démontre le dernier théorème de Fermat par la modularité des courbes elliptiques (1995). (f) | singh-fermat, wiles-modular | demonstration-du-dernier-theoreme-de-fermat |
| Contemporain | Perelman (`perelman`) | Démontre les conjectures de Poincaré et de géométrisation (2002-2003). (f) | szpiro-poincare, mactutor | demonstration-de-la-conjecture-de-poincare |
| Contemporain | Mirzakhani (`mirzakhani`) | Relie le comptage des géodésiques aux volumes des espaces de modules ; Fields 2014. (f) | mactutor | volumes-de-weil-petersson |
| Contemporain | Cohen (`cohen`) | Invente le forcing (1963) et prouve l’indépendance de l’hypothèse du continu. (f) | cohen-set-theory-ch, moore-origins-forcing | independance-de-l-hypothese-du-continu, forcing |

Remplaçants possibles :
- `hypatie` (Hypatie, résultat : commentaire-d-hypatie) ;
- `madhava` (Mādhava : serie-de-madhava-pour-pi) ;
- `lovelace` (Ada Lovelace : notes-de-lovelace) ;
- `oresme` (Nicole Oresme) ;
- `omar-khayyam` (Omar Khayyam).

## Annexe B — `scripts/seed-galerie.ts` (tâche 1.3, à usage unique)

Script vérifié : il insère les 43 grandes figures, les apports d’Euler et les trois intuitions et démonstrations modèles, puis refuse de doublonner. Reporter dans `FEATURED` les modifications validées par le propriétaire.

```ts
/**
 * Insère, une fois pour toutes, les données d'exemple du sous-projet 1 de la
 * refonte « Galerie » dans les fichiers d'ère : les grandes figures (signature
 * et résultats phares), les apports d'Euler (modèle de la vague 2), les
 * intuitions et démonstrations de trois résultats (modèle de la vague 3).
 *
 *   npx tsx scripts/seed-galerie.ts
 *
 * Refuse de toucher un objet qui a déjà le champ. Script à usage unique : le
 * supprimer après usage (les données vivent ensuite dans les fichiers d'ère).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import type { Featured, Statement } from '../src/data/types';

const FILES = [
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
].map((f) => `src/data/domains/${f}.ts`);

const fait = (text: string, sources: string[]): Statement => ({ kind: 'fait', text, sources });
const interp = (text: string, sources: string[]): Statement => ({ kind: 'interpretation', text, sources });
const f = (signature: Statement, headlineResultIds: string[]): Featured => ({ signature, contributions: [], headlineResultIds });

// ——— grandes figures : liste éditoriale (annexe A du plan, validée par le propriétaire) ———
const FEATURED: Record<string, Featured> = {
  // Antiquité
  euclide: f(fait('Organise la géométrie et l’arithmétique grecques en un édifice déductif : les Éléments.', ['vitrac-euclide', 'heath-greek']), ['elements-euclide', 'infinite-des-nombres-premiers', 'cinquieme-postulat']),
  archimede: f(fait('Mesure le cercle, la sphère et la parabole par exhaustion, et fonde la statique.', ['heath-archimedes', 'heath-greek']), ['mesure-du-cercle', 'de-la-sphere-et-du-cylindre', 'la-methode-archimede']),
  aristote: f(fait('Crée la logique formelle, la syllogistique, et la théorie de la science démonstrative.', ['kneale-logic', 'sep']), ['syllogistique', 'seconds-analytiques']),
  diophante: f(fait('Résout en nombres rationnels des centaines de problèmes indéterminés : les Arithmétiques.', ['sesiano-diophante', 'heath-greek']), ['arithmetica-diophante']),
  'liu-hui': f(fait('Justifie les procédures des Neuf Chapitres et calcule π par polygones successifs.', ['chemla-neuf-chapitres', 'martzloff-chine']), ['algorithme-du-cercle-de-liu-hui', 'commentaire-de-liu-hui']),
  // Monde médiéval
  brahmagupta: f(fait('Donne les règles du calcul avec le zéro et les nombres négatifs (628).', ['plofker-india', 'katz-sourcebook']), ['brahmasphutasiddhanta', 'formule-de-brahmagupta']),
  'al-khwarizmi': f(interp('Fait de la résolution des équations une discipline, l’al-jabr, d’où vient « algèbre ».', ['rashed-al-khwarizmi', 'rashed-sciences-arabes']), ['kitab-al-jabr', 'livre-du-calcul-indien']),
  'ibn-al-haytham': f(fait('Refonde l’optique par la géométrie et l’expérience ; mesure le paraboloïde.', ['sabra-optics', 'rashed-infinitesimales']), ['kitab-al-manazir', 'probleme-d-alhazen', 'volume-du-paraboloide-ibn-al-haytham']),
  'qin-jiushao': f(fait('Résout les systèmes de restes (méthode dayan) et les équations jusqu’au degré dix.', ['libbrecht-qin', 'martzloff-chine']), ['methode-dayan', 'extraction-de-racines-qin-jiushao', 'shushu-jiuzhang']),
  fibonacci: f(fait('Enseigne à l’Occident latin le calcul en chiffres indo-arabes (Liber abaci, 1202).', ['sigler-liber-abaci', 'burnett-numerals']), ['liber-abaci', 'suite-de-fibonacci', 'liber-quadratorum']),
  // Renaissance et révolution scientifique
  cardan: f(fait('Publie la résolution générale des équations du 3ᵉ et du 4ᵉ degré (Ars magna, 1545).', ['cardano-ars-magna', 'stedall-from-cardano']), ['formule-de-cardan', 'ars-magna', 'liber-de-ludo-aleae']),
  viete: f(fait('Introduit le calcul littéral : des lettres pour les inconnues et pour les données.', ['stedall-from-cardano', 'katz-history']), ['in-artem-analyticem-isagoge', 'de-aequationum-recognitione-et-emendatione']),
  fermat: f(interp('Refonde l’arithmétique des entiers : petit théorème, descente infinie, dernier théorème.', ['weil-number-theory', 'mahoney-fermat']), ['petit-theoreme-de-fermat', 'dernier-theoreme-de-fermat', 'descente-infinie']),
  descartes: f(fait('Fait de l’algèbre l’instrument de la géométrie : La Géométrie (1637).', ['bos-redefining', 'katz-history']), ['la-geometrie-descartes', 'regle-des-signes-de-descartes']),
  pascal: f(fait('Fonde avec Fermat le calcul des chances (1654) ; construit la Pascaline.', ['hacking-emergence', 'hald-history-1750']), ['correspondance-pascal-fermat', 'traite-du-triangle-arithmetique', 'pascaline']),
  newton: f(fait('Invente le calcul des fluxions et des séries, et l’applique à la gravitation (1687).', ['whiteside-newton', 'guicciardini-newton']), ['serie-du-binome', 'principia-mathematica-newton', 'de-analysi']),
  leibniz: f(fait('Publie le premier le calcul différentiel (1684) et lui donne ses notations d et ∫.', ['hofmann-leibniz', 'edwards-calculus']), ['nova-methodus', 'characteristica-universalis', 'machine-arithmetique-de-leibniz']),
  // Siècle des Lumières
  euler: f(fait('Fait des fonctions l’objet de l’analyse et lui donne ses notations : f(x), e, i, π, Σ.', ['bottazzini-higher-calculus', 'hairer-wanner-analysis']), ['probleme-de-bale', 'introductio-in-analysin-infinitorum', 'sept-ponts-de-konigsberg']),
  'd-alembert': f(fait('Écrit la première équation aux dérivées partielles de la physique : les cordes vibrantes.', ['bottazzini-higher-calculus', 'dieudonne-abrege']), ['equation-des-cordes-vibrantes', 'article-limite-encyclopedie', 'traite-de-dynamique']),
  lagrange: f(fait('Réécrit la mécanique en pur calcul, sans aucune figure (Méchanique analitique, 1788).', ['dieudonne-abrege', 'stedall-sourcebook']), ['mecanique-analytique-lagrange', 'theoreme-des-quatre-carres', 'stabilite-du-systeme-solaire']),
  laplace: f(interp('Achève la mécanique céleste newtonienne et donne aux probabilités leur forme analytique.', ['gillispie-laplace', 'stigler-statistics']), ['traite-de-mecanique-celeste', 'theorie-analytique-des-probabilites', 'theoreme-central-limite-laplace']),
  legendre: f(fait('Énonce la loi de réciprocité quadratique et publie les moindres carrés (1805).', ['weil-number-theory', 'stigler-statistics']), ['loi-de-reciprocite-quadratique-enonce', 'methode-des-moindres-carres', 'essai-sur-la-theorie-des-nombres']),
  // XIXᵉ siècle
  gauss: f(interp('Unifie la théorie des nombres (1801) et fonde la géométrie intrinsèque des surfaces.', ['goldstein-schappacher-schwermer', 'gray-worlds']), ['disquisitiones-arithmeticae', 'theorema-egregium', 'demonstration-de-la-reciprocite-quadratique']),
  cauchy: f(fait('Refonde l’analyse sur les limites (Cours d’analyse, 1821) et crée le calcul des résidus.', ['grabiner-cauchy', 'bottazzini-higher-calculus']), ['cours-d-analyse', 'theoreme-des-residus']),
  galois: f(fait('Lie la résolubilité d’une équation par radicaux à la structure d’un groupe.', ['kleiner-abstract-algebra', 'neumann-galois']), ['theorie-de-galois', 'memoire-de-galois']),
  riemann: f(fait('Fonde la géométrie des variétés (1854) et relie les nombres premiers à la fonction zêta.', ['laugwitz-riemann', 'gray-worlds']), ['hypothese-de-riemann', 'habilitationsvortrag-riemann', 'surfaces-de-riemann']),
  cantor: f(fait('Crée la théorie des ensembles et montre qu’il existe des infinis de tailles différentes.', ['dauben-cantor', 'ferreiros-labyrinth']), ['non-denombrabilite-des-reels', 'argument-diagonal', 'hypothese-du-continu']),
  boole: f(fait('Traduit la logique en algèbre : les lois de la pensée comme calcul sur 0 et 1 (1854).', ['machale-boole', 'grattan-guinness-search']), ['the-laws-of-thought', 'the-mathematical-analysis-of-logic']),
  kovalevskaia: f(fait('Démontre l’existence de solutions analytiques pour une large classe d’EDP.', ['kline-thought', 'bottazzini-higher-calculus']), ['theoreme-de-cauchy-kovalevskaia']),
  // Âge des structures
  hilbert: f(fait('Axiomatise la géométrie, pose 23 problèmes au siècle (1900) et fonde la métamathématique.', ['reid-hilbert', 'gray-hilbert-challenge']), ['problemes-de-hilbert', 'grundlagen-der-geometrie', 'theoreme-de-la-base-de-hilbert']),
  poincare: f(fait('Fonde la topologie algébrique et l’étude qualitative des équations différentielles.', ['dieudonne-topology', 'gowers-companion']), ['analysis-situs', 'conjecture-de-poincare', 'sur-le-probleme-des-trois-corps']),
  noether: f(interp('Relie symétries et lois de conservation (1918), puis refonde l’algèbre sur les structures.', ['dick-noether', 'corry-structures']), ['theoreme-de-noether', 'idealtheorie-in-ringbereichen', 'theoreme-de-brauer-hasse-noether']),
  ramanujan: f(fait('Autodidacte aux carnets de formules ; avec Hardy, compte asymptotiquement les partitions.', ['kanigel-ramanujan', 'gowers-companion']), ['formule-asymptotique-des-partitions', 'conjecture-de-ramanujan', 'lettre-de-ramanujan-a-hardy']),
  kolmogorov: f(fait('Fixe les axiomes du calcul des probabilités (Grundbegriffe, 1933).', ['von-plato-creating', 'shafer-vovk-grundbegriffe']), ['grundbegriffe-der-wahrscheinlichkeitsrechnung', 'theoreme-d-extension-de-kolmogorov', 'methodes-analytiques-de-kolmogorov']),
  godel: f(fait('Montre qu’une théorie cohérente assez riche contient des énoncés indécidables (1931).', ['dawson-godel', 'van-heijenoort']), ['theoremes-d-incompletude', 'theoreme-de-completude', 'fonctions-recursives-generales']),
  turing: f(fait('Définit la machine qui porte son nom et prouve l’indécidabilité de l’arrêt (1936).', ['hodges-turing', 'davis-universal']), ['on-computable-numbers', 'probleme-de-l-arret', 'machine-de-turing-universelle']),
  // Contemporain
  grothendieck: f(interp('Refonde la géométrie algébrique sur les schémas, les topos et de nouvelles cohomologies.', ['jackson-grothendieck', 'dieudonne-geometrie-algebrique']), ['schemas', 'elements-de-geometrie-algebrique', 'theoreme-de-riemann-roch-grothendieck']),
  erdos: f(fait('Fonde la méthode probabiliste (1947) et, avec Rényi, la théorie des graphes aléatoires.', ['alon-spencer-probabilistic', 'hoffman-erdos']), ['methode-probabiliste', 'graphes-aleatoires-d-erdos-renyi']),
  mandelbrot: f(interp('Forge la notion de fractale et fait de l’ordinateur un instrument d’exploration.', ['mandelbrot-fractal-geometry', 'gleick-chaos']), ['ensemble-de-mandelbrot', 'les-objets-fractals']),
  wiles: f(fait('Démontre le dernier théorème de Fermat par la modularité des courbes elliptiques (1995).', ['singh-fermat', 'wiles-modular']), ['demonstration-du-dernier-theoreme-de-fermat']),
  perelman: f(fait('Démontre les conjectures de Poincaré et de géométrisation (2002-2003).', ['szpiro-poincare', 'mactutor']), ['demonstration-de-la-conjecture-de-poincare']),
  mirzakhani: f(fait('Relie le comptage des géodésiques aux volumes des espaces de modules ; Fields 2014.', ['mactutor']), ['volumes-de-weil-petersson']),
  cohen: f(fait('Invente le forcing (1963) et prouve l’indépendance de l’hypothèse du continu.', ['cohen-set-theory-ch', 'moore-origins-forcing']), ['independance-de-l-hypothese-du-continu', 'forcing']),
};

// ——— modèle de la vague 2 : les apports d'Euler ———
FEATURED.euler.contributions = [
  fait(
    'L’Introductio in analysin infinitorum (1748) définit la fonction comme une expression analytique et fait des séries entières sa forme normale : l’analyse cesse d’être une science des courbes.',
    ['bottazzini-higher-calculus', 'hairer-wanner-analysis'],
  ),
  fait(
    'Parmi ses résultats : la somme des inverses des carrés (1735), la formule e^(iθ) = cos θ + i sin θ (1748), la relation S − A + F = 2 des polyèdres (1750) et les équations des fluides parfaits (1757).',
    ['hairer-wanner-analysis', 'bradley-sandifer-euler'],
  ),
  interp(
    'En ramenant le problème des ponts de Königsberg (1736) à une question de connexions, sans mesure ni calcul, il est tenu pour le précurseur de la théorie des graphes et de la topologie.',
    ['mactutor', 'katz-history'],
  ),
];

// ——— modèle de la vague 3 : intuitions et démonstrations ———
const PROOFS: Record<string, { intuition: Statement[]; proof: Statement[] }> = {
  'infinite-des-nombres-premiers': {
    intuition: [
      fait(
        'Multiplier des nombres premiers puis ajouter 1 fabrique un nombre qu’aucun d’eux ne divise : la division par chacun laisse le reste 1. Un nombre premier nouveau se cache donc dans ce produit augmenté de un.',
        ['vitrac-euclide', 'heath-greek'],
      ),
    ],
    proof: [
      fait('Soit une liste finie quelconque de nombres premiers ; Euclide (Éléments, IX, 20) raisonne sur trois d’entre eux, A, B et C, et l’argument vaut pour toute liste.', ['vitrac-euclide', 'heath-greek']),
      fait('On forme le nombre N = A × B × C + 1.', ['vitrac-euclide']),
      fait('N est soit premier, soit mesuré par un nombre premier (VII, 32) : dans les deux cas, un nombre premier P divise N.', ['vitrac-euclide']),
      fait('P n’est ni A, ni B, ni C : s’il l’était, il diviserait à la fois N et A × B × C, donc leur différence, qui vaut 1 — c’est impossible.', ['vitrac-euclide']),
      fait('La liste proposée ne contenait donc pas tous les nombres premiers : il y en a toujours plus que toute quantité donnée.', ['vitrac-euclide']),
    ],
  },
  'probleme-de-bale': {
    intuition: [
      fait(
        'Un polynôme qui vaut 1 en 0 et s’annule en a₁, a₂, …, aₙ s’écrit (1 − x/a₁)(1 − x/a₂)…(1 − x/aₙ), et le coefficient de x y vaut −(1/a₁ + … + 1/aₙ). Euler applique cette règle à sin x / x, dont les racines sont ±π, ±2π, ±3π…, comme à un polynôme de degré infini.',
        ['hairer-wanner-analysis', 'bradley-sandifer-euler'],
      ),
    ],
    proof: [
      fait('Le développement en série donne sin x / x = 1 − x²/6 + x⁴/120 − …', ['hairer-wanner-analysis']),
      fait('Cette fonction s’annule exactement en x = ±π, ±2π, ±3π, …', ['hairer-wanner-analysis']),
      fait('Euler l’écrit comme un produit infini : sin x / x = (1 − x²/π²)(1 − x²/4π²)(1 − x²/9π²)…', ['hairer-wanner-analysis', 'bradley-sandifer-euler']),
      fait('En développant le produit, le coefficient de x² vaut −(1/π²)(1 + 1/4 + 1/9 + …) ; l’égaler à −1/6 donne 1 + 1/4 + 1/9 + … = π²/6.', ['hairer-wanner-analysis']),
      fait('Le seul point délicat est l’écriture de sin x en produit infini, admise par analogie en 1735 et démontrable rigoureusement.', ['bottazzini-higher-calculus']),
    ],
  },
  'petit-theoreme-de-fermat': {
    intuition: [
      fait(
        'Fermat énonce un fait plus précis : la première puissance de a qui laisse le reste 1 dans la division par p a un exposant qui divise p − 1, et les restes des puissances successives reviennent ensuite périodiquement à 1.',
        ['weil-number-theory', 'mahoney-fermat'],
      ),
    ],
    proof: [
      fait('On montre d’abord que p divise aᵖ − a pour tout entier a ≥ 1, par récurrence sur a : c’est la voie suivie par Euler (1736).', ['weil-number-theory']),
      fait('Pour a = 1, aᵖ − a = 0 est divisible par p.', ['weil-number-theory']),
      fait('Par la formule du binôme, (a + 1)ᵖ = aᵖ + 1 + des termes intermédiaires dont chaque coefficient C(p, k), pour 0 < k < p, est divisible par p, puisque p est premier.', ['weil-number-theory']),
      fait('Donc (a + 1)ᵖ − (a + 1) et aᵖ − a diffèrent d’un multiple de p : la propriété passe de a à a + 1.', ['weil-number-theory']),
      fait('Enfin, si p ne divise pas a, alors p, qui divise a × (aᵖ⁻¹ − 1), divise aᵖ⁻¹ − 1 (Éléments, VII, 30).', ['weil-number-theory', 'katz-history']),
    ],
  },
};

// ——— insertion ———
const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const st = (s: Statement) => `{ kind: '${s.kind}', text: ${q(s.text)}, sources: [${(s.sources ?? []).map(q).join(', ')}] }`;
const list = (name: string, items: Statement[]) =>
  items.length === 0 ? [`${name}: [],`] : [`${name}: [`, ...items.map((s) => `  ${st(s)},`), '],'];
const indent = (lines: string[]) => lines.map((l) => `        ${l}`).join('\n');

/** Insère `fields` avant la fermeture « ␣␣␣␣␣␣}, » de l'objet `id` (figure : a `years:` ; résultat : a `year:`). */
function insert(id: string, kind: 'mathematician' | 'result', field: string, fields: string): string {
  for (const path of FILES) {
    const lines = readFileSync(path, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== `        id: '${id}',`) continue;
      let j = i + 1;
      while (j < lines.length && lines[j] !== '      },') j++;
      const body = lines.slice(i, j).join('\n');
      const isMathematician = /\n {8}years: \[/.test(body);
      if ((kind === 'mathematician') !== isMathematician) continue;
      if (body.includes(`\n        ${field}:`)) throw new Error(`${id} : « ${field} » déjà présent`);
      lines.splice(j, 0, fields);
      writeFileSync(path, lines.join('\n'));
      return path;
    }
  }
  throw new Error(`${kind} « ${id} » introuvable`);
}

for (const [id, ft] of Object.entries(FEATURED)) {
  const text = indent([
    'featured: {',
    `  signature: ${st(ft.signature)},`,
    ...list('contributions', ft.contributions).map((l) => `  ${l}`),
    `  headlineResultIds: [${ft.headlineResultIds.map(q).join(', ')}],`,
    '},',
  ]);
  console.log(`grande figure ${id} → ${insert(id, 'mathematician', 'featured', text)}`);
}
for (const [id, p] of Object.entries(PROOFS)) {
  console.log(`résultat ${id} → ${insert(id, 'result', 'intuition', indent([...list('intuition', p.intuition), ...list('proof', p.proof)]))}`);
}
```

## Annexe C — outils des vagues

### C.1 `scripts/coverage.ts` (tâche 2.0)

```ts
/**
 * Avancement du corpus de la refonte « Galerie » (grandes figures, apports,
 * intuitions et démonstrations, figures, slugs MacTutor).
 *
 *   npx tsx scripts/coverage.ts                       résumé
 *   npx tsx scripts/coverage.ts --todo lumieres       résultats de ce fichier d'ère encore sans intuition ou démonstration
 *   npx tsx scripts/coverage.ts --featured            grandes figures encore sans apports
 */
import { DOMAINS } from '../src/data';
import type { Domain } from '../src/data/types';
import { coverage, hasProofMaterial } from '../src/data/completeness';

const ERA_EXPORTS: Record<string, string> = {
  antiquite: 'ANTIQUITE',
  medieval: 'MEDIEVAL',
  renaissance: 'RENAISSANCE',
  lumieres: 'LUMIERES',
  'dixneuvieme-a': 'DIXNEUVIEME_A',
  'dixneuvieme-b': 'DIXNEUVIEME_B',
  'structures-a': 'STRUCTURES_A',
  'structures-b': 'STRUCTURES_B',
  'contemporain-a': 'CONTEMPORAIN_A',
  'contemporain-b': 'CONTEMPORAIN_B',
};

const c = coverage(DOMAINS);
const pct = (a: number, b: number) => `${b === 0 ? 100 : Math.round((100 * a) / b)} %`;
console.log(`grandes figures : ${c.featured}, dont ${c.featuredWithContributions} avec leurs apports`);
console.log(`intuitions et démonstrations : ${c.proofDone} / ${c.proofTargets} (${pct(c.proofDone, c.proofTargets)})`);
console.log(`figures : ${c.mathematicians}, dont ${c.withMactutor} avec un slug MacTutor (${pct(c.withMactutor, c.mathematicians)})`);

const todo = process.argv.indexOf('--todo');
if (todo > 0) {
  const file = process.argv[todo + 1];
  if (!ERA_EXPORTS[file]) {
    console.error(`fichier d'ère inconnu : ${file} (${Object.keys(ERA_EXPORTS).join(', ')})`);
    process.exit(2);
  }
  const mod = (await import(`../src/data/domains/${file}.ts`)) as Record<string, Domain[]>;
  const ids = new Set(mod[ERA_EXPORTS[file]].map((d) => d.id));
  console.log(`\nà rédiger dans ${file}.ts :`);
  for (const d of DOMAINS.filter((x) => ids.has(x.id))) {
    for (const r of d.results) {
      if ((r.kind === 'theoreme' || r.kind === 'conjecture' || r.kind === 'probleme') && !hasProofMaterial(r)) {
        console.log(`  ${d.id} · ${r.id} [${r.kind}] ${r.title} (${r.year})`);
      }
    }
  }
}
if (process.argv.includes('--featured')) {
  console.log('\ngrandes figures sans apports :');
  for (const d of DOMAINS) for (const m of d.mathematicians) if (m.featured && m.featured.contributions.length === 0) console.log(`  ${d.id} · ${m.id}`);
}
```

### C.2 `scripts/mactutor.ts` (tâche 4.1)

S’appuie sur `src/lib/mactutor.ts` (tâche 1.1). Pages mises en cache dans `scripts/.cache/mactutor/` ; 300 ms entre deux requêtes.

```ts
/**
 * Contrôle des figures contre l'archive MacTutor (University of St Andrews) :
 * la page de biographie existe, et les années de vie de l'atlas concordent
 * avec les siennes (tolérance de 15 ans si l'une des deux dates est approchée).
 *
 *   npx tsx scripts/mactutor.ts                    toutes les figures dotées d'un slug
 *   npx tsx scripts/mactutor.ts --domain <id>      un seul domaine
 *   npx tsx scripts/mactutor.ts --strict           code de sortie 1 au moindre écart (vague 4)
 *   npx tsx scripts/mactutor.ts --suggest <id>     figures du domaine sans slug : slugs candidats vérifiés
 *
 * Les pages sont mises en cache dans scripts/.cache/mactutor/ (ignoré par git).
 * Le script signale ; il ne corrige jamais les données : un écart se tranche
 * à la main, sources à l'appui (et se signale au propriétaire).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { DOMAINS } from '../src/data';
import type { Mathematician } from '../src/data/types';
import { compareYears, parseLifeYears } from '../src/lib/mactutor';
import { normalizeText } from '../src/lib/normalize';

const BASE = 'https://mathshistory.st-andrews.ac.uk/Biographies/';
const CACHE = 'scripts/.cache/mactutor';
mkdirSync(CACHE, { recursive: true });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Page de biographie (cache local), ou null si elle n'existe pas. */
async function biography(slug: string): Promise<string | null> {
  const file = `${CACHE}/${slug.replace(/[^A-Za-z0-9_-]/g, '_')}.html`;
  if (existsSync(file)) return readFileSync(file, 'utf8');
  await sleep(300); // courtoisie envers le serveur
  const res = await fetch(`${BASE}${slug}/`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${slug} : HTTP ${res.status}`);
  const html = await res.text();
  writeFileSync(file, html);
  return html;
}

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const strict = process.argv.includes('--strict');
const domainId = arg('--domain');
const suggestFor = arg('--suggest');

if (suggestFor) {
  const d = DOMAINS.find((x) => x.id === suggestFor);
  if (!d) throw new Error(`domaine inconnu : ${suggestFor}`);
  for (const m of d.mathematicians.filter((x) => !x.mactutor)) {
    const words = normalizeText(m.name).split(' ').filter((w) => w.length > 1);
    const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
    const last = cap(words[words.length - 1] ?? '');
    const candidates = [...new Set([last, `${last}_${cap(words[0] ?? '')}`])];
    const found: string[] = [];
    for (const slug of candidates) if (await biography(slug)) found.push(slug);
    console.log(`${m.id.padEnd(28)} ${found.length ? found.join(' | ') : '(aucun candidat : chercher à la main sur MacTutor)'}`);
  }
  process.exit(0);
}

const figures: { domain: string; m: Mathematician }[] = DOMAINS.filter((d) => !domainId || d.id === domainId).flatMap((d) =>
  d.mathematicians.filter((m) => m.mactutor).map((m) => ({ domain: d.id, m })),
);
let bad = 0;
for (const { domain, m } of figures) {
  const html = await biography(m.mactutor!);
  if (!html) {
    bad++;
    console.log(`✗ ${domain} · ${m.id} : page introuvable (${m.mactutor})`);
    continue;
  }
  const { verdict, detail } = compareYears(m.years, !!m.yearsApprox, parseLifeYears(html));
  if (verdict === 'ok') continue;
  bad++;
  console.log(`✗ ${domain} · ${m.id} : ${detail}`);
}
console.log(`${figures.length} figure(s) contrôlée(s), ${bad} écart(s).`);
process.exit(strict && bad > 0 ? 1 : 0);
```

## Annexe D — correctif du sous-projet 1

Correctif `git` (6547 lignes, 58 fichiers), produit depuis l’état « Lignées » du working tree et vérifié sur une copie du dépôt : typecheck à 0 erreur, lint sans erreur, 54 tests unitaires, 44 tests e2e après la tâche 1.3. Il ne contient ni les grandes figures ni les exemples (tâche 1.3, annexe B), ni les outils des vagues (annexe C), ni le chargement des fiches courtes (tâche 4.2).

Extraction (tâche 1.0) :

```bash
awk '/^````diff$/{f=1;next} /^````$/{if(f)exit} f' docs/superpowers/plans/2026-10-12-refonte-galerie.md > /tmp/galerie.patch
shasum -a 256 /tmp/galerie.patch
```

Empreinte SHA-256 attendue : `52177f60a67e8c6f97e2a06ecaf9a55060c9dd5fbb26c3379c9f0b486e5e783e`

````diff
diff --git a/docs/corpus/BRIEF.md b/docs/corpus/BRIEF.md
index 29c9e45..6716900 100644
--- a/docs/corpus/BRIEF.md
+++ b/docs/corpus/BRIEF.md
@@ -131,141 +131,141 @@ fois coupé aux espaces (vérifié par `src/map/__tests__/labels.test.ts`).
 
 ### Fichier `antiquite.ts` — ère `antiquite` (−1800 → 500)
 
-**`calcul-des-scribes`** — Calcul des scribes : Égypte et Mésopotamie · antiquite · { start: −1800, end: −300, approx: true } · ['nombres', 'hasard'] · ['Babylone', 'Nippur', 'Thèbes', 'Suse'] · map { x: 300, y: 420, size: 2, palette: { fill: '#eee4d2', stroke: '#715528', accent: '#b8832e' } } · préfixe `cs-` · figures : `ahmes` (Ahmès, [−1600, −1530] approx, Thèbes), `nabu-rimannu` (Nabû-rīmannu, [−540, −470] approx, Babylone), `kidinnu` (Kidinnu, [−420, −340] approx, Babylone) · résultats : `papyrus-rhind` (Papyrus Rhind, −1550 approx, texte), `plimpton-322` (Tablette Plimpton 322, −1800 approx, texte), `ybc-7289` (Tablette YBC 7289 : √2 sexagésimal, −1700 approx, texte), `resolution-des-equations-du-second-degre-babyloniennes` (Procédures du second degré, −1700 approx, methode), `numeration-de-position-sexagesimale` (Numération de position sexagésimale, −1950 approx, concept ; attestée dès la fin du IIIᵉ millénaire, bornée à −1950 par la fenêtre de validation), `systeme-b-lunaire` (Système B des éphémérides lunaires, −300 approx, methode) · liens : aucun (domaine source).
+**`calcul-des-scribes`** — Calcul des scribes : Égypte et Mésopotamie · antiquite · { start: −1800, end: −300, approx: true } · ['nombres', 'hasard'] · ['Babylone', 'Nippur', 'Thèbes', 'Suse'] · map { x: 300, y: 420, size: 2, palette: { fill: '#f0e7d1', stroke: '#6f5b2a', accent: '#8e7229' } } · préfixe `cs-` · figures : `ahmes` (Ahmès, [−1600, −1530] approx, Thèbes), `nabu-rimannu` (Nabû-rīmannu, [−540, −470] approx, Babylone), `kidinnu` (Kidinnu, [−420, −340] approx, Babylone) · résultats : `papyrus-rhind` (Papyrus Rhind, −1550 approx, texte), `plimpton-322` (Tablette Plimpton 322, −1800 approx, texte), `ybc-7289` (Tablette YBC 7289 : √2 sexagésimal, −1700 approx, texte), `resolution-des-equations-du-second-degre-babyloniennes` (Procédures du second degré, −1700 approx, methode), `numeration-de-position-sexagesimale` (Numération de position sexagésimale, −1950 approx, concept ; attestée dès la fin du IIIᵉ millénaire, bornée à −1950 par la fenêtre de validation), `systeme-b-lunaire` (Système B des éphémérides lunaires, −300 approx, methode) · liens : aucun (domaine source).
 
-**`arithmetique-grecque`** — Arithmétique grecque : des pythagoriciens à Diophante · antiquite · { start: −530, end: 400, approx: true } · ['nombres'] · ['Crotone', 'Tarente', 'Alexandrie'] · map { x: 760, y: 560, size: 2, palette: { fill: '#f3ecdd', stroke: '#7d642c', accent: '#c49831' } } · préfixe `ag-` · figures : `archytas` (Archytas de Tarente, [−428, −347] approx, Tarente), `eratosthene` (Ératosthène, [−276, −194] approx, Cyrène et Alexandrie), `nicomaque` (Nicomaque de Gérase, [60, 120] approx, Gérase), `diophante` (Diophante d’Alexandrie, [200, 284] approx, Alexandrie), `hypatie` (Hypatie, [355, 415] approx, Alexandrie) · résultats : `infinite-des-nombres-premiers` (Infinité des nombres premiers, Éléments IX.20, −300 approx, theoreme, mathematicianId `euclide` via related), `nombres-parfaits-euclide` (Nombres parfaits pairs, Éléments IX.36, −300 approx, theoreme, `euclide`), `crible-d-eratosthene` (Crible d’Ératosthène, −240 approx, methode), `introduction-arithmetique-nicomaque` (Introduction arithmétique, 100 approx, texte), `arithmetica-diophante` (Arithmétiques, 250 approx, texte), `nombres-figures-pythagoriciens` (Nombres figurés, −500 approx, concept) · related : `euclide`, `pythagore` · liens : `calcul-des-scribes` → influence (interprétation : héritage babylonien discuté), `geometrie-grecque` → filiation.
+**`arithmetique-grecque`** — Arithmétique grecque : des pythagoriciens à Diophante · antiquite · { start: −530, end: 400, approx: true } · ['nombres'] · ['Crotone', 'Tarente', 'Alexandrie'] · map { x: 760, y: 560, size: 2, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } } · préfixe `ag-` · figures : `archytas` (Archytas de Tarente, [−428, −347] approx, Tarente), `eratosthene` (Ératosthène, [−276, −194] approx, Cyrène et Alexandrie), `nicomaque` (Nicomaque de Gérase, [60, 120] approx, Gérase), `diophante` (Diophante d’Alexandrie, [200, 284] approx, Alexandrie), `hypatie` (Hypatie, [355, 415] approx, Alexandrie) · résultats : `infinite-des-nombres-premiers` (Infinité des nombres premiers, Éléments IX.20, −300 approx, theoreme, mathematicianId `euclide` via related), `nombres-parfaits-euclide` (Nombres parfaits pairs, Éléments IX.36, −300 approx, theoreme, `euclide`), `crible-d-eratosthene` (Crible d’Ératosthène, −240 approx, methode), `introduction-arithmetique-nicomaque` (Introduction arithmétique, 100 approx, texte), `arithmetica-diophante` (Arithmétiques, 250 approx, texte), `nombres-figures-pythagoriciens` (Nombres figurés, −500 approx, concept) · related : `euclide`, `pythagore` · liens : `calcul-des-scribes` → influence (interprétation : héritage babylonien discuté), `geometrie-grecque` → filiation.
 
-**`geometrie-grecque`** — Géométrie grecque classique : de Thalès aux Éléments · antiquite · { start: −600, end: −250, approx: true } · ['formes', 'fondements'] · ['Milet', 'Crotone', 'Athènes', 'Cnide', 'Alexandrie'] · map { x: 450, y: 1250, size: 3, palette: { fill: '#d6e6f0', stroke: '#295875', accent: '#2f86bc' } } · préfixe `gg-` · figures : `thales` (Thalès de Milet, [−625, −547] approx, Milet), `pythagore` (Pythagore, [−570, −495] approx, Samos et Crotone), `hippocrate-de-chios` (Hippocrate de Chios, [−470, −410] approx, Athènes), `theetete` (Théétète, [−417, −369] approx, Athènes), `eudoxe` (Eudoxe de Cnide, [−408, −355] approx, Cnide), `euclide` (Euclide, [−325, −265] approx, Alexandrie) · résultats : `elements-euclide` (Éléments, −300 approx, texte), `theoreme-de-pythagore` (Théorème de Pythagore, −530 approx, theoreme), `incommensurabilite-de-la-diagonale` (Incommensurabilité de la diagonale et du côté, −430 approx, theoreme), `methode-d-exhaustion` (Méthode d’exhaustion, −370 approx, methode, `eudoxe`), `theorie-des-proportions-eudoxe` (Théorie des proportions, Éléments V, −360 approx, concept, `eudoxe`), `cinquieme-postulat` (Cinquième postulat, −300 approx, probleme), `trois-problemes-classiques` (Duplication du cube, trisection de l’angle, quadrature du cercle, −450 approx, probleme), `lunules-d-hippocrate` (Quadrature des lunules, −440 approx, theoreme) · liens : `calcul-des-scribes` → influence (fait : transmission attestée de résultats, débattue dans sa forme).
+**`geometrie-grecque`** — Géométrie grecque classique : de Thalès aux Éléments · antiquite · { start: −600, end: −250, approx: true } · ['formes', 'fondements'] · ['Milet', 'Crotone', 'Athènes', 'Cnide', 'Alexandrie'] · map { x: 450, y: 1250, size: 3, palette: { fill: '#cdddee', stroke: '#29496b', accent: '#28588a' } } · préfixe `gg-` · figures : `thales` (Thalès de Milet, [−625, −547] approx, Milet), `pythagore` (Pythagore, [−570, −495] approx, Samos et Crotone), `hippocrate-de-chios` (Hippocrate de Chios, [−470, −410] approx, Athènes), `theetete` (Théétète, [−417, −369] approx, Athènes), `eudoxe` (Eudoxe de Cnide, [−408, −355] approx, Cnide), `euclide` (Euclide, [−325, −265] approx, Alexandrie) · résultats : `elements-euclide` (Éléments, −300 approx, texte), `theoreme-de-pythagore` (Théorème de Pythagore, −530 approx, theoreme), `incommensurabilite-de-la-diagonale` (Incommensurabilité de la diagonale et du côté, −430 approx, theoreme), `methode-d-exhaustion` (Méthode d’exhaustion, −370 approx, methode, `eudoxe`), `theorie-des-proportions-eudoxe` (Théorie des proportions, Éléments V, −360 approx, concept, `eudoxe`), `cinquieme-postulat` (Cinquième postulat, −300 approx, probleme), `trois-problemes-classiques` (Duplication du cube, trisection de l’angle, quadrature du cercle, −450 approx, probleme), `lunules-d-hippocrate` (Quadrature des lunules, −440 approx, theoreme) · liens : `calcul-des-scribes` → influence (fait : transmission attestée de résultats, débattue dans sa forme).
 
-**`mathematiques-hellenistiques`** — Mathématiques hellénistiques : Archimède, Apollonius, Ptolémée · antiquite · { start: −300, end: 350, approx: true } · ['analyse', 'formes'] · ['Alexandrie', 'Syracuse', 'Pergé', 'Rhodes'] · map { x: 560, y: 2250, size: 3, palette: { fill: '#d3c7ea', stroke: '#3b2466', accent: '#582bab' } } · préfixe `mh-` · figures : `archimede` (Archimède, [−287, −212], Syracuse), `apollonius` (Apollonius de Pergé, [−262, −190] approx, Pergé et Alexandrie), `hipparque` (Hipparque, [−190, −120] approx, Nicée et Rhodes), `heron` (Héron d’Alexandrie, [10, 70] approx, Alexandrie), `ptolemee` (Claude Ptolémée, [100, 170] approx, Alexandrie), `pappus` (Pappus d’Alexandrie, [290, 350] approx, Alexandrie) · résultats : `mesure-du-cercle` (De la mesure du cercle : 3 + 10/71 < π < 3 + 1/7, −250 approx, theoreme), `la-methode-archimede` (La Méthode relative aux théorèmes mécaniques, −250 approx, texte), `quadrature-de-la-parabole` (Quadrature de la parabole, −250 approx, theoreme), `de-la-sphere-et-du-cylindre` (De la sphère et du cylindre, −225 approx, theoreme), `coniques-apollonius` (Coniques, −200 approx, texte), `table-des-cordes-hipparque` (Table des cordes, −150 approx, methode), `formule-de-heron` (Formule de Héron, 60 approx, theoreme), `almageste` (Almageste, 150 approx, texte), `collection-mathematique-pappus` (Collection mathématique, 320 approx, texte) · liens : `geometrie-grecque` → filiation, `calcul-des-scribes` → influence (astronomie babylonienne → Hipparque, fait).
+**`mathematiques-hellenistiques`** — Mathématiques hellénistiques : Archimède, Apollonius, Ptolémée · antiquite · { start: −300, end: 350, approx: true } · ['analyse', 'formes'] · ['Alexandrie', 'Syracuse', 'Pergé', 'Rhodes'] · map { x: 560, y: 2250, size: 3, palette: { fill: '#dbcdee', stroke: '#44296b', accent: '#51288a' } } · préfixe `mh-` · figures : `archimede` (Archimède, [−287, −212], Syracuse), `apollonius` (Apollonius de Pergé, [−262, −190] approx, Pergé et Alexandrie), `hipparque` (Hipparque, [−190, −120] approx, Nicée et Rhodes), `heron` (Héron d’Alexandrie, [10, 70] approx, Alexandrie), `ptolemee` (Claude Ptolémée, [100, 170] approx, Alexandrie), `pappus` (Pappus d’Alexandrie, [290, 350] approx, Alexandrie) · résultats : `mesure-du-cercle` (De la mesure du cercle : 3 + 10/71 < π < 3 + 1/7, −250 approx, theoreme), `la-methode-archimede` (La Méthode relative aux théorèmes mécaniques, −250 approx, texte), `quadrature-de-la-parabole` (Quadrature de la parabole, −250 approx, theoreme), `de-la-sphere-et-du-cylindre` (De la sphère et du cylindre, −225 approx, theoreme), `coniques-apollonius` (Coniques, −200 approx, texte), `table-des-cordes-hipparque` (Table des cordes, −150 approx, methode), `formule-de-heron` (Formule de Héron, 60 approx, theoreme), `almageste` (Almageste, 150 approx, texte), `collection-mathematique-pappus` (Collection mathématique, 320 approx, texte) · liens : `geometrie-grecque` → filiation, `calcul-des-scribes` → influence (astronomie babylonienne → Hipparque, fait).
 
-**`mathematiques-chinoises-anciennes`** — Mathématiques chinoises anciennes : des Neuf chapitres à Zu Chongzhi · antiquite · { start: −200, end: 500, approx: true } · ['hasard', 'nombres'] · ['Chang’an', 'Luoyang', 'Jiankang'] · map { x: 520, y: 3200, size: 2, palette: { fill: '#edd6cf', stroke: '#6d3726', accent: '#b44c2d' } } · préfixe `mca-` · figures : `zhang-cang` (Zhang Cang, [−253, −152] approx, Chang’an), `liu-hui` (Liu Hui, [225, 295] approx, royaume de Wei), `sunzi` (Sunzi, [380, 450] approx, Chine), `zu-chongzhi` (Zu Chongzhi, [429, 500], Jiankang) · résultats : `neuf-chapitres` (Les Neuf Chapitres sur l’art mathématique, −100 approx, texte), `zhoubi-suanjing` (Zhoubi suanjing, −100 approx, texte), `methode-fangcheng` (Méthode fangcheng : élimination sur tableau de baguettes, −100 approx, methode), `commentaire-de-liu-hui` (Commentaire des Neuf Chapitres, 263, texte), `algorithme-du-cercle-de-liu-hui` (Algorithme du cercle : π ≈ 3,1416, 263, methode), `theoreme-des-restes-chinois` (Problème des restes du Sunzi suanjing, 400 approx, theoreme), `encadrement-de-pi-zu-chongzhi` (3,1415926 < π < 3,1415927, 480 approx, theoreme) · liens : aucun (tradition indépendante ; une affinité → `mathematiques-hellenistiques` possible, interprétation).
+**`mathematiques-chinoises-anciennes`** — Mathématiques chinoises anciennes : des Neuf chapitres à Zu Chongzhi · antiquite · { start: −200, end: 500, approx: true } · ['hasard', 'nombres'] · ['Chang’an', 'Luoyang', 'Jiankang'] · map { x: 520, y: 3200, size: 2, palette: { fill: '#edd2c9', stroke: '#683627', accent: '#863d27' } } · préfixe `mca-` · figures : `zhang-cang` (Zhang Cang, [−253, −152] approx, Chang’an), `liu-hui` (Liu Hui, [225, 295] approx, royaume de Wei), `sunzi` (Sunzi, [380, 450] approx, Chine), `zu-chongzhi` (Zu Chongzhi, [429, 500], Jiankang) · résultats : `neuf-chapitres` (Les Neuf Chapitres sur l’art mathématique, −100 approx, texte), `zhoubi-suanjing` (Zhoubi suanjing, −100 approx, texte), `methode-fangcheng` (Méthode fangcheng : élimination sur tableau de baguettes, −100 approx, methode), `commentaire-de-liu-hui` (Commentaire des Neuf Chapitres, 263, texte), `algorithme-du-cercle-de-liu-hui` (Algorithme du cercle : π ≈ 3,1416, 263, methode), `theoreme-des-restes-chinois` (Problème des restes du Sunzi suanjing, 400 approx, theoreme), `encadrement-de-pi-zu-chongzhi` (3,1415926 < π < 3,1415927, 480 approx, theoreme) · liens : aucun (tradition indépendante ; une affinité → `mathematiques-hellenistiques` possible, interprétation).
 
-**`logique-antique`** — Logique et philosophie des mathématiques antiques · antiquite · { start: −450, end: 485, approx: true } · ['fondements'] · ['Élée', 'Athènes', 'Stagire'] · map { x: 480, y: 4150, size: 1, palette: { fill: '#c3e9d1', stroke: '#22623a', accent: '#2aa758' } } · préfixe `la-` · figures : `zenon-d-elee` (Zénon d’Élée, [−490, −430] approx, Élée), `platon` (Platon, [−428, −348] approx, Athènes), `aristote` (Aristote, [−384, −322], Stagire et Athènes), `chrysippe` (Chrysippe, [−279, −206] approx, Soles et Athènes), `proclus` (Proclus, [412, 485], Athènes) · résultats : `paradoxes-de-zenon` (Paradoxes de Zénon, −450 approx, probleme), `menon-duplication-du-carre` (Le Ménon : la duplication du carré, −385 approx, texte), `seconds-analytiques` (Seconds Analytiques : la science démonstrative, −340 approx, texte), `syllogistique` (Syllogistique, −340 approx, concept), `logique-stoicienne` (Logique propositionnelle stoïcienne, −250 approx, concept), `commentaire-de-proclus` (Commentaire sur le premier livre des Éléments, 460 approx, texte) · liens : `geometrie-grecque` → affinité (interprétation : la preuve euclidienne et le modèle aristotélicien de la science), `geometrie-grecque` → reaction possible (Zénon contre le continu).
+**`logique-antique`** — Logique et philosophie des mathématiques antiques · antiquite · { start: −450, end: 485, approx: true } · ['fondements'] · ['Élée', 'Athènes', 'Stagire'] · map { x: 480, y: 4150, size: 1, palette: { fill: '#c9edd5', stroke: '#27683d', accent: '#278647' } } · préfixe `la-` · figures : `zenon-d-elee` (Zénon d’Élée, [−490, −430] approx, Élée), `platon` (Platon, [−428, −348] approx, Athènes), `aristote` (Aristote, [−384, −322], Stagire et Athènes), `chrysippe` (Chrysippe, [−279, −206] approx, Soles et Athènes), `proclus` (Proclus, [412, 485], Athènes) · résultats : `paradoxes-de-zenon` (Paradoxes de Zénon, −450 approx, probleme), `menon-duplication-du-carre` (Le Ménon : la duplication du carré, −385 approx, texte), `seconds-analytiques` (Seconds Analytiques : la science démonstrative, −340 approx, texte), `syllogistique` (Syllogistique, −340 approx, concept), `logique-stoicienne` (Logique propositionnelle stoïcienne, −250 approx, concept), `commentaire-de-proclus` (Commentaire sur le premier livre des Éléments, 460 approx, texte) · liens : `geometrie-grecque` → affinité (interprétation : la preuve euclidienne et le modèle aristotélicien de la science), `geometrie-grecque` → reaction possible (Zénon contre le continu).
 
 ### Fichier `medieval.ts` — ère `medieval` (500 → 1450)
 
-**`mathematiques-indiennes`** — Mathématiques indiennes classiques : d’Āryabhaṭa à l’école du Kerala · medieval · { start: 400, end: 1550, approx: true } · ['nombres', 'analyse'] · ['Kusumapura', 'Ujjain', 'Bijapur', 'Kerala'] · map { x: 1230, y: 430, size: 3, palette: { fill: '#ede1cf', stroke: '#6d5126', accent: '#b47e2d' } } · préfixe `mi-` · figures : `aryabhata` (Āryabhaṭa, [476, 550] approx, Kusumapura), `brahmagupta` (Brahmagupta, [598, 668] approx, Bhinmal et Ujjain), `bhaskara-ii` (Bhāskara II, [1114, 1185], Bijapur et Ujjain), `madhava` (Mādhava de Sangamagrāma, [1340, 1425] approx, Kerala), `nilakantha` (Nīlakaṇṭha Somayājī, [1444, 1544] approx, Kerala) · résultats : `aryabhatiya` (Āryabhaṭīya, 499, texte), `brahmasphutasiddhanta` (Brāhmasphuṭasiddhānta : règles du zéro et des négatifs, 628, texte), `formule-de-brahmagupta` (Aire du quadrilatère inscrit, 628, theoreme), `methode-chakravala` (Méthode chakravāla, 1150 approx, methode), `lilavati` (Līlāvatī, 1150 approx, texte), `serie-de-madhava-pour-pi` (Série de Mādhava pour π, 1400 approx, theoreme), `series-de-madhava-sinus-cosinus` (Développements du sinus et du cosinus, 1400 approx, theoreme), `tantrasangraha` (Tantrasaṅgraha, 1500, texte) · liens : `calcul-des-scribes` → influence (interprétation), `mathematiques-hellenistiques` → influence (trigonométrie des cordes → sinus, fait documenté par l’astronomie).
+**`mathematiques-indiennes`** — Mathématiques indiennes classiques : d’Āryabhaṭa à l’école du Kerala · medieval · { start: 400, end: 1550, approx: true } · ['nombres', 'analyse'] · ['Kusumapura', 'Ujjain', 'Bijapur', 'Kerala'] · map { x: 1230, y: 430, size: 3, palette: { fill: '#ecddc6', stroke: '#644b26', accent: '#825d26' } } · préfixe `mi-` · figures : `aryabhata` (Āryabhaṭa, [476, 550] approx, Kusumapura), `brahmagupta` (Brahmagupta, [598, 668] approx, Bhinmal et Ujjain), `bhaskara-ii` (Bhāskara II, [1114, 1185], Bijapur et Ujjain), `madhava` (Mādhava de Sangamagrāma, [1340, 1425] approx, Kerala), `nilakantha` (Nīlakaṇṭha Somayājī, [1444, 1544] approx, Kerala) · résultats : `aryabhatiya` (Āryabhaṭīya, 499, texte), `brahmasphutasiddhanta` (Brāhmasphuṭasiddhānta : règles du zéro et des négatifs, 628, texte), `formule-de-brahmagupta` (Aire du quadrilatère inscrit, 628, theoreme), `methode-chakravala` (Méthode chakravāla, 1150 approx, methode), `lilavati` (Līlāvatī, 1150 approx, texte), `serie-de-madhava-pour-pi` (Série de Mādhava pour π, 1400 approx, theoreme), `series-de-madhava-sinus-cosinus` (Développements du sinus et du cosinus, 1400 approx, theoreme), `tantrasangraha` (Tantrasaṅgraha, 1500, texte) · liens : `calcul-des-scribes` → influence (interprétation), `mathematiques-hellenistiques` → influence (trigonométrie des cordes → sinus, fait documenté par l’astronomie).
 
-**`algebre-arabe`** — Algèbre et arithmétique du monde islamique · medieval · { start: 800, end: 1300, approx: true } · ['nombres'] · ['Bagdad', 'Le Caire', 'Ispahan', 'Nichapour'] · map { x: 1600, y: 620, size: 3, palette: { fill: '#ede4cf', stroke: '#6d5826', accent: '#b48b2d' } } · préfixe `aa-` · figures : `al-khwarizmi` (Muḥammad ibn Mūsā al-Khwārizmī, [780, 850] approx, Bagdad), `abu-kamil` (Abū Kāmil, [850, 930] approx, Égypte), `al-karaji` (Al-Karajī, [953, 1029] approx, Bagdad), `omar-khayyam` (Omar Khayyām, [1048, 1131], Nichapour et Ispahan), `al-samawal` (Al-Samaw’al, [1130, 1180] approx, Bagdad et Maragha), `sharaf-al-din-al-tusi` (Sharaf al-Dīn al-Ṭūsī, [1135, 1213] approx, Tūs) · résultats : `kitab-al-jabr` (Kitāb al-jabr wa-l-muqābala, 820 approx, texte), `livre-du-calcul-indien` (Livre de l’addition et de la soustraction d’après le calcul indien, 825 approx, texte), `algebre-d-abu-kamil` (Kitāb fī al-jabr, 900 approx, texte), `al-fakhri` (Al-Fakhrī : l’algèbre des polynômes, 1010 approx, texte), `classification-des-cubiques-khayyam` (Résolution géométrique des équations cubiques, 1070 approx, theoreme), `al-bahir` (Al-Bāhir fī al-jabr : division des polynômes, 1150 approx, texte), `maxima-des-cubiques-sharaf-al-din` (Étude des cubiques et de leurs maxima, 1200 approx, methode) · related : `thabit-ibn-qurra` · liens : `arithmetique-grecque` → filiation (Diophante traduit par Qusṭā ibn Lūqā, fait), `mathematiques-indiennes` → influence (numération, fait), `calcul-des-scribes` → affinité (interprétation).
+**`algebre-arabe`** — Algèbre et arithmétique du monde islamique · medieval · { start: 800, end: 1300, approx: true } · ['nombres'] · ['Bagdad', 'Le Caire', 'Ispahan', 'Nichapour'] · map { x: 1600, y: 620, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } } · préfixe `aa-` · figures : `al-khwarizmi` (Muḥammad ibn Mūsā al-Khwārizmī, [780, 850] approx, Bagdad), `abu-kamil` (Abū Kāmil, [850, 930] approx, Égypte), `al-karaji` (Al-Karajī, [953, 1029] approx, Bagdad), `omar-khayyam` (Omar Khayyām, [1048, 1131], Nichapour et Ispahan), `al-samawal` (Al-Samaw’al, [1130, 1180] approx, Bagdad et Maragha), `sharaf-al-din-al-tusi` (Sharaf al-Dīn al-Ṭūsī, [1135, 1213] approx, Tūs) · résultats : `kitab-al-jabr` (Kitāb al-jabr wa-l-muqābala, 820 approx, texte), `livre-du-calcul-indien` (Livre de l’addition et de la soustraction d’après le calcul indien, 825 approx, texte), `algebre-d-abu-kamil` (Kitāb fī al-jabr, 900 approx, texte), `al-fakhri` (Al-Fakhrī : l’algèbre des polynômes, 1010 approx, texte), `classification-des-cubiques-khayyam` (Résolution géométrique des équations cubiques, 1070 approx, theoreme), `al-bahir` (Al-Bāhir fī al-jabr : division des polynômes, 1150 approx, texte), `maxima-des-cubiques-sharaf-al-din` (Étude des cubiques et de leurs maxima, 1200 approx, methode) · related : `thabit-ibn-qurra` · liens : `arithmetique-grecque` → filiation (Diophante traduit par Qusṭā ibn Lūqā, fait), `mathematiques-indiennes` → influence (numération, fait), `calcul-des-scribes` → affinité (interprétation).
 
-**`geometrie-arabe`** — Géométrie, optique et trigonométrie du monde islamique · medieval · { start: 850, end: 1450, approx: true } · ['formes', 'analyse'] · ['Bagdad', 'Le Caire', 'Ghazni', 'Maragha', 'Samarcande'] · map { x: 1400, y: 1450, size: 2, palette: { fill: '#cbdaec', stroke: '#25456a', accent: '#2c69af' } } · préfixe `ga-` · figures : `thabit-ibn-qurra` (Thābit ibn Qurra, [826, 901], Harran et Bagdad), `abu-l-wafa` (Abū l-Wafā’, [940, 998], Bagdad), `ibn-al-haytham` (Ibn al-Haytham, [965, 1040] approx, Bassora et Le Caire), `al-biruni` (Al-Bīrūnī, [973, 1048], Khwarezm et Ghazni), `nasir-al-din-al-tusi` (Naṣīr al-Dīn al-Ṭūsī, [1201, 1274], Tūs et Maragha), `al-kashi` (Al-Kāshī, [1380, 1429] approx, Samarcande) · résultats : `theoreme-de-thabit-nombres-amiables` (Règle de Thābit pour les nombres amiables, 870 approx, theoreme), `traductions-de-la-maison-de-la-sagesse` (Traductions d’Euclide, d’Archimède et d’Apollonius, 850 approx, texte), `kitab-al-manazir` (Kitāb al-Manāẓir : Traité d’optique, 1021 approx, texte), `probleme-d-alhazen` (Problème d’Alhazen, 1021 approx, probleme), `volume-du-paraboloide-ibn-al-haytham` (Volume du paraboloïde par sommation, 1000 approx, theoreme), `traite-du-quadrilatere` (Traité du quadrilatère complet : la trigonométrie autonome, 1250 approx, texte), `quadrilatere-de-tusi` (Tentative sur les parallèles, 1250 approx, probleme), `miftah-al-hisab` (Miftāḥ al-ḥisāb : fractions décimales, 1427, texte), `calcul-de-pi-al-kashi` (π à seize décimales, 1424, methode) · liens : `geometrie-grecque` → filiation, `mathematiques-hellenistiques` → filiation, `mathematiques-indiennes` → influence (sinus).
+**`geometrie-arabe`** — Géométrie, optique et trigonométrie du monde islamique · medieval · { start: 850, end: 1450, approx: true } · ['formes', 'analyse'] · ['Bagdad', 'Le Caire', 'Ghazni', 'Maragha', 'Samarcande'] · map { x: 1400, y: 1450, size: 2, palette: { fill: '#c9dced', stroke: '#274a68', accent: '#275a86' } } · préfixe `ga-` · figures : `thabit-ibn-qurra` (Thābit ibn Qurra, [826, 901], Harran et Bagdad), `abu-l-wafa` (Abū l-Wafā’, [940, 998], Bagdad), `ibn-al-haytham` (Ibn al-Haytham, [965, 1040] approx, Bassora et Le Caire), `al-biruni` (Al-Bīrūnī, [973, 1048], Khwarezm et Ghazni), `nasir-al-din-al-tusi` (Naṣīr al-Dīn al-Ṭūsī, [1201, 1274], Tūs et Maragha), `al-kashi` (Al-Kāshī, [1380, 1429] approx, Samarcande) · résultats : `theoreme-de-thabit-nombres-amiables` (Règle de Thābit pour les nombres amiables, 870 approx, theoreme), `traductions-de-la-maison-de-la-sagesse` (Traductions d’Euclide, d’Archimède et d’Apollonius, 850 approx, texte), `kitab-al-manazir` (Kitāb al-Manāẓir : Traité d’optique, 1021 approx, texte), `probleme-d-alhazen` (Problème d’Alhazen, 1021 approx, probleme), `volume-du-paraboloide-ibn-al-haytham` (Volume du paraboloïde par sommation, 1000 approx, theoreme), `traite-du-quadrilatere` (Traité du quadrilatère complet : la trigonométrie autonome, 1250 approx, texte), `quadrilatere-de-tusi` (Tentative sur les parallèles, 1250 approx, probleme), `miftah-al-hisab` (Miftāḥ al-ḥisāb : fractions décimales, 1427, texte), `calcul-de-pi-al-kashi` (π à seize décimales, 1424, methode) · liens : `geometrie-grecque` → filiation, `mathematiques-hellenistiques` → filiation, `mathematiques-indiennes` → influence (sinus).
 
-**`algebre-chinoise-song-yuan`** — Âge d’or de l’algèbre chinoise : Song et Yuan · medieval · { start: 1000, end: 1350, approx: true } · ['hasard', 'nombres'] · ['Hangzhou', 'Pékin', 'Sichuan'] · map { x: 1350, y: 3150, size: 2, palette: { fill: '#e8c4c0', stroke: '#5e2821', accent: '#a33729' } } · préfixe `acs-` · figures : `jia-xian` (Jia Xian, [1010, 1070] approx, Chine des Song), `qin-jiushao` (Qin Jiushao, [1202, 1261] approx, Sichuan), `li-ye` (Li Ye, [1192, 1279], Hebei), `yang-hui` (Yang Hui, [1238, 1298] approx, Hangzhou), `zhu-shijie` (Zhu Shijie, [1249, 1314] approx, Pékin et Yangzhou) · résultats : `triangle-de-jia-xian` (Triangle des coefficients binomiaux, 1050 approx, concept), `shushu-jiuzhang` (Shushu jiuzhang : Traité mathématique en neuf sections, 1247, texte), `methode-dayan` (Méthode dayan pour les restes, 1247, methode), `extraction-de-racines-qin-jiushao` (Résolution numérique des équations de degré élevé, 1247, methode), `ceyuan-haijing` (Ceyuan haijing : la méthode tian yuan, 1248, texte), `xiangjie-jiuzhang-suanfa` (Xiangjie jiuzhang suanfa, 1261, texte), `siyuan-yujian` (Siyuan yujian : quatre inconnues, 1303, texte) · liens : `mathematiques-chinoises-anciennes` → filiation.
+**`algebre-chinoise-song-yuan`** — Âge d’or de l’algèbre chinoise : Song et Yuan · medieval · { start: 1000, end: 1350, approx: true } · ['hasard', 'nombres'] · ['Hangzhou', 'Pékin', 'Sichuan'] · map { x: 1350, y: 3150, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3629', accent: '#8a3c28' } } · préfixe `acs-` · figures : `jia-xian` (Jia Xian, [1010, 1070] approx, Chine des Song), `qin-jiushao` (Qin Jiushao, [1202, 1261] approx, Sichuan), `li-ye` (Li Ye, [1192, 1279], Hebei), `yang-hui` (Yang Hui, [1238, 1298] approx, Hangzhou), `zhu-shijie` (Zhu Shijie, [1249, 1314] approx, Pékin et Yangzhou) · résultats : `triangle-de-jia-xian` (Triangle des coefficients binomiaux, 1050 approx, concept), `shushu-jiuzhang` (Shushu jiuzhang : Traité mathématique en neuf sections, 1247, texte), `methode-dayan` (Méthode dayan pour les restes, 1247, methode), `extraction-de-racines-qin-jiushao` (Résolution numérique des équations de degré élevé, 1247, methode), `ceyuan-haijing` (Ceyuan haijing : la méthode tian yuan, 1248, texte), `xiangjie-jiuzhang-suanfa` (Xiangjie jiuzhang suanfa, 1261, texte), `siyuan-yujian` (Siyuan yujian : quatre inconnues, 1303, texte) · liens : `mathematiques-chinoises-anciennes` → filiation.
 
-**`occident-latin-medieval`** — Occident latin : abaque, algorisme et calculateurs d’Oxford · medieval · { start: 1000, end: 1450, approx: true } · ['analyse', 'nombres'] · ['Reims', 'Tolède', 'Pise', 'Oxford', 'Paris'] · map { x: 1450, y: 2300, size: 2, palette: { fill: '#dacfed', stroke: '#42266d', accent: '#602db4' } } · préfixe `olm-` · figures : `gerbert-d-aurillac` (Gerbert d’Aurillac, [946, 1003] approx, Reims et Rome), `adelard-de-bath` (Adélard de Bath, [1080, 1152] approx, Bath), `fibonacci` (Léonard de Pise, dit Fibonacci, [1170, 1250] approx, Pise), `jordanus-de-nemore` (Jordanus de Nemore, [1190, 1240] approx, Paris ?), `bradwardine` (Thomas Bradwardine, [1300, 1349] approx, Oxford), `oresme` (Nicole Oresme, [1323, 1382] approx, Paris et Lisieux) · résultats : `abaque-de-gerbert` (Abaque à jetons de Gerbert, 990 approx, methode ; l’enseignement de l’abaque à Reims se situe vers 982-1000, sans date certaine), `traduction-latine-des-elements` (Première traduction latine complète des Éléments, 1120 approx, texte), `liber-abaci` (Liber abaci, 1202, texte), `suite-de-fibonacci` (Problème des lapins et suite de Fibonacci, 1202, probleme), `liber-quadratorum` (Liber quadratorum, 1225, texte), `de-numeris-datis` (De numeris datis : l’algèbre en lettres, 1225 approx, texte), `tractatus-de-proportionibus` (Tractatus de proportionibus, 1328, texte), `latitude-des-formes` (Latitude des formes : la représentation graphique des qualités, 1350 approx, concept), `divergence-de-la-serie-harmonique` (Divergence de la série harmonique, 1350 approx, theoreme) · liens : `algebre-arabe` → filiation (traductions de Tolède et Liber abaci, fait), `geometrie-grecque` → filiation (Éléments via l’arabe), `mathematiques-indiennes` → influence (chiffres indo-arabes).
+**`occident-latin-medieval`** — Occident latin : abaque, algorisme et calculateurs d’Oxford · medieval · { start: 1000, end: 1450, approx: true } · ['analyse', 'nombres'] · ['Reims', 'Tolède', 'Pise', 'Oxford', 'Paris'] · map { x: 1450, y: 2300, size: 2, palette: { fill: '#ddcdee', stroke: '#49296b', accent: '#58288a' } } · préfixe `olm-` · figures : `gerbert-d-aurillac` (Gerbert d’Aurillac, [946, 1003] approx, Reims et Rome), `adelard-de-bath` (Adélard de Bath, [1080, 1152] approx, Bath), `fibonacci` (Léonard de Pise, dit Fibonacci, [1170, 1250] approx, Pise), `jordanus-de-nemore` (Jordanus de Nemore, [1190, 1240] approx, Paris ?), `bradwardine` (Thomas Bradwardine, [1300, 1349] approx, Oxford), `oresme` (Nicole Oresme, [1323, 1382] approx, Paris et Lisieux) · résultats : `abaque-de-gerbert` (Abaque à jetons de Gerbert, 990 approx, methode ; l’enseignement de l’abaque à Reims se situe vers 982-1000, sans date certaine), `traduction-latine-des-elements` (Première traduction latine complète des Éléments, 1120 approx, texte), `liber-abaci` (Liber abaci, 1202, texte), `suite-de-fibonacci` (Problème des lapins et suite de Fibonacci, 1202, probleme), `liber-quadratorum` (Liber quadratorum, 1225, texte), `de-numeris-datis` (De numeris datis : l’algèbre en lettres, 1225 approx, texte), `tractatus-de-proportionibus` (Tractatus de proportionibus, 1328, texte), `latitude-des-formes` (Latitude des formes : la représentation graphique des qualités, 1350 approx, concept), `divergence-de-la-serie-harmonique` (Divergence de la série harmonique, 1350 approx, theoreme) · liens : `algebre-arabe` → filiation (traductions de Tolède et Liber abaci, fait), `geometrie-grecque` → filiation (Éléments via l’arabe), `mathematiques-indiennes` → influence (chiffres indo-arabes).
 
-**`logique-scolastique`** — Logique scolastique : termes, supposition et insolubles · medieval · { start: 1100, end: 1400, approx: true } · ['fondements'] · ['Paris', 'Oxford'] · map { x: 1450, y: 4100, size: 1, palette: { fill: '#c3e9d2', stroke: '#22623c', accent: '#2aa75c' } } · préfixe `ls-` · figures : `abelard` (Pierre Abélard, [1079, 1142], Paris), `pierre-d-espagne` (Pierre d’Espagne, [1205, 1277] approx, Paris), `guillaume-d-ockham` (Guillaume d’Ockham, [1287, 1347] approx, Oxford et Munich), `jean-buridan` (Jean Buridan, [1300, 1358] approx, Paris), `albert-de-saxe` (Albert de Saxe, [1320, 1390] approx, Paris et Vienne) · résultats : `dialectica-abelard` (Dialectica, 1120 approx, texte), `summulae-logicales` (Summulae logicales, 1230 approx, texte), `theorie-de-la-supposition` (Théorie de la supposition des termes, 1250 approx, concept), `summa-logicae` (Summa logicae, 1323 approx, texte), `rasoir-d-ockham` (Principe d’économie dit « rasoir d’Ockham », 1320 approx, concept), `insolubilia-et-menteur` (Les insolubles : le paradoxe du menteur, 1340 approx, probleme), `questions-sur-la-physique-infini` (Débats sur l’infini et le continu, 1350 approx, probleme) · liens : `logique-antique` → filiation (Boèce, Organon), `occident-latin-medieval` → affinité (interprétation).
+**`logique-scolastique`** — Logique scolastique : termes, supposition et insolubles · medieval · { start: 1100, end: 1400, approx: true } · ['fondements'] · ['Paris', 'Oxford'] · map { x: 1450, y: 4100, size: 1, palette: { fill: '#c9edd4', stroke: '#276839', accent: '#278642' } } · préfixe `ls-` · figures : `abelard` (Pierre Abélard, [1079, 1142], Paris), `pierre-d-espagne` (Pierre d’Espagne, [1205, 1277] approx, Paris), `guillaume-d-ockham` (Guillaume d’Ockham, [1287, 1347] approx, Oxford et Munich), `jean-buridan` (Jean Buridan, [1300, 1358] approx, Paris), `albert-de-saxe` (Albert de Saxe, [1320, 1390] approx, Paris et Vienne) · résultats : `dialectica-abelard` (Dialectica, 1120 approx, texte), `summulae-logicales` (Summulae logicales, 1230 approx, texte), `theorie-de-la-supposition` (Théorie de la supposition des termes, 1250 approx, concept), `summa-logicae` (Summa logicae, 1323 approx, texte), `rasoir-d-ockham` (Principe d’économie dit « rasoir d’Ockham », 1320 approx, concept), `insolubilia-et-menteur` (Les insolubles : le paradoxe du menteur, 1340 approx, probleme), `questions-sur-la-physique-infini` (Débats sur l’infini et le continu, 1350 approx, probleme) · liens : `logique-antique` → filiation (Boèce, Organon), `occident-latin-medieval` → affinité (interprétation).
 
 ### Fichier `renaissance.ts` — ère `renaissance` (1450 → 1700)
 
-**`algebre-renaissance`** — Algèbre de la Renaissance : de Pacioli à Viète · renaissance · { start: 1494, end: 1603 } · ['nombres'] · ['Venise', 'Bologne', 'Milan', 'Paris'] · map { x: 2000, y: 420, size: 3, palette: { fill: '#ece1cb', stroke: '#6a5425', accent: '#af862c' } } · préfixe `ar-` · figures : `pacioli` (Luca Pacioli, [1447, 1517] approx, Sansepolcro et Venise), `del-ferro` (Scipione del Ferro, [1465, 1526], Bologne), `tartaglia` (Niccolò Tartaglia, [1499, 1557] approx, Brescia et Venise), `cardan` (Jérôme Cardan, [1501, 1576], Pavie et Milan), `ferrari` (Lodovico Ferrari, [1522, 1565], Bologne), `bombelli` (Rafael Bombelli, [1526, 1572], Bologne), `viete` (François Viète, [1540, 1603], Fontenay-le-Comte et Paris) · résultats : `summa-de-arithmetica` (Summa de arithmetica, geometria, proportioni et proportionalita, 1494, texte), `resolution-de-la-cubique-del-ferro` (Résolution de x³ + px = q, 1515 approx, theoreme), `ars-magna` (Ars magna, 1545, texte), `formule-de-cardan` (Formule de Cardan, 1545, theoreme), `methode-de-ferrari` (Résolution de l’équation du quatrième degré, 1540 approx, methode), `algebra-bombelli` (L’Algebra : les nombres « sophistiques », 1572, texte), `in-artem-analyticem-isagoge` (In artem analyticem isagoge : l’algèbre littérale, 1591, texte) · liens : `algebre-arabe` → filiation (via Fibonacci et les traductions), `occident-latin-medieval` → filiation, `arithmetique-grecque` → influence (Diophante redécouvert par Bombelli, fait).
+**`algebre-renaissance`** — Algèbre de la Renaissance : de Pacioli à Viète · renaissance · { start: 1494, end: 1603 } · ['nombres'] · ['Venise', 'Bologne', 'Milan', 'Paris'] · map { x: 2000, y: 420, size: 3, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } } · préfixe `ar-` · figures : `pacioli` (Luca Pacioli, [1447, 1517] approx, Sansepolcro et Venise), `del-ferro` (Scipione del Ferro, [1465, 1526], Bologne), `tartaglia` (Niccolò Tartaglia, [1499, 1557] approx, Brescia et Venise), `cardan` (Jérôme Cardan, [1501, 1576], Pavie et Milan), `ferrari` (Lodovico Ferrari, [1522, 1565], Bologne), `bombelli` (Rafael Bombelli, [1526, 1572], Bologne), `viete` (François Viète, [1540, 1603], Fontenay-le-Comte et Paris) · résultats : `summa-de-arithmetica` (Summa de arithmetica, geometria, proportioni et proportionalita, 1494, texte), `resolution-de-la-cubique-del-ferro` (Résolution de x³ + px = q, 1515 approx, theoreme), `ars-magna` (Ars magna, 1545, texte), `formule-de-cardan` (Formule de Cardan, 1545, theoreme), `methode-de-ferrari` (Résolution de l’équation du quatrième degré, 1540 approx, methode), `algebra-bombelli` (L’Algebra : les nombres « sophistiques », 1572, texte), `in-artem-analyticem-isagoge` (In artem analyticem isagoge : l’algèbre littérale, 1591, texte) · liens : `algebre-arabe` → filiation (via Fibonacci et les traductions), `occident-latin-medieval` → filiation, `arithmetique-grecque` → influence (Diophante redécouvert par Bombelli, fait).
 
-**`theorie-des-nombres-fermat`** — Théorie des nombres de Fermat · renaissance · { start: 1621, end: 1670, approx: true } · ['nombres'] · ['Toulouse', 'Paris', 'Bordeaux'] · map { x: 2450, y: 620, size: 2, palette: { fill: '#eadec7', stroke: '#664f24', accent: '#ab7e2b' } } · préfixe `tnf-` · figures : `bachet` (Claude-Gaspard Bachet de Méziriac, [1581, 1638], Bourg-en-Bresse), `mersenne` (Marin Mersenne, [1588, 1648], Paris), `fermat` (Pierre de Fermat, [1601, 1665], Toulouse), `frenicle` (Bernard Frénicle de Bessy, [1604, 1674] approx, Paris) · résultats : `edition-bachet-diophante` (1621, texte), `petit-theoreme-de-fermat` (1640, theoreme), `theoreme-des-deux-carres` (1640, theoreme), `dernier-theoreme-de-fermat` (1637 approx, conjecture), `descente-infinie` (1659, methode), `equation-de-pell-fermat` (1657, probleme), `nombres-de-mersenne` (1644, concept) · related : `pascal`, `wallis` · **ce domaine est déjà rédigé en § 7 (exemple complet) : le reprendre tel quel, corrections factuelles autorisées.**
+**`theorie-des-nombres-fermat`** — Théorie des nombres de Fermat · renaissance · { start: 1621, end: 1670, approx: true } · ['nombres'] · ['Toulouse', 'Paris', 'Bordeaux'] · map { x: 2450, y: 620, size: 2, palette: { fill: '#eee4cd', stroke: '#6b5629', accent: '#8a6b28' } } · préfixe `tnf-` · figures : `bachet` (Claude-Gaspard Bachet de Méziriac, [1581, 1638], Bourg-en-Bresse), `mersenne` (Marin Mersenne, [1588, 1648], Paris), `fermat` (Pierre de Fermat, [1601, 1665], Toulouse), `frenicle` (Bernard Frénicle de Bessy, [1604, 1674] approx, Paris) · résultats : `edition-bachet-diophante` (1621, texte), `petit-theoreme-de-fermat` (1640, theoreme), `theoreme-des-deux-carres` (1640, theoreme), `dernier-theoreme-de-fermat` (1637 approx, conjecture), `descente-infinie` (1659, methode), `equation-de-pell-fermat` (1657, probleme), `nombres-de-mersenne` (1644, concept) · related : `pascal`, `wallis` · **ce domaine est déjà rédigé en § 7 (exemple complet) : le reprendre tel quel, corrections factuelles autorisées.**
 
-**`perspective-et-cartographie`** — Perspective, trigonométrie et cartographie · renaissance · { start: 1435, end: 1600 } · ['formes'] · ['Florence', 'Nuremberg', 'Vienne', 'Lisbonne', 'Duisbourg'] · map { x: 1980, y: 1550, size: 2, palette: { fill: '#d2e6ee', stroke: '#285a71', accent: '#2e8cb8' } } · préfixe `pc-` · figures : `alberti` (Leon Battista Alberti, [1404, 1472], Florence), `piero-della-francesca` (Piero della Francesca, [1415, 1492] approx, Sansepolcro), `regiomontanus` (Regiomontanus, [1436, 1476], Vienne et Nuremberg), `durer` (Albrecht Dürer, [1471, 1528], Nuremberg), `nunes` (Pedro Nunes, [1502, 1578], Lisbonne et Coimbra), `mercator` (Gerardus Mercator, [1512, 1594], Louvain et Duisbourg) · résultats : `de-pictura` (De pictura : la construction légitime, 1435, texte), `de-prospectiva-pingendi` (De prospectiva pingendi, 1475 approx, texte), `de-triangulis-omnimodis` (De triangulis omnimodis : la trigonométrie comme discipline, 1464, texte), `underweysung-der-messung` (Underweysung der Messung, 1525, texte), `loxodromie` (La loxodromie, 1537, concept), `projection-de-mercator` (Projection de Mercator, 1569, methode) · liens : `mathematiques-hellenistiques` → filiation (Ptolémée, Géographie et Almageste), `geometrie-arabe` → influence (optique et trigonométrie, fait).
+**`perspective-et-cartographie`** — Perspective, trigonométrie et cartographie · renaissance · { start: 1435, end: 1600 } · ['formes'] · ['Florence', 'Nuremberg', 'Vienne', 'Lisbonne', 'Duisbourg'] · map { x: 1980, y: 1550, size: 2, palette: { fill: '#cde0ee', stroke: '#294d6b', accent: '#285e8a' } } · préfixe `pc-` · figures : `alberti` (Leon Battista Alberti, [1404, 1472], Florence), `piero-della-francesca` (Piero della Francesca, [1415, 1492] approx, Sansepolcro), `regiomontanus` (Regiomontanus, [1436, 1476], Vienne et Nuremberg), `durer` (Albrecht Dürer, [1471, 1528], Nuremberg), `nunes` (Pedro Nunes, [1502, 1578], Lisbonne et Coimbra), `mercator` (Gerardus Mercator, [1512, 1594], Louvain et Duisbourg) · résultats : `de-pictura` (De pictura : la construction légitime, 1435, texte), `de-prospectiva-pingendi` (De prospectiva pingendi, 1475 approx, texte), `de-triangulis-omnimodis` (De triangulis omnimodis : la trigonométrie comme discipline, 1464, texte), `underweysung-der-messung` (Underweysung der Messung, 1525, texte), `loxodromie` (La loxodromie, 1537, concept), `projection-de-mercator` (Projection de Mercator, 1569, methode) · liens : `mathematiques-hellenistiques` → filiation (Ptolémée, Géographie et Almageste), `geometrie-arabe` → influence (optique et trigonométrie, fait).
 
-**`geometrie-analytique`** — Géométrie analytique et projective du XVIIᵉ siècle · renaissance · { start: 1636, end: 1685 } · ['formes'] · ['Paris', 'Toulouse', 'Lyon', 'Leyde'] · map { x: 2420, y: 1250, size: 3, palette: { fill: '#d6e8f0', stroke: '#295d75', accent: '#2f8fbc' } } · préfixe `gan-` · figures : `descartes` (René Descartes, [1596, 1650], La Haye en Touraine, Provinces-Unies), `desargues` (Girard Desargues, [1591, 1661], Lyon et Paris), `van-schooten` (Frans van Schooten, [1615, 1660], Leyde), `de-witt` (Johan de Witt, [1625, 1672], Dordrecht et La Haye), `la-hire` (Philippe de La Hire, [1640, 1718], Paris) · résultats : `la-geometrie-descartes` (La Géométrie, 1637, texte), `regle-des-signes-de-descartes` (Règle des signes, 1637, theoreme), `ad-locos-planos-fermat` (Ad locos planos et solidos isagoge, 1636 approx, texte, `fermat`), `methode-des-tangentes-fermat` (Méthode des maxima, minima et tangentes, 1636 approx, methode, `fermat`), `brouillon-project-desargues` (Brouillon project d’une atteinte aux événements des rencontres du cône avec un plan, 1639, texte), `theoreme-de-desargues` (Théorème de Desargues, 1639 approx, theoreme), `hexagramme-mystique` (Essai pour les coniques : l’hexagramme mystique, 1640, theoreme, `pascal`), `geometria-a-renato-des-cartes` (Édition latine commentée de La Géométrie, 1649, texte) · related : `fermat`, `pascal` · liens : `algebre-renaissance` → filiation (Viète → Descartes, fait), `mathematiques-hellenistiques` → influence (Apollonius, Pappus : le problème de Pappus ouvre La Géométrie, fait), `perspective-et-cartographie` → filiation (perspective → Desargues, interprétation).
+**`geometrie-analytique`** — Géométrie analytique et projective du XVIIᵉ siècle · renaissance · { start: 1636, end: 1685 } · ['formes'] · ['Paris', 'Toulouse', 'Lyon', 'Leyde'] · map { x: 2420, y: 1250, size: 3, palette: { fill: '#d5e4f1', stroke: '#2b5373', accent: '#2a6492' } } · préfixe `gan-` · figures : `descartes` (René Descartes, [1596, 1650], La Haye en Touraine, Provinces-Unies), `desargues` (Girard Desargues, [1591, 1661], Lyon et Paris), `van-schooten` (Frans van Schooten, [1615, 1660], Leyde), `de-witt` (Johan de Witt, [1625, 1672], Dordrecht et La Haye), `la-hire` (Philippe de La Hire, [1640, 1718], Paris) · résultats : `la-geometrie-descartes` (La Géométrie, 1637, texte), `regle-des-signes-de-descartes` (Règle des signes, 1637, theoreme), `ad-locos-planos-fermat` (Ad locos planos et solidos isagoge, 1636 approx, texte, `fermat`), `methode-des-tangentes-fermat` (Méthode des maxima, minima et tangentes, 1636 approx, methode, `fermat`), `brouillon-project-desargues` (Brouillon project d’une atteinte aux événements des rencontres du cône avec un plan, 1639, texte), `theoreme-de-desargues` (Théorème de Desargues, 1639 approx, theoreme), `hexagramme-mystique` (Essai pour les coniques : l’hexagramme mystique, 1640, theoreme, `pascal`), `geometria-a-renato-des-cartes` (Édition latine commentée de La Géométrie, 1649, texte) · related : `fermat`, `pascal` · liens : `algebre-renaissance` → filiation (Viète → Descartes, fait), `mathematiques-hellenistiques` → influence (Apollonius, Pappus : le problème de Pappus ouvre La Géométrie, fait), `perspective-et-cartographie` → filiation (perspective → Desargues, interprétation).
 
-**`naissance-du-calcul`** — Naissance du calcul infinitésimal · renaissance · { start: 1635, end: 1700 } · ['analyse'] · ['Bologne', 'Oxford', 'Cambridge', 'Paris', 'Hanovre', 'La Haye'] · map { x: 2300, y: 2300, size: 3, palette: { fill: '#dad2ee', stroke: '#3d2871', accent: '#552eb8' } } · préfixe `nc-` · figures : `cavalieri` (Bonaventura Cavalieri, [1598, 1647], Milan et Bologne), `wallis` (John Wallis, [1616, 1703], Oxford), `huygens` (Christiaan Huygens, [1629, 1695], La Haye et Paris), `barrow` (Isaac Barrow, [1630, 1677], Cambridge), `gregory` (James Gregory, [1638, 1675], Aberdeen et Édimbourg), `newton` (Isaac Newton, [1643, 1727], Cambridge et Londres), `leibniz` (Gottfried Wilhelm Leibniz, [1646, 1716], Leipzig, Paris et Hanovre) · résultats : `geometria-indivisibilibus` (Geometria indivisibilibus continuorum, 1635, texte), `arithmetica-infinitorum` (Arithmetica infinitorum, 1656, texte), `horologium-oscillatorium` (Horologium oscillatorium, 1673, texte), `serie-du-binome` (Série du binôme généralisé, 1665 approx, theoreme), `de-analysi` (De analysi per aequationes numero terminorum infinitas, 1669, texte), `theoreme-fondamental-de-l-analyse` (Théorème fondamental de l’analyse, 1670 approx, theoreme), `nova-methodus` (Nova methodus pro maximis et minimis : première publication du calcul différentiel, 1684, texte), `principia-mathematica-newton` (Philosophiae naturalis principia mathematica, 1687, texte), `brachistochrone` (Problème de la brachistochrone, 1696, probleme, `jean-bernoulli` via related ou authorName seul) · related : `jean-bernoulli`, `jacques-bernoulli` · liens : `mathematiques-hellenistiques` → filiation (Archimède, fait), `geometrie-analytique` → filiation (fait), `occident-latin-medieval` → influence (Oresme, interprétation), `algebre-renaissance` → influence.
+**`naissance-du-calcul`** — Naissance du calcul infinitésimal · renaissance · { start: 1635, end: 1700 } · ['analyse'] · ['Bologne', 'Oxford', 'Cambridge', 'Paris', 'Hanovre', 'La Haye'] · map { x: 2300, y: 2300, size: 3, palette: { fill: '#d9cdee', stroke: '#41296b', accent: '#4c288a' } } · préfixe `nc-` · figures : `cavalieri` (Bonaventura Cavalieri, [1598, 1647], Milan et Bologne), `wallis` (John Wallis, [1616, 1703], Oxford), `huygens` (Christiaan Huygens, [1629, 1695], La Haye et Paris), `barrow` (Isaac Barrow, [1630, 1677], Cambridge), `gregory` (James Gregory, [1638, 1675], Aberdeen et Édimbourg), `newton` (Isaac Newton, [1643, 1727], Cambridge et Londres), `leibniz` (Gottfried Wilhelm Leibniz, [1646, 1716], Leipzig, Paris et Hanovre) · résultats : `geometria-indivisibilibus` (Geometria indivisibilibus continuorum, 1635, texte), `arithmetica-infinitorum` (Arithmetica infinitorum, 1656, texte), `horologium-oscillatorium` (Horologium oscillatorium, 1673, texte), `serie-du-binome` (Série du binôme généralisé, 1665 approx, theoreme), `de-analysi` (De analysi per aequationes numero terminorum infinitas, 1669, texte), `theoreme-fondamental-de-l-analyse` (Théorème fondamental de l’analyse, 1670 approx, theoreme), `nova-methodus` (Nova methodus pro maximis et minimis : première publication du calcul différentiel, 1684, texte), `principia-mathematica-newton` (Philosophiae naturalis principia mathematica, 1687, texte), `brachistochrone` (Problème de la brachistochrone, 1696, probleme, `jean-bernoulli` via related ou authorName seul) · related : `jean-bernoulli`, `jacques-bernoulli` · liens : `mathematiques-hellenistiques` → filiation (Archimède, fait), `geometrie-analytique` → filiation (fait), `occident-latin-medieval` → influence (Oresme, interprétation), `algebre-renaissance` → influence.
 
-**`logarithmes-et-calcul-numerique`** — Logarithmes, décimales et machines à calculer · renaissance · { start: 1585, end: 1680 } · ['hasard', 'nombres'] · ['Bruges', 'Édimbourg', 'Londres', 'Tübingen', 'Rouen'] · map { x: 2000, y: 3050, size: 2, palette: { fill: '#f0ddd6', stroke: '#753d29', accent: '#bc542f' } } · préfixe `lcn-` · figures : `stevin` (Simon Stevin, [1548, 1620], Bruges et Leyde), `napier` (John Napier, [1550, 1617], Édimbourg), `burgi` (Jost Bürgi, [1552, 1632], Cassel et Prague), `briggs` (Henry Briggs, [1561, 1630], Londres et Oxford), `oughtred` (William Oughtred, [1574, 1660], Albury), `schickard` (Wilhelm Schickard, [1592, 1635], Tübingen), `kepler` (Johannes Kepler, [1571, 1630], Graz, Prague et Linz) · résultats : `de-thiende` (De Thiende : les nombres décimaux, 1585, texte), `mirifici-logarithmorum-canonis-descriptio` (Mirifici logarithmorum canonis descriptio, 1614, texte), `logarithmes-decimaux` (Logarithmes décimaux : Logarithmorum chilias prima, 1617, methode), `tables-de-burgi` (Arithmetische und geometrische Progress-Tabulen, 1620, texte), `regle-a-calcul` (Règle à calcul, 1622 approx, methode), `horloge-a-calcul-de-schickard` (Horloge à calcul, 1623, methode), `pascaline` (Pascaline, 1642, methode, `pascal`), `machine-arithmetique-de-leibniz` (Machine arithmétique à cylindre cannelé, 1673, methode, `leibniz`), `tabulae-rudolphinae` (Tables rudolphines : premières tables astronomiques calculées aux logarithmes, 1627, texte, `kepler`) · related : `pascal`, `leibniz` · liens : `algebre-arabe` → influence (fractions décimales d’al-Kāshī, interprétation), `perspective-et-cartographie` → filiation (tables trigonométriques, fait).
+**`logarithmes-et-calcul-numerique`** — Logarithmes, décimales et machines à calculer · renaissance · { start: 1585, end: 1680 } · ['hasard', 'nombres'] · ['Bruges', 'Édimbourg', 'Londres', 'Tübingen', 'Rouen'] · map { x: 2000, y: 3050, size: 2, palette: { fill: '#eed6cd', stroke: '#6b3929', accent: '#8a4128' } } · préfixe `lcn-` · figures : `stevin` (Simon Stevin, [1548, 1620], Bruges et Leyde), `napier` (John Napier, [1550, 1617], Édimbourg), `burgi` (Jost Bürgi, [1552, 1632], Cassel et Prague), `briggs` (Henry Briggs, [1561, 1630], Londres et Oxford), `oughtred` (William Oughtred, [1574, 1660], Albury), `schickard` (Wilhelm Schickard, [1592, 1635], Tübingen), `kepler` (Johannes Kepler, [1571, 1630], Graz, Prague et Linz) · résultats : `de-thiende` (De Thiende : les nombres décimaux, 1585, texte), `mirifici-logarithmorum-canonis-descriptio` (Mirifici logarithmorum canonis descriptio, 1614, texte), `logarithmes-decimaux` (Logarithmes décimaux : Logarithmorum chilias prima, 1617, methode), `tables-de-burgi` (Arithmetische und geometrische Progress-Tabulen, 1620, texte), `regle-a-calcul` (Règle à calcul, 1622 approx, methode), `horloge-a-calcul-de-schickard` (Horloge à calcul, 1623, methode), `pascaline` (Pascaline, 1642, methode, `pascal`), `machine-arithmetique-de-leibniz` (Machine arithmétique à cylindre cannelé, 1673, methode, `leibniz`), `tabulae-rudolphinae` (Tables rudolphines : premières tables astronomiques calculées aux logarithmes, 1627, texte, `kepler`) · related : `pascal`, `leibniz` · liens : `algebre-arabe` → influence (fractions décimales d’al-Kāshī, interprétation), `perspective-et-cartographie` → filiation (tables trigonométriques, fait).
 
-**`naissance-des-probabilites`** — Naissance du calcul des probabilités · renaissance · { start: 1654, end: 1713 } · ['hasard'] · ['Paris', 'La Haye', 'Londres', 'Bâle'] · map { x: 2450, y: 3400, size: 2, palette: { fill: '#e9cdc3', stroke: '#623322', accent: '#a74b2a' } } · préfixe `np-` · figures : `pascal` (Blaise Pascal, [1623, 1662], Clermont et Paris), `graunt` (John Graunt, [1620, 1674], Londres), `halley` (Edmond Halley, [1656, 1742], Londres), `jacques-bernoulli` (Jacques Bernoulli, [1655, 1705], Bâle), `montmort` (Pierre Rémond de Montmort, [1678, 1719], Paris) · résultats : `correspondance-pascal-fermat` (Correspondance Pascal–Fermat : le problème des partis, 1654, texte), `traite-du-triangle-arithmetique` (Traité du triangle arithmétique, 1654, texte), `de-ratiociniis-in-ludo-aleae` (De ratiociniis in ludo aleae : l’espérance, 1657, texte, `huygens`), `observations-de-graunt` (Natural and Political Observations upon the Bills of Mortality, 1662, texte), `liber-de-ludo-aleae` (Liber de ludo aleae, 1663, texte, `cardan`), `table-de-mortalite-de-halley` (Table de mortalité de Breslau, 1693, methode), `essay-d-analyse-sur-les-jeux-de-hazard` (Essay d’analyse sur les jeux de hazard, 1708, texte), `ars-conjectandi` (Ars conjectandi, 1713, texte), `loi-des-grands-nombres-bernoulli` (Théorème d’or : la loi des grands nombres, 1713, theoreme) · related : `fermat`, `huygens`, `cardan`, `leibniz` · liens : `theorie-des-nombres-fermat` → filiation (Fermat, fait), `naissance-du-calcul` → influence (Huygens, Bernoulli), `algebre-renaissance` → influence (Cardan, fait), `algebre-chinoise-song-yuan` → affinité (triangle arithmétique, interprétation).
+**`naissance-des-probabilites`** — Naissance du calcul des probabilités · renaissance · { start: 1654, end: 1713 } · ['hasard'] · ['Paris', 'La Haye', 'Londres', 'Bâle'] · map { x: 2450, y: 3400, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } } · préfixe `np-` · figures : `pascal` (Blaise Pascal, [1623, 1662], Clermont et Paris), `graunt` (John Graunt, [1620, 1674], Londres), `halley` (Edmond Halley, [1656, 1742], Londres), `jacques-bernoulli` (Jacques Bernoulli, [1655, 1705], Bâle), `montmort` (Pierre Rémond de Montmort, [1678, 1719], Paris) · résultats : `correspondance-pascal-fermat` (Correspondance Pascal–Fermat : le problème des partis, 1654, texte), `traite-du-triangle-arithmetique` (Traité du triangle arithmétique, 1654, texte), `de-ratiociniis-in-ludo-aleae` (De ratiociniis in ludo aleae : l’espérance, 1657, texte, `huygens`), `observations-de-graunt` (Natural and Political Observations upon the Bills of Mortality, 1662, texte), `liber-de-ludo-aleae` (Liber de ludo aleae, 1663, texte, `cardan`), `table-de-mortalite-de-halley` (Table de mortalité de Breslau, 1693, methode), `essay-d-analyse-sur-les-jeux-de-hazard` (Essay d’analyse sur les jeux de hazard, 1708, texte), `ars-conjectandi` (Ars conjectandi, 1713, texte), `loi-des-grands-nombres-bernoulli` (Théorème d’or : la loi des grands nombres, 1713, theoreme) · related : `fermat`, `huygens`, `cardan`, `leibniz` · liens : `theorie-des-nombres-fermat` → filiation (Fermat, fait), `naissance-du-calcul` → influence (Huygens, Bernoulli), `algebre-renaissance` → influence (Cardan, fait), `algebre-chinoise-song-yuan` → affinité (triangle arithmétique, interprétation).
 
-**`methode-et-caracteristique`** — Méthode, logique et langue universelle · renaissance · { start: 1555, end: 1700 } · ['fondements'] · ['Paris', 'Port-Royal', 'Londres', 'Hanovre'] · map { x: 2250, y: 4150, size: 1, palette: { fill: '#ddf3e3', stroke: '#2c7d43', accent: '#31c45b' } } · préfixe `mc-` · figures : `ramus` (Pierre de La Ramée, dit Ramus, [1515, 1572], Paris), `hobbes` (Thomas Hobbes, [1588, 1679], Malmesbury et Londres), `arnauld` (Antoine Arnauld, [1612, 1694], Port-Royal et Bruxelles), `wilkins` (John Wilkins, [1614, 1672], Oxford et Londres) · résultats : `dialectique-de-ramus` (Dialectique, 1555, texte), `regulae-ad-directionem-ingenii` (Regulae ad directionem ingenii, 1628 approx, texte, `descartes`), `discours-de-la-methode` (Discours de la méthode, 1637, texte, `descartes`), `de-l-esprit-geometrique` (De l’esprit géométrique et de l’art de persuader, 1657 approx, texte, `pascal`), `logique-de-port-royal` (La Logique ou l’Art de penser, 1662, texte), `dissertatio-de-arte-combinatoria` (Dissertatio de arte combinatoria, 1666, texte, `leibniz`), `nouveaux-elements-de-geometrie` (Nouveaux éléments de géométrie, 1667, texte), `essay-towards-a-real-character` (An Essay towards a Real Character and a Philosophical Language, 1668, texte), `characteristica-universalis` (Characteristica universalis et calculus ratiocinator, 1679 approx, concept, `leibniz`) · related : `descartes`, `pascal`, `leibniz` · liens : `logique-scolastique` → reaction (Ramus contre la scolastique, fait), `logique-antique` → filiation, `geometrie-analytique` → affinité (interprétation : la méthode cartésienne).
+**`methode-et-caracteristique`** — Méthode, logique et langue universelle · renaissance · { start: 1555, end: 1700 } · ['fondements'] · ['Paris', 'Port-Royal', 'Londres', 'Hanovre'] · map { x: 2250, y: 4150, size: 1, palette: { fill: '#d1f0d9', stroke: '#2a6f3b', accent: '#298e43' } } · préfixe `mc-` · figures : `ramus` (Pierre de La Ramée, dit Ramus, [1515, 1572], Paris), `hobbes` (Thomas Hobbes, [1588, 1679], Malmesbury et Londres), `arnauld` (Antoine Arnauld, [1612, 1694], Port-Royal et Bruxelles), `wilkins` (John Wilkins, [1614, 1672], Oxford et Londres) · résultats : `dialectique-de-ramus` (Dialectique, 1555, texte), `regulae-ad-directionem-ingenii` (Regulae ad directionem ingenii, 1628 approx, texte, `descartes`), `discours-de-la-methode` (Discours de la méthode, 1637, texte, `descartes`), `de-l-esprit-geometrique` (De l’esprit géométrique et de l’art de persuader, 1657 approx, texte, `pascal`), `logique-de-port-royal` (La Logique ou l’Art de penser, 1662, texte), `dissertatio-de-arte-combinatoria` (Dissertatio de arte combinatoria, 1666, texte, `leibniz`), `nouveaux-elements-de-geometrie` (Nouveaux éléments de géométrie, 1667, texte), `essay-towards-a-real-character` (An Essay towards a Real Character and a Philosophical Language, 1668, texte), `characteristica-universalis` (Characteristica universalis et calculus ratiocinator, 1679 approx, concept, `leibniz`) · related : `descartes`, `pascal`, `leibniz` · liens : `logique-scolastique` → reaction (Ramus contre la scolastique, fait), `logique-antique` → filiation, `geometrie-analytique` → affinité (interprétation : la méthode cartésienne).
 
 ### Fichier `lumieres.ts` — ère `lumieres` (1700 → 1800)
 
-**`analyse-eulerienne`** — Analyse d’Euler et des Bernoulli · lumieres · { start: 1700, end: 1790 } · ['analyse'] · ['Bâle', 'Saint-Pétersbourg', 'Berlin', 'Paris'] · map { x: 2900, y: 2100, size: 3, palette: { fill: '#e6ddf3', stroke: '#4d2c7d', accent: '#6e31c4' } } · préfixe `ae-` · figures : `jean-bernoulli` (Jean Bernoulli, [1667, 1748], Bâle et Groningue), `taylor` (Brook Taylor, [1685, 1731], Londres), `daniel-bernoulli` (Daniel Bernoulli, [1700, 1782], Bâle et Saint-Pétersbourg), `euler` (Leonhard Euler, [1707, 1783], Bâle, Saint-Pétersbourg et Berlin), `clairaut` (Alexis Clairaut, [1713, 1765], Paris), `d-alembert` (Jean le Rond d’Alembert, [1717, 1783], Paris) · résultats : `methodus-incrementorum` (Methodus incrementorum directa et inversa : la formule de Taylor, 1715, texte), `probleme-de-bale` (Problème de Bâle : ζ(2) = π²/6, 1735, theoreme), `hydrodynamica` (Hydrodynamica, 1738, texte), `methodus-inveniendi` (Methodus inveniendi : le calcul des variations, 1744, texte), `equation-des-cordes-vibrantes` (Équation des cordes vibrantes, 1747, probleme), `introductio-in-analysin-infinitorum` (Introductio in analysin infinitorum, 1748, texte), `formule-d-euler` (Formule d’Euler e^(iθ) = cos θ + i sin θ, 1748, theoreme), `institutiones-calculi-differentialis` (Institutiones calculi differentialis, 1755, texte), `equations-d-euler-fluides` (Équations d’Euler des fluides parfaits, 1757, theoreme) · liens : `naissance-du-calcul` → filiation (Leibniz → Bernoulli → Euler, fait), `naissance-des-probabilites` → filiation (famille Bernoulli), `mathematiques-hellenistiques` → influence.
+**`analyse-eulerienne`** — Analyse d’Euler et des Bernoulli · lumieres · { start: 1700, end: 1790 } · ['analyse'] · ['Bâle', 'Saint-Pétersbourg', 'Berlin', 'Paris'] · map { x: 2900, y: 2100, size: 3, palette: { fill: '#e2d5f1', stroke: '#4e2b73', accent: '#5d2a92' } } · préfixe `ae-` · figures : `jean-bernoulli` (Jean Bernoulli, [1667, 1748], Bâle et Groningue), `taylor` (Brook Taylor, [1685, 1731], Londres), `daniel-bernoulli` (Daniel Bernoulli, [1700, 1782], Bâle et Saint-Pétersbourg), `euler` (Leonhard Euler, [1707, 1783], Bâle, Saint-Pétersbourg et Berlin), `clairaut` (Alexis Clairaut, [1713, 1765], Paris), `d-alembert` (Jean le Rond d’Alembert, [1717, 1783], Paris) · résultats : `methodus-incrementorum` (Methodus incrementorum directa et inversa : la formule de Taylor, 1715, texte), `probleme-de-bale` (Problème de Bâle : ζ(2) = π²/6, 1735, theoreme), `hydrodynamica` (Hydrodynamica, 1738, texte), `methodus-inveniendi` (Methodus inveniendi : le calcul des variations, 1744, texte), `equation-des-cordes-vibrantes` (Équation des cordes vibrantes, 1747, probleme), `introductio-in-analysin-infinitorum` (Introductio in analysin infinitorum, 1748, texte), `formule-d-euler` (Formule d’Euler e^(iθ) = cos θ + i sin θ, 1748, theoreme), `institutiones-calculi-differentialis` (Institutiones calculi differentialis, 1755, texte), `equations-d-euler-fluides` (Équations d’Euler des fluides parfaits, 1757, theoreme) · liens : `naissance-du-calcul` → filiation (Leibniz → Bernoulli → Euler, fait), `naissance-des-probabilites` → filiation (famille Bernoulli), `mathematiques-hellenistiques` → influence.
 
-**`mecanique-analytique`** — Mécanique analytique et céleste · lumieres · { start: 1740, end: 1830 } · ['analyse', 'formes'] · ['Paris', 'Berlin', 'Turin'] · map { x: 3100, y: 2600, size: 2, palette: { fill: '#dfd2ee', stroke: '#4a2871', accent: '#6e2eb8' } } · préfixe `ma-` · figures : `maupertuis` (Pierre Louis Moreau de Maupertuis, [1698, 1759], Saint-Malo, Paris et Berlin), `lagrange` (Joseph-Louis Lagrange, [1736, 1813], Turin, Berlin et Paris), `laplace` (Pierre-Simon de Laplace, [1749, 1827], Paris) · résultats : `traite-de-dynamique` (Traité de dynamique : le principe de d’Alembert, 1743, texte, `d-alembert`), `principe-de-moindre-action` (Principe de moindre action, 1744, concept), `theorie-de-la-lune-clairaut` (Théorie de la Lune et retour de la comète de Halley, 1752, theoreme, `clairaut`), `points-de-lagrange` (Essai sur le problème des trois corps : les points de Lagrange, 1772, theoreme), `stabilite-du-systeme-solaire` (Stabilité séculaire du système solaire, 1784, theoreme), `mecanique-analytique-lagrange` (Méchanique analitique, 1788, texte), `equations-de-lagrange` (Équations de Lagrange, 1788, concept), `traite-de-mecanique-celeste` (Traité de mécanique céleste, 1799, texte), `equation-de-laplace` (Équation de Laplace et potentiel, 1785 approx, concept) · related : `d-alembert`, `clairaut`, `euler`, `legendre` · liens : `analyse-eulerienne` → filiation (fait), `naissance-du-calcul` → filiation (Principia, fait).
+**`mecanique-analytique`** — Mécanique analytique et céleste · lumieres · { start: 1740, end: 1830 } · ['analyse', 'formes'] · ['Paris', 'Berlin', 'Turin'] · map { x: 3100, y: 2600, size: 2, palette: { fill: '#e3d5f1', stroke: '#4f2b73', accent: '#5e2a92' } } · préfixe `ma-` · figures : `maupertuis` (Pierre Louis Moreau de Maupertuis, [1698, 1759], Saint-Malo, Paris et Berlin), `lagrange` (Joseph-Louis Lagrange, [1736, 1813], Turin, Berlin et Paris), `laplace` (Pierre-Simon de Laplace, [1749, 1827], Paris) · résultats : `traite-de-dynamique` (Traité de dynamique : le principe de d’Alembert, 1743, texte, `d-alembert`), `principe-de-moindre-action` (Principe de moindre action, 1744, concept), `theorie-de-la-lune-clairaut` (Théorie de la Lune et retour de la comète de Halley, 1752, theoreme, `clairaut`), `points-de-lagrange` (Essai sur le problème des trois corps : les points de Lagrange, 1772, theoreme), `stabilite-du-systeme-solaire` (Stabilité séculaire du système solaire, 1784, theoreme), `mecanique-analytique-lagrange` (Méchanique analitique, 1788, texte), `equations-de-lagrange` (Équations de Lagrange, 1788, concept), `traite-de-mecanique-celeste` (Traité de mécanique céleste, 1799, texte), `equation-de-laplace` (Équation de Laplace et potentiel, 1785 approx, concept) · related : `d-alembert`, `clairaut`, `euler`, `legendre` · liens : `analyse-eulerienne` → filiation (fait), `naissance-du-calcul` → filiation (Principia, fait).
 
-**`theorie-des-nombres-lumieres`** — Théorie des nombres d’Euler à Legendre · lumieres · { start: 1730, end: 1800 } · ['nombres'] · ['Saint-Pétersbourg', 'Berlin', 'Cambridge', 'Paris'] · map { x: 2975, y: 500, size: 2, palette: { fill: '#ece4cb', stroke: '#6a5925', accent: '#af8f2c' } } · préfixe `tnl-` · figures : `goldbach` (Christian Goldbach, [1690, 1764], Königsberg et Saint-Pétersbourg), `waring` (Edward Waring, [1736, 1798], Cambridge), `wilson` (John Wilson, [1741, 1793], Cambridge), `legendre` (Adrien-Marie Legendre, [1752, 1833], Paris) · résultats : `demonstration-du-petit-theoreme-euler` (Démonstration du petit théorème de Fermat, 1736, theoreme, `euler`), `produit-eulerien` (Produit eulérien : ζ(s) = ∏ 1/(1 − p^(−s)), 1737, theoreme, `euler`), `conjecture-de-goldbach` (Conjecture de Goldbach, 1742, conjecture), `demonstration-des-deux-carres-euler` (Démonstration du théorème des deux carrés, 1749, theoreme, `euler`), `fonction-indicatrice-d-euler` (Indicatrice φ(n) et théorème d’Euler, 1763, concept, `euler`), `theoreme-des-quatre-carres` (Théorème des quatre carrés, 1770, theoreme, `lagrange`), `probleme-de-waring` (Problème de Waring, 1770, probleme), `theoreme-de-wilson` (Théorème de Wilson, 1770, theoreme), `loi-de-reciprocite-quadratique-enonce` (Énoncé de la loi de réciprocité quadratique, 1785, conjecture), `essai-sur-la-theorie-des-nombres` (Essai sur la théorie des nombres, 1798, texte), `irrationalite-de-pi` (Irrationalité de π, 1761, theoreme, `lambert`) · related : `euler`, `lagrange`, `lambert` · liens : `theorie-des-nombres-fermat` → filiation (Euler démontre Fermat, fait), `arithmetique-grecque` → influence.
+**`theorie-des-nombres-lumieres`** — Théorie des nombres d’Euler à Legendre · lumieres · { start: 1730, end: 1800 } · ['nombres'] · ['Saint-Pétersbourg', 'Berlin', 'Cambridge', 'Paris'] · map { x: 2975, y: 500, size: 2, palette: { fill: '#ece1c6', stroke: '#645226', accent: '#826826' } } · préfixe `tnl-` · figures : `goldbach` (Christian Goldbach, [1690, 1764], Königsberg et Saint-Pétersbourg), `waring` (Edward Waring, [1736, 1798], Cambridge), `wilson` (John Wilson, [1741, 1793], Cambridge), `legendre` (Adrien-Marie Legendre, [1752, 1833], Paris) · résultats : `demonstration-du-petit-theoreme-euler` (Démonstration du petit théorème de Fermat, 1736, theoreme, `euler`), `produit-eulerien` (Produit eulérien : ζ(s) = ∏ 1/(1 − p^(−s)), 1737, theoreme, `euler`), `conjecture-de-goldbach` (Conjecture de Goldbach, 1742, conjecture), `demonstration-des-deux-carres-euler` (Démonstration du théorème des deux carrés, 1749, theoreme, `euler`), `fonction-indicatrice-d-euler` (Indicatrice φ(n) et théorème d’Euler, 1763, concept, `euler`), `theoreme-des-quatre-carres` (Théorème des quatre carrés, 1770, theoreme, `lagrange`), `probleme-de-waring` (Problème de Waring, 1770, probleme), `theoreme-de-wilson` (Théorème de Wilson, 1770, theoreme), `loi-de-reciprocite-quadratique-enonce` (Énoncé de la loi de réciprocité quadratique, 1785, conjecture), `essai-sur-la-theorie-des-nombres` (Essai sur la théorie des nombres, 1798, texte), `irrationalite-de-pi` (Irrationalité de π, 1761, theoreme, `lambert`) · related : `euler`, `lagrange`, `lambert` · liens : `theorie-des-nombres-fermat` → filiation (Euler démontre Fermat, fait), `arithmetique-grecque` → influence.
 
-**`geometrie-des-lumieres`** — Géométrie des Lumières : courbes, surfaces, parallèles et géométrie descriptive · lumieres · { start: 1730, end: 1810 } · ['formes'] · ['Milan', 'Berlin', 'Saint-Pétersbourg', 'Mézières', 'Paris'] · map { x: 2975, y: 1400, size: 2, palette: { fill: '#cfdeed', stroke: '#264a6d', accent: '#2d70b4' } } · préfixe `gl-` · figures : `saccheri` (Giovanni Girolamo Saccheri, [1667, 1733], Pavie et Milan), `lambert` (Johann Heinrich Lambert, [1728, 1777], Mulhouse et Berlin), `monge` (Gaspard Monge, [1746, 1818], Mézières et Paris), `meusnier` (Jean-Baptiste Meusnier, [1754, 1793], Paris), `carnot` (Lazare Carnot, [1753, 1823], Paris) · résultats : `recherches-sur-les-courbes-a-double-courbure` (Recherches sur les courbes à double courbure, 1731, texte, `clairaut`), `euclides-ab-omni-naevo-vindicatus` (Euclides ab omni naevo vindicatus, 1733, texte), `sept-ponts-de-konigsberg` (Les sept ponts de Königsberg, 1736, theoreme, `euler`), `formule-d-euler-polyedres` (Relation d’Euler S − A + F = 2, 1750, theoreme, `euler`), `courbures-principales-euler` (Courbures principales d’une surface, 1760, theoreme, `euler`), `theorie-der-parallellinien` (Theorie der Parallellinien, 1766, texte), `theoreme-de-meusnier` (Théorème de Meusnier, 1776, theoreme), `geometrie-descriptive` (Géométrie descriptive, 1799, texte), `geometrie-de-position` (Géométrie de position, 1803, texte) · related : `clairaut`, `euler` · liens : `geometrie-grecque` → reaction (le cinquième postulat attaqué, fait), `geometrie-analytique` → filiation, `geometrie-arabe` → influence (al-Ṭūsī lu par Saccheri via Wallis, fait).
+**`geometrie-des-lumieres`** — Géométrie des Lumières : courbes, surfaces, parallèles et géométrie descriptive · lumieres · { start: 1730, end: 1810 } · ['formes'] · ['Milan', 'Berlin', 'Saint-Pétersbourg', 'Mézières', 'Paris'] · map { x: 2975, y: 1400, size: 2, palette: { fill: '#d1e2f0', stroke: '#2a516f', accent: '#29638e' } } · préfixe `gl-` · figures : `saccheri` (Giovanni Girolamo Saccheri, [1667, 1733], Pavie et Milan), `lambert` (Johann Heinrich Lambert, [1728, 1777], Mulhouse et Berlin), `monge` (Gaspard Monge, [1746, 1818], Mézières et Paris), `meusnier` (Jean-Baptiste Meusnier, [1754, 1793], Paris), `carnot` (Lazare Carnot, [1753, 1823], Paris) · résultats : `recherches-sur-les-courbes-a-double-courbure` (Recherches sur les courbes à double courbure, 1731, texte, `clairaut`), `euclides-ab-omni-naevo-vindicatus` (Euclides ab omni naevo vindicatus, 1733, texte), `sept-ponts-de-konigsberg` (Les sept ponts de Königsberg, 1736, theoreme, `euler`), `formule-d-euler-polyedres` (Relation d’Euler S − A + F = 2, 1750, theoreme, `euler`), `courbures-principales-euler` (Courbures principales d’une surface, 1760, theoreme, `euler`), `theorie-der-parallellinien` (Theorie der Parallellinien, 1766, texte), `theoreme-de-meusnier` (Théorème de Meusnier, 1776, theoreme), `geometrie-descriptive` (Géométrie descriptive, 1799, texte), `geometrie-de-position` (Géométrie de position, 1803, texte) · related : `clairaut`, `euler` · liens : `geometrie-grecque` → reaction (le cinquième postulat attaqué, fait), `geometrie-analytique` → filiation, `geometrie-arabe` → influence (al-Ṭūsī lu par Saccheri via Wallis, fait).
 
-**`probabilites-classiques`** — Probabilités classiques et arithmétique politique · lumieres · { start: 1718, end: 1812 } · ['hasard'] · ['Londres', 'Paris', 'Tunbridge Wells'] · map { x: 2975, y: 3250, size: 2, palette: { fill: '#eedcd2', stroke: '#714028', accent: '#b85c2e' } } · préfixe `pcl-` · figures : `de-moivre` (Abraham de Moivre, [1667, 1754], Vitry-le-François et Londres), `bayes` (Thomas Bayes, [1701, 1761] approx, Tunbridge Wells), `buffon` (Georges-Louis Leclerc de Buffon, [1707, 1788], Montbard et Paris), `price` (Richard Price, [1723, 1791], Londres), `condorcet` (Nicolas de Condorcet, [1743, 1794], Paris) · résultats : `doctrine-of-chances` (The Doctrine of Chances, 1718, texte), `approximation-normale-de-moivre` (Approximation normale de la binomiale, 1733, theoreme), `paradoxe-de-saint-petersbourg` (Paradoxe de Saint-Pétersbourg, 1738, probleme, `daniel-bernoulli`), `essai-de-bayes` (An Essay towards solving a Problem in the Doctrine of Chances, 1763, texte), `theoreme-de-bayes` (Théorème de Bayes, 1763, theoreme), `aiguille-de-buffon` (Aiguille de Buffon, 1777, probleme), `essai-sur-l-application-de-l-analyse` (Essai sur l’application de l’analyse à la probabilité des décisions rendues à la pluralité des voix, 1785, texte), `paradoxe-de-condorcet` (Paradoxe de Condorcet, 1785, theoreme), `methode-des-moindres-carres` (Méthode des moindres carrés, 1805, methode, `legendre`), `theorie-analytique-des-probabilites` (Théorie analytique des probabilités, 1812, texte, `laplace`), `theoreme-central-limite-laplace` (Théorème central limite, 1810, theoreme, `laplace`) · related : `daniel-bernoulli`, `legendre`, `laplace` · liens : `naissance-des-probabilites` → filiation (fait), `analyse-eulerienne` → influence, `mecanique-analytique` → filiation (Laplace).
+**`probabilites-classiques`** — Probabilités classiques et arithmétique politique · lumieres · { start: 1718, end: 1812 } · ['hasard'] · ['Londres', 'Paris', 'Tunbridge Wells'] · map { x: 2975, y: 3250, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } } · préfixe `pcl-` · figures : `de-moivre` (Abraham de Moivre, [1667, 1754], Vitry-le-François et Londres), `bayes` (Thomas Bayes, [1701, 1761] approx, Tunbridge Wells), `buffon` (Georges-Louis Leclerc de Buffon, [1707, 1788], Montbard et Paris), `price` (Richard Price, [1723, 1791], Londres), `condorcet` (Nicolas de Condorcet, [1743, 1794], Paris) · résultats : `doctrine-of-chances` (The Doctrine of Chances, 1718, texte), `approximation-normale-de-moivre` (Approximation normale de la binomiale, 1733, theoreme), `paradoxe-de-saint-petersbourg` (Paradoxe de Saint-Pétersbourg, 1738, probleme, `daniel-bernoulli`), `essai-de-bayes` (An Essay towards solving a Problem in the Doctrine of Chances, 1763, texte), `theoreme-de-bayes` (Théorème de Bayes, 1763, theoreme), `aiguille-de-buffon` (Aiguille de Buffon, 1777, probleme), `essai-sur-l-application-de-l-analyse` (Essai sur l’application de l’analyse à la probabilité des décisions rendues à la pluralité des voix, 1785, texte), `paradoxe-de-condorcet` (Paradoxe de Condorcet, 1785, theoreme), `methode-des-moindres-carres` (Méthode des moindres carrés, 1805, methode, `legendre`), `theorie-analytique-des-probabilites` (Théorie analytique des probabilités, 1812, texte, `laplace`), `theoreme-central-limite-laplace` (Théorème central limite, 1810, theoreme, `laplace`) · related : `daniel-bernoulli`, `legendre`, `laplace` · liens : `naissance-des-probabilites` → filiation (fait), `analyse-eulerienne` → influence, `mecanique-analytique` → filiation (Laplace).
 
-**`querelle-des-infiniment-petits`** — Fondements du calcul : la querelle des infiniment petits · lumieres · { start: 1696, end: 1797 } · ['fondements', 'analyse'] · ['Paris', 'Dublin', 'Édimbourg', 'Berlin'] · map { x: 2975, y: 4120, size: 1, palette: { fill: '#c0e8c9', stroke: '#215e2f', accent: '#29a345' } } · préfixe `qip-` · figures : `l-hopital` (Guillaume de L’Hôpital, [1661, 1704], Paris), `rolle` (Michel Rolle, [1652, 1719], Paris), `varignon` (Pierre Varignon, [1654, 1722], Paris), `berkeley` (George Berkeley, [1685, 1753], Dublin et Cloyne), `maclaurin` (Colin Maclaurin, [1698, 1746], Édimbourg) · résultats : `analyse-des-infiniment-petits` (Analyse des infiniment petits pour l’intelligence des lignes courbes, 1696, texte), `regle-de-l-hopital` (Règle de L’Hôpital, 1696, theoreme), `querelle-de-l-academie` (Querelle des infiniment petits à l’Académie royale, 1701 approx, probleme), `the-analyst` (The Analyst : les « fantômes de quantités disparues », 1734, texte), `treatise-of-fluxions` (A Treatise of Fluxions, 1742, texte), `article-limite-encyclopedie` (Article « Limite » de l’Encyclopédie, 1765, texte, `d-alembert`), `theorie-des-fonctions-analytiques` (Théorie des fonctions analytiques, 1797, texte, `lagrange`) · related : `d-alembert`, `lagrange`, `jean-bernoulli`, `newton`, `leibniz` · liens : `naissance-du-calcul` → reaction (fait), `methode-et-caracteristique` → affinité (interprétation), `analyse-eulerienne` → affinité (interprétation).
+**`querelle-des-infiniment-petits`** — Fondements du calcul : la querelle des infiniment petits · lumieres · { start: 1696, end: 1797 } · ['fondements', 'analyse'] · ['Paris', 'Dublin', 'Édimbourg', 'Berlin'] · map { x: 2975, y: 4120, size: 1, palette: { fill: '#cdeed9', stroke: '#296b40', accent: '#288a4b' } } · préfixe `qip-` · figures : `l-hopital` (Guillaume de L’Hôpital, [1661, 1704], Paris), `rolle` (Michel Rolle, [1652, 1719], Paris), `varignon` (Pierre Varignon, [1654, 1722], Paris), `berkeley` (George Berkeley, [1685, 1753], Dublin et Cloyne), `maclaurin` (Colin Maclaurin, [1698, 1746], Édimbourg) · résultats : `analyse-des-infiniment-petits` (Analyse des infiniment petits pour l’intelligence des lignes courbes, 1696, texte), `regle-de-l-hopital` (Règle de L’Hôpital, 1696, theoreme), `querelle-de-l-academie` (Querelle des infiniment petits à l’Académie royale, 1701 approx, probleme), `the-analyst` (The Analyst : les « fantômes de quantités disparues », 1734, texte), `treatise-of-fluxions` (A Treatise of Fluxions, 1742, texte), `article-limite-encyclopedie` (Article « Limite » de l’Encyclopédie, 1765, texte, `d-alembert`), `theorie-des-fonctions-analytiques` (Théorie des fonctions analytiques, 1797, texte, `lagrange`) · related : `d-alembert`, `lagrange`, `jean-bernoulli`, `newton`, `leibniz` · liens : `naissance-du-calcul` → reaction (fait), `methode-et-caracteristique` → affinité (interprétation), `analyse-eulerienne` → affinité (interprétation).
 
 ### Fichier `dixneuvieme-a.ts` — ère `dixneuvieme` (1800 → 1900), nombres, formes, analyse
 
-**`arithmetique-gaussienne`** — Arithmétique de Gauss et ses héritiers · dixneuvieme · { start: 1796, end: 1900 } · ['nombres'] · ['Göttingen', 'Berlin', 'Breslau', 'Saint-Pétersbourg', 'Paris', 'Louvain'] · map { x: 3600, y: 430, size: 3, palette: { fill: '#f1e7da', stroke: '#79572a', accent: '#c08130' } } · préfixe `arg-` · figures : `gauss` (Carl Friedrich Gauss, [1777, 1855], Brunswick et Göttingen), `dirichlet` (Peter Gustav Lejeune Dirichlet, [1805, 1859], Berlin et Göttingen), `kummer` (Ernst Kummer, [1810, 1893], Breslau et Berlin), `eisenstein` (Gotthold Eisenstein, [1823, 1852], Berlin), `kronecker` (Leopold Kronecker, [1823, 1891], Berlin), `chebyshev` (Pafnouti Tchebychev, [1821, 1894], Saint-Pétersbourg), `dedekind` (Richard Dedekind, [1831, 1916], Brunswick, Göttingen et Zurich), `de-la-vallee-poussin` (Charles-Jean de La Vallée Poussin, [1866, 1962], Louvain) · résultats : `demonstration-de-la-reciprocite-quadratique` (Première démonstration de la loi de réciprocité quadratique, 1796, theoreme), `disquisitiones-arithmeticae` (Disquisitiones arithmeticae, 1801, texte), `congruences-et-formes-quadratiques` (Congruences, formes quadratiques et composition, 1801, concept), `theoreme-de-la-progression-arithmetique` (Théorème de Dirichlet sur les nombres premiers en progression arithmétique, 1837, theoreme), `nombres-ideaux` (Nombres idéaux, 1847, concept), `postulat-de-bertrand` (Postulat de Bertrand démontré, 1852, theoreme), `hypothese-de-riemann` (Sur le nombre des nombres premiers inférieurs à une grandeur donnée : l’hypothèse de Riemann, 1859, conjecture, `riemann`), `theoreme-de-kronecker-weber` (Théorème de Kronecker–Weber, 1853, theoreme), `ideaux-de-dedekind` (Théorie des idéaux, 1871, concept), `vorlesungen-ueber-zahlentheorie` (Vorlesungen über Zahlentheorie, 1863, texte), `theoreme-des-nombres-premiers` (Théorème des nombres premiers, 1896, theoreme, authorName « Jacques Hadamard et Charles-Jean de La Vallée Poussin », `de-la-vallee-poussin`) · related : `riemann`, `hadamard`, `legendre` · liens : `theorie-des-nombres-lumieres` → filiation (fait), `theorie-des-nombres-fermat` → influence (Kummer et le dernier théorème, fait), `analyse-rigoureuse` → influence (méthodes analytiques de Dirichlet et Riemann, fait).
+**`arithmetique-gaussienne`** — Arithmétique de Gauss et ses héritiers · dixneuvieme · { start: 1796, end: 1900 } · ['nombres'] · ['Göttingen', 'Berlin', 'Breslau', 'Saint-Pétersbourg', 'Paris', 'Louvain'] · map { x: 3600, y: 430, size: 3, palette: { fill: '#f1e9d5', stroke: '#735d2b', accent: '#92732a' } } · préfixe `arg-` · figures : `gauss` (Carl Friedrich Gauss, [1777, 1855], Brunswick et Göttingen), `dirichlet` (Peter Gustav Lejeune Dirichlet, [1805, 1859], Berlin et Göttingen), `kummer` (Ernst Kummer, [1810, 1893], Breslau et Berlin), `eisenstein` (Gotthold Eisenstein, [1823, 1852], Berlin), `kronecker` (Leopold Kronecker, [1823, 1891], Berlin), `chebyshev` (Pafnouti Tchebychev, [1821, 1894], Saint-Pétersbourg), `dedekind` (Richard Dedekind, [1831, 1916], Brunswick, Göttingen et Zurich), `de-la-vallee-poussin` (Charles-Jean de La Vallée Poussin, [1866, 1962], Louvain) · résultats : `demonstration-de-la-reciprocite-quadratique` (Première démonstration de la loi de réciprocité quadratique, 1796, theoreme), `disquisitiones-arithmeticae` (Disquisitiones arithmeticae, 1801, texte), `congruences-et-formes-quadratiques` (Congruences, formes quadratiques et composition, 1801, concept), `theoreme-de-la-progression-arithmetique` (Théorème de Dirichlet sur les nombres premiers en progression arithmétique, 1837, theoreme), `nombres-ideaux` (Nombres idéaux, 1847, concept), `postulat-de-bertrand` (Postulat de Bertrand démontré, 1852, theoreme), `hypothese-de-riemann` (Sur le nombre des nombres premiers inférieurs à une grandeur donnée : l’hypothèse de Riemann, 1859, conjecture, `riemann`), `theoreme-de-kronecker-weber` (Théorème de Kronecker–Weber, 1853, theoreme), `ideaux-de-dedekind` (Théorie des idéaux, 1871, concept), `vorlesungen-ueber-zahlentheorie` (Vorlesungen über Zahlentheorie, 1863, texte), `theoreme-des-nombres-premiers` (Théorème des nombres premiers, 1896, theoreme, authorName « Jacques Hadamard et Charles-Jean de La Vallée Poussin », `de-la-vallee-poussin`) · related : `riemann`, `hadamard`, `legendre` · liens : `theorie-des-nombres-lumieres` → filiation (fait), `theorie-des-nombres-fermat` → influence (Kummer et le dernier théorème, fait), `analyse-rigoureuse` → influence (méthodes analytiques de Dirichlet et Riemann, fait).
 
-**`algebre-des-groupes`** — Équations, groupes et algèbres nouvelles · dixneuvieme · { start: 1799, end: 1895 } · ['nombres'] · ['Modène', 'Christiania', 'Paris', 'Dublin', 'Cambridge', 'Stettin', 'Leipzig'] · map { x: 4250, y: 580, size: 3, palette: { fill: '#f3ebdd', stroke: '#7d5e2c', accent: '#c48c31' } } · préfixe `adg-` · figures : `ruffini` (Paolo Ruffini, [1765, 1822], Modène), `abel` (Niels Henrik Abel, [1802, 1829], Christiania), `galois` (Évariste Galois, [1811, 1832], Paris), `hamilton-wr` (William Rowan Hamilton, [1805, 1865], Dublin), `grassmann` (Hermann Grassmann, [1809, 1877], Stettin), `cayley` (Arthur Cayley, [1821, 1895], Cambridge), `sylvester` (James Joseph Sylvester, [1814, 1897], Londres, Baltimore et Oxford), `jordan` (Camille Jordan, [1838, 1922], Paris), `sylow` (Ludwig Sylow, [1832, 1918], Frederikshald et Christiania), `lie` (Sophus Lie, [1842, 1899], Christiania et Leipzig) · résultats : `teoria-generale-delle-equazioni` (Teoria generale delle equazioni, 1799, texte), `theoreme-d-abel-ruffini` (Impossibilité de résoudre par radicaux l’équation générale du cinquième degré, 1824, theoreme), `memoire-de-galois` (Mémoire sur les conditions de résolubilité des équations par radicaux, 1831, texte), `theorie-de-galois` (Correspondance de Galois, 1831, theoreme), `quaternions` (Quaternions, 1843, concept), `ausdehnungslehre` (Die lineale Ausdehnungslehre, 1844, texte), `theoreme-de-cayley` (Théorème de Cayley et groupes abstraits, 1854, theoreme), `matrices-cayley` (A Memoir on the Theory of Matrices, 1858, texte), `traite-des-substitutions` (Traité des substitutions et des équations algébriques, 1870, texte), `theoremes-de-sylow` (Théorèmes de Sylow, 1872, theoreme), `groupes-de-transformations-lie` (Groupes continus de transformations, 1873 approx, concept), `theoreme-de-jordan-holder` (Théorème de Jordan–Hölder, 1889, theoreme) · related : `cauchy` (théorie des permutations), `gauss` · liens : `algebre-renaissance` → filiation (l’équation du cinquième degré après Ferrari, fait), `theorie-des-nombres-lumieres` → filiation (Lagrange, Réflexions 1770, fait), `arithmetique-gaussienne` → influence (Gauss, cyclotomie, fait).
+**`algebre-des-groupes`** — Équations, groupes et algèbres nouvelles · dixneuvieme · { start: 1799, end: 1895 } · ['nombres'] · ['Modène', 'Christiania', 'Paris', 'Dublin', 'Cambridge', 'Stettin', 'Leipzig'] · map { x: 4250, y: 580, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } } · préfixe `adg-` · figures : `ruffini` (Paolo Ruffini, [1765, 1822], Modène), `abel` (Niels Henrik Abel, [1802, 1829], Christiania), `galois` (Évariste Galois, [1811, 1832], Paris), `hamilton-wr` (William Rowan Hamilton, [1805, 1865], Dublin), `grassmann` (Hermann Grassmann, [1809, 1877], Stettin), `cayley` (Arthur Cayley, [1821, 1895], Cambridge), `sylvester` (James Joseph Sylvester, [1814, 1897], Londres, Baltimore et Oxford), `jordan` (Camille Jordan, [1838, 1922], Paris), `sylow` (Ludwig Sylow, [1832, 1918], Frederikshald et Christiania), `lie` (Sophus Lie, [1842, 1899], Christiania et Leipzig) · résultats : `teoria-generale-delle-equazioni` (Teoria generale delle equazioni, 1799, texte), `theoreme-d-abel-ruffini` (Impossibilité de résoudre par radicaux l’équation générale du cinquième degré, 1824, theoreme), `memoire-de-galois` (Mémoire sur les conditions de résolubilité des équations par radicaux, 1831, texte), `theorie-de-galois` (Correspondance de Galois, 1831, theoreme), `quaternions` (Quaternions, 1843, concept), `ausdehnungslehre` (Die lineale Ausdehnungslehre, 1844, texte), `theoreme-de-cayley` (Théorème de Cayley et groupes abstraits, 1854, theoreme), `matrices-cayley` (A Memoir on the Theory of Matrices, 1858, texte), `traite-des-substitutions` (Traité des substitutions et des équations algébriques, 1870, texte), `theoremes-de-sylow` (Théorèmes de Sylow, 1872, theoreme), `groupes-de-transformations-lie` (Groupes continus de transformations, 1873 approx, concept), `theoreme-de-jordan-holder` (Théorème de Jordan–Hölder, 1889, theoreme) · related : `cauchy` (théorie des permutations), `gauss` · liens : `algebre-renaissance` → filiation (l’équation du cinquième degré après Ferrari, fait), `theorie-des-nombres-lumieres` → filiation (Lagrange, Réflexions 1770, fait), `arithmetique-gaussienne` → influence (Gauss, cyclotomie, fait).
 
-**`geometries-non-euclidiennes`** — Géométries non euclidiennes et géométrie différentielle · dixneuvieme · { start: 1827, end: 1890 } · ['formes', 'fondements'] · ['Göttingen', 'Kazan', 'Marosvásárhely', 'Bologne', 'Erlangen', 'Leipzig'] · map { x: 3620, y: 1300, size: 3, palette: { fill: '#cfdeed', stroke: '#264b6d', accent: '#2d72b4' } } · préfixe `gne-` · figures : `lobatchevski` (Nikolaï Lobatchevski, [1792, 1856], Kazan), `bolyai` (János Bolyai, [1802, 1860], Marosvásárhely), `helmholtz` (Hermann von Helmholtz, [1821, 1894], Heidelberg et Berlin), `beltrami` (Eugenio Beltrami, [1835, 1900], Bologne et Rome), `klein` (Felix Klein, [1849, 1925], Erlangen, Leipzig et Göttingen), `pasch` (Moritz Pasch, [1843, 1930], Giessen) · résultats : `disquisitiones-generales-circa-superficies-curvas` (Disquisitiones generales circa superficies curvas, 1827, texte, `gauss`), `theorema-egregium` (Theorema egregium, 1827, theoreme, `gauss`), `sur-les-principes-de-la-geometrie` (О началах геометрии : la géométrie imaginaire, 1829, texte), `appendix-bolyai` (Appendix scientiam spatii absolute veram exhibens, 1832, texte), `habilitationsvortrag-riemann` (Über die Hypothesen, welche der Geometrie zu Grunde liegen, 1854, texte, `riemann`), `modele-de-beltrami` (Saggio di interpretazione della geometria non-euclidea : la pseudosphère, 1868, theoreme), `faits-qui-fondent-la-geometrie` (Über die Tatsachen, die der Geometrie zugrunde liegen, 1868, texte), `modele-de-klein` (Modèle projectif de Klein, 1871, concept), `programme-d-erlangen` (Programme d’Erlangen, 1872, texte), `modele-de-poincare` (Disque et demi-plan de Poincaré, 1882, concept, `poincare`), `vorlesungen-ueber-neuere-geometrie` (Vorlesungen über neuere Geometrie : les axiomes d’ordre, 1882, texte) · related : `gauss`, `riemann`, `poincare` · liens : `geometrie-des-lumieres` → filiation (Saccheri, Lambert, fait), `geometrie-grecque` → reaction (le cinquième postulat, fait), `algebre-des-groupes` → influence (Erlangen, fait), `mecanique-analytique` → affinité (interprétation).
+**`geometries-non-euclidiennes`** — Géométries non euclidiennes et géométrie différentielle · dixneuvieme · { start: 1827, end: 1890 } · ['formes', 'fondements'] · ['Göttingen', 'Kazan', 'Marosvásárhely', 'Bologne', 'Erlangen', 'Leipzig'] · map { x: 3620, y: 1300, size: 3, palette: { fill: '#c6dbec', stroke: '#264964', accent: '#265a82' } } · préfixe `gne-` · figures : `lobatchevski` (Nikolaï Lobatchevski, [1792, 1856], Kazan), `bolyai` (János Bolyai, [1802, 1860], Marosvásárhely), `helmholtz` (Hermann von Helmholtz, [1821, 1894], Heidelberg et Berlin), `beltrami` (Eugenio Beltrami, [1835, 1900], Bologne et Rome), `klein` (Felix Klein, [1849, 1925], Erlangen, Leipzig et Göttingen), `pasch` (Moritz Pasch, [1843, 1930], Giessen) · résultats : `disquisitiones-generales-circa-superficies-curvas` (Disquisitiones generales circa superficies curvas, 1827, texte, `gauss`), `theorema-egregium` (Theorema egregium, 1827, theoreme, `gauss`), `sur-les-principes-de-la-geometrie` (О началах геометрии : la géométrie imaginaire, 1829, texte), `appendix-bolyai` (Appendix scientiam spatii absolute veram exhibens, 1832, texte), `habilitationsvortrag-riemann` (Über die Hypothesen, welche der Geometrie zu Grunde liegen, 1854, texte, `riemann`), `modele-de-beltrami` (Saggio di interpretazione della geometria non-euclidea : la pseudosphère, 1868, theoreme), `faits-qui-fondent-la-geometrie` (Über die Tatsachen, die der Geometrie zugrunde liegen, 1868, texte), `modele-de-klein` (Modèle projectif de Klein, 1871, concept), `programme-d-erlangen` (Programme d’Erlangen, 1872, texte), `modele-de-poincare` (Disque et demi-plan de Poincaré, 1882, concept, `poincare`), `vorlesungen-ueber-neuere-geometrie` (Vorlesungen über neuere Geometrie : les axiomes d’ordre, 1882, texte) · related : `gauss`, `riemann`, `poincare` · liens : `geometrie-des-lumieres` → filiation (Saccheri, Lambert, fait), `geometrie-grecque` → reaction (le cinquième postulat, fait), `algebre-des-groupes` → influence (Erlangen, fait), `mecanique-analytique` → affinité (interprétation).
 
-**`geometrie-projective-et-algebrique`** — Géométrie projective et algébrique au XIXᵉ siècle · dixneuvieme · { start: 1822, end: 1900 } · ['formes'] · ['Paris', 'Nîmes', 'Berlin', 'Bonn', 'Leipzig', 'Milan', 'Rome'] · map { x: 4250, y: 1500, size: 2, palette: { fill: '#cfe3ed', stroke: '#26576d', accent: '#2d89b4' } } · préfixe `gpa-` · figures : `gergonne` (Joseph Diez Gergonne, [1771, 1859], Nîmes et Montpellier), `poncelet` (Jean-Victor Poncelet, [1788, 1867], Metz et Paris), `mobius` (August Ferdinand Möbius, [1790, 1868], Leipzig), `steiner` (Jakob Steiner, [1796, 1863], Berlin), `plucker` (Julius Plücker, [1801, 1868], Bonn), `cremona` (Luigi Cremona, [1830, 1903], Bologne, Milan et Rome), `clebsch` (Alfred Clebsch, [1833, 1872], Giessen et Göttingen) · résultats : `traite-des-proprietes-projectives` (Traité des propriétés projectives des figures, 1822, texte), `principe-de-continuite` (Principe de continuité, 1822, concept), `principe-de-dualite` (Principe de dualité, 1826, concept), `calcul-barycentrique` (Der barycentrische Calcul, 1827, texte), `coordonnees-homogenes` (Coordonnées homogènes et formules de Plücker, 1829, concept), `systematische-entwickelung` (Systematische Entwickelung der Abhängigkeit geometrischer Gestalten, 1832, texte), `vingt-sept-droites` (Les 27 droites d’une surface cubique, 1849, theoreme, `cayley`), `surfaces-de-riemann` (Surfaces de Riemann, 1857, concept, `riemann`), `ruban-de-mobius` (Ruban de Möbius, 1858, concept), `transformations-de-cremona` (Transformations birationnelles de Cremona, 1863, concept), `theoreme-de-riemann-roch` (Théorème de Riemann–Roch, 1865, theoreme, authorName « Bernhard Riemann et Gustav Roch », `riemann`) · related : `cayley`, `riemann`, `klein` · liens : `geometrie-analytique` → filiation (Desargues, Pascal redécouverts, fait), `geometrie-des-lumieres` → filiation (Monge → Poncelet, fait), `algebre-des-groupes` → influence (invariants de Cayley–Sylvester, fait).
+**`geometrie-projective-et-algebrique`** — Géométrie projective et algébrique au XIXᵉ siècle · dixneuvieme · { start: 1822, end: 1900 } · ['formes'] · ['Paris', 'Nîmes', 'Berlin', 'Bonn', 'Leipzig', 'Milan', 'Rome'] · map { x: 4250, y: 1500, size: 2, palette: { fill: '#cde0ee', stroke: '#294e6b', accent: '#28608a' } } · préfixe `gpa-` · figures : `gergonne` (Joseph Diez Gergonne, [1771, 1859], Nîmes et Montpellier), `poncelet` (Jean-Victor Poncelet, [1788, 1867], Metz et Paris), `mobius` (August Ferdinand Möbius, [1790, 1868], Leipzig), `steiner` (Jakob Steiner, [1796, 1863], Berlin), `plucker` (Julius Plücker, [1801, 1868], Bonn), `cremona` (Luigi Cremona, [1830, 1903], Bologne, Milan et Rome), `clebsch` (Alfred Clebsch, [1833, 1872], Giessen et Göttingen) · résultats : `traite-des-proprietes-projectives` (Traité des propriétés projectives des figures, 1822, texte), `principe-de-continuite` (Principe de continuité, 1822, concept), `principe-de-dualite` (Principe de dualité, 1826, concept), `calcul-barycentrique` (Der barycentrische Calcul, 1827, texte), `coordonnees-homogenes` (Coordonnées homogènes et formules de Plücker, 1829, concept), `systematische-entwickelung` (Systematische Entwickelung der Abhängigkeit geometrischer Gestalten, 1832, texte), `vingt-sept-droites` (Les 27 droites d’une surface cubique, 1849, theoreme, `cayley`), `surfaces-de-riemann` (Surfaces de Riemann, 1857, concept, `riemann`), `ruban-de-mobius` (Ruban de Möbius, 1858, concept), `transformations-de-cremona` (Transformations birationnelles de Cremona, 1863, concept), `theoreme-de-riemann-roch` (Théorème de Riemann–Roch, 1865, theoreme, authorName « Bernhard Riemann et Gustav Roch », `riemann`) · related : `cayley`, `riemann`, `klein` · liens : `geometrie-analytique` → filiation (Desargues, Pascal redécouverts, fait), `geometrie-des-lumieres` → filiation (Monge → Poncelet, fait), `algebre-des-groupes` → influence (invariants de Cayley–Sylvester, fait).
 
-**`analyse-rigoureuse`** — Rigueur de l’analyse : de Cauchy à Weierstrass · dixneuvieme · { start: 1817, end: 1897 } · ['analyse'] · ['Prague', 'Paris', 'Königsberg', 'Berlin', 'Göttingen'] · map { x: 3620, y: 2200, size: 3, palette: { fill: '#cec0e8', stroke: '#37215e', accent: '#5429a3' } } · préfixe `anr-` · figures : `bolzano` (Bernard Bolzano, [1781, 1848], Prague), `cauchy` (Augustin-Louis Cauchy, [1789, 1857], Paris), `jacobi` (Carl Gustav Jacob Jacobi, [1804, 1851], Königsberg et Berlin), `liouville` (Joseph Liouville, [1809, 1882], Paris), `weierstrass` (Karl Weierstrass, [1815, 1897], Berlin), `riemann` (Bernhard Riemann, [1826, 1866], Göttingen), `heine` (Eduard Heine, [1821, 1881], Halle), `hermite` (Charles Hermite, [1822, 1901], Paris), `lindemann` (Ferdinand von Lindemann, [1852, 1939], Königsberg et Munich) · résultats : `rein-analytischer-beweis` (Rein analytischer Beweis : le théorème des valeurs intermédiaires, 1817, texte), `cours-d-analyse` (Cours d’analyse de l’École royale polytechnique, 1821, texte), `theoreme-des-residus` (Calcul des résidus, 1831, theoreme), `fundamenta-nova` (Fundamenta nova theoriae functionum ellipticarum, 1829, texte), `nombres-de-liouville` (Existence de nombres transcendants, 1844, theoreme), `theoreme-de-l-application-conforme` (Théorème de l’application conforme, 1851, theoreme), `integrale-de-riemann` (Intégrale de Riemann, 1854, concept), `definition-epsilon-delta` (Définition en ε-δ de la continuité et de la convergence uniforme, 1861 approx, concept), `fonction-de-weierstrass` (Fonction continue nulle part dérivable, 1872, theoreme), `coupures-de-dedekind` (Stetigkeit und irrationale Zahlen : les coupures, 1872, concept, `dedekind`), `transcendance-de-e` (Transcendance de e, 1873, theoreme), `transcendance-de-pi` (Transcendance de π, 1882, theoreme), `theoreme-d-approximation-de-weierstrass` (Théorème d’approximation de Weierstrass, 1885, theoreme) · related : `dedekind`, `cantor`, `abel`, `dirichlet` · liens : `querelle-des-infiniment-petits` → filiation (Lagrange → Cauchy, fait), `analyse-eulerienne` → reaction (séries divergentes, fait), `physique-mathematique-xixe` → influence (Fourier, Dirichlet, fait).
+**`analyse-rigoureuse`** — Rigueur de l’analyse : de Cauchy à Weierstrass · dixneuvieme · { start: 1817, end: 1897 } · ['analyse'] · ['Prague', 'Paris', 'Königsberg', 'Berlin', 'Göttingen'] · map { x: 3620, y: 2200, size: 3, palette: { fill: '#d8cdee', stroke: '#3f296b', accent: '#49288a' } } · préfixe `anr-` · figures : `bolzano` (Bernard Bolzano, [1781, 1848], Prague), `cauchy` (Augustin-Louis Cauchy, [1789, 1857], Paris), `jacobi` (Carl Gustav Jacob Jacobi, [1804, 1851], Königsberg et Berlin), `liouville` (Joseph Liouville, [1809, 1882], Paris), `weierstrass` (Karl Weierstrass, [1815, 1897], Berlin), `riemann` (Bernhard Riemann, [1826, 1866], Göttingen), `heine` (Eduard Heine, [1821, 1881], Halle), `hermite` (Charles Hermite, [1822, 1901], Paris), `lindemann` (Ferdinand von Lindemann, [1852, 1939], Königsberg et Munich) · résultats : `rein-analytischer-beweis` (Rein analytischer Beweis : le théorème des valeurs intermédiaires, 1817, texte), `cours-d-analyse` (Cours d’analyse de l’École royale polytechnique, 1821, texte), `theoreme-des-residus` (Calcul des résidus, 1831, theoreme), `fundamenta-nova` (Fundamenta nova theoriae functionum ellipticarum, 1829, texte), `nombres-de-liouville` (Existence de nombres transcendants, 1844, theoreme), `theoreme-de-l-application-conforme` (Théorème de l’application conforme, 1851, theoreme), `integrale-de-riemann` (Intégrale de Riemann, 1854, concept), `definition-epsilon-delta` (Définition en ε-δ de la continuité et de la convergence uniforme, 1861 approx, concept), `fonction-de-weierstrass` (Fonction continue nulle part dérivable, 1872, theoreme), `coupures-de-dedekind` (Stetigkeit und irrationale Zahlen : les coupures, 1872, concept, `dedekind`), `transcendance-de-e` (Transcendance de e, 1873, theoreme), `transcendance-de-pi` (Transcendance de π, 1882, theoreme), `theoreme-d-approximation-de-weierstrass` (Théorème d’approximation de Weierstrass, 1885, theoreme) · related : `dedekind`, `cantor`, `abel`, `dirichlet` · liens : `querelle-des-infiniment-petits` → filiation (Lagrange → Cauchy, fait), `analyse-eulerienne` → reaction (séries divergentes, fait), `physique-mathematique-xixe` → influence (Fourier, Dirichlet, fait).
 
 ### Fichier `dixneuvieme-b.ts` — ère `dixneuvieme` (1800 → 1900), hasard et fondements
 
-**`physique-mathematique-xixe`** — Physique mathématique et équations aux dérivées partielles · dixneuvieme · { start: 1807, end: 1900 } · ['analyse'] · ['Paris', 'Grenoble', 'Nottingham', 'Cambridge', 'Édimbourg', 'Stockholm'] · map { x: 4250, y: 2400, size: 2, palette: { fill: '#e1d6f0', stroke: '#492975', accent: '#6a2fbc' } } · préfixe `pm-` · figures : `fourier` (Joseph Fourier, [1768, 1830], Auxerre, Grenoble et Paris), `poisson` (Siméon Denis Poisson, [1781, 1840], Paris), `green` (George Green, [1793, 1841], Nottingham et Cambridge), `stokes` (George Gabriel Stokes, [1819, 1903], Cambridge), `maxwell` (James Clerk Maxwell, [1831, 1879], Édimbourg, Aberdeen et Cambridge), `kovalevskaia` (Sofia Kovalevskaïa, [1850, 1891], Moscou, Berlin et Stockholm) · résultats : `memoire-sur-la-propagation-de-la-chaleur` (Mémoire sur la propagation de la chaleur dans les corps solides, 1807, texte), `series-de-fourier` (Séries de Fourier, 1807, concept), `equation-de-poisson` (Équation de Poisson, 1813, theoreme), `theorie-analytique-de-la-chaleur` (Théorie analytique de la chaleur, 1822, texte), `essay-de-green` (An Essay on the Application of Mathematical Analysis to the Theories of Electricity and Magnetism, 1828, texte), `fonctions-de-green` (Fonctions de Green, 1828, concept), `equations-de-hamilton` (Équations canoniques de Hamilton, 1834, theoreme, `hamilton-wr`), `theoreme-de-stokes` (Théorème de Stokes, 1854, theoreme), `principe-de-dirichlet` (Principe de Dirichlet et sa critique par Weierstrass, 1857 approx, probleme, `riemann`), `a-dynamical-theory-of-the-electromagnetic-field` (A Dynamical Theory of the Electromagnetic Field, 1865, texte), `theoreme-de-cauchy-kovalevskaia` (Théorème de Cauchy–Kovalevskaïa, 1875, theoreme), `sur-le-probleme-des-trois-corps` (Sur le problème des trois corps et les équations de la dynamique, 1890, texte, `poincare`) · related : `hamilton-wr`, `riemann`, `poincare`, `cauchy`, `dirichlet` · liens : `mecanique-analytique` → filiation (Laplace → Fourier, Poisson, fait), `analyse-eulerienne` → filiation (cordes vibrantes, fait), `analyse-rigoureuse` → reaction (la rigueur contre les séries de Fourier, puis réconciliation par Dirichlet, interprétation).
+**`physique-mathematique-xixe`** — Physique mathématique et équations aux dérivées partielles · dixneuvieme · { start: 1807, end: 1900 } · ['analyse'] · ['Paris', 'Grenoble', 'Nottingham', 'Cambridge', 'Édimbourg', 'Stockholm'] · map { x: 4250, y: 2400, size: 2, palette: { fill: '#ddcdee', stroke: '#48296b', accent: '#56288a' } } · préfixe `pm-` · figures : `fourier` (Joseph Fourier, [1768, 1830], Auxerre, Grenoble et Paris), `poisson` (Siméon Denis Poisson, [1781, 1840], Paris), `green` (George Green, [1793, 1841], Nottingham et Cambridge), `stokes` (George Gabriel Stokes, [1819, 1903], Cambridge), `maxwell` (James Clerk Maxwell, [1831, 1879], Édimbourg, Aberdeen et Cambridge), `kovalevskaia` (Sofia Kovalevskaïa, [1850, 1891], Moscou, Berlin et Stockholm) · résultats : `memoire-sur-la-propagation-de-la-chaleur` (Mémoire sur la propagation de la chaleur dans les corps solides, 1807, texte), `series-de-fourier` (Séries de Fourier, 1807, concept), `equation-de-poisson` (Équation de Poisson, 1813, theoreme), `theorie-analytique-de-la-chaleur` (Théorie analytique de la chaleur, 1822, texte), `essay-de-green` (An Essay on the Application of Mathematical Analysis to the Theories of Electricity and Magnetism, 1828, texte), `fonctions-de-green` (Fonctions de Green, 1828, concept), `equations-de-hamilton` (Équations canoniques de Hamilton, 1834, theoreme, `hamilton-wr`), `theoreme-de-stokes` (Théorème de Stokes, 1854, theoreme), `principe-de-dirichlet` (Principe de Dirichlet et sa critique par Weierstrass, 1857 approx, probleme, `riemann`), `a-dynamical-theory-of-the-electromagnetic-field` (A Dynamical Theory of the Electromagnetic Field, 1865, texte), `theoreme-de-cauchy-kovalevskaia` (Théorème de Cauchy–Kovalevskaïa, 1875, theoreme), `sur-le-probleme-des-trois-corps` (Sur le problème des trois corps et les équations de la dynamique, 1890, texte, `poincare`) · related : `hamilton-wr`, `riemann`, `poincare`, `cauchy`, `dirichlet` · liens : `mecanique-analytique` → filiation (Laplace → Fourier, Poisson, fait), `analyse-eulerienne` → filiation (cordes vibrantes, fait), `analyse-rigoureuse` → reaction (la rigueur contre les séries de Fourier, puis réconciliation par Dirichlet, interprétation).
 
-**`statistique-xixe`** — Statistique, moyennes et lois du hasard au XIXᵉ siècle · dixneuvieme · { start: 1809, end: 1900 } · ['hasard'] · ['Bruxelles', 'Paris', 'Londres', 'Saint-Pétersbourg'] · map { x: 3975, y: 3230, size: 2, palette: { fill: '#eed7d2', stroke: '#713428', accent: '#b8452e' } } · préfixe `sx-` · figures : `quetelet` (Adolphe Quetelet, [1796, 1874], Gand et Bruxelles), `bienayme` (Irénée-Jules Bienaymé, [1796, 1878], Paris), `galton` (Francis Galton, [1822, 1911], Londres), `lexis` (Wilhelm Lexis, [1837, 1914], Strasbourg et Göttingen), `edgeworth` (Francis Ysidro Edgeworth, [1845, 1926], Oxford), `pearson-karl` (Karl Pearson, [1857, 1936], Londres) · résultats : `theoria-motus` (Theoria motus corporum coelestium : loi normale et moindres carrés, 1809, texte, `gauss`), `theoreme-de-gauss-markov-origine` (Justification des moindres carrés, 1821 approx, theoreme, `gauss`), `sur-l-homme` (Sur l’homme et le développement de ses facultés : l’homme moyen, 1835, texte), `loi-de-poisson` (Loi de Poisson et « loi des grands nombres », 1837, theoreme, `poisson`), `inegalite-de-bienayme-tchebychev` (Inégalité de Bienaymé–Tchebychev, 1853, theoreme), `theoreme-central-limite-tchebychev` (Démonstration du théorème central limite par les moments, 1887, theoreme, `chebyshev`), `planche-de-galton` (Planche de Galton, 1873, concept), `regression-vers-la-moyenne` (Régression vers la moyenne, 1886, concept), `coefficient-de-correlation` (Coefficient de corrélation, 1896, concept), `test-du-chi-deux` (Test du χ², 1900, methode) · related : `gauss`, `poisson`, `chebyshev`, `laplace` · liens : `probabilites-classiques` → filiation (Laplace, Gauss, fait), `arithmetique-gaussienne` → influence (Gauss, Tchebychev), `physique-mathematique-xixe` → affinité (Maxwell et la statistique des gaz, interprétation).
+**`statistique-xixe`** — Statistique, moyennes et lois du hasard au XIXᵉ siècle · dixneuvieme · { start: 1809, end: 1900 } · ['hasard'] · ['Bruxelles', 'Paris', 'Londres', 'Saint-Pétersbourg'] · map { x: 3975, y: 3230, size: 2, palette: { fill: '#f0d7d1', stroke: '#6f382a', accent: '#8e3e29' } } · préfixe `sx-` · figures : `quetelet` (Adolphe Quetelet, [1796, 1874], Gand et Bruxelles), `bienayme` (Irénée-Jules Bienaymé, [1796, 1878], Paris), `galton` (Francis Galton, [1822, 1911], Londres), `lexis` (Wilhelm Lexis, [1837, 1914], Strasbourg et Göttingen), `edgeworth` (Francis Ysidro Edgeworth, [1845, 1926], Oxford), `pearson-karl` (Karl Pearson, [1857, 1936], Londres) · résultats : `theoria-motus` (Theoria motus corporum coelestium : loi normale et moindres carrés, 1809, texte, `gauss`), `theoreme-de-gauss-markov-origine` (Justification des moindres carrés, 1821 approx, theoreme, `gauss`), `sur-l-homme` (Sur l’homme et le développement de ses facultés : l’homme moyen, 1835, texte), `loi-de-poisson` (Loi de Poisson et « loi des grands nombres », 1837, theoreme, `poisson`), `inegalite-de-bienayme-tchebychev` (Inégalité de Bienaymé–Tchebychev, 1853, theoreme), `theoreme-central-limite-tchebychev` (Démonstration du théorème central limite par les moments, 1887, theoreme, `chebyshev`), `planche-de-galton` (Planche de Galton, 1873, concept), `regression-vers-la-moyenne` (Régression vers la moyenne, 1886, concept), `coefficient-de-correlation` (Coefficient de corrélation, 1896, concept), `test-du-chi-deux` (Test du χ², 1900, methode) · related : `gauss`, `poisson`, `chebyshev`, `laplace` · liens : `probabilites-classiques` → filiation (Laplace, Gauss, fait), `arithmetique-gaussienne` → influence (Gauss, Tchebychev), `physique-mathematique-xixe` → affinité (Maxwell et la statistique des gaz, interprétation).
 
-**`logique-mathematique-xixe`** — Algèbre de la logique, machines et naissance de la logique mathématique · dixneuvieme · { start: 1837, end: 1900 } · ['fondements', 'hasard'] · ['Londres', 'Cambridge', 'Cork', 'Iéna', 'Turin', 'Cambridge (Mass.)'] · map { x: 4300, y: 4000, size: 2, palette: { fill: '#d2eedc', stroke: '#287141', accent: '#2eb85e' } } · préfixe `lm-` · figures : `babbage` (Charles Babbage, [1791, 1871], Londres), `lovelace` (Ada Lovelace, [1815, 1852], Londres), `de-morgan` (Augustus De Morgan, [1806, 1871], Londres), `boole` (George Boole, [1815, 1864], Lincoln et Cork), `jevons` (William Stanley Jevons, [1835, 1882], Manchester et Londres), `peirce` (Charles Sanders Peirce, [1839, 1914], Cambridge (Mass.) et Milford), `schroder` (Ernst Schröder, [1841, 1902], Karlsruhe), `frege` (Gottlob Frege, [1848, 1925], Iéna), `peano` (Giuseppe Peano, [1858, 1932], Turin) · résultats : `machine-analytique` (Machine analytique, 1837, concept), `notes-de-lovelace` (Notes sur la machine analytique, 1843, texte), `the-mathematical-analysis-of-logic` (The Mathematical Analysis of Logic, 1847, texte), `lois-de-de-morgan` (Lois de De Morgan et logique des relations, 1847, theoreme), `the-laws-of-thought` (An Investigation of the Laws of Thought, 1854, texte), `piano-logique` (Piano logique de Jevons, 1869, methode), `quantificateurs` (Quantificateurs, 1879, concept), `begriffsschrift` (Begriffsschrift, 1879, texte), `grundlagen-der-arithmetik` (Die Grundlagen der Arithmetik, 1884, texte), `vorlesungen-ueber-die-algebra-der-logik` (Vorlesungen über die Algebra der Logik, 1890, texte), `arithmetices-principia` (Arithmetices principia, nova methodo exposita : les axiomes de Peano, 1889, texte), `formulaire-de-mathematiques` (Formulaire de mathématiques, 1895, texte) · related : `leibniz` (non requis), `dedekind` · liens : `methode-et-caracteristique` → filiation (Leibniz redécouvert, interprétation), `logique-scolastique` → influence (interprétation), `algebre-des-groupes` → influence (l’algèbre symbolique anglaise, fait), `logarithmes-et-calcul-numerique` → filiation (machines, fait).
+**`logique-mathematique-xixe`** — Algèbre de la logique, machines et naissance de la logique mathématique · dixneuvieme · { start: 1837, end: 1900 } · ['fondements', 'hasard'] · ['Londres', 'Cambridge', 'Cork', 'Iéna', 'Turin', 'Cambridge (Mass.)'] · map { x: 4300, y: 4000, size: 2, palette: { fill: '#cdeedb', stroke: '#296b44', accent: '#288a51' } } · préfixe `lm-` · figures : `babbage` (Charles Babbage, [1791, 1871], Londres), `lovelace` (Ada Lovelace, [1815, 1852], Londres), `de-morgan` (Augustus De Morgan, [1806, 1871], Londres), `boole` (George Boole, [1815, 1864], Lincoln et Cork), `jevons` (William Stanley Jevons, [1835, 1882], Manchester et Londres), `peirce` (Charles Sanders Peirce, [1839, 1914], Cambridge (Mass.) et Milford), `schroder` (Ernst Schröder, [1841, 1902], Karlsruhe), `frege` (Gottlob Frege, [1848, 1925], Iéna), `peano` (Giuseppe Peano, [1858, 1932], Turin) · résultats : `machine-analytique` (Machine analytique, 1837, concept), `notes-de-lovelace` (Notes sur la machine analytique, 1843, texte), `the-mathematical-analysis-of-logic` (The Mathematical Analysis of Logic, 1847, texte), `lois-de-de-morgan` (Lois de De Morgan et logique des relations, 1847, theoreme), `the-laws-of-thought` (An Investigation of the Laws of Thought, 1854, texte), `piano-logique` (Piano logique de Jevons, 1869, methode), `quantificateurs` (Quantificateurs, 1879, concept), `begriffsschrift` (Begriffsschrift, 1879, texte), `grundlagen-der-arithmetik` (Die Grundlagen der Arithmetik, 1884, texte), `vorlesungen-ueber-die-algebra-der-logik` (Vorlesungen über die Algebra der Logik, 1890, texte), `arithmetices-principia` (Arithmetices principia, nova methodo exposita : les axiomes de Peano, 1889, texte), `formulaire-de-mathematiques` (Formulaire de mathématiques, 1895, texte) · related : `leibniz` (non requis), `dedekind` · liens : `methode-et-caracteristique` → filiation (Leibniz redécouvert, interprétation), `logique-scolastique` → influence (interprétation), `algebre-des-groupes` → influence (l’algèbre symbolique anglaise, fait), `logarithmes-et-calcul-numerique` → filiation (machines, fait).
 
-**`theorie-des-ensembles`** — Théorie des ensembles et infini actuel · dixneuvieme · { start: 1872, end: 1914 } · ['fondements'] · ['Halle', 'Brunswick', 'Göttingen', 'Turin'] · map { x: 3650, y: 4150, size: 3, palette: { fill: '#ddf3e6', stroke: '#2c7d4d', accent: '#31c46e' } } · préfixe `tde-` · figures : `cantor` (Georg Cantor, [1845, 1918], Halle), `burali-forti` (Cesare Burali-Forti, [1861, 1931], Turin), `bernstein` (Felix Bernstein, [1878, 1956], Halle et Göttingen), `zermelo` (Ernst Zermelo, [1871, 1953], Göttingen, Zurich et Fribourg) · résultats : `non-denombrabilite-des-reels` (Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen : les réels ne sont pas dénombrables, 1874, theoreme), `hypothese-du-continu` (Hypothèse du continu, 1878, conjecture), `grundlagen-einer-allgemeinen-mannigfaltigkeitslehre` (Grundlagen einer allgemeinen Mannigfaltigkeitslehre : les ordinaux transfinis, 1883, texte), `was-sind-und-was-sollen-die-zahlen` (Was sind und was sollen die Zahlen ?, 1888, texte, `dedekind`), `argument-diagonal` (Argument diagonal et théorème de Cantor, 1891, theoreme), `paradoxe-de-burali-forti` (Paradoxe de Burali-Forti, 1897, probleme), `theoreme-de-cantor-bernstein` (Théorème de Cantor–Bernstein, 1897, theoreme), `paradoxe-de-russell` (Paradoxe de Russell, 1901, probleme, `russell`), `theoreme-du-bon-ordre` (Théorème du bon ordre et axiome du choix, 1904, theoreme), `axiomatisation-de-zermelo` (Untersuchungen über die Grundlagen der Mengenlehre, 1908, texte), `grundzuege-der-mengenlehre` (Grundzüge der Mengenlehre, 1914, texte, `hausdorff`) · related : `dedekind`, `russell`, `hausdorff`, `kronecker` (opposant), `weierstrass` · liens : `analyse-rigoureuse` → filiation (séries trigonométriques → ensembles dérivés, fait), `logique-mathematique-xixe` → affinité (Frege, Dedekind, interprétation), `arithmetique-gaussienne` → reaction (Kronecker contre Cantor, fait), `logique-antique` → reaction (l’infini actuel contre Aristote, interprétation).
+**`theorie-des-ensembles`** — Théorie des ensembles et infini actuel · dixneuvieme · { start: 1872, end: 1914 } · ['fondements'] · ['Halle', 'Brunswick', 'Göttingen', 'Turin'] · map { x: 3650, y: 4150, size: 3, palette: { fill: '#d5f1e0', stroke: '#2b7348', accent: '#2a9254' } } · préfixe `tde-` · figures : `cantor` (Georg Cantor, [1845, 1918], Halle), `burali-forti` (Cesare Burali-Forti, [1861, 1931], Turin), `bernstein` (Felix Bernstein, [1878, 1956], Halle et Göttingen), `zermelo` (Ernst Zermelo, [1871, 1953], Göttingen, Zurich et Fribourg) · résultats : `non-denombrabilite-des-reels` (Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen : les réels ne sont pas dénombrables, 1874, theoreme), `hypothese-du-continu` (Hypothèse du continu, 1878, conjecture), `grundlagen-einer-allgemeinen-mannigfaltigkeitslehre` (Grundlagen einer allgemeinen Mannigfaltigkeitslehre : les ordinaux transfinis, 1883, texte), `was-sind-und-was-sollen-die-zahlen` (Was sind und was sollen die Zahlen ?, 1888, texte, `dedekind`), `argument-diagonal` (Argument diagonal et théorème de Cantor, 1891, theoreme), `paradoxe-de-burali-forti` (Paradoxe de Burali-Forti, 1897, probleme), `theoreme-de-cantor-bernstein` (Théorème de Cantor–Bernstein, 1897, theoreme), `paradoxe-de-russell` (Paradoxe de Russell, 1901, probleme, `russell`), `theoreme-du-bon-ordre` (Théorème du bon ordre et axiome du choix, 1904, theoreme), `axiomatisation-de-zermelo` (Untersuchungen über die Grundlagen der Mengenlehre, 1908, texte), `grundzuege-der-mengenlehre` (Grundzüge der Mengenlehre, 1914, texte, `hausdorff`) · related : `dedekind`, `russell`, `hausdorff`, `kronecker` (opposant), `weierstrass` · liens : `analyse-rigoureuse` → filiation (séries trigonométriques → ensembles dérivés, fait), `logique-mathematique-xixe` → affinité (Frege, Dedekind, interprétation), `arithmetique-gaussienne` → reaction (Kronecker contre Cantor, fait), `logique-antique` → reaction (l’infini actuel contre Aristote, interprétation).
 
 ### Fichier `structures-a.ts` — ère `structures` (1900 → 1960), nombres, formes, analyse
 
-**`algebre-moderne`** — Algèbre moderne : de Hilbert à Noether · structures · { start: 1890, end: 1945 } · ['nombres'] · ['Göttingen', 'Berlin', 'Hambourg', 'Amsterdam'] · map { x: 4950, y: 430, size: 3, palette: { fill: '#e8dac0', stroke: '#5e4921', accent: '#a37829' } } · préfixe `am-` · figures : `steinitz` (Ernst Steinitz, [1871, 1928], Berlin et Kiel), `wedderburn` (Joseph Wedderburn, [1882, 1948], Édimbourg et Princeton), `noether` (Emmy Noether, [1882, 1935], Erlangen, Göttingen et Bryn Mawr), `artin` (Emil Artin, [1898, 1962], Hambourg, Princeton), `krull` (Wolfgang Krull, [1899, 1971], Erlangen et Bonn), `van-der-waerden` (Bartel van der Waerden, [1903, 1996], Amsterdam, Groningue, Leipzig et Zurich) · résultats : `theoreme-de-la-base-de-hilbert` (Théorème de la base de Hilbert, 1890, theoreme, `hilbert`), `nullstellensatz` (Nullstellensatz, 1893, theoreme, `hilbert`), `petit-theoreme-de-wedderburn` (Tout corps fini est commutatif, 1905, theoreme), `theoreme-de-wedderburn-artin` (Structure des algèbres semi-simples, 1908, theoreme), `algebraische-theorie-der-koerper` (Algebraische Theorie der Körper, 1910, texte), `idealtheorie-in-ringbereichen` (Idealtheorie in Ringbereichen : les anneaux noethériens, 1921, texte), `theorie-des-ideaux-noether` (Décomposition primaire et condition de chaîne ascendante, 1921, concept), `moderne-algebra` (Moderne Algebra, 1930, texte), `theorie-de-galois-abstraite` (Galois Theory : l’exposé moderne, 1942, texte), `dimension-de-krull` (Dimension de Krull, 1937, concept) · related : `hilbert`, `dedekind` · liens : `algebre-des-groupes` → filiation (fait), `arithmetique-gaussienne` → filiation (Dedekind → Noether, fait), `theorie-des-ensembles` → influence (méthodes ensemblistes, interprétation).
+**`algebre-moderne`** — Algèbre moderne : de Hilbert à Noether · structures · { start: 1890, end: 1945 } · ['nombres'] · ['Göttingen', 'Berlin', 'Hambourg', 'Amsterdam'] · map { x: 4950, y: 430, size: 3, palette: { fill: '#eee2cd', stroke: '#6b5229', accent: '#8a6528' } } · préfixe `am-` · figures : `steinitz` (Ernst Steinitz, [1871, 1928], Berlin et Kiel), `wedderburn` (Joseph Wedderburn, [1882, 1948], Édimbourg et Princeton), `noether` (Emmy Noether, [1882, 1935], Erlangen, Göttingen et Bryn Mawr), `artin` (Emil Artin, [1898, 1962], Hambourg, Princeton), `krull` (Wolfgang Krull, [1899, 1971], Erlangen et Bonn), `van-der-waerden` (Bartel van der Waerden, [1903, 1996], Amsterdam, Groningue, Leipzig et Zurich) · résultats : `theoreme-de-la-base-de-hilbert` (Théorème de la base de Hilbert, 1890, theoreme, `hilbert`), `nullstellensatz` (Nullstellensatz, 1893, theoreme, `hilbert`), `petit-theoreme-de-wedderburn` (Tout corps fini est commutatif, 1905, theoreme), `theoreme-de-wedderburn-artin` (Structure des algèbres semi-simples, 1908, theoreme), `algebraische-theorie-der-koerper` (Algebraische Theorie der Körper, 1910, texte), `idealtheorie-in-ringbereichen` (Idealtheorie in Ringbereichen : les anneaux noethériens, 1921, texte), `theorie-des-ideaux-noether` (Décomposition primaire et condition de chaîne ascendante, 1921, concept), `moderne-algebra` (Moderne Algebra, 1930, texte), `theorie-de-galois-abstraite` (Galois Theory : l’exposé moderne, 1942, texte), `dimension-de-krull` (Dimension de Krull, 1937, concept) · related : `hilbert`, `dedekind` · liens : `algebre-des-groupes` → filiation (fait), `arithmetique-gaussienne` → filiation (Dedekind → Noether, fait), `theorie-des-ensembles` → influence (méthodes ensemblistes, interprétation).
 
-**`theorie-des-nombres-xxe`** — Théorie des nombres au XXᵉ siècle : corps de classes et méthodes analytiques · structures · { start: 1896, end: 1960 } · ['nombres'] · ['Göttingen', 'Cambridge', 'Tokyo', 'Hambourg', 'Moscou', 'Princeton', 'Oslo'] · map { x: 5600, y: 600, size: 2, palette: { fill: '#ece2cb', stroke: '#6a5525', accent: '#af882c' } } · préfixe `tnx-` · figures : `minkowski` (Hermann Minkowski, [1864, 1909], Königsberg, Zurich et Göttingen), `takagi` (Teiji Takagi, [1875, 1960], Tokyo), `hardy` (G. H. Hardy, [1877, 1947], Cambridge et Oxford), `littlewood` (John Edensor Littlewood, [1885, 1977], Cambridge), `ramanujan` (Srinivasa Ramanujan, [1887, 1920], Kumbakonam, Madras et Cambridge), `hecke` (Erich Hecke, [1887, 1947], Hambourg), `vinogradov` (Ivan Vinogradov, [1891, 1983], Leningrad et Moscou), `siegel` (Carl Ludwig Siegel, [1896, 1981], Francfort, Princeton et Göttingen), `hasse` (Helmut Hasse, [1898, 1979], Marbourg, Göttingen et Hambourg), `selberg` (Atle Selberg, [1917, 2007], Oslo et Princeton) · résultats : `geometrie-der-zahlen` (Geometrie der Zahlen, 1896, texte), `zahlbericht` (Zahlbericht, 1897, texte, `hilbert`), `lettre-de-ramanujan-a-hardy` (Lettre de Ramanujan à Hardy, 1913, texte), `methode-du-cercle` (Méthode du cercle, 1918, methode), `formule-asymptotique-des-partitions` (Formule asymptotique du nombre de partitions, 1918, theoreme), `theorie-du-corps-de-classes` (Théorie du corps de classes, 1920, theoreme), `principe-local-global-de-hasse` (Principe de Hasse (local-global), 1924, theoreme), `loi-de-reciprocite-d-artin` (Loi de réciprocité d’Artin, 1927, theoreme, `artin`), `theoreme-de-siegel` (Finitude des points entiers sur les courbes de genre ≥ 1, 1929, theoreme), `theoreme-de-vinogradov` (Théorème des trois nombres premiers, 1937, theoreme), `demonstration-elementaire-du-theoreme-des-nombres-premiers` (Démonstration élémentaire du théorème des nombres premiers, 1949, theoreme, authorName « Atle Selberg et Paul Erdős »), `formule-des-traces-de-selberg` (Formule des traces de Selberg, 1956, theoreme) · related : `hilbert`, `artin`, `weil`, `erdos` · liens : `arithmetique-gaussienne` → filiation (fait), `algebre-moderne` → influence (Artin, Hasse, Noether, fait), `analyse-rigoureuse` → influence (fonctions analytiques, fait).
+**`theorie-des-nombres-xxe`** — Théorie des nombres au XXᵉ siècle : corps de classes et méthodes analytiques · structures · { start: 1896, end: 1960 } · ['nombres'] · ['Göttingen', 'Cambridge', 'Tokyo', 'Hambourg', 'Moscou', 'Princeton', 'Oslo'] · map { x: 5600, y: 600, size: 2, palette: { fill: '#ecddc6', stroke: '#644c26', accent: '#825f26' } } · préfixe `tnx-` · figures : `minkowski` (Hermann Minkowski, [1864, 1909], Königsberg, Zurich et Göttingen), `takagi` (Teiji Takagi, [1875, 1960], Tokyo), `hardy` (G. H. Hardy, [1877, 1947], Cambridge et Oxford), `littlewood` (John Edensor Littlewood, [1885, 1977], Cambridge), `ramanujan` (Srinivasa Ramanujan, [1887, 1920], Kumbakonam, Madras et Cambridge), `hecke` (Erich Hecke, [1887, 1947], Hambourg), `vinogradov` (Ivan Vinogradov, [1891, 1983], Leningrad et Moscou), `siegel` (Carl Ludwig Siegel, [1896, 1981], Francfort, Princeton et Göttingen), `hasse` (Helmut Hasse, [1898, 1979], Marbourg, Göttingen et Hambourg), `selberg` (Atle Selberg, [1917, 2007], Oslo et Princeton) · résultats : `geometrie-der-zahlen` (Geometrie der Zahlen, 1896, texte), `zahlbericht` (Zahlbericht, 1897, texte, `hilbert`), `lettre-de-ramanujan-a-hardy` (Lettre de Ramanujan à Hardy, 1913, texte), `methode-du-cercle` (Méthode du cercle, 1918, methode), `formule-asymptotique-des-partitions` (Formule asymptotique du nombre de partitions, 1918, theoreme), `theorie-du-corps-de-classes` (Théorie du corps de classes, 1920, theoreme), `principe-local-global-de-hasse` (Principe de Hasse (local-global), 1924, theoreme), `loi-de-reciprocite-d-artin` (Loi de réciprocité d’Artin, 1927, theoreme, `artin`), `theoreme-de-siegel` (Finitude des points entiers sur les courbes de genre ≥ 1, 1929, theoreme), `theoreme-de-vinogradov` (Théorème des trois nombres premiers, 1937, theoreme), `demonstration-elementaire-du-theoreme-des-nombres-premiers` (Démonstration élémentaire du théorème des nombres premiers, 1949, theoreme, authorName « Atle Selberg et Paul Erdős »), `formule-des-traces-de-selberg` (Formule des traces de Selberg, 1956, theoreme) · related : `hilbert`, `artin`, `weil`, `erdos` · liens : `arithmetique-gaussienne` → filiation (fait), `algebre-moderne` → influence (Artin, Hasse, Noether, fait), `analyse-rigoureuse` → influence (fonctions analytiques, fait).
 
-**`topologie`** — Topologie : de l’Analysis situs aux groupes d’homotopie · structures · { start: 1895, end: 1960 } · ['formes'] · ['Paris', 'Bonn', 'Moscou', 'Princeton', 'Zurich', 'Varsovie'] · map { x: 4950, y: 1300, size: 3, palette: { fill: '#c3d6e9', stroke: '#224162', accent: '#2a66a7' } } · préfixe `top-` · figures : `poincare` (Henri Poincaré, [1854, 1912], Nancy et Paris), `hausdorff` (Felix Hausdorff, [1868, 1942], Leipzig, Greifswald et Bonn), `lefschetz` (Solomon Lefschetz, [1884, 1972], Moscou, Kansas et Princeton), `alexander` (James Waddell Alexander, [1888, 1971], Princeton), `hopf` (Heinz Hopf, [1894, 1971], Berlin et Zurich), `alexandrov` (Pavel Alexandrov, [1896, 1982], Moscou), `urysohn` (Pavel Urysohn, [1898, 1924], Moscou), `hurewicz` (Witold Hurewicz, [1904, 1956], Vienne, Amsterdam et Princeton), `whitney` (Hassler Whitney, [1907, 1989], Harvard et Princeton), `steenrod` (Norman Steenrod, [1910, 1971], Princeton) · résultats : `analysis-situs` (Analysis situs, 1895, texte), `conjecture-de-poincare` (Conjecture de Poincaré, 1904, conjecture), `theoreme-du-point-fixe-de-brouwer` (Théorème du point fixe de Brouwer, 1911, theoreme, `brouwer`), `invariance-de-la-dimension` (Invariance de la dimension et du domaine, 1911, theoreme, `brouwer`), `espaces-topologiques-de-hausdorff` (Espaces topologiques (axiomes de voisinage), 1914, concept), `lemme-d-urysohn` (Lemme d’Urysohn, 1925, theoreme), `formule-des-points-fixes-de-lefschetz` (Formule des points fixes de Lefschetz, 1926, theoreme), `polynome-d-alexander` (Polynôme d’Alexander, 1928, concept), `fibration-de-hopf` (Fibration de Hopf, 1931, theoreme), `groupes-d-homotopie` (Groupes d’homotopie supérieurs, 1935, concept), `theoreme-de-plongement-de-whitney` (Théorème de plongement de Whitney, 1936, theoreme), `axiomes-d-eilenberg-steenrod` (Axiomes d’Eilenberg–Steenrod, 1945, texte, `eilenberg`), `classes-caracteristiques` (Classes de Stiefel–Whitney et de Chern, 1935 approx, concept) · related : `brouwer`, `eilenberg`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (Riemann, Möbius, fait), `geometries-non-euclidiennes` → filiation (Riemann, Klein, Poincaré, fait), `theorie-des-ensembles` → filiation (Hausdorff, fait), `algebre-moderne` → influence (Noether et les groupes d’homologie, fait).
+**`topologie`** — Topologie : de l’Analysis situs aux groupes d’homotopie · structures · { start: 1895, end: 1960 } · ['formes'] · ['Paris', 'Bonn', 'Moscou', 'Princeton', 'Zurich', 'Varsovie'] · map { x: 4950, y: 1300, size: 3, palette: { fill: '#cddeee', stroke: '#294a6b', accent: '#28598a' } } · préfixe `top-` · figures : `poincare` (Henri Poincaré, [1854, 1912], Nancy et Paris), `hausdorff` (Felix Hausdorff, [1868, 1942], Leipzig, Greifswald et Bonn), `lefschetz` (Solomon Lefschetz, [1884, 1972], Moscou, Kansas et Princeton), `alexander` (James Waddell Alexander, [1888, 1971], Princeton), `hopf` (Heinz Hopf, [1894, 1971], Berlin et Zurich), `alexandrov` (Pavel Alexandrov, [1896, 1982], Moscou), `urysohn` (Pavel Urysohn, [1898, 1924], Moscou), `hurewicz` (Witold Hurewicz, [1904, 1956], Vienne, Amsterdam et Princeton), `whitney` (Hassler Whitney, [1907, 1989], Harvard et Princeton), `steenrod` (Norman Steenrod, [1910, 1971], Princeton) · résultats : `analysis-situs` (Analysis situs, 1895, texte), `conjecture-de-poincare` (Conjecture de Poincaré, 1904, conjecture), `theoreme-du-point-fixe-de-brouwer` (Théorème du point fixe de Brouwer, 1911, theoreme, `brouwer`), `invariance-de-la-dimension` (Invariance de la dimension et du domaine, 1911, theoreme, `brouwer`), `espaces-topologiques-de-hausdorff` (Espaces topologiques (axiomes de voisinage), 1914, concept), `lemme-d-urysohn` (Lemme d’Urysohn, 1925, theoreme), `formule-des-points-fixes-de-lefschetz` (Formule des points fixes de Lefschetz, 1926, theoreme), `polynome-d-alexander` (Polynôme d’Alexander, 1928, concept), `fibration-de-hopf` (Fibration de Hopf, 1931, theoreme), `groupes-d-homotopie` (Groupes d’homotopie supérieurs, 1935, concept), `theoreme-de-plongement-de-whitney` (Théorème de plongement de Whitney, 1936, theoreme), `axiomes-d-eilenberg-steenrod` (Axiomes d’Eilenberg–Steenrod, 1945, texte, `eilenberg`), `classes-caracteristiques` (Classes de Stiefel–Whitney et de Chern, 1935 approx, concept) · related : `brouwer`, `eilenberg`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (Riemann, Möbius, fait), `geometries-non-euclidiennes` → filiation (Riemann, Klein, Poincaré, fait), `theorie-des-ensembles` → filiation (Hausdorff, fait), `algebre-moderne` → influence (Noether et les groupes d’homologie, fait).
 
-**`geometrie-algebrique-classique`** — Géométrie algébrique : de l’école italienne à Weil · structures · { start: 1890, end: 1955 } · ['formes', 'nombres'] · ['Rome', 'Bologne', 'Baltimore', 'Cambridge', 'Chicago', 'São Paulo'] · map { x: 5600, y: 1550, size: 2, palette: { fill: '#cbddec', stroke: '#254c6a', accent: '#2c76af' } } · préfixe `gac-` · figures : `castelnuovo` (Guido Castelnuovo, [1865, 1952], Rome), `enriques` (Federigo Enriques, [1871, 1946], Bologne et Rome), `severi` (Francesco Severi, [1879, 1961], Padoue et Rome), `zariski` (Oscar Zariski, [1899, 1986], Rome, Baltimore et Harvard), `hodge` (William Hodge, [1903, 1975], Cambridge), `weil` (André Weil, [1906, 1998], Paris, São Paulo, Chicago et Princeton) · résultats : `critere-de-rationalite-de-castelnuovo` (Critère de rationalité de Castelnuovo, 1894, theoreme), `classification-des-surfaces-algebriques` (Classification d’Enriques des surfaces algébriques, 1914, theoreme), `theoreme-de-lefschetz-sur-les-sections-hyperplanes` (Théorème de Lefschetz sur les sections hyperplanes, 1924, theoreme, `lefschetz`), `algebraic-surfaces` (Algebraic Surfaces : la mise à l’épreuve de l’école italienne, 1935, texte), `theorie-de-hodge` (Théorie de Hodge, 1941, concept), `hypothese-de-riemann-pour-les-courbes` (Hypothèse de Riemann pour les courbes sur un corps fini, 1948, theoreme), `foundations-of-algebraic-geometry` (Foundations of Algebraic Geometry, 1946, texte), `conjectures-de-weil` (Conjectures de Weil, 1949, conjecture), `conjecture-de-hodge` (Conjecture de Hodge, 1950, conjecture), `topologie-de-zariski` (Topologie de Zariski, 1944 approx, concept) · related : `lefschetz`, `van-der-waerden`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (fait), `algebre-moderne` → influence (Zariski, van der Waerden, fait), `topologie` → influence (Lefschetz, Hodge, fait), `theorie-des-nombres-xxe` → affinité (interprétation).
+**`geometrie-algebrique-classique`** — Géométrie algébrique : de l’école italienne à Weil · structures · { start: 1890, end: 1955 } · ['formes', 'nombres'] · ['Rome', 'Bologne', 'Baltimore', 'Cambridge', 'Chicago', 'São Paulo'] · map { x: 5600, y: 1550, size: 2, palette: { fill: '#cde2ee', stroke: '#29536b', accent: '#28668a' } } · préfixe `gac-` · figures : `castelnuovo` (Guido Castelnuovo, [1865, 1952], Rome), `enriques` (Federigo Enriques, [1871, 1946], Bologne et Rome), `severi` (Francesco Severi, [1879, 1961], Padoue et Rome), `zariski` (Oscar Zariski, [1899, 1986], Rome, Baltimore et Harvard), `hodge` (William Hodge, [1903, 1975], Cambridge), `weil` (André Weil, [1906, 1998], Paris, São Paulo, Chicago et Princeton) · résultats : `critere-de-rationalite-de-castelnuovo` (Critère de rationalité de Castelnuovo, 1894, theoreme), `classification-des-surfaces-algebriques` (Classification d’Enriques des surfaces algébriques, 1914, theoreme), `theoreme-de-lefschetz-sur-les-sections-hyperplanes` (Théorème de Lefschetz sur les sections hyperplanes, 1924, theoreme, `lefschetz`), `algebraic-surfaces` (Algebraic Surfaces : la mise à l’épreuve de l’école italienne, 1935, texte), `theorie-de-hodge` (Théorie de Hodge, 1941, concept), `hypothese-de-riemann-pour-les-courbes` (Hypothèse de Riemann pour les courbes sur un corps fini, 1948, theoreme), `foundations-of-algebraic-geometry` (Foundations of Algebraic Geometry, 1946, texte), `conjectures-de-weil` (Conjectures de Weil, 1949, conjecture), `conjecture-de-hodge` (Conjecture de Hodge, 1950, conjecture), `topologie-de-zariski` (Topologie de Zariski, 1944 approx, concept) · related : `lefschetz`, `van-der-waerden`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (fait), `algebre-moderne` → influence (Zariski, van der Waerden, fait), `topologie` → influence (Lefschetz, Hodge, fait), `theorie-des-nombres-xxe` → affinité (interprétation).
 
-**`analyse-fonctionnelle`** — Analyse fonctionnelle et théorie de la mesure · structures · { start: 1900, end: 1955 } · ['analyse'] · ['Paris', 'Stockholm', 'Göttingen', 'Budapest', 'Lwów', 'Princeton'] · map { x: 4950, y: 2200, size: 3, palette: { fill: '#d7cfed', stroke: '#3b266d', accent: '#532db4' } } · préfixe `af-` · figures : `fredholm` (Ivar Fredholm, [1866, 1927], Stockholm), `lebesgue` (Henri Lebesgue, [1875, 1941], Nancy, Rennes et Paris), `frechet` (Maurice Fréchet, [1878, 1973], Paris et Strasbourg), `riesz-frigyes` (Frigyes Riesz, [1880, 1956], Kolozsvár, Szeged et Budapest), `banach` (Stefan Banach, [1892, 1945], Lwów), `steinhaus` (Hugo Steinhaus, [1887, 1972], Lwów et Wrocław), `von-neumann` (John von Neumann, [1903, 1957], Budapest, Berlin et Princeton), `schwartz` (Laurent Schwartz, [1915, 2002], Paris, Nancy) · résultats : `mesure-de-borel` (Mesure des ensembles boréliens, 1898, concept, `borel`), `integrale-de-lebesgue` (Intégrale de Lebesgue, 1902, concept), `equations-integrales-de-fredholm` (Alternative de Fredholm, 1903, theoreme), `lecons-sur-l-integration` (Leçons sur l’intégration et la recherche des fonctions primitives, 1904, texte), `espaces-metriques` (Espaces métriques, 1906, concept), `theoreme-de-representation-de-riesz` (Théorème de représentation de Riesz, 1909, theoreme), `theoreme-de-riesz-fischer` (Théorème de Riesz–Fischer, 1907, theoreme), `espaces-de-hilbert-abstraits` (Axiomatisation des espaces de Hilbert, 1929, concept), `theoreme-de-hahn-banach` (Théorème de Hahn–Banach, 1927, theoreme), `theoreme-de-banach-steinhaus` (Théorème de Banach–Steinhaus, 1927, theoreme), `theorie-des-operations-lineaires` (Théorie des opérations linéaires, 1932, texte), `mathematische-grundlagen-der-quantenmechanik` (Mathematische Grundlagen der Quantenmechanik, 1932, texte), `theorie-des-distributions` (Théorie des distributions, 1950, texte) · related : `borel`, `hilbert` · liens : `analyse-rigoureuse` → filiation (fait), `physique-mathematique-xixe` → filiation (équations intégrales, fait), `theorie-des-ensembles` → influence (mesure, fait), `probabilites-modernes` → affinité (interprétation).
+**`analyse-fonctionnelle`** — Analyse fonctionnelle et théorie de la mesure · structures · { start: 1900, end: 1955 } · ['analyse'] · ['Paris', 'Stockholm', 'Göttingen', 'Budapest', 'Lwów', 'Princeton'] · map { x: 4950, y: 2200, size: 3, palette: { fill: '#decdee', stroke: '#4a296b', accent: '#59288a' } } · préfixe `af-` · figures : `fredholm` (Ivar Fredholm, [1866, 1927], Stockholm), `lebesgue` (Henri Lebesgue, [1875, 1941], Nancy, Rennes et Paris), `frechet` (Maurice Fréchet, [1878, 1973], Paris et Strasbourg), `riesz-frigyes` (Frigyes Riesz, [1880, 1956], Kolozsvár, Szeged et Budapest), `banach` (Stefan Banach, [1892, 1945], Lwów), `steinhaus` (Hugo Steinhaus, [1887, 1972], Lwów et Wrocław), `von-neumann` (John von Neumann, [1903, 1957], Budapest, Berlin et Princeton), `schwartz` (Laurent Schwartz, [1915, 2002], Paris, Nancy) · résultats : `mesure-de-borel` (Mesure des ensembles boréliens, 1898, concept, `borel`), `integrale-de-lebesgue` (Intégrale de Lebesgue, 1902, concept), `equations-integrales-de-fredholm` (Alternative de Fredholm, 1903, theoreme), `lecons-sur-l-integration` (Leçons sur l’intégration et la recherche des fonctions primitives, 1904, texte), `espaces-metriques` (Espaces métriques, 1906, concept), `theoreme-de-representation-de-riesz` (Théorème de représentation de Riesz, 1909, theoreme), `theoreme-de-riesz-fischer` (Théorème de Riesz–Fischer, 1907, theoreme), `espaces-de-hilbert-abstraits` (Axiomatisation des espaces de Hilbert, 1929, concept), `theoreme-de-hahn-banach` (Théorème de Hahn–Banach, 1927, theoreme), `theoreme-de-banach-steinhaus` (Théorème de Banach–Steinhaus, 1927, theoreme), `theorie-des-operations-lineaires` (Théorie des opérations linéaires, 1932, texte), `mathematische-grundlagen-der-quantenmechanik` (Mathematische Grundlagen der Quantenmechanik, 1932, texte), `theorie-des-distributions` (Théorie des distributions, 1950, texte) · related : `borel`, `hilbert` · liens : `analyse-rigoureuse` → filiation (fait), `physique-mathematique-xixe` → filiation (équations intégrales, fait), `theorie-des-ensembles` → influence (mesure, fait), `probabilites-modernes` → affinité (interprétation).
 
-**`edp-et-physique-mathematique`** — Équations aux dérivées partielles et physique mathématique du XXᵉ siècle · structures · { start: 1900, end: 1960 } · ['analyse'] · ['Paris', 'Padoue', 'Göttingen', 'Zurich', 'Moscou', 'New York'] · map { x: 5600, y: 2450, size: 2, palette: { fill: '#e0d6f0', stroke: '#462975', accent: '#652fbc' } } · préfixe `edp-` · figures : `hadamard` (Jacques Hadamard, [1865, 1963], Paris), `levi-civita` (Tullio Levi-Civita, [1873, 1941], Padoue et Rome), `weyl` (Hermann Weyl, [1885, 1955], Göttingen, Zurich et Princeton), `courant` (Richard Courant, [1888, 1972], Göttingen et New York), `schauder` (Juliusz Schauder, [1899, 1943], Lwów), `douglas` (Jesse Douglas, [1897, 1965], New York), `leray` (Jean Leray, [1906, 1998], Nancy et Paris), `sobolev` (Sergueï Sobolev, [1908, 1989], Leningrad, Moscou et Novossibirsk) · résultats : `calcul-differentiel-absolu` (Méthodes de calcul différentiel absolu, 1900, texte), `problemes-bien-poses` (Problèmes bien posés au sens d’Hadamard, 1902, concept), `loi-de-weyl` (Loi de Weyl sur les valeurs propres, 1911, theoreme), `theoreme-de-noether` (Théorème de Noether : symétries et lois de conservation, 1918, theoreme, `noether`), `raum-zeit-materie` (Raum, Zeit, Materie, 1918, texte), `methoden-der-mathematischen-physik` (Methoden der mathematischen Physik, 1924, texte), `theoreme-du-point-fixe-de-schauder` (Théorème du point fixe de Schauder, 1930, theoreme), `probleme-de-plateau` (Solution du problème de Plateau, 1931, theoreme), `solutions-faibles-de-navier-stokes` (Solutions faibles des équations de Navier–Stokes, 1934, theoreme), `espaces-de-sobolev` (Espaces de Sobolev, 1938, concept), `methode-des-elements-finis-courant` (Variational methods for the solution of problems of equilibrium and vibrations, 1943, methode), `theorie-des-faisceaux` (Faisceaux et suite spectrale, 1946, concept) · related : `noether`, `hilbert`, `poincare` · liens : `physique-mathematique-xixe` → filiation (fait), `analyse-fonctionnelle` → filiation (fait), `geometries-non-euclidiennes` → influence (Riemann → relativité, fait), `topologie` → influence (Leray, Schauder, fait).
+**`edp-et-physique-mathematique`** — Équations aux dérivées partielles et physique mathématique du XXᵉ siècle · structures · { start: 1900, end: 1960 } · ['analyse'] · ['Paris', 'Padoue', 'Göttingen', 'Zurich', 'Moscou', 'New York'] · map { x: 5600, y: 2450, size: 2, palette: { fill: '#ddd1f0', stroke: '#442a6f', accent: '#50298e' } } · préfixe `edp-` · figures : `hadamard` (Jacques Hadamard, [1865, 1963], Paris), `levi-civita` (Tullio Levi-Civita, [1873, 1941], Padoue et Rome), `weyl` (Hermann Weyl, [1885, 1955], Göttingen, Zurich et Princeton), `courant` (Richard Courant, [1888, 1972], Göttingen et New York), `schauder` (Juliusz Schauder, [1899, 1943], Lwów), `douglas` (Jesse Douglas, [1897, 1965], New York), `leray` (Jean Leray, [1906, 1998], Nancy et Paris), `sobolev` (Sergueï Sobolev, [1908, 1989], Leningrad, Moscou et Novossibirsk) · résultats : `calcul-differentiel-absolu` (Méthodes de calcul différentiel absolu, 1900, texte), `problemes-bien-poses` (Problèmes bien posés au sens d’Hadamard, 1902, concept), `loi-de-weyl` (Loi de Weyl sur les valeurs propres, 1911, theoreme), `theoreme-de-noether` (Théorème de Noether : symétries et lois de conservation, 1918, theoreme, `noether`), `raum-zeit-materie` (Raum, Zeit, Materie, 1918, texte), `methoden-der-mathematischen-physik` (Methoden der mathematischen Physik, 1924, texte), `theoreme-du-point-fixe-de-schauder` (Théorème du point fixe de Schauder, 1930, theoreme), `probleme-de-plateau` (Solution du problème de Plateau, 1931, theoreme), `solutions-faibles-de-navier-stokes` (Solutions faibles des équations de Navier–Stokes, 1934, theoreme), `espaces-de-sobolev` (Espaces de Sobolev, 1938, concept), `methode-des-elements-finis-courant` (Variational methods for the solution of problems of equilibrium and vibrations, 1943, methode), `theorie-des-faisceaux` (Faisceaux et suite spectrale, 1946, concept) · related : `noether`, `hilbert`, `poincare` · liens : `physique-mathematique-xixe` → filiation (fait), `analyse-fonctionnelle` → filiation (fait), `geometries-non-euclidiennes` → influence (Riemann → relativité, fait), `topologie` → influence (Leray, Schauder, fait).
 
 ### Fichier `structures-b.ts` — ère `structures` (1900 → 1960), hasard et fondements
 
-**`probabilites-modernes`** — Probabilités axiomatisées : de Borel à Kolmogorov · structures · { start: 1900, end: 1955 } · ['hasard'] · ['Paris', 'Saint-Pétersbourg', 'Moscou', 'Cambridge (Mass.)', 'Princeton', 'Tokyo'] · map { x: 4950, y: 3100, size: 3, palette: { fill: '#f3e4dd', stroke: '#7d452c', accent: '#c45f31' } } · préfixe `pmo-` · figures : `bachelier` (Louis Bachelier, [1870, 1946], Paris et Besançon), `borel` (Émile Borel, [1871, 1956], Paris), `markov` (Andreï Markov, [1856, 1922], Saint-Pétersbourg), `levy` (Paul Lévy, [1886, 1971], Paris), `wiener` (Norbert Wiener, [1894, 1964], Cambridge (Mass.)), `khintchine` (Alexandre Khintchine, [1894, 1959], Moscou), `kolmogorov` (Andreï Kolmogorov, [1903, 1987], Moscou), `feller` (William Feller, [1906, 1970], Zagreb, Stockholm et Princeton), `doob` (Joseph Doob, [1910, 2004], Urbana), `ito` (Kiyosi Itô, [1915, 2008], Tokyo et Kyoto) · résultats : `theorie-de-la-speculation` (Théorie de la spéculation, 1900, texte), `chaines-de-markov` (Chaînes de Markov, 1906, concept), `loi-forte-des-grands-nombres` (Loi forte des grands nombres, 1909, theoreme), `processus-de-wiener` (Construction mathématique du mouvement brownien, 1923, theoreme), `loi-du-logarithme-itere` (Loi du logarithme itéré, 1924, theoreme), `lois-stables` (Lois stables et calcul des probabilités, 1925, concept), `grundbegriffe-der-wahrscheinlichkeitsrechnung` (Grundbegriffe der Wahrscheinlichkeitsrechnung : les axiomes, 1933, texte), `theoreme-d-extension-de-kolmogorov` (Théorème d’extension de Kolmogorov, 1933, theoreme), `martingales` (Martingales, 1940, concept), `calcul-stochastique-d-ito` (Intégrale et formule d’Itô, 1944, concept), `an-introduction-to-probability-theory` (An Introduction to Probability Theory and Its Applications, 1950, texte), `theoreme-de-donsker` (Principe d’invariance de Donsker, 1951, theoreme, authorName « Monroe Donsker ») · related : `lebesgue`, `frechet`, `chebyshev` · liens : `statistique-xixe` → filiation (Tchebychev → Markov, fait), `analyse-fonctionnelle` → filiation (mesure de Lebesgue, fait), `probabilites-classiques` → filiation (Laplace, interprétation), `physique-mathematique-xixe` → influence (brownien, Einstein, fait).
+**`probabilites-modernes`** — Probabilités axiomatisées : de Borel à Kolmogorov · structures · { start: 1900, end: 1955 } · ['hasard'] · ['Paris', 'Saint-Pétersbourg', 'Moscou', 'Cambridge (Mass.)', 'Princeton', 'Tokyo'] · map { x: 4950, y: 3100, size: 3, palette: { fill: '#f0dad1', stroke: '#6f3f2a', accent: '#8e4829' } } · préfixe `pmo-` · figures : `bachelier` (Louis Bachelier, [1870, 1946], Paris et Besançon), `borel` (Émile Borel, [1871, 1956], Paris), `markov` (Andreï Markov, [1856, 1922], Saint-Pétersbourg), `levy` (Paul Lévy, [1886, 1971], Paris), `wiener` (Norbert Wiener, [1894, 1964], Cambridge (Mass.)), `khintchine` (Alexandre Khintchine, [1894, 1959], Moscou), `kolmogorov` (Andreï Kolmogorov, [1903, 1987], Moscou), `feller` (William Feller, [1906, 1970], Zagreb, Stockholm et Princeton), `doob` (Joseph Doob, [1910, 2004], Urbana), `ito` (Kiyosi Itô, [1915, 2008], Tokyo et Kyoto) · résultats : `theorie-de-la-speculation` (Théorie de la spéculation, 1900, texte), `chaines-de-markov` (Chaînes de Markov, 1906, concept), `loi-forte-des-grands-nombres` (Loi forte des grands nombres, 1909, theoreme), `processus-de-wiener` (Construction mathématique du mouvement brownien, 1923, theoreme), `loi-du-logarithme-itere` (Loi du logarithme itéré, 1924, theoreme), `lois-stables` (Lois stables et calcul des probabilités, 1925, concept), `grundbegriffe-der-wahrscheinlichkeitsrechnung` (Grundbegriffe der Wahrscheinlichkeitsrechnung : les axiomes, 1933, texte), `theoreme-d-extension-de-kolmogorov` (Théorème d’extension de Kolmogorov, 1933, theoreme), `martingales` (Martingales, 1940, concept), `calcul-stochastique-d-ito` (Intégrale et formule d’Itô, 1944, concept), `an-introduction-to-probability-theory` (An Introduction to Probability Theory and Its Applications, 1950, texte), `theoreme-de-donsker` (Principe d’invariance de Donsker, 1951, theoreme, authorName « Monroe Donsker ») · related : `lebesgue`, `frechet`, `chebyshev` · liens : `statistique-xixe` → filiation (Tchebychev → Markov, fait), `analyse-fonctionnelle` → filiation (mesure de Lebesgue, fait), `probabilites-classiques` → filiation (Laplace, interprétation), `physique-mathematique-xixe` → influence (brownien, Einstein, fait).
 
-**`statistique-mathematique`** — Statistique mathématique, décision et jeux · structures · { start: 1908, end: 1960 } · ['hasard'] · ['Dublin', 'Rothamsted', 'Londres', 'Berkeley', 'New York', 'Princeton', 'Leningrad'] · map { x: 5600, y: 3350, size: 2, palette: { fill: '#f1ddda', stroke: '#79362a', accent: '#c04630' } } · préfixe `sm-` · figures : `gosset` (William Sealy Gosset, dit « Student », [1876, 1937], Dublin), `fisher` (Ronald Fisher, [1890, 1962], Rothamsted, Londres et Cambridge), `neyman` (Jerzy Neyman, [1894, 1981], Varsovie, Londres et Berkeley), `pearson-egon` (Egon Pearson, [1895, 1980], Londres), `wald` (Abraham Wald, [1902, 1950], Vienne et New York), `cramer` (Harald Cramér, [1893, 1985], Stockholm), `rao` (C. R. Rao, [1920, 2023], Calcutta et State College), `morgenstern` (Oskar Morgenstern, [1902, 1977], Vienne et Princeton), `dantzig` (George Dantzig, [1914, 2005], Washington, Berkeley et Stanford), `kantorovich` (Leonid Kantorovitch, [1912, 1986], Leningrad), `nash` (John Nash, [1928, 2015], Princeton) · résultats : `the-probable-error-of-a-mean` (The Probable Error of a Mean : la loi de Student, 1908, texte), `maximum-de-vraisemblance` (Maximum de vraisemblance, 1922, methode), `statistical-methods-for-research-workers` (Statistical Methods for Research Workers, 1925, texte), `theoreme-du-minimax` (Théorème du minimax, 1928, theoreme, `von-neumann`), `lemme-de-neyman-pearson` (Lemme de Neyman–Pearson, 1933, theoreme), `the-design-of-experiments` (The Design of Experiments, 1935, texte), `intervalles-de-confiance` (Intervalles de confiance, 1937, concept), `methodes-mathematiques-en-organisation-de-la-production` (Méthodes mathématiques d’organisation et de planification de la production, 1939, texte), `theory-of-games-and-economic-behavior` (Theory of Games and Economic Behavior, 1944, texte), `borne-de-cramer-rao` (Borne de Cramér–Rao, 1945, theoreme), `analyse-sequentielle` (Sequential Analysis, 1947, texte), `algorithme-du-simplexe` (Algorithme du simplexe, 1947, methode), `equilibre-de-nash` (Équilibre de Nash, 1950, theoreme), `statistical-decision-functions` (Statistical Decision Functions, 1950, texte) · related : `von-neumann`, `pearson-karl`, `borel` · liens : `statistique-xixe` → filiation (Pearson → Fisher, fait), `probabilites-modernes` → filiation (fait), `analyse-fonctionnelle` → influence (von Neumann, fait).
+**`statistique-mathematique`** — Statistique mathématique, décision et jeux · structures · { start: 1908, end: 1960 } · ['hasard'] · ['Dublin', 'Rothamsted', 'Londres', 'Berkeley', 'New York', 'Princeton', 'Leningrad'] · map { x: 5600, y: 3350, size: 2, palette: { fill: '#f1dbd5', stroke: '#733b2b', accent: '#92412a' } } · préfixe `sm-` · figures : `gosset` (William Sealy Gosset, dit « Student », [1876, 1937], Dublin), `fisher` (Ronald Fisher, [1890, 1962], Rothamsted, Londres et Cambridge), `neyman` (Jerzy Neyman, [1894, 1981], Varsovie, Londres et Berkeley), `pearson-egon` (Egon Pearson, [1895, 1980], Londres), `wald` (Abraham Wald, [1902, 1950], Vienne et New York), `cramer` (Harald Cramér, [1893, 1985], Stockholm), `rao` (C. R. Rao, [1920, 2023], Calcutta et State College), `morgenstern` (Oskar Morgenstern, [1902, 1977], Vienne et Princeton), `dantzig` (George Dantzig, [1914, 2005], Washington, Berkeley et Stanford), `kantorovich` (Leonid Kantorovitch, [1912, 1986], Leningrad), `nash` (John Nash, [1928, 2015], Princeton) · résultats : `the-probable-error-of-a-mean` (The Probable Error of a Mean : la loi de Student, 1908, texte), `maximum-de-vraisemblance` (Maximum de vraisemblance, 1922, methode), `statistical-methods-for-research-workers` (Statistical Methods for Research Workers, 1925, texte), `theoreme-du-minimax` (Théorème du minimax, 1928, theoreme, `von-neumann`), `lemme-de-neyman-pearson` (Lemme de Neyman–Pearson, 1933, theoreme), `the-design-of-experiments` (The Design of Experiments, 1935, texte), `intervalles-de-confiance` (Intervalles de confiance, 1937, concept), `methodes-mathematiques-en-organisation-de-la-production` (Méthodes mathématiques d’organisation et de planification de la production, 1939, texte), `theory-of-games-and-economic-behavior` (Theory of Games and Economic Behavior, 1944, texte), `borne-de-cramer-rao` (Borne de Cramér–Rao, 1945, theoreme), `analyse-sequentielle` (Sequential Analysis, 1947, texte), `algorithme-du-simplexe` (Algorithme du simplexe, 1947, methode), `equilibre-de-nash` (Équilibre de Nash, 1950, theoreme), `statistical-decision-functions` (Statistical Decision Functions, 1950, texte) · related : `von-neumann`, `pearson-karl`, `borel` · liens : `statistique-xixe` → filiation (Pearson → Fisher, fait), `probabilites-modernes` → filiation (fait), `analyse-fonctionnelle` → influence (von Neumann, fait).
 
-**`calculabilite`** — Logique et calculabilité : Gödel, Church, Turing · structures · { start: 1928, end: 1956 } · ['fondements', 'hasard'] · ['Vienne', 'Princeton', 'Cambridge', 'Göttingen', 'New York', 'Murray Hill'] · map { x: 5350, y: 3900, size: 3, palette: { fill: '#c3e9d3', stroke: '#22623d', accent: '#2aa75e' } } · préfixe `cal-` · figures : `post` (Emil Post, [1897, 1954], New York), `herbrand` (Jacques Herbrand, [1908, 1931], Paris), `godel` (Kurt Gödel, [1906, 1978], Vienne et Princeton), `church` (Alonzo Church, [1903, 1995], Princeton), `kleene` (Stephen Kleene, [1909, 1994], Princeton et Madison), `turing` (Alan Turing, [1912, 1954], Cambridge, Princeton, Bletchley Park et Manchester), `shannon` (Claude Shannon, [1916, 2001], Ann Arbor, MIT et Murray Hill) · résultats : `entscheidungsproblem` (Entscheidungsproblem, 1928, probleme, `hilbert`), `theoreme-de-completude` (Théorème de complétude de Gödel, 1930, theoreme), `theoreme-de-herbrand` (Théorème de Herbrand, 1930, theoreme), `theoremes-d-incompletude` (Über formal unentscheidbare Sätze : les théorèmes d’incomplétude, 1931, theoreme), `lambda-calcul` (Lambda-calcul, 1932, concept), `fonctions-recursives-generales` (Fonctions récursives générales, 1934, concept), `these-de-church` (Thèse de Church–Turing, 1936, concept), `on-computable-numbers` (On Computable Numbers, with an Application to the Entscheidungsproblem, 1936, texte), `probleme-de-l-arret` (Indécidabilité du problème de l’arrêt, 1936, theoreme), `machine-de-turing-universelle` (Machine universelle, 1936, concept), `a-symbolic-analysis-of-relay-and-switching-circuits` (A Symbolic Analysis of Relay and Switching Circuits, 1938, texte), `first-draft-of-a-report-on-the-edvac` (First Draft of a Report on the EDVAC, 1945, texte, `von-neumann`), `a-mathematical-theory-of-communication` (A Mathematical Theory of Communication, 1948, texte), `hierarchie-arithmetique` (Hiérarchie arithmétique de Kleene–Mostowski, 1943, concept) · related : `hilbert`, `von-neumann`, `ackermann` · liens : `fondements-hilbert-brouwer` → filiation (le programme de Hilbert et sa réfutation, fait), `logique-mathematique-xixe` → filiation (Frege, Peano, Boole, fait), `theorie-des-ensembles` → influence (diagonale de Cantor, fait).
+**`calculabilite`** — Logique et calculabilité : Gödel, Church, Turing · structures · { start: 1928, end: 1956 } · ['fondements', 'hasard'] · ['Vienne', 'Princeton', 'Cambridge', 'Göttingen', 'New York', 'Murray Hill'] · map { x: 5350, y: 3900, size: 3, palette: { fill: '#c6ecd2', stroke: '#266439', accent: '#268243' } } · préfixe `cal-` · figures : `post` (Emil Post, [1897, 1954], New York), `herbrand` (Jacques Herbrand, [1908, 1931], Paris), `godel` (Kurt Gödel, [1906, 1978], Vienne et Princeton), `church` (Alonzo Church, [1903, 1995], Princeton), `kleene` (Stephen Kleene, [1909, 1994], Princeton et Madison), `turing` (Alan Turing, [1912, 1954], Cambridge, Princeton, Bletchley Park et Manchester), `shannon` (Claude Shannon, [1916, 2001], Ann Arbor, MIT et Murray Hill) · résultats : `entscheidungsproblem` (Entscheidungsproblem, 1928, probleme, `hilbert`), `theoreme-de-completude` (Théorème de complétude de Gödel, 1930, theoreme), `theoreme-de-herbrand` (Théorème de Herbrand, 1930, theoreme), `theoremes-d-incompletude` (Über formal unentscheidbare Sätze : les théorèmes d’incomplétude, 1931, theoreme), `lambda-calcul` (Lambda-calcul, 1932, concept), `fonctions-recursives-generales` (Fonctions récursives générales, 1934, concept), `these-de-church` (Thèse de Church–Turing, 1936, concept), `on-computable-numbers` (On Computable Numbers, with an Application to the Entscheidungsproblem, 1936, texte), `probleme-de-l-arret` (Indécidabilité du problème de l’arrêt, 1936, theoreme), `machine-de-turing-universelle` (Machine universelle, 1936, concept), `a-symbolic-analysis-of-relay-and-switching-circuits` (A Symbolic Analysis of Relay and Switching Circuits, 1938, texte), `first-draft-of-a-report-on-the-edvac` (First Draft of a Report on the EDVAC, 1945, texte, `von-neumann`), `a-mathematical-theory-of-communication` (A Mathematical Theory of Communication, 1948, texte), `hierarchie-arithmetique` (Hiérarchie arithmétique de Kleene–Mostowski, 1943, concept) · related : `hilbert`, `von-neumann`, `ackermann` · liens : `fondements-hilbert-brouwer` → filiation (le programme de Hilbert et sa réfutation, fait), `logique-mathematique-xixe` → filiation (Frege, Peano, Boole, fait), `theorie-des-ensembles` → influence (diagonale de Cantor, fait).
 
-**`fondements-hilbert-brouwer`** — Programme de Hilbert, logicisme et intuitionnisme · structures · { start: 1899, end: 1940 } · ['fondements'] · ['Göttingen', 'Cambridge', 'Amsterdam', 'Varsovie', 'Oslo'] · map { x: 4850, y: 4100, size: 2, palette: { fill: '#cfedd9', stroke: '#266d3f', accent: '#2db45c' } } · préfixe `fhb-` · figures : `hilbert` (David Hilbert, [1862, 1943], Königsberg et Göttingen), `whitehead` (Alfred North Whitehead, [1861, 1947], Cambridge, Londres et Harvard), `russell` (Bertrand Russell, [1872, 1970], Cambridge), `brouwer` (L. E. J. Brouwer, [1881, 1966], Amsterdam et Blaricum), `lowenheim` (Leopold Löwenheim, [1878, 1957], Berlin), `skolem` (Thoralf Skolem, [1887, 1963], Oslo), `fraenkel` (Abraham Fraenkel, [1891, 1965], Marbourg, Kiel et Jérusalem), `bernays` (Paul Bernays, [1888, 1977], Göttingen et Zurich), `ackermann` (Wilhelm Ackermann, [1896, 1962], Göttingen et Lüdenscheid), `tarski` (Alfred Tarski, [1901, 1983], Varsovie et Berkeley), `gentzen` (Gerhard Gentzen, [1909, 1945], Göttingen et Prague) · résultats : `grundlagen-der-geometrie` (Grundlagen der Geometrie, 1899, texte), `problemes-de-hilbert` (Les 23 problèmes de Hilbert, 1900, probleme), `the-principles-of-mathematics` (The Principles of Mathematics, 1903, texte), `these-de-brouwer` (Over de grondslagen der wiskunde : l’intuitionnisme, 1907, texte), `rejet-du-tiers-exclu` (De onbetrouwbaarheid der logische principes : le tiers exclu récusé, 1908, concept), `principia-mathematica` (Principia Mathematica, 1910, texte), `theoreme-de-lowenheim-skolem` (Théorème de Löwenheim–Skolem, 1915, theoreme), `das-kontinuum` (Das Kontinuum, 1918, texte, `weyl`), `axiomes-de-zermelo-fraenkel` (Axiome de remplacement et système ZF, 1922, concept), `paradoxe-de-skolem` (Paradoxe de Skolem, 1922, probleme), `paradoxe-de-banach-tarski` (Paradoxe de Banach–Tarski, 1924, theoreme, `banach`), `ueber-das-unendliche` (Über das Unendliche : le programme de Hilbert, 1925, texte), `fonction-d-ackermann` (Fonction d’Ackermann, 1928, concept), `le-concept-de-verite` (Le concept de vérité dans les langages formalisés, 1933, texte), `grundlagen-der-mathematik` (Grundlagen der Mathematik, 1934, texte), `consistance-de-l-arithmetique` (Consistance de l’arithmétique par induction transfinie, 1936, theoreme) · related : `weyl`, `banach`, `zermelo`, `poincare`, `kronecker`, `godel` · liens : `theorie-des-ensembles` → filiation (fait), `logique-mathematique-xixe` → filiation (Frege → Russell, fait), `geometries-non-euclidiennes` → filiation (axiomatique de Pasch, Hilbert, fait), `logique-antique` → affinité (interprétation).
+**`fondements-hilbert-brouwer`** — Programme de Hilbert, logicisme et intuitionnisme · structures · { start: 1899, end: 1940 } · ['fondements'] · ['Göttingen', 'Cambridge', 'Amsterdam', 'Varsovie', 'Oslo'] · map { x: 4850, y: 4100, size: 2, palette: { fill: '#cdeed6', stroke: '#296b3a', accent: '#288a42' } } · préfixe `fhb-` · figures : `hilbert` (David Hilbert, [1862, 1943], Königsberg et Göttingen), `whitehead` (Alfred North Whitehead, [1861, 1947], Cambridge, Londres et Harvard), `russell` (Bertrand Russell, [1872, 1970], Cambridge), `brouwer` (L. E. J. Brouwer, [1881, 1966], Amsterdam et Blaricum), `lowenheim` (Leopold Löwenheim, [1878, 1957], Berlin), `skolem` (Thoralf Skolem, [1887, 1963], Oslo), `fraenkel` (Abraham Fraenkel, [1891, 1965], Marbourg, Kiel et Jérusalem), `bernays` (Paul Bernays, [1888, 1977], Göttingen et Zurich), `ackermann` (Wilhelm Ackermann, [1896, 1962], Göttingen et Lüdenscheid), `tarski` (Alfred Tarski, [1901, 1983], Varsovie et Berkeley), `gentzen` (Gerhard Gentzen, [1909, 1945], Göttingen et Prague) · résultats : `grundlagen-der-geometrie` (Grundlagen der Geometrie, 1899, texte), `problemes-de-hilbert` (Les 23 problèmes de Hilbert, 1900, probleme), `the-principles-of-mathematics` (The Principles of Mathematics, 1903, texte), `these-de-brouwer` (Over de grondslagen der wiskunde : l’intuitionnisme, 1907, texte), `rejet-du-tiers-exclu` (De onbetrouwbaarheid der logische principes : le tiers exclu récusé, 1908, concept), `principia-mathematica` (Principia Mathematica, 1910, texte), `theoreme-de-lowenheim-skolem` (Théorème de Löwenheim–Skolem, 1915, theoreme), `das-kontinuum` (Das Kontinuum, 1918, texte, `weyl`), `axiomes-de-zermelo-fraenkel` (Axiome de remplacement et système ZF, 1922, concept), `paradoxe-de-skolem` (Paradoxe de Skolem, 1922, probleme), `paradoxe-de-banach-tarski` (Paradoxe de Banach–Tarski, 1924, theoreme, `banach`), `ueber-das-unendliche` (Über das Unendliche : le programme de Hilbert, 1925, texte), `fonction-d-ackermann` (Fonction d’Ackermann, 1928, concept), `le-concept-de-verite` (Le concept de vérité dans les langages formalisés, 1933, texte), `grundlagen-der-mathematik` (Grundlagen der Mathematik, 1934, texte), `consistance-de-l-arithmetique` (Consistance de l’arithmétique par induction transfinie, 1936, theoreme) · related : `weyl`, `banach`, `zermelo`, `poincare`, `kronecker`, `godel` · liens : `theorie-des-ensembles` → filiation (fait), `logique-mathematique-xixe` → filiation (Frege → Russell, fait), `geometries-non-euclidiennes` → filiation (axiomatique de Pasch, Hilbert, fait), `logique-antique` → affinité (interprétation).
 
-**`bourbaki`** — Bourbaki et le structuralisme mathématique · structures · { start: 1934, end: 1970 } · ['fondements', 'nombres', 'formes'] · ['Paris', 'Nancy', 'Strasbourg', 'Chicago', 'Princeton'] · map { x: 5800, y: 4250, size: 2, palette: { fill: '#cbecd7', stroke: '#256a3f', accent: '#2caf5e' } } · préfixe `bb-` · figures : `delsarte` (Jean Delsarte, [1903, 1968], Nancy), `cartan-henri` (Henri Cartan, [1904, 2008], Strasbourg et Paris), `dieudonne` (Jean Dieudonné, [1906, 1992], Nancy, Chicago et Nice), `chevalley` (Claude Chevalley, [1909, 1984], Princeton, Columbia et Paris), `ehresmann` (Charles Ehresmann, [1905, 1979], Strasbourg et Paris), `eilenberg` (Samuel Eilenberg, [1913, 1998], Varsovie et Columbia), `mac-lane` (Saunders Mac Lane, [1909, 2005], Harvard et Chicago) · résultats : `congres-de-besse` (Congrès fondateur de Besse-en-Chandesse, 1935, texte), `elements-de-mathematique` (Éléments de mathématique : premier fascicule, 1939, texte), `general-theory-of-natural-equivalences` (General Theory of Natural Equivalences : les catégories, 1945, texte), `l-architecture-des-mathematiques` (L’architecture des mathématiques, 1948, texte, authorName « Nicolas Bourbaki »), `structures-meres` (Structures mères : ordre, algébrique, topologique, 1948, concept), `seminaire-bourbaki` (Séminaire Bourbaki, 1948, methode), `seminaire-cartan` (Séminaire Cartan, 1948, methode), `theoremes-a-et-b` (Théorèmes A et B de Cartan, 1951, theoreme), `groupes-de-chevalley` (Sur certains groupes simples : les groupes de Chevalley, 1955, theoreme), `theorie-des-ensembles-bourbaki` (Théorie des ensembles (Livre I), 1954, texte, authorName « Nicolas Bourbaki ») · related : `weil`, `schwartz`, `leray`, `serre`, `grothendieck` · liens : `algebre-moderne` → filiation (van der Waerden comme modèle, fait), `fondements-hilbert-brouwer` → filiation (axiomatique hilbertienne, fait), `topologie` → filiation, `analyse-fonctionnelle` → influence, `analyse-eulerienne` → reaction (contre le « cours Goursat », interprétation).
+**`bourbaki`** — Bourbaki et le structuralisme mathématique · structures · { start: 1934, end: 1970 } · ['fondements', 'nombres', 'formes'] · ['Paris', 'Nancy', 'Strasbourg', 'Chicago', 'Princeton'] · map { x: 5800, y: 4250, size: 2, palette: { fill: '#cdeed7', stroke: '#296b3c', accent: '#288a44' } } · préfixe `bb-` · figures : `delsarte` (Jean Delsarte, [1903, 1968], Nancy), `cartan-henri` (Henri Cartan, [1904, 2008], Strasbourg et Paris), `dieudonne` (Jean Dieudonné, [1906, 1992], Nancy, Chicago et Nice), `chevalley` (Claude Chevalley, [1909, 1984], Princeton, Columbia et Paris), `ehresmann` (Charles Ehresmann, [1905, 1979], Strasbourg et Paris), `eilenberg` (Samuel Eilenberg, [1913, 1998], Varsovie et Columbia), `mac-lane` (Saunders Mac Lane, [1909, 2005], Harvard et Chicago) · résultats : `congres-de-besse` (Congrès fondateur de Besse-en-Chandesse, 1935, texte), `elements-de-mathematique` (Éléments de mathématique : premier fascicule, 1939, texte), `general-theory-of-natural-equivalences` (General Theory of Natural Equivalences : les catégories, 1945, texte), `l-architecture-des-mathematiques` (L’architecture des mathématiques, 1948, texte, authorName « Nicolas Bourbaki »), `structures-meres` (Structures mères : ordre, algébrique, topologique, 1948, concept), `seminaire-bourbaki` (Séminaire Bourbaki, 1948, methode), `seminaire-cartan` (Séminaire Cartan, 1948, methode), `theoremes-a-et-b` (Théorèmes A et B de Cartan, 1951, theoreme), `groupes-de-chevalley` (Sur certains groupes simples : les groupes de Chevalley, 1955, theoreme), `theorie-des-ensembles-bourbaki` (Théorie des ensembles (Livre I), 1954, texte, authorName « Nicolas Bourbaki ») · related : `weil`, `schwartz`, `leray`, `serre`, `grothendieck` · liens : `algebre-moderne` → filiation (van der Waerden comme modèle, fait), `fondements-hilbert-brouwer` → filiation (axiomatique hilbertienne, fait), `topologie` → filiation, `analyse-fonctionnelle` → influence, `analyse-eulerienne` → reaction (contre le « cours Goursat », interprétation).
 
 ### Fichier `contemporain-a.ts` — ère `contemporain` (1960 → aujourd’hui), nombres, formes, analyse
 
 Les figures vivantes ont `years: [naissance, null]`. Les périodes des domaines sont ouvertes (`end: null`). Les résultats peuvent aller jusqu’à 2025.
 
-**`theorie-des-nombres-contemporaine`** — Théorie des nombres contemporaine : de Langlands à Wiles · contemporain · { start: 1955, end: null } · ['nombres'] · ['Princeton', 'Tokyo', 'Harvard', 'Bonn', 'Cambridge', 'Oxford', 'Durham (New Hampshire)'] · map { x: 6300, y: 430, size: 3, palette: { fill: '#e8dbc0', stroke: '#5e4b21', accent: '#a37c29' } } · préfixe `tnc-` · figures : `taniyama` (Yutaka Taniyama, [1927, 1958], Tokyo), `shimura` (Gorō Shimura, [1930, 2019], Tokyo et Princeton), `tate` (John Tate, [1925, 2019], Harvard et Austin), `iwasawa` (Kenkichi Iwasawa, [1917, 1998], Tokyo, MIT et Princeton), `baker` (Alan Baker, [1939, 2018], Cambridge), `langlands` (Robert Langlands, [1936, null], Princeton), `mazur` (Barry Mazur, [1937, null], Harvard), `faltings` (Gerd Faltings, [1954, null], Wuppertal, Princeton et Bonn), `wiles` (Andrew Wiles, [1953, null], Princeton et Oxford), `taylor-richard` (Richard Taylor, [1962, null], Oxford, Harvard et Stanford), `zhang-yitang` (Yitang Zhang, [1955, null], Durham (New Hampshire) et Santa Barbara), `bhargava` (Manjul Bhargava, [1974, null], Princeton) · résultats : `conjecture-de-modularite` (Conjecture de Taniyama–Shimura–Weil, 1955 approx, conjecture, `taniyama`), `theorie-d-iwasawa` (Théorie d’Iwasawa, 1959, concept), `conjecture-de-birch-et-swinnerton-dyer` (Conjecture de Birch et Swinnerton-Dyer, 1965, conjecture, authorName « Bryan Birch et Peter Swinnerton-Dyer », sans mathematicianId), `theoreme-de-baker` (Formes linéaires en logarithmes, 1966, theoreme), `lettre-de-langlands-a-weil` (Lettre à André Weil : le programme de Langlands, 1967, texte), `theoreme-de-mazur` (Théorème de Mazur sur la torsion des courbes elliptiques, 1977, theoreme), `theoreme-de-faltings` (Théorème de Faltings (conjecture de Mordell), 1983, theoreme), `demonstration-du-dernier-theoreme-de-fermat` (Modular elliptic curves and Fermat’s Last Theorem, 1995, theoreme, authorName « Andrew Wiles, avec Richard Taylor »), `theoreme-de-modularite` (Théorème de modularité complet, 2001, theoreme, authorName « Christophe Breuil, Brian Conrad, Fred Diamond et Richard Taylor », `taylor-richard`), `theoreme-de-green-tao` (Théorème de Green–Tao, 2004, theoreme, authorName « Ben Green et Terence Tao », `tao`), `lois-de-composition-superieures` (Lois de composition supérieures, 2004, theoreme, `bhargava`), `ecarts-bornes-entre-nombres-premiers` (Écarts bornés entre nombres premiers consécutifs, 2013, theoreme) · related : `tao`, `deligne`, `serre`, `weil`, `selberg` · liens : `theorie-des-nombres-xxe` → filiation (fait), `theorie-des-nombres-fermat` → filiation (Wiles, fait), `geometrie-algebrique-moderne` → influence (Grothendieck, Deligne, fait), `arithmetique-gaussienne` → filiation (Riemann, Dirichlet, fait).
+**`theorie-des-nombres-contemporaine`** — Théorie des nombres contemporaine : de Langlands à Wiles · contemporain · { start: 1955, end: null } · ['nombres'] · ['Princeton', 'Tokyo', 'Harvard', 'Bonn', 'Cambridge', 'Oxford', 'Durham (New Hampshire)'] · map { x: 6300, y: 430, size: 3, palette: { fill: '#ede1c9', stroke: '#685227', accent: '#866727' } } · préfixe `tnc-` · figures : `taniyama` (Yutaka Taniyama, [1927, 1958], Tokyo), `shimura` (Gorō Shimura, [1930, 2019], Tokyo et Princeton), `tate` (John Tate, [1925, 2019], Harvard et Austin), `iwasawa` (Kenkichi Iwasawa, [1917, 1998], Tokyo, MIT et Princeton), `baker` (Alan Baker, [1939, 2018], Cambridge), `langlands` (Robert Langlands, [1936, null], Princeton), `mazur` (Barry Mazur, [1937, null], Harvard), `faltings` (Gerd Faltings, [1954, null], Wuppertal, Princeton et Bonn), `wiles` (Andrew Wiles, [1953, null], Princeton et Oxford), `taylor-richard` (Richard Taylor, [1962, null], Oxford, Harvard et Stanford), `zhang-yitang` (Yitang Zhang, [1955, null], Durham (New Hampshire) et Santa Barbara), `bhargava` (Manjul Bhargava, [1974, null], Princeton) · résultats : `conjecture-de-modularite` (Conjecture de Taniyama–Shimura–Weil, 1955 approx, conjecture, `taniyama`), `theorie-d-iwasawa` (Théorie d’Iwasawa, 1959, concept), `conjecture-de-birch-et-swinnerton-dyer` (Conjecture de Birch et Swinnerton-Dyer, 1965, conjecture, authorName « Bryan Birch et Peter Swinnerton-Dyer », sans mathematicianId), `theoreme-de-baker` (Formes linéaires en logarithmes, 1966, theoreme), `lettre-de-langlands-a-weil` (Lettre à André Weil : le programme de Langlands, 1967, texte), `theoreme-de-mazur` (Théorème de Mazur sur la torsion des courbes elliptiques, 1977, theoreme), `theoreme-de-faltings` (Théorème de Faltings (conjecture de Mordell), 1983, theoreme), `demonstration-du-dernier-theoreme-de-fermat` (Modular elliptic curves and Fermat’s Last Theorem, 1995, theoreme, authorName « Andrew Wiles, avec Richard Taylor »), `theoreme-de-modularite` (Théorème de modularité complet, 2001, theoreme, authorName « Christophe Breuil, Brian Conrad, Fred Diamond et Richard Taylor », `taylor-richard`), `theoreme-de-green-tao` (Théorème de Green–Tao, 2004, theoreme, authorName « Ben Green et Terence Tao », `tao`), `lois-de-composition-superieures` (Lois de composition supérieures, 2004, theoreme, `bhargava`), `ecarts-bornes-entre-nombres-premiers` (Écarts bornés entre nombres premiers consécutifs, 2013, theoreme) · related : `tao`, `deligne`, `serre`, `weil`, `selberg` · liens : `theorie-des-nombres-xxe` → filiation (fait), `theorie-des-nombres-fermat` → filiation (Wiles, fait), `geometrie-algebrique-moderne` → influence (Grothendieck, Deligne, fait), `arithmetique-gaussienne` → filiation (Riemann, Dirichlet, fait).
 
-**`algebre-contemporaine`** — Algèbre contemporaine : groupes finis simples, représentations et groupes quantiques · contemporain · { start: 1955, end: null } · ['nombres', 'formes'] · ['Chicago', 'Cambridge', 'New Brunswick', 'Princeton', 'Moscou', 'Bonn', 'Pasadena'] · map { x: 7000, y: 560, size: 2, palette: { fill: '#f0e6d6', stroke: '#755829', accent: '#bc862f' } } · préfixe `alc-` · figures : `feit` (Walter Feit, [1930, 2004], Yale), `thompson-john` (John G. Thompson, [1932, null], Chicago, Cambridge et Gainesville), `gorenstein` (Daniel Gorenstein, [1923, 1992], New Brunswick), `tits` (Jacques Tits, [1930, 2021], Bruxelles, Bonn et Paris), `conway` (John Horton Conway, [1937, 2020], Cambridge et Princeton), `aschbacher` (Michael Aschbacher, [1944, null], Pasadena), `kac` (Victor Kac, [1943, null], Moscou et MIT), `lusztig` (George Lusztig, [1946, null], MIT), `drinfeld` (Vladimir Drinfeld, [1954, null], Kharkiv et Chicago), `borcherds` (Richard Borcherds, [1959, null], Cambridge et Berkeley), `zelmanov` (Efim Zelmanov, [1955, null], Novossibirsk et San Diego) · résultats : `theoreme-de-feit-thompson` (Théorème de Feit–Thompson : tout groupe fini d’ordre impair est résoluble, 1963, theoreme, authorName « Walter Feit et John G. Thompson », `thompson-john`), `immeubles-de-tits` (Immeubles de Tits, 1965 approx, concept), `groupes-de-conway` (Groupes de Conway et réseau de Leech, 1968, theoreme), `algebres-de-kac-moody` (Algèbres de Kac–Moody, 1968, concept, authorName « Victor Kac ; Robert Moody »), `programme-de-gorenstein` (Programme de classification des groupes finis simples, 1972, probleme), `monstrous-moonshine` (Monstrous Moonshine, 1979, conjecture, authorName « John Conway et Simon Norton », `conway`), `polynomes-de-kazhdan-lusztig` (Polynômes de Kazhdan–Lusztig, 1979, concept, authorName « David Kazhdan et George Lusztig », `lusztig`), `construction-du-monstre` (Construction du groupe Monstre, 1982, theoreme, authorName « Robert Griess », sans mathematicianId), `classification-des-groupes-finis-simples` (Classification des groupes finis simples : l’annonce, 1983, theoreme, `gorenstein`), `groupes-quantiques` (Groupes quantiques, 1985, concept, authorName « Vladimir Drinfeld ; Michio Jimbo », `drinfeld`), `probleme-restreint-de-burnside` (Problème restreint de Burnside, 1991, theoreme), `demonstration-du-moonshine` (Démonstration de Monstrous Moonshine, 1992, theoreme, `borcherds`), `groupes-quasi-minces` (Classification des groupes quasi-minces : la classification achevée, 2004, theoreme, authorName « Michael Aschbacher et Stephen Smith », `aschbacher`) · related : `chevalley`, `serre`, `langlands`, `witten` · liens : `algebre-moderne` → filiation (fait), `algebre-des-groupes` → filiation (Galois, Jordan, Sylow, Burnside, fait), `bourbaki` → filiation (Chevalley, Tits, fait), `theorie-des-nombres-contemporaine` → affinité (Langlands, interprétation), `topologie-et-geometrie-contemporaines` → influence (Witten, moonshine et physique, interprétation).
+**`algebre-contemporaine`** — Algèbre contemporaine : groupes finis simples, représentations et groupes quantiques · contemporain · { start: 1955, end: null } · ['nombres', 'formes'] · ['Chicago', 'Cambridge', 'New Brunswick', 'Princeton', 'Moscou', 'Bonn', 'Pasadena'] · map { x: 7000, y: 560, size: 2, palette: { fill: '#f1ead5', stroke: '#73612b', accent: '#92782a' } } · préfixe `alc-` · figures : `feit` (Walter Feit, [1930, 2004], Yale), `thompson-john` (John G. Thompson, [1932, null], Chicago, Cambridge et Gainesville), `gorenstein` (Daniel Gorenstein, [1923, 1992], New Brunswick), `tits` (Jacques Tits, [1930, 2021], Bruxelles, Bonn et Paris), `conway` (John Horton Conway, [1937, 2020], Cambridge et Princeton), `aschbacher` (Michael Aschbacher, [1944, null], Pasadena), `kac` (Victor Kac, [1943, null], Moscou et MIT), `lusztig` (George Lusztig, [1946, null], MIT), `drinfeld` (Vladimir Drinfeld, [1954, null], Kharkiv et Chicago), `borcherds` (Richard Borcherds, [1959, null], Cambridge et Berkeley), `zelmanov` (Efim Zelmanov, [1955, null], Novossibirsk et San Diego) · résultats : `theoreme-de-feit-thompson` (Théorème de Feit–Thompson : tout groupe fini d’ordre impair est résoluble, 1963, theoreme, authorName « Walter Feit et John G. Thompson », `thompson-john`), `immeubles-de-tits` (Immeubles de Tits, 1965 approx, concept), `groupes-de-conway` (Groupes de Conway et réseau de Leech, 1968, theoreme), `algebres-de-kac-moody` (Algèbres de Kac–Moody, 1968, concept, authorName « Victor Kac ; Robert Moody »), `programme-de-gorenstein` (Programme de classification des groupes finis simples, 1972, probleme), `monstrous-moonshine` (Monstrous Moonshine, 1979, conjecture, authorName « John Conway et Simon Norton », `conway`), `polynomes-de-kazhdan-lusztig` (Polynômes de Kazhdan–Lusztig, 1979, concept, authorName « David Kazhdan et George Lusztig », `lusztig`), `construction-du-monstre` (Construction du groupe Monstre, 1982, theoreme, authorName « Robert Griess », sans mathematicianId), `classification-des-groupes-finis-simples` (Classification des groupes finis simples : l’annonce, 1983, theoreme, `gorenstein`), `groupes-quantiques` (Groupes quantiques, 1985, concept, authorName « Vladimir Drinfeld ; Michio Jimbo », `drinfeld`), `probleme-restreint-de-burnside` (Problème restreint de Burnside, 1991, theoreme), `demonstration-du-moonshine` (Démonstration de Monstrous Moonshine, 1992, theoreme, `borcherds`), `groupes-quasi-minces` (Classification des groupes quasi-minces : la classification achevée, 2004, theoreme, authorName « Michael Aschbacher et Stephen Smith », `aschbacher`) · related : `chevalley`, `serre`, `langlands`, `witten` · liens : `algebre-moderne` → filiation (fait), `algebre-des-groupes` → filiation (Galois, Jordan, Sylow, Burnside, fait), `bourbaki` → filiation (Chevalley, Tits, fait), `theorie-des-nombres-contemporaine` → affinité (Langlands, interprétation), `topologie-et-geometrie-contemporaines` → influence (Witten, moonshine et physique, interprétation).
 
-**`geometrie-algebrique-moderne`** — Géométrie algébrique moderne : schémas, cohomologie et motifs · contemporain · { start: 1955, end: null } · ['formes', 'nombres'] · ['Paris', 'Bures-sur-Yvette', 'Princeton', 'Harvard', 'Kyoto', 'Bonn'] · map { x: 6300, y: 1300, size: 3, palette: { fill: '#dae9f1', stroke: '#2a5c79', accent: '#308bc0' } } · préfixe `gam-` · figures : `serre` (Jean-Pierre Serre, [1926, null], Paris), `grothendieck` (Alexandre Grothendieck, [1928, 2014], Paris, Bures-sur-Yvette et Montpellier), `hironaka` (Heisuke Hironaka, [1931, null], Kyoto et Harvard), `mumford` (David Mumford, [1937, null], Harvard et Brown), `deligne` (Pierre Deligne, [1944, null], Bures-sur-Yvette et Princeton), `mori` (Shigefumi Mori, [1951, null], Kyoto), `kontsevich` (Maxim Kontsevich, [1964, null], Bures-sur-Yvette), `voevodsky` (Vladimir Voevodsky, [1966, 2017], Princeton) · résultats : `faisceaux-algebriques-coherents` (Faisceaux algébriques cohérents (FAC), 1955, texte), `gaga` (Géométrie algébrique et géométrie analytique (GAGA), 1956, theoreme), `tohoku` (Sur quelques points d’algèbre homologique (« Tôhoku »), 1957, texte), `theoreme-de-riemann-roch-grothendieck` (Théorème de Grothendieck–Riemann–Roch, 1957, theoreme), `schemas` (Schémas, 1960, concept), `elements-de-geometrie-algebrique` (Éléments de géométrie algébrique (EGA), 1960, texte, authorName « Alexandre Grothendieck, avec Jean Dieudonné »), `cohomologie-etale` (Topologies de Grothendieck et cohomologie étale, 1963, concept), `resolution-des-singularites` (Résolution des singularités en caractéristique zéro, 1964, theoreme), `motifs` (Motifs, 1964 approx, concept), `geometric-invariant-theory` (Geometric Invariant Theory, 1965, texte), `demonstration-des-conjectures-de-weil` (La conjecture de Weil I, 1974, theoreme), `programme-du-modele-minimal` (Programme du modèle minimal en dimension 3, 1988, theoreme), `symetrie-miroir-homologique` (Symétrie miroir homologique, 1994, conjecture), `conjecture-de-milnor-demontree` (Conjecture de Milnor sur la K-théorie, 1996, theoreme) · related : `weil`, `zariski`, `cartan-henri`, `dieudonne`, `hodge` · liens : `geometrie-algebrique-classique` → filiation (fait), `bourbaki` → filiation (Cartan, Dieudonné, Serre, Grothendieck, fait), `topologie` → influence (faisceaux de Leray, cohomologie, fait), `theorie-des-nombres-xxe` → influence (conjectures de Weil, fait).
+**`geometrie-algebrique-moderne`** — Géométrie algébrique moderne : schémas, cohomologie et motifs · contemporain · { start: 1955, end: null } · ['formes', 'nombres'] · ['Paris', 'Bures-sur-Yvette', 'Princeton', 'Harvard', 'Kyoto', 'Bonn'] · map { x: 6300, y: 1300, size: 3, palette: { fill: '#cdddee', stroke: '#29486b', accent: '#28568a' } } · préfixe `gam-` · figures : `serre` (Jean-Pierre Serre, [1926, null], Paris), `grothendieck` (Alexandre Grothendieck, [1928, 2014], Paris, Bures-sur-Yvette et Montpellier), `hironaka` (Heisuke Hironaka, [1931, null], Kyoto et Harvard), `mumford` (David Mumford, [1937, null], Harvard et Brown), `deligne` (Pierre Deligne, [1944, null], Bures-sur-Yvette et Princeton), `mori` (Shigefumi Mori, [1951, null], Kyoto), `kontsevich` (Maxim Kontsevich, [1964, null], Bures-sur-Yvette), `voevodsky` (Vladimir Voevodsky, [1966, 2017], Princeton) · résultats : `faisceaux-algebriques-coherents` (Faisceaux algébriques cohérents (FAC), 1955, texte), `gaga` (Géométrie algébrique et géométrie analytique (GAGA), 1956, theoreme), `tohoku` (Sur quelques points d’algèbre homologique (« Tôhoku »), 1957, texte), `theoreme-de-riemann-roch-grothendieck` (Théorème de Grothendieck–Riemann–Roch, 1957, theoreme), `schemas` (Schémas, 1960, concept), `elements-de-geometrie-algebrique` (Éléments de géométrie algébrique (EGA), 1960, texte, authorName « Alexandre Grothendieck, avec Jean Dieudonné »), `cohomologie-etale` (Topologies de Grothendieck et cohomologie étale, 1963, concept), `resolution-des-singularites` (Résolution des singularités en caractéristique zéro, 1964, theoreme), `motifs` (Motifs, 1964 approx, concept), `geometric-invariant-theory` (Geometric Invariant Theory, 1965, texte), `demonstration-des-conjectures-de-weil` (La conjecture de Weil I, 1974, theoreme), `programme-du-modele-minimal` (Programme du modèle minimal en dimension 3, 1988, theoreme), `symetrie-miroir-homologique` (Symétrie miroir homologique, 1994, conjecture), `conjecture-de-milnor-demontree` (Conjecture de Milnor sur la K-théorie, 1996, theoreme) · related : `weil`, `zariski`, `cartan-henri`, `dieudonne`, `hodge` · liens : `geometrie-algebrique-classique` → filiation (fait), `bourbaki` → filiation (Cartan, Dieudonné, Serre, Grothendieck, fait), `topologie` → influence (faisceaux de Leray, cohomologie, fait), `theorie-des-nombres-xxe` → influence (conjectures de Weil, fait).
 
-**`topologie-et-geometrie-contemporaines`** — Topologie et géométrie contemporaines : variétés, nœuds et flots · contemporain · { start: 1956, end: null } · ['formes'] · ['Princeton', 'Berkeley', 'Oxford', 'Bures-sur-Yvette', 'Saint-Pétersbourg', 'Stony Brook', 'Stanford'] · map { x: 7000, y: 1500, size: 3, palette: { fill: '#c0d6e8', stroke: '#21445e', accent: '#296ea3' } } · préfixe `tgc-` · figures : `thom` (René Thom, [1923, 2002], Strasbourg et Bures-sur-Yvette), `milnor` (John Milnor, [1931, null], Princeton et Stony Brook), `smale` (Stephen Smale, [1930, null], Berkeley), `atiyah` (Michael Atiyah, [1929, 2019], Oxford, Princeton et Édimbourg), `singer` (Isadore Singer, [1924, 2021], MIT), `thurston` (William Thurston, [1946, 2012], Princeton, Berkeley et Cornell), `freedman` (Michael Freedman, [1951, null], San Diego et Santa Barbara), `jones` (Vaughan Jones, [1952, 2020], Berkeley et Nashville), `donaldson` (Simon Donaldson, [1957, null], Oxford et Londres), `witten` (Edward Witten, [1951, null], Princeton), `hamilton-richard` (Richard Hamilton, [1943, 2024], Cornell et Columbia), `perelman` (Grigori Perelman, [1966, null], Saint-Pétersbourg), `mirzakhani` (Maryam Mirzakhani, [1977, 2017], Téhéran, Harvard et Stanford) · résultats : `cobordisme` (Théorie du cobordisme, 1954, theoreme), `spheres-exotiques` (Sphères exotiques de dimension 7, 1956, theoreme), `theoreme-du-h-cobordisme` (Théorème du h-cobordisme : la conjecture de Poincaré en dimension ≥ 5, 1961, theoreme), `theoreme-de-l-indice` (Théorème de l’indice d’Atiyah–Singer, 1963, theoreme, authorName « Michael Atiyah et Isadore Singer », `atiyah`), `stabilite-structurelle-et-morphogenese` (Stabilité structurelle et morphogenèse, 1972, texte), `conjecture-de-geometrisation` (Conjecture de géométrisation, 1982, conjecture), `flot-de-ricci` (Flot de Ricci, 1982, concept), `conjecture-de-poincare-en-dimension-4` (Conjecture de Poincaré topologique en dimension 4, 1982, theoreme), `theoreme-de-donaldson` (Théorème de Donaldson sur les formes d’intersection, 1983, theoreme), `polynome-de-jones` (Polynôme de Jones, 1984, concept), `quantum-field-theory-and-the-jones-polynomial` (Quantum Field Theory and the Jones Polynomial, 1989, texte), `demonstration-de-la-conjecture-de-poincare` (Démonstration des conjectures de Poincaré et de géométrisation, 2003, theoreme), `volumes-de-weil-petersson` (Croissance des géodésiques simples et volumes de Weil–Petersson, 2008, theoreme) · related : `poincare`, `whitney`, `hopf`, `grothendieck`, `kontsevich` · liens : `topologie` → filiation (fait), `geometries-non-euclidiennes` → filiation (Thurston et la géométrie hyperbolique, fait), `edp-et-physique-mathematique` → influence (théories de jauge, flot de Ricci, fait), `geometrie-algebrique-moderne` → affinité (interprétation).
+**`topologie-et-geometrie-contemporaines`** — Topologie et géométrie contemporaines : variétés, nœuds et flots · contemporain · { start: 1956, end: null } · ['formes'] · ['Princeton', 'Berkeley', 'Oxford', 'Bures-sur-Yvette', 'Saint-Pétersbourg', 'Stony Brook', 'Stanford'] · map { x: 7000, y: 1500, size: 3, palette: { fill: '#c6daec', stroke: '#264764', accent: '#265782' } } · préfixe `tgc-` · figures : `thom` (René Thom, [1923, 2002], Strasbourg et Bures-sur-Yvette), `milnor` (John Milnor, [1931, null], Princeton et Stony Brook), `smale` (Stephen Smale, [1930, null], Berkeley), `atiyah` (Michael Atiyah, [1929, 2019], Oxford, Princeton et Édimbourg), `singer` (Isadore Singer, [1924, 2021], MIT), `thurston` (William Thurston, [1946, 2012], Princeton, Berkeley et Cornell), `freedman` (Michael Freedman, [1951, null], San Diego et Santa Barbara), `jones` (Vaughan Jones, [1952, 2020], Berkeley et Nashville), `donaldson` (Simon Donaldson, [1957, null], Oxford et Londres), `witten` (Edward Witten, [1951, null], Princeton), `hamilton-richard` (Richard Hamilton, [1943, 2024], Cornell et Columbia), `perelman` (Grigori Perelman, [1966, null], Saint-Pétersbourg), `mirzakhani` (Maryam Mirzakhani, [1977, 2017], Téhéran, Harvard et Stanford) · résultats : `cobordisme` (Théorie du cobordisme, 1954, theoreme), `spheres-exotiques` (Sphères exotiques de dimension 7, 1956, theoreme), `theoreme-du-h-cobordisme` (Théorème du h-cobordisme : la conjecture de Poincaré en dimension ≥ 5, 1961, theoreme), `theoreme-de-l-indice` (Théorème de l’indice d’Atiyah–Singer, 1963, theoreme, authorName « Michael Atiyah et Isadore Singer », `atiyah`), `stabilite-structurelle-et-morphogenese` (Stabilité structurelle et morphogenèse, 1972, texte), `conjecture-de-geometrisation` (Conjecture de géométrisation, 1982, conjecture), `flot-de-ricci` (Flot de Ricci, 1982, concept), `conjecture-de-poincare-en-dimension-4` (Conjecture de Poincaré topologique en dimension 4, 1982, theoreme), `theoreme-de-donaldson` (Théorème de Donaldson sur les formes d’intersection, 1983, theoreme), `polynome-de-jones` (Polynôme de Jones, 1984, concept), `quantum-field-theory-and-the-jones-polynomial` (Quantum Field Theory and the Jones Polynomial, 1989, texte), `demonstration-de-la-conjecture-de-poincare` (Démonstration des conjectures de Poincaré et de géométrisation, 2003, theoreme), `volumes-de-weil-petersson` (Croissance des géodésiques simples et volumes de Weil–Petersson, 2008, theoreme) · related : `poincare`, `whitney`, `hopf`, `grothendieck`, `kontsevich` · liens : `topologie` → filiation (fait), `geometries-non-euclidiennes` → filiation (Thurston et la géométrie hyperbolique, fait), `edp-et-physique-mathematique` → influence (théories de jauge, flot de Ricci, fait), `geometrie-algebrique-moderne` → affinité (interprétation).
 
-**`systemes-dynamiques-et-chaos`** — Systèmes dynamiques, chaos et fractales · contemporain · { start: 1954, end: null } · ['analyse', 'hasard'] · ['Moscou', 'MIT', 'Berkeley', 'Bures-sur-Yvette', 'Los Alamos', 'Orsay'] · map { x: 6250, y: 2200, size: 2, palette: { fill: '#ccc0e8', stroke: '#35215e', accent: '#5029a3' } } · préfixe `sdc-` · figures : `lorenz` (Edward Lorenz, [1917, 2008], MIT), `moser` (Jürgen Moser, [1928, 1999], New York et Zurich), `arnold` (Vladimir Arnold, [1937, 2010], Moscou et Paris), `sinai` (Yakov Sinaï, [1935, null], Moscou et Princeton), `ruelle` (David Ruelle, [1935, null], Bures-sur-Yvette), `mandelbrot` (Benoît Mandelbrot, [1924, 2010], Paris, Yorktown Heights et New Haven), `feigenbaum` (Mitchell Feigenbaum, [1944, 2019], Los Alamos et New York), `douady` (Adrien Douady, [1935, 2006], Paris et Orsay), `hubbard` (John Hubbard, [1945, null], Ithaca et Marseille), `yoccoz` (Jean-Christophe Yoccoz, [1957, 2016], Orsay et Paris) · résultats : `theoreme-kam` (Théorème KAM, 1954, theoreme, authorName « Andreï Kolmogorov, Vladimir Arnold et Jürgen Moser », `arnold`), `entropie-de-kolmogorov-sinai` (Entropie de Kolmogorov–Sinaï, 1959, concept), `fer-a-cheval-de-smale` (Fer à cheval de Smale, 1960 approx, concept, `smale`), `deterministic-nonperiodic-flow` (Deterministic Nonperiodic Flow : l’attracteur de Lorenz, 1963, texte), `diffusion-d-arnold` (Diffusion d’Arnold, 1964, concept), `on-the-nature-of-turbulence` (On the Nature of Turbulence : les attracteurs étranges, 1971, texte, authorName « David Ruelle et Floris Takens », `ruelle`), `period-three-implies-chaos` (Period Three Implies Chaos, 1975, theoreme, authorName « Tien-Yien Li et James Yorke », sans mathematicianId), `les-objets-fractals` (Les Objets fractals : forme, hasard et dimension, 1975, texte), `universalite-de-feigenbaum` (Universalité de Feigenbaum, 1978, theoreme), `ensemble-de-mandelbrot` (Ensemble de Mandelbrot, 1980, concept), `connexite-de-l-ensemble-de-mandelbrot` (Connexité de l’ensemble de Mandelbrot, 1982, theoreme, authorName « Adrien Douady et John Hubbard », `douady`), `condition-de-bruno-yoccoz` (Optimalité de la condition de Bruno pour la linéarisation, 1988 approx, theoreme) · related : `smale`, `kolmogorov`, `poincare`, `thom` · liens : `physique-mathematique-xixe` → filiation (Poincaré et le problème des trois corps, fait), `probabilites-modernes` → influence (Kolmogorov, théorie ergodique, fait), `topologie-et-geometrie-contemporaines` → influence (Smale, Thom, fait), `edp-et-physique-mathematique` → affinité (turbulence, interprétation).
+**`systemes-dynamiques-et-chaos`** — Systèmes dynamiques, chaos et fractales · contemporain · { start: 1954, end: null } · ['analyse', 'hasard'] · ['Moscou', 'MIT', 'Berkeley', 'Bures-sur-Yvette', 'Los Alamos', 'Orsay'] · map { x: 6250, y: 2200, size: 2, palette: { fill: '#d9c6ec', stroke: '#452664', accent: '#542682' } } · préfixe `sdc-` · figures : `lorenz` (Edward Lorenz, [1917, 2008], MIT), `moser` (Jürgen Moser, [1928, 1999], New York et Zurich), `arnold` (Vladimir Arnold, [1937, 2010], Moscou et Paris), `sinai` (Yakov Sinaï, [1935, null], Moscou et Princeton), `ruelle` (David Ruelle, [1935, null], Bures-sur-Yvette), `mandelbrot` (Benoît Mandelbrot, [1924, 2010], Paris, Yorktown Heights et New Haven), `feigenbaum` (Mitchell Feigenbaum, [1944, 2019], Los Alamos et New York), `douady` (Adrien Douady, [1935, 2006], Paris et Orsay), `hubbard` (John Hubbard, [1945, null], Ithaca et Marseille), `yoccoz` (Jean-Christophe Yoccoz, [1957, 2016], Orsay et Paris) · résultats : `theoreme-kam` (Théorème KAM, 1954, theoreme, authorName « Andreï Kolmogorov, Vladimir Arnold et Jürgen Moser », `arnold`), `entropie-de-kolmogorov-sinai` (Entropie de Kolmogorov–Sinaï, 1959, concept), `fer-a-cheval-de-smale` (Fer à cheval de Smale, 1960 approx, concept, `smale`), `deterministic-nonperiodic-flow` (Deterministic Nonperiodic Flow : l’attracteur de Lorenz, 1963, texte), `diffusion-d-arnold` (Diffusion d’Arnold, 1964, concept), `on-the-nature-of-turbulence` (On the Nature of Turbulence : les attracteurs étranges, 1971, texte, authorName « David Ruelle et Floris Takens », `ruelle`), `period-three-implies-chaos` (Period Three Implies Chaos, 1975, theoreme, authorName « Tien-Yien Li et James Yorke », sans mathematicianId), `les-objets-fractals` (Les Objets fractals : forme, hasard et dimension, 1975, texte), `universalite-de-feigenbaum` (Universalité de Feigenbaum, 1978, theoreme), `ensemble-de-mandelbrot` (Ensemble de Mandelbrot, 1980, concept), `connexite-de-l-ensemble-de-mandelbrot` (Connexité de l’ensemble de Mandelbrot, 1982, theoreme, authorName « Adrien Douady et John Hubbard », `douady`), `condition-de-bruno-yoccoz` (Optimalité de la condition de Bruno pour la linéarisation, 1988 approx, theoreme) · related : `smale`, `kolmogorov`, `poincare`, `thom` · liens : `physique-mathematique-xixe` → filiation (Poincaré et le problème des trois corps, fait), `probabilites-modernes` → influence (Kolmogorov, théorie ergodique, fait), `topologie-et-geometrie-contemporaines` → influence (Smale, Thom, fait), `edp-et-physique-mathematique` → affinité (turbulence, interprétation).
 
-**`analyse-contemporaine`** — Analyse contemporaine : EDP, analyse harmonique et transport optimal · contemporain · { start: 1957, end: null } · ['analyse'] · ['Princeton', 'Chicago', 'Lund', 'New York', 'Pise', 'Paris', 'Los Angeles'] · map { x: 6950, y: 2350, size: 2, palette: { fill: '#e5ddf3', stroke: '#472c7d', accent: '#6231c4' } } · préfixe `anc-` · figures : `calderon` (Alberto Calderón, [1920, 1998], Buenos Aires et Chicago), `nirenberg` (Louis Nirenberg, [1925, 2020], New York), `de-giorgi` (Ennio De Giorgi, [1928, 1996], Pise), `hormander` (Lars Hörmander, [1931, 2012], Lund et Princeton), `stein` (Elias Stein, [1931, 2018], Princeton), `fefferman` (Charles Fefferman, [1949, null], Princeton), `bourgain` (Jean Bourgain, [1954, 2018], Bruxelles, Bures-sur-Yvette et Princeton), `lions-pierre-louis` (Pierre-Louis Lions, [1956, null], Paris), `villani` (Cédric Villani, [1973, null], Lyon et Paris), `tao` (Terence Tao, [1975, null], Los Angeles) · résultats : `operateurs-de-calderon-zygmund` (Opérateurs de Calderón–Zygmund, 1952, concept, authorName « Alberto Calderón et Antoni Zygmund », `calderon`), `theoreme-de-plongement-de-nash` (Théorème de plongement isométrique de Nash, 1956, theoreme, `nash`), `regularite-de-de-giorgi-nash` (Régularité des solutions d’équations elliptiques (De Giorgi–Nash), 1957, theoreme, authorName « Ennio De Giorgi et John Nash », `de-giorgi`), `inegalites-de-gagliardo-nirenberg` (Inégalités de Gagliardo–Nirenberg, 1959, theoreme), `operateurs-pseudo-differentiels` (Opérateurs pseudo-différentiels, 1965, concept, authorName « Joseph Kohn, Louis Nirenberg et Lars Hörmander », `hormander`), `singular-integrals-stein` (Singular Integrals and Differentiability Properties of Functions, 1970, texte), `dualite-h1-bmo` (Dualité H¹–BMO, 1972, theoreme ; article des Acta Mathematica de Fefferman et Stein), `the-analysis-of-linear-partial-differential-operators` (The Analysis of Linear Partial Differential Operators, 1983, texte), `solutions-de-viscosite` (Solutions de viscosité des équations de Hamilton–Jacobi, 1983, concept, authorName « Michael Crandall et Pierre-Louis Lions », `lions-pierre-louis`), `methode-de-bourgain-nls` (Espaces de restriction et équations de Schrödinger non linéaires périodiques, 1993, methode), `probleme-de-la-regularite-de-navier-stokes` (Régularité des équations de Navier–Stokes : un problème du millénaire, 2000, probleme, authorName « Clay Mathematics Institute », sans mathematicianId), `transport-optimal-et-courbure-de-ricci` (Transport optimal et courbure de Ricci synthétique, 2006, theoreme, authorName « John Lott et Cédric Villani ; Karl-Theodor Sturm », `villani`), `amortissement-landau` (Amortissement Landau non linéaire, 2009, theoreme, authorName « Clément Mouhot et Cédric Villani », `villani`) · related : `nash`, `leray`, `sobolev`, `schwartz`, `courant` · liens : `edp-et-physique-mathematique` → filiation (fait), `analyse-fonctionnelle` → filiation (distributions, espaces de Sobolev, fait), `physique-mathematique-xixe` → influence (Fourier, fait), `probabilites-et-statistique-contemporaines` → affinité (interprétation).
+**`analyse-contemporaine`** — Analyse contemporaine : EDP, analyse harmonique et transport optimal · contemporain · { start: 1957, end: null } · ['analyse'] · ['Princeton', 'Chicago', 'Lund', 'New York', 'Pise', 'Paris', 'Los Angeles'] · map { x: 6950, y: 2350, size: 2, palette: { fill: '#e0d5f1', stroke: '#472b73', accent: '#522a92' } } · préfixe `anc-` · figures : `calderon` (Alberto Calderón, [1920, 1998], Buenos Aires et Chicago), `nirenberg` (Louis Nirenberg, [1925, 2020], New York), `de-giorgi` (Ennio De Giorgi, [1928, 1996], Pise), `hormander` (Lars Hörmander, [1931, 2012], Lund et Princeton), `stein` (Elias Stein, [1931, 2018], Princeton), `fefferman` (Charles Fefferman, [1949, null], Princeton), `bourgain` (Jean Bourgain, [1954, 2018], Bruxelles, Bures-sur-Yvette et Princeton), `lions-pierre-louis` (Pierre-Louis Lions, [1956, null], Paris), `villani` (Cédric Villani, [1973, null], Lyon et Paris), `tao` (Terence Tao, [1975, null], Los Angeles) · résultats : `operateurs-de-calderon-zygmund` (Opérateurs de Calderón–Zygmund, 1952, concept, authorName « Alberto Calderón et Antoni Zygmund », `calderon`), `theoreme-de-plongement-de-nash` (Théorème de plongement isométrique de Nash, 1956, theoreme, `nash`), `regularite-de-de-giorgi-nash` (Régularité des solutions d’équations elliptiques (De Giorgi–Nash), 1957, theoreme, authorName « Ennio De Giorgi et John Nash », `de-giorgi`), `inegalites-de-gagliardo-nirenberg` (Inégalités de Gagliardo–Nirenberg, 1959, theoreme), `operateurs-pseudo-differentiels` (Opérateurs pseudo-différentiels, 1965, concept, authorName « Joseph Kohn, Louis Nirenberg et Lars Hörmander », `hormander`), `singular-integrals-stein` (Singular Integrals and Differentiability Properties of Functions, 1970, texte), `dualite-h1-bmo` (Dualité H¹–BMO, 1972, theoreme ; article des Acta Mathematica de Fefferman et Stein), `the-analysis-of-linear-partial-differential-operators` (The Analysis of Linear Partial Differential Operators, 1983, texte), `solutions-de-viscosite` (Solutions de viscosité des équations de Hamilton–Jacobi, 1983, concept, authorName « Michael Crandall et Pierre-Louis Lions », `lions-pierre-louis`), `methode-de-bourgain-nls` (Espaces de restriction et équations de Schrödinger non linéaires périodiques, 1993, methode), `probleme-de-la-regularite-de-navier-stokes` (Régularité des équations de Navier–Stokes : un problème du millénaire, 2000, probleme, authorName « Clay Mathematics Institute », sans mathematicianId), `transport-optimal-et-courbure-de-ricci` (Transport optimal et courbure de Ricci synthétique, 2006, theoreme, authorName « John Lott et Cédric Villani ; Karl-Theodor Sturm », `villani`), `amortissement-landau` (Amortissement Landau non linéaire, 2009, theoreme, authorName « Clément Mouhot et Cédric Villani », `villani`) · related : `nash`, `leray`, `sobolev`, `schwartz`, `courant` · liens : `edp-et-physique-mathematique` → filiation (fait), `analyse-fonctionnelle` → filiation (distributions, espaces de Sobolev, fait), `physique-mathematique-xixe` → influence (Fourier, fait), `probabilites-et-statistique-contemporaines` → affinité (interprétation).
 
 ### Fichier `contemporain-b.ts` — ère `contemporain` (1960 → aujourd’hui), hasard et fondements
 
-**`combinatoire`** — Combinatoire, graphes et méthode probabiliste · contemporain · { start: 1947, end: null } · ['hasard', 'nombres'] · ['Budapest', 'Toronto', 'Waterloo', 'Urbana', 'Princeton', 'Cambridge', 'MIT'] · map { x: 6250, y: 3000, size: 2, palette: { fill: '#eaccc7', stroke: '#662d24', accent: '#ab3c2b' } } · préfixe `comb-` · figures : `erdos` (Paul Erdős, [1913, 1996], Budapest et itinérant), `tutte` (William Tutte, [1917, 2002], Bletchley Park, Toronto et Waterloo), `renyi` (Alfréd Rényi, [1921, 1970], Budapest), `rota` (Gian-Carlo Rota, [1932, 1999], MIT), `haken` (Wolfgang Haken, [1928, 2022], Urbana), `appel` (Kenneth Appel, [1932, 2013], Urbana), `szemeredi` (Endre Szemerédi, [1940, null], Budapest et Piscataway), `stanley` (Richard Stanley, [1944, null], MIT), `lovasz` (László Lovász, [1948, null], Budapest), `seymour` (Paul Seymour, [1950, null], Princeton), `gowers` (Timothy Gowers, [1963, null], Cambridge) · résultats : `methode-probabiliste` (Méthode probabiliste : minoration des nombres de Ramsey, 1947, theoreme, `erdos`), `theoreme-de-tutte` (Théorème de Tutte sur les couplages parfaits, 1947, theoreme), `graphes-aleatoires-d-erdos-renyi` (Graphes aléatoires et seuils d’apparition, 1959, concept, authorName « Paul Erdős et Alfréd Rényi », `erdos`), `fondements-de-la-theorie-combinatoire` (On the Foundations of Combinatorial Theory I : les fonctions de Möbius, 1964, texte), `theoreme-de-szemeredi` (Théorème de Szemerédi, 1975, theoreme), `lemme-de-regularite` (Lemme de régularité de Szemerédi, 1976 approx, theoreme), `theoreme-des-quatre-couleurs` (Théorème des quatre couleurs, 1976, theoreme, authorName « Kenneth Appel et Wolfgang Haken », `appel`), `nombre-theta-de-lovasz` (Nombre thêta de Lovász, 1979, concept), `algorithme-lll` (Algorithme LLL de réduction de réseaux, 1982, methode, authorName « Arjen Lenstra, Hendrik Lenstra et László Lovász », `lovasz`), `enumerative-combinatorics` (Enumerative Combinatorics, 1986, texte), `normes-de-gowers` (Normes de Gowers et nouvelle démonstration du théorème de Szemerédi, 2001, theoreme), `theoreme-des-mineurs-de-graphes` (Théorème des mineurs de Robertson–Seymour, 2004, theoreme, authorName « Neil Robertson et Paul Seymour », `seymour`) · related : `tao`, `selberg`, `euler` · liens : `theorie-des-nombres-xxe` → filiation (Erdős, Hardy–Ramanujan, fait), `probabilites-modernes` → influence (méthode probabiliste, fait), `geometrie-des-lumieres` → filiation (Euler, les ponts de Königsberg, interprétation), `complexite-et-informatique-theorique` → affinité (interprétation).
+**`combinatoire`** — Combinatoire, graphes et méthode probabiliste · contemporain · { start: 1947, end: null } · ['hasard', 'nombres'] · ['Budapest', 'Toronto', 'Waterloo', 'Urbana', 'Princeton', 'Cambridge', 'MIT'] · map { x: 6250, y: 3000, size: 2, palette: { fill: '#eccdc6', stroke: '#643126', accent: '#823726' } } · préfixe `comb-` · figures : `erdos` (Paul Erdős, [1913, 1996], Budapest et itinérant), `tutte` (William Tutte, [1917, 2002], Bletchley Park, Toronto et Waterloo), `renyi` (Alfréd Rényi, [1921, 1970], Budapest), `rota` (Gian-Carlo Rota, [1932, 1999], MIT), `haken` (Wolfgang Haken, [1928, 2022], Urbana), `appel` (Kenneth Appel, [1932, 2013], Urbana), `szemeredi` (Endre Szemerédi, [1940, null], Budapest et Piscataway), `stanley` (Richard Stanley, [1944, null], MIT), `lovasz` (László Lovász, [1948, null], Budapest), `seymour` (Paul Seymour, [1950, null], Princeton), `gowers` (Timothy Gowers, [1963, null], Cambridge) · résultats : `methode-probabiliste` (Méthode probabiliste : minoration des nombres de Ramsey, 1947, theoreme, `erdos`), `theoreme-de-tutte` (Théorème de Tutte sur les couplages parfaits, 1947, theoreme), `graphes-aleatoires-d-erdos-renyi` (Graphes aléatoires et seuils d’apparition, 1959, concept, authorName « Paul Erdős et Alfréd Rényi », `erdos`), `fondements-de-la-theorie-combinatoire` (On the Foundations of Combinatorial Theory I : les fonctions de Möbius, 1964, texte), `theoreme-de-szemeredi` (Théorème de Szemerédi, 1975, theoreme), `lemme-de-regularite` (Lemme de régularité de Szemerédi, 1976 approx, theoreme), `theoreme-des-quatre-couleurs` (Théorème des quatre couleurs, 1976, theoreme, authorName « Kenneth Appel et Wolfgang Haken », `appel`), `nombre-theta-de-lovasz` (Nombre thêta de Lovász, 1979, concept), `algorithme-lll` (Algorithme LLL de réduction de réseaux, 1982, methode, authorName « Arjen Lenstra, Hendrik Lenstra et László Lovász », `lovasz`), `enumerative-combinatorics` (Enumerative Combinatorics, 1986, texte), `normes-de-gowers` (Normes de Gowers et nouvelle démonstration du théorème de Szemerédi, 2001, theoreme), `theoreme-des-mineurs-de-graphes` (Théorème des mineurs de Robertson–Seymour, 2004, theoreme, authorName « Neil Robertson et Paul Seymour », `seymour`) · related : `tao`, `selberg`, `euler` · liens : `theorie-des-nombres-xxe` → filiation (Erdős, Hardy–Ramanujan, fait), `probabilites-modernes` → influence (méthode probabiliste, fait), `geometrie-des-lumieres` → filiation (Euler, les ponts de Königsberg, interprétation), `complexite-et-informatique-theorique` → affinité (interprétation).
 
-**`probabilites-et-statistique-contemporaines`** — Probabilités et statistique contemporaines · contemporain · { start: 1955, end: null } · ['hasard'] · ['Princeton', 'Stanford', 'Ithaca', 'Paris', 'Rehovot', 'Genève', 'Warwick'] · map { x: 6950, y: 3250, size: 2, palette: { fill: '#eed6d2', stroke: '#713028', accent: '#b83e2e' } } · préfixe `psc-` · figures : `wigner` (Eugene Wigner, [1902, 1995], Budapest et Princeton), `tukey` (John Tukey, [1915, 2000], Princeton et Murray Hill), `kesten` (Harry Kesten, [1931, 2019], Ithaca), `efron` (Bradley Efron, [1938, null], Stanford), `talagrand` (Michel Talagrand, [1952, null], Paris), `tibshirani` (Robert Tibshirani, [1956, null], Toronto et Stanford), `donoho` (David Donoho, [1957, null], Stanford), `schramm` (Oded Schramm, [1961, 2008], Rehovot et Redmond), `werner` (Wendelin Werner, [1968, null], Orsay, Paris et Zurich), `smirnov` (Stanislav Smirnov, [1970, null], Genève et Saint-Pétersbourg), `hairer` (Martin Hairer, [1975, null], Warwick, Londres et Lausanne) · résultats : `loi-du-demi-cercle` (Loi du demi-cercle de Wigner, 1955, theoreme), `algorithme-de-metropolis-hastings` (Algorithme de Metropolis–Hastings, 1970, methode, authorName « Nicholas Metropolis et al. (1953) ; W. Keith Hastings (1970) », sans mathematicianId), `exploratory-data-analysis` (Exploratory Data Analysis, 1977, texte), `bootstrap` (Bootstrap, 1979, methode), `seuil-critique-de-la-percolation` (Seuil critique 1/2 de la percolation par arêtes sur le réseau carré, 1980, theoreme), `distribution-de-tracy-widom` (Distribution de Tracy–Widom, 1994, theoreme, authorName « Craig Tracy et Harold Widom », sans mathematicianId), `inegalite-de-concentration-de-talagrand` (Inégalité de concentration de Talagrand, 1995, theoreme), `lasso` (Lasso, 1996, methode), `evolution-de-schramm-loewner` (Évolution de Schramm–Loewner (SLE), 2000, concept), `exposants-d-intersection-du-brownien` (Exposants d’intersection du mouvement brownien plan, 2001, theoreme, authorName « Gregory Lawler, Oded Schramm et Wendelin Werner », `werner`), `invariance-conforme-de-la-percolation` (Invariance conforme de la percolation critique, 2001, theoreme), `acquisition-comprimee` (Acquisition comprimée, 2006, methode, authorName « Emmanuel Candès, Justin Romberg et Terence Tao ; David Donoho », `donoho`), `structures-de-regularite` (Théorie des structures de régularité, 2014, theoreme) · related : `tao`, `kolmogorov`, `ito`, `doob`, `feller`, `fisher` · liens : `probabilites-modernes` → filiation (fait), `statistique-mathematique` → filiation (fait), `edp-et-physique-mathematique` → influence (physique statistique, Wigner, interprétation), `analyse-contemporaine` → affinité (interprétation), `complexite-et-informatique-theorique` → influence (calcul intensif et données massives, interprétation).
+**`probabilites-et-statistique-contemporaines`** — Probabilités et statistique contemporaines · contemporain · { start: 1955, end: null } · ['hasard'] · ['Princeton', 'Stanford', 'Ithaca', 'Paris', 'Rehovot', 'Genève', 'Warwick'] · map { x: 6950, y: 3250, size: 2, palette: { fill: '#f1ddd5', stroke: '#73402b', accent: '#92482a' } } · préfixe `psc-` · figures : `wigner` (Eugene Wigner, [1902, 1995], Budapest et Princeton), `tukey` (John Tukey, [1915, 2000], Princeton et Murray Hill), `kesten` (Harry Kesten, [1931, 2019], Ithaca), `efron` (Bradley Efron, [1938, null], Stanford), `talagrand` (Michel Talagrand, [1952, null], Paris), `tibshirani` (Robert Tibshirani, [1956, null], Toronto et Stanford), `donoho` (David Donoho, [1957, null], Stanford), `schramm` (Oded Schramm, [1961, 2008], Rehovot et Redmond), `werner` (Wendelin Werner, [1968, null], Orsay, Paris et Zurich), `smirnov` (Stanislav Smirnov, [1970, null], Genève et Saint-Pétersbourg), `hairer` (Martin Hairer, [1975, null], Warwick, Londres et Lausanne) · résultats : `loi-du-demi-cercle` (Loi du demi-cercle de Wigner, 1955, theoreme), `algorithme-de-metropolis-hastings` (Algorithme de Metropolis–Hastings, 1970, methode, authorName « Nicholas Metropolis et al. (1953) ; W. Keith Hastings (1970) », sans mathematicianId), `exploratory-data-analysis` (Exploratory Data Analysis, 1977, texte), `bootstrap` (Bootstrap, 1979, methode), `seuil-critique-de-la-percolation` (Seuil critique 1/2 de la percolation par arêtes sur le réseau carré, 1980, theoreme), `distribution-de-tracy-widom` (Distribution de Tracy–Widom, 1994, theoreme, authorName « Craig Tracy et Harold Widom », sans mathematicianId), `inegalite-de-concentration-de-talagrand` (Inégalité de concentration de Talagrand, 1995, theoreme), `lasso` (Lasso, 1996, methode), `evolution-de-schramm-loewner` (Évolution de Schramm–Loewner (SLE), 2000, concept), `exposants-d-intersection-du-brownien` (Exposants d’intersection du mouvement brownien plan, 2001, theoreme, authorName « Gregory Lawler, Oded Schramm et Wendelin Werner », `werner`), `invariance-conforme-de-la-percolation` (Invariance conforme de la percolation critique, 2001, theoreme), `acquisition-comprimee` (Acquisition comprimée, 2006, methode, authorName « Emmanuel Candès, Justin Romberg et Terence Tao ; David Donoho », `donoho`), `structures-de-regularite` (Théorie des structures de régularité, 2014, theoreme) · related : `tao`, `kolmogorov`, `ito`, `doob`, `feller`, `fisher` · liens : `probabilites-modernes` → filiation (fait), `statistique-mathematique` → filiation (fait), `edp-et-physique-mathematique` → influence (physique statistique, Wigner, interprétation), `analyse-contemporaine` → affinité (interprétation), `complexite-et-informatique-theorique` → influence (calcul intensif et données massives, interprétation).
 
-**`cryptographie-et-codes`** — Cryptographie, codes correcteurs et théorie de l’information · contemporain · { start: 1948, end: null } · ['hasard', 'nombres'] · ['Murray Hill', 'Stanford', 'MIT', 'Rehovot', 'Seattle', 'Cheltenham'] · map { x: 6600, y: 3560, size: 2, palette: { fill: '#f0dad6', stroke: '#753429', accent: '#bc442f' } } · préfixe `cc-` · figures : `hamming` (Richard Hamming, [1915, 1998], Murray Hill et Monterey), `reed` (Irving Reed, [1923, 2012], Lexington (Massachusetts) et Los Angeles), `berlekamp` (Elwyn Berlekamp, [1940, 2019], Berkeley), `diffie` (Whitfield Diffie, [1944, null], Stanford), `hellman` (Martin Hellman, [1945, null], Stanford), `adleman` (Leonard Adleman, [1945, null], MIT et Los Angeles), `rivest` (Ron Rivest, [1947, null], MIT), `koblitz` (Neal Koblitz, [1948, null], Seattle), `shamir` (Adi Shamir, [1952, null], MIT et Rehovot), `micali` (Silvio Micali, [1954, null], MIT), `goldwasser` (Shafi Goldwasser, [1958, null], MIT et Rehovot) · résultats : `codes-de-hamming` (Codes correcteurs de Hamming, 1950, theoreme), `communication-theory-of-secrecy-systems` (Communication Theory of Secrecy Systems, 1949, texte, `shannon`), `codes-de-reed-solomon` (Codes de Reed–Solomon, 1960, methode, authorName « Irving Reed et Gustave Solomon », `reed`), `algorithme-de-berlekamp-massey` (Algorithme de Berlekamp–Massey, 1968, methode, authorName « Elwyn Berlekamp ; James Massey », `berlekamp`), `new-directions-in-cryptography` (New Directions in Cryptography, 1976, texte, authorName « Whitfield Diffie et Martin Hellman », `diffie`), `echange-de-cles-de-diffie-hellman` (Échange de clés de Diffie–Hellman, 1976, methode, authorName « Whitfield Diffie et Martin Hellman », `hellman`), `rsa` (Cryptosystème RSA, 1977, methode, authorName « Ron Rivest, Adi Shamir et Leonard Adleman », `rivest`), `partage-de-secret-de-shamir` (Partage de secret de Shamir, 1979, methode), `chiffrement-probabiliste` (Chiffrement probabiliste et sécurité sémantique, 1982, concept, authorName « Shafi Goldwasser et Silvio Micali », `goldwasser`), `preuves-a-divulgation-nulle` (Preuves interactives à divulgation nulle de connaissance, 1985, concept, authorName « Shafi Goldwasser, Silvio Micali et Charles Rackoff », `micali`), `cryptographie-sur-courbes-elliptiques` (Cryptographie sur courbes elliptiques, 1985, methode, authorName « Neal Koblitz ; Victor Miller », `koblitz`), `test-de-primalite-aks` (PRIMES est dans P : le test AKS, 2002, theoreme, authorName « Manindra Agrawal, Neeraj Kayal et Nitin Saxena », sans mathematicianId) · related : `shannon`, `turing`, `shor`, `tate` · liens : `calculabilite` → filiation (Shannon, Turing à Bletchley Park, fait), `arithmetique-gaussienne` → influence (arithmétique modulaire, fait), `complexite-et-informatique-theorique` → filiation (fonctions à sens unique, fait), `theorie-des-nombres-contemporaine` → influence (courbes elliptiques, fait).
+**`cryptographie-et-codes`** — Cryptographie, codes correcteurs et théorie de l’information · contemporain · { start: 1948, end: null } · ['hasard', 'nombres'] · ['Murray Hill', 'Stanford', 'MIT', 'Rehovot', 'Seattle', 'Cheltenham'] · map { x: 6600, y: 3560, size: 2, palette: { fill: '#eed8cd', stroke: '#6b3e29', accent: '#8a4728' } } · préfixe `cc-` · figures : `hamming` (Richard Hamming, [1915, 1998], Murray Hill et Monterey), `reed` (Irving Reed, [1923, 2012], Lexington (Massachusetts) et Los Angeles), `berlekamp` (Elwyn Berlekamp, [1940, 2019], Berkeley), `diffie` (Whitfield Diffie, [1944, null], Stanford), `hellman` (Martin Hellman, [1945, null], Stanford), `adleman` (Leonard Adleman, [1945, null], MIT et Los Angeles), `rivest` (Ron Rivest, [1947, null], MIT), `koblitz` (Neal Koblitz, [1948, null], Seattle), `shamir` (Adi Shamir, [1952, null], MIT et Rehovot), `micali` (Silvio Micali, [1954, null], MIT), `goldwasser` (Shafi Goldwasser, [1958, null], MIT et Rehovot) · résultats : `codes-de-hamming` (Codes correcteurs de Hamming, 1950, theoreme), `communication-theory-of-secrecy-systems` (Communication Theory of Secrecy Systems, 1949, texte, `shannon`), `codes-de-reed-solomon` (Codes de Reed–Solomon, 1960, methode, authorName « Irving Reed et Gustave Solomon », `reed`), `algorithme-de-berlekamp-massey` (Algorithme de Berlekamp–Massey, 1968, methode, authorName « Elwyn Berlekamp ; James Massey », `berlekamp`), `new-directions-in-cryptography` (New Directions in Cryptography, 1976, texte, authorName « Whitfield Diffie et Martin Hellman », `diffie`), `echange-de-cles-de-diffie-hellman` (Échange de clés de Diffie–Hellman, 1976, methode, authorName « Whitfield Diffie et Martin Hellman », `hellman`), `rsa` (Cryptosystème RSA, 1977, methode, authorName « Ron Rivest, Adi Shamir et Leonard Adleman », `rivest`), `partage-de-secret-de-shamir` (Partage de secret de Shamir, 1979, methode), `chiffrement-probabiliste` (Chiffrement probabiliste et sécurité sémantique, 1982, concept, authorName « Shafi Goldwasser et Silvio Micali », `goldwasser`), `preuves-a-divulgation-nulle` (Preuves interactives à divulgation nulle de connaissance, 1985, concept, authorName « Shafi Goldwasser, Silvio Micali et Charles Rackoff », `micali`), `cryptographie-sur-courbes-elliptiques` (Cryptographie sur courbes elliptiques, 1985, methode, authorName « Neal Koblitz ; Victor Miller », `koblitz`), `test-de-primalite-aks` (PRIMES est dans P : le test AKS, 2002, theoreme, authorName « Manindra Agrawal, Neeraj Kayal et Nitin Saxena », sans mathematicianId) · related : `shannon`, `turing`, `shor`, `tate` · liens : `calculabilite` → filiation (Shannon, Turing à Bletchley Park, fait), `arithmetique-gaussienne` → influence (arithmétique modulaire, fait), `complexite-et-informatique-theorique` → filiation (fonctions à sens unique, fait), `theorie-des-nombres-contemporaine` → influence (courbes elliptiques, fait).
 
-**`complexite-et-informatique-theorique`** — Complexité, algorithmes et informatique théorique · contemporain · { start: 1959, end: null } · ['fondements', 'hasard'] · ['Toronto', 'Berkeley', 'Moscou', 'Stanford', 'Harvard', 'Jérusalem', 'Princeton'] · map { x: 6250, y: 3900, size: 3, palette: { fill: '#cbecd5', stroke: '#256a3b', accent: '#2caf56' } } · préfixe `cit-` · figures : `dijkstra` (Edsger Dijkstra, [1930, 2002], Amsterdam, Eindhoven et Austin), `hartmanis` (Juris Hartmanis, [1928, 2022], Ithaca), `knuth` (Donald Knuth, [1938, null], Stanford), `strassen` (Volker Strassen, [1936, null], Zurich et Constance), `karp` (Richard Karp, [1935, null], Berkeley), `cook` (Stephen Cook, [1939, null], Toronto), `levin` (Leonid Levin, [1948, null], Moscou et Boston), `valiant` (Leslie Valiant, [1949, null], Édimbourg et Harvard), `wigderson` (Avi Wigderson, [1956, null], Jérusalem et Princeton), `shor` (Peter Shor, [1959, null], Murray Hill et MIT), `razborov` (Alexander Razborov, [1963, null], Moscou et Chicago), `arora` (Sanjeev Arora, [1968, null], Princeton) · résultats : `algorithme-de-dijkstra` (Algorithme de Dijkstra, 1959, methode), `hierarchie-en-temps` (On the Computational Complexity of Algorithms : la hiérarchie en temps, 1965, texte, authorName « Juris Hartmanis et Richard Stearns », `hartmanis`), `the-art-of-computer-programming` (The Art of Computer Programming, 1968, texte), `multiplication-de-strassen` (Multiplication rapide des matrices, 1969, methode), `theoreme-de-cook-levin` (Théorème de Cook–Levin : SAT est NP-complet, 1971, theoreme, authorName « Stephen Cook ; Leonid Levin », `cook`), `probleme-p-np` (Problème P versus NP, 1971, probleme, `cook`), `vingt-et-un-problemes-de-karp` (Reducibility Among Combinatorial Problems : les 21 problèmes NP-complets, 1972, texte), `classe-sharp-p` (Classe #P et complexité du permanent, 1979, theoreme, `valiant`), `apprentissage-pac` (Apprentissage PAC, 1984, concept, `valiant`), `bornes-inferieures-monotones` (Bornes inférieures pour les circuits monotones, 1985, theoreme, `razborov`), `theoreme-pcp` (Théorème PCP, 1992, theoreme, authorName « Sanjeev Arora, Shmuel Safra, Carsten Lund, Rajeev Motwani, Madhu Sudan et Mario Szegedy », `arora`), `algorithme-de-shor` (Algorithme quantique de factorisation de Shor, 1994, theoreme), `preuves-naturelles` (Natural Proofs, 1994, theoreme, authorName « Alexander Razborov et Steven Rudich », `razborov`), `durete-contre-aleatoire` (Hardness vs Randomness : dérandomisation sous hypothèses, 1997, theoreme, authorName « Russell Impagliazzo et Avi Wigderson », `wigderson`) · related : `turing`, `church`, `kleene`, `von-neumann`, `godel`, `dantzig` · liens : `calculabilite` → filiation (fait), `combinatoire` → filiation (algorithmes de graphes, fait), `statistique-mathematique` → influence (programmation linéaire, fait), `logique-mathematique-xixe` → influence (Boole et les circuits, interprétation).
+**`complexite-et-informatique-theorique`** — Complexité, algorithmes et informatique théorique · contemporain · { start: 1959, end: null } · ['fondements', 'hasard'] · ['Toronto', 'Berkeley', 'Moscou', 'Stanford', 'Harvard', 'Jérusalem', 'Princeton'] · map { x: 6250, y: 3900, size: 3, palette: { fill: '#cdeed8', stroke: '#296b3f', accent: '#288a49' } } · préfixe `cit-` · figures : `dijkstra` (Edsger Dijkstra, [1930, 2002], Amsterdam, Eindhoven et Austin), `hartmanis` (Juris Hartmanis, [1928, 2022], Ithaca), `knuth` (Donald Knuth, [1938, null], Stanford), `strassen` (Volker Strassen, [1936, null], Zurich et Constance), `karp` (Richard Karp, [1935, null], Berkeley), `cook` (Stephen Cook, [1939, null], Toronto), `levin` (Leonid Levin, [1948, null], Moscou et Boston), `valiant` (Leslie Valiant, [1949, null], Édimbourg et Harvard), `wigderson` (Avi Wigderson, [1956, null], Jérusalem et Princeton), `shor` (Peter Shor, [1959, null], Murray Hill et MIT), `razborov` (Alexander Razborov, [1963, null], Moscou et Chicago), `arora` (Sanjeev Arora, [1968, null], Princeton) · résultats : `algorithme-de-dijkstra` (Algorithme de Dijkstra, 1959, methode), `hierarchie-en-temps` (On the Computational Complexity of Algorithms : la hiérarchie en temps, 1965, texte, authorName « Juris Hartmanis et Richard Stearns », `hartmanis`), `the-art-of-computer-programming` (The Art of Computer Programming, 1968, texte), `multiplication-de-strassen` (Multiplication rapide des matrices, 1969, methode), `theoreme-de-cook-levin` (Théorème de Cook–Levin : SAT est NP-complet, 1971, theoreme, authorName « Stephen Cook ; Leonid Levin », `cook`), `probleme-p-np` (Problème P versus NP, 1971, probleme, `cook`), `vingt-et-un-problemes-de-karp` (Reducibility Among Combinatorial Problems : les 21 problèmes NP-complets, 1972, texte), `classe-sharp-p` (Classe #P et complexité du permanent, 1979, theoreme, `valiant`), `apprentissage-pac` (Apprentissage PAC, 1984, concept, `valiant`), `bornes-inferieures-monotones` (Bornes inférieures pour les circuits monotones, 1985, theoreme, `razborov`), `theoreme-pcp` (Théorème PCP, 1992, theoreme, authorName « Sanjeev Arora, Shmuel Safra, Carsten Lund, Rajeev Motwani, Madhu Sudan et Mario Szegedy », `arora`), `algorithme-de-shor` (Algorithme quantique de factorisation de Shor, 1994, theoreme), `preuves-naturelles` (Natural Proofs, 1994, theoreme, authorName « Alexander Razborov et Steven Rudich », `razborov`), `durete-contre-aleatoire` (Hardness vs Randomness : dérandomisation sous hypothèses, 1997, theoreme, authorName « Russell Impagliazzo et Avi Wigderson », `wigderson`) · related : `turing`, `church`, `kleene`, `von-neumann`, `godel`, `dantzig` · liens : `calculabilite` → filiation (fait), `combinatoire` → filiation (algorithmes de graphes, fait), `statistique-mathematique` → influence (programmation linéaire, fait), `logique-mathematique-xixe` → influence (Boole et les circuits, interprétation).
 
-**`logique-et-ensembles-contemporains`** — Logique et théorie des ensembles contemporaines : forcing, modèles et types · contemporain · { start: 1960, end: null } · ['fondements'] · ['Stanford', 'Berkeley', 'Jérusalem', 'Stockholm', 'Leningrad', 'Paris', 'Oxford'] · map { x: 6950, y: 4100, size: 2, palette: { fill: '#c3e9ca', stroke: '#22622e', accent: '#2aa741' } } · préfixe `lec-` · figures : `robinson-abraham` (Abraham Robinson, [1918, 1974], Jérusalem, Los Angeles et New Haven), `morley` (Michael Morley, [1930, 2020], Ithaca), `scott` (Dana Scott, [1932, null], Princeton, Oxford et Pittsburgh), `cohen` (Paul Cohen, [1934, 2007], Stanford), `solovay` (Robert Solovay, [1938, null], Berkeley), `martin-lof` (Per Martin-Löf, [1942, null], Stockholm), `shelah` (Saharon Shelah, [1945, null], Jérusalem et New Brunswick), `matiyasevich` (Iouri Matiiassevitch, [1947, null], Leningrad), `girard` (Jean-Yves Girard, [1947, null], Paris et Marseille), `woodin` (W. Hugh Woodin, [1955, null], Berkeley et Harvard), `hrushovski` (Ehud Hrushovski, [1959, null], Jérusalem et Oxford) · résultats : `analyse-non-standard` (Analyse non standard, 1961, concept), `forcing` (Forcing, 1963, methode), `independance-de-l-hypothese-du-continu` (Indépendance de l’hypothèse du continu, 1963, theoreme), `theoreme-de-categoricite-de-morley` (Théorème de catégoricité de Morley, 1965, theoreme), `theoreme-d-ax-kochen` (Théorème d’Ax–Kochen, 1965, theoreme, authorName « James Ax et Simon Kochen », sans mathematicianId), `theorie-des-domaines` (Théorie des domaines et sémantique dénotationnelle, 1969, concept), `theoreme-de-matiyasevich` (Dixième problème de Hilbert : indécidabilité des équations diophantiennes, 1970, theoreme), `modele-de-solovay` (Modèle de Solovay : tous les ensembles de réels sont mesurables, 1970, theoreme), `systeme-f` (Système F, 1971, concept), `theorie-des-types-intuitionniste` (Théorie des types intuitionniste, 1972, concept), `theorie-de-la-classification` (Classification Theory and the Number of Non-Isomorphic Models, 1978, texte), `determination-projective` (Détermination projective à partir des grands cardinaux, 1985 approx, theoreme, authorName « Donald Martin, John Steel et W. Hugh Woodin », `woodin`), `logique-lineaire` (Logique linéaire, 1987, concept), `theorie-pcf` (Théorie pcf et arithmétique des cardinaux, 1994, theoreme, `shelah`), `mordell-lang-par-la-theorie-des-modeles` (Conjecture de Mordell–Lang pour les corps de fonctions, 1996, theoreme, `hrushovski`), `fondements-univalents` (Fondements univalents et théorie homotopique des types, 2013, texte, authorName « Vladimir Voevodsky et le programme Univalent Foundations », `voevodsky`) · related : `godel`, `tarski`, `kleene`, `turing`, `voevodsky`, `leibniz` · liens : `theorie-des-ensembles` → filiation (fait), `calculabilite` → filiation (fait), `fondements-hilbert-brouwer` → filiation (intuitionnisme → Martin-Löf, Löwenheim–Skolem → théorie des modèles, fait), `querelle-des-infiniment-petits` → affinité (Robinson réhabilite les infiniment petits de Leibniz, interprétation), `geometrie-algebrique-moderne` → affinité (interprétation).
+**`logique-et-ensembles-contemporains`** — Logique et théorie des ensembles contemporaines : forcing, modèles et types · contemporain · { start: 1960, end: null } · ['fondements'] · ['Stanford', 'Berkeley', 'Jérusalem', 'Stockholm', 'Leningrad', 'Paris', 'Oxford'] · map { x: 6950, y: 4100, size: 2, palette: { fill: '#c6ecd3', stroke: '#26643c', accent: '#268246' } } · préfixe `lec-` · figures : `robinson-abraham` (Abraham Robinson, [1918, 1974], Jérusalem, Los Angeles et New Haven), `morley` (Michael Morley, [1930, 2020], Ithaca), `scott` (Dana Scott, [1932, null], Princeton, Oxford et Pittsburgh), `cohen` (Paul Cohen, [1934, 2007], Stanford), `solovay` (Robert Solovay, [1938, null], Berkeley), `martin-lof` (Per Martin-Löf, [1942, null], Stockholm), `shelah` (Saharon Shelah, [1945, null], Jérusalem et New Brunswick), `matiyasevich` (Iouri Matiiassevitch, [1947, null], Leningrad), `girard` (Jean-Yves Girard, [1947, null], Paris et Marseille), `woodin` (W. Hugh Woodin, [1955, null], Berkeley et Harvard), `hrushovski` (Ehud Hrushovski, [1959, null], Jérusalem et Oxford) · résultats : `analyse-non-standard` (Analyse non standard, 1961, concept), `forcing` (Forcing, 1963, methode), `independance-de-l-hypothese-du-continu` (Indépendance de l’hypothèse du continu, 1963, theoreme), `theoreme-de-categoricite-de-morley` (Théorème de catégoricité de Morley, 1965, theoreme), `theoreme-d-ax-kochen` (Théorème d’Ax–Kochen, 1965, theoreme, authorName « James Ax et Simon Kochen », sans mathematicianId), `theorie-des-domaines` (Théorie des domaines et sémantique dénotationnelle, 1969, concept), `theoreme-de-matiyasevich` (Dixième problème de Hilbert : indécidabilité des équations diophantiennes, 1970, theoreme), `modele-de-solovay` (Modèle de Solovay : tous les ensembles de réels sont mesurables, 1970, theoreme), `systeme-f` (Système F, 1971, concept), `theorie-des-types-intuitionniste` (Théorie des types intuitionniste, 1972, concept), `theorie-de-la-classification` (Classification Theory and the Number of Non-Isomorphic Models, 1978, texte), `determination-projective` (Détermination projective à partir des grands cardinaux, 1985 approx, theoreme, authorName « Donald Martin, John Steel et W. Hugh Woodin », `woodin`), `logique-lineaire` (Logique linéaire, 1987, concept), `theorie-pcf` (Théorie pcf et arithmétique des cardinaux, 1994, theoreme, `shelah`), `mordell-lang-par-la-theorie-des-modeles` (Conjecture de Mordell–Lang pour les corps de fonctions, 1996, theoreme, `hrushovski`), `fondements-univalents` (Fondements univalents et théorie homotopique des types, 2013, texte, authorName « Vladimir Voevodsky et le programme Univalent Foundations », `voevodsky`) · related : `godel`, `tarski`, `kleene`, `turing`, `voevodsky`, `leibniz` · liens : `theorie-des-ensembles` → filiation (fait), `calculabilite` → filiation (fait), `fondements-hilbert-brouwer` → filiation (intuitionnisme → Martin-Löf, Löwenheim–Skolem → théorie des modèles, fait), `querelle-des-infiniment-petits` → affinité (Robinson réhabilite les infiniment petits de Leibniz, interprétation), `geometrie-algebrique-moderne` → affinité (interprétation).
 
-**`calcul-scientifique-et-preuves-assistees`** — Calcul scientifique, calcul formel et démonstration assistée · contemporain · { start: 1946, end: null } · ['analyse', 'fondements'] · ['Los Alamos', 'New York', 'Teddington', 'Yorktown Heights', 'Eindhoven', 'Linz', 'Rocquencourt', 'Pittsburgh'] · map { x: 6620, y: 2560, size: 2, palette: { fill: '#cdc3e9', stroke: '#332262', accent: '#4b2aa7' } } · préfixe `csp-` · figures : `ulam` (Stanislaw Ulam, [1909, 1984], Lwów, Los Alamos et Boulder), `wilkinson` (James H. Wilkinson, [1919, 1986], Teddington), `lax` (Peter Lax, [1926, null], New York), `cooley` (James Cooley, [1926, 2016], Yorktown Heights), `de-bruijn` (Nicolaas Govert de Bruijn, [1918, 2012], Amsterdam et Eindhoven), `golub` (Gene Golub, [1932, 2007], Stanford), `buchberger` (Bruno Buchberger, [1942, null], Innsbruck et Linz), `huet` (Gérard Huet, [1947, null], Rocquencourt), `zeilberger` (Doron Zeilberger, [1950, null], Philadelphie et New Brunswick), `hales` (Thomas Hales, [1958, null], Ann Arbor et Pittsburgh), `coquand` (Thierry Coquand, [1961, null], Rocquencourt et Göteborg) · résultats : `methode-de-monte-carlo` (Méthode de Monte-Carlo, 1949, methode, authorName « Nicholas Metropolis et Stanislaw Ulam », `ulam`), `theoreme-d-equivalence-de-lax` (Théorème d’équivalence de Lax, 1956, theoreme), `analyse-d-erreur-inverse` (Analyse d’erreur inverse en arithmétique flottante, 1963, concept), `transformee-de-fourier-rapide` (Transformée de Fourier rapide (Cooley–Tukey), 1965, methode, authorName « James Cooley et John Tukey », `cooley`), `bases-de-grobner` (Bases de Gröbner, 1965, concept), `automath` (Automath, 1967, methode), `algorithme-de-risch` (Algorithme de Risch pour l’intégration symbolique, 1969, methode, authorName « Robert Risch », sans mathematicianId), `algorithme-svd-de-golub-kahan` (Algorithme de Golub–Kahan–Reinsch pour la décomposition en valeurs singulières, 1970, methode, `golub`), `calcul-des-constructions` (Calcul des constructions, 1988, concept, authorName « Thierry Coquand et Gérard Huet », `coquand`), `algorithme-de-zeilberger` (Algorithme de Zeilberger pour les identités hypergéométriques, 1990, methode), `demonstration-de-la-conjecture-de-kepler` (Démonstration de la conjecture de Kepler, 1998, theoreme, `hales`), `quatre-couleurs-en-coq` (Formalisation du théorème des quatre couleurs en Coq, 2005, texte, authorName « Georges Gonthier », sans mathematicianId), `feit-thompson-formalise` (Formalisation du théorème de Feit–Thompson, 2012, texte, authorName « Georges Gonthier et al. », sans mathematicianId), `flyspeck` (Projet Flyspeck : preuve formelle de la conjecture de Kepler, 2014, texte, `hales`), `liquid-tensor-experiment` (Liquid Tensor Experiment : formalisation en Lean, 2022, texte, authorName « Peter Scholze, Johan Commelin et la communauté mathlib », sans mathematicianId) · related : `von-neumann`, `tukey`, `turing`, `lovasz`, `martin-lof` · liens : `calculabilite` → filiation (EDVAC, Turing, fait), `logarithmes-et-calcul-numerique` → filiation (tables et machines, interprétation), `fondements-hilbert-brouwer` → filiation (de Bruijn, Martin-Löf et la tradition constructive, interprétation), `combinatoire` → influence (quatre couleurs, fait), `analyse-contemporaine` → affinité (interprétation).
+**`calcul-scientifique-et-preuves-assistees`** — Calcul scientifique, calcul formel et démonstration assistée · contemporain · { start: 1946, end: null } · ['analyse', 'fondements'] · ['Los Alamos', 'New York', 'Teddington', 'Yorktown Heights', 'Eindhoven', 'Linz', 'Rocquencourt', 'Pittsburgh'] · map { x: 6620, y: 2560, size: 2, palette: { fill: '#d4c6ec', stroke: '#3e2664', accent: '#492682' } } · préfixe `csp-` · figures : `ulam` (Stanislaw Ulam, [1909, 1984], Lwów, Los Alamos et Boulder), `wilkinson` (James H. Wilkinson, [1919, 1986], Teddington), `lax` (Peter Lax, [1926, null], New York), `cooley` (James Cooley, [1926, 2016], Yorktown Heights), `de-bruijn` (Nicolaas Govert de Bruijn, [1918, 2012], Amsterdam et Eindhoven), `golub` (Gene Golub, [1932, 2007], Stanford), `buchberger` (Bruno Buchberger, [1942, null], Innsbruck et Linz), `huet` (Gérard Huet, [1947, null], Rocquencourt), `zeilberger` (Doron Zeilberger, [1950, null], Philadelphie et New Brunswick), `hales` (Thomas Hales, [1958, null], Ann Arbor et Pittsburgh), `coquand` (Thierry Coquand, [1961, null], Rocquencourt et Göteborg) · résultats : `methode-de-monte-carlo` (Méthode de Monte-Carlo, 1949, methode, authorName « Nicholas Metropolis et Stanislaw Ulam », `ulam`), `theoreme-d-equivalence-de-lax` (Théorème d’équivalence de Lax, 1956, theoreme), `analyse-d-erreur-inverse` (Analyse d’erreur inverse en arithmétique flottante, 1963, concept), `transformee-de-fourier-rapide` (Transformée de Fourier rapide (Cooley–Tukey), 1965, methode, authorName « James Cooley et John Tukey », `cooley`), `bases-de-grobner` (Bases de Gröbner, 1965, concept), `automath` (Automath, 1967, methode), `algorithme-de-risch` (Algorithme de Risch pour l’intégration symbolique, 1969, methode, authorName « Robert Risch », sans mathematicianId), `algorithme-svd-de-golub-kahan` (Algorithme de Golub–Kahan–Reinsch pour la décomposition en valeurs singulières, 1970, methode, `golub`), `calcul-des-constructions` (Calcul des constructions, 1988, concept, authorName « Thierry Coquand et Gérard Huet », `coquand`), `algorithme-de-zeilberger` (Algorithme de Zeilberger pour les identités hypergéométriques, 1990, methode), `demonstration-de-la-conjecture-de-kepler` (Démonstration de la conjecture de Kepler, 1998, theoreme, `hales`), `quatre-couleurs-en-coq` (Formalisation du théorème des quatre couleurs en Coq, 2005, texte, authorName « Georges Gonthier », sans mathematicianId), `feit-thompson-formalise` (Formalisation du théorème de Feit–Thompson, 2012, texte, authorName « Georges Gonthier et al. », sans mathematicianId), `flyspeck` (Projet Flyspeck : preuve formelle de la conjecture de Kepler, 2014, texte, `hales`), `liquid-tensor-experiment` (Liquid Tensor Experiment : formalisation en Lean, 2022, texte, authorName « Peter Scholze, Johan Commelin et la communauté mathlib », sans mathematicianId) · related : `von-neumann`, `tukey`, `turing`, `lovasz`, `martin-lof` · liens : `calculabilite` → filiation (EDVAC, Turing, fait), `logarithmes-et-calcul-numerique` → filiation (tables et machines, interprétation), `fondements-hilbert-brouwer` → filiation (de Bruijn, Martin-Löf et la tradition constructive, interprétation), `combinatoire` → influence (quatre couleurs, fait), `analyse-contemporaine` → affinité (interprétation).
 
 ### Règle supplémentaire sur les références croisées
 
diff --git a/e2e/atlas.spec.ts b/e2e/atlas.spec.ts
index cc1fc79..b3a8da8 100644
--- a/e2e/atlas.spec.ts
+++ b/e2e/atlas.spec.ts
@@ -1,5 +1,10 @@
 import { test, expect, type Page } from '@playwright/test';
-import { DOMAINS } from '../src/data';
+import { DOMAINS, DOMAIN_BY_ID, LINKS } from '../src/data';
+import { principalLinks } from '../src/map/lineage';
+
+const FEATURED = DOMAINS.flatMap((d) => d.mathematicians).filter((m) => m.featured).length;
+const DEFAULT_LINKS = principalLinks(LINKS, DOMAIN_BY_ID).size + LINKS.filter((l) => l.kind === 'reaction').length;
+const ALL_LINKS = LINKS.filter((l) => l.kind !== 'affinite').length;
 
 async function dismissIntro(page: Page) {
   const explorer = page.getByRole('button', { name: 'Explorer' });
@@ -140,8 +145,7 @@ test('domaine contemporain : complexité et informatique théorique', async ({ p
   }
 });
 
-test('fleuves et frise : un fleuve par champ, la frise déplace la carte dans le temps', async ({ page }) => {
-  await expect(page.locator('.rivers .river')).toHaveCount(5);
+test('frise : elle déplace la carte dans le temps', async ({ page }) => {
   const slider = page.getByRole('slider');
   await expect(slider).toBeVisible();
   const box = (await slider.boundingBox())!;
@@ -153,6 +157,51 @@ test('fleuves et frise : un fleuve par champ, la frise déplace la carte dans le
   await expect.poll(yearAt, { timeout: 3000 }).toBeGreaterThan(early);
 });
 
+test('vue d’ensemble : une médaille par grande figure, lignées principales et ruptures', async ({ page }) => {
+  expect(FEATURED).toBeGreaterThanOrEqual(40);
+  await expect(page.locator('[data-testid="medallion"]')).toHaveCount(FEATURED);
+  await expect(page.locator('.link-group')).toHaveCount(DEFAULT_LINKS);
+});
+
+test('filtres : « Tous les liens » trace toutes les transmissions', async ({ page }) => {
+  await page.getByRole('button', { name: 'Filtres' }).click();
+  await page.getByRole('radio', { name: 'Tous les liens' }).click();
+  await expect(page.locator('.link-group')).toHaveCount(ALL_LINKS);
+  await page.getByRole('radio', { name: 'Lignées principales' }).click();
+  await expect(page.locator('.link-group')).toHaveCount(DEFAULT_LINKS);
+});
+
+test('grande figure : la médaille ouvre la fiche (signature, résultats phares)', async ({ page }, testInfo) => {
+  if (testInfo.project.name === 'mobile') {
+    // en vue d'ensemble mobile, les médailles font 3,5 px : navigation directe
+    await page.goto('/#/mathematicien/euler');
+    await dismissIntro(page);
+  } else {
+    await page.locator('[data-testid="medallion"][data-id="euler"]').click();
+  }
+  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
+  await expect(panel).toContainText('Leonhard Euler');
+  await expect(panel.locator('[data-testid="signature"] .badge-fait, [data-testid="signature"] .badge-interp')).toHaveCount(1);
+  await expect(panel.locator('[data-testid="headlines"] li')).not.toHaveCount(0);
+  await expect(page).toHaveURL(/#\/mathematicien\/euler/);
+  if (testInfo.project.name === 'desktop') {
+    await page.waitForTimeout(1100);
+    await page.screenshot({ path: 'e2e/artifacts/desktop-grande-figure-euler.png' });
+  }
+});
+
+test('résultat : « D’où vient l’idée » et « Idée de la démonstration »', async ({ page }, testInfo) => {
+  await page.goto('/#/resultat/infinite-des-nombres-premiers');
+  await dismissIntro(page);
+  await expect(page.locator('[data-testid="result-intuition"] .badge-fait').first()).toBeVisible();
+  const steps = page.locator('[data-testid="result-proof"] li');
+  expect(await steps.count()).toBeGreaterThanOrEqual(3);
+  if (testInfo.project.name === 'desktop') {
+    await page.waitForTimeout(1100);
+    await page.screenshot({ path: 'e2e/artifacts/desktop-demonstration.png' });
+  }
+});
+
 test('bassin amont : la fiche liste les affluents, la carte les allume', async ({ page }, testInfo) => {
   await page.goto('/#/domaine/analyse-rigoureuse');
   await dismissIntro(page);
@@ -200,3 +249,49 @@ test('langue : ?lang=en bascule l’UI, le sélecteur revient en FR', async ({ p
   await expect(page.getByRole('button', { name: 'Filtres' }).first()).toBeVisible();
   await expect(page).toHaveURL(/lang=fr/);
 });
+
+// ——— points de vigilance de la refonte « Galerie » ———
+
+test('vue d’ensemble : les noms des grandes figures ne se chevauchent pas', async ({ page }) => {
+  await page.waitForTimeout(1400);
+  const boxes = await page
+    .locator('[data-testid="featured-label"]')
+    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
+  expect(boxes.length).toBeGreaterThan(0);
+  for (let i = 0; i < boxes.length; i++) {
+    for (let j = i + 1; j < boxes.length; j++) {
+      const a = boxes[i];
+      const b = boxes[j];
+      const overlap = a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1;
+      expect(overlap, `noms ${i} et ${j}`).toBe(false);
+    }
+  }
+});
+
+test('grande figure : un résultat phare situé dans un autre domaine ouvre sa fiche', async ({ page }) => {
+  await page.goto('/#/mathematicien/euler');
+  await dismissIntro(page);
+  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
+  await panel.locator('[data-testid="headlines"]').getByRole('button', { name: /Königsberg/ }).click();
+  await expect(page).toHaveURL(/#\/resultat\/sept-ponts-de-konigsberg/);
+  await expect(panel).toContainText(DOMAIN_BY_ID['geometrie-des-lumieres'].name);
+});
+
+test('anglais : la fiche d’une grande figure garde son contenu (corpus en français)', async ({ page }) => {
+  await page.goto('/?lang=en#/mathematicien/euler');
+  await dismissIntro(page);
+  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
+  await expect(panel).toContainText('Contributions');
+  await expect(panel).toContainText('Landmark results');
+  await expect(panel).toContainText('Fait des fonctions');
+});
+
+test('« N’afficher que les faits » masque une signature interprétative', async ({ page }) => {
+  await page.goto('/#/mathematicien/fermat');
+  await dismissIntro(page);
+  const panel = page.locator('[data-testid="panel"], [data-testid="panel-sheet"]');
+  await expect(panel.locator('[data-testid="signature"] li')).toHaveCount(1);
+  await page.getByRole('button', { name: 'Filtres' }).click();
+  await page.getByTestId('facts-only').check();
+  await expect(panel.locator('[data-testid="signature"] li')).toHaveCount(0);
+});
diff --git a/index.html b/index.html
index f8c8d6c..a2246e8 100644
--- a/index.html
+++ b/index.html
@@ -7,7 +7,7 @@
       name="description"
       content="Cartographie interactive des domaines, des théories, des mathématiciens et des grands résultats, de Babylone à aujourd’hui."
     />
-    <meta name="theme-color" content="#0a0910" />
+    <meta name="theme-color" content="#fbfaf7" />
     <title>Atlas des mathématiques</title>
   </head>
   <body>
diff --git a/package.json b/package.json
index 3770d87..30d6594 100644
--- a/package.json
+++ b/package.json
@@ -13,7 +13,7 @@
     "test:e2e": "playwright test"
   },
   "dependencies": {
-    "@fontsource/cormorant-garamond": "^5.3.0",
+    "@fontsource/fraunces": "^5.3.0",
     "@fontsource/dm-sans": "^5.3.0",
     "d3": "^7.9.0",
     "lucide-react": "^1.46.0",
diff --git a/scripts/palettes.ts b/scripts/palettes.ts
index 55a69cf..eb57561 100644
--- a/scripts/palettes.ts
+++ b/scripts/palettes.ts
@@ -1,13 +1,12 @@
 /**
- * Régénère les palettes des 58 domaines pour la DA « fleuves et confluences » :
- * papier clair, encre et lavis d'aquarelle. Une famille de teintes par champ
- * (la même que celle de son fleuve), avec une variation déterministe par domaine
- * (hachage de l'id). Réécrit le littéral `palette: { … }` dans les fichiers
- * d'ère ET dans docs/corpus/BRIEF.md (source de vérité).
+ * Régénère les palettes des 58 domaines pour la DA « Galerie » : une famille
+ * de teintes par champ (FIELD_HUE), avec une légère variation déterministe par
+ * domaine (hachage de l'id). Réécrit le littéral `palette: { … }` dans les
+ * fichiers d'ère ET dans docs/corpus/BRIEF.md (source de vérité).
  *
- *   fill   : lavis pâle du lac (aplat)
- *   stroke : encre teintée (contour, libellés)
- *   accent : pigment saturé (halo, marqueurs)
+ *   fill   : disque pâle du domaine
+ *   stroke : encre du nom du domaine et de ses théories
+ *   accent : médaille des grandes figures, anneau de sélection
  *
  * Usage : npx tsx scripts/palettes.ts
  */
@@ -47,22 +46,23 @@ interface Palette {
   accent: string;
 }
 
-function watercolorPalette(id: string, continent: ContinentId): Palette {
+/** DA « Galerie » : disque pâle, encre du nom, médaille des grandes figures. */
+function galleryPalette(id: string, continent: ContinentId): Palette {
   const j = hash(id);
-  const dh = (j % 15) - 7; // ±7° de teinte
-  const dl = ((j >> 5) % 5) - 2; // ±2 points de luminosité
+  const dh = (j % 11) - 5; // ±5° de teinte
+  const dl = ((j >> 5) % 3) - 1; // ±1 point de luminosité
   const h = FIELD_HUE[continent] + dh;
   return {
-    fill: hsl(h, 46, 89 + dl),
-    stroke: hsl(h, 48, 31 + dl),
-    accent: hsl(h, 60, 46 + dl),
+    fill: hsl(h, 50, 88 + dl),
+    stroke: hsl(h, 45, 30 + dl),
+    accent: hsl(h, 55, 36 + dl),
   };
 }
 
 // ——— calcul des palettes ———
 const palettes = new Map<string, Palette>();
 for (const d of DOMAINS) {
-  palettes.set(d.id, watercolorPalette(d.id, d.continents[0]));
+  palettes.set(d.id, galleryPalette(d.id, d.continents[0]));
 }
 
 // ——— application aux fichiers d'ère ———
@@ -113,7 +113,7 @@ for (let i = 0; i < lines.length; i++) {
 }
 writeFileSync(briefPath, lines.join('\n'));
 
-console.log(`palettes aquarelle appliquées : ${appliedData} domaines (données), ${appliedBrief} lignes (brief)`);
+console.log(`palettes « Galerie » appliquées : ${appliedData} domaines (données), ${appliedBrief} lignes (brief)`);
 for (const c of Object.keys(FIELD_HUE) as ContinentId[]) {
   const n = DOMAINS.filter((d) => d.continents[0] === c).length;
   console.log(`  ${c} : ${n} domaines, teinte de base ${FIELD_HUE[c]}°`);
diff --git a/src/App.tsx b/src/App.tsx
index d5970f9..0e52905 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -14,7 +14,6 @@ import { ATLAS_NODES } from './data/nodes';
 import { TopBar } from './ui/TopBar';
 import { FiltersDrawer, computeDimmed } from './ui/FiltersDrawer';
 import { Legend } from './ui/Legend';
-import { VisionPanel } from './ui/VisionPanel';
 import { MethodModal } from './ui/MethodModal';
 import { IntroOverlay } from './ui/IntroOverlay';
 import { Panel } from './ui/Panel';
@@ -154,8 +153,6 @@ function AtlasApp() {
         selection={state.selection}
         relatedIds={relatedIds}
         chain={chain}
-        vision={state.vision}
-        naturesKind={state.naturesKind}
         fitInset={fitInset}
         onSelect={navigate}
         onLinkClick={onLinkClick}
@@ -180,7 +177,6 @@ function AtlasApp() {
       <TopBar onNavigate={navigate} />
       <FiltersDrawer visibleCount={visibleCount} />
       <Legend />
-      <VisionPanel />
       <MethodModal />
       <Panel nav={(sel) => navigate(sel, true)} />
       {popover && (
@@ -206,7 +202,6 @@ function AtlasApp() {
         </div>
       )}
       <IntroOverlay />
-      <div className="grain" aria-hidden="true" />
     </>
   );
 }
diff --git a/src/data/__tests__/completeness.test.ts b/src/data/__tests__/completeness.test.ts
new file mode 100644
index 0000000..fe19ad2
--- /dev/null
+++ b/src/data/__tests__/completeness.test.ts
@@ -0,0 +1,28 @@
+import { describe, it, expect } from 'vitest';
+import { DOMAINS } from '../index';
+import { COMPLETENESS, coverage } from '../completeness';
+
+const c = coverage(DOMAINS);
+const ratio = (done: number, total: number) => (total === 0 ? 1 : done / total);
+
+describe('complétude du corpus (seuils relevés à chaque vague)', () => {
+  it(`au moins ${COMPLETENESS.featuredMin} grandes figures`, () => {
+    expect(c.featured).toBeGreaterThanOrEqual(COMPLETENESS.featuredMin);
+  });
+
+  it('apports des grandes figures', () => {
+    if (COMPLETENESS.contributionsRequired) expect(c.featuredWithContributions).toBe(c.featured);
+  });
+
+  it(`intuitions et démonstrations : au moins ${COMPLETENESS.proofsCoverage * 100} %`, () => {
+    expect(ratio(c.proofDone, c.proofTargets)).toBeGreaterThanOrEqual(COMPLETENESS.proofsCoverage);
+  });
+
+  it(`au moins ${COMPLETENESS.mathematiciansMin} figures`, () => {
+    expect(c.mathematicians).toBeGreaterThanOrEqual(COMPLETENESS.mathematiciansMin);
+  });
+
+  it(`slugs MacTutor : au moins ${COMPLETENESS.mactutorCoverage * 100} %`, () => {
+    expect(ratio(c.withMactutor, c.mathematicians)).toBeGreaterThanOrEqual(COMPLETENESS.mactutorCoverage);
+  });
+});
diff --git a/src/data/__tests__/validate.test.ts b/src/data/__tests__/validate.test.ts
index 4d7a3bd..48ccbc6 100644
--- a/src/data/__tests__/validate.test.ts
+++ b/src/data/__tests__/validate.test.ts
@@ -1,7 +1,7 @@
 import { describe, it, expect } from 'vitest';
 import { validateAtlas } from '../validate';
 import { DOMAINS, LINKS, SOURCES, ERAS, CONTINENTS, MATHEMATICIAN_LINKS } from '../index';
-import type { Domain, Result } from '../types';
+import type { Domain, Mathematician, Result, Statement } from '../types';
 
 const base = {
   links: LINKS,
@@ -54,3 +54,96 @@ describe('validateAtlas', () => {
     expect(errors).toEqual([]);
   });
 });
+
+// ——— grandes figures, intuitions, démonstrations, ascendants principaux ———
+
+/** Corpus où la figure `id` est modifiée par `patch` (dans son domaine d'attache). */
+function withMathematician(id: string, patch: Partial<Mathematician>): Domain[] {
+  return DOMAINS.map((d) =>
+    d.mathematicians.some((m) => m.id === id)
+      ? { ...d, mathematicians: d.mathematicians.map((m) => (m.id === id ? { ...m, ...patch } : m)) }
+      : d,
+  );
+}
+
+/** Corpus où le résultat `id` est modifié par `patch`. */
+function withResultId(id: string, patch: Partial<Result>): Domain[] {
+  return DOMAINS.map((d) =>
+    d.results.some((r) => r.id === id) ? { ...d, results: d.results.map((r) => (r.id === id ? { ...r, ...patch } : r)) } : d,
+  );
+}
+
+const S: Statement = { kind: 'fait', text: 'Un énoncé sourcé.', sources: ['katz-history'] };
+const SIG: Statement = { kind: 'fait', text: 'Fait des fonctions l’objet de l’analyse.', sources: ['bottazzini-higher-calculus'] };
+
+describe('validateAtlas : grandes figures', () => {
+  const featured = (patch: Partial<NonNullable<Mathematician['featured']>> = {}) =>
+    withMathematician('euler', { featured: { signature: SIG, contributions: [], headlineResultIds: ['probleme-de-bale'], ...patch } });
+
+  it('grande figure valide (sans apports : vague 2 pas encore passée) acceptée', () => {
+    expect(validateAtlas({ ...base, domains: featured() })).toEqual([]);
+  });
+
+  it('signature de plus de 90 caractères refusée', () => {
+    const errors = validateAtlas({ ...base, domains: featured({ signature: { ...SIG, text: 'x'.repeat(91) } }) });
+    expect(errors.some((e) => e.includes('signature trop longue (91 > 90'))).toBe(true);
+  });
+
+  it('un seul apport refusé, deux acceptés', () => {
+    expect(validateAtlas({ ...base, domains: featured({ contributions: [S] }) }).some((e) => e.includes('2 à 4 apports attendus (1)'))).toBe(true);
+    expect(validateAtlas({ ...base, domains: featured({ contributions: [S, S] }) })).toEqual([]);
+  });
+
+  it('résultat phare inconnu ou attribué à une autre figure refusé', () => {
+    const errors = validateAtlas({ ...base, domains: featured({ headlineResultIds: ['inexistant', 'theoreme-des-quatre-carres'] }) });
+    expect(errors.some((e) => e.includes('résultat phare inconnu « inexistant »'))).toBe(true);
+    expect(errors.some((e) => e.includes('« theoreme-des-quatre-carres » n’est pas attribué à euler'))).toBe(true);
+  });
+
+  it('résultat phare situé dans un autre domaine que la figure accepté', () => {
+    // sept-ponts-de-konigsberg est dans geometrie-des-lumieres, Euler dans analyse-eulerienne
+    expect(validateAtlas({ ...base, domains: featured({ headlineResultIds: ['probleme-de-bale', 'sept-ponts-de-konigsberg'] }) })).toEqual([]);
+  });
+
+  it('slug MacTutor non conforme refusé', () => {
+    const errors = validateAtlas({ ...base, domains: withMathematician('euler', { mactutor: 'Euler Leonhard' }) });
+    expect(errors.some((e) => e.includes('slug MacTutor non conforme'))).toBe(true);
+  });
+});
+
+describe('validateAtlas : intuitions et démonstrations', () => {
+  it('intuition et démonstration sourcées acceptées sur un théorème', () => {
+    expect(validateAtlas({ ...base, domains: withResultId('probleme-de-bale', { intuition: [S], proof: [S, S, S] }) })).toEqual([]);
+  });
+
+  it('démonstration de deux étapes refusée', () => {
+    const errors = validateAtlas({ ...base, domains: withResultId('probleme-de-bale', { proof: [S, S] }) });
+    expect(errors.some((e) => e.includes('démonstration : 3 à 6 étapes (2)'))).toBe(true);
+  });
+
+  it('démonstration ou intuition sur un texte refusées', () => {
+    const errors = validateAtlas({ ...base, domains: withResultId('elements-euclide', { intuition: [S], proof: [S, S, S] }) });
+    expect(errors.some((e) => e.includes('intuition sans objet pour un texte'))).toBe(true);
+    expect(errors.some((e) => e.includes('démonstration réservée aux théorèmes'))).toBe(true);
+  });
+
+  it('étape de démonstration sans source refusée', () => {
+    const errors = validateAtlas({
+      ...base,
+      domains: withResultId('probleme-de-bale', { proof: [S, S, { kind: 'fait', text: 'Étape non sourcée.' }] }),
+    });
+    expect(errors.some((e) => e.includes('démonstration #2 : aucune source'))).toBe(true);
+  });
+});
+
+describe('validateAtlas : ascendants principaux', () => {
+  it('au plus un ascendant principal par domaine, et seulement sur une transmission', () => {
+    const toCalcul = LINKS.filter((l) => l.target === 'naissance-du-calcul' && (l.kind === 'filiation' || l.kind === 'influence'));
+    const affinity = LINKS.find((l) => l.kind === 'affinite')!;
+    const marked = new Set([toCalcul[0], toCalcul[1], affinity]);
+    const links = LINKS.map((l) => (marked.has(l) ? { ...l, principal: true as const } : l));
+    const errors = validateAtlas({ ...base, links, domains: DOMAINS });
+    expect(errors.some((e) => e.includes('plusieurs ascendants principaux pour naissance-du-calcul'))).toBe(true);
+    expect(errors.some((e) => e.includes('un ascendant principal est une filiation ou une influence (affinite)'))).toBe(true);
+  });
+});
diff --git a/src/data/completeness.ts b/src/data/completeness.ts
new file mode 100644
index 0000000..44dd248
--- /dev/null
+++ b/src/data/completeness.ts
@@ -0,0 +1,51 @@
+import type { Domain, Result } from './types';
+
+/**
+ * Seuils de complétude du corpus, relevés à la fin de chaque vague de la
+ * refonte (docs/superpowers/plans/2026-10-12-refonte-galerie.md). La forme
+ * des données est contrôlée en permanence par validate.ts ; ces seuils
+ * disent seulement jusqu'où le contenu est déjà écrit.
+ */
+export const COMPLETENESS = {
+  /** nombre minimal de grandes figures (sous-projet 1 : liste éditoriale) */
+  featuredMin: 0,
+  /** toute grande figure a 2 à 4 apports (vague 2) */
+  contributionsRequired: false,
+  /** part des théorèmes dotés d'une intuition et d'une démonstration, et des conjectures et problèmes dotés d'une intuition (vague 3) */
+  proofsCoverage: 0,
+  /** nombre minimal de figures (vague 4) */
+  mathematiciansMin: 428,
+  /** part des figures dotées d'un slug MacTutor (vague 4) */
+  mactutorCoverage: 0,
+};
+
+/** Un résultat est « complet » pour la vague 3 : théorème → intuition + démonstration ; conjecture, problème → intuition. */
+export function hasProofMaterial(r: Result): boolean {
+  if (r.kind === 'theoreme') return (r.intuition?.length ?? 0) > 0 && (r.proof?.length ?? 0) > 0;
+  if (r.kind === 'conjecture' || r.kind === 'probleme') return (r.intuition?.length ?? 0) > 0;
+  return true;
+}
+
+export interface Coverage {
+  featured: number;
+  featuredWithContributions: number;
+  proofTargets: number;
+  proofDone: number;
+  mathematicians: number;
+  withMactutor: number;
+}
+
+/** Mesure de l'avancement du corpus (utilisée par le test de complétude et par scripts/coverage.ts). */
+export function coverage(domains: readonly Domain[]): Coverage {
+  const figures = domains.flatMap((d) => d.mathematicians);
+  const featured = figures.filter((m) => m.featured);
+  const targets = domains.flatMap((d) => d.results).filter((r) => r.kind === 'theoreme' || r.kind === 'conjecture' || r.kind === 'probleme');
+  return {
+    featured: featured.length,
+    featuredWithContributions: featured.filter((m) => (m.featured?.contributions.length ?? 0) >= 2).length,
+    proofTargets: targets.length,
+    proofDone: targets.filter(hasProofMaterial).length,
+    mathematicians: figures.length,
+    withMactutor: figures.filter((m) => m.mactutor).length,
+  };
+}
diff --git a/src/data/domains/antiquite.ts b/src/data/domains/antiquite.ts
index 23862dd..46427a6 100644
--- a/src/data/domains/antiquite.ts
+++ b/src/data/domains/antiquite.ts
@@ -32,7 +32,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -1800, end: -300, approx: true },
     continents: ['nombres', 'hasard'],
     places: ['Babylone', 'Nippur', 'Thèbes', 'Suse'],
-    map: { x: 300, y: 420, size: 2, palette: { fill: '#eee4d2', stroke: '#715528', accent: '#b8832e' } },
+    map: { x: 300, y: 420, size: 2, palette: { fill: '#f0e7d1', stroke: '#6f5b2a', accent: '#8e7229' } },
     tagline: 'Sur l’argile et le papyrus, des procédures sans théorèmes : la première mathématique est un métier de scribe.',
     summary:
       'Entre le début du IIᵉ millénaire et l’époque séleucide, les scribes de Mésopotamie et d’Égypte produisent des tables, des exercices et des procédures numériques d’une grande sûreté : numération sexagésimale de position, tables de réciproques, problèmes du second degré, fractions unitaires, volumes de greniers et de pyramides. Rien n’y est démontré au sens grec, mais tout y est contrôlé par la pratique scolaire. Aux derniers siècles avant notre ère, les astronomes de Babylone et d’Uruk prolongent cette tradition par des éphémérides arithmétiques du Soleil, de la Lune et des planètes, dont les paramètres passeront chez Hipparque et Ptolémée.',
@@ -318,7 +318,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -530, end: 400, approx: true },
     continents: ['nombres'],
     places: ['Crotone', 'Tarente', 'Alexandrie'],
-    map: { x: 760, y: 560, size: 2, palette: { fill: '#f3ecdd', stroke: '#7d642c', accent: '#c49831' } },
+    map: { x: 760, y: 560, size: 2, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } },
     tagline: 'Des cailloux disposés en triangles aux problèmes indéterminés de Diophante : le nombre devient objet de science.',
     summary:
       'L’arithmétique grecque naît dans les cercles pythagoriciens d’Italie du Sud, où le nombre entier, figuré par des cailloux, est pensé comme principe de toutes choses, puis se constitue en théorie démonstrative dans les livres VII à IX des Éléments d’Euclide : divisibilité, nombres premiers, nombres parfaits. À l’époque impériale, Nicomaque de Gérase en fixe la version philosophique, qui nourrira tout le Moyen Âge latin, tandis que Diophante d’Alexandrie ouvre une voie entièrement différente, celle des problèmes indéterminés résolus en nombres rationnels avec une notation abrégée. Hypatie, qui commente Diophante, ferme cette histoire au début du Vᵉ siècle.',
@@ -647,7 +647,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -600, end: -250, approx: true },
     continents: ['formes', 'fondements'],
     places: ['Milet', 'Crotone', 'Athènes', 'Cnide', 'Alexandrie'],
-    map: { x: 450, y: 1250, size: 3, palette: { fill: '#d6e6f0', stroke: '#295875', accent: '#2f86bc' } },
+    map: { x: 450, y: 1250, size: 3, palette: { fill: '#cdddee', stroke: '#29496b', accent: '#28588a' } },
     tagline: 'Trois siècles pour inventer la démonstration, et un livre, les Éléments, pour en fixer la forme pendant deux millénaires.',
     summary:
       'Entre Thalès de Milet et Euclide d’Alexandrie, la géométrie grecque passe de recettes de mesure à une science démonstrative : on y prouve, à partir de principes explicites, des propositions générales sur des figures idéales. La découverte de l’incommensurabilité de la diagonale du carré, les trois problèmes classiques, la quadrature des lunules par Hippocrate de Chios, la théorie des proportions et la méthode d’exhaustion d’Eudoxe forment le matériau que les Éléments organisent vers 300 en treize livres. Ce livre, le plus édité après la Bible, définit pour l’Occident, le monde arabe et au-delà ce que signifie « démontrer ».',
@@ -996,7 +996,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -300, end: 350, approx: true },
     continents: ['analyse', 'formes'],
     places: ['Alexandrie', 'Syracuse', 'Pergé', 'Rhodes'],
-    map: { x: 560, y: 2250, size: 3, palette: { fill: '#d3c7ea', stroke: '#3b2466', accent: '#582bab' } },
+    map: { x: 560, y: 2250, size: 3, palette: { fill: '#dbcdee', stroke: '#44296b', accent: '#51288a' } },
     tagline: 'Mesurer le courbe, maîtriser les coniques, calculer le ciel : le sommet de la mathématique antique.',
     summary:
       'Après Euclide, la géométrie grecque atteint son plus haut degré de puissance avec Archimède, qui mesure le cercle, la parabole, la sphère et les spirales par exhaustion et découvre ses résultats par une méthode mécanique, et avec Apollonius, dont les Coniques restent inégalées jusqu’à Descartes. L’astronomie fournit un second foyer : Hipparque, puis Ptolémée dans l’Almageste, créent la trigonométrie des cordes et un modèle quantitatif du ciel qui absorbe les paramètres babyloniens. Héron d’Alexandrie représente la tradition métrique et mécanique, et Pappus, au IVᵉ siècle, dresse dans sa Collection l’inventaire de cet héritage, dont la redécouverte au XVIᵉ siècle lance la science moderne.',
@@ -1332,7 +1332,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -200, end: 500, approx: true },
     continents: ['hasard', 'nombres'],
     places: ['Chang’an', 'Luoyang', 'Jiankang'],
-    map: { x: 520, y: 3200, size: 2, palette: { fill: '#edd6cf', stroke: '#6d3726', accent: '#b44c2d' } },
+    map: { x: 520, y: 3200, size: 2, palette: { fill: '#edd2c9', stroke: '#683627', accent: '#863d27' } },
     tagline: 'Sur un tableau à baguettes, des procédures exactes pour mesurer, répartir et résoudre : une mathématique d’algorithmes sans axiomes.',
     summary:
       'La tradition mathématique chinoise se fixe sous les Han autour des Neuf Chapitres sur l’art mathématique, recueil de problèmes administratifs résolus par des procédures sur le tableau à baguettes : règle de trois, fausses positions, extractions de racines, mesure du cercle, et la méthode fangcheng qui résout des systèmes linéaires par élimination, avec des nombres négatifs dûment notés. En 263, Liu Hui commente le classique, en justifie les procédures et calcule π par itération sur les polygones ; vers 400, le Sunzi suanjing pose le premier problème de restes ; au Vᵉ siècle, Zu Chongzhi encadre π entre 3,1415926 et 3,1415927, un record millénaire. Cette tradition, indépendante de la Grèce, court sans rupture jusqu’à l’âge d’or des Song et des Yuan.',
@@ -1613,7 +1613,7 @@ export const ANTIQUITE: Domain[] = [
     period: { start: -450, end: 485, approx: true },
     continents: ['fondements'],
     places: ['Élée', 'Athènes', 'Stagire'],
-    map: { x: 480, y: 4150, size: 1, palette: { fill: '#c3e9d1', stroke: '#22623a', accent: '#2aa758' } },
+    map: { x: 480, y: 4150, size: 1, palette: { fill: '#c9edd5', stroke: '#27683d', accent: '#278647' } },
     tagline: 'Qu’est-ce que démontrer ? Des paradoxes de Zénon au commentaire de Proclus, la réflexion antique sur la preuve.',
     summary:
       'Les paradoxes de Zénon d’Élée, au milieu du Vᵉ siècle avant notre ère, mettent à l’épreuve les notions de divisibilité, de mouvement et d’infini ; Platon fait des mathématiques le modèle du savoir vrai et de la dialectique ; Aristote construit à Stagire puis à Athènes la première théorie formelle de la déduction, la syllogistique, et dans les Seconds Analytiques une théorie de la science démonstrative qui collera longtemps aux Éléments d’Euclide. Les stoïciens, avec Chrysippe, inventent une logique des propositions distincte de la logique des termes. Enfin Proclus, au Vᵉ siècle de notre ère, écrit en commentant Euclide la première histoire et la première philosophie des mathématiques proprement dites.',
diff --git a/src/data/domains/contemporain-a.ts b/src/data/domains/contemporain-a.ts
index 554df3f..66a3b47 100644
--- a/src/data/domains/contemporain-a.ts
+++ b/src/data/domains/contemporain-a.ts
@@ -50,7 +50,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1955, end: null },
     continents: ['nombres'],
     places: ['Princeton', 'Tokyo', 'Harvard', 'Bonn', 'Cambridge', 'Oxford', 'Durham (New Hampshire)'],
-    map: { x: 6300, y: 430, size: 3, palette: { fill: '#e8dbc0', stroke: '#5e4b21', accent: '#a37c29' } },
+    map: { x: 6300, y: 430, size: 3, palette: { fill: '#ede1c9', stroke: '#685227', accent: '#866727' } },
     tagline: 'Courbes elliptiques, formes modulaires et représentations de Galois : la marge de Fermat enfin remplie.',
     summary:
       'Après 1955, la théorie des nombres se réorganise autour de trois objets : les courbes elliptiques, les formes modulaires et les représentations du groupe de Galois. La conjecture de Taniyama–Shimura–Weil affirme que les deux premiers sont liés ; la lettre de Langlands à Weil (1967) élargit cette correspondance en un programme reliant formes automorphes et représentations galoisiennes. Armés des outils de la géométrie algébrique de Grothendieck, Faltings démontre la conjecture de Mordell (1983) et Wiles le dernier théorème de Fermat (1995). Parallèlement, les méthodes analytiques et combinatoires produisent le théorème de Green–Tao (2004) et les écarts bornés entre nombres premiers de Yitang Zhang (2013).',
@@ -480,7 +480,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1955, end: null },
     continents: ['nombres', 'formes'],
     places: ['Chicago', 'Cambridge', 'New Brunswick', 'Princeton', 'Moscou', 'Bonn', 'Pasadena'],
-    map: { x: 7000, y: 560, size: 2, palette: { fill: '#f0e6d6', stroke: '#755829', accent: '#bc862f' } },
+    map: { x: 7000, y: 560, size: 2, palette: { fill: '#f1ead5', stroke: '#73612b', accent: '#92782a' } },
     tagline: 'Dix mille pages pour classer les groupes finis simples, un Monstre qui parle aux formes modulaires, et des symétries déformées venues de la physique.',
     summary:
       'L’algèbre de la seconde moitié du XXᵉ siècle est dominée par un chantier collectif : la classification des groupes finis simples, ouverte par le théorème de Feit–Thompson (1963), organisée par Gorenstein (1972), annoncée en 1983 et achevée en 2004. En chemin apparaissent les groupes sporadiques de Conway et le Monstre, dont les liens inattendus avec les formes modulaires (« Monstrous Moonshine ») sont expliqués par Borcherds grâce aux algèbres de vertex. Parallèlement, Tits géométrise les groupes de Lie et algébriques par ses immeubles, Kac et Moody étendent les algèbres de Lie à la dimension infinie, Kazhdan et Lusztig refondent la théorie des représentations, et Drinfeld et Jimbo tirent de la physique statistique les groupes quantiques.',
@@ -892,7 +892,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1955, end: null },
     continents: ['formes', 'nombres'],
     places: ['Paris', 'Bures-sur-Yvette', 'Princeton', 'Harvard', 'Kyoto', 'Bonn'],
-    map: { x: 6300, y: 1300, size: 3, palette: { fill: '#dae9f1', stroke: '#2a5c79', accent: '#308bc0' } },
+    map: { x: 6300, y: 1300, size: 3, palette: { fill: '#cdddee', stroke: '#29486b', accent: '#28568a' } },
     tagline: 'Refonder la géométrie sur les faisceaux et les schémas, jusqu’à ce que les équations sur les corps finis livrent leur topologie.',
     summary:
       'Entre 1955 et 1970, la géométrie algébrique est reconstruite de fond en comble. Serre importe les faisceaux et la cohomologie dans la géométrie des variétés (FAC, 1955) ; Grothendieck élargit les variétés en schémas, les recouvrements en topologies, et rédige avec Dieudonné les Éléments de géométrie algébrique tout en animant le séminaire de l’IHÉS. La cohomologie étale, construite pour les conjectures de Weil, permet à Deligne de les démontrer en 1974. Hironaka résout les singularités, Mumford construit les espaces de modules, Mori relance la classification birationnelle en dimension 3, tandis que Kontsevich et Voevodsky prolongent l’héritage vers la physique des cordes et la théorie homotopique des schémas.',
@@ -1292,7 +1292,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1956, end: null },
     continents: ['formes'],
     places: ['Princeton', 'Berkeley', 'Oxford', 'Bures-sur-Yvette', 'Saint-Pétersbourg', 'Stony Brook', 'Stanford'],
-    map: { x: 7000, y: 1500, size: 3, palette: { fill: '#c0d6e8', stroke: '#21445e', accent: '#296ea3' } },
+    map: { x: 7000, y: 1500, size: 3, palette: { fill: '#c6daec', stroke: '#264764', accent: '#265782' } },
     tagline: 'Classer les variétés dimension par dimension : sphères exotiques, chirurgie, théories de jauge, et le flot de Ricci qui éteint la conjecture de Poincaré.',
     summary:
       'La découverte des sphères exotiques de Milnor (1956) ouvre l’ère de la topologie différentielle : cobordisme de Thom, théorème du h-cobordisme de Smale (1961), qui règle la conjecture de Poincaré en dimension au moins 5. La dimension 4 résiste : Freedman la traite topologiquement (1982), Donaldson révèle par les théories de jauge des phénomènes différentiables sans analogue (1983), et la dimension 3 est réorganisée par la conjecture de géométrisation de Thurston (1982), démontrée par Perelman (2003) au moyen du flot de Ricci de Hamilton. En parallèle, le théorème de l’indice d’Atiyah–Singer (1963) relie topologie et analyse, et le polynôme de Jones (1984) fonde la topologie quantique. Le domaine est marqué par deux premières : Edward Witten, premier physicien médaillé Fields (1990), et Maryam Mirzakhani, première femme médaillée (2014).',
@@ -1725,7 +1725,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1954, end: null },
     continents: ['analyse', 'hasard'],
     places: ['Moscou', 'MIT', 'Berkeley', 'Bures-sur-Yvette', 'Los Alamos', 'Orsay'],
-    map: { x: 6250, y: 2200, size: 2, palette: { fill: '#ccc0e8', stroke: '#35215e', accent: '#5029a3' } },
+    map: { x: 6250, y: 2200, size: 2, palette: { fill: '#d9c6ec', stroke: '#452664', accent: '#542682' } },
     tagline: 'Des solutions régulières qui persistent aux orbites qui se mélangent : l’imprévisible devient un objet mathématique.',
     summary:
       'Le théorème KAM (1954-1963) établit la persistance des mouvements quasi périodiques sous petite perturbation, tandis que la théorie ergodique, relancée par Kolmogorov et Sinaï (entropie, 1958-1959), mesure le mélange. Lorenz exhibe en 1963 un attracteur sensible aux conditions initiales, Ruelle et Takens en font le modèle de la turbulence (1971), et Feigenbaum découvre des constantes universelles dans la route vers le chaos (1978). Mandelbrot impose les fractales comme géométrie du désordre ; l’école d’Orsay (Douady, Hubbard, Yoccoz) fournit à la dynamique holomorphe ses outils, de la connexité de l’ensemble de Mandelbrot à l’optimalité de la condition de Bruno.',
@@ -2116,7 +2116,7 @@ export const CONTEMPORAIN_A: Domain[] = [
     period: { start: 1957, end: null },
     continents: ['analyse'],
     places: ['Princeton', 'Chicago', 'Lund', 'New York', 'Pise', 'Paris', 'Los Angeles'],
-    map: { x: 6950, y: 2350, size: 2, palette: { fill: '#e5ddf3', stroke: '#472c7d', accent: '#6231c4' } },
+    map: { x: 6950, y: 2350, size: 2, palette: { fill: '#e0d5f1', stroke: '#472b73', accent: '#522a92' } },
     tagline: 'Estimer, localiser, régulariser : l’art de dompter les solutions des équations de la physique.',
     summary:
       'L’analyse de la seconde moitié du XXᵉ siècle s’organise autour des équations aux dérivées partielles et de l’analyse harmonique « dure ». L’école de Chicago (Calderón, Zygmund, puis Stein et Fefferman à Princeton) fait des intégrales singulières un calcul d’opérateurs ; De Giorgi et Nash démontrent la régularité des solutions elliptiques (1957), Hörmander et Nirenberg fondent l’analyse microlocale. Crandall et Lions introduisent les solutions de viscosité (1983), Bourgain transpose l’analyse harmonique aux équations dispersives, et le transport optimal (Villani) et la théorie cinétique (amortissement Landau, Mouhot–Villani) réunissent probabilités, géométrie et physique. La régularité des équations de Navier–Stokes, posée comme problème du millénaire en 2000, résiste toujours.',
diff --git a/src/data/domains/contemporain-b.ts b/src/data/domains/contemporain-b.ts
index d8dd792..f92747f 100644
--- a/src/data/domains/contemporain-b.ts
+++ b/src/data/domains/contemporain-b.ts
@@ -70,7 +70,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1947, end: null },
     continents: ['hasard', 'nombres'],
     places: ['Budapest', 'Toronto', 'Waterloo', 'Urbana', 'Princeton', 'Cambridge', 'MIT'],
-    map: { x: 6250, y: 3000, size: 2, palette: { fill: '#eaccc7', stroke: '#662d24', accent: '#ab3c2b' } },
+    map: { x: 6250, y: 3000, size: 2, palette: { fill: '#eccdc6', stroke: '#643126', accent: '#823726' } },
     tagline: 'Compter sans énumérer, prouver l’existence en tirant au sort, colorier une carte avec douze cents heures de machine.',
     summary:
       'Longtemps tenue pour un recueil de récréations, la combinatoire devient après 1945 une discipline à part entière, portée par l’école hongroise autour de Paul Erdős et par les besoins nouveaux de l’informatique. Trois gestes la caractérisent : la méthode probabiliste, qui établit l’existence d’un objet en montrant qu’un objet tiré au hasard convient presque toujours ; la théorie des graphes structurelle, de Tutte aux mineurs de Robertson et Seymour ; et la combinatoire énumérative et additive, qui, de Rota à Szemerédi et Gowers, relie les dénombrements à l’algèbre et à l’analyse. La démonstration du théorème des quatre couleurs par ordinateur (1976) en fait aussi le lieu d’un débat sur ce qu’est une preuve.',
@@ -480,7 +480,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1955, end: null },
     continents: ['hasard'],
     places: ['Princeton', 'Stanford', 'Ithaca', 'Paris', 'Rehovot', 'Genève', 'Warwick'],
-    map: { x: 6950, y: 3250, size: 2, palette: { fill: '#eed6d2', stroke: '#713028', accent: '#b83e2e' } },
+    map: { x: 6950, y: 3250, size: 2, palette: { fill: '#f1ddd5', stroke: '#73402b', accent: '#92482a' } },
     tagline: 'Des matrices nucléaires aux données massives : le hasard devient géométrie, la statistique devient calcul.',
     summary:
       'Après l’axiomatisation de Kolmogorov, les probabilités se déplacent vers l’étude des phénomènes critiques : matrices aléatoires (la loi du demi-cercle de Wigner, la distribution de Tracy–Widom), percolation et marches aléatoires (Kesten), inégalités de concentration (Talagrand), puis courbes aléatoires conformément invariantes (SLE de Schramm, travaux de Werner et Smirnov) et équations aux dérivées partielles stochastiques singulières (Hairer). La statistique connaît parallèlement une révolution computationnelle : l’analyse exploratoire de Tukey, le bootstrap d’Efron, le Lasso de Tibshirani et l’acquisition comprimée de Donoho, Candès et Tao font du calcul intensif une méthode d’inférence.',
@@ -891,7 +891,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1948, end: null },
     continents: ['hasard', 'nombres'],
     places: ['Murray Hill', 'Stanford', 'MIT', 'Rehovot', 'Seattle', 'Cheltenham'],
-    map: { x: 6600, y: 3560, size: 2, palette: { fill: '#f0dad6', stroke: '#753429', accent: '#bc442f' } },
+    map: { x: 6600, y: 3560, size: 2, palette: { fill: '#eed8cd', stroke: '#6b3e29', accent: '#8a4728' } },
     tagline: 'Après Shannon, le secret devient un objet mathématique ; après Diffie et Hellman, il se passe de clé partagée.',
     summary:
       'En 1948-1949, Claude Shannon donne à la communication et au secret des fondements mathématiques : l’entropie mesure l’information, et la sécurité parfaite s’énonce comme un théorème. Deux branches s’ensuivent aux laboratoires Bell : les codes correcteurs d’erreurs (Hamming, Reed–Solomon, algorithmes de Berlekamp), qui rendent possible la transmission fiable sur des canaux bruités, et la cryptographie, bouleversée en 1976 par la clé publique de Diffie et Hellman, puis par RSA (1977). À partir de 1982, Goldwasser, Micali et leurs successeurs refondent la discipline sur la théorie de la complexité : sécurité prouvable, chiffrement probabiliste, preuves à divulgation nulle de connaissance.',
@@ -1292,7 +1292,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1959, end: null },
     continents: ['fondements', 'hasard'],
     places: ['Toronto', 'Berkeley', 'Moscou', 'Stanford', 'Harvard', 'Jérusalem', 'Princeton'],
-    map: { x: 6250, y: 3900, size: 3, palette: { fill: '#cbecd5', stroke: '#256a3b', accent: '#2caf56' } },
+    map: { x: 6250, y: 3900, size: 3, palette: { fill: '#cdeed8', stroke: '#296b3f', accent: '#288a49' } },
     tagline: 'Ce qui est calculable est acquis depuis Turing ; reste à savoir ce qui est calculable en temps raisonnable.',
     summary:
       'De la calculabilité des années 1930, l’informatique théorique hérite les modèles de calcul ; elle y ajoute la question du coût. Hartmanis et Stearns fondent en 1965 la théorie de la complexité, Cook et Levin montrent en 1971 que le problème de satisfaisabilité capte toute la classe NP, et Karp montre en 1972 que des dizaines de problèmes concrets partagent ce statut. Le problème P = NP devient la grande question ouverte du siècle. Autour de lui : l’analyse d’algorithmes (Knuth), les algorithmes rapides (Strassen), le comptage (Valiant), les bornes inférieures (Razborov), la dérandomisation et le pseudo-aléa (Wigderson), les preuves vérifiables probabilistiquement (théorème PCP) et l’algorithme quantique de Shor (1994), qui fait de la factorisation un problème facile... pour une machine qui n’existe pas encore.',
@@ -1723,7 +1723,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1960, end: null },
     continents: ['fondements'],
     places: ['Stanford', 'Berkeley', 'Jérusalem', 'Stockholm', 'Leningrad', 'Paris', 'Oxford'],
-    map: { x: 6950, y: 4100, size: 2, palette: { fill: '#c3e9ca', stroke: '#22622e', accent: '#2aa741' } },
+    map: { x: 6950, y: 4100, size: 2, palette: { fill: '#c6ecd3', stroke: '#26643c', accent: '#268246' } },
     tagline: 'Après Gödel, l’indécidable devient un outil : on construit des univers ensemblistes comme on construit des contre-exemples.',
     summary:
       'La logique d’après-guerre hérite du programme de Hilbert brisé par Gödel et le transforme. En 1963, Paul Cohen invente le forcing et démontre l’indépendance de l’hypothèse du continu : les axiomes ZF n’épuisent pas l’infini. Solovay, Shelah, Woodin explorent depuis les mondes possibles de la théorie des ensembles, où les grands cardinaux servent d’échelle de consistance. Parallèlement, la théorie des modèles (Morley, Ax–Kochen, Shelah, Hrushovski) applique la logique à l’algèbre et à la géométrie, l’analyse non standard de Robinson légalise les infiniment petits, et les théories des types de Martin-Löf, Girard et Voevodsky fondent un langage où preuve et programme coïncident — jusqu’aux fondements univalents.',
@@ -2166,7 +2166,7 @@ export const CONTEMPORAIN_B: Domain[] = [
     period: { start: 1946, end: null },
     continents: ['analyse', 'fondements'],
     places: ['Los Alamos', 'New York', 'Teddington', 'Yorktown Heights', 'Eindhoven', 'Linz', 'Rocquencourt', 'Pittsburgh'],
-    map: { x: 6620, y: 2560, size: 2, palette: { fill: '#cdc3e9', stroke: '#332262', accent: '#4b2aa7' } },
+    map: { x: 6620, y: 2560, size: 2, palette: { fill: '#d4c6ec', stroke: '#3e2664', accent: '#492682' } },
     tagline: 'La machine calcule d’abord pour la physique et la guerre ; bientôt elle calcule des preuves, puis les vérifie.',
     summary:
       'L’ordinateur, conçu pendant la Seconde Guerre mondiale, transforme la pratique mathématique. Trois traditions se distinguent : l’analyse numérique (méthode de Monte-Carlo d’Ulam et Metropolis, analyse d’erreur de Wilkinson, théorème d’équivalence de Lax, FFT de Cooley et Tukey, SVD de Golub), qui fait du calcul approché une science de la stabilité ; le calcul formel (bases de Gröbner de Buchberger, algorithmes de Risch et de Zeilberger), qui exécute exactement ce que l’analyste faisait à la main ; et la démonstration assistée, de l’Automath de de Bruijn au calcul des constructions de Coquand et Huet, jusqu’aux preuves formelles des quatre couleurs (Gonthier), de la conjecture de Kepler (Hales, projet Flyspeck) et du « liquid tensor experiment » en Lean.',
diff --git a/src/data/domains/dixneuvieme-a.ts b/src/data/domains/dixneuvieme-a.ts
index d2b7fde..30f0bba 100644
--- a/src/data/domains/dixneuvieme-a.ts
+++ b/src/data/domains/dixneuvieme-a.ts
@@ -26,7 +26,7 @@ export const DIXNEUVIEME_A: Domain[] = [
     period: { start: 1796, end: 1900 },
     continents: ['nombres'],
     places: ['Göttingen', 'Berlin', 'Breslau', 'Saint-Pétersbourg', 'Paris', 'Louvain'],
-    map: { x: 3600, y: 430, size: 3, palette: { fill: '#f1e7da', stroke: '#79572a', accent: '#c08130' } },
+    map: { x: 3600, y: 430, size: 3, palette: { fill: '#f1e9d5', stroke: '#735d2b', accent: '#92732a' } },
     tagline: 'Un livre de 1801 fixe les questions ; un siècle entier apprend à le lire.',
     summary:
       'Les Disquisitiones arithmeticae de Carl Friedrich Gauss (1801) donnent à l’arithmétique des entiers un langage, les congruences, un objet central, les formes quadratiques et leur composition, et un premier grand théorème démontré, la loi de réciprocité quadratique. Tout le siècle se règle sur ce livre : Dirichlet y introduit des séries nouvelles et démontre en 1837 que toute progression arithmétique convenable contient une infinité de nombres premiers ; Kummer invente les nombres idéaux pour sauver l’unicité de la factorisation dans les entiers cyclotomiques ; Dedekind les refonde en théorie générale des idéaux. À Saint-Pétersbourg, Tchebychev encadre le comptage des nombres premiers ; en 1896, sur la voie ouverte par le mémoire de Riemann de 1859, Hadamard et de La Vallée Poussin démontrent le théorème des nombres premiers.',
@@ -404,7 +404,7 @@ export const DIXNEUVIEME_A: Domain[] = [
     period: { start: 1799, end: 1895 },
     continents: ['nombres'],
     places: ['Modène', 'Christiania', 'Paris', 'Dublin', 'Cambridge', 'Stettin', 'Leipzig'],
-    map: { x: 4250, y: 580, size: 3, palette: { fill: '#f3ebdd', stroke: '#7d5e2c', accent: '#c48c31' } },
+    map: { x: 4250, y: 580, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } },
     tagline: 'Pourquoi le cinquième degré résiste : une question d’équations devient la science des symétries.',
     summary:
       'Trois siècles après la résolution des équations du troisième et du quatrième degré, Ruffini puis Abel démontrent que l’équation générale du cinquième degré ne se résout pas par radicaux. Galois va plus loin : à chaque équation il attache un groupe de permutations de ses racines, dont la structure décide de la résolubilité — mais ses mémoires, refusés ou égarés, ne sont publiés par Liouville qu’en 1846. Pendant ce temps, l’algèbre se démultiplie : quaternions de Hamilton (1843), Ausdehnungslehre de Grassmann (1844), matrices de Cayley (1858). Après 1870, le Traité des substitutions de Jordan, les théorèmes de Sylow et les groupes continus de Lie font du groupe lui-même l’objet central de l’algèbre.',
@@ -795,7 +795,7 @@ export const DIXNEUVIEME_A: Domain[] = [
     period: { start: 1827, end: 1890 },
     continents: ['formes', 'fondements'],
     places: ['Göttingen', 'Kazan', 'Marosvásárhely', 'Bologne', 'Erlangen', 'Leipzig'],
-    map: { x: 3620, y: 1300, size: 3, palette: { fill: '#cfdeed', stroke: '#264b6d', accent: '#2d72b4' } },
+    map: { x: 3620, y: 1300, size: 3, palette: { fill: '#c6dbec', stroke: '#264964', accent: '#265a82' } },
     tagline: 'Le postulat des parallèles cède : l’espace peut être courbe, et la géométrie devient plurielle.',
     summary:
       'Après deux mille ans d’attaques infructueuses contre le cinquième postulat d’Euclide, Gauss, Lobatchevski et János Bolyai construisent indépendamment une géométrie où par un point extérieur à une droite passent plusieurs parallèles. Publiés à Kazan (1829) et en appendice d’un livre hongrois (1832), ces résultats restent d’abord lettre morte. Deux déplacements les font accepter : la géométrie différentielle de Gauss (1827) et Riemann (1854), qui donnent à la courbure un sens intrinsèque, puis les modèles de Beltrami (1868) et Klein (1871), qui montrent que la géométrie hyperbolique est aussi consistante que la géométrie euclidienne. Avec le programme d’Erlangen (1872) et les axiomes d’ordre de Pasch (1882), la géométrie cesse d’être la science d’un espace unique.',
@@ -1146,7 +1146,7 @@ export const DIXNEUVIEME_A: Domain[] = [
     period: { start: 1822, end: 1900 },
     continents: ['formes'],
     places: ['Paris', 'Nîmes', 'Berlin', 'Bonn', 'Leipzig', 'Milan', 'Rome'],
-    map: { x: 4250, y: 1500, size: 2, palette: { fill: '#cfe3ed', stroke: '#26576d', accent: '#2d89b4' } },
+    map: { x: 4250, y: 1500, size: 2, palette: { fill: '#cde0ee', stroke: '#294e6b', accent: '#28608a' } },
     tagline: 'Ce qui survit à la projection devient l’essentiel : incidence, dualité et invariants.',
     summary:
       'Élève de Monge, Poncelet rédige en captivité à Saratov ce qui devient le Traité des propriétés projectives des figures (1822) : il isole les propriétés conservées par projection — incidence, birapport, coniques — et leur adjoint le principe de continuité. Gergonne oppose à Carnot le principe de dualité (1826) : en géométrie projective plane, points et droites échangent leurs rôles. Möbius (1827) et Plücker (1829) donnent à cette géométrie ses coordonnées — barycentriques puis homogènes —, Steiner sa construction systématique. Après 1850, la jonction avec l’algèbre anglaise des invariants et les surfaces de Riemann fait naître la géométrie algébrique : les 27 droites de la surface cubique (1849), les transformations birationnelles de Cremona (1863), le théorème de Riemann–Roch (1865).',
@@ -1493,7 +1493,7 @@ export const DIXNEUVIEME_A: Domain[] = [
     period: { start: 1817, end: 1897 },
     continents: ['analyse'],
     places: ['Prague', 'Paris', 'Königsberg', 'Berlin', 'Göttingen'],
-    map: { x: 3620, y: 2200, size: 3, palette: { fill: '#cec0e8', stroke: '#37215e', accent: '#5429a3' } },
+    map: { x: 3620, y: 2200, size: 3, palette: { fill: '#d8cdee', stroke: '#3f296b', accent: '#49288a' } },
     tagline: 'Fini les infiniment petits « évidents » : limites, ε et δ prennent le relais de l’intuition.',
     summary:
       'En 1817, Bolzano démontre « purement analytiquement » le théorème des valeurs intermédiaires ; en 1821, le Cours d’analyse de Cauchy définit limites, continuité et convergence des séries. Ce nouveau régime de preuve déplace toute l’analyse : les fonctions elliptiques d’Abel et Jacobi, le calcul des résidus de Cauchy, les surfaces et l’intégrale de Riemann, les nombres transcendants de Liouville. À Berlin, Weierstrass achève le mouvement : définitions en ε-δ, convergence uniforme, fonctions continues nulle part dérivables (1872), pendant que Dedekind et Cantor fondent le continu sur l’arithmétique. En 1885, le théorème d’approximation de Weierstrass couronne cette « arithmétisation » : toute fonction continue est limite uniforme de polynômes.',
diff --git a/src/data/domains/dixneuvieme-b.ts b/src/data/domains/dixneuvieme-b.ts
index a99635e..1e6e86a 100644
--- a/src/data/domains/dixneuvieme-b.ts
+++ b/src/data/domains/dixneuvieme-b.ts
@@ -32,7 +32,7 @@ export const DIXNEUVIEME_B: Domain[] = [
     period: { start: 1807, end: 1900 },
     continents: ['analyse'],
     places: ['Paris', 'Grenoble', 'Nottingham', 'Cambridge', 'Édimbourg', 'Stockholm'],
-    map: { x: 4250, y: 2400, size: 2, palette: { fill: '#e1d6f0', stroke: '#492975', accent: '#6a2fbc' } },
+    map: { x: 4250, y: 2400, size: 2, palette: { fill: '#ddcdee', stroke: '#48296b', accent: '#56288a' } },
     tagline: 'La chaleur, l’électricité et la lumière mises en équations : les séries de Fourier et le potentiel refont l’analyse.',
     summary:
       'En 1807, Joseph Fourier dépose à l’Institut un mémoire sur la propagation de la chaleur qui représente toute fonction par une somme de sinus et de cosinus et pose l’équation aux dérivées partielles de la diffusion. Autour de lui et après lui, Poisson, Green, Stokes et Maxwell construisent une théorie mathématique du potentiel, des fluides visqueux et du champ électromagnétique, tandis que Hamilton réécrit la dynamique sous forme canonique. La discipline fournit à l’analyse ses problèmes les plus féconds — convergence des séries trigonométriques, principe de Dirichlet, problème de Cauchy — et, avec Kovalevskaïa et Poincaré, ses premiers théorèmes généraux d’existence et ses premières limites.',
@@ -419,7 +419,7 @@ export const DIXNEUVIEME_B: Domain[] = [
     period: { start: 1809, end: 1900 },
     continents: ['hasard'],
     places: ['Bruxelles', 'Paris', 'Londres', 'Saint-Pétersbourg'],
-    map: { x: 3975, y: 3230, size: 2, palette: { fill: '#eed7d2', stroke: '#713428', accent: '#b8452e' } },
+    map: { x: 3975, y: 3230, size: 2, palette: { fill: '#f0d7d1', stroke: '#6f382a', accent: '#8e3e29' } },
     tagline: 'De l’erreur de l’astronome à l’homme moyen, puis à la corrélation : la courbe en cloche conquiert la société.',
     summary:
       'Au début du siècle, Gauss et Laplace achèvent la théorie des erreurs d’observation : la loi normale justifie la méthode des moindres carrés et la moyenne arithmétique. Adolphe Quetelet transporte cette courbe de l’astronomie vers les tailles, les naissances et les crimes et invente l’« homme moyen », pendant que les bureaux de statistique des États accumulent les tableaux. Bienaymé à Paris, Tchebychev à Saint-Pétersbourg donnent à la loi des grands nombres et au théorème central limite leurs premières démonstrations générales. À la fin du siècle, Galton, Edgeworth et Karl Pearson, partis de l’hérédité et de l’évolution, inventent la régression, la corrélation et le test du χ² : la statistique mathématique est née.',
@@ -785,7 +785,7 @@ export const DIXNEUVIEME_B: Domain[] = [
     period: { start: 1837, end: 1900 },
     continents: ['fondements', 'hasard'],
     places: ['Londres', 'Cambridge', 'Cork', 'Iéna', 'Turin', 'Cambridge (Mass.)'],
-    map: { x: 4300, y: 4000, size: 2, palette: { fill: '#d2eedc', stroke: '#287141', accent: '#2eb85e' } },
+    map: { x: 4300, y: 4000, size: 2, palette: { fill: '#cdeedb', stroke: '#296b44', accent: '#288a51' } },
     tagline: 'Les raisonnements deviennent un calcul : Boole algébrise la syllogistique, Frege invente l’écriture conceptuelle, Babbage rêve la machine.',
     summary:
       'En 1837, Charles Babbage dessine sa machine analytique, machine à calculer universelle que les notes d’Ada Lovelace (1843) dotent du premier programme publié. La même décennie voit la logique sortir de la syllogistique : De Morgan en 1847, Boole en 1847 et 1854 en font une algèbre où l’on calcule sur les classes comme sur les nombres. Jevons, Peirce et Schröder systématisent cette algèbre et y ajoutent la théorie des relations. En 1879, Frege rompt avec cette tradition en créant la Begriffsschrift, première notation du calcul des prédicats avec quantificateurs, avant de fonder l’arithmétique sur la logique ; Peano, à Turin, achève le siècle en dotant les mathématiques d’un langage symbolique et l’arithmétique de ses axiomes.',
@@ -1181,7 +1181,7 @@ export const DIXNEUVIEME_B: Domain[] = [
     period: { start: 1872, end: 1914 },
     continents: ['fondements'],
     places: ['Halle', 'Brunswick', 'Göttingen', 'Turin'],
-    map: { x: 3650, y: 4150, size: 3, palette: { fill: '#ddf3e6', stroke: '#2c7d4d', accent: '#31c46e' } },
+    map: { x: 3650, y: 4150, size: 3, palette: { fill: '#d5f1e0', stroke: '#2b7348', accent: '#2a9254' } },
     tagline: 'En comptant au-delà de l’infini, Cantor donne aux mathématiques leur langue commune — et sa première crise.',
     summary:
       'En étudiant l’unicité des séries trigonométriques, Georg Cantor introduit en 1872 les ensembles dérivés de points, puis démontre en 1874 que les nombres réels ne sont pas dénombrables : il y a plusieurs infinis. En trente ans, il construit les ordinaux et les cardinaux transfinis (ℵ₀, 2^ℵ₀), prouve que le continu a la puissance de la droite et formule l’hypothèse du continu, pendant que Dedekind fonde les entiers sur la théorie des ensembles. Vers 1900, les paradoxes de Burali-Forti et de Russell montrent que la notion intuitive d’ensemble est contradictoire ; Zermelo répond par l’axiome du choix (1904) puis par la première axiomatisation de la théorie (1908), que Hausdorff parachève en 1914 dans les Grundzüge der Mengenlehre.',
diff --git a/src/data/domains/lumieres.ts b/src/data/domains/lumieres.ts
index cf2af7c..4edf7f9 100644
--- a/src/data/domains/lumieres.ts
+++ b/src/data/domains/lumieres.ts
@@ -24,7 +24,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1700, end: 1790 },
     continents: ['analyse'],
     places: ['Bâle', 'Saint-Pétersbourg', 'Berlin', 'Paris'],
-    map: { x: 2900, y: 2100, size: 3, palette: { fill: '#e6ddf3', stroke: '#4d2c7d', accent: '#6e31c4' } },
+    map: { x: 2900, y: 2100, size: 3, palette: { fill: '#e2d5f1', stroke: '#4e2b73', accent: '#5d2a92' } },
     tagline: 'Le calcul de Leibniz devient une science des fonctions, des séries et des équations différentielles, écrite pour l’essentiel par un seul homme.',
     summary:
       'Entre les leçons de Jean Bernoulli à Bâle et la mort d’Euler à Saint-Pétersbourg, le calcul différentiel et intégral change de nature : il cesse d’être une méthode pour les courbes et devient l’analyse, c’est-à-dire l’étude des fonctions, des séries et des équations différentielles. Euler lui donne sa langue (f(x), e, i, π, Σ), ses manuels (Introductio, Institutiones) et ses résultats emblématiques, du problème de Bâle à la formule e^(iθ) = cos θ + i sin θ. Autour de lui, Taylor, Daniel Bernoulli, Clairaut et d’Alembert appliquent ce calcul aux fluides, aux cordes vibrantes et à la figure de la Terre, et ouvrent la théorie des équations aux dérivées partielles.',
@@ -338,7 +338,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1740, end: 1830 },
     continents: ['analyse', 'formes'],
     places: ['Paris', 'Berlin', 'Turin'],
-    map: { x: 3100, y: 2600, size: 2, palette: { fill: '#dfd2ee', stroke: '#4a2871', accent: '#6e2eb8' } },
+    map: { x: 3100, y: 2600, size: 2, palette: { fill: '#e3d5f1', stroke: '#4f2b73', accent: '#5e2a92' } },
     tagline: 'La mécanique quitte les figures et les leviers pour devenir un calcul : des équations déduites de principes, sans un seul dessin.',
     summary:
       'Entre le Traité de dynamique de d’Alembert (1743) et les derniers volumes de la Mécanique céleste (1825), la mécanique newtonienne est refondée en une science d’équations. Maupertuis y introduit le principe de moindre action, Lagrange les équations générales du mouvement fondées sur les vitesses virtuelles et le calcul des variations, Laplace la théorie du potentiel et le calcul des perturbations planétaires. En 1788, la Méchanique analitique de Lagrange se flatte de ne contenir aucune figure : la géométrie du mouvement est devenue de l’analyse pure, et la mécanique céleste le premier succès de la physique mathématique.',
@@ -651,7 +651,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1730, end: 1800 },
     continents: ['nombres'],
     places: ['Saint-Pétersbourg', 'Berlin', 'Cambridge', 'Paris'],
-    map: { x: 2975, y: 500, size: 2, palette: { fill: '#ece4cb', stroke: '#6a5925', accent: '#af8f2c' } },
+    map: { x: 2975, y: 500, size: 2, palette: { fill: '#ece1c6', stroke: '#645226', accent: '#826826' } },
     tagline: 'Les énigmes laissées par Fermat deviennent des théorèmes démontrés, et les nombres premiers rencontrent l’analyse.',
     summary:
       'Pendant soixante-dix ans, la théorie des nombres est presque l’œuvre d’un seul homme : Euler démontre un à un les énoncés de Fermat, du petit théorème aux deux carrés, introduit l’indicatrice φ(n) et relie les nombres premiers à la fonction ζ par le produit eulérien. Autour de sa correspondance avec Goldbach naissent les grandes conjectures ; avec Lagrange (quatre carrés, équation de Pell, théorème de Wilson), Waring et Legendre (réciprocité quadratique, formes quadratiques), l’arithmétique devient une théorie organisée, que l’Essai sur la théorie des nombres (1798) transmet à Gauss.',
@@ -974,7 +974,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1730, end: 1810 },
     continents: ['formes'],
     places: ['Milan', 'Berlin', 'Saint-Pétersbourg', 'Mézières', 'Paris'],
-    map: { x: 2975, y: 1400, size: 2, palette: { fill: '#cfdeed', stroke: '#264a6d', accent: '#2d70b4' } },
+    map: { x: 2975, y: 1400, size: 2, palette: { fill: '#d1e2f0', stroke: '#2a516f', accent: '#29638e' } },
     tagline: 'Entre la critique du cinquième postulat et la géométrie des surfaces, le XVIIIᵉ siècle prépare sans le savoir les géométries non euclidiennes.',
     summary:
       'La géométrie du siècle des Lumières avance sur trois fronts. Celui des fondements : Saccheri (1733) puis Lambert (1766) explorent les conséquences de la négation du postulat des parallèles, sans oser conclure à une géométrie autre. Celui des courbes et des surfaces : Clairaut ouvre la géométrie différentielle de l’espace (1731), Euler définit les courbures principales (1760), Meusnier son théorème (1776). Celui enfin des configurations : Euler compte les ponts de Königsberg (1736) et les faces des polyèdres (1750), Monge fonde la géométrie descriptive (1799) et Carnot la géométrie de position (1803), prémices de la topologie et du renouveau projectif.',
@@ -1275,7 +1275,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1718, end: 1812 },
     continents: ['hasard'],
     places: ['Londres', 'Paris', 'Tunbridge Wells'],
-    map: { x: 2975, y: 3250, size: 2, palette: { fill: '#eedcd2', stroke: '#714028', accent: '#b85c2e' } },
+    map: { x: 2975, y: 3250, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } },
     tagline: 'Du calcul des jeux à la probabilité des causes : le hasard devient un instrument de raisonnement sur le monde.',
     summary:
       'Après l’Ars conjectandi (1713), le calcul des probabilités change d’échelle et d’ambition. De Moivre en fait un outil d’approximation (loi normale, 1733), Bayes et Price retournent la question des causes (1763), Buffon y soumet la géométrie (aiguille, 1777) et Condorcet les votes (1785). Laplace couronne le siècle : la Théorie analytique des probabilités (1812) unifie analyse des erreurs, probabilité inverse et grands nombres, pendant que Legendre publie la méthode des moindres carrés (1805). Le « calcul » devient le langage de l’incertitude raisonnable.',
@@ -1614,7 +1614,7 @@ export const LUMIERES: Domain[] = [
     period: { start: 1696, end: 1797 },
     continents: ['fondements', 'analyse'],
     places: ['Paris', 'Dublin', 'Édimbourg', 'Berlin'],
-    map: { x: 2975, y: 4120, size: 1, palette: { fill: '#c0e8c9', stroke: '#215e2f', accent: '#29a345' } },
+    map: { x: 2975, y: 4120, size: 1, palette: { fill: '#cdeed9', stroke: '#296b40', accent: '#288a4b' } },
     tagline: 'Que vaut une différentielle ? Un siècle d’objections, de l’Académie de Paris à l’évêque de Cloyne.',
     summary:
       'Le calcul infinitésimal triomphe dès sa première publication française, l’Analyse des infiniment petits de L’Hôpital (1696) ; mais sa logique est aussitôt contestée. Rolle attaque à l’Académie (1701), Varignon défend ; Berkeley dénonce les « fantômes de quantités disparues » (1734), Maclaurin répond par un traité en deux volumes (1742) ; d’Alembert propose la limite dans l’Encyclopédie (1765) et Lagrange tente de fonder le tout sur les séries de Taylor (1797). La querelle, jamais tranchée au siècle, prépare la refonte de l’analyse par Cauchy et Weierstrass.',
diff --git a/src/data/domains/medieval.ts b/src/data/domains/medieval.ts
index 6fe73dc..e5187ea 100644
--- a/src/data/domains/medieval.ts
+++ b/src/data/domains/medieval.ts
@@ -49,7 +49,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 400, end: 1550, approx: true },
     continents: ['nombres', 'analyse'],
     places: ['Kusumapura', 'Ujjain', 'Bijapur', 'Kerala'],
-    map: { x: 1230, y: 430, size: 3, palette: { fill: '#ede1cf', stroke: '#6d5126', accent: '#b47e2d' } },
+    map: { x: 1230, y: 430, size: 3, palette: { fill: '#ecddc6', stroke: '#644b26', accent: '#825d26' } },
     tagline: 'Des versets à mémoriser qui contiennent le zéro, le sinus, les équations indéterminées et, au bout de mille ans, les séries infinies.',
     summary:
       'Entre le Vᵉ et le XVIᵉ siècle, les astronomes-mathématiciens de l’Inde composent en vers sanskrits des traités (siddhānta) où la mathématique sert d’abord au calcul des mouvements célestes. Āryabhaṭa (499) y introduit la table des sinus et la résolution des équations linéaires indéterminées ; Brahmagupta (628) fixe les règles du zéro et des nombres négatifs et étudie les quadrilatères inscrits ; Bhāskara II (vers 1150) donne à l’algèbre sa forme classique avec la méthode chakravāla. Transmise au monde islamique au VIIIᵉ siècle, la numération décimale de position est l’héritage le plus universel de cette tradition. Au Kerala, de Mādhava (vers 1400) à Nīlakaṇṭha (1500), une école isolée découvre les développements en série du sinus, du cosinus et de l’arc tangente, deux siècles et demi avant Newton et Leibniz.',
@@ -400,7 +400,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 800, end: 1300, approx: true },
     continents: ['nombres'],
     places: ['Bagdad', 'Le Caire', 'Ispahan', 'Nichapour'],
-    map: { x: 1600, y: 620, size: 3, palette: { fill: '#ede4cf', stroke: '#6d5826', accent: '#b48b2d' } },
+    map: { x: 1600, y: 620, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } },
     tagline: 'À Bagdad, un « abrégé du calcul par la restauration et la comparaison » donne son nom à une discipline nouvelle : l’algèbre.',
     summary:
       'Vers 820, à la cour du calife al-Ma’mūn, al-Khwārizmī rédige le Kitāb al-jabr wa-l-muqābala, premier traité consacré à la résolution systématique des équations du premier et du second degré, et un livre sur le calcul indien qui diffuse la numération décimale de position. Ses successeurs élargissent le champ : Abū Kāmil introduit les coefficients irrationnels et les problèmes indéterminés, al-Karajī et al-Samaw’al bâtissent une arithmétique des polynômes, Omar Khayyām classe les équations cubiques et les résout par intersection de coniques, Sharaf al-Dīn al-Ṭūsī étudie leurs racines par des méthodes qui touchent au calcul des maxima. Traduite en latin à Tolède au XIIᵉ siècle, cette algèbre est le point de départ de celle de l’Europe.',
@@ -743,7 +743,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 850, end: 1450, approx: true },
     continents: ['formes', 'analyse'],
     places: ['Bagdad', 'Le Caire', 'Ghazni', 'Maragha', 'Samarcande'],
-    map: { x: 1400, y: 1450, size: 2, palette: { fill: '#cbdaec', stroke: '#25456a', accent: '#2c69af' } },
+    map: { x: 1400, y: 1450, size: 2, palette: { fill: '#c9dced', stroke: '#274a68', accent: '#275a86' } },
     tagline: 'Euclide, Archimède et Apollonius traduits, corrigés, prolongés : six siècles de géométrie, de l’optique du Caire aux observatoires de Maragha et de Samarcande.',
     summary:
       'À partir du IXᵉ siècle, les géomètres de langue arabe traduisent les Éléments, les Coniques, les traités d’Archimède et l’Almageste, puis les prolongent : Thābit ibn Qurra calcule des volumes par sommation et découvre une règle pour les nombres amiables ; Ibn al-Haytham fonde l’optique géométrique sur l’expérience et résout le problème du miroir sphérique par les coniques ; Abū l-Wafā’, al-Bīrūnī puis Naṣīr al-Dīn al-Ṭūsī font de la trigonométrie plane et sphérique une discipline autonome ; al-Kāshī, à Samarcande, calcule π à seize décimales et systématise les fractions décimales. Les tentatives de démontrer le cinquième postulat, de Thābit à Ṭūsī, nourriront la réflexion européenne sur les parallèles.',
@@ -1103,7 +1103,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 1000, end: 1350, approx: true },
     continents: ['hasard', 'nombres'],
     places: ['Hangzhou', 'Pékin', 'Sichuan'],
-    map: { x: 1350, y: 3150, size: 2, palette: { fill: '#e8c4c0', stroke: '#5e2821', accent: '#a33729' } },
+    map: { x: 1350, y: 3150, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3629', accent: '#8a3c28' } },
     tagline: 'Sous les Song et les Yuan, quatre maîtres portent le calcul sur baguettes à son sommet : équations de degré dix, restes simultanés, quatre inconnues sur un même tableau.',
     summary:
       'Entre le XIᵉ et le début du XIVᵉ siècle, la tradition des Neuf Chapitres connaît son apogée algébrique. Jia Xian dispose le triangle des coefficients binomiaux et des méthodes d’extraction de racines ; Qin Jiushao (1247) résout numériquement des équations jusqu’au degré dix et généralise le problème des restes par la méthode dayan ; Li Ye (1248) fonde l’art de l’inconnue céleste (tian yuan), qui écrit les polynômes en colonnes de baguettes ; Yang Hui (1261) commente les classiques et conserve les méthodes de Jia Xian ; Zhu Shijie (1303) étend le tian yuan à quatre inconnues et élimine entre équations polynomiales. Cette algèbre, sans contacts établis avec l’Occident, s’éteint presque sous les Ming et n’est redécouverte en Chine qu’au XVIIIᵉ siècle.',
@@ -1412,7 +1412,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 1000, end: 1450, approx: true },
     continents: ['analyse', 'nombres'],
     places: ['Reims', 'Tolède', 'Pise', 'Oxford', 'Paris'],
-    map: { x: 1450, y: 2300, size: 2, palette: { fill: '#dacfed', stroke: '#42266d', accent: '#602db4' } },
+    map: { x: 1450, y: 2300, size: 2, palette: { fill: '#ddcdee', stroke: '#49296b', accent: '#58288a' } },
     tagline: 'Des jetons de Gerbert aux graphes d’Oresme : l’Occident apprend à calculer en chiffres, à lire Euclide en latin et à mesurer la variation du mouvement.',
     summary:
       'Entre l’an mil et 1450, le latin redevient une langue mathématique. Gerbert d’Aurillac enseigne à Reims l’abaque à jetons numérotés ; les traducteurs de Tolède — Adélard de Bath, Gérard de Crémone — donnent en latin les Éléments et l’algèbre d’al-Khwārizmī ; Léonard de Pise (Fibonacci) rédige en 1202 le Liber abaci, qui impose les chiffres indo-arabes et les méthodes arabes du calcul commercial et de l’algèbre ; Jordanus de Nemore écrit la première algèbre latine en lettres. Au XIVᵉ siècle, les calculateurs de Merton College à Oxford (Bradwardine, Heytesbury, Swineshead) quantifient la variation des mouvements, et Nicole Oresme en tire une géométrie des « formes » et les premières études de séries, dont la divergence de la série harmonique.',
@@ -1736,7 +1736,7 @@ export const MEDIEVAL: Domain[] = [
     period: { start: 1100, end: 1400, approx: true },
     continents: ['fondements'],
     places: ['Paris', 'Oxford'],
-    map: { x: 1450, y: 4100, size: 1, palette: { fill: '#c3e9d2', stroke: '#22623c', accent: '#2aa75c' } },
+    map: { x: 1450, y: 4100, size: 1, palette: { fill: '#c9edd4', stroke: '#276839', accent: '#278642' } },
     tagline: 'Dans les écoles de Paris et d’Oxford, la logique aristotélicienne devient une science des termes, des conséquences et des paradoxes que l’on redécouvrira au XIXᵉ siècle.',
     summary:
       'Entre Abélard et Albert de Saxe, les facultés des arts de Paris et d’Oxford développent une logique propre, la logica modernorum, greffée sur l’Organon d’Aristote connu par Boèce puis par les traductions du grec. On y théorise la supposition (ce pour quoi un terme « tient » dans une proposition), les syncatégorèmes, les conséquences (règles de l’implication), les obligations et les insolubles, dont le paradoxe du menteur. Guillaume d’Ockham donne à cette logique une assise nominaliste, Jean Buridan une forme systématique ; les débats sur l’infini et le continu, menés dans les commentaires à la Physique d’Aristote, touchent directement aux mathématiques. Jugée stérile par les humanistes, cette tradition n’est relue sérieusement qu’au XXᵉ siècle.',
diff --git a/src/data/domains/renaissance.ts b/src/data/domains/renaissance.ts
index ba8847c..0910e41 100644
--- a/src/data/domains/renaissance.ts
+++ b/src/data/domains/renaissance.ts
@@ -50,7 +50,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1494, end: 1603 },
     continents: ['nombres'],
     places: ['Venise', 'Bologne', 'Milan', 'Paris'],
-    map: { x: 2000, y: 420, size: 3, palette: { fill: '#ece1cb', stroke: '#6a5425', accent: '#af862c' } },
+    map: { x: 2000, y: 420, size: 3, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } },
     tagline: 'Un siècle de duels, de secrets et de serments trahis fait passer l’algèbre du troisième degré à la lettre.',
     summary:
       'Entre la Summa de Pacioli (1494), qui déclare l’équation du troisième degré hors de portée, et l’Isagoge de Viète (1591), qui écrit les quantités connues et inconnues par des lettres, l’algèbre change de nature. À Bologne, Scipione del Ferro résout la cubique vers 1515 et garde le secret ; Tartaglia la retrouve en 1535 ; Cardan la publie en 1545 dans l’Ars magna avec la résolution du quatrième degré due à son élève Ferrari. Bombelli apprivoise ensuite les racines de nombres négatifs qui surgissent dans le « cas irréductible », et Viète transforme l’art de la chose en une analyse générale des équations. L’algèbre cesse d’être une collection de recettes marchandes pour devenir une science des formes.',
@@ -371,7 +371,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1621, end: 1670, approx: true },
     continents: ['nombres'],
     places: ['Toulouse', 'Paris', 'Bordeaux'],
-    map: { x: 2450, y: 620, size: 2, palette: { fill: '#eadec7', stroke: '#664f24', accent: '#ab7e2b' } },
+    map: { x: 2450, y: 620, size: 2, palette: { fill: '#eee4cd', stroke: '#6b5629', accent: '#8a6b28' } },
     tagline: 'Dans les marges d’un Diophante, une arithmétique nouvelle qui ne livre presque jamais ses preuves.',
     summary:
       'Entre 1636 et 1665, un conseiller au parlement de Toulouse refonde l’arithmétique des entiers en relisant Diophante dans l’édition de Bachet (1621). Pierre de Fermat énonce par lettres, presque toujours sans démonstration, le petit théorème, le théorème des deux carrés, les propriétés des nombres de la forme 2^(2ⁿ) + 1 et l’impossibilité de xⁿ + yⁿ = zⁿ pour n > 2. Sa méthode de descente infinie et ses défis aux géomètres anglais font de la théorie des nombres une discipline autonome, dont Euler, Lagrange et Legendre hériteront au XVIIIᵉ siècle.',
@@ -666,7 +666,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1435, end: 1600 },
     continents: ['formes'],
     places: ['Florence', 'Nuremberg', 'Vienne', 'Lisbonne', 'Duisbourg'],
-    map: { x: 1980, y: 1550, size: 2, palette: { fill: '#d2e6ee', stroke: '#285a71', accent: '#2e8cb8' } },
+    map: { x: 1980, y: 1550, size: 2, palette: { fill: '#cde0ee', stroke: '#294d6b', accent: '#285e8a' } },
     tagline: 'De la fenêtre d’Alberti aux mappemondes de Mercator, la figure devient un instrument de mesure du monde.',
     summary:
       'Entre le De pictura d’Alberti (1435) et la mappemonde de Mercator (1569), la géométrie européenne se refait par la pratique : peindre une place, dresser une table de sinus, tracer la route d’un navire. Les peintres florentins transforment la représentation de l’espace en construction géométrique ; Regiomontanus, entre Vienne et Nuremberg, fait de la trigonométrie une discipline autonome ; les navigateurs portugais et les cartographes des Pays-Bas posent le problème de représenter la sphère sur le plan. Cette géométrie instrumentée, écrite pour les peintres, les astronomes et les pilotes, prépare à la fois la géométrie projective de Desargues et la cartographie moderne.',
@@ -961,7 +961,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1636, end: 1685 },
     continents: ['formes'],
     places: ['Paris', 'Toulouse', 'Lyon', 'Leyde'],
-    map: { x: 2420, y: 1250, size: 3, palette: { fill: '#d6e8f0', stroke: '#295d75', accent: '#2f8fbc' } },
+    map: { x: 2420, y: 1250, size: 3, palette: { fill: '#d5e4f1', stroke: '#2b5373', accent: '#2a6492' } },
     tagline: 'La courbe devient une équation, la section conique une propriété d’incidence : la géométrie change deux fois de langage.',
     summary:
       'Entre 1636 et 1640, la géométrie grecque est dépassée par deux voies presque simultanées. Fermat à Toulouse et Descartes aux Provinces-Unies associent à chaque courbe une équation en deux inconnues, héritiers de l’algèbre littérale de Viète : le problème de Pappus, laissé ouvert par les Anciens, devient une question sur les équations. À Paris et à Lyon, Desargues puis le jeune Pascal traitent les coniques par projection : ce qui se conserve par perspective fait théorème. La première voie l’emporte vite — l’édition latine de La Géométrie par van Schooten (1649) forme une génération — ; la seconde, trop nouvelle dans sa langue, s’éteint avec La Hire avant de renaître au XIXᵉ siècle.',
@@ -1271,7 +1271,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1635, end: 1700 },
     continents: ['analyse'],
     places: ['Bologne', 'Oxford', 'Cambridge', 'Paris', 'Hanovre', 'La Haye'],
-    map: { x: 2300, y: 2300, size: 3, palette: { fill: '#dad2ee', stroke: '#3d2871', accent: '#552eb8' } },
+    map: { x: 2300, y: 2300, size: 3, palette: { fill: '#d9cdee', stroke: '#41296b', accent: '#4c288a' } },
     tagline: 'Sommer l’infiniment petit, développer en séries infinies, puis faire de la tangente et de l’aire deux opérations inverses.',
     summary:
       'Entre les indivisibles de Cavalieri (1635) et la brachistochrone (1696), l’Europe transforme les problèmes de quadrature et de tangente en un calcul général. Wallis arithmétise l’infini, Gregory et Newton ajoutent les séries, Barrow aperçoit la relation inverse entre tangente et aire. Dans les années de peste 1665-1666, Newton fond fluxions et fluentes en une méthode unique qu’il garde presque secrète ; à Paris, de 1672 à 1676, Leibniz, initié par Huygens, construit un autre calcul, mieux noté, et le publie le premier (1684). Les Principia (1687) montrent la puissance de la méthode en mécanique céleste, tandis que la querelle de priorité, ouverte à la fin du siècle, divise durablement les écoles anglaise et continentale.',
@@ -1599,7 +1599,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1585, end: 1680 },
     continents: ['hasard', 'nombres'],
     places: ['Bruges', 'Édimbourg', 'Londres', 'Tübingen', 'Rouen'],
-    map: { x: 2000, y: 3050, size: 2, palette: { fill: '#f0ddd6', stroke: '#753d29', accent: '#bc542f' } },
+    map: { x: 2000, y: 3050, size: 2, palette: { fill: '#eed6cd', stroke: '#6b3929', accent: '#8a4128' } },
     tagline: 'Remplacer la multiplication par l’addition, le comptoir par la machine : le calcul devient une industrie.',
     summary:
       'Entre le De Thiende de Stevin (1585), qui apprend aux marchands les fractions décimales, et la machine de Leibniz (1673), une révolution discrète transforme la pratique du calcul. Las des prodigieuses multiplications de la trigonométrie astronomique, Napier puis, indépendamment, Bürgi construisent des correspondances entre progressions géométriques et arithmétiques : les logarithmes, que Briggs convertit en base dix. Oughtred en glisse les échelles l’une contre l’autre (la règle à calcul) ; Schickard, Pascal et Leibniz mécanisent l’addition et la multiplication. En 1627, les Tables rudolphines de Kepler montrent ce que l’astronomie doit désormais au logarithme.',
@@ -1929,7 +1929,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1654, end: 1713 },
     continents: ['hasard'],
     places: ['Paris', 'La Haye', 'Londres', 'Bâle'],
-    map: { x: 2450, y: 3400, size: 2, palette: { fill: '#e9cdc3', stroke: '#623322', accent: '#a74b2a' } },
+    map: { x: 2450, y: 3400, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } },
     tagline: 'En une correspondance de 1654, le hasard entre en géométrie ; en 1713, Bernoulli montre qu’il a ses lois.',
     summary:
       'Le 1654 de Pascal et Fermat fait d’un problème de salon — comment partager l’enjeu d’une partie interrompue ? — une mathématique nouvelle : compter les chances au lieu d’invoquer la fortune. Huygens en tire le premier traité et le concept d’espérance (1657) ; à Londres, Graunt puis Halley lisent dans les registres de mortalité des régularités qui fondent l’arithmétique politique et l’assurance. À Bâle, Jacques Bernoulli rassemble vingt ans de réflexion dans l’Ars conjectandi (posthume, 1713) : permutations et combinaisons, espérance morale, et le « théorème d’or » qui affirme que la fréquence approche la probabilité. Le hasard a désormais ses théorèmes.',
@@ -2227,7 +2227,7 @@ export const RENAISSANCE: Domain[] = [
     period: { start: 1555, end: 1700 },
     continents: ['fondements'],
     places: ['Paris', 'Port-Royal', 'Londres', 'Hanovre'],
-    map: { x: 2250, y: 4150, size: 1, palette: { fill: '#ddf3e3', stroke: '#2c7d43', accent: '#31c45b' } },
+    map: { x: 2250, y: 4150, size: 1, palette: { fill: '#d1f0d9', stroke: '#2a6f3b', accent: '#298e43' } },
     tagline: 'Ramener toute science à une méthode, puis toute pensée à un calcul : le rêve leibnizien de la caractéristique.',
     summary:
       'De Ramus à Leibniz, le XVIIᵉ siècle repense la logique comme un art d’inventer et non comme un art de disputer. Ramus simplifie la dialectique scolastique en une méthode unique ; Descartes propose des règles pour conduire l’esprit et fait de la géométrie son modèle ; Hobbes rêve le raisonnement comme un calcul ; Pascal fixe les règles de la définition parfaite ; la Logique de Port-Royal (1662) enseigne l’art de penser à toute l’Europe. Leibniz rassemble ces fils en un projet immense : une écriture universelle, la characteristica, où penser serait calculer, et dont les Essais de Wilkins pour une langue philosophique (1668) sont la face encyclopédique.',
diff --git a/src/data/domains/structures-a.ts b/src/data/domains/structures-a.ts
index 9dd0b61..ccc2808 100644
--- a/src/data/domains/structures-a.ts
+++ b/src/data/domains/structures-a.ts
@@ -24,7 +24,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1890, end: 1945 },
     continents: ['nombres'],
     places: ['Göttingen', 'Berlin', 'Hambourg', 'Amsterdam'],
-    map: { x: 4950, y: 430, size: 3, palette: { fill: '#e8dac0', stroke: '#5e4921', accent: '#a37829' } },
+    map: { x: 4950, y: 430, size: 3, palette: { fill: '#eee2cd', stroke: '#6b5229', accent: '#8a6528' } },
     tagline: 'Des invariants de Hilbert aux anneaux de Noether : l’algèbre cesse d’être un calcul pour devenir l’étude des structures.',
     summary:
       'Entre le théorème de la base de Hilbert (1890) et la Moderne Algebra de van der Waerden (1930), l’algèbre change d’objet : au lieu de résoudre des équations ou de calculer des invariants, elle étudie des systèmes définis par des axiomes : corps, anneaux, idéaux, modules, algèbres. Steinitz classe les corps abstraits (1910), Wedderburn décrit la structure des algèbres (1908), Emmy Noether réécrit la théorie des idéaux à partir de la condition de chaîne ascendante (1921) et Artin refonde la théorie de Galois sur les automorphismes. Née à Göttingen et à Hambourg, dispersée par l’exil après 1933, cette « algèbre moderne » fournit le langage que la topologie, la géométrie algébrique et la théorie des nombres adopteront.',
@@ -385,7 +385,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1896, end: 1960 },
     continents: ['nombres'],
     places: ['Göttingen', 'Cambridge', 'Tokyo', 'Hambourg', 'Moscou', 'Princeton', 'Oslo'],
-    map: { x: 5600, y: 600, size: 2, palette: { fill: '#ece2cb', stroke: '#6a5525', accent: '#af882c' } },
+    map: { x: 5600, y: 600, size: 2, palette: { fill: '#ecddc6', stroke: '#644c26', accent: '#825f26' } },
     tagline: 'Corps de classes à Tokyo et Hambourg, méthode du cercle à Cambridge : la théorie des nombres se dédouble.',
     summary:
       'Après le Zahlbericht de Hilbert (1897) et la Geometrie der Zahlen de Minkowski (1896), la théorie des nombres suit deux voies. La voie algébrique décrit toutes les extensions abéliennes d’un corps de nombres : Takagi (1920) puis Artin (1927) achèvent la théorie du corps de classes, que Hasse complète par le principe local-global. La voie analytique, née à Cambridge de la rencontre de Hardy, Littlewood et Ramanujan, invente la méthode du cercle (1918) pour compter partitions et sommes de puissances ; Vinogradov la transforme en théorie des sommes trigonométriques et Selberg lui adjoint le crible, la preuve élémentaire du théorème des nombres premiers (1949) et la formule des traces (1956). Les deux voies se rejoindront dans le programme de Langlands.',
@@ -785,7 +785,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1895, end: 1960 },
     continents: ['formes'],
     places: ['Paris', 'Bonn', 'Moscou', 'Princeton', 'Zurich', 'Varsovie'],
-    map: { x: 4950, y: 1300, size: 3, palette: { fill: '#c3d6e9', stroke: '#224162', accent: '#2a66a7' } },
+    map: { x: 4950, y: 1300, size: 3, palette: { fill: '#cddeee', stroke: '#294a6b', accent: '#28598a' } },
     tagline: 'Compter les trous plutôt que mesurer les longueurs : la forme sans métrique devient une science.',
     summary:
       'Entre l’Analysis situs de Poincaré (1895) et les axiomes d’Eilenberg et Steenrod (1945), la topologie naît et s’organise. Poincaré invente l’homologie simpliciale et laisse la conjecture qui porte son nom ; Brouwer établit le point fixe et l’invariance de la dimension (1911) ; Hausdorff (1914) et l’école de Moscou (Alexandrov, Urysohn) définissent les espaces topologiques et la dimension ; Lefschetz, Alexander, Hopf, puis Hurewicz (1935) et Whitney passent de l’homologie aux groupes d’homotopie, aux fibrations et aux classes caractéristiques. Noether y introduit les groupes abstraits : la topologie devient algébrique, puis axiomatique.',
@@ -1185,7 +1185,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1890, end: 1955 },
     continents: ['formes', 'nombres'],
     places: ['Rome', 'Bologne', 'Baltimore', 'Cambridge', 'Chicago', 'São Paulo'],
-    map: { x: 5600, y: 1550, size: 2, palette: { fill: '#cbddec', stroke: '#254c6a', accent: '#2c76af' } },
+    map: { x: 5600, y: 1550, size: 2, palette: { fill: '#cde2ee', stroke: '#29536b', accent: '#28668a' } },
     tagline: 'Des surfaces de Castelnuovo et Enriques aux corps finis de Weil : la géométrie algébrique refait ses fondements.',
     summary:
       'Héritiers de Cremona, les géomètres italiens Castelnuovo, Enriques et Severi construisent entre 1890 et 1920 la théorie des surfaces algébriques : critère de rationalité, classification d’Enriques, fonctions de plusieurs variables complexes. Leur intuition superbe mais leurs démonstrations fragiles provoquent une refonte : Zariski et van der Waerden fondent la géométrie sur l’algèbre commutative, Hodge la rattache à l’analyse harmonique, et André Weil, dans les Foundations (1946), la libère des nombres complexes pour démontrer l’hypothèse de Riemann des courbes sur les corps finis (1948) et formuler les conjectures (1949) qui conduiront à Grothendieck et à Deligne.',
@@ -1515,7 +1515,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1900, end: 1955 },
     continents: ['analyse'],
     places: ['Paris', 'Stockholm', 'Göttingen', 'Budapest', 'Lwów', 'Princeton'],
-    map: { x: 4950, y: 2200, size: 3, palette: { fill: '#d7cfed', stroke: '#3b266d', accent: '#532db4' } },
+    map: { x: 4950, y: 2200, size: 3, palette: { fill: '#decdee', stroke: '#4a296b', accent: '#59288a' } },
     tagline: 'Une fonction devient un point : mesure, intégrale et espaces abstraits donnent à l’analyse son langage du siècle.',
     summary:
       'Entre l’intégrale de Lebesgue (1902) et la Théorie des distributions de Schwartz (1950), l’analyse change d’échelle : les fonctions deviennent les points d’espaces vectoriels que l’on étudie pour eux-mêmes. Fredholm traite les équations intégrales comme des systèmes linéaires de dimension infinie (1903) ; Fréchet axiomatise les espaces métriques (1906) ; Riesz représente les formes linéaires et fonde l’école hongroise ; Banach et Steinhaus, à Lwów, dégagent les théorèmes généraux des espaces normés ; von Neumann axiomatise les espaces de Hilbert pour la mécanique quantique (1929). La Théorie des opérations linéaires (1932) et les distributions achèvent cette refonte, au service des probabilités et des équations aux dérivées partielles.',
@@ -1895,7 +1895,7 @@ export const STRUCTURES_A: Domain[] = [
     period: { start: 1900, end: 1960 },
     continents: ['analyse'],
     places: ['Paris', 'Padoue', 'Göttingen', 'Zurich', 'Moscou', 'New York'],
-    map: { x: 5600, y: 2450, size: 2, palette: { fill: '#e0d6f0', stroke: '#462975', accent: '#652fbc' } },
+    map: { x: 5600, y: 2450, size: 2, palette: { fill: '#ddd1f0', stroke: '#442a6f', accent: '#50298e' } },
     tagline: 'Du calcul absolu de Ricci aux solutions faibles de Leray : les équations de la physique deviennent une théorie.',
     summary:
       'Au début du siècle, les équations aux dérivées partielles sortent de leur cas par cas : Hadamard définit les problèmes bien posés (1902), le calcul différentiel absolu de Ricci et Levi-Civita (1900) donne à la relativité générale son langage, et le théorème de Noether (1918) relie symétries et lois de conservation. Göttingen, avec Weyl, Hilbert et Courant, unit analyse et physique ; dispersée en 1933, l’école renaît à New York autour de Courant. Schauder (1930), Douglas (1931), Leray (1934) et Sobolev (1936-1938) créent les outils de l’analyse non linéaire : points fixes, solutions faibles, espaces fonctionnels et faisceaux.',
diff --git a/src/data/domains/structures-b.ts b/src/data/domains/structures-b.ts
index e11d9d4..f5392e0 100644
--- a/src/data/domains/structures-b.ts
+++ b/src/data/domains/structures-b.ts
@@ -33,7 +33,7 @@ export const STRUCTURES_B: Domain[] = [
     period: { start: 1900, end: 1955 },
     continents: ['hasard'],
     places: ['Paris', 'Saint-Pétersbourg', 'Moscou', 'Cambridge (Mass.)', 'Princeton', 'Tokyo'],
-    map: { x: 4950, y: 3100, size: 3, palette: { fill: '#f3e4dd', stroke: '#7d452c', accent: '#c45f31' } },
+    map: { x: 4950, y: 3100, size: 3, palette: { fill: '#f0dad1', stroke: '#6f3f2a', accent: '#8e4829' } },
     tagline: 'Le hasard devient une mesure : en un demi-siècle, le calcul des probabilités passe des jeux de dés aux trajectoires browniennes.',
     summary:
       'Entre la thèse de Bachelier (1900) et les traités de Feller et de Doob (1950-1953), le calcul des probabilités change de nature. La théorie de la mesure de Borel et de Lebesgue lui fournit un langage ; Markov, Borel, Lévy et Khintchine démontrent des théorèmes limites d’un type nouveau (lois fortes, logarithme itéré, lois stables) ; Wiener construit rigoureusement le mouvement brownien. En 1933, les Grundbegriffe de Kolmogorov fixent les axiomes : une probabilité est une mesure de masse totale 1, une variable aléatoire une fonction mesurable. Sur cette base, Doob et Itô bâtissent la théorie des processus stochastiques, martingales et calcul stochastique, qui irriguera la physique, la finance et la statistique de la seconde moitié du siècle.',
@@ -434,7 +434,7 @@ export const STRUCTURES_B: Domain[] = [
     period: { start: 1908, end: 1960 },
     continents: ['hasard'],
     places: ['Dublin', 'Rothamsted', 'Londres', 'Berkeley', 'New York', 'Princeton', 'Leningrad'],
-    map: { x: 5600, y: 3350, size: 2, palette: { fill: '#f1ddda', stroke: '#79362a', accent: '#c04630' } },
+    map: { x: 5600, y: 3350, size: 2, palette: { fill: '#f1dbd5', stroke: '#733b2b', accent: '#92412a' } },
     tagline: 'Inférer, tester, décider : de la brasserie Guinness aux salles de guerre, la statistique devient une théorie de l’action sous incertitude.',
     summary:
       'En 1908, un brasseur de Dublin publie sous pseudonyme la loi des petits échantillons ; en 1922, Fisher définit la vraisemblance, l’efficacité et l’exhaustivité et fait de la statistique une branche des mathématiques. Neyman et Egon Pearson reformulent les tests comme un choix entre deux hypothèses avec deux risques d’erreur (1933), puis Neyman invente les intervalles de confiance (1937). Dans les années 1940, Wald conçoit la statistique comme une théorie de la décision, inspirée de la théorie des jeux de von Neumann et Morgenstern, tandis que Kantorovitch et Dantzig inventent la programmation linéaire et que Nash généralise l’équilibre aux jeux à n joueurs. Les querelles de Fisher avec Karl Pearson, puis avec Neyman, scandent cette histoire.',
@@ -845,7 +845,7 @@ export const STRUCTURES_B: Domain[] = [
     period: { start: 1928, end: 1956 },
     continents: ['fondements', 'hasard'],
     places: ['Vienne', 'Princeton', 'Cambridge', 'Göttingen', 'New York', 'Murray Hill'],
-    map: { x: 5350, y: 3900, size: 3, palette: { fill: '#c3e9d3', stroke: '#22623d', accent: '#2aa75e' } },
+    map: { x: 5350, y: 3900, size: 3, palette: { fill: '#c6ecd2', stroke: '#266439', accent: '#268243' } },
     tagline: 'Ce qu’une procédure mécanique peut et ne peut pas faire : la logique découvre ses limites et invente l’ordinateur.',
     summary:
       'En 1928, Hilbert et Ackermann posent le problème de la décision : existe-t-il une procédure mécanique qui tranche la validité de tout énoncé logique ? En moins de dix ans, la question reçoit une réponse négative et, chemin faisant, la notion de « procédure mécanique » est définie. Gödel démontre la complétude de la logique du premier ordre (1930) puis l’incomplétude de toute arithmétique formalisée (1931) ; Church, Kleene et Gödel définissent le lambda-calcul et les fonctions récursives ; Turing décrit en 1936 une machine abstraite dont il montre qu’il existe une version universelle et un problème (l’arrêt) qu’elle ne peut résoudre. Après la guerre, ces idées passent dans les circuits de Shannon, l’architecture de l’EDVAC et la théorie de l’information : la logique mathématique devient informatique.',
@@ -1250,7 +1250,7 @@ export const STRUCTURES_B: Domain[] = [
     period: { start: 1899, end: 1940 },
     continents: ['fondements'],
     places: ['Göttingen', 'Cambridge', 'Amsterdam', 'Varsovie', 'Oslo'],
-    map: { x: 4850, y: 4100, size: 2, palette: { fill: '#cfedd9', stroke: '#266d3f', accent: '#2db45c' } },
+    map: { x: 4850, y: 4100, size: 2, palette: { fill: '#cdeed6', stroke: '#296b3a', accent: '#288a42' } },
     tagline: 'Qu’est-ce qui garantit les mathématiques ? Logique, intuition ou règles formelles : trois réponses s’affrontent, et la logique en sort transformée.',
     summary:
       'En 1899, les Grundlagen der Geometrie de Hilbert font de l’axiome une hypothèse sur des objets indéterminés, dont on peut prouver l’indépendance et la cohérence relative par des modèles. Les paradoxes de la théorie des ensembles obligent alors à trancher : Russell et Whitehead reconstruisent les mathématiques dans la logique (Principia Mathematica, 1910-1913), Brouwer les ramène aux constructions mentales et récuse le tiers exclu (1907-1908), Hilbert propose de fonder l’infini sur une métamathématique finitiste, élaborée avec Bernays et Ackermann. Pendant ce temps, la logique du premier ordre prend son autonomie : théorème de Löwenheim–Skolem, système de Zermelo–Fraenkel, vérité définie par Tarski, déduction naturelle de Gentzen. La querelle culmine à la fin des années 1920 et se referme sur les théorèmes de Gödel (1931) et la preuve de Gentzen (1936).',
@@ -1694,7 +1694,7 @@ export const STRUCTURES_B: Domain[] = [
     period: { start: 1934, end: 1970 },
     continents: ['fondements', 'nombres', 'formes'],
     places: ['Paris', 'Nancy', 'Strasbourg', 'Chicago', 'Princeton'],
-    map: { x: 5800, y: 4250, size: 2, palette: { fill: '#cbecd7', stroke: '#256a3f', accent: '#2caf5e' } },
+    map: { x: 5800, y: 4250, size: 2, palette: { fill: '#cdeed7', stroke: '#296b3c', accent: '#288a44' } },
     tagline: 'Un auteur imaginaire, un traité collectif : réécrire les mathématiques entières à partir de quelques structures mères.',
     summary:
       'En décembre 1934, quelques jeunes normaliens — Weil, Cartan, Chevalley, Delsarte, Dieudonné, bientôt rejoints par Ehresmann — se réunissent à Paris pour réécrire le cours d’analyse : le projet devient, au congrès de Besse-en-Chandesse (juillet 1935), un traité complet des mathématiques signé d’un nom inventé, Nicolas Bourbaki. Le premier fascicule paraît en 1939 ; la guerre disperse le groupe, qui renaît en 1945 et fait paraître les Éléments de mathématique, organisés non par disciplines mais par « structures ». Autour du même mouvement structuraliste, Eilenberg et Mac Lane créent la théorie des catégories (1945), Cartan anime le séminaire qui impose faisceaux et algèbre homologique, et le Séminaire Bourbaki (1948) devient l’observatoire des mathématiques vivantes.',
diff --git a/src/data/types.ts b/src/data/types.ts
index 46a1f3f..0cc0ef1 100644
--- a/src/data/types.ts
+++ b/src/data/types.ts
@@ -105,6 +105,8 @@ export interface Link {
   /** Explication en une ou deux phrases. */
   note: string;
   sources?: string[];
+  /** Ascendant principal choisi à la main (au plus un par domaine d'arrivée ; filiation ou influence). */
+  principal?: true;
 }
 
 export interface Theory {
@@ -129,6 +131,22 @@ export interface Mathematician {
   bio: string;
   /** Théorie principale, si pertinent. */
   theoryId?: string;
+  /** Grande figure : visible dès la vue d'ensemble, fiche enrichie. */
+  featured?: Featured;
+  /** Références biographiques (identifiants du registre), p. ex. `mactutor`. */
+  sources?: string[];
+  /** Slug de la biographie MacTutor : https://mathshistory.st-andrews.ac.uk/Biographies/<slug>/ */
+  mactutor?: string;
+}
+
+/** Ce qui distingue une grande figure : son apport en une ligne, ses apports détaillés, ses résultats phares. */
+export interface Featured {
+  /** Son apport en une ligne (90 caractères au plus), affiché sous le nom sur la carte. */
+  signature: Statement;
+  /** « Apports » : 2 à 4 énoncés typés et sourcés (vide tant que la vague 2 n'est pas passée). */
+  contributions: Statement[];
+  /** 1 à 3 identifiants de résultats attribués à cette figure ; le premier est affiché sur la carte. */
+  headlineResultIds: string[];
 }
 
 export type ResultKind = 'theoreme' | 'conjecture' | 'concept' | 'methode' | 'texte' | 'probleme';
@@ -160,6 +178,17 @@ export interface Result {
   context?: Statement[];
   /** Récit « portée » : ce que le résultat a ouvert, permis ou fermé. 1 à 3 énoncés typés et sourcés. */
   impact?: Statement[];
+  /**
+   * « D'où vient l'idée » : 1 à 2 énoncés typés et sourcés — l'heuristique qui
+   * rend le résultat plausible (exemple, analogie, figure, calcul numérique).
+   * Sans objet pour un texte.
+   */
+  intuition?: Statement[];
+  /**
+   * « Idée de la démonstration » : 3 à 6 étapes typées et sourcées, en langage
+   * courant. Théorèmes, et conjectures ou problèmes une fois démontrés ou résolus.
+   */
+  proof?: Statement[];
 }
 
 /** Lien entre deux mathématicien·nes : filiation (maître/élève), influence, collaboration, affinité ou rupture. */
diff --git a/src/data/validate.ts b/src/data/validate.ts
index 5d91a1f..8287d12 100644
--- a/src/data/validate.ts
+++ b/src/data/validate.ts
@@ -1,4 +1,4 @@
-import type { Continent, Domain, Era, Link, MathematicianLink, Source } from './types';
+import type { Continent, Domain, Era, Link, MathematicianLink, ResultKind, Source, Statement } from './types';
 import { MAP_SIZE } from './eras';
 
 export interface AtlasInput {
@@ -12,6 +12,12 @@ export interface AtlasInput {
 
 const HEX = /^#[0-9a-fA-F]{6}$/;
 const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
+/** slug d'une biographie MacTutor (…/Biographies/<slug>/) */
+const MACTUTOR_SLUG = /^[A-Za-z0-9_'()-]+$/;
+/** longueur maximale de la phrase-signature d'une grande figure */
+export const SIGNATURE_MAX = 90;
+/** natures de résultats qui admettent une « idée de la démonstration » */
+const PROOF_KINDS = new Set<ResultKind>(['theoreme', 'conjecture', 'probleme']);
 
 /** Validation du corpus : renvoie une liste de messages d'erreur lisibles. */
 export function validateAtlas(input: AtlasInput): string[] {
@@ -56,6 +62,20 @@ export function validateAtlas(input: AtlasInput): string[] {
       if (!sourceIds.has(sid)) errors.push(`${ctx} : source inconnue « ${sid} »`);
     }
   };
+  /** Énoncés typés et sourcés (récits, apports, intuitions, démonstrations). */
+  const checkStatements = (list: readonly Statement[], ctx: string) => {
+    list.forEach((s, i) => {
+      const sctx = `${ctx} #${i}`;
+      if (!s.text.trim()) errors.push(`${sctx} : texte vide`);
+      if (s.kind !== 'fait' && s.kind !== 'interpretation') errors.push(`${sctx} : type inconnu « ${String(s.kind)} »`);
+      if (!s.sources || s.sources.length === 0) errors.push(`${sctx} : aucune source`);
+      checkSources(s.sources, sctx);
+    });
+  };
+
+  // index global des résultats → auteur (un résultat phare peut vivre dans un autre domaine que sa figure)
+  const resultAuthor = new Map<string, string | undefined>();
+  for (const m of domains) for (const r of m.results) resultAuthor.set(r.id, r.mathematicianId);
 
   for (const m of domains) {
     const ctx = `domaine ${m.id}`;
@@ -111,6 +131,30 @@ export function validateAtlas(input: AtlasInput): string[] {
       }
       if (f.years[0] === 0 || f.years[1] === 0) errors.push(`${ctx} : mathématicien ${f.id} : l'année 0 n'existe pas`);
       if (!f.bio.trim()) errors.push(`${ctx} : mathématicien ${f.id} : bio vide`);
+      checkSources(f.sources, `${ctx} : mathématicien ${f.id}`);
+      if (f.mactutor !== undefined && !MACTUTOR_SLUG.test(f.mactutor)) {
+        errors.push(`${ctx} : mathématicien ${f.id} : slug MacTutor non conforme « ${f.mactutor} »`);
+      }
+      if (f.featured) {
+        const fctx = `${ctx} : grande figure ${f.id}`;
+        const { signature, contributions, headlineResultIds } = f.featured;
+        checkStatements([signature], `${fctx} signature`);
+        if (signature.text.length > SIGNATURE_MAX) {
+          errors.push(`${fctx} : signature trop longue (${signature.text.length} > ${SIGNATURE_MAX} caractères)`);
+        }
+        // 0 apport : vague 2 pas encore passée (la complétude est contrôlée à part)
+        const n = contributions.length;
+        if (n !== 0 && (n < 2 || n > 4)) errors.push(`${fctx} : 2 à 4 apports attendus (${n})`);
+        checkStatements(contributions, `${fctx} apport`);
+        if (headlineResultIds.length < 1 || headlineResultIds.length > 3) {
+          errors.push(`${fctx} : 1 à 3 résultats phares attendus (${headlineResultIds.length})`);
+        }
+        if (new Set(headlineResultIds).size !== headlineResultIds.length) errors.push(`${fctx} : résultat phare en double`);
+        for (const rid of headlineResultIds) {
+          if (!resultAuthor.has(rid)) errors.push(`${fctx} : résultat phare inconnu « ${rid} »`);
+          else if (resultAuthor.get(rid) !== f.id) errors.push(`${fctx} : le résultat phare « ${rid} » n’est pas attribué à ${f.id}`);
+        }
+      }
     }
     // tolérance : un résultat peut précéder ou suivre un peu les bornes du domaine
     // (les bornes des traditions anciennes sont larges, celles des écoles récentes serrées).
@@ -144,13 +188,22 @@ export function validateAtlas(input: AtlasInput): string[] {
       const ni = f.impact?.length ?? 0;
       if (nc > 0 !== ni > 0) errors.push(`${ctx} : résultat ${f.id} : récit incomplet (context et impact vont ensemble)`);
       if (nc > 3 || ni > 3) errors.push(`${ctx} : résultat ${f.id} : récit trop long (3 énoncés au plus par partie)`);
-      [...(f.context ?? []), ...(f.impact ?? [])].forEach((s, i) => {
-        const sctx = `${ctx} : résultat ${f.id} récit #${i}`;
-        if (!s.text.trim()) errors.push(`${sctx} : texte vide`);
-        if (s.kind !== 'fait' && s.kind !== 'interpretation') errors.push(`${sctx} : type inconnu « ${String(s.kind)} »`);
-        if (!s.sources || s.sources.length === 0) errors.push(`${sctx} : aucune source`);
-        checkSources(s.sources, sctx);
-      });
+      checkStatements([...(f.context ?? []), ...(f.impact ?? [])], `${ctx} : résultat ${f.id} récit`);
+      // « D'où vient l'idée » et « Idée de la démonstration »
+      if (f.intuition !== undefined) {
+        const n = f.intuition.length;
+        if (n < 1 || n > 2) errors.push(`${ctx} : résultat ${f.id} : intuition : 1 à 2 énoncés (${n})`);
+        if (f.kind === 'texte') errors.push(`${ctx} : résultat ${f.id} : intuition sans objet pour un texte`);
+        checkStatements(f.intuition, `${ctx} : résultat ${f.id} intuition`);
+      }
+      if (f.proof !== undefined) {
+        const n = f.proof.length;
+        if (n < 3 || n > 6) errors.push(`${ctx} : résultat ${f.id} : démonstration : 3 à 6 étapes (${n})`);
+        if (!PROOF_KINDS.has(f.kind)) {
+          errors.push(`${ctx} : résultat ${f.id} : démonstration réservée aux théorèmes, conjectures et problèmes`);
+        }
+        checkStatements(f.proof, `${ctx} : résultat ${f.id} démonstration`);
+      }
     }
     for (const rid of m.relatedMathematicianIds ?? []) {
       if (!globalMathematicianIds.has(rid)) {
@@ -163,6 +216,7 @@ export function validateAtlas(input: AtlasInput): string[] {
   }
 
   const linkKeys = new Set<string>();
+  const principalTargets = new Set<string>();
   for (const l of links) {
     const ctx = `lien ${l.source}→${l.target}`;
     if (!domainIds.has(l.source)) errors.push(`${ctx} : source inconnue « ${l.source} »`);
@@ -174,6 +228,13 @@ export function validateAtlas(input: AtlasInput): string[] {
     if (l.kind === 'affinite' && l.epistemic !== 'interpretation') {
       errors.push(`${ctx} : une affinité est toujours une interprétation`);
     }
+    if (l.principal) {
+      if (l.kind !== 'filiation' && l.kind !== 'influence') {
+        errors.push(`${ctx} : un ascendant principal est une filiation ou une influence (${l.kind})`);
+      }
+      if (principalTargets.has(l.target)) errors.push(`${ctx} : plusieurs ascendants principaux pour ${l.target}`);
+      principalTargets.add(l.target);
+    }
     checkSources(l.sources, ctx);
   }
 
diff --git a/src/i18n/ui.ts b/src/i18n/ui.ts
index 7092106..98af64e 100644
--- a/src/i18n/ui.ts
+++ b/src/i18n/ui.ts
@@ -34,50 +34,23 @@ const fr = {
   'filters.startYear': 'Année de début (négative avant J.-C.)',
   'filters.endYear': 'Année de fin',
   'filters.continents': 'Champs',
-  'filters.linkTypes': 'Types de liens',
-  'filters.transversal': 'Liens transversaux seulement',
-  'filters.transversalHint': '(entre ères)',
   'filters.factsOnly': 'N’afficher que les faits',
   'filters.visible': '{n} domaine{s} visible{s}',
   'filters.reset': 'Réinitialiser',
 
   'legend.title': 'Légende',
   'legend.close': 'Fermer la légende',
-  'legend.links': 'Liens entre domaines',
-  'legend.hint':
-    'L’encre d’un lien va du pâle (origine) au plein (arrivée) et la pointe marque l’arrivée : le sens se lit sans flèche. Trait continu : fait documenté ; tiret : interprétation. Survoler ou choisir un domaine allume les siens.',
   'legend.levels': 'Niveaux de zoom',
   'legend.results': 'Natures des résultats',
   'legend.statements': 'Énoncés',
   'legend.note': 'L’axe horizontal suit le temps ère par ère (chaque ère a sa largeur, qui n’est pas sa durée) ; l’axe vertical range les cinq champs. Ce sont des conventions de représentation, pas des mesures.',
-  'legend.lanes': 'Bandes, cartouches et portées',
-  'legend.lanes.body':
-    'Chaque champ occupe une bande horizontale de sa teinte ; le temps va de gauche à droite, ère par ère. Chaque domaine est un cartouche posé sur sa portée : le trait à butées, sous le cartouche, couvre sa période sur l’axe du temps (ouvert à droite s’il est toujours actif, tireté si ses bornes sont conventionnelles).',
   'legend.chain': 'Amont et aval',
   'legend.chain.body':
     'Choisir un domaine allume tout ce qui y a conduit par filiation ou influence documentée, en bleu de Prusse, et tout ce qu’il a nourri, de proche en proche, en sépia — d’autant plus pâle que la génération est lointaine. Les courants animés coulent dans le sens de la transmission.',
   'legend.frieze': 'Frise d’activité',
   'legend.frieze.body':
     'En bas de l’écran, l’épaisseur de chaque bande compte les résultats recensés par tranche de la carte, sur la même échelle du temps. Elle mesure le corpus de l’atlas, pas la production mathématique réelle. Cliquer ou glisser déplace la carte ; la fenêtre encadre la portion visible.',
-  'legend.filiation': 'Filiation (pointe pleine)',
-  'legend.influence': 'Influence (pointe ouverte)',
-  'legend.affinite': 'Affinité (sans sens)',
-  'legend.reaction': 'Rupture (barrée)',
-  'legend.fact': 'fait',
-  'legend.interp': 'interprétation',
-
-  'nav.visions': 'Visions',
-  'vision.title': 'Visions',
-  'vision.close': 'Fermer les visions',
-  'vision.structure': 'Lignées',
-  'vision.structure.desc': 'La carte de base : les domaines posés sur le temps, champ par champ, et tous les liens qui les relient, lus dans le sens de la transmission.',
-  'vision.filiations': 'Filiations & ruptures',
-  'vision.filiations.desc': 'Ne garder que les généalogies directes et les ruptures entre domaines ; influences et affinités s’effacent.',
-  'vision.reseaux': 'Réseaux de figures',
-  'vision.reseaux.desc': 'Tous les liens entre mathématicien·nes, en filigrane sur la carte.',
-  'vision.natures': 'Natures de résultats',
-  'vision.natures.desc': 'Chaque lac prend l’encre de la nature dominante de ses résultats.',
-  'vision.natures.all': 'Toutes les natures',
+
 
   'link.filiation': 'Filiation',
   'link.influence': 'Influence',
@@ -93,12 +66,8 @@ const fr = {
 
   'method.title': 'Méthode',
   'method.close': 'Fermer',
-  'method.body':
-    'Cet atlas distingue systématiquement deux régimes d’énoncés. Les faits (dates de publication ou de démonstration, personnes, institutions, contenu vérifiable d’un théorème ou d’une méthode) sont datés et documentés dans les sources citées. Les interprétations (attributions d’influence, jugements sur la portée d’un résultat, récits de « révolution » ou de « crise ») sont signées par une tradition historiographique et restent discutables ; elles sont signalées par un badge ambre. Les liens entre domaines suivent la même règle : une filiation documentée (traduction, école, correspondance) n’a pas le même statut qu’une affinité reconnue après coup ; sur la carte, les faits sont des traits continus et les interprétations des tirets, et seules les filiations et les influences forment l’amont et l’aval d’un domaine. La carte est une convention de représentation : l’axe horizontal suit le temps ère par ère (chaque ère reçoit une largeur proportionnée au corpus, non à sa durée), l’axe vertical range les cinq champs (nombres, formes, analyse, hasard et calcul, fondements) ; la portée d’un domaine couvre sa période, sa position dans la bande est indicative ; l’épaisseur de la frise compte les résultats recensés dans l’atlas, pas la production mathématique réelle. Les grands résultats portent un récit rédigé (« ce qui y a conduit », « ce que ça a ouvert »), typé et sourcé comme le reste. Les bornes chronologiques sont indicatives (« ca. » lorsqu’elles sont particulièrement débattues) ; les années négatives désignent les dates avant notre ère. Les énoncés mathématiques sont donnés en langage courant, sans prétendre à la formulation exacte.',
 
   'intro.aria': 'Introduction',
-  'intro.body':
-    'Les mathématiques comme une généalogie. Chaque domaine est posé sur le temps, de Babylone à aujourd’hui, dans la bande de son champ ; chaque lien se lit dans le sens de la transmission, de l’encre pâle à la pointe. Zoomez pour découvrir ses théories, ses mathématiciennes et mathématiciens, puis ses grands résultats. Choisissez un domaine : tout ce qui y a conduit s’allume en bleu, tout ce qu’il a ouvert en sépia. Chaque énoncé distingue les faits établis des interprétations.',
   'intro.cta': 'Explorer la carte',
 
   'panel.close': 'Fermer le panneau',
@@ -178,6 +147,40 @@ const fr = {
   'period.today': 'aujourd’hui',
   'period.ca': 'ca. ',
   'period.bc': 'av. J.-C.',
+
+  'filters.links': 'Liens entre domaines',
+  'filters.links.principal': 'Lignées principales',
+  'filters.links.all': 'Tous les liens',
+  'filters.links.hint': 'Lignées principales : un ascendant par domaine, et les ruptures. Survoler ou choisir un domaine montre tous ses liens.',
+
+  'legend.read': 'Lire la carte',
+  'legend.read.body': 'Le temps va de gauche à droite, ère par ère ; chaque bande horizontale est un champ. Chaque disque est un domaine, posé sur sa période ; sa position dans la bande est indicative.',
+  'legend.featured': 'Grandes figures',
+  'legend.featured.body': 'Une médaille à l’initiale de la figure, dans la couleur de son champ ; dès qu’on zoome, son résultat phare s’affiche sous son nom. Les autres figures apparaissent au niveau « Mathématiciens ».',
+  'legend.lineage': 'Lignées',
+  'legend.transmission': 'Transmission (filiation ou influence) : la pointe marque l’arrivée',
+  'legend.rupture': 'Rupture',
+  'legend.lineage.body': 'Par défaut, chaque domaine n’est relié qu’à son ascendant principal ; les filtres montrent tous les liens. Les affinités et le statut de chaque lien (fait ou interprétation) sont dans le panneau.',
+
+  'intro.body':
+    'Les mathématiques comme une galerie. Chaque domaine est posé sur le temps, de Babylone à aujourd’hui, dans la bande de son champ, relié à celui dont il descend. Les médailles sont les grandes figures : choisissez-en une pour lire ce qu’elle a apporté et ses résultats phares. Zoomez pour découvrir les théories, toutes les mathématiciennes et tous les mathématiciens, puis les résultats, avec l’idée de leur démonstration. Chaque énoncé distingue les faits établis des interprétations.',
+  'method.body':
+    'Cet atlas distingue systématiquement deux régimes d’énoncés. Les faits (dates de publication ou de démonstration, personnes, institutions, contenu vérifiable d’un théorème, étapes d’une démonstration) sont datés et documentés dans les sources citées. Les interprétations (attributions d’influence, jugements sur la portée d’un résultat ou d’une œuvre, récits de « révolution » ou de « crise ») sont signées par une tradition historiographique et restent discutables ; elles portent un badge ambre. Les apports des grandes figures, les intuitions et les idées de démonstration suivent la même règle : chaque énoncé est typé et sourcé. Les démonstrations sont des esquisses en langage courant, pas des preuves complètes. Les liens entre domaines aussi : une filiation documentée (traduction, école, correspondance) n’a pas le même statut qu’une affinité reconnue après coup ; la carte ne trace par défaut que l’ascendant principal de chaque domaine (filiation avant influence, fait avant interprétation, même champ, puis la source la plus récente) et les ruptures. La carte est une convention de représentation : l’axe horizontal suit le temps ère par ère (chaque ère reçoit une largeur proportionnée au corpus, non à sa durée), l’axe vertical range les cinq champs ; la position d’un domaine dans sa bande est indicative ; l’épaisseur de la frise compte les résultats recensés dans l’atlas, pas la production mathématique réelle. Les années de vie des figures sont recoupées avec l’archive MacTutor ; les bornes chronologiques sont indicatives (« ca. » lorsqu’elles sont débattues) et les années négatives désignent les dates avant notre ère.',
+
+  'panel.featured': 'Grandes figures',
+  'panel.contributions': 'Apports',
+  'panel.headlines': 'Résultats phares',
+  'panel.bio': 'Biographie',
+  'panel.otherResults': 'Autres résultats',
+  'panel.mactutor': 'Biographie détaillée sur MacTutor',
+  'panel.intuition': 'D’où vient l’idée',
+  'panel.proof': 'Idée de la démonstration',
+  'panel.moreFigures': 'Voir les {n} autres',
+  'panel.links.in': 'Transmissions reçues',
+  'panel.links.out': 'Transmissions données',
+  'panel.links.ruptures': 'Ruptures',
+  'panel.links.affinities': 'Affinités',
+  'panel.principal': 'lignée principale',
 } as const;
 
 export type UiKey = keyof typeof fr;
@@ -214,50 +217,23 @@ const en: Record<UiKey, string> = {
   'filters.startYear': 'Start year (negative for BC)',
   'filters.endYear': 'End year',
   'filters.continents': 'Branches',
-  'filters.linkTypes': 'Link types',
-  'filters.transversal': 'Cross-era links only',
-  'filters.transversalHint': '(between eras)',
   'filters.factsOnly': 'Show facts only',
   'filters.visible': '{n} field{s} visible',
   'filters.reset': 'Reset',
 
   'legend.title': 'Legend',
   'legend.close': 'Close legend',
-  'legend.links': 'Links between fields',
-  'legend.hint':
-    'A link’s ink runs from pale (origin) to full (arrival) and the head marks the arrival: direction reads without an arrow. Solid stroke: documented fact; dashed: interpretation. Hovering or selecting a field lights up its own links.',
   'legend.levels': 'Zoom levels',
   'legend.results': 'Kinds of results',
   'legend.statements': 'Statements',
   'legend.note': 'The horizontal axis follows time era by era (each era gets a width, not its duration); the vertical axis sorts the five branches. These are representational conventions, not measurements.',
-  'legend.lanes': 'Lanes, cartouches and spans',
-  'legend.lanes.body':
-    'Each branch occupies a horizontal lane of its hue; time runs left to right, era by era. Each field is a cartouche set on its span: the capped stroke beneath it covers its period on the time axis (open to the right if it is still active, dashed if its bounds are conventional).',
   'legend.chain': 'Upstream and downstream',
   'legend.chain.body':
     'Selecting a field lights up everything that led to it through documented lineage or influence, in Prussian blue, and everything it fed, step by step, in sepia — paler for more distant generations. The animated currents flow in the direction of transmission.',
   'legend.frieze': 'Activity frieze',
   'legend.frieze.body':
     'At the bottom of the screen, the thickness of each band counts the results recorded per slice of the map, on the same time scale. It measures the atlas’s corpus, not actual mathematical output. Click or drag to move the map; the window frames the visible part.',
-  'legend.filiation': 'Lineage (full head)',
-  'legend.influence': 'Influence (open head)',
-  'legend.affinite': 'Affinity (undirected)',
-  'legend.reaction': 'Rupture (barred)',
-  'legend.fact': 'fact',
-  'legend.interp': 'interpretation',
-
-  'nav.visions': 'Visions',
-  'vision.title': 'Visions',
-  'vision.close': 'Close visions',
-  'vision.structure': 'Lineages',
-  'vision.structure.desc': 'The base map: fields set on the time axis, branch by branch, and every link between them, read in the direction of transmission.',
-  'vision.filiations': 'Lineages & ruptures',
-  'vision.filiations.desc': 'Keep only the direct genealogies and the ruptures between fields; influences and affinities recede.',
-  'vision.reseaux': 'Networks of figures',
-  'vision.reseaux.desc': 'Every link between mathematicians, as a faint web on the map.',
-  'vision.natures': 'Kinds of results',
-  'vision.natures.desc': 'Each lake takes the ink of its dominant result kind.',
-  'vision.natures.all': 'All kinds',
+
 
   'link.filiation': 'Lineage',
   'link.influence': 'Influence',
@@ -273,12 +249,8 @@ const en: Record<UiKey, string> = {
 
   'method.title': 'Method',
   'method.close': 'Close',
-  'method.body':
-    'This atlas systematically distinguishes two regimes of statements. Facts (dates of publication or proof, people, institutions, the verifiable content of a theorem or method) are dated and documented in the cited sources. Interpretations (attributions of influence, judgements on the reach of a result, narratives of “revolution” or “crisis”) are signed by a historiographical tradition and remain debatable; they are marked with an amber badge. Links between fields follow the same rule: a documented lineage (translation, school, correspondence) does not have the same status as an affinity recognised after the fact; on the map, facts are solid strokes and interpretations dashed, and only lineages and influences make up a field’s upstream and downstream. The map is a representational convention: the horizontal axis follows time era by era (each era gets a width proportional to the corpus, not to its duration), the vertical axis sorts the five branches (numbers, shapes, analysis, chance and computation, foundations); a field’s span covers its period, its position within the lane is indicative; the frieze’s thickness counts the results recorded in the atlas, not actual mathematical output. Landmark results carry a written narrative (“what led to it”, “what it opened up”), typed and sourced like everything else. Date bounds are indicative (“ca.” where especially debated); negative years denote dates before the common era. Mathematical statements are given in plain language, without claiming exact formulation.',
 
   'intro.aria': 'Introduction',
-  'intro.body':
-    'Mathematics as a genealogy. Each field is set on the time axis, from Babylon to today, in the lane of its branch; each link reads in the direction of transmission, from pale ink to the head. Zoom in to discover its theories, its mathematicians, then its landmark results. Select a field: everything that led to it lights up in blue, everything it opened up in sepia. Every statement distinguishes established facts from interpretations.',
   'intro.cta': 'Explore the map',
 
   'panel.close': 'Close panel',
@@ -358,6 +330,40 @@ const en: Record<UiKey, string> = {
   'period.today': 'today',
   'period.ca': 'ca. ',
   'period.bc': 'BC',
+
+  'filters.links': 'Links between fields',
+  'filters.links.principal': 'Main lineages',
+  'filters.links.all': 'All links',
+  'filters.links.hint': 'Main lineages: one ancestor per field, and the ruptures. Hovering or selecting a field shows all of its links.',
+
+  'legend.read': 'Reading the map',
+  'legend.read.body': 'Time runs left to right, era by era; each horizontal lane is a branch. Each disc is a field, set on its period; its position within the lane is indicative.',
+  'legend.featured': 'Major figures',
+  'legend.featured.body': 'A medal bearing the figure’s initial, in the colour of its branch; once you zoom in, its landmark result appears under its name. Other figures appear at the “Mathematicians” level.',
+  'legend.lineage': 'Lineages',
+  'legend.transmission': 'Transmission (lineage or influence): the head marks the arrival',
+  'legend.rupture': 'Rupture',
+  'legend.lineage.body': 'By default each field is linked only to its main ancestor; the filters show every link. Affinities and each link’s status (fact or interpretation) are in the panel.',
+
+  'intro.body':
+    'Mathematics as a gallery. Each field is set on the time axis, from Babylon to today, in the lane of its branch, linked to the field it descends from. The medals are the major figures: pick one to read what it contributed and its landmark results. Zoom in to discover the theories, every mathematician, then the results, with the idea of their proof. Every statement distinguishes established facts from interpretations.',
+  'method.body':
+    'This atlas systematically distinguishes two regimes of statements. Facts (dates of publication or proof, people, institutions, the verifiable content of a theorem, the steps of a proof) are dated and documented in the cited sources. Interpretations (attributions of influence, judgements on the reach of a result or a body of work, narratives of “revolution” or “crisis”) are signed by a historiographical tradition and remain debatable; they carry an amber badge. The contributions of major figures, the intuitions and the proof ideas follow the same rule: every statement is typed and sourced. Proofs are plain-language sketches, not complete proofs. So do links between fields: a documented lineage (translation, school, correspondence) does not have the same status as an affinity recognised after the fact; by default the map draws only each field’s main ancestor (lineage before influence, fact before interpretation, same branch, then the most recent source) and the ruptures. The map is a representational convention: the horizontal axis follows time era by era (each era gets a width proportional to the corpus, not to its duration), the vertical axis sorts the five branches; a field’s position within its lane is indicative; the frieze’s thickness counts the results recorded in the atlas, not actual mathematical output. Life dates are cross-checked against the MacTutor archive; date bounds are indicative (“ca.” where debated) and negative years denote dates before the common era.',
+
+  'panel.featured': 'Major figures',
+  'panel.contributions': 'Contributions',
+  'panel.headlines': 'Landmark results',
+  'panel.bio': 'Biography',
+  'panel.otherResults': 'Other results',
+  'panel.mactutor': 'Detailed biography on MacTutor',
+  'panel.intuition': 'Where the idea came from',
+  'panel.proof': 'Idea of the proof',
+  'panel.moreFigures': 'Show {n} more',
+  'panel.links.in': 'Transmissions received',
+  'panel.links.out': 'Transmissions given',
+  'panel.links.ruptures': 'Ruptures',
+  'panel.links.affinities': 'Affinities',
+  'panel.principal': 'main lineage',
 };
 
 export const UI: Record<'fr' | 'en', Record<UiKey, string>> = { fr, en };
diff --git a/src/index.css b/src/index.css
index c6daabf..05ede22 100644
--- a/src/index.css
+++ b/src/index.css
@@ -1,31 +1,32 @@
-@import '@fontsource/cormorant-garamond/400.css';
-@import '@fontsource/cormorant-garamond/500.css';
-@import '@fontsource/cormorant-garamond/600.css';
-@import '@fontsource/cormorant-garamond/700.css';
-@import '@fontsource/cormorant-garamond/400-italic.css';
-@import '@fontsource/cormorant-garamond/500-italic.css';
-@import '@fontsource/cormorant-garamond/600-italic.css';
+@import '@fontsource/fraunces/400.css';
+@import '@fontsource/fraunces/600.css';
+@import '@fontsource/fraunces/700.css';
+@import '@fontsource/fraunces/400-italic.css';
+@import '@fontsource/fraunces/600-italic.css';
 @import '@fontsource/dm-sans/400.css';
 @import '@fontsource/dm-sans/500.css';
 @import '@fontsource/dm-sans/700.css';
 @import 'tailwindcss';
 
 /*
- * DA « Fleuves et confluences » : papier, encre et lavis. Chaque champ est un
- * fleuve qui coule avec le temps (gauche → droite) ; les domaines sont des lacs
- * sur son cours ; les liens sont des courants d'encre.
+ * DA « Galerie » : une planche murale de musée. Fond clair et calme, cinq
+ * bandes de champs très pâles, domaines en disques sans contour, grandes
+ * figures en médailles, lignées en traits fins à pointe. Titres en Fraunces,
+ * texte et étiquettes en DM Sans.
  */
 @theme {
-  --font-serif: 'Cormorant Garamond', Georgia, serif;
+  --font-serif: 'Fraunces', Georgia, serif;
   --font-sans: 'DM Sans', system-ui, sans-serif;
-  --color-paper: #f4efe3;
-  --color-paper-2: #ebe4d3;
-  --color-ink: #26231d;
-  --color-soft: #4b463b;
-  --color-muted: #776f60;
-  --color-accent: #1f4e79;
-  --color-accent-strong: #163a5c;
-  --color-sepia: #8a5a1c;
+  --color-paper: #fbfaf7;
+  --color-paper-2: #f3f1ec;
+  --color-ink: #1d1b18;
+  --color-soft: #4a463f;
+  --color-muted: #7a7366;
+  --color-rule: #e2ddd2;
+  --color-accent: #1d5f96;
+  --color-accent-strong: #154a76;
+  --color-sepia: #9a5b16;
+  --color-sanguine: #b5412a;
   --color-fait: #2e6b46;
   --color-interp: #9a6a12;
 }
@@ -34,7 +35,7 @@
   color-scheme: light;
   /* hauteur de la frise d'activité (posée par l'application) */
   --frieze-h: 0px;
-  --paper-halo: rgba(246, 241, 230, 0.88);
+  --paper-halo: rgba(251, 250, 247, 0.92);
 }
 
 html,
@@ -42,31 +43,19 @@ body,
 #root {
   height: 100%;
   margin: 0;
-  background: #f4efe3;
-  color: #26231d;
+  background: #fbfaf7;
+  color: #1d1b18;
   font-family: var(--font-sans);
   font-size: 15px;
   line-height: 1.55;
 }
 
-/* ——— fond : papier vergé, vignette chaude ——— */
 .atlas-bg {
   position: fixed;
   inset: 0;
-  background:
-    radial-gradient(ellipse at 50% 38%, #f8f4ea 0%, #f1ead9 62%, #e7dcc4 100%),
-    #f4efe3;
+  background: #fbfaf7;
   pointer-events: none;
 }
-.grain {
-  position: fixed;
-  inset: 0;
-  opacity: 0.07;
-  mix-blend-mode: multiply;
-  pointer-events: none;
-  z-index: 60;
-  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.28 0 0 0 0 0.18 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
-}
 
 svg.atlas-map {
   position: fixed;
@@ -77,345 +66,206 @@ svg.atlas-map {
   display: block;
 }
 
-/* ——— couches du zoom sémantique ——— */
-.layer {
-  transition: opacity 250ms ease;
-}
-svg.atlas-map[data-level='0'] .layer-1,
-svg.atlas-map[data-level='0'] .layer-2,
-svg.atlas-map[data-level='0'] .layer-3,
-svg.atlas-map[data-level='1'] .layer-2,
-svg.atlas-map[data-level='1'] .layer-3,
-svg.atlas-map[data-level='2'] .layer-3 {
-  opacity: 0;
-  pointer-events: none;
-}
-svg.atlas-map[data-level='2'] .links-layer,
-svg.atlas-map[data-level='3'] .links-layer {
-  opacity: 0.3;
-}
-
-/* ——— fleuves ——— */
-.river-bed {
-  transition: opacity 300ms ease;
+/* ——— fond : bandes des champs, ères, années ——— */
+.lane-rule {
+  stroke: #e2ddd2;
+  stroke-width: 1px;
+  vector-effect: non-scaling-stroke;
 }
-.river-bank {
-  fill: none;
-  stroke-width: 1.2px;
+.era-rule {
+  stroke: #d8d2c6;
+  stroke-width: 1px;
+  stroke-dasharray: 2 5;
   vector-effect: non-scaling-stroke;
-  stroke-linecap: round;
-  opacity: 0.75;
 }
-.river-current {
-  fill: none;
-  stroke-width: 0.8px;
+.tick-rule {
+  stroke: #ebe7de;
+  stroke-width: 1px;
   vector-effect: non-scaling-stroke;
-  stroke-dasharray: 22 16;
-  stroke-linecap: round;
-  opacity: 0.4;
 }
-.river-sea {
-  pointer-events: none;
+.tick-year {
+  font-family: var(--font-sans);
+  font-size: calc(10px / var(--k, 1));
+  fill: #9a9284;
 }
-.rivers.has-selection .river-bed {
-  opacity: 0.75;
+
+/* ——— domaines ——— */
+.territory {
+  cursor: pointer;
+  outline: none;
+  transition: opacity 300ms ease;
 }
-.rivers.vision-filiations,
-.rivers.vision-reseaux {
-  opacity: 0.45;
+.territory .disc {
+  transition:
+    filter 200ms ease,
+    fill-opacity 300ms ease;
 }
-/* natures : l'encre des lacs prime sur la teinte des champs */
-.rivers.vision-natures {
-  opacity: 0.55;
+/* zoomé dans un domaine : le disque s'efface devant ses figures et ses résultats */
+svg.atlas-map[data-level='2'] .territory .disc,
+svg.atlas-map[data-level='3'] .territory .disc {
+  fill-opacity: 0.45;
 }
-/* repères de cumul (résultats déjà recensés en amont) */
-.river-tally {
-  font-family: var(--font-serif);
-  font-style: italic;
-  font-weight: 600;
-  font-size: calc(13px / var(--k, 1));
-  text-anchor: middle;
-  paint-order: stroke;
-  stroke: var(--paper-halo);
-  stroke-width: calc(3px / var(--k, 1));
+svg.atlas-map[data-level='0'] .territory:hover .disc,
+svg.atlas-map[data-level='1'] .territory:hover .disc {
+  filter: brightness(0.96) saturate(1.15);
+}
+.territory .ring,
+.territory .chain-ring {
+  fill: none;
+  vector-effect: non-scaling-stroke;
   pointer-events: none;
 }
-svg.atlas-map[data-level='2'] .river-tally,
-svg.atlas-map[data-level='3'] .river-tally {
-  opacity: 0;
+.territory .ring {
+  stroke-width: 2px;
 }
-
-/* ——— libellés : taille calculée par territoire (--fs, unités carte) ———
-   vue d'ensemble : plancher de lisibilité de 6.6 px à l'écran (le nom peut
-   déborder du lac jusqu'à --fs-max), plafond de 28 px */
 .territory-name {
-  font-family: var(--font-serif);
+  font-family: var(--font-sans);
   font-weight: 700;
-  letter-spacing: 0.09em;
-  text-transform: uppercase;
-  font-size: min(max(calc(var(--fs, 40) * 1px), calc(6.6px / var(--k, 1))), calc(var(--fs-max, 80) * 1px), calc(28px / var(--k, 1)));
-  text-anchor: middle;
-  fill: var(--label, #26231d);
+  letter-spacing: 0.06em;
   paint-order: stroke;
   stroke: var(--paper-halo);
-  stroke-width: calc(3.5px / var(--k, 1));
+  stroke-width: calc(3px / var(--k, 1));
   stroke-linejoin: round;
-  transition: fill 200ms ease;
+  pointer-events: none;
 }
-/* dernière ligne du bloc (tspan) : taille relative au nom */
-.territory-period {
+.theory-label {
+  font-family: var(--font-serif);
   font-style: italic;
-  font-weight: 500;
-  font-size: 0.74em;
-  letter-spacing: 0.02em;
-  text-transform: none;
-  fill: #6b6354;
-  stroke-width: calc(3px / var(--k, 1));
-  transition:
-    fill-opacity 250ms ease,
-    stroke-opacity 250ms ease;
-}
-.territory-labels {
-  transition:
-    opacity 250ms ease,
-    transform 300ms ease;
-}
-/* niveaux ≥ 1 : le nom monte vers le haut du territoire pour laisser la place aux enfants */
-svg.atlas-map[data-level='1'] .territory-labels,
-svg.atlas-map[data-level='2'] .territory-labels,
-svg.atlas-map[data-level='3'] .territory-labels {
-  transform: translateY(calc(var(--r, 200) * -0.66px));
-}
-svg.atlas-map[data-level='1'] .territory-name {
-  font-size: min(calc(var(--fs, 40) * 1px), calc(21px / var(--k, 1)));
-}
-/* la période reste dans le panneau dès qu'on entre dans le territoire */
-svg.atlas-map[data-level='1'] .territory-period,
-svg.atlas-map[data-level='2'] .territory-period,
-svg.atlas-map[data-level='3'] .territory-period {
-  fill-opacity: 0;
-  stroke-opacity: 0;
-}
-svg.atlas-map[data-level='2'] .territory-name,
-svg.atlas-map[data-level='3'] .territory-name {
-  font-size: min(calc(var(--fs, 40) * 1px), calc(16px / var(--k, 1)));
-}
-/* niveaux 2-3 : le nom du domaine est dans le fil d'Ariane et le panneau */
-svg.atlas-map[data-level='2'] .territory-labels,
-svg.atlas-map[data-level='3'] .territory-labels {
-  opacity: 0;
-}
-.child-label {
-  text-anchor: middle;
+  font-weight: 600;
   paint-order: stroke;
   stroke: var(--paper-halo);
+  stroke-width: calc(3px / var(--k, 1));
   stroke-linejoin: round;
   pointer-events: none;
 }
-.theory-label {
-  font-family: var(--font-serif);
-  font-style: italic;
-  font-size: calc(16px / var(--k, 1));
-  font-weight: 700;
-  letter-spacing: 0.01em;
-  stroke-width: calc(3.5px / var(--k, 1));
+.territory.dimmed {
+  opacity: 0.12;
+  pointer-events: none;
 }
-/* niveaux 2-3 : les théories s’effacent devant les mathématiciens et descendent sous le centre du blob */
-.theory-label {
-  transition: opacity 250ms ease;
+/* sélection : le domaine choisi, ses voisins, son amont et son aval restent nets */
+.world.dim-others .territory:not(.dimmed):not(.selected):not(.related):not(.chain-up):not(.chain-down) {
+  opacity: 0.35;
 }
-svg.atlas-map[data-level='2'] .theory-label,
-svg.atlas-map[data-level='3'] .theory-label {
-  font-size: calc(13px / var(--k, 1));
-  opacity: 0.7;
-  transform: translateY(calc(22px / var(--k, 1)));
+.world.dim-others .territory.related {
+  opacity: 0.75;
 }
-.mathematician-label {
-  font-family: var(--font-sans);
-  font-weight: 500;
-  font-size: calc(13.5px / var(--k, 1));
-  fill: #2b2822;
-  stroke-width: calc(3px / var(--k, 1));
+.territory:focus-visible .disc {
+  stroke: var(--ink);
+  stroke-width: 2px;
+  vector-effect: non-scaling-stroke;
 }
-.result-label {
-  font-family: var(--font-sans);
-  font-size: calc(12px / var(--k, 1));
-  fill: #4b463b;
-  stroke-width: calc(3px / var(--k, 1));
+.figure-dot {
+  fill: #fcfaf5;
+}
+.child-selected .figure-dot {
+  fill: #1d1b18;
+}
+.result-diamond {
+  stroke: #fcfaf5;
 }
-/* élément choisi dans le panneau : anneau de Prusse, libellé appuyé */
 .child-ring {
   fill: none;
-  r: calc(13px / var(--k, 1));
-  stroke-width: calc(1.8px / var(--k, 1));
   pointer-events: none;
 }
-.child-selected .child-label {
-  font-weight: 700;
-  fill: #26231d;
+.child-hit {
+  fill: transparent;
+  cursor: pointer;
 }
 
-.territory {
+/* ——— médailles et noms (LabelLayer) ——— */
+.medallion {
   cursor: pointer;
   outline: none;
-  transition: opacity 300ms ease;
-}
-.territory .fill {
-  transition: opacity 300ms ease;
-}
-.territory .rim,
-.territory .waterline {
-  pointer-events: none;
+  transition: opacity 250ms ease;
 }
-.territory .waterline {
-  fill: none;
-  stroke-width: 0.8px;
-  vector-effect: non-scaling-stroke;
-  stroke-dasharray: 1.5 4;
-  stroke-linecap: round;
-  opacity: 0.5;
+.medal-ring {
+  fill: #fbfaf7;
 }
-.territory .edge {
-  fill: none;
-  vector-effect: non-scaling-stroke;
-  stroke-linecap: round;
-  stroke-linejoin: round;
-  transition: stroke-width 200ms ease;
-}
-.territory.dimmed {
-  opacity: 0.12;
+.medal-initial {
+  font-family: var(--font-serif);
+  font-weight: 600;
+  fill: #fff;
   pointer-events: none;
 }
-/* vision « natures » : territoires sans la nature choisie (restent cliquables) */
-.territory.veil {
-  opacity: 0.2;
-}
-/* sélection : le bassin amont et l'aval direct restent nets, le reste s'efface */
-.world.dim-others .territory:not(.dimmed):not(.selected):not(.related):not(.veil):not(.chain-up):not(.chain-down) {
-  opacity: 0.32;
+.medallion:hover .medal,
+.medallion:focus-visible .medal,
+.medallion.selected .medal {
+  filter: brightness(1.15);
 }
-.world.dim-others .territory.related {
-  opacity: 0.7;
-}
-.world.dim-others .territory.chain-up[data-gen='2'] {
-  opacity: 0.88;
-}
-.world.dim-others .territory.chain-up[data-gen='3'] {
-  opacity: 0.74;
-}
-.world.dim-others .territory.chain-up[data-gen='4'] {
-  opacity: 0.6;
-}
-.territory .chain-ring {
-  fill: none;
-  vector-effect: non-scaling-stroke;
-  stroke-linecap: round;
-  pointer-events: none;
+.medallion.selected .medal-ring {
+  stroke: #1d5f96;
 }
-.territory .halo {
-  opacity: 0;
+.point-label {
+  font-family: var(--font-sans);
+  fill: #2b2822;
+  paint-order: stroke;
+  stroke: var(--paper-halo);
+  stroke-width: calc(3px / var(--k, 1));
+  stroke-linejoin: round;
+  cursor: pointer;
   transition: opacity 250ms ease;
 }
-.territory.selected .halo {
-  opacity: 1;
+.point-label.featured {
+  font-family: var(--font-serif);
+  font-weight: 600;
+  fill: #1d1b18;
 }
-/* survol aux niveaux 0-1 : contour appuyé + nom en accent */
-svg.atlas-map[data-level='0'] .territory:hover .edge,
-svg.atlas-map[data-level='1'] .territory:hover .edge {
-  stroke-width: 2.6px;
+.point-label .point-sub {
+  font-family: var(--font-sans);
+  font-weight: 400;
+  fill: #6a6357;
 }
-svg.atlas-map[data-level='0'] .territory:hover .territory-name,
-svg.atlas-map[data-level='1'] .territory:hover .territory-name {
-  fill: var(--accent, #1f4e79);
+.point-label.result {
+  fill: #4a463f;
 }
-.territory:focus-visible {
-  outline: none;
+.point-label.selected {
+  font-weight: 700;
+  fill: #1d5f96;
 }
-.territory:focus-visible .edge {
-  stroke-width: 3px;
-  stroke-opacity: 1;
+.medallion.muted,
+.point-label.muted {
+  opacity: 0.35;
 }
 
-/* ——— liens : courants d'encre ——— */
+/* ——— liens entre domaines : transmission (encre, pointe) et rupture (sanguine barrée) ——— */
 .link {
   fill: none;
   vector-effect: non-scaling-stroke;
   stroke-linecap: round;
+  stroke-width: 1.3px;
 }
-.link-filiation {
-  stroke: #1f3f5b;
-  stroke-width: 1.9px;
-}
-.link-influence {
-  stroke: #3f6f94;
-  stroke-width: 1.6px;
-  stroke-dasharray: 8 5;
-}
-.link-affinite {
-  stroke: #7a6a98;
-  stroke-width: 1.5px;
-  stroke-dasharray: 1.5 5;
-  stroke-linecap: round;
-}
-.link-reaction {
-  stroke: #b5412a;
-  stroke-width: 2px;
-}
-/* densité : discrets par défaut, allumés au survol / à la sélection */
 .link-group {
-  opacity: 0.12;
+  opacity: 0.3;
   transition: opacity 250ms ease;
 }
-.link-group.transversal {
-  opacity: 0.2;
-}
-/* vue d'ensemble : les fleuves d'abord, les liens en filigrane
-   (:where garde la spécificité basse : survol, visions et sélection l'emportent) */
-:where(svg.atlas-map[data-level='0']) .link-group {
-  opacity: 0.08;
-}
-:where(svg.atlas-map[data-level='0']) .link-group.transversal {
-  opacity: 0.13;
+.link-group.principal {
+  opacity: 0.55;
 }
-/* petits écrans, vue d'ensemble : traits fins, pas de pointes de flèche */
-@media (max-width: 1023px) {
-  svg.atlas-map[data-level='0'] .link {
-    stroke-width: 1px;
-  }
-  svg.atlas-map[data-level='0'] .link-group > g {
-    display: none;
-  }
-  /* les libellés de liens encombrent un petit écran : la feuille les liste */
-  .link-label {
-    display: none;
-  }
+/* les ruptures traversent souvent toute la carte : plus discrètes en vue d'ensemble */
+.link-group.principal.rupture {
+  opacity: 0.4;
 }
-.link-group.facts-dim {
-  opacity: 0.06;
+.link-group.rupture .link {
+  stroke-width: 1.6px;
 }
 .link-group.hover-link {
   opacity: 0.9;
 }
 .links-layer.has-selection .link-group:not(.selected-link):not(.chain-link) {
-  opacity: 0.04;
+  opacity: 0.06;
 }
 .links-layer.has-selection .link-group.selected-link {
   opacity: 1;
 }
-/* bassin amont : l'encre de Prusse coule vers le domaine choisi */
+/* amont et aval : l'encre coule dans le sens de la transmission */
 .links-layer.has-selection .link-group.chain-link {
   opacity: var(--chain-o, 0.5);
 }
 .link-group.chain-link .link {
-  stroke: #1d5f96;
   stroke-width: 2.2px;
   stroke-dasharray: 10 7;
   animation: flow 1.4s linear infinite;
 }
-.link-group.chain-down .link {
-  stroke: #8a5a1c;
-  stroke-width: 2.2px;
-}
 @keyframes flow {
   to {
     stroke-dashoffset: -17;
@@ -424,9 +274,8 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
 .link-label {
   font-family: var(--font-serif);
   font-style: italic;
-  font-size: calc(15px / var(--k, 1));
+  font-size: calc(14px / var(--k, 1));
   font-weight: 600;
-  letter-spacing: 0.01em;
   paint-order: stroke;
   stroke: var(--paper-halo);
   stroke-width: calc(4px / var(--k, 1));
@@ -441,8 +290,20 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   cursor: pointer;
   pointer-events: stroke;
 }
+/* petits écrans, vue d'ensemble : traits fins, pas de pointes */
+@media (max-width: 1023px) {
+  svg.atlas-map[data-level='0'] .link {
+    stroke-width: 1px;
+  }
+  svg.atlas-map[data-level='0'] .link-group > g {
+    display: none;
+  }
+  .link-label {
+    display: none;
+  }
+}
 
-/* ——— liens entre mathématiciens (sélection, ou vision « réseaux ») ——— */
+/* ——— liens entre figures (figure choisie) ——— */
 .mlink {
   fill: none;
   vector-effect: non-scaling-stroke;
@@ -452,14 +313,12 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   opacity: 0.9;
   stroke: currentColor;
 }
-.mlink-group.mlink-filiation {
-  color: #1f3f5b;
-}
+.mlink-group.mlink-filiation,
 .mlink-group.mlink-influence {
-  color: #3f6f94;
+  color: #45413a;
 }
 .mlink-group.mlink-affinite {
-  color: #7a6a98;
+  color: #7f758d;
 }
 .mlink-group.mlink-reaction {
   color: #b5412a;
@@ -469,16 +328,15 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
 }
 .mlink-dot {
   fill: currentColor;
-  stroke: #f4efe3;
+  stroke: #fbfaf7;
   stroke-width: 1.5px;
   vector-effect: non-scaling-stroke;
 }
 .mlink-label {
   font-family: var(--font-serif);
   font-style: italic;
-  font-size: calc(14px / var(--k, 1));
+  font-size: calc(13px / var(--k, 1));
   font-weight: 600;
-  letter-spacing: 0.01em;
   fill: currentColor;
   paint-order: stroke;
   stroke: var(--paper-halo);
@@ -486,89 +344,33 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   stroke-linejoin: round;
   pointer-events: none;
 }
-/* vision « réseaux » : tous les arcs à découvert, en filigrane */
-.mlinks-all .mlink {
-  stroke-width: 1.1px;
-  stroke-dasharray: 3 4;
-  opacity: 0.22;
-}
 @media (max-width: 1023px) {
   .mlink-label {
     display: none;
   }
-  .mlinks-all .mlink {
-    opacity: 0.14;
-  }
-}
-
-/* ——— visions ——— */
-.links-layer.vision-filiations .link-group {
-  opacity: 0.55;
-}
-.links-layer.vision-filiations .link-group.transversal {
-  opacity: 0.75;
-}
-.links-layer.vision-filiations .link-group.facts-dim {
-  opacity: 0.16;
-}
-.links-layer.vision-reseaux .link-group,
-.links-layer.vision-reseaux .link-group.transversal {
-  opacity: 0.03;
 }
 
-/* ——— graticule : méridiens des ères, bandes des champs ——— */
-.graticule-line {
-  stroke: rgba(70, 55, 30, 0.22);
-  stroke-width: 1px;
-  stroke-dasharray: 2 7;
-  vector-effect: non-scaling-stroke;
-}
-.continent-band {
-  fill: transparent;
-}
-.continent-band.alt {
-  fill: rgba(120, 96, 52, 0.03);
-}
-
-/* ——— marges : libellés en espace écran ——— */
+/* ——— marge : noms des champs, en espace écran ——— */
 .edge-labels {
   position: fixed;
   inset: 0;
   pointer-events: none;
   z-index: 5;
-  font-family: var(--font-serif);
+  font-family: var(--font-sans);
   font-weight: 700;
   text-transform: uppercase;
-  color: rgba(60, 50, 35, 0.55);
 }
 .edge-continent {
   position: absolute;
   left: 6px;
-  font-size: 11px;
-  letter-spacing: 0.2em;
+  font-size: 10.5px;
+  letter-spacing: 0.22em;
   white-space: nowrap;
   transform: translate(-50%, -50%) rotate(-90deg);
   transform-origin: center;
-  /* la rotation se fait autour du centre : on place le centre à left+w/2 */
   margin-left: 7px;
 }
 
-/* ——— marqueurs ——— */
-.marker-mathematician {
-  stroke-width: calc(1.4px / var(--k, 1));
-}
-.result-diamond {
-  stroke-width: calc(1px / var(--k, 1));
-  transition: opacity 200ms ease;
-}
-.result-diamond.result-veil {
-  opacity: 0.2;
-}
-.child-hit {
-  fill: transparent;
-  cursor: pointer;
-}
-
 /* ——— frise d'activité ——— */
 .frieze {
   position: fixed;
@@ -576,9 +378,8 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   bottom: 0;
   z-index: 30;
   height: var(--frieze-h);
-  background: rgba(247, 243, 234, 0.94);
-  border-top: 1px solid rgba(60, 48, 30, 0.18);
-  box-shadow: 0 -6px 18px rgba(60, 45, 20, 0.06);
+  background: rgba(251, 250, 247, 0.96);
+  border-top: 1px solid #e2ddd2;
   user-select: none;
   touch-action: none;
 }
@@ -587,41 +388,37 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   cursor: pointer;
 }
 .frieze-era {
-  font-family: var(--font-serif);
+  font-family: var(--font-sans);
   font-weight: 700;
-  font-size: 10.5px;
-  letter-spacing: 0.16em;
+  font-size: 9.5px;
+  letter-spacing: 0.2em;
   text-transform: uppercase;
-  fill: rgba(60, 50, 35, 0.6);
+  fill: #9a9284;
 }
 .frieze-tick {
-  font-family: var(--font-serif);
-  font-style: italic;
-  font-weight: 600;
-  font-size: 11.5px;
-  fill: rgba(60, 50, 35, 0.62);
+  font-family: var(--font-sans);
+  font-size: 10.5px;
+  fill: #7a7366;
 }
 .frieze-window {
-  fill: rgba(31, 78, 121, 0.06);
-  stroke: #1f4e79;
-  stroke-width: 1.4px;
+  fill: rgba(29, 95, 150, 0.05);
+  stroke: #1d5f96;
+  stroke-width: 1.3px;
 }
 .frieze-selected {
-  fill: rgba(181, 65, 42, 0.12);
+  fill: rgba(181, 65, 42, 0.1);
   stroke: #b5412a;
   stroke-width: 1px;
 }
 
-/* ——— interface : cartes de papier ——— */
+/* ——— interface : cartes blanches ——— */
 .glass {
-  background: rgba(250, 247, 240, 0.94);
-  backdrop-filter: blur(8px);
-  -webkit-backdrop-filter: blur(8px);
-  border: 1px solid rgba(60, 48, 30, 0.16);
-  border-radius: 10px;
+  background: #fffefb;
+  border: 1px solid #e2ddd2;
+  border-radius: 12px;
   box-shadow:
-    0 1px 2px rgba(60, 45, 20, 0.08),
-    0 8px 28px rgba(60, 45, 20, 0.12);
+    0 1px 2px rgba(40, 32, 20, 0.05),
+    0 10px 30px rgba(40, 32, 20, 0.08);
 }
 .chip {
   display: inline-flex;
@@ -629,39 +426,71 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   gap: 0.35rem;
   padding: 0.15rem 0.6rem;
   border-radius: 999px;
-  border: 1px solid rgba(38, 35, 29, 0.2);
+  border: 1px solid #e2ddd2;
   font-size: 0.8rem;
-  color: #4b463b;
-  background: rgba(255, 255, 255, 0.35);
+  color: #4a463f;
+  background: #fffefb;
 }
 .chip.active {
-  border-color: rgba(31, 78, 121, 0.7);
-  color: #1f4e79;
-  background: rgba(31, 78, 121, 0.07);
+  border-color: #1d5f96;
+  color: #1d5f96;
+  background: rgba(29, 95, 150, 0.06);
 }
-
-/* titres de section (panneaux, tiroirs) : capitales de gravure */
 .section-title {
   font-family: var(--font-serif);
-  font-weight: 700;
-  font-size: 1.3rem;
+  font-weight: 600;
+  font-size: 1.25rem;
   line-height: 1.2;
-  color: #26231d;
-  border-bottom: 1px solid rgba(38, 35, 29, 0.14);
-  padding-bottom: 0.25rem;
-  margin-bottom: 0.5rem;
+  color: #1d1b18;
+  border-bottom: 1px solid #e2ddd2;
+  padding-bottom: 0.3rem;
+  margin-bottom: 0.6rem;
 }
-/* variante compacte (légende, filtres) : sans filet, plus petite */
 .section-title-sm {
   font-family: var(--font-serif);
-  font-weight: 700;
-  font-size: 1.1rem;
+  font-weight: 600;
+  font-size: 1.05rem;
   line-height: 1.25;
-  color: #26231d;
+  color: #1d1b18;
+}
+
+/* médaille du panneau */
+.medallion-ui {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  flex-shrink: 0;
+  border-radius: 999px;
+  color: #fff;
+  font-family: var(--font-serif);
+  font-weight: 600;
+  line-height: 1;
+}
+/* signature d'une grande figure : en italique, sous le nom */
+.signature li {
+  font-family: var(--font-serif);
+  font-style: italic;
+  font-size: 1.05rem;
+  line-height: 1.45;
+  color: #4a463f;
+}
+/* étapes d'une démonstration : numérotées */
+.proof-steps {
+  list-style: decimal;
+  padding-left: 1.4rem;
+  margin: 0;
+  display: grid;
+  gap: 0.5rem;
+}
+.proof-steps li::marker {
+  font-family: var(--font-serif);
+  font-weight: 600;
+  color: #1d5f96;
 }
 
 .badge-fait,
-.badge-interp {
+.badge-interp,
+.badge-principal {
   display: inline-block;
   font-size: 0.66rem;
   font-weight: 700;
@@ -674,13 +503,18 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
 }
 .badge-fait {
   color: #245a3a;
-  background: #e0ecdf;
-  border-color: #b5d0ba;
+  background: #e5f0e4;
+  border-color: #b9d4be;
 }
 .badge-interp {
   color: #7d520c;
-  background: #f5e6c4;
-  border-color: #e0c27f;
+  background: #f7ecd2;
+  border-color: #e3c78a;
+}
+.badge-principal {
+  color: #45413a;
+  background: #f3f1ec;
+  border-color: #d8d2c6;
 }
 
 /* nature d'un résultat : pastille creuse, encre par genre */
@@ -695,7 +529,7 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
   border: 1px solid currentColor;
   vertical-align: middle;
   white-space: nowrap;
-  color: #4b463b;
+  color: #4a463f;
 }
 .badge-kind-theoreme {
   color: #1f4e79;
@@ -718,32 +552,21 @@ svg.atlas-map[data-level='1'] .territory:hover .territory-name {
 
 .panel-scroll {
   scrollbar-width: thin;
-  scrollbar-color: rgba(38, 35, 29, 0.25) transparent;
-}
-
-/* mobile : le flou d'arrière-plan coûte très cher au défilement —
-   on le remplace par un fond quasi opaque (même papier) */
-@media (max-width: 1023px) {
-  .glass {
-    backdrop-filter: none;
-    -webkit-backdrop-filter: none;
-    background: rgba(250, 247, 240, 0.98);
-  }
+  scrollbar-color: rgba(29, 27, 24, 0.22) transparent;
 }
 
 button:focus-visible,
 a:focus-visible,
 [tabindex]:focus-visible {
-  outline: 2px solid #1f4e79;
+  outline: 2px solid #1d5f96;
   outline-offset: 2px;
 }
 
 @media (prefers-reduced-motion: reduce) {
-  .layer,
   .link-group,
   .territory,
-  .territory .fill,
-  .territory .halo {
+  .medallion,
+  .point-label {
     transition: none !important;
   }
   .link-group.chain-link .link {
diff --git a/src/lib/__tests__/mactutor.test.ts b/src/lib/__tests__/mactutor.test.ts
new file mode 100644
index 0000000..9a18412
--- /dev/null
+++ b/src/lib/__tests__/mactutor.test.ts
@@ -0,0 +1,35 @@
+import { describe, it, expect } from 'vitest';
+import { parseLifeYears, parseYear, compareYears } from '../mactutor';
+
+const page = (born: string, died?: string) =>
+  `<dl>\n    <dt>Born</dt>\n    <dd>\n      ${born} <br />  <a href="../../Map/#X">X</a>\n    </dd>${
+    died ? `\n    <dt>Died</dt>\n    <dd>\n      ${died} <br /> Y\n    </dd>` : ''
+  }</dl>`;
+
+describe('années MacTutor', () => {
+  it('formes de dates rencontrées', () => {
+    expect(parseYear('15 April 1707')).toEqual({ year: 1707, approx: false });
+    expect(parseYear('about 325 BC')).toEqual({ year: -325, approx: true });
+    expect(parseYear('March 415')).toEqual({ year: 415, approx: false });
+    expect(parseYear('10 June 0940')).toEqual({ year: 940, approx: false });
+    expect(parseYear('598')).toEqual({ year: 598, approx: false });
+  });
+
+  it('page complète, vivant·e sans « Died »', () => {
+    expect(parseLifeYears(page('15 April 1707', '18 September 1783'))).toEqual({
+      born: { year: 1707, approx: false },
+      died: { year: 1783, approx: false },
+    });
+    expect(parseLifeYears(page('11 April 1953'))).toEqual({ born: { year: 1953, approx: false }, died: null });
+  });
+
+  it('comparaison : exacte pour des dates précises, ±15 ans si l’une est approximative', () => {
+    const euler = parseLifeYears(page('15 April 1707', '18 September 1783'));
+    expect(compareYears([1707, 1783], false, euler).verdict).toBe('ok');
+    expect(compareYears([1708, 1783], false, euler).verdict).toBe('ecart');
+    const hypatie = parseLifeYears(page('about 370', 'March 415'));
+    expect(compareYears([355, 415], true, hypatie).verdict).toBe('ok');
+    expect(compareYears([1953, null], false, parseLifeYears(page('11 April 1953'))).verdict).toBe('ok');
+    expect(compareYears([1953, 2020], false, parseLifeYears(page('11 April 1953'))).verdict).toBe('ecart');
+  });
+});
diff --git a/src/lib/mactutor.ts b/src/lib/mactutor.ts
new file mode 100644
index 0000000..117ea8e
--- /dev/null
+++ b/src/lib/mactutor.ts
@@ -0,0 +1,53 @@
+/**
+ * Lecture des années de naissance et de mort d'une biographie MacTutor
+ * (https://mathshistory.st-andrews.ac.uk/Biographies/<slug>/). La page porte
+ * `<dt>Born</dt><dd>15 April 1707 <br/> …` et `<dt>Died</dt><dd>…` ; formes
+ * rencontrées : « about 325 BC », « March 415 », « 10 June 0940 », « 598 ».
+ */
+export interface LifeYear {
+  year: number;
+  approx: boolean;
+}
+
+export interface LifeYears {
+  born: LifeYear | null;
+  died: LifeYear | null;
+}
+
+function field(html: string, label: 'Born' | 'Died'): string | null {
+  const m = html.replace(/\s+/g, ' ').match(new RegExp(`<dt>\\s*${label}\\s*</dt>\\s*<dd>([^<]*)`));
+  return m ? m[1].trim() : null;
+}
+
+/** « about 325 BC » → −325 (approx), « 10 June 0940 » → 940, « March 415 » → 415. */
+export function parseYear(text: string): LifeYear | null {
+  const m = text.match(/(about|c\.|circa)?\s*(?:\d{1,2}\s+)?(?:[A-Z][a-z]+\s+)?(\d{1,4})\s*(BC)?/);
+  if (!m) return null;
+  const n = Number(m[2]);
+  if (!Number.isFinite(n) || n === 0) return null;
+  return { year: m[3] ? -n : n, approx: !!m[1] };
+}
+
+export function parseLifeYears(html: string): LifeYears {
+  const b = field(html, 'Born');
+  const d = field(html, 'Died');
+  return { born: b ? parseYear(b) : null, died: d ? parseYear(d) : null };
+}
+
+export type Verdict = 'ok' | 'ecart' | 'manquant';
+
+/**
+ * Compare les années de l'atlas à celles de MacTutor. Tolérance : 0 an pour deux
+ * dates précises, 15 ans si l'une des deux est approximative. Un vivant de l'atlas
+ * (mort = null) doit être sans date de mort chez MacTutor, et réciproquement.
+ */
+export function compareYears(atlas: [number, number | null], approx: boolean, mt: LifeYears): { verdict: Verdict; detail: string } {
+  if (!mt.born) return { verdict: 'manquant', detail: 'naissance illisible sur MacTutor' };
+  const tol = (a: boolean) => (approx || a ? 15 : 0);
+  const msgs: string[] = [];
+  if (Math.abs(atlas[0] - mt.born.year) > tol(mt.born.approx)) msgs.push(`naissance ${atlas[0]} ≠ ${mt.born.year}`);
+  if (atlas[1] === null && mt.died) msgs.push(`vivant·e dans l’atlas, mort·e en ${mt.died.year} sur MacTutor`);
+  if (atlas[1] !== null && !mt.died) msgs.push(`mort·e en ${atlas[1]} dans l’atlas, sans date de mort sur MacTutor`);
+  if (atlas[1] !== null && mt.died && Math.abs(atlas[1] - mt.died.year) > tol(mt.died.approx)) msgs.push(`mort ${atlas[1]} ≠ ${mt.died.year}`);
+  return msgs.length ? { verdict: 'ecart', detail: msgs.join(' ; ') } : { verdict: 'ok', detail: '' };
+}
diff --git a/src/map/ActivityFrieze.tsx b/src/map/ActivityFrieze.tsx
index a8495c9..b4a69f3 100644
--- a/src/map/ActivityFrieze.tsx
+++ b/src/map/ActivityFrieze.tsx
@@ -154,12 +154,12 @@ export const ActivityFrieze = memo(function ActivityFrieze({ controller, height,
             );
           })}
           {streams.map((s) => (
-            <path key={s.c} d={s.d} fill={FIELD_COLORS[s.c].water} fillOpacity={0.9} stroke={FIELD_COLORS[s.c].bank} strokeWidth={0.7} />
+            <path key={s.c} d={s.d} fill={FIELD_COLORS[s.c].wash} stroke={FIELD_COLORS[s.c].ink} strokeOpacity={0.45} strokeWidth={0.7} />
           ))}
           {sel && <rect className="frieze-selected" x={sx(sel.x0)} y={top} width={Math.max(2, sx(sel.x1) - sx(sel.x0))} height={bottom - top} rx={2} />}
           {/* hors fenêtre : voile de papier */}
-          <rect x={PAD_L} y={top - 2} width={Math.max(0, sx(wx0) - PAD_L)} height={bottom - top + 4} fill="rgba(247,243,234,0.6)" />
-          <rect x={sx(wx1)} y={top - 2} width={Math.max(0, PAD_L + plotW - sx(wx1))} height={bottom - top + 4} fill="rgba(247,243,234,0.6)" />
+          <rect x={PAD_L} y={top - 2} width={Math.max(0, sx(wx0) - PAD_L)} height={bottom - top + 4} fill="rgba(251,250,247,0.65)" />
+          <rect x={sx(wx1)} y={top - 2} width={Math.max(0, PAD_L + plotW - sx(wx1))} height={bottom - top + 4} fill="rgba(251,250,247,0.65)" />
           <rect className="frieze-window" x={sx(wx0)} y={top - 2} width={Math.max(2, sx(wx1) - sx(wx0))} height={bottom - top + 4} rx={3} />
           {ticks.map((y) => (
             <text key={y} className="frieze-tick" x={sx(yearToX(y))} y={height - 3} textAnchor="middle">
@@ -178,7 +178,7 @@ export const ActivityFrieze = memo(function ActivityFrieze({ controller, height,
           <span className="font-serif italic font-semibold text-sm mr-2">≈ {formatYear(displayYear(xToYear(hover)), lang)}</span>
           {ORDER.map((c) => (
             <span key={c} className="mr-2">
-              <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ background: FIELD_COLORS[c].water, border: `1px solid ${FIELD_COLORS[c].bank}` }} />
+              <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ background: FIELD_COLORS[c].wash, border: `1px solid ${FIELD_COLORS[c].ink}` }} />
               {continentName.get(c)} {data.series[c][hoverBin]}
             </span>
           ))}
diff --git a/src/map/GalleryBackdrop.tsx b/src/map/GalleryBackdrop.tsx
new file mode 100644
index 0000000..f72b4dd
--- /dev/null
+++ b/src/map/GalleryBackdrop.tsx
@@ -0,0 +1,41 @@
+import { memo } from 'react';
+import { CONTINENTS, ERA_BANDS, MAP_SIZE } from '../data';
+import { FIELD_COLORS } from './fieldColors';
+import { yearToX, YEAR_TICKS } from './timeScale';
+
+/** graduations qui coïncident avec une frontière d'ère : la règle de l'ère suffit */
+const ERA_STARTS = new Set(ERA_BANDS.map((b) => b.x0));
+const TICK_Y = 116;
+
+/** Graduation compacte : « −1500 », « 1 », « 1850 ». */
+const tickLabel = (y: number) => (y < 0 ? `−${-y}` : String(y));
+
+/**
+ * Fond de la carte « Galerie » : les cinq bandes des champs, très pâles, les
+ * frontières des ères et quelques années en filigrane (les ères sont nommées
+ * par la frise). Tout le reste est posé dessus.
+ */
+export const GalleryBackdrop = memo(function GalleryBackdrop() {
+  const ticks = YEAR_TICKS.map((y) => ({ y, x: yearToX(y) })).filter((t) => !ERA_STARTS.has(t.x));
+  return (
+    <g className="backdrop" aria-hidden="true">
+      {CONTINENTS.map((c) => (
+        <rect key={c.id} className="lane" data-field={c.id} x={0} y={c.y0} width={MAP_SIZE.width} height={c.y1 - c.y0} fill={FIELD_COLORS[c.id].band} />
+      ))}
+      {CONTINENTS.slice(1).map((c) => (
+        <line key={c.id} className="lane-rule" x1={0} x2={MAP_SIZE.width} y1={c.y0} y2={c.y0} />
+      ))}
+      {ERA_BANDS.slice(1).map((b) => (
+        <line key={b.era} className="era-rule" x1={b.x0} x2={b.x0} y1={0} y2={MAP_SIZE.height} />
+      ))}
+      {ticks.map((t) => (
+        <g key={t.y}>
+          <line className="tick-rule" x1={t.x} x2={t.x} y1={TICK_Y + 10} y2={MAP_SIZE.height} />
+          <text className="tick-year" x={t.x} y={TICK_Y} textAnchor="middle">
+            {tickLabel(t.y)}
+          </text>
+        </g>
+      ))}
+    </g>
+  );
+});
diff --git a/src/map/LabelLayer.tsx b/src/map/LabelLayer.tsx
new file mode 100644
index 0000000..eed92b7
--- /dev/null
+++ b/src/map/LabelLayer.tsx
@@ -0,0 +1,208 @@
+import { memo, useMemo } from 'react';
+import type { Result } from '../data/types';
+import type { AtlasLayout, ChildPos } from './layout';
+import { levelFor, useViewTransform } from './viewStore';
+import { declutter, textWidth, type LabelItem, type Rect } from './declutter';
+import { domainNameCenter, domainNameMetrics } from './labelMetrics';
+import { shortTheoryName, wrapWords } from './labels';
+import { useData } from '../i18n/localize';
+import { useLang } from '../i18n/lang';
+import { formatLifespan, formatYear } from '../lib/years';
+import type { Selection } from '../state/store';
+
+interface Props {
+  layout: AtlasLayout;
+  selection: Selection | null;
+  dimmedIds: Set<string>;
+  /** domaines restés vifs pendant une sélection (choisi, liés, amont, aval) ; null : pas de sélection */
+  vividDomainIds: Set<string> | null;
+  onSelect: (sel: Selection) => void;
+}
+
+interface Entry {
+  c: ChildPos;
+  domainId: string;
+  kind: 'featured' | 'figure' | 'result';
+  label: string;
+  /** grandes figures : résultat phare et année (niveaux ≥ 1) */
+  sub?: string;
+  initial?: string;
+  color?: string;
+  title: string;
+}
+
+/** marge hors écran (px) */
+const PAD = 160;
+/** tailles des noms à l'écran (px) */
+const PX = { featured: 13, sub: 10, figure: 12, result: 11, theory: 15 };
+
+/**
+ * Médailles des grandes figures et noms de tous les points de la carte
+ * (grandes figures, figures ordinaires, résultats), désencombrés à chaque
+ * zoom : priorité à l'élément choisi, puis aux grandes figures, aux figures
+ * à résultats, aux résultats, enfin aux fiches courtes. Les noms des domaines
+ * (niveaux 0-1) et des théories (niveau 1) sont des obstacles.
+ */
+export const LabelLayer = memo(function LabelLayer({ layout, selection, dimmedIds, vividDomainIds, onSelect }: Props) {
+  const { lang } = useLang();
+  const data = useData();
+  const v = useViewTransform();
+  const lvl = levelFor(v.k);
+
+  const entries = useMemo<Entry[]>(() => {
+    const resultById = new Map<string, Result>();
+    for (const d of data.domains) for (const r of d.results) resultById.set(r.id, r);
+    const out: Entry[] = [];
+    for (const t of layout.territories) {
+      const d = data.domainById[t.id];
+      if (!d) continue;
+      for (const c of t.children) {
+        if (c.kind === 'mathematician') {
+          const m = data.mathematicianById[c.id];
+          if (!m) continue;
+          const life = formatLifespan(m.years, lang, m.yearsApprox);
+          if (c.featured && m.featured) {
+            const h = resultById.get(m.featured.headlineResultIds[0]);
+            out.push({
+              c,
+              domainId: t.id,
+              kind: 'featured',
+              label: m.name,
+              sub: h ? `${h.title} · ${formatYear(h.year, lang, h.yearApprox)}` : undefined,
+              initial: m.id[0].toUpperCase(),
+              color: d.map.palette.accent,
+              title: `${m.name} (${life}) — ${m.featured.signature.text}`,
+            });
+          } else out.push({ c, domainId: t.id, kind: 'figure', label: m.name, title: `${m.name} (${life})` });
+        } else if (c.kind === 'result') {
+          const r = resultById.get(c.id);
+          if (r) out.push({ c, domainId: t.id, kind: 'result', label: `${r.title} (${formatYear(r.year, lang, r.yearApprox)})`, title: r.title });
+        }
+      }
+    }
+    return out;
+  }, [layout, data, lang]);
+
+  const inView = (x: number, y: number) => {
+    const sx = v.x + x * v.k;
+    const sy = v.y + y * v.k;
+    return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
+  };
+  const selId = selection && (selection.kind === 'mathematician' || selection.kind === 'result') ? selection.id : null;
+  /** rayon des médailles (px) : en vue d'ensemble, il suit le zoom (≈ 7 px sur un grand écran, 3,5 px au plus petit) */
+  const medR = lvl === 0 ? Math.max(3.5, Math.min(7, 40 * v.k)) : 10;
+
+  const shown = entries.filter((e) => {
+    if (dimmedIds.has(e.domainId) || !inView(e.c.x, e.c.y)) return false;
+    if (e.kind === 'featured') return true;
+    if (e.kind === 'figure') return lvl >= (e.c.nameLevel ?? 2);
+    return lvl >= 3;
+  });
+
+  // obstacles : noms des domaines (niveaux 0-1), noms des théories (niveau 1)
+  const obstacles: Rect[] = [];
+  if (lvl <= 1) {
+    for (const t of layout.territories) {
+      const d = data.domainById[t.id];
+      if (!d || dimmedIds.has(t.id) || !inView(t.x, t.y)) continue;
+      const m = domainNameMetrics(d, t.r, v.k);
+      const c = domainNameCenter(t, lvl);
+      obstacles.push({ x: v.x + c.x * v.k - m.w / 2, y: v.y + c.y * v.k - m.h / 2, w: m.w, h: m.h });
+      if (lvl === 1) {
+        for (const ch of t.children) {
+          if (ch.kind !== 'theory' || !inView(ch.x, ch.y)) continue;
+          const s = d.theories.find((x) => x.id === ch.id);
+          if (!s) continue;
+          const lines = wrapWords(shortTheoryName(s.name), 18, 2);
+          const w = Math.max(...lines.map((l) => textWidth(l, PX.theory)));
+          const h = lines.length * PX.theory * 1.15;
+          obstacles.push({ x: v.x + ch.x * v.k - w / 2, y: v.y + ch.y * v.k - h / 2, w, h });
+        }
+      }
+    }
+  }
+
+  const items: LabelItem[] = shown.map((e) => {
+    const x = v.x + e.c.x * v.k;
+    const y = v.y + e.c.y * v.k;
+    const first = e.c.id === selId ? -1 : null;
+    if (e.kind === 'featured') {
+      const withSub = lvl >= 1 && !!e.sub;
+      const w = Math.max(textWidth(e.label, PX.featured), withSub ? textWidth(e.sub!, PX.sub) : 0);
+      return { id: e.c.id, x, y, w, h: withSub ? 31 : 17, priority: first ?? 0, r: medR + 2 };
+    }
+    if (e.kind === 'figure') return { id: e.c.id, x, y, w: textWidth(e.label, PX.figure), h: 16, priority: first ?? (e.c.nameLevel === 3 ? 3 : 1), r: 4 };
+    return { id: e.c.id, x, y, w: textWidth(e.label, PX.result), h: 15, priority: first ?? 2, r: 6 };
+  });
+  const placed = declutter(items, obstacles);
+  const byId = new Map(shown.map((e) => [e.c.id, e]));
+  const muted = (e: Entry) => vividDomainIds !== null && !vividDomainIds.has(e.domainId);
+  const select = (e: Entry) => onSelect({ kind: e.kind === 'result' ? 'result' : 'mathematician', id: e.c.id });
+
+  return (
+    <g className="label-layer">
+      {shown
+        .filter((e) => e.kind === 'featured')
+        .map((e) => (
+          <g
+            key={e.c.id}
+            className={`medallion${e.c.id === selId ? ' selected' : ''}${muted(e) ? ' muted' : ''}`}
+            data-testid="medallion"
+            data-id={e.c.id}
+            role="button"
+            tabIndex={0}
+            aria-label={e.title}
+            onClick={(ev) => {
+              ev.stopPropagation();
+              select(e);
+            }}
+            onKeyDown={(ev) => {
+              if (ev.key === 'Enter' || ev.key === ' ') {
+                ev.preventDefault();
+                ev.stopPropagation();
+                select(e);
+              }
+            }}
+          >
+            <circle className="medal-ring" cx={e.c.x} cy={e.c.y} r={(medR + 2.5) / v.k} stroke={e.color} strokeWidth={0.9 / v.k} />
+            <circle className="medal" cx={e.c.x} cy={e.c.y} r={medR / v.k} fill={e.color} />
+            {medR >= 7 && (
+              <text className="medal-initial" x={e.c.x} y={e.c.y} dy="0.36em" textAnchor="middle" style={{ fontSize: (medR * 1.2) / v.k }}>
+                {e.initial}
+              </text>
+            )}
+            <title>{e.title}</title>
+          </g>
+        ))}
+      {placed.map((p) => {
+        const e = byId.get(p.id);
+        if (!e) return null;
+        const size = e.kind === 'featured' ? PX.featured : e.kind === 'figure' ? PX.figure : PX.result;
+        const mx = (p.x - v.x) / v.k;
+        const my = (p.y - v.y) / v.k;
+        return (
+          <text
+            key={p.id}
+            className={`point-label ${e.kind}${p.id === selId ? ' selected' : ''}${muted(e) ? ' muted' : ''}`}
+            data-testid={e.kind === 'featured' ? 'featured-label' : undefined}
+            x={mx}
+            y={my + (size * 0.95) / v.k}
+            style={{ fontSize: size / v.k }}
+            onClick={(ev) => {
+              ev.stopPropagation();
+              select(e);
+            }}
+          >
+            {e.label}
+            {e.kind === 'featured' && lvl >= 1 && e.sub && (
+              <tspan className="point-sub" x={mx} dy={`${(PX.sub * 1.45) / v.k}`} style={{ fontSize: PX.sub / v.k }}>
+                {e.sub}
+              </tspan>
+            )}
+            <title>{e.title}</title>
+          </text>
+        );
+      })}
+    </g>
+  );
+});
diff --git a/src/map/LaneLayer.tsx b/src/map/LaneLayer.tsx
deleted file mode 100644
index 5234b47..0000000
--- a/src/map/LaneLayer.tsx
+++ /dev/null
@@ -1,88 +0,0 @@
-import { memo, useMemo } from 'react';
-import { CONTINENTS, DOMAIN_BY_ID, ERA_BANDS, MAP_SIZE } from '../data';
-import { useData } from '../i18n/localize';
-import type { AtlasLayout } from './layout';
-import { periodSpan } from './layout';
-import { FIELD_COLORS } from './fieldColors';
-import { yearToX, YEAR_TICKS } from './timeScale';
-
-/** contre-échelle : glyphes dessinés en pixels écran */
-const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box', transformOrigin: '50% 50%' } as const;
-/** graduations qui coïncident avec une frontière d'ère : la règle de l'ère suffit */
-const ERA_STARTS = new Set(ERA_BANDS.map((b) => b.x0));
-const ERA_NAME_Y = 72;
-const ERA_NAME_SIZE = 54;
-const TICK_Y = 116;
-
-/** Graduation compacte : « −1500 », « 1 », « 1850 ». */
-const tickLabel = (y: number) => (y < 0 ? `−${-y}` : String(y));
-
-interface Props {
-  layout: AtlasLayout;
-}
-
-/**
- * Fond de la carte : les cinq bandes des champs, les ères et les graduations du
- * temps en filigrane, puis la portée de chaque domaine (sa période, posée sur
- * l'axe du temps sous son lac : un trait d'encre de la teinte du domaine, à
- * butées, ouvert vers la droite quand le domaine est toujours actif).
- */
-export const LaneLayer = memo(function LaneLayer({ layout }: Props) {
-  const { eras } = useData();
-  const spans = useMemo(
-    () =>
-      layout.territories.map((t) => {
-        const m = DOMAIN_BY_ID[t.id];
-        const [x0, x1] = periodSpan(m);
-        return { id: t.id, y: t.y, x0, x1, open: m.period.end === null, approx: !!m.period.approx, ink: m.map.palette.stroke };
-      }),
-    [layout],
-  );
-  const ticks = YEAR_TICKS.map((y) => ({ y, x: yearToX(y) })).filter((t) => !ERA_STARTS.has(t.x));
-
-  return (
-    <g className="lanes" aria-hidden="true">
-      {CONTINENTS.map((c) => (
-        <rect key={c.id} className="lane" data-field={c.id} x={0} y={c.y0} width={MAP_SIZE.width} height={c.y1 - c.y0} fill={FIELD_COLORS[c.id].band} />
-      ))}
-      {CONTINENTS.slice(1).map((c) => (
-        <line key={c.id} className="lane-rule" x1={0} x2={MAP_SIZE.width} y1={c.y0} y2={c.y0} />
-      ))}
-      {ERA_BANDS.map((b, i) => {
-        const era = eras.find((e) => e.id === b.era);
-        const label = (era?.shortName ?? era?.name ?? '').toUpperCase();
-        const bw = b.x1 - b.x0;
-        const size = Math.min(ERA_NAME_SIZE, (bw - 90) / Math.max(1, label.length * 0.78));
-        return (
-          <g key={b.era}>
-            {i > 0 && <line className="era-rule" x1={b.x0} x2={b.x0} y1={0} y2={MAP_SIZE.height} />}
-            <text className="era-name" x={(b.x0 + b.x1) / 2} y={ERA_NAME_Y} textAnchor="middle" style={{ fontSize: size }}>
-              {label}
-            </text>
-          </g>
-        );
-      })}
-      {ticks.map((t) => (
-        <g key={t.y}>
-          <line className="tick-rule" x1={t.x} x2={t.x} y1={TICK_Y + 10} y2={MAP_SIZE.height} />
-          <text className="tick-year" x={t.x} y={TICK_Y} textAnchor="middle">
-            {tickLabel(t.y)}
-          </text>
-        </g>
-      ))}
-      <g className="spans">
-        {spans.map((s) => (
-          <g key={s.id} className={`span${s.approx ? ' approx' : ''}`} style={{ color: s.ink }}>
-            <line className="span-line" x1={s.x0} x2={s.x1} y1={s.y} y2={s.y} />
-            <g transform={`translate(${s.x0} ${s.y})`}>
-              <path className="span-cap" d="M0 -6 V6" style={counterScale} />
-            </g>
-            <g transform={`translate(${s.x1} ${s.y})`}>
-              <path className="span-cap" d={s.open ? 'M-7 -6 L0 0 L-7 6' : 'M0 -6 V6'} style={counterScale} />
-            </g>
-          </g>
-        ))}
-      </g>
-    </g>
-  );
-});
diff --git a/src/map/LinkLayer.tsx b/src/map/LinkLayer.tsx
index 7a29bca..fca1b5e 100644
--- a/src/map/LinkLayer.tsx
+++ b/src/map/LinkLayer.tsx
@@ -2,22 +2,22 @@ import { memo, useMemo, type CSSProperties } from 'react';
 import type { Link } from '../data/types';
 import { useLang } from '../i18n/lang';
 import { useData, LINK_KIND_I18N } from '../i18n/localize';
-import { computeLinkGeometries, isTransversal } from './links';
+import { computeLinkGeometries } from './links';
 import type { AtlasLayout } from './layout';
-import type { Filters, VisionId } from '../state/store';
+import type { Filters } from '../state/store';
 import { linkKey, type Chain } from './upstream';
-import { DOWNSTREAM_INK, LINK_INK, UPSTREAM_INK } from './fieldColors';
+import { defaultLinkKeys } from './lineage';
+import { DOWNSTREAM_INK, RUPTURE_INK, TRANSMISSION_INK, UPSTREAM_INK } from './fieldColors';
 
 const DEG = 180 / Math.PI;
 /** contre-échelle : la géométrie dessinée reste en pixels écran */
 const counterScale = { transform: 'scale(calc(1 / var(--k)))', transformBox: 'fill-box' } as const;
-/** opacité d'un courant du bassin selon la génération de son bout le plus lointain */
+/** opacité d'un lien de l'amont ou de l'aval selon la génération de son bout le plus lointain */
 const CHAIN_OPACITY = [1, 1, 0.74, 0.54, 0.4];
 
 interface Props {
   layout: AtlasLayout;
   filters: Filters;
-  vision: VisionId;
   dimmedIds: Set<string>;
   selectedDomainId: string | null;
   hoveredDomainId: string | null;
@@ -26,94 +26,62 @@ interface Props {
 }
 
 /**
- * Liens entre domaines, lus comme les traits d'une généalogie : l'encre va du
- * pâle (origine) au plein (arrivée), la pointe marque l'arrivée. La filiation
- * est un trait plein à pointe pleine, l'influence un trait plus fin à pointe
- * ouverte, l'affinité un pointillé sans sens, la rupture une sanguine barrée.
- * Les interprétations sont tiretées ; les faits, continus.
+ * Liens entre domaines, en deux styles seulement : la transmission (filiation
+ * ou influence, trait d'encre et pointe) et la rupture (sanguine barrée). Par
+ * défaut, seules les lignées principales (un ascendant par domaine) et les
+ * ruptures sont tracées ; « Tous les liens » montre toutes les transmissions.
+ * Survoler ou choisir un domaine montre tous ses liens ; le choisir colore
+ * son amont (Prusse) et son aval (sépia). Les affinités ne sont pas tracées :
+ * elles sont dans le panneau, avec le statut fait / interprétation.
  */
-export const LinkLayer = memo(function LinkLayer({ layout, filters, vision, dimmedIds, selectedDomainId, hoveredDomainId, chain, onLinkClick }: Props) {
+export const LinkLayer = memo(function LinkLayer({ layout, filters, dimmedIds, selectedDomainId, hoveredDomainId, chain, onLinkClick }: Props) {
   const { t } = useLang();
-  const { links } = useData();
-  const geoms = useMemo(() => computeLinkGeometries(links, layout.byId, layout.territories), [layout, links]);
+  const { links, domainById } = useData();
+  const drawable = useMemo(() => links.filter((l) => l.kind !== 'affinite'), [links]);
+  const geoms = useMemo(() => computeLinkGeometries(drawable, layout.byId, layout.territories), [layout, drawable]);
+  const defaults = useMemo(() => defaultLinkKeys(links, domainById), [links, domainById]);
   // les liens localisés sont des copies : on compare par clé
   const upKeys = useMemo(() => new Set(chain ? [...chain.upstreamLinks].map(linkKey) : []), [chain]);
   const downKeys = useMemo(() => new Set(chain ? [...chain.downstreamLinks].map(linkKey) : []), [chain]);
 
   const focusId = selectedDomainId ?? hoveredDomainId;
-  const layerCls = `links-layer layer vision-${vision}${selectedDomainId ? ' has-selection' : hoveredDomainId ? ' has-hover' : ''}`;
+  const layerCls = `links-layer layer${selectedDomainId ? ' has-selection' : hoveredDomainId ? ' has-hover' : ''}`;
 
   return (
     <g className={layerCls}>
-      <defs>
-        {geoms.map((g, i) => (
-          <linearGradient key={i} id={`lg-${i}`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
-            <stop offset="0" stopColor={LINK_INK[g.link.kind]} stopOpacity={0.28} />
-            <stop offset="0.6" stopColor={LINK_INK[g.link.kind]} stopOpacity={0.8} />
-            <stop offset="1" stopColor={LINK_INK[g.link.kind]} stopOpacity={1} />
-          </linearGradient>
-        ))}
-      </defs>
-      {geoms.map((g, i) => {
+      {geoms.map((g) => {
         const l = g.link;
         const key = linkKey(l);
         const inUp = upKeys.has(key);
         const inDown = downKeys.has(key);
         const inChain = inUp || inDown;
-        // vision « filiations & ruptures » : on ne garde que les généalogies et les ruptures (et le bassin choisi)
-        if (vision === 'filiations' && l.kind !== 'filiation' && l.kind !== 'reaction' && !inChain) return null;
-        if (!filters.linkKinds[l.kind]) return null;
+        const incident = focusId !== null && (l.source === focusId || l.target === focusId);
+        const principal = defaults.has(key);
+        if (!(inChain || incident || principal || filters.allLinks)) return null;
         if (dimmedIds.has(l.source) || dimmedIds.has(l.target)) return null;
-        const transversal = isTransversal(l);
-        if (filters.transversalOnly && !transversal && !inChain) return null;
-        const factsDim = filters.factsOnly && l.epistemic === 'interpretation';
+        if (filters.factsOnly && l.epistemic === 'interpretation' && !inChain) return null;
         const isSel = selectedDomainId !== null && (l.source === selectedDomainId || l.target === selectedDomainId);
-        const isHover = !isSel && focusId !== null && (l.source === focusId || l.target === focusId);
-        const groupCls = `link-group kind-${l.kind} epi-${l.epistemic}${transversal ? ' transversal' : ''}${factsDim ? ' facts-dim' : ''}${
-          isSel ? ' selected-link' : ''
-        }${isHover ? ' hover-link' : ''}${inUp ? ' chain-link chain-up' : ''}${inDown ? ' chain-link chain-down' : ''}`;
+        const rupture = l.kind === 'reaction';
+        const ink = inUp ? UPSTREAM_INK : inDown ? DOWNSTREAM_INK : rupture ? RUPTURE_INK : TRANSMISSION_INK;
         const gen = inUp ? (chain?.upstream.get(l.source) ?? 1) : inDown ? (chain?.downstream.get(l.target) ?? 1) : 0;
         const style = inChain ? ({ '--chain-o': String(CHAIN_OPACITY[Math.min(gen, 4)]) } as CSSProperties) : undefined;
-        const ink = inUp ? UPSTREAM_INK : inDown ? DOWNSTREAM_INK : LINK_INK[l.kind];
-        // sens de lecture : toute transmission et toute rupture portent une pointe ; l'affinité n'a pas de sens
-        const arrow = l.kind === 'affinite' ? null : l.kind === 'influence' && !inChain ? 'open' : 'full';
+        const cls = `link-group ${rupture ? 'rupture' : 'transmission'}${principal ? ' principal' : ''}${isSel ? ' selected-link' : ''}${
+          !isSel && incident ? ' hover-link' : ''
+        }${inChain ? ` chain-link ${inUp ? 'chain-up' : 'chain-down'}` : ''}`;
         return (
-          <g key={key} className={groupCls} style={style}>
-            <path className={`link link-${l.kind}`} d={g.d} stroke={`url(#lg-${i})`} />
-            {arrow && (
+          <g key={key} className={cls} style={style} data-kind={l.kind}>
+            <path className="link" d={g.d} stroke={ink} />
+            {!rupture && (
               <g transform={`translate(${g.x2} ${g.y2}) rotate(${g.endAngle * DEG})`}>
-                {arrow === 'full' ? (
-                  <path className="arrow-full" d="M0 0 L-11 -4.5 L-11 4.5 Z" fill={ink} style={{ ...counterScale, transformOrigin: '100% 50%' }} />
-                ) : (
-                  <path
-                    className="arrow-open"
-                    d="M-10 -5 L0 0 L-10 5"
-                    fill="none"
-                    stroke={ink}
-                    strokeWidth={1.6}
-                    strokeLinecap="round"
-                    strokeLinejoin="round"
-                    style={{ ...counterScale, transformOrigin: '100% 50%' }}
-                  />
-                )}
+                <path className="arrow" d="M0 0 L-10 -4.2 L-10 4.2 Z" fill={ink} style={{ ...counterScale, transformOrigin: '100% 50%' }} />
               </g>
             )}
-            {/* barre perpendiculaire des ruptures (≈14 px écran) */}
-            {l.kind === 'reaction' && (
+            {/* barre perpendiculaire des ruptures (≈ 14 px écran) */}
+            {rupture && (
               <g transform={`translate(${g.mid.x} ${g.mid.y}) rotate(${(g.midAngle + Math.PI / 2) * DEG})`}>
-                <line
-                  x1={0}
-                  y1={-7}
-                  x2={0}
-                  y2={7}
-                  stroke={LINK_INK.reaction}
-                  strokeWidth={3}
-                  strokeLinecap="round"
-                  style={{ ...counterScale, transformOrigin: '50% 50%' }}
-                />
+                <line x1={0} y1={-7} x2={0} y2={7} stroke={RUPTURE_INK} strokeWidth={3} strokeLinecap="round" style={{ ...counterScale, transformOrigin: '50% 50%' }} />
               </g>
             )}
-            {/* libellé au milieu de la courbe, uniquement pour les liens du domaine sélectionné */}
             {isSel && (
               <text className="link-label" x={g.mid.x} y={g.mid.y} dy="-0.6em" textAnchor="middle" fill={ink}>
                 {t(LINK_KIND_I18N[l.kind])} — {l.label}
diff --git a/src/map/MapCanvas.tsx b/src/map/MapCanvas.tsx
index ad75fc6..5e5b766 100644
--- a/src/map/MapCanvas.tsx
+++ b/src/map/MapCanvas.tsx
@@ -3,14 +3,15 @@ import * as d3 from 'd3';
 import { MAP_SIZE } from '../data';
 import { useLang } from '../i18n/lang';
 import { useData } from '../i18n/localize';
-import type { Link, ResultKind } from '../data/types';
+import type { Link } from '../data/types';
 import type { AtlasLayout, TerritoryLayout } from './layout';
-import { LaneLayer } from './LaneLayer';
+import { GalleryBackdrop } from './GalleryBackdrop';
 import { Territory } from './Territory';
 import { LinkLayer } from './LinkLayer';
 import { MathematicianLinkLayer } from './MathematicianLinkLayer';
+import { LabelLayer } from './LabelLayer';
 import type { MapController, Bounds, ViewportInset } from './controller';
-import type { Filters, Selection, VisionId } from '../state/store';
+import type { Filters, Selection } from '../state/store';
 import type { Chain } from './upstream';
 import { domainOf } from './bounds';
 import { LEVEL_K, levelFor, publishView } from './viewStore';
@@ -34,10 +35,8 @@ interface Props {
   dimmedIds: Set<string>;
   selection: Selection | null;
   relatedIds: Set<string>;
-  /** bassin amont / aval direct du domaine de la sélection */
+  /** amont et aval du domaine de la sélection */
   chain: Chain | null;
-  vision: VisionId;
-  naturesKind: ResultKind | null;
   /** bandes d'écran occupées par l'interface (barre du haut, frise du bas) : la vue d'ensemble s'ajuste entre elles */
   fitInset: { top: number; bottom: number };
   onSelect: (sel: Selection | null, fly: boolean) => void;
@@ -54,8 +53,6 @@ export function MapCanvas({
   selection,
   relatedIds,
   chain,
-  vision,
-  naturesKind,
   fitInset,
   onSelect,
   onLinkClick,
@@ -237,16 +234,19 @@ export function MapCanvas({
   const selectedDomainId = selection ? domainOf(selection) : null;
   const selectedChildId = selection && selection.kind !== 'domain' ? selection.id : undefined;
 
-  const worldClass = `world vision-${vision}${selection ? ' dim-others' : ''}`;
+  const worldClass = `world${selection ? ' dim-others' : ''}`;
+  // domaines restés vifs pendant une sélection : le domaine choisi, ses voisins, son amont et son aval
+  const vividDomainIds = selectedDomainId
+    ? new Set([selectedDomainId, ...relatedIds, ...(chain?.upstream.keys() ?? []), ...(chain?.downstream.keys() ?? [])])
+    : null;
 
   return (
     <svg ref={svgRef} className="atlas-map" data-level="0" role="application" aria-label={t('map.aria')}>
       <g ref={worldRef} className={worldClass}>
-        <LaneLayer layout={layout} />
+        <GalleryBackdrop />
         <LinkLayer
           layout={layout}
           filters={filters}
-          vision={vision}
           dimmedIds={dimmedIds}
           selectedDomainId={selectedDomainId}
           hoveredDomainId={hoveredId}
@@ -256,7 +256,6 @@ export function MapCanvas({
         <MathematicianLinkLayer
           layout={layout}
           selectedId={selection?.kind === 'mathematician' ? selection.id : null}
-          vision={vision}
           onSelect={(sel) => onSelect(sel, true)}
         />
         {layout.territories.map((t) => {
@@ -273,13 +272,18 @@ export function MapCanvas({
               related={relatedIds.has(t.id)}
               upGen={chain?.upstream.get(t.id) ?? 0}
               downGen={chain?.downstream.get(t.id) ?? 0}
-              vision={vision}
-              naturesKind={naturesKind}
               onSelect={handleSelect}
               onHover={onHover}
             />
           );
         })}
+        <LabelLayer
+          layout={layout}
+          selection={selection}
+          dimmedIds={dimmedIds}
+          vividDomainIds={vividDomainIds}
+          onSelect={(sel) => onSelect(sel, true)}
+        />
       </g>
     </svg>
   );
diff --git a/src/map/MathematicianLinkLayer.tsx b/src/map/MathematicianLinkLayer.tsx
index a1d38ff..25c94cb 100644
--- a/src/map/MathematicianLinkLayer.tsx
+++ b/src/map/MathematicianLinkLayer.tsx
@@ -1,6 +1,6 @@
-import { memo, useMemo } from 'react';
+import { memo } from 'react';
 import type { AtlasLayout } from './layout';
-import type { Selection, VisionId } from '../state/store';
+import type { Selection } from '../state/store';
 import { useLang } from '../i18n/lang';
 import { useData, MATHEMATICIAN_LINK_KIND_I18N } from '../i18n/localize';
 
@@ -8,7 +8,6 @@ interface Props {
   layout: AtlasLayout;
   /** Mathematician.id sélectionné, sinon null. */
   selectedId: string | null;
-  vision: VisionId;
   onSelect: (sel: Selection) => void;
 }
 
@@ -33,46 +32,16 @@ function arcPath(origin: Point, target: Point): { d: string; midX: number; midY:
   };
 }
 
-/**
- * Arcs mathématicien ↔ mathématicien. Deux modes :
- * — sélection d'un·e mathématicien·ne : ses arcs, libellés et navigation vers les figures liées ;
- * — vision « réseaux » : tous les arcs en filigrane, pour lire les constellations de figures.
- */
-export const MathematicianLinkLayer = memo(function MathematicianLinkLayer({ layout, selectedId, vision, onSelect }: Props) {
+/** Arcs entre la figure choisie et les figures liées (filiation, influence, collaboration, rupture). */
+export const MathematicianLinkLayer = memo(function MathematicianLinkLayer({ layout, selectedId, onSelect }: Props) {
   const { t } = useLang();
   const { mathematicianById, mathematicianLinksById } = useData();
 
-  // tous les liens, dédupliqués (l'index est bidirectionnel)
-  const allLinks = useMemo(() => {
-    if (vision !== 'reseaux') return [];
-    const seen = new Set<string>();
-    const out = [];
-    for (const list of Object.values(mathematicianLinksById)) {
-      for (const l of list) {
-        const key = `${l.source}|${l.target}|${l.kind}`;
-        if (seen.has(key)) continue;
-        seen.add(key);
-        out.push(l);
-      }
-    }
-    return out;
-  }, [vision, mathematicianLinksById]);
-
   const origin = selectedId ? layout.childPos.get(selectedId) : undefined;
   const selectedLinks = selectedId ? (mathematicianLinksById[selectedId] ?? []) : [];
 
   return (
     <>
-      {vision === 'reseaux' && (
-        <g className="mlinks mlinks-all layer" aria-hidden="true">
-          {allLinks.map((l) => {
-            const a = layout.childPos.get(l.source);
-            const b = layout.childPos.get(l.target);
-            if (!a || !b || a.kind !== 'mathematician' || b.kind !== 'mathematician') return null;
-            return <path key={`${l.source}|${l.target}|${l.kind}`} className={`mlink mlink-${l.kind} mlink-group`} d={arcPath(a, b).d} />;
-          })}
-        </g>
-      )}
       {origin && selectedLinks.length > 0 && (
         <g className="mlinks">
           {selectedLinks.map((l) => {
diff --git a/src/map/Territory.tsx b/src/map/Territory.tsx
index 7dea1de..3e2e7bb 100644
--- a/src/map/Territory.tsx
+++ b/src/map/Territory.tsx
@@ -1,13 +1,13 @@
 import { memo, useMemo, type CSSProperties } from 'react';
-import type { Domain, ResultKind } from '../data/types';
-import { organicPath, type TerritoryLayout } from './layout';
+import type { Domain } from '../data/types';
+import type { TerritoryLayout } from './layout';
 import { levelFor, useViewTransform } from './viewStore';
 import { useLang } from '../i18n/lang';
 import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
-import type { VisionId } from '../state/store';
-import { KIND_INK, dominantKind, domainHasKind } from './visionPalettes';
+import { KIND_INK } from './resultKinds';
 import { DOWNSTREAM_INK, UPSTREAM_INK } from './fieldColors';
-import { mapLabel, shortTheoryName, wrapWords } from './labels';
+import { shortTheoryName, wrapWords } from './labels';
+import { domainNameCenter, domainNameMetrics } from './labelMetrics';
 
 interface Props {
   domain: Domain;
@@ -16,24 +16,23 @@ interface Props {
   selectedChildId?: string;
   dimmed: boolean;
   related: boolean;
-  /** génération dans le bassin amont du domaine choisi (0 : hors bassin) */
+  /** génération dans l'amont du domaine choisi (0 : hors amont) */
   upGen: number;
-  /** génération dans le bassin aval du domaine choisi (0 : hors bassin) */
+  /** génération dans l'aval du domaine choisi (0 : hors aval) */
   downGen: number;
-  vision: VisionId;
-  naturesKind: ResultKind | null;
   onSelect: (kind: 'domain' | 'theory' | 'mathematician' | 'result', id: string, territory: TerritoryLayout) => void;
   onHover?: (id: string | null) => void;
 }
 
-/** largeur moyenne d'un caractère de Cormorant Garamond semi-gras, en em (bas de casse) */
-const CHAR_EM = 0.5;
-const LABEL_LINE = 16;
+/** marge hors écran (px) au-delà de laquelle les enfants ne sont pas montés dans le DOM */
+const PAD = 220;
 
 /**
- * Un domaine : cartouche à bord organique (lavis clair, double filet d'encre
- * de la teinte du champ), nom en bas de casse et période. Les anneaux de
- * Prusse et de sépia signalent sa place dans le bassin du domaine choisi.
+ * Un domaine, DA « Galerie » : disque pâle sans contour, nom en petites
+ * capitales dans le haut du disque (niveaux 0 et 1). Niveau 1 : ses théories ;
+ * niveau 2 : le point de chaque figure ordinaire ; niveau 3 : le losange de
+ * chaque résultat. Les médailles des grandes figures et tous les noms de
+ * points sont posés par LabelLayer, qui les désencombre.
  */
 export const Territory = memo(function Territory({
   domain,
@@ -44,65 +43,36 @@ export const Territory = memo(function Territory({
   related,
   upGen,
   downGen,
-  vision,
-  naturesKind,
   onSelect,
   onHover,
 }: Props) {
   const { lang } = useLang();
   const { x, y, r } = layout;
-  // vision « natures » : la couleur du lac vient de la nature dominante de ses
-  // résultats — ou de la nature filtrée quand une pastille est active (le lac
-  // la possédant prend alors l'encre de cette nature).
-  const kindKey =
-    naturesKind !== null && domainHasKind(domain, naturesKind) ? naturesKind : dominantKind(domain.results);
-  const kindPalette = vision === 'natures' ? KIND_INK[kindKey] : null;
   const palette = domain.map.palette;
-  const stroke = kindPalette?.stroke ?? palette.stroke;
-  const accent = kindPalette?.stroke ?? palette.accent;
-  const wash = kindPalette?.wash ?? palette.fill;
-  const veiled = vision === 'natures' && naturesKind !== null && !domainHasKind(domain, naturesKind);
-  // filet intérieur : même contour (même graine), rayon réduit
-  const inner = useMemo(() => organicPath(x, y, r - 14, domain.id), [x, y, r, domain.id]);
 
-  // Re-rendu à chaque frame de zoom/pan (léger : tests booléens seulement) pour
-  // ne monter dans le DOM que les enfants du niveau courant ET visibles à
-  // l'écran — sans ça, ~5 000 nœuds masqués (opacity:0) pèsent sur le mobile.
+  // Re-rendu à chaque frame de zoom (léger) : seuls les enfants du niveau courant
+  // ET visibles à l'écran sont montés dans le DOM.
   const v = useViewTransform();
   const lvl = levelFor(v.k);
-  const PAD = 220; // px écran : les libellés débordent sans apparaître brutalement
   const inView = (cx: number, cy: number) => {
     const sx = v.x + cx * v.k;
     const sy = v.y + cy * v.k;
     return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
   };
-  const showTheories = lvl >= 1;
-  const showMathematicians = lvl >= 2;
-  const showResults = lvl >= 3;
+  /** px écran → unités carte */
+  const px = (n: number) => n / v.k;
 
   const theoryById = useMemo(() => new Map(domain.theories.map((s) => [s.id, s])), [domain]);
   const mathById = useMemo(() => new Map(domain.mathematicians.map((f) => [f.id, f])), [domain]);
   const resultById = useMemo(() => new Map(domain.results.map((f) => [f.id, f])), [domain]);
 
-  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}${veiled ? ' veil' : ''}${
-    upGen > 0 ? ' chain-up' : ''
-  }${downGen > 0 ? ' chain-down' : ''}`;
+  const name = domainNameMetrics(domain, r, v.k);
+  const nc = domainNameCenter(layout, lvl);
 
-  // nom : lignes + taille en unités carte pour tenir dans ≈1.6 r. En vue
-  // d'ensemble, le CSS impose un plancher de lisibilité à l'écran : le nom peut
-  // alors déborder du lac, jusqu'à 2.6 r (--fs-max).
-  const lines = wrapWords(mapLabel(domain), LABEL_LINE, 3);
-  const longest = Math.max(...lines.map((l) => l.length), 1);
-  const fs = Math.min(0.21 * r, (1.6 * r) / (longest * CHAR_EM));
-  const fsMax = (2.6 * r) / (longest * CHAR_EM);
-
-  const vars = {
-    '--fs': String(fs),
-    '--fs-max': String(fsMax),
-    '--r': String(r),
-    '--accent': accent,
-    '--label': stroke,
-  } as CSSProperties;
+  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}${upGen > 0 ? ' chain-up' : ''}${
+    downGen > 0 ? ' chain-down' : ''
+  }`;
+  const gen = Math.max(upGen, downGen);
 
   return (
     <g
@@ -111,7 +81,7 @@ export const Territory = memo(function Territory({
       data-id={domain.id}
       data-up={upGen > 0 ? Math.min(upGen, 4) : undefined}
       data-down={downGen > 0 ? Math.min(downGen, 4) : undefined}
-      style={vars}
+      style={{ '--ink': palette.stroke } as CSSProperties}
       tabIndex={0}
       role="button"
       aria-label={domain.name}
@@ -132,172 +102,132 @@ export const Territory = memo(function Territory({
         onSelect('domain', domain.id, layout);
       }}
     >
-      {/* anneau de sélection, net */}
-      {selected && <path className="ring" d={layout.isoPath} stroke={accent} />}
-      {/* lavis du cartouche */}
-      <path className="fill" d={layout.path} fill={wash} />
-      {/* double filet : rive à l'encre, filet intérieur */}
-      <path className="edge" d={layout.path} stroke={stroke} />
-      <path className="inner" d={inner} stroke={stroke} />
-      {/* place dans le bassin du domaine choisi : amont (Prusse) ou aval (sépia) */}
-      {(upGen > 0 || downGen > 0) && (
-        <path
+      {/* place dans l'amont (Prusse) ou l'aval (sépia) du domaine choisi */}
+      {gen > 0 && (
+        <circle
           className="chain-ring"
-          d={layout.isoPath}
+          cx={x}
+          cy={y}
+          r={r + 6}
           stroke={upGen > 0 ? UPSTREAM_INK : DOWNSTREAM_INK}
-          strokeWidth={upGen === 1 || downGen === 1 ? 2.2 : 1.5}
-          strokeDasharray={upGen > 1 || downGen > 1 ? '6 5' : undefined}
+          strokeWidth={gen === 1 ? 2.2 : 1.5}
+          strokeDasharray={gen > 1 ? '6 5' : undefined}
         />
       )}
-      <title>{domain.name}</title>
+      {selected && <circle className="ring" cx={x} cy={y} r={r + 10} stroke={palette.stroke} />}
+      <circle className="disc" cx={x} cy={y} r={r} fill={palette.fill} />
+      <title>
+        {domain.name} · {formatPeriod(domain.period, lang)}
+      </title>
 
-      {/* bloc entièrement en em : il suit la taille calculée par le CSS (plancher
-          écran en vue d'ensemble, plafonds aux niveaux suivants) */}
-      <g className="territory-labels">
-        <text className="territory-name" x={x} y={y} textAnchor="middle">
-          {lines.map((l, i) => (
-            <tspan key={i} x={x} dy={i === 0 ? `${-(lines.length - 1) * 0.5 - 0.12}em` : '1em'}>
+      {/* nom du domaine : niveaux 0 et 1 (ensuite, il est dans le fil d'Ariane et le panneau) */}
+      {lvl <= 1 && (
+        <text className="territory-name" x={nc.x} y={nc.y} textAnchor="middle" fill={palette.stroke} style={{ fontSize: px(name.fontPx) }}>
+          {name.lines.map((l, i) => (
+            <tspan key={i} x={nc.x} dy={i === 0 ? `${-(name.lines.length - 1) * 0.575 + 0.35}em` : '1.15em'}>
               {l}
             </tspan>
           ))}
-          <tspan className="territory-period" x={x} dy="1.35em">
-            {formatPeriod(domain.period, lang)}
-          </tspan>
         </text>
-      </g>
+      )}
 
-      {/* théories — niveau 1 */}
-      <g className="layer layer-1">
-        {showTheories &&
-          layout.children
-            .filter((c) => c.kind === 'theory' && inView(c.x, c.y))
-            .map((c) => {
-              const s = theoryById.get(c.id);
-              if (!s) return null;
-              const blob = organicPath(c.x, c.y, r * 0.16, `theory:${c.id}`, 0.22);
-              return (
-                <g key={c.id}>
-                  <path className="theory-blob" d={blob} fill={accent} stroke={stroke} />
-                  <text className="child-label theory-label" x={c.x} y={c.y} fill={stroke}>
-                    {wrapWords(shortTheoryName(s.name), 18, 2).map((l, i, arr) => (
-                      <tspan key={i} x={c.x} dy={i === 0 ? `${-(arr.length - 1) * 0.55}em` : '1.1em'}>
-                        {l}
-                      </tspan>
-                    ))}
-                  </text>
-                  <circle
-                    className="child-hit"
-                    cx={c.x}
-                    cy={c.y}
-                    r={r * 0.18}
-                    onClick={(e) => {
-                      e.stopPropagation();
-                      onSelect('theory', s.id, layout);
-                    }}
-                  >
-                    <title>
-                      {s.name}
-                      {s.period ? ` · ${formatPeriod(s.period, lang)}` : ''}
-                    </title>
-                  </circle>
-                </g>
-              );
-            })}
-      </g>
+      {/* théories — niveau 1 seulement */}
+      {lvl === 1 &&
+        layout.children
+          .filter((c) => c.kind === 'theory' && inView(c.x, c.y))
+          .map((c) => {
+            const s = theoryById.get(c.id);
+            if (!s) return null;
+            const lines = wrapWords(shortTheoryName(s.name), 18, 2);
+            return (
+              <g key={c.id}>
+                <text className="theory-label" x={c.x} y={c.y} textAnchor="middle" fill={palette.stroke} style={{ fontSize: px(15) }}>
+                  {lines.map((l, i, arr) => (
+                    <tspan key={i} x={c.x} dy={i === 0 ? `${-(arr.length - 1) * 0.55 + 0.35}em` : '1.1em'}>
+                      {l}
+                    </tspan>
+                  ))}
+                </text>
+                <circle
+                  className="child-hit"
+                  cx={c.x}
+                  cy={c.y}
+                  r={px(26)}
+                  onClick={(e) => {
+                    e.stopPropagation();
+                    onSelect('theory', s.id, layout);
+                  }}
+                >
+                  <title>
+                    {s.name}
+                    {s.period ? ` · ${formatPeriod(s.period, lang)}` : ''}
+                  </title>
+                </circle>
+              </g>
+            );
+          })}
 
-      {/* mathématicien·nes — niveau 2 */}
-      <g className="layer layer-2">
-        {showMathematicians &&
-          layout.children
-            .filter((c) => c.kind === 'mathematician' && inView(c.x, c.y))
-            .map((c) => {
-              const f = mathById.get(c.id);
-              if (!f) return null;
-              const isSel = selectedChildId === f.id;
-              return (
-                <g key={c.id} className={isSel ? 'child-selected' : undefined}>
-                  {isSel && <circle className="child-ring" cx={c.x} cy={c.y} stroke={UPSTREAM_INK} />}
-                  <circle
-                    className="marker-mathematician"
-                    cx={c.x}
-                    cy={c.y}
-                    fill={isSel ? '#1d1a15' : '#fcfaf5'}
-                    stroke={isSel ? '#fcfaf5' : stroke}
-                    style={{ r: isSel ? 'calc(7px / var(--k))' : 'calc(5px / var(--k))' }}
-                  />
-                  <text className="child-label mathematician-label" x={c.x} y={c.y} dy={c.vside === 'below' ? '1.7em' : '-0.9em'}>
-                    {f.name}
-                  </text>
-                  <circle
-                    className="child-hit"
-                    cx={c.x}
-                    cy={c.y}
-                    r={Math.max(14, r * 0.08)}
-                    onClick={(e) => {
-                      e.stopPropagation();
-                      onSelect('mathematician', f.id, layout);
-                    }}
-                  >
-                    <title>
-                      {f.name} ({formatLifespan(f.years, lang, f.yearsApprox)})
-                    </title>
-                  </circle>
-                </g>
-              );
-            })}
-      </g>
+      {/* figures ordinaires — niveau 2 : un point ; le nom est posé par LabelLayer */}
+      {lvl >= 2 &&
+        layout.children
+          .filter((c) => c.kind === 'mathematician' && !c.featured && inView(c.x, c.y))
+          .map((c) => {
+            const f = mathById.get(c.id);
+            if (!f) return null;
+            const isSel = selectedChildId === f.id;
+            return (
+              <g key={c.id} className={isSel ? 'child-selected' : undefined}>
+                {isSel && <circle className="child-ring" cx={c.x} cy={c.y} r={px(9)} stroke={UPSTREAM_INK} strokeWidth={px(1.8)} />}
+                <circle className="figure-dot" cx={c.x} cy={c.y} r={px(isSel ? 5 : 3.5)} stroke={palette.stroke} strokeWidth={px(1.3)} />
+                <circle
+                  className="child-hit"
+                  cx={c.x}
+                  cy={c.y}
+                  r={px(9)}
+                  onClick={(e) => {
+                    e.stopPropagation();
+                    onSelect('mathematician', f.id, layout);
+                  }}
+                >
+                  <title>
+                    {f.name} ({formatLifespan(f.years, lang, f.yearsApprox)})
+                  </title>
+                </circle>
+              </g>
+            );
+          })}
 
-      {/* résultats — niveau 3 : losange à l'encre de leur nature */}
-      <g className="layer layer-3">
-        {showResults &&
-          layout.children
-            .filter((c) => c.kind === 'result' && inView(c.x, c.y))
-            .map((c) => {
-              const f = resultById.get(c.id);
-              if (!f) return null;
-              const isSel = selectedChildId === f.id;
-              const kindVeil = vision === 'natures' && naturesKind !== null && f.kind !== naturesKind;
-              const s = 14;
-              const d = `M ${c.x} ${c.y - s} L ${c.x + s} ${c.y} L ${c.x} ${c.y + s} L ${c.x - s} ${c.y} Z`;
-              return (
-                <g key={c.id} className={isSel ? 'child-selected' : undefined}>
-                  {isSel && <circle className="child-ring" cx={c.x} cy={c.y} stroke={UPSTREAM_INK} />}
-                  <path
-                    className={`result-diamond${kindVeil ? ' result-veil' : ''}`}
-                    d={d}
-                    fill={isSel ? '#1d1a15' : KIND_INK[f.kind].stroke}
-                    stroke="#fcfaf5"
-                    style={{ transform: 'scale(calc(0.6 / var(--k)))', transformBox: 'fill-box', transformOrigin: 'center' }}
-                  />
-                  <text
-                    className="child-label result-label"
-                    x={c.x}
-                    y={c.y}
-                    // style en ligne : l'attribut textAnchor serait écrasé par .child-label
-                    style={{ textAnchor: c.anchor ?? 'middle' }}
-                    dx={c.anchor === 'start' ? '0.9em' : c.anchor === 'end' ? '-0.9em' : 0}
-                    dy={c.anchor && c.anchor !== 'middle' ? '0.35em' : '1.6em'}
-                  >
+      {/* résultats — niveau 3 : losange à l'encre de leur nature ; le titre est posé par LabelLayer */}
+      {lvl >= 3 &&
+        layout.children
+          .filter((c) => c.kind === 'result' && inView(c.x, c.y))
+          .map((c) => {
+            const f = resultById.get(c.id);
+            if (!f) return null;
+            const isSel = selectedChildId === f.id;
+            const s = px(isSel ? 7 : 5.5);
+            const d = `M ${c.x} ${c.y - s} L ${c.x + s} ${c.y} L ${c.x} ${c.y + s} L ${c.x - s} ${c.y} Z`;
+            return (
+              <g key={c.id} className={isSel ? 'child-selected' : undefined}>
+                {isSel && <circle className="child-ring" cx={c.x} cy={c.y} r={px(11)} stroke={UPSTREAM_INK} strokeWidth={px(1.8)} />}
+                <path className="result-diamond" d={d} fill={KIND_INK[f.kind]} strokeWidth={px(1)} />
+                <circle
+                  className="child-hit"
+                  cx={c.x}
+                  cy={c.y}
+                  r={px(9)}
+                  onClick={(e) => {
+                    e.stopPropagation();
+                    onSelect('result', f.id, layout);
+                  }}
+                >
+                  <title>
                     {f.title} ({formatYear(f.year, lang, f.yearApprox)})
-                  </text>
-                  <circle
-                    className="child-hit"
-                    cx={c.x}
-                    cy={c.y}
-                    r={Math.max(10, r * 0.05)}
-                    onClick={(e) => {
-                      e.stopPropagation();
-                      onSelect('result', f.id, layout);
-                    }}
-                  >
-                    <title>
-                      {f.title} ({formatYear(f.year, lang, f.yearApprox)})
-                    </title>
-                  </circle>
-                </g>
-              );
-            })}
-      </g>
+                  </title>
+                </circle>
+              </g>
+            );
+          })}
     </g>
   );
 });
diff --git a/src/map/__tests__/declutter.test.ts b/src/map/__tests__/declutter.test.ts
new file mode 100644
index 0000000..0691efc
--- /dev/null
+++ b/src/map/__tests__/declutter.test.ts
@@ -0,0 +1,107 @@
+import { describe, it, expect } from 'vitest';
+import { declutter, textWidth, type LabelItem, type Rect } from '../declutter';
+import { computeLayout } from '../layout';
+import type { Domain, Mathematician, Result } from '../../data/types';
+import { DOMAINS } from '../../data';
+
+const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
+
+describe('désencombrement des noms', () => {
+  it('aucun chevauchement, priorités respectées, déterministe', () => {
+    const items: LabelItem[] = Array.from({ length: 60 }, (_, i) => ({
+      id: `n${i}`,
+      x: 100 + (i % 10) * 30,
+      y: 100 + Math.floor(i / 10) * 14,
+      w: 80,
+      h: 14,
+      priority: i % 3,
+      r: 3,
+    }));
+    const a = declutter(items);
+    expect(declutter([...items].reverse())).toEqual(a);
+    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) expect(hit(a[i], a[j])).toBe(false);
+    // le premier de plus haute priorité est toujours posé
+    expect(a.some((p) => p.id === 'n0')).toBe(true);
+  });
+
+  it('un obstacle fixe n’est jamais recouvert', () => {
+    const items: LabelItem[] = [{ id: 'a', x: 100, y: 100, w: 60, h: 14, priority: 0, r: 3 }];
+    const wall: Rect = { x: 104, y: 80, w: 200, h: 60 };
+    const placed = declutter(items, [wall]);
+    for (const p of placed) expect(hit(p, wall)).toBe(false);
+  });
+});
+
+/** Domaine synthétique dense : grandes figures, figures à résultats, fiches courtes. */
+function denseDomain(featured: number, withResults: number, short: number): Domain {
+  const id = 'dense';
+  const theories = Array.from({ length: 4 }, (_, j) => ({ id: `${id}-t${j}`, name: `Théorie ${j}`, summary: 's', traits: ['t'] }));
+  const fig = (j: number, kind: 'f' | 'r' | 's'): Mathematician => ({
+    id: `${id}-${kind}${j}`,
+    name: kind === 's' ? `Fiche courte ${j}` : `Figure à résultat ${j}`,
+    years: [1800 + j, 1870 + j],
+    origin: 'x',
+    bio: 'b',
+    theoryId: theories[j % 4].id,
+    ...(kind === 'f'
+      ? { featured: { signature: { kind: 'fait' as const, text: 's', sources: ['katz-history'] }, contributions: [], headlineResultIds: [`${id}-res-f${j}`] } }
+      : {}),
+  });
+  const mathematicians = [
+    ...Array.from({ length: featured }, (_, j) => fig(j, 'f')),
+    ...Array.from({ length: withResults }, (_, j) => fig(j, 'r')),
+    ...Array.from({ length: short }, (_, j) => fig(j, 's')),
+  ];
+  const results: Result[] = mathematicians
+    .filter((m) => !m.id.includes('-s'))
+    .map((m) => ({ id: `res-${m.id}`, title: 'R', year: 1850, authorName: m.name, mathematicianId: m.id, kind: 'theoreme', comment: 'c' }));
+  return {
+    ...DOMAINS[0],
+    id,
+    era: 'dixneuvieme',
+    period: { start: 1800, end: 1900 },
+    map: { x: 3000, y: 2200, size: 2, palette: { fill: '#eeeeee', stroke: '#333333', accent: '#666666' } },
+    theories,
+    mathematicians,
+    results,
+  };
+}
+
+/** Part des noms affichés à un zoom donné (domaine centré, viewport 1440 × 744). */
+function shownAt(d: Domain, k: number) {
+  const layout = computeLayout([d]);
+  const t = layout.territories[0];
+  const toScreen = (x: number, y: number) => ({ x: 720 + (x - t.x) * k, y: 372 + (y - t.y) * k });
+  const byId = new Map(d.mathematicians.map((m) => [m.id, m]));
+  const items: LabelItem[] = t.children
+    .filter((c) => c.kind === 'mathematician')
+    .map((c) => {
+      const m = byId.get(c.id)!;
+      const p = toScreen(c.x, c.y);
+      const font = c.featured ? 13 : 12;
+      return { id: c.id, ...p, w: textWidth(m.name, font), h: font + 4, priority: c.featured ? 0 : c.nameLevel === 2 ? 1 : 2, r: c.featured ? 10 : 3.5 };
+    });
+  const placed = new Set(declutter(items).map((p) => p.id));
+  const share = (pred: (m: Mathematician) => boolean) => {
+    const ids = d.mathematicians.filter(pred).map((m) => m.id);
+    return ids.filter((id) => placed.has(id)).length / Math.max(1, ids.length);
+  };
+  return {
+    featured: share((m) => !!m.featured),
+    withResults: share((m) => !m.featured && !m.id.includes('-s')),
+    short: share((m) => m.id.includes('-s')),
+  };
+}
+
+describe('densité : 42 figures dans un domaine', () => {
+  const d = denseDomain(2, 12, 28);
+  it.each([1.0, 1.4, 1.8, 2.6, 3.5])('k = %f', (k) => {
+    const s = shownAt(d, k);
+    console.log(`k=${k} : grandes ${(s.featured * 100).toFixed(0)} %, à résultats ${(s.withResults * 100).toFixed(0)} %, courtes ${(s.short * 100).toFixed(0)} %`);
+    expect(s.featured).toBe(1);
+  });
+  it('tous les points restent dans le disque', () => {
+    const t = computeLayout([d]).territories[0];
+    for (const c of t.children) expect(Math.hypot(c.x - t.x, c.y - t.y)).toBeLessThanOrEqual(t.r * 0.85 + 1e-6);
+  });
+});
diff --git a/src/map/__tests__/labelMetrics.test.ts b/src/map/__tests__/labelMetrics.test.ts
new file mode 100644
index 0000000..e943ccb
--- /dev/null
+++ b/src/map/__tests__/labelMetrics.test.ts
@@ -0,0 +1,20 @@
+import { describe, it, expect } from 'vitest';
+import { DOMAINS } from '../../data';
+import { domainNameMetrics, DOMAIN_NAME_PX } from '../labelMetrics';
+
+describe('nom des domaines', () => {
+  it('taille bornée, à toutes les échelles', () => {
+    for (const d of DOMAINS) {
+      for (const k of [0.05, 0.165, 0.6, 2]) {
+        const m = domainNameMetrics(d, 200, k);
+        expect(m.fontPx).toBeGreaterThanOrEqual(DOMAIN_NAME_PX.min);
+        expect(m.fontPx).toBeLessThanOrEqual(DOMAIN_NAME_PX.max);
+        expect(m.lines.length).toBeLessThanOrEqual(3);
+      }
+    }
+  });
+  it('plus le disque est grand à l’écran, plus le nom est grand (jusqu’au plafond)', () => {
+    const d = DOMAINS[0];
+    expect(domainNameMetrics(d, 200, 0.4).fontPx).toBeGreaterThanOrEqual(domainNameMetrics(d, 200, 0.2).fontPx);
+  });
+});
diff --git a/src/map/__tests__/layout.test.ts b/src/map/__tests__/layout.test.ts
index 90fa789..b64b6d1 100644
--- a/src/map/__tests__/layout.test.ts
+++ b/src/map/__tests__/layout.test.ts
@@ -73,7 +73,6 @@ function checkLayout(moves: Domain[]) {
     expect(t.x).toBeLessThanOrEqual(MAP_SIZE.width);
     expect(t.y).toBeGreaterThanOrEqual(0);
     expect(t.y).toBeLessThanOrEqual(MAP_SIZE.height);
-    expect(t.path.length).toBeGreaterThan(10);
     // enfants ≤ 0.85 r
     for (const c of t.children) {
       expect(Math.hypot(c.x - t.x, c.y - t.y)).toBeLessThanOrEqual(t.r * 0.85 + 1e-6);
diff --git a/src/map/__tests__/lineage.test.ts b/src/map/__tests__/lineage.test.ts
new file mode 100644
index 0000000..9a0dafb
--- /dev/null
+++ b/src/map/__tests__/lineage.test.ts
@@ -0,0 +1,63 @@
+import { describe, it, expect } from 'vitest';
+import { DOMAINS, DOMAIN_BY_ID, LINKS } from '../../data';
+import type { Link } from '../../data/types';
+import { principalLinks, defaultLinkKeys } from '../lineage';
+
+const ROOTS = ['calcul-des-scribes', 'logique-antique', 'mathematiques-chinoises-anciennes', 'querelle-des-infiniment-petits'];
+
+describe('lignées principales', () => {
+  const main = principalLinks(LINKS, DOMAIN_BY_ID);
+
+  it('un ascendant principal par domaine ayant une transmission entrante ; aucun pour les sources', () => {
+    for (const d of DOMAINS) {
+      const hasIncoming = LINKS.some((l) => l.target === d.id && (l.kind === 'filiation' || l.kind === 'influence'));
+      expect(main.has(d.id), d.id).toBe(hasIncoming);
+    }
+    for (const r of ROOTS) expect(main.has(r), r).toBe(false);
+    expect(main.size).toBe(DOMAINS.length - ROOTS.length);
+  });
+
+  it('quelques généalogies attendues', () => {
+    expect(main.get('analyse-eulerienne')?.source).toBe('naissance-du-calcul');
+    expect(main.get('mecanique-analytique')?.source).toBe('analyse-eulerienne');
+    expect(main.get('arithmetique-gaussienne')?.source).toBe('theorie-des-nombres-lumieres');
+    expect(main.get('topologie')?.source).toBe('geometries-non-euclidiennes');
+  });
+
+  it('indépendant de l’ordre des liens', () => {
+    const reversed = principalLinks([...LINKS].reverse(), DOMAIN_BY_ID);
+    for (const [target, l] of main) expect(reversed.get(target)?.source, target).toBe(l.source);
+  });
+
+  it('règle : marqué à la main > filiation > fait > même champ > source la plus récente', () => {
+    const mk = (source: string, kind: Link['kind'], epistemic: Link['epistemic'], principal?: true): Link => ({
+      source,
+      target: 'analyse-rigoureuse',
+      kind,
+      epistemic,
+      label: 'l',
+      note: 'n',
+      ...(principal ? { principal } : {}),
+    });
+    const pick = (links: Link[]) => principalLinks(links, DOMAIN_BY_ID).get('analyse-rigoureuse')?.source;
+    // filiation avant influence
+    expect(pick([mk('analyse-eulerienne', 'influence', 'fait'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
+    // fait avant interprétation
+    expect(pick([mk('analyse-eulerienne', 'filiation', 'interpretation'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
+    // même champ (analyse) avant champ différent (fondements)
+    expect(pick([mk('querelle-des-infiniment-petits', 'filiation', 'fait'), mk('naissance-du-calcul', 'filiation', 'fait')])).toBe('naissance-du-calcul');
+    // à égalité, la source la plus récente
+    expect(pick([mk('naissance-du-calcul', 'filiation', 'fait'), mk('analyse-eulerienne', 'filiation', 'fait')])).toBe('analyse-eulerienne');
+    // le marquage manuel l'emporte sur tout
+    expect(pick([mk('analyse-eulerienne', 'filiation', 'fait'), mk('querelle-des-infiniment-petits', 'influence', 'interpretation', true)])).toBe(
+      'querelle-des-infiniment-petits',
+    );
+    // une rupture ou une affinité n'est jamais ascendant principal
+    expect(pick([mk('analyse-eulerienne', 'reaction', 'fait'), mk('naissance-du-calcul', 'affinite', 'interpretation')])).toBeUndefined();
+  });
+
+  it('liens par défaut : ascendants principaux + ruptures', () => {
+    const keys = defaultLinkKeys(LINKS, DOMAIN_BY_ID);
+    expect(keys.size).toBe(main.size + LINKS.filter((l) => l.kind === 'reaction').length);
+  });
+});
diff --git a/src/map/__tests__/upstream.test.ts b/src/map/__tests__/upstream.test.ts
new file mode 100644
index 0000000..901da87
--- /dev/null
+++ b/src/map/__tests__/upstream.test.ts
@@ -0,0 +1,33 @@
+import { describe, it, expect } from 'vitest';
+import { DOMAINS, LINKS } from '../../data';
+import { chainOf, generations } from '../upstream';
+
+describe('amont et aval d’un domaine', () => {
+  it('rigueur de l’analyse : la querelle des infiniment petits est un affluent direct', () => {
+    const c = chainOf(LINKS, 'analyse-rigoureuse');
+    expect(c.upstream.get('querelle-des-infiniment-petits')).toBe(1);
+    expect(c.upstream.has('analyse-rigoureuse')).toBe(false);
+    expect(c.depth).toBeGreaterThanOrEqual(2);
+  });
+
+  it('les ruptures et les affinités ne transmettent pas', () => {
+    const c = chainOf(LINKS, 'analyse-rigoureuse');
+    // analyse-eulerienne → analyse-rigoureuse est une rupture : pas d'affluent direct par ce lien
+    const viaRupture = LINKS.find((l) => l.source === 'analyse-eulerienne' && l.target === 'analyse-rigoureuse' && l.kind === 'reaction');
+    expect(viaRupture).toBeDefined();
+    expect([...c.upstreamLinks].every((l) => l.kind === 'filiation' || l.kind === 'influence')).toBe(true);
+  });
+
+  it('une source n’a pas d’amont ; elle a un aval', () => {
+    const c = chainOf(LINKS, 'calcul-des-scribes');
+    expect(c.upstream.size).toBe(0);
+    expect(c.downstream.size).toBeGreaterThan(0);
+  });
+
+  it('générations ordonnées selon l’ordre donné', () => {
+    const c = chainOf(LINKS, 'topologie');
+    const gens = generations(c.upstream, DOMAINS.map((d) => d.id));
+    expect(gens.length).toBe(c.depth);
+    expect(gens.flat().length).toBe(c.upstream.size);
+  });
+});
diff --git a/src/map/declutter.ts b/src/map/declutter.ts
new file mode 100644
index 0000000..3e766cf
--- /dev/null
+++ b/src/map/declutter.ts
@@ -0,0 +1,82 @@
+/**
+ * Désencombrement des noms, en espace écran : à chaque zoom, les noms sont
+ * posés par ordre de priorité ; un nom qui recouvrirait un nom déjà posé (ou
+ * un obstacle fixe) essaie les autres côtés de son point, puis est masqué.
+ * Aucun chevauchement à aucun zoom ; plus on zoome, plus il y a de noms.
+ */
+
+export interface LabelItem {
+  id: string;
+  /** position du point (px écran) */
+  x: number;
+  y: number;
+  /** taille du nom (px écran) */
+  w: number;
+  h: number;
+  /** plus petit = posé en premier */
+  priority: number;
+  /** rayon du marqueur (px écran) : le nom est posé juste à côté */
+  r: number;
+}
+
+export type Side = 'right' | 'left' | 'above' | 'below';
+
+export interface PlacedLabel {
+  id: string;
+  side: Side;
+  /** boîte du nom posé (px écran, coin haut-gauche) */
+  x: number;
+  y: number;
+  w: number;
+  h: number;
+}
+
+export interface Rect {
+  x: number;
+  y: number;
+  w: number;
+  h: number;
+}
+
+const SIDES: Side[] = ['right', 'left', 'above', 'below'];
+const GAP = 4;
+
+function boxFor(it: LabelItem, side: Side): Rect {
+  switch (side) {
+    case 'right':
+      return { x: it.x + it.r + GAP, y: it.y - it.h / 2, w: it.w, h: it.h };
+    case 'left':
+      return { x: it.x - it.r - GAP - it.w, y: it.y - it.h / 2, w: it.w, h: it.h };
+    case 'above':
+      return { x: it.x - it.w / 2, y: it.y - it.r - GAP - it.h, w: it.w, h: it.h };
+    case 'below':
+      return { x: it.x - it.w / 2, y: it.y + it.r + GAP, w: it.w, h: it.h };
+  }
+}
+
+const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
+
+/**
+ * Pose les noms par priorité croissante (puis par id, pour le déterminisme).
+ * `obstacles` : zones déjà occupées (noms de domaines, marqueurs, interface).
+ */
+export function declutter(items: readonly LabelItem[], obstacles: readonly Rect[] = []): PlacedLabel[] {
+  const order = [...items].sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
+  // les marqueurs eux-mêmes sont des obstacles : un nom ne cache pas le point d'une autre figure
+  const taken: Rect[] = [...obstacles, ...items.map((it) => ({ x: it.x - it.r, y: it.y - it.r, w: 2 * it.r, h: 2 * it.r }))];
+  const out: PlacedLabel[] = [];
+  for (const it of order) {
+    for (const side of SIDES) {
+      const b = boxFor(it, side);
+      // son propre marqueur ne compte pas
+      if (taken.some((t) => hit(b, t) && !(Math.abs(t.x + t.w / 2 - it.x) < 1e-6 && Math.abs(t.y + t.h / 2 - it.y) < 1e-6))) continue;
+      taken.push(b);
+      out.push({ id: it.id, side, ...b });
+      break;
+    }
+  }
+  return out;
+}
+
+/** Largeur estimée d'un nom (px) : DM Sans, ≈ 0,55 em par caractère. */
+export const textWidth = (text: string, fontPx: number) => Math.ceil(text.length * fontPx * 0.55) + 4;
diff --git a/src/map/fieldColors.ts b/src/map/fieldColors.ts
index 0ee3957..7b65808 100644
--- a/src/map/fieldColors.ts
+++ b/src/map/fieldColors.ts
@@ -1,9 +1,9 @@
-import type { ContinentId, LinkKind } from '../data/types';
+import type { ContinentId } from '../data/types';
 
 /**
- * Teinte de base de chaque champ (degrés HSL) : la même pour sa bande, ses
- * lacs (palettes des domaines, scripts/palettes.ts), ses portées et sa part
- * de la frise.
+ * Teinte de base de chaque champ (degrés HSL) : la même pour sa bande, les
+ * disques de ses domaines (palettes, scripts/palettes.ts), les médailles de ses
+ * grandes figures et sa part de la frise.
  */
 export const FIELD_HUE: Record<ContinentId, number> = {
   nombres: 40, // ocre
@@ -14,14 +14,14 @@ export const FIELD_HUE: Record<ContinentId, number> = {
 };
 
 export interface FieldColors {
-  /** encre du champ : contours, libellés, portées */
+  /** encre du champ : noms des domaines, nom du champ dans la marge */
   ink: string;
-  /** bande du champ (fond très pâle, posé en transparence) */
+  /** bande du champ, en fond de carte */
   band: string;
-  /** lavis clair (frise, pastilles) */
+  /** lavis de la frise et des pastilles */
   wash: string;
-  /** pigment vif (repères, sélection) */
-  accent: string;
+  /** médaille d'une grande figure */
+  medal: string;
 }
 
 const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;
@@ -29,24 +29,15 @@ const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;
 export const FIELD_COLORS = Object.fromEntries(
   (Object.entries(FIELD_HUE) as [ContinentId, number][]).map(([id, h]) => [
     id,
-    { ink: hsl(h, 50, 30), band: hsl(h, 48, 90), wash: hsl(h, 45, 84), accent: hsl(h, 58, 44) },
+    { ink: hsl(h, 45, 30), band: hsl(h, 45, 96), wash: hsl(h, 45, 84), medal: hsl(h, 55, 36) },
   ]),
 ) as Record<ContinentId, FieldColors>;
 
-/**
- * Encres des liens entre domaines. La transmission (filiation, influence) est
- * à l'encre neutre, comme les traits d'un arbre généalogique ; l'affinité est
- * un gris violacé ; la rupture, la sanguine. Le bleu de Prusse et le sépia
- * sont réservés au bassin du domaine choisi (amont, aval).
- */
-export const LINK_INK: Record<LinkKind, string> = {
-  filiation: '#2a2621',
-  influence: '#4d473e',
-  affinite: '#7f758d',
-  reaction: '#b5412a',
-};
-
-/** Bassin amont du domaine choisi : bleu de Prusse. */
+/** Encre des liens de transmission (filiation, influence) : neutre, comme un trait de généalogie. */
+export const TRANSMISSION_INK = '#45413a';
+/** Encre des ruptures : sanguine. */
+export const RUPTURE_INK = '#b5412a';
+/** Amont du domaine choisi : bleu de Prusse. */
 export const UPSTREAM_INK = '#1d5f96';
-/** Bassin aval du domaine choisi : sépia. */
+/** Aval du domaine choisi : sépia. */
 export const DOWNSTREAM_INK = '#9a5b16';
diff --git a/src/map/labelMetrics.ts b/src/map/labelMetrics.ts
new file mode 100644
index 0000000..70d4183
--- /dev/null
+++ b/src/map/labelMetrics.ts
@@ -0,0 +1,35 @@
+import type { Domain } from '../data/types';
+import { mapLabel, wrapName } from './labels';
+
+/** largeur moyenne d'une capitale de DM Sans grasse, interlettrage de 0,06 em compris, en em */
+export const CAP_EM = 0.72;
+/** bornes de la taille du nom d'un domaine à l'écran (px) */
+export const DOMAIN_NAME_PX = { min: 8, max: 15 };
+
+export interface DomainNameMetrics {
+  lines: string[];
+  /** taille du nom à l'écran (px) */
+  fontPx: number;
+  /** boîte du nom à l'écran (px) */
+  w: number;
+  h: number;
+}
+
+/**
+ * Nom d'un domaine sur la carte : 1 à 3 lignes de 15 capitales au plus, à une
+ * taille d'écran qui suit le disque (la ligne la plus longue occupe ≈ 1,5 r),
+ * bornée entre 8 et 15 px. Sert au dessin du nom (Territory) et au
+ * désencombrement des autres noms (LabelLayer), qui l'évitent.
+ */
+export function domainNameMetrics(domain: Pick<Domain, 'name' | 'mapName'>, r: number, k: number): DomainNameMetrics {
+  const lines = wrapName(mapLabel(domain));
+  const longest = Math.max(...lines.map((l) => l.length), 1);
+  const fit = (1.5 * r * k) / (longest * CAP_EM);
+  const fontPx = Math.max(DOMAIN_NAME_PX.min, Math.min(DOMAIN_NAME_PX.max, fit));
+  return { lines, fontPx, w: longest * CAP_EM * fontPx, h: lines.length * fontPx * 1.15 };
+}
+
+/** Centre du nom d'un domaine (unités carte) : haut du disque, plus haut encore à partir du niveau 1. */
+export function domainNameCenter(t: { x: number; y: number; r: number }, level: number): { x: number; y: number } {
+  return { x: t.x, y: t.y - (level >= 1 ? 0.74 : 0.42) * t.r };
+}
diff --git a/src/map/layout.ts b/src/map/layout.ts
index 498d985..bd09c79 100644
--- a/src/map/layout.ts
+++ b/src/map/layout.ts
@@ -1,4 +1,3 @@
-import * as d3 from 'd3';
 import { MAP_SIZE, TIME_BOUNDS } from '../data/eras';
 import type { Domain } from '../data/types';
 import { seededRandom } from '../lib/prng';
@@ -10,32 +9,15 @@ export const RELAX_MARGIN = 24;
 const MAP_MARGIN = 40;
 const CHILD_MAX = 0.85;
 
+/** au-delà de ce nombre de figures, le disque s'agrandit (1,2 % par figure, +35 % au plus) */
+export const DENSE_FIGURES = 12;
+
+/** Rayon de base : taille éditoriale, nombre de résultats et nombre de figures (chacun plafonné). */
 export function baseRadius(m: Domain): number {
   const r = BASE_R[m.map.size] ?? BASE_R[1];
   const extra = Math.min(0.25, Math.max(0, Math.floor((m.results.length - 8) / 4)) * 0.08);
-  return r * (1 + extra);
-}
-
-/** Chemin organique déterministe : 12-16 points, rayon bruité, Catmull-Rom fermé. */
-export function organicPath(cx: number, cy: number, r: number, seed: string, wobble = 0.18): string {
-  const rand = seededRandom(seed);
-  const n = 12 + Math.floor(rand() * 5);
-  const startAngle = rand() * Math.PI * 2;
-  // bruit basse fréquence : mélange de 2 harmoniques + jitter
-  const ph1 = rand() * Math.PI * 2;
-  const ph2 = rand() * Math.PI * 2;
-  const amp1 = wobble * 0.55;
-  const amp2 = wobble * 0.45;
-  const pts: [number, number][] = [];
-  for (let i = 0; i < n; i++) {
-    const a = startAngle + (i / n) * Math.PI * 2;
-    const jit = (rand() - 0.5) * wobble * 0.6;
-    const f = 1 - wobble + amp1 * (0.5 + 0.5 * Math.sin(2 * a + ph1)) + amp2 * (0.5 + 0.5 * Math.sin(3 * a + ph2)) + jit;
-    const rr = r * f;
-    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
-  }
-  const line = d3.line<[number, number]>().curve(d3.curveCatmullRomClosed.alpha(0.5));
-  return line(pts) ?? '';
+  const crowd = Math.min(0.35, Math.max(0, m.mathematicians.length - DENSE_FIGURES) * 0.012);
+  return r * (1 + extra + crowd);
 }
 
 export interface ChildPos {
@@ -43,10 +25,10 @@ export interface ChildPos {
   id: string;
   x: number;
   y: number;
-  /** ancrage du libellé (results en éventail : à droite, en dessous, à gauche du marqueur) */
-  anchor?: 'start' | 'middle' | 'end';
-  /** mathématiciens : libellé au-dessus ou au-dessous du marqueur, à l’opposé du centre de la théorie */
-  vside?: 'above' | 'below';
+  /** grande figure : son médaillon est dessiné à tous les niveaux (FeaturedLayer) */
+  featured?: boolean;
+  /** niveau de zoom à partir duquel le nom d'une figure ordinaire est écrit (fiches courtes : 3) */
+  nameLevel?: 2 | 3;
 }
 
 export interface TerritoryLayout {
@@ -54,8 +36,6 @@ export interface TerritoryLayout {
   x: number;
   y: number;
   r: number;
-  path: string;
-  isoPath: string;
   children: ChildPos[];
 }
 
@@ -131,59 +111,88 @@ function clampChild(cx: number, cy: number, r: number, x: number, y: number): [n
   return [cx + dx * k, cy + dy * k];
 }
 
-/** Boîte d’un libellé de mathématicien (unités carte, calibrée pour k ≈ 1 au niveau « Mathématiciens »). */
-const MATHEMATICIAN_BOX = { w: 118, h: 42, dy: 24 };
-/** Boîte du libellé d’une théorie aux niveaux 2-3 (décalé sous le centre du blob). */
-const THEORY_BOX = { w: 110, h: 34, dy: 22 };
+/** Médaillon d'une grande figure et son nom à droite (unités carte, k ≈ 1). */
+export const FEATURED_BOX = { w: 170, h: 40, dx: 70 };
+/** Case d'une figure ordinaire (unités carte) : assez pour que deux points ne se touchent jamais. */
+export const FIGURE_CELL = { w: 46, h: 22 };
+
+/** Boîte fixe (centre, largeur, hauteur), en unités carte. */
+export interface Box {
+  x: number;
+  y: number;
+  w: number;
+  h: number;
+}
 
 /**
- * Écarte les libellés de mathématiciens entre eux et des libellés de théories, par
- * répulsion de boîtes le long de l'axe de moindre recouvrement. Déterministe.
+ * Emplacements des grandes figures d'un domaine : sous le nom du domaine, dans
+ * la moitié basse du disque — une seule au centre-bas, plusieurs en colonne,
+ * noms à droite.
  */
-export function separateMathematicianLabels(fms: ChildPos[], theories: { x: number; y: number }[], cx: number, cy: number, r: number): void {
-  const boxY = (c: ChildPos) => c.y + (c.vside === 'below' ? MATHEMATICIAN_BOX.dy : -MATHEMATICIAN_BOX.dy);
-  for (let iter = 0; iter < 60; iter++) {
-    let moved = false;
-    for (let i = 0; i < fms.length; i++) {
-      for (let j = i + 1; j < fms.length; j++) {
-        const a = fms[i];
-        const b = fms[j];
-        const dx = b.x - a.x;
-        const dy = boxY(b) - boxY(a);
-        const ox = MATHEMATICIAN_BOX.w - Math.abs(dx);
-        const oy = MATHEMATICIAN_BOX.h - Math.abs(dy);
-        if (ox <= 0 || oy <= 0) continue;
-        moved = true;
-        if (ox < oy) {
-          const sgn = dx >= 0 ? 1 : -1;
-          a.x -= (sgn * ox) / 2;
-          b.x += (sgn * ox) / 2;
-        } else {
-          const sgn = dy >= 0 ? 1 : -1;
-          a.y -= (sgn * oy) / 2;
-          b.y += (sgn * oy) / 2;
-        }
-      }
-      // libellés de theories : obstacles fixes
-      for (const sp of theories) {
-        const a = fms[i];
-        const dx = a.x - sp.x;
-        const dy = boxY(a) - (sp.y + THEORY_BOX.dy);
-        const ox = (MATHEMATICIAN_BOX.w + THEORY_BOX.w) / 2 - Math.abs(dx);
-        const oy = (MATHEMATICIAN_BOX.h + THEORY_BOX.h) / 2 - Math.abs(dy);
-        if (ox <= 0 || oy <= 0) continue;
-        moved = true;
-        if (ox < oy) a.x += (dx >= 0 ? 1 : -1) * ox;
-        else a.y += (dy >= 0 ? 1 : -1) * oy;
-      }
-    }
-    for (const c of fms) {
-      const [x, y] = clampChild(cx, cy, r, c.x, c.y);
-      c.x = x;
-      c.y = y;
+export function featuredSlots(n: number, cx: number, cy: number, r: number): [number, number][] {
+  if (n === 0) return [];
+  if (n === 1) return [[cx - 0.15 * r, cy + 0.28 * r]];
+  return Array.from({ length: n }, (_, i) => [cx - 0.2 * r, cy + (0.08 + (0.5 * i) / (n - 1)) * r] as [number, number]);
+}
+
+
+
+const overlap = (a: Box, b: Box) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
+
+/**
+ * Centres des cases d'une grille à rangées décalées (quinconce) dont la boîte
+ * w × h tient entière dans le disque de rayon `radius`.
+ */
+export function gridCells(cx: number, cy: number, radius: number, w: number, h: number): [number, number][] {
+  const out: [number, number][] = [];
+  let row = 0;
+  for (let y = cy - radius + h / 2; y <= cy + radius - h / 2 + 1e-9; y += h, row++) {
+    const shift = row % 2 ? w / 2 : 0;
+    for (let x = cx - radius - w + shift; x <= cx + radius; x += w) {
+      const inside = [
+        [x - w / 2, y - h / 2],
+        [x + w / 2, y - h / 2],
+        [x - w / 2, y + h / 2],
+        [x + w / 2, y + h / 2],
+      ].every(([px, py]) => Math.hypot(px - cx, py - cy) <= radius);
+      if (inside) out.push([x, y]);
     }
-    if (!moved) return;
   }
+  return out;
+}
+
+/**
+ * Attribue à chaque élément la case libre la plus proche de son ancre (ordre
+ * déterministe : celui de `items`). Une case libre ne recouvre aucune boîte de
+ * `blocked`. S'il n'y a plus de case, l'élément reste sur son ancre.
+ */
+export function assignCells(
+  items: readonly { id: string; ax: number; ay: number }[],
+  cells: readonly [number, number][],
+  blocked: readonly Box[],
+  w: number,
+  h: number,
+): Map<string, [number, number]> {
+  const free = cells.filter(([x, y]) => !blocked.some((b) => overlap({ x, y, w, h }, b)));
+  const used = new Set<number>();
+  const out = new Map<string, [number, number]>();
+  for (const it of items) {
+    let best = -1;
+    let bd = Infinity;
+    free.forEach(([x, y], i) => {
+      if (used.has(i)) return;
+      const d = Math.hypot(x - it.ax, y - it.ay);
+      if (d < bd) {
+        bd = d;
+        best = i;
+      }
+    });
+    if (best >= 0) {
+      used.add(best);
+      out.set(it.id, free[best]);
+    } else out.set(it.id, [it.ax, it.ay]);
+  }
+  return out;
 }
 
 function layoutChildren(m: Domain, cx: number, cy: number, r: number): ChildPos[] {
@@ -201,38 +210,41 @@ function layoutChildren(m: Domain, cx: number, cy: number, r: number): ChildPos[
     children.push({ kind: 'theory', id: s.id, x, y });
   });
 
-  // mathématiciens groupés autour de leur théorie, sinon anneau 0.62 r
-  const byTheory = new Map<string, Domain['mathematicians']>();
-  const orphans: Domain['mathematicians'] = [];
-  for (const f of m.mathematicians) {
-    if (f.theoryId && theoryPos.has(f.theoryId)) {
-      const g = byTheory.get(f.theoryId) ?? [];
-      g.push(f);
-      byTheory.set(f.theoryId, g);
-    } else orphans.push(f);
-  }
-  const mathChildren: ChildPos[] = [];
-  for (const [sid, group] of byTheory) {
-    const sp = theoryPos.get(sid)!;
-    const st = m.theories.findIndex((s) => s.id === sid);
-    const start = (st + 1) * 1.7 + rand() * 0.5;
-    group.forEach((f, i) => {
-      const a = start + (i / Math.max(1, group.length)) * Math.PI * 2;
-      const rr = (0.24 + rand() * 0.08) * r;
-      const [x, y] = clampChild(cx, cy, r, sp.x + rr * Math.cos(a), sp.y + rr * Math.sin(a));
-      mathChildren.push({ kind: 'mathematician', id: f.id, x, y, vside: y < sp.y ? 'above' : 'below' });
-    });
-  }
-  const oStart = rand() * Math.PI * 2;
-  orphans.forEach((f, i) => {
-    const a = oStart + (i / Math.max(1, orphans.length)) * Math.PI * 2;
-    const [x, y] = clampChild(cx, cy, r, cx + 0.62 * r * Math.cos(a), cy + 0.62 * r * Math.sin(a));
-    mathChildren.push({ kind: 'mathematician', id: f.id, x, y, vside: 'above' });
+  // grandes figures : emplacements fixes dans la moitié basse du disque
+  const featured = m.mathematicians.filter((f) => f.featured);
+  const slots = featuredSlots(featured.length, cx, cy, r);
+  const featuredBoxes: Box[] = [];
+  featured.forEach((f, i) => {
+    const [x, y] = slots[i];
+    mathPos.set(f.id, { x, y });
+    children.push({ kind: 'mathematician', id: f.id, x, y, featured: true });
+    featuredBoxes.push({ x: x + FEATURED_BOX.dx, y, w: FEATURED_BOX.w, h: FEATURED_BOX.h });
   });
-  separateMathematicianLabels(mathChildren, [...theoryPos.values()], cx, cy, r);
-  for (const c of mathChildren) {
-    mathPos.set(c.id, { x: c.x, y: c.y });
-    children.push(c);
+
+  // figures ordinaires : un point par figure sur une grille fine en quinconce, au plus près de sa
+  // théorie (les figures à résultats d'abord, puis les fiches courtes). Les noms ne sont pas posés
+  // ici : ils sont désencombrés à l'affichage, zoom par zoom (declutter.ts).
+  const authors = new Set(m.results.map((x) => x.mathematicianId));
+  const ordinary = [...m.mathematicians.filter((f) => !f.featured)].sort(
+    (a, b) => Number(authors.has(b.id)) - Number(authors.has(a.id)) || a.years[0] - b.years[0] || a.id.localeCompare(b.id),
+  );
+  const anchorOf = (f: Domain['mathematicians'][number], i: number) => {
+    const t = f.theoryId ? theoryPos.get(f.theoryId) : undefined;
+    if (t) return { id: f.id, ax: t.x, ay: t.y };
+    const a = (i / Math.max(1, ordinary.length)) * Math.PI * 2;
+    return { id: f.id, ax: cx + 0.55 * r * Math.cos(a), ay: cy + 0.55 * r * Math.sin(a) };
+  };
+  const cells = assignCells(
+    ordinary.map(anchorOf),
+    gridCells(cx, cy, CHILD_MAX * r, FIGURE_CELL.w, FIGURE_CELL.h),
+    featuredBoxes,
+    FIGURE_CELL.w,
+    FIGURE_CELL.h,
+  );
+  for (const f of ordinary) {
+    const [x, y] = cells.get(f.id)!;
+    mathPos.set(f.id, { x, y });
+    children.push({ kind: 'mathematician', id: f.id, x, y, nameLevel: authors.has(f.id) ? 2 : 3 });
   }
 
   // résultats autour de leur auteur, sinon de leur théorie, sinon du centre
@@ -260,7 +272,7 @@ function layoutChildren(m: Domain, cx: number, cy: number, r: number): ChildPos[
     });
   };
   // résultats d’un mathématicien : éventail dans le demi-plan inférieur (20°–160°, y vers le bas) ;
-  // le rayon croît avec le nombre de results et les libellés s'ancrent du côté extérieur
+  // le rayon croît avec le nombre de résultats
   const placeFan = (px: number, py: number, group: Domain['results']) => {
     const n = group.length;
     const rr = Math.max(0.12 * r, 30 + 9 * n);
@@ -268,8 +280,7 @@ function layoutChildren(m: Domain, cx: number, cy: number, r: number): ChildPos[
       const deg = n === 1 ? 90 : 20 + (i / (n - 1)) * 140;
       const a = (deg * Math.PI) / 180;
       const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
-      const anchor = deg < 75 ? 'start' : deg > 105 ? 'end' : 'middle';
-      children.push({ kind: 'result', id: f.id, x, y, anchor });
+      children.push({ kind: 'result', id: f.id, x, y });
     });
   };
   for (const [fid, group] of resultsByMath) placeFan(mathPos.get(fid)!.x, mathPos.get(fid)!.y, group);
@@ -304,9 +315,6 @@ export function computeLayout(domains: Domain[]): AtlasLayout {
     x: c.x,
     y: c.y,
     r: c.r,
-    path: organicPath(c.x, c.y, c.r, c.id),
-    // même seed → même forme, rayon r + 18
-    isoPath: organicPath(c.x, c.y, c.r + 18, c.id),
     children: layoutChildren(domains.find((m) => m.id === c.id)!, c.x, c.y, c.r),
   }));
 
diff --git a/src/map/lineage.ts b/src/map/lineage.ts
new file mode 100644
index 0000000..f9bd7c0
--- /dev/null
+++ b/src/map/lineage.ts
@@ -0,0 +1,49 @@
+import type { Domain, Link } from '../data/types';
+import { TRANSMISSION, linkKey } from './upstream';
+
+/**
+ * Rang d'un lien candidat au titre d'ascendant principal (ordre lexicographique,
+ * le plus petit gagne) : marqué `principal` à la main, filiation avant
+ * influence, fait avant interprétation, même champ principal avant champ
+ * différent, domaine source le plus récent (début de période).
+ */
+function rank(l: Link, domainById: Readonly<Record<string, Domain>>): number[] {
+  const a = domainById[l.source];
+  const b = domainById[l.target];
+  return [
+    l.principal ? 0 : 1,
+    l.kind === 'filiation' ? 0 : 1,
+    l.epistemic === 'fait' ? 0 : 1,
+    a && b && a.continents[0] === b.continents[0] ? 0 : 1,
+    a ? -a.period.start : Infinity,
+  ];
+}
+
+function better(x: Link, y: Link, domainById: Readonly<Record<string, Domain>>): boolean {
+  const rx = rank(x, domainById);
+  const ry = rank(y, domainById);
+  for (let i = 0; i < rx.length; i++) if (rx[i] !== ry[i]) return rx[i] < ry[i];
+  return x.source < y.source; // départage stable, indépendant de l'ordre des données
+}
+
+/**
+ * Ascendant principal de chaque domaine : parmi ses filiations et influences
+ * entrantes, celle qui résume le mieux sa généalogie. Les domaines sans
+ * transmission entrante (les sources) n'en ont pas.
+ */
+export function principalLinks(links: readonly Link[], domainById: Readonly<Record<string, Domain>>): Map<string, Link> {
+  const best = new Map<string, Link>();
+  for (const l of links) {
+    if (!TRANSMISSION.has(l.kind)) continue;
+    const cur = best.get(l.target);
+    if (!cur || better(l, cur, domainById)) best.set(l.target, l);
+  }
+  return best;
+}
+
+/** Clés des liens dessinés par défaut : les ascendants principaux et toutes les ruptures. */
+export function defaultLinkKeys(links: readonly Link[], domainById: Readonly<Record<string, Domain>>): Set<string> {
+  const keys = new Set([...principalLinks(links, domainById).values()].map(linkKey));
+  for (const l of links) if (l.kind === 'reaction') keys.add(linkKey(l));
+  return keys;
+}
diff --git a/src/map/resultKinds.ts b/src/map/resultKinds.ts
new file mode 100644
index 0000000..b51b8b2
--- /dev/null
+++ b/src/map/resultKinds.ts
@@ -0,0 +1,11 @@
+import type { ResultKind } from '../data/types';
+
+/** Encre de chaque nature de résultat (losanges de la carte ; mêmes teintes que les pastilles `.badge-kind-*`). */
+export const KIND_INK: Record<ResultKind, string> = {
+  theoreme: '#1f4e79',
+  conjecture: '#6b4c9a',
+  concept: '#2a7383',
+  methode: '#3f7a3a',
+  texte: '#8a5a1c',
+  probleme: '#b23a22',
+};
diff --git a/src/map/visionPalettes.ts b/src/map/visionPalettes.ts
deleted file mode 100644
index 88e8010..0000000
--- a/src/map/visionPalettes.ts
+++ /dev/null
@@ -1,36 +0,0 @@
-import type { Domain, Result, ResultKind } from '../data/types';
-
-/**
- * Vision « natures de résultats » : chaque lac prend l'encre de la nature
- * dominante de ses résultats (mêmes teintes que les pastilles `.badge-kind-*`).
- * `wash` : lavis clair du lac ; `stroke` : encre du contour et des libellés.
- */
-export const KIND_INK: Record<ResultKind, { stroke: string; wash: string }> = {
-  theoreme: { stroke: '#1f4e79', wash: '#d3e1ee' },
-  conjecture: { stroke: '#6b4c9a', wash: '#e2d9ef' },
-  concept: { stroke: '#2a7383', wash: '#d2e8ea' },
-  methode: { stroke: '#3f7a3a', wash: '#dceada' },
-  texte: { stroke: '#8a5a1c', wash: '#f0e2cc' },
-  probleme: { stroke: '#b23a22', wash: '#f4d9d0' },
-};
-
-/** Nature dominante des résultats du domaine (à égalité : la première atteinte). */
-export function dominantKind(results: Result[]): ResultKind {
-  const counts = new Map<ResultKind, number>();
-  let best: ResultKind = 'theoreme';
-  let max = 0;
-  for (const r of results) {
-    const n = (counts.get(r.kind) ?? 0) + 1;
-    counts.set(r.kind, n);
-    if (n > max) {
-      max = n;
-      best = r.kind;
-    }
-  }
-  return best;
-}
-
-/** Le domaine contient-il au moins un résultat de cette nature ? */
-export function domainHasKind(m: Domain, kind: ResultKind): boolean {
-  return m.results.some((r) => r.kind === kind);
-}
diff --git a/src/state/store.tsx b/src/state/store.tsx
index 6f5f333..59ab805 100644
--- a/src/state/store.tsx
+++ b/src/state/store.tsx
@@ -1,5 +1,5 @@
 import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
-import type { LinkKind, NodeKind, ContinentId, ResultKind } from '../data/types';
+import type { NodeKind, ContinentId } from '../data/types';
 import { TIME_BOUNDS } from '../data/eras';
 
 export interface Selection {
@@ -10,29 +10,21 @@ export interface Selection {
 export interface Filters {
   period: [number, number];
   continents: ContinentId[];
-  linkKinds: Record<LinkKind, boolean>;
   factsOnly: boolean;
-  /** Ne conserver que les liens entre ères différentes. */
-  transversalOnly: boolean;
+  /** Tous les liens de transmission et de rupture, au lieu des seules lignées principales. */
+  allLinks: boolean;
 }
 
-/** Modes de lecture superposés à la carte. */
-export type VisionId = 'structure' | 'filiations' | 'reseaux' | 'natures';
-
 export interface UiState {
   filtersOpen: boolean;
   legendOpen: boolean;
   methodOpen: boolean;
-  visionOpen: boolean;
   introSeen: boolean;
 }
 
 export interface AtlasState {
   selection: Selection | null;
   filters: Filters;
-  vision: VisionId;
-  /** Vision « natures » : ne garder qu'une nature (null = toutes). */
-  naturesKind: ResultKind | null;
   ui: UiState;
 }
 
@@ -41,32 +33,34 @@ export type Action =
   | { type: 'set-period'; period: [number, number] }
   | { type: 'toggle-continent'; continent: ContinentId }
   | { type: 'set-continents'; continents: ContinentId[] }
-  | { type: 'toggle-link-kind'; kind: LinkKind }
   | { type: 'toggle-facts-only' }
-  | { type: 'toggle-transversal-only' }
+  | { type: 'set-all-links'; allLinks: boolean }
   | { type: 'reset-filters' }
-  | { type: 'set-vision'; vision: VisionId }
-  | { type: 'set-natures-kind'; kind: ResultKind | null }
-  | { type: 'toggle-ui'; key: 'filtersOpen' | 'legendOpen' | 'methodOpen' | 'visionOpen' }
+  | { type: 'toggle-ui'; key: 'filtersOpen' | 'legendOpen' | 'methodOpen' }
   | { type: 'close-ui' }
   | { type: 'intro-seen' };
 
-const INTRO_KEY = 'atlas.intro.v1';
+/** v2 : la refonte « Galerie » remontre l'introduction une fois. */
+const INTRO_KEY = 'atlas.intro.v2';
+
+const DEFAULT_FILTERS: Filters = {
+  period: [TIME_BOUNDS.start, TIME_BOUNDS.end],
+  continents: [],
+  factsOnly: false,
+  allLinks: false,
+};
 
 export function initialState(): AtlasState {
-  const introSeen = typeof localStorage !== 'undefined' && localStorage.getItem(INTRO_KEY) === '1';
+  let introSeen = false;
+  try {
+    introSeen = typeof localStorage !== 'undefined' && localStorage.getItem(INTRO_KEY) === '1';
+  } catch {
+    /* stockage indisponible : l'introduction s'affiche */
+  }
   return {
     selection: null,
-    filters: {
-      period: [TIME_BOUNDS.start, TIME_BOUNDS.end],
-      continents: [],
-      linkKinds: { filiation: true, influence: true, affinite: true, reaction: true },
-      factsOnly: false,
-      transversalOnly: false,
-    },
-    vision: 'structure',
-    naturesKind: null,
-    ui: { filtersOpen: false, legendOpen: false, methodOpen: false, visionOpen: false, introSeen },
+    filters: DEFAULT_FILTERS,
+    ui: { filtersOpen: false, legendOpen: false, methodOpen: false, introSeen },
   };
 }
 
@@ -85,37 +79,16 @@ export function reducer(state: AtlasState, action: Action): AtlasState {
     }
     case 'set-continents':
       return { ...state, filters: { ...state.filters, continents: action.continents } };
-    case 'toggle-link-kind':
-      return {
-        ...state,
-        filters: {
-          ...state.filters,
-          linkKinds: { ...state.filters.linkKinds, [action.kind]: !state.filters.linkKinds[action.kind] },
-        },
-      };
     case 'toggle-facts-only':
       return { ...state, filters: { ...state.filters, factsOnly: !state.filters.factsOnly } };
-    case 'toggle-transversal-only':
-      return { ...state, filters: { ...state.filters, transversalOnly: !state.filters.transversalOnly } };
+    case 'set-all-links':
+      return { ...state, filters: { ...state.filters, allLinks: action.allLinks } };
     case 'reset-filters':
-      return {
-        ...state,
-        filters: {
-          period: [TIME_BOUNDS.start, TIME_BOUNDS.end],
-          continents: [],
-          linkKinds: { filiation: true, influence: true, affinite: true, reaction: true },
-          factsOnly: false,
-          transversalOnly: false,
-        },
-      };
-    case 'set-vision':
-      return { ...state, vision: action.vision, naturesKind: action.vision === 'natures' ? state.naturesKind : null };
-    case 'set-natures-kind':
-      return { ...state, naturesKind: action.kind };
+      return { ...state, filters: DEFAULT_FILTERS };
     case 'toggle-ui':
       return { ...state, ui: { ...state.ui, [action.key]: !state.ui[action.key] } };
     case 'close-ui':
-      return { ...state, ui: { ...state.ui, filtersOpen: false, legendOpen: false, methodOpen: false, visionOpen: false } };
+      return { ...state, ui: { ...state.ui, filtersOpen: false, legendOpen: false, methodOpen: false } };
     case 'intro-seen': {
       try {
         localStorage.setItem(INTRO_KEY, '1');
diff --git a/src/ui/FiltersDrawer.tsx b/src/ui/FiltersDrawer.tsx
index 05fd924..4628a0a 100644
--- a/src/ui/FiltersDrawer.tsx
+++ b/src/ui/FiltersDrawer.tsx
@@ -1,12 +1,11 @@
 import { X, RotateCcw } from 'lucide-react';
 import { TIME_BOUNDS, DOMAINS } from '../data';
-import type { LinkKind, ContinentId } from '../data/types';
+import type { ContinentId } from '../data/types';
 import { useStore } from '../state/store';
 import { useLang } from '../i18n/lang';
-import { useData, LINK_KIND_I18N } from '../i18n/localize';
+import { useData } from '../i18n/localize';
 import { formatYear } from '../lib/years';
 
-const KINDS: LinkKind[] = ['filiation', 'influence', 'affinite', 'reaction'];
 
 export function FiltersDrawer({ visibleCount }: { visibleCount: number }) {
   const { state, dispatch } = useStore();
@@ -18,7 +17,7 @@ export function FiltersDrawer({ visibleCount }: { visibleCount: number }) {
   const [start, end] = filters.period;
 
   return (
-    <aside className="glass fixed top-20 right-4 w-80 max-h-[calc(100%-7rem)] overflow-auto panel-scroll p-4 z-40" aria-label={t('filters.title')}>
+    <aside className="glass fixed top-20 right-4 w-80 max-h-[calc(100%-7rem)] overflow-auto panel-scroll p-4 z-[45]" aria-label={t('filters.title')}>
       <div className="flex items-center justify-between mb-3">
         <h2 className="section-title-sm">{t('filters.title')}</h2>
         <button aria-label={t('filters.close')} className="p-1 hover:bg-ink/8 rounded" onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })}>
@@ -94,25 +93,26 @@ export function FiltersDrawer({ visibleCount }: { visibleCount: number }) {
       </section>
 
       <section className="mb-4">
-        <h3 className="section-title-sm mb-2">{t('filters.linkTypes')}</h3>
-        <div className="flex flex-wrap gap-1.5">
-          {KINDS.map((k) => (
-            <button key={k} className={`chip ${filters.linkKinds[k] ? 'active' : ''}`} onClick={() => dispatch({ type: 'toggle-link-kind', kind: k })}>
-              {t(LINK_KIND_I18N[k])}
-            </button>
-          ))}
+        <h3 className="section-title-sm mb-2">{t('filters.links')}</h3>
+        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('filters.links')} data-testid="links-mode">
+          <button
+            role="radio"
+            aria-checked={!filters.allLinks}
+            className={`chip ${!filters.allLinks ? 'active' : ''}`}
+            onClick={() => dispatch({ type: 'set-all-links', allLinks: false })}
+          >
+            {t('filters.links.principal')}
+          </button>
+          <button
+            role="radio"
+            aria-checked={filters.allLinks}
+            className={`chip ${filters.allLinks ? 'active' : ''}`}
+            onClick={() => dispatch({ type: 'set-all-links', allLinks: true })}
+          >
+            {t('filters.links.all')}
+          </button>
         </div>
-        <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
-          <input
-            type="checkbox"
-            checked={filters.transversalOnly}
-            onChange={() => dispatch({ type: 'toggle-transversal-only' })}
-            className="accent-[#1f4e79]"
-            data-testid="transversal-only"
-          />
-          {t('filters.transversal')}
-          <span className="text-xs text-muted">{t('filters.transversalHint')}</span>
-        </label>
+        <p className="text-xs text-muted mt-1.5">{t('filters.links.hint')}</p>
       </section>
 
       <section className="mb-4">
diff --git a/src/ui/Legend.tsx b/src/ui/Legend.tsx
index a8dba26..89833b3 100644
--- a/src/ui/Legend.tsx
+++ b/src/ui/Legend.tsx
@@ -1,24 +1,18 @@
 import { X } from 'lucide-react';
 import { useStore } from '../state/store';
 import { useLang } from '../i18n/lang';
-import { LEVEL_I18N } from '../i18n/localize';
-import type { LinkKind, ResultKind } from '../data/types';
-import type { UiKey } from '../i18n/ui';
+import { LEVEL_I18N, useData } from '../i18n/localize';
+import type { ResultKind } from '../data/types';
 import { KindBadge } from './ResultCard';
-import { DOWNSTREAM_INK, FIELD_COLORS, LINK_INK, UPSTREAM_INK } from '../map/fieldColors';
+import { DOWNSTREAM_INK, FIELD_COLORS, RUPTURE_INK, TRANSMISSION_INK, UPSTREAM_INK } from '../map/fieldColors';
 
 const RESULT_KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];
 
-const SAMPLES: { kind: LinkKind; labelKey: UiKey; dash?: string }[] = [
-  { kind: 'filiation', labelKey: 'legend.filiation' },
-  { kind: 'influence', labelKey: 'legend.influence', dash: '8 5' },
-  { kind: 'affinite', labelKey: 'legend.affinite', dash: '2 5' },
-  { kind: 'reaction', labelKey: 'legend.reaction' },
-];
-
+/** Légende « Galerie » : bandes et disques, médailles, lignées, amont et aval, frise, niveaux, natures, énoncés. */
 export function Legend() {
   const { state, dispatch } = useStore();
   const { t } = useLang();
+  const { continents } = useData();
   if (!state.ui.legendOpen) return null;
   return (
     <div
@@ -32,17 +26,52 @@ export function Legend() {
           <X size={16} />
         </button>
       </div>
-      <h3 className="section-title-sm mb-1.5">{t('legend.rivers')}</h3>
-      {/* un fleuve qui s'élargit en traversant deux lacs */}
-      <svg width="100%" height="46" viewBox="0 0 280 46" aria-hidden="true" className="mb-1.5">
-        <path d="M6 23 C 60 21, 90 19, 140 21 S 230 24, 276 23 L 276 37 C 230 38, 190 36, 140 31 S 60 25, 6 25 Z" fill={FIELD_COLORS.formes.water} fillOpacity={0.7} />
-        <ellipse cx="78" cy="23" rx="30" ry="16" fill="hsl(205 46% 89%)" stroke={FIELD_COLORS.formes.ink} strokeWidth={1} />
-        <ellipse cx="196" cy="26" rx="34" ry="17" fill="hsl(205 46% 89%)" stroke={FIELD_COLORS.formes.ink} strokeWidth={1} />
-        <text x="272" y="15" textAnchor="end" fontSize="13" fontStyle="italic" fontWeight={600} fontFamily="var(--font-serif)" fill={FIELD_COLORS.formes.ink}>
-          n
+
+      <h3 className="section-title-sm mb-1.5">{t('legend.read')}</h3>
+      <ul className="flex flex-wrap gap-1.5 mb-1.5">
+        {continents.map((c) => (
+          <li key={c.id} className="chip" style={{ background: FIELD_COLORS[c.id].band, color: FIELD_COLORS[c.id].ink }}>
+            {c.shortName ?? c.name}
+          </li>
+        ))}
+      </ul>
+      <p className="text-xs text-soft mb-3">{t('legend.read.body')}</p>
+
+      <h3 className="section-title-sm mb-1.5">{t('legend.featured')}</h3>
+      <svg width="100%" height="34" viewBox="0 0 280 34" aria-hidden="true" className="mb-1">
+        <circle cx="17" cy="17" r="12.5" fill="none" stroke={FIELD_COLORS.analyse.medal} strokeWidth="0.9" />
+        <circle cx="17" cy="17" r="10" fill={FIELD_COLORS.analyse.medal} />
+        <text x="17" y="21.5" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight={600} fontSize="12" fill="#fff">
+          E
+        </text>
+        <text x="36" y="15" fontFamily="var(--font-serif)" fontWeight={600} fontSize="13" fill="#1d1b18">
+          Leonhard Euler
+        </text>
+        <text x="36" y="28" fontFamily="var(--font-sans)" fontSize="10" fill="#6a6357">
+          Problème de Bâle : ζ(2) = π²/6 · 1735
         </text>
       </svg>
-      <p className="text-xs text-soft mb-3">{t('legend.rivers.body')}</p>
+      <p className="text-xs text-soft mb-3">{t('legend.featured.body')}</p>
+
+      <h3 className="section-title-sm mb-1.5">{t('legend.lineage')}</h3>
+      <ul className="space-y-1.5 mb-1.5 text-sm">
+        <li className="flex items-center gap-2">
+          <svg width="46" height="10" aria-hidden="true">
+            <line x1="2" y1="5" x2="36" y2="5" stroke={TRANSMISSION_INK} strokeWidth={1.4} />
+            <path d="M44 5 L35 1.5 L35 8.5 Z" fill={TRANSMISSION_INK} />
+          </svg>
+          {t('legend.transmission')}
+        </li>
+        <li className="flex items-center gap-2">
+          <svg width="46" height="14" aria-hidden="true">
+            <line x1="2" y1="7" x2="44" y2="7" stroke={RUPTURE_INK} strokeWidth={1.6} />
+            <line x1="23" y1="1" x2="23" y2="13" stroke={RUPTURE_INK} strokeWidth={2.4} strokeLinecap="round" />
+          </svg>
+          {t('legend.rupture')}
+        </li>
+      </ul>
+      <p className="text-xs text-soft mb-3">{t('legend.lineage.body')}</p>
+
       <h3 className="section-title-sm mb-1.5">{t('legend.chain')}</h3>
       <svg width="100%" height="14" viewBox="0 0 280 14" aria-hidden="true" className="mb-1">
         <line x1="4" y1="7" x2="120" y2="7" stroke={UPSTREAM_INK} strokeWidth={2.2} strokeDasharray="10 7" />
@@ -51,28 +80,20 @@ export function Legend() {
         <path d="M274 7 L263 2.5 L263 11.5 Z" fill={DOWNSTREAM_INK} />
       </svg>
       <p className="text-xs text-soft mb-3">{t('legend.chain.body')}</p>
+
       <h3 className="section-title-sm mb-1.5">{t('legend.frieze')}</h3>
       <p className="text-xs text-soft mb-3">{t('legend.frieze.body')}</p>
-      <h3 className="section-title-sm mb-1.5">{t('legend.links')}</h3>
-      <ul className="space-y-1.5 mb-3">
-        {SAMPLES.map((s) => (
-          <li key={s.kind} className="flex items-center gap-2 text-sm">
-            <svg width="44" height="10" aria-hidden="true">
-              <line x1="2" y1="5" x2="42" y2="5" stroke={LINK_INK[s.kind]} strokeWidth={2} strokeDasharray={s.dash} />
-            </svg>
-            {t(s.labelKey)}
-          </li>
-        ))}
-      </ul>
-      <p className="text-xs text-muted mb-3">{t('legend.hint')}</p>
+
       <h3 className="section-title-sm mb-1.5">{t('legend.levels')}</h3>
       <p className="text-sm mb-3">{LEVEL_I18N.map((k) => t(k)).join(' · ')}</p>
+
       <h3 className="section-title-sm mb-1.5">{t('legend.results')}</h3>
       <p className="text-sm mb-3 flex flex-wrap gap-1.5">
         {RESULT_KINDS.map((k) => (
           <KindBadge key={k} kind={k} />
         ))}
       </p>
+
       <h3 className="section-title-sm mb-1.5">{t('legend.statements')}</h3>
       <p className="text-sm mb-3">
         <span className="badge-fait">{t('statement.fact')}</span> <span className="badge-interp">{t('statement.interp')}</span>
diff --git a/src/ui/Panel.tsx b/src/ui/Panel.tsx
index 82ad28c..494a9a1 100644
--- a/src/ui/Panel.tsx
+++ b/src/ui/Panel.tsx
@@ -1,595 +1,19 @@
-import { useEffect, useMemo, type ReactNode } from 'react';
+import { useEffect } from 'react';
+import { X } from 'lucide-react';
 import { useIsDesktop } from './useIsDesktop';
-import { X, ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';
-import type { Mathematician, Domain, Source, Theory, Result } from '../data/types';
-import { chainOf, generations } from '../map/upstream';
-import { DOWNSTREAM_INK, UPSTREAM_INK } from '../map/fieldColors';
-import { useStore, type Selection } from '../state/store';
-import { formatLifespan, formatPeriod, formatYear } from '../lib/years';
-import { StatementList } from './Statement';
-import { ResultCard, KindBadge } from './ResultCard';
+import { useStore } from '../state/store';
 import { Breadcrumb } from './Breadcrumb';
 import { Sheet } from './Sheet';
-import { resolveSelection, sourceOrderFor, type Resolved } from './resolve';
+import { resolveSelection } from './resolve';
 import { useLang } from '../i18n/lang';
-import type { UiKey } from '../i18n/ui';
-import { useData, LINK_KIND_I18N, MATHEMATICIAN_LINK_KIND_I18N, type AtlasData } from '../i18n/localize';
-
-type Nav = (sel: Selection | null) => void;
-
-function Section({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
-  return (
-    <section className="mt-6 mb-5" data-testid={testId}>
-      <h3 className="section-title">{title}</h3>
-      {children}
-    </section>
-  );
-}
-
-function DomainChips({ ids, color, nav }: { ids: string[]; color: string; nav: Nav }) {
-  const data = useData();
-  return (
-    <div className="flex flex-wrap gap-1.5">
-      {ids.map((id) => {
-        const d = data.domainById[id];
-        if (!d) return null;
-        return (
-          <button key={id} className="chip hover:border-accent/60 hover:text-accent transition" onClick={() => nav({ kind: 'domain', id })}>
-            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
-            {d.name}
-          </button>
-        );
-      })}
-    </div>
-  );
-}
-
-/** Générations d'un bassin : les deux premières à découvert, les suivantes repliées. */
-function Generations({ gens, color, firstKey, nav }: { gens: string[][]; color: string; firstKey: UiKey; nav: Nav }) {
-  const { t } = useLang();
-  const deeper = gens.slice(2);
-  const deeperCount = deeper.reduce((s, g) => s + g.length, 0);
-  return (
-    <>
-      {gens.slice(0, 2).map((ids, i) => (
-        <div key={i} className="mb-2">
-          <div className="text-xs uppercase tracking-wider text-muted mb-1">{i === 0 ? t(firstKey) : t('panel.basin.gen', { g: i + 1 })}</div>
-          <DomainChips ids={ids} color={color} nav={nav} />
-        </div>
-      ))}
-      {deeperCount > 0 && (
-        <details className="mb-2">
-          <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
-            {t('panel.basin.deeper', { n: deeperCount })}
-          </summary>
-          {deeper.map((ids, i) => (
-            <div key={i} className="mt-1.5">
-              <div className="text-xs text-muted mb-1">{t('panel.basin.gen', { g: i + 3 })}</div>
-              <DomainChips ids={ids} color={color} nav={nav} />
-            </div>
-          ))}
-        </details>
-      )}
-    </>
-  );
-}
-
-/**
- * Bassin d'un domaine : en amont, ce qui y conduit par filiation ou influence,
- * génération par génération ; en aval, ce qu'il a nourri, de proche en proche.
- */
-function BasinSection({ m, nav }: { m: Domain; nav: Nav }) {
-  const { t, lang } = useLang();
-  const data = useData();
-  const chain = useMemo(() => chainOf(data.links, m.id), [data.links, m.id]);
-  // ordre chronologique des domaines (data.domains est trié par début de période)
-  const order = useMemo(() => data.domains.map((d) => d.id), [data.domains]);
-  const upGens = generations(chain.upstream, order);
-  const downGens = generations(chain.downstream, order);
-  const nUp = chain.upstream.size;
-  const nDown = chain.downstream.size;
-  const oldest = order.find((id) => chain.upstream.has(id));
-  const oldestDomain = oldest ? data.domainById[oldest] : undefined;
-  const latest = [...order].reverse().find((id) => chain.downstream.has(id));
-  const latestDomain = latest ? data.domainById[latest] : undefined;
-  return (
-    <Section title={t('panel.basin')} testId="basin">
-      <div data-testid="upstream">
-        <h4 className="font-serif text-base mt-1 mb-1" style={{ color: UPSTREAM_INK }}>
-          {t('panel.upstream')}
-        </h4>
-        {nUp === 0 ? (
-          <p className="text-sm text-soft mb-2">{t('panel.upstream.none')}</p>
-        ) : (
-          <>
-            <p className="text-sm text-soft mb-2">
-              {t('panel.upstream.summary', { n: nUp, s: nUp > 1 ? 's' : '', g: chain.depth, gs: chain.depth > 1 ? 's' : '' })}
-              {oldestDomain && (
-                <>
-                  {' '}
-                  {t('panel.upstream.oldest', { name: oldestDomain.name, period: formatPeriod(oldestDomain.period, lang) })}
-                </>
-              )}
-            </p>
-            <Generations gens={upGens} color={UPSTREAM_INK} firstKey="panel.upstream.gen1" nav={nav} />
-          </>
-        )}
-      </div>
-      <div data-testid="downstream" className="mt-3">
-        <h4 className="font-serif text-base mb-1" style={{ color: DOWNSTREAM_INK }}>
-          {t('panel.downstream')}
-        </h4>
-        {nDown === 0 ? (
-          <p className="text-sm text-soft mb-2">{t('panel.downstream.none')}</p>
-        ) : (
-          <>
-            <p className="text-sm text-soft mb-2">
-              {t('panel.downstream.summary', { n: nDown, s: nDown > 1 ? 's' : '', g: chain.downDepth, gs: chain.downDepth > 1 ? 's' : '' })}
-              {latestDomain && (
-                <>
-                  {' '}
-                  {t('panel.downstream.latest', { name: latestDomain.name, period: formatPeriod(latestDomain.period, lang) })}
-                </>
-              )}
-            </p>
-            <Generations gens={downGens} color={DOWNSTREAM_INK} firstKey="panel.downstream.gen1" nav={nav} />
-          </>
-        )}
-      </div>
-      <p className="text-xs italic text-muted mt-2">{t('panel.basin.hint')}</p>
-    </Section>
-  );
-}
-
-function SourceList({ order, data }: { order: string[]; data: AtlasData }) {
-  const { t } = useLang();
-  return (
-    <ol className="list-decimal pl-5 space-y-1.5 text-sm">
-      {order.map((sid) => {
-        const s: Source | undefined = data.sourceById[sid];
-        if (!s) return <li key={sid} className="text-muted">{sid}</li>;
-        return (
-          <li key={sid}>
-            {s.author}, <em>{s.title}</em>
-            {s.year ? `, ${s.year}` : ''}
-            {s.publisher ? `, ${s.publisher}` : ''}
-            {s.note ? ` — ${s.note}` : ''}
-            {s.url ? (
-              <>
-                {' '}
-                <a href={s.url} target="_blank" rel="noreferrer" className="text-accent underline">
-                  {t('panel.sourceLink')}
-                </a>
-              </>
-            ) : null}
-          </li>
-        );
-      })}
-    </ol>
-  );
-}
-
-function ResultLine({ r, nav }: { r: Result; nav: Nav }) {
-  const { lang } = useLang();
-  return (
-    <button className="text-sm text-left text-accent hover:underline" onClick={() => nav({ kind: 'result', id: r.id })}>
-      {r.title} <span className="text-muted">({formatYear(r.year, lang, r.yearApprox)})</span>
-    </button>
-  );
-}
-
-function DomainView({ m, nav }: { m: Domain; nav: Nav }) {
-  const { state } = useStore();
-  const { t, lang } = useLang();
-  const data = useData();
-  const factsOnly = state.filters.factsOnly;
-  const order = sourceOrderFor(m);
-  const links = data.links.filter((l) => l.source === m.id || l.target === m.id);
-
-  return (
-    <>
-      <div className="h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${m.map.palette.fill}, ${m.map.palette.accent})` }} />
-      <h2 className="font-serif text-3xl leading-tight">{m.name}</h2>
-      {m.altNames && m.altNames.length > 0 && <p className="text-xs text-muted mt-0.5">{t('panel.also')} {m.altNames.join(' · ')}</p>}
-      <p className="font-serif italic text-soft mt-1">{m.tagline}</p>
-      <p className="text-sm text-muted mt-1">
-        {formatPeriod(m.period, lang)} · {m.places.join(', ')} ·{' '}
-        {m.continents.map((r) => data.continents.find((x) => x.id === r)?.name ?? r).join(', ')}
-      </p>
-
-      <Section title={t('panel.brief')}>
-        <p className="text-sm leading-relaxed">{m.summary}</p>
-      </Section>
-      <BasinSection m={m} nav={nav} />
-      <Section title={t('panel.methods')}>
-        <StatementList statements={m.methods} sourceOrder={order} factsOnly={factsOnly} />
-      </Section>
-      <Section title={t('panel.context')}>
-        <StatementList statements={m.context} sourceOrder={order} factsOnly={factsOnly} />
-      </Section>
-      <Section title={t('panel.debates')}>
-        <StatementList statements={m.debates} sourceOrder={order} factsOnly={factsOnly} />
-      </Section>
-      <Section title={t('panel.keyDates')}>
-        <ol className="border-l border-ink/15 pl-4 space-y-1.5">
-          {m.keyDates.map((k, i) => (
-            <li key={i} className="text-sm">
-              <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
-              {k.text}
-            </li>
-          ))}
-        </ol>
-      </Section>
-      <Section title={t('panel.theories')}>
-        <div className="grid gap-2">
-          {m.theories.map((s) => (
-            <button key={s.id} className="text-left glass p-3 hover:border-ink/30 transition" onClick={() => nav({ kind: 'theory', id: s.id })}>
-              <div className="font-serif text-base">{s.name} <span className="text-xs text-muted">{s.period ? formatPeriod(s.period, lang) : ''}</span></div>
-              <p className="text-xs text-muted mt-0.5">{s.summary}</p>
-              <div className="flex flex-wrap gap-1 mt-1.5">
-                {s.traits.slice(0, 4).map((tr) => (
-                  <span key={tr} className="chip !text-[0.65rem] !py-0">{tr}</span>
-                ))}
-              </div>
-            </button>
-          ))}
-        </div>
-      </Section>
-      <Section title={t('panel.mathematicians')}>
-        <ul className="space-y-1">
-          {m.mathematicians.map((f) => (
-            <li key={f.id}>
-              <button className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-ink/5 flex justify-between gap-2" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
-                <span>{f.name}</span>
-                <span className="text-xs text-muted text-right">
-                  {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
-                </span>
-              </button>
-            </li>
-          ))}
-        </ul>
-      </Section>
-      <Section title={t('panel.resultsKey')}>
-        <ul className="space-y-2">
-          {m.results.map((f) => (
-            <li key={f.id}>
-              <ResultCard result={f} onClick={() => nav({ kind: 'result', id: f.id })} />
-            </li>
-          ))}
-        </ul>
-      </Section>
-      {links.length > 0 && (
-        <Section title={t('panel.links')}>
-          <ul className="space-y-2">
-            {links.map((l, i) => {
-              const otherId = l.source === m.id ? l.target : l.source;
-              const other = data.domainById[otherId];
-              const Icon = l.kind === 'affinite' ? ArrowLeftRight : l.source === m.id ? ArrowRight : ArrowLeft;
-              return (
-                <li key={i} className="text-sm">
-                  <div className="flex items-center gap-1.5">
-                    <Icon size={14} className="text-muted shrink-0" />
-                    <span className="text-xs uppercase tracking-wider text-muted">{t(LINK_KIND_I18N[l.kind])}</span>
-                    {other && (
-                      <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
-                        {other.name}
-                      </button>
-                    )}
-                    <span className={l.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}>
-                      {l.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
-                    </span>
-                  </div>
-                  <div className="pl-5 text-soft">{l.label}</div>
-                  <div className="pl-5 text-xs text-muted">{l.note}</div>
-                </li>
-              );
-            })}
-          </ul>
-        </Section>
-      )}
-      <Section title={t('panel.sources')}>
-        <SourceList order={order} data={data} />
-      </Section>
-    </>
-  );
-}
-
-function TheoryView({ s, m, nav }: { s: Theory; m: Domain; nav: Nav }) {
-  const { t, lang } = useLang();
-  const mathematicians = m.mathematicians.filter((f) => f.theoryId === s.id);
-  const results = m.results.filter((f) => f.theoryId === s.id);
-  return (
-    <>
-      <h2 className="font-serif text-2xl">{s.name}</h2>
-      {s.period && <p className="text-sm text-muted">{formatPeriod(s.period, lang)}</p>}
-      <p className="text-sm mt-2">{s.summary}</p>
-      <div className="flex flex-wrap gap-1.5 mt-3">
-        {s.traits.map((tr) => (
-          <span key={tr} className="chip">{tr}</span>
-        ))}
-      </div>
-      {mathematicians.length > 0 && (
-        <Section title={t('panel.mathematicians')}>
-          <ul className="space-y-1">
-            {mathematicians.map((f) => (
-              <li key={f.id}>
-                <button className="text-sm text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
-                  {f.name}
-                </button>
-              </li>
-            ))}
-          </ul>
-        </Section>
-      )}
-      {results.length > 0 && (
-        <Section title={t('panel.results')}>
-          <ul className="space-y-1">
-            {results.map((f) => (
-              <li key={f.id}>
-                <ResultLine r={f} nav={nav} />
-              </li>
-            ))}
-          </ul>
-        </Section>
-      )}
-      <button className="chip mt-2" onClick={() => nav({ kind: 'domain', id: m.id })}>
-        {t('panel.backTo', { name: m.name })}
-      </button>
-    </>
-  );
-}
-
-function MathematicianView({ f, r, nav }: { f: Mathematician; r: Resolved; nav: Nav }) {
-  const { t, lang } = useLang();
-  const data = useData();
-  const home = r.mathematicianHome ?? r.domain!;
-  const theory = f.theoryId ? home.theories.find((s) => s.id === f.theoryId) : undefined;
-  const also = data.domains.filter((m) => m.id !== home.id && m.relatedMathematicianIds?.includes(f.id));
-  const network = (data.mathematicianLinksById[f.id] ?? []).map((l) => {
-    const otherId = l.source === f.id ? l.target : l.source;
-    return { link: l, other: data.mathematicianById[otherId], home: data.domainOfMathematician[otherId], outgoing: l.source === f.id };
-  });
-  // résultats dans tous les domaines, groupés par domaine
-  const resultsByDomain = data.domains
-    .map((m) => ({ m, results: m.results.filter((x) => x.mathematicianId === f.id) }))
-    .filter((g) => g.results.length > 0);
-  return (
-    <>
-      <h2 className="font-serif text-2xl">{f.name}</h2>
-      <p className="text-sm text-muted">
-        {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
-      </p>
-      <p className="text-sm mt-2">{f.bio}</p>
-      {theory && (
-        <p className="text-sm mt-2">
-          {t('panel.theory')}{' '}
-          <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
-            {theory.name}
-          </button>
-        </p>
-      )}
-      {resultsByDomain.length > 0 && (
-        <Section title={t('panel.results')}>
-          {resultsByDomain.map(({ m: gm, results }) => (
-            <div key={gm.id} className="mb-2">
-              <div className="text-xs uppercase tracking-wider text-muted mb-0.5">
-                <button className="hover:text-accent" onClick={() => nav({ kind: 'domain', id: gm.id })}>
-                  {gm.name}
-                </button>
-              </div>
-              <ul className="space-y-1 pl-2">
-                {results.map((x) => (
-                  <li key={x.id} className="flex items-center gap-2">
-                    <KindBadge kind={x.kind} />
-                    <ResultLine r={x} nav={nav} />
-                  </li>
-                ))}
-              </ul>
-            </div>
-          ))}
-        </Section>
-      )}
-      {network.length > 0 && (
-        <Section title={t('panel.network')}>
-          <ul className="space-y-1.5">
-            {network.map(({ link, other, home: oh, outgoing }) =>
-              other ? (
-                <li key={`${link.source}|${link.target}|${link.kind}`} className="text-sm">
-                  <span className="text-xs uppercase tracking-wider text-muted mr-2">{t(MATHEMATICIAN_LINK_KIND_I18N[link.kind])}</span>
-                  <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: other.id })}>
-                    {other.name}
-                  </button>
-                  {link.epistemic && (
-                    <span className={`ml-2 ${link.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}`}>
-                      {link.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
-                    </span>
-                  )}
-                  {oh && oh.id !== home.id && (
-                    <>
-                      {' '}
-                      <span className="text-muted">
-                        (
-                        <button className="hover:text-accent" onClick={() => nav({ kind: 'domain', id: oh.id })}>
-                          {oh.name}
-                        </button>
-                        )
-                      </span>
-                    </>
-                  )}
-                  <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">
-                    {!outgoing && link.kind !== 'collaboration' && link.kind !== 'affinite' ? `${other.name} → ${f.name} : ` : ''}
-                    {link.note}
-                  </span>
-                </li>
-              ) : null,
-            )}
-          </ul>
-        </Section>
-      )}
-      <p className="text-sm">
-        {t('panel.domain')}{' '}
-        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: home.id })}>
-          {home.name}
-        </button>
-      </p>
-      {also.length > 0 && (
-        <p className="text-sm mt-1">
-          {t('panel.alsoActive')}{' '}
-          {also.map((a, i) => (
-            <span key={a.id}>
-              {i > 0 && ', '}
-              <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: a.id })}>
-                {a.name}
-              </button>
-            </span>
-          ))}
-        </p>
-      )}
-    </>
-  );
-}
-
-function ResultView({ f, r, nav }: { f: Result; r: Resolved; nav: Nav }) {
-  const { state } = useStore();
-  const { t, lang } = useLang();
-  const data = useData();
-  const m = r.domain!;
-  const factsOnly = state.filters.factsOnly;
-  // récits rédigés (grands résultats) : sources numérotées propres à la fiche
-  const narrative = [...(f.context ?? []), ...(f.impact ?? [])];
-  const narrativeOrder = [...new Set(narrative.flatMap((s) => s.sources ?? []))];
-  const author = r.mathematician;
-  const theory = f.theoryId ? m.theories.find((s) => s.id === f.theoryId) : undefined;
-  const also = m.results.filter((x) => x.id !== f.id && (f.theoryId ? x.theoryId === f.theoryId : true)).slice(0, 3);
-  // « Ce qui y a conduit » : les repères du domaine qui précèdent, et les héritages reçus
-  const before = m.keyDates.filter((k) => k.year < f.year).slice(-2);
-  const heritage = data.links.filter((l) => l.target === m.id && (l.kind === 'filiation' || l.kind === 'influence')).slice(0, 3);
-  // « Ce que ça a ouvert » : les repères qui suivent, et ce que le domaine a transmis
-  const after = m.keyDates.filter((k) => k.year > f.year).slice(0, 2);
-  const legacy = data.links.filter((l) => l.source === m.id).slice(0, 3);
-  const linkLine = (l: (typeof data.links)[number], outgoing: boolean) => {
-    const otherId = outgoing ? l.target : l.source;
-    const other = data.domainById[otherId];
-    return (
-      <li key={`${l.source}|${l.target}|${l.kind}`} className="text-sm">
-        <span className="text-xs uppercase tracking-wider text-muted mr-1.5">{t(LINK_KIND_I18N[l.kind])}</span>
-        {other && (
-          <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
-            {other.name}
-          </button>
-        )}
-        <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">{l.label}</span>
-      </li>
-    );
-  };
-  return (
-    <>
-      <div className="min-w-0">
-        <div className="flex items-center gap-2 flex-wrap mb-1.5">
-          <KindBadge kind={f.kind} />
-          <span className="text-sm text-muted">{formatYear(f.year, lang, f.yearApprox)}</span>
-        </div>
-        <h2 className="font-serif text-2xl leading-tight">{f.title}</h2>
-        {f.altTitle && <p className="font-serif italic text-muted">{f.altTitle}</p>}
-        <p className="text-sm text-muted mt-1">
-          {author ? (
-            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: author.id })}>
-              {f.authorName}
-            </button>
-          ) : (
-            f.authorName
-          )}
-        </p>
-        {theory && (
-          <p className="text-sm mt-1">
-            {t('panel.theory')}{' '}
-            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
-              {theory.name}
-            </button>
-          </p>
-        )}
-      </div>
-      {f.statement && (
-        <Section title={t('panel.statement')}>
-          <p className="text-sm leading-relaxed text-soft font-serif text-[0.95rem] border-l-2 border-accent/40 pl-3">{f.statement}</p>
-        </Section>
-      )}
-      <Section title={t('panel.place')}>
-        <p className="text-sm leading-relaxed">{f.comment}</p>
-      </Section>
-      {(f.context || before.length > 0 || heritage.length > 0) && (
-        <Section title={t('panel.resultRoots')} testId="result-context">
-          {f.context && (
-            <div className="mb-3">
-              <StatementList statements={f.context} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
-            </div>
-          )}
-          {f.context && (before.length > 0 || heritage.length > 0) && (
-            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
-          )}
-          {before.length > 0 && (
-            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
-              {before.map((k, i) => (
-                <li key={i} className="text-sm">
-                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
-                  {k.text}
-                </li>
-              ))}
-            </ol>
-          )}
-          <ul className="space-y-2">{heritage.map((l) => linkLine(l, false))}</ul>
-        </Section>
-      )}
-      {(f.impact || after.length > 0 || legacy.length > 0) && (
-        <Section title={t('panel.resultLegacy')} testId="result-impact">
-          {f.impact && (
-            <div className="mb-3">
-              <StatementList statements={f.impact} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
-            </div>
-          )}
-          {f.impact && (after.length > 0 || legacy.length > 0) && (
-            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
-          )}
-          {after.length > 0 && (
-            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
-              {after.map((k, i) => (
-                <li key={i} className="text-sm">
-                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
-                  {k.text}
-                </li>
-              ))}
-            </ol>
-          )}
-          <ul className="space-y-2">{legacy.map((l) => linkLine(l, true))}</ul>
-        </Section>
-      )}
-      <p className="text-sm mt-2">
-        {t('panel.domain')}{' '}
-        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: m.id })}>
-          {m.name}
-        </button>
-      </p>
-      {also.length > 0 && (
-        <Section title={t('panel.seeAlso')}>
-          <ul className="space-y-1">
-            {also.map((x) => (
-              <li key={x.id} className="flex items-center gap-2">
-                <KindBadge kind={x.kind} />
-                <ResultLine r={x} nav={nav} />
-              </li>
-            ))}
-          </ul>
-        </Section>
-      )}
-      {narrativeOrder.length > 0 && (
-        <Section title={t('panel.sources')}>
-          <SourceList order={narrativeOrder} data={data} />
-        </Section>
-      )}
-    </>
-  );
-}
-
+import { useData } from '../i18n/localize';
+import { DomainView } from './panel/DomainView';
+import { TheoryView } from './panel/TheoryView';
+import { MathematicianView } from './panel/MathematicianView';
+import { ResultView } from './panel/ResultView';
+import type { Nav } from './panel/common';
+
+/** Panneau de détail (desktop) ou feuille (mobile) de la sélection. */
 export function Panel({ nav }: { nav: Nav }) {
   const { state, dispatch } = useStore();
   const { t } = useLang();
diff --git a/src/ui/TopBar.tsx b/src/ui/TopBar.tsx
index 3ba4a32..9ff853a 100644
--- a/src/ui/TopBar.tsx
+++ b/src/ui/TopBar.tsx
@@ -1,5 +1,5 @@
 import { useEffect, useState } from 'react';
-import { SlidersHorizontal, Info, BookOpen, Search, X, Layers } from 'lucide-react';
+import { SlidersHorizontal, Info, BookOpen, Search, X } from 'lucide-react';
 import { useStore } from '../state/store';
 import { SearchBox } from './SearchBox';
 import { LangSwitcher } from '../i18n/LangSwitcher';
@@ -49,9 +49,6 @@ export function TopBar({ onNavigate }: Props) {
         >
           <Search size={17} />
         </button>
-        <button className="glass p-2.5 hover:bg-ink/8" aria-label={t('nav.visions')} onClick={() => dispatch({ type: 'toggle-ui', key: 'visionOpen' })}>
-          <Layers size={17} />
-        </button>
         <button className="glass p-2.5 hover:bg-ink/8" aria-label={t('nav.filters')} onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })}>
           <SlidersHorizontal size={17} />
         </button>
diff --git a/src/ui/VisionPanel.tsx b/src/ui/VisionPanel.tsx
deleted file mode 100644
index 09429ea..0000000
--- a/src/ui/VisionPanel.tsx
+++ /dev/null
@@ -1,79 +0,0 @@
-import { X } from 'lucide-react';
-import type { ResultKind } from '../data/types';
-import { useStore, type VisionId } from '../state/store';
-import { useLang } from '../i18n/lang';
-import type { UiKey } from '../i18n/ui';
-import { KindBadge } from './ResultCard';
-
-const VISION_I18N: Record<VisionId, { name: UiKey; desc: UiKey }> = {
-  structure: { name: 'vision.structure', desc: 'vision.structure.desc' },
-  filiations: { name: 'vision.filiations', desc: 'vision.filiations.desc' },
-  reseaux: { name: 'vision.reseaux', desc: 'vision.reseaux.desc' },
-  natures: { name: 'vision.natures', desc: 'vision.natures.desc' },
-};
-const VISIONS = Object.keys(VISION_I18N) as VisionId[];
-const KINDS: ResultKind[] = ['theoreme', 'conjecture', 'concept', 'methode', 'texte', 'probleme'];
-
-/** Sélecteur de visions : modes de lecture superposés à la carte. */
-export function VisionPanel() {
-  const { state, dispatch } = useStore();
-  const { t } = useLang();
-  if (!state.ui.visionOpen) return null;
-  return (
-    <aside
-      data-testid="vision-panel"
-      className="glass fixed top-20 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] p-4"
-      role="dialog"
-      aria-label={t('vision.title')}
-    >
-      <div className="flex items-start justify-between gap-2">
-        <h2 className="section-title flex-1 !mb-0">{t('vision.title')}</h2>
-        <button aria-label={t('vision.close')} className="p-1 hover:bg-ink/8 rounded shrink-0" onClick={() => dispatch({ type: 'toggle-ui', key: 'visionOpen' })}>
-          <X size={16} />
-        </button>
-      </div>
-      <div className="grid gap-1.5 mt-3">
-        {VISIONS.map((v) => {
-          const active = state.vision === v;
-          return (
-            <button
-              key={v}
-              data-vision={v}
-              className={`text-left px-3 py-2 rounded-lg border transition ${
-                active ? 'border-accent/60 bg-ink/5' : 'border-transparent hover:bg-ink/5'
-              }`}
-              onClick={() => dispatch({ type: 'set-vision', vision: v })}
-            >
-              <div className="font-serif font-bold text-lg leading-tight">{t(VISION_I18N[v].name)}</div>
-              <div className="text-xs text-muted mt-0.5">{t(VISION_I18N[v].desc)}</div>
-            </button>
-          );
-        })}
-      </div>
-      {state.vision === 'natures' && (
-        <div className="mt-3">
-          <h3 className="section-title">{t('legend.results')}</h3>
-          <div className="flex flex-wrap gap-1.5">
-            {KINDS.map((k) => {
-              const active = state.naturesKind === k;
-              return (
-                <button
-                  key={k}
-                  className={`rounded transition ${active ? 'ring-1 ring-ink/60' : 'opacity-55 hover:opacity-100'}`}
-                  onClick={() => dispatch({ type: 'set-natures-kind', kind: active ? null : k })}
-                >
-                  <KindBadge kind={k} />
-                </button>
-              );
-            })}
-          </div>
-          {state.naturesKind !== null && (
-            <button className="chip mt-2" onClick={() => dispatch({ type: 'set-natures-kind', kind: null })}>
-              {t('vision.natures.all')}
-            </button>
-          )}
-        </div>
-      )}
-    </aside>
-  );
-}
diff --git a/src/ui/panel/BasinSection.tsx b/src/ui/panel/BasinSection.tsx
new file mode 100644
index 0000000..ea03c20
--- /dev/null
+++ b/src/ui/panel/BasinSection.tsx
@@ -0,0 +1,106 @@
+import { useMemo } from 'react';
+import type { Domain } from '../../data/types';
+import { chainOf, generations } from '../../map/upstream';
+import { DOWNSTREAM_INK, UPSTREAM_INK } from '../../map/fieldColors';
+import { formatPeriod } from '../../lib/years';
+import { useLang } from '../../i18n/lang';
+import type { UiKey } from '../../i18n/ui';
+import { useData } from '../../i18n/localize';
+import { DomainChips, Section, type Nav } from './common';
+
+/** Générations d'un bassin : les deux premières à découvert, les suivantes repliées. */
+function Generations({ gens, color, firstKey, nav }: { gens: string[][]; color: string; firstKey: UiKey; nav: Nav }) {
+  const { t } = useLang();
+  const deeper = gens.slice(2);
+  const deeperCount = deeper.reduce((s, g) => s + g.length, 0);
+  return (
+    <>
+      {gens.slice(0, 2).map((ids, i) => (
+        <div key={i} className="mb-2">
+          <div className="text-xs uppercase tracking-wider text-muted mb-1">{i === 0 ? t(firstKey) : t('panel.basin.gen', { g: i + 1 })}</div>
+          <DomainChips ids={ids} color={color} nav={nav} />
+        </div>
+      ))}
+      {deeperCount > 0 && (
+        <details className="mb-2">
+          <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
+            {t('panel.basin.deeper', { n: deeperCount })}
+          </summary>
+          {deeper.map((ids, i) => (
+            <div key={i} className="mt-1.5">
+              <div className="text-xs text-muted mb-1">{t('panel.basin.gen', { g: i + 3 })}</div>
+              <DomainChips ids={ids} color={color} nav={nav} />
+            </div>
+          ))}
+        </details>
+      )}
+    </>
+  );
+}
+
+/**
+ * Bassin d'un domaine : en amont, ce qui y conduit par filiation ou influence,
+ * génération par génération ; en aval, ce qu'il a nourri, de proche en proche.
+ */
+export function BasinSection({ m, nav }: { m: Domain; nav: Nav }) {
+  const { t, lang } = useLang();
+  const data = useData();
+  const chain = useMemo(() => chainOf(data.links, m.id), [data.links, m.id]);
+  // ordre chronologique des domaines (data.domains est trié par début de période)
+  const order = useMemo(() => data.domains.map((d) => d.id), [data.domains]);
+  const upGens = generations(chain.upstream, order);
+  const downGens = generations(chain.downstream, order);
+  const nUp = chain.upstream.size;
+  const nDown = chain.downstream.size;
+  const oldest = order.find((id) => chain.upstream.has(id));
+  const oldestDomain = oldest ? data.domainById[oldest] : undefined;
+  const latest = [...order].reverse().find((id) => chain.downstream.has(id));
+  const latestDomain = latest ? data.domainById[latest] : undefined;
+  return (
+    <Section title={t('panel.basin')} testId="basin">
+      <div data-testid="upstream">
+        <h4 className="font-serif text-base mt-1 mb-1" style={{ color: UPSTREAM_INK }}>
+          {t('panel.upstream')}
+        </h4>
+        {nUp === 0 ? (
+          <p className="text-sm text-soft mb-2">{t('panel.upstream.none')}</p>
+        ) : (
+          <>
+            <p className="text-sm text-soft mb-2">
+              {t('panel.upstream.summary', { n: nUp, s: nUp > 1 ? 's' : '', g: chain.depth, gs: chain.depth > 1 ? 's' : '' })}
+              {oldestDomain && (
+                <>
+                  {' '}
+                  {t('panel.upstream.oldest', { name: oldestDomain.name, period: formatPeriod(oldestDomain.period, lang) })}
+                </>
+              )}
+            </p>
+            <Generations gens={upGens} color={UPSTREAM_INK} firstKey="panel.upstream.gen1" nav={nav} />
+          </>
+        )}
+      </div>
+      <div data-testid="downstream" className="mt-3">
+        <h4 className="font-serif text-base mb-1" style={{ color: DOWNSTREAM_INK }}>
+          {t('panel.downstream')}
+        </h4>
+        {nDown === 0 ? (
+          <p className="text-sm text-soft mb-2">{t('panel.downstream.none')}</p>
+        ) : (
+          <>
+            <p className="text-sm text-soft mb-2">
+              {t('panel.downstream.summary', { n: nDown, s: nDown > 1 ? 's' : '', g: chain.downDepth, gs: chain.downDepth > 1 ? 's' : '' })}
+              {latestDomain && (
+                <>
+                  {' '}
+                  {t('panel.downstream.latest', { name: latestDomain.name, period: formatPeriod(latestDomain.period, lang) })}
+                </>
+              )}
+            </p>
+            <Generations gens={downGens} color={DOWNSTREAM_INK} firstKey="panel.downstream.gen1" nav={nav} />
+          </>
+        )}
+      </div>
+      <p className="text-xs italic text-muted mt-2">{t('panel.basin.hint')}</p>
+    </Section>
+  );
+}
diff --git a/src/ui/panel/DomainView.tsx b/src/ui/panel/DomainView.tsx
new file mode 100644
index 0000000..d30ac81
--- /dev/null
+++ b/src/ui/panel/DomainView.tsx
@@ -0,0 +1,172 @@
+import { useMemo } from 'react';
+import type { Domain, Link, Mathematician } from '../../data/types';
+import { useStore } from '../../state/store';
+import { useLang } from '../../i18n/lang';
+import { useData, LINK_KIND_I18N } from '../../i18n/localize';
+import { formatLifespan, formatPeriod, formatYear } from '../../lib/years';
+import { principalLinks } from '../../map/lineage';
+import { StatementList } from '../Statement';
+import { ResultCard } from '../ResultCard';
+import { sourceOrderFor } from '../resolve';
+import { BasinSection } from './BasinSection';
+import { Medallion, Section, SourceList, type Nav } from './common';
+
+/** au-delà, les figures du domaine sont repliées */
+const FIGURES_OPEN = 12;
+
+export function DomainView({ m, nav }: { m: Domain; nav: Nav }) {
+  const { state } = useStore();
+  const { t, lang } = useLang();
+  const data = useData();
+  const factsOnly = state.filters.factsOnly;
+  const order = sourceOrderFor(m);
+  const links = data.links.filter((l) => l.source === m.id || l.target === m.id);
+  const main = useMemo(() => principalLinks(data.links, data.domainById), [data.links, data.domainById]);
+  const isTransmission = (l: Link) => l.kind === 'filiation' || l.kind === 'influence';
+  const linkGroups = [
+    { key: 'in', title: t('panel.links.in'), items: links.filter((l) => isTransmission(l) && l.target === m.id) },
+    { key: 'out', title: t('panel.links.out'), items: links.filter((l) => isTransmission(l) && l.source === m.id) },
+    { key: 'ruptures', title: t('panel.links.ruptures'), items: links.filter((l) => l.kind === 'reaction') },
+    { key: 'affinities', title: t('panel.links.affinities'), items: links.filter((l) => l.kind === 'affinite') },
+  ];
+  const featured = m.mathematicians.filter((f) => f.featured);
+  // grandes figures d'abord, puis par année de naissance
+  const figures = [...m.mathematicians].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.years[0] - b.years[0]);
+  const figureLine = (f: Mathematician) => (
+    <li key={f.id}>
+      <button className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-ink/5 flex justify-between gap-2" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
+        <span className={f.featured ? 'font-semibold' : undefined}>{f.name}</span>
+        <span className="text-xs text-muted text-right">
+          {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
+        </span>
+      </button>
+    </li>
+  );
+
+  return (
+    <>
+      <div className="h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${m.map.palette.fill}, ${m.map.palette.accent})` }} />
+      <h2 className="font-serif text-3xl leading-tight">{m.name}</h2>
+      {m.altNames && m.altNames.length > 0 && <p className="text-xs text-muted mt-0.5">{t('panel.also')} {m.altNames.join(' · ')}</p>}
+      <p className="font-serif italic text-soft mt-1">{m.tagline}</p>
+      <p className="text-sm text-muted mt-1">
+        {formatPeriod(m.period, lang)} · {m.places.join(', ')} ·{' '}
+        {m.continents.map((r) => data.continents.find((x) => x.id === r)?.name ?? r).join(', ')}
+      </p>
+
+      <Section title={t('panel.brief')}>
+        <p className="text-sm leading-relaxed">{m.summary}</p>
+      </Section>
+      {featured.length > 0 && (
+        <Section title={t('panel.featured')} testId="domain-featured">
+          <ul className="space-y-2">
+            {featured.map((f) => (
+              <li key={f.id}>
+                <button className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-ink/5" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
+                  <Medallion m={f} color={m.map.palette.accent} size={30} />
+                  <span className="min-w-0">
+                    <span className="block font-serif font-semibold text-base leading-tight">{f.name}</span>
+                    <span className="block text-xs text-muted">{f.featured!.signature.text}</span>
+                  </span>
+                </button>
+              </li>
+            ))}
+          </ul>
+        </Section>
+      )}
+      <BasinSection m={m} nav={nav} />
+      <Section title={t('panel.methods')}>
+        <StatementList statements={m.methods} sourceOrder={order} factsOnly={factsOnly} />
+      </Section>
+      <Section title={t('panel.context')}>
+        <StatementList statements={m.context} sourceOrder={order} factsOnly={factsOnly} />
+      </Section>
+      <Section title={t('panel.debates')}>
+        <StatementList statements={m.debates} sourceOrder={order} factsOnly={factsOnly} />
+      </Section>
+      <Section title={t('panel.keyDates')}>
+        <ol className="border-l border-ink/15 pl-4 space-y-1.5">
+          {m.keyDates.map((k, i) => (
+            <li key={i} className="text-sm">
+              <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
+              {k.text}
+            </li>
+          ))}
+        </ol>
+      </Section>
+      <Section title={t('panel.theories')}>
+        <div className="grid gap-2">
+          {m.theories.map((s) => (
+            <button key={s.id} className="text-left glass p-3 hover:border-ink/30 transition" onClick={() => nav({ kind: 'theory', id: s.id })}>
+              <div className="font-serif text-base">{s.name} <span className="text-xs text-muted">{s.period ? formatPeriod(s.period, lang) : ''}</span></div>
+              <p className="text-xs text-muted mt-0.5">{s.summary}</p>
+              <div className="flex flex-wrap gap-1 mt-1.5">
+                {s.traits.slice(0, 4).map((tr) => (
+                  <span key={tr} className="chip !text-[0.65rem] !py-0">{tr}</span>
+                ))}
+              </div>
+            </button>
+          ))}
+        </div>
+      </Section>
+      <Section title={`${t('panel.mathematicians')} (${figures.length})`}>
+        <ul className="space-y-1">{figures.slice(0, FIGURES_OPEN).map(figureLine)}</ul>
+        {figures.length > FIGURES_OPEN && (
+          <details className="mt-1">
+            <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-ink">
+              {t('panel.moreFigures', { n: figures.length - FIGURES_OPEN })}
+            </summary>
+            <ul className="space-y-1 mt-1">{figures.slice(FIGURES_OPEN).map(figureLine)}</ul>
+          </details>
+        )}
+      </Section>
+      <Section title={t('panel.resultsKey')}>
+        <ul className="space-y-2">
+          {m.results.map((f) => (
+            <li key={f.id}>
+              <ResultCard result={f} onClick={() => nav({ kind: 'result', id: f.id })} />
+            </li>
+          ))}
+        </ul>
+      </Section>
+      {links.length > 0 && (
+        <Section title={t('panel.links')} testId="domain-links">
+          {linkGroups.map(({ key, title, items }) =>
+            items.length > 0 ? (
+              <div key={key} className="mb-3">
+                <h4 className="text-xs uppercase tracking-wider text-muted mb-1">{title}</h4>
+                <ul className="space-y-2">
+                  {items.map((l) => {
+                    const otherId = l.source === m.id ? l.target : l.source;
+                    const other = data.domainById[otherId];
+                    return (
+                      <li key={`${l.source}|${l.target}|${l.kind}`} className="text-sm">
+                        <div className="flex items-center gap-1.5 flex-wrap">
+                          <span className="text-xs uppercase tracking-wider text-muted">{t(LINK_KIND_I18N[l.kind])}</span>
+                          {other && (
+                            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
+                              {other.name}
+                            </button>
+                          )}
+                          <span className={l.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}>
+                            {l.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
+                          </span>
+                          {main.get(l.target) === l && <span className="badge-principal">{t('panel.principal')}</span>}
+                        </div>
+                        <div className="pl-1 text-soft">{l.label}</div>
+                        <div className="pl-1 text-xs text-muted">{l.note}</div>
+                      </li>
+                    );
+                  })}
+                </ul>
+              </div>
+            ) : null,
+          )}
+        </Section>
+      )}
+      <Section title={t('panel.sources')}>
+        <SourceList order={order} data={data} />
+      </Section>
+    </>
+  );
+}
diff --git a/src/ui/panel/MathematicianView.tsx b/src/ui/panel/MathematicianView.tsx
new file mode 100644
index 0000000..3041e7a
--- /dev/null
+++ b/src/ui/panel/MathematicianView.tsx
@@ -0,0 +1,165 @@
+import type { Mathematician, Result } from '../../data/types';
+import { useStore } from '../../state/store';
+import { useLang } from '../../i18n/lang';
+import { useData, MATHEMATICIAN_LINK_KIND_I18N } from '../../i18n/localize';
+import { formatLifespan } from '../../lib/years';
+import { Statement, StatementList } from '../Statement';
+import { ResultCard, KindBadge } from '../ResultCard';
+import { sourceOrder, type Resolved } from '../resolve';
+import { Medallion, ResultLine, Section, SourceList, type Nav } from './common';
+
+const MACTUTOR_URL = 'https://mathshistory.st-andrews.ac.uk/Biographies/';
+
+/**
+ * Fiche d'une figure. Grande figure : médaille, signature, apports, résultats
+ * phares, puis la biographie et les autres résultats. Figure ordinaire ou fiche
+ * courte : biographie, résultats éventuels, réseau.
+ */
+export function MathematicianView({ f, r, nav }: { f: Mathematician; r: Resolved; nav: Nav }) {
+  const { state } = useStore();
+  const { t, lang } = useLang();
+  const data = useData();
+  const factsOnly = state.filters.factsOnly;
+  const home = r.mathematicianHome ?? r.domain!;
+  const theory = f.theoryId ? home.theories.find((s) => s.id === f.theoryId) : undefined;
+  const also = data.domains.filter((m) => m.id !== home.id && m.relatedMathematicianIds?.includes(f.id));
+  const network = (data.mathematicianLinksById[f.id] ?? []).map((l) => {
+    const otherId = l.source === f.id ? l.target : l.source;
+    return { link: l, other: data.mathematicianById[otherId], home: data.domainOfMathematician[otherId], outgoing: l.source === f.id };
+  });
+  const featured = f.featured;
+  const headlineIds = new Set(featured?.headlineResultIds ?? []);
+  const allResults = data.domains.flatMap((m) => m.results.filter((x) => x.mathematicianId === f.id).map((x) => ({ m, x })));
+  const headlines = (featured?.headlineResultIds ?? [])
+    .map((id) => allResults.find((e) => e.x.id === id)?.x)
+    .filter((x): x is Result => !!x);
+  // autres résultats, groupés par domaine
+  const others = data.domains
+    .map((m) => ({ m, results: m.results.filter((x) => x.mathematicianId === f.id && !headlineIds.has(x.id)) }))
+    .filter((g) => g.results.length > 0);
+  const order = sourceOrder(featured ? [featured.signature, ...featured.contributions] : [], [{ sources: f.sources }]);
+
+  return (
+    <>
+      <div className="flex items-center gap-4">
+        {featured ? <Medallion m={f} color={home.map.palette.accent} size={44} /> : null}
+        <div className="min-w-0">
+          <h2 className="font-serif text-3xl leading-tight">{f.name}</h2>
+          <p className="text-sm text-muted">
+            {formatLifespan(f.years, lang, f.yearsApprox)} · {f.origin}
+          </p>
+        </div>
+      </div>
+      {featured && (
+        <ul className="list-none p-0 mt-3 signature" data-testid="signature">
+          <Statement statement={featured.signature} sourceOrder={order} factsOnly={factsOnly} />
+        </ul>
+      )}
+      {featured && featured.contributions.length > 0 && (
+        <Section title={t('panel.contributions')} testId="contributions">
+          <StatementList statements={featured.contributions} sourceOrder={order} factsOnly={factsOnly} />
+        </Section>
+      )}
+      {headlines.length > 0 && (
+        <Section title={t('panel.headlines')} testId="headlines">
+          <ul className="space-y-2">
+            {headlines.map((x) => (
+              <li key={x.id}>
+                <ResultCard result={x} onClick={() => nav({ kind: 'result', id: x.id })} />
+              </li>
+            ))}
+          </ul>
+        </Section>
+      )}
+      <Section title={t('panel.bio')}>
+        <p className="text-sm leading-relaxed">{f.bio}</p>
+        {theory && (
+          <p className="text-sm mt-2">
+            {t('panel.theory')}{' '}
+            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
+              {theory.name}
+            </button>
+          </p>
+        )}
+        {f.mactutor && (
+          <p className="text-sm mt-2">
+            <a className="text-accent underline" href={`${MACTUTOR_URL}${f.mactutor}/`} target="_blank" rel="noreferrer">
+              {t('panel.mactutor')}
+            </a>
+          </p>
+        )}
+      </Section>
+      {others.length > 0 && (
+        <Section title={featured ? t('panel.otherResults') : t('panel.results')}>
+          {others.map(({ m: gm, results }) => (
+            <div key={gm.id} className="mb-2">
+              <div className="text-xs uppercase tracking-wider text-muted mb-0.5">
+                <button className="hover:text-accent" onClick={() => nav({ kind: 'domain', id: gm.id })}>
+                  {gm.name}
+                </button>
+              </div>
+              <ul className="space-y-1 pl-2">
+                {results.map((x) => (
+                  <li key={x.id} className="flex items-center gap-2">
+                    <KindBadge kind={x.kind} />
+                    <ResultLine r={x} nav={nav} />
+                  </li>
+                ))}
+              </ul>
+            </div>
+          ))}
+        </Section>
+      )}
+      {network.length > 0 && (
+        <Section title={t('panel.network')}>
+          <ul className="space-y-1.5">
+            {network.map(({ link, other, home: oh, outgoing }) =>
+              other ? (
+                <li key={`${link.source}|${link.target}|${link.kind}`} className="text-sm">
+                  <span className="text-xs uppercase tracking-wider text-muted mr-2">{t(MATHEMATICIAN_LINK_KIND_I18N[link.kind])}</span>
+                  <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: other.id })}>
+                    {other.name}
+                  </button>
+                  {link.epistemic && (
+                    <span className={`ml-2 ${link.epistemic === 'fait' ? 'badge-fait' : 'badge-interp'}`}>
+                      {link.epistemic === 'fait' ? t('statement.fact') : t('statement.interp')}
+                    </span>
+                  )}
+                  {oh && oh.id !== home.id && <span className="text-muted"> · {oh.name}</span>}
+                  <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">
+                    {!outgoing && link.kind !== 'collaboration' && link.kind !== 'affinite' ? `${other.name} → ${f.name} : ` : ''}
+                    {link.note}
+                  </span>
+                </li>
+              ) : null,
+            )}
+          </ul>
+        </Section>
+      )}
+      <p className="text-sm">
+        {t('panel.domain')}{' '}
+        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: home.id })}>
+          {home.name}
+        </button>
+      </p>
+      {also.length > 0 && (
+        <p className="text-sm mt-1">
+          {t('panel.alsoActive')}{' '}
+          {also.map((a, i) => (
+            <span key={a.id}>
+              {i > 0 && ', '}
+              <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: a.id })}>
+                {a.name}
+              </button>
+            </span>
+          ))}
+        </p>
+      )}
+      {order.length > 0 && (
+        <Section title={t('panel.sources')}>
+          <SourceList order={order} data={data} />
+        </Section>
+      )}
+    </>
+  );
+}
diff --git a/src/ui/panel/ResultView.tsx b/src/ui/panel/ResultView.tsx
new file mode 100644
index 0000000..71283e2
--- /dev/null
+++ b/src/ui/panel/ResultView.tsx
@@ -0,0 +1,163 @@
+import type { Result } from '../../data/types';
+import { useStore } from '../../state/store';
+import { useLang } from '../../i18n/lang';
+import { useData, LINK_KIND_I18N } from '../../i18n/localize';
+import { formatYear } from '../../lib/years';
+import { Statement, StatementList } from '../Statement';
+import { KindBadge } from '../ResultCard';
+import { sourceOrder, type Resolved } from '../resolve';
+import { ResultLine, Section, SourceList, type Nav } from './common';
+
+export function ResultView({ f, r, nav }: { f: Result; r: Resolved; nav: Nav }) {
+  const { state } = useStore();
+  const { t, lang } = useLang();
+  const data = useData();
+  const m = r.domain!;
+  const factsOnly = state.filters.factsOnly;
+  // énoncés rédigés (intuition, démonstration, récits) : sources numérotées propres à la fiche
+  const narrativeOrder = sourceOrder(f.intuition ?? [], f.proof ?? [], f.context ?? [], f.impact ?? []);
+  const author = r.mathematician;
+  const theory = f.theoryId ? m.theories.find((s) => s.id === f.theoryId) : undefined;
+  const also = m.results.filter((x) => x.id !== f.id && (f.theoryId ? x.theoryId === f.theoryId : true)).slice(0, 3);
+  // « Ce qui y a conduit » : les repères du domaine qui précèdent, et les héritages reçus
+  const before = m.keyDates.filter((k) => k.year < f.year).slice(-2);
+  const heritage = data.links.filter((l) => l.target === m.id && (l.kind === 'filiation' || l.kind === 'influence')).slice(0, 3);
+  // « Ce que ça a ouvert » : les repères qui suivent, et ce que le domaine a transmis
+  const after = m.keyDates.filter((k) => k.year > f.year).slice(0, 2);
+  const legacy = data.links.filter((l) => l.source === m.id).slice(0, 3);
+  const linkLine = (l: (typeof data.links)[number], outgoing: boolean) => {
+    const otherId = outgoing ? l.target : l.source;
+    const other = data.domainById[otherId];
+    return (
+      <li key={`${l.source}|${l.target}|${l.kind}`} className="text-sm">
+        <span className="text-xs uppercase tracking-wider text-muted mr-1.5">{t(LINK_KIND_I18N[l.kind])}</span>
+        {other && (
+          <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: other.id })}>
+            {other.name}
+          </button>
+        )}
+        <span className="block text-soft pl-2 border-l border-ink/10 mt-0.5">{l.label}</span>
+      </li>
+    );
+  };
+  return (
+    <>
+      <div className="min-w-0">
+        <div className="flex items-center gap-2 flex-wrap mb-1.5">
+          <KindBadge kind={f.kind} />
+          <span className="text-sm text-muted">{formatYear(f.year, lang, f.yearApprox)}</span>
+        </div>
+        <h2 className="font-serif text-2xl leading-tight">{f.title}</h2>
+        {f.altTitle && <p className="font-serif italic text-muted">{f.altTitle}</p>}
+        <p className="text-sm text-muted mt-1">
+          {author ? (
+            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: author.id })}>
+              {f.authorName}
+            </button>
+          ) : (
+            f.authorName
+          )}
+        </p>
+        {theory && (
+          <p className="text-sm mt-1">
+            {t('panel.theory')}{' '}
+            <button className="text-accent hover:underline" onClick={() => nav({ kind: 'theory', id: theory.id })}>
+              {theory.name}
+            </button>
+          </p>
+        )}
+      </div>
+      {f.statement && (
+        <Section title={t('panel.statement')}>
+          <p className="text-sm leading-relaxed text-soft font-serif text-[0.95rem] border-l-2 border-accent/40 pl-3">{f.statement}</p>
+        </Section>
+      )}
+      {f.intuition && (
+        <Section title={t('panel.intuition')} testId="result-intuition">
+          <StatementList statements={f.intuition} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
+        </Section>
+      )}
+      {f.proof && (
+        <Section title={t('panel.proof')} testId="result-proof">
+          <ol className="proof-steps">
+            {f.proof.map((s, i) => (
+              <Statement key={i} statement={s} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
+            ))}
+          </ol>
+        </Section>
+      )}
+      <Section title={t('panel.place')}>
+        <p className="text-sm leading-relaxed">{f.comment}</p>
+      </Section>
+      {(f.context || before.length > 0 || heritage.length > 0) && (
+        <Section title={t('panel.resultRoots')} testId="result-context">
+          {f.context && (
+            <div className="mb-3">
+              <StatementList statements={f.context} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
+            </div>
+          )}
+          {f.context && (before.length > 0 || heritage.length > 0) && (
+            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
+          )}
+          {before.length > 0 && (
+            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
+              {before.map((k, i) => (
+                <li key={i} className="text-sm">
+                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
+                  {k.text}
+                </li>
+              ))}
+            </ol>
+          )}
+          <ul className="space-y-2">{heritage.map((l) => linkLine(l, false))}</ul>
+        </Section>
+      )}
+      {(f.impact || after.length > 0 || legacy.length > 0) && (
+        <Section title={t('panel.resultLegacy')} testId="result-impact">
+          {f.impact && (
+            <div className="mb-3">
+              <StatementList statements={f.impact} sourceOrder={narrativeOrder} factsOnly={factsOnly} />
+            </div>
+          )}
+          {f.impact && (after.length > 0 || legacy.length > 0) && (
+            <div className="text-xs uppercase tracking-wider text-muted mb-1">{t('panel.inAtlas')}</div>
+          )}
+          {after.length > 0 && (
+            <ol className="border-l border-ink/15 pl-4 space-y-1.5 mb-2">
+              {after.map((k, i) => (
+                <li key={i} className="text-sm">
+                  <span className="font-serif text-accent mr-2 whitespace-nowrap">{formatYear(k.year, lang)}</span>
+                  {k.text}
+                </li>
+              ))}
+            </ol>
+          )}
+          <ul className="space-y-2">{legacy.map((l) => linkLine(l, true))}</ul>
+        </Section>
+      )}
+      <p className="text-sm mt-2">
+        {t('panel.domain')}{' '}
+        <button className="text-accent hover:underline" onClick={() => nav({ kind: 'domain', id: m.id })}>
+          {m.name}
+        </button>
+      </p>
+      {also.length > 0 && (
+        <Section title={t('panel.seeAlso')}>
+          <ul className="space-y-1">
+            {also.map((x) => (
+              <li key={x.id} className="flex items-center gap-2">
+                <KindBadge kind={x.kind} />
+                <ResultLine r={x} nav={nav} />
+              </li>
+            ))}
+          </ul>
+        </Section>
+      )}
+      {narrativeOrder.length > 0 && (
+        <Section title={t('panel.sources')}>
+          <SourceList order={narrativeOrder} data={data} />
+        </Section>
+      )}
+    </>
+  );
+}
diff --git a/src/ui/panel/TheoryView.tsx b/src/ui/panel/TheoryView.tsx
new file mode 100644
index 0000000..cbcdd65
--- /dev/null
+++ b/src/ui/panel/TheoryView.tsx
@@ -0,0 +1,49 @@
+import type { Domain, Theory } from '../../data/types';
+import { useLang } from '../../i18n/lang';
+import { formatPeriod } from '../../lib/years';
+import { ResultLine, Section, type Nav } from './common';
+
+export function TheoryView({ s, m, nav }: { s: Theory; m: Domain; nav: Nav }) {
+  const { t, lang } = useLang();
+  const mathematicians = m.mathematicians.filter((f) => f.theoryId === s.id);
+  const results = m.results.filter((f) => f.theoryId === s.id);
+  return (
+    <>
+      <h2 className="font-serif text-2xl">{s.name}</h2>
+      {s.period && <p className="text-sm text-muted">{formatPeriod(s.period, lang)}</p>}
+      <p className="text-sm mt-2">{s.summary}</p>
+      <div className="flex flex-wrap gap-1.5 mt-3">
+        {s.traits.map((tr) => (
+          <span key={tr} className="chip">{tr}</span>
+        ))}
+      </div>
+      {mathematicians.length > 0 && (
+        <Section title={t('panel.mathematicians')}>
+          <ul className="space-y-1">
+            {mathematicians.map((f) => (
+              <li key={f.id}>
+                <button className="text-sm text-accent hover:underline" onClick={() => nav({ kind: 'mathematician', id: f.id })}>
+                  {f.name}
+                </button>
+              </li>
+            ))}
+          </ul>
+        </Section>
+      )}
+      {results.length > 0 && (
+        <Section title={t('panel.results')}>
+          <ul className="space-y-1">
+            {results.map((f) => (
+              <li key={f.id}>
+                <ResultLine r={f} nav={nav} />
+              </li>
+            ))}
+          </ul>
+        </Section>
+      )}
+      <button className="chip mt-2" onClick={() => nav({ kind: 'domain', id: m.id })}>
+        {t('panel.backTo', { name: m.name })}
+      </button>
+    </>
+  );
+}
diff --git a/src/ui/panel/common.tsx b/src/ui/panel/common.tsx
new file mode 100644
index 0000000..6e6a745
--- /dev/null
+++ b/src/ui/panel/common.tsx
@@ -0,0 +1,85 @@
+import type { ReactNode } from 'react';
+import type { Mathematician, Result, Source } from '../../data/types';
+import type { Selection } from '../../state/store';
+import { useLang } from '../../i18n/lang';
+import { useData, type AtlasData } from '../../i18n/localize';
+import { formatYear } from '../../lib/years';
+
+export type Nav = (sel: Selection | null) => void;
+
+export function Section({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
+  return (
+    <section className="mt-6 mb-5" data-testid={testId}>
+      <h3 className="section-title">{title}</h3>
+      {children}
+    </section>
+  );
+}
+
+/** Médaille d'une grande figure (panneau) : initiale blanche sur la couleur de son champ. */
+export function Medallion({ m, color, size = 40 }: { m: Pick<Mathematician, 'id'>; color: string; size?: number }) {
+  return (
+    <span
+      className="medallion-ui"
+      style={{ width: size, height: size, background: color, boxShadow: `0 0 0 2px #fffefb, 0 0 0 3px ${color}`, fontSize: size * 0.48 }}
+      aria-hidden="true"
+    >
+      {m.id[0].toUpperCase()}
+    </span>
+  );
+}
+
+export function DomainChips({ ids, color, nav }: { ids: string[]; color: string; nav: Nav }) {
+  const data = useData();
+  return (
+    <div className="flex flex-wrap gap-1.5">
+      {ids.map((id) => {
+        const d = data.domainById[id];
+        if (!d) return null;
+        return (
+          <button key={id} className="chip hover:border-accent/60 hover:text-accent transition" onClick={() => nav({ kind: 'domain', id })}>
+            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
+            {d.name}
+          </button>
+        );
+      })}
+    </div>
+  );
+}
+
+export function SourceList({ order, data }: { order: string[]; data: AtlasData }) {
+  const { t } = useLang();
+  return (
+    <ol className="list-decimal pl-5 space-y-1.5 text-sm">
+      {order.map((sid) => {
+        const s: Source | undefined = data.sourceById[sid];
+        if (!s) return <li key={sid} className="text-muted">{sid}</li>;
+        return (
+          <li key={sid}>
+            {s.author}, <em>{s.title}</em>
+            {s.year ? `, ${s.year}` : ''}
+            {s.publisher ? `, ${s.publisher}` : ''}
+            {s.note ? ` — ${s.note}` : ''}
+            {s.url ? (
+              <>
+                {' '}
+                <a href={s.url} target="_blank" rel="noreferrer" className="text-accent underline">
+                  {t('panel.sourceLink')}
+                </a>
+              </>
+            ) : null}
+          </li>
+        );
+      })}
+    </ol>
+  );
+}
+
+export function ResultLine({ r, nav }: { r: Result; nav: Nav }) {
+  const { lang } = useLang();
+  return (
+    <button className="text-sm text-left text-accent hover:underline" onClick={() => nav({ kind: 'result', id: r.id })}>
+      {r.title} <span className="text-muted">({formatYear(r.year, lang, r.yearApprox)})</span>
+    </button>
+  );
+}
diff --git a/src/ui/resolve.ts b/src/ui/resolve.ts
index c628cb9..802f4e0 100644
--- a/src/ui/resolve.ts
+++ b/src/ui/resolve.ts
@@ -59,3 +59,8 @@ export function sourceOrderFor(m: Domain): string[] {
   }
   return order;
 }
+
+/** Identifiants de sources, dans l'ordre de première citation, sans doublon (fiches figure et résultat). */
+export function sourceOrder(...lists: ({ sources?: string[] } | undefined)[][]): string[] {
+  return [...new Set(lists.flat().flatMap((s) => s?.sources ?? []))];
+}
````
