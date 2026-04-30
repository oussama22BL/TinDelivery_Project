// routes/colisRoutes.js
const express = require('express');
const router = express.Router();
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

module.exports = router;