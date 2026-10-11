// Chargement des données côté navigateur (fichiers statiques de public/data).
import type { Pays, Indicateur, Valeur } from "./types";

async function fetchJSON<T>(url: string, libelle: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur chargement ${libelle} : ${res.status}`);
  return res.json();
}

export const client = {
  getPays: () => fetchJSON<Pays[]>("/data/pays.json", "pays"),
  getIndicateurs: () => fetchJSON<Indicateur[]>("/data/indicateurs.json", "indicateurs"),
  getValeursParIndicateur: (code: string) =>
    fetchJSON<Valeur[]>(`/data/valeurs_par_indicateur/${code}.json`, code),
};
