const Livraison = require('../models/Livraison');

// Récupérer toutes les livraisons avec pagination
exports.getAllLivraisons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [livraisons, total] = await Promise.all([
      Livraison.find()
        .populate('idColis')
        .populate('idLivreur', 'nomComplet email telephone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Livraison.countDocuments()
    ]);

    res.json({
      success: true,
      data: livraisons,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




