import Link from "next/link";
import type { SyntheseIndicateur } from "@/lib/format";
import { formatValeur } from "@/lib/format";

interface IndicatorCardProps {
  code: string;
  name: string;
  category: string;
  unit: string;
  icone: string;
  synthese: SyntheseIndicateur | null;
}

export function IndicatorCard({ code, name, category, unit, icone, synthese }: IndicatorCardProps) {
  return (
    <Link
      href={`/indicateurs/${code}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl" aria-hidden>
          {icone}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
          {category}
        </span>
      </div>
      <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">{name}</h3>
      {synthese ? (
        <>
          <p className="text-lg font-semibold text-primary-700">
            {formatValeur(synthese.valeur, unit)}
          </p>
          <p className="text-xs text-gray-500">
            {synthese.agregation === "total" ? "Total" : "Moyenne simple"} {synthese.annee}{" "}
            &middot; {synthese.nbPays} pays
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400">Données non disponibles</p>
      )}
    </Link>
  );
}
