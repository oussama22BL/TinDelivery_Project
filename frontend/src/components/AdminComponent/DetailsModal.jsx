import React from 'react';

const DetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
                {/* Design de fond */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <i className="bi bi-box-seam text-cyan-500"></i>
                    Détails Livraison
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Code Suivi</p>
                            <p className="font-bold text-cyan-600">{data.idColis?.codeSuivi}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Statut Actuel</p>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">{data.statut}</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Informations Destinataire</p>
                        <p className="font-bold text-slate-800">{data.idColis?.destinataireNomComplet}</p>
                        <p className="text-sm text-slate-500 mt-1">{data.adresse}</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Livreur Assigné</p>
                        <p className="text-sm font-semibold text-slate-700">{data.idLivreur?.nomComplet || "Non encore assigné"}</p>
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all">
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default DetailsModal;