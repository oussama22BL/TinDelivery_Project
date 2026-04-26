// controllers/livreurController.js
const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../config/email');
const { sendWelcomeEmailAsync } = require('../utils/email_send');


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

  // S'assurer qu'il y a au moins un jeu de caractères
  if (charset.length === 0) {
    throw new Error('Au moins un type de caractère doit être autorisé');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  // Optionnel : garantir qu'au moins un caractère de chaque type demandé est présent
  // (pour satisfaire les politiques, mais complexifie un peu).
  // On va plutôt garantir que si un type est demandé, au moins un caractère est inclus.
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

// POST /api/livreurs
const createLivreur = async (req, res) => {
  try {
    const { nomComplet, email, telephone, adresse } = req.body;

    const plainPassword = generatePassword(12, {
      uppercase: true, lowercase: true, numbers: true, symbols: true
    });

    const livreur = await User.create({
      nomComplet, email, telephone, adresse,
      motDePasse: plainPassword,
      role: 'livreur',
      status: 'actif',
      disponibilite: true,
      nombreLivraison: 0,
    });

    // ✅ REMPLACE tout le bloc try/catch email par ces 2 lignes :
    const { motDePasse, __v, ...livreurSansMdp } = livreur.toObject(); // ← AJOUT __v
    res.status(201).json({
      success: true,
      data: livreurSansMdp,
      message: "Livreur créé avec succès. Un email avec les identifiants a été envoyé.",
    });

    sendWelcomeEmailAsync(transporter, { nomComplet, email, plainPassword }); // ← APRÈS res.json()

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Un utilisateur avec cet email existe déjà." });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET /api/livreurs (optionnel, pour lister les livreurs)
const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await User.find({ role: 'livreur' }).select('-motDePasse');
    res.status(200).json({ success: true, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createLivreur, getAllLivreurs };