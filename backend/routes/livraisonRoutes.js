const express = require('express');
const router = express.Router();

const { getLivreursDisponibles } = require('../controllers/livraisonController');

// API
router.get('/livreurs-disponibles', getLivreursDisponibles);

module.exports = router;