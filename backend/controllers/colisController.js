// controllers/colisController.js
const Colis = require('../models/Colis');
const { sendTrackingEmail } = require("../services/emailService");

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
console.log("🔥 COLIS CONTROLLER V2 ACTIF");
console.log("🚨 CONTROLLER US10 EXECUTÉ");

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

    // Validation
    const champsManquants = [];
    if (!expediteurNomComplet) champsManquants.push("expediteurNomComplet");
    if (!expediteurTelephone) champsManquants.push("expediteurTelephone");
    if (!expediteurEmail) champsManquants.push("expediteurEmail");
    if (!expediteurAdresse) champsManquants.push("expediteurAdresse");
    if (!destinataireNomComplet) champsManquants.push("destinataireNomComplet");
    if (!destinataireTelephone) champsManquants.push("destinataireTelephone");
    if (!destinataireEmail) champsManquants.push("destinataireEmail");
    if (!destinataireAdresse) champsManquants.push("destinataireAdresse");

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

let emailResults = [];

try {
  const results = await Promise.all([
    sendTrackingEmail(expediteurEmail, codeSuivi),
    sendTrackingEmail(destinataireEmail, codeSuivi)
  ]);

  emailResults = results;
  console.log("📧 Email status :", emailResults);


} catch (err) {
  console.error("Erreur globale email :", err.message);
}
const [expediteurResult, destinataireResult] = emailResults;

return res.status(201).json({
  success: true,
  message: "Colis créé avec succès.",
  codeSuivi,
  emailStatus: {
    expediteur: expediteurResult || { success: false, error: "Non envoyé" },
    destinataire:  destinataireResult || { success: false, error: "Non envoyé" }
  },
  recipients: [expediteurEmail, destinataireEmail],
  data: colis,
});
  } catch (error) {
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

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du colis.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const getAllColis = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [colis, total] = await Promise.all([
      Colis.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
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
const updateColis = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifier ID valide
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID du colis requis"
      });
    }

    // 2. Trouver le colis
    const colis = await Colis.findById(id);

    if (!colis) {
      return res.status(404).json({
        success: false,
        message: "Colis introuvable"
      });
    }

    // 3. Liste des champs autorisés
    const allowedFields = [
      "poids",
      "expediteurNomComplet",
      "expediteurTelephone",
      "expediteurEmail",
      "expediteurAdresse",
      "destinataireNomComplet",
      "destinataireTelephone",
      "destinataireEmail",
      "destinataireAdresse"
    ];

    // 4. Mise à jour contrôlée
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        colis[key] = req.body[key];
      }
    });

    // 5. Validation métier
    if (colis.poids !== undefined && Number(colis.poids) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Le poids doit être supérieur à 0"
      });
    }

    // 6. Sauvegarde
    await colis.save();

    // 7. Réponse propre
    return res.status(200).json({
      success: true,
      message: "Colis modifié avec succès",
      data: colis
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la modification",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  }
};
const deleteColis = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifier ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID du colis requis"
      });
    }

    // 2. SUPPRESSION DIRECTE (PROPRE)
    const deleted = await Colis.findByIdAndDelete(id);

    // 3. Si rien trouvé
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Colis introuvable"
      });
    }

    // 4. Réponse OK
    return res.status(200).json({
      success: true,
      message: "Colis supprimé avec succès",
      deletedId: id
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression",
      error: error.message
    });
  }
};
module.exports = {
  createColis,
  getAllColis,
  updateColis,
  deleteColis
};