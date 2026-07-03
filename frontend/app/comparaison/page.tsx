"use client";

import { useState, useEffect } from "react";
import { client } from "@/lib/data";
import { ScatterComparaison } from "@/components/charts/ScatterComparaison";
import type { Indicateur, Pays, Valeur } from "@/lib/types";

export default function ComparaisonPage() {
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [valeurs, setValeurs] = useState<Valeur[]>([]);
  const [indX, setIndX] = useState("");
  const [indY, setIndY] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([client.getIndicateurs(), client.getPays(), client.getValeurs()])
      .then(([inds, p, v]) => {
        setIndicateurs(inds);
        setPays(p);
        setValeurs(v);
        if (inds.length >= 2) {
          setIndX(inds[0].code);
          setIndY(inds[1].code);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-600">Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comparaison de deux indicateurs</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Indicateur X
          </label>
          <select
            value={indX}
            onChange={(e) => setIndX(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            {indicateurs.map((i) => (
              <option key={i.code} value={i.code}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Indicateur Y
          </label>
          <select
            value={indY}
            onChange={(e) => setIndY(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            {indicateurs.map((i) => (
              <option key={i.code} value={i.code}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {indX && indY && (
        <div className="bg-white rounded-lg border p-4">
          <ScatterComparaison
            valeurs={valeurs}
            pays={pays}
            indicateurs={indicateurs}
            codeX={indX}
            codeY={indY}
          />
        </div>
      )}
    </div>
  );
}
