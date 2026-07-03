const contenuMethodologie = `
# Méthodologie — Data Mart Indicateurs de Développement Afrique

## Source des données

Les données proviennent de **World Bank Indicators API v2**, une interface publique
et gratuite ne nécessitant aucune clé d'authentification.

- API : \`https://api.worldbank.org/v2/\`
- Licence : CC-BY 4.0 (utilisation libre avec attribution)

## Périmètre

### Pays inclus

Tous les pays de la région **Afrique** (telle que définie par la Banque Mondiale,
y compris l'Afrique subsaharienne et l'Afrique du Nord). Les agrégats régionaux
(ex: "Africa Eastern and Southern") sont exclus.

### Période couverte

2000–2024 (paramétrable).

## Indicateurs sélectionnés

| Code | Indicateur | Catégorie |
|------|-----------|-----------|
| NY.GDP.MKTP.CD | PIB (US$ courants) | Économie |
| NY.GDP.PCAP.CD | PIB par habitant (US$ courants) | Économie |
| SP.POP.TOTL | Population totale | Démographie |
| SH.H2O.BASW.ZS | Accès à l'eau potable de base (%) | Santé |
| EG.ELC.ACCS.ZS | Accès à l'électricité (%) | Infrastructure |
| SE.PRM.ENRR | Taux brut de scolarisation primaire (%) | Éducation |
| SE.ADT.LITR.ZS | Taux d'alphabétisation adultes (%) | Éducation |
| SH.DYN.MORT | Mortalité infantile (‰) | Santé |
| SH.XPD.CHEX.GD.ZS | Dépenses de santé (% PIB) | Santé |
| SI.POV.DDAY | Taux de pauvreté extrême (%) | Pauvreté |

## Limites connues

1. **Fréquence de mise à jour variable** : certains pays ne publient pas de
   données chaque année.
2. **Données manquantes** : certains pays/années n'ont pas de valeur. Les
   entrées sont conservées avec un marqueur explicite.
3. **Agrégats régionaux exclus** : les regroupements sont retirés pour
   éviter toute confusion avec les pays réels.

## Reproductibilité

1. \`pip install -r requirements.txt\`
2. \`python -m src.pipeline\`
3. \`python -m src.export_json\`
4. \`cd frontend && npm run dev\`
`;

export default function MethodologiePage() {
  return (
    <div className="prose prose-gray max-w-none">
      <div dangerouslySetInnerHTML={{ __html: contenuMethodologie.replace(/\n/g, "<br/>").replace(/^## /gm, "<h2>").replace(/^### /gm, "<h3>").replace(/^- /gm, "<br/>- ").replace(/\|/g, " | ") }} />
    </div>
  );
}
