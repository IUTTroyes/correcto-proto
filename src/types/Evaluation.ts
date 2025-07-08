export interface MatiereDetails {
  name: string;
}

export interface GroupeDetails {
  semestre: string;
  type: string;
  name: string;
}

export interface Evaluation {
  name: string;
  matiereDetails?: MatiereDetails;
  groupeDetails: GroupeDetails;
  joursRestants?: number;
  status: number;
  date_fin?: string;
  date_debut?: string;
  id: string;
}
