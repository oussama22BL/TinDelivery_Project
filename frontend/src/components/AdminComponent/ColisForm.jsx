import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const ColisForm = ({ refreshList, editingColis, setEditingColis, setShowForm }) => {
  const [formData, setFormData] = useState({
    poids: '',
    expediteur: { nom: '', email: '', telephone: '', adresse: '' },
    destinataire: { nom: '', email: '', telephone: '', adresse: '' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingColis) {
      setFormData({
        poids: editingColis.poids || '',
        expediteur: editingColis.expediteur || { nom: '', email: '', telephone: '', adresse: '' },
        destinataire: editingColis.destinataire || { nom: '', email: '', telephone: '', adresse: '' }
      });
    }
  }, [editingColis]);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData({ ...formData, [section]: { ...formData[section], [field]: value } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingColis) {
        await axios.put(`/api/colis/${editingColis.id}`, formData);
        alert(`Colis #${editingColis.code} modifié avec succès`);
      } else {
        await axios.post('/api/colis', formData);
        alert(' Colis créé avec succès');
      }
      refreshList();
      setShowForm(false);
      setEditingColis(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        {editingColis ? ' Modifier le colis' : 'Créer un colis'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Poids (kg)</label>
          <input
            type="number"
            step="0.1"
            value={formData.poids}
            onChange={(e) => handleChange(null, 'poids', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            required
          />
        </div>

        {/* Expéditeur */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="font-semibold text-slate-800 mb-4"> Expéditeur</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Nom complet"
                value={formData.expediteur.nom}
                onChange={(e) => handleChange('expediteur', 'nom', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.expediteur.email}
              onChange={(e) => handleChange('expediteur', 'email', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.expediteur.telephone}
              onChange={(e) => handleChange('expediteur', 'telephone', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Adresse"
                value={formData.expediteur.adresse}
                onChange={(e) => handleChange('expediteur', 'adresse', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Destinataire */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="font-semibold text-slate-800 mb-4"> Destinataire</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Nom complet"
                value={formData.destinataire.nom}
                onChange={(e) => handleChange('destinataire', 'nom', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.destinataire.email}
              onChange={(e) => handleChange('destinataire', 'email', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.destinataire.telephone}
              onChange={(e) => handleChange('destinataire', 'telephone', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Adresse"
                value={formData.destinataire.adresse}
                onChange={(e) => handleChange('destinataire', 'adresse', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Annuler la saisie ? Les modifications seront perdues.')) {
                setShowForm(false);
                setEditingColis(null);
              }
            }}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColisForm;