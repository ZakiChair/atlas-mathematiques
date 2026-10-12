import type { Domain, Link, MathematicianLink, Source } from '../types';

/** Sources propres à ce fichier (le socle est dans ../sources.ts : ne pas le redéclarer). */
export const SOURCES_PHYSIQUE_B: Source[] = [
  // — Mécanique céleste —
  { id: 'taton-wilson-planetary', type: 'livre', author: 'René Taton, Curtis Wilson (dir.)', title: 'Planetary Astronomy from the Renaissance to the Rise of Astrophysics', year: 1989, publisher: 'Cambridge University Press', note: 'The General History of Astronomy, vol. 2A (de Tycho Brahe à Newton) et 2B (XVIIIᵉ-XIXᵉ siècles).' },
  { id: 'grosser-neptune', type: 'livre', author: 'Morton Grosser', title: 'The Discovery of Neptune', year: 1962, publisher: 'Harvard University Press', note: 'Rééd. Dover, 1979.' },
  // — Ondes et acoustique —
  { id: 'hunt-acoustics', type: 'livre', author: 'Frederick V. Hunt', title: 'Origins in Acoustics: The Science of Sound from Antiquity to the Age of Newton', year: 1978, publisher: 'Yale University Press' },
  { id: 'beyer-sounds', type: 'livre', author: 'Robert T. Beyer', title: 'Sounds of Our Times: Two Hundred Years of Acoustics', year: 1999, publisher: 'Springer / AIP Press' },
  // — Électricité et électromagnétisme —
  { id: 'heilbron-electricity', type: 'livre', author: 'John L. Heilbron', title: 'Electricity in the 17th and 18th Centuries: A Study of Early Modern Physics', year: 1979, publisher: 'University of California Press', note: 'Rééd. Dover, 1999.' },
  { id: 'whittaker-aether', type: 'livre', author: 'Edmund T. Whittaker', title: 'A History of the Theories of Aether and Electricity', year: 1910, publisher: 'Longmans, Green & Co.', note: 'Éd. refondue en deux volumes, Thomas Nelson & Sons, 1951-1953 ; rééd. Dover, 1989.' },
  { id: 'williams-faraday', type: 'livre', author: 'L. Pearce Williams', title: 'Michael Faraday: A Biography', year: 1965, publisher: 'Basic Books', note: 'Rééd. Da Capo Press, 1987.' },
  { id: 'harman-maxwell', type: 'livre', author: 'Peter M. Harman', title: 'The Natural Philosophy of James Clerk Maxwell', year: 1998, publisher: 'Cambridge University Press' },
  { id: 'darrigol-electrodynamics', type: 'livre', author: 'Olivier Darrigol', title: 'Electrodynamics from Ampère to Einstein', year: 2000, publisher: 'Oxford University Press' },
  // — Thermodynamique et mécanique statistique —
  { id: 'cardwell-watt-clausius', type: 'livre', author: 'Donald S. L. Cardwell', title: 'From Watt to Clausius: The Rise of Thermodynamics in the Early Industrial Age', year: 1971, publisher: 'Cornell University Press', note: 'Rééd. Iowa State University Press, 1989.' },
  { id: 'kuhn-energy-conservation', type: 'article', author: 'Thomas S. Kuhn', title: 'Energy Conservation as an Example of Simultaneous Discovery', year: 1959, publisher: 'in Marshall Clagett (dir.), Critical Problems in the History of Science, University of Wisconsin Press' },
  { id: 'brush-heat', type: 'livre', author: 'Stephen G. Brush', title: 'The Kind of Motion We Call Heat: A History of the Kinetic Theory of Gases in the 19th Century', year: 1976, publisher: 'North-Holland', note: 'Deux volumes.' },
  { id: 'smith-wise-kelvin', type: 'livre', author: 'Crosbie Smith, M. Norton Wise', title: 'Energy and Empire: A Biographical Study of Lord Kelvin', year: 1989, publisher: 'Cambridge University Press' },
  { id: 'cercignani-boltzmann', type: 'livre', author: 'Carlo Cercignani', title: 'Ludwig Boltzmann: The Man Who Trusted Atoms', year: 1998, publisher: 'Oxford University Press' },
  { id: 'wheeler-gibbs', type: 'livre', author: 'Lynde Phelps Wheeler', title: 'Josiah Willard Gibbs: The History of a Great Mind', year: 1951, publisher: 'Yale University Press', note: 'Rééd. 1998.' },
  // — Optique ondulatoire —
  { id: 'buchwald-wave-theory', type: 'livre', author: 'Jed Z. Buchwald', title: 'The Rise of the Wave Theory of Light: Optical Theory and Experiment in the Early Nineteenth Century', year: 1989, publisher: 'University of Chicago Press' },
  { id: 'darrigol-optics', type: 'livre', author: 'Olivier Darrigol', title: 'A History of Optics from Greek Antiquity to the Nineteenth Century', year: 2012, publisher: 'Oxford University Press' },
  { id: 'howson-appraisal', type: 'livre', author: 'Colin Howson (dir.)', title: 'Method and Appraisal in the Physical Sciences: The Critical Background to Modern Science, 1800-1905', year: 1976, publisher: 'Cambridge University Press', note: 'Contient John Worrall, « Thomas Young and the “refutation” of Newtonian optics ».' },
];

/**
 * Pendant physique — partie B : 1700 → 1900 (mécanique céleste, ondes et
 * acoustique, électricité et électromagnétisme, thermodynamique et mécanique
 * statistique, optique ondulatoire).
 * Plan : docs/superpowers/plans/2026-10-12-pendant-physique.md § 5.2.
 */
export const PHYSIQUE_B: Domain[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Mécanique céleste et astronomie de position
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'mecanique-celeste',
    name: 'Mécanique céleste et astronomie de position',
    mapName: 'Mécanique céleste',
    altNames: ['Astronomie gravitationnelle', 'Astronomie mathématique'],
    era: 'lumieres',
    period: { start: 1687, end: 1846 },
    continents: ['physique'],
    places: ['Cambridge', 'Paris', 'Greenwich', 'Saint-Pétersbourg', 'Göttingen', 'Berlin'],
    map: { x: 2900, y: 4700, size: 2, palette: { fill: '#ffffff', stroke: '#000000', accent: '#000000' } },
    tagline: 'L’univers comme un problème de calcul : les lois de Newton, l’équation de la Lune, la planète découverte à la pointe du crayon.',
    summary:
      'Des Principia de Newton (1687) à la découverte de Neptune (1846), le ciel devient le grand laboratoire de l’analyse. La loi de la gravitation universelle soumet l’orbite de la Lune (Clairaut, Euler), les comètes (Halley, Clairaut), la figure de la Terre (Maupertuis, La Condamine) et les perturbations des planètes (Lagrange, Laplace) à un calcul de plus en plus serré, tandis que les observatoires — Greenwich, Paris, puis Göttingen et Berlin — fournissent les positions à battre. En 1846, en retournant les équations de la perturbation pour en déduire la position du corps perturbateur, Urbain Le Verrier et John Couch Adams localisent chacun une huitième planète, Neptune, découverte au télescope de Berlin : le triomphe public de la mécanique du ciel.',
    methods: [
      {
        kind: 'fait',
        text: 'La méthode des perturbations : on part de l’ellipse de Kepler, puis on corrige ses éléments (grand axe, excentricité, nœud, périhélie) par les attractions des autres corps, développées en séries d’angles moyens ; la variation des constantes de Lagrange transforme ces corrections en un système d’équations différentielles soluble par approximations successives.',
        sources: ['taton-wilson-planetary', 'gillispie-laplace'],
      },
      {
        kind: 'fait',
        text: 'L’observation à la méridienne : lunettes méridiannes et cercles répétitifs donnent les passages au méridien au centième de seconde et au dixième de seconde d’arc ; les tables astronomiques (moyens mouvements, inégalités) se comparent ensuite aux séries calculées, l’écart entre ciel et calcul devenant lui-même un instrument de découverte.',
        sources: ['taton-wilson-planetary', 'grosser-neptune'],
      },
      {
        kind: 'interpretation',
        text: 'Pour les historiens (Wilson, Taton, Gillispie), le programme laplacien inverse le rapport entre théorie et observation : ce n’est plus la loi que l’on cherche dans les phénomènes, comme chez Newton, mais les phénomènes — positions, inégalités, comètes, planètes — que l’on déduit de la loi ; l’anomalie devient la ressource épistémique majeure de la mécanique céleste.',
        sources: ['taton-wilson-planetary', 'gillispie-laplace'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'Les institutions pèsent autant que les télescopes : l’Académie royale des sciences met les grands problèmes au concours (figure de la Terre, Lune, inégalités de Jupiter et Saturne) ; le Bureau des longitudes, créé en 1795, salarie l’astronomie de calcul ; Greenwich publie les Observations de Maskelyne puis d’Airy, et la British Association finance les grandes réductions de positions.',
        sources: ['taton-wilson-planetary', 'mactutor'],
      },
      {
        kind: 'fait',
        text: 'Le problème des longitudes en mer structure la recherche lunaire : le Parlement britannique promet jusqu’à 20 000 £ (Acte de 1714) pour une détermination fiable ; les tables de la Lune de Tobias Mayer, envoyées d’Allemagne, permettent la méthode des distances lunaires et valent à sa veuve 3 000 £ en 1765.',
        sources: ['taton-wilson-planetary', 'mactutor'],
      },
      {
        kind: 'fait',
        text: 'L’affaire Neptune est aussi une affaire de réseaux : le 23 septembre 1846, la lettre de Le Verrier arrive à Galle à l’observatoire de Berlin, où la carte de Bremick (fraîchement imprimée de la zone du ciel concernée, absente à Paris) permet l’identification en une demi-heure ; Adams, lui, avait remis ses éléments à Airy dès septembre 1845, et Challis avait observé la planète sans la reconnaître.',
        sources: ['grosser-neptune', 'mactutor'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'En 1747, Clairaut, Euler et d’Alembert obtiennent chacun une avance de l’apogée lunaire égale à la moitié de la valeur observée ; Clairaut propose d’abord de corriger la loi en 1/r², puis revient sur ses pas en poussant l’approximation au second ordre (1749) : l’écart était dans le calcul, non dans la loi.',
        sources: ['taton-wilson-planetary', 'mactutor'],
      },
      {
        kind: 'fait',
        text: 'La priorité de la découverte de Neptune oppose longuement Paris et Londres : Arago défend Le Verrier, Airy Adams ; la Royal Astronomical Society décerne sa médaille aux deux (1848). L’historiographie actuelle, de Grosser à Smart et Kollerstrom, crédite les deux calculs indépendants tout en notant que la recherche anglaise, informée mais privée, n’avait pas abouti.',
        sources: ['grosser-neptune', 'mactutor'],
      },
      {
        kind: 'interpretation',
        text: 'Pour Wilson comme pour Smith, l’épisode Neptune cristallise deux styles : l’école parisienne du calcul public (Le Verrier publie ses positions à l’Académie dès novembre 1845) et la culture cambridgienne de la recherche confidentielle (Adams dépose ses éléments chez Airy). L’anomalie d’Uranus n’aurait pas suffi : il fallait aussi croire que la loi de Newton tiendrait à trente unités astronomiques.',
        sources: ['grosser-neptune', 'taton-wilson-planetary'],
      },
    ],
    keyDates: [
      { year: 1687, text: 'Publication des Philosophiae naturalis principia mathematica : les lois de Kepler deviennent des conséquences de la gravitation universelle.' },
      { year: 1729, text: 'Bradley annonce la découverte de l’aberration de la lumière, preuve directe du mouvement de la Terre et de la vitesse finie de la lumière.' },
      { year: 1738, text: 'Les expéditions de Laponie (Maupertuis) et du Pérou (La Condamine, Bouguer) confirment l’aplatissement de la Terre prédit par Newton.' },
      { year: 1749, text: 'Clairaut rétablit l’accord entre la loi en 1/r² et le mouvement de l’apogée lunaire, en poussant le calcul au second ordre.' },
      { year: 1759, text: 'Retour de la comète de Halley au périhélie, prédit par Clairaut, Lalande et Lepaute : premier triomphe public du calcul céleste.' },
      { year: 1781, text: 'William Herschel découvre Uranus, première planète connue depuis l’Antiquité, en balayant systématiquement le ciel.' },
      { year: 1801, text: 'Piazzi découvre Cérès ; Gauss en calcule l’orbite par les moindres carrés et permet sa redécouverte en fin d’année.' },
      { year: 1821, text: 'Bouvard publie ses Tables d’Uranus : les observations modernes s’écartent déjà du calcul, écart qu’il attribue à une cause extérieure.' },
      { year: 1846, text: 'Sur l’indication de Le Verrier, Galle observe Neptune à l’observatoire de Berlin le 23 septembre, à moins d’un degré de la position calculée.' },
    ],
    theories: [
      {
        id: 'mc-gravitation-et-deux-corps',
        name: 'Gravitation universelle et problème des deux corps',
        period: { start: 1687, end: 1745 },
        summary: 'Le programme des Principia : une même loi — l’attraction en raison inverse du carré de la distance — rend compte de la chute des corps, des marées, de la précession et des orbites de Kepler. Le premier travail est de montrer que les corps célestes obéissent exactement à cette loi : attraction des sphères, figure de la Terre, comètes.',
        traits: ['Attraction en 1/r²', 'Orbits képlériens déduites', 'Attraction des sphères', 'Comètes et paraboles', 'Précession des équinoxes'],
      },
      {
        id: 'mc-perturbations-et-stabilite',
        name: 'Perturbations, Lune et stabilité',
        period: { start: 1745, end: 1827 },
        summary: 'Trois corps et plus ne se résolvent plus exactement : c’est le règne des approximations — séries trigonométriques, variation des constantes, équations séculaires. La théorie de la Lune de Clairaut, les inégalités séculaires de Lagrange et Laplace et le Traité de mécanique céleste parachèvent l’édifice.',
        traits: ['Variation des constantes', 'Théorie de la Lune', 'Grande inégalité de Jupiter et Saturne', 'Invariabilité des grands axes', 'Tables astronomiques'],
      },
      {
        id: 'mc-geodesie-et-figure',
        name: 'Géodésie et figure de la Terre',
        period: { start: 1730, end: 1840 },
        summary: 'La forme de la Terre est un problème de gravitation : l’aplatissement aux pôles, les mesures d’arc du méridien en Laponie et au Pérou, l’attraction des montagnes et la pesanteur variable relient l’astronomie, la cartographie et le calcul intégral.',
        traits: ['Arc de méridien', 'Aplatissement aux pôles', 'Expéditions de Laponie et du Pérou', 'Pendule et pesanteur'],
      },
      {
        id: 'mc-astronomie-de-position',
        name: 'Astronomie de position et problèmes inverses',
        period: { start: 1780, end: 1846 },
        summary: 'Le catalogue devient machine de guerre : Uranus, les petites planètes, les écarts résiduels. La détermination d’orbite par moindres carrés (Cérès, Gauss) puis l’inversion du problème des perturbations (Le Verrier, Adams) font de la position un argument d’existence.',
        traits: ['Balayages systématiques du ciel', 'Orbites de petites planètes', 'Moindres carrés', 'Anomalies résiduelles', 'Prédiction de Neptune'],
      },
    ],
    mathematicians: [
      {
        id: 'bradley',
        name: 'James Bradley',
        years: [1693, 1762],
        origin: 'Oxford et Greenwich',
        bio: 'Troisième Astronome royal (1742), formé à Oxford où il enseigna la grammaire avant l’astronomie, Bradley découvre l’aberration de la lumière (1729) en cherchant la parallaxe des étoiles, puis la nutation de l’axe terrestre (1748) au terme de dix-neuf ans d’observations. Ses catalogues de Greenwich restèrent un siècle le fonds de référence de l’astronomie de position.',
        theoryId: 'mc-gravitation-et-deux-corps',
        mactutor: 'Bradley',
        sources: ['mactutor'],
      },
      {
        id: 'bouvard',
        name: 'Alexis Bouvard',
        years: [1767, 1843],
        origin: 'Paris',
        bio: 'Paysan savoyard monté à Paris, calculard de Laplace puis directeur de l’Observatoire de Paris, Bouvard publie les tables de Jupiter et de Saturne (1808) et celles d’Uranus (1821) où il enregistre, sans pouvoir les réduire, les écarts entre les observations anciennes et modernes — le point de départ de toute l’affaire Neptune.',
        theoryId: 'mc-astronomie-de-position',
        mactutor: 'Bouvard',
        sources: ['mactutor'],
      },
      {
        id: 'somerville',
        name: 'Mary Somerville',
        years: [1780, 1872],
        origin: 'Jedburgh et Édimbourg',
        bio: 'Autodidacte formée contre l’avis de sa famille, Mary Somerville donne avec The Mechanism of the Heavens (1831) la première présentation anglaise de la Mécanique céleste de Laplace, saluée par Peacock et Herschel ; membre honoraire de la Royal Astronomical Society en 1835 — avec Caroline Herschel, première femme ainsi honorée —, elle pressent dans l’édition de 1842 que les anomalies d’Uranus pourraient trahir une planète inconnue.',
        theoryId: 'mc-astronomie-de-position',
        mactutor: 'Somerville',
        sources: ['mactutor'],
      },
      {
        id: 'adams',
        name: 'John Couch Adams',
        years: [1819, 1892],
        origin: 'Cornouailles et Cambridge',
        bio: 'Élève de St John’s College, senior wrangler en 1843, Adams résout dès 1844 le problème inverse des perturbations d’Uranus et communique en septembre 1845 à Airy les éléments d’une nouvelle planète ; la recherche britannique, confiée à Challis, ne la reconnaît pas avant que Galle ne l’observe à Berlin. Professeur à Cambridge puis directeur de l’observatoire (1861), il refuse la couronne de la découverte.',
        theoryId: 'mc-astronomie-de-position',
        mactutor: 'Adams',
        sources: ['mactutor'],
      },
      {
        id: 'le-verrier',
        name: 'Urbain Le Verrier',
        years: [1811, 1877],
        origin: 'Saint-Lô et Paris',
        bio: 'Formé à l’École polytechnique, démonstrateur de Gay-Lussac avant que Arago ne l’oriente vers la mécanique céleste, Le Verrier publie en 1845-1846 ses calculs des perturbations d’Uranus et en déduit la position de la planète perturbatrice, que Galle observe à Berlin le 23 septembre 1846. Directeur de l’Observatoire de Paris (1854), il fonds le service météorologique national et calcule, sans l’expliquer, l’avance du périhélie de Mercure.',
        theoryId: 'mc-astronomie-de-position',
        mactutor: 'Le_Verrier',
        sources: ['mactutor'],
      },
    ],
    relatedMathematicianIds: ['newton', 'halley', 'clairaut', 'euler', 'maupertuis', 'lagrange', 'laplace', 'gauss'],
    results: [
      {
        id: 'loi-de-gravitation-universelle',
        title: 'Loi de la gravitation universelle',
        year: 1687,
        authorName: 'Isaac Newton',
        mathematicianId: 'newton',
        theoryId: 'mc-gravitation-et-deux-corps',
        kind: 'concept',
        statement: 'Deux corps quelconques s’attirent avec une force proportionnelle au produit de leurs masses et inversement proportionnelle au carré de leur distance ; la même loi explique la chute des pierres, les orbites des planètes et celles des satellites.',
        comment: 'La troisième loi des Principia : Newton déduit les orbites de Kepler de l’attraction en 1/r² et vérifie l’identité entre gravité terrestre et céleste par le « calcul de la Lune ». C’est le fondement de deux siècles de mécanique céleste — et le modèle auquel l’électrostatique de Coulomb, puis la chimie des affinités, emprunteront leur forme.',
        context: [
          {
            kind: 'fait',
            text: 'Kepler avait énoncé ses trois lois (1609-1619) comme des règles empiriques du mouvement de Mars ; Hook, Wren et Halley soupçonnent la loi du carré inverse dès les années 1680, sans savoir en déduire les orbites. Newton montre à Halley, en août 1684, que l’ellipse suit de cette loi — l’origine des Principia.',
            sources: ['taton-wilson-planetary', 'guicciardini-newton'],
          },
          {
            kind: 'fait',
            text: 'La vérification lunaire de Newton compare l’accélération de la Lune vers la Terre, mesurée par sa distance et sa période, à l’accélération de la pesanteur à la surface : le rapport 1/3 600 ≈ (1/60)² confirme le carré inverse à la précision des données de Picard.',
            sources: ['taton-wilson-planetary', 'kline-thought'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Le programme newtonien ordonne deux siècles de recherche : comètes (Halley, Clairaut), théorie de la Lune (Clairaut, Euler, Mayer), perturbations planétaires (Lagrange, Laplace) et figure de la Terre — jusqu’à Neptune, puis à l’avance anormale du périhélie de Mercure, qui échappera au cadre.',
            sources: ['taton-wilson-planetary', 'gillispie-laplace'],
          },
          {
            kind: 'interpretation',
            text: 'Pour les historiens, l’acceptation de l’« attraction » a demandé près d’un demi-siècle sur le continent : les cartésiens lui reprochaient une qualité occulte ; c’est l’accord des mesures — Laponie, Lune, comète de 1759 — qui a fini par faire de la loi le standard de l’explication physique.',
            sources: ['taton-wilson-planetary', 'kline-thought'],
          },
        ],
      },
      {
        id: 'theoreme-de-l-attraction-spherique',
        title: 'Attraction des corps sphériques',
        altTitle: 'Principia, livre I, propositions 71-76',
        year: 1687,
        authorName: 'Isaac Newton',
        mathematicianId: 'newton',
        theoryId: 'mc-gravitation-et-deux-corps',
        kind: 'theoreme',
        statement: 'Un corps sphérique homogène — ou formé de couches sphériques homogènes — attire un point extérieur comme si toute sa masse était concentrée en son centre ; à l’intérieur d’une couche sphérique, l’attraction totale est nulle.',
        comment: 'Proposition capitale des Principia, sans laquelle le calcul de la Lune — la Terre assimilée à un point — resterait une fiction. Newton l’admettait dès 1685 ; Halley l’attendait pour publier. Maclaurin, puis Laplace et Legendre, en feront le premier problème de la théorie du potentiel.',
        intuition: [
          {
            kind: 'fait',
            text: 'Pour un point très éloigné de la sphère, toutes ses parties sont à peu près à la même distance : l’attraction tend vers celle d’une masse ponctuelle au centre. Le théorème affirme que cette approximation est exacte à toute distance — miracle de la loi en 1/r², dont l’intégrale compense précisément les parties proches et lointaines.',
            sources: ['kline-thought', 'guicciardini-newton'],
          },
          {
            kind: 'fait',
            text: 'À l’intérieur d’une couche sphérique, le résultat s’explique géométriquement : un cône traversant le point découpe sur la couche deux calottes opposées ; leurs attractions, en 1/r², sont proportionnelles à leurs aires — elles-mêmes proportionnelles aux carrés des distances — et se détruisent exactement.',
            sources: ['kline-thought', 'taton-wilson-planetary'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Newton considère d’abord une fine couche sphérique : pour un point intérieur P, il oppose les deux calottes découpées par un même cône de sommet P ; le rapport des attractions est celui des aires divisé par le carré des distances, égal à un par la similitude des calottes — la somme s’annule.',
            sources: ['kline-thought', 'guicciardini-newton'],
          },
          {
            kind: 'fait',
            text: 'Pour un point extérieur, il ramène la comparaison à un point symétrique intérieur par une construction de cercles sécants (propositions 70-71) : l’attraction de la couche sur le point extérieur s’exprime par un rapport où la distance du centre entre à la place du rayon.',
            sources: ['kline-thought', 'guicciardini-newton'],
          },
          {
            kind: 'fait',
            text: 'L’intégration sur l’épaisseur de la couche donne, pour une sphère pleine homogène, une attraction égale à celle de la masse entière concentrée au centre : c’est la proposition 74, clé de voûte du calcul de la Lune.',
            sources: ['kline-thought', 'taton-wilson-planetary'],
          },
          {
            kind: 'fait',
            text: 'La superposition des couches donne le même théorème pour toute sphère à densité radiale ; à l’intérieur, seules les couches situées sous le point contribuent — résultat que l’école du potentiel écrira plus tard « flux du champ = −4π fois la masse enfermée ».',
            sources: ['kline-thought', 'dieudonne-abrege'],
          },
        ],
      },
      {
        id: 'aberration-de-la-lumiere',
        title: 'Aberration de la lumière',
        year: 1729,
        authorName: 'James Bradley',
        mathematicianId: 'bradley',
        theoryId: 'mc-gravitation-et-deux-corps',
        kind: 'concept',
        statement: 'Le déplacement apparent annuel des étoiles, d’environ 20 secondes d’arc, s’explique par la composition de la vitesse de la lumière avec la vitesse orbitale de la Terre : un tube optique doit être incliné dans le sens du mouvement, comme une pluie verticale paraît oblique à un marcheur.',
        comment: 'Cherchant la parallaxe de γ Draconis avec Molyneux (1725), Bradley mesure un décalage en direction, non en parallaxe, puis l’explique en 1728 : c’est la première preuve directe du mouvement de la Terre et une mesure de la vitesse de la lumière, confirmant le retard découvert par Rømer sur les satellites de Jupiter.',
        context: [
          {
            kind: 'fait',
            text: 'La parallaxe stellaire, seule preuve observationnelle attendue du système copernicien, était cherchée depuis Tycho ; les meilleurs visés de Hooke et de Flamsteed n’avaient rien montré. Bradley installe à Wanstead une lunette verticale de 12 pieds et enregistre, entre 1725 et 1727, une oscillation de 40″ dans le sens opposé à celui de la parallaxe.',
            sources: ['taton-wilson-planetary', 'mactutor'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'L’aberration déplace toutes les étoiles d’environ 20″ sur un petit cercle annuel : Bradley en déduit la nutation (1748) et la précession exacte ; l’effet devient un terme de réduction obligatoire dans toutes les tables de position, de Maskelyne à nos jours.',
            sources: ['taton-wilson-planetary', 'mactutor'],
          },
          {
            kind: 'interpretation',
            text: 'L’explication « composition des vitesses » supposait la lumière faite de corpuscules ; la théorie ondulatoire en héritera un problème — pourquoi l’éther ne subit-il pas l’aberration ? — que Fresnel résoudra par son coefficient d’entraînement.',
            sources: ['darrigol-optics', 'whittaker-aether'],
          },
        ],
      },
      {
        id: 'figure-de-la-terre-expeditions',
        title: 'Mesure de la figure de la Terre : expéditions de Laponie et du Pérou',
        year: 1738,
        authorName: 'Pierre-Louis Moreau de Maupertuis ; Charles-Marie de La Condamine, Pierre Bouguer',
        mathematicianId: 'maupertuis',
        theoryId: 'mc-geodesie-et-figure',
        kind: 'methode',
        statement: 'La comparaison de deux arcs de méridien — l’un mesuré près du cercle polaire, l’autre à l’équateur — donne l’aplatissement de la Terre : un degré de latitude est plus long au pôle qu’à l’équateur, la Terre est aplatie comme le veut la gravitation.',
        comment: 'Le grand duel de la géodésie : la géométrie de Cassini annonçait une Terre allongée, Newton et Huygens prédisaient l’aplatissement. Maupertuis mesure l’arc de Torné (1736-1737), La Condamine et Bouguer celui de Quito (1735-1744) : l’aplatissement de ~1/178 est confirmé — et la triangulation géodésique devient la science de la carte.',
        context: [
          {
            kind: 'fait',
            text: 'Les mesures de Picard (1670) puis celles des Cassini (1683-1718, prolongées jusqu’en 1733) semblaient montrer une Terre allongée aux pôles. La polémique théorique — tourbillons de Descartes contre attraction newtonienne — se tranche sur une question de mesure : la longueur d’un degré de latitude croît-elle ou décroît-elle avec la latitude ?',
            sources: ['taton-wilson-planetary', 'mactutor'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La valeur de l’aplatissement alimente la théorie de la précession, la dynamique des marées et les tables de la Lune ; la mesure de l’arc de Quito sert en 1791 de base à la définition du mètre (arc de Dunkerque-Barcelone de Delambre et Méchain) et aux tables de réfraction géodésique.',
            sources: ['taton-wilson-planetary', 'mactutor'],
          },
        ],
      },
      {
        id: 'tables-lunaires-de-mayer',
        title: 'Tables lunaires de Tobias Mayer',
        year: 1755,
        authorName: 'Tobias Mayer',
        theoryId: 'mc-perturbations-et-stabilite',
        kind: 'methode',
        statement: 'En combinant plusieurs dizaines d’équations d’observation — trois positions de la Lune par système de trois équations, chaque coefficient de l’orbite mesuré par moyenne des systèmes voisins — Mayer obtient des tables de la Lune précises à une minute d’arc, suffisantes pour le problème des longitudes.',
        comment: 'Publiées à Londres en 1770, les tables de Mayer permettent la détermination de la longitude en mer à un degré près — méthode des distances lunaires du Nautical Almanac. Sa « moyenne des équations » est le précurseur direct de la combinaison des observations par moindres carrés.',
        context: [
          {
            kind: 'fait',
            text: 'Le prix des longitudes (1714) promet jusqu’à 20 000 £ pour une détermination à un demi-degré près ; les tables lunaires — position exacte de la Lune, horloge céleste universelle — en sont le chemin théorique. Mayer envoie ses tables à Londres en 1755 depuis Göttingen.',
            sources: ['taton-wilson-planetary', 'mactutor'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La méthode de Mayer — regrouper les équations excédentaires et en faire la moyenne pour stabiliser les coefficients — sera reprise par Legendre (1805) et justifiée par Gauss (1809) comme « moindres carrés » ; la veuve de Mayer reçoit 3 000 £ du Parlement britannique en 1765.',
            sources: ['taton-wilson-planetary', 'stigler-statistics'],
          },
        ],
      },
      {
        id: 'orbite-de-ceres',
        title: 'Détermination de l’orbite de Cérès',
        year: 1801,
        authorName: 'Carl Friedrich Gauss',
        mathematicianId: 'gauss',
        theoryId: 'mc-astronomie-de-position',
        kind: 'methode',
        statement: 'À partir de quelques dizaines de positions de la planète disparue, Gauss détermine une orbite complète en combinant la méthode des moindres carrés — minimiser la somme des carrés des écarts entre ciel et calcul — avec une résolution directe du triangle Terre-Soleil-planète.',
        comment: 'Piazzi découvre Cérès le 1ᵉʳ janvier 1801, la perd au Soleil ; Gauss, sans voir les données avant septembre, publie en décembre des éphémérides qui permettent à Zach et Olbers de la retrouver. Sa Theoria motus (1809) exposera la méthode complète — fondement de l’astrométrie moderne.',
        context: [
          {
            kind: 'fait',
            text: 'La nouvelle planète n’était visible que 1° par nuit et fut perdue au coucher du Soleil après un mois ; les autres astronomes calculaient des orbites paraboliques ou des hypothèses simples. Gauss inventa une méthode géométrique qui n’exigeait que trois positions — puis les affina par moindres carrés.',
            sources: ['taton-wilson-planetary', 'dunnington-gauss'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Cérès retrouvée, les petites planètes se multiplient (Pallas 1802, Junon 1804, Vesta 1807) ; la méthode de Gauss devient le protocole standard de l’astronomie de position : orbites de comètes, d’astéroïdes, satellites — jusqu’aux déterminations d’orbite des engins spatiaux.',
            sources: ['taton-wilson-planetary', 'stigler-statistics'],
          },
        ],
      },
      {
        id: 'anomalies-d-uranus',
        title: 'Anomalies du mouvement d’Uranus',
        year: 1821,
        authorName: 'Alexis Bouvard',
        mathematicianId: 'bouvard',
        theoryId: 'mc-astronomie-de-position',
        kind: 'probleme',
        statement: 'Les tables d’Uranus calculées par Bouvard ne peuvent représenter à la fois les observations anciennes (antérieures à 1781) et les observations modernes : l’écart atteint 40″ en 1821 et ne cesse de croître.',
        comment: 'Bouvard écarta les anciennes positions plutôt que de douter de la loi, et évoqua une « cause extérieure et inconnue » : la lecture la plus prudente ouvrait la voie à une planète perturbatrice. Le problème resta sans suite pendant vingt ans — Airy le jugea sérieux en 1835 — jusqu’aux calculs d’Adams et de Le Verrier.',
        intuition: [
          {
            kind: 'fait',
            text: 'Bouvard raisonna que si les positions anciennes étaient exactes et les tables correctes, alors l’orbite déduite des anciennes ne coïncidait pas avec celle des modernes : l’anomalie était donc soit dans les observations, soit dans la gravitation — et il pencha publiquement pour « une action étrangère ».',
            sources: ['grosser-neptune', 'taton-wilson-planetary'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Grosser, l’affaire montre que l’anomalie résiduelle n’obligeait à rien : elle devenait problème de recherche seulement pour qui croyait à la fois aux positions, à la loi de Newton et à l’existence d’une planète encore invisible.',
            sources: ['grosser-neptune'],
          },
        ],
      },
      {
        id: 'decouverte-de-neptune',
        title: 'Découverte de Neptune',
        year: 1846,
        authorName: 'Urbain Le Verrier ; John Couch Adams',
        mathematicianId: 'le-verrier',
        theoryId: 'mc-astronomie-de-position',
        kind: 'probleme',
        statement: 'En inversant le problème des perturbations — trouver la planète dont les attractions expliquent les anomalies d’Uranus — Le Verrier et Adams déterminent chacun une position du ciel où Galle observe la planète le 23 septembre 1846, à moins d’un degré de l’indication de Le Verrier.',
        comment: 'Le Verrier publia sa solution en trois mémoires (novembre 1845 - août 1846) ; Arago fit valoir sa position à Galle, qui l’observa en une demi-heure avec la carte de Bremick. Adams, dont le calcul était antérieur mais privé, reçut sa part d’honneur après la querelle franco-anglaise. C’est le sommet de la mécanique céleste déterministe — « l’homme qui découvrit une planète à la pointe de son crayon ».',
        major: true,
        context: [
          {
            kind: 'fait',
            text: 'Les anomalies d’Uranus atteignaient plus d’une minute d’arc dans les années 1840 ; l’Académie confia le problème à Le Verrier (1845). En inversant les équations de la perturbation — où doit se trouver le corps pour produire l’écart observé ? —, il obtint en juin 1846 un premier élément d’orbite, puis le 31 août une position finale.',
            sources: ['grosser-neptune', 'taton-wilson-planetary'],
          },
          {
            kind: 'fait',
            text: 'Adams avait communiqué à Airy des éléments d’une planète hypothétique dès octobre 1845 ; Airy, qui doutait des tables et de la méthode, ne lança la recherche de Challis qu’en juillet 1846. Challis enregistra Neptune les 4 et 12 août sans la reconnaître, faute de carte de la zone.',
            sources: ['grosser-neptune', 'mactutor'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Le 23 septembre 1846, Galle et d’Arrest trouvent la planète à 0°52′ de la position de Le Verrier — un « calcul à la règle à calcul » ; les éphémérides suivantes confirment l’orbite. La même méthode échouera pour Vulcain (Le Verrier y verra l’explication de l’avance du périhélie de Mercure, résistante jusqu’à Einstein) et triomphera pour Pluton (1930).',
            sources: ['grosser-neptune', 'taton-wilson-planetary'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Whittaker comme pour Gillispie, l’épisode valide moins une loi qu’un programme : la mécanique céleste peut découvrir ses propres objets. La confiance — Newton tient jusqu’à 30 unités astronomiques — est devenue le critère épistémique du XIXᵉ siècle.',
            sources: ['grosser-neptune', 'whittaker-aether'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Un corps perturbateur n’agit pas de la même façon selon sa position relative : avant la conjonction, il avance la planète troublée ; après, il la retarde. L’écart d’Uranus, maximal vers 1822, puis décroissant, dessinait ainsi le sens de la perturbation et sa date — une seule solution plausible : une planète extérieure à Saturne, presque en conjonction vers 1822.',
            sources: ['grosser-neptune', 'taton-wilson-planetary'],
          },
          {
            kind: 'fait',
            text: 'Le calcul de Le Verrier inverse littéralement les tables : là où la mécanique classique calcule les perturbations d’une orbite donnée, il cherche l’orbite dont les perturbations reproduisent les écarts — un problème mal posé, rendu soluble en fixant le grand axe par la loi de Titius-Bode et en faisant varier les autres éléments.',
            sources: ['grosser-neptune', 'gillispie-laplace'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Le Verrier écrit les perturbations d’Uranus sous forme d’équations différentielles pour chaque élément de l’orbite, où la force perturbatrice est développée en séries des longitudes moyennes ; il exprime les écarts observés comme des intégrales de ces équations.',
            sources: ['grosser-neptune', 'taton-wilson-planetary'],
          },
          {
            kind: 'fait',
            text: 'Il fixe le grand axe de la planète inconnue à 36-38 unités astronomiques — la loi de Titius-Bode, confirmée par Uranus — et fait varier l’excentricité, l’inclinaison, la masse et les longitudes jusqu’à ce que les inégalités calculées reproduisent les écarts, en particulier le retard séculaire et le pic de 1822.',
            sources: ['grosser-neptune', 'mactutor'],
          },
          {
            kind: 'fait',
            text: 'La solution est dégénérée : beaucoup d’orbites rendent compte des écarts. Le Verrier impose alors la moindre masse compatible, et publie le 31 août 1846 une position (en longitude, à ± 5°) et un éphéméride ; Arago suggère de chercher à Berlin, où la carte de Bremick vient de paraître.',
            sources: ['grosser-neptune'],
          },
          {
            kind: 'fait',
            text: 'Galle et d’Arrest comparent la carte à l’oculaire : une étoile de la carte manque dans le ciel — à 0°52′ de l’endroit calculé. La vérification la nuit suivante montre un disque : c’est la planète ; les observations des semaines suivantes confirment l’orbite de Le Verrier.',
            sources: ['grosser-neptune', 'mactutor'],
          },
        ],
      },
    ],
    sources: ['taton-wilson-planetary', 'grosser-neptune', 'gillispie-laplace', 'mactutor', 'kline-thought'],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Ondes et acoustique
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ondes-et-acoustique',
    name: 'Ondes et acoustique',
    mapName: 'Ondes et acoustique',
    altNames: ['Théorie du son', 'Acoustique mathématique'],
    era: 'dixneuvieme',
    period: { start: 1747, end: 1845 },
    continents: ['physique'],
    places: ['Paris', 'Berlin', 'Saint-Pétersbourg', 'Prague', 'Londres', 'Utrecht'],
    map: { x: 3450, y: 5150, size: 2, palette: { fill: '#ffffff', stroke: '#000000', accent: '#000000' } },
    tagline: 'Le champ de bataille de la fonction : une corde qui vibre, des figures de sable, et un son qui change de hauteur quand la source bouge.',
    summary:
      'En 1747, d’Alembert écrit la première équation des ondes ; vingt ans de querelle avec Euler et Daniel Bernoulli sur la « fonction quelconque » font de la corde vibrante le creuset de l’analyse. Le domaine change ensuite d’oreille : Chladni rend les vibrations visibles avec ses figures de sable (1787), Sophie Germain en tire la théorie des plaques élastiques, Laplace corrige la vitesse du son par l’échauffement adiabatique, et les expérimentateurs — Savart, Wheatstone — donnent à la fréquence son instrument de mesure. En 1842, Doppler prédit le décalage de fréquence des sources en mouvement, vérifié par les trompettistes de Buys Ballot en 1845 : le son devient une physique des observateurs.',
    methods: [
      {
        kind: 'fait',
        text: 'Deux styles de solution pour la corde : d’Alembert donne la forme d’onde voyageuse y = f(x − ct) + g(x + ct) ; Daniel Bernoulli affirme que toute vibration se décompose en modes propres sinusoïdaux superposés ; Lagrange, lui, fait tendre vers le continu une chaîne de masses ponctuelles reliées, dont il calcule les fréquences.',
        sources: ['bottazzini-higher-calculus', 'kline-thought'],
      },
      {
        kind: 'fait',
        text: 'L’expérimentation devient optique et numérique : le sable de Chladni dessine les lignes nodales des plaques ; la sirène de Cagniard de la Tour puis la roue dentée de Savart comptent les vibrations par seconde ; Wheatstone transforme les courbes nodales en figures lumineuses permanentes.',
        sources: ['beyer-sounds', 'hunt-acoustics'],
      },
      {
        kind: 'interpretation',
        text: 'Pour Bottazzini comme pour Kline, la querelle des cordes est moins un débat de physique qu’une crise sur la notion de fonction : admettre que n’importe quelle forme initiale — même faite de deux courbes raccordées — soit une solution légitime oblige à choisir entre l’intuition de Bernoulli (la physique impose la série) et la rigueur d’Euler (l’analyse impose l’équation).',
        sources: ['bottazzini-higher-calculus', 'grattan-guinness-companion'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'La querelle se joue par mémoires interposés : Académie de Berlin pour d’Alembert (1747) et Daniel Bernoulli (1753), Commentarii de Saint-Pétersbourg pour Euler (1748), Miscellanea Taurinensia pour Lagrange (1759). Euler, pourtant partisan de Bernoulli physiquement, rejette la décomposition en sinus parce qu’il la juge analytiquement fausse.',
        sources: ['bottazzini-higher-calculus', 'kline-thought'],
      },
      {
        kind: 'fait',
        text: 'Chladni donne ses démonstrations de figures sonores dans toute l’Europe ; en 1808-1809 il les produit devant l’Institut et devant Napoléon, qui fait mettre au concours la théorie mathématique des plaques vibrantes — le prix que Sophie Germain emporte en 1816 après deux essais non retenus.',
        sources: ['beyer-sounds', 'mactutor'],
      },
      {
        kind: 'fait',
        text: 'La prédiction de Doppler, publiée en 1842 dans les Abhandlungen de Bohême pour les étoiles doubles, est vérifiée dans le son par Buys Ballot : en février 1845, il fait défiler à Utrecht un train tirant des trompettistes et relève l’abaissement d’un demi-ton à la passe.',
        sources: ['beyer-sounds', 'whittaker-aether'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'Daniel Bernoulli soutient (1753) que la corde ne fait que superposer ses sons harmoniques ; Euler répond qu’une corde pincée — deux segments de droite — ne peut pas être une somme de sinus. D’Alembert tranche autrement : il exige que la fonction initiale soit au moins dérivable et périodique — position que Fourier balaiera en 1807.',
        sources: ['bottazzini-higher-calculus', 'kline-thought'],
      },
      {
        kind: 'fait',
        text: 'La théorie des plaques de Sophie Germain est discutée à l’Académie en 1811-1815 : Lagrange corrige son équation lors de sa deuxième tentative (1813), Poisson conteste la troisième (1815), et l’équation définitive des plaques n’est obtenue que par Kirchhoff en 1850.',
        sources: ['mactutor', 'beyer-sounds'],
      },
      {
        kind: 'interpretation',
        text: 'Pour les historiens de l’acoustique (Hunt, Beyer), le XIXᵉ siècle déplace l’objet : de la corde comme problème d’analyse, on passe au son comme phénomène mesuré — fréquence, timbre, propagation. L’acoustique devient alors le terrain d’essai des théories des milieux élastiques, et son extension aux ondes lumineuses l’outil de la révolution ondulatoire.',
        sources: ['beyer-sounds', 'hunt-acoustics'],
      },
    ],
    keyDates: [
      { year: 1747, text: 'D’Alembert publie son mémoire sur la corde vibrante : première équation aux dérivées partielles de la physique mathématique.' },
      { year: 1753, text: 'Daniel Bernoulli affirme que toute vibration de corde est une somme de modes propres sinusoïdaux ; Euler conteste la généralité de la série.' },
      { year: 1759, text: 'Lagrange résout la corde comme limite d’une chaîne de masses dans les Miscellanea Taurinensia.' },
      { year: 1787, text: 'Chladni publie ses Entdeckungen über die Theorie des Klanges : les figures de sable rendent les modes de plaques visibles.' },
      { year: 1802, text: 'Traité d’acoustique de Chladni : les lignes nodales deviennent la première image des modes propres d’un système étendu.' },
      { year: 1816, text: 'Sophie Germain remporte le prix de l’Académie pour les plaques élastiques ; Laplace publie la correction adiabatique de la vitesse du son.' },
      { year: 1820, text: 'Savart, avec Biot, formule la loi de l’action magnétique d’un courant — la même année où il mesure les vitesses du son dans les tuyaux.' },
      { year: 1842, text: 'Doppler publie son mémoire sur le décalage de fréquence des sources en mouvement.' },
      { year: 1845, text: 'Buys Ballot vérifie l’effet Doppler à Utrecht en faisant défiler des trompettistes sur un train.' },
    ],
    theories: [
      {
        id: 'oa-theorie-de-la-corde',
        name: 'Théorie de la corde vibrante',
        period: { start: 1747, end: 1770 },
        summary: 'L’équation des ondes et ses solutions : forme voyageuse de d’Alembert, superposition de modes de Daniel Bernoulli, chaîne discrète de Lagrange. Le désaccord sur les fonctions admissibles fait de ce problème le laboratoire où se décide ce qu’est une fonction.',
        traits: ['Équation des ondes', 'Solution de d’Alembert', 'Modes propres et harmoniques', 'Chaîne de masses de Lagrange', 'Querelle de la fonction quelconque'],
      },
      {
        id: 'oa-acoustique-des-plaques',
        name: 'Acoustique des plaques et des instruments',
        period: { start: 1787, end: 1845 },
        summary: 'Les figures de Chladni ouvrent l’ère des vibrations visualisées : lignes nodales des plaques, modes des corps sonores, théorie des plaques de Sophie Germain, sirènes et roues dentées pour compter les fréquences, lois de la tension et des nœuds dans les cordes.',
        traits: ['Figures de Chladni', 'Lignes nodales', 'Plaques élastiques de Germain et Kirchhoff', 'Sirène et roue dentée', 'Lois de la corde de Savart'],
      },
      {
        id: 'oa-propagation-et-observateur',
        name: 'Propagation et observateur',
        period: { start: 1816, end: 1845 },
        summary: 'La vitesse du son devient un problème de thermique (correction adiabatique de Laplace) et la fréquence un problème d’observateur : l’effet Doppler établit que le mouvement relatif modifie la hauteur perçue — principe que Fizeau portera à la lumière.',
        traits: ['Vitesse du son dans les gaz', 'Correction adiabatique', 'Effet Doppler', 'Fréquence et mouvement relatif'],
      },
    ],
    mathematicians: [
      {
        id: 'chladni',
        name: 'Ernst Chladni',
        years: [1756, 1827],
        origin: 'Wittenberg',
        bio: 'Docteur en droit devenu physicien itinérant, Chladni invente en 1787 le procédé des figures de sable — les lignes nodales des plaques vibrantes —, le publie dans les Entdeckungen puis le Traité d’acoustique (1802) qu’il présente dans toute l’Europe ; il défend aussi, contre l’opinion du temps, l’origine céleste des météorites.',
        theoryId: 'oa-acoustique-des-plaques',
        sources: ['beyer-sounds'],
      },
      {
        id: 'savart',
        name: 'Félix Savart',
        years: [1791, 1841],
        origin: 'Mézières et Paris',
        bio: 'Médecin reconverti en physicien, professeur au Collège de France après Biot, Savart donne avec lui la loi de l’action magnétique d’un courant (1820), étudie la vibration des cordes et des plaques (roue dentée pour compter les fréquences, lois des nœuds et des ventres), et invente le violon à coins pour isoler les modes propres.',
        theoryId: 'oa-acoustique-des-plaques',
        mactutor: 'Savart',
        sources: ['mactutor'],
      },
      {
        id: 'biot',
        name: 'Jean-Baptiste Biot',
        years: [1774, 1862],
        origin: 'Paris',
        bio: 'Protégé de Laplace, professeur au Collège de France, Biot formule avec Savart la loi électromagnétique de leur nom (1820), mesure la vitesse du son dans les tuyaux et découvre le pouvoir rotatoire des liquides (1815) ; il reste le principal artisan de l’optique corpusculaire face à Fresnel.',
        theoryId: 'oa-acoustique-des-plaques',
        mactutor: 'Biot',
        sources: ['mactutor'],
      },
      {
        id: 'wheatstone',
        name: 'Charles Wheatstone',
        years: [1802, 1875],
        origin: 'Gloucester et Londres',
        bio: 'Facteur d’instruments devenu professeur à King’s College, Wheatstone invente le kaléidophone qui rend visibles les courbes nodales par réflexion de la lumière (1827), popularise les figures de Chladni en Angleterre, et met au point avec Cooke le télégraphe électrique britannique.',
        theoryId: 'oa-acoustique-des-plaques',
        sources: ['beyer-sounds'],
      },
      {
        id: 'doppler',
        name: 'Christian Doppler',
        years: [1803, 1853],
        origin: 'Salzbourg et Prague',
        bio: 'Professeur à l’École polytechnique de Prague, Doppler publie en 1842 son mémoire sur la lumière colorée des étoiles doubles : la fréquence perçue change avec le mouvement relatif de la source — principe qui porte son nom. Buys Ballot le vérifie dans le son en 1845 ; il meurt de la tuberculose à trente-neuf ans.',
        theoryId: 'oa-propagation-et-observateur',
        mactutor: 'Doppler',
        sources: ['mactutor'],
      },
    ],
    relatedMathematicianIds: ['d-alembert', 'euler', 'daniel-bernoulli', 'lagrange', 'laplace', 'poisson', 'fourier', 'helmholtz'],
    results: [
      {
        id: 'superposition-des-vibrations',
        title: 'Superposition des vibrations de Daniel Bernoulli',
        year: 1753,
        authorName: 'Daniel Bernoulli',
        mathematicianId: 'daniel-bernoulli',
        theoryId: 'oa-theorie-de-la-corde',
        kind: 'concept',
        statement: 'Tout mouvement vibratoire d’une corde est la superposition de ses sons fondamental et harmoniques : la corde vibre « comme si elle était composée de plusieurs cordes », chaque mode propre sinusoïdal s’exerçant simultanément et indépendamment.',
        comment: 'Contre Euler, qui jugeait impossible de représenter une corde pincée — deux segments de droite — par une somme de sinus, Bernoulli affirme que l’expérience l’emporte sur l’analyse : la musique des harmoniques est la réalité physique des modes. Fourier et la théorie des séries trigonométriques lui donneront raison formellement.',
        context: [
          {
            kind: 'fait',
            text: 'D’Alembert (1747) exigeait que la fonction de déplacement soit dérivable ; Euler (1748) admettait toute courbe tracée — mais refusait la décomposition en sinus. Bernoulli (1753) renverse l’argument : la nature elle-même choisit la superposition des tons.',
            sources: ['bottazzini-higher-calculus', 'kline-thought'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La superposition des modes devient le principe de toute la physique ondulatoire : analyse harmonique du son (Ohm, Helmholtz), théorie de la chaleur de Fourier, et la structure même de la mécanique quantique, où les états propres jouent le rôle des modes normaux.',
            sources: ['bottazzini-higher-calculus', 'beyer-sounds'],
          },
        ],
      },
      {
        id: 'corde-discrete-de-lagrange',
        title: 'La corde comme limite d’une chaîne de masses',
        year: 1759,
        authorName: 'Joseph-Louis Lagrange',
        mathematicianId: 'lagrange',
        theoryId: 'oa-theorie-de-la-corde',
        kind: 'methode',
        statement: 'Une corde est le cas limite d’une file de n masses égales reliées par des fils tendus : les équations du mouvement de la chaîne se résolvent en fréquences sinusoïdales, qui tendent, quand n croît, vers les harmoniques de la corde continue.',
        comment: 'Le tour de force de Lagrange (Miscellanea Taurinensia) : résoudre le problème aux n corps discrets puis passer à la limite, sans postuler l’équation des ondes. La méthode, qui produit les coefficients par intégrales — ancêtre des formules de Fourier —, est aujourd’hui le principe des éléments finis et des réseaux cristallins.',
      },
      {
        id: 'figures-de-chladni',
        title: 'Figures de Chladni',
        year: 1787,
        authorName: 'Ernst Chladni',
        mathematicianId: 'chladni',
        theoryId: 'oa-acoustique-des-plaques',
        kind: 'concept',
        statement: 'Une plaque de verre ou de métal, saupoudrée de sable fin et mise en vibration par un archet, ordonne les grains en dessins géométriques : le sable fuit les ventres de vibration et s’arrête sur les lignes nodales, rendant les modes propres de la plaque directement visibles.',
        comment: 'Présentées dans les Entdeckungen über die Theorie des Klanges (1787) puis dans la Die Akustik (1802), les figures donnent à l’acoustique sa première image expérimentale des modes d’un système continu. Elles provoquent le concours de 1809 dont sortira la théorie des plaques de Sophie Germain et de Kirchhoff.',
        context: [
          {
            kind: 'fait',
            text: 'Chladni, de formation juridique, s’était donné l’acoustique pour discipline en lisant les traités de cordes ; il fit ses démonstrations dans toute l’Europe — en 1808 devant l’Institut, en 1809 devant Napoléon qui finança la traduction française de sa Die Akustik et mit le prix sur les plaques.',
            sources: ['beyer-sounds', 'mactutor'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Les figures de Chladni inspirent les kaléidophones de Wheatstone (1827), la topographie des corps sonores de Savart, puis l’analyse modale moderne : elles restent la démonstration standard des vibrations dans les laboratoires et les cours.',
            sources: ['beyer-sounds', 'hunt-acoustics'],
          },
        ],
      },
      {
        id: 'elasticite-des-plaques-germain',
        title: 'Théorie des plaques élastiques de Sophie Germain',
        year: 1816,
        authorName: 'Sophie Germain',
        theoryId: 'oa-acoustique-des-plaques',
        kind: 'concept',
        statement: 'La vibration d’une plaque mince est gouvernée par une équation aux dérivées partielles du quatrième ordre, où la force de rappel est la courbure de la surface élastique — et non la tension comme pour la corde.',
        comment: 'Le prix de l’Académie : après deux mémoires non retenus (1811, 1813), Germain est couronnée en 1816. Son équation, corrigée par Lagrange puis précisée par Poisson et Kirchhoff (1850), fonde la théorie des plaques et des coques — équation biharmonique de l’ingénierie moderne.',
        context: [
          {
            kind: 'fait',
            text: 'Le prix est posé en 1809 après les démonstrations de Chladni : « donner la théorie mathématique des vibrations des surfaces élastiques et la comparer à l’expérience ». Germain est seule candidate à chaque tour ; elle signe ses mémoires d’un « lauréat du prix de l’année précédente » pour cacher son nom.',
            sources: ['mactutor', 'beyer-sounds'],
          },
        ],
        impact: [
          {
            kind: 'interpretation',
            text: 'Pour les historiens, l’épisode marque la première intrusion d’une femme dans les grands prix de l’Académie, et le passage de l’acoustique des figures à l’acoustique des équations : la surface élastique de Germain est le premier problème aux dérivées quatrièmes de la physique.',
            sources: ['mactutor', 'beyer-sounds'],
          },
        ],
      },
      {
        id: 'vitesse-du-son-laplace',
        title: 'Correction adiabatique de la vitesse du son',
        altTitle: 'Sur la vitesse du son dans l’air et dans l’eau',
        year: 1816,
        authorName: 'Pierre-Simon de Laplace',
        mathematicianId: 'laplace',
        theoryId: 'oa-propagation-et-observateur',
        kind: 'theoreme',
        statement: 'La vitesse du son dans l’air n’est pas √(p/ρ) comme le voulait le calcul de Newton, mais √(γ p/ρ), où γ est le rapport des chaleurs spécifiques : la compression de l’air par l’onde est adiabatique, non isotherme, et l’échauffement local augmente la raideur du milieu.',
        comment: 'Newton obtenait une valeur trop faible d’environ 15 % ; Laplace publie la correction dans les Annales de chimie (1816), expliquant que la chaleur dégagée par la compression augmente la pression. C’est la première application physique de la thermique adiabatique — et le pont entre acoustique et thermodynamique naissante.',
        intuition: [
          {
            kind: 'fait',
            text: 'Newton avait supposé que l’air se comprime à température constante ; mais l’onde sonore oscille si vite que la chaleur n’a pas le temps de s’équilibrer : la compression échauffe l’air, l’air chaud repousse plus fort — la raideur effective du gaz, et donc la vitesse du son, augmente du facteur γ.',
            sources: ['kline-thought', 'beyer-sounds'],
          },
          {
            kind: 'fait',
            text: 'Laplace vérifie sa correction par la mesure : la vitesse calculée avec γ ≈ 1,4 tombe à 340 mètres par seconde, en accord avec les déterminations du Bureau des longitudes — là où la valeur newtonienne atteignait à peine 290.',
            sources: ['beyer-sounds', 'kline-thought'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'On écrit l’équation d’Euler du mouvement du gaz : la force est le gradient de pression, et l’équation de continuité lie la condensation à la divergence de la vitesse. Il suffit donc de connaître la loi qui relie pression et densité dans l’onde.',
            sources: ['kline-thought', 'beyer-sounds'],
          },
          {
            kind: 'fait',
            text: 'Si l’air se comprimait à température constante (Newton), la loi des gaz donne dp/p = −dρ/ρ, d’où un coefficient de raideur égal à p ; la vitesse du son serait √(p/ρ), environ 290 m/s — trop faible.',
            sources: ['kline-thought', 'beyer-sounds'],
          },
          {
            kind: 'fait',
            text: 'Laplace remplace la loi isotherme par la loi adiabatique, p ρ^(−γ) = constante, qui tient compte de l’échauffement de la compression : le coefficient de raideur devient γ p, et la vitesse √(γ p/ρ).',
            sources: ['kline-thought', 'beyer-sounds'],
          },
          {
            kind: 'fait',
            text: 'En reportant γ — que Laplace tire des chaleurs spécifiques mesurées par Delaroche et Bérard —, la vitesse calculée (environ 340 m/s) coïncide avec la mesure : la thermique du gaz tranche l’acoustique.',
            sources: ['kline-thought', 'beyer-sounds'],
          },
        ],
      },
      {
        id: 'mesure-des-frequences-savart',
        title: 'Mesure absolue des fréquences sonores',
        year: 1830,
        authorName: 'Félix Savart',
        mathematicianId: 'savart',
        theoryId: 'oa-acoustique-des-plaques',
        kind: 'methode',
        statement: 'Une roue dentée tournée à vitesse connue produit un son dont la hauteur se compte : le nombre de dents frappant une carte par seconde donne la fréquence absolue ; la sirène de Cagniard de la Tour (1819) applique le même principe à un courant d’air interrompu.',
        comment: 'La fréquence devient une quantité : la roue de Savart descend jusqu’à 4-5 vibrations par seconde, bien au-delà de la sirène. L’oreille cesse d’être le juge — la métrologie du son rejoint celle de la lumière (comptage des franges de Young).',
      },
      {
        id: 'effet-doppler',
        title: 'Effet Doppler',
        altTitle: 'Über das farbige Licht der Doppelsterne',
        year: 1842,
        authorName: 'Christian Doppler',
        mathematicianId: 'doppler',
        theoryId: 'oa-propagation-et-observateur',
        kind: 'concept',
        statement: 'Quand la source d’une onde et l’observateur se rapprochent, la fréquence perçue augmente ; quand ils s’éloignent, elle diminue. La couleur des étoiles doubles, pensait Doppler, en serait la preuve — l’effet s’applique à toute onde, sonore comme lumineuse.',
        comment: 'Lu devant l’Académie de Bohême en mai 1842, le mémoire extrapole hardiment aux étoiles (dont les couleurs relèvent surtout d’autres causes). Buys Ballot le vérifie dans le son (1845), Fizeau l’étend à la lumière (1848) : le décalage spectral devient l’instrument de la vitesse radiale des astres.',
        context: [
          {
            kind: 'fait',
            text: 'Doppler se proposait d’expliquer les couleurs des étoiles doubles par la vitesse orbitale des composantes — hypothèse fausse pour l’étoile visible mais juste en principe : le décalage existe, trop faible pour l’œil mais mesurable en spectroscopie.',
            sources: ['beyer-sounds', 'whittaker-aether'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Fizeau publie en 1848 l’extension à la lumière (décalage des raies spectrales) ; Huggins mesure le décalage de Sirius en 1868. L’effet Doppler devient l’outil de l’astronomie des vitesses, du décalage vers le rouge cosmologique, et du radar moderne.',
            sources: ['beyer-sounds', 'whittaker-aether'],
          },
        ],
      },
    ],
    sources: ['beyer-sounds', 'hunt-acoustics', 'bottazzini-higher-calculus', 'kline-thought', 'mactutor'],
  },
];

/** Liens entre domaines, déclarés dans le fichier de leur domaine d'arrivée. */
export const LINKS_PHYSIQUE_B: Link[] = [
];

/** Liens entre figures (filiation, influence, collaboration, affinité, rupture). */
export const MATHEMATICIAN_LINKS_PHYSIQUE_B: MathematicianLink[] = [
];
