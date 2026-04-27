const User = require('../models/User');


// Mettre à jour les informations d'un livreur (accessible uniquement par l'admin)
const updateLivreur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Liste des champs autorisés à être modifiés par l'admin
    const allowedFields = [
      'nomComplet',
      'email',
      'telephone',
      'adresse',
      'status',
      'disponibilite',
    ];

    // Filtrer les champs non autorisés
    const filteredUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Vérifier que le livreur existe et a bien le rôle 'livreur'
    const livreur = await User.findOneAndUpdate(
      { _id: id, role: 'livreur' },
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-motDePasse');

    if (!livreur) {
      return res.status(404).json({ success: false, error: 'Livreur non trouvé' });
    }

    res.status(200).json({ success: true, data: livreur });
  } catch (error) {
    // Gérer l'erreur de duplication d'email (même si on ne le gère pas encore bien)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Cet email est déjà utilisé." });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};


module.exports = {updateLivreur};