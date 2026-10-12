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
  { id: 'toomer-almagest', type: 'primaire', author: 'Claude Ptolémée', title: 'Ptolemy’s Almagest', year: 1984, publisher: 'Duckworth', note: 'Traduction anglaise et notes de G. J. Toomer ; rééd. Springer, 1998.' },
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
    map: { x: 1300, y: 4750, size: 2, palette: { fill: '#ffffff', stroke: '#000000', accent: '#000000' } },
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
];

/** Liens entre figures (filiation, influence, collaboration, affinité, rupture). */
export const MATHEMATICIAN_LINKS_PHYSIQUE_A: MathematicianLink[] = [
  // — Cibles dans optique-antique-et-medievale —
  { source: 'ibn-al-haytham', target: 'peckham', kind: 'influence', note: 'La Perspectiva communis condense le De aspectibus latin d’Ibn al-Haytham, lu à Paris et à Oxford.', epistemic: 'fait' },
  { source: 'ibn-al-haytham', target: 'witelo', kind: 'influence', note: 'La Perspectiva de Witelo reprend livre à livre le plan, les propositions et les figures de l’Optique d’Ibn al-Haytham.', epistemic: 'fait' },
  { source: 'witelo', target: 'dietrich-de-freiberg', kind: 'influence', note: 'Thierry de Freiberg travaille dans la tradition perspectiviste, dont la Perspectiva de Witelo est le manuel.', epistemic: 'fait' },
];
