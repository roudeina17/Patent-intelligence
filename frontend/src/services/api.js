import axios from 'axios';

const BASE = 'https://patent-intelligence-cr52.onrender.com/api/stats';
const api = axios.create({
  baseURL: BASE,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

export const getKPIs             = () => api.get('/kpis').then(res => res.data);
export const getByYear           = () => api.get('/year').then(res => res.data);
export const getByStatut         = () => api.get('/statut').then(res => res.data);
export const getTopCandidats     = () => api.get('/top-candidats').then(res => res.data);
export const getImpactScore      = () => api.get('/impact').then(res => res.data);
export const getJuridiction      = () => api.get('/juridiction').then(res => res.data);
export const getActiviteParAnnee = () => api.get('/activite').then(res => res.data);
export const getTopParJuridiction= () => api.get('/top-juridiction').then(res => res.data);
export const getTendance         = () => api.get('/tendance').then(res => res.data);
export const recherche           = (params) => api.get('/recherche', { params }).then(res => res.data);
export const getParDomaine       = () => api.get('/domaine').then(res => res.data);
export const getImpactParDomaine = () => api.get('/impact-domaine').then(res => res.data);
export const getTendanceTechno   = () => api.get('/tendance-techno').then(res => res.data);
export const getConcurrentsFuturs= () => api.get('/concurrents').then(res => res.data);
export const getZonesStrategiques= () => api.get('/zones').then(res => res.data);
export const ajouterBrevet       = (data) => api.post('/ajouter', data).then(res => res.data);