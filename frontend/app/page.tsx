import { getIndicateurs, getPays, getValeurs } from "@/lib/data";
import { syntheseIndicateur } from "@/lib/format";
import { IndicatorCard } from "@/components/IndicatorCard";

const CATEGORIES: Record<string, { libelle: string; icone: string }> = {
  economie: { libelle: "Économie", icone: "💰" },
  demographie: { libelle: "Démographie", icone: "👥" },
  sante: { libelle: "Santé", icone: "🏥" },
  infrastructure: { libelle: "Infrastructure", icone: "⚡" },
  education: { libelle: "Éducation", icone: "📚" },
  pauvrete: { libelle: "Pauvreté", icone: "📉" },
};

function categorie(cat: string) {
  return CATEGORIES[cat] ?? { libelle: cat, icone: "📊" };
}

export default function HomePage() {
  const indicateurs = getIndicateurs();
  const valeurs = getValeurs();
  const nbPays = getPays().length;

  const ordre = Object.keys(CATEGORIES);
  const rang = (cat: string) => (ordre.includes(cat) ? ordre.indexOf(cat) : ordre.length);
  const categories = Array.from(new Set(indicateurs.map((i) => i.category))).sort(
    (a, b) => rang(a) - rang(b)
  );
  const annees = valeurs.map((v) => v.annee);
  const periode = annees.length ? `${Math.min(...annees)}–${Math.max(...annees)}` : "—";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Indicateurs de Développement — Afrique</h1>
      <p className="text-gray-600 mb-6">
        Source : World Bank API &middot; Période : {periode} &middot; {nbPays} pays &middot;{" "}
        {indicateurs.length} indicateurs suivis
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#cat-${cat}`}
            className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
          >
            {categorie(cat).icone} {categorie(cat).libelle}
          </a>
        ))}
      </div>

      {categories.map((cat) => (
        <section key={cat} id={`cat-${cat}`} className="mb-8 scroll-mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {categorie(cat).icone} {categorie(cat).libelle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicateurs
              .filter((i) => i.category === cat)
              .map((ind) => (
                <IndicatorCard
                  key={ind.code}
                  code={ind.code}
                  name={ind.name}
                  category={categorie(cat).libelle}
                  unit={ind.unit}
                  icone={categorie(cat).icone}
                  synthese={syntheseIndicateur(ind.code, valeurs)}
                />
              ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-gray-500">
        Les synthèses portent sur la dernière année où au moins la moitié des pays habituellement
        couverts sont renseignés. Les moyennes sont des moyennes simples entre pays (non pondérées
        par la population).
      </p>
    </div>
  );
}
