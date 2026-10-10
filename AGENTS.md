# Atlas des mathématiques — consignes pour les agents

## Projet

Atlas interactif de l’histoire des mathématiques (React 19 + Vite + TypeScript,
D3, Tailwind v4, Vitest, Playwright). Moteur dérivé d’`atlas-cinema` ; données
dans `src/data/`. Langue du code, des commentaires et du corpus : français.

## Commandes

- `npm run dev` — serveur de développement.
- `npm run typecheck` — `tsc --noEmit` (doit rester à 0 erreur).
- `npm run lint` — oxlint.
- `npm test` — vitest : validation du corpus (`validate.test.ts`), recherche, layout.
- `npm run build` — production dans `dist/`.
- `npm run test:e2e` — Playwright desktop + mobile (`e2e/atlas.spec.ts`, captures dans `e2e/artifacts/`).
- `npx tsx scripts/check-era.ts <fichier>` — erreurs de validation limitées à un fichier d’ère.

## Corpus : règles non négociables

- Lire `docs/corpus/BRIEF.md` avant toute modification de données : il fixe les
  identifiants, positions, palettes, figures canoniques et résultats obligatoires.
- Schéma dans `src/data/types.ts`, règles dans `src/data/validate.ts`.
- Chaque `Statement` est typé `fait` ou `interpretation` et cite des sources
  existant dans `src/data/sources.ts` ou dans le `SOURCES_X` du fichier d’ère.
- **Jamais de source, de date ou de citation inventée.** En cas de doute :
  `approx`, « vers », ou omission.
- Une figure est définie dans un seul domaine ; ailleurs, passer par
  `relatedMathematicianIds`. Les identifiants sont globalement uniques par type.
- Années : entiers, négatives avant notre ère, jamais 0.
- Typographie : apostrophe ’, guillemets « », espace avant « : » et « ; ».

## Fichiers générés ou à ne pas éditer à la main

- `e2e/artifacts/` — captures Playwright.
- `dist/` — build.

## Après chaque changement de données

`npm test` puis `npm run typecheck`. Un changement d’identifiant doit être
répercuté dans les liens (`LINKS_X`, `MATHEMATICIAN_LINKS_X`), dans
`relatedMathematicianIds` des autres domaines et dans le brief.
