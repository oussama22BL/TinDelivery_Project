// controllers/colisController.js
const Colis = require('../models/Colis');

/**
 * @desc    Créer un nouveau colis
 * @route   POST /api/colis
 * @access  Admin
 */

const generateTrackingCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `TD-${date}-${random}`;
};

const createColis = async (req, res) => {
  try {
    const {
      poids,
      expediteurNomComplet,
      expediteurTelephone,
      expediteurEmail,
      expediteurAdresse,
      destinataireNomComplet,
      destinataireTelephone,
      destinataireEmail,
      destinataireAdresse,
    } = req.body;

    // Validation : champs manquants
    const champsManquants = [];
    if (!expediteurNomComplet)  champsManquants.push("expediteurNomComplet");
    if (!expediteurTelephone)   champsManquants.push("expediteurTelephone");
    if (!expediteurEmail)       champsManquants.push("expediteurEmail");
    if (!expediteurAdresse)     champsManquants.push("expediteurAdresse");
    if (!destinataireNomComplet) champsManquants.push("destinataireNomComplet");
    if (!destinataireTelephone) champsManquants.push("destinataireTelephone");
    if (!destinataireEmail)     champsManquants.push("destinataireEmail");
    if (!destinataireAdresse)   champsManquants.push("destinataireAdresse");

    // Validation : poids séparée (cas poids = 0)
    if (poids === undefined || poids === null || poids === "") {
      champsManquants.push("poids");
    }

    if (champsManquants.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants.",
        errors: champsManquants.map((champ) => ({
          champ,
          message: `Le champ "${champ}" est obligatoire.`,
        })),
      });
    }

    // Validation : poids positif
    if (Number(poids) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Données invalides.",
        errors: [{ champ: "poids", message: "Le poids doit être supérieur à 0." }],
      });
    }
    const codeSuivi = generateTrackingCode();
    const colis = await Colis.create({
      codeSuivi,
      poids,
      expediteurNomComplet,
      expediteurTelephone,
      expediteurEmail,
      expediteurAdresse,
      destinataireNomComplet,
      destinataireTelephone,
      destinataireEmail,
      destinataireAdresse,
    });

    return res.status(201).json({
      success: true,
      message: "Colis créé avec succès.",
      //codeSuivi,

      data: colis,
      
    });

  } catch (error) {
    // Erreur de validation Mongoose → 400
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Données invalides.",
        errors: Object.values(error.errors).map((e) => ({
          champ: e.path,
          message: e.message,
        })),
      });
    }

    // Erreur serveur → 500 (message interne masqué en production)
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du colis.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

/**
 * @desc    Récupérer tous les colis (avec pagination)
 * @route   GET /api/colis?page=1&limit=20
 * @access  Admin
 */
const getAllColis = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [colis, total] = await Promise.all([
      Colis.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Colis.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Liste des colis récupérée avec succès.",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: colis,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des colis.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

module.exports = {
  createColis,
  getAllColis,
};