import React from 'react';
import axios from '../../api/axios';

const LivreurTable = ({ livreurs, refreshList, onEdit }) => {

    // Fonction pour changer la disponibilité
    const toggleDispo = async (livreur) => {
        try {
            // On envoie l'objet complet avec juste la dispo inversée pour éviter les erreurs de validation
            await axios.put(`/api/livreurs/${livreur._id}`, { 
                ...livreur,
                disponibilite: !livreur.disponibilite 
            });
            refreshList(); 
        } catch (err) { 
            console.error("Erreur toggle dispo:", err.response?.data);
            alert("Erreur: " + (err.response?.data?.error || "Impossible de changer la disponibilité"));
        }
    };

    // Fonction pour changer le statut
    const toggleStatus = async (livreur) => {
        const newStatus = livreur.status === 'actif' ? 'inactif' : 'actif';
        try {
            await axios.put(`/api/livreurs/${livreur._id}`, { 
                ...livreur,
                status: newStatus 
            });
            refreshList();
        } catch (err) { 
            console.error("Erreur toggle statut:", err.response?.data);
            alert("Erreur: " + (err.response?.data?.error || "Impossible de changer le statut"));
        }
    };

    const handleDelete = async (id) => {
    // Fenêtre de confirmation
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce livreur ?")) {
            try {
                // APPEL API DELETE
                await axios.delete(`/api/livreurs/${id}`);
                alert("Livreur supprimé avec succès");
                refreshList(); // Rafraîchit le tableau
            } catch (err) {
                console.error("Erreur suppression:", err.response?.data);
                alert(err.response?.data?.error || "Erreur lors de la suppression");
            }
        }
   };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-0">
                {/* HEADER : Même couleur que les lignes paires (Cyan-50) */}
                <thead className="bg-cyan-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                        <th className="py-4 px-6">Nom</th>
                        <th className="py-4 px-6">Disponibilité</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Téléphone</th>
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

                            <td className="py-5 px-6">
                                <button 
                                    onClick={() => toggleDispo(l)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 w-fit border-2 transition-all active:scale-95 cursor-pointer ${
                                        l.disponibilite ? 'bg-white text-cyan-600 border-cyan-100' : 'bg-white text-red-500 border-red-100'
                                    }`}
                                >
                                    <span className={`text-[8px] ${l.disponibilite ? 'text-cyan-500' : 'text-red-500'}`}>●</span> 
                                    {l.disponibilite ? 'Disponible' : 'Occupé'}
                                </button>
                            </td>

                            <td className="py-5 px-6 text-xs font-semibold text-slate-500">{l.email}</td>
                            <td className="py-5 px-6 text-xs font-semibold text-slate-500">{l.telephone}</td>

                            <td className="py-5 px-6 text-center">
                                <button 
                                    onClick={() => toggleStatus(l)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all active:scale-95 cursor-pointer ${
                                        l.status === 'actif' ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'
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