export interface CriteresDetails {
  name: string;
  description?: string;
  points: number;
  bareme: {};
}

export interface EtudiantDetails {
  prenom: string;
  nom: string;
  email: string;
  id: string;
}

export interface EnseignantDetails {
  id: number;
  prenom: string;
  nom: string;
  mail: string;
}

export interface GrilleEvaluation {
  name: string;
  description?: string;
  total_points: number;
  date_creation: Date;
  date_modification: Date;
  criteres?: CriteresDetails[];
  auteur: number;
}
