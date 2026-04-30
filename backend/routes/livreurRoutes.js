/**
 * Routes pour la gestion des livreurs
 * Endpoints:
 *   POST   /api/livreurs         - Créer un nouveau livreur
 *   GET    /api/livreurs         - Lister tous les livreurs
 */

const express = require('express');
const router = express.Router();
const { createLivreur, getAllLivreurs } = require('../controllers/livreurController');

/**
 * POST /api/livreurs
 * Crée un nouveau livreur avec mot de passe temporaire
 * Body: { nomComplet, email, telephone, adresse }
 */
router.post('/', createLivreur);

/**
 * GET /api/livreurs
 * Récupère la liste de tous les livreurs
 */
router.get('/', getAllLivreurs);
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