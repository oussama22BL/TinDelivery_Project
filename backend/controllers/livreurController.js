const User = require('../models/User');


// Mettre à jour les informations d'un livreur (accessible uniquement par l'admin)
const updateLivreur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'nomComplet',
      'email',
      'telephone',
      'adresse',
      'status',
      'disponibilite',
    ];

    const filteredUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Vérifier si l'email est modifié et s'il est déjà utilisé par un autre utilisateur
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: id }, // exclure l'utilisateur actuel
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé par un autre utilisateur.',
        });
      }
    }

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
    res.status(400).json({ success: false, error: error.message });
  }
};


module.exports = {updateLivreur};