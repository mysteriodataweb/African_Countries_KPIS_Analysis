export interface Pays {
  code_iso3: string;
  nom: string;
  region: string | null;
  sous_region: string | null;
  niveau_revenu: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Indicateur {
  code: string;
  name: string;
  category: string;
  unit: string;
}

export interface Valeur {
  pays_code: string;
  indicateur_code: string;
  annee: number;
  valeur: number | null;
  is_missing: boolean;
}

export interface IndicateurAvecValeurs extends Indicateur {
  valeurs: Valeur[];
}
