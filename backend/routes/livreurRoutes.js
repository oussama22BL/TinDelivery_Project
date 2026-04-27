// routes/livreurRoutes.js
const express = require('express');
const router = express.Router();
const { searchLivreursByNom, getLivreursByDisponibilite} = require('../controllers/livreurController');



// GET /api/livreurs/search?q=karim
router.get('/search', searchLivreursByNom);

// GET /api/livreurs/available
router.get('/available', getLivreursByDisponibilite(true));

// GET /api/livreurs/not-available
router.get('/not-available', getLivreursByDisponibilite(false));

module.exports = router;