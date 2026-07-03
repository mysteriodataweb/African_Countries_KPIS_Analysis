"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Valeur, Pays, Indicateur } from "@/lib/types";

interface ScatterComparaisonProps {
  valeurs: Valeur[];
  pays: Pays[];
  indicateurs: Indicateur[];
  codeX: string;
  codeY: string;
}

export function ScatterComparaison({
  valeurs,
  pays,
  indicateurs,
  codeX,
  codeY,
}: ScatterComparaisonProps) {
  const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));
  const indicMap = new Map(indicateurs.map((i) => [i.code, i]));
  const indicX = indicMap.get(codeX);
  const indicY = indicMap.get(codeY);

  if (!indicX || !indicY) {
    return <p className="text-gray-500 text-sm">Sélectionnez deux indicateurs.</p>;
  }

  const derniereAnnee = Math.max(
    ...valeurs
      .filter((v) => [codeX, codeY].includes(v.indicateur_code) && !v.is_missing)
      .map((v) => v.annee)
  );

  const valX = valeurs.filter(
    (v) => v.indicateur_code === codeX && v.annee === derniereAnnee && !v.is_missing
  );
  const valY = valeurs.filter(
    (v) => v.indicateur_code === codeY && v.annee === derniereAnnee && !v.is_missing
  );

  const valYMap = new Map(
    valY.map((v) => [v.pays_code, v.valeur])
  );

  const data = valX
    .map((v) => ({
      pays_code: v.pays_code,
      nom: paysMap.get(v.pays_code)?.nom ?? v.pays_code,
      x: v.valeur ?? 0,
      y: valYMap.get(v.pays_code) ?? 0,
    }))
    .filter((d) => d.y !== null && d.y !== 0);

  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Aucune donnée commune pour les deux indicateurs en {derniereAnnee}.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Données de {derniereAnnee} &middot; Un point par pays
      </p>
      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            name={indicX.name}
            tick={{ fontSize: 11 }}
            label={{
              value: indicX.name,
              position: "insideBottom",
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            dataKey="y"
            name={indicY.name}
            tick={{ fontSize: 11 }}
            label={{
              value: indicY.name,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toLocaleString("fr-FR"),
              name,
            ]}
            labelFormatter={(label: string) => label}
          />
          <Legend />
          <Scatter
            data={data}
            dataKey="y"
            xAxisId={0}
            yAxisId={0}
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth={1}
            name="Pays"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
