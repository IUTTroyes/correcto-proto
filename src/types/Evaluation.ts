export interface MatiereDetails {
  name: string;
}

export interface GroupeDetails {
  semestre: string;
  type: string;
  name: string;
}

export interface GrillesEvaluationDetails {
  id: string;
  name: string;
  description?: string;
  total_points: number;
  date_creation: Date;
  date_modification: Date;
  criteres?: {
    name: string;
    description?: string;
    points: number;
    bareme: {};
  }[];
  auteur: number;
}

export interface Evaluation {
  id: string;
  name: string;
  matiereDetails?: MatiereDetails;
  groupeDetails: GroupeDetails;
  grilleDetails: GrillesEvaluationDetails[];
  actif: boolean;
  status: number;
  date_debut?: Date;
  date_fin?: Date;
  date_creation?: Date;
  date_modification?: Date;
  auteur: number;
  joursRestants?: number;
}
