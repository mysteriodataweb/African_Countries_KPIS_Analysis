// Libellés français et sous-régions géographiques (classification M49 des Nations unies).
// La Banque mondiale ne fournit que des noms anglais et des « admin regions » peu parlantes.

export const SOUS_REGIONS = [
  "Afrique du Nord",
  "Afrique de l'Ouest",
  "Afrique centrale",
  "Afrique de l'Est",
  "Afrique australe",
] as const;

export type SousRegion = (typeof SOUS_REGIONS)[number];

const INFOS_PAYS: Record<string, { nom: string; sousRegion: SousRegion }> = {
  DZA: { nom: "Algérie", sousRegion: "Afrique du Nord" },
  EGY: { nom: "Égypte", sousRegion: "Afrique du Nord" },
  LBY: { nom: "Libye", sousRegion: "Afrique du Nord" },
  MAR: { nom: "Maroc", sousRegion: "Afrique du Nord" },
  SDN: { nom: "Soudan", sousRegion: "Afrique du Nord" },
  TUN: { nom: "Tunisie", sousRegion: "Afrique du Nord" },

  BEN: { nom: "Bénin", sousRegion: "Afrique de l'Ouest" },
  BFA: { nom: "Burkina Faso", sousRegion: "Afrique de l'Ouest" },
  CPV: { nom: "Cap-Vert", sousRegion: "Afrique de l'Ouest" },
  CIV: { nom: "Côte d'Ivoire", sousRegion: "Afrique de l'Ouest" },
  GMB: { nom: "Gambie", sousRegion: "Afrique de l'Ouest" },
  GHA: { nom: "Ghana", sousRegion: "Afrique de l'Ouest" },
  GIN: { nom: "Guinée", sousRegion: "Afrique de l'Ouest" },
  GNB: { nom: "Guinée-Bissau", sousRegion: "Afrique de l'Ouest" },
  LBR: { nom: "Liberia", sousRegion: "Afrique de l'Ouest" },
  MLI: { nom: "Mali", sousRegion: "Afrique de l'Ouest" },
  MRT: { nom: "Mauritanie", sousRegion: "Afrique de l'Ouest" },
  NER: { nom: "Niger", sousRegion: "Afrique de l'Ouest" },
  NGA: { nom: "Nigeria", sousRegion: "Afrique de l'Ouest" },
  SEN: { nom: "Sénégal", sousRegion: "Afrique de l'Ouest" },
  SLE: { nom: "Sierra Leone", sousRegion: "Afrique de l'Ouest" },
  TGO: { nom: "Togo", sousRegion: "Afrique de l'Ouest" },

  AGO: { nom: "Angola", sousRegion: "Afrique centrale" },
  CMR: { nom: "Cameroun", sousRegion: "Afrique centrale" },
  CAF: { nom: "République centrafricaine", sousRegion: "Afrique centrale" },
  TCD: { nom: "Tchad", sousRegion: "Afrique centrale" },
  COG: { nom: "Congo", sousRegion: "Afrique centrale" },
  COD: { nom: "RD Congo", sousRegion: "Afrique centrale" },
  GNQ: { nom: "Guinée équatoriale", sousRegion: "Afrique centrale" },
  GAB: { nom: "Gabon", sousRegion: "Afrique centrale" },
  STP: { nom: "Sao Tomé-et-Principe", sousRegion: "Afrique centrale" },

  BDI: { nom: "Burundi", sousRegion: "Afrique de l'Est" },
  COM: { nom: "Comores", sousRegion: "Afrique de l'Est" },
  DJI: { nom: "Djibouti", sousRegion: "Afrique de l'Est" },
  ERI: { nom: "Érythrée", sousRegion: "Afrique de l'Est" },
  ETH: { nom: "Éthiopie", sousRegion: "Afrique de l'Est" },
  KEN: { nom: "Kenya", sousRegion: "Afrique de l'Est" },
  MDG: { nom: "Madagascar", sousRegion: "Afrique de l'Est" },
  MWI: { nom: "Malawi", sousRegion: "Afrique de l'Est" },
  MUS: { nom: "Maurice", sousRegion: "Afrique de l'Est" },
  MOZ: { nom: "Mozambique", sousRegion: "Afrique de l'Est" },
  RWA: { nom: "Rwanda", sousRegion: "Afrique de l'Est" },
  SYC: { nom: "Seychelles", sousRegion: "Afrique de l'Est" },
  SOM: { nom: "Somalie", sousRegion: "Afrique de l'Est" },
  SSD: { nom: "Soudan du Sud", sousRegion: "Afrique de l'Est" },
  TZA: { nom: "Tanzanie", sousRegion: "Afrique de l'Est" },
  UGA: { nom: "Ouganda", sousRegion: "Afrique de l'Est" },
  ZMB: { nom: "Zambie", sousRegion: "Afrique de l'Est" },
  ZWE: { nom: "Zimbabwe", sousRegion: "Afrique de l'Est" },

  BWA: { nom: "Botswana", sousRegion: "Afrique australe" },
  SWZ: { nom: "Eswatini", sousRegion: "Afrique australe" },
  LSO: { nom: "Lesotho", sousRegion: "Afrique australe" },
  NAM: { nom: "Namibie", sousRegion: "Afrique australe" },
  ZAF: { nom: "Afrique du Sud", sousRegion: "Afrique australe" },
};

export function nomPays(code: string, nomParDefaut?: string | null): string {
  return INFOS_PAYS[code]?.nom ?? nomParDefaut ?? code;
}

export function sousRegionPays(code: string): SousRegion | "Autre" {
  return INFOS_PAYS[code]?.sousRegion ?? "Autre";
}
