/**
 * Contrôleur pour la gestion des livreurs
 */
const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../config/email');
const { sendWelcomeEmailAsync } = require('../utils/email_send');
const Livraison = require('../models/Livraison');
/**
 * Génère un mot de passe aléatoire sécurisé
 */
const generatePassword = (length = 16, options = {}) => {
  const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;
  let charset = '';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers)   charset += '0123456789';
  if (symbols)   charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[crypto.randomInt(0, charset.length)];
  }
  return password;
};

/**
 * POST /api/livreurs - Création
 */
const createLivreur = async (req, res) => {
  try {
    const { nomComplet, email, telephone, adresse } = req.body;
    if (!nomComplet || !email || !telephone || !adresse) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires' });
    }

    const plainPassword = generatePassword(12);
    const livreur = await User.create({
      nomComplet, email, telephone, adresse,
      motDePasse: plainPassword,
      role: 'livreur', status: 'actif', disponibilite: true, nombreLivraison: 0,
    });

    const { motDePasse, ...livreurSansMdp } = livreur.toObject();
    res.status(201).json({ success: true, data: livreurSansMdp });

    sendWelcomeEmailAsync(transporter, { nomComplet, email, plainPassword });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/livreurs - Liste complète
 */
const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await User.find({ role: 'livreur' }).select('-motDePasse').lean();
    res.status(200).json({ success: true, count: livreurs.length, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteLivreur = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier d'abord que le livreur existe
    const livreur = await User.findOne({ _id: id, role: 'livreur' });
    if (!livreur) {
      return res.status(404).json({ success: false, error: 'Livreur non trouvé' });
    }

    // Vérifier s'il a des livraisons en cours (statut non final)
    const livraisonsActives = await Livraison.countDocuments({
      idLivreur: id,
      statut: { $in: ['en préparation', 'en cours'] }
    });

    if (livraisonsActives > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer ce livreur : ${livraisonsActives} livraison(s) active(s) lui sont encore affectée(s).`
      });
    }

    // Si tout est bon, on supprime
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/livreurs/search - Recherche par nom
 */
const searchLivreursByNom = async (req, res) => {
  try {
    const query = req.query.q;
    const filter = { role: 'livreur', nomComplet: { $regex: query, $options: 'i' } };
    const livreurs = await User.find(filter).select('-motDePasse');
    res.status(200).json({ success: true, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Filtrage par disponibilité
 */
const getLivreursByDisponibilite = (disponible) => async (req, res) => {
  try {
    const filter = { role: 'livreur', disponibilite: disponible };
    const livreurs = await User.find(filter).select('-motDePasse');
    res.status(200).json({ success: true, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ON EXPORTE TOUT D'UN COUP ICI A LA FIN
module.exports = { 
    createLivreur, 
    getAllLivreurs, 
    searchLivreursByNom, 
    getLivreursByDisponibilite ,
    deleteLivreur
};

