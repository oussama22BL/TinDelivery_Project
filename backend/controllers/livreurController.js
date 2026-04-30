// controllers/livreurController.js
/**
 * Contrôleur pour la gestion des livreurs
 * Endpoints: POST /api/livreurs, GET /api/livreurs
 */

const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../config/email');
const { sendWelcomeEmailAsync } = require('../utils/email_send');

/**
 * Génère un mot de passe aléatoire sécurisé
 * @param {number} length - Longueur du mot de passe (défaut: 16)
 * @param {Object} options - Options de génération
 * @returns {string} Mot de passe généré
 */
const generatePassword = (length = 16, options = {}) => {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  let charset = '';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers)   charset += '0123456789';
  if (symbols)   charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (charset.length === 0) {
    throw new Error('Au moins un type de caractère doit être autorisé');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  // Garantir qu'au moins un caractère de chaque type demandé est présent
  if (lowercase && !/[a-z]/.test(password)) {
    const pos = crypto.randomInt(0, length);
    password = password.substring(0, pos) + 
               'abcdefghijklmnopqrstuvwxyz'[crypto.randomInt(0, 26)] + 
               password.substring(pos + 1);
  }
  if (uppercase && !/[A-Z]/.test(password)) {
    const pos = crypto.randomInt(0, length);
    password = password.substring(0, pos) + 
               'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[crypto.randomInt(0, 26)] + 
               password.substring(pos + 1);
  }
  if (numbers && !/[0-9]/.test(password)) {
    const pos = crypto.randomInt(0, length);
    password = password.substring(0, pos) + 
               '0123456789'[crypto.randomInt(0, 10)] + 
               password.substring(pos + 1);
  }
  if (symbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    const pos = crypto.randomInt(0, length);
    password = password.substring(0, pos) + 
               '!@#$%^&*()_+-=[]{}|;:,.<>?'[crypto.randomInt(0, 25)] + 
               password.substring(pos + 1);
  }

  return password;
};

/**
 * POST /api/livreurs
 * Crée un nouveau livreur avec un mot de passe temporaire et envoie un email de bienvenue
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Données du livreur
 * @param {string} req.body.nomComplet - Nom complet du livreur
 * @param {string} req.body.email - Email unique du livreur
 * @param {string} req.body.telephone - Numéro de téléphone
 * @param {string} req.body.adresse - Adresse physique
 * @param {Object} res - Réponse Express
 */
const createLivreur = async (req, res) => {
  try {
    const { nomComplet, email, telephone, adresse } = req.body;

    // Validation des champs requis
    if (!nomComplet || !email || !telephone || !adresse) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont obligatoires: nomComplet, email, telephone, adresse',
      });
    }

    // Génération du mot de passe temporaire
    const plainPassword = generatePassword(12, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });

    // Création du livreur dans la base de données
    const livreur = await User.create({
      nomComplet,
      email,
      telephone,
      adresse,
      motDePasse: plainPassword,
      role: 'livreur',
      status: 'actif',
      disponibilite: true,
      nombreLivraison: 0,
    });

    // Retirer les champs sensibles de la réponse
    const { motDePasse, __v, ...livreurSansMdp } = livreur.toObject();

    // Envoyer la réponse succès
    res.status(201).json({
      success: true,
      data: livreurSansMdp,
      message: 'Livreur créé avec succès. Un email avec les identifiants a été envoyé.',
    });

    // Envoyer l'email de bienvenue (fire-and-forget)
    sendWelcomeEmailAsync(transporter, { nomComplet, email, plainPassword });

  } catch (error) {
    // Gérer l'erreur de duplication d'email (code MongoDB 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà.',
        field: 'email',
      });
    }

    // Log l'erreur complète pour debugging
    console.error('Erreur lors de la création du livreur:', error);

    // Répondre avec l'erreur
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la création du livreur.',
    });
  }
};

/**
 * GET /api/livreurs
 * Récupère la liste de tous les livreurs (sans les mots de passe)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await User.find({ role: 'livreur' })
      .select('-motDePasse')
      .lean();

    res.status(200).json({
      success: true,
      count: livreurs.length,
      data: livreurs,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livreurs:', error);

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des livreurs.',
    });
  }
};

module.exports = { createLivreur, getAllLivreurs };