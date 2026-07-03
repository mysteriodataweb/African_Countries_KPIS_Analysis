import Link from "next/link";

interface IndicatorCardProps {
  code: string;
  name: string;
  category: string;
  unit: string;
  derniereValeur: number | null;
}

const iconesParCategorie: Record<string, string> = {
  economie: "💰",
  demographie: "👥",
  sante: "🏥",
  infrastructure: "⚡",
  education: "📚",
  pauvrete: "📉",
};

export function IndicatorCard({
  code,
  name,
  category,
  unit,
  derniereValeur,
}: IndicatorCardProps) {
  return (
    <Link
      href={`/indicateurs/${code}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">
          {iconesParCategorie[category] ?? "📊"}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
          {category}
        </span>
      </div>
      <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
        {name}
      </h3>
      {derniereValeur !== null ? (
        <p className="text-lg font-semibold text-primary-700">
          {derniereValeur.toLocaleString("fr-FR")}
          <span className="text-xs text-gray-500 font-normal ml-1">
            {unit}
          </span>
        </p>
      ) : (
        <p className="text-sm text-gray-400">Données non disponibles</p>
      )}
    </Link>
  );
}
