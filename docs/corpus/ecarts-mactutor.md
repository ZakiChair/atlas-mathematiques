# Écarts atlas / MacTutor — à trancher par le propriétaire

Contrôle : `npx tsx scripts/mactutor.ts --strict` (tolérance : 0 an entre deux
dates précises, 15 ans si l'une des deux est approximative). État au
12 octobre 2026 : **1 028 figures contrôlées, 8 écarts**.

Règle du dossier de passation (tâche 4.1) : aucune année de l'atlas n'a été
modifiée ; le propriétaire du corpus tranche chaque ligne ci-dessous. Les
journaux de travail détaillés (par ère, agents) sont hors dépôt ; seuls les
écarts et les informations utiles à la décision sont recopiés ici.

## 1. Écarts signalés par le contrôle strict

| Domaine | Figure | Années de l'atlas | Années MacTutor | Détail et sources du domaine |
|---|---|---|---|---|
| calcul-des-scribes | `ahmes` (Ahmès) | [−1600, −1530] approx | about 1680 BC – about 1620 BC | La bio de l'atlas date la copie du papyrus de l'an 33 d'Apophis et place Ahmès « conventionnellement vers 1550 » ; MacTutor suit la datation du papyrus vers 1650. Désaccord de chronologie égyptienne, pas d'erreur matérielle. Sources : robson-mesopotamia, hoyrup-lengths, imhausen-egyptian, neugebauer-exact, robson-plimpton, katz-sourcebook. |
| mathematiques-chinoises-anciennes | `sunzi` (Sunzi) | [380, 450] approx | about 400 – about 460 | Naissance 380 ≠ 400 (20 ans, hors tolérance). La bio date le Sunzi suanjing « sur le contenu » entre IIIᵉ et Vᵉ siècle ; Martzloff le situe vers 400. Sources : chemla-neuf-chapitres, martzloff-chine, katz-sourcebook, boyer-merzbach. |
| mathematiques-chinoises-anciennes | `zu-chongzhi` (Zu Chongzhi) | [429, 500] précis | 429 – 501 | Mort 500 ≠ 501, les deux dates données comme précises. Martzloff et Boyer–Merzbach donnent 429–500 ; MacTutor 501. Un `yearsApprox` ou l'alignement sur une source règle l'écart. Sources : chemla-neuf-chapitres, martzloff-chine, katz-sourcebook, boyer-merzbach. |
| mathematiques-indiennes | `nilakantha` (Nīlakaṇṭha Somayājī) | [1444, 1544] approx | 14 June 1444 – after 1501 | Mort 1544 ≠ 1501 : MacTutor ne retient que la dernière date attestée d'activité ; l'atlas suit la tradition d'une vie presque centenaire (Plofker). Borne basse contre date traditionnelle. Sources : plofker-india, katz-sourcebook, shukla-sarma-aryabhatiya, colebrooke-algebra, ramasubramanian-sriram-tantrasangraha, joseph-crest, katz-history. |
| geometrie-arabe | `thabit-ibn-qurra` (Thābit ibn Qurra) | [826, 901] précis | 836 – 18 February 901 | Naissance 826 ≠ 836 : les deux années circulent (211 ou 221 de l'hégire). Mort concordante. Sources : rashed-sciences-arabes, berggren-islam, sabra-optics, rashed-infinitesimales, youschkevitch-arabes, katz-sourcebook, katz-history. |
| occident-latin-medieval | `jordanus-de-nemore` (Jordanus de Nemore) | [1190, 1240] approx | 1225 Borgentreich – 1260 at sea | Identification incertaine chez MacTutor (même la page la présente comme hypothétique), difficilement compatible avec la mention de quatre œuvres dans la Biblionomia de Richard de Fournival (~1250). L'atlas suit Hughes. Sources : sigler-liber-abaci, busard-adelard, hughes-jordanus, clagett-oresme, burnett-numerals, grant-sourcebook, katz-history. |
| calcul-scientifique-et-preuves-assistees | `lax` (Peter Lax) | [1926, null] vivant | mort le 16 mai 2025, New York | MacTutor enregistre le décès ; l'atlas le dit vivant. Si validé : `years: [1926, 2025]` et adapter la bio. |
| geometrie-algebrique-moderne | `hironaka` (Heisuke Hironaka) | [1931, null] vivant | mort le 18 mars 2026, Tokyo | MacTutor enregistre le décès ; l'atlas le dit vivant. Si validé : `years: [1931, 2026]` et adapter la bio. |

## 2. Différences dans la tolérance (pour information)

Non signalées par le script (`yearsApprox` couvre l'écart) ; aligner ou non
reste un choix éditorial.

| Domaine | Figure | Atlas | MacTutor | Remarque |
|---|---|---|---|---|
| mathematiques-indiennes | `brahmagupta` | [598, 668] approx | 598 – 670 | exemple déjà connu du propriétaire |
| probabilites-classiques | `bayes` | [1701, 1761] approx | 1702 – 1761 | naissance incertaine chez MacTutor lui-même |
| algebre-renaissance | `pacioli` | [1447, 1517] approx | 1445 – 1517 | brief § 5 impose [1447, 1517] approx |
| algebre-renaissance | `tartaglia` | [1499, 1557] approx | 1500 – 1557 | brief § 5 impose [1499, 1557] approx |
| perspective-et-cartographie | `piero-della-francesca` | [1415, 1492] approx | 1420 – 1492 | naissance débattue (vers 1412–1420) ; brief § 5 |

## 3. Figures sans page MacTutor (pas de slug)

Vérifiées sur l'index alphabétique du site, pas seulement en cache.

- Antiquité : `nabu-rimannu`, `kidinnu` (calcul-des-scribes), `zhang-cang` (mathématiques-chinoises-anciennes).
- Médiéval : `abelard`, `pierre-d-espagne`, `jean-buridan` (logique-scolastique ; Buridan n'est mentionné que dans la bio d'Oresme).
- Lumières : `meusnier` (geometrie-des-lumieres).
- Renaissance : `graunt` (naissance-des-probabilites).
- Contemporain-a : `zhang-yitang`, `bhargava`, `kac`, `ruelle`, `douady`, `hubbard`, `villani`.
- Contemporain-b : `haken`, `kesten`, `efron`, `tibshirani`, `smirnov`, `hairer`, `reed`, `berlekamp`, `diffie`, `hellman`, `rivest`, `koblitz`, `shamir`, `micali`, `goldwasser`, `hartmanis`, `karp`, `cook`, `levin`, `razborov`, `arora`, `morley`, `scott`, `solovay`, `martin-lof`, `girard`, `woodin`, `cooley`, `buchberger`, `huet`, `zeilberger`, `hales`, `coquand`.

## 4. Pages MacTutor à manier avec prudence

- **`Liu_Hui`** affiche sous l'en-tête de Liu Hui le corps de la biographie de
  Diophante (vérifié en ligne) : slug juste, texte inutilisable comme source
  tant que MacTutor n'a pas corrigé.
- **`Brahmagupta`** attribue à Brahmagupta la résolution de 61x² + 1 = y²,
  que l'atlas donne à juste titre à Bhāskara II (chakravāla) : ne pas sourcer
  ce point depuis cette page.
- **L'index chronologique** donne pour `Al-Kashi` 1390–1450 alors que la page
  affiche « about 1380 – 22 June 1429 » (conforme à l'atlas) : l'index est en
  défaut, seule la page fait foi.

## 5. Slugs non triviaux (confirmation `--text`)

`Li_Ye` ↔ figure `li-ye` (Li Zhi renommé Li Ye) ; `Al-Tusi_Sharaf` ≠
`Al-Tusi_Nasir` ; `Hamilton` = Hamilton le mathématicien (≠ `Hamilton_William`,
le philosophe) ; `Peirce_Charles` ≠ `Peirce_Benjamin` ; `Aleksandrov` = Pavel
le topologue (≠ `Aleksandrov_Aleksandr`, 1912–1999) ; `Khinchin` =
Khintchine ; `Ricci-Curbastro` ; `Novikov` = Pyotr (≠ son fils
`Novikov_Sergi`) ; `Uhlenbeck_Karen` ≠ `Uhlenbeck` (George, physicien) ;
`Browder_William` ≠ `Browder` (Felix) ; `Artin_Michael` ≠ `Artin` (Emil) ;
`Mane` = Mañé ; `Lax_Peter` ≠ `Lax` (Gaspar Lax, XVᵉ s.) ; `Werner_Wendelin`
≠ `Werner` (Johann, XVᵉ s.).
