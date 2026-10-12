# Atlas des mathématiques

Cartographie interactive de l’histoire des mathématiques, présentée comme une planche murale
claire : cinq bandes de champs très pâles (nombres, formes, analyse, hasard et calcul,
fondements) déroulent le temps de gauche à droite, de Babylone à aujourd’hui ; les domaines
sont des disques pâles posés sur leur bande et leur époque. Dès la vue d’ensemble, une
quarantaine de grandes figures sont visibles en médailles à leur initiale, avec leur nom et
leur résultat phare ; les seuls liens tracés par défaut sont les lignées principales (un
ascendant par domaine) et les ruptures. Le zoom révèle progressivement les théories, puis les
figures, puis les résultats ; chaque fiche distingue faits documentés et interprétations,
sourcés.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres scripts : `npm run build` (production dans `dist/`), `npm run preview`, `npm run typecheck`,
`npm run lint` (oxlint), `npm test` (vitest), `npm run test:e2e` (Playwright, desktop + mobile ;
captures dans `e2e/artifacts/`), `npx tsx scripts/check-era.ts <fichier>` (validation d’un seul
fichier d’ère pendant la rédaction du corpus), `npx tsx scripts/corpus-stats.ts` (statistiques
du corpus pour ce README), `npx tsx scripts/palettes.ts` (régénération des palettes « Galerie »,
données et brief).

## Navigation

- **Zoom sémantique** : Domaines → Théories → Mathématiciens → Résultats (molette, pincement,
  boutons +/−, ou l’indicateur de niveau sous le titre ; au-dessus de la frise sur mobile).
  Le niveau 0 montre déjà les grandes figures ; au niveau 1, leur résultat phare s’ajoute sous
  leur nom ; le niveau 2 révèle les points des figures ordinaires et les noms des figures à
  résultats ; le niveau 3, les résultats et les noms des fiches courtes.
- **Frise d’activité** (bas de l’écran) : l’épaisseur des cinq champs au fil du temps, en nombre
  de résultats recensés ; la fenêtre suit la portion visible de la carte, la période du domaine
  choisi y est marquée. Clic ou glisser pour se déplacer dans le temps, flèches au clavier.
- **Amont et aval** : choisir un domaine colore son amont en bleu de Prusse et son aval en
  sépia, génération par génération, plus pâles à mesure qu’on s’éloigne. La fiche du domaine
  liste « Amont et aval ».
- **Grandes figures** : une médaille cliquable ouvre la fiche de la figure — signature,
  « Apports », « Résultats phares », biographie, lien « Biographie détaillée sur MacTutor »
  quand il existe. En vue d’ensemble, une médaille dont le nom ne tient pas garde son
  infobulle.
- **Sélection** : clic sur un disque, une théorie, une figure ou un résultat ouvre le panneau
  (desktop) ou la feuille (mobile) et vole vers l’élément. L’URL suit la sélection
  (`#/domaine/:id`, `#/theorie/:id`, `#/mathematicien/:id`, `#/resultat/:id`).
- **Recherche** (Ctrl/⌘ K) sur les noms, titres originaux, alias et noms de figures, sans accents.
- **Filtres** : période (années négatives avant notre ère), champs, « Liens entre domaines »
  (lignées principales / tous les liens), « n’afficher que les faits ».
- **Liens** : deux styles seulement — la transmission (trait d’encre à pointe) et la rupture
  (sanguine barrée). Par défaut, seules les lignées principales et les ruptures sont tracées ;
  survoler ou choisir un domaine montre tous ses liens. Les affinités ne sont jamais tracées :
  elles sont dans le panneau, avec leur statut fait / interprétation.
- **Réseau des mathématicien·nes** : la fiche d’une figure liste ses liens ; quand une figure
  est sélectionnée, des arcs la relient sur la carte aux figures liées.
- **Natures des résultats** : théorème, conjecture, concept, méthode, texte, problème, signalées
  par un badge coloré (légende).
- **Fiches résultats** : « D’où vient l’idée » (1 à 2 énoncés) et « Idée de la démonstration »
  (3 à 6 étapes en langage courant), rédigés pour l’instant sur 3 résultats modèles, en cours
  pour les théorèmes, conjectures et problèmes (vague 3) ; puis « Ce qui y a conduit » et
  « Ce que ça a ouvert » : pour 174 grands résultats, un récit rédigé et sourcé (faits et
  interprétations typés) ouvre chacune des deux sections ; viennent ensuite, pour tous, les
  repères du domaine et les liens entrants ou sortants (« Dans l’atlas »).

La direction artistique, « Galerie », est celle d’une planche murale claire : fond blanc cassé
`#fbfaf7`, bandes `hsl(h 45% 96%)` par champ, disques sans contour aux palettes régénérées
(`fill` disque, `stroke` encre du nom, `accent` médaille), médailles à initiale blanche, noms
désencombrés en espace écran à chaque zoom (aucun chevauchement), transmission `#45413a` à
pointe pleine, rupture `#b5412a` barrée, amont `#1d5f96`, aval `#9a5b16` ; titres et noms en
Fraunces, texte et étiquettes en DM Sans.

## Corpus

58 domaines (antiquité 6, monde médiéval 6, renaissance et révolution scientifique 8, siècle des
lumières 6, xixᵉ siècle 9, âge des structures 11, contemporain 12), 176 théories, 1 175 figures,
647 résultats commentés (224 texte, 223 théorème, 105 concept, 55 méthode, 24 problème,
16 conjecture), 486 repères chronologiques, 182 liens entre domaines, 148 liens entre figures,
223 sources (livres, articles, textes primaires, archives web). 174 résultats portent un récit
« contexte / portée » (593 énoncés : 400 faits, 193 interprétations). 43 grandes figures portent
une signature typée et sourcée, 2 à 4 apports et 1 à 3 résultats phares ; les théorèmes sont
tous dotés de « D’où vient l’idée » et « Idée de la démonstration », et les conjectures et
problèmes de « D’où vient l’idée » ; 1 127 figures renvoient à leur biographie MacTutor.

Les données vivent dans `src/data/` :

- `domains/*.ts` — dix fichiers d’ère (`antiquite`, `medieval`, `renaissance`, `lumieres`,
  `dixneuvieme-a/b`, `structures-a/b`, `contemporain-a/b`), chacun exportant ses domaines, ses
  sources spécialisées, ses liens entre domaines et ses liens entre figures (schéma dans `types.ts`) ;
- `sources-core.ts` — la bibliographie socle (`CORE_SOURCES`) : histoires générales, recueils
  de textes et grandes monographies ;
- `sources.ts` — le registre des sources : ré-exporte le socle et agrège les sources
  spécialisées de chaque fichier d’ère ; tout identifiant de source cité doit y exister ;
- `links.ts`, `mathematicianLinks.ts` — agrégation des liens ;
- `eras.ts` — ères, continents, bandes et dimensions de l’espace carte ;
- `validate.ts` — cohérence du corpus (identifiants, références croisées, périodes, sources,
  statut épistémique ; grandes figures : signature ≤ 90 caractères, 0 ou 2 à 4 apports, 1 à 3
  résultats phares attribués à la figure ; intuition 1 à 2, démonstration 3 à 6 réservée aux
  théorèmes, conjectures et problèmes ; au plus un lien `principal` par domaine d’arrivée ;
  slug MacTutor), exécutée par `src/data/__tests__/validate.test.ts` ;
- `completeness.ts` — seuils de complétude `COMPLETENESS`, relevés à la fin de chaque vague,
  testés par `completeness.test.ts`.

Le brief éditorial `docs/corpus/BRIEF.md` fixe la charte, la table des domaines (identifiants,
positions, palettes, figures canoniques, résultats obligatoires), les grandes figures, les
intuitions et démonstrations, les fiches courtes, la bibliographie socle et un exemple complet.
Toute modification des données doit s’y conformer.

### Faits et interprétations

Chaque énoncé (`Statement`) porte `kind: 'fait' | 'interpretation'` et ses sources. Un **fait**
est datable et documenté (publication, démonstration, correspondance, contenu vérifiable d’un
théorème) ; une **interprétation** est une lecture historiographique, attribuée à ses auteurs quand
c’est possible. Les liens entre domaines portent le même statut (`epistemic`) ; une affinité est
toujours interprétative. Les positions sur la carte, les bandes d’ères et de continents sont des
repères indicatifs, pas des mesures.

## Architecture

React 19 + Vite + TypeScript, D3 (zoom, courbes), Tailwind v4, Playwright, Vitest.

- `src/map/layout.ts` — placement déterministe : disques, rayon selon la taille du domaine, ses
  résultats et son nombre de figures, relaxation des chevauchements, `featuredSlots` pour les
  grandes figures, grille fine en quinconce `FIGURE_CELL` pour les figures ordinaires, éventails
  de résultats.
- `src/map/declutter.ts`, `LabelLayer.tsx` — médailles et noms de tous les points, désencombrés
  en espace écran par priorité (élément choisi, grandes figures, figures à résultats, résultats,
  fiches courtes) ; noms de domaines et de théories en obstacles.
- `src/map/labelMetrics.ts` — taille et place du nom d’un domaine.
- `src/map/lineage.ts` — ascendants principaux : `principal` choisi à la main, sinon filiation
  avant influence, fait avant interprétation, même champ, source la plus récente.
- `src/map/GalleryBackdrop.tsx` — bandes des champs, frontières d’ères, années en filigrane.
- `src/map/fieldColors.ts`, `resultKinds.ts` — teintes des champs, encres des liens, couleurs
  des natures.
- `src/map/LinkLayer.tsx`, `links.ts` — géométrie et rendu des liens entre domaines ;
  `MathematicianLinkLayer.tsx` — arcs entre figures.
- `src/map/upstream.ts` — amont et aval d’un domaine ; `activity.ts`, `ActivityFrieze.tsx` —
  frise d’activité.
- `src/map/MapCanvas.tsx` — zoom d3, niveaux sémantiques, contrôleur (fly-to, niveaux,
  recentrage), variable CSS `--k` ; `timeScale.ts` — correspondance année ↔ abscisse carte.
- `src/map/labels.ts` — noms inscrits dans les disques ; `EdgeLabels.tsx`,
  `edgeLabelsLayout.ts` — noms des champs dans la marge gauche, en espace écran, avec
  anti-collision.
- `src/lib/years.ts` — formatage des années ; `src/lib/mactutor.ts` — lecture des années d’une
  biographie MacTutor et comparaison, pour le script de contrôle de la vague 4.
- `src/ui/` — barre supérieure, recherche, filtres, légende, méthode, popover ; `src/ui/panel/`
  — fiches (`DomainView`, `TheoryView`, `MathematicianView`, `ResultView`, `BasinSection`,
  `common`) et `Panel.tsx` (coquille).
- `src/state/store.tsx` — sélection, filtres, état d’interface.
- `src/i18n/` — interface FR/EN (le corpus reste en français).

Spécification de design : `docs/superpowers/specs/2026-10-10-atlas-mathematiques-design.md`.
Plan de la refonte « Galerie » (vagues 2 à 4 à venir) :
`docs/superpowers/plans/2026-10-12-refonte-galerie.md`.
