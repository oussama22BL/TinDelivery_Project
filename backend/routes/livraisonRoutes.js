const router = require('express').Router();
const { getAllLivraisons, getStatsLivraisons, updateLivraison, deleteLivraison } = require('../controllers/livraisonController');

router.get('/', getAllLivraisons);
router.get('/stats', getStatsLivraisons);
router.patch('/:id', updateLivraison);
router.delete('/:id', deleteLivraison);

module.exports = router;