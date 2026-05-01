const express = require('express');
const router = express.Router();
const {
  assignerLivraison,
  reassignLivreur,
  terminerLivraison
} = require('../controllers/livraisonController');

router.post('/assign', assignerLivraison);
router.put('/reassign', reassignLivreur);
router.put('/finish/:idLivraison', terminerLivraison);

module.exports = router;