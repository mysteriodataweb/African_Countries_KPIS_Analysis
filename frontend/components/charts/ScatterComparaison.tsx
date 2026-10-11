"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Indicateur } from "@/lib/types";
import { formatNombre, formatValeur } from "@/lib/format";

export interface PointComparaison {
  pays_code: string;
  nom: string;
  x: number;
  y: number;
}

interface ScatterComparaisonProps {
  data: PointComparaison[];
  indicX: Indicateur;
  indicY: Indicateur;
  logX: boolean;
  logY: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: PointComparaison }[];
}

export function ScatterComparaison({ data, indicX, indicY, logX, logY }: ScatterComparaisonProps) {
  const InfoBulle = ({ active, payload }: TooltipProps) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="bg-white border rounded shadow px-3 py-2 text-sm">
        <p className="font-medium">{p.nom}</p>
        <p className="text-gray-600">
          {indicX.name} : {formatValeur(p.x, indicX.unit)}
        </p>
        <p className="text-gray-600">
          {indicY.name} : {formatValeur(p.y, indicY.unit)}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 32, left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          dataKey="x"
          name={indicX.name}
          scale={logX ? "log" : "auto"}
          domain={logX ? ["auto", "auto"] : [0, "auto"]}
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => formatNombre(v)}
          label={{
            value: indicX.name,
            position: "insideBottom",
            offset: -20,
            style: { fontSize: 12 },
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={indicY.name}
          scale={logY ? "log" : "auto"}
          domain={logY ? ["auto", "auto"] : [0, "auto"]}
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => formatNombre(v)}
          width={70}
          label={{
            value: indicY.name,
            angle: -90,
            position: "insideLeft",
            offset: -10,
            style: { fontSize: 12, textAnchor: "middle" },
          }}
        />
        <Tooltip content={<InfoBulle />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#2563eb" fillOpacity={0.75} stroke="#1d4ed8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
