// controllers/livreurController.js
const User = require('../models/User');

// POST /api/livreurs
const createLivreur = async (req, res) => {
  try {
    // Extraire les champs nécessaires (on ignore role, status, etc. envoyés par le client)
    const { nomComplet, email, telephone, adresse, motDePasse } = req.body;

    // Créer l'utilisateur avec le rôle forcé à 'livreur' et les valeurs par défaut
    const livreur = await User.create({
      nomComplet,
      email,
      telephone,
      adresse,
      motDePasse,
      role: 'livreur',           // forcé
      status: 'actif',           // défaut
      disponibilite: true,       // défaut
      nombreLivraison: 0,        // défaut
    });

    // Ne pas renvoyer le mot de passe
    const { motDePasse: _, ...livreurSansMdp } = livreur.toObject();
    res.status(201).json({ success: true, data: livreurSansMdp });
  } catch (error) {
    // Gérer l'erreur de duplication email
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