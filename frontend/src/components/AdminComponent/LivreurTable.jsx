import React from 'react';
import axios from '../../api/axios';

const LivreurTable = ({ data, onToggleFilters, isFilterActive, refreshList, onEdit, onDelete }) => {
    const toggleStatus = async (livreur) => {
        try {
            await axios.patch(`/api/livreurs/${livreur._id}/status`);
            await refreshList();
        } catch (err) { alert("Erreur statut"); }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Liste des collaborateurs</h3>
                <button 
                    onClick={onToggleFilters}
                    className={`p-2 px-4 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${isFilterActive ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'}`}
                >
                    <i className={`bi ${isFilterActive ? 'bi-sliders' : 'bi-funnel-fill'}`}></i>
                    <span>Filtrer</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="py-4 px-8">Nom / ID</th>
                            <th className="py-4 px-8">Disponibilité</th>
                            <th className="py-4 px-8">Contact</th>
                            <th className="py-4 px-8 text-center">Statut</th>
                            <th className="py-4 px-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((l) => (
                            <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-200">{l.nomComplet.substring(0, 2).toUpperCase()}</div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm leading-tight">{l.nomComplet}</p>
                                            <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5">TD-{l._id.slice(-5).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-8">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 w-fit border ${l.disponibilite ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                        <span className={`w-1 h-1 rounded-full ${l.disponibilite ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        {l.disponibilite ? 'Disponible' : 'Occupé'}
                                    </span>
                                </td>
                                <td className="py-5 px-8 text-xs font-bold text-slate-500">{l.email}</td>
                                <td className="py-5 px-8 text-center">
                                    <button onClick={() => toggleStatus(l)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${l.status === 'actif' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{l.status}</button>
                                </td>
                                <td className="py-5 px-8 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => onEdit(l)} className="p-2 text-slate-300 hover:text-cyan-600 transition-all"><i className="bi bi-pencil-square text-lg"></i></button>
                                        <button onClick={() => onDelete(l._id, l.nomComplet)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><i className="bi bi-trash text-lg"></i></button>
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
export default LivreurTable;