const router = require('express').Router();
const { getAllLivraisons } = require('../controllers/livraisonController');

router.get('/', getAllLivraisons);


module.exports = router;