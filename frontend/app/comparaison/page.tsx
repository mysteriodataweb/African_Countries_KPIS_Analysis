"use client";

import { useEffect, useMemo, useState } from "react";
import { client } from "@/lib/client";
import { nomPays } from "@/lib/pays";
import { ScatterComparaison, type PointComparaison } from "@/components/charts/ScatterComparaison";
import type { Indicateur, Pays, Valeur } from "@/lib/types";

/** Coefficient de corrélation de Pearson. */
function correlation(points: PointComparaison[]): number | null {
  const n = points.length;
  if (n < 3) return null;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let cov = 0, vx = 0, vy = 0;
  for (const p of points) {
    cov += (p.x - mx) * (p.y - my);
    vx += (p.x - mx) ** 2;
    vy += (p.y - my) ** 2;
  }
  return vx && vy ? cov / Math.sqrt(vx * vy) : null;
}

function indexer(valeurs: Valeur[]): Map<number, Map<string, number>> {
  const parAnnee = new Map<number, Map<string, number>>();
  for (const v of valeurs) {
    if (v.is_missing || v.valeur === null) continue;
    if (!parAnnee.has(v.annee)) parAnnee.set(v.annee, new Map());
    parAnnee.get(v.annee)!.set(v.pays_code, v.valeur);
  }
  return parAnnee;
}

export default function ComparaisonPage() {
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [cache, setCache] = useState<Record<string, Valeur[]>>({});
  const [indX, setIndX] = useState("SH.H2O.BASW.ZS");
  const [indY, setIndY] = useState("SH.DYN.MORT");
  const [annee, setAnnee] = useState<number | null>(null);
  const [logX, setLogX] = useState(false);
  const [logY, setLogY] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([client.getIndicateurs(), client.getPays()])
      .then(([inds, p]) => {
        setIndicateurs(inds);
        setPays(p);
        const codes = new Set(inds.map((i) => i.code));
        if (!codes.has(indX)) setIndX(inds[0]?.code ?? "");
        if (!codes.has(indY)) setIndY(inds[1]?.code ?? "");
      })
      .catch((err: Error) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chargement à la demande des seules séries nécessaires
  useEffect(() => {
    for (const code of [indX, indY]) {
      if (!code || cache[code]) continue;
      client
        .getValeursParIndicateur(code)
        .then((v) => setCache((c) => ({ ...c, [code]: v })))
        .catch((err: Error) => setError(err.message));
    }
  }, [indX, indY, cache]);

  const valX = cache[indX];
  const valY = cache[indY];

  const { anneesCommunes, parAnneeX, parAnneeY } = useMemo(() => {
    if (!valX || !valY) return { anneesCommunes: [] as number[], parAnneeX: null, parAnneeY: null };
    const px = indexer(valX);
    const py = indexer(valY);
    // Années où au moins 5 pays ont les deux indicateurs renseignés
    const communes = Array.from(px.keys())
      .filter((a) => {
        const ys = py.get(a);
        if (!ys) return false;
        let n = 0;
        px.get(a)!.forEach((_, code) => {
          if (ys.has(code)) n++;
        });
        return n >= 5;
      })
      .sort((a, b) => b - a);
    return { anneesCommunes: communes, parAnneeX: px, parAnneeY: py };
  }, [valX, valY]);

  const anneeEffective =
    annee !== null && anneesCommunes.includes(annee) ? annee : anneesCommunes[0] ?? null;

  const data: PointComparaison[] = useMemo(() => {
    if (anneeEffective === null || !parAnneeX || !parAnneeY) return [];
    const xs = parAnneeX.get(anneeEffective)!;
    const ys = parAnneeY.get(anneeEffective)!;
    const paysMap = new Map(pays.map((p) => [p.code_iso3, p]));
    const points: PointComparaison[] = [];
    xs.forEach((x, code) => {
      const y = ys.get(code);
      if (y === undefined) return;
      if ((logX && x <= 0) || (logY && y <= 0)) return;
      points.push({ pays_code: code, nom: nomPays(code, paysMap.get(code)?.nom), x, y });
    });
    return points;
  }, [anneeEffective, parAnneeX, parAnneeY, pays, logX, logY]);

  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (indicateurs.length === 0) return <p className="text-gray-600">Chargement...</p>;

  const indicX = indicateurs.find((i) => i.code === indX);
  const indicY = indicateurs.find((i) => i.code === indY);
  const r = correlation(data);

  const selecteur = (
    label: string,
    valeur: string,
    onChange: (v: string) => void,
    log: boolean,
    setLog: (v: boolean) => void
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <select
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block border border-gray-300 rounded px-3 py-2 text-sm bg-white font-normal"
        >
          {indicateurs.map((i) => (
            <option key={i.code} value={i.code}>
              {i.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
        <input type="checkbox" checked={log} onChange={(e) => setLog(e.target.checked)} />
        Échelle logarithmique
      </label>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comparaison de deux indicateurs</h1>

      <div className="flex flex-wrap items-start gap-6 mb-6">
        {selecteur("Indicateur X", indX, setIndX, logX, setLogX)}
        {selecteur("Indicateur Y", indY, setIndY, logY, setLogY)}
        <label className="block text-sm font-medium text-gray-700">
          Année
          <select
            value={anneeEffective ?? ""}
            onChange={(e) => setAnnee(Number(e.target.value))}
            disabled={anneesCommunes.length === 0}
            className="mt-1 block border border-gray-300 rounded px-3 py-2 text-sm bg-white font-normal"
          >
            {anneesCommunes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="bg-white rounded-lg border p-4">
        {!valX || !valY ? (
          <p className="text-gray-600 text-sm">Chargement des séries...</p>
        ) : !indicX || !indicY || anneeEffective === null || data.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">
            Pas assez de pays renseignés simultanément pour ces deux indicateurs.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Données {anneeEffective} &middot; {data.length} pays
              {r !== null && (
                <>
                  {" "}
                  &middot; corrélation de Pearson r = {r.toFixed(2).replace(".", ",")}
                </>
              )}
            </p>
            <ScatterComparaison data={data} indicX={indicX} indicY={indicY} logX={logX} logY={logY} />
          </>
        )}
      </div>
    </div>
  );
}
