require('dotenv').config();
process.env.LANG = 'fr_FR.UTF-8';

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { demarrerAutoImport } = require('./services/autoImport');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/stats', statsRoutes);

app.listen(3000, () => {
  console.log('🚀 Serveur sur http://localhost:3000');
});

connectDB().then(() => {
  demarrerAutoImport(); // ← lancé après MongoDB
});