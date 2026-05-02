const express = require('express');
const router = express.Router();
const { createLivreur, getAllLivreurs, searchLivreursByNom, getLivreursByDisponibilite, deleteLivreur, updateLivreur, changeStatus } = require('../controllers/livreurController');


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



// GET /api/livreurs/search?q=karim
router.get('/search', searchLivreursByNom);

// GET /api/livreurs/available
router.get('/available', getLivreursByDisponibilite(true));

// GET /api/livreurs/not-available
router.get('/not-available', getLivreursByDisponibilite(false));


// DELETE /api/livreurs/:id
router.delete('/:id', deleteLivreur);

// Route pour mettre à jour les informations d'un livreur (accessible uniquement par l'admin)
router.put('/:id', updateLivreur);

// PATCH /api/livreurs/:id/status
router.patch('/:id/status', changeStatus);

module.exports = router;