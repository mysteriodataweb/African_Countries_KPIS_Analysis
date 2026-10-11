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
import { couleurSerie, formatNombre, formatValeur, libelleUnite } from "@/lib/format";
import { nomPays } from "@/lib/pays";

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
  const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));

  const selectionnes = paysSelectionnes.filter((code) => paysMap.has(code));
  if (selectionnes.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Sélectionnez au moins un pays pour afficher le graphique.
      </p>
    );
  }

  const index = new Map<string, number | null>();
  for (const v of valeurs) {
    index.set(`${v.pays_code}-${v.annee}`, v.is_missing ? null : v.valeur);
  }
  const annees = Array.from(new Set(valeurs.map((v) => v.annee))).sort((a, b) => a - b);

  const data = annees.map((annee) => {
    const point: Record<string, number | null> = { annee };
    for (const code of selectionnes) {
      point[code] = index.get(`${code}-${annee}`) ?? null;
    }
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 16, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => formatNombre(v)}
          width={70}
          label={{
            value: libelleUnite(indicateur.unit),
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          formatter={(value) =>
            formatValeur(typeof value === "number" ? value : null, indicateur.unit)
          }
        />
        <Legend />
        {selectionnes.map((code, i) => (
          <Line
            key={code}
            type="monotone"
            dataKey={code}
            name={nomPays(code, paysMap.get(code)?.nom)}
            stroke={couleurSerie(i)}
            strokeWidth={2}
            dot={{ r: 2 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
