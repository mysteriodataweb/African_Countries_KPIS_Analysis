"use client";

import { useState } from "react";
import type { Pays } from "@/lib/types";
import { SOUS_REGIONS, nomPays, sousRegionPays } from "@/lib/pays";

export const MAX_PAYS_SELECTIONNES = 8;

interface CountrySelectorProps {
  pays: Pays[];
  selection: string[];
  onSelectionChange: (codes: string[]) => void;
}

function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function CountrySelector({
  pays,
  selection,
  onSelectionChange,
}: CountrySelectorProps) {
  const [recherche, setRecherche] = useState("");
  const pleine = selection.length >= MAX_PAYS_SELECTIONNES;

  const terme = normaliser(recherche);
  const filtres = pays
    .filter(
      (p) =>
        normaliser(nomPays(p.code_iso3, p.nom)).includes(terme) ||
        normaliser(p.nom).includes(terme) ||
        p.code_iso3.toLowerCase().includes(terme)
    )
    .sort((a, b) =>
      nomPays(a.code_iso3, a.nom).localeCompare(nomPays(b.code_iso3, b.nom), "fr")
    );

  const toggle = (code: string) => {
    if (selection.includes(code)) {
      onSelectionChange(selection.filter((c) => c !== code));
    } else if (!pleine) {
      onSelectionChange([...selection, code]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-4">
      <div className="flex gap-2 mb-3">
        <input
          type="search"
          placeholder="Rechercher un pays..."
          aria-label="Rechercher un pays"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => onSelectionChange([])}
          disabled={selection.length === 0}
          className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          Tout désélectionner
        </button>
      </div>
      <div className="max-h-56 overflow-y-auto text-sm grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
        {[...SOUS_REGIONS, "Autre" as const].map((region) => {
          const paysRegion = filtres.filter((p) => sousRegionPays(p.code_iso3) === region);
          if (paysRegion.length === 0) return null;
          return (
            <div key={region} className="mb-2">
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase">{region}</p>
              {paysRegion.map((p) => {
                const coche = selection.includes(p.code_iso3);
                return (
                  <label
                    key={p.code_iso3}
                    className={`flex items-center gap-2 px-2 py-1 rounded ${
                      !coche && pleine
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={coche}
                      disabled={!coche && pleine}
                      onChange={() => toggle(p.code_iso3)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-700">{nomPays(p.code_iso3, p.nom)}</span>
                  </label>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {selection.length}/{MAX_PAYS_SELECTIONNES} pays sélectionnés
      </p>
    </div>
  );
}
