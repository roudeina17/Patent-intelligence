const mongoose = require("mongoose");
const Brevet = require("../models/Brevet");


const CONFIG = {
  MODE: "lens_api",
  get LENS_API_KEY() { return process.env.LENS_API_KEY?.trim(); },
  INTERVAL_MS: 3000,   // ← 5 secondes
  BATCH_SIZE: 100,     // ← 100 par appel
};

// ════════════════════════════════════════════════════════════════════
// DONNÉES SIMULÉES — brevets réalistes basés sur ton dataset réel
// ════════════════════════════════════════════════════════════════════
const CANDIDATS_REELS = [
  "SAMSUNG ELECTRONICS CO LTD",
  "HUAWEI TECHNOLOGIES CO LTD",
  "QUALCOMM INC",
  "LG ENERGY SOLUTION LTD",
  "CANON KK",
  "GOOGLE LLC",
  "ERICSSON TELEFON AB L M",
  "NOKIA TECHNOLOGIES OY",
  "MICROSOFT TECHNOLOGY LICENSING LLC",
  "APPLE INC",
];

const JURIDICTIONS = ["CN", "US", "EP", "JP", "KR"];

const DOMAINES = [
  { titre: "Battery charging system with AI optimization",         domaine: "Énergie & Batteries" },
  { titre: "5G antenna beam forming method for wireless networks", domaine: "Télécoms & 5G" },
  { titre: "Neural network based image recognition system",        domaine: "Intelligence Artificielle" },
  { titre: "Semiconductor memory chip architecture",               domaine: "Semi-conducteurs" },
  { titre: "OLED display pixel rendering method",                  domaine: "Affichage & Optique" },
  { titre: "Medical diagnostic device using deep learning",        domaine: "Médical & Biotech" },
  { titre: "Motor control valve manufacturing process",            domaine: "Mécanique & Industrie" },
  { titre: "Solar energy storage electrode material",              domaine: "Énergie & Batteries" },
  { titre: "Wireless communication signal processing terminal",    domaine: "Télécoms & 5G" },
  { titre: "AI prediction model for semiconductor wafer defects",  domaine: "Intelligence Artificielle" },
];

const TYPES = ["Granted Patent", "Patent Application"];

// ════════════════════════════════════════════════════════════════════
// GÉNÉRATEUR — crée un brevet simulé réaliste
// ════════════════════════════════════════════════════════════════════
function genererBrevetSimule() {
  const domaine  = DOMAINES[Math.floor(Math.random() * DOMAINES.length)];
  const candidat = CANDIDATS_REELS[Math.floor(Math.random() * CANDIDATS_REELS.length)];
  const juridiction = JURIDICTIONS[Math.floor(Math.random() * JURIDICTIONS.length)];
  const type     = TYPES[Math.floor(Math.random() * TYPES.length)];
  const citedBy  = Math.floor(Math.random() * 10);

  return {
    "Titre":                        `${domaine.titre} — variant ${Date.now()}`,
    "Candidats":                    candidat,
    "Juridiction":                  juridiction,
    "Année de publication":         2026,
    "Date de publication":          new Date().toISOString().split("T")[0],
    "Résumé":                       `This invention relates to ${domaine.titre.toLowerCase()}. A novel approach is proposed using advanced techniques.`,
    "Type de document":             type,
    "Statut légal":                 type === "Granted Patent" ? "ACTIVE" : "UNKNOWN",
    "Cité par nombre de brevets":   citedBy,
    "Cites le nombre de brevets":   Math.floor(Math.random() * 20),
    "Nombre de séquences":          0,
    "Propriétaires":                candidat,
    "Inventeurs":                   "",
    "Identifiant de The Lens":      `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    "_source":                      "simulation" // marquer les docs simulés
  };
}

// ════════════════════════════════════════════════════════════════════
// FETCH API THE LENS — activé quand MODE = "lens_api"
// ════════════════════════════════════════════════════════════════════
async function fetchDepuisLens() {
  const axios = require("axios");
  const token = process.env.LENS_API_KEY?.trim();

 const response = await axios.post(
  "https://api.lens.org/patent/search",
  {
    query: {
      bool: {
        must: [
          { match: { "publication_type": "granted_patent" } },
          { match: { "lang": "en" } }
        ],
        filter: [
          {
            range: {
              "date_published": {
                gte: "2025-04-01",
                lte: "2025-07-31"
              }
            }
          }
        ]
      }
    },
    size: CONFIG.BATCH_SIZE,
    sort: [{ "date_published": "desc" }]
  },
  {
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
);

  console.log("Réponse Lens:", JSON.stringify(response.data).substring(0, 300));

  // Protection si data vide
  if (!response.data?.data || !Array.isArray(response.data.data)) {
    console.log("⚠️ Pas de données dans la réponse Lens");
    return [];
  }

  return response.data.data.map(b => {
    // Titre — anglais en priorité
    const titres = b.biblio?.invention_title || [];
    const titre = titres.find(t => t.lang === "en")
               || titres.find(t => t.lang === "fr")
               || titres[0];

    // Candidat
    const candidat = b.biblio?.parties?.applicants?.[0]?.extracted_name?.value || "";

    // Inventeurs
    const inventeurs = (b.biblio?.parties?.inventors || [])
      .map(i => i.extracted_name?.value)
      .filter(Boolean)
      .join(", ");

    // Résumé
    const resumes = b.abstract || [];
    const resume = resumes.find(r => r.lang === "en")
                || resumes.find(r => r.lang === "fr")
                || resumes[0];

    // Statut légal
    const statut = b.legal_status?.patent_status || "UNKNOWN";

    return {
      "Identifiant de The Lens":      b.lens_id,
      "Titre":                        titre?.text || "",
      "Juridiction":                  b.jurisdiction || "",
      "Année de publication":         new Date(b.date_published).getFullYear(),
      "Date de publication":          b.date_published,
      "Candidats":                    candidat,
      "Inventeurs":                   inventeurs,
      "Résumé":                       resume?.text || "",
      "Statut légal":                 statut,
      "Cité par nombre de brevets":   b.cited_by?.patent_count || 0,
      "Cites le nombre de brevets":   b.references_cited?.patent_count || 0,
      "Nombre de séquences":          0,
      "Propriétaires":                candidat,
      "Type de document":             b.kind === "B1" || b.kind === "B3" ? "Granted Patent" : "Patent Application",
      "_source":                      "lens_api"
    };
  });
}
// ════════════════════════════════════════════════════════════════════
// IMPORT PRINCIPAL — appelé à chaque intervalle
// ════════════════════════════════════════════════════════════════════
async function importerBrevets() {
  try {
    let brevets = [];

    if (CONFIG.MODE === "lens_api" && CONFIG.LENS_API_KEY) {
      // Mode réel — API The Lens
      console.log("🌐 Récupération depuis The Lens API...");
      brevets = await fetchDepuisLens();
    } else {
      // Mode simulation
      console.log("🔄 Génération de brevets simulés...");
      brevets = Array.from({ length: CONFIG.BATCH_SIZE }, genererBrevetSimule);
    }

    // Éviter les doublons — vérifier Identifiant de The Lens
    let inseres = 0;
    let doublons = 0;

    for (const b of brevets) {
      const existe = await Brevet.findOne({ 
        "Identifiant de The Lens": b["Identifiant de The Lens"] 
      });

      if (!existe) {
        await new Brevet(b).save();
        inseres++;
      } else {
        doublons++;
      }
    }

    // Stats après insertion
    const total = await Brevet.countDocuments();

    console.log(`✅ [${new Date().toLocaleTimeString()}] +${inseres} brevets insérés | ${doublons} doublons ignorés | Total : ${total}`);

    return { inseres, doublons, total };

  } catch (err) {
    console.error("❌ Erreur import:", err.message);
  }
}

// ════════════════════════════════════════════════════════════════════
// DÉMARRAGE — lance l'import automatique
// ════════════════════════════════════════════════════════════════════
function demarrerAutoImport() {
  console.log(`MODE: ${CONFIG.MODE}`);
  console.log(`LENS_API_KEY: ${CONFIG.LENS_API_KEY ? "✅ présent" : "❌ manquant"}`);
  console.log(`🚀 Auto-import démarré — Intervalle: ${CONFIG.INTERVAL_MS / 1000}s`);

  // ← Ces 2 lignes doivent être là !
  importerBrevets();  // Premier import immédiat
  setInterval(importerBrevets, CONFIG.INTERVAL_MS); // Puis toutes les 30s
}


module.exports = { demarrerAutoImport, importerBrevets, CONFIG };