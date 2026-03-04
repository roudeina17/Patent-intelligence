require('dotenv').config();
process.env.LANG = 'fr_FR.UTF-8';

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { demarrerAutoImport } = require('./services/autoImport');
const statsRoutes = require('./routes/statsRoutes');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});

connectDB().then(() => {
  demarrerAutoImport(); // ← lancé après MongoDB
});