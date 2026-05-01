const Livraison = require('../models/Livraison');
const Colis = require('../models/Colis');
const User = require('../models/User');

// COMPTER LES LIVRAISONS DU JOUR
const countLivraisonsJour = async (idLivreur, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return await Livraison.countDocuments({
    idLivreur,
    dateEstimee: { $gte: start, $lte: end },
    statut: { $ne: "annulée" }
  });
};

// GET LIVREURS DISPONIBLES
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
// ASSIGNER LIVRAISON
const assignerLivraison = async (req, res) => {
  try {
    const { idColis, idLivreur, dateEstimee } = req.body;

    // 1. Vérifier colis
    const colis = await Colis.findById(idColis);
    if (!colis) {
      return res.status(404).json({
        success: false,
        message: "Colis introuvable"
      });
    }

    if (colis.status !== "en attente") {
      return res.status(400).json({
        success: false,
        message: "Colis déjà assigné"
      });
    }

    // 2. Vérifier livreur
    const livreur = await User.findById(idLivreur);
    if (!livreur || livreur.role !== "livreur") {
      return res.status(404).json({
        success: false,
        message: "Livreur invalide"
      });
    }

    if (livreur.status !== "actif") {
      return res.status(400).json({
        success: false,
        message: "Livreur non actif"
      });
    }
   // Vérifier limite quotidienne AVANT création
const total = await countLivraisonsJour(idLivreur, dateEstimee);

if (total >= 5) {
  await User.findByIdAndUpdate(idLivreur, {
    disponibilite: false
  });

  return res.status(400).json({
    success: false,
    message: "Livreur a atteint la limite de 5 livraisons pour cette date"
  });
}
    // 3. Créer livraison
    const livraison = await Livraison.create({
      idColis,
      idLivreur,
      dateEstimee,
      statut: "en cours"
    });


    // 4. Update colis
    colis.status = "en cours";
    await colis.save();

    return res.status(201).json({
      success: true,
      message: "Livraison créée et assignée",
      data: livraison
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
  getLivreursDisponibles,
  assignerLivraison
};