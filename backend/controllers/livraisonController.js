const Livraison = require('../models/Livraison');
const Colis = require('../models/Colis');
const User = require('../models/User');

// ===============================
// 🟢 GET LIVREURS DISPONIBLES
// ===============================
const getLivreursDisponibles = async (req, res) => {
  try {
    const livreurs = await User.find({
      role: "livreur",
      status: "actif",
      disponibilite: true
    }).select("-motDePasse");

    return res.status(200).json({
      success: true,
      count: livreurs.length,
      data: livreurs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

module.exports = {
  getLivreursDisponibles
};