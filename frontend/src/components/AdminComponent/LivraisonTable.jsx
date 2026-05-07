import React, { useState } from 'react';
import axios from '../../api/axios';

const LivraisonTable = ({ data, onToggleFilters, isFilterActive, refreshList, onEdit }) => {
    const [menuStatutOuvert, setMenuStatutOuvert] = useState(null);
    const statutsOptions = ['EN ATTENTE', 'EN COURS', 'LIVRÉ', 'ANNULÉ'];

    // Design Maquette pour les badges
    const getStatutStyle = (statut) => {
        const styles = {
            'LIVRÉ': 'bg-blue-50 text-blue-600 border-blue-100',
            'EN COURS': 'bg-cyan-50 text-cyan-600 border-cyan-100',
            'ANNULÉ': 'bg-red-50 text-red-600 border-red-100',
            'EN ATTENTE': 'bg-orange-50 text-orange-600 border-orange-100',
        };
        return styles[statut?.toUpperCase()] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    // Logique de changement de statut (reprise de ColisTable)
    const handleUpdateStatut = async (id, nouveauStatut, ancienStatut) => {
        if (window.confirm(`Changer le statut de "${ancienStatut}" vers "${nouveauStatut}" ?`)) {
            try {
                // On adapte l'URL pour les livraisons
                await axios.put(`/api/livraisons/${id}/status`, { status: nouveauStatut.toLowerCase() });
                refreshList();
            } catch (error) {
                console.error('Erreur changement statut:', error);
                alert('Erreur lors du changement de statut');
            }
        }
        setMenuStatutOuvert(null);
    };

    // Logique de suppression (reprise de ColisTable)
    const handleDelete = async (id, code) => {
        if (window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer la livraison ${code} ?`)) {
            try {
                await axios.delete(`/api/livraisons/${id}`);
                alert(`Livraison ${code} supprimée avec succès`);
                refreshList();
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
            {/* Header intégré */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Liste des expéditions</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={onToggleFilters}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            isFilterActive ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        <i className="bi bi-sliders"></i> Filtrer
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-slate-100 transition-all">
                        <i className="bi bi-download"></i> Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/30">
                        <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                            <th className="px-8 py-4">ID Colis</th>
                            <th className="px-8 py-4">Livreur</th>
                            <th className="px-8 py-4">Adresse Destinataire</th>
                            <th className="px-8 py-4">Statut</th>
                            <th className="px-8 py-4 text-right pr-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                {/* ID Colis */}
                                <td className="px-8 py-5 text-sm font-bold text-cyan-700">
                                    {item.codeSuivi || `#${item.code}`}
                                </td>

                                {/* Livreur */}
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-white shadow-sm">
                                            {item.livreurNom ? item.livreurNom.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.livreurNom || "Non assigné"}</p>
                                            <p className="text-[10px] text-slate-400">Véhicule: TD-V12</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Adresse */}
                                <td className="px-8 py-5">
                                    <p className="text-sm text-slate-600 font-medium">{item.adresse || item.destinataire?.adresse}</p>
                                    <p className="text-[10px] text-slate-400">Code: 75000</p>
                                </td>

                                {/* Statut (Menu interactif) */}
                                <td className="px-8 py-5 relative">
                                    <button 
                                        onClick={() => setMenuStatutOuvert(menuStatutOuvert === item._id ? null : item._id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatutStyle(item.statut)} cursor-pointer transition`}
                                    >
                                        <span className={`w-1 h-1 rounded-full ${item.statut === 'Livré' ? 'bg-blue-600' : 'bg-orange-600'}`}></span>
                                        {item.statut?.toUpperCase()}
                                        <i className="bi bi-chevron-down text-[8px]"></i>
                                    </button>
                                    {menuStatutOuvert === item._id && (
                                        <div className="absolute z-20 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in duration-200">
                                            {statutsOptions.map((s) => (
                                                <button 
                                                    key={s} 
                                                    onClick={() => handleUpdateStatut(item._id, s, item.statut)}
                                                    className="block w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                {/* Actions (Design ColisTable) */}
                                <td className="px-8 py-5 text-right pr-12">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <i className="bi bi-pencil-square text-lg"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id, item.codeSuivi)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <i className="bi bi-trash text-lg"></i>
                                        </button>
                                        <button
                                            onClick={() => alert(`Détails de la livraison ${item.codeSuivi}\n\n` +
                                                `Statut: ${item.statut}\n` +
                                                `Destinataire: ${item.destinataireNom}\n` +
                                                `Adresse: ${item.adresse}\n` +
                                                `Livreur: ${item.livreurNom || 'Non assigné'}`
                                            )}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            title="Détails"
                                        >
                                            <i className="bi bi-eye text-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivraisonTable;