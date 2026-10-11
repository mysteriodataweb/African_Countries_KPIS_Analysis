import type { Valeur } from "./types";

const LIBELLES_UNITES: Record<string, string> = {
  USD: "US$",
  pourcentage: "%",
  pour_1000: "‰",
  personnes: "hab.",
};

export function libelleUnite(unit: string): string {
  return LIBELLES_UNITES[unit] ?? unit;
}

const formatStandard = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

/**
 * Formate un nombre en français : « 2 902,8 Md », « 45,3 M », « 12,5 ».
 * (La notation compacte d'Intl affiche « Bn » pour 10^12, peu lisible.)
 */
export function formatNombre(valeur: number): string {
  const abs = Math.abs(valeur);
  if (abs >= 1e9) return `${formatStandard.format(valeur / 1e9)} Md`;
  if (abs >= 1e6) return `${formatStandard.format(valeur / 1e6)} M`;
  return formatStandard.format(valeur);
}

export function formatValeur(valeur: number | null | undefined, unit: string): string {
  if (valeur === null || valeur === undefined || Number.isNaN(valeur)) {
    return "Donnée non disponible";
  }
  return `${formatNombre(valeur)} ${libelleUnite(unit)}`;
}

// Palette catégorielle (Tableau 10) : couleurs stables attribuées par position.
const PALETTE = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
];

export function couleurSerie(index: number): string {
  return PALETTE[index % PALETTE.length];
}

/** Indicateurs pour lesquels un total continental a du sens (sinon : moyenne simple). */
const INDICATEURS_ADDITIFS = new Set(["SP.POP.TOTL", "NY.GDP.MKTP.CD"]);

export interface SyntheseIndicateur {
  valeur: number;
  annee: number;
  nbPays: number;
  agregation: "total" | "moyenne";
}

/**
 * Résume un indicateur pour l'ensemble des pays sur la dernière année
 * suffisamment renseignée (au moins la moitié de la couverture maximale),
 * pour éviter d'afficher une « moyenne » calculée sur un ou deux pays.
 */
export function syntheseIndicateur(
  code: string,
  valeurs: Valeur[]
): SyntheseIndicateur | null {
  const parAnnee = new Map<number, number[]>();
  for (const v of valeurs) {
    if (v.indicateur_code !== code || v.is_missing || v.valeur === null) continue;
    const liste = parAnnee.get(v.annee) ?? [];
    liste.push(v.valeur);
    parAnnee.set(v.annee, liste);
  }
  if (parAnnee.size === 0) return null;

  const couvertureMax = Math.max(...Array.from(parAnnee.values(), (l) => l.length));
  const annee = Math.max(
    ...Array.from(parAnnee.entries())
      .filter(([, l]) => l.length >= couvertureMax / 2)
      .map(([a]) => a)
  );
  const liste = parAnnee.get(annee)!;
  const somme = liste.reduce((s, v) => s + v, 0);
  const additif = INDICATEURS_ADDITIFS.has(code);

  return {
    valeur: additif ? somme : somme / liste.length,
    annee,
    nbPays: liste.length,
    agregation: additif ? "total" : "moyenne",
  };
}
