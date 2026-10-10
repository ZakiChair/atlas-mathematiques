# Atlas des mathématiques

Cartographie interactive de l’histoire des mathématiques, dessinée comme un réseau de fleuves :
chacun des cinq champs (nombres, formes, analyse, hasard et calcul, fondements) coule de gauche à
droite avec le temps, de Babylone à aujourd’hui, et s’élargit de tous les résultats recensés en
amont ; les grands domaines sont des lacs sur son cours, reliés d’un champ à l’autre par leurs
filiations, influences, affinités et ruptures. Le zoom révèle progressivement les théories,
puis les mathématiciennes et mathématiciens, puis les grands résultats ; chaque notice propose une
description accessible, ses objets et méthodes, son contexte, ses débats historiographiques et des
énoncés en langage courant, sourcés, qui distinguent faits documentés et interprétations.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres scripts : `npm run build` (production dans `dist/`), `npm run preview`, `npm run typecheck`,
`npm run lint` (oxlint), `npm test` (vitest), `npm run test:e2e` (Playwright, desktop + mobile ;
captures dans `e2e/artifacts/`), `npx tsx scripts/check-era.ts <fichier>` (validation d’un seul
fichier d’ère pendant la rédaction du corpus).

## Navigation

- **Zoom sémantique** : Domaines → Théories → Mathématiciens → Résultats (molette, pincement,
  boutons +/−, ou l’indicateur de niveau sous le titre ; au-dessus de la frise sur mobile).
- **Frise d’activité** (bas de l’écran) : l’épaisseur des cinq champs au fil du temps, en nombre
  de résultats recensés ; la fenêtre suit la portion visible de la carte, la période du domaine
  choisi y est marquée. Clic ou glisser pour se déplacer dans le temps, flèches au clavier.
- **Bassin amont** : choisir un domaine allume tout ce qui y conduit par filiation ou influence,
  de proche en proche (anneaux et courants bleu de Prusse, plus pâles à mesure qu’on remonte),
  et ce qu’il alimente directement (sépia). La fiche « En amont » liste les affluents par
  génération, la source la plus ancienne et l’aval direct.
- **Sélection** : clic sur un territoire, une théorie, une figure ou un résultat ouvre le panneau
  (desktop) ou la feuille (mobile) et vole vers l’élément. L’URL suit la sélection
  (`#/domaine/:id`, `#/theorie/:id`, `#/mathematicien/:id`, `#/resultat/:id`).
- **Recherche** (Ctrl/⌘ K) sur les noms, titres originaux, alias et noms de figures, sans accents.
- **Filtres** : période (années négatives avant notre ère), continents, types de liens, « liens
  transversaux seulement » (entre deux ères), « n’afficher que les faits ».
- **Liens** : discrets par défaut, allumés au survol ou à la sélection d’un domaine ; clic sur un
  lien pour son explication et ses sources.
- **Réseau des mathématicien·nes** : la fiche d’une figure liste ses liens (filiation, influence,
  collaboration, affinité, rupture) ; quand une figure est sélectionnée, des arcs la relient sur la
  carte aux figures liées, quel que soit leur territoire.
- **Natures des résultats** : théorème, conjecture, concept, méthode, texte, problème, signalées
  par un badge coloré (légende).
- **Visions** (bouton « Visions » dans l’en-tête) : quatre lectures de la carte —
  *fleuves* (vue par défaut), *filiations & ruptures* (les fleuves s’effacent, seuls les liens
  de filiation et de rupture restent, encre de Prusse et sanguine), *réseaux de figures* (la
  toile des liens entre mathématicien·nes en filigrane), *natures de résultats* (chaque lac
  prend l’encre de la nature dominante de ses résultats ; filtrable par nature).
- **Fiches résultats** : « Ce qui y a conduit » et « Ce que ça a ouvert ». Pour 174 grands
  résultats, un récit rédigé et sourcé (faits et interprétations typés) ouvre chacune des deux
  sections ; viennent ensuite, pour tous, les repères du domaine et les liens entrants ou
  sortants (« Dans l’atlas »).

La direction artistique, « Fleuves et confluences », est celle d’une carte ancienne à l’encre
et à l’aquarelle sur papier crème : un lavis par champ (ocre, céruléen, violet, terre cuite,
vert sauge), lacs au bord irrégulier avec ligne d’eau et rive à l’encre, berges et filets de
courant, une « mer » du présent où se jettent les fleuves (le total de résultats de chaque champ
est inscrit à l’embouchure), liens à l’encre (bleu de Prusse pour les filiations, sanguine pour
les ruptures) ; titres en Cormorant Garamond, texte en DM Sans.

## Corpus

58 domaines (antiquité 6, monde médiéval 6, renaissance et révolution scientifique 8, siècle des
lumières 6, xixᵉ siècle 9, âge des structures 11, contemporain 12), 176 théories, 428 figures,
647 résultats commentés (224 texte, 223 théorème, 105 concept, 55 méthode, 24 problème,
16 conjecture), 486 repères chronologiques, 182 liens entre domaines, 148 liens entre figures,
223 sources (livres, articles, textes primaires, archives web). 174 résultats portent un récit
« contexte / portée » (593 énoncés : 400 faits, 193 interprétations).

Les données vivent dans `src/data/` :

- `domains/*.ts` — dix fichiers d’ère (`antiquite`, `medieval`, `renaissance`, `lumieres`,
  `dixneuvieme-a/b`, `structures-a/b`, `contemporain-a/b`), chacun exportant ses domaines, ses
  sources spécialisées, ses liens entre domaines et ses liens entre figures (schéma dans `types.ts`) ;
- `sources.ts` — la bibliographie socle (`CORE_SOURCES`) et l’agrégation des sources d’ère ; tout
  identifiant de source cité doit y exister ;
- `links.ts`, `mathematicianLinks.ts` — agrégation des liens ;
- `eras.ts` — ères, continents, bandes et dimensions de l’espace carte ;
- `validate.ts` — cohérence du corpus (identifiants, références croisées, périodes, sources,
  statut épistémique), exécutée par `src/data/__tests__/validate.test.ts`.

Le brief éditorial `docs/corpus/BRIEF.md` fixe la charte, la table des domaines (identifiants,
positions, palettes, figures canoniques, résultats obligatoires), la bibliographie socle et un
exemple complet. Toute modification des données doit s’y conformer.

### Faits et interprétations

Chaque énoncé (`Statement`) porte `kind: 'fait' | 'interpretation'` et ses sources. Un **fait**
est datable et documenté (publication, démonstration, correspondance, contenu vérifiable d’un
théorème) ; une **interprétation** est une lecture historiographique, attribuée à ses auteurs quand
c’est possible. Les liens entre domaines portent le même statut (`epistemic`) ; une affinité est
toujours interprétative. Les positions sur la carte, les bandes d’ères et de continents sont des
repères indicatifs, pas des mesures.

## Architecture

React 19 + Vite + TypeScript, D3 (zoom, courbes), Tailwind v4, Playwright, Vitest.

- `src/map/layout.ts` — placement déterministe : rayon selon la taille du domaine et son nombre de
  résultats, relaxation des chevauchements, formes organiques, placement des théories, figures et
  résultats, séparation des libellés.
- `src/map/MapCanvas.tsx` — zoom d3, niveaux sémantiques, contrôleur (fly-to, niveaux,
  recentrage), variable CSS `--k` pour les tailles constantes à l’écran.
- `src/map/timeScale.ts` — correspondance année ↔ abscisse carte (bandes d’ères à largeur
  proportionnelle au corpus).
- `src/map/rivers.ts`, `RiverLayer.tsx` — géométrie des fleuves (ligne médiane monotone par les
  lacs du champ, largeur cumulée des résultats, berges irrégulières déterministes) et rendu.
- `src/map/upstream.ts` — bassin amont d’un domaine (parcours en largeur des filiations et
  influences, générations, aval direct) ; `activity.ts`, `ActivityFrieze.tsx` — frise d’activité.
- `src/map/fieldColors.ts` — teintes des champs, source unique (fleuves, marges, frise, légende).
- `src/map/LinkLayer.tsx`, `links.ts` — géométrie et rendu des liens entre domaines ;
  `MathematicianLinkLayer.tsx` — arcs entre figures.
- `src/map/labels.ts` — noms inscrits dans les lacs (`mapName`, sinon la partie avant « : ») ;
  `EdgeLabels.tsx`, `edgeLabelsLayout.ts` — noms des champs dans la marge gauche, en espace
  écran, avec anti-collision.
- `src/lib/years.ts` — formatage des années (avant notre ère, « ca. », « aujourd’hui »).
- `src/ui/` — barre supérieure, recherche, filtres, légende, méthode, panneau/feuille, popover.
- `src/state/store.tsx` — sélection, filtres, état d’interface.
- `src/i18n/` — interface FR/EN (le corpus reste en français).

Spécification de design : `docs/superpowers/specs/2026-10-10-atlas-mathematiques-design.md`.
