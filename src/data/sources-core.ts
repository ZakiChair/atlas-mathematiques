import type { Source } from './types';

/**
 * Socle bibliographique : histoires générales, recueils de textes et grandes
 * monographies d'histoire des mathématiques. Les fichiers d'ère ajoutent leurs
 * sources spécialisées ; l'agrégat complet est dans sources.ts.
 */
export const CORE_SOURCES: Source[] = [
  // — Histoires générales —
  { id: 'boyer-merzbach', type: 'livre', author: 'Carl B. Boyer, Uta C. Merzbach', title: 'A History of Mathematics', year: 2011, publisher: 'Wiley', note: '3ᵉ édition (1ʳᵉ éd. 1968).' },
  { id: 'katz-history', type: 'livre', author: 'Victor J. Katz', title: 'A History of Mathematics: An Introduction', year: 2009, publisher: 'Addison-Wesley', note: '3ᵉ édition.' },
  { id: 'kline-thought', type: 'livre', author: 'Morris Kline', title: 'Mathematical Thought from Ancient to Modern Times', year: 1972, publisher: 'Oxford University Press', note: 'Trois volumes.' },
  { id: 'dahan-peiffer', type: 'livre', author: 'Amy Dahan-Dalmedico, Jeanne Peiffer', title: 'Une histoire des mathématiques : routes et dédales', year: 1986, publisher: 'Seuil, coll. « Points Sciences »' },
  { id: 'stillwell-history', type: 'livre', author: 'John Stillwell', title: 'Mathematics and Its History', year: 2010, publisher: 'Springer', note: '3ᵉ édition.' },
  { id: 'struik-concise', type: 'livre', author: 'Dirk J. Struik', title: 'A Concise History of Mathematics', year: 1987, publisher: 'Dover', note: '4ᵉ édition révisée.' },
  { id: 'dieudonne-abrege', type: 'livre', author: 'Jean Dieudonné (dir.)', title: 'Abrégé d’histoire des mathématiques 1700-1900', year: 1978, publisher: 'Hermann', note: 'Deux volumes.' },
  { id: 'bourbaki-elements-histoire', type: 'livre', author: 'Nicolas Bourbaki', title: 'Éléments d’histoire des mathématiques', year: 1960, publisher: 'Hermann', note: 'Rééd. Springer, 2007.' },
  { id: 'grattan-guinness-companion', type: 'livre', author: 'Ivor Grattan-Guinness (dir.)', title: 'Companion Encyclopedia of the History and Philosophy of the Mathematical Sciences', year: 1994, publisher: 'Routledge', note: 'Deux volumes.' },
  { id: 'gowers-companion', type: 'livre', author: 'Timothy Gowers, June Barrow-Green, Imre Leader (dir.)', title: 'The Princeton Companion to Mathematics', year: 2008, publisher: 'Princeton University Press' },
  { id: 'mactutor', type: 'web', author: 'John J. O’Connor, Edmund F. Robertson', title: 'MacTutor History of Mathematics Archive', publisher: 'University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/', note: 'Biographies et chronologies ; consulté en 2026.' },
  { id: 'sep', type: 'web', author: 'Edward N. Zalta, Uri Nodelman (dir.)', title: 'Stanford Encyclopedia of Philosophy', publisher: 'Stanford University', url: 'https://plato.stanford.edu/', note: 'Entrées de logique et de philosophie des mathématiques ; consulté en 2026.' },

  // — Recueils de textes —
  { id: 'fauvel-gray-reader', type: 'livre', author: 'John Fauvel, Jeremy Gray (dir.)', title: 'The History of Mathematics: A Reader', year: 1987, publisher: 'Macmillan / Open University' },
  { id: 'stedall-sourcebook', type: 'livre', author: 'Jacqueline Stedall', title: 'Mathematics Emerging: A Sourcebook 1540-1900', year: 2008, publisher: 'Oxford University Press' },
  { id: 'katz-sourcebook', type: 'livre', author: 'Victor J. Katz (dir.)', title: 'The Mathematics of Egypt, Mesopotamia, China, India, and Islam: A Sourcebook', year: 2007, publisher: 'Princeton University Press' },
  { id: 'ewald-kant-hilbert', type: 'livre', author: 'William Ewald (dir.)', title: 'From Kant to Hilbert: A Source Book in the Foundations of Mathematics', year: 1996, publisher: 'Oxford University Press', note: 'Deux volumes.' },
  { id: 'van-heijenoort', type: 'livre', author: 'Jean van Heijenoort (dir.)', title: 'From Frege to Gödel: A Source Book in Mathematical Logic, 1879-1931', year: 1967, publisher: 'Harvard University Press' },
  { id: 'hairer-wanner-analysis', type: 'livre', author: 'Ernst Hairer, Gerhard Wanner', title: 'Analysis by Its History', year: 1996, publisher: 'Springer' },

  // — Antiquité et mondes non européens —
  { id: 'heath-greek', type: 'livre', author: 'Thomas L. Heath', title: 'A History of Greek Mathematics', year: 1921, publisher: 'Clarendon Press', note: 'Deux volumes ; rééd. Dover 1981.' },
  { id: 'vitrac-euclide', type: 'primaire', author: 'Euclide', title: 'Les Éléments', year: 1990, publisher: 'PUF', note: 'Traduction et commentaires de Bernard Vitrac, 4 volumes (1990-2001).' },
  { id: 'netz-shaping', type: 'livre', author: 'Reviel Netz', title: 'The Shaping of Deduction in Greek Mathematics: A Study in Cognitive History', year: 1999, publisher: 'Cambridge University Press' },
  { id: 'cuomo-ancient', type: 'livre', author: 'Serafina Cuomo', title: 'Ancient Mathematics', year: 2001, publisher: 'Routledge' },
  { id: 'neugebauer-exact', type: 'livre', author: 'Otto Neugebauer', title: 'The Exact Sciences in Antiquity', year: 1957, publisher: 'Brown University Press', note: '2ᵉ édition ; rééd. Dover 1969.' },
  { id: 'robson-mesopotamia', type: 'livre', author: 'Eleanor Robson', title: 'Mathematics in Ancient Iraq: A Social History', year: 2008, publisher: 'Princeton University Press' },
  { id: 'plofker-india', type: 'livre', author: 'Kim Plofker', title: 'Mathematics in India', year: 2009, publisher: 'Princeton University Press' },
  { id: 'martzloff-chine', type: 'livre', author: 'Jean-Claude Martzloff', title: 'Histoire des mathématiques chinoises', year: 1988, publisher: 'Masson', note: 'Trad. angl. Springer, 1997.' },
  { id: 'rashed-sciences-arabes', type: 'livre', author: 'Roshdi Rashed (dir.)', title: 'Histoire des sciences arabes, t. 2 : Mathématiques et physique', year: 1997, publisher: 'Seuil' },
  { id: 'berggren-islam', type: 'livre', author: 'J. Lennart Berggren', title: 'Episodes in the Mathematics of Medieval Islam', year: 1986, publisher: 'Springer' },

  // — Époque moderne —
  { id: 'edwards-calculus', type: 'livre', author: 'C. H. Edwards Jr.', title: 'The Historical Development of the Calculus', year: 1979, publisher: 'Springer' },
  { id: 'guicciardini-newton', type: 'livre', author: 'Niccolò Guicciardini', title: 'Isaac Newton on Mathematical Certainty and Method', year: 2009, publisher: 'MIT Press' },
  { id: 'weil-number-theory', type: 'livre', author: 'André Weil', title: 'Number Theory: An Approach through History from Hammurapi to Legendre', year: 1984, publisher: 'Birkhäuser' },
  { id: 'hacking-emergence', type: 'livre', author: 'Ian Hacking', title: 'The Emergence of Probability', year: 1975, publisher: 'Cambridge University Press', note: '2ᵉ édition 2006 ; trad. fr. L’Émergence de la probabilité, Seuil, 2002.' },
  { id: 'stigler-statistics', type: 'livre', author: 'Stephen M. Stigler', title: 'The History of Statistics: The Measurement of Uncertainty before 1900', year: 1986, publisher: 'Harvard University Press' },

  // — XIXᵉ siècle —
  { id: 'bottazzini-higher-calculus', type: 'livre', author: 'Umberto Bottazzini', title: 'The Higher Calculus: A History of Real and Complex Analysis from Euler to Weierstrass', year: 1986, publisher: 'Springer' },
  { id: 'gray-worlds', type: 'livre', author: 'Jeremy Gray', title: 'Worlds Out of Nothing: A Course in the History of Geometry in the 19th Century', year: 2007, publisher: 'Springer', note: '2ᵉ édition 2011.' },
  { id: 'kleiner-abstract-algebra', type: 'livre', author: 'Israel Kleiner', title: 'A History of Abstract Algebra', year: 2007, publisher: 'Birkhäuser' },
  { id: 'goldstein-schappacher-schwermer', type: 'livre', author: 'Catherine Goldstein, Norbert Schappacher, Joachim Schwermer (dir.)', title: 'The Shaping of Arithmetic after C. F. Gauss’s Disquisitiones Arithmeticae', year: 2007, publisher: 'Springer' },
  { id: 'ferreiros-labyrinth', type: 'livre', author: 'José Ferreirós', title: 'Labyrinth of Thought: A History of Set Theory and Its Role in Modern Mathematics', year: 1999, publisher: 'Birkhäuser', note: '2ᵉ édition 2007.' },
  { id: 'gray-platos-ghost', type: 'livre', author: 'Jeremy Gray', title: 'Plato’s Ghost: The Modernist Transformation of Mathematics', year: 2008, publisher: 'Princeton University Press' },

  // — XXᵉ siècle —
  { id: 'corry-structures', type: 'livre', author: 'Leo Corry', title: 'Modern Algebra and the Rise of Mathematical Structures', year: 1996, publisher: 'Birkhäuser', note: '2ᵉ édition 2004.' },
  { id: 'gray-hilbert-challenge', type: 'livre', author: 'Jeremy Gray', title: 'The Hilbert Challenge', year: 2000, publisher: 'Oxford University Press' },
  { id: 'dieudonne-topology', type: 'livre', author: 'Jean Dieudonné', title: 'A History of Algebraic and Differential Topology 1900-1960', year: 1989, publisher: 'Birkhäuser' },
  { id: 'dieudonne-geometrie-algebrique', type: 'livre', author: 'Jean Dieudonné', title: 'Cours de géométrie algébrique, 1 : Aperçu historique sur le développement de la géométrie algébrique', year: 1974, publisher: 'PUF' },
  { id: 'von-plato-creating', type: 'livre', author: 'Jan von Plato', title: 'Creating Modern Probability: Its Mathematics, Physics and Philosophy in Historical Perspective', year: 1994, publisher: 'Cambridge University Press' },
  { id: 'davis-universal', type: 'livre', author: 'Martin Davis', title: 'The Universal Computer: The Road from Leibniz to Turing', year: 2000, publisher: 'W. W. Norton' },
  { id: 'mashaal-bourbaki', type: 'livre', author: 'Maurice Mashaal', title: 'Bourbaki : une société secrète de mathématiciens', year: 2002, publisher: 'Belin / Pour la Science' },
  { id: 'aubin-dahan-chaos', type: 'article', author: 'David Aubin, Amy Dahan Dalmedico', title: 'Writing the History of Dynamical Systems and Chaos: Longue Durée and Revolution, Disciplines and Cultures', year: 2002, publisher: 'Historia Mathematica, vol. 29, n° 3' },
  { id: 'wilson-four-colors', type: 'livre', author: 'Robin Wilson', title: 'Four Colors Suffice: How the Map Problem Was Solved', year: 2002, publisher: 'Princeton University Press' },
  { id: 'singh-fermat', type: 'livre', author: 'Simon Singh', title: 'Le Dernier Théorème de Fermat', year: 1998, publisher: 'JC Lattès', note: 'Éd. orig. Fermat’s Last Theorem, 1997.' },
  { id: 'jackson-grothendieck', type: 'article', author: 'Allyn Jackson', title: 'Comme appelé du néant — As If Summoned from the Void: The Life of Alexandre Grothendieck', year: 2004, publisher: 'Notices of the AMS, vol. 51, n° 9-10' },
  { id: 'fortnow-pnp', type: 'article', author: 'Lance Fortnow', title: 'The Status of the P versus NP Problem', year: 2009, publisher: 'Communications of the ACM, vol. 52, n° 9' },
  { id: 'kanamori-higher-infinite', type: 'livre', author: 'Akihiro Kanamori', title: 'The Higher Infinite: Large Cardinals in Set Theory from Their Beginnings', year: 1994, publisher: 'Springer', note: '2ᵉ édition 2003.' },
];
