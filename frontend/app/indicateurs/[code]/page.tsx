import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndicateurs, getPays, getValeursParIndicateur } from "@/lib/data";
import { libelleUnite } from "@/lib/format";
import { IndicateurExplorer } from "@/components/IndicateurExplorer";

interface Props {
  params: { code: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndicateurs().map((i) => ({ code: i.code }));
}

export function generateMetadata({ params }: Props): Metadata {
  const indicateur = getIndicateurs().find((i) => i.code === params.code);
  return { title: indicateur ? `${indicateur.name} — Africa Dev Data Mart` : undefined };
}

export default function IndicateurPage({ params }: Props) {
  const indicateur = getIndicateurs().find((i) => i.code === params.code);
  if (!indicateur) notFound();

  const pays = getPays();
  const valeurs = getValeursParIndicateur(params.code);
  const nbRenseignees = valeurs.filter((v) => !v.is_missing).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{indicateur.name}</h1>
        <p className="text-gray-600">
          Code World Bank : <code className="text-sm">{indicateur.code}</code> &middot; Unité :{" "}
          {libelleUnite(indicateur.unit)} &middot; Catégorie :{" "}
          <span className="capitalize">{indicateur.category}</span> &middot; Complétude :{" "}
          {valeurs.length > 0 ? Math.round((nbRenseignees / valeurs.length) * 100) : 0} %
        </p>
      </div>

      <IndicateurExplorer indicateur={indicateur} pays={pays} valeurs={valeurs} />
    </div>
  );
}
