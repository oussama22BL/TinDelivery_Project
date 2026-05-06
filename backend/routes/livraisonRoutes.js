const router = require('express').Router();
const { getAllLivraisons, getStatsLivraisons } = require('../controllers/livraisonController');

router.get('/', getAllLivraisons);
router.get('/stats', getStatsLivraisons);


module.exports = router;