const mongoose = require("mongoose"); // ODM (Object Document Mapper) pour MongoDB

/**
 * Connexion à la base de données MongoDB
 * Utilise 127.0.0.1 au lieu de "localhost" pour éviter
 * les problèmes de résolution DNS sur certaines machines
 */
const connectDB = async () => {
  try {
    // Connexion à la base "analyseDB" contenant la collection "brevets" (100 000 documents)
    await mongoose.connect("mongodb://127.0.0.1:27017/analyseDB");
    console.log("✅ MongoDB connecté");
  } catch (error) {
    // En cas d'échec, on arrête le serveur — l'API ne peut pas fonctionner sans la base
    console.error("❌ Erreur MongoDB:", error);
    process.exit(1); // Code 1 = arrêt forcé avec erreur
  }
};

module.exports = connectDB; // Exporté et appelé dans server.js au démarrage