import {Evaluation} from "@/types/Evaluation";

export interface CriteresDetails {
  name: string;
  description?: string;
  points: number;
  bareme: {};
}

export interface AuteurDetails {
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
  evaluations?: number[];
  evaluationsDetails?: Evaluation[];
  auteur: number;
  auteurDetails?: AuteurDetails;
  type: number;
}
