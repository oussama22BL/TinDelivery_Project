const router = require('express').Router();
const auth = require('../middleware/auth');
const isLivreur = require('../middleware/isLivreur');
const { getAllLivraisons, getStatsLivraisons, updateLivraison, deleteLivraison, markLivraisonAnnulee, markLivraisonLivree } = require('../controllers/livraisonController');

router.get('/', getAllLivraisons);
router.get('/stats', getStatsLivraisons);
router.patch('/:id', updateLivraison);
router.delete('/:id', deleteLivraison);

// Routes protégées pour le livreur
router.patch('/livreur/:id/livree', auth, isLivreur, markLivraisonLivree);
router.patch('/livreur/:id/annulee', auth, isLivreur, markLivraisonAnnulee);

module.exports = router;