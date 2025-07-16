export interface CriteresDetails {
  name: string;
  description?: string;
  coeff: number;
  bareme: {};
}

export interface EtudiantDetails {
  prenom: string;
  nom: string;
  email: string;
  id: string;
}

export interface EnseignantDetails {
  prenom: string;
  nom: string;
  email: string;
  id: string;
}

export interface GrilleEvaluation {
  name: string;
  description?: string;
  total_points: number;
  date_creation: string;
  date_modification: string;
  criteres?: CriteresDetails[];
  auteur?: EnseignantDetails[];
}
