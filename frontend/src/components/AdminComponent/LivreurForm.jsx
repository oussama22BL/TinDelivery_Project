import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const LivreurForm = ({ refreshList, editingLivreur, setEditingLivreur, setShowForm }) => {
    // On ajoute 'adresse' ici pour correspondre au modèle Mongoose
    const [formData, setFormData] = useState({ 
        nomComplet: '', 
        email: '', 
        telephone: '', 
        adresse: '' 
    });

    useEffect(() => {
        if (editingLivreur) setFormData(editingLivreur);
    }, [editingLivreur]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLivreur) {
                await axios.put(`/api/livreurs/${editingLivreur._id}`, formData);
            } else {
                await axios.post('/api/livreurs', formData);
            }
            setEditingLivreur(null);
            setShowForm(false);
            refreshList();
            alert("Opération réussie !");
        } catch (err) { 
            // On affiche l'erreur précise du backend s'il y en a une
            alert(err.response?.data?.error || "Erreur lors de l'enregistrement"); 
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-gray-700 font-bold mb-4">{editingLivreur ? "Modifier le livreur" : "Nouveau Livreur"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <input 
                    placeholder="Nom Complet"
                    className="bg-gray-50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={formData.nomComplet}
                    onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
                    required
                />
                <input 
                    placeholder="Email" type="email"
                    className="bg-gray-50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input 
                    placeholder="Téléphone"
                    className="bg-gray-50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    required
                />
                <input 
                    placeholder="Adresse"
                    className="bg-gray-50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    required
                />
                <button type="submit" className="bg-[#0f172a] text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-all text-sm">
                    {editingLivreur ? "Mettre à jour" : "Créer le compte"}
                </button>
            </form>
        </div>
    );
};

export default LivreurForm;