const router = require('express').Router();
const { getAllLivraisons, getStatsLivraisons, updateLivraison } = require('../controllers/livraisonController');

router.get('/', getAllLivraisons);
router.get('/stats', getStatsLivraisons);
router.patch('/:id', updateLivraison);

module.exports = router;