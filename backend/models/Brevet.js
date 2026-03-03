const mongoose = require('mongoose');

/**
 * Schéma Mongoose pour la collection "brevets"
 * Résultat du nettoyage et de la normalisation de 2 datasets hétérogènes :
 *   - Dataset 2026 : champs en français, statut ACTIVE
 *   - Dataset 2024/2025 : champs en anglais, statut absent → renommés via $rename
 * Total : 100 000 documents après suppression de 1 000 doublons
 */
const brevetSchema = new mongoose.Schema({

  "#": { type: Number },                          // Numéro de ligne dans le CSV source

  // ── Identification & Classification ──────────────────────────────────────
  "Juridiction":               { type: String },  // Pays/région : CN, US, EP, JP, KR...
                                                  // Normalisé depuis "Jurisdiction" (dataset EN)
  "Genre":                     { type: String },  // Ex: "Patent Application", "Granted Patent"
  "Clé d'affichage":           { type: String },  // Référence lisible du brevet (ex: US-2024-123)
  "Identifiant de The Lens":   { type: String },  // Clé unique utilisée pour la déduplication
                                                  // → 1 000 doublons supprimés grâce à ce champ

  // ── Dates ─────────────────────────────────────────────────────────────────
  "Date de publication":       { type: String },  // Date complète (JJ/MM/AAAA)
  "Année de publication":      { type: Number },  // Normalisé depuis "Publication Year" (EN)
                                                  // Valeurs : 2024, 2025, 2026
  "Date de demande":           { type: String },  // Date de dépôt initial

  // ── Contenu ───────────────────────────────────────────────────────────────
  "Titre":    { type: String },                   // Normalisé depuis "Title" (dataset EN)
  "Résumé":   { type: String, default: "" },      // Normalisé depuis "Abstract" (dataset EN)
                                                  // default: "" → évite les valeurs NULL
                                                  // 16 241 brevets sans résumé dans la source

  // ── Acteurs ───────────────────────────────────────────────────────────────
  "Candidats":    { type: String, default: "" },  // Normalisé depuis "Applicants" (dataset EN)
  "Inventeurs":   { type: String, default: "" },  // Noms des inventeurs
  "Propriétaires":{ type: String, default: "" },  // default: "" → NULL remplacé pour 50 103 docs

  // ── Classification ────────────────────────────────────────────────────────
  "Type de document": { type: String },           // "Granted Patent" | "Patent Application"

  // ── Métriques de citation ─────────────────────────────────────────────────
  "Cites le nombre de brevets":  { type: Number, default: 0 }, // Brevets antérieurs cités
  "Cité par nombre de brevets":  { type: Number, default: 0 }, // Fois où ce brevet est cité
                                                               // → utilisé pour le score d'impact
  "Nombre de séquences":         { type: Number, default: 0 }, // default: 0 → NULL remplacé

  // ── Statut légal ──────────────────────────────────────────────────────────
  "Statut légal": { type: String }                // "ACTIVE" (dataset 2026)
                                                  // "UNKNOWN" (dataset 2024/2025 — absent à la source)
                                                  // Remplacé via $set pour 50 103 documents

}, {
  collection: 'brevets', // Nom exact de la collection dans MongoDB
  strict: false          // Autorise les champs non définis dans le schéma
                         // Nécessaire car les 2 datasets ont des champs supplémentaires variables
});

module.exports = mongoose.model('Brevet', brevetSchema);