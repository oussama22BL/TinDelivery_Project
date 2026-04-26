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

module.exports = router;