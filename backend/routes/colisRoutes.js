// routes/colisRoutes.js
const express = require('express');
const router = express.Router();
const { createColis, getAllColis, updateColis } = require('../controllers/colisController');
const { createColis, getAllColis } = require('../controllers/colisController');

/**
 * @route   POST /api/colis
 * @desc    Créer un nouveau colis
 * @access  Admin
 */
router.post('/', createColis);

/**
 * @route   GET /api/colis
 * @desc    Récupérer tous les colis (pagination supportée via query params)
 * @access  Admin
 */
router.get('/', getAllColis);
// Route pour mettre à jour un colis 
router.put('/:id', updateColis);

module.exports = router;