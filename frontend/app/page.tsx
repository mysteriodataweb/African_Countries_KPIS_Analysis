import { getIndicateurs, getValeurs } from "@/lib/data";
import { IndicatorCard } from "@/components/IndicatorCard";

const iconesParCategorie: Record<string, string> = {
  economie: "💰",
  demographie: "👥",
  sante: "🏥",
  infrastructure: "⚡",
  education: "📚",
  pauvrete: "📉",
};

export default function HomePage() {
  const indicateurs = getIndicateurs();
  const valeurs = getValeurs();

  const categories = [...new Set(indicateurs.map((i) => i.category))];

  const valeursParIndicateur = new Map<string, number | null>();
  for (const ind of indicateurs) {
    const vals = valeurs.filter(
      (v) => v.indicateur_code === ind.code && !v.is_missing
    );
    const dernieres = vals.filter(
      (v) => v.annee === Math.max(...vals.map((x) => x.annee))
    );
    const moyenne =
      dernieres.length > 0
        ? Math.round(
            dernieres.reduce((s, v) => s + (v.valeur ?? 0), 0) /
              dernieres.length
          )
        : null;
    valeursParIndicateur.set(ind.code, moyenne);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Indicateurs de Développement — Afrique
      </h1>
      <p className="text-gray-600 mb-6">
        Source : World Bank API &middot; Période : 2000–2024 &middot;{" "}
        {indicateurs.length} indicateurs suivis
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#cat-${cat}`}
            className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
          >
            {iconesParCategorie[cat] ?? "📊"} {cat}
          </a>
        ))}
      </div>

      {categories.map((cat) => (
        <section key={cat} id={`cat-${cat}`} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
            {iconesParCategorie[cat] ?? "📊"} {cat}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicateurs
              .filter((i) => i.category === cat)
              .map((ind) => (
                <IndicatorCard
                  key={ind.code}
                  code={ind.code}
                  name={ind.name}
                  category={ind.category}
                  unit={ind.unit}
                  derniereValeur={valeursParIndicateur.get(ind.code) ?? null}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
