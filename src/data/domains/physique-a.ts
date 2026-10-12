import type { Domain, Link, MathematicianLink, Source } from '../types';

/** Sources propres à ce fichier (le socle est dans ../sources.ts : ne pas le redéclarer). */
export const SOURCES_PHYSIQUE_A: Source[] = [
  // — Optique antique et médiévale —
  { id: 'smith-ptolemy-optics', type: 'livre', author: 'A. Mark Smith', title: 'Ptolemy and the Foundations of Ancient Mathematical Optics: A Source Based Guided Study', year: 1999, publisher: 'American Philosophical Society', note: 'Transactions of the American Philosophical Society, vol. 89, part 3.' },
  { id: 'smith-sight-to-light', type: 'livre', author: 'A. Mark Smith', title: 'From Sight to Light: The Passage from Ancient to Modern Optics', year: 2015, publisher: 'Oxford University Press' },
  { id: 'lindberg-optics', type: 'livre', author: 'David C. Lindberg', title: 'Theories of Vision from Al-Kindi to Kepler', year: 1976, publisher: 'University of Chicago Press' },
  { id: 'crombie-grosseteste', type: 'livre', author: 'A. C. Crombie', title: 'Robert Grosseteste and the Origins of Experimental Science 1100-1700', year: 1953, publisher: 'Clarendon Press' },
  { id: 'boyer-rainbow', type: 'livre', author: 'Carl B. Boyer', title: 'The Rainbow: From Myth to Mathematics', year: 1959, publisher: 'Yoseloff', note: 'Rééd. Princeton University Press, 1987.' },
  // — Astronomie mathématique —
  { id: 'neugebauer-hama', type: 'livre', author: 'Otto Neugebauer', title: 'A History of Ancient Mathematical Astronomy', year: 1975, publisher: 'Springer', note: 'Trois volumes.' },
  { id: 'evans-astronomy', type: 'livre', author: 'James Evans', title: 'The History and Practice of Ancient Astronomy', year: 1998, publisher: 'Oxford University Press' },
  { id: 'dreyer-astronomy', type: 'livre', author: 'J. L. E. Dreyer', title: 'A History of Astronomy from Thales to Kepler', year: 1906, publisher: 'Cambridge University Press' },
  { id: 'pedersen-early-physics', type: 'livre', author: 'Olaf Pedersen', title: 'Early Physics and Astronomy: A Historical Introduction', year: 1993, publisher: 'Cambridge University Press', note: 'Édition révisée (1ʳᵉ éd. 1974).' },
  { id: 'kennedy-planetary', type: 'article', author: 'Edward S. Kennedy', title: 'Late Medieval Planetary Theory', year: 1966, publisher: 'Isis, vol. 57, n° 3' },
  { id: 'kuhn-copernican', type: 'livre', author: 'Thomas S. Kuhn', title: 'The Copernican Revolution: Planetary Astronomy in the Development of Western Thought', year: 1957, publisher: 'Harvard University Press' },
  { id: 'westman-copernican', type: 'livre', author: 'Robert S. Westman', title: 'The Copernican Question: Prognostication, Skepticism, and Celestial Order', year: 2011, publisher: 'University of California Press' },
  { id: 'grant-planets', type: 'livre', author: 'Edward Grant', title: 'Planets, Stars, and Orbs: The Medieval Cosmos, 1200-1687', year: 1994, publisher: 'Cambridge University Press' },
  { id: 'duhem-systeme', type: 'livre', author: 'Pierre Duhem', title: 'Le Système du monde : histoire des doctrines cosmologiques de Platon à Copernic', year: 1913, publisher: 'Hermann', note: 'Dix volumes, parus de 1913 à 1959.' },
  { id: 'thoren-brahe', type: 'livre', author: 'Victor E. Thoren', title: 'The Lord of Uraniborg: A Biography of Tycho Brahe', year: 1990, publisher: 'Cambridge University Press' },
  { id: 'voelkel-astronomia', type: 'livre', author: 'James R. Voelkel', title: 'The Composition of Kepler’s Astronomia nova', year: 2001, publisher: 'Princeton University Press' },
  { id: 'caspar-kepler', type: 'livre', author: 'Max Caspar', title: 'Kepler', year: 1993, publisher: 'Dover', note: 'Traduction anglaise de C. Doris Hellman (1959) ; original allemand, 1948.' },
  // — Mécanique médiévale et galiléenne —
  { id: 'moody-clagett-ponderibus', type: 'livre', author: 'Ernest A. Moody, Marshall Clagett (dir.)', title: 'The Medieval Science of Weights (Scientia de ponderibus)', year: 1952, publisher: 'University of Wisconsin Press', note: 'Traités attribués à Euclide, Archimède, Thābit, Jordanus et Blaise de Parme.' },
  { id: 'clagett-mechanics', type: 'livre', author: 'Marshall Clagett', title: 'The Science of Mechanics in the Middle Ages', year: 1959, publisher: 'University of Wisconsin Press' },
  { id: 'wallace-domingo', type: 'article', author: 'William A. Wallace', title: 'The Enigma of Domingo de Soto: Uniformiter difformis and Falling Bodies in Late Medieval Physics', year: 1968, publisher: 'Isis, vol. 59, n° 4' },
  { id: 'koyre-galilee', type: 'livre', author: 'Alexandre Koyré', title: 'Études galiléennes', year: 1939, publisher: 'Hermann', note: 'Rééd. en un volume, 1966.' },
  { id: 'drake-galileo', type: 'livre', author: 'Stillman Drake', title: 'Galileo at Work: His Scientific Biography', year: 1978, publisher: 'University of Chicago Press' },
  { id: 'dijksterhuis', type: 'livre', author: 'E. J. Dijksterhuis', title: 'The Mechanization of the World Picture', year: 1961, publisher: 'Oxford University Press', note: 'Traduction anglaise ; original néerlandais, 1950.' },
  { id: 'grant-much-ado', type: 'livre', author: 'Edward Grant', title: 'Much Ado About Nothing: Theories of Space and Vacuum from the Middle Ages to the Scientific Revolution', year: 1981, publisher: 'Cambridge University Press' },
];

/**
 * Pendant physique — partie A : de l'Antiquité à 1700 (optique antique et
 * médiévale, astronomie mathématique, impetus et mécanique galiléenne).
 * Plan : docs/superpowers/plans/2026-10-12-pendant-physique.md § 5.2.
 */
export const PHYSIQUE_A: Domain[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Optique antique et médiévale
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'optique-antique-et-medievale',
    name: 'Optique antique et médiévale',
    mapName: 'Optique antique',
    altNames: ['Optique géométrique et théorie de la vision', 'Perspectiva'],
    era: 'medieval',
    period: { start: -300, end: 1310, approx: true },
    continents: ['physique'],
    places: ['Alexandrie', 'Bagdad', 'Le Caire', 'Oxford', 'Paris', 'Freiberg'],
    map: { x: 1300, y: 4750, size: 2, palette: { fill: '#d1f0eb', stroke: '#2a6f65', accent: '#298e7f' } },
    tagline: 'Du rayon visuel d’Euclide aux gouttes de pluie de Thierry de Freiberg : la lumière devient géométrie, puis expérience.',
    summary:
      'L’optique est la première physique mathématique : Euclide y décrit la vision par des rayons en ligne droite et les miroirs par des angles égaux, et Ptolémée y ajoute les premières tables de mesure de la réfraction. À Bagdad puis au Caire, Ibn al-Haytham en refond l’objet — ce n’est plus l’œil qui émet des rayons, mais la lumière qui entre dans l’œil depuis chaque point de l’objet — et il y fonde une méthode mêlant géométrie, anatomie et dispositifs expérimentaux. Traduit en latin, son livre nourrit les Perspectivae de Grosseteste, Peckham et Witelo, jusqu’à l’explication de l’arc-en-ciel par Thierry de Freiberg.',
    methods: [
      {
        kind: 'fait',
        text: 'L’optique antique traite la vision comme un problème de géométrie : un cône de « rayons visuels » issus de l’œil balaie les objets (Euclide), les miroirs renvoient la lumière selon des angles égaux (Catoptrique), et Ptolémée mesure sur un disque gradué les angles de réfraction à l’interface air-eau.',
        sources: ['smith-ptolemy-optics', 'heath-greek'],
      },
      {
        kind: 'fait',
        text: 'Ibn al-Haytham articule trois contrôles : la géométrie des rayons en ligne droite, l’anatomie de l’œil héritée de Galien et de Hunayn ibn Isḥāq, et des dispositifs expérimentaux — chambre noire, règles de visée, globes remplis d’eau — qui tranchent entre les théories concurrentes.',
        sources: ['sabra-optics', 'lindberg-optics'],
      },
      {
        kind: 'fait',
        text: 'Chez les Latins, l’optique s’écrit comme un Euclide appliqué : Peckham et Witelo déduisent les propositions de la vision directe, puis celles de la réflexion sur miroirs plans et sphériques, puis celles de la réfraction, dans l’ordre même du livre d’Ibn al-Haytham.',
        sources: ['lindberg-optics', 'smith-sight-to-light'],
      },
      {
        kind: 'interpretation',
        text: 'Pour A. Mark Smith comme pour Lindberg, le vrai tournant de l’optique ne se situe pas chez Kepler mais chez Ibn al-Haytham : la question cesse d’être « que voit l’œil ? » pour devenir « quelles lignes la lumière suit-elle ? ».',
        sources: ['smith-sight-to-light', 'lindberg-optics'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'L’Optique d’Ibn al-Haytham, traduite en latin sous le titre De aspectibus vers la fin du XIIᵉ ou le début du XIIIᵉ siècle, circule à Paris et à Oxford dès les années 1230 : Grosseteste la connaît, Bacon la commente, Peckham et Witelo la reprennent.',
        sources: ['lindberg-optics'],
      },
      {
        kind: 'fait',
        text: 'L’outillage reste sommaire : miroirs de métal poli ou de verre, sphères et fioles remplies d’eau, disques gradués, chambre noire. C’est avec une fiole sphérique pleine d’eau que Thierry de Freiberg reconstitue dans son cabinet le trajet du rayon dans la goutte de pluie.',
        sources: ['boyer-rainbow', 'crombie-grosseteste'],
      },
      {
        kind: 'fait',
        text: 'Au XIIIᵉ siècle l’optique rejoint les disciplines enseignées en faculté des arts : la Perspectiva communis de Peckham, conservée dans des dizaines de manuscrits, est imprimée à la fin du XVᵉ siècle et rééditée jusqu’au XVIIᵉ.',
        sources: ['lindberg-optics', 'smith-sight-to-light'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'Kamāl al-Dīn al-Fārisī, dans le Tanqīḥ al-Manāẓir rédigé à Tabriz vers 1300, et Thierry de Freiberg, vers 1304-1310 à l’autre bout de l’Eurasie, donnent la même explication de l’arc-en-ciel — deux réfractions et une réflexion interne par goutte — sans qu’aucun contact entre les deux traditions ne puisse être établi.',
        sources: ['boyer-rainbow', 'rashed-sciences-arabes'],
      },
      {
        kind: 'interpretation',
        text: 'Crombie fait de Grosseteste et des perspectivistes les fondateurs de la « méthode expérimentale » ; Lindberg objecte que leurs experientiae illustrent le plus souvent des lois déjà connues, et que la nouveauté est dans l’alliance de la géométrie et du contrôle instrumental.',
        sources: ['crombie-grosseteste', 'lindberg-optics'],
      },
      {
        kind: 'fait',
        text: 'La Perspectiva de Witelo suit si fidèlement l’œuvre d’Ibn al-Haytham — plan, propositions, figures — que Lindberg la présente comme une paraphrase latine : c’est par elle, plus que par le De aspectibus, que l’Occident lit Alhazen.',
        sources: ['lindberg-optics'],
      },
    ],
    keyDates: [
      { year: -300, text: 'Optique d’Euclide : la vision décrite par un cône de rayons émis par l’œil (date conventionnelle).' },
      { year: 60, text: 'Catoptrique d’Héron d’Alexandrie : l’égalité des angles de réflexion démontrée par le plus court chemin (vers).' },
      { year: 150, text: 'Optique de Claude Ptolémée : tables de réfraction mesurées au disque gradué (livre V), vers 160-170.' },
      { year: 984, text: 'Ibn Sahl compose à Bagdad un traité des instruments ardents : la courbure des lentilles est rapportée à la loi de réfraction (vers).' },
      { year: 1035, text: 'Ibn al-Haytham achève le Kitāb al-Manāẓir au Caire (entre 1028 et 1038 environ).' },
      { year: 1225, text: 'Robert Grosseteste écrit De luce et ses opuscules d’optique à Oxford (vers).' },
      { year: 1274, text: 'Witelo dédie sa Perspectiva à Guillaume de Moerbeke à Viterbe ; Jean Peckham rédige la Perspectiva communis (vers 1270-1279).' },
      { year: 1305, text: 'Thierry de Freiberg compose le De iride et radialibus impressionibus (vers 1304-1310).' },
    ],
    theories: [
      {
        id: 'oa-optique-geometrique-antique',
        name: 'Optique géométrique antique : rayons, miroirs, réfraction',
        period: { start: -300, end: 200, approx: true },
        summary: 'La vision est ramenée à des figures : cône de rayons visuels pour Euclide, réflexion en angles égaux pour les traités de catoptrique et les miroirs ardents (Anthemius), réfraction mesurée au disque pour Ptolémée — la première table de données quantitatives de la physique.',
        traits: ['Rayons visuels et cône de vision', 'Réflexion en angles égaux', 'Miroirs ardents et focale de la parabole', 'Tables de réfraction au disque gradué'],
      },
      {
        id: 'oa-science-de-la-vision',
        name: 'La science de la vision : du De aspectibus à la chambre noire',
        period: { start: 800, end: 1320, approx: true },
        summary: 'De l’anatomie de l’œil de Hunayn aux espèces d’al-Kindī, puis à la synthèse d’Ibn al-Haytham : chaque point de l’objet envoie sa lumière dans toutes les directions et l’œil retient le rayon perpendiculaire ; la chambre noire devient modèle et instrument de la théorie.',
        traits: ['Anatomie de l’œil (Hunayn, Galien)', 'Intromission contre extramission', 'Chambre noire et dispositifs expérimentaux', 'Vision comme inférence'],
      },
      {
        id: 'oa-perspectiva-latine',
        name: 'La tradition de la perspectiva latine',
        period: { start: 1220, end: 1310, approx: true },
        summary: 'Le De aspectibus latin rencontre la scolastique : Grosseteste fait de la lumière la forme première de la matière, Bacon systématise la multiplication des espèces, Peckham et Witelo écrivent les manuels, et Thierry de Freiberg résout l’énigme de l’arc-en-ciel.',
        traits: ['Lumière et cosmogonie (De luce)', 'Manuels de perspectiva (Peckham, Witelo)', 'De iride : l’arc-en-ciel dans la goutte', 'Transmission manuscrite et imprimée'],
      },
    ],
    mathematicians: [
      {
        id: 'peckham',
        name: 'Jean Peckham',
        years: [1230, 1292],
        yearsApprox: true,
        origin: 'Patcham, Oxford et Canterbury',
        bio: 'Franciscain formé à Paris et à Oxford, Jean Peckham (Johannes Pecham) enseigne la théologie à Paris puis à Rome, devient provincial de son ordre en Angleterre, puis archevêque de Cantorbéry en 1279. Sa Perspectiva communis, composée avant l’épiscopat, condense Ibn al-Haytham et Bacon en trois livres — vision directe, miroirs, réfraction — et devient le manuel d’optique des universités pendant trois siècles.',
        theoryId: 'oa-perspectiva-latine',
        sources: ['lindberg-optics'],
      },
      {
        id: 'witelo',
        name: 'Witelo',
        years: [1230, 1280],
        yearsApprox: true,
        origin: 'Silésie, Paris et Viterbe',
        bio: 'D’origine silésienne ou thuringienne (Vitellonis Thuringopoloni), formé à Paris puis à Padoue, Witelo compose à Viterbe, dans l’entourage du traducteur Guillaume de Moerbeke, une Perspectiva en dix livres qui transpose presque intégralement l’Optique d’Ibn al-Haytham. Imprimée à Nuremberg en 1535 puis dans l’Opticae thesaurus de Risner (1572), c’est le livre d’optique que lit Kepler.',
        theoryId: 'oa-perspectiva-latine',
        sources: ['lindberg-optics'],
      },
      {
        id: 'dietrich-de-freiberg',
        name: 'Thierry de Freiberg',
        years: [1250, 1320],
        yearsApprox: true,
        origin: 'Freiberg, Fribourg et Paris',
        bio: 'Dominicain saxon (Theodoricus Teutonicus de Vriberg, Dietrich von Freiberg), lecteur au studium de Fribourg puis provincial de l’ordre pour la Germanie (1293-1296) et maître en théologie à Paris, Thierry compose vers 1304-1310 le De iride et radialibus impressionibus : en observant le rayon dans des sphères de verre pleines d’eau, il donne la première explication correcte de l’arc-en-ciel.',
        theoryId: 'oa-perspectiva-latine',
        sources: ['lindberg-optics', 'boyer-rainbow'],
      },
    ],
    relatedMathematicianIds: ['euclide', 'ptolemee', 'heron', 'aristote', 'ibn-al-haytham'],
    results: [
      {
        id: 'optique-d-euclide',
        title: 'Optique',
        year: -300,
        yearApprox: true,
        authorName: 'Euclide',
        mathematicianId: 'euclide',
        theoryId: 'oa-optique-geometrique-antique',
        kind: 'texte',
        comment: 'Premier traité d’optique conservé : la vision y est décrite par un cône de « rayons visuels » émis par l’œil vers les objets, et les propositions établissent les premiers résultats de la perspective géométrique (tailles et positions apparentes). La Catoptrique attribuée à Euclide ajoute les règles des miroirs, dont l’égalité des angles d’incidence et de réflexion.',
      },
      {
        id: 'reflexion-chemin-minimal-heron',
        title: 'Réflexion : le rayon suit le plus court chemin',
        year: 60,
        yearApprox: true,
        authorName: 'Héron d’Alexandrie',
        mathematicianId: 'heron',
        theoryId: 'oa-optique-geometrique-antique',
        kind: 'theoreme',
        statement: 'Le rayon qui va de l’œil à l’objet en touchant le miroir suit le plus court des chemins possibles : les angles d’incidence et de réflexion sont égaux.',
        comment: 'Dans la Catoptrique transmise sous le nom d’Héron (un fonds plus ancien, peut-être archimédien), l’égalité des angles n’est pas un postulat mais une conséquence d’un principe de nature : la lumière ne va pas « en vain ». C’est le premier raisonnement de type variationnel de la physique, que Fermat reprendra pour la réfraction (1662).',
        intuition: [
          {
            kind: 'fait',
            text: 'En « dépliant » le trajet réfléchi par symétrie autour de la surface du miroir, le trajet brisé œil-miroir-objet devient une simple ligne : le plus court chemin saute aux yeux.',
            sources: ['heath-greek', 'smith-sight-to-light'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Soit un miroir plan et, du même côté, l’œil en E et l’objet en O ; on cherche le point P du miroir où le rayon se réfléchit.',
            sources: ['heath-greek'],
          },
          {
            kind: 'fait',
            text: 'On symétrise O par rapport au plan du miroir en O′ : pour tout point P du miroir, PO = PO′, donc le trajet EPO a la même longueur que EPO′.',
            sources: ['heath-greek', 'smith-ptolemy-optics'],
          },
          {
            kind: 'fait',
            text: 'Le plus court chemin de E à O′ est la droite EO′ : la réflexion a lieu au point P₀ où cette droite coupe le miroir.',
            sources: ['heath-greek'],
          },
          {
            kind: 'fait',
            text: 'La symétrie entre O et O′ fait que les droites EP₀ et P₀O forment avec la perpendiculaire au miroir des angles égaux : incidence égale réflexion.',
            sources: ['heath-greek', 'smith-ptolemy-optics'],
          },
        ],
      },
      {
        id: 'tables-de-refraction-ptolemee',
        title: 'Tables de mesure de la réfraction',
        altTitle: 'Optique, livre V',
        year: 160,
        yearApprox: true,
        authorName: 'Claude Ptolémée',
        mathematicianId: 'ptolemee',
        theoryId: 'oa-optique-geometrique-antique',
        kind: 'methode',
        statement: 'Pour des incidences réglées de 10° en 10°, Ptolémée consigne les angles de réfraction aux interfaces air-eau, air-verre et eau-verre, mesurés sur un disque gradué ; ses valeurs s’écartent peu des sinus et s’interpolent presque par une loi du second degré.',
        comment: 'Le livre V de l’Optique est la première étude quantitative de la réfraction : montage décrit, triples de mesures consignés, régularité discutée — mais aucune loi simple n’est extraite. La question reste ouverte jusqu’à Ibn Sahl (vers 984), Snell (1621) et Descartes (1637).',
        context: [
          {
            kind: 'fait',
            text: 'Les traités de catoptrique grecs savaient que le rayon se « casse » au passage d’un milieu à l’autre, mais ne mesuraient pas les angles ; Ptolémée veut établir si l’écart suit une loi régulière, comme pour la réflexion.',
            sources: ['smith-ptolemy-optics', 'lindberg-optics'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Transmises en arabe puis en latin, ses triplets de mesures font référence jusqu’au XVIIᵉ siècle : Ibn al-Haytham les discute au livre VII, Witelo les reprend, et Kepler, qui les contrôle dans les Paralipomènes à Vitellion (1604), n’en tire pas la loi des sinus.',
            sources: ['smith-ptolemy-optics', 'lindberg-optics'],
          },
        ],
      },
      {
        id: 'vision-par-intromission-ibn-al-haytham',
        title: 'La vision par intromission : de chaque point, un rayon vers l’œil',
        year: 1035,
        yearApprox: true,
        authorName: 'Ibn al-Haytham (Alhazen)',
        mathematicianId: 'ibn-al-haytham',
        theoryId: 'oa-science-de-la-vision',
        kind: 'concept',
        major: true,
        statement: 'Chaque point d’un objet éclairé envoie de la lumière en ligne droite dans toutes les directions ; l’œil n’en retient que le rayon perpendiculaire à la cornée — la vision est une réception de lumière, puis une inférence, non une émission de rayons.',
        comment: 'Au livre I du Kitāb al-Manāẓir, Ibn al-Haytham déplace l’objet de l’optique : il ne s’agit plus de ce que l’œil émet (Euclide, Ptolémée) ni des espèces que l’objet envoie (les philosophes), mais de la géométrie exacte des rayons qui entrent dans un œil anatomiquement décrit, la chambre noire servant de modèle et d’instrument.',
        context: [
          {
            kind: 'fait',
            text: 'Les théories concurrentes — rayon visuel émis par l’œil (Euclide, Ptolémée, al-Kindī), formes émises par l’objet (Aristote), anatomie de l’œil (Hunayn ibn Isḥāq, Galien) — n’étaient compatibles ni entre elles ni avec les phénomènes.',
            sources: ['lindberg-optics', 'smith-sight-to-light'],
          },
          {
            kind: 'fait',
            text: 'Ibn al-Haytham compose le traité au Caire sous les Fatimides ; ses expériences de chambre noire (al-bayt al-muẓlim), décrites au livre I, vérifient la propagation rectiligne des rayons et leur indépendance mutuelle.',
            sources: ['sabra-optics', 'lindberg-optics'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Traduit en latin sous le titre De aspectibus à la fin du XIIᵉ ou au début du XIIIᵉ siècle, le livre fonde la tradition des perspectivistes — Grosseteste, Bacon, Peckham, Witelo — et est réimprimé dans l’Opticae thesaurus de Friedrich Risner (Bâle, 1572).',
            sources: ['lindberg-optics', 'sabra-optics'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Sabra comme pour Lindberg, Kepler n’ajoute en 1604 que le mécanisme de l’image rétinienne à ce schéma : la structure de l’optique moderne est déjà celle d’Ibn al-Haytham.',
            sources: ['lindberg-optics', 'smith-sight-to-light'],
          },
        ],
      },
      {
        id: 'de-luce-grosseteste',
        title: 'De luce : la lumière comme forme corporelle première',
        year: 1225,
        yearApprox: true,
        authorName: 'Robert Grosseteste',
        theoryId: 'oa-perspectiva-latine',
        kind: 'texte',
        comment: 'Grosseteste fait de la lumière (lux) la première forme corporelle : en se « multipliant » à l’infini depuis un point, elle dilate la matière première en une sphère à treize régions et donne au monde sa figure géométrique — l’optique devient la clé de toute physique.',
        context: [
          {
            kind: 'fait',
            text: 'Chancelier d’Oxford puis évêque de Lincoln (1235), Grosseteste lit l’optique d’Aristote et de Ptolémée ainsi que le De aspectibus latin d’Ibn al-Haytham ; ses opuscules De luce, De lineis et De iride forment un programme où la lumière est la cause de toute action naturelle.',
            sources: ['crombie-grosseteste', 'lindberg-optics'],
          },
        ],
        impact: [
          {
            kind: 'interpretation',
            text: 'Crombie y a vu l’acte de naissance de la méthode expérimentale anglaise ; les historiens y lisent plutôt un programme métaphysico-optique dont les « expériences » (verres remplis d’eau, miroirs) servent à vérifier la géométrie des rayons, non à découvrir des lois.',
            sources: ['crombie-grosseteste', 'lindberg-optics'],
          },
        ],
      },
      {
        id: 'perspectiva-communis-peckham',
        title: 'Perspectiva communis',
        year: 1277,
        yearApprox: true,
        authorName: 'Jean Peckham',
        mathematicianId: 'peckham',
        theoryId: 'oa-perspectiva-latine',
        kind: 'texte',
        comment: 'Manuel d’optique en trois livres — vision directe, réflexion, réfraction — qui condense Ibn al-Haytham et Bacon en thèses brièvement démontrées. Conservé dans des dizaines de manuscrits et plusieurs éditions incunables, il est la référence universitaire d’optique jusque dans l’Opticae thesaurus de Risner (1572).',
      },
      {
        id: 'perspectiva-witelo',
        title: 'Perspectiva de Witelo',
        year: 1274,
        yearApprox: true,
        authorName: 'Witelo',
        mathematicianId: 'witelo',
        theoryId: 'oa-perspectiva-latine',
        kind: 'texte',
        comment: 'Composée à Viterbe et dédiée à Guillaume de Moerbeke, la Perspectiva en dix livres transpose pour l’Occident le contenu de l’Optique d’Ibn al-Haytham. Sa diffusion manuscrite puis imprimée (Nuremberg, 1535 ; Opticae thesaurus, Bâle, 1572) en fait le manuel des perspectivistes suivants, de Thierry de Freiberg à Kepler, dont les Paralipomènes à Vitellion portent son nom.',
      },
      {
        id: 'explication-de-l-arc-en-ciel',
        title: 'Explication de l’arc-en-ciel',
        altTitle: 'De iride et radialibus impressionibus',
        year: 1308,
        yearApprox: true,
        authorName: 'Thierry de Freiberg',
        mathematicianId: 'dietrich-de-freiberg',
        theoryId: 'oa-perspectiva-latine',
        kind: 'theoreme',
        statement: 'Dans chaque goutte de pluie, le rayon solaire subit à l’entrée une réfraction, une réflexion interne puis une seconde réfraction à la sortie : c’est ce trajet dans les gouttes — non une réflexion sur un nuage — qui forme l’arc principal ; l’arc secondaire, plus faible et aux couleurs inversées, vient d’une seconde réflexion interne.',
        comment: 'Vers 1304-1310, le De iride résout le problème laissé ouvert par Aristote et repris par les perspectivistes : l’arc naît dans les gouttes elles-mêmes. Le calcul complet des angles attendra la loi de la réfraction (Descartes, 1637) et l’explication des couleurs, le spectre de Newton (1672).',
        context: [
          {
            kind: 'fait',
            text: 'Aristote (Météorologiques, III) décrivait l’arc comme la réflexion du soleil sur un nuage ; Grosseteste avait pressenti le rôle de la réfraction et la Perspectiva de Witelo analysait la réflexion interne dans une sphère d’eau.',
            sources: ['boyer-rainbow', 'lindberg-optics'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'À la même époque, à Tabriz, Kamāl al-Dīn al-Fārisī arrive par les mêmes expériences à la même explication, dans sa révision de l’Optique d’Ibn al-Haytham ; les deux travaux s’ignorent mutuellement.',
            sources: ['boyer-rainbow', 'rashed-sciences-arabes'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Boyer, l’explication de l’arc-en-ciel est le triomphe de la méthode perspectiviste : une explication physique obtenue par la géométrie des rayons contrôlée par l’expérience, trouvée indépendamment en Orient et en Occident.',
            sources: ['boyer-rainbow', 'lindberg-optics'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Thierry expose au soleil des sphères et des fioles de verre remplies d’eau : il y voit la lumière ressortir vers un observateur placé dos à la source, et reproduit à volonté les deux trajets des deux arcs.',
            sources: ['boyer-rainbow', 'crombie-grosseteste'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Une goutte sphérique reçoit le rayon solaire : à la surface air-eau, il se réfracte en se rapprochant de la normale, et la lumière commence à se disperser.',
            sources: ['boyer-rainbow', 'lindberg-optics'],
          },
          {
            kind: 'fait',
            text: 'À la face arrière de la goutte, une partie de la lumière ressort, une autre se réfléchit vers l’avant-bas : la face interne de la goutte agit comme un miroir sphérique.',
            sources: ['boyer-rainbow', 'lindberg-optics'],
          },
          {
            kind: 'fait',
            text: 'À la sortie, le rayon se réfracte une seconde fois en s’écartant de la normale ; il rejoint l’œil d’un observateur tourné dos au soleil, sous un angle de l’ordre de 42° par rapport à l’axe soleil-œil.',
            sources: ['boyer-rainbow'],
          },
          {
            kind: 'fait',
            text: 'Les gouttes qui renvoient la lumière sous cet angle forment autour de l’axe soleil-œil un cône, dont l’intersection apparente avec le ciel est un arc de cercle ; chaque couleur provient de gouttes à une hauteur légèrement différente.',
            sources: ['boyer-rainbow'],
          },
          {
            kind: 'fait',
            text: 'Un rayon subissant deux réflexions internes avant de ressortir forme l’arc secondaire : plus haut, plus faible puisque chaque réflexion perd de la lumière, et aux couleurs inversées.',
            sources: ['boyer-rainbow', 'lindberg-optics'],
          },
        ],
      },
    ],
    sources: ['smith-ptolemy-optics', 'smith-sight-to-light', 'lindberg-optics', 'sabra-optics', 'crombie-grosseteste', 'boyer-rainbow', 'heath-greek'],
  },
  // ───────────────────────────────────────────────────────────────────────────
  // Astronomie mathématique
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'astronomie-mathematique',
    name: 'Astronomie mathématique',
    mapName: 'Astronomie mathématique',
    altNames: ['Astronomie des tables et des modèles planétaires', 'De l’Almageste aux lois de Kepler'],
    era: 'renaissance',
    period: { start: 150, end: 1619, approx: true },
    continents: ['physique'],
    places: ['Alexandrie', 'Damas', 'Maragha', 'Samarcande', 'Nuremberg', 'Hven', 'Prague'],
    map: { x: 2150, y: 4950, size: 2, palette: { fill: '#d5f1f0', stroke: '#2b7370', accent: '#2a928f' } },
    tagline: 'Quatorze siècles pour sauver les phénomènes : de l’Almageste aux données de Tycho, puis aux ellipses de Kepler.',
    summary:
      'De l’Almageste de Ptolémée à l’Astronomia nova de Kepler, l’astronomie est la science mathématique par excellence : composer des mouvements circulaires pour reproduire les positions observées. L’école de Maragha et Ibn al-Shātir en corrigent les modèles sans en briser le cadre ; la restauration humaniste de l’Almageste par Peurbach et Regiomontanus ouvre la voie à Copernic ; les instruments de Tycho Brahe multiplient la précision par dix. Kepler tire alors des données de Mars l’ellipse et la loi des aires, avant que la troisième loi ne clôture la période en 1619.',
    methods: [
      {
        kind: 'fait',
        text: 'La machinerie des modèles : un épicycle porté par un déférent, un déférent excentrique, et chez Ptolémée un point de régularité décentré — l’équant — autour duquel le mouvement paraît uniforme ; les paramètres se règlent sur des observations choisies : éclipses, occultations, oppositions.',
        sources: ['neugebauer-hama', 'evans-astronomy'],
      },
      {
        kind: 'fait',
        text: 'Le travail d’observatoire : sphères armillaires, triquetrum, puis les grands instruments de Tycho à Uraniborg et Stjerneborg — quadrants muraux, sextants — calibrés, corrigés de la réfraction et de la parallaxe, qui portent la précision courante à environ une minute d’arc.',
        sources: ['thoren-brahe', 'dreyer-astronomy'],
      },
      {
        kind: 'fait',
        text: 'La tradition des tables : des zīj aux Tables alfonsines établies à Paris au XIVᵉ siècle, aux Tables pruténiques de Reinhold (1551) calculées sur les modèles de Copernic, jusqu’aux Tables rudolphines de Kepler (1627) calculées à l’aide des logarithmes.',
        sources: ['grant-planets', 'kuhn-copernican'],
      },
      {
        kind: 'interpretation',
        text: 'La lecture « instrumentaliste » de Duhem — sauver les phénomènes sans prétendre décrire le réel — s’applique mal aux protagonistes : les réformateurs de Maragha comme Copernic ou Kepler tiennent leurs modèles pour physiquement vrais, et c’est l’exigence de cohérence physique qui les oblige à en changer.',
        sources: ['duhem-systeme', 'westman-copernican'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'L’Almageste est le socle : traduit du grec en arabe au IXᵉ siècle, en latin par Gérard de Crémone vers 1175, il est re-enseigné à Vienne par Peurbach et abrégé par Regiomontanus dans l’Epitome, achevée vers 1463 et imprimée en 1496.',
        sources: ['grant-planets', 'evans-astronomy'],
      },
      {
        kind: 'fait',
        text: 'Les observatoires sont des entreprises de mécènes : Maragha pour Hülegü (1259), Samarcande pour Ulugh Beg (vers 1420), Uraniborg pour Frédéric II de Danemark (1576), Prague pour Rodolphe II (1599).',
        sources: ['kennedy-planetary', 'thoren-brahe'],
      },
      {
        kind: 'fait',
        text: 'L’imprimerie change la donne : les Ephemerides de Regiomontanus (1474) font de l’astronomie un outil de navigation et d’astrologie, et c’est dans l’officine de Petreius à Nuremberg que paraît le De revolutionibus de Copernic en 1543.',
        sources: ['kuhn-copernican', 'westman-copernican'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'La préface anonyme du De revolutionibus — « les hypothèses n’ont pas à être vraies, seulement à bien calculer » — n’est pas de Copernic : c’est Kepler qui révèle en 1609 qu’elle est d’André Osiander, chargé de surveiller l’impression.',
        sources: ['kuhn-copernican', 'westman-copernican'],
      },
      {
        kind: 'interpretation',
        text: 'Depuis Kennedy (1966), on sait que les modèles d’Ibn al-Shātir coïncident presque point pour point avec ceux de Copernic pour la Lune et pour Mercure : une transmission par les manuscrits byzantins ou italiens reste conjecturale, aucun document ne l’établissant.',
        sources: ['kennedy-planetary', 'westman-copernican'],
      },
      {
        kind: 'fait',
        text: 'En 1616, la Congrégation de l’Index suspend le De revolutionibus « jusqu’à ce qu’il soit corrigé » : le débat sur le mouvement de la Terre sort du domaine des astronomes pour entrer dans celui des théologiens.',
        sources: ['kuhn-copernican', 'westman-copernican'],
      },
      {
        kind: 'interpretation',
        text: 'La « révolution copernicienne » elle-même est discutée : pour Kuhn c’est un changement de paradigme, pour Westman la réception réelle — Tables pruténiques, lectures de Wittenberg — montre d’abord une appropriation technique sans adhésion cosmologique immédiate.',
        sources: ['kuhn-copernican', 'westman-copernican'],
      },
    ],
    keyDates: [
      { year: 150, text: 'Claude Ptolémée achève l’Almageste à Alexandrie (vers).' },
      { year: 1261, text: 'Naṣīr al-Dīn al-Ṭūsī rédige la Tadhkira à Maragha : le « couple » qui produit un va-et-vient rectiligne à partir de deux cercles (vers).' },
      { year: 1350, text: 'Ibn al-Shātir achève le Zīj al-jadīd à Damas : modèles sans excentriques ni équants (vers).' },
      { year: 1473, text: 'Regiomontanus imprime à Nuremberg les Theoricae novae planetarum de Peurbach, puis ses Ephemerides (1474).' },
      { year: 1514, text: 'Le Commentariolus de Copernic circule en manuscrit (avant 1515).' },
      { year: 1543, text: 'De revolutionibus orbium coelestium imprimé à Nuremberg ; Copernic meurt à Frombork.' },
      { year: 1572, text: 'La nova de la Cassiopée ; Tycho Brahe publie De nova stella (1573) et y mesure une parallaxe nulle.' },
      { year: 1588, text: 'De mundi aetherei recentioribus phaenomenis : le système géo-héliocentrique de Tycho et la leçon de la comète de 1577.' },
      { year: 1596, text: 'Mysterium cosmographicum : Kepler explique l’espacement des orbites par les solides platoniciens.' },
      { year: 1609, text: 'Astronomia nova : l’orbite de Mars est une ellipse ; le mouvement suit la loi des aires.' },
      { year: 1619, text: 'Harmonices mundi, livre V : les cubes des distances vont comme les carrés des périodes.' },
    ],
    theories: [
      {
        id: 'am-astronomie-ptolemeenne',
        name: 'L’héritage de l’Almageste : orbes, équants et tables',
        period: { start: 150, end: 1600, approx: true },
        summary: 'Déférents, épicycles, excentriques et équants, calculés dans les treize livres de l’Almageste puis déclinés dans les Hypothèses planétaires en sphères emboîtées : la machine cosmique grecque que les zīj recalculent et que les Latins redécouvrent par Gérard de Crémone.',
        traits: ['Déférents et épicycles', 'Excentrique et équant', 'Zīj et éphémérides', 'Hypothèses planétaires'],
      },
      {
        id: 'am-ecole-de-maragha',
        name: 'Les révisions de l’Almageste : de Maragha à Damas',
        period: { start: 1240, end: 1450, approx: true },
        summary: 'Ibn al-Haytham avait dénoncé dans les Doutes l’incohérence physique de l’équant ; Ṭūsī répond par le « couple », al-ʿUrḍī et Quṭb al-Dīn al-Shīrāzī par leurs modèles, et Ibn al-Shātir achève une astronomie sans excentriques ni équants.',
        traits: ['Doutes sur Ptolémée', 'Couple de Ṭūsī', 'Modèles sans excentriques', 'Zīj al-jadīd d’Ibn al-Shātir'],
      },
      {
        id: 'am-restauration-europeenne',
        name: 'Restauration humaniste et réforme copernicienne',
        period: { start: 1450, end: 1600, approx: true },
        summary: 'Peurbach réécrit les théoriques planétaires en orbes, Regiomontanus abrège l’Almageste, et Copernic tente de restaurer l’uniformité du mouvement circulaire en déplaçant le centre du monde vers le Soleil — lu techniquement à Wittenberg, contourné par le compromis de Tycho.',
        traits: ['Theoricae novae planetarum', 'Epitome de l’Almageste', 'Commentariolus et De revolutionibus', 'Lectures de Wittenberg'],
      },
      {
        id: 'am-mesure-et-lois-de-kepler',
        name: 'La mesure refaite et les lois de Kepler',
        period: { start: 1570, end: 1627, approx: true },
        summary: 'Tycho refonde la donnée astronomique — instruments géants, séries régulières, corrections de réfraction et de parallaxe ; Kepler en tire l’ellipse, la loi des aires et la loi harmonique, première « physique céleste » écrite en grandeurs mesurées.',
        traits: ['Uraniborg et les grands instruments', 'Correction de la réfraction astronomique', 'Ellipse et loi des aires', 'Loi harmonique et Tables rudolphines'],
      },
    ],
    mathematicians: [
      {
        id: 'al-shatir',
        name: 'Ibn al-Shātir',
        years: [1305, 1375],
        yearsApprox: true,
        origin: 'Damas',
        bio: 'Muwaqqit — chargé de l’horaire des prières — de la mosquée des Omeyyades à Damas, ʿAlāʾ al-Dīn ibn al-Shāṭir compose vers 1350 le Zīj al-jadīd : modèles de la Lune, de Mercure et des planètes qui se passent des excentriques et de l’équant de l’Almageste et gagnent en accord avec les observations. Ses constructions en épicycles secondaires, proches de celles que Copernic adoptera deux siècles plus tard, sont le sommet de la réforme ouverte à Maragha.',
        theoryId: 'am-ecole-de-maragha',
        sources: ['kennedy-planetary', 'rashed-sciences-arabes'],
      },
      {
        id: 'brahe',
        name: 'Tycho Brahe',
        years: [1546, 1601],
        origin: 'Knutstorp, Hven et Prague',
        bio: 'Noble danois installé en 1576 sur l’île de Hven, Tycho y fait bâtir Uraniborg et Stjerneborg et y accumule vingt ans d’observations d’une précision inédite ; sa nova de 1572 et sa comète de 1577 ruinent les sphères cristallines, et il propose en 1588 un système géo-héliocentrique sans parallaxe stellaire. Mathématicien impérial de Rodolphe II à Prague, il y accueille Kepler en 1600, qui hérite de ses données de Mars.',
        theoryId: 'am-mesure-et-lois-de-kepler',
        mactutor: 'Brahe',
        sources: ['mactutor', 'thoren-brahe'],
      },
      {
        id: 'maestlin',
        name: 'Michael Mästlin',
        years: [1550, 1631],
        origin: 'Göppingen et Tübingen',
        bio: 'Professeur de mathématiques à Tübingen, Mästlin y enseigne l’astronomie à Kepler et l’ouvre au système de Copernic ; il observe lui-même la comète de 1577 et en mesure une parallaxe quasi nulle. Son Epitome astronomiae (1582) est un manuel équilibré entre les deux systèmes, et ses notes marginales sont utilisées dans l’édition du De revolutionibus publiée à Amsterdam en 1617.',
        theoryId: 'am-restauration-europeenne',
        mactutor: 'Mastlin',
        sources: ['mactutor'],
      },
    ],
    relatedMathematicianIds: ['ptolemee', 'hipparque', 'thabit-ibn-qurra', 'nasir-al-din-al-tusi', 'al-kashi', 'regiomontanus', 'nunes', 'kepler'],
    results: [
      {
        id: 'equant-de-ptolemee',
        title: 'L’équant : sauver l’uniforme en décentrant le centre',
        year: 150,
        yearApprox: true,
        authorName: 'Claude Ptolémée',
        mathematicianId: 'ptolemee',
        theoryId: 'am-astronomie-ptolemeenne',
        kind: 'concept',
        statement: 'Pour rendre compte des anomalies des planètes sans renoncer au mouvement circulaire uniforme, Ptolémée fait tourner le déférent uniformément non autour de son centre ni de la Terre, mais autour d’un troisième point — l’équant, placé symétriquement par rapport au centre de l’excentrique.',
        comment: 'L’équant est l’invention la plus audacieuse de l’Almageste : elle sauve à la fois les phénomènes et l’uniformité, au prix d’un centre de rotation « vide » — l’incohérence physique qu’Ibn al-Haytham dénoncera dans les Doutes sur Ptolémée.',
        context: [
          {
            kind: 'fait',
            text: 'Hipparque avait déjà l’excentrique et l’épicycle pour la Lune et le Soleil ; c’est pour les anomalies de direction des cinq planètes — stations et rétrogradations — que Ptolémée doit inventer un troisième centre.',
            sources: ['neugebauer-hama', 'evans-astronomy'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Les modèles de Maragha puis ceux de Copernic se construisent en grande partie pour éliminer l’équant tout en gardant les mêmes prédictions : le problème de la régularité apparente structure l’astronomie jusqu’à Kepler, qui le supprime en changeant de courbe.',
            sources: ['kennedy-planetary', 'kuhn-copernican'],
          },
        ],
      },
      {
        id: 'modeles-d-al-shatir',
        title: 'Les modèles d’Ibn al-Shātir : la Lune et les planètes sans excentriques',
        year: 1350,
        yearApprox: true,
        authorName: 'Ibn al-Shātir',
        mathematicianId: 'al-shatir',
        theoryId: 'am-ecole-de-maragha',
        kind: 'concept',
        statement: 'En combinant déférents et épicycles secondaires — dont le « couple » de Ṭūsī, qui produit un va-et-vient rectiligne à partir de deux cercles — Ibn al-Shātir reproduit les longitudes et les anomalies de la Lune, de Mercure et des planètes sans excentriques ni équants ; sa Lune ne change plus de diamètre apparent comme chez Ptolémée.',
        comment: 'Le Zīj al-jadīd (vers 1350) est le sommet de la révision de Maragha : prédictions comparables ou meilleures que celles de l’Almageste, obtenues avec des mécanismes physiquement cohérents — très proches, à quelques détails près, de ceux du De revolutionibus.',
        context: [
          {
            kind: 'fait',
            text: 'Ibn al-Haytham avait posé l’exigence dans les Doutes sur Ptolémée : un modèle vrai doit être physiquement réalisable ; Ṭūsī avait répondu par son « couple », al-ʿUrḍī et al-Shīrāzī avaient prolongé, Ibn al-Shātir achève.',
            sources: ['kennedy-planetary', 'grant-planets'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Kennedy (1966) a montré que les modèles lunaire et mercurien de Copernic reproduisent presque point pour point les constructions d’Ibn al-Shātir.',
            sources: ['kennedy-planetary'],
          },
          {
            kind: 'interpretation',
            text: 'Une transmission de ces modèles de Damas vers les cercles humanistes — manuscrits byzantins apportés en Italie — a été conjecturée ; aucun document ne l’atteste, et la parenté des constructions reste une énigme historique.',
            sources: ['kennedy-planetary', 'westman-copernican'],
          },
        ],
      },
      {
        id: 'de-revolutionibus-copernic',
        title: 'De revolutionibus orbium coelestium',
        year: 1543,
        authorName: 'Nicolas Copernic',
        theoryId: 'am-restauration-europeenne',
        kind: 'texte',
        comment: 'En six livres dédiés au pape Paul III, Copernic fait du Soleil le centre approximatif du monde : la Terre tourne sur elle-même en un jour, autour du Soleil en un an, et les stations des planètes deviennent des effets de perspective. La préface d’Osiander, insérée sans l’accord de l’auteur, présente le tout comme une pure hypothèse de calcul.',
        context: [
          {
            kind: 'fait',
            text: 'Vers 1510-1514, le Commentariolus circulait déjà en manuscrit : sept postulats, le Soleil immobile au centre, la Terre mobile — Copernic promettait surtout des modèles conformes au principe du mouvement circulaire uniforme.',
            sources: ['kuhn-copernican', 'westman-copernican'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La première génération de lecteurs — Wittenberg, Reinhold, Dee, Magini — lit le livre surtout comme une source de modèles et de paramètres nouveaux : les Tables pruténiques (1551) en diffusent les résultats sans prendre parti.',
            sources: ['westman-copernican', 'kuhn-copernican'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Kuhn, la révolution est d’abord une exigence d’harmonie ; elle ne devient physique qu’avec Kepler, qui prend au sérieux le centre du monde et fait du Soleil le moteur des orbites.',
            sources: ['kuhn-copernican', 'voelkel-astronomia'],
          },
        ],
      },
      {
        id: 'comete-de-1577-brahe',
        title: 'La comète de 1577 : parallaxe nulle, sphères brisées',
        altTitle: 'De mundi aetherei recentioribus phaenomenis',
        year: 1588,
        authorName: 'Tycho Brahe',
        mathematicianId: 'brahe',
        theoryId: 'am-mesure-et-lois-de-kepler',
        kind: 'theoreme',
        statement: 'Observée depuis Hven et depuis d’autres points de l’Europe, la comète de novembre 1577 présente une parallaxe diurne plus faible que celle de la Lune : elle se meut donc au-delà de la sphère lunaire, en plein espace interplanétaire que les orbes « solides » étaient censés remplir.',
        comment: 'Le livre de 1588 fait de cette mesure un argument physique : si la comète traverse la région des planètes, les sphères cristallines de la cosmologie aristotélicienne ne peuvent être matérielles — conclusion que Tycho assume en laissant les planètes nager dans un ciel fluide.',
        context: [
          {
            kind: 'fait',
            text: 'Aristote avait relégué les comètes dans le monde sublunaire, au motif de leur apparition imprévisible ; toute la cosmologie des orbes en dépendait, et la mesure précise de la parallaxe était le seul moyen d’en sortir.',
            sources: ['thoren-brahe', 'evans-astronomy'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Tycho en conclut que le ciel est fluide et publie dans le même livre son système géo-héliocentrique — la Terre au centre, Soleil et Lune autour d’elle, les cinq planètes autour du Soleil.',
            sources: ['thoren-brahe'],
          },
          {
            kind: 'interpretation',
            text: 'Pour les historiens, la comète de 1577 est un point de rupture : la démonstration par la mesure fait passer le débat cosmologique du terrain des opinions à celui des données — Mästlin et d’autres astronomes aboutissent à la même conclusion.',
            sources: ['dreyer-astronomy', 'evans-astronomy'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Si l’astre était sous la Lune, deux observateurs éloignés l’auraient vu projeté contre des étoiles différentes ; or les comptes rendus venus de toute l’Europe concordent avec les positions mesurées à Hven.',
            sources: ['thoren-brahe', 'dreyer-astronomy'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Tycho mesure avec ses instruments l’altitude et la position de la comète soir après soir, du 13 novembre 1577 jusqu’à sa disparition fin janvier.',
            sources: ['thoren-brahe'],
          },
          {
            kind: 'fait',
            text: 'Il compare sa série à celles rapportées depuis d’autres lieux d’Europe : l’astre se déplace presque à l’identique — sa parallaxe diurne est inférieure à celle de la Lune.',
            sources: ['thoren-brahe', 'dreyer-astronomy'],
          },
          {
            kind: 'fait',
            text: 'Une parallaxe plus faible que la parallaxe lunaire exclut un phénomène sublunaire : la comète se déplace dans la région interplanétaire, que Tycho situe au-delà de l’orbite de Vénus.',
            sources: ['thoren-brahe', 'evans-astronomy'],
          },
          {
            kind: 'fait',
            text: 'Or cette trajectoire coupe l’espace des sphères de Mercure, de Vénus et du Soleil : si des orbes solides existaient, la comète devrait les traverser — les sphères célestes ne peuvent donc être matérielles.',
            sources: ['thoren-brahe', 'dreyer-astronomy'],
          },
        ],
      },
      {
        id: 'systeme-geo-heliocentrique-tycho',
        title: 'Le système géo-héliocentrique de Tycho',
        year: 1588,
        authorName: 'Tycho Brahe',
        mathematicianId: 'brahe',
        theoryId: 'am-restauration-europeenne',
        kind: 'concept',
        statement: 'La Terre immobile reste au centre du monde, Soleil et Lune tournent autour d’elle, et les cinq planètes tournent autour du Soleil — une géométrie équivalente, pour les positions, à celle de Copernic, sans mouvement de la Terre ni parallaxe stellaire à expliquer.',
        comment: 'Le compromis conserve les avantages coperniciens — les stations des planètes expliquées par la perspective des révolutions annuelles — sans en payer le prix : pas de Terre en mouvement, pas d’abîme entre Saturne et les fixes.',
        context: [
          {
            kind: 'fait',
            text: 'Tycho refuse le mouvement de la Terre pour des raisons physiques — un corps aussi lourd ne peut se mouvoir sans effet sensible — et astronomiques : ses meilleures mesures ne montraient aucune parallaxe stellaire, ce qui, dans le système de Copernic, aurait exigé un vide immense entre Saturne et les fixes.',
            sources: ['thoren-brahe', 'westman-copernican'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Le système devient la principale alternative au copernicanisme au XVIIᵉ siècle : Longomontanus le défend, les jésuites l’examinent, et Riccioli en fait dans l’Almagestum novum (1651) le candidat le plus sérieux face à Copernic.',
            sources: ['westman-copernican', 'grant-planets'],
          },
        ],
      },
      {
        id: 'mysterium-cosmographicum',
        title: 'Mysterium cosmographicum',
        year: 1596,
        authorName: 'Johannes Kepler',
        mathematicianId: 'kepler',
        theoryId: 'am-mesure-et-lois-de-kepler',
        kind: 'texte',
        comment: 'Le premier livre de Kepler explique le nombre et l’espacement des orbites coperniciennes par les cinq solides platoniciens emboîtés entre les sphères des planètes : le système de Copernic aurait ainsi sa raison géométrique — et c’est pour vérifier ces proportions que Kepler cherchera les données de Tycho.',
        context: [
          {
            kind: 'fait',
            text: 'Formé par Mästlin à Tübingen, Kepler est copernicien par conviction : s’il y a un centre au monde, c’est le Soleil — d’où viennent la lumière et, pressent-il, la force qui anime les orbites.',
            sources: ['caspar-kepler', 'kuhn-copernican'],
          },
        ],
        impact: [
          {
            kind: 'interpretation',
            text: 'L’édifice des solides s’effritera dans l’Epitome, mais l’intuition physique — le Soleil agit sur les planètes à travers le plan de leur orbite — survit : c’est elle qui oriente Kepler vers les « causes » de l’Astronomia nova.',
            sources: ['voelkel-astronomia', 'kuhn-copernican'],
          },
        ],
      },
      {
        id: 'astronomia-nova-kepler',
        title: 'Astronomia nova : l’ellipse et la loi des aires',
        altTitle: 'Astronomia nova aitiologetos',
        year: 1609,
        authorName: 'Johannes Kepler',
        mathematicianId: 'kepler',
        theoryId: 'am-mesure-et-lois-de-kepler',
        kind: 'texte',
        major: true,
        comment: 'Sous-titrée « astronomie nouvelle fondée sur les causes, ou physique céleste », l’Astronomia nova raconte la « guerre » contre Mars : après des dizaines d’hypothèses, l’orbite s’ajuste en ellipse — le Soleil à un foyer — et le rayon vecteur balaie des aires égales en temps égaux ; ce sont les deux premières lois planétaires.',
        context: [
          {
            kind: 'fait',
            text: 'Héritier des données martiennes de Tycho — une précision de l’ordre de la minute d’arc — Kepler abandonne son « hypothèse vicaire », un excentrique à bisection, quand l’orbite écarte le cercle de huit minutes : « ces huit minutes ont ouvert la voie à la réforme de toute l’astronomie ».',
            sources: ['voelkel-astronomia', 'caspar-kepler'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Les Tables rudolphines (1627), calculées sur l’ellipse et à l’aide des logarithmes, l’emportent en précision d’environ un ordre de grandeur sur les tables pruténiques ; la loi des aires y est mise en œuvre systématiquement.',
            sources: ['voelkel-astronomia', 'kuhn-copernican'],
          },
          {
            kind: 'interpretation',
            text: 'Newton montrera dans les Principia (livre I) que force centrale en 1/r², ellipse et loi des aires s’impliquent mutuellement : l’astronomie de Kepler devient alors la pierre de touche de la gravitation universelle.',
            sources: ['kuhn-copernican', 'dijksterhuis'],
          },
        ],
      },
      {
        id: 'harmonices-mundi',
        title: 'Harmonices mundi : la loi des périodes',
        altTitle: 'Harmonices mundi libri V',
        year: 1619,
        authorName: 'Johannes Kepler',
        mathematicianId: 'kepler',
        theoryId: 'am-mesure-et-lois-de-kepler',
        kind: 'texte',
        comment: 'Au livre V des Harmonices, Kepler énonce que les cubes des distances moyennes au Soleil sont entre eux comme les carrés des périodes de révolution — la troisième loi, qui relie en une seule relation tout le système et clôt quatorze siècles de géométrie des mouvements circulaires.',
        context: [
          {
            kind: 'fait',
            text: 'Kepler cherche depuis le Mysterium la raison harmonique de l’espacement des orbites ; la loi n’apparaît qu’au livre V, après les chapitres sur la musique des sphères — il la note le 15 mai 1618 puis la vérifie planète par planète.',
            sources: ['caspar-kepler', 'kuhn-copernican'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'C’est la relation dont Newton se sert pour comparer l’accélération de la Lune à celle des corps qui tombent : si les cubes des distances vont comme les carrés des périodes, la force de rappel décroît en 1/r².',
            sources: ['kuhn-copernican', 'dijksterhuis'],
          },
        ],
      },
    ],
    sources: ['neugebauer-hama', 'evans-astronomy', 'toomer-almagest', 'kennedy-planetary', 'grant-planets', 'kuhn-copernican', 'westman-copernican', 'thoren-brahe', 'voelkel-astronomia', 'caspar-kepler', 'dreyer-astronomy'],
  },
  // ───────────────────────────────────────────────────────────────────────────
  // De l’impetus à Galilée
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'mecanique-impetus-et-galilee',
    name: 'De l’impetus à Galilée',
    mapName: 'Impetus et Galilée',
    altNames: ['Mécanique scolastique et galiléenne', 'Calculatores, impetus et Discours'],
    era: 'renaissance',
    period: { start: 1340, end: 1644, approx: true },
    continents: ['physique'],
    places: ['Oxford', 'Paris', 'Salamanque', 'Leyde', 'Padoue', 'Florence'],
    map: { x: 2350, y: 5150, size: 2, palette: { fill: '#c6eceb', stroke: '#266462', accent: '#26827f' } },
    tagline: 'Des sophismata d’Oxford au baromètre de Torricelli : la chute des corps devient une science du nombre et de la mesure.',
    summary:
      'Entre les calculatores d’Oxford et les disciples de Galilée s’accomplit la plus profonde transformation de la physique : le mouvement cesse d’être un état qualifié pour devenir une grandeur mesurée. Bradwardine refond les rapports de force, Buridan explique le projectile par l’impetus, Oresme dessine les vitesses en aires ; Stevin et Galilée achèvent la statique du plan incliné et la loi des chutes, et Torricelli fait du vide un instrument de laboratoire.',
    methods: [
      {
        kind: 'fait',
        text: 'La méthode des rapports : Bradwardine (1328) veut qu’à toute proportion géométrique entre force et résistance corresponde une proportion arithmétique des vitesses — la « fonction » du mouvement s’écrit en rapports composés, selon la logique d’Euclide et de Campanus.',
        sources: ['clagett-mechanics', 'grant-sourcebook'],
      },
      {
        kind: 'fait',
        text: 'La mesure des intensités : les Calculatores définissent mouvements uniforme, uniformément difforme et difforme, puis démontrent que la distance d’un mouvement uniformément accéléré égale celle d’un mouvement uniforme à la vitesse du milieu du temps — Oresme le figure en aires, latitude contre longitude.',
        sources: ['clagett-mechanics', 'clagett-oresme'],
      },
      {
        kind: 'fait',
        text: 'La balance démonstrative : Jordanus puis Stevin déduisent les conditions d’équilibre du plan incliné et de la poulie en supposant qu’aucun poids ne monte plus haut que ce que la descente de l’autre permet — ancêtre du principe des travaux virtuels.',
        sources: ['moody-clagett-ponderibus', 'dijksterhuis'],
      },
      {
        kind: 'fait',
        text: 'L’expérimentation mesurée : Galilée règle des plans inclinés — rainure polie, pendules, horloge à eau — et compare les espaces aux carrés des temps ; Riccioli laisse choir des boules de la tour des Asinelli en dénombrant les temps au pendule.',
        sources: ['drake-galileo', 'dijksterhuis'],
      },
      {
        kind: 'interpretation',
        text: 'Pour Koyré, la révolution de Galilée n’est pas « plus d’expérience » mais un autre rapport à l’expérience : la loi mathématique idéale — la chute dans le vide — prime les corps réels que l’expérience ne fait qu’approcher, renversant la physique du sens commun.',
        sources: ['koyre-galilee', 'dijksterhuis'],
      },
    ],
    context: [
      {
        kind: 'fait',
        text: 'Les commentaires d’Aristote (Physique, Du ciel) sont le terrain commun : Questions de Buridan et d’Oresme, sophismata d’Oxford, cours de Salamanque — tout s’écrit à l’intérieur de l’école, même les thèses qui la ruineront.',
        sources: ['clagett-mechanics', 'grant-sourcebook'],
      },
      {
        kind: 'fait',
        text: 'La querelle des poids traverse les siècles : les traités de ponderibus attribués à Jordanus sont commentés au XVIᵉ siècle, imprimés par Tartaglia (1565), refondus par Guidobaldo del Monte (1577) et repris par Stevin (1586).',
        sources: ['moody-clagett-ponderibus', 'clagett-mechanics'],
      },
      {
        kind: 'fait',
        text: 'L’imprimerie des sciences : les œuvres d’Archimède paraissent en latin chez Tartaglia (1543) puis Commandino (1558) ; le Liber mechanicorum de Guidobaldo (1577) et les Beghinselen de Stevin (1586) recréent la statique sur le modèle grec.',
        sources: ['dijksterhuis', 'clagett-mechanics'],
      },
      {
        kind: 'fait',
        text: 'Sous la pression des articles condamnés à Paris en 1277, les commentateurs discutent le vide, le mouvement du monde et les poids comme autant d’« impossibles » que Dieu pourrait pourtant réaliser — un espace conceptuel où s’insinuent impetus et vitesse instantanée.',
        sources: ['duhem-systeme', 'grant-sourcebook'],
      },
    ],
    debates: [
      {
        kind: 'fait',
        text: 'La continuité médiévale-galiléenne est le grand procès de l’historiographie : Duhem voyait en Galilée l’héritier de Buridan ; Clagett et Koyré ont montré les dettes réelles — règle de la vitesse moyenne, langage des latitudes — tout en maintenant la rupture : les scolastiques calculaient des intensités, Galilée écrit une loi de la nature mesurable.',
        sources: ['clagett-mechanics', 'koyre-galilee'],
      },
      {
        kind: 'fait',
        text: 'La « tour de Pise » vient de la biographie de Vincenzo Viviani (1654) : les manuscrits de Galilée attestent bien des expériences de chute à Padoue, mais la démonstration publique du haut du campanile n’a pas de source contemporaine.',
        sources: ['drake-galileo', 'dijksterhuis'],
      },
      {
        kind: 'fait',
        text: 'Domingo de Soto applique à la chute libre le vocabulaire des Calculatores dans l’édition de 1555-1556 de ses Questions — « uniformiter difformis », le même théorème — sans que la filiation exacte jusqu’à Galilée soit établie.',
        sources: ['wallace-domingo', 'clagett-mechanics'],
      },
      {
        kind: 'interpretation',
        text: 'Le vide lui-même change de statut : impossible pour Aristote, pensable pour les scolastiques, il devient chez Torricelli un fait de laboratoire dont on calcule la pression — l’« océan d’air » qu’il décrit en 1644.',
        sources: ['grant-much-ado', 'dijksterhuis'],
      },
    ],
    keyDates: [
      { year: 1328, text: 'Tractatus de proportionibus de Thomas Bradwardine : la vitesse suit la « proportion des proportions ».' },
      { year: 1340, text: 'Le Liber calculationum de Richard Swineshead démontre la règle de la vitesse moyenne (vers).' },
      { year: 1350, text: 'Nicole Oresme compose le De configurationibus qualitatum et motuum : les vitesses en aires (vers).' },
      { year: 1494, text: 'Naissance de Domingo de Soto ; les commentateurs de Salamanque prolongent la cinématique scolastique.' },
      { year: 1555, text: 'Les Questions de de Soto appliquent l’« uniformiter difformis » à la chute libre (édition de 1555-1556).' },
      { year: 1577, text: 'Liber mechanicorum de Guidobaldo del Monte : la statique archimédienne reconstituée.' },
      { year: 1586, text: 'Beghinselen der Weeghconst et des Waterwichts de Simon Stevin : le plan incliné par le clootcrans, l’hydrostatique.' },
      { year: 1604, text: 'Galilée annonce à Paolo Sarpi la loi des carrés des temps pour la chute (lettre d’octobre).' },
      { year: 1618, text: 'Isaac Beeckman et René Descartes se rencontrent à Breda : le Journaal de Beeckman porte déjà inertie et corpuscules.' },
      { year: 1631, text: 'Pierre Gassendi observe à Marseille le premier transit de Mercure, prédit par les Tables rudolphines.' },
      { year: 1638, text: 'Discours et démonstrations mathématiques de Galilée imprimés à Leyde : la chute et le projectile en parabole.' },
      { year: 1644, text: 'Lettres de Torricelli à Michelangelo Ricci : le baromètre à mercure et « l’océan d’air ».' },
    ],
    theories: [
      {
        id: 'mg-calcul-des-proportions',
        name: 'Les calculatores : rapports, latitudes, configurations',
        period: { start: 1320, end: 1400, approx: true },
        summary: 'De Bradwardine aux Calculationes d’Oxford et aux traités parisiens d’Oresme : le mouvement devient une grandeur comme les autres — latitude des vitesses, longitude du temps — que l’on additionne, divise et figure en diagrammes.',
        traits: ['Fonction de Bradwardine', 'Sophismata et règles de Merton', 'Latitude et longitude des qualités', 'Diagrammes d’Oresme'],
      },
      {
        id: 'mg-impetus-et-mouvement',
        name: 'L’impetus et le mouvement des graves',
        period: { start: 1340, end: 1600, approx: true },
        summary: 'La force incorporée de Buridan explique le projectile, l’accélération des graves et la persistance des orbes ; Albert de Saxe, Marsile d’Inghen et les commentateurs de Salamanque prolongent la tradition jusqu’au seuil galiléen.',
        traits: ['Force incorporée du projectile', 'Chute accélérée', 'Orbes sans anges', 'Commentaires de Salamanque'],
      },
      {
        id: 'mg-statique-et-hydrostatique',
        name: 'Statique et hydrostatique des poids',
        period: { start: 1240, end: 1600, approx: true },
        summary: 'De la scientia de ponderibus de Jordanus aux Beghinselen de Stevin, en passant par les éditions d’Archimède et le Liber mechanicorum : les conditions d’équilibre — plan incliné, poulie, clootcrans — se démontrent sans mouvement perpétuel.',
        traits: ['Scientia de ponderibus', 'Éditions d’Archimède', 'Plan incliné et clootcrans', 'Poids de l’eau'],
      },
      {
        id: 'mg-mouvement-et-vide',
        name: 'La nouvelle mécanique : mesure, projectile, vide',
        period: { start: 1590, end: 1650, approx: true },
        summary: 'Galilée, Beeckman, Gassendi, Riccioli, Torricelli : la loi de la chute vérifiée au pendule, le projectile en parabole, les corpuscules et l’inertie, le vide en éprouvette — la mécanique troque les qualités pour les grandeurs mesurées.',
        traits: ['Loi de la chute', 'Projectile en parabole', 'Corpuscules et inertie', 'Baromètre et pression'],
      },
    ],
    mathematicians: [
      {
        id: 'richard-swineshead',
        name: 'Richard Swineshead',
        years: [1320, 1360],
        yearsApprox: true,
        origin: 'Oxford (Merton College)',
        bio: 'Membre de Merton College vers 1340-1355, Richard Swineshead — le « Calculator » — compose le Liber calculationum, somme des méthodes mertoniennes : mesure des intensités, règles des mouvements uniformes et difformes, démonstration de la vitesse moyenne. Ses dates de vie sont inconnues ; son livre, imprimé dès 1477, fait école jusqu’à la Renaissance.',
        theoryId: 'mg-calcul-des-proportions',
        sources: ['clagett-mechanics', 'grant-sourcebook'],
      },
      {
        id: 'domingo-de-soto',
        name: 'Domingo de Soto',
        years: [1494, 1560],
        origin: 'Ségovie et Salamanque',
        bio: 'Dominicain formé à Alcalá et à Paris, professeur à Salamanque puis confesseur de Charles Quint et délégué au concile de Trente, Domingo de Soto applique dans ses Questions sur la Physique (édition de 1555-1556) à la chute des corps le langage des Calculatores : la chute libre y est décrite comme un mouvement « uniformiter difformis » — uniformément accéléré.',
        theoryId: 'mg-impetus-et-mouvement',
        sources: ['wallace-domingo', 'clagett-mechanics'],
      },
      {
        id: 'beeckman',
        name: 'Isaac Beeckman',
        years: [1588, 1637],
        origin: 'Middelbourg, Breda et Dordrecht',
        bio: 'Chandelier de formation, recteur à Dordrecht, Isaac Beeckman tient un Journaal où il ébauche une mécanique corpusculaire : la matière est faite de particules, le mouvement acquis se conserve tant que rien ne le corrompt. À sa rencontre de Breda (novembre 1618), il passe à Descartes l’idée d’une physique des particules en mouvement — et le principe d’inertie.',
        theoryId: 'mg-mouvement-et-vide',
        sources: ['sep', 'dijksterhuis'],
      },
      {
        id: 'riccioli',
        name: 'Giovanni Battista Riccioli',
        years: [1598, 1671],
        origin: 'Ferrare, Parme et Bologne',
        bio: 'Jésuite de Bologne, Riccioli mène avec Grimaldi et ses confrères les plus systématiques des expériences de chute de l’époque — boules lâchées de la tour des Asinelli, comptées au pendule — et publie l’Almagestum novum (1651), somme astronomique où la lune reçoit ses noms modernes et où le système de Tycho tient lieu de compromis.',
        theoryId: 'mg-mouvement-et-vide',
        mactutor: 'Riccioli',
        sources: ['mactutor'],
      },
      {
        id: 'gassendi',
        name: 'Pierre Gassendi',
        years: [1592, 1655],
        origin: 'Champtercier, Aix et Paris',
        bio: 'Prêtre provençal, professeur au Collège royal, Gassendi observe à Marseille le premier transit de Mercure (7 novembre 1631) prédit par les Tables rudolphines, écrit une Institutio astronomica (1647) et restaure Épicure : les atomes et le vide qu’il décrit font le pendant mécanique du système copernicien. Correspondant de Galilée, il objecte aux Méditations de Descartes dans les Cinquièmes objections (1641).',
        theoryId: 'mg-mouvement-et-vide',
        mactutor: 'Gassendi',
        sources: ['mactutor', 'sep'],
      },
    ],
    relatedMathematicianIds: ['archimede', 'jordanus-de-nemore', 'bradwardine', 'jean-buridan', 'oresme', 'stevin', 'descartes', 'mersenne', 'cavalieri', 'huygens'],
    results: [
      {
        id: 'fonction-de-bradwardine',
        title: 'La fonction de Bradwardine : vitesse et rapports composés',
        year: 1328,
        authorName: 'Thomas Bradwardine',
        mathematicianId: 'bradwardine',
        theoryId: 'mg-calcul-des-proportions',
        kind: 'concept',
        statement: 'La vitesse d’un mouvement croît lorsque croît le rapport de la force motrice à la résistance, et cette croissance suit la « proportion des proportions » : doubler géométriquement F/R double arithmétiquement la vitesse — que l’on traduira v ∝ log(F/R).',
        comment: 'Le Tractatus de proportionibus (1328) fonde la dynamique scolastique : là où Aristote suggérait v ∝ F/R — d’où v > 0 dès que F et R sont comparables — Bradwardine exige que seul l’excès géométrique du rapport produise le mouvement, le repos étant garanti à l’équilibre.',
        context: [
          {
            kind: 'fait',
            text: 'La règle suggérée par la Physique d’Aristote donnait une vitesse dès que la force dépassait la résistance, mais laissait un cas embarrassant à l’égalité : les commentateurs cherchaient une loi où le repos à l’équilibre soit garanti.',
            sources: ['clagett-mechanics', 'grant-sourcebook'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La « fonction » de Bradwardine s’impose dans les universités anglaise puis française ; Oresme la discute encore un siècle plus tard, et c’est sur cette tradition que s’écrira la première critique quantitative de la résistance du milieu.',
            sources: ['clagett-mechanics', 'clagett-oresme'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Ramsée du problème : la règle v ∝ F/R donne une vitesse même quand la force égale la résistance ; il faut une loi où le rapport des rapports — non la simple différence — pilote la vitesse.',
            sources: ['clagett-mechanics'],
          },
        ],
      },
      {
        id: 'impetus-de-buridan',
        title: 'L’impetus : la cause du mouvement est dans le mobile',
        year: 1340,
        yearApprox: true,
        authorName: 'Jean Buridan',
        mathematicianId: 'jean-buridan',
        theoryId: 'mg-impetus-et-mouvement',
        kind: 'concept',
        statement: 'Le projectile continue parce que le moteur imprime en lui un impetus — une force incorporée proportionnelle à la vitesse et à la quantité de matière — que la résistance de l’air et la gravité corrompent : ni l’air qui pousse par-derrière, ni des anges pour les cieux ne sont requis.',
        comment: 'Dans les Questions sur la Physique, Buridan renverse l’explication aristotélicienne : ce n’est pas le milieu qui pousse le projectile, c’est le mobile qui porte en lui la cause de son mouvement — l’impetus explique l’accélération des graves autant que la persistance des orbes.',
        context: [
          {
            kind: 'fait',
            text: 'Aristote faisait de l’air le moteur du projectile, qui viendrait le pousser par-derrière une fois la main levée — explication que Jean Philopon avait déjà critiquée à Alexandrie et que les commentateurs arabes avaient prolongée.',
            sources: ['clagett-mechanics', 'grant-sourcebook'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'L’impetus se diffuse dans les universités — Albert de Saxe, Marsile d’Inghen — et prépare le terrain où Galilée parlera de mouvement horizontal indifférent, puis Descartes de conservation du mouvement.',
            sources: ['clagett-mechanics', 'dijksterhuis'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Duhem, l’impetus était déjà l’inertie ; Koyré et Clagett montrent qu’il reste une force interne qui se corrompt — ancêtre de la quantité de mouvement plus que l’inertie newtonienne.',
            sources: ['koyre-galilee', 'clagett-mechanics'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Une fois la pierre lancée, la main ne la touche plus : si elle vole encore, la cause du mouvement est en elle — c’est ce quelque chose d’« imprimé » que Buridan nomme impetus.',
            sources: ['clagett-mechanics'],
          },
        ],
      },
      {
        id: 'theoreme-de-la-vitesse-moyenne',
        title: 'Le théorème de la vitesse moyenne',
        year: 1340,
        yearApprox: true,
        authorName: 'Richard Swineshead',
        mathematicianId: 'richard-swineshead',
        theoryId: 'mg-calcul-des-proportions',
        kind: 'theoreme',
        statement: 'Un mobile uniformément accéléré parcourt, en un temps donné, la même distance qu’un mobile uniforme à la vitesse instantanée qu’il atteint au milieu du temps — la distance croît donc comme le carré du temps.',
        comment: 'Énoncé par William Heytesbury dans les Règles pour résoudre les sophismes, démontré dans le Liber calculationum de Swineshead et les sommes de John Dumbleton, le théorème reçoit chez Oresme sa forme géométrique : le triangle de l’accélération égale le rectangle de la vitesse moyenne.',
        context: [
          {
            kind: 'fait',
            text: 'La question venait des sophismata — « quam cito », « uniformiter difformis » — où les regentes d’Oxford et de Paris mesuraient l’intensité d’une qualité, sa latitude, par son étendue, sa longitude.',
            sources: ['clagett-mechanics', 'grant-sourcebook'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Galilée donne au même théorème sa forme mécanique — loi des temps et des espaces dans la chute, troisième journée du Discours — et Riccioli le vérifie boule à la main depuis la tour des Asinelli.',
            sources: ['clagett-mechanics', 'drake-galileo'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Clagett, c’est le premier lien entre les mathématiques de l’intensité et la cinématique ; pour Koyré, la continuité s’arrête au seuil de la mesure : les scolastiques ne pensaient pas qu’une vraie pierre suivît ces règles.',
            sources: ['clagett-mechanics', 'koyre-galilee'],
          },
        ],
        intuition: [
          {
            kind: 'fait',
            text: 'Dans le diagramme d’Oresme, le temps porte horizontalement, la vitesse verticalement : l’accélération uniforme dessine un triangle rectangle dont l’aire — la distance — égale celle du rectangle à hauteur moyenne.',
            sources: ['clagett-oresme', 'clagett-mechanics'],
          },
        ],
        proof: [
          {
            kind: 'fait',
            text: 'Soit un mobile dont la vitesse croît uniformément de zéro à une vitesse donnée en un temps T : son diagramme vitesse-temps est un triangle rectangle.',
            sources: ['clagett-mechanics', 'clagett-oresme'],
          },
          {
            kind: 'fait',
            text: 'À chaque instant, l’excès de vitesse au-dessus de la moyenne compense exactement le défaut symétrique de l’autre moitié du temps : la partie du triangle située au-dessus de la moyenne égalise celle située en dessous.',
            sources: ['clagett-mechanics'],
          },
          {
            kind: 'fait',
            text: 'Le triangle a donc même aire que le rectangle de même base et de hauteur égale à la vitesse du milieu du temps.',
            sources: ['clagett-mechanics', 'clagett-oresme'],
          },
          {
            kind: 'fait',
            text: 'L’aire du diagramme représente la distance parcourue : le mouvement uniformément accéléré parcourt donc autant qu’un mouvement uniforme à la vitesse moyenne.',
            sources: ['clagett-oresme', 'clagett-mechanics'],
          },
          {
            kind: 'fait',
            text: 'Comme la vitesse du milieu croît proportionnellement au temps total, la distance croît comme son carré : c’est la loi des carrés des temps.',
            sources: ['clagett-mechanics', 'drake-galileo'],
          },
        ],
      },
      {
        id: 'uniformiter-difformis-de-soto',
        title: 'La chute libre est « uniformiter difformis »',
        year: 1555,
        yearApprox: true,
        authorName: 'Domingo de Soto',
        mathematicianId: 'domingo-de-soto',
        theoryId: 'mg-impetus-et-mouvement',
        kind: 'concept',
        statement: 'Dans l’édition de 1555-1556 de ses Questions sur la Physique, Domingo de Soto applique aux corps qui tombent le vocabulaire des Calculatores : la chute libre est un mouvement uniformément accéléré, dont la vitesse croît proportionnellement au temps.',
        comment: 'Le dominicain de Salamanque n’invente pas le théorème — il lui donne un corps physique : ce que Merton et Oresme calculaient comme intensités devient la description de la chute réelle, un demi-siècle avant les manuscrits de Galilée.',
        context: [
          {
            kind: 'fait',
            text: 'Wallace a montré (1968) que le passage explicite figure dans l’édition de 1555-1556 des Quaestiones : la chute des graves y est dite « uniformiter difformis », terme technique de la cinématique d’Oxford et de Paris.',
            sources: ['wallace-domingo'],
          },
        ],
        impact: [
          {
            kind: 'interpretation',
            text: 'Le passage établit la continuité continentale de la cinématique médiévale jusqu’au seuil de Galilée : pour Wallace, de Soto en est un maillon direct ; pour les tenants de la rupture, il répète un sophisma sans instrument de mesure.',
            sources: ['wallace-domingo', 'koyre-galilee'],
          },
        ],
      },
      {
        id: 'clootcrans-de-stevin',
        title: 'Le clootcrans : le plan incliné par la chaîne de boules',
        year: 1586,
        authorName: 'Simon Stevin',
        mathematicianId: 'stevin',
        theoryId: 'mg-statique-et-hydrostatique',
        kind: 'concept',
        statement: 'Une chaîne fermée de boules posée sur deux plans inclinés ne bouge pas : si le côté le plus long l’emportait, la chaîne tournerait sans fin — donc les poids qui s’équilibrent sont en raison inverse des longueurs des pentes.',
        comment: 'Le raisonnement du clootcrans (« couronne de boules »), exposé dans les Beghinselen der Weeghconst (1586), fait de l’impossibilité du mouvement perpétuel le fondement de la statique ; Stevin en déduit le parallélogramme des forces et traite l’hydrostatique dans les Beghinselen des Waterwichts.',
        context: [
          {
            kind: 'fait',
            text: 'L’édition latine d’Archimède par Tartaglia (1543) puis Commandino (1558) et le Liber mechanicorum de Guidobaldo del Monte (1577) avaient recréé la statique grecque ; Stevin y joint la pratique ingénieure des Pays-Bas — digues, pompes, fortifications.',
            sources: ['dijksterhuis', 'clagett-mechanics'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Le clootcrans devient l’icône de la statique : gravé sur l’ex-libris de Stevin, il illustre l’idée que l’équilibre se déduit de l’impossibilité du mouvement perpétuel — principe que Lagrange formalisera en travaux virtuels.',
            sources: ['dijksterhuis'],
          },
        ],
      },
      {
        id: 'loi-de-la-chute-galilee',
        title: 'La loi de la chute : distances en nombres impairs',
        altTitle: 'Discorsi e dimostrazioni matematiche, troisième journée',
        year: 1638,
        authorName: 'Galileo Galilei',
        theoryId: 'mg-mouvement-et-vide',
        kind: 'texte',
        major: true,
        comment: 'Publiés à Leyde en 1638, les Discours et démonstrations mathématiques consacrent leurs troisième et quatrième journées au mouvement : chute uniformément accélérée — espaces en nombres impairs successifs et carrés des temps — puis trajectoire du projectile, composée d’un mouvement uniforme et d’une chute, en parabole.',
        context: [
          {
            kind: 'fait',
            text: 'Dès octobre 1604, Galilée annonce à Paolo Sarpi la loi des carrés des temps pour la chute ; les manuscrits de Padoue montrent plans inclinés, pendules et horloges à eau — et d’abord son erreur de dérivation, reconstituée par Drake.',
            sources: ['drake-galileo', 'dijksterhuis'],
          },
          {
            kind: 'fait',
            text: 'Les jésuites mesurent la chute : Riccioli, depuis la tour des Asinelli à Bologne, vérifie par dénombrement au pendule les proportions du Discours dans l’Almagestum novum (1651).',
            sources: ['drake-galileo', 'dijksterhuis'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'La loi de la chute devient le modèle de la physique mathématique : Torricelli l’étend aux fluides, Huygens au pendule, Newton à la Lune — la « mesure » du Discours est le pont entre le ciel de Kepler et la mécanique des Principia.',
            sources: ['dijksterhuis', 'koyre-galilee'],
          },
          {
            kind: 'interpretation',
            text: 'Pour Koyré, le Discours ne « lit » pas la nature mais la construit : Galilée énonce les conditions idéales — vide, absence de résistance — que l’expérience réelle ne fait qu’approcher ; la loi mathématique est première.',
            sources: ['koyre-galilee'],
          },
        ],
      },
      {
        id: 'mecanique-corpusculaire-beeckman',
        title: 'Corpuscules et conservation du mouvement',
        year: 1618,
        yearApprox: true,
        authorName: 'Isaac Beeckman',
        mathematicianId: 'beeckman',
        theoryId: 'mg-mouvement-et-vide',
        kind: 'concept',
        statement: 'Tout corps en mouvement persévère dans son mouvement tant que rien ne le corrompt ; la matière est faite de particules dont la physique — chocs, cohésion, pression — se réduit à la mécanique.',
        comment: 'Le Journaal de Beeckman ébauche dès 1613-1618 une mécanique corpusculaire complète : inertie avant Descartes, atomes avant Gassendi — mais restée manuscrite, elle n’agit sur l’histoire que par la rencontre de Breda (1618) et les lectures de Mersenne.',
        context: [
          {
            kind: 'fait',
            text: 'Recteur à Dordrecht, Beeckman tient un cahier de recherche — le Journaal — où figurent dès 1613 la conservation du mouvement et les corpuscules ; à Breda, en novembre 1618, il initie le jeune Descartes à cette « physico-mathématique ».',
            sources: ['sep', 'dijksterhuis'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'Par Descartes (Principes, 1644) puis Mersenne, les idées du Journaal entrent dans la mécanique du XVIIᵉ siècle : la conservation du mouvement et la physique des corpuscules deviennent le programme commun.',
            sources: ['sep', 'dijksterhuis'],
          },
        ],
      },
      {
        id: 'barometre-et-vide-torricelli',
        title: 'Le baromètre : « nous vivons au fond d’un océan d’air »',
        year: 1644,
        authorName: 'Evangelista Torricelli',
        theoryId: 'mg-mouvement-et-vide',
        kind: 'concept',
        major: true,
        statement: 'Un tube d’un mètre, rempli de mercure et renversé sur une cuvette, garde une colonne d’environ 76 cm au-dessus d’un espace vide : c’est le poids de l’air qui soutient le mercure, et non l’horreur du vide.',
        comment: 'En juin 1644, Torricelli décrit à Michelangelo Ricci l’expérience menée avec Vincenzo Viviani : l’espace au sommet du tube est bien vide, la colonne s’équilibre avec la pression de l’air — le vide « impensable » d’Aristote devient un fait mesurable et un instrument nouveau.',
        context: [
          {
            kind: 'fait',
            text: 'Les fontainiers savaient que l’eau ne montait pas au-delà d’environ dix mètres dans les pompes aspirantes ; Galilée attribuait la limite à une « résistance du vide » mesurée comme une force — Torricelli réinterprète le phénomène par le poids de l’air.',
            sources: ['grant-much-ado', 'dijksterhuis'],
          },
        ],
        impact: [
          {
            kind: 'fait',
            text: 'L’expérience se répète et se précise : la colonne varie avec le temps et l’altitude (expérience du Puy-de-Dôme, 1648), le « vide de Torricelli » devient un espace de laboratoire, et la notion de pression entre dans la physique.',
            sources: ['grant-much-ado', 'dijksterhuis'],
          },
          {
            kind: 'interpretation',
            text: 'Pour l’historiographie du vide, c’est le point où la question quitte la métaphysique : l’horreur scolastique du vide est remplacée par une grandeur — le poids de l’atmosphère — mesurable et variable.',
            sources: ['grant-much-ado'],
          },
        ],
      },
    ],
    sources: ['clagett-mechanics', 'moody-clagett-ponderibus', 'wallace-domingo', 'koyre-galilee', 'drake-galileo', 'dijksterhuis', 'grant-much-ado', 'clagett-oresme', 'grant-sourcebook', 'sep'],
  },
];

/** Liens entre domaines, déclarés dans le fichier de leur domaine d'arrivée. */
export const LINKS_PHYSIQUE_A: Link[] = [
  // — Cible : optique-antique-et-medievale —
  {
    source: 'geometrie-grecque',
    target: 'optique-antique-et-medievale',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'Les Éléments de l’œil',
    note: 'L’Optique attribuée à Euclide applique le style déductif des Éléments à la vision : postulats sur les rayons, puis propositions sur les tailles apparentes — l’optique naît comme un Euclide appliqué.',
    sources: ['smith-ptolemy-optics', 'heath-greek'],
    principal: true,
  },
  {
    source: 'mathematiques-hellenistiques',
    target: 'optique-antique-et-medievale',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'Miroirs et tables de réfraction',
    note: 'Héron démontre l’égalité des angles de réflexion par le plus court chemin, et le livre V de l’Optique de Ptolémée livre les premières tables quantitatives de la physique.',
    sources: ['smith-ptolemy-optics'],
  },
  {
    source: 'geometrie-arabe',
    target: 'optique-antique-et-medievale',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'Le De aspectibus des Latins',
    note: 'Traduit en latin vers la fin du XIIᵉ siècle, le Kitāb al-Manāẓir d’Ibn al-Haytham — qui vit dans le domaine de la géométrie arabe — devient le De aspectibus que reprennent Grosseteste, Peckham et Witelo.',
    sources: ['sabra-optics', 'lindberg-optics'],
  },
  {
    source: 'occident-latin-medieval',
    target: 'optique-antique-et-medievale',
    kind: 'influence',
    epistemic: 'interpretation',
    label: 'La philosophie naturelle scolastique',
    note: 'C’est dans les studia et les couvents de Paris et d’Oxford — mêmes hommes, mêmes institutions que la science latine médiévale — que l’optique devient une discipline enseignée.',
    sources: ['lindberg-optics', 'crombie-grosseteste'],
  },
  // — Cible : astronomie-mathematique —
  {
    source: 'mathematiques-hellenistiques',
    target: 'astronomie-mathematique',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'L’Almageste en héritage',
    note: 'La table des cordes, les modèles d’Hipparque et la science d’Alexandrie sont les fondations que l’Almageste consolide : le domaine naît le jour où Ptolémée en fait la somme.',
    sources: ['neugebauer-hama', 'evans-astronomy'],
    principal: true,
  },
  {
    source: 'calcul-des-scribes',
    target: 'astronomie-mathematique',
    kind: 'influence',
    epistemic: 'fait',
    label: 'Périodes et paramètres de Babylone',
    note: 'Saros, valeurs de l’année et du mois : les paramètres babyloniens parviennent à l’Almageste par Hipparque — l’astronomie mathématique a des racines mésopotamiennes.',
    sources: ['neugebauer-exact', 'evans-astronomy'],
  },
  {
    source: 'geometrie-arabe',
    target: 'astronomie-mathematique',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'Les révisions de Maragha',
    note: 'Traduction, commentaire puis correction : Ṭūsī et Ibn al-Shātir reconstruisent les modèles planétaires dans la lignée directe de l’Almageste traduit en arabe.',
    sources: ['kennedy-planetary'],
  },
  {
    source: 'perspective-et-cartographie',
    target: 'astronomie-mathematique',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'De Vienne à Frombork',
    note: 'Peurbach et Regiomontanus restaurent le texte et les méthodes de l’Almageste ; c’est dans leur Epitome que Copernic apprend l’astronomie mathématique qu’il reforme.',
    sources: ['westman-copernican', 'kuhn-copernican'],
  },
  // — Cible : mecanique-impetus-et-galilee —
  {
    source: 'occident-latin-medieval',
    target: 'mecanique-impetus-et-galilee',
    kind: 'filiation',
    epistemic: 'fait',
    label: 'L’école de Paris et les calculatores',
    note: 'De Jordanus aux Calculatores d’Oxford puis à Buridan et Oresme, les concepts de la science latine médiévale — proportions, impetus, configurations — nourrissent directement la nouvelle mécanique.',
    sources: ['clagett-mechanics'],
    principal: true,
  },
  {
    source: 'logique-scolastique',
    target: 'mecanique-impetus-et-galilee',
    kind: 'influence',
    epistemic: 'fait',
    label: 'Sophismata et mesures',
    note: 'L’analyse logique des termes — « uniformiter difformis », « quam cito » — et les sophismata d’Oxford et de Paris fournissent les instruments de la cinématique médiévale.',
    sources: ['clagett-mechanics', 'kretzmann-cambridge-history'],
  },
  {
    source: 'mathematiques-hellenistiques',
    target: 'mecanique-impetus-et-galilee',
    kind: 'influence',
    epistemic: 'fait',
    label: 'Archimède réédité',
    note: 'Les traités de statique et d’hydrostatique d’Archimède, édités par Tartaglia (1543) et Commandino (1558), donnent à Stevin et à Galilée le modèle d’une physique démonstrée.',
    sources: ['dijksterhuis', 'clagett-mechanics'],
  },
  {
    source: 'astronomie-mathematique',
    target: 'mecanique-impetus-et-galilee',
    kind: 'influence',
    epistemic: 'interpretation',
    label: 'Du ciel à la chute',
    note: 'Les lois de Kepler posent le problème dynamique — pourquoi l’ellipse, pourquoi les aires — que la mécanique de Galilée puis celle de Newton devront expliquer.',
    sources: ['koyre-galilee', 'dijksterhuis'],
  },
];

/** Liens entre figures (filiation, influence, collaboration, affinité, rupture). */
export const MATHEMATICIAN_LINKS_PHYSIQUE_A: MathematicianLink[] = [
  // — Cibles dans optique-antique-et-medievale —
  { source: 'ibn-al-haytham', target: 'peckham', kind: 'influence', note: 'La Perspectiva communis condense le De aspectibus latin d’Ibn al-Haytham, lu à Paris et à Oxford.', epistemic: 'fait' },
  { source: 'ibn-al-haytham', target: 'witelo', kind: 'influence', note: 'La Perspectiva de Witelo reprend livre à livre le plan, les propositions et les figures de l’Optique d’Ibn al-Haytham.', epistemic: 'fait' },
  { source: 'witelo', target: 'dietrich-de-freiberg', kind: 'influence', note: 'Thierry de Freiberg travaille dans la tradition perspectiviste, dont la Perspectiva de Witelo est le manuel.', epistemic: 'fait' },
  // — Cibles dans astronomie-mathematique —
  { source: 'nasir-al-din-al-tusi', target: 'al-shatir', kind: 'influence', note: 'Ibn al-Shātir emploie le « couple » de Ṭūsī et prolonge la révision des modèles planétaires ouverte à Maragha.', epistemic: 'fait' },
  { source: 'ptolemee', target: 'al-shatir', kind: 'influence', note: 'Le Zīj al-jadīd reconstruit les modèles de l’Almageste en en supprimant excentriques et équants.', epistemic: 'fait' },
  { source: 'brahe', target: 'kepler', kind: 'filiation', note: 'À Prague, Kepler hérite des données d’observation de Tycho — surtout celles de Mars — dont il tire l’ellipse et la loi des aires.', epistemic: 'fait' },
  // — Cibles dans mecanique-impetus-et-galilee —
  { source: 'bradwardine', target: 'richard-swineshead', kind: 'filiation', note: 'Swineshead poursuit à Merton le programme de calcul des rapports et des intensités inauguré par Bradwardine.', epistemic: 'fait' },
  { source: 'jean-buridan', target: 'domingo-de-soto', kind: 'influence', note: 'La question du mouvement uniformément accéléré passe de l’école de Paris à Salamanque par les commentateurs d’Aristote ; de Soto en fait l’état de la chute libre.', epistemic: 'interpretation' },
  { source: 'stevin', target: 'beeckman', kind: 'influence', note: 'Beeckman lit Stevin — statique pratique, ingénierie des eaux — et partage son mécanisme particulaire.', epistemic: 'interpretation' },
  { source: 'mersenne', target: 'gassendi', kind: 'collaboration', note: 'Amis et membres du cercle des Minimes, Mersenne et Gassendi correspondent constamment ; Mersenne fait paraître les objections de Gassendi à Descartes.', epistemic: 'fait' },
];
