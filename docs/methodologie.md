# Méthodologie — Data Mart Indicateurs de Développement Afrique

## Source des données

Les données proviennent de **World Bank Indicators API v2**, une interface publique
et gratuite ne nécessitant aucune clé d'authentification.

- API : `https://api.worldbank.org/v2/`
- Licence : CC-BY 4.0 (utilisation libre avec attribution)
- Documentation : [World Bank API Docs](https://documents.worldbank.org/en/publication/documents-reports/api)

## Périmètre

### Pays inclus

Tous les pays de la région **Afrique** (telle que définie par la Banque Mondiale,
y compris l'Afrique subsaharienne et l'Afrique du Nord). Les agrégats régionaux
(ex: "Africa Eastern and Southern", "Sub-Saharan Africa") sont exclus pour ne
conserver que les véritables pays.

### Période couverte

2000–2024 (paramétrable via les variables `DATE_START` et `DATE_END` du notebook).

## Indicateurs sélectionnés

| Code | Indicateur | Catégorie | Justification |
|------|-----------|-----------|---------------|
| NY.GDP.MKTP.CD | PIB (US$ courants) | Économie | Mesure de base de la taille économique |
| NY.GDP.PCAP.CD | PIB par habitant (US$ courants) | Économie | Niveau de vie moyen |
| SP.POP.TOTL | Population totale | Démographie | Base démographique |
| SH.H2O.BASW.ZS | Accès à l'eau potable de base (%) | Santé | ODD 6 — Eau propre |
| EG.ELC.ACCS.ZS | Accès à l'électricité (%) | Infrastructure | ODD 7 — Énergie propre |
| SE.PRM.ENRR | Taux brut de scolarisation primaire (%) | Éducation | ODD 4 — Éducation de qualité |
| SE.ADT.LITR.ZS | Taux d'alphabétisation adultes (%) | Éducation | Capital humain |
| SH.DYN.MORT | Mortalité des moins de 5 ans (‰ naissances vivantes) | Santé | ODD 3 — Santé (cible 3.2) |
| SH.XPD.CHEX.GD.ZS | Dépenses de santé (% PIB) | Santé | Effort sanitaire national |
| SI.POV.DDAY | Taux de pauvreté extrême (%) | Pauvreté | ODD 1 — Pas de pauvreté |

## Traitements appliqués

- **Valeurs manquantes** : conservées avec `valeur = null` et `is_missing = true`
  (jamais imputées).
- **Doublons** pays × indicateur × année : détectés, signalés puis dédupliqués.
- **Référentiel pays** : espaces superflus supprimés, coordonnées converties en nombres.
- **Libellés** : noms de pays traduits en français et regroupés par sous-région
  (classification M49 des Nations unies) dans le dashboard.

## Synthèses affichées sur le dashboard

- Pour la population et le PIB total, la carte d'accueil affiche le **total** des pays.
- Pour les autres indicateurs, il s'agit d'une **moyenne simple** entre pays
  (non pondérée par la population).
- L'année retenue est la dernière où au moins la moitié des pays habituellement
  couverts sont renseignés, afin d'éviter des moyennes calculées sur 1 ou 2 pays.
- La carte choroplèthe répartit les pays en 5 classes par **quantiles**.

## Limites connues

1. **Fréquence de mise à jour variable** : certains pays ne publient pas de
   données chaque année ; l'écart peut être de 2 à 5 ans pour certains indicateurs.
2. **Données manquantes** : certains pays/années n'ont pas de valeur enregistrée.
   Le pipeline conserve ces entrées avec un marqueur `is_missing` explicite.
3. **Agrégats régionaux exclus** : les regroupements comme "Sub-Saharan Africa"
   sont retirés pour éviter toute confusion avec les pays réels.
4. **Périmètre géographique** : la définition de la région "Afrique" par la
   Banque Mondiale peut différer des définitions de l'Union Africaine.

## Reproductibilité

1. Créer l'environnement : `pip install -r requirements.txt`
2. Ouvrir `pipeline_complet.ipynb` et exécuter toutes les cellules
   (`FORCE_REFRESH = True` pour ignorer le cache).
3. La dernière partie du notebook régénère les fichiers JSON de `frontend/public/data/`.
4. Lancer le dashboard : `cd frontend && npm install && npm run dev`.

Le cache local (`data/raw/`, durée 24 h) évite de re-solliciter l'API à chaque exécution.
