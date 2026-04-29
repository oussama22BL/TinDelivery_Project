const User = require('../models/User');


const deleteLivreur = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprime uniquement si l'utilisateur a le rôle 'livreur'
    const livreur = await User.findOneAndDelete({ _id: id, role: 'livreur' });

    if (!livreur) {
      return res.status(404).json({ success: false, error: 'Livreur non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {  deleteLivreur };