"use client";

import { useState } from "react";
import type { Indicateur, Pays, Valeur } from "@/lib/types";
import { formatValeur } from "@/lib/format";
import { nomPays } from "@/lib/pays";
import { CountrySelector, MAX_PAYS_SELECTIONNES } from "./CountrySelector";
import { YearSlider } from "./YearSlider";
import { LineChartIndicateur } from "./charts/LineChartIndicateur";
import { ChoroplethMap } from "./charts/ChoroplethMap";

const PAYS_PAR_DEFAUT = ["CIV", "SEN", "GHA", "NGA", "MLI", "BFA"];

interface IndicateurExplorerProps {
  indicateur: Indicateur;
  pays: Pays[];
  valeurs: Valeur[];
}

export function IndicateurExplorer({ indicateur, pays, valeurs }: IndicateurExplorerProps) {
  const [selection, setSelection] = useState(
    PAYS_PAR_DEFAUT.slice(0, MAX_PAYS_SELECTIONNES)
  );

  const anneesRenseignees = Array.from(
    new Set(valeurs.filter((v) => !v.is_missing).map((v) => v.annee))
  ).sort((a, b) => a - b);
  const [annee, setAnnee] = useState(anneesRenseignees.at(-1) ?? 2020);

  const classement = valeurs
    .filter((v) => v.annee === annee && !v.is_missing && v.valeur !== null)
    .sort((a, b) => (b.valeur ?? 0) - (a.valeur ?? 0));
  const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));

  return (
    <>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Évolution temporelle</h2>
        <CountrySelector pays={pays} selection={selection} onSelectionChange={setSelection} />
        <div className="mt-4 bg-white rounded-lg border p-4">
          <LineChartIndicateur
            valeurs={valeurs}
            pays={pays}
            indicateur={indicateur}
            paysSelectionnes={selection}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Carte et classement par année</h2>
        <YearSlider annees={anneesRenseignees} anneeCourante={annee} onYearChange={setAnnee} />
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg border p-4">
            <ChoroplethMap valeurs={valeurs} pays={pays} indicateur={indicateur} annee={annee} />
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Classement {annee}</h3>
            {classement.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune donnée pour cette année.</p>
            ) : (
              <ol className="text-sm max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                {classement.map((v, i) => (
                  <li key={v.pays_code} className="flex justify-between gap-2 py-1">
                    <span className="text-gray-700">
                      <span className="text-gray-400 tabular-nums mr-2">{i + 1}.</span>
                      {nomPays(v.pays_code, paysMap.get(v.pays_code)?.nom)}
                    </span>
                    <span className="tabular-nums text-gray-900">
                      {formatValeur(v.valeur, indicateur.unit)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
