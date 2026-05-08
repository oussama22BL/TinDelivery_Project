import React, { useState } from 'react';
import axios from '../../api/axios';

const LivraisonTable = ({ data, onToggleFilters, isFilterActive, refreshList, onEdit, onDelete, onViewDetails }) => {
    const [menuStatutOuvert, setMenuStatutOuvert] = useState(null);
    const statutsOptions = ['EN ATTENTE', 'EN COURS', 'LIVRÉ', 'ANNULÉ'];

    // Design des badges
    const getStatutStyle = (statut) => {
        const styles = {
            'LIVRÉ': 'bg-blue-50 text-blue-600 border-blue-100',
            'EN COURS': 'bg-cyan-50 text-cyan-600 border-cyan-100',
            'ANNULÉ': 'bg-red-50 text-red-600 border-red-100',
            'EN ATTENTE': 'bg-orange-50 text-orange-600 border-orange-100',
        };
        // On met en majuscule pour comparer avec les styles
        return styles[statut?.toUpperCase()] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    const handleUpdateStatut = async (id, nouveauStatut) => {
        try {
            await axios.patch(`/api/livraisons/${id}`, { statut: nouveauStatut.toLowerCase() });
            refreshList();
        } catch (error) {
            console.error('Erreur statut:', error);
        }
        setMenuStatutOuvert(null);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Liste des expéditions</h2>
                <div className="flex gap-3">
                    <button onClick={onToggleFilters} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${isFilterActive ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                        <i className="bi bi-sliders"></i> Filtrer
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/30 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                        <tr>
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
                                {/* ID Colis corrigé */}
                                <td className="px-8 py-5 text-sm font-bold text-cyan-700">
                                    {item.idColis?.codeSuivi}
                                </td>

                                {/* Livreur corrigé (idLivreur.nomComplet) */}
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-white shadow-sm">
                                            {item.idLivreur ? item.idLivreur.nomComplet.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.idLivreur?.nomComplet || "Non assigné"}</p>
                                            <p className="text-[10px] text-slate-400">Tél: {item.idLivreur?.telephone || '---'}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Adresse corrigée (idColis.destinataireAdresse) */}
                                <td className="px-8 py-5">
                                    <p className="text-sm text-slate-600 font-medium">{item.idColis?.destinataireNomComplet}</p>
                                    <p className="text-[10px] text-slate-400">{item.idColis?.destinataireAdresse}</p>
                                </td>

                                {/* Statut */}
                                <td className="px-8 py-5 relative">
                                    <button 
                                        onClick={() => setMenuStatutOuvert(menuStatutOuvert === item._id ? null : item._id)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatutStyle(item.statut)} cursor-pointer transition uppercase`}
                                    >
                                        <span className={`inline-block w-1 h-1 rounded-full mr-1 ${item.statut === 'livré' ? 'bg-blue-600' : 'bg-orange-600'}`}></span>
                                        {item.statut} ▼
                                    </button>
                                    {menuStatutOuvert === item._id && (
                                        <div className="absolute z-20 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in zoom-in-95 duration-150">
                                            {statutsOptions.map((s) => (
                                                <button key={s} onClick={() => handleUpdateStatut(item._id, s)} className="block w-full text-left px-4 py-2 text-[10px] hover:bg-slate-50 font-bold text-slate-600">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                {/* Actions (Correction du codeSuivi pour onDelete) */}
                                <td className="px-8 py-5 text-right pr-12">
                                    <div className="flex justify-end gap-2 text-slate-400">
                                        <button onClick={() => onEdit(item)} className="p-2 hover:text-cyan-600 transition-colors" title="Modifier">
                                            <i className="bi bi-pencil-square text-lg"></i>
                                        </button>
                                        <button onClick={() => onDelete(item._id, item.idColis?.codeSuivi)} className="p-2 hover:text-red-500 transition-colors" title="Supprimer">
                                            <i className="bi bi-trash text-lg"></i>
                                        </button>
                                        <button onClick={() => onViewDetails(item)} className="p-2 hover:text-slate-600 transition-colors" title="Détails">
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