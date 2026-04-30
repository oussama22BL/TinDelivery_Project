import React from 'react';
import axios from '../../api/axios';

const LivreurTable = ({ livreurs, refreshList, onEdit }) => {

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce livreur ?")) {
            await axios.delete(`/api/livreurs/${id}`);
            refreshList();
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-gray-400 text-[11px] uppercase border-b border-gray-50 font-bold">
                    <tr>
                        <th className="pb-4 px-4">Nom</th>
                        <th className="pb-4 px-4">Disponibilité</th>
                        <th className="pb-4 px-4">Email</th>
                        <th className="pb-4 px-4">Téléphone</th>
                        <th className="pb-4 px-4">Statut</th>
                        <th className="pb-4 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {Array.isArray(livreurs) && livreurs.map((l) => (
                        <tr key={l._id} className="hover:bg-gray-50/50 transition-all">
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                                        {l.nomComplet.charAt(0)}
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">{l.nomComplet}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                {l.disponibilite ? (
                                    <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">● Disponible</span>
                                ) : (
                                    <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">● Inaccessible</span>
                                )}
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-500">{l.email}</td>
                            <td className="py-4 px-4 text-sm text-slate-500">{l.telephone}</td>
                            <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${l.status === 'actif' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                                    {l.status}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-2 text-lg">
                                    <button onClick={() => onEdit(l)} className="text-slate-400 hover:text-cyan-600">✏️</button>
                                    <button onClick={() => handleDelete(l._id)} className="text-slate-400 hover:text-red-500 text-xl">⋮</button>
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