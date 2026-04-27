// routes/livreurRoutes.js
const express = require('express');
const router = express.Router();
const { searchLivreursByNom} = require('../controllers/livreurController');



// GET /api/livreurs/search?q=karim
router.get('/search', searchLivreursByNom);

module.exports = router;