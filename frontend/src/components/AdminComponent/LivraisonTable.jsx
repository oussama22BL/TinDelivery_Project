import React, { useState } from 'react';
import axios from '../../api/axios';

const LivraisonTable = ({ data, onToggleFilters, isFilterActive, refreshList, onEdit, onDelete, onViewDetails }) => {
    const [menuStatutOuvert, setMenuStatutOuvert] = useState(null);
    const statutsOptions = ['EN ATTENTE', 'EN COURS', 'LIVRÉ', 'ANNULÉ'];

    const backendStatusMap = {
        'EN ATTENTE': 'en attente',
        'EN COURS': 'en cours',
        'LIVRÉ': 'livrée',
        'ANNULÉ': 'annulée'
    };

    const getStatutStyle = (statut) => {
        const s = statut?.toLowerCase();
        if (s === 'livrée') return 'bg-blue-50 text-blue-600 border-blue-100';
        if (s === 'annulée') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-cyan-50 text-cyan-600 border-cyan-100'; 
    };

    const handleUpdateStatut = async (id, label) => {
        try {
            await axios.patch(`/api/livraisons/${id}`, { statut: backendStatusMap[label] });
            // --- ACTION PROFESSIONNELLE : REFRESH IMMEDIAT ---
            await refreshList(); 
            setMenuStatutOuvert(null);
        } catch (error) { 
            console.error(error); 
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Liste des expéditions</h2>
                <button 
                    onClick={onToggleFilters} 
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${isFilterActive ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                    <i className="bi bi-sliders"></i> Filtrer
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/30 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-4">ID Colis</th>
                            <th className="px-8 py-4">Livreur</th>
                            <th className="px-8 py-4">Destinataire</th>
                            <th className="px-8 py-4">Statut</th>
                            <th className="px-8 py-4 text-right pr-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5 text-sm font-bold text-cyan-700">{item.idColis?.codeSuivi}</td>
                                
                                <td className="px-8 py-5">
                                    <p className="text-sm font-bold text-slate-800">{item.idLivreur?.nomComplet || "Non assigné"}</p>
                                    <p className="text-[10px] text-slate-400">{item.idLivreur?.telephone || '---'}</p>
                                </td>

                                <td className="px-8 py-5">
                                    <p className="text-sm text-slate-600 font-medium">{item.idColis?.destinataireNomComplet}</p>
                                    <p className="text-[10px] text-slate-400">{item.idColis?.destinataireAdresse}</p>
                                </td>

                                <td className="px-8 py-5 relative">
                                 <button 
                                    onClick={() => {
                                        // Si le statut est final, on ne permet pas d'ouvrir le menu
                                        if (item.statut === 'livrée' || item.statut === 'annulée') {
                                            onInfo("Livraison Terminée", "Le statut d'un colis livré ou annulé ne peut plus être modifié.");
                                            return;
                                        }
                                        setMenuStatutOuvert(menuStatutOuvert === item._id ? null : item._id);
                                    }}
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatutStyle(item.statut)} 
                                    ${(item.statut === 'livrée' || item.statut === 'annulée') ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'} transition uppercase`}
                                >
                                    <span className={`...`}></span>
                                    {item.statut === 'en attente' ? 'EN COURS' : item.statut} ▼
                                </button>
                                    {menuStatutOuvert === item._id && (
                                        <div className="absolute z-20 mt-1 w-32 bg-white border rounded-xl shadow-xl py-1 animate-in zoom-in-95">
                                            {statutsOptions.map((s) => (
                                                <button key={s} onClick={() => handleUpdateStatut(item._id, s)} className="block w-full text-left px-4 py-2 text-[10px] hover:bg-slate-50 font-bold text-slate-600">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                <td className="px-8 py-5 text-right pr-12">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-cyan-600" title="Modifier"><i className="bi bi-pencil-square"></i></button>
                                        <button onClick={() => onDelete(item._id, item.idColis?.codeSuivi)} className="p-2 text-slate-400 hover:text-red-500" title="Supprimer"><i className="bi bi-trash"></i></button>
                                        <button onClick={() => onViewDetails(item)} className="p-2 text-slate-400 hover:text-slate-600" title="Détails"><i className="bi bi-eye"></i></button>
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