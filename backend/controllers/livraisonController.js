const Livraison = require('../models/Livraison');
const User = require('../models/User');
const Colis = require('../models/Colis');

// Récupérer toutes les livraisons avec pagination
exports.getAllLivraisons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [livraisons, total] = await Promise.all([
      Livraison.find()
        .populate('idColis')
        .populate('idLivreur', 'nomComplet email telephone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Livraison.countDocuments()
    ]);

    res.json({
      success: true,
      data: livraisons,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Récupérer les statistiques de livraisons
exports.getStatsLivraisons = async (req, res) => {
  try {
    const [total, enAttente, enCours, livrees, annulees] = await Promise.all([
      Livraison.countDocuments(),
      Livraison.countDocuments({ statut: 'en attente' }),
      Livraison.countDocuments({ statut: 'en cours' }),
      Livraison.countDocuments({ statut: 'livrée' }),
      Livraison.countDocuments({ statut: 'annulée' })
    ]);

    res.json({
      success: true,
      stats: { total, enAttente, enCours, livrees, annulees }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mettre à jour une livraison (ex: changement de livreur, mise à jour du statut)
exports.updateLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    if (!livraison) return res.status(404).json({ error: 'Livraison introuvable' });
    if (['livrée', 'annulée'].includes(livraison.statut))
      return res.status(400).json({ error: 'Modification interdite sur une livraison terminée' });

    const { dateEstimee, statut, idColis, idLivreur, dateLivraison } = req.body;

     // ---- NOUVEAU : gérer le passage au statut "livrée" ----
    if (statut === 'livrée') {
      // Si on fournit une date de livraison, on l'utilise, sinon on prend la date actuelle
      livraison.dateLivraison = dateLivraison ? new Date(dateLivraison) : new Date();
      // Mettre à jour le colis correspondant
      await Colis.findByIdAndUpdate(livraison.idColis, {
        status: 'livré',
        dateLivraison: livraison.dateLivraison
      });
    }

    // Gestion changement de livreur
    if (idLivreur && idLivreur !== livraison.idLivreur?.toString()) {
      const livreur = await User.findOne({ _id: idLivreur, role: 'livreur' });
      if (!livreur) return res.status(404).json({ error: 'Livreur introuvable' });
      if (!livreur.disponibilite) return res.status(400).json({ error: 'Livreur non disponible' });

      const debut = new Date(); debut.setHours(0,0,0,0);
      const fin = new Date(); fin.setHours(23,59,59,999);
      const nb = await Livraison.countDocuments({
        idLivreur,
        _id: { $ne: livraison._id },
        createdAt: { $gte: debut, $lte: fin }
      });
      if (nb >= 10) return res.status(400).json({ error: 'Limite journalière atteinte' });

      // Mise à jour des compteurs
      await User.findByIdAndUpdate(livraison.idLivreur, { $inc: { nombreLivraison: -1 } });
      await User.findByIdAndUpdate(idLivreur, { $inc: { nombreLivraison: 1 } });
    }

    if (dateEstimee) livraison.dateEstimee = new Date(dateEstimee);
    if (statut) livraison.statut = statut;
    if (idColis) {
      const colis = await Colis.findById(idColis);
      if (!colis) return res.status(404).json({ error: 'Colis introuvable' });
      livraison.idColis = idColis;
    }
    if (idLivreur) livraison.idLivreur = idLivreur;

    await livraison.save();
    await livraison.populate(['idColis', { path: 'idLivreur', select: 'nomComplet email' }]);

    res.json({ success: true, data: livraison });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une livraison (ex: changement de livreur, mise à jour du statut)
exports.deleteLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    if (!livraison) return res.status(404).json({ error: 'Livraison introuvable' });
    if (livraison.statut === 'livrée') return res.status(400).json({ error: 'Impossible de supprimer une livraison livrée' });

    // Remettre le colis  livrée
    await Colis.findByIdAndUpdate(livraison.idColis, { status: 'livré' });

    

    await Livraison.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Livraison supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Marquer comme livrée pour livreur
exports.markLivraisonLivree = async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    if (!livraison) return res.status(404).json({ error: 'Livraison introuvable' });

    // Vérifier que le livreur connecté est bien assigné
    const livreurId = req.user.id || req.user._id; // Support id et _id
    if (livraison.idLivreur.toString() !== livreurId) {
      return res.status(403).json({ error: 'Vous n’êtes pas assigné à cette livraison' });
    }

    // Vérifier le statut actuel (ne peut pas être déjà livrée ou annulée)
    if (['livrée', 'annulée'].includes(livraison.statut)) {
      return res.status(400).json({ error: 'Cette livraison est déjà terminée' });
    }

    // Mise à jour du statut et de la date réelle
    livraison.statut = 'livrée';
    livraison.dateLivraison = req.body.dateLivraison ? new Date(req.body.dateLivraison) : new Date();
    await livraison.save();

    // Mise à jour du colis associé
    await Colis.findByIdAndUpdate(livraison.idColis, {
      status: 'livré',
      dateLivraison: livraison.dateLivraison
    });

    // (Optionnel) Incrémenter un compteur de livraisons réussies du livreur
    // const livreurId = req.user.id || req.user._id;
    // await User.findByIdAndUpdate(livreurId, { $inc: { livraisonsReussies: 1 } });

    res.json({ success: true, data: livraison });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Marquer comme annulée pour livreur
exports.markLivraisonAnnulee = async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    if (!livraison) return res.status(404).json({ error: 'Livraison introuvable' });

    // Vérifier que le livreur connecté est bien assigné
    const livreurId = req.user.id || req.user._id; // Support id et _id
    if (livraison.idLivreur.toString() !== livreurId) {
      return res.status(403).json({ error: 'Vous n’êtes pas assigné à cette livraison' });
    }

    if (['livrée', 'annulée'].includes(livraison.statut)) {
      return res.status(400).json({ error: 'Cette livraison est déjà terminée' });
    }

    livraison.statut = 'annulée';
    livraison.motifAnnulation = req.body.motif || 'Non spécifié';
    await livraison.save();

    // Mettre à jour le colis
    await Colis.findByIdAndUpdate(livraison.idColis, { status: 'annulé' });

    // Décrémenter le compteur de livraisons en cours du livreur
    
    await User.findByIdAndUpdate(livreurId, { $inc: { nombreLivraison: -1 } });

    res.json({ success: true, data: livraison });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLivreurStats = async (req, res) => {
  try {
    // Utiliser req.user.id (JWT) ou req.user._id (fallback)
    const idLivreur = req.user.id || req.user._id;

    const [total, enCours, livrees, annulees] = await Promise.all([
      Livraison.countDocuments({ idLivreur }),
      Livraison.countDocuments({ idLivreur, statut: { $in: ['en attente', 'en cours'] } }),
      Livraison.countDocuments({ idLivreur, statut: 'livrée' }),
      Livraison.countDocuments({ idLivreur, statut: 'annulée' })
    ]);

    res.json({
      success: true,
      stats: { total, enCours, livrees, annulees }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





