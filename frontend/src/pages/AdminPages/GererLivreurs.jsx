import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import obligatoire pour le lien
import axios from '../../api/axios';
import Sidebar from '../../components/AdminComponent/Sidebar';
import LivreurTable from '../../components/AdminComponent/LivreurTable';
import LivreurForm from '../../components/AdminComponent/LivreurForm';

const GererLivreurs = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [dispoFilter, setDispoFilter] = useState("Tous");
    const [showForm, setShowForm] = useState(false);
    const [editingLivreur, setEditingLivreur] = useState(null);

    const refreshList = async () => {
        try {
            const res = await axios.get('/api/livreurs');
            setLivreurs(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { refreshList(); }, []);

    const filteredLivreurs = livreurs.filter(l => {
        const matchesSearch = l.nomComplet.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "Tous" || l.status === statusFilter.toLowerCase();
        let matchesDispo = true;
        if (dispoFilter === "Disponible") matchesDispo = l.disponibilite === true;
        if (dispoFilter === "Indisponible") matchesDispo = l.disponibilite === false;
        return matchesSearch && matchesStatus && matchesDispo;
    });

    return (
        <div className="flex min-h-screen bg-[#F1F5F9]">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col">
                
                {/* BARRE DU HAUT (TOPBAR) MODIFIÉE */}
                <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
                    
                    {/* Recherche (Gauche) */}
                    <div className="relative w-96">
                        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text"
                            placeholder="Rechercher un livreur, un colis..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* BLOC PROFIL (Droite) */}
                    <div className="flex items-center gap-5">
                        {/* Bouton Paramètres (Optionnel) */}
                        <button className="text-slate-400 hover:text-slate-600 transition-colors text-xl">
                            <i className="bi bi-gear"></i>
                        </button>

                        {/* LIEN VERS LE PROFIL */}
                        <Link to="/profile" className="flex items-center gap-3 pl-5 border-l border-slate-100 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-800 leading-none uppercase">Admin Principal</p>
                                <p className="text-[10px] text-slate-400 font-bold">Gérant</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-cyan-900 text-white flex items-center justify-center shadow-lg shadow-cyan-900/20 group-hover:scale-110 transition-all">
                                <i className="bi bi-person-fill text-xl"></i>
                            </div>
                        </Link>
                    </div>
                </div>

                <main className="p-10">
                    <header className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestion des livreurs</h1>
                            <p className="text-slate-500 font-medium mt-1">Suivez et gérez votre flotte logistique en temps réel.</p>
                        </div>
                        <button 
                            onClick={() => { setShowForm(!showForm); setEditingLivreur(null); }}
                            className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:bg-slate-800 transition-all"
                        >
                            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-person-plus-fill'}`}></i>
                            {showForm ? 'Fermer' : 'Créer un livreur'}
                        </button>
                    </header>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        <StatCard label="Total Livreurs" value={livreurs.length} />
                        <StatCard label="En Service" value={livreurs.filter(l=>l.status==='actif').length} color="text-cyan-600" />
                        <StatCard label="Disponibles" value={livreurs.filter(l=>l.disponibilite).length} color="text-cyan-600" />
                        <StatCard label="Inactifs" value={livreurs.filter(l=>l.status==='inactif').length} color="text-red-500" />
                    </div>

                    {showForm && (
                        <div className="mb-10 animate-in fade-in zoom-in duration-300">
                            <LivreurForm 
                                refreshList={refreshList} 
                                editingLivreur={editingLivreur} 
                                setEditingLivreur={setEditingLivreur}
                                setShowForm={setShowForm} 
                            />
                        </div>
                    )}

                    {/* TABLEAU */}
                    <div className="bg-white rounded-[28px] shadow-sm border border-slate-200 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl">
                                <button onClick={() => setStatusFilter("Tous")} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "Tous" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>Tous les statuts</button>
                                <div className="w-[1px] h-4 bg-slate-200 self-center"></div>
                                <select className="bg-transparent text-xs font-bold text-slate-400 outline-none px-2 cursor-pointer" onChange={(e) => setDispoFilter(e.target.value)}>
                                    <option value="Tous">Toute disponibilité</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Indisponible">Indisponible</option>
                                </select>
                            </div>
                            <button className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <i className="bi bi-sliders text-sm"></i> Filtres avancés
                            </button>
                        </div>
                        
                        <LivreurTable livreurs={filteredLivreurs} refreshList={refreshList} onEdit={(l) => { setEditingLivreur(l); setShowForm(true); }} />
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color = "text-slate-900" }) => (
    <div className="bg-white p-7 rounded-[24px] border border-white shadow-sm">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
);

export default GererLivreurs;