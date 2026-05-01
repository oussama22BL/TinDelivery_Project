const express = require('express');
const router = express.Router();

const { getLivreursDisponibles,assignerLivraison } = require('../controllers/livraisonController');

// API
router.get('/livreurs-disponibles', getLivreursDisponibles);
router.post('/assign', assignerLivraison);

module.exports = router;