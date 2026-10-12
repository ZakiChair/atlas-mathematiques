# Atlas des mathématiques — brief éditorial du corpus

Ce document fixe la charte du corpus : schéma, règles de validation, table des
domaines (identifiants, positions, palettes), mathématicien·nes canoniques,
grandes figures (§ 9), intuitions et démonstrations (§ 10), fiches courtes
(§ 11), bibliographie socle et contrat de sortie des fichiers de données.
**Toute donnée écrite dans `src/data/domains/*.ts` doit s'y conformer.**

Schéma de référence : `src/data/types.ts`. Validation : `src/data/validate.ts`
(exécutée par `npm test`). Les seuils de complétude sont portés par
`src/data/completeness.ts`. Lire les trois avant d'écrire.

---

## 1. Esprit et ton

- **Français de référence**, registre érudit mais accessible (lecteur curieux,
  pas spécialiste). Pas de formalisme lourd : les énoncés sont donnés « en
  langage courant » avec au plus quelques symboles Unicode (x², xⁿ, √2, π, ∞, ≤).
- **Honnêteté épistémique** : chaque `Statement` est typé `fait` ou
  `interpretation`. Un fait est datable et documenté (publication, lettre,
  démonstration, contenu vérifiable d'un théorème). Une interprétation est une
  lecture historiographique, une attribution d'influence, un jugement de
  portée (« révolution », « crise », « précurseur de… »), signée si possible
  par une tradition ou un auteur (« pour André Weil, … »).
- **Sources réelles uniquement.** Ne jamais inventer un ouvrage, un article,
  une date, une citation. En cas de doute sur une date : `approx: true` /
  `yearApprox: true` / `yearsApprox: true`, et le dire dans le texte (« vers »,
  « conventionnellement »). Préférer l'omission à l'invention.
- **Typographie** : apostrophe typographique ’ ; guillemets « … » avec espaces
  ; tiret cadratin — ; espace simple avant « : » et « ; » (convention du
  corpus existant) ; siècles en « XIXᵉ siècle » ; « av. J.-C. » n'est jamais
  écrit dans les nombres (les années négatives s'affichent automatiquement).
- **Années** : entiers ; négatifs avant notre ère (−300 = 300 av. J.-C.) ;
  l'année 0 n'existe pas. Vivant·e : `years: [1953, null]`.
- **Écriture inclusive légère** dans les textes génériques (« mathématicien·nes »)
  mais jamais dans les noms propres ni les titres d'ouvrages.

## 2. Règles de validation (résumé de `validate.ts`)

Par domaine :
- `id` slug (`^[a-z0-9]+(-[a-z0-9]+)*$`), `era` ∈ ERAS, `continents` non vide,
  `places` non vide, `tagline` et `summary` non vides.
- `map.x` ∈ [0, 7400], `map.y` ∈ [0, 4500], couleurs hex `#rrggbb`.
- **≥ 2 théories, ≥ 3 mathématicien·nes, ≥ 4 résultats, ≥ 3 repères
  (`keyDates`), ≥ 2 sources** (objectifs réels : 3 théories, 4–7 figures, 6–9
  résultats, 5–8 repères, 4–6 sources).
- Dans `methods ∪ context ∪ debates` : **au moins un `fait` et au moins une
  `interpretation`** ; chaque `sources` cité doit exister dans le registre.
- `theoryId` des figures et des résultats : une théorie **du même domaine**.
- `mathematicianId` d'un résultat : une figure du domaine, **ou** une figure
  d'un autre domaine listée dans `relatedMathematicianIds`.
- Année d'un résultat dans `[start − slack, end + slack]` où `slack = 150` si
  la période du domaine dépasse 500 ans, sinon `slack = 15` (`end` null → 2030).
- Identifiants **globalement uniques** par type (théorie, mathématicien·ne,
  résultat). Préfixer les théories par le préfixe du domaine (table § 5).
- Liens : `source`/`target` sont des ids de domaines ; une `affinite` est
  toujours `epistemic: 'interpretation'` ; pas de doublon (source|target|kind).
- Liens entre mathématicien·nes : ids de figures existant globalement.

Grandes figures (`featured`, charte au § 9) :
- `signature` : 90 caractères au plus, typée et sourcée.
- `contributions` : 0 (tant que la vague 2 n'est pas passée) ou 2 à 4 apports.
- `headlineResultIds` : 1 à 3 résultats existants et attribués à la figure
  (`mathematicianId`), éventuellement dans un autre domaine.
- `sources` d'une figure : identifiants du registre ; `mactutor` au format
  `^[A-Za-z0-9_'()-]+$`.

Intuitions et démonstrations (charte au § 10) :
- `intuition` : 1 à 2 énoncés ; jamais sur un résultat de nature `texte`.
- `proof` : 3 à 6 étapes ; réservé aux natures `theoreme`, `conjecture`,
  `probleme`.

Liens `principal` : au plus un ascendant principal par domaine d'arrivée, et
seulement sur une filiation ou une influence.

## 3. Contrat de sortie d'un fichier d'ère

Chaque fichier `src/data/domains/<fichier>.ts` exporte exactement quatre
constantes (X = suffixe du fichier en majuscules, tiret → underscore) :

```ts
import type { Domain, Link, MathematicianLink, Source } from '../types';

/** Sources propres à ce fichier (le socle est dans ../sources.ts : ne pas le redéclarer). */
export const SOURCES_X: Source[] = [ /* … */ ];

export const X: Domain[] = [ /* domaines dans l'ordre de la table */ ];

/** Liens dont la cible est un domaine de ce fichier (source : ce fichier ou une ère antérieure). */
export const LINKS_X: Link[] = [ /* … */ ];

/** Liens entre figures dont la cible est définie dans ce fichier. */
export const MATHEMATICIAN_LINKS_X: MathematicianLink[] = [ /* … */ ];
```

Fichiers et suffixes : `antiquite` → `ANTIQUITE`, `medieval` → `MEDIEVAL`,
`renaissance` → `RENAISSANCE`, `lumieres` → `LUMIERES`, `dixneuvieme-a` →
`DIXNEUVIEME_A`, `dixneuvieme-b` → `DIXNEUVIEME_B`, `structures-a` →
`STRUCTURES_A`, `structures-b` → `STRUCTURES_B`, `contemporain-a` →
`CONTEMPORAIN_A`, `contemporain-b` → `CONTEMPORAIN_B`.

Quantités par fichier : 2–4 liens entre domaines **par domaine cible** (mélange
de filiation / influence / affinité / rupture, au moins un lien transversal
vers une ère antérieure quand c'est pertinent) ; 1–3 liens entre figures par
domaine (filiation maître/élève, collaboration, correspondance, querelle).

## 4. Références croisées

- **Une figure est définie dans un seul domaine** (son « domaine d'attache »,
  fixé par la table § 5). Pour la faire intervenir ailleurs : l'ajouter à
  `relatedMathematicianIds` du domaine d'accueil et utiliser son id dans
  `mathematicianId` des résultats concernés. Exemple : `euler` est défini dans
  `analyse-eulerienne` ; `theorie-des-nombres-lumieres` le liste dans
  `relatedMathematicianIds` et attribue `produit-eulerien` à `mathematicianId: 'euler'`.
- Les ids de figures de la table sont **imposés** (orthographe exacte). Pour
  une figure absente de la table : id = nom de famille translittéré en slug
  (`sylow`, `roch`, `brouncker`) ; en cas d'homonymie, ajouter le prénom
  (`bernoulli-nicolas`, `pearson-egon`). Vérifier dans la table qu'il n'existe
  pas déjà ailleurs.
- Les ids de résultats « obligatoires » de la table sont **imposés et réservés**
  au domaine indiqué : ne pas recréer ailleurs un résultat déjà attribué à un
  autre domaine (le mentionner dans un texte suffit).
- Sources : citer d'abord le socle (§ 6). Ajouter dans `SOURCES_X` des sources
  spécialisées réelles (monographies, éditions de textes, articles classiques)
  avec un id `auteur-mot-cle` (`mahoney-fermat`, `heath-archimedes`). Ne jamais
  redéclarer une source du socle.

## 5. Table des domaines

Format : **`id`** — Nom · ère · période · continents · lieux · `map` ·
préfixe théories · figures canoniques (id : nom, [naissance, décès], lieu)
· résultats obligatoires (id : titre, année, nature) · figures d'autres
domaines à mobiliser via `relatedMathematicianIds` · liens suggérés
(domaine source → nature). Les suggestions ne sont pas limitatives.

Palettes (DA « Galerie », planche claire) : `fill` disque pâle du domaine,
`stroke` encre du nom du domaine et de ses théories, `accent` médaille des
grandes figures et anneau de sélection. Chaque champ a sa teinte de base
(`FIELD_HUE` dans `src/map/fieldColors.ts`), déclinée à ±5° de teinte et ±1
point de luminosité par domaine (hachage de l'id). Les palettes sont générées
par `scripts/palettes.ts` (données ET ce brief) : ne pas les éditer à la main.

Nom de carte : le disque affiche la partie du `name` avant « : ». Quand le nom est
une énumération longue sans « : » (« Combinatoire, graphes et méthode
probabiliste »), renseigner `mapName`, nom court fidèle au domaine (« Combinatoire
et graphes ») : 40 caractères au plus, et au plus 3 lignes de 15 capitales une
fois coupé aux espaces (vérifié par `src/map/__tests__/labels.test.ts`).

### Fichier `antiquite.ts` — ère `antiquite` (−1800 → 500)

**`calcul-des-scribes`** — Calcul des scribes : Égypte et Mésopotamie · antiquite · { start: −1800, end: −300, approx: true } · ['nombres', 'hasard'] · ['Babylone', 'Nippur', 'Thèbes', 'Suse'] · map { x: 300, y: 420, size: 2, palette: { fill: '#f0e7d1', stroke: '#6f5b2a', accent: '#8e7229' } } · préfixe `cs-` · figures : `ahmes` (Ahmès, [−1600, −1530] approx, Thèbes), `nabu-rimannu` (Nabû-rīmannu, [−540, −470] approx, Babylone), `kidinnu` (Kidinnu, [−420, −340] approx, Babylone) · résultats : `papyrus-rhind` (Papyrus Rhind, −1550 approx, texte), `plimpton-322` (Tablette Plimpton 322, −1800 approx, texte), `ybc-7289` (Tablette YBC 7289 : √2 sexagésimal, −1700 approx, texte), `resolution-des-equations-du-second-degre-babyloniennes` (Procédures du second degré, −1700 approx, methode), `numeration-de-position-sexagesimale` (Numération de position sexagésimale, −1950 approx, concept ; attestée dès la fin du IIIᵉ millénaire, bornée à −1950 par la fenêtre de validation), `systeme-b-lunaire` (Système B des éphémérides lunaires, −300 approx, methode) · liens : aucun (domaine source).

**`arithmetique-grecque`** — Arithmétique grecque : des pythagoriciens à Diophante · antiquite · { start: −530, end: 400, approx: true } · ['nombres'] · ['Crotone', 'Tarente', 'Alexandrie'] · map { x: 760, y: 560, size: 2, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } } · préfixe `ag-` · figures : `archytas` (Archytas de Tarente, [−428, −347] approx, Tarente), `eratosthene` (Ératosthène, [−276, −194] approx, Cyrène et Alexandrie), `nicomaque` (Nicomaque de Gérase, [60, 120] approx, Gérase), `diophante` (Diophante d’Alexandrie, [200, 284] approx, Alexandrie), `hypatie` (Hypatie, [355, 415] approx, Alexandrie) · résultats : `infinite-des-nombres-premiers` (Infinité des nombres premiers, Éléments IX.20, −300 approx, theoreme, mathematicianId `euclide` via related), `nombres-parfaits-euclide` (Nombres parfaits pairs, Éléments IX.36, −300 approx, theoreme, `euclide`), `crible-d-eratosthene` (Crible d’Ératosthène, −240 approx, methode), `introduction-arithmetique-nicomaque` (Introduction arithmétique, 100 approx, texte), `arithmetica-diophante` (Arithmétiques, 250 approx, texte), `nombres-figures-pythagoriciens` (Nombres figurés, −500 approx, concept) · related : `euclide`, `pythagore` · liens : `calcul-des-scribes` → influence (interprétation : héritage babylonien discuté), `geometrie-grecque` → filiation.

**`geometrie-grecque`** — Géométrie grecque classique : de Thalès aux Éléments · antiquite · { start: −600, end: −250, approx: true } · ['formes', 'fondements'] · ['Milet', 'Crotone', 'Athènes', 'Cnide', 'Alexandrie'] · map { x: 450, y: 1250, size: 3, palette: { fill: '#cdddee', stroke: '#29496b', accent: '#28588a' } } · préfixe `gg-` · figures : `thales` (Thalès de Milet, [−625, −547] approx, Milet), `pythagore` (Pythagore, [−570, −495] approx, Samos et Crotone), `hippocrate-de-chios` (Hippocrate de Chios, [−470, −410] approx, Athènes), `theetete` (Théétète, [−417, −369] approx, Athènes), `eudoxe` (Eudoxe de Cnide, [−408, −355] approx, Cnide), `euclide` (Euclide, [−325, −265] approx, Alexandrie) · résultats : `elements-euclide` (Éléments, −300 approx, texte), `theoreme-de-pythagore` (Théorème de Pythagore, −530 approx, theoreme), `incommensurabilite-de-la-diagonale` (Incommensurabilité de la diagonale et du côté, −430 approx, theoreme), `methode-d-exhaustion` (Méthode d’exhaustion, −370 approx, methode, `eudoxe`), `theorie-des-proportions-eudoxe` (Théorie des proportions, Éléments V, −360 approx, concept, `eudoxe`), `cinquieme-postulat` (Cinquième postulat, −300 approx, probleme), `trois-problemes-classiques` (Duplication du cube, trisection de l’angle, quadrature du cercle, −450 approx, probleme), `lunules-d-hippocrate` (Quadrature des lunules, −440 approx, theoreme) · liens : `calcul-des-scribes` → influence (fait : transmission attestée de résultats, débattue dans sa forme).

**`mathematiques-hellenistiques`** — Mathématiques hellénistiques : Archimède, Apollonius, Ptolémée · antiquite · { start: −300, end: 350, approx: true } · ['analyse', 'formes'] · ['Alexandrie', 'Syracuse', 'Pergé', 'Rhodes'] · map { x: 560, y: 2250, size: 3, palette: { fill: '#dbcdee', stroke: '#44296b', accent: '#51288a' } } · préfixe `mh-` · figures : `archimede` (Archimède, [−287, −212], Syracuse), `apollonius` (Apollonius de Pergé, [−262, −190] approx, Pergé et Alexandrie), `hipparque` (Hipparque, [−190, −120] approx, Nicée et Rhodes), `heron` (Héron d’Alexandrie, [10, 70] approx, Alexandrie), `ptolemee` (Claude Ptolémée, [100, 170] approx, Alexandrie), `pappus` (Pappus d’Alexandrie, [290, 350] approx, Alexandrie) · résultats : `mesure-du-cercle` (De la mesure du cercle : 3 + 10/71 < π < 3 + 1/7, −250 approx, theoreme), `la-methode-archimede` (La Méthode relative aux théorèmes mécaniques, −250 approx, texte), `quadrature-de-la-parabole` (Quadrature de la parabole, −250 approx, theoreme), `de-la-sphere-et-du-cylindre` (De la sphère et du cylindre, −225 approx, theoreme), `coniques-apollonius` (Coniques, −200 approx, texte), `table-des-cordes-hipparque` (Table des cordes, −150 approx, methode), `formule-de-heron` (Formule de Héron, 60 approx, theoreme), `almageste` (Almageste, 150 approx, texte), `collection-mathematique-pappus` (Collection mathématique, 320 approx, texte) · liens : `geometrie-grecque` → filiation, `calcul-des-scribes` → influence (astronomie babylonienne → Hipparque, fait).

**`mathematiques-chinoises-anciennes`** — Mathématiques chinoises anciennes : des Neuf chapitres à Zu Chongzhi · antiquite · { start: −200, end: 500, approx: true } · ['hasard', 'nombres'] · ['Chang’an', 'Luoyang', 'Jiankang'] · map { x: 520, y: 3200, size: 2, palette: { fill: '#edd2c9', stroke: '#683627', accent: '#863d27' } } · préfixe `mca-` · figures : `zhang-cang` (Zhang Cang, [−253, −152] approx, Chang’an), `liu-hui` (Liu Hui, [225, 295] approx, royaume de Wei), `sunzi` (Sunzi, [380, 450] approx, Chine), `zu-chongzhi` (Zu Chongzhi, [429, 500], Jiankang) · résultats : `neuf-chapitres` (Les Neuf Chapitres sur l’art mathématique, −100 approx, texte), `zhoubi-suanjing` (Zhoubi suanjing, −100 approx, texte), `methode-fangcheng` (Méthode fangcheng : élimination sur tableau de baguettes, −100 approx, methode), `commentaire-de-liu-hui` (Commentaire des Neuf Chapitres, 263, texte), `algorithme-du-cercle-de-liu-hui` (Algorithme du cercle : π ≈ 3,1416, 263, methode), `theoreme-des-restes-chinois` (Problème des restes du Sunzi suanjing, 400 approx, theoreme), `encadrement-de-pi-zu-chongzhi` (3,1415926 < π < 3,1415927, 480 approx, theoreme) · liens : aucun (tradition indépendante ; une affinité → `mathematiques-hellenistiques` possible, interprétation).

**`logique-antique`** — Logique et philosophie des mathématiques antiques · antiquite · { start: −450, end: 485, approx: true } · ['fondements'] · ['Élée', 'Athènes', 'Stagire'] · map { x: 480, y: 4150, size: 1, palette: { fill: '#c9edd5', stroke: '#27683d', accent: '#278647' } } · préfixe `la-` · figures : `zenon-d-elee` (Zénon d’Élée, [−490, −430] approx, Élée), `platon` (Platon, [−428, −348] approx, Athènes), `aristote` (Aristote, [−384, −322], Stagire et Athènes), `chrysippe` (Chrysippe, [−279, −206] approx, Soles et Athènes), `proclus` (Proclus, [412, 485], Athènes) · résultats : `paradoxes-de-zenon` (Paradoxes de Zénon, −450 approx, probleme), `menon-duplication-du-carre` (Le Ménon : la duplication du carré, −385 approx, texte), `seconds-analytiques` (Seconds Analytiques : la science démonstrative, −340 approx, texte), `syllogistique` (Syllogistique, −340 approx, concept), `logique-stoicienne` (Logique propositionnelle stoïcienne, −250 approx, concept), `commentaire-de-proclus` (Commentaire sur le premier livre des Éléments, 460 approx, texte) · liens : `geometrie-grecque` → affinité (interprétation : la preuve euclidienne et le modèle aristotélicien de la science), `geometrie-grecque` → reaction possible (Zénon contre le continu).

### Fichier `medieval.ts` — ère `medieval` (500 → 1450)

**`mathematiques-indiennes`** — Mathématiques indiennes classiques : d’Āryabhaṭa à l’école du Kerala · medieval · { start: 400, end: 1550, approx: true } · ['nombres', 'analyse'] · ['Kusumapura', 'Ujjain', 'Bijapur', 'Kerala'] · map { x: 1230, y: 430, size: 3, palette: { fill: '#ecddc6', stroke: '#644b26', accent: '#825d26' } } · préfixe `mi-` · figures : `aryabhata` (Āryabhaṭa, [476, 550] approx, Kusumapura), `brahmagupta` (Brahmagupta, [598, 668] approx, Bhinmal et Ujjain), `bhaskara-ii` (Bhāskara II, [1114, 1185], Bijapur et Ujjain), `madhava` (Mādhava de Sangamagrāma, [1340, 1425] approx, Kerala), `nilakantha` (Nīlakaṇṭha Somayājī, [1444, 1544] approx, Kerala) · résultats : `aryabhatiya` (Āryabhaṭīya, 499, texte), `brahmasphutasiddhanta` (Brāhmasphuṭasiddhānta : règles du zéro et des négatifs, 628, texte), `formule-de-brahmagupta` (Aire du quadrilatère inscrit, 628, theoreme), `methode-chakravala` (Méthode chakravāla, 1150 approx, methode), `lilavati` (Līlāvatī, 1150 approx, texte), `serie-de-madhava-pour-pi` (Série de Mādhava pour π, 1400 approx, theoreme), `series-de-madhava-sinus-cosinus` (Développements du sinus et du cosinus, 1400 approx, theoreme), `tantrasangraha` (Tantrasaṅgraha, 1500, texte) · liens : `calcul-des-scribes` → influence (interprétation), `mathematiques-hellenistiques` → influence (trigonométrie des cordes → sinus, fait documenté par l’astronomie).

**`algebre-arabe`** — Algèbre et arithmétique du monde islamique · medieval · { start: 800, end: 1300, approx: true } · ['nombres'] · ['Bagdad', 'Le Caire', 'Ispahan', 'Nichapour'] · map { x: 1600, y: 620, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } } · préfixe `aa-` · figures : `al-khwarizmi` (Muḥammad ibn Mūsā al-Khwārizmī, [780, 850] approx, Bagdad), `abu-kamil` (Abū Kāmil, [850, 930] approx, Égypte), `al-karaji` (Al-Karajī, [953, 1029] approx, Bagdad), `omar-khayyam` (Omar Khayyām, [1048, 1131], Nichapour et Ispahan), `al-samawal` (Al-Samaw’al, [1130, 1180] approx, Bagdad et Maragha), `sharaf-al-din-al-tusi` (Sharaf al-Dīn al-Ṭūsī, [1135, 1213] approx, Tūs) · résultats : `kitab-al-jabr` (Kitāb al-jabr wa-l-muqābala, 820 approx, texte), `livre-du-calcul-indien` (Livre de l’addition et de la soustraction d’après le calcul indien, 825 approx, texte), `algebre-d-abu-kamil` (Kitāb fī al-jabr, 900 approx, texte), `al-fakhri` (Al-Fakhrī : l’algèbre des polynômes, 1010 approx, texte), `classification-des-cubiques-khayyam` (Résolution géométrique des équations cubiques, 1070 approx, theoreme), `al-bahir` (Al-Bāhir fī al-jabr : division des polynômes, 1150 approx, texte), `maxima-des-cubiques-sharaf-al-din` (Étude des cubiques et de leurs maxima, 1200 approx, methode) · related : `thabit-ibn-qurra` · liens : `arithmetique-grecque` → filiation (Diophante traduit par Qusṭā ibn Lūqā, fait), `mathematiques-indiennes` → influence (numération, fait), `calcul-des-scribes` → affinité (interprétation).

**`geometrie-arabe`** — Géométrie, optique et trigonométrie du monde islamique · medieval · { start: 850, end: 1450, approx: true } · ['formes', 'analyse'] · ['Bagdad', 'Le Caire', 'Ghazni', 'Maragha', 'Samarcande'] · map { x: 1400, y: 1450, size: 2, palette: { fill: '#c9dced', stroke: '#274a68', accent: '#275a86' } } · préfixe `ga-` · figures : `thabit-ibn-qurra` (Thābit ibn Qurra, [826, 901], Harran et Bagdad), `abu-l-wafa` (Abū l-Wafā’, [940, 998], Bagdad), `ibn-al-haytham` (Ibn al-Haytham, [965, 1040] approx, Bassora et Le Caire), `al-biruni` (Al-Bīrūnī, [973, 1048], Khwarezm et Ghazni), `nasir-al-din-al-tusi` (Naṣīr al-Dīn al-Ṭūsī, [1201, 1274], Tūs et Maragha), `al-kashi` (Al-Kāshī, [1380, 1429] approx, Samarcande) · résultats : `theoreme-de-thabit-nombres-amiables` (Règle de Thābit pour les nombres amiables, 870 approx, theoreme), `traductions-de-la-maison-de-la-sagesse` (Traductions d’Euclide, d’Archimède et d’Apollonius, 850 approx, texte), `kitab-al-manazir` (Kitāb al-Manāẓir : Traité d’optique, 1021 approx, texte), `probleme-d-alhazen` (Problème d’Alhazen, 1021 approx, probleme), `volume-du-paraboloide-ibn-al-haytham` (Volume du paraboloïde par sommation, 1000 approx, theoreme), `traite-du-quadrilatere` (Traité du quadrilatère complet : la trigonométrie autonome, 1250 approx, texte), `quadrilatere-de-tusi` (Tentative sur les parallèles, 1250 approx, probleme), `miftah-al-hisab` (Miftāḥ al-ḥisāb : fractions décimales, 1427, texte), `calcul-de-pi-al-kashi` (π à seize décimales, 1424, methode) · liens : `geometrie-grecque` → filiation, `mathematiques-hellenistiques` → filiation, `mathematiques-indiennes` → influence (sinus).

**`algebre-chinoise-song-yuan`** — Âge d’or de l’algèbre chinoise : Song et Yuan · medieval · { start: 1000, end: 1350, approx: true } · ['hasard', 'nombres'] · ['Hangzhou', 'Pékin', 'Sichuan'] · map { x: 1350, y: 3150, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3629', accent: '#8a3c28' } } · préfixe `acs-` · figures : `jia-xian` (Jia Xian, [1010, 1070] approx, Chine des Song), `qin-jiushao` (Qin Jiushao, [1202, 1261] approx, Sichuan), `li-ye` (Li Ye, [1192, 1279], Hebei), `yang-hui` (Yang Hui, [1238, 1298] approx, Hangzhou), `zhu-shijie` (Zhu Shijie, [1249, 1314] approx, Pékin et Yangzhou) · résultats : `triangle-de-jia-xian` (Triangle des coefficients binomiaux, 1050 approx, concept), `shushu-jiuzhang` (Shushu jiuzhang : Traité mathématique en neuf sections, 1247, texte), `methode-dayan` (Méthode dayan pour les restes, 1247, methode), `extraction-de-racines-qin-jiushao` (Résolution numérique des équations de degré élevé, 1247, methode), `ceyuan-haijing` (Ceyuan haijing : la méthode tian yuan, 1248, texte), `xiangjie-jiuzhang-suanfa` (Xiangjie jiuzhang suanfa, 1261, texte), `siyuan-yujian` (Siyuan yujian : quatre inconnues, 1303, texte) · liens : `mathematiques-chinoises-anciennes` → filiation.

**`occident-latin-medieval`** — Occident latin : abaque, algorisme et calculateurs d’Oxford · medieval · { start: 1000, end: 1450, approx: true } · ['analyse', 'nombres'] · ['Reims', 'Tolède', 'Pise', 'Oxford', 'Paris'] · map { x: 1450, y: 2300, size: 2, palette: { fill: '#ddcdee', stroke: '#49296b', accent: '#58288a' } } · préfixe `olm-` · figures : `gerbert-d-aurillac` (Gerbert d’Aurillac, [946, 1003] approx, Reims et Rome), `adelard-de-bath` (Adélard de Bath, [1080, 1152] approx, Bath), `fibonacci` (Léonard de Pise, dit Fibonacci, [1170, 1250] approx, Pise), `jordanus-de-nemore` (Jordanus de Nemore, [1190, 1240] approx, Paris ?), `bradwardine` (Thomas Bradwardine, [1300, 1349] approx, Oxford), `oresme` (Nicole Oresme, [1323, 1382] approx, Paris et Lisieux) · résultats : `abaque-de-gerbert` (Abaque à jetons de Gerbert, 990 approx, methode ; l’enseignement de l’abaque à Reims se situe vers 982-1000, sans date certaine), `traduction-latine-des-elements` (Première traduction latine complète des Éléments, 1120 approx, texte), `liber-abaci` (Liber abaci, 1202, texte), `suite-de-fibonacci` (Problème des lapins et suite de Fibonacci, 1202, probleme), `liber-quadratorum` (Liber quadratorum, 1225, texte), `de-numeris-datis` (De numeris datis : l’algèbre en lettres, 1225 approx, texte), `tractatus-de-proportionibus` (Tractatus de proportionibus, 1328, texte), `latitude-des-formes` (Latitude des formes : la représentation graphique des qualités, 1350 approx, concept), `divergence-de-la-serie-harmonique` (Divergence de la série harmonique, 1350 approx, theoreme) · liens : `algebre-arabe` → filiation (traductions de Tolède et Liber abaci, fait), `geometrie-grecque` → filiation (Éléments via l’arabe), `mathematiques-indiennes` → influence (chiffres indo-arabes).

**`logique-scolastique`** — Logique scolastique : termes, supposition et insolubles · medieval · { start: 1100, end: 1400, approx: true } · ['fondements'] · ['Paris', 'Oxford'] · map { x: 1450, y: 4100, size: 1, palette: { fill: '#c9edd4', stroke: '#276839', accent: '#278642' } } · préfixe `ls-` · figures : `abelard` (Pierre Abélard, [1079, 1142], Paris), `pierre-d-espagne` (Pierre d’Espagne, [1205, 1277] approx, Paris), `guillaume-d-ockham` (Guillaume d’Ockham, [1287, 1347] approx, Oxford et Munich), `jean-buridan` (Jean Buridan, [1300, 1358] approx, Paris), `albert-de-saxe` (Albert de Saxe, [1320, 1390] approx, Paris et Vienne) · résultats : `dialectica-abelard` (Dialectica, 1120 approx, texte), `summulae-logicales` (Summulae logicales, 1230 approx, texte), `theorie-de-la-supposition` (Théorie de la supposition des termes, 1250 approx, concept), `summa-logicae` (Summa logicae, 1323 approx, texte), `rasoir-d-ockham` (Principe d’économie dit « rasoir d’Ockham », 1320 approx, concept), `insolubilia-et-menteur` (Les insolubles : le paradoxe du menteur, 1340 approx, probleme), `questions-sur-la-physique-infini` (Débats sur l’infini et le continu, 1350 approx, probleme) · liens : `logique-antique` → filiation (Boèce, Organon), `occident-latin-medieval` → affinité (interprétation).

### Fichier `renaissance.ts` — ère `renaissance` (1450 → 1700)

**`algebre-renaissance`** — Algèbre de la Renaissance : de Pacioli à Viète · renaissance · { start: 1494, end: 1603 } · ['nombres'] · ['Venise', 'Bologne', 'Milan', 'Paris'] · map { x: 2000, y: 420, size: 3, palette: { fill: '#eee6cd', stroke: '#6b5929', accent: '#8a7028' } } · préfixe `ar-` · figures : `pacioli` (Luca Pacioli, [1447, 1517] approx, Sansepolcro et Venise), `del-ferro` (Scipione del Ferro, [1465, 1526], Bologne), `tartaglia` (Niccolò Tartaglia, [1499, 1557] approx, Brescia et Venise), `cardan` (Jérôme Cardan, [1501, 1576], Pavie et Milan), `ferrari` (Lodovico Ferrari, [1522, 1565], Bologne), `bombelli` (Rafael Bombelli, [1526, 1572], Bologne), `viete` (François Viète, [1540, 1603], Fontenay-le-Comte et Paris) · résultats : `summa-de-arithmetica` (Summa de arithmetica, geometria, proportioni et proportionalita, 1494, texte), `resolution-de-la-cubique-del-ferro` (Résolution de x³ + px = q, 1515 approx, theoreme), `ars-magna` (Ars magna, 1545, texte), `formule-de-cardan` (Formule de Cardan, 1545, theoreme), `methode-de-ferrari` (Résolution de l’équation du quatrième degré, 1540 approx, methode), `algebra-bombelli` (L’Algebra : les nombres « sophistiques », 1572, texte), `in-artem-analyticem-isagoge` (In artem analyticem isagoge : l’algèbre littérale, 1591, texte) · liens : `algebre-arabe` → filiation (via Fibonacci et les traductions), `occident-latin-medieval` → filiation, `arithmetique-grecque` → influence (Diophante redécouvert par Bombelli, fait).

**`theorie-des-nombres-fermat`** — Théorie des nombres de Fermat · renaissance · { start: 1621, end: 1670, approx: true } · ['nombres'] · ['Toulouse', 'Paris', 'Bordeaux'] · map { x: 2450, y: 620, size: 2, palette: { fill: '#eee4cd', stroke: '#6b5629', accent: '#8a6b28' } } · préfixe `tnf-` · figures : `bachet` (Claude-Gaspard Bachet de Méziriac, [1581, 1638], Bourg-en-Bresse), `mersenne` (Marin Mersenne, [1588, 1648], Paris), `fermat` (Pierre de Fermat, [1601, 1665], Toulouse), `frenicle` (Bernard Frénicle de Bessy, [1604, 1674] approx, Paris) · résultats : `edition-bachet-diophante` (1621, texte), `petit-theoreme-de-fermat` (1640, theoreme), `theoreme-des-deux-carres` (1640, theoreme), `dernier-theoreme-de-fermat` (1637 approx, conjecture), `descente-infinie` (1659, methode), `equation-de-pell-fermat` (1657, probleme), `nombres-de-mersenne` (1644, concept) · related : `pascal`, `wallis` · **ce domaine est déjà rédigé en § 7 (exemple complet) : le reprendre tel quel, corrections factuelles autorisées.**

**`perspective-et-cartographie`** — Perspective, trigonométrie et cartographie · renaissance · { start: 1435, end: 1600 } · ['formes'] · ['Florence', 'Nuremberg', 'Vienne', 'Lisbonne', 'Duisbourg'] · map { x: 1980, y: 1550, size: 2, palette: { fill: '#cde0ee', stroke: '#294d6b', accent: '#285e8a' } } · préfixe `pc-` · figures : `alberti` (Leon Battista Alberti, [1404, 1472], Florence), `piero-della-francesca` (Piero della Francesca, [1415, 1492] approx, Sansepolcro), `regiomontanus` (Regiomontanus, [1436, 1476], Vienne et Nuremberg), `durer` (Albrecht Dürer, [1471, 1528], Nuremberg), `nunes` (Pedro Nunes, [1502, 1578], Lisbonne et Coimbra), `mercator` (Gerardus Mercator, [1512, 1594], Louvain et Duisbourg) · résultats : `de-pictura` (De pictura : la construction légitime, 1435, texte), `de-prospectiva-pingendi` (De prospectiva pingendi, 1475 approx, texte), `de-triangulis-omnimodis` (De triangulis omnimodis : la trigonométrie comme discipline, 1464, texte), `underweysung-der-messung` (Underweysung der Messung, 1525, texte), `loxodromie` (La loxodromie, 1537, concept), `projection-de-mercator` (Projection de Mercator, 1569, methode) · liens : `mathematiques-hellenistiques` → filiation (Ptolémée, Géographie et Almageste), `geometrie-arabe` → influence (optique et trigonométrie, fait).

**`geometrie-analytique`** — Géométrie analytique et projective du XVIIᵉ siècle · renaissance · { start: 1636, end: 1685 } · ['formes'] · ['Paris', 'Toulouse', 'Lyon', 'Leyde'] · map { x: 2420, y: 1250, size: 3, palette: { fill: '#d5e4f1', stroke: '#2b5373', accent: '#2a6492' } } · préfixe `gan-` · figures : `descartes` (René Descartes, [1596, 1650], La Haye en Touraine, Provinces-Unies), `desargues` (Girard Desargues, [1591, 1661], Lyon et Paris), `van-schooten` (Frans van Schooten, [1615, 1660], Leyde), `de-witt` (Johan de Witt, [1625, 1672], Dordrecht et La Haye), `la-hire` (Philippe de La Hire, [1640, 1718], Paris) · résultats : `la-geometrie-descartes` (La Géométrie, 1637, texte), `regle-des-signes-de-descartes` (Règle des signes, 1637, theoreme), `ad-locos-planos-fermat` (Ad locos planos et solidos isagoge, 1636 approx, texte, `fermat`), `methode-des-tangentes-fermat` (Méthode des maxima, minima et tangentes, 1636 approx, methode, `fermat`), `brouillon-project-desargues` (Brouillon project d’une atteinte aux événements des rencontres du cône avec un plan, 1639, texte), `theoreme-de-desargues` (Théorème de Desargues, 1639 approx, theoreme), `hexagramme-mystique` (Essai pour les coniques : l’hexagramme mystique, 1640, theoreme, `pascal`), `geometria-a-renato-des-cartes` (Édition latine commentée de La Géométrie, 1649, texte) · related : `fermat`, `pascal` · liens : `algebre-renaissance` → filiation (Viète → Descartes, fait), `mathematiques-hellenistiques` → influence (Apollonius, Pappus : le problème de Pappus ouvre La Géométrie, fait), `perspective-et-cartographie` → filiation (perspective → Desargues, interprétation).

**`naissance-du-calcul`** — Naissance du calcul infinitésimal · renaissance · { start: 1635, end: 1700 } · ['analyse'] · ['Bologne', 'Oxford', 'Cambridge', 'Paris', 'Hanovre', 'La Haye'] · map { x: 2300, y: 2300, size: 3, palette: { fill: '#d9cdee', stroke: '#41296b', accent: '#4c288a' } } · préfixe `nc-` · figures : `cavalieri` (Bonaventura Cavalieri, [1598, 1647], Milan et Bologne), `wallis` (John Wallis, [1616, 1703], Oxford), `huygens` (Christiaan Huygens, [1629, 1695], La Haye et Paris), `barrow` (Isaac Barrow, [1630, 1677], Cambridge), `gregory` (James Gregory, [1638, 1675], Aberdeen et Édimbourg), `newton` (Isaac Newton, [1643, 1727], Cambridge et Londres), `leibniz` (Gottfried Wilhelm Leibniz, [1646, 1716], Leipzig, Paris et Hanovre) · résultats : `geometria-indivisibilibus` (Geometria indivisibilibus continuorum, 1635, texte), `arithmetica-infinitorum` (Arithmetica infinitorum, 1656, texte), `horologium-oscillatorium` (Horologium oscillatorium, 1673, texte), `serie-du-binome` (Série du binôme généralisé, 1665 approx, theoreme), `de-analysi` (De analysi per aequationes numero terminorum infinitas, 1669, texte), `theoreme-fondamental-de-l-analyse` (Théorème fondamental de l’analyse, 1670 approx, theoreme), `nova-methodus` (Nova methodus pro maximis et minimis : première publication du calcul différentiel, 1684, texte), `principia-mathematica-newton` (Philosophiae naturalis principia mathematica, 1687, texte), `brachistochrone` (Problème de la brachistochrone, 1696, probleme, `jean-bernoulli` via related ou authorName seul) · related : `jean-bernoulli`, `jacques-bernoulli` · liens : `mathematiques-hellenistiques` → filiation (Archimède, fait), `geometrie-analytique` → filiation (fait), `occident-latin-medieval` → influence (Oresme, interprétation), `algebre-renaissance` → influence.

**`logarithmes-et-calcul-numerique`** — Logarithmes, décimales et machines à calculer · renaissance · { start: 1585, end: 1680 } · ['hasard', 'nombres'] · ['Bruges', 'Édimbourg', 'Londres', 'Tübingen', 'Rouen'] · map { x: 2000, y: 3050, size: 2, palette: { fill: '#eed6cd', stroke: '#6b3929', accent: '#8a4128' } } · préfixe `lcn-` · figures : `stevin` (Simon Stevin, [1548, 1620], Bruges et Leyde), `napier` (John Napier, [1550, 1617], Édimbourg), `burgi` (Jost Bürgi, [1552, 1632], Cassel et Prague), `briggs` (Henry Briggs, [1561, 1630], Londres et Oxford), `oughtred` (William Oughtred, [1574, 1660], Albury), `schickard` (Wilhelm Schickard, [1592, 1635], Tübingen), `kepler` (Johannes Kepler, [1571, 1630], Graz, Prague et Linz) · résultats : `de-thiende` (De Thiende : les nombres décimaux, 1585, texte), `mirifici-logarithmorum-canonis-descriptio` (Mirifici logarithmorum canonis descriptio, 1614, texte), `logarithmes-decimaux` (Logarithmes décimaux : Logarithmorum chilias prima, 1617, methode), `tables-de-burgi` (Arithmetische und geometrische Progress-Tabulen, 1620, texte), `regle-a-calcul` (Règle à calcul, 1622 approx, methode), `horloge-a-calcul-de-schickard` (Horloge à calcul, 1623, methode), `pascaline` (Pascaline, 1642, methode, `pascal`), `machine-arithmetique-de-leibniz` (Machine arithmétique à cylindre cannelé, 1673, methode, `leibniz`), `tabulae-rudolphinae` (Tables rudolphines : premières tables astronomiques calculées aux logarithmes, 1627, texte, `kepler`) · related : `pascal`, `leibniz` · liens : `algebre-arabe` → influence (fractions décimales d’al-Kāshī, interprétation), `perspective-et-cartographie` → filiation (tables trigonométriques, fait).

**`naissance-des-probabilites`** — Naissance du calcul des probabilités · renaissance · { start: 1654, end: 1713 } · ['hasard'] · ['Paris', 'La Haye', 'Londres', 'Bâle'] · map { x: 2450, y: 3400, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } } · préfixe `np-` · figures : `pascal` (Blaise Pascal, [1623, 1662], Clermont et Paris), `graunt` (John Graunt, [1620, 1674], Londres), `halley` (Edmond Halley, [1656, 1742], Londres), `jacques-bernoulli` (Jacques Bernoulli, [1655, 1705], Bâle), `montmort` (Pierre Rémond de Montmort, [1678, 1719], Paris) · résultats : `correspondance-pascal-fermat` (Correspondance Pascal–Fermat : le problème des partis, 1654, texte), `traite-du-triangle-arithmetique` (Traité du triangle arithmétique, 1654, texte), `de-ratiociniis-in-ludo-aleae` (De ratiociniis in ludo aleae : l’espérance, 1657, texte, `huygens`), `observations-de-graunt` (Natural and Political Observations upon the Bills of Mortality, 1662, texte), `liber-de-ludo-aleae` (Liber de ludo aleae, 1663, texte, `cardan`), `table-de-mortalite-de-halley` (Table de mortalité de Breslau, 1693, methode), `essay-d-analyse-sur-les-jeux-de-hazard` (Essay d’analyse sur les jeux de hazard, 1708, texte), `ars-conjectandi` (Ars conjectandi, 1713, texte), `loi-des-grands-nombres-bernoulli` (Théorème d’or : la loi des grands nombres, 1713, theoreme) · related : `fermat`, `huygens`, `cardan`, `leibniz` · liens : `theorie-des-nombres-fermat` → filiation (Fermat, fait), `naissance-du-calcul` → influence (Huygens, Bernoulli), `algebre-renaissance` → influence (Cardan, fait), `algebre-chinoise-song-yuan` → affinité (triangle arithmétique, interprétation).

**`methode-et-caracteristique`** — Méthode, logique et langue universelle · renaissance · { start: 1555, end: 1700 } · ['fondements'] · ['Paris', 'Port-Royal', 'Londres', 'Hanovre'] · map { x: 2250, y: 4150, size: 1, palette: { fill: '#d1f0d9', stroke: '#2a6f3b', accent: '#298e43' } } · préfixe `mc-` · figures : `ramus` (Pierre de La Ramée, dit Ramus, [1515, 1572], Paris), `hobbes` (Thomas Hobbes, [1588, 1679], Malmesbury et Londres), `arnauld` (Antoine Arnauld, [1612, 1694], Port-Royal et Bruxelles), `wilkins` (John Wilkins, [1614, 1672], Oxford et Londres) · résultats : `dialectique-de-ramus` (Dialectique, 1555, texte), `regulae-ad-directionem-ingenii` (Regulae ad directionem ingenii, 1628 approx, texte, `descartes`), `discours-de-la-methode` (Discours de la méthode, 1637, texte, `descartes`), `de-l-esprit-geometrique` (De l’esprit géométrique et de l’art de persuader, 1657 approx, texte, `pascal`), `logique-de-port-royal` (La Logique ou l’Art de penser, 1662, texte), `dissertatio-de-arte-combinatoria` (Dissertatio de arte combinatoria, 1666, texte, `leibniz`), `nouveaux-elements-de-geometrie` (Nouveaux éléments de géométrie, 1667, texte), `essay-towards-a-real-character` (An Essay towards a Real Character and a Philosophical Language, 1668, texte), `characteristica-universalis` (Characteristica universalis et calculus ratiocinator, 1679 approx, concept, `leibniz`) · related : `descartes`, `pascal`, `leibniz` · liens : `logique-scolastique` → reaction (Ramus contre la scolastique, fait), `logique-antique` → filiation, `geometrie-analytique` → affinité (interprétation : la méthode cartésienne).

### Fichier `lumieres.ts` — ère `lumieres` (1700 → 1800)

**`analyse-eulerienne`** — Analyse d’Euler et des Bernoulli · lumieres · { start: 1700, end: 1790 } · ['analyse'] · ['Bâle', 'Saint-Pétersbourg', 'Berlin', 'Paris'] · map { x: 2900, y: 2100, size: 3, palette: { fill: '#e2d5f1', stroke: '#4e2b73', accent: '#5d2a92' } } · préfixe `ae-` · figures : `jean-bernoulli` (Jean Bernoulli, [1667, 1748], Bâle et Groningue), `taylor` (Brook Taylor, [1685, 1731], Londres), `daniel-bernoulli` (Daniel Bernoulli, [1700, 1782], Bâle et Saint-Pétersbourg), `euler` (Leonhard Euler, [1707, 1783], Bâle, Saint-Pétersbourg et Berlin), `clairaut` (Alexis Clairaut, [1713, 1765], Paris), `d-alembert` (Jean le Rond d’Alembert, [1717, 1783], Paris) · résultats : `methodus-incrementorum` (Methodus incrementorum directa et inversa : la formule de Taylor, 1715, texte), `probleme-de-bale` (Problème de Bâle : ζ(2) = π²/6, 1735, theoreme), `hydrodynamica` (Hydrodynamica, 1738, texte), `methodus-inveniendi` (Methodus inveniendi : le calcul des variations, 1744, texte), `equation-des-cordes-vibrantes` (Équation des cordes vibrantes, 1747, probleme), `introductio-in-analysin-infinitorum` (Introductio in analysin infinitorum, 1748, texte), `formule-d-euler` (Formule d’Euler e^(iθ) = cos θ + i sin θ, 1748, theoreme), `institutiones-calculi-differentialis` (Institutiones calculi differentialis, 1755, texte), `equations-d-euler-fluides` (Équations d’Euler des fluides parfaits, 1757, theoreme) · liens : `naissance-du-calcul` → filiation (Leibniz → Bernoulli → Euler, fait), `naissance-des-probabilites` → filiation (famille Bernoulli), `mathematiques-hellenistiques` → influence.

**`mecanique-analytique`** — Mécanique analytique et céleste · lumieres · { start: 1740, end: 1830 } · ['analyse', 'formes'] · ['Paris', 'Berlin', 'Turin'] · map { x: 3100, y: 2600, size: 2, palette: { fill: '#e3d5f1', stroke: '#4f2b73', accent: '#5e2a92' } } · préfixe `ma-` · figures : `maupertuis` (Pierre Louis Moreau de Maupertuis, [1698, 1759], Saint-Malo, Paris et Berlin), `lagrange` (Joseph-Louis Lagrange, [1736, 1813], Turin, Berlin et Paris), `laplace` (Pierre-Simon de Laplace, [1749, 1827], Paris) · résultats : `traite-de-dynamique` (Traité de dynamique : le principe de d’Alembert, 1743, texte, `d-alembert`), `principe-de-moindre-action` (Principe de moindre action, 1744, concept), `theorie-de-la-lune-clairaut` (Théorie de la Lune et retour de la comète de Halley, 1752, theoreme, `clairaut`), `points-de-lagrange` (Essai sur le problème des trois corps : les points de Lagrange, 1772, theoreme), `stabilite-du-systeme-solaire` (Stabilité séculaire du système solaire, 1784, theoreme), `mecanique-analytique-lagrange` (Méchanique analitique, 1788, texte), `equations-de-lagrange` (Équations de Lagrange, 1788, concept), `traite-de-mecanique-celeste` (Traité de mécanique céleste, 1799, texte), `equation-de-laplace` (Équation de Laplace et potentiel, 1785 approx, concept) · related : `d-alembert`, `clairaut`, `euler`, `legendre` · liens : `analyse-eulerienne` → filiation (fait), `naissance-du-calcul` → filiation (Principia, fait).

**`theorie-des-nombres-lumieres`** — Théorie des nombres d’Euler à Legendre · lumieres · { start: 1730, end: 1800 } · ['nombres'] · ['Saint-Pétersbourg', 'Berlin', 'Cambridge', 'Paris'] · map { x: 2975, y: 500, size: 2, palette: { fill: '#ece1c6', stroke: '#645226', accent: '#826826' } } · préfixe `tnl-` · figures : `goldbach` (Christian Goldbach, [1690, 1764], Königsberg et Saint-Pétersbourg), `waring` (Edward Waring, [1736, 1798], Cambridge), `wilson` (John Wilson, [1741, 1793], Cambridge), `legendre` (Adrien-Marie Legendre, [1752, 1833], Paris) · résultats : `demonstration-du-petit-theoreme-euler` (Démonstration du petit théorème de Fermat, 1736, theoreme, `euler`), `produit-eulerien` (Produit eulérien : ζ(s) = ∏ 1/(1 − p^(−s)), 1737, theoreme, `euler`), `conjecture-de-goldbach` (Conjecture de Goldbach, 1742, conjecture), `demonstration-des-deux-carres-euler` (Démonstration du théorème des deux carrés, 1749, theoreme, `euler`), `fonction-indicatrice-d-euler` (Indicatrice φ(n) et théorème d’Euler, 1763, concept, `euler`), `theoreme-des-quatre-carres` (Théorème des quatre carrés, 1770, theoreme, `lagrange`), `probleme-de-waring` (Problème de Waring, 1770, probleme), `theoreme-de-wilson` (Théorème de Wilson, 1770, theoreme), `loi-de-reciprocite-quadratique-enonce` (Énoncé de la loi de réciprocité quadratique, 1785, conjecture), `essai-sur-la-theorie-des-nombres` (Essai sur la théorie des nombres, 1798, texte), `irrationalite-de-pi` (Irrationalité de π, 1761, theoreme, `lambert`) · related : `euler`, `lagrange`, `lambert` · liens : `theorie-des-nombres-fermat` → filiation (Euler démontre Fermat, fait), `arithmetique-grecque` → influence.

**`geometrie-des-lumieres`** — Géométrie des Lumières : courbes, surfaces, parallèles et géométrie descriptive · lumieres · { start: 1730, end: 1810 } · ['formes'] · ['Milan', 'Berlin', 'Saint-Pétersbourg', 'Mézières', 'Paris'] · map { x: 2975, y: 1400, size: 2, palette: { fill: '#d1e2f0', stroke: '#2a516f', accent: '#29638e' } } · préfixe `gl-` · figures : `saccheri` (Giovanni Girolamo Saccheri, [1667, 1733], Pavie et Milan), `lambert` (Johann Heinrich Lambert, [1728, 1777], Mulhouse et Berlin), `monge` (Gaspard Monge, [1746, 1818], Mézières et Paris), `meusnier` (Jean-Baptiste Meusnier, [1754, 1793], Paris), `carnot` (Lazare Carnot, [1753, 1823], Paris) · résultats : `recherches-sur-les-courbes-a-double-courbure` (Recherches sur les courbes à double courbure, 1731, texte, `clairaut`), `euclides-ab-omni-naevo-vindicatus` (Euclides ab omni naevo vindicatus, 1733, texte), `sept-ponts-de-konigsberg` (Les sept ponts de Königsberg, 1736, theoreme, `euler`), `formule-d-euler-polyedres` (Relation d’Euler S − A + F = 2, 1750, theoreme, `euler`), `courbures-principales-euler` (Courbures principales d’une surface, 1760, theoreme, `euler`), `theorie-der-parallellinien` (Theorie der Parallellinien, 1766, texte), `theoreme-de-meusnier` (Théorème de Meusnier, 1776, theoreme), `geometrie-descriptive` (Géométrie descriptive, 1799, texte), `geometrie-de-position` (Géométrie de position, 1803, texte) · related : `clairaut`, `euler` · liens : `geometrie-grecque` → reaction (le cinquième postulat attaqué, fait), `geometrie-analytique` → filiation, `geometrie-arabe` → influence (al-Ṭūsī lu par Saccheri via Wallis, fait).

**`probabilites-classiques`** — Probabilités classiques et arithmétique politique · lumieres · { start: 1718, end: 1812 } · ['hasard'] · ['Londres', 'Paris', 'Tunbridge Wells'] · map { x: 2975, y: 3250, size: 2, palette: { fill: '#eed4cd', stroke: '#6b3729', accent: '#8a3d28' } } · préfixe `pcl-` · figures : `de-moivre` (Abraham de Moivre, [1667, 1754], Vitry-le-François et Londres), `bayes` (Thomas Bayes, [1701, 1761] approx, Tunbridge Wells), `buffon` (Georges-Louis Leclerc de Buffon, [1707, 1788], Montbard et Paris), `price` (Richard Price, [1723, 1791], Londres), `condorcet` (Nicolas de Condorcet, [1743, 1794], Paris) · résultats : `doctrine-of-chances` (The Doctrine of Chances, 1718, texte), `approximation-normale-de-moivre` (Approximation normale de la binomiale, 1733, theoreme), `paradoxe-de-saint-petersbourg` (Paradoxe de Saint-Pétersbourg, 1738, probleme, `daniel-bernoulli`), `essai-de-bayes` (An Essay towards solving a Problem in the Doctrine of Chances, 1763, texte), `theoreme-de-bayes` (Théorème de Bayes, 1763, theoreme), `aiguille-de-buffon` (Aiguille de Buffon, 1777, probleme), `essai-sur-l-application-de-l-analyse` (Essai sur l’application de l’analyse à la probabilité des décisions rendues à la pluralité des voix, 1785, texte), `paradoxe-de-condorcet` (Paradoxe de Condorcet, 1785, theoreme), `methode-des-moindres-carres` (Méthode des moindres carrés, 1805, methode, `legendre`), `theorie-analytique-des-probabilites` (Théorie analytique des probabilités, 1812, texte, `laplace`), `theoreme-central-limite-laplace` (Théorème central limite, 1810, theoreme, `laplace`) · related : `daniel-bernoulli`, `legendre`, `laplace` · liens : `naissance-des-probabilites` → filiation (fait), `analyse-eulerienne` → influence, `mecanique-analytique` → filiation (Laplace).

**`querelle-des-infiniment-petits`** — Fondements du calcul : la querelle des infiniment petits · lumieres · { start: 1696, end: 1797 } · ['fondements', 'analyse'] · ['Paris', 'Dublin', 'Édimbourg', 'Berlin'] · map { x: 2975, y: 4120, size: 1, palette: { fill: '#cdeed9', stroke: '#296b40', accent: '#288a4b' } } · préfixe `qip-` · figures : `l-hopital` (Guillaume de L’Hôpital, [1661, 1704], Paris), `rolle` (Michel Rolle, [1652, 1719], Paris), `varignon` (Pierre Varignon, [1654, 1722], Paris), `berkeley` (George Berkeley, [1685, 1753], Dublin et Cloyne), `maclaurin` (Colin Maclaurin, [1698, 1746], Édimbourg) · résultats : `analyse-des-infiniment-petits` (Analyse des infiniment petits pour l’intelligence des lignes courbes, 1696, texte), `regle-de-l-hopital` (Règle de L’Hôpital, 1696, theoreme), `querelle-de-l-academie` (Querelle des infiniment petits à l’Académie royale, 1701 approx, probleme), `the-analyst` (The Analyst : les « fantômes de quantités disparues », 1734, texte), `treatise-of-fluxions` (A Treatise of Fluxions, 1742, texte), `article-limite-encyclopedie` (Article « Limite » de l’Encyclopédie, 1765, texte, `d-alembert`), `theorie-des-fonctions-analytiques` (Théorie des fonctions analytiques, 1797, texte, `lagrange`) · related : `d-alembert`, `lagrange`, `jean-bernoulli`, `newton`, `leibniz` · liens : `naissance-du-calcul` → reaction (fait), `methode-et-caracteristique` → affinité (interprétation), `analyse-eulerienne` → affinité (interprétation).

### Fichier `dixneuvieme-a.ts` — ère `dixneuvieme` (1800 → 1900), nombres, formes, analyse

**`arithmetique-gaussienne`** — Arithmétique de Gauss et ses héritiers · dixneuvieme · { start: 1796, end: 1900 } · ['nombres'] · ['Göttingen', 'Berlin', 'Breslau', 'Saint-Pétersbourg', 'Paris', 'Louvain'] · map { x: 3600, y: 430, size: 3, palette: { fill: '#f1e9d5', stroke: '#735d2b', accent: '#92732a' } } · préfixe `arg-` · figures : `gauss` (Carl Friedrich Gauss, [1777, 1855], Brunswick et Göttingen), `dirichlet` (Peter Gustav Lejeune Dirichlet, [1805, 1859], Berlin et Göttingen), `kummer` (Ernst Kummer, [1810, 1893], Breslau et Berlin), `eisenstein` (Gotthold Eisenstein, [1823, 1852], Berlin), `kronecker` (Leopold Kronecker, [1823, 1891], Berlin), `chebyshev` (Pafnouti Tchebychev, [1821, 1894], Saint-Pétersbourg), `dedekind` (Richard Dedekind, [1831, 1916], Brunswick, Göttingen et Zurich), `de-la-vallee-poussin` (Charles-Jean de La Vallée Poussin, [1866, 1962], Louvain) · résultats : `demonstration-de-la-reciprocite-quadratique` (Première démonstration de la loi de réciprocité quadratique, 1796, theoreme), `disquisitiones-arithmeticae` (Disquisitiones arithmeticae, 1801, texte), `congruences-et-formes-quadratiques` (Congruences, formes quadratiques et composition, 1801, concept), `theoreme-de-la-progression-arithmetique` (Théorème de Dirichlet sur les nombres premiers en progression arithmétique, 1837, theoreme), `nombres-ideaux` (Nombres idéaux, 1847, concept), `postulat-de-bertrand` (Postulat de Bertrand démontré, 1852, theoreme), `hypothese-de-riemann` (Sur le nombre des nombres premiers inférieurs à une grandeur donnée : l’hypothèse de Riemann, 1859, conjecture, `riemann`), `theoreme-de-kronecker-weber` (Théorème de Kronecker–Weber, 1853, theoreme), `ideaux-de-dedekind` (Théorie des idéaux, 1871, concept), `vorlesungen-ueber-zahlentheorie` (Vorlesungen über Zahlentheorie, 1863, texte), `theoreme-des-nombres-premiers` (Théorème des nombres premiers, 1896, theoreme, authorName « Jacques Hadamard et Charles-Jean de La Vallée Poussin », `de-la-vallee-poussin`) · related : `riemann`, `hadamard`, `legendre` · liens : `theorie-des-nombres-lumieres` → filiation (fait), `theorie-des-nombres-fermat` → influence (Kummer et le dernier théorème, fait), `analyse-rigoureuse` → influence (méthodes analytiques de Dirichlet et Riemann, fait).

**`algebre-des-groupes`** — Équations, groupes et algèbres nouvelles · dixneuvieme · { start: 1799, end: 1895 } · ['nombres'] · ['Modène', 'Christiania', 'Paris', 'Dublin', 'Cambridge', 'Stettin', 'Leipzig'] · map { x: 4250, y: 580, size: 3, palette: { fill: '#eee3cd', stroke: '#6b5429', accent: '#8a6828' } } · préfixe `adg-` · figures : `ruffini` (Paolo Ruffini, [1765, 1822], Modène), `abel` (Niels Henrik Abel, [1802, 1829], Christiania), `galois` (Évariste Galois, [1811, 1832], Paris), `hamilton-wr` (William Rowan Hamilton, [1805, 1865], Dublin), `grassmann` (Hermann Grassmann, [1809, 1877], Stettin), `cayley` (Arthur Cayley, [1821, 1895], Cambridge), `sylvester` (James Joseph Sylvester, [1814, 1897], Londres, Baltimore et Oxford), `jordan` (Camille Jordan, [1838, 1922], Paris), `sylow` (Ludwig Sylow, [1832, 1918], Frederikshald et Christiania), `lie` (Sophus Lie, [1842, 1899], Christiania et Leipzig) · résultats : `teoria-generale-delle-equazioni` (Teoria generale delle equazioni, 1799, texte), `theoreme-d-abel-ruffini` (Impossibilité de résoudre par radicaux l’équation générale du cinquième degré, 1824, theoreme), `memoire-de-galois` (Mémoire sur les conditions de résolubilité des équations par radicaux, 1831, texte), `theorie-de-galois` (Correspondance de Galois, 1831, theoreme), `quaternions` (Quaternions, 1843, concept), `ausdehnungslehre` (Die lineale Ausdehnungslehre, 1844, texte), `theoreme-de-cayley` (Théorème de Cayley et groupes abstraits, 1854, theoreme), `matrices-cayley` (A Memoir on the Theory of Matrices, 1858, texte), `traite-des-substitutions` (Traité des substitutions et des équations algébriques, 1870, texte), `theoremes-de-sylow` (Théorèmes de Sylow, 1872, theoreme), `groupes-de-transformations-lie` (Groupes continus de transformations, 1873 approx, concept), `theoreme-de-jordan-holder` (Théorème de Jordan–Hölder, 1889, theoreme) · related : `cauchy` (théorie des permutations), `gauss` · liens : `algebre-renaissance` → filiation (l’équation du cinquième degré après Ferrari, fait), `theorie-des-nombres-lumieres` → filiation (Lagrange, Réflexions 1770, fait), `arithmetique-gaussienne` → influence (Gauss, cyclotomie, fait).

**`geometries-non-euclidiennes`** — Géométries non euclidiennes et géométrie différentielle · dixneuvieme · { start: 1827, end: 1890 } · ['formes', 'fondements'] · ['Göttingen', 'Kazan', 'Marosvásárhely', 'Bologne', 'Erlangen', 'Leipzig'] · map { x: 3620, y: 1300, size: 3, palette: { fill: '#c6dbec', stroke: '#264964', accent: '#265a82' } } · préfixe `gne-` · figures : `lobatchevski` (Nikolaï Lobatchevski, [1792, 1856], Kazan), `bolyai` (János Bolyai, [1802, 1860], Marosvásárhely), `helmholtz` (Hermann von Helmholtz, [1821, 1894], Heidelberg et Berlin), `beltrami` (Eugenio Beltrami, [1835, 1900], Bologne et Rome), `klein` (Felix Klein, [1849, 1925], Erlangen, Leipzig et Göttingen), `pasch` (Moritz Pasch, [1843, 1930], Giessen) · résultats : `disquisitiones-generales-circa-superficies-curvas` (Disquisitiones generales circa superficies curvas, 1827, texte, `gauss`), `theorema-egregium` (Theorema egregium, 1827, theoreme, `gauss`), `sur-les-principes-de-la-geometrie` (О началах геометрии : la géométrie imaginaire, 1829, texte), `appendix-bolyai` (Appendix scientiam spatii absolute veram exhibens, 1832, texte), `habilitationsvortrag-riemann` (Über die Hypothesen, welche der Geometrie zu Grunde liegen, 1854, texte, `riemann`), `modele-de-beltrami` (Saggio di interpretazione della geometria non-euclidea : la pseudosphère, 1868, theoreme), `faits-qui-fondent-la-geometrie` (Über die Tatsachen, die der Geometrie zugrunde liegen, 1868, texte), `modele-de-klein` (Modèle projectif de Klein, 1871, concept), `programme-d-erlangen` (Programme d’Erlangen, 1872, texte), `modele-de-poincare` (Disque et demi-plan de Poincaré, 1882, concept, `poincare`), `vorlesungen-ueber-neuere-geometrie` (Vorlesungen über neuere Geometrie : les axiomes d’ordre, 1882, texte) · related : `gauss`, `riemann`, `poincare` · liens : `geometrie-des-lumieres` → filiation (Saccheri, Lambert, fait), `geometrie-grecque` → reaction (le cinquième postulat, fait), `algebre-des-groupes` → influence (Erlangen, fait), `mecanique-analytique` → affinité (interprétation).

**`geometrie-projective-et-algebrique`** — Géométrie projective et algébrique au XIXᵉ siècle · dixneuvieme · { start: 1822, end: 1900 } · ['formes'] · ['Paris', 'Nîmes', 'Berlin', 'Bonn', 'Leipzig', 'Milan', 'Rome'] · map { x: 4250, y: 1500, size: 2, palette: { fill: '#cde0ee', stroke: '#294e6b', accent: '#28608a' } } · préfixe `gpa-` · figures : `gergonne` (Joseph Diez Gergonne, [1771, 1859], Nîmes et Montpellier), `poncelet` (Jean-Victor Poncelet, [1788, 1867], Metz et Paris), `mobius` (August Ferdinand Möbius, [1790, 1868], Leipzig), `steiner` (Jakob Steiner, [1796, 1863], Berlin), `plucker` (Julius Plücker, [1801, 1868], Bonn), `cremona` (Luigi Cremona, [1830, 1903], Bologne, Milan et Rome), `clebsch` (Alfred Clebsch, [1833, 1872], Giessen et Göttingen) · résultats : `traite-des-proprietes-projectives` (Traité des propriétés projectives des figures, 1822, texte), `principe-de-continuite` (Principe de continuité, 1822, concept), `principe-de-dualite` (Principe de dualité, 1826, concept), `calcul-barycentrique` (Der barycentrische Calcul, 1827, texte), `coordonnees-homogenes` (Coordonnées homogènes et formules de Plücker, 1829, concept), `systematische-entwickelung` (Systematische Entwickelung der Abhängigkeit geometrischer Gestalten, 1832, texte), `vingt-sept-droites` (Les 27 droites d’une surface cubique, 1849, theoreme, `cayley`), `surfaces-de-riemann` (Surfaces de Riemann, 1857, concept, `riemann`), `ruban-de-mobius` (Ruban de Möbius, 1858, concept), `transformations-de-cremona` (Transformations birationnelles de Cremona, 1863, concept), `theoreme-de-riemann-roch` (Théorème de Riemann–Roch, 1865, theoreme, authorName « Bernhard Riemann et Gustav Roch », `riemann`) · related : `cayley`, `riemann`, `klein` · liens : `geometrie-analytique` → filiation (Desargues, Pascal redécouverts, fait), `geometrie-des-lumieres` → filiation (Monge → Poncelet, fait), `algebre-des-groupes` → influence (invariants de Cayley–Sylvester, fait).

**`analyse-rigoureuse`** — Rigueur de l’analyse : de Cauchy à Weierstrass · dixneuvieme · { start: 1817, end: 1897 } · ['analyse'] · ['Prague', 'Paris', 'Königsberg', 'Berlin', 'Göttingen'] · map { x: 3620, y: 2200, size: 3, palette: { fill: '#d8cdee', stroke: '#3f296b', accent: '#49288a' } } · préfixe `anr-` · figures : `bolzano` (Bernard Bolzano, [1781, 1848], Prague), `cauchy` (Augustin-Louis Cauchy, [1789, 1857], Paris), `jacobi` (Carl Gustav Jacob Jacobi, [1804, 1851], Königsberg et Berlin), `liouville` (Joseph Liouville, [1809, 1882], Paris), `weierstrass` (Karl Weierstrass, [1815, 1897], Berlin), `riemann` (Bernhard Riemann, [1826, 1866], Göttingen), `heine` (Eduard Heine, [1821, 1881], Halle), `hermite` (Charles Hermite, [1822, 1901], Paris), `lindemann` (Ferdinand von Lindemann, [1852, 1939], Königsberg et Munich) · résultats : `rein-analytischer-beweis` (Rein analytischer Beweis : le théorème des valeurs intermédiaires, 1817, texte), `cours-d-analyse` (Cours d’analyse de l’École royale polytechnique, 1821, texte), `theoreme-des-residus` (Calcul des résidus, 1831, theoreme), `fundamenta-nova` (Fundamenta nova theoriae functionum ellipticarum, 1829, texte), `nombres-de-liouville` (Existence de nombres transcendants, 1844, theoreme), `theoreme-de-l-application-conforme` (Théorème de l’application conforme, 1851, theoreme), `integrale-de-riemann` (Intégrale de Riemann, 1854, concept), `definition-epsilon-delta` (Définition en ε-δ de la continuité et de la convergence uniforme, 1861 approx, concept), `fonction-de-weierstrass` (Fonction continue nulle part dérivable, 1872, theoreme), `coupures-de-dedekind` (Stetigkeit und irrationale Zahlen : les coupures, 1872, concept, `dedekind`), `transcendance-de-e` (Transcendance de e, 1873, theoreme), `transcendance-de-pi` (Transcendance de π, 1882, theoreme), `theoreme-d-approximation-de-weierstrass` (Théorème d’approximation de Weierstrass, 1885, theoreme) · related : `dedekind`, `cantor`, `abel`, `dirichlet` · liens : `querelle-des-infiniment-petits` → filiation (Lagrange → Cauchy, fait), `analyse-eulerienne` → reaction (séries divergentes, fait), `physique-mathematique-xixe` → influence (Fourier, Dirichlet, fait).

### Fichier `dixneuvieme-b.ts` — ère `dixneuvieme` (1800 → 1900), hasard et fondements

**`physique-mathematique-xixe`** — Physique mathématique et équations aux dérivées partielles · dixneuvieme · { start: 1807, end: 1900 } · ['analyse'] · ['Paris', 'Grenoble', 'Nottingham', 'Cambridge', 'Édimbourg', 'Stockholm'] · map { x: 4250, y: 2400, size: 2, palette: { fill: '#ddcdee', stroke: '#48296b', accent: '#56288a' } } · préfixe `pm-` · figures : `fourier` (Joseph Fourier, [1768, 1830], Auxerre, Grenoble et Paris), `poisson` (Siméon Denis Poisson, [1781, 1840], Paris), `green` (George Green, [1793, 1841], Nottingham et Cambridge), `stokes` (George Gabriel Stokes, [1819, 1903], Cambridge), `maxwell` (James Clerk Maxwell, [1831, 1879], Édimbourg, Aberdeen et Cambridge), `kovalevskaia` (Sofia Kovalevskaïa, [1850, 1891], Moscou, Berlin et Stockholm) · résultats : `memoire-sur-la-propagation-de-la-chaleur` (Mémoire sur la propagation de la chaleur dans les corps solides, 1807, texte), `series-de-fourier` (Séries de Fourier, 1807, concept), `equation-de-poisson` (Équation de Poisson, 1813, theoreme), `theorie-analytique-de-la-chaleur` (Théorie analytique de la chaleur, 1822, texte), `essay-de-green` (An Essay on the Application of Mathematical Analysis to the Theories of Electricity and Magnetism, 1828, texte), `fonctions-de-green` (Fonctions de Green, 1828, concept), `equations-de-hamilton` (Équations canoniques de Hamilton, 1834, theoreme, `hamilton-wr`), `theoreme-de-stokes` (Théorème de Stokes, 1854, theoreme), `principe-de-dirichlet` (Principe de Dirichlet et sa critique par Weierstrass, 1857 approx, probleme, `riemann`), `a-dynamical-theory-of-the-electromagnetic-field` (A Dynamical Theory of the Electromagnetic Field, 1865, texte), `theoreme-de-cauchy-kovalevskaia` (Théorème de Cauchy–Kovalevskaïa, 1875, theoreme), `sur-le-probleme-des-trois-corps` (Sur le problème des trois corps et les équations de la dynamique, 1890, texte, `poincare`) · related : `hamilton-wr`, `riemann`, `poincare`, `cauchy`, `dirichlet` · liens : `mecanique-analytique` → filiation (Laplace → Fourier, Poisson, fait), `analyse-eulerienne` → filiation (cordes vibrantes, fait), `analyse-rigoureuse` → reaction (la rigueur contre les séries de Fourier, puis réconciliation par Dirichlet, interprétation).

**`statistique-xixe`** — Statistique, moyennes et lois du hasard au XIXᵉ siècle · dixneuvieme · { start: 1809, end: 1900 } · ['hasard'] · ['Bruxelles', 'Paris', 'Londres', 'Saint-Pétersbourg'] · map { x: 3975, y: 3230, size: 2, palette: { fill: '#f0d7d1', stroke: '#6f382a', accent: '#8e3e29' } } · préfixe `sx-` · figures : `quetelet` (Adolphe Quetelet, [1796, 1874], Gand et Bruxelles), `bienayme` (Irénée-Jules Bienaymé, [1796, 1878], Paris), `galton` (Francis Galton, [1822, 1911], Londres), `lexis` (Wilhelm Lexis, [1837, 1914], Strasbourg et Göttingen), `edgeworth` (Francis Ysidro Edgeworth, [1845, 1926], Oxford), `pearson-karl` (Karl Pearson, [1857, 1936], Londres) · résultats : `theoria-motus` (Theoria motus corporum coelestium : loi normale et moindres carrés, 1809, texte, `gauss`), `theoreme-de-gauss-markov-origine` (Justification des moindres carrés, 1821 approx, theoreme, `gauss`), `sur-l-homme` (Sur l’homme et le développement de ses facultés : l’homme moyen, 1835, texte), `loi-de-poisson` (Loi de Poisson et « loi des grands nombres », 1837, theoreme, `poisson`), `inegalite-de-bienayme-tchebychev` (Inégalité de Bienaymé–Tchebychev, 1853, theoreme), `theoreme-central-limite-tchebychev` (Démonstration du théorème central limite par les moments, 1887, theoreme, `chebyshev`), `planche-de-galton` (Planche de Galton, 1873, concept), `regression-vers-la-moyenne` (Régression vers la moyenne, 1886, concept), `coefficient-de-correlation` (Coefficient de corrélation, 1896, concept), `test-du-chi-deux` (Test du χ², 1900, methode) · related : `gauss`, `poisson`, `chebyshev`, `laplace` · liens : `probabilites-classiques` → filiation (Laplace, Gauss, fait), `arithmetique-gaussienne` → influence (Gauss, Tchebychev), `physique-mathematique-xixe` → affinité (Maxwell et la statistique des gaz, interprétation).

**`logique-mathematique-xixe`** — Algèbre de la logique, machines et naissance de la logique mathématique · dixneuvieme · { start: 1837, end: 1900 } · ['fondements', 'hasard'] · ['Londres', 'Cambridge', 'Cork', 'Iéna', 'Turin', 'Cambridge (Mass.)'] · map { x: 4300, y: 4000, size: 2, palette: { fill: '#cdeedb', stroke: '#296b44', accent: '#288a51' } } · préfixe `lm-` · figures : `babbage` (Charles Babbage, [1791, 1871], Londres), `lovelace` (Ada Lovelace, [1815, 1852], Londres), `de-morgan` (Augustus De Morgan, [1806, 1871], Londres), `boole` (George Boole, [1815, 1864], Lincoln et Cork), `jevons` (William Stanley Jevons, [1835, 1882], Manchester et Londres), `peirce` (Charles Sanders Peirce, [1839, 1914], Cambridge (Mass.) et Milford), `schroder` (Ernst Schröder, [1841, 1902], Karlsruhe), `frege` (Gottlob Frege, [1848, 1925], Iéna), `peano` (Giuseppe Peano, [1858, 1932], Turin) · résultats : `machine-analytique` (Machine analytique, 1837, concept), `notes-de-lovelace` (Notes sur la machine analytique, 1843, texte), `the-mathematical-analysis-of-logic` (The Mathematical Analysis of Logic, 1847, texte), `lois-de-de-morgan` (Lois de De Morgan et logique des relations, 1847, theoreme), `the-laws-of-thought` (An Investigation of the Laws of Thought, 1854, texte), `piano-logique` (Piano logique de Jevons, 1869, methode), `quantificateurs` (Quantificateurs, 1879, concept), `begriffsschrift` (Begriffsschrift, 1879, texte), `grundlagen-der-arithmetik` (Die Grundlagen der Arithmetik, 1884, texte), `vorlesungen-ueber-die-algebra-der-logik` (Vorlesungen über die Algebra der Logik, 1890, texte), `arithmetices-principia` (Arithmetices principia, nova methodo exposita : les axiomes de Peano, 1889, texte), `formulaire-de-mathematiques` (Formulaire de mathématiques, 1895, texte) · related : `leibniz` (non requis), `dedekind` · liens : `methode-et-caracteristique` → filiation (Leibniz redécouvert, interprétation), `logique-scolastique` → influence (interprétation), `algebre-des-groupes` → influence (l’algèbre symbolique anglaise, fait), `logarithmes-et-calcul-numerique` → filiation (machines, fait).

**`theorie-des-ensembles`** — Théorie des ensembles et infini actuel · dixneuvieme · { start: 1872, end: 1914 } · ['fondements'] · ['Halle', 'Brunswick', 'Göttingen', 'Turin'] · map { x: 3650, y: 4150, size: 3, palette: { fill: '#d5f1e0', stroke: '#2b7348', accent: '#2a9254' } } · préfixe `tde-` · figures : `cantor` (Georg Cantor, [1845, 1918], Halle), `burali-forti` (Cesare Burali-Forti, [1861, 1931], Turin), `bernstein` (Felix Bernstein, [1878, 1956], Halle et Göttingen), `zermelo` (Ernst Zermelo, [1871, 1953], Göttingen, Zurich et Fribourg) · résultats : `non-denombrabilite-des-reels` (Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen : les réels ne sont pas dénombrables, 1874, theoreme), `hypothese-du-continu` (Hypothèse du continu, 1878, conjecture), `grundlagen-einer-allgemeinen-mannigfaltigkeitslehre` (Grundlagen einer allgemeinen Mannigfaltigkeitslehre : les ordinaux transfinis, 1883, texte), `was-sind-und-was-sollen-die-zahlen` (Was sind und was sollen die Zahlen ?, 1888, texte, `dedekind`), `argument-diagonal` (Argument diagonal et théorème de Cantor, 1891, theoreme), `paradoxe-de-burali-forti` (Paradoxe de Burali-Forti, 1897, probleme), `theoreme-de-cantor-bernstein` (Théorème de Cantor–Bernstein, 1897, theoreme), `paradoxe-de-russell` (Paradoxe de Russell, 1901, probleme, `russell`), `theoreme-du-bon-ordre` (Théorème du bon ordre et axiome du choix, 1904, theoreme), `axiomatisation-de-zermelo` (Untersuchungen über die Grundlagen der Mengenlehre, 1908, texte), `grundzuege-der-mengenlehre` (Grundzüge der Mengenlehre, 1914, texte, `hausdorff`) · related : `dedekind`, `russell`, `hausdorff`, `kronecker` (opposant), `weierstrass` · liens : `analyse-rigoureuse` → filiation (séries trigonométriques → ensembles dérivés, fait), `logique-mathematique-xixe` → affinité (Frege, Dedekind, interprétation), `arithmetique-gaussienne` → reaction (Kronecker contre Cantor, fait), `logique-antique` → reaction (l’infini actuel contre Aristote, interprétation).

### Fichier `structures-a.ts` — ère `structures` (1900 → 1960), nombres, formes, analyse

**`algebre-moderne`** — Algèbre moderne : de Hilbert à Noether · structures · { start: 1890, end: 1945 } · ['nombres'] · ['Göttingen', 'Berlin', 'Hambourg', 'Amsterdam'] · map { x: 4950, y: 430, size: 3, palette: { fill: '#eee2cd', stroke: '#6b5229', accent: '#8a6528' } } · préfixe `am-` · figures : `steinitz` (Ernst Steinitz, [1871, 1928], Berlin et Kiel), `wedderburn` (Joseph Wedderburn, [1882, 1948], Édimbourg et Princeton), `noether` (Emmy Noether, [1882, 1935], Erlangen, Göttingen et Bryn Mawr), `artin` (Emil Artin, [1898, 1962], Hambourg, Princeton), `krull` (Wolfgang Krull, [1899, 1971], Erlangen et Bonn), `van-der-waerden` (Bartel van der Waerden, [1903, 1996], Amsterdam, Groningue, Leipzig et Zurich) · résultats : `theoreme-de-la-base-de-hilbert` (Théorème de la base de Hilbert, 1890, theoreme, `hilbert`), `nullstellensatz` (Nullstellensatz, 1893, theoreme, `hilbert`), `petit-theoreme-de-wedderburn` (Tout corps fini est commutatif, 1905, theoreme), `theoreme-de-wedderburn-artin` (Structure des algèbres semi-simples, 1908, theoreme), `algebraische-theorie-der-koerper` (Algebraische Theorie der Körper, 1910, texte), `idealtheorie-in-ringbereichen` (Idealtheorie in Ringbereichen : les anneaux noethériens, 1921, texte), `theorie-des-ideaux-noether` (Décomposition primaire et condition de chaîne ascendante, 1921, concept), `moderne-algebra` (Moderne Algebra, 1930, texte), `theorie-de-galois-abstraite` (Galois Theory : l’exposé moderne, 1942, texte), `dimension-de-krull` (Dimension de Krull, 1937, concept) · related : `hilbert`, `dedekind` · liens : `algebre-des-groupes` → filiation (fait), `arithmetique-gaussienne` → filiation (Dedekind → Noether, fait), `theorie-des-ensembles` → influence (méthodes ensemblistes, interprétation).

**`theorie-des-nombres-xxe`** — Théorie des nombres au XXᵉ siècle : corps de classes et méthodes analytiques · structures · { start: 1896, end: 1960 } · ['nombres'] · ['Göttingen', 'Cambridge', 'Tokyo', 'Hambourg', 'Moscou', 'Princeton', 'Oslo'] · map { x: 5600, y: 600, size: 2, palette: { fill: '#ecddc6', stroke: '#644c26', accent: '#825f26' } } · préfixe `tnx-` · figures : `minkowski` (Hermann Minkowski, [1864, 1909], Königsberg, Zurich et Göttingen), `takagi` (Teiji Takagi, [1875, 1960], Tokyo), `hardy` (G. H. Hardy, [1877, 1947], Cambridge et Oxford), `littlewood` (John Edensor Littlewood, [1885, 1977], Cambridge), `ramanujan` (Srinivasa Ramanujan, [1887, 1920], Kumbakonam, Madras et Cambridge), `hecke` (Erich Hecke, [1887, 1947], Hambourg), `vinogradov` (Ivan Vinogradov, [1891, 1983], Leningrad et Moscou), `siegel` (Carl Ludwig Siegel, [1896, 1981], Francfort, Princeton et Göttingen), `hasse` (Helmut Hasse, [1898, 1979], Marbourg, Göttingen et Hambourg), `selberg` (Atle Selberg, [1917, 2007], Oslo et Princeton) · résultats : `geometrie-der-zahlen` (Geometrie der Zahlen, 1896, texte), `zahlbericht` (Zahlbericht, 1897, texte, `hilbert`), `lettre-de-ramanujan-a-hardy` (Lettre de Ramanujan à Hardy, 1913, texte), `methode-du-cercle` (Méthode du cercle, 1918, methode), `formule-asymptotique-des-partitions` (Formule asymptotique du nombre de partitions, 1918, theoreme), `theorie-du-corps-de-classes` (Théorie du corps de classes, 1920, theoreme), `principe-local-global-de-hasse` (Principe de Hasse (local-global), 1924, theoreme), `loi-de-reciprocite-d-artin` (Loi de réciprocité d’Artin, 1927, theoreme, `artin`), `theoreme-de-siegel` (Finitude des points entiers sur les courbes de genre ≥ 1, 1929, theoreme), `theoreme-de-vinogradov` (Théorème des trois nombres premiers, 1937, theoreme), `demonstration-elementaire-du-theoreme-des-nombres-premiers` (Démonstration élémentaire du théorème des nombres premiers, 1949, theoreme, authorName « Atle Selberg et Paul Erdős »), `formule-des-traces-de-selberg` (Formule des traces de Selberg, 1956, theoreme) · related : `hilbert`, `artin`, `weil`, `erdos` · liens : `arithmetique-gaussienne` → filiation (fait), `algebre-moderne` → influence (Artin, Hasse, Noether, fait), `analyse-rigoureuse` → influence (fonctions analytiques, fait).

**`topologie`** — Topologie : de l’Analysis situs aux groupes d’homotopie · structures · { start: 1895, end: 1960 } · ['formes'] · ['Paris', 'Bonn', 'Moscou', 'Princeton', 'Zurich', 'Varsovie'] · map { x: 4950, y: 1300, size: 3, palette: { fill: '#cddeee', stroke: '#294a6b', accent: '#28598a' } } · préfixe `top-` · figures : `poincare` (Henri Poincaré, [1854, 1912], Nancy et Paris), `hausdorff` (Felix Hausdorff, [1868, 1942], Leipzig, Greifswald et Bonn), `lefschetz` (Solomon Lefschetz, [1884, 1972], Moscou, Kansas et Princeton), `alexander` (James Waddell Alexander, [1888, 1971], Princeton), `hopf` (Heinz Hopf, [1894, 1971], Berlin et Zurich), `alexandrov` (Pavel Alexandrov, [1896, 1982], Moscou), `urysohn` (Pavel Urysohn, [1898, 1924], Moscou), `hurewicz` (Witold Hurewicz, [1904, 1956], Vienne, Amsterdam et Princeton), `whitney` (Hassler Whitney, [1907, 1989], Harvard et Princeton), `steenrod` (Norman Steenrod, [1910, 1971], Princeton) · résultats : `analysis-situs` (Analysis situs, 1895, texte), `conjecture-de-poincare` (Conjecture de Poincaré, 1904, conjecture), `theoreme-du-point-fixe-de-brouwer` (Théorème du point fixe de Brouwer, 1911, theoreme, `brouwer`), `invariance-de-la-dimension` (Invariance de la dimension et du domaine, 1911, theoreme, `brouwer`), `espaces-topologiques-de-hausdorff` (Espaces topologiques (axiomes de voisinage), 1914, concept), `lemme-d-urysohn` (Lemme d’Urysohn, 1925, theoreme), `formule-des-points-fixes-de-lefschetz` (Formule des points fixes de Lefschetz, 1926, theoreme), `polynome-d-alexander` (Polynôme d’Alexander, 1928, concept), `fibration-de-hopf` (Fibration de Hopf, 1931, theoreme), `groupes-d-homotopie` (Groupes d’homotopie supérieurs, 1935, concept), `theoreme-de-plongement-de-whitney` (Théorème de plongement de Whitney, 1936, theoreme), `axiomes-d-eilenberg-steenrod` (Axiomes d’Eilenberg–Steenrod, 1945, texte, `eilenberg`), `classes-caracteristiques` (Classes de Stiefel–Whitney et de Chern, 1935 approx, concept) · related : `brouwer`, `eilenberg`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (Riemann, Möbius, fait), `geometries-non-euclidiennes` → filiation (Riemann, Klein, Poincaré, fait), `theorie-des-ensembles` → filiation (Hausdorff, fait), `algebre-moderne` → influence (Noether et les groupes d’homologie, fait).

**`geometrie-algebrique-classique`** — Géométrie algébrique : de l’école italienne à Weil · structures · { start: 1890, end: 1955 } · ['formes', 'nombres'] · ['Rome', 'Bologne', 'Baltimore', 'Cambridge', 'Chicago', 'São Paulo'] · map { x: 5600, y: 1550, size: 2, palette: { fill: '#cde2ee', stroke: '#29536b', accent: '#28668a' } } · préfixe `gac-` · figures : `castelnuovo` (Guido Castelnuovo, [1865, 1952], Rome), `enriques` (Federigo Enriques, [1871, 1946], Bologne et Rome), `severi` (Francesco Severi, [1879, 1961], Padoue et Rome), `zariski` (Oscar Zariski, [1899, 1986], Rome, Baltimore et Harvard), `hodge` (William Hodge, [1903, 1975], Cambridge), `weil` (André Weil, [1906, 1998], Paris, São Paulo, Chicago et Princeton) · résultats : `critere-de-rationalite-de-castelnuovo` (Critère de rationalité de Castelnuovo, 1894, theoreme), `classification-des-surfaces-algebriques` (Classification d’Enriques des surfaces algébriques, 1914, theoreme), `theoreme-de-lefschetz-sur-les-sections-hyperplanes` (Théorème de Lefschetz sur les sections hyperplanes, 1924, theoreme, `lefschetz`), `algebraic-surfaces` (Algebraic Surfaces : la mise à l’épreuve de l’école italienne, 1935, texte), `theorie-de-hodge` (Théorie de Hodge, 1941, concept), `hypothese-de-riemann-pour-les-courbes` (Hypothèse de Riemann pour les courbes sur un corps fini, 1948, theoreme), `foundations-of-algebraic-geometry` (Foundations of Algebraic Geometry, 1946, texte), `conjectures-de-weil` (Conjectures de Weil, 1949, conjecture), `conjecture-de-hodge` (Conjecture de Hodge, 1950, conjecture), `topologie-de-zariski` (Topologie de Zariski, 1944 approx, concept) · related : `lefschetz`, `van-der-waerden`, `noether` · liens : `geometrie-projective-et-algebrique` → filiation (fait), `algebre-moderne` → influence (Zariski, van der Waerden, fait), `topologie` → influence (Lefschetz, Hodge, fait), `theorie-des-nombres-xxe` → affinité (interprétation).

**`analyse-fonctionnelle`** — Analyse fonctionnelle et théorie de la mesure · structures · { start: 1900, end: 1955 } · ['analyse'] · ['Paris', 'Stockholm', 'Göttingen', 'Budapest', 'Lwów', 'Princeton'] · map { x: 4950, y: 2200, size: 3, palette: { fill: '#decdee', stroke: '#4a296b', accent: '#59288a' } } · préfixe `af-` · figures : `fredholm` (Ivar Fredholm, [1866, 1927], Stockholm), `lebesgue` (Henri Lebesgue, [1875, 1941], Nancy, Rennes et Paris), `frechet` (Maurice Fréchet, [1878, 1973], Paris et Strasbourg), `riesz-frigyes` (Frigyes Riesz, [1880, 1956], Kolozsvár, Szeged et Budapest), `banach` (Stefan Banach, [1892, 1945], Lwów), `steinhaus` (Hugo Steinhaus, [1887, 1972], Lwów et Wrocław), `von-neumann` (John von Neumann, [1903, 1957], Budapest, Berlin et Princeton), `schwartz` (Laurent Schwartz, [1915, 2002], Paris, Nancy) · résultats : `mesure-de-borel` (Mesure des ensembles boréliens, 1898, concept, `borel`), `integrale-de-lebesgue` (Intégrale de Lebesgue, 1902, concept), `equations-integrales-de-fredholm` (Alternative de Fredholm, 1903, theoreme), `lecons-sur-l-integration` (Leçons sur l’intégration et la recherche des fonctions primitives, 1904, texte), `espaces-metriques` (Espaces métriques, 1906, concept), `theoreme-de-representation-de-riesz` (Théorème de représentation de Riesz, 1909, theoreme), `theoreme-de-riesz-fischer` (Théorème de Riesz–Fischer, 1907, theoreme), `espaces-de-hilbert-abstraits` (Axiomatisation des espaces de Hilbert, 1929, concept), `theoreme-de-hahn-banach` (Théorème de Hahn–Banach, 1927, theoreme), `theoreme-de-banach-steinhaus` (Théorème de Banach–Steinhaus, 1927, theoreme), `theorie-des-operations-lineaires` (Théorie des opérations linéaires, 1932, texte), `mathematische-grundlagen-der-quantenmechanik` (Mathematische Grundlagen der Quantenmechanik, 1932, texte), `theorie-des-distributions` (Théorie des distributions, 1950, texte) · related : `borel`, `hilbert` · liens : `analyse-rigoureuse` → filiation (fait), `physique-mathematique-xixe` → filiation (équations intégrales, fait), `theorie-des-ensembles` → influence (mesure, fait), `probabilites-modernes` → affinité (interprétation).

**`edp-et-physique-mathematique`** — Équations aux dérivées partielles et physique mathématique du XXᵉ siècle · structures · { start: 1900, end: 1960 } · ['analyse'] · ['Paris', 'Padoue', 'Göttingen', 'Zurich', 'Moscou', 'New York'] · map { x: 5600, y: 2450, size: 2, palette: { fill: '#ddd1f0', stroke: '#442a6f', accent: '#50298e' } } · préfixe `edp-` · figures : `hadamard` (Jacques Hadamard, [1865, 1963], Paris), `levi-civita` (Tullio Levi-Civita, [1873, 1941], Padoue et Rome), `weyl` (Hermann Weyl, [1885, 1955], Göttingen, Zurich et Princeton), `courant` (Richard Courant, [1888, 1972], Göttingen et New York), `schauder` (Juliusz Schauder, [1899, 1943], Lwów), `douglas` (Jesse Douglas, [1897, 1965], New York), `leray` (Jean Leray, [1906, 1998], Nancy et Paris), `sobolev` (Sergueï Sobolev, [1908, 1989], Leningrad, Moscou et Novossibirsk) · résultats : `calcul-differentiel-absolu` (Méthodes de calcul différentiel absolu, 1900, texte), `problemes-bien-poses` (Problèmes bien posés au sens d’Hadamard, 1902, concept), `loi-de-weyl` (Loi de Weyl sur les valeurs propres, 1911, theoreme), `theoreme-de-noether` (Théorème de Noether : symétries et lois de conservation, 1918, theoreme, `noether`), `raum-zeit-materie` (Raum, Zeit, Materie, 1918, texte), `methoden-der-mathematischen-physik` (Methoden der mathematischen Physik, 1924, texte), `theoreme-du-point-fixe-de-schauder` (Théorème du point fixe de Schauder, 1930, theoreme), `probleme-de-plateau` (Solution du problème de Plateau, 1931, theoreme), `solutions-faibles-de-navier-stokes` (Solutions faibles des équations de Navier–Stokes, 1934, theoreme), `espaces-de-sobolev` (Espaces de Sobolev, 1938, concept), `methode-des-elements-finis-courant` (Variational methods for the solution of problems of equilibrium and vibrations, 1943, methode), `theorie-des-faisceaux` (Faisceaux et suite spectrale, 1946, concept) · related : `noether`, `hilbert`, `poincare` · liens : `physique-mathematique-xixe` → filiation (fait), `analyse-fonctionnelle` → filiation (fait), `geometries-non-euclidiennes` → influence (Riemann → relativité, fait), `topologie` → influence (Leray, Schauder, fait).

### Fichier `structures-b.ts` — ère `structures` (1900 → 1960), hasard et fondements

**`probabilites-modernes`** — Probabilités axiomatisées : de Borel à Kolmogorov · structures · { start: 1900, end: 1955 } · ['hasard'] · ['Paris', 'Saint-Pétersbourg', 'Moscou', 'Cambridge (Mass.)', 'Princeton', 'Tokyo'] · map { x: 4950, y: 3100, size: 3, palette: { fill: '#f0dad1', stroke: '#6f3f2a', accent: '#8e4829' } } · préfixe `pmo-` · figures : `bachelier` (Louis Bachelier, [1870, 1946], Paris et Besançon), `borel` (Émile Borel, [1871, 1956], Paris), `markov` (Andreï Markov, [1856, 1922], Saint-Pétersbourg), `levy` (Paul Lévy, [1886, 1971], Paris), `wiener` (Norbert Wiener, [1894, 1964], Cambridge (Mass.)), `khintchine` (Alexandre Khintchine, [1894, 1959], Moscou), `kolmogorov` (Andreï Kolmogorov, [1903, 1987], Moscou), `feller` (William Feller, [1906, 1970], Zagreb, Stockholm et Princeton), `doob` (Joseph Doob, [1910, 2004], Urbana), `ito` (Kiyosi Itô, [1915, 2008], Tokyo et Kyoto) · résultats : `theorie-de-la-speculation` (Théorie de la spéculation, 1900, texte), `chaines-de-markov` (Chaînes de Markov, 1906, concept), `loi-forte-des-grands-nombres` (Loi forte des grands nombres, 1909, theoreme), `processus-de-wiener` (Construction mathématique du mouvement brownien, 1923, theoreme), `loi-du-logarithme-itere` (Loi du logarithme itéré, 1924, theoreme), `lois-stables` (Lois stables et calcul des probabilités, 1925, concept), `grundbegriffe-der-wahrscheinlichkeitsrechnung` (Grundbegriffe der Wahrscheinlichkeitsrechnung : les axiomes, 1933, texte), `theoreme-d-extension-de-kolmogorov` (Théorème d’extension de Kolmogorov, 1933, theoreme), `martingales` (Martingales, 1940, concept), `calcul-stochastique-d-ito` (Intégrale et formule d’Itô, 1944, concept), `an-introduction-to-probability-theory` (An Introduction to Probability Theory and Its Applications, 1950, texte), `theoreme-de-donsker` (Principe d’invariance de Donsker, 1951, theoreme, authorName « Monroe Donsker ») · related : `lebesgue`, `frechet`, `chebyshev` · liens : `statistique-xixe` → filiation (Tchebychev → Markov, fait), `analyse-fonctionnelle` → filiation (mesure de Lebesgue, fait), `probabilites-classiques` → filiation (Laplace, interprétation), `physique-mathematique-xixe` → influence (brownien, Einstein, fait).

**`statistique-mathematique`** — Statistique mathématique, décision et jeux · structures · { start: 1908, end: 1960 } · ['hasard'] · ['Dublin', 'Rothamsted', 'Londres', 'Berkeley', 'New York', 'Princeton', 'Leningrad'] · map { x: 5600, y: 3350, size: 2, palette: { fill: '#f1dbd5', stroke: '#733b2b', accent: '#92412a' } } · préfixe `sm-` · figures : `gosset` (William Sealy Gosset, dit « Student », [1876, 1937], Dublin), `fisher` (Ronald Fisher, [1890, 1962], Rothamsted, Londres et Cambridge), `neyman` (Jerzy Neyman, [1894, 1981], Varsovie, Londres et Berkeley), `pearson-egon` (Egon Pearson, [1895, 1980], Londres), `wald` (Abraham Wald, [1902, 1950], Vienne et New York), `cramer` (Harald Cramér, [1893, 1985], Stockholm), `rao` (C. R. Rao, [1920, 2023], Calcutta et State College), `morgenstern` (Oskar Morgenstern, [1902, 1977], Vienne et Princeton), `dantzig` (George Dantzig, [1914, 2005], Washington, Berkeley et Stanford), `kantorovich` (Leonid Kantorovitch, [1912, 1986], Leningrad), `nash` (John Nash, [1928, 2015], Princeton) · résultats : `the-probable-error-of-a-mean` (The Probable Error of a Mean : la loi de Student, 1908, texte), `maximum-de-vraisemblance` (Maximum de vraisemblance, 1922, methode), `statistical-methods-for-research-workers` (Statistical Methods for Research Workers, 1925, texte), `theoreme-du-minimax` (Théorème du minimax, 1928, theoreme, `von-neumann`), `lemme-de-neyman-pearson` (Lemme de Neyman–Pearson, 1933, theoreme), `the-design-of-experiments` (The Design of Experiments, 1935, texte), `intervalles-de-confiance` (Intervalles de confiance, 1937, concept), `methodes-mathematiques-en-organisation-de-la-production` (Méthodes mathématiques d’organisation et de planification de la production, 1939, texte), `theory-of-games-and-economic-behavior` (Theory of Games and Economic Behavior, 1944, texte), `borne-de-cramer-rao` (Borne de Cramér–Rao, 1945, theoreme), `analyse-sequentielle` (Sequential Analysis, 1947, texte), `algorithme-du-simplexe` (Algorithme du simplexe, 1947, methode), `equilibre-de-nash` (Équilibre de Nash, 1950, theoreme), `statistical-decision-functions` (Statistical Decision Functions, 1950, texte) · related : `von-neumann`, `pearson-karl`, `borel` · liens : `statistique-xixe` → filiation (Pearson → Fisher, fait), `probabilites-modernes` → filiation (fait), `analyse-fonctionnelle` → influence (von Neumann, fait).

**`calculabilite`** — Logique et calculabilité : Gödel, Church, Turing · structures · { start: 1928, end: 1956 } · ['fondements', 'hasard'] · ['Vienne', 'Princeton', 'Cambridge', 'Göttingen', 'New York', 'Murray Hill'] · map { x: 5350, y: 3900, size: 3, palette: { fill: '#c6ecd2', stroke: '#266439', accent: '#268243' } } · préfixe `cal-` · figures : `post` (Emil Post, [1897, 1954], New York), `herbrand` (Jacques Herbrand, [1908, 1931], Paris), `godel` (Kurt Gödel, [1906, 1978], Vienne et Princeton), `church` (Alonzo Church, [1903, 1995], Princeton), `kleene` (Stephen Kleene, [1909, 1994], Princeton et Madison), `turing` (Alan Turing, [1912, 1954], Cambridge, Princeton, Bletchley Park et Manchester), `shannon` (Claude Shannon, [1916, 2001], Ann Arbor, MIT et Murray Hill) · résultats : `entscheidungsproblem` (Entscheidungsproblem, 1928, probleme, `hilbert`), `theoreme-de-completude` (Théorème de complétude de Gödel, 1930, theoreme), `theoreme-de-herbrand` (Théorème de Herbrand, 1930, theoreme), `theoremes-d-incompletude` (Über formal unentscheidbare Sätze : les théorèmes d’incomplétude, 1931, theoreme), `lambda-calcul` (Lambda-calcul, 1932, concept), `fonctions-recursives-generales` (Fonctions récursives générales, 1934, concept), `these-de-church` (Thèse de Church–Turing, 1936, concept), `on-computable-numbers` (On Computable Numbers, with an Application to the Entscheidungsproblem, 1936, texte), `probleme-de-l-arret` (Indécidabilité du problème de l’arrêt, 1936, theoreme), `machine-de-turing-universelle` (Machine universelle, 1936, concept), `a-symbolic-analysis-of-relay-and-switching-circuits` (A Symbolic Analysis of Relay and Switching Circuits, 1938, texte), `first-draft-of-a-report-on-the-edvac` (First Draft of a Report on the EDVAC, 1945, texte, `von-neumann`), `a-mathematical-theory-of-communication` (A Mathematical Theory of Communication, 1948, texte), `hierarchie-arithmetique` (Hiérarchie arithmétique de Kleene–Mostowski, 1943, concept) · related : `hilbert`, `von-neumann`, `ackermann` · liens : `fondements-hilbert-brouwer` → filiation (le programme de Hilbert et sa réfutation, fait), `logique-mathematique-xixe` → filiation (Frege, Peano, Boole, fait), `theorie-des-ensembles` → influence (diagonale de Cantor, fait).

**`fondements-hilbert-brouwer`** — Programme de Hilbert, logicisme et intuitionnisme · structures · { start: 1899, end: 1940 } · ['fondements'] · ['Göttingen', 'Cambridge', 'Amsterdam', 'Varsovie', 'Oslo'] · map { x: 4850, y: 4100, size: 2, palette: { fill: '#cdeed6', stroke: '#296b3a', accent: '#288a42' } } · préfixe `fhb-` · figures : `hilbert` (David Hilbert, [1862, 1943], Königsberg et Göttingen), `whitehead` (Alfred North Whitehead, [1861, 1947], Cambridge, Londres et Harvard), `russell` (Bertrand Russell, [1872, 1970], Cambridge), `brouwer` (L. E. J. Brouwer, [1881, 1966], Amsterdam et Blaricum), `lowenheim` (Leopold Löwenheim, [1878, 1957], Berlin), `skolem` (Thoralf Skolem, [1887, 1963], Oslo), `fraenkel` (Abraham Fraenkel, [1891, 1965], Marbourg, Kiel et Jérusalem), `bernays` (Paul Bernays, [1888, 1977], Göttingen et Zurich), `ackermann` (Wilhelm Ackermann, [1896, 1962], Göttingen et Lüdenscheid), `tarski` (Alfred Tarski, [1901, 1983], Varsovie et Berkeley), `gentzen` (Gerhard Gentzen, [1909, 1945], Göttingen et Prague) · résultats : `grundlagen-der-geometrie` (Grundlagen der Geometrie, 1899, texte), `problemes-de-hilbert` (Les 23 problèmes de Hilbert, 1900, probleme), `the-principles-of-mathematics` (The Principles of Mathematics, 1903, texte), `these-de-brouwer` (Over de grondslagen der wiskunde : l’intuitionnisme, 1907, texte), `rejet-du-tiers-exclu` (De onbetrouwbaarheid der logische principes : le tiers exclu récusé, 1908, concept), `principia-mathematica` (Principia Mathematica, 1910, texte), `theoreme-de-lowenheim-skolem` (Théorème de Löwenheim–Skolem, 1915, theoreme), `das-kontinuum` (Das Kontinuum, 1918, texte, `weyl`), `axiomes-de-zermelo-fraenkel` (Axiome de remplacement et système ZF, 1922, concept), `paradoxe-de-skolem` (Paradoxe de Skolem, 1922, probleme), `paradoxe-de-banach-tarski` (Paradoxe de Banach–Tarski, 1924, theoreme, `banach`), `ueber-das-unendliche` (Über das Unendliche : le programme de Hilbert, 1925, texte), `fonction-d-ackermann` (Fonction d’Ackermann, 1928, concept), `le-concept-de-verite` (Le concept de vérité dans les langages formalisés, 1933, texte), `grundlagen-der-mathematik` (Grundlagen der Mathematik, 1934, texte), `consistance-de-l-arithmetique` (Consistance de l’arithmétique par induction transfinie, 1936, theoreme) · related : `weyl`, `banach`, `zermelo`, `poincare`, `kronecker`, `godel` · liens : `theorie-des-ensembles` → filiation (fait), `logique-mathematique-xixe` → filiation (Frege → Russell, fait), `geometries-non-euclidiennes` → filiation (axiomatique de Pasch, Hilbert, fait), `logique-antique` → affinité (interprétation).

**`bourbaki`** — Bourbaki et le structuralisme mathématique · structures · { start: 1934, end: 1970 } · ['fondements', 'nombres', 'formes'] · ['Paris', 'Nancy', 'Strasbourg', 'Chicago', 'Princeton'] · map { x: 5800, y: 4250, size: 2, palette: { fill: '#cdeed7', stroke: '#296b3c', accent: '#288a44' } } · préfixe `bb-` · figures : `delsarte` (Jean Delsarte, [1903, 1968], Nancy), `cartan-henri` (Henri Cartan, [1904, 2008], Strasbourg et Paris), `dieudonne` (Jean Dieudonné, [1906, 1992], Nancy, Chicago et Nice), `chevalley` (Claude Chevalley, [1909, 1984], Princeton, Columbia et Paris), `ehresmann` (Charles Ehresmann, [1905, 1979], Strasbourg et Paris), `eilenberg` (Samuel Eilenberg, [1913, 1998], Varsovie et Columbia), `mac-lane` (Saunders Mac Lane, [1909, 2005], Harvard et Chicago) · résultats : `congres-de-besse` (Congrès fondateur de Besse-en-Chandesse, 1935, texte), `elements-de-mathematique` (Éléments de mathématique : premier fascicule, 1939, texte), `general-theory-of-natural-equivalences` (General Theory of Natural Equivalences : les catégories, 1945, texte), `l-architecture-des-mathematiques` (L’architecture des mathématiques, 1948, texte, authorName « Nicolas Bourbaki »), `structures-meres` (Structures mères : ordre, algébrique, topologique, 1948, concept), `seminaire-bourbaki` (Séminaire Bourbaki, 1948, methode), `seminaire-cartan` (Séminaire Cartan, 1948, methode), `theoremes-a-et-b` (Théorèmes A et B de Cartan, 1951, theoreme), `groupes-de-chevalley` (Sur certains groupes simples : les groupes de Chevalley, 1955, theoreme), `theorie-des-ensembles-bourbaki` (Théorie des ensembles (Livre I), 1954, texte, authorName « Nicolas Bourbaki ») · related : `weil`, `schwartz`, `leray`, `serre`, `grothendieck` · liens : `algebre-moderne` → filiation (van der Waerden comme modèle, fait), `fondements-hilbert-brouwer` → filiation (axiomatique hilbertienne, fait), `topologie` → filiation, `analyse-fonctionnelle` → influence, `analyse-eulerienne` → reaction (contre le « cours Goursat », interprétation).

### Fichier `contemporain-a.ts` — ère `contemporain` (1960 → aujourd’hui), nombres, formes, analyse

Les figures vivantes ont `years: [naissance, null]`. Les périodes des domaines sont ouvertes (`end: null`). Les résultats peuvent aller jusqu’à 2025.

**`theorie-des-nombres-contemporaine`** — Théorie des nombres contemporaine : de Langlands à Wiles · contemporain · { start: 1955, end: null } · ['nombres'] · ['Princeton', 'Tokyo', 'Harvard', 'Bonn', 'Cambridge', 'Oxford', 'Durham (New Hampshire)'] · map { x: 6300, y: 430, size: 3, palette: { fill: '#ede1c9', stroke: '#685227', accent: '#866727' } } · préfixe `tnc-` · figures : `taniyama` (Yutaka Taniyama, [1927, 1958], Tokyo), `shimura` (Gorō Shimura, [1930, 2019], Tokyo et Princeton), `tate` (John Tate, [1925, 2019], Harvard et Austin), `iwasawa` (Kenkichi Iwasawa, [1917, 1998], Tokyo, MIT et Princeton), `baker` (Alan Baker, [1939, 2018], Cambridge), `langlands` (Robert Langlands, [1936, null], Princeton), `mazur` (Barry Mazur, [1937, null], Harvard), `faltings` (Gerd Faltings, [1954, null], Wuppertal, Princeton et Bonn), `wiles` (Andrew Wiles, [1953, null], Princeton et Oxford), `taylor-richard` (Richard Taylor, [1962, null], Oxford, Harvard et Stanford), `zhang-yitang` (Yitang Zhang, [1955, null], Durham (New Hampshire) et Santa Barbara), `bhargava` (Manjul Bhargava, [1974, null], Princeton) · résultats : `conjecture-de-modularite` (Conjecture de Taniyama–Shimura–Weil, 1955 approx, conjecture, `taniyama`), `theorie-d-iwasawa` (Théorie d’Iwasawa, 1959, concept), `conjecture-de-birch-et-swinnerton-dyer` (Conjecture de Birch et Swinnerton-Dyer, 1965, conjecture, authorName « Bryan Birch et Peter Swinnerton-Dyer », sans mathematicianId), `theoreme-de-baker` (Formes linéaires en logarithmes, 1966, theoreme), `lettre-de-langlands-a-weil` (Lettre à André Weil : le programme de Langlands, 1967, texte), `theoreme-de-mazur` (Théorème de Mazur sur la torsion des courbes elliptiques, 1977, theoreme), `theoreme-de-faltings` (Théorème de Faltings (conjecture de Mordell), 1983, theoreme), `demonstration-du-dernier-theoreme-de-fermat` (Modular elliptic curves and Fermat’s Last Theorem, 1995, theoreme, authorName « Andrew Wiles, avec Richard Taylor »), `theoreme-de-modularite` (Théorème de modularité complet, 2001, theoreme, authorName « Christophe Breuil, Brian Conrad, Fred Diamond et Richard Taylor », `taylor-richard`), `theoreme-de-green-tao` (Théorème de Green–Tao, 2004, theoreme, authorName « Ben Green et Terence Tao », `tao`), `lois-de-composition-superieures` (Lois de composition supérieures, 2004, theoreme, `bhargava`), `ecarts-bornes-entre-nombres-premiers` (Écarts bornés entre nombres premiers consécutifs, 2013, theoreme) · related : `tao`, `deligne`, `serre`, `weil`, `selberg` · liens : `theorie-des-nombres-xxe` → filiation (fait), `theorie-des-nombres-fermat` → filiation (Wiles, fait), `geometrie-algebrique-moderne` → influence (Grothendieck, Deligne, fait), `arithmetique-gaussienne` → filiation (Riemann, Dirichlet, fait).

**`algebre-contemporaine`** — Algèbre contemporaine : groupes finis simples, représentations et groupes quantiques · contemporain · { start: 1955, end: null } · ['nombres', 'formes'] · ['Chicago', 'Cambridge', 'New Brunswick', 'Princeton', 'Moscou', 'Bonn', 'Pasadena'] · map { x: 7000, y: 560, size: 2, palette: { fill: '#f1ead5', stroke: '#73612b', accent: '#92782a' } } · préfixe `alc-` · figures : `feit` (Walter Feit, [1930, 2004], Yale), `thompson-john` (John G. Thompson, [1932, null], Chicago, Cambridge et Gainesville), `gorenstein` (Daniel Gorenstein, [1923, 1992], New Brunswick), `tits` (Jacques Tits, [1930, 2021], Bruxelles, Bonn et Paris), `conway` (John Horton Conway, [1937, 2020], Cambridge et Princeton), `aschbacher` (Michael Aschbacher, [1944, null], Pasadena), `kac` (Victor Kac, [1943, null], Moscou et MIT), `lusztig` (George Lusztig, [1946, null], MIT), `drinfeld` (Vladimir Drinfeld, [1954, null], Kharkiv et Chicago), `borcherds` (Richard Borcherds, [1959, null], Cambridge et Berkeley), `zelmanov` (Efim Zelmanov, [1955, null], Novossibirsk et San Diego) · résultats : `theoreme-de-feit-thompson` (Théorème de Feit–Thompson : tout groupe fini d’ordre impair est résoluble, 1963, theoreme, authorName « Walter Feit et John G. Thompson », `thompson-john`), `immeubles-de-tits` (Immeubles de Tits, 1965 approx, concept), `groupes-de-conway` (Groupes de Conway et réseau de Leech, 1968, theoreme), `algebres-de-kac-moody` (Algèbres de Kac–Moody, 1968, concept, authorName « Victor Kac ; Robert Moody »), `programme-de-gorenstein` (Programme de classification des groupes finis simples, 1972, probleme), `monstrous-moonshine` (Monstrous Moonshine, 1979, conjecture, authorName « John Conway et Simon Norton », `conway`), `polynomes-de-kazhdan-lusztig` (Polynômes de Kazhdan–Lusztig, 1979, concept, authorName « David Kazhdan et George Lusztig », `lusztig`), `construction-du-monstre` (Construction du groupe Monstre, 1982, theoreme, authorName « Robert Griess », sans mathematicianId), `classification-des-groupes-finis-simples` (Classification des groupes finis simples : l’annonce, 1983, theoreme, `gorenstein`), `groupes-quantiques` (Groupes quantiques, 1985, concept, authorName « Vladimir Drinfeld ; Michio Jimbo », `drinfeld`), `probleme-restreint-de-burnside` (Problème restreint de Burnside, 1991, theoreme), `demonstration-du-moonshine` (Démonstration de Monstrous Moonshine, 1992, theoreme, `borcherds`), `groupes-quasi-minces` (Classification des groupes quasi-minces : la classification achevée, 2004, theoreme, authorName « Michael Aschbacher et Stephen Smith », `aschbacher`) · related : `chevalley`, `serre`, `langlands`, `witten` · liens : `algebre-moderne` → filiation (fait), `algebre-des-groupes` → filiation (Galois, Jordan, Sylow, Burnside, fait), `bourbaki` → filiation (Chevalley, Tits, fait), `theorie-des-nombres-contemporaine` → affinité (Langlands, interprétation), `topologie-et-geometrie-contemporaines` → influence (Witten, moonshine et physique, interprétation).

**`geometrie-algebrique-moderne`** — Géométrie algébrique moderne : schémas, cohomologie et motifs · contemporain · { start: 1955, end: null } · ['formes', 'nombres'] · ['Paris', 'Bures-sur-Yvette', 'Princeton', 'Harvard', 'Kyoto', 'Bonn'] · map { x: 6300, y: 1300, size: 3, palette: { fill: '#cdddee', stroke: '#29486b', accent: '#28568a' } } · préfixe `gam-` · figures : `serre` (Jean-Pierre Serre, [1926, null], Paris), `grothendieck` (Alexandre Grothendieck, [1928, 2014], Paris, Bures-sur-Yvette et Montpellier), `hironaka` (Heisuke Hironaka, [1931, null], Kyoto et Harvard), `mumford` (David Mumford, [1937, null], Harvard et Brown), `deligne` (Pierre Deligne, [1944, null], Bures-sur-Yvette et Princeton), `mori` (Shigefumi Mori, [1951, null], Kyoto), `kontsevich` (Maxim Kontsevich, [1964, null], Bures-sur-Yvette), `voevodsky` (Vladimir Voevodsky, [1966, 2017], Princeton) · résultats : `faisceaux-algebriques-coherents` (Faisceaux algébriques cohérents (FAC), 1955, texte), `gaga` (Géométrie algébrique et géométrie analytique (GAGA), 1956, theoreme), `tohoku` (Sur quelques points d’algèbre homologique (« Tôhoku »), 1957, texte), `theoreme-de-riemann-roch-grothendieck` (Théorème de Grothendieck–Riemann–Roch, 1957, theoreme), `schemas` (Schémas, 1960, concept), `elements-de-geometrie-algebrique` (Éléments de géométrie algébrique (EGA), 1960, texte, authorName « Alexandre Grothendieck, avec Jean Dieudonné »), `cohomologie-etale` (Topologies de Grothendieck et cohomologie étale, 1963, concept), `resolution-des-singularites` (Résolution des singularités en caractéristique zéro, 1964, theoreme), `motifs` (Motifs, 1964 approx, concept), `geometric-invariant-theory` (Geometric Invariant Theory, 1965, texte), `demonstration-des-conjectures-de-weil` (La conjecture de Weil I, 1974, theoreme), `programme-du-modele-minimal` (Programme du modèle minimal en dimension 3, 1988, theoreme), `symetrie-miroir-homologique` (Symétrie miroir homologique, 1994, conjecture), `conjecture-de-milnor-demontree` (Conjecture de Milnor sur la K-théorie, 1996, theoreme) · related : `weil`, `zariski`, `cartan-henri`, `dieudonne`, `hodge` · liens : `geometrie-algebrique-classique` → filiation (fait), `bourbaki` → filiation (Cartan, Dieudonné, Serre, Grothendieck, fait), `topologie` → influence (faisceaux de Leray, cohomologie, fait), `theorie-des-nombres-xxe` → influence (conjectures de Weil, fait).

**`topologie-et-geometrie-contemporaines`** — Topologie et géométrie contemporaines : variétés, nœuds et flots · contemporain · { start: 1956, end: null } · ['formes'] · ['Princeton', 'Berkeley', 'Oxford', 'Bures-sur-Yvette', 'Saint-Pétersbourg', 'Stony Brook', 'Stanford'] · map { x: 7000, y: 1500, size: 3, palette: { fill: '#c6daec', stroke: '#264764', accent: '#265782' } } · préfixe `tgc-` · figures : `thom` (René Thom, [1923, 2002], Strasbourg et Bures-sur-Yvette), `milnor` (John Milnor, [1931, null], Princeton et Stony Brook), `smale` (Stephen Smale, [1930, null], Berkeley), `atiyah` (Michael Atiyah, [1929, 2019], Oxford, Princeton et Édimbourg), `singer` (Isadore Singer, [1924, 2021], MIT), `thurston` (William Thurston, [1946, 2012], Princeton, Berkeley et Cornell), `freedman` (Michael Freedman, [1951, null], San Diego et Santa Barbara), `jones` (Vaughan Jones, [1952, 2020], Berkeley et Nashville), `donaldson` (Simon Donaldson, [1957, null], Oxford et Londres), `witten` (Edward Witten, [1951, null], Princeton), `hamilton-richard` (Richard Hamilton, [1943, 2024], Cornell et Columbia), `perelman` (Grigori Perelman, [1966, null], Saint-Pétersbourg), `mirzakhani` (Maryam Mirzakhani, [1977, 2017], Téhéran, Harvard et Stanford) · résultats : `cobordisme` (Théorie du cobordisme, 1954, theoreme), `spheres-exotiques` (Sphères exotiques de dimension 7, 1956, theoreme), `theoreme-du-h-cobordisme` (Théorème du h-cobordisme : la conjecture de Poincaré en dimension ≥ 5, 1961, theoreme), `theoreme-de-l-indice` (Théorème de l’indice d’Atiyah–Singer, 1963, theoreme, authorName « Michael Atiyah et Isadore Singer », `atiyah`), `stabilite-structurelle-et-morphogenese` (Stabilité structurelle et morphogenèse, 1972, texte), `conjecture-de-geometrisation` (Conjecture de géométrisation, 1982, conjecture), `flot-de-ricci` (Flot de Ricci, 1982, concept), `conjecture-de-poincare-en-dimension-4` (Conjecture de Poincaré topologique en dimension 4, 1982, theoreme), `theoreme-de-donaldson` (Théorème de Donaldson sur les formes d’intersection, 1983, theoreme), `polynome-de-jones` (Polynôme de Jones, 1984, concept), `quantum-field-theory-and-the-jones-polynomial` (Quantum Field Theory and the Jones Polynomial, 1989, texte), `demonstration-de-la-conjecture-de-poincare` (Démonstration des conjectures de Poincaré et de géométrisation, 2003, theoreme), `volumes-de-weil-petersson` (Croissance des géodésiques simples et volumes de Weil–Petersson, 2008, theoreme) · related : `poincare`, `whitney`, `hopf`, `grothendieck`, `kontsevich` · liens : `topologie` → filiation (fait), `geometries-non-euclidiennes` → filiation (Thurston et la géométrie hyperbolique, fait), `edp-et-physique-mathematique` → influence (théories de jauge, flot de Ricci, fait), `geometrie-algebrique-moderne` → affinité (interprétation).

**`systemes-dynamiques-et-chaos`** — Systèmes dynamiques, chaos et fractales · contemporain · { start: 1954, end: null } · ['analyse', 'hasard'] · ['Moscou', 'MIT', 'Berkeley', 'Bures-sur-Yvette', 'Los Alamos', 'Orsay'] · map { x: 6250, y: 2200, size: 2, palette: { fill: '#d9c6ec', stroke: '#452664', accent: '#542682' } } · préfixe `sdc-` · figures : `lorenz` (Edward Lorenz, [1917, 2008], MIT), `moser` (Jürgen Moser, [1928, 1999], New York et Zurich), `arnold` (Vladimir Arnold, [1937, 2010], Moscou et Paris), `sinai` (Yakov Sinaï, [1935, null], Moscou et Princeton), `ruelle` (David Ruelle, [1935, null], Bures-sur-Yvette), `mandelbrot` (Benoît Mandelbrot, [1924, 2010], Paris, Yorktown Heights et New Haven), `feigenbaum` (Mitchell Feigenbaum, [1944, 2019], Los Alamos et New York), `douady` (Adrien Douady, [1935, 2006], Paris et Orsay), `hubbard` (John Hubbard, [1945, null], Ithaca et Marseille), `yoccoz` (Jean-Christophe Yoccoz, [1957, 2016], Orsay et Paris) · résultats : `theoreme-kam` (Théorème KAM, 1954, theoreme, authorName « Andreï Kolmogorov, Vladimir Arnold et Jürgen Moser », `arnold`), `entropie-de-kolmogorov-sinai` (Entropie de Kolmogorov–Sinaï, 1959, concept), `fer-a-cheval-de-smale` (Fer à cheval de Smale, 1960 approx, concept, `smale`), `deterministic-nonperiodic-flow` (Deterministic Nonperiodic Flow : l’attracteur de Lorenz, 1963, texte), `diffusion-d-arnold` (Diffusion d’Arnold, 1964, concept), `on-the-nature-of-turbulence` (On the Nature of Turbulence : les attracteurs étranges, 1971, texte, authorName « David Ruelle et Floris Takens », `ruelle`), `period-three-implies-chaos` (Period Three Implies Chaos, 1975, theoreme, authorName « Tien-Yien Li et James Yorke », sans mathematicianId), `les-objets-fractals` (Les Objets fractals : forme, hasard et dimension, 1975, texte), `universalite-de-feigenbaum` (Universalité de Feigenbaum, 1978, theoreme), `ensemble-de-mandelbrot` (Ensemble de Mandelbrot, 1980, concept), `connexite-de-l-ensemble-de-mandelbrot` (Connexité de l’ensemble de Mandelbrot, 1982, theoreme, authorName « Adrien Douady et John Hubbard », `douady`), `condition-de-bruno-yoccoz` (Optimalité de la condition de Bruno pour la linéarisation, 1988 approx, theoreme) · related : `smale`, `kolmogorov`, `poincare`, `thom` · liens : `physique-mathematique-xixe` → filiation (Poincaré et le problème des trois corps, fait), `probabilites-modernes` → influence (Kolmogorov, théorie ergodique, fait), `topologie-et-geometrie-contemporaines` → influence (Smale, Thom, fait), `edp-et-physique-mathematique` → affinité (turbulence, interprétation).

**`analyse-contemporaine`** — Analyse contemporaine : EDP, analyse harmonique et transport optimal · contemporain · { start: 1957, end: null } · ['analyse'] · ['Princeton', 'Chicago', 'Lund', 'New York', 'Pise', 'Paris', 'Los Angeles'] · map { x: 6950, y: 2350, size: 2, palette: { fill: '#e0d5f1', stroke: '#472b73', accent: '#522a92' } } · préfixe `anc-` · figures : `calderon` (Alberto Calderón, [1920, 1998], Buenos Aires et Chicago), `nirenberg` (Louis Nirenberg, [1925, 2020], New York), `de-giorgi` (Ennio De Giorgi, [1928, 1996], Pise), `hormander` (Lars Hörmander, [1931, 2012], Lund et Princeton), `stein` (Elias Stein, [1931, 2018], Princeton), `fefferman` (Charles Fefferman, [1949, null], Princeton), `bourgain` (Jean Bourgain, [1954, 2018], Bruxelles, Bures-sur-Yvette et Princeton), `lions-pierre-louis` (Pierre-Louis Lions, [1956, null], Paris), `villani` (Cédric Villani, [1973, null], Lyon et Paris), `tao` (Terence Tao, [1975, null], Los Angeles) · résultats : `operateurs-de-calderon-zygmund` (Opérateurs de Calderón–Zygmund, 1952, concept, authorName « Alberto Calderón et Antoni Zygmund », `calderon`), `theoreme-de-plongement-de-nash` (Théorème de plongement isométrique de Nash, 1956, theoreme, `nash`), `regularite-de-de-giorgi-nash` (Régularité des solutions d’équations elliptiques (De Giorgi–Nash), 1957, theoreme, authorName « Ennio De Giorgi et John Nash », `de-giorgi`), `inegalites-de-gagliardo-nirenberg` (Inégalités de Gagliardo–Nirenberg, 1959, theoreme), `operateurs-pseudo-differentiels` (Opérateurs pseudo-différentiels, 1965, concept, authorName « Joseph Kohn, Louis Nirenberg et Lars Hörmander », `hormander`), `singular-integrals-stein` (Singular Integrals and Differentiability Properties of Functions, 1970, texte), `dualite-h1-bmo` (Dualité H¹–BMO, 1972, theoreme ; article des Acta Mathematica de Fefferman et Stein), `the-analysis-of-linear-partial-differential-operators` (The Analysis of Linear Partial Differential Operators, 1983, texte), `solutions-de-viscosite` (Solutions de viscosité des équations de Hamilton–Jacobi, 1983, concept, authorName « Michael Crandall et Pierre-Louis Lions », `lions-pierre-louis`), `methode-de-bourgain-nls` (Espaces de restriction et équations de Schrödinger non linéaires périodiques, 1993, methode), `probleme-de-la-regularite-de-navier-stokes` (Régularité des équations de Navier–Stokes : un problème du millénaire, 2000, probleme, authorName « Clay Mathematics Institute », sans mathematicianId), `transport-optimal-et-courbure-de-ricci` (Transport optimal et courbure de Ricci synthétique, 2006, theoreme, authorName « John Lott et Cédric Villani ; Karl-Theodor Sturm », `villani`), `amortissement-landau` (Amortissement Landau non linéaire, 2009, theoreme, authorName « Clément Mouhot et Cédric Villani », `villani`) · related : `nash`, `leray`, `sobolev`, `schwartz`, `courant` · liens : `edp-et-physique-mathematique` → filiation (fait), `analyse-fonctionnelle` → filiation (distributions, espaces de Sobolev, fait), `physique-mathematique-xixe` → influence (Fourier, fait), `probabilites-et-statistique-contemporaines` → affinité (interprétation).

### Fichier `contemporain-b.ts` — ère `contemporain` (1960 → aujourd’hui), hasard et fondements

**`combinatoire`** — Combinatoire, graphes et méthode probabiliste · contemporain · { start: 1947, end: null } · ['hasard', 'nombres'] · ['Budapest', 'Toronto', 'Waterloo', 'Urbana', 'Princeton', 'Cambridge', 'MIT'] · map { x: 6250, y: 3000, size: 2, palette: { fill: '#eccdc6', stroke: '#643126', accent: '#823726' } } · préfixe `comb-` · figures : `erdos` (Paul Erdős, [1913, 1996], Budapest et itinérant), `tutte` (William Tutte, [1917, 2002], Bletchley Park, Toronto et Waterloo), `renyi` (Alfréd Rényi, [1921, 1970], Budapest), `rota` (Gian-Carlo Rota, [1932, 1999], MIT), `haken` (Wolfgang Haken, [1928, 2022], Urbana), `appel` (Kenneth Appel, [1932, 2013], Urbana), `szemeredi` (Endre Szemerédi, [1940, null], Budapest et Piscataway), `stanley` (Richard Stanley, [1944, null], MIT), `lovasz` (László Lovász, [1948, null], Budapest), `seymour` (Paul Seymour, [1950, null], Princeton), `gowers` (Timothy Gowers, [1963, null], Cambridge) · résultats : `methode-probabiliste` (Méthode probabiliste : minoration des nombres de Ramsey, 1947, theoreme, `erdos`), `theoreme-de-tutte` (Théorème de Tutte sur les couplages parfaits, 1947, theoreme), `graphes-aleatoires-d-erdos-renyi` (Graphes aléatoires et seuils d’apparition, 1959, concept, authorName « Paul Erdős et Alfréd Rényi », `erdos`), `fondements-de-la-theorie-combinatoire` (On the Foundations of Combinatorial Theory I : les fonctions de Möbius, 1964, texte), `theoreme-de-szemeredi` (Théorème de Szemerédi, 1975, theoreme), `lemme-de-regularite` (Lemme de régularité de Szemerédi, 1976 approx, theoreme), `theoreme-des-quatre-couleurs` (Théorème des quatre couleurs, 1976, theoreme, authorName « Kenneth Appel et Wolfgang Haken », `appel`), `nombre-theta-de-lovasz` (Nombre thêta de Lovász, 1979, concept), `algorithme-lll` (Algorithme LLL de réduction de réseaux, 1982, methode, authorName « Arjen Lenstra, Hendrik Lenstra et László Lovász », `lovasz`), `enumerative-combinatorics` (Enumerative Combinatorics, 1986, texte), `normes-de-gowers` (Normes de Gowers et nouvelle démonstration du théorème de Szemerédi, 2001, theoreme), `theoreme-des-mineurs-de-graphes` (Théorème des mineurs de Robertson–Seymour, 2004, theoreme, authorName « Neil Robertson et Paul Seymour », `seymour`) · related : `tao`, `selberg`, `euler` · liens : `theorie-des-nombres-xxe` → filiation (Erdős, Hardy–Ramanujan, fait), `probabilites-modernes` → influence (méthode probabiliste, fait), `geometrie-des-lumieres` → filiation (Euler, les ponts de Königsberg, interprétation), `complexite-et-informatique-theorique` → affinité (interprétation).

**`probabilites-et-statistique-contemporaines`** — Probabilités et statistique contemporaines · contemporain · { start: 1955, end: null } · ['hasard'] · ['Princeton', 'Stanford', 'Ithaca', 'Paris', 'Rehovot', 'Genève', 'Warwick'] · map { x: 6950, y: 3250, size: 2, palette: { fill: '#f1ddd5', stroke: '#73402b', accent: '#92482a' } } · préfixe `psc-` · figures : `wigner` (Eugene Wigner, [1902, 1995], Budapest et Princeton), `tukey` (John Tukey, [1915, 2000], Princeton et Murray Hill), `kesten` (Harry Kesten, [1931, 2019], Ithaca), `efron` (Bradley Efron, [1938, null], Stanford), `talagrand` (Michel Talagrand, [1952, null], Paris), `tibshirani` (Robert Tibshirani, [1956, null], Toronto et Stanford), `donoho` (David Donoho, [1957, null], Stanford), `schramm` (Oded Schramm, [1961, 2008], Rehovot et Redmond), `werner` (Wendelin Werner, [1968, null], Orsay, Paris et Zurich), `smirnov` (Stanislav Smirnov, [1970, null], Genève et Saint-Pétersbourg), `hairer` (Martin Hairer, [1975, null], Warwick, Londres et Lausanne) · résultats : `loi-du-demi-cercle` (Loi du demi-cercle de Wigner, 1955, theoreme), `algorithme-de-metropolis-hastings` (Algorithme de Metropolis–Hastings, 1970, methode, authorName « Nicholas Metropolis et al. (1953) ; W. Keith Hastings (1970) », sans mathematicianId), `exploratory-data-analysis` (Exploratory Data Analysis, 1977, texte), `bootstrap` (Bootstrap, 1979, methode), `seuil-critique-de-la-percolation` (Seuil critique 1/2 de la percolation par arêtes sur le réseau carré, 1980, theoreme), `distribution-de-tracy-widom` (Distribution de Tracy–Widom, 1994, theoreme, authorName « Craig Tracy et Harold Widom », sans mathematicianId), `inegalite-de-concentration-de-talagrand` (Inégalité de concentration de Talagrand, 1995, theoreme), `lasso` (Lasso, 1996, methode), `evolution-de-schramm-loewner` (Évolution de Schramm–Loewner (SLE), 2000, concept), `exposants-d-intersection-du-brownien` (Exposants d’intersection du mouvement brownien plan, 2001, theoreme, authorName « Gregory Lawler, Oded Schramm et Wendelin Werner », `werner`), `invariance-conforme-de-la-percolation` (Invariance conforme de la percolation critique, 2001, theoreme), `acquisition-comprimee` (Acquisition comprimée, 2006, methode, authorName « Emmanuel Candès, Justin Romberg et Terence Tao ; David Donoho », `donoho`), `structures-de-regularite` (Théorie des structures de régularité, 2014, theoreme) · related : `tao`, `kolmogorov`, `ito`, `doob`, `feller`, `fisher` · liens : `probabilites-modernes` → filiation (fait), `statistique-mathematique` → filiation (fait), `edp-et-physique-mathematique` → influence (physique statistique, Wigner, interprétation), `analyse-contemporaine` → affinité (interprétation), `complexite-et-informatique-theorique` → influence (calcul intensif et données massives, interprétation).

**`cryptographie-et-codes`** — Cryptographie, codes correcteurs et théorie de l’information · contemporain · { start: 1948, end: null } · ['hasard', 'nombres'] · ['Murray Hill', 'Stanford', 'MIT', 'Rehovot', 'Seattle', 'Cheltenham'] · map { x: 6600, y: 3560, size: 2, palette: { fill: '#eed8cd', stroke: '#6b3e29', accent: '#8a4728' } } · préfixe `cc-` · figures : `hamming` (Richard Hamming, [1915, 1998], Murray Hill et Monterey), `reed` (Irving Reed, [1923, 2012], Lexington (Massachusetts) et Los Angeles), `berlekamp` (Elwyn Berlekamp, [1940, 2019], Berkeley), `diffie` (Whitfield Diffie, [1944, null], Stanford), `hellman` (Martin Hellman, [1945, null], Stanford), `adleman` (Leonard Adleman, [1945, null], MIT et Los Angeles), `rivest` (Ron Rivest, [1947, null], MIT), `koblitz` (Neal Koblitz, [1948, null], Seattle), `shamir` (Adi Shamir, [1952, null], MIT et Rehovot), `micali` (Silvio Micali, [1954, null], MIT), `goldwasser` (Shafi Goldwasser, [1958, null], MIT et Rehovot) · résultats : `codes-de-hamming` (Codes correcteurs de Hamming, 1950, theoreme), `communication-theory-of-secrecy-systems` (Communication Theory of Secrecy Systems, 1949, texte, `shannon`), `codes-de-reed-solomon` (Codes de Reed–Solomon, 1960, methode, authorName « Irving Reed et Gustave Solomon », `reed`), `algorithme-de-berlekamp-massey` (Algorithme de Berlekamp–Massey, 1968, methode, authorName « Elwyn Berlekamp ; James Massey », `berlekamp`), `new-directions-in-cryptography` (New Directions in Cryptography, 1976, texte, authorName « Whitfield Diffie et Martin Hellman », `diffie`), `echange-de-cles-de-diffie-hellman` (Échange de clés de Diffie–Hellman, 1976, methode, authorName « Whitfield Diffie et Martin Hellman », `hellman`), `rsa` (Cryptosystème RSA, 1977, methode, authorName « Ron Rivest, Adi Shamir et Leonard Adleman », `rivest`), `partage-de-secret-de-shamir` (Partage de secret de Shamir, 1979, methode), `chiffrement-probabiliste` (Chiffrement probabiliste et sécurité sémantique, 1982, concept, authorName « Shafi Goldwasser et Silvio Micali », `goldwasser`), `preuves-a-divulgation-nulle` (Preuves interactives à divulgation nulle de connaissance, 1985, concept, authorName « Shafi Goldwasser, Silvio Micali et Charles Rackoff », `micali`), `cryptographie-sur-courbes-elliptiques` (Cryptographie sur courbes elliptiques, 1985, methode, authorName « Neal Koblitz ; Victor Miller », `koblitz`), `test-de-primalite-aks` (PRIMES est dans P : le test AKS, 2002, theoreme, authorName « Manindra Agrawal, Neeraj Kayal et Nitin Saxena », sans mathematicianId) · related : `shannon`, `turing`, `shor`, `tate` · liens : `calculabilite` → filiation (Shannon, Turing à Bletchley Park, fait), `arithmetique-gaussienne` → influence (arithmétique modulaire, fait), `complexite-et-informatique-theorique` → filiation (fonctions à sens unique, fait), `theorie-des-nombres-contemporaine` → influence (courbes elliptiques, fait).

**`complexite-et-informatique-theorique`** — Complexité, algorithmes et informatique théorique · contemporain · { start: 1959, end: null } · ['fondements', 'hasard'] · ['Toronto', 'Berkeley', 'Moscou', 'Stanford', 'Harvard', 'Jérusalem', 'Princeton'] · map { x: 6250, y: 3900, size: 3, palette: { fill: '#cdeed8', stroke: '#296b3f', accent: '#288a49' } } · préfixe `cit-` · figures : `dijkstra` (Edsger Dijkstra, [1930, 2002], Amsterdam, Eindhoven et Austin), `hartmanis` (Juris Hartmanis, [1928, 2022], Ithaca), `knuth` (Donald Knuth, [1938, null], Stanford), `strassen` (Volker Strassen, [1936, null], Zurich et Constance), `karp` (Richard Karp, [1935, null], Berkeley), `cook` (Stephen Cook, [1939, null], Toronto), `levin` (Leonid Levin, [1948, null], Moscou et Boston), `valiant` (Leslie Valiant, [1949, null], Édimbourg et Harvard), `wigderson` (Avi Wigderson, [1956, null], Jérusalem et Princeton), `shor` (Peter Shor, [1959, null], Murray Hill et MIT), `razborov` (Alexander Razborov, [1963, null], Moscou et Chicago), `arora` (Sanjeev Arora, [1968, null], Princeton) · résultats : `algorithme-de-dijkstra` (Algorithme de Dijkstra, 1959, methode), `hierarchie-en-temps` (On the Computational Complexity of Algorithms : la hiérarchie en temps, 1965, texte, authorName « Juris Hartmanis et Richard Stearns », `hartmanis`), `the-art-of-computer-programming` (The Art of Computer Programming, 1968, texte), `multiplication-de-strassen` (Multiplication rapide des matrices, 1969, methode), `theoreme-de-cook-levin` (Théorème de Cook–Levin : SAT est NP-complet, 1971, theoreme, authorName « Stephen Cook ; Leonid Levin », `cook`), `probleme-p-np` (Problème P versus NP, 1971, probleme, `cook`), `vingt-et-un-problemes-de-karp` (Reducibility Among Combinatorial Problems : les 21 problèmes NP-complets, 1972, texte), `classe-sharp-p` (Classe #P et complexité du permanent, 1979, theoreme, `valiant`), `apprentissage-pac` (Apprentissage PAC, 1984, concept, `valiant`), `bornes-inferieures-monotones` (Bornes inférieures pour les circuits monotones, 1985, theoreme, `razborov`), `theoreme-pcp` (Théorème PCP, 1992, theoreme, authorName « Sanjeev Arora, Shmuel Safra, Carsten Lund, Rajeev Motwani, Madhu Sudan et Mario Szegedy », `arora`), `algorithme-de-shor` (Algorithme quantique de factorisation de Shor, 1994, theoreme), `preuves-naturelles` (Natural Proofs, 1994, theoreme, authorName « Alexander Razborov et Steven Rudich », `razborov`), `durete-contre-aleatoire` (Hardness vs Randomness : dérandomisation sous hypothèses, 1997, theoreme, authorName « Russell Impagliazzo et Avi Wigderson », `wigderson`) · related : `turing`, `church`, `kleene`, `von-neumann`, `godel`, `dantzig` · liens : `calculabilite` → filiation (fait), `combinatoire` → filiation (algorithmes de graphes, fait), `statistique-mathematique` → influence (programmation linéaire, fait), `logique-mathematique-xixe` → influence (Boole et les circuits, interprétation).

**`logique-et-ensembles-contemporains`** — Logique et théorie des ensembles contemporaines : forcing, modèles et types · contemporain · { start: 1960, end: null } · ['fondements'] · ['Stanford', 'Berkeley', 'Jérusalem', 'Stockholm', 'Leningrad', 'Paris', 'Oxford'] · map { x: 6950, y: 4100, size: 2, palette: { fill: '#c6ecd3', stroke: '#26643c', accent: '#268246' } } · préfixe `lec-` · figures : `robinson-abraham` (Abraham Robinson, [1918, 1974], Jérusalem, Los Angeles et New Haven), `morley` (Michael Morley, [1930, 2020], Ithaca), `scott` (Dana Scott, [1932, null], Princeton, Oxford et Pittsburgh), `cohen` (Paul Cohen, [1934, 2007], Stanford), `solovay` (Robert Solovay, [1938, null], Berkeley), `martin-lof` (Per Martin-Löf, [1942, null], Stockholm), `shelah` (Saharon Shelah, [1945, null], Jérusalem et New Brunswick), `matiyasevich` (Iouri Matiiassevitch, [1947, null], Leningrad), `girard` (Jean-Yves Girard, [1947, null], Paris et Marseille), `woodin` (W. Hugh Woodin, [1955, null], Berkeley et Harvard), `hrushovski` (Ehud Hrushovski, [1959, null], Jérusalem et Oxford) · résultats : `analyse-non-standard` (Analyse non standard, 1961, concept), `forcing` (Forcing, 1963, methode), `independance-de-l-hypothese-du-continu` (Indépendance de l’hypothèse du continu, 1963, theoreme), `theoreme-de-categoricite-de-morley` (Théorème de catégoricité de Morley, 1965, theoreme), `theoreme-d-ax-kochen` (Théorème d’Ax–Kochen, 1965, theoreme, authorName « James Ax et Simon Kochen », sans mathematicianId), `theorie-des-domaines` (Théorie des domaines et sémantique dénotationnelle, 1969, concept), `theoreme-de-matiyasevich` (Dixième problème de Hilbert : indécidabilité des équations diophantiennes, 1970, theoreme), `modele-de-solovay` (Modèle de Solovay : tous les ensembles de réels sont mesurables, 1970, theoreme), `systeme-f` (Système F, 1971, concept), `theorie-des-types-intuitionniste` (Théorie des types intuitionniste, 1972, concept), `theorie-de-la-classification` (Classification Theory and the Number of Non-Isomorphic Models, 1978, texte), `determination-projective` (Détermination projective à partir des grands cardinaux, 1985 approx, theoreme, authorName « Donald Martin, John Steel et W. Hugh Woodin », `woodin`), `logique-lineaire` (Logique linéaire, 1987, concept), `theorie-pcf` (Théorie pcf et arithmétique des cardinaux, 1994, theoreme, `shelah`), `mordell-lang-par-la-theorie-des-modeles` (Conjecture de Mordell–Lang pour les corps de fonctions, 1996, theoreme, `hrushovski`), `fondements-univalents` (Fondements univalents et théorie homotopique des types, 2013, texte, authorName « Vladimir Voevodsky et le programme Univalent Foundations », `voevodsky`) · related : `godel`, `tarski`, `kleene`, `turing`, `voevodsky`, `leibniz` · liens : `theorie-des-ensembles` → filiation (fait), `calculabilite` → filiation (fait), `fondements-hilbert-brouwer` → filiation (intuitionnisme → Martin-Löf, Löwenheim–Skolem → théorie des modèles, fait), `querelle-des-infiniment-petits` → affinité (Robinson réhabilite les infiniment petits de Leibniz, interprétation), `geometrie-algebrique-moderne` → affinité (interprétation).

**`calcul-scientifique-et-preuves-assistees`** — Calcul scientifique, calcul formel et démonstration assistée · contemporain · { start: 1946, end: null } · ['analyse', 'fondements'] · ['Los Alamos', 'New York', 'Teddington', 'Yorktown Heights', 'Eindhoven', 'Linz', 'Rocquencourt', 'Pittsburgh'] · map { x: 6620, y: 2560, size: 2, palette: { fill: '#d4c6ec', stroke: '#3e2664', accent: '#492682' } } · préfixe `csp-` · figures : `ulam` (Stanislaw Ulam, [1909, 1984], Lwów, Los Alamos et Boulder), `wilkinson` (James H. Wilkinson, [1919, 1986], Teddington), `lax` (Peter Lax, [1926, null], New York), `cooley` (James Cooley, [1926, 2016], Yorktown Heights), `de-bruijn` (Nicolaas Govert de Bruijn, [1918, 2012], Amsterdam et Eindhoven), `golub` (Gene Golub, [1932, 2007], Stanford), `buchberger` (Bruno Buchberger, [1942, null], Innsbruck et Linz), `huet` (Gérard Huet, [1947, null], Rocquencourt), `zeilberger` (Doron Zeilberger, [1950, null], Philadelphie et New Brunswick), `hales` (Thomas Hales, [1958, null], Ann Arbor et Pittsburgh), `coquand` (Thierry Coquand, [1961, null], Rocquencourt et Göteborg) · résultats : `methode-de-monte-carlo` (Méthode de Monte-Carlo, 1949, methode, authorName « Nicholas Metropolis et Stanislaw Ulam », `ulam`), `theoreme-d-equivalence-de-lax` (Théorème d’équivalence de Lax, 1956, theoreme), `analyse-d-erreur-inverse` (Analyse d’erreur inverse en arithmétique flottante, 1963, concept), `transformee-de-fourier-rapide` (Transformée de Fourier rapide (Cooley–Tukey), 1965, methode, authorName « James Cooley et John Tukey », `cooley`), `bases-de-grobner` (Bases de Gröbner, 1965, concept), `automath` (Automath, 1967, methode), `algorithme-de-risch` (Algorithme de Risch pour l’intégration symbolique, 1969, methode, authorName « Robert Risch », sans mathematicianId), `algorithme-svd-de-golub-kahan` (Algorithme de Golub–Kahan–Reinsch pour la décomposition en valeurs singulières, 1970, methode, `golub`), `calcul-des-constructions` (Calcul des constructions, 1988, concept, authorName « Thierry Coquand et Gérard Huet », `coquand`), `algorithme-de-zeilberger` (Algorithme de Zeilberger pour les identités hypergéométriques, 1990, methode), `demonstration-de-la-conjecture-de-kepler` (Démonstration de la conjecture de Kepler, 1998, theoreme, `hales`), `quatre-couleurs-en-coq` (Formalisation du théorème des quatre couleurs en Coq, 2005, texte, authorName « Georges Gonthier », sans mathematicianId), `feit-thompson-formalise` (Formalisation du théorème de Feit–Thompson, 2012, texte, authorName « Georges Gonthier et al. », sans mathematicianId), `flyspeck` (Projet Flyspeck : preuve formelle de la conjecture de Kepler, 2014, texte, `hales`), `liquid-tensor-experiment` (Liquid Tensor Experiment : formalisation en Lean, 2022, texte, authorName « Peter Scholze, Johan Commelin et la communauté mathlib », sans mathematicianId) · related : `von-neumann`, `tukey`, `turing`, `lovasz`, `martin-lof` · liens : `calculabilite` → filiation (EDVAC, Turing, fait), `logarithmes-et-calcul-numerique` → filiation (tables et machines, interprétation), `fondements-hilbert-brouwer` → filiation (de Bruijn, Martin-Löf et la tradition constructive, interprétation), `combinatoire` → influence (quatre couleurs, fait), `analyse-contemporaine` → affinité (interprétation).

### Règle supplémentaire sur les références croisées

`relatedMathematicianIds` est validé globalement : n’y lister que des ids
présents dans la colonne « figures » d’un **autre** domaine de cette table
(jamais une figure du domaine courant, jamais un id inventé). Si une figure
utile n’existe nulle part, la citer dans `authorName` sans `mathematicianId`.

## 6. Bibliographie socle (`CORE_SOURCES`, dans `src/data/sources.ts`)

Citer ces ids directement ; ne pas les redéclarer.

Généralistes : `boyer-merzbach` (Boyer & Merzbach), `katz-history` (Katz),
`kline-thought` (Kline), `dahan-peiffer` (Dahan-Dalmedico & Peiffer),
`stillwell-history` (Stillwell), `struik-concise` (Struik),
`dieudonne-abrege` (Abrégé 1700-1900), `bourbaki-elements-histoire`,
`grattan-guinness-companion`, `gowers-companion` (Princeton Companion),
`mactutor` (biographies), `sep` (Stanford Encyclopedia of Philosophy).

Recueils de textes : `fauvel-gray-reader`, `stedall-sourcebook` (1540-1900),
`katz-sourcebook` (Égypte, Mésopotamie, Chine, Inde, Islam),
`ewald-kant-hilbert` (fondements), `van-heijenoort` (logique 1879-1931),
`hairer-wanner-analysis` (analyse par son histoire).

Antiquité et Moyen Âge : `heath-greek`, `vitrac-euclide` (Éléments, trad.
Vitrac), `netz-shaping`, `cuomo-ancient`, `neugebauer-exact`,
`robson-mesopotamia`, `plofker-india`, `martzloff-chine`,
`rashed-sciences-arabes`, `berggren-islam`.

XVIᵉ-XVIIIᵉ siècles : `edwards-calculus`, `guicciardini-newton`,
`weil-number-theory` (Hammourabi → Legendre), `hacking-emergence`,
`stigler-statistics` (statistique avant 1900).

XIXᵉ siècle : `bottazzini-higher-calculus`, `gray-worlds` (géométrie),
`kleiner-abstract-algebra`, `goldstein-schappacher-schwermer` (après les
Disquisitiones), `ferreiros-labyrinth` (ensembles), `gray-platos-ghost`.

XXᵉ siècle : `corry-structures`, `gray-hilbert-challenge`,
`dieudonne-topology`, `dieudonne-geometrie-algebrique`, `von-plato-creating`
(probabilités), `davis-universal` (Leibniz → Turing), `mashaal-bourbaki`,
`aubin-dahan-chaos`, `wilson-four-colors`, `singh-fermat`,
`jackson-grothendieck`, `fortnow-pnp`, `kanamori-higher-infinite`.

Sources spécialisées attendues dans les fichiers (exemples réels, à
compléter) : `mahoney-fermat` (Mahoney, *The Mathematical Career of Pierre
de Fermat*), `heath-archimedes`, `knorr-evolution`, `fowler-plato`,
`hoyrup-lengths`, `imhausen-egyptian`, `rashed-al-khwarizmi`, `oaks-algebra`,
`chemla-neuf-chapitres`, `libbrecht-qin`, `sesiano-diophante`,
`bos-redefining` (Descartes), `field-gray-desargues`, `whiteside-newton`,
`hofmann-leibniz`, `fraser-euler`, `bradley-sandifer-euler`, `daston-classical`,
`sheynin-chebyshev`, `dunnington-gauss`, `goldstein-fermat`, `laugwitz-riemann`,
`dauben-cantor`, `reid-hilbert`, `dick-noether`, `hodges-turing`,
`dawson-godel`, `feferman-tarski`, `grattan-guinness-search`, `kolmogorov-selected`,
`weil-apprentissage` (Souvenirs d’apprentissage), `grothendieck-recoltes`,
`gleick-chaos`, `thurston-proof`, `cook-pnp-millennium`,
`moore-zermelo-choice`, `hales-formal-kepler`. Ces ids sont des suggestions :
vérifier auteur, titre et année avant de les déclarer ; ne déclarer que ce qui
est effectivement cité.

## 7. Exemple complet : le domaine `theorie-des-nombres-fermat`

Modèle de densité, de ton et de typage. Le fichier `renaissance.ts` le reprend
tel quel (corrections factuelles autorisées) ; les autres fichiers s’en
inspirent pour chaque domaine.

```ts
// Dans SOURCES_RENAISSANCE :
{ id: 'mahoney-fermat', type: 'livre', author: 'Michael Sean Mahoney', title: 'The Mathematical Career of Pierre de Fermat, 1601-1665', year: 1994, publisher: 'Princeton University Press', note: '2ᵉ édition (1ʳᵉ éd. 1973).' },
{ id: 'goldstein-fermat', type: 'livre', author: 'Catherine Goldstein', title: 'Un théorème de Fermat et ses lecteurs', year: 1995, publisher: 'Presses universitaires de Vincennes' },
{ id: 'fermat-oeuvres', type: 'primaire', author: 'Pierre de Fermat', title: 'Œuvres de Fermat', year: 1891, publisher: 'Gauthier-Villars', note: 'Éd. Paul Tannery et Charles Henry, 4 volumes (1891-1912) et supplément (1922).' },

// Dans RENAISSANCE :
{
  id: 'theorie-des-nombres-fermat',
  name: 'Théorie des nombres de Fermat',
  altNames: ['Arithmétique de Fermat', 'École arithmétique française du XVIIᵉ siècle'],
  era: 'renaissance',
  period: { start: 1621, end: 1670, approx: true },
  continents: ['nombres'],
  places: ['Toulouse', 'Paris', 'Bordeaux'],
  map: { x: 2450, y: 620, size: 2, palette: { fill: '#3d3014', stroke: '#d9b85a', accent: '#ffe08a' } },
  tagline: 'Dans les marges d’un Diophante, une arithmétique nouvelle qui ne livre presque jamais ses preuves.',
  summary:
    'Entre 1636 et 1665, un conseiller au parlement de Toulouse refonde l’arithmétique des entiers en relisant Diophante dans l’édition de Bachet (1621). Pierre de Fermat énonce par lettres, presque toujours sans démonstration, le petit théorème, le théorème des deux carrés, les propriétés des nombres de la forme 2^(2ⁿ) + 1 et l’impossibilité de xⁿ + yⁿ = zⁿ pour n > 2. Sa méthode de descente infinie et ses défis aux géomètres anglais font de la théorie des nombres une discipline autonome, dont Euler, Lagrange et Legendre hériteront au XVIIIᵉ siècle.',
  methods: [
    {
      kind: 'fait',
      text: 'Fermat travaille sur l’édition gréco-latine des Arithmétiques de Diophante publiée par Bachet de Méziriac en 1621 ; ses observations, consignées dans les marges de son exemplaire, sont publiées par son fils Samuel en 1670.',
      sources: ['weil-number-theory', 'mahoney-fermat'],
    },
    {
      kind: 'fait',
      text: 'La descente infinie, exposée dans la lettre à Carcavi d’août 1659 : pour prouver qu’une équation n’a pas de solution entière, on montre qu’une solution en engendrerait une strictement plus petite, ce qui est impossible dans les entiers naturels. Fermat l’applique à l’impossibilité d’un triangle rectangle en nombres dont l’aire soit un carré.',
      sources: ['weil-number-theory', 'fermat-oeuvres'],
    },
    {
      kind: 'interpretation',
      text: 'Pour André Weil, Fermat fonde la théorie des nombres moderne parce qu’il déplace la question diophantienne : il ne cherche plus une solution rationnelle, mais toutes les solutions entières, et surtout leur inexistence.',
      sources: ['weil-number-theory'],
    },
  ],
  context: [
    {
      kind: 'fait',
      text: 'Conseiller au parlement de Toulouse à partir de 1631, Fermat ne publie presque rien de son vivant : il communique par lettres, souvent relayées par Mersenne depuis Paris, avec Roberval, Frénicle, Pascal, Digby, Wallis et Brouncker.',
      sources: ['mahoney-fermat', 'mactutor'],
    },
    {
      kind: 'fait',
      text: 'Le cercle de Mersenne, au couvent des Minimes de la place Royale, sert de centre de tri de la correspondance savante européenne dans les années 1630 et 1640.',
      sources: ['mahoney-fermat'],
    },
    {
      kind: 'interpretation',
      text: 'Michael Mahoney lit Fermat comme un « amateur » au sens du XVIIᵉ siècle : un homme de robe dont la pratique savante est structurée par le défi et la lettre plutôt que par le livre, ce qui explique le silence sur les démonstrations.',
      sources: ['mahoney-fermat'],
    },
  ],
  debates: [
    {
      kind: 'fait',
      text: 'En marge du problème II.8 de Diophante, Fermat affirme avoir trouvé une « démonstration véritablement merveilleuse » de l’impossibilité de xⁿ + yⁿ = zⁿ pour n > 2, « que cette marge est trop étroite pour contenir ». Aucune démonstration n’a été retrouvée dans ses papiers.',
      sources: ['weil-number-theory', 'singh-fermat'],
    },
    {
      kind: 'interpretation',
      text: 'Les historiens tiennent que Fermat ne disposait d’une preuve que pour l’exposant 4, par descente infinie, et que la note marginale, jamais répétée dans sa correspondance, relève d’une conviction non étayée.',
      sources: ['weil-number-theory', 'goldstein-fermat'],
    },
    {
      kind: 'interpretation',
      text: 'Les défis lancés en 1657 aux mathématiciens anglais (résoudre x² − N·y² = 1 en entiers) sont lus par Weil comme une tentative de susciter une communauté arithmétique européenne ; Wallis et Brouncker y répondent par une méthode efficace sans en saisir, selon Fermat, la portée théorique.',
      sources: ['weil-number-theory', 'mahoney-fermat'],
    },
  ],
  keyDates: [
    { year: 1621, text: 'Bachet de Méziriac publie à Paris l’édition gréco-latine des Arithmétiques de Diophante.' },
    { year: 1636, text: 'Début de la correspondance de Fermat avec Mersenne et Roberval.' },
    { year: 1640, text: 'Lettres à Frénicle (18 octobre) et à Mersenne (25 décembre) : petit théorème et théorème des deux carrés.' },
    { year: 1654, text: 'Correspondance avec Pascal sur le problème des partis.' },
    { year: 1657, text: 'Défis aux mathématiciens anglais sur l’équation x² − N·y² = 1.' },
    { year: 1659, text: 'Lettre à Carcavi : « Relation des nouvelles découvertes en la science des nombres », exposé de la descente infinie.' },
    { year: 1665, text: 'Mort de Fermat à Castres, le 12 janvier.' },
    { year: 1670, text: 'Samuel de Fermat publie le Diophante de Bachet augmenté des observations de son père.' },
  ],
  theories: [
    {
      id: 'tnf-lecture-de-diophante',
      name: 'Lecture et restitution de Diophante',
      period: { start: 1621, end: 1670 },
      summary: 'Le texte de Diophante, édité et commenté par Bachet, est le support matériel de l’arithmétique du siècle : les problèmes sur les carrés, les triangles rectangles en nombres et les nombres polygonaux servent de point de départ aux observations de Fermat.',
      traits: ['Édition gréco-latine de 1621', 'Problèmes sur les carrés et les triangles rectangles', 'Observations marginales', 'Nombres polygonaux'],
    },
    {
      id: 'tnf-nombres-premiers',
      name: 'Nombres premiers, congruences et sommes de carrés',
      period: { start: 1636, end: 1660 },
      summary: 'Propriétés des nombres premiers et des puissances : le petit théorème, la représentation des premiers de la forme 4k + 1 comme somme de deux carrés, les nombres de Fermat et de Mersenne, les nombres parfaits et amiables.',
      traits: ['Petit théorème', 'Sommes de deux carrés', 'Nombres de Fermat 2^(2ⁿ) + 1', 'Nombres parfaits et amiables'],
    },
    {
      id: 'tnf-descente-infinie',
      name: 'Descente infinie et équations diophantiennes',
      period: { start: 1640, end: 1670 },
      summary: 'Méthode de preuve d’impossibilité et étude des équations en entiers : le cas n = 4 du dernier théorème, l’équation x² − N·y² = 1, les équations y² + 2 = x³ et y² + 4 = x³.',
      traits: ['Descente infinie', 'Impossibilité de x⁴ + y⁴ = z⁴', 'Équation de Pell–Fermat', 'Défis aux géomètres anglais'],
    },
  ],
  mathematicians: [
    {
      id: 'bachet',
      name: 'Claude-Gaspard Bachet de Méziriac',
      years: [1581, 1638],
      origin: 'Bourg-en-Bresse',
      bio: 'Lettré et poète, membre de l’Académie française, Bachet publie en 1621 l’édition gréco-latine des Arithmétiques de Diophante, avec commentaires, et les Problèmes plaisants et délectables (1612). Son édition est l’exemplaire que Fermat annote.',
      theoryId: 'tnf-lecture-de-diophante',
    },
    {
      id: 'mersenne',
      name: 'Marin Mersenne',
      years: [1588, 1648],
      origin: 'Paris',
      bio: 'Religieux minime, Mersenne anime depuis Paris la correspondance savante de l’Europe. Dans la préface des Cogitata physico-mathematica (1644), il dresse la liste des exposants p pour lesquels 2^p − 1 serait premier ; les nombres de Mersenne portent son nom.',
      theoryId: 'tnf-nombres-premiers',
    },
    {
      id: 'fermat',
      name: 'Pierre de Fermat',
      years: [1601, 1665],
      origin: 'Toulouse',
      bio: 'Conseiller au parlement de Toulouse, Fermat refonde l’arithmétique des entiers à partir de Diophante et de Viète. Il énonce par lettres le petit théorème, le théorème des deux carrés et la conjecture qui deviendra son « dernier théorème », et met au point la descente infinie. La date de naissance traditionnelle (1601) est discutée ; certains historiens proposent 1607.',
      theoryId: 'tnf-descente-infinie',
    },
    {
      id: 'frenicle',
      name: 'Bernard Frénicle de Bessy',
      years: [1604, 1674],
      yearsApprox: true,
      origin: 'Paris',
      bio: 'Conseiller à la Cour des monnaies et calculateur hors pair, Frénicle est le correspondant arithmétique privilégié de Fermat : c’est à lui qu’est adressée la lettre du 18 octobre 1640 contenant le petit théorème. Il résout les défis de 1657 et publie un Traité des triangles rectangles en nombres.',
      theoryId: 'tnf-nombres-premiers',
    },
  ],
  relatedMathematicianIds: ['pascal', 'wallis'],
  results: [
    {
      id: 'edition-bachet-diophante',
      title: 'Édition gréco-latine des Arithmétiques de Diophante',
      altTitle: 'Diophanti Alexandrini Arithmeticorum libri sex, et de numeris multangulis liber unus',
      year: 1621,
      authorName: 'Claude-Gaspard Bachet de Méziriac',
      mathematicianId: 'bachet',
      theoryId: 'tnf-lecture-de-diophante',
      kind: 'texte',
      comment: 'Première édition complète du texte grec avec traduction latine et commentaires. C’est dans les marges de cet ouvrage que Fermat écrit ses observations ; l’édition de 1670 par Samuel de Fermat les rend publiques.',
    },
    {
      id: 'dernier-theoreme-de-fermat',
      title: 'Dernier théorème de Fermat',
      altTitle: 'Grand théorème de Fermat',
      year: 1637,
      yearApprox: true,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-descente-infinie',
      kind: 'conjecture',
      statement: 'Il n’existe pas d’entiers strictement positifs x, y, z tels que xⁿ + yⁿ = zⁿ dès que n est supérieur à 2.',
      comment: 'Note marginale sans démonstration, datée conventionnellement vers 1637. Fermat ne prouve que le cas n = 4 ; Euler traite n = 3, puis Kummer les exposants premiers réguliers (1847). La démonstration générale est donnée par Andrew Wiles en 1995. Le problème a structuré la théorie des nombres pendant trois siècles.',
    },
    {
      id: 'petit-theoreme-de-fermat',
      title: 'Petit théorème de Fermat',
      year: 1640,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-nombres-premiers',
      kind: 'theoreme',
      statement: 'Si p est premier et ne divise pas a, alors p divise a^(p − 1) − 1.',
      comment: 'Énoncé dans la lettre à Frénicle du 18 octobre 1640, sans preuve (« je vous l’envoierois si je n’appréhendois d’être trop long »). Euler le démontre en 1736 et le généralise. C’est le point de départ de la théorie des congruences et, trois siècles plus tard, des tests de primalité et du chiffrement RSA.',
    },
    {
      id: 'theoreme-des-deux-carres',
      title: 'Théorème des deux carrés',
      altTitle: 'Théorème de Noël de Fermat',
      year: 1640,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-nombres-premiers',
      kind: 'theoreme',
      statement: 'Tout nombre premier de la forme 4k + 1 est, d’une seule manière, la somme de deux carrés ; aucun nombre premier de la forme 4k + 3 ne l’est.',
      comment: 'Annoncé à Mersenne le 25 décembre 1640, avec l’indication d’une preuve par descente. La première démonstration publiée est celle d’Euler (1749). Le théorème ouvre l’étude des formes quadratiques, que Lagrange, Legendre et Gauss systématiseront.',
    },
    {
      id: 'nombres-de-fermat',
      title: 'Nombres de Fermat',
      year: 1640,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-nombres-premiers',
      kind: 'conjecture',
      statement: 'Les nombres de la forme 2^(2ⁿ) + 1 (3, 5, 17, 257, 65537, …) seraient tous premiers.',
      comment: 'Fermat répète cette conviction à Frénicle, à Pascal et à Carcavi, tout en avouant ne pas savoir la démontrer. Euler la réfute en 1732 : 2^32 + 1 est divisible par 641. Aucun autre nombre de Fermat premier n’a été trouvé depuis.',
    },
    {
      id: 'nombres-de-mersenne',
      title: 'Nombres de Mersenne',
      altTitle: 'Cogitata physico-mathematica, préface',
      year: 1644,
      authorName: 'Marin Mersenne',
      mathematicianId: 'mersenne',
      theoryId: 'tnf-nombres-premiers',
      kind: 'concept',
      statement: 'Nombres de la forme 2^p − 1 ; Mersenne affirme qu’ils sont premiers pour p = 2, 3, 5, 7, 13, 17, 19, 31, 67, 127 et 257, et pour aucun autre p inférieur à 257.',
      comment: 'La liste comporte des erreurs (67 et 257 à retirer, 61, 89 et 107 à ajouter), corrigées entre 1883 et 1947. Liés aux nombres parfaits pairs par Euclide et Euler, les nombres de Mersenne restent la source des plus grands nombres premiers connus.',
    },
    {
      id: 'equation-de-pell-fermat',
      title: 'Équation de Pell–Fermat',
      year: 1657,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-descente-infinie',
      kind: 'probleme',
      statement: 'Étant donné un entier N qui n’est pas un carré, trouver tous les entiers x, y tels que x² − N·y² = 1 ; Fermat affirme qu’il y en a toujours une infinité.',
      comment: 'Défi lancé en février 1657 aux mathématiciens d’Angleterre et d’Europe. Brouncker et Wallis fournissent une méthode de résolution ; l’existence d’une infinité de solutions pour tout N n’est démontrée que par Lagrange (1768), à l’aide des fractions continues. Le nom de Pell vient d’une confusion d’Euler.',
    },
    {
      id: 'descente-infinie',
      title: 'Méthode de descente infinie',
      altTitle: 'Relation des nouvelles découvertes en la science des nombres',
      year: 1659,
      authorName: 'Pierre de Fermat',
      mathematicianId: 'fermat',
      theoryId: 'tnf-descente-infinie',
      kind: 'methode',
      statement: 'Pour montrer qu’aucun entier ne possède une propriété donnée, on prouve que, s’il en existait un, il en existerait un plus petit ; comme une suite strictement décroissante d’entiers naturels est finie, la propriété est impossible.',
      comment: 'Décrite dans la lettre à Carcavi d’août 1659, la descente est la seule méthode dont Fermat ait laissé un exposé. Elle démontre le cas n = 4 du dernier théorème et sert encore, sous la forme de la descente sur les courbes elliptiques (Mordell, 1922), à la théorie des nombres contemporaine.',
    },
  ],
  sources: ['weil-number-theory', 'mahoney-fermat', 'goldstein-fermat', 'fermat-oeuvres', 'singh-fermat', 'katz-history'],
},

// Dans LINKS_RENAISSANCE :
{
  source: 'arithmetique-grecque',
  target: 'theorie-des-nombres-fermat',
  kind: 'filiation',
  epistemic: 'fait',
  label: 'Diophante relu',
  note: 'Les observations de Fermat sont écrites dans les marges de l’édition Bachet des Arithmétiques de Diophante (1621).',
  sources: ['weil-number-theory'],
},
{
  source: 'algebre-renaissance',
  target: 'theorie-des-nombres-fermat',
  kind: 'filiation',
  epistemic: 'fait',
  label: 'L’héritage de Viète',
  note: 'Fermat se forme à l’analyse algébrique dans Viète, dont il adopte la notation littérale et le programme de restitution des Anciens.',
  sources: ['mahoney-fermat'],
},
{
  source: 'occident-latin-medieval',
  target: 'theorie-des-nombres-fermat',
  kind: 'influence',
  epistemic: 'interpretation',
  label: 'Le Liber quadratorum',
  note: 'Les problèmes de Fibonacci sur les carrés congruents annoncent des questions traitées par Fermat ; une lecture directe n’est pas établie.',
  sources: ['weil-number-theory'],
},

// Dans MATHEMATICIAN_LINKS_RENAISSANCE :
{ source: 'bachet', target: 'fermat', kind: 'influence', note: 'L’édition de 1621 est l’exemplaire que Fermat annote.', epistemic: 'fait' },
{ source: 'mersenne', target: 'fermat', kind: 'collaboration', note: 'Mersenne relaie la correspondance de Fermat vers Paris et l’Europe à partir de 1636.', epistemic: 'fait' },
{ source: 'fermat', target: 'frenicle', kind: 'collaboration', note: 'Échanges de 1640 sur les nombres parfaits, les sommes de carrés et le petit théorème.', epistemic: 'fait' },
```

Points à retenir de l’exemple : chaque `Statement` a une ou deux sources ;
les énoncés mathématiques sont donnés en langage courant avec quelques
symboles Unicode ; les commentaires disent ce que le résultat ouvre et qui le
démontre ensuite ; les dates incertaines sont signalées (`yearApprox`,
`yearsApprox`, « conventionnellement », « vers ») ; les figures étrangères au
domaine (`pascal`, `wallis`) sont déclarées dans `relatedMathematicianIds`.

## 8. Récits « contexte / portée » des grands résultats

But : pour les résultats majeurs, raconter **ce qui a conduit à la recherche**
et **ce qu’elle a ouvert**. Champs optionnels `context` et `impact` de `Result`
(`src/data/types.ts`), affichés dans la fiche sous « Ce qui y a conduit » et
« Ce que ça a ouvert ».

- **Sélection** : 3 résultats par domaine (4 au plus), en priorité parmi les
  résultats obligatoires de la table § 5 : ceux qui répondent à une question
  identifiable ou en ouvrent de nouvelles (théorèmes, problèmes, conjectures,
  méthodes structurants ; un `texte` fondateur s’il a un contexte clair).
- **`context`** (1 ou 2 énoncés, 3 au plus) : le problème posé, l’état
  antérieur (prédécesseurs nommés, dates), la motivation (pratique,
  philosophique, interne aux mathématiques), la circonstance (lettre, concours,
  cours, défi).
- **`impact`** (1 ou 2 énoncés, 3 au plus) : ce que le résultat rend possible ou
  ferme : reprises nommées et datées, domaines qui en naissent, problèmes
  résolus grâce à lui ; jugement de portée signé si possible.
- **Typage** : `fait` = datable et documenté (« Abel reprend la question en
  1824 ») ; `interpretation` = causalité historique, attribution d’influence,
  jugement de portée (« pour Kline, … », « ouvre la voie à… »). Une motivation
  n’est un `fait` que si les textes l’attestent (préface, lettre).
- **Sources** : au moins une par énoncé, **uniquement parmi les sources déjà
  déclarées** (socle § 6 ou `SOURCES_X` du fichier) et qui traitent
  effectivement le point. Aucune source nouvelle pour un récit.
- **Longueur** : 1 à 3 phrases par énoncé ; ne pas recopier le `comment`, le
  prolonger (le `comment` dit pourquoi le résultat compte, le récit dit d’où il
  vient et ce qu’il a déclenché).
- Validation : `npx tsx scripts/check-era.ts <fichier>` (les deux parties vont
  ensemble, chaque énoncé est sourcé, 3 énoncés au plus par partie).

Exemple (`petit-theoreme-de-fermat`, à ajouter après `comment`) :

```ts
context: [
  {
    kind: 'fait',
    text: 'En 1640, Fermat discute avec Mersenne et Frénicle des nombres parfaits et des nombres de la forme 2ⁿ − 1 hérités d’Euclide (Éléments IX.36) : décider s’ils sont premiers le conduit à étudier les diviseurs de aⁿ − 1.',
    sources: ['weil-number-theory', 'mahoney-fermat'],
  },
],
impact: [
  {
    kind: 'fait',
    text: 'Fermat ne publie pas de preuve ; la première démonstration publiée est celle d’Euler (présentée en 1736), qui étend ensuite le théorème aux modules composés avec sa fonction indicatrice.',
    sources: ['weil-number-theory'],
  },
  {
    kind: 'interpretation',
    text: 'Pierre angulaire de la théorie des congruences, le théorème fonde trois siècles plus tard les tests de primalité et le chiffrement RSA (1977) : un usage que rien, dans les questions de Fermat, ne laissait prévoir.',
    sources: ['gowers-companion'],
  },
],
```

---

## 9. Grandes figures

Une grande figure est signalée par le champ `featured` sur son objet, dans son
fichier d’ère (schéma : `Featured` dans `src/data/types.ts`). **Deux grandes
figures au plus par domaine.** Charte de rédaction :

- **Signature** : son apport en une ligne, au plus 90 caractères, verbe au présent (« Fonde… », « Démontre… »).
  - Typée `fait` si elle décrit ce qui a été fait (« Publie la résolution générale… (1545) ») ;
  - `interpretation` si elle juge (« refonde », « unifie », « achève »).
- **Apports** : 2 à 4 énoncés, chacun une ou deux phrases. Ils disent ce que la figure a **changé** : concepts, méthodes, notations, manières de démontrer, institutions, élèves, écoles.
  - Ils **complètent** la bio sans la répéter.
  - Les jugements de portée sont typés `interpretation` et attribués quand c’est possible (« pour Weil, … »).
  - Sources : celles du domaine d’attache, celles des récits de ses résultats, `mactutor` et les histoires générales du socle.
  - Modèle : les apports d’Euler (ci-dessous).
- **Résultats phares** : 1 à 3 de ses résultats, le plus emblématique d’abord (il s’affiche sur la carte). Ils peuvent appartenir à n’importe quel domaine.

Liste validée (43 figures, 36 domaines) :

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

Exemple complet (`src/data/domains/lumieres.ts`) :

```ts
        featured: {
          signature: { kind: 'fait', text: 'Fait des fonctions l’objet de l’analyse et lui donne ses notations : f(x), e, i, π, Σ.', sources: ['bottazzini-higher-calculus', 'hairer-wanner-analysis'] },
          contributions: [
            { kind: 'fait', text: 'L’Introductio in analysin infinitorum (1748) définit la fonction comme une expression analytique et fait des séries entières sa forme normale : l’analyse cesse d’être une science des courbes.', sources: ['bottazzini-higher-calculus', 'hairer-wanner-analysis'] },
            { kind: 'fait', text: 'Parmi ses résultats : la somme des inverses des carrés (1735), la formule e^(iθ) = cos θ + i sin θ (1748), la relation S − A + F = 2 des polyèdres (1750) et les équations des fluides parfaits (1757).', sources: ['hairer-wanner-analysis', 'bradley-sandifer-euler'] },
            { kind: 'interpretation', text: 'En ramenant le problème des ponts de Königsberg (1736) à une question de connexions, sans mesure ni calcul, il est tenu pour le précurseur de la théorie des graphes et de la topologie.', sources: ['mactutor', 'katz-history'] },
          ],
          headlineResultIds: ['probleme-de-bale', 'introductio-in-analysin-infinitorum', 'sept-ponts-de-konigsberg'],
        },
```

## 10. Intuitions et démonstrations

Les champs `intuition` (« D’où vient l’idée ») puis `proof` (« Idée de la
démonstration ») se placent à la fin de l’objet résultat, après `impact` s’il
existe. Charte de rédaction :

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

Contrôle d’un fichier pendant la rédaction :
`npx tsx scripts/check-era.ts <fichier>`.

Les trois modèles :

`infinite-des-nombres-premiers` (`src/data/domains/antiquite.ts`) :

```ts
        intuition: [
          { kind: 'fait', text: 'Multiplier des nombres premiers puis ajouter 1 fabrique un nombre qu’aucun d’eux ne divise : la division par chacun laisse le reste 1. Un nombre premier nouveau se cache donc dans ce produit augmenté de un.', sources: ['vitrac-euclide', 'heath-greek'] },
        ],
        proof: [
          { kind: 'fait', text: 'Soit une liste finie quelconque de nombres premiers ; Euclide (Éléments, IX, 20) raisonne sur trois d’entre eux, A, B et C, et l’argument vaut pour toute liste.', sources: ['vitrac-euclide', 'heath-greek'] },
          { kind: 'fait', text: 'On forme le nombre N = A × B × C + 1.', sources: ['vitrac-euclide'] },
          { kind: 'fait', text: 'N est soit premier, soit mesuré par un nombre premier (VII, 32) : dans les deux cas, un nombre premier P divise N.', sources: ['vitrac-euclide'] },
          { kind: 'fait', text: 'P n’est ni A, ni B, ni C : s’il l’était, il diviserait à la fois N et A × B × C, donc leur différence, qui vaut 1 — c’est impossible.', sources: ['vitrac-euclide'] },
          { kind: 'fait', text: 'La liste proposée ne contenait donc pas tous les nombres premiers : il y en a toujours plus que toute quantité donnée.', sources: ['vitrac-euclide'] },
        ],
      },
```

`probleme-de-bale` (`src/data/domains/lumieres.ts`) :

```ts
        intuition: [
          { kind: 'fait', text: 'Un polynôme qui vaut 1 en 0 et s’annule en a₁, a₂, …, aₙ s’écrit (1 − x/a₁)(1 − x/a₂)…(1 − x/aₙ), et le coefficient de x y vaut −(1/a₁ + … + 1/aₙ). Euler applique cette règle à sin x / x, dont les racines sont ±π, ±2π, ±3π…, comme à un polynôme de degré infini.', sources: ['hairer-wanner-analysis', 'bradley-sandifer-euler'] },
        ],
        proof: [
          { kind: 'fait', text: 'Le développement en série donne sin x / x = 1 − x²/6 + x⁴/120 − …', sources: ['hairer-wanner-analysis'] },
          { kind: 'fait', text: 'Cette fonction s’annule exactement en x = ±π, ±2π, ±3π, …', sources: ['hairer-wanner-analysis'] },
          { kind: 'fait', text: 'Euler l’écrit comme un produit infini : sin x / x = (1 − x²/π²)(1 − x²/4π²)(1 − x²/9π²)…', sources: ['hairer-wanner-analysis', 'bradley-sandifer-euler'] },
          { kind: 'fait', text: 'En développant le produit, le coefficient de x² vaut −(1/π²)(1 + 1/4 + 1/9 + …) ; l’égaler à −1/6 donne 1 + 1/4 + 1/9 + … = π²/6.', sources: ['hairer-wanner-analysis'] },
          { kind: 'fait', text: 'Le seul point délicat est l’écriture de sin x en produit infini, admise par analogie en 1735 et démontrable rigoureusement.', sources: ['bottazzini-higher-calculus'] },
        ],
      },
```

`petit-theoreme-de-fermat` (`src/data/domains/renaissance.ts`) :

```ts
        intuition: [
          { kind: 'fait', text: 'Fermat énonce un fait plus précis : la première puissance de a qui laisse le reste 1 dans la division par p a un exposant qui divise p − 1, et les restes des puissances successives reviennent ensuite périodiquement à 1.', sources: ['weil-number-theory', 'mahoney-fermat'] },
        ],
        proof: [
          { kind: 'fait', text: 'On montre d’abord que p divise aᵖ − a pour tout entier a ≥ 1, par récurrence sur a : c’est la voie suivie par Euler (1736).', sources: ['weil-number-theory'] },
          { kind: 'fait', text: 'Pour a = 1, aᵖ − a = 0 est divisible par p.', sources: ['weil-number-theory'] },
          { kind: 'fait', text: 'Par la formule du binôme, (a + 1)ᵖ = aᵖ + 1 + des termes intermédiaires dont chaque coefficient C(p, k), pour 0 < k < p, est divisible par p, puisque p est premier.', sources: ['weil-number-theory'] },
          { kind: 'fait', text: 'Donc (a + 1)ᵖ − (a + 1) et aᵖ − a diffèrent d’un multiple de p : la propriété passe de a à a + 1.', sources: ['weil-number-theory'] },
          { kind: 'fait', text: 'Enfin, si p ne divise pas a, alors p, qui divise a × (aᵖ⁻¹ − 1), divise aᵖ⁻¹ − 1 (Éléments, VII, 30).', sources: ['weil-number-theory', 'katz-history'] },
        ],
      },
```

## 11. Fiches courtes et MacTutor

À venir (vague 4) : une fiche courte par figure ordinaire documentée.

- **Qui** : une figure qui a une biographie MacTutor **et** une contribution mathématique réelle dans le champ et la période d’un domaine de l’atlas.
  - On écarte les mécènes, les éditeurs sans œuvre propre et les doublons.
  - On veille à la diversité (femmes, mondes non européens), sans forcer.
  - Domaine d’attache : celui de la contribution principale ; ailleurs, `relatedMathematicianIds` si utile.
- **Champs** : `id` (slug du nom usuel français), `name` (forme française usuelle pour l’Antiquité et le Moyen Âge, graphie d’origine avec diacritiques pour les modernes), `years`, `yearsApprox` si MacTutor dit « about » ou si la date est débattue, `origin` (ville, culture ou pays d’activité), `bio`, `mactutor`, `sources: ['mactutor']` (et d’autres sources du registre si utilisées), `theoryId` si évident.
- **Bio** : 1 à 2 phrases, 280 caractères au plus, **rédigées par nous** (jamais copiées ni traduites mot à mot de MacTutor), avec uniquement des faits présents dans la biographie MacTutor ou dans une source du registre.
- **Années** : celles de MacTutor (av. J.-C. en négatif). La commande de contrôle `npx tsx scripts/mactutor.ts --domain <id> --strict` (script à venir avec la vague 4, tâche 4.1) doit passer pour chaque domaine touché.
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

**Rangement** : les fiches courtes vont dans `src/data/figures/<ère>.ts`
(objet `{ [domainId]: Mathematician[] }`), fusionnées au chargement — à venir,
tâche 4.2.

Cibles par domaine (figures actuelles → cible), soit 1 224 figures au total.
Une cible est un plafond indicatif, pas un quota.

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


## 12. Pendant physique et résultats majeurs

Avenant « Galerie » (plan `docs/superpowers/plans/2026-10-12-pendant-physique.md`).

- **Continent `physique`** : sixième bande verticale de la carte (y 4500→5400,
  `MAP_SIZE.height` 5400), teinte de champ 175°. Les domaines physiques suivent
  toutes les règles des domaines mathématiques (§ 3), y compris récits
  contexte/portée, théories, repères et sources propres.
- **Figures** : physicien·nes en fiches courtes du modèle § 11, dans
  `src/data/figures/physique-{a,b,c}.ts`. Un physicien déjà figure de l'atlas
  n'est jamais redéfini : `relatedMathematicianIds`.
- **Liens** : mêmes natures ; un `principal` au plus par domaine d'arrivée,
  y compris vers un domaine physique. Les interconnexions maths ↔ physique
  sont l'objet du pendant : chaque domaine physique doit avoir au moins un
  lien documenté vers un domaine mathématique.
- **Résultats majeurs** : `major: true` sur `Result` — une trentaine
  éditoriale dans tout l'atlas ; les résultats phares des grandes figures
  bénéficient du même traitement visuel sans porter le flag.
- Domaines et cibles : voir le plan § 5.2 (~15 domaines, ~120 figures).
