import type { Domain, Link, MathematicianLink, Source } from '../types';

/** Sources propres à ce fichier (le socle est dans ../sources.ts : ne pas le redéclarer). */
export const SOURCES_PHYSIQUE_D: Source[] = [
  // — Physique statistique et matière condensée —
  { id: 'out-of-the-crystal-maze', type: 'livre', author: 'Lillian Hoddeson, Ernest Braun, Jürgen Teichmann, Spencer Weart (dir.)', title: 'Out of the Crystal Maze: Chapters from the History of Solid-State Physics', year: 1992, publisher: 'Oxford University Press' },
  { id: 'domb-critical-point', type: 'livre', author: 'Cyril Domb', title: 'The Critical Point: A Historical Introduction to the Modern Theory of Critical Phenomena', year: 1996, publisher: 'Taylor & Francis' },
  { id: 'kadanoff-order-chaos', type: 'livre', author: 'Leo P. Kadanoff', title: 'From Order to Chaos: Essays: Critical, Chaotic and Otherwise', year: 1993, publisher: 'World Scientific' },
  { id: 'brush-statistical-physics', type: 'livre', author: 'Stephen G. Brush', title: 'Statistical Physics and the Atomic Theory of Matter, from Boyle and Newton to Landau and Onsager', year: 1983, publisher: 'Princeton University Press' },
  { id: 'niss-ising', type: 'article', author: 'Martin Niss', title: 'History of the Lenz–Ising Model 1920–1950: From Ferromagnetic to Cooperative Phenomena', year: 2005, publisher: 'Archive for History of Exact Sciences, vol. 59' },
  { id: 'baxter-exactly-solved', type: 'livre', author: 'Rodney J. Baxter', title: 'Exactly Solved Models in Statistical Mechanics', year: 1982, publisher: 'Academic Press' },
  { id: 'anderson-more-different', type: 'article', author: 'Philip W. Anderson', title: 'More is Different: Broken Symmetry and the Nature of the Hierarchical Structure of Science', year: 1972, publisher: 'Science, vol. 177' },
  { id: 'mezard-parisi-virasoro', type: 'livre', author: 'Marc Mézard, Giorgio Parisi, Miguel-Ángel Virasoro', title: 'Spin Glass Theory and Beyond', year: 1987, publisher: 'World Scientific' },
  { id: 'hoddeson-bardeen', type: 'livre', author: 'Lillian Hoddeson, Vicki Daitch', title: 'True Genius: The Life and Science of John Bardeen', year: 2002, publisher: 'Joseph Henry Press' },
  { id: 'livanova-landau', type: 'livre', author: 'Anna Livanova', title: 'Landau: A Great Physicist and Teacher', year: 1980, publisher: 'Pergamon Press', note: 'Traduction anglaise de l’édition russe de 1978.' },
  { id: 'brown-renormalization', type: 'livre', author: 'Laurie M. Brown (dir.)', title: 'Renormalization: From Lorentz to Landau (and Beyond)', year: 1993, publisher: 'Springer' },
  // — Gravitation et cosmologie —
  { id: 'kragh-cosmology', type: 'livre', author: 'Helge Kragh', title: 'Cosmology and Controversy: The Historical Development of Two Theories of the Universe', year: 1996, publisher: 'Princeton University Press' },
  { id: 'longair-cosmic-century', type: 'livre', author: 'Malcolm S. Longair', title: 'The Cosmic Century: A History of Astrophysics and Cosmology', year: 2006, publisher: 'Cambridge University Press' },
  { id: 'smith-expanding-universe', type: 'livre', author: 'Robert W. Smith', title: 'The Expanding Universe: Astronomy’s « Great Debate », 1900-1931', year: 1982, publisher: 'Cambridge University Press' },
  { id: 'north-measure-universe', type: 'livre', author: 'John D. North', title: 'The Measure of the Universe: A History of Modern Cosmology', year: 1965, publisher: 'Clarendon Press' },
  { id: 'hawking-ellis', type: 'livre', author: 'Stephen W. Hawking, George F. R. Ellis', title: 'The Large Scale Structure of Space-Time', year: 1973, publisher: 'Cambridge University Press' },
  { id: 'thorne-black-holes', type: 'livre', author: 'Kip S. Thorne', title: 'Black Holes and Time Warps: Einstein’s Outrageous Legacy', year: 1994, publisher: 'W. W. Norton' },
  { id: 'guth-inflation', type: 'livre', author: 'Alan H. Guth', title: 'The Inflationary Universe: The Quest for a New Theory of Cosmic Origins', year: 1997, publisher: 'Addison-Wesley' },
  // — Chaos physique et non linéaire —
  { id: 'weissert-fpu', type: 'livre', author: 'Thomas P. Weissert', title: 'The Genesis of Simulation in Dynamics: Pursuing the Fermi–Pasta–Ulam Problem', year: 1997, publisher: 'Springer' },
  { id: 'dauxois-fpu', type: 'article', author: 'Thierry Dauxois', title: 'Fermi, Pasta, Ulam, and a mysterious lady', year: 2008, publisher: 'Physics Today, vol. 61, n° 1' },
  { id: 'newell-solitons', type: 'livre', author: 'Alan C. Newell', title: 'Solitons in Mathematics and Physics', year: 1985, publisher: 'SIAM' },
  { id: 'gutzwiller-chaos', type: 'livre', author: 'Martin C. Gutzwiller', title: 'Chaos in Classical and Quantum Mechanics', year: 1990, publisher: 'Springer' },
  { id: 'frisch-turbulence', type: 'livre', author: 'Uriel Frisch', title: 'Turbulence: The Legacy of A. N. Kolmogorov', year: 1995, publisher: 'Cambridge University Press' },
  { id: 'prigogine-stengers', type: 'livre', author: 'Ilya Prigogine, Isabelle Stengers', title: 'La Nouvelle alliance : métamorphose de la science', year: 1979, publisher: 'Gallimard' },
];

/**
 * Pendant physique — partie D : physique contemporaine (physique statistique
 * et matière condensée, gravitation et cosmologie, chaos physique et non
 * linéaire).
 * Plan : docs/superpowers/plans/2026-10-12-pendant-physique.md § 5.2.
 */
export const PHYSIQUE_D: Domain[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Physique statistique et matière condensée
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'physique-statistique-et-matiere-condensee',
    name: 'Physique statistique et matière condensée',
    mapName: 'Physique statistique',
    altNames: ['Physique du solide', 'Théorie des phénomènes critiques'],
    era: 'contemporain',
    period: { start: 1937, end: 1990 },
    continents: ['physique'],
    places: ['Kharkov', 'Moscou', 'Leyde', 'Zurich', 'Cambridge', 'Ithaca', 'Murray Hill', 'Urbana'],
    map: { x: 6450, y: 4750, size: 2, palette: { fill: '#ffffff', stroke: '#000000', accent: '#000000' } },
    tagline: 'Quand d’innombrables particules changent d’état ensemble : transitions de phase, supraconductivité et renormalisation.',
    summary:
      'De la solution exacte du modèle d’Ising par Onsager (1944) à la théorie microscopique de la supraconductivité de Bardeen, Cooper et Schrieffer (1957), la matière condensée devient le terrain où les transitions de phase se pensent en termes de symétries brisées et d’échelles. La théorie de Landau (1937), les liquides de Fermi et l’école soviétique du Landau–Lifchits ancrent la phénoménologie ; le groupe de renormalisation de Kadanoff et Wilson (1966-1971) unifie les phénomènes critiques, Anderson localise les électrons dans le désordre (1958) et Parisi résout le verre de spin (1979). Contre le réductionnisme, Anderson proclame en 1972 que « plus, c’est différent » : à chaque niveau de complexité, des lois nouvelles émergent.',
    methods: [
      {
        kind: 'fait',
        text: 'La méthode de Landau : au voisinage d’une transition continue, développer l’énergie libre en puissances d’un « paramètre d’ordre » nul dans la phase symétrique et non nul dans la phase ordonnée ; le minimum choisi brise spontanément la symétrie et fixe des exposants dits « classiques ».',
        sources: ['domb-critical-point', 'brush-statistical-physics'],
      },
      {
        kind: 'fait',
        text: 'La solution exacte des modèles de spins sur réseau : matrice de transfert pour l’Ising bidimensionnel (Onsager, 1944 ; Yang, 1952), puis équation d’intégrabilité de Yang–Baxter pour les modèles exactement solubles (Baxter, années 1960-1980).',
        sources: ['domb-critical-point', 'baxter-exactly-solved'],
      },
      {
        kind: 'fait',
        text: 'Le groupe de renormalisation : moyenner les interactions sur les échelles croissantes transforme les couplages en un « flot » dont les points fixes gouvernent le comportement critique ; les directions propres du point fixe donnent les exposants.',
        sources: ['kadanoff-order-chaos', 'brown-renormalization'],
      },
      {
        kind: 'interpretation',
        text: 'Pour Anderson (« More is Different », 1972), la matière condensée démontre les limites du réductionnisme : connaître les lois microscopiques ne suffit pas à prévoir les états collectifs — supraconductivité, superfluidité — qui obéissent à des principes propres à leur échelle.',
        sources: ['anderson-more-different', 'sep'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'L’école de Landau, installée à Kharkov (1932) puis à l’Institut des problèmes de physique de Moscou, se transmet par le « minimum théorique » — examen d’entrée réputé — et par le séminaire ; l’arrestation de Landau (avril 1938), libéré un an plus tard sur intervention de Kapitza, marque l’école. Le Cours de physique théorique de Landau et Lifchits paraît à partir des années 1930.',
        sources: ['livanova-landau', 'mactutor'],
      },
      {
        kind: 'fait',
        text: 'La matière condensée croît dans les laboratoires industriels et de défense : Bell Labs (transistor de 1947, supraconductivité, localisation d’Anderson), IBM, le Cavendish et Los Alamos ; le transistor vaut à Bardeen un premier prix Nobel (1956, avec Shockley et Brattain), la théorie BCS un second (1972, avec Cooper et Schrieffer).',
        sources: ['out-of-the-crystal-maze', 'hoddeson-bardeen'],
      },
      {
        kind: 'fait',
        text: 'Les basses températures sont l’infrastructure du domaine : la liquéfaction de l’hélium par Kamerlingh Onnes à Leyde (1908) rend possibles la découverte de la supraconductivité (1911) puis celle de la superfluidité de l’hélium II (Kapitza ; Allen et Misener, 1938).',
        sources: ['out-of-the-crystal-maze', 'brush-statistical-physics'],
      },
      {
        kind: 'interpretation',
        text: 'Domb raconte l’histoire des phénomènes critiques comme le passage d’une collection d’exposants contradictoires à une science de l’universalité : aimants, fluides et alliages partagent les mêmes lois d’échelle, fait que la renormalisation de Wilson explique en 1971.',
        sources: ['domb-critical-point'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'Le modèle de Lenz, résolu par Ising en dimension 1 (1925), n’y montre aucune transition ; la conclusion — souvent répétée, que le modèle ne s’ordonne jamais — est démentie par Peierls (1936) puis par la solution exacte d’Onsager (1944) en dimension 2.',
        sources: ['niss-ising', 'domb-critical-point'],
      },
      {
        kind: 'fait',
        text: 'La priorité de la découverte de la superfluidité de l’hélium II est partagée : les notes de Kapitza (Moscou) et d’Allen et Misener (Cambridge) paraissent dans le même numéro de Nature en janvier 1938.',
        sources: ['out-of-the-crystal-maze'],
      },
      {
        kind: 'interpretation',
        text: 'Les exposants « classiques » de la théorie de champ moyen échouant au voisinage du point critique, les années 1960 discutent la légitimité des modèles de réseau : pour Fisher et Kadanoff, les exposants ne dépendent que de la dimension et de la symétrie du paramètre d’ordre — l’universalité, que la renormalisation démontrera.',
        sources: ['domb-critical-point', 'kadanoff-order-chaos'],
      },
      {
        kind: 'fait',
        text: 'L’article « More is Different » (Science, 1972) répond aux physiciens des particules qui tenaient la matière condensée pour de la « chimie » : Anderson y défend l’autonomie des lois émergentes — symétries brisées, rigidité généralisée — contre le réductionnisme.',
        sources: ['anderson-more-different', 'sep'],
      },
    ],
    keyDates: [
      { year: 1908, text: 'Kamerlingh Onnes liquéfie l’hélium à Leyde ; il découvre la supraconductivité du mercure en 1911.' },
      { year: 1925, text: 'Thèse d’Ising : le modèle de spins de Lenz ne présente aucune transition en dimension 1.' },
      { year: 1928, text: 'Bloch décrit l’électron dans un réseau périodique : ondes de Bloch et bandes d’énergie.' },
      { year: 1931, text: 'Onsager établit les relations de réciprocité des processus irréversibles (Nobel de chimie 1968).' },
      { year: 1937, text: 'Landau formule la théorie générale des transitions de phase par le paramètre d’ordre.' },
      { year: 1938, text: 'Kapitza, puis Allen et Misener dans le même numéro de Nature, découvrent la superfluidité de l’hélium II.' },
      { year: 1941, text: 'Théorie de Landau de la superfluidité (excitations et rotons) ; dualité de Kramers–Wannier pour Ising.' },
      { year: 1944, text: 'Onsager publie la solution exacte du modèle d’Ising bidimensionnel.' },
      { year: 1951, text: 'Callen et Welton énoncent le théorème de fluctuation-dissipation.' },
      { year: 1956, text: 'Landau publie la théorie des liquides de Fermi ; Bardeen, Cooper et Schrieffer publient BCS en 1957.' },
      { year: 1958, text: 'Anderson montre la localisation des électrons dans un potentiel aléatoire.' },
      { year: 1964, text: 'Théorème de Hohenberg–Kohn, fondement de la théorie de la fonctionnelle de la densité.' },
      { year: 1966, text: 'Kadanoff formule les lois d’échelle du point critique ; Mermin et Wagner excluent l’ordre spontané en dimension ≤ 2.' },
      { year: 1971, text: 'Wilson construit le groupe de renormalisation (Nobel 1982).' },
      { year: 1972, text: 'Anderson publie « More is Different » ; Nobel à Bardeen, Cooper et Schrieffer pour BCS.' },
      { year: 1979, text: 'Parisi résout le verre de spin de Sherrington–Kirkpatrick par brisure de symétrie des répliques.' },
      { year: 1986, text: 'Bednorz et Müller découvrent la supraconductivité à haute température (Nobel 1987).' },
    ],
    theories: [
      {
        id: 'ps-transitions-de-phase-et-phenomenes-critiques',
        name: 'Transitions de phase et phénomènes critiques',
        period: { start: 1937, end: null },
        summary: 'Modèles de spins sur réseau (Lenz–Ising), paramètre d’ordre et brisure de symétrie (Landau), solutions exactes (Onsager, Yang, Baxter), exposants critiques, lois d’échelle de Kadanoff et point fixe de la renormalisation de Wilson.',
        traits: ['Paramètre d’ordre', 'Solution d’Onsager', 'Exposants critiques', 'Lois d’échelle', 'Groupe de renormalisation'],
      },
      {
        id: 'ps-etats-quantiques-de-la-matiere',
        name: 'États quantiques de la matière',
        period: { start: 1928, end: null },
        summary: 'Bandes de Bloch et électrons dans les cristaux, supraconductivité (BCS, Ginzburg–Landau), superfluidité et liquides de Fermi (Landau), transition métal-isolant et condensation de Bose.',
        traits: ['Ondes et zones de Bloch', 'Paires de Cooper', 'Superfluidité et rotons', 'Liquides de Fermi', 'Localisation d’Anderson'],
      },
      {
        id: 'ps-desordre-et-emergence',
        name: 'Désordre, verres de spin et émergence',
        period: { start: 1958, end: null },
        summary: 'Désordre gelé : localisation d’Anderson, verres de spin (Edwards–Anderson, Sherrington–Kirkpatrick, solution de Parisi), hiérarchie d’états métastables ; le programme « émergent » proclamé par More is Different.',
        traits: ['Localisation', 'Verres de spin', 'Brisure de symétrie des répliques', 'Émergence et réductionnisme'],
      },
    ],
    mathematicians: [
      {
        id: 'landau-lev',
        name: 'Lev Landau',
        years: [1908, 1968],
        origin: 'Bakou, Kharkov et Moscou',
        bio: 'Physicien théoricien formé à Leningrad et auprès de Bohr à Copenhague, Landau fonde à Kharkov puis à Moscou une école sans équivalent : théorie des transitions de phase (1937), superfluidité de l’hélium (1941), liquides de Fermi (1956), et le Cours de physique théorique écrit avec Lifchits. Prix Nobel 1962.',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['mactutor', 'livanova-landau'],
        mactutor: 'Landau_Lev',
      },
      {
        id: 'onsager',
        name: 'Lars Onsager',
        years: [1903, 1976],
        origin: 'Oslo, puis Yale',
        bio: 'Chimiste-physicien norvégien installé à Yale, Onsager établit les relations de réciprocité des processus irréversibles (1931, Nobel de chimie 1968) et donne la première solution exacte d’un modèle de transition de phase : l’Ising bidimensionnel (1944).',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['domb-critical-point', 'brush-statistical-physics'],
      },
      {
        id: 'ising',
        name: 'Ernst Ising',
        years: [1900, 1998],
        origin: 'Hambourg, puis Peoria',
        bio: 'Élève de Wilhelm Lenz à Hambourg, Ising montre dans sa thèse (1925) que la chaîne unidimensionnelle de spins ne connaît pas de transition de phase. Le modèle, délaissé deux décennies, devient le paradigme des phénomènes critiques ; émigré, Ising enseigne aux États-Unis.',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['niss-ising'],
      },
      {
        id: 'bloch-felix',
        name: 'Felix Bloch',
        years: [1905, 1983],
        origin: 'Zurich, Leipzig et Stanford',
        bio: 'Élève de Heisenberg et successeur de Schrödinger à Zurich, Bloch émigre à Stanford en 1934 : ondes de Bloch dans les cristaux (1928), ondes de spin (1930), équations de la résonance magnétique nucléaire (Nobel 1952, avec Purcell). Il dirige le CERN en 1954-1955.',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        sources: ['out-of-the-crystal-maze'],
      },
      {
        id: 'anderson-philip',
        name: 'Philip Warren Anderson',
        years: [1923, 2020],
        origin: 'Murray Hill (Bell Labs) et Princeton',
        bio: 'Théoricien des Bell Labs puis de Princeton, Anderson découvre la localisation des électrons dans le désordre (1958), fonde la théorie de la supraconductivité inhomogène (pseudospins d’Anderson) et défend l’émergence contre le réductionnisme (« More is Different », 1972). Nobel 1977.',
        theoryId: 'ps-desordre-et-emergence',
        sources: ['out-of-the-crystal-maze', 'anderson-more-different'],
      },
      {
        id: 'kadanoff',
        name: 'Leo Kadanoff',
        years: [1937, 2015],
        origin: 'Urbana et Chicago',
        bio: 'Théoricien à l’université de Chicago, Kadanoff formule les lois d’échelle au point critique (1966) et y introduit le « bloc de spins » dont Wilson fera le groupe de renormalisation ; il travaille aussi la turbulence et la physique des plasmas.',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['kadanoff-order-chaos', 'domb-critical-point'],
      },
      {
        id: 'wilson-kenneth',
        name: 'Kenneth Geddes Wilson',
        years: [1936, 2013],
        origin: 'Cornell (Ithaca)',
        bio: 'Élève de Gell-Mann au Caltech, professeur à Cornell, Wilson construit en 1971 le groupe de renormalisation : en intégrant les fluctuations échelle par échelle, il explique l’universalité des exposants critiques et refonde la théorie quantique des champs. Nobel 1982.',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['brown-renormalization', 'domb-critical-point'],
      },
      {
        id: 'fisher-michael',
        name: 'Michael Ellis Fisher',
        years: [1931, 2021],
        origin: 'King’s College, Cornell et Maryland',
        bio: 'Théoricien britannique établi à Cornell, Fisher systématise les exposants critiques (relation de Fisher), pose le cadre des lois d’échelle à taille finie et cosigne avec Wilson l’ε-expansion (1972). Médaille Boltzmann 1983.',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        sources: ['domb-critical-point'],
      },
      {
        id: 'parisi',
        name: 'Giorgio Parisi',
        years: [1948, null],
        origin: 'Rome',
        bio: 'Théoricien de La Sapienza, Parisi résout le verre de spin de Sherrington–Kirkpatrick par la brisure de symétrie des répliques (1979), dont la structure ultramétrique des états fonde la science des systèmes complexes ; Nobel 2021 « pour la découverte de l’interaction entre désordre et fluctuations ».',
        theoryId: 'ps-desordre-et-emergence',
        sources: ['mezard-parisi-virasoro'],
      },
      {
        id: 'bardeen',
        name: 'John Bardeen',
        years: [1908, 1991],
        origin: 'Bell Labs et Urbana',
        bio: 'Seul double prix Nobel de physique : le transistor avec Shockley et Brattain (1947, Nobel 1956), puis la théorie microscopique de la supraconductivité avec Cooper et Schrieffer (1957, Nobel 1972). Professeur à l’université de l’Illinois à Urbana.',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        sources: ['hoddeson-bardeen', 'out-of-the-crystal-maze'],
      },
    ],
    relatedMathematicianIds: ['maxwell', 'kolmogorov', 'sinai', 'ruelle', 'wigner', 'wiener', 'ito'],
    results: [
      {
        id: 'ondes-de-bloch',
        title: 'Ondes de Bloch et théorie des bandes',
        year: 1928,
        authorName: 'Felix Bloch',
        mathematicianId: 'bloch-felix',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        kind: 'concept',
        statement: 'Dans un potentiel périodique — le réseau cristallin —, les fonctions d’onde électroniques sont des ondes planes modulées par la périodicité ; l’énergie n’existe que par bandes, séparées par des lacunes interdites.',
        comment: 'Thèse de Bloch à Leipzig (1928) : la théorie des bandes rend compte du partage entre métaux, semi-conducteurs et isolants (Wilson, 1931 ; Peierls y ajoute la notion de trou, 1929). Elle est la fondation de toute l’électronique du solide.',
        context: [
          {
            kind: 'fait',
            text: 'La mécanique quantique de 1926 devait expliquer pourquoi certains cristaux conduisent le courant et d’autres l’isolent : les modèles de Drude (électron libre) échouaient sur la chaleur spécifique et la dépendance à la température.',
            sources: ['out-of-the-crystal-maze'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La théorie des bandes rend possibles le calcul des semi-conducteurs, la jonction p-n et le transistor de 1947 ; elle reste le cadre du calcul de structure électronique (fonctionnelle de la densité).',
            sources: ['out-of-the-crystal-maze'],
          },
        ],
      },
      {
        id: 'modele-d-ising',
        title: 'Modèle de Lenz–Ising',
        year: 1925,
        authorName: 'Ernst Ising',
        mathematicianId: 'ising',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        kind: 'concept',
        statement: 'Sur un réseau, des variables ±1 figurant des moments magnétiques interagissent par plus proches voisins ; l’énergie favorise l’alignement, l’entropie le désordre — la transition ferromagnétique s’y lit comme l’émergence d’un ordre spontané.',
        comment: 'Proposé par Lenz (1920) et résolu en dimension 1 par Ising (1925), le modèle y est sans transition, ce qui retarde son adoption ; la solution d’Onsager en dimension 2 (1944) en fait le paradigme des transitions de phase. Il sert de modèle minimal aux alliages, à la percolation, aux réseaux de neurones (Hopfield) et à la statistique rigoureuse.',
        context: [
          {
            kind: 'fait',
            text: 'La question, posée par Lenz à Hambourg, est de savoir si un modèle à interactions locales reproduit le ferromagnétisme spontané sans champ extérieur — la réponse d’Ising en dimension 1 (pas de transition) a longtemps fait douter de la réponse en dimensions supérieures.',
            sources: ['niss-ising', 'domb-critical-point'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Peierls montre (1936) que le modèle bidimensionnel possède une transition ; la dualité de Kramers–Wannier (1941) en localise le point critique, et la solution d’Onsager (1944) fournit le premier ensemble exact d’exposants non classiques.',
            sources: ['niss-ising', 'domb-critical-point'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Domb, l’histoire du modèle illustre le rôle des modèles « irréalistes » en physique : simplifié à l’extrême, il a servi de banc d’essai à la transition de phase pendant un siècle — de Bragg–Williams à la renormalisation.',
            sources: ['domb-critical-point', 'niss-ising'],
          },
        ],
      },
      {
        id: 'theorie-de-landau-des-transitions-de-phase',
        title: 'Théorie de Landau des transitions de phase',
        year: 1937,
        authorName: 'Lev Landau',
        mathematicianId: 'landau-lev',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        kind: 'concept',
        statement: 'Toute transition continue se décrit par un paramètre d’ordre nul dans la phase symétrique et non nul dans la phase ordonnée ; l’énergie libre se développe en ses puissances, et le minimum choisi brise spontanément la symétrie.',
        comment: 'La théorie de Landau (1937) unifie transitions de phase et symétries : les exposants « classiques » (aimantation en √(Tc − T), susceptibilité en 1/|T − Tc|) deviennent la référence que la solution d’Onsager démentira, et le langage de la brisure de symétrie est repris par Ginzburg–Landau (1950) jusqu’au mécanisme de Higgs.',
      },
      {
        id: 'solution-exacte-d-onsager',
        title: 'Solution exacte du modèle d’Ising bidimensionnel',
        year: 1944,
        authorName: 'Lars Onsager',
        mathematicianId: 'onsager',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        kind: 'theoreme',
        major: true,
        statement: 'La fonction de partition du modèle d’Ising sur réseau carré sans champ se calcule exactement ; la chaleur spécifique diverge logarithmiquement au point critique, et l’aimantation spontanée s’annule comme (Tc − T)¹ᐟ⁸.',
        comment: 'Démontrée par Onsager (Physical Review, 1944) grâce à l’algèbre des opérateurs de transfert, c’est la première preuve qu’un modèle réaliste possède une transition à exposants non classiques ; l’aimantation en 1/8, dérivée par Yang (1952), ruine l’universalité du champ moyen et appelle la renormalisation.',
        context: [
          {
            kind: 'fait',
            text: 'La solution d’Ising (1925) semblait condamner le modèle au no-transition ; Peierls (1936) prouve l’existence de l’ordre spontané en dimension 2, et la dualité de Kramers–Wannier (1941) localise la température critique sans résoudre le modèle.',
            sources: ['niss-ising', 'domb-critical-point'],
          },
          {
            kind: 'fait',
            text: 'Onsager, détenteur des relations de réciprocité (1931), travaille la question pendant la guerre et la publie en 1944 dans une démonstration d’algèbre restée célèbre de difficulté ; Yang en tire l’aimantation spontanée en 1952.',
            sources: ['domb-critical-point', 'baxter-exactly-solved'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La solution établit les exposants critiques non classiques (β = 1/8, divergences logarithmiques) que les théories de champ moyen ne reproduisent pas ; elle valide la description par fluctuations à toutes échelles et ouvre la théorie des modèles exactement solubles (Baxter).',
            sources: ['domb-critical-point', 'baxter-exactly-solved'],
          },
          {
            kind: 'interpretation',
            text: 'Pour les historiens, le résultat fait du modèle d’Ising le « drosophile » de la physique statistique : un cas calculable où se testent renormalisation, méthodes conformes et mécanique statistique rigoureuse (Sinaï, Ruelle).',
            sources: ['domb-critical-point', 'aubin-dahan-chaos'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'L’existence du point critique était assurée avant le calcul : la dualité de Kramers et Wannier (1941) échange les hautes et basses températures du réseau carré, auto-dual, qui ne peut changer de régime qu’en un point unique — sa propre température.',
            sources: ['domb-critical-point', 'niss-ising'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'La fonction de partition s’écrit comme la trace d’une matrice de transfert élevée à la puissance du nombre de rangées : tout le problème tient à sa plus grande valeur propre.',
            sources: ['baxter-exactly-solved', 'domb-critical-point'],
          },
          {
            kind: 'fait',
            text: 'Onsager découvre que la matrice de transfert engendre une algèbre d’opérateurs fermée (associée aux spineurs) : sa diagonalisation se ramène à une famille de rotations indépendantes.',
            sources: ['baxter-exactly-solved', 'domb-critical-point'],
          },
          {
            kind: 'fait',
            text: 'À la limite thermodynamique, seule la plus grande valeur propre survit ; la fonction de partition devient non analytique à la température prédite par la dualité de Kramers–Wannier.',
            sources: ['domb-critical-point', 'baxter-exactly-solved'],
          },
          {
            kind: 'fait',
            text: 'La chaleur spécifique y diverge comme −log |T − Tc| ; le calcul de l’aimantation spontanée par Yang (1952) donne l’exposant 1/8, étranger au développement de Landau.',
            sources: ['domb-critical-point'],
          },
        ],
      },
      {
        id: 'theoreme-de-fluctuation-dissipation',
        title: 'Théorème de fluctuation-dissipation',
        year: 1951,
        authorName: 'Herbert Callen et Theodore Welton',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        kind: 'theoreme',
        statement: 'La réponse d’un système en équilibre à une petite perturbation — susceptibilité, conductivité — est entièrement fixée par les fluctuations spontanées de la grandeur observée : dissipation et fluctuation sont deux lectures d’un même spectre.',
        comment: 'Nyquist l’avait établi pour le bruit électrique (formule du bruit de Johnson, 1928) ; Callen et Welton le généralisent au régime quantique (1951), Kubo le met sous la forme des « formules de Kubo » (1957) : les coefficients de transport sont des intégrales de fonctions de corrélation à l’équilibre.',
        intuition: [
          {
            kind: 'fait',
            text: 'Un réseau dissipatif produit le bruit qui l’informe : une résistance qui absorbe l’énergie d’un signal extérieur agite spontanément le courant à l’équilibre — mesurer l’une mesure l’autre. C’est le calcul de Nyquist (1928) pour le bruit de Johnson.',
            sources: ['brush-statistical-physics', 'out-of-the-crystal-maze'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'On applique une force infinitésimale couplée à un observable ; la théorie des perturbations au premier ordre exprime la réponse comme un commutateur temporel des opérateurs.',
            sources: ['brush-statistical-physics'],
          },
          {
            kind: 'fait',
            text: 'Dans la base des états propres, ce commutateur se décompose en fréquences ; la partie dissipative de la susceptibilité s’écrit comme une somme spectrale pondérée par les poids statistiques.',
            sources: ['brush-statistical-physics'],
          },
          {
            kind: 'fait',
            text: 'La même somme spectrale décrit les fluctuations spontanées de l’observable à l’équilibre : l’égalité des deux spectres, à un facteur de fréquence près, est le théorème.',
            sources: ['brush-statistical-physics'],
          },
          {
            kind: 'fait',
            text: 'À la limite classique (haute température), le facteur de fréquence redonne la formule de Nyquist : le bruit de Johnson mesure la partie réelle de la résistance.',
            sources: ['brush-statistical-physics', 'out-of-the-crystal-maze'],
          },
        ],
      },
      {
        id: 'theorie-de-fermi-liquide-de-landau',
        title: 'Théorie des liquides de Fermi',
        year: 1956,
        authorName: 'Lev Landau',
        mathematicianId: 'landau-lev',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        kind: 'concept',
        statement: 'Un fluide de fermions en interaction (électrons d’un métal, hélium-3) se décrit, au voisinage de l’état fondamental, comme un gaz de « quasi-particules » : les interactions renormalisent masse et durée de vie sans changer la structure des basses excitations.',
        comment: 'Publiée au JETP en 1956-1957, la théorie rend compte des métaux normaux (chaleur spécifique linéaire en T, susceptibilité de Pauli corrigée) et prépare le terrain de la supraconductivité : l’instabilité de Cooper (1956) est l’endroit précis où le liquide de Fermi devient instable.',
      },
      {
        id: 'theorie-bcs-de-la-supraconductivite',
        title: 'Théorie BCS de la supraconductivité',
        altTitle: 'Bardeen–Cooper–Schrieffer',
        year: 1957,
        authorName: 'John Bardeen, Leon Cooper et Robert Schrieffer',
        mathematicianId: 'bardeen',
        theoryId: 'ps-etats-quantiques-de-la-matiere',
        kind: 'concept',
        statement: 'Au voisinage du zéro absolu, une attraction électronique arbitrairement faible — médiée par les phonons du réseau — condense les électrons en « paires de Cooper » liées par un gap : la résistance tombe à zéro et le champ magnétique est expulsé (effet Meissner).',
        comment: 'La théorie BCS (Physical Review, 1957) résout un problème ouvert depuis la découverte de Kamerlingh Onnes (1911) ; construite sur l’instabilité de Cooper (1956) et la fonction d’onde variationnelle de Schrieffer, elle unifie supraconductivité et superfluidité des fermions et inspire le mécanisme de brisure de symétrie des particules (Nambu, 1960). Nobel 1972.',
        context: [
          {
            kind: 'fait',
            text: 'Les théories phénoménologiques — équations des frères London (1935), théorie de Ginzburg–Landau (1950) — décrivaient la supraconductivité sans en donner le mécanisme ; l’effet isotopique mesuré en 1950 (Maxwell ; Reynolds et collaborateurs) impliquait les vibrations du réseau.',
            sources: ['out-of-the-crystal-maze', 'hoddeson-bardeen'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'BCS fixe l’image de la supraconductivité comme condensat de paires : phase globale de la fonction d’onde et nombre de paires deviennent conjugués (effet Josephson, 1962) ; le modèle s’étend aux noyaux (Bohr, Mottelson et Pines, 1958) et aux étoiles à neutrons.',
            sources: ['out-of-the-crystal-maze', 'hoddeson-bardeen'],
          },
          {
            kind: 'interpretation',
            text: 'Le mécanisme de BCS — brisure spontanée d’une symétrie de jauge par un condensat — migre vers la physique des particules : Nambu (1960) puis le modèle de Higgs en font le modèle de la masse des particules élémentaires.',
            sources: ['out-of-the-crystal-maze', 'anderson-more-different'],
          },
        ],
      },
      {
        id: 'localisation-d-anderson',
        title: 'Localisation d’Anderson',
        year: 1958,
        authorName: 'Philip W. Anderson',
        mathematicianId: 'anderson-philip',
        theoryId: 'ps-desordre-et-emergence',
        kind: 'concept',
        statement: 'Dans un potentiel aléatoire assez fort, les ondes électroniques interfèrent de sorte que la diffusion s’annule : les états deviennent localisés, et l’échantillon passe du métal à l’isolant quand le désordre croît — la transition d’Anderson.',
        comment: 'L’article « Absence of Diffusion in Certain Random Lattices » (Physical Review, 1958) montre que le désordre gelé — non la température — peut figer le transport ; la transition métal-isolant devient un problème d’échelle (théorie du « gang des quatre », 1979) : en dimension ≤ 2, tout désordre localise.',
      },
      {
        id: 'renormalisation-de-wilson',
        title: 'Groupe de renormalisation de Wilson',
        year: 1971,
        authorName: 'Kenneth G. Wilson',
        mathematicianId: 'wilson-kenneth',
        theoryId: 'ps-transitions-de-phase-et-phenomenes-critiques',
        kind: 'methode',
        major: true,
        statement: 'Pour calculer les propriétés critiques, on moyenne les couplages à des échelles croissantes : le flot des paramètres effectifs possède des points fixes dont les directions propres donnent les exposants ; chaque classe d’universalité est le bassin d’attraction d’un point fixe.',
        comment: 'L’idée de blocs de Kadanoff (1966) devient calculatoire chez Wilson (1971) ; l’ε-expansion de Wilson et Fisher (1972) produit des exposants numériques conformes aux données. La méthode essaime à la théorie des champs, à la turbulence et à la transition du chaos (Feigenbaum). Nobel 1982.',
        context: [
          {
            kind: 'fait',
            text: 'Les exposants mesurés (aimants, fluides au point critique) et calculés (Onsager 1944, série haute température) contredisaient uniformément le champ moyen ; la théorie de Kadanoff des lois d’échelle (1966) les reliait sans en donner le mécanisme.',
            sources: ['domb-critical-point', 'kadanoff-order-chaos'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La renormalisation réconcilie universalité et diversité des systèmes : dimension et symétrie du paramètre d’ordre suffisent à classer les exposants. Elle fournit aussi l’outil conceptuel du chaos (Feigenbaum, 1978) et de la théorie quantique des champs effective.',
            sources: ['brown-renormalization', 'domb-critical-point'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Kadanoff lui-même, le groupe de renormalisation illustre la migration des concepts entre disciplines : de la mécanique statistique à la théorie des champs, puis au chaos — une preuve que les idées d’échelle traversent les frontières.',
            sources: ['kadanoff-order-chaos'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Au point critique, le système est sans échelle : les fluctuations existent à toutes les tailles. Kadanoff voit que regrouper les spins en blocs doit reproduire la même physique — la théorie devient une équation de point fixe dont les itérations font l’exposant.',
            sources: ['kadanoff-order-chaos', 'domb-critical-point'],
          },
        ],
      },
      {
        id: 'more-is-different',
        title: '« More is Different »',
        year: 1972,
        authorName: 'Philip W. Anderson',
        mathematicianId: 'anderson-philip',
        theoryId: 'ps-desordre-et-emergence',
        kind: 'texte',
        statement: 'Contre le programme réductionniste, Anderson soutient que chaque niveau d’organisation possède ses lois : la supraconductivité ne se déduit pas des seules équations de Schrödinger, et l’émergence engendre des concepts irréductibles aux constituants.',
        comment: 'Paru dans Science (août 1972), l’article donne à la physique de la matière condensée sa bannière philosophique — symétries brisées, rigidité généralisée, quasi-particules — et nourrit la réflexion sur l’autonomie des niveaux de description, de la chimie à la biologie.',
      },
      {
        id: 'brisure-de-symetrie-des-repliques-de-parisi',
        title: 'Brisure de symétrie des répliques de Parisi',
        year: 1979,
        authorName: 'Giorgio Parisi',
        mathematicianId: 'parisi',
        theoryId: 'ps-desordre-et-emergence',
        kind: 'concept',
        statement: 'Dans le verre de spin de Sherrington–Kirkpatrick, le paramètre d’ordre n’est pas un nombre mais une fonction sur [0,1] : la brisure de symétrie des répliques décrit une hiérarchie ultramétrique d’états purs séparés par des barrières d’entropie.',
        comment: 'La solution de Parisi (1979) donne au modèle SK sa thermodynamique exacte ; sa structure d’états multiples essaime à l’optimisation, aux réseaux neuronaux et aux problèmes de satisfaction de contraintes, et sa formule pour l’énergie libre est prouvée par Guerra puis Talagrand (2003-2006).',
      },
    ],
    sources: ['out-of-the-crystal-maze', 'domb-critical-point', 'brush-statistical-physics', 'kadanoff-order-chaos', 'anderson-more-different', 'mezard-parisi-virasoro', 'niss-ising', 'mactutor', 'sep'],
  },
];

/** Liens entre domaines, déclarés dans le fichier de leur domaine d'arrivée. */
export const LINKS_PHYSIQUE_D: Link[] = [
  // — vers la physique statistique et la matière condensée —
  {
    source: 'probabilites-modernes',
    target: 'physique-statistique-et-matiere-condensee',
    kind: 'influence',
    epistemic: 'fait',
    principal: true,
    label: 'Les ensembles de Gibbs deviennent mesures',
    note: 'L’axiomatisation de Kolmogorov (1933) et la théorie ergodique fournissent le langage des mesures de Gibbs et des états d’équilibre sur lequel Sinaï, Ruelle et Bowen bâtissent la mécanique statistique rigoureuse des années 1960-1970.',
    sources: ['von-plato-creating', 'aubin-dahan-chaos'],
  },
  {
    source: 'probabilites-et-statistique-contemporaines',
    target: 'physique-statistique-et-matiere-condensee',
    kind: 'influence',
    epistemic: 'fait',
    label: 'Marches, champs et verres',
    note: 'Marches aléatoires, percolation et champs de Gibbs structurent l’étude du désordre ; la formule de Parisi pour le verre de spin de Sherrington–Kirkpatrick sera démontrée par Guerra (2003) puis Talagrand (2006) avec les méthodes des probabilités contemporaines.',
    sources: ['mezard-parisi-virasoro', 'domb-critical-point'],
  },
  {
    source: 'mecanique-analytique',
    target: 'physique-statistique-et-matiere-condensee',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'L’espace des phases en héritage',
    note: 'La formulation hamiltonienne — crochets de Poisson, espace des phases, théorème de Liouville — fournit le théâtre de la mécanique statistique : les ensembles de Boltzmann et Gibbs sont des mesures sur l’espace des phases hérité de la mécanique analytique.',
    sources: ['brush-statistical-physics', 'dieudonne-abrege'],
  },
];

/** Liens entre figures (filiation, influence, collaboration, affinité, rupture). */
export const MATHEMATICIAN_LINKS_PHYSIQUE_D: MathematicianLink[] = [
  // — physique statistique et matière condensée —
  { source: 'onsager', target: 'kadanoff', kind: 'influence', note: 'La solution exacte d’Onsager (1944) fournit le matériau des lois d’échelle de Kadanoff (1966) : ses exposants non classiques exigent une théorie des fluctuations à toutes échelles.', epistemic: 'interpretation' },
  { source: 'wilson-kenneth', target: 'fisher-michael', kind: 'collaboration', note: 'Wilson et Fisher publient l’ε-expansion des exposants critiques (Physical Review Letters, 1972), point de départ du calcul en renormalisation.', epistemic: 'fait' },
];
