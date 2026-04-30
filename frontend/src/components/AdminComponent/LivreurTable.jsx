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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                        <th className="p-4">Nom</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Téléphone</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {livreurs.map((l) => (
                        <tr key={l._id} className="hover:bg-cyan-50/50 transition-colors">
                            <td className="p-4 font-medium text-slate-700">{l.nomComplet}</td>
                            <td className="p-4 text-slate-500">{l.email}</td>
                            <td className="p-4 text-slate-500">{l.telephone}</td>
                            <td className="p-4">
                                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    ● Disponible
                                </span>
                            </td>
                            <td className="p-4 flex justify-center gap-4">
                                <button onClick={() => onEdit(l)} className="text-blue-500 hover:scale-110 transition-transform">✏️</button>
                                <button onClick={() => handleDelete(l._id)} className="text-red-500 hover:scale-110 transition-transform">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivreurTable;