"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import type { Valeur, Pays, Indicateur } from "@/lib/types";
import { formatNombre, formatValeur, libelleUnite } from "@/lib/format";
import { nomPays } from "@/lib/pays";

interface ChoroplethMapProps {
  valeurs: Valeur[];
  pays: Pays[];
  indicateur: Indicateur;
  annee: number;
}

// Fond de carte embarqué (généré par scripts/build-africa-topojson.mjs).
const GEO_URL = "/geo/africa.topo.json";
const COULEURS = ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"];
const COULEUR_SANS_DONNEE = "#e5e7eb";

export function ChoroplethMap({ valeurs, pays, indicateur, annee }: ChoroplethMapProps) {
  const [tooltip, setTooltip] = useState("");

  const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));
  const valeursMap = new Map<string, number>();
  for (const v of valeurs) {
    if (v.annee === annee && !v.is_missing && v.valeur !== null) {
      valeursMap.set(v.pays_code, v.valeur);
    }
  }
  const valeursNonNulles = Array.from(valeursMap.values());

  if (valeursNonNulles.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Aucune donnée disponible pour {annee}.
      </p>
    );
  }

  // Quantiles : chaque classe regroupe ~20 % des pays, lisible même pour des
  // distributions très asymétriques (PIB, population).
  const colorScale = scaleQuantile<string>().domain(valeursNonNulles).range(COULEURS);
  const seuils = [Math.min(...valeursNonNulles), ...colorScale.quantiles(), Math.max(...valeursNonNulles)];

  return (
    <div className="relative">
      <p className="text-xs text-gray-500 mb-2">
        {annee} &middot; {valeursMap.size} pays renseignés sur {pays.length}
      </p>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [17, 1], scale: 560 }}
        width={800}
        height={820}
        className="w-full h-auto max-h-[640px]"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code: string = geo.properties?.ISO_A3 ?? "";
              const valeur = valeursMap.get(code);
              const nom = paysMap.has(code)
                ? nomPays(code, paysMap.get(code)?.nom)
                : geo.properties?.name ?? code;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={valeur !== undefined ? colorScale(valeur) : COULEUR_SANS_DONNEE}
                  stroke="#9ca3af"
                  strokeWidth={0.5}
                  onMouseEnter={() =>
                    setTooltip(`${nom} — ${formatValeur(valeur, indicateur.unit)}`)
                  }
                  onMouseLeave={() => setTooltip("")}
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
      </ComposableMap>
      {tooltip && (
        <div className="absolute top-8 right-4 bg-white px-3 py-2 rounded shadow text-sm border pointer-events-none">
          {tooltip}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex h-3 rounded overflow-hidden">
          {COULEURS.map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {seuils.map((s, i) => (
            <span key={i}>{formatNombre(s)}</span>
          ))}
        </div>
        <p className="mt-1 text-gray-500">
          Unité : {libelleUnite(indicateur.unit)} &middot; classes par quantiles &middot;{" "}
          <span
            className="inline-block w-3 h-3 align-middle rounded-sm"
            style={{ backgroundColor: COULEUR_SANS_DONNEE }}
          />{" "}
          donnée manquante
        </p>
      </div>
    </div>
  );
}
