import React, { useState, useEffect } from 'react';
import axios from '../../api/axios'; // Attention au chemin ../../
import Sidebar from '../../components/AdminComponent/Sidebar';
import LivreurTable from '../../components/AdminComponent/LivreurTable';
import LivreurForm from '../../components/AdminComponent/LivreurForm';

const GererLivreurs = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const refreshList = async () => {
    try {
        const res = await axios.get('/api/livreurs');
        
        // AVANT : setLivreurs(res.data); <-- C'était l'erreur
        // MAINTENANT : On prend le tableau qui est dans res.data.data
        if (res.data && res.data.data) {
            setLivreurs(res.data.data); 
        }
    } catch (err) { 
        console.error("Erreur de chargement :", err); 
    }
};

    useEffect(() => { refreshList(); }, []);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Utilisation du composant Sidebar */}
            <Sidebar />

            {/* Zone de contenu à droite */}
            <main className="flex-1 p-10">
                {/* Header */}
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Gestion des livreurs</h1>
                        <p className="text-slate-500 font-medium">Suivez et gérez votre flotte logistique en temps réel.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                    >
                        <span className="text-xl">+</span> Créer un livreur
                    </button>
                </header>


                    <div className="grid grid-cols-4 gap-6 mb-10">
                        <StatCard label="Total Livreurs" value={livreurs.length} />
                        <StatCard 
                            label="En Service" 
                            value={livreurs.filter(l => l.status === 'actif').length} 
                            color="text-cyan-600" 
                        />
                        <StatCard 
                            label="Disponibles" 
                            value={livreurs.filter(l => l.disponibilite === true).length} 
                            color="text-cyan-600" 
                        />
                        <StatCard 
                            label="Inactifs" 
                            value={livreurs.filter(l => l.status === 'inactif').length} 
                            color="text-red-500" 
                        />
                    </div>

                {showForm && (
                    <div className="mb-10 animate-in slide-in-from-top duration-300">
                        <LivreurForm refreshList={refreshList} setShowForm={setShowForm} />
                    </div>
                )}

                {/* Tableau Blanc */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6">
                    <LivreurTable livreurs={livreurs} refreshList={refreshList} />
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ label, value, color = "text-slate-900" }) => (
    <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm">
        <p className="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">{label}</p>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
);

export default GererLivreurs;