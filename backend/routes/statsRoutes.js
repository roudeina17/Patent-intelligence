const express = require('express');
const router = express.Router();
const stats = require('../controllers/statsController');

router.get('/kpis',              stats.getKPIs);
router.get('/by-year',           stats.getByYear);
router.get('/by-statut',         stats.getByStatut);
router.get('/top-candidats',     stats.getTopCandidats);
router.get('/impact',            stats.getImpactScore);
router.get('/juridiction',       stats.getByJuridiction);
router.get('/activite-annee',    stats.getActiviteParAnnee);
router.get('/top-juridiction',   stats.getTopParJuridiction);
router.get('/tendance',          stats.getTendance);
router.get('/recherche',         stats.recherche);
router.get('/domaine',           stats.getParDomaine);        
router.get('/impact-domaine',    stats.getImpactParDomaine);
router.get('/tendance-techno',   stats.getTendanceTechno);
router.get('/concurrents',       stats.getConcurrentsFuturs); 
router.get('/zones',             stats.getZonesStrategiques); 
router.post('/ajouter',          stats.ajouterBrevet);

module.exports = router;