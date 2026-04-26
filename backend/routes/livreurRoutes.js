// routes/livreurRoutes.js
const express = require('express');
const router = express.Router();
const { createLivreur, getAllLivreurs } = require('../controllers/livreurController');

router.post('/', createLivreur);
router.get('/', getAllLivreurs);

module.exports = router;