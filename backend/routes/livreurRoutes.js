const express = require('express');
const router = express.Router();
const { deleteLivreur } = require('../controllers/livreurController');



// DELETE /api/livreurs/:id
router.delete('/:id', deleteLivreur);

module.exports = router;