"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleThreshold } from "d3-scale";
import type { Valeur, Pays, Indicateur } from "@/lib/types";

interface ChoroplethMapProps {
  valeurs: Valeur[];
  pays: Pays[];
  indicateur: Indicateur;
  annee: number;
}

const GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/africa.json";

export function ChoroplethMap({
  valeurs,
  pays,
  indicateur,
  annee,
}: ChoroplethMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  const annees = [...new Set(valeurs.map((v) => v.annee))].sort(
    (a, b) => b - a
  );
  const anneeEffective = annees.includes(annee)
    ? annee
    : annees[0] ?? annee;

  const valeursAnnee = valeurs.filter((v) => v.annee === anneeEffective);

  const valeursMap = new Map<string, number | null>();
  for (const v of valeursAnnee) {
    valeursMap.set(v.pays_code, v.is_missing ? null : v.valeur);
  }

  const valeursNonNulles = [...valeursMap.values()].filter(
    (v): v is number => v !== null
  );

  if (valeursNonNulles.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Aucune donnée disponible pour {anneeEffective}.
      </p>
    );
  }

  const min = Math.min(...valeursNonNulles);
  const max = Math.max(...valeursNonNulles);
  const steps = 5;
  const step = (max - min) / steps;

  const colorScale = scaleThreshold<number, string>()
    .domain(
      Array.from({ length: steps - 1 }, (_, i) => min + step * (i + 1))
    )
    .range([
      "#eff6ff",
      "#bfdbfe",
      "#60a5fa",
      "#2563eb",
      "#1e3a8a",
    ]);

  return (
    <div className="relative">
      <ComposableMap projection="geoMercator" className="w-full h-auto">
        <ZoomableGroup zoom={1} center={[20, 5]}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = geo.properties?.ISO_A3 ?? "";
                const valeur = valeursMap.get(code);
                const paysInfo = pays.find((p) => p.code_iso3 === code);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      valeur !== null && valeur !== undefined
                        ? colorScale(valeur)
                        : "#e5e7eb"
                    }
                    stroke="#d1d5db"
                    strokeWidth={0.5}
                    onMouseEnter={() => {
                      const nom = paysInfo?.nom ?? code;
                      const val =
                        valeur !== null && valeur !== undefined
                          ? `${valeur.toLocaleString("fr-FR")} ${indicateur.unit}`
                          : "Donnée non disponible";
                      setTooltipContent(`${nom} — ${val}`);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#fbbf24", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltipContent && (
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow text-sm border">
          {tooltipContent}
        </div>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <span>{min.toFixed(1)}</span>
        <div className="flex-1 h-3 flex rounded overflow-hidden">
          {colorScale.range().map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
        <span>{max.toFixed(1)}</span>
        <span className="ml-2 text-gray-500">{indicateur.unit}</span>
      </div>
    </div>
  );
}
