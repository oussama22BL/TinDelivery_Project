const express = require('express');
const router = express.Router();

const { assignerLivraison } = require('../controllers/livraisonController');

// API
router.post('/assign', assignerLivraison);

module.exports = router;