import fs from "fs";
import path from "path";
import type { Pays, Indicateur, Valeur } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function getPays(): Pays[] {
  return readJSON<Pays[]>("pays.json");
}

export function getIndicateurs(): Indicateur[] {
  return readJSON<Indicateur[]>("indicateurs.json");
}

export function getValeurs(): Valeur[] {
  return readJSON<Valeur[]>("valeurs.json");
}

export function getValeursParIndicateur(code: string): Valeur[] {
  return readJSON<Valeur[]>(`valeurs_par_indicateur/${code}.json`);
}

export const client = {
  async getPays(): Promise<Pays[]> {
    const res = await fetch("/data/pays.json");
    if (!res.ok) throw new Error(`Erreur chargement pays: ${res.status}`);
    return res.json();
  },
  async getIndicateurs(): Promise<Indicateur[]> {
    const res = await fetch("/data/indicateurs.json");
    if (!res.ok) throw new Error(`Erreur chargement indicateurs: ${res.status}`);
    return res.json();
  },
  async getValeurs(): Promise<Valeur[]> {
    const res = await fetch("/data/valeurs.json");
    if (!res.ok) throw new Error(`Erreur chargement valeurs: ${res.status}`);
    return res.json();
  },
};

export function getPaletteCouleurs(): Record<string, string> {
  return {
    CIV: "#1f77b4",
    SEN: "#ff7f0e",
    GHA: "#2ca02c",
    NGA: "#d62728",
    MLI: "#9467bd",
    BFA: "#8c564b",
    BEN: "#e377c2",
    TGO: "#7f7f7f",
    KEN: "#bcbd22",
    ZAF: "#17becf",
    ETH: "#aec7e8",
    TZA: "#ffbb78",
    COD: "#98df8a",
    CMR: "#ff9896",
    AGO: "#c5b0d5",
  };
}
