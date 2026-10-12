// Lecture des données au moment du build (Server Components uniquement).
// Les composants client doivent utiliser lib/client.ts.
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

/** Documentation méthodologique (source unique : docs/methodologie.md à la racine du dépôt). */
export function getMethodologie(): string {
  return fs.readFileSync(
    path.join(process.cwd(), "..", "docs", "methodologie.md"),
    "utf-8"
  );
}
