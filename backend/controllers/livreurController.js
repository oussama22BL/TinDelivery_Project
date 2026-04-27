
const User = require('../models/User');


// Recherche par nomComplet (recherche partielle, insensible à la casse)
const searchLivreursByNom = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, error: "Le paramètre 'q' est requis." });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      role: 'livreur',
      nomComplet: { $regex: query, $options: 'i' }
    };

    const [livreurs, total] = await Promise.all([
      User.find(filter).select('-motDePasse').sort({ nomComplet: 1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: livreurs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Filtrage par disponibilité (true = disponibles, false = non disponibles)
const getLivreursByDisponibilite = (disponible) => async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: 'livreur', disponibilite: disponible };

    const [livreurs, total] = await Promise.all([
      User.find(filter).select('-motDePasse').sort({ nomComplet: 1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: livreurs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {searchLivreursByNom, getLivreursByDisponibilite};