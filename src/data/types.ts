/**
 * Schéma de données de l'Atlas des mathématiques.
 *
 * Quatre niveaux de lecture sur la carte :
 *  - domaine       : le territoire (une tradition, une école ou une branche à une époque donnée) ;
 *  - théorie       : un sous-domaine, une méthode ou un programme à l'intérieur du territoire ;
 *  - mathématicien : une figure représentative ;
 *  - résultat      : un théorème, une conjecture, un concept, une méthode, un texte ou un problème.
 *
 * Principe éditorial : chaque énoncé historique est typé.
 *  - `fait`           : événement datable et documenté (publication, démonstration, fondation,
 *                       correspondance), ou contenu mathématique vérifiable (énoncé, méthode).
 *  - `interpretation` : lecture historiographique, attribution d'influence, jugement sur la
 *                       portée d'un résultat — signée par une tradition et discutable.
 *
 * Les années sont des entiers ; les années négatives désignent les dates avant notre ère
 * (−300 = 300 av. J.-C.). L'année 0 n'existe pas.
 */

export type Epistemic = 'fait' | 'interpretation';

export interface Statement {
  kind: Epistemic;
  text: string;
  /** Identifiants de sources (registre `sources.ts`). */
  sources?: string[];
}

export type EraId =
  | 'antiquite'
  | 'medieval'
  | 'renaissance'
  | 'lumieres'
  | 'dixneuvieme'
  | 'structures'
  | 'contemporain';

export interface Era {
  id: EraId;
  name: string;
  /** Libellé court pour la gouttière des ères (par défaut : name). */
  shortName?: string;
  period: Period;
  tagline: string;
}

/**
 * Les cinq « continents » de la carte (axe vertical) : grands champs des mathématiques.
 * Un domaine appartient à un continent principal mais peut en toucher plusieurs.
 */
export type ContinentId = 'nombres' | 'formes' | 'analyse' | 'hasard' | 'fondements';

export interface Continent {
  id: ContinentId;
  name: string;
  /** Libellé court pour les marges de la carte (par défaut : name). */
  shortName?: string;
  /** Centre de la bande horizontale indicative sur la carte (unités carte). */
  laneY: number;
  /** Bornes verticales de la bande (unités carte) ; les bandes sont contiguës. */
  y0: number;
  y1: number;
}

export interface Period {
  start: number;
  /** `null` = toujours actif. */
  end: number | null;
  /** Bornes conventionnelles, discutées par les historiens. */
  approx?: boolean;
}

/** `primaire` : texte mathématique d'époque (Éléments, Disquisitiones…) ; les autres types sont des études. */
export type SourceType = 'livre' | 'article' | 'primaire' | 'web' | 'archive';

export interface Source {
  id: string;
  type: SourceType;
  author: string;
  title: string;
  year?: number;
  publisher?: string;
  url?: string;
  /** Précision : édition consultée, chapitre pertinent, etc. */
  note?: string;
}

export type LinkKind = 'filiation' | 'influence' | 'affinite' | 'reaction';

export interface Link {
  /** Identifiant du domaine d'origine (antérieur ou contemporain). */
  source: string;
  /** Identifiant du domaine d'arrivée. */
  target: string;
  /**
   * filiation : continuité directe (mêmes personnes, textes transmis, écoles, traductions)
   * influence : outils, concepts ou problèmes repris à distance, documentés ou lus par les historiens
   * affinite  : parenté structurelle reconnue après coup, sans transmission démontrée (toujours interprétative)
   * reaction  : rupture ou opposition explicite (querelle de rigueur, de fondements, de méthode)
   */
  kind: LinkKind;
  epistemic: Epistemic;
  /** Formule courte affichée sur la carte / dans le panneau. */
  label: string;
  /** Explication en une ou deux phrases. */
  note: string;
  sources?: string[];
}

export interface Theory {
  id: string;
  name: string;
  period?: Period;
  summary: string;
  /** Objets, méthodes et questions caractéristiques, en quelques mots chacun. */
  traits: string[];
}

export interface Mathematician {
  id: string;
  name: string;
  /** [naissance, décès | null si vivant·e]. Années négatives avant notre ère. */
  years: [number, number | null];
  /** Dates de vie incertaines (Antiquité, Moyen Âge) : affichées avec « ca. ». */
  yearsApprox?: boolean;
  /** Lieu, culture ou pays d'activité : « Alexandrie », « Bagdad », « Göttingen », « France ». */
  origin: string;
  /** Deux ou trois phrases : rôle dans le domaine, singularité. */
  bio: string;
  /** Théorie principale, si pertinent. */
  theoryId?: string;
}

export type ResultKind = 'theoreme' | 'conjecture' | 'concept' | 'methode' | 'texte' | 'probleme';

export interface Result {
  id: string;
  title: string;
  /** Titre original, nom alternatif ou titre latin. */
  altTitle?: string;
  /** Année de publication, de démonstration ou de formulation (négative avant notre ère). */
  year: number;
  /** Année conventionnelle ou estimée. */
  yearApprox?: boolean;
  /** Nom affiché de l'auteur ou des auteurs (« Euclide », « Hadamard et de la Vallée Poussin »). */
  authorName: string;
  /** Référence vers `Mathematician.id` si la figure est dans l'atlas. */
  mathematicianId?: string;
  theoryId?: string;
  kind: ResultKind;
  /** Énoncé ou contenu en langage courant, une ou deux phrases, sans formalisme lourd. */
  statement?: string;
  /** Pourquoi ce résultat compte : place dans le domaine, ce qu'il rend possible, ce qu'il ferme. */
  comment: string;
}

/** Lien entre deux mathématicien·nes : filiation (maître/élève), influence, collaboration, affinité ou rupture. */
export interface MathematicianLink {
  /** Mathematician.id source. */
  source: string;
  /** Mathematician.id cible. */
  target: string;
  kind: LinkKind | 'collaboration';
  /** Une ligne : la nature précise du lien (thèse dirigée, correspondance, querelle, séminaire…). */
  note: string;
  epistemic?: Epistemic;
}

export interface MapPlacement {
  /** Coordonnées cibles en unités carte (voir MAP_SIZE). L'axe x suit les bandes d'ères (ERA_BANDS), l'axe y les continents (CONTINENTS.laneY). */
  x: number;
  y: number;
  /** Importance historique → rayon du territoire. */
  size: 1 | 2 | 3;
  palette: {
    /** Teinte principale du territoire (utilisée en aplat translucide). */
    fill: string;
    /** Contour et libellés. */
    stroke: string;
    /** Accent : titres, surlignage, marqueurs. */
    accent: string;
  };
}

export interface KeyDate {
  year: number;
  text: string;
}

export interface Domain {
  id: string;
  name: string;
  altNames?: string[];
  era: EraId;
  period: Period;
  /** Continent principal en premier. */
  continents: ContinentId[];
  /** Lieux ou aires d'activité : villes, cours, universités, pays. */
  places: string[];
  map: MapPlacement;
  /** Une ligne, ton évocateur. */
  tagline: string;
  /** Description accessible en trois ou quatre phrases. */
  summary: string;
  /** Objets, méthodes, styles de démonstration (faits et interprétations mêlés, typés). */
  methods: Statement[];
  /** Contexte historique, institutionnel, matériel (cours, académies, revues, instruments, guerres). */
  context: Statement[];
  /** Lectures historiographiques, controverses, questions de priorité ou de portée. */
  debates: Statement[];
  keyDates: KeyDate[];
  theories: Theory[];
  mathematicians: Mathematician[];
  /** Mathématicien·nes défini·es dans un autre domaine mais actif·ves ici. */
  relatedMathematicianIds?: string[];
  results: Result[];
  /** Sources principales (identifiants du registre). */
  sources: string[];
}

/** Nœud aplati pour la recherche et la navigation. */
export type NodeKind = 'domain' | 'theory' | 'mathematician' | 'result';

export interface AtlasNode {
  kind: NodeKind;
  id: string;
  label: string;
  sublabel?: string;
  domainId: string;
  theoryId?: string;
  mathematicianId?: string;
  /** Champs normalisés (sans accents, minuscules) pour la recherche. */
  searchText: string;
}
