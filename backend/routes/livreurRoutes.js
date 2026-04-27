const express = require('express');
const router = express.Router();
const { updateLivreur } = require('../controllers/livreurController');

// Route pour mettre à jour les informations d'un livreur (accessible uniquement par l'admin)
router.put('/:id', updateLivreur);

module.exports = router;