const Brevet = require('../models/Brevet');

// ════════════════════════════════════════════════════════════════════
// KPIs GLOBAUX
// Exécute 6 requêtes en parallèle (Promise.all) pour les métriques
// principales du dashboard
// ════════════════════════════════════════════════════════════════════
exports.getKPIs = async (req, res) => {
  try {
    const [total, actifs, inconnus, avecResume, moyenneCitations, parAnnee] = await Promise.all([
      Brevet.countDocuments(),
      Brevet.countDocuments({ "Statut l\u00e9gal": "ACTIVE" }),
      Brevet.countDocuments({ "Statut l\u00e9gal": "UNKNOWN" }),
      Brevet.countDocuments({ "R\u00e9sum\u00e9": { $ne: "" } }),
      Brevet.aggregate([
        { $group: {
          _id: null,
          moyenneCitedBy: { $avg: "$Cit\u00e9 par nombre de brevets" },
          moyenneCites:   { $avg: "$Cites le nombre de brevets" }
        }}
      ]),
      Brevet.aggregate([
        { $group: { _id: "$Ann\u00e9e de publication", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      total, actifs, inconnus, avecResume,
      sansResume: total - avecResume,
      moyenneCitedBy: moyenneCitations[0]?.moyenneCitedBy?.toFixed(2),
      moyenneCites:   moyenneCitations[0]?.moyenneCites?.toFixed(2),
      parAnnee
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// DISTRIBUTION PAR ANNÉE
// ════════════════════════════════════════════════════════════════════
exports.getByYear = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $group: { _id: "$Année de publication", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// DISTRIBUTION PAR STATUT LÉGAL
// ACTIVE (50 000) + UNKNOWN (50 103)
// ════════════════════════════════════════════════════════════════════
exports.getByStatut = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $group: { _id: "$Statut légal", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// TOP 10 DÉPOSANTS
// ════════════════════════════════════════════════════════════════════
exports.getTopCandidats = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $match: { "Candidats": { $ne: "" } } },
      { $group: { _id: "$Candidats", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// SCORE D'IMPACT
// Formule : citedBy / (cites + 1)
// ════════════════════════════════════════════════════════════════════
exports.getImpactScore = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $match: { "Cité par nombre de brevets": { $gt: 0 } } },
      { $project: {
        "Titre": 1, "Candidats": 1,
        "Année de publication": 1, "Juridiction": 1,
        "citedBy": "$Cité par nombre de brevets",
        "cites":   "$Cites le nombre de brevets",
        "impactScore": {
          $divide: [
            "$Cité par nombre de brevets",
            { $add: ["$Cites le nombre de brevets", 1] }
          ]
        }
      }},
      { $sort: { impactScore: -1 } },
      { $limit: 20 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// RÉPARTITION PAR JURIDICTION
// ════════════════════════════════════════════════════════════════════
exports.getByJuridiction = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $group: {
        _id: { juridiction: "$Juridiction", type: "$Type de document" },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// ACTIVITÉ PAR CANDIDAT PAR ANNÉE
// ════════════════════════════════════════════════════════════════════
exports.getActiviteParAnnee = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $group: {
        _id: {
          candidat: "$Candidats",
          annee:    "$Année de publication"
        },
        count: { $sum: 1 }
      }},
      { $sort: { "_id.annee": 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// TOP 3 CANDIDATS PAR JURIDICTION
// ════════════════════════════════════════════════════════════════════
exports.getTopParJuridiction = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $match: { "Candidats": { $ne: "" } } },
      { $group: {
        _id: { juridiction: "$Juridiction", candidat: "$Candidats" },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $group: {
        _id: "$_id.juridiction",
        topCandidats: { $push: {
          candidat: "$_id.candidat",
          count:    "$count"
        }},
      }},
      { $project: {
        topCandidats: { $slice: ["$topCandidats", 3] }
      }}
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// TENDANCE DES DÉPOSANTS
// ════════════════════════════════════════════════════════════════════
exports.getTendance = async (req, res) => {
  try {
    const data = await Brevet.aggregate([
      { $match: { "Candidats": { $ne: "" } } },
      { $group: {
        _id: { candidat: "$Candidats", annee: "$Année de publication" },
        count: { $sum: 1 }
      }},
      { $group: {
        _id: "$_id.candidat",
        annees: { $push: { annee: "$_id.annee", count: "$count" } },
        total:  { $sum: "$count" }
      }},
      { $match: { total: { $gte: 50 } } },
      { $sort: { total: -1 } },
      { $limit: 15 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// RECHERCHE AVANCÉE
// ════════════════════════════════════════════════════════════════════
exports.recherche = async (req, res) => {
  try {
    const { q, juridiction, annee } = req.query;

    const filter = {};
    if (q) filter["$or"] = [
      { "Candidats": { $regex: q, $options: "i" } },
      { "Titre":     { $regex: q, $options: "i" } }
    ];
    if (juridiction) filter["Juridiction"]          = juridiction;
    if (annee)       filter["Année de publication"] = parseInt(annee);

    const data = await Brevet.find(filter)
      .select("Titre Candidats Juridiction Année de publication Type de document Statut légal Cité par nombre de brevets")
      .limit(50)
      .lean();

    const total = await Brevet.countDocuments(filter);
    res.json({ total, results: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// CLASSIFICATION PAR DOMAINE TECHNOLOGIQUE
// Regex sur le Titre — contournement absence CPC/IPC The Lens gratuit
// ════════════════════════════════════════════════════════════════════
exports.getParDomaine = async (req, res) => {
  try {
    const domaines = {
      "Énergie & Batteries":       ["BATTERY", "ENERGY", "SOLAR", "FUEL CELL", "CHARGING", "ELECTRODE"],
      "Semi-conducteurs":          ["SEMICONDUCTOR", "CHIP", "TRANSISTOR", "CIRCUIT", "MEMORY", "WAFER"],
      "Télécoms & 5G":             ["COMMUNICATION", "WIRELESS", "ANTENNA", "NETWORK", "5G", "SIGNAL", "TERMINAL"],
      "Affichage & Optique":       ["DISPLAY", "SCREEN", "OPTICAL", "LENS", "IMAGE", "PIXEL", "OLED"],
      "Intelligence Artificielle": ["NEURAL", "LEARNING", "AI", "RECOGNITION", "DETECTION", "PREDICTION"],
      "Médical & Biotech":         ["MEDICAL", "HEALTH", "DRUG", "BIOLOGICAL", "THERAPY", "DIAGNOSTIC"],
      "Mécanique & Industrie":     ["MOTOR", "VALVE", "PUMP", "MECHANICAL", "MANUFACTURING", "DEVICE"],
    };

    const results = {};
    await Promise.all(Object.entries(domaines).map(async ([domaine, mots]) => {
      const regex = mots.join("|");
      const count = await Brevet.countDocuments({
        "Titre": { $regex: regex, $options: "i" }
      });
      results[domaine] = count;
    }));

    const total  = await Brevet.countDocuments();
    const somme  = Object.values(results).reduce((a, b) => a + b, 0);
    results["Autres"] = total - somme;

    const data = Object.entries(results)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// BREVETS À FORT IMPACT PAR DOMAINE
// ════════════════════════════════════════════════════════════════════
exports.getImpactParDomaine = async (req, res) => {
  try {
    const domaines = {
      "Énergie & Batteries":       ["BATTERY", "ENERGY", "SOLAR", "FUEL CELL", "CHARGING", "ELECTRODE"],
      "Semi-conducteurs":          ["SEMICONDUCTOR", "CHIP", "TRANSISTOR", "CIRCUIT", "MEMORY", "WAFER"],
      "Télécoms & 5G":             ["COMMUNICATION", "WIRELESS", "ANTENNA", "NETWORK", "5G", "SIGNAL", "TERMINAL"],
      "Affichage & Optique":       ["DISPLAY", "SCREEN", "OPTICAL", "LENS", "IMAGE", "PIXEL", "OLED"],
      "Intelligence Artificielle": ["NEURAL", "LEARNING", "AI", "RECOGNITION", "DETECTION", "PREDICTION"],
      "Médical & Biotech":         ["MEDICAL", "HEALTH", "DRUG", "BIOLOGICAL", "THERAPY", "DIAGNOSTIC"],
      "Mécanique & Industrie":     ["MOTOR", "VALVE", "PUMP", "MECHANICAL", "MANUFACTURING", "DEVICE"],
    };

    const brevetsImpact = await Brevet.find(
      { "Cité par nombre de brevets": { $gt: 0 } },
      { "Titre": 1, "Candidats": 1, "Juridiction": 1,
        "Année de publication": 1,
        "Cité par nombre de brevets": 1,
        "Cites le nombre de brevets": 1 }
    ).lean();

    const result = brevetsImpact.map(b => {
      let domaine = "Autres";
      for (const [nom, mots] of Object.entries(domaines)) {
        const regex = new RegExp(mots.join("|"), "i");
        if (regex.test(b.Titre)) { domaine = nom; break; }
      }
      return {
        ...b,
        domaine,
        impactScore: (b["Cité par nombre de brevets"] /
          (b["Cites le nombre de brevets"] + 1)).toFixed(2)
      };
    });

    const parDomaine = {};
    result.forEach(b => {
      if (!parDomaine[b.domaine]) parDomaine[b.domaine] = [];
      parDomaine[b.domaine].push(b);
    });

    res.json({
      total: brevetsImpact.length,
      parDomaine,
      liste: result.sort((a, b) => b.impactScore - a.impactScore)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// PRÉDICTION TENDANCES TECHNOLOGIQUES 2027
// Régression linéaire y = ax + b sur 2024/2025/2026
// ════════════════════════════════════════════════════════════════════
exports.getTendanceTechno = async (req, res) => {
  try {
    const domaines = {
      "Énergie & Batteries":       ["BATTERY", "ENERGY", "SOLAR", "FUEL CELL", "CHARGING", "ELECTRODE"],
      "Semi-conducteurs":          ["SEMICONDUCTOR", "CHIP", "TRANSISTOR", "CIRCUIT", "MEMORY", "WAFER"],
      "Télécoms & 5G":             ["COMMUNICATION", "WIRELESS", "ANTENNA", "NETWORK", "5G", "SIGNAL", "TERMINAL"],
      "Affichage & Optique":       ["DISPLAY", "SCREEN", "OPTICAL", "LENS", "IMAGE", "PIXEL", "OLED"],
      "Intelligence Artificielle": ["NEURAL", "LEARNING", "AI", "RECOGNITION", "DETECTION", "PREDICTION"],
      "Médical & Biotech":         ["MEDICAL", "HEALTH", "DRUG", "BIOLOGICAL", "THERAPY", "DIAGNOSTIC"],
      "Mécanique & Industrie":     ["MOTOR", "VALVE", "PUMP", "MECHANICAL", "MANUFACTURING", "DEVICE"],
    };

    const annees = [2024, 2025, 2026];
    const results = [];

    for (const [domaine, mots] of Object.entries(domaines)) {
      const regex = mots.join("|");
      const parAnnee = {};

      await Promise.all(annees.map(async (annee) => {
        const count = await Brevet.countDocuments({
          "Titre": { $regex: regex, $options: "i" },
          "Année de publication": annee
        });
        parAnnee[annee] = count;
      }));

      const points = annees.map(a => ({ x: a, y: parAnnee[a] }));
      const n    = points.length;
      const sumX  = points.reduce((s, p) => s + p.x, 0);
      const sumY  = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
      const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const b = (sumY - a * sumX) / n;
      const pred2027 = Math.max(0, Math.round(a * 2027 + b));

      const croissance = parAnnee[2024] > 0
        ? (((parAnnee[2026] - parAnnee[2024]) / parAnnee[2024]) * 100).toFixed(1)
        : null;

      results.push({
        domaine, parAnnee, pred2027,
        croissance: parseFloat(croissance),
        tendance: a > 0 ? "croissance" : "déclin"
      });
    }

    results.sort((a, b) => b.pred2027 - a.pred2027);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// PRÉDICTION CONCURRENTS FUTURS 2027
// Score de menace = pred2027 + croissance%
// ════════════════════════════════════════════════════════════════════
exports.getConcurrentsFuturs = async (req, res) => {
  try {
    const annees = [2024, 2025, 2026];

    const data = await Brevet.aggregate([
      { $match: { "Candidats": { $ne: "" } } },
      { $group: {
        _id: { candidat: "$Candidats", annee: "$Année de publication" },
        count: { $sum: 1 }
      }},
      { $group: {
        _id: "$_id.candidat",
        annees: { $push: { annee: "$_id.annee", count: "$count" } },
        total:  { $sum: "$count" }
      }},
      { $match: { total: { $gte: 30 } } },
      { $sort: { total: -1 } },
      { $limit: 20 }
    ]);

    const results = data.map(d => {
      const parAnnee = {};
      annees.forEach(a => {
        const found = d.annees.find(x => x.annee === a);
        parAnnee[a] = found ? found.count : 0;
      });

      const points = annees.map(a => ({ x: a, y: parAnnee[a] }));
      const n    = points.length;
      const sumX  = points.reduce((s, p) => s + p.x, 0);
      const sumY  = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
      const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const b = (sumY - a * sumX) / n;
      const pred2027 = Math.max(0, Math.round(a * 2027 + b));

      const croissance = parAnnee[2024] > 0
        ? (((parAnnee[2026] - parAnnee[2024]) / parAnnee[2024]) * 100).toFixed(1)
        : null;

      const scoreMenace = pred2027 + (parseFloat(croissance) || 0);

      return {
        candidat: d._id,
        parAnnee, total: d.total, pred2027,
        croissance: parseFloat(croissance),
        scoreMenace: Math.round(scoreMenace),
        niveau: scoreMenace > 500 ? "Critique" :
                scoreMenace > 200 ? "Élevé" :
                scoreMenace > 100 ? "Modéré" : "Faible"
      };
    });

    results.sort((a, b) => b.scoreMenace - a.scoreMenace);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// PRÉDICTION ZONES GÉOGRAPHIQUES STRATÉGIQUES 2027
// ════════════════════════════════════════════════════════════════════
exports.getZonesStrategiques = async (req, res) => {
  try {
    const annees = [2024, 2025, 2026];

    const data = await Brevet.aggregate([
      { $group: {
        _id: { juridiction: "$Juridiction", annee: "$Année de publication" },
        count: { $sum: 1 }
      }},
      { $group: {
        _id: "$_id.juridiction",
        annees: { $push: { annee: "$_id.annee", count: "$count" } },
        total:  { $sum: "$count" }
      }},
      { $match: { total: { $gte: 100 } } },
      { $sort: { total: -1 } }
    ]);

    const results = data.map(d => {
      const parAnnee = {};
      annees.forEach(a => {
        const found = d.annees.find(x => x.annee === a);
        parAnnee[a] = found ? found.count : 0;
      });

      const points = annees.map(a => ({ x: a, y: parAnnee[a] }));
      const n    = points.length;
      const sumX  = points.reduce((s, p) => s + p.x, 0);
      const sumY  = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
      const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const b = (sumY - a * sumX) / n;
      const pred2027 = Math.max(0, Math.round(a * 2027 + b));

      const croissance = parAnnee[2024] > 0
        ? (((parAnnee[2026] - parAnnee[2024]) / parAnnee[2024]) * 100).toFixed(1)
        : null;

      return {
        juridiction: d._id,
        parAnnee, total: d.total, pred2027,
        croissance: parseFloat(croissance),
        strategie: pred2027 > 15000 ? "Marché Clé" :
                   pred2027 > 5000  ? "Marché Porteur" :
                   pred2027 > 1000  ? "À Surveiller" : "Émergent"
      };
    });

    results.sort((a, b) => b.pred2027 - a.pred2027);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════
// AJOUT D'UN BREVET (temps réel)
// ════════════════════════════════════════════════════════════════════
exports.ajouterBrevet = async (req, res) => {
  try {
    const { titre, candidat, juridiction, annee, resume, typeDocument, statutLegal } = req.body;

    if (!titre || !candidat || !juridiction || !annee) {
      return res.status(400).json({
        error: "Champs obligatoires manquants : titre, candidat, juridiction, annee"
      });
    }

    const nouveauBrevet = new Brevet({
      "Titre":                       titre,
      "Candidats":                   candidat,
      "Juridiction":                 juridiction,
      "Année de publication":        parseInt(annee),
      "Résumé":                      resume || "",
      "Type de document":            typeDocument || "Patent Application",
      "Statut légal":                statutLegal || "UNKNOWN",
      "Cité par nombre de brevets":  0,
      "Cites le nombre de brevets":  0,
      "Nombre de séquences":         0,
      "Propriétaires":               "",
      "Inventeurs":                  "",
    });

    await nouveauBrevet.save();

    const [total, actifs, inconnus, avecResume] = await Promise.all([
      Brevet.countDocuments(),
      Brevet.countDocuments({ "Statut légal": "ACTIVE" }),
      Brevet.countDocuments({ "Statut légal": "UNKNOWN" }),
      Brevet.countDocuments({ "Résumé": { $ne: "" } }),
    ]);

    res.status(201).json({
      message: "Brevet ajouté avec succès",
      brevet: nouveauBrevet,
      kpisUpdated: { total, actifs, inconnus, avecResume, sansResume: total - avecResume }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};