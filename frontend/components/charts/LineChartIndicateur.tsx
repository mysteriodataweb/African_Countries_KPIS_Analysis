"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Valeur, Pays, Indicateur } from "@/lib/types";
import { getPaletteCouleurs } from "@/lib/data";

interface LineChartIndicateurProps {
  valeurs: Valeur[];
  pays: Pays[];
  indicateur: Indicateur;
  paysSelectionnes: string[];
}

export function LineChartIndicateur({
  valeurs,
  pays,
  indicateur,
  paysSelectionnes,
}: LineChartIndicateurProps) {
  const palette = getPaletteCouleurs();
  const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));

  const selectionnees = paysSelectionnes.filter((code) => paysMap.has(code));
  if (selectionnees.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Sélectionnez au moins un pays pour afficher le graphique.
      </p>
    );
  }

  const annees = [...new Set(valeurs.map((v) => v.annee))].sort(
    (a, b) => a - b
  );

  const data = annees.map((annee) => {
    const point: Record<string, number | null> = { annee };
    for (const code of selectionnees) {
      const val = valeurs.find(
        (v) => v.pays_code === code && v.annee === annee
      );
      point[code] = val && !val.is_missing ? val.valeur : null;
    }
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="annee"
          tick={{ fontSize: 12 }}
          label={{ value: "Année", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: indicateur.unit,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          formatter={(value: number) =>
            value !== null
              ? `${value.toLocaleString("fr-FR")} ${indicateur.unit}`
              : "Donnée non disponible"
          }
        />
        <Legend />
        {selectionnees.map((code) => (
          <Line
            key={code}
            type="monotone"
            dataKey={code}
            name={paysMap.get(code)?.nom ?? code}
            stroke={palette[code] ?? `#${Math.floor(Math.random() * 16777215).toString(16)}`}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
