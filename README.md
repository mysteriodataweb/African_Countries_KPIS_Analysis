# Africa Dev Data Mart — Indicateurs de Développement Afrique

Pipeline de données (notebook Jupyter) et dashboard web statique qui extraient,
nettoient, structurent et visualisent 10 indicateurs de développement pour les
54 pays africains, à partir de l'API publique **World Bank** (v2).

## Objectif

Produire un **data mart reproductible** avec :
1. Une base de données locale propre (DuckDB) : pays, indicateurs et valeurs par année
2. Des visualisations interactives (Plotly) dans le notebook
3. Un dashboard web statique (Next.js) pour l'exploration par des décideurs
4. Une documentation méthodologique ([docs/methodologie.md](docs/methodologie.md))

## Structure du projet

```
.
├── pipeline_complet.ipynb          # Pipeline complet : extraction → DuckDB → analyse → export JSON
├── requirements.txt                # Dépendances Python
├── docs/methodologie.md            # Méthodologie (aussi affichée dans le dashboard)
├── data/                           # Cache API + base DuckDB (générés, ignorés par git)
└── frontend/                       # Dashboard Next.js (export statique)
    ├── app/                        # Pages : accueil, indicateur, comparaison, méthodologie
    ├── components/                 # Sélecteurs, cartes, graphiques (Recharts, react-simple-maps)
    ├── lib/                        # Accès aux données, formatage, référentiel pays (FR)
    ├── public/data/                # JSON exportés par le notebook
    ├── public/geo/                 # Fond de carte de l'Afrique (TopoJSON)
    └── scripts/                    # Génération du fond de carte
```

## Pipeline de données

```bash
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook pipeline_complet.ipynb
```

Exécuter les cellules dans l'ordre :
1. Configuration (période `DATE_START`/`DATE_END`, `FORCE_REFRESH`) et indicateurs
2. Référentiel des pays africains
3. Extraction API World Bank (pagination, retry, cache 24 h)
4. Transformation et nettoyage
5. Chargement dans DuckDB (`data/processed/africa_datamart.duckdb`)
6. Analyse et visualisations
7. Export JSON vers `frontend/public/data/`

## Dashboard web

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # export statique dans frontend/out/
```

Fonctionnalités :
- **Accueil** : un indicateur par carte, avec total ou moyenne africaine et année de référence
- **Indicateur** : courbes multi-pays (jusqu'à 8, recherche, regroupement par sous-région),
  carte choroplèthe et classement des pays avec curseur d'année
- **Comparaison** : nuage de points entre deux indicateurs, choix de l'année,
  échelle logarithmique, coefficient de corrélation
- **Méthodologie** : rendu de `docs/methodologie.md`

Autres commandes : `npm run lint`, `npm run typecheck`, `npm run build:geo`
(régénère le fond de carte à partir de Natural Earth via `world-atlas`).

Déploiement : n'importe quel hébergement statique (Vercel, Netlify, GitHub Pages) ;
la CI GitHub Actions vérifie lint, typage et build à chaque push.

## Données

- **Source** : World Bank Indicators API v2 (licence CC-BY 4.0)
- **Pays** : 54 pays africains, agrégats régionaux exclus
- **Période** : 2000–2024
- **Indicateurs** : PIB, PIB/habitant, population, accès à l'eau, accès à l'électricité,
  scolarisation primaire, alphabétisation, mortalité des moins de 5 ans,
  dépenses de santé, pauvreté extrême
- **Fond de carte** : Natural Earth (domaine public)

## Licence

Code sous licence MIT. Données sous licence CC-BY 4.0 (Banque mondiale).
