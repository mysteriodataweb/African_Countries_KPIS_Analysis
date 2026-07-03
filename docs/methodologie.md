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

2000–2024 (paramétrable via les arguments `--start` et `--end` du pipeline).

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
| SH.DYN.MORT | Mortalité infantile (‰) | Santé | ODD 3 — Santé |
| SH.XPD.CHEX.GD.ZS | Dépenses de santé (% PIB) | Santé | Effort sanitaire national |
| SI.POV.DDAY | Taux de pauvreté extrême (%) | Pauvreté | ODD 1 — Pas de pauvreté |

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
2. Lancer le pipeline : `python -m src.pipeline`
   - Options : `--start 2000 --end 2024 --force-refresh`
3. Exporter les données pour le frontend : `python -m src.export_json`
4. Lancer les tests : `pytest tests/`

Le cache local évite de re-solliciter l'API à chaque exécution.
Pour forcer un rafraîchissement complet : `python -m src.pipeline --force-refresh`.
