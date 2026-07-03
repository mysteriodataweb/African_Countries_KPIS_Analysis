"use client";

import { useState } from "react";
import type { Pays } from "@/lib/types";

interface CountrySelectorProps {
  pays: Pays[];
  selectionnes: string[];
  indicateurCode: string;
  onSelectionChange?: (codes: string[]) => void;
}

export function CountrySelector({
  pays,
  selectionnes: initialSelection,
  onSelectionChange,
}: CountrySelectorProps) {
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState<string[]>(initialSelection.slice(0, 8));

  const sousRegions = [...new Set(pays.map((p) => p.sous_region ?? "Autre"))].sort();

  const filtered = pays.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const toggleCountry = (code: string) => {
    let newSelection: string[];
    if (selection.includes(code)) {
      newSelection = selection.filter((c) => c !== code);
    } else {
      if (selection.length >= 8) return;
      newSelection = [...selection, code];
    }
    setSelection(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-4">
      <input
        type="text"
        placeholder="Rechercher un pays..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
      />
      <div className="max-h-48 overflow-y-auto text-sm">
        {sousRegions.map((region) => {
          const paysRegion = filtered.filter(
            (p) => (p.sous_region ?? "Autre") === region
          );
          if (paysRegion.length === 0) return null;
          return (
            <div key={region} className="mb-2">
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase">
                {region}
              </p>
              {paysRegion.map((p) => (
                <label
                  key={p.code_iso3}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selection.includes(p.code_iso3)}
                    onChange={() => toggleCountry(p.code_iso3)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">{p.nom}</span>
                </label>
              ))}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {selection.length}/8 pays sélectionnés
      </p>
    </div>
  );
}
