import { getIndicateurs, getPays, getValeursParIndicateur } from "@/lib/data";
import { LineChartIndicateur } from "@/components/charts/LineChartIndicateur";
import { ChoroplethMap } from "@/components/charts/ChoroplethMap";
import { CountrySelector } from "@/components/CountrySelector";
import { YearSlider } from "@/components/YearSlider";

interface Props {
  params: { code: string };
}

export function generateStaticParams() {
  const indicateurs = getIndicateurs();
  return indicateurs.map((i) => ({ code: i.code }));
}

export default function IndicateurPage({ params }: Props) {
  const indicateurs = getIndicateurs();
  const pays = getPays();
  const valeurs = getValeursParIndicateur(params.code);

  const indicateur = indicateurs.find((i) => i.code === params.code);
  if (!indicateur) return <p>Indicateur introuvable</p>;

  const annees = [...new Set(valeurs.map((v) => v.annee))].sort(
    (a, b) => b - a
  );
  const derniereAnnee = annees[0] ?? 2020;

  const paysParDefaut = ["CIV", "SEN", "GHA", "NGA", "MLI", "BFA"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{indicateur.name}</h1>
        <p className="text-gray-600">
          Unité : {indicateur.unit} &middot; Catégorie : {indicateur.category}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Évolution temporelle</h2>
        <CountrySelector
          pays={pays}
          selectionnes={paysParDefaut}
          indicateurCode={params.code}
        />
        <div className="mt-4 bg-white rounded-lg border p-4">
          <LineChartIndicateur
            valeurs={valeurs}
            pays={pays}
            indicateur={indicateur}
            paysSelectionnes={paysParDefaut}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Carte choroplèthe</h2>
        <YearSlider
          annees={annees}
          anneeCourante={derniereAnnee}
          indicateurCode={params.code}
        />
        <div className="mt-4 bg-white rounded-lg border p-4">
          <ChoroplethMap
            valeurs={valeurs}
            pays={pays}
            indicateur={indicateur}
            annee={derniereAnnee}
          />
        </div>
      </section>
    </div>
  );
}
