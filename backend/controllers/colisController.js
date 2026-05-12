// controllers/colisController.js
const Colis = require('../models/Colis');
const Livraison = require('../models/Livraison');
const User = require('../models/User');
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
    const statut = "en attente";

    const colis = await Colis.create({
      codeSuivi,
      poids,
      status: statut,
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
      "status",
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



const assignColisToLivreur = async (req, res) => {
  try {
    const { id } = req.params;
    const { idLivreur } = req.body;

    // --- Vérifier que le colis existe ---
    const colis = await Colis.findById(id);
    if (!colis) {
      return res.status(404).json({ success: false, error: 'Colis introuvable' });
    }

    // --- Vérifier le livreur ---
    const livreur = await User.findOne({ _id: idLivreur, role: 'livreur' });
    if (!livreur) {
      return res.status(404).json({ success: false, error: 'Livreur introuvable' });
    }

    // --- Vérifier la disponibilité ---
    if (!livreur.disponibilite) {
      return res.status(400).json({ success: false, error: 'Ce livreur n’est pas disponible actuellement.' });
    }

    // --- Vérifier la limite journalière de 10 livraisons ---
    const debutJour = new Date();
    debutJour.setHours(0, 0, 0, 0);
    const finJour = new Date();
    finJour.setHours(23, 59, 59, 999);

    const nbLivraisonsAujourdhui = await Livraison.countDocuments({
      idLivreur,
      createdAt: { $gte: debutJour, $lte: finJour }
    });

    if (nbLivraisonsAujourdhui >= 10) {
      return res.status(400).json({
        success: false,
        error: `Limite journalière atteinte : ${nbLivraisonsAujourdhui} livraisons déjà assignées aujourd’hui.`
      });
    }

    // --- Créer la livraison ---
    const livraison = await Livraison.create({
      idColis: id,
      idLivreur,
      dateEstimee:  new Date(Date.now() + 24 * 60 * 60 * 1000),
      // dateEstimee: req.body.dateEstimee ? new Date(req.body.dateEstimee) : new Date(Date.now() + 24 * 60 * 60 * 1000), // par défaut demain
      statut: 'en cours',
    });

    // --- Mise à jour du colis ---
    colis.status = 'en cours';
    await colis.save();

    // --- Mise à jour du compteur du livreur (optionnel mais cohérent) ---
    livreur.nombreLivraison = (livreur.nombreLivraison || 0) + 1;
    await livreur.save();

    res.status(201).json({
      success: true,
      message: 'Colis assigné au livreur avec succès.',
      livraison,
      colis: {
        id: colis._id,
        codeSuivi: colis.codeSuivi,
        status: colis.status,
        poids: colis.poids
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const trackColis = async (req, res) => {
  try {
    const { codeSuivi } = req.params;

    // 1. Trouver le colis par son code
    const colis = await Colis.findOne({ codeSuivi });

    if (!colis) {
      return res.status(404).json({ 
        success: false, 
        error: "Désolé, ce code de suivi n'est pas reconnu par notre système." 
      });
    }

    // 2. Trouver la livraison associée pour avoir les infos du livreur et la date estimée
    // On utilise populate pour récupérer le nom et le tel du livreur
    const livraison = await Livraison.findOne({ idColis: colis._id })
      .populate('idLivreur', 'nomComplet telephone email');

    // 3. Construction de l'historique (Timeline) basé sur les données réelles
    // Cela correspond au design de ta page ClientDashboard
    const historique = [
      { 
        status: "Expédition ramassée", 
        date: new Date(colis.createdAt).toLocaleDateString('fr-FR'), 
        location: "Entrepôt TinDelivery", 
        done: true 
      },
      { 
        status: "En transit vers la destination", 
        date: colis.status !== 'en attente' ? "Confirmé" : "En attente", 
        location: "Centre de tri local", 
        done: colis.status !== 'en attente' 
      },
      { 
        status: "Livraison prévue", 
        date: livraison ? new Date(livraison.dateEstimee).toLocaleDateString('fr-FR') : "À définir", 
        location: colis.destinataireAdresse, 
        done: colis.status === 'livrée' 
      }
    ];

    return res.status(200).json({
      success: true,
      colis,
      livraison,
      historique
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: "Erreur serveur lors de la récupération du suivi." 
    });
  }
};


module.exports = {
  createColis,
  getAllColis,
  updateColis,
  deleteColis,
  assignColisToLivreur,
  trackColis
};