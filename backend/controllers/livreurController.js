const User = require('../models/User');
const Livraison = require('../models/Livraison');


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


module.exports = {  deleteLivreur };