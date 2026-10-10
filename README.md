# Atlas des mathématiques

Cartographie interactive de l’histoire des mathématiques : les grands domaines sont des
territoires disposés par ère (axe horizontal, de Babylone à aujourd’hui) et par continent
mathématique (axe vertical : nombres, formes, analyse, hasard et calcul, fondements), reliés par
leurs filiations, influences, affinités et ruptures. Le zoom révèle progressivement les théories,
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
  boutons +/−, ou l’indicateur de niveau en bas à gauche).
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

## Corpus

58 domaines (antiquité 6, monde médiéval 6, renaissance et révolution scientifique 8, siècle des
lumières 6, xixᵉ siècle 9, âge des structures 11, contemporain 12), 176 théories, 428 figures,
647 résultats commentés (224 texte, 223 théorème, 105 concept, 55 méthode, 24 problème,
16 conjecture), 486 repères chronologiques, 182 liens entre domaines, 148 liens entre figures,
223 sources (livres, articles, textes primaires, archives web).

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
- `src/map/LinkLayer.tsx`, `links.ts` — géométrie et rendu des liens entre domaines ;
  `MathematicianLinkLayer.tsx` — arcs entre figures.
- `src/map/EdgeLabels.tsx`, `edgeLabelsLayout.ts` — libellés de continents et d’ères dans les
  marges, en espace écran, avec anti-collision.
- `src/lib/years.ts` — formatage des années (avant notre ère, « ca. », « aujourd’hui »).
- `src/ui/` — barre supérieure, recherche, filtres, légende, méthode, panneau/feuille, popover.
- `src/state/store.tsx` — sélection, filtres, état d’interface.
- `src/i18n/` — interface FR/EN (le corpus reste en français).

Spécification de design : `docs/superpowers/specs/2026-10-10-atlas-mathematiques-design.md`.
