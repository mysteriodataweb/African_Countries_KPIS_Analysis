# Africa Dev Data Mart — Indicateurs de Développement Afrique

Notebook Jupyter unique qui extrait, nettoie, structure et visualise des indicateurs de développement
pour les pays africains à partir de l'API publique **World Bank** (v2).

## Objectif

Produire un **data mart reproductible** avec :
1. Une base de données locale propre (DuckDB) avec pays, indicateurs et valeurs par année
2. Des visualisations interactives (Plotly) intégrées dans le notebook
3. Un dashboard web statique (Next.js) pour l'exploration par des décideurs
4. Une documentation méthodologique complète

## Structure du projet

```
africa-dev-datamart/
├── pipeline_complet.ipynb      # Notebook unique : pipeline complet + analyse
├── docs/methodologie.md        # Documentation méthodologique
├── frontend/                   # Dashboard Next.js (statique)
├── data/                       # Cache brut + base DuckDB (gitignoré)
├── requirements.txt            # Dépendances Python
└── README.md
```

## Installation

```bash
pip install -r requirements.txt
```

## Utilisation

### Lancer le pipeline complet + analyse

```bash
jupyter notebook pipeline_complet.ipynb
```

Puis exécuter les cellules dans l'ordre. Le notebook est divisé en 6 parties :
1. Configuration et imports
2. Référentiel des pays africains
3. Extraction des données API World Bank
4. Transformation et nettoyage
5. Chargement dans DuckDB
6. Analyse et visualisations interactives

### Exporter les données pour le frontend

La dernière cellule du notebook génère les fichiers JSON dans `frontend/public/data/`.

### Lancer le dashboard frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Lancer le dashboard frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## Dashboard web

Un dashboard statique Next.js (App Router, TypeScript, Tailwind CSS, shadcn/ui)
permet d'explorer les données :
- Page d'accueil avec grille d'indicateurs
- Détail par indicateur (courbes multi-pays + carte choroplèthe)
- Comparaison de deux indicateurs (scatter)
- Page méthodologique

Déploiement cible : Vercel (gratuit, statique).

## Données

- **Source** : World Bank Indicators API v2 (licence CC-BY 4.0)
- **Pays** : tous les pays africains (54+), agrégats régionaux exclus
- **Période** : 2000–2024
- **Indicateurs** : PIB, PIB/habitant, population, accès à l'eau,
  accès à l'électricité, scolarisation, alphabétisation, mortalité infantile,
  dépenses de santé, pauvreté extrême

## Licence

Projet sous licence MIT.
Données sous licence CC-BY 4.0 (Banque Mondiale).
