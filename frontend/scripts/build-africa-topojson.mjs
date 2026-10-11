// Génère public/geo/africa.topo.json à partir de world-atlas (Natural Earth 1:50m).
// Chaque pays reçoit la propriété ISO_A3 utilisée par la carte choroplèthe.
// Usage : npm run build:geo
import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { feature } from "topojson-client";
import { topology } from "topojson-server";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-50m.json");

// Code numérique ISO 3166-1 -> code ISO3 (54 pays de la Banque mondiale + Sahara occidental)
const NUMERIQUE_VERS_ISO3 = {
  "012": "DZA", "024": "AGO", "072": "BWA", "108": "BDI", "120": "CMR",
  "132": "CPV", "140": "CAF", "148": "TCD", "174": "COM", "178": "COG",
  "180": "COD", "204": "BEN", "226": "GNQ", "231": "ETH", "232": "ERI",
  "262": "DJI", "266": "GAB", "270": "GMB", "288": "GHA", "324": "GIN",
  "384": "CIV", "404": "KEN", "426": "LSO", "430": "LBR", "434": "LBY",
  "450": "MDG", "454": "MWI", "466": "MLI", "478": "MRT", "480": "MUS",
  "504": "MAR", "508": "MOZ", "516": "NAM", "562": "NER", "566": "NGA",
  "624": "GNB", "646": "RWA", "678": "STP", "686": "SEN", "690": "SYC",
  "694": "SLE", "706": "SOM", "710": "ZAF", "716": "ZWE", "728": "SSD",
  "729": "SDN", "732": "ESH", "748": "SWZ", "768": "TGO", "788": "TUN",
  "800": "UGA", "818": "EGY", "834": "TZA", "854": "BFA", "894": "ZMB",
};

const pays = feature(world, world.objects.countries).features;
const afrique = pays
  .map((f) => {
    // Le Somaliland n'a pas de code : il est rattaché à la Somalie.
    const iso3 =
      f.properties.name === "Somaliland" ? "SOM" : NUMERIQUE_VERS_ISO3[f.id];
    if (!iso3) return null;
    return { ...f, id: iso3, properties: { ISO_A3: iso3, name: f.properties.name } };
  })
  .filter(Boolean);

const topo = topology({ africa: { type: "FeatureCollection", features: afrique } }, 1e5);

const sortie = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "geo", "africa.topo.json");
mkdirSync(dirname(sortie), { recursive: true });
writeFileSync(sortie, JSON.stringify(topo));
console.log(`${afrique.length} géométries écrites dans ${sortie}`);
