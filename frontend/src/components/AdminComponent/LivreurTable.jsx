import React from 'react';
import axios from '../../api/axios';

const LivreurTable = ({ livreurs, refreshList, onEdit }) => {

    // Fonction pour changer le statut (Actif/Inactif) au clic
    const toggleStatus = async (livreur) => {
        try {
            // Utilise l'endpoint PATCH pour changeStatus
            await axios.patch(`/api/livreurs/${livreur._id}/status`);
            refreshList(); // Mise à jour instantanée du tableau
        } catch (err) { 
            console.error("Erreur toggle statut:", err.response?.data);
            alert(err.response?.data?.error || "Erreur lors du changement de statut");
        }
    };

    // Fonction pour la suppression
    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce livreur ?")) {
            try {
                await axios.delete(`/api/livreurs/${id}`);
                alert("Livreur supprimé avec succès");
                refreshList();
            } catch (err) {
                console.error("Erreur suppression:", err.response?.data);
                alert(err.response?.data?.error || "Erreur lors de la suppression");
            }
        }
   };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-0">
                {/* HEADER : Couleur Cyan-50 comme les lignes paires */}
                <thead className="bg-cyan-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                        <th className="py-4 px-6">Nom</th>
                        <th className="py-4 px-6">Disponibilité</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6 text-center">Statut</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {livreurs.map((l) => (
                        <tr key={l._id} className="transition-all even:bg-cyan-50/50"> 
                            <td className="py-5 px-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm">
                                        {l.nomComplet.charAt(0)}{l.nomComplet.split(' ')[1]?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm leading-tight">{l.nomComplet}</p>
                                        <p className="text-[10px] text-slate-300 font-bold mt-1">ID: TD-{l._id.slice(-5).toUpperCase()}</p>
                                    </div>
                                </div>
                            </td>

                            {/* DISPONIBILITÉ : SIMPLE INDICATEUR (NON CLIQUABLE) */}
                            <td className="py-5 px-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 w-fit border-2 ${
                                    l.disponibilite 
                                    ? 'bg-white text-cyan-600 border-cyan-100' 
                                    : 'bg-white text-red-500 border-red-100'
                                }`}>
                                    <span className={`text-[8px] ${l.disponibilite ? 'text-cyan-500' : 'text-red-500'}`}>●</span> 
                                    {l.disponibilite ? 'Disponible' : 'Occupé'}
                                </span>
                            </td>

                            <td className="py-5 px-6 text-xs font-semibold text-slate-500">{l.email}</td>

                            {/* STATUT : TOUJOURS CLIQUABLE */}
                            <td className="py-5 px-6 text-center">
                                <button 
                                    onClick={() => toggleStatus(l)}
                                    title="Cliquer pour changer le statut"
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all active:scale-95 cursor-pointer ${
                                        l.status === 'actif' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-red-100 text-red-600 hover:bg-red-200'
                                    }`}
                                >
                                    {l.status}
                                </button>
                            </td>

                            <td className="py-5 px-6 text-right">
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => onEdit(l)} className="text-slate-300 hover:text-cyan-600 transition-all hover:scale-125">
                                        <i className="bi bi-pencil-square text-lg"></i>
                                    </button>
                                    <button onClick={() => handleDelete(l._id)} className="text-slate-300 hover:text-red-500 transition-all hover:scale-125">
                                        <i className="bi bi-three-dots-vertical text-xl"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivreurTable;