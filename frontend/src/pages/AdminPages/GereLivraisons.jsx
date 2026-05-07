import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/AdminComponent/Sidebar';
import TopBar from '../../components/AdminComponent/TopBar';
import axios from '../../api/axios';
import StatCard from '../../components/AdminComponent/StatCard';
import LivraisonTable from '../../components/AdminComponent/LivraisonTable';
import ConfirmModal from '../../components/AdminComponent/ConfirmModal';
import DetailsModal from '../../components/AdminComponent/DetailsModal';

//MockData pour tester 
const mockLivraisons = [
    { _id: "1", codeSuivi: "#TK-9021", destinataireNom: "Jean Dupont", adresse: "12 Avenue des Champs-Élysées", livreurNom: "Jean-Marc Dupont", statut: "En cours", date: "12 Oct 2023" },
    { _id: "2", codeSuivi: "#TK-8845", destinataireNom: "Marie Lefebvre", adresse: "45 Rue de la Liberté, Lyon", livreurNom: "Marie Lefebvre", statut: "Livré", date: "14 Oct 2023" },
    { _id: "3", codeSuivi: "#TK-9102", destinataireNom: "Non assigné", adresse: "8 bis Quai de la Rapée, Paris", livreurNom: null, statut: "En attente", date: "14 Oct 2023" },
    { _id: "4", codeSuivi: "#TK-7721", destinataireNom: "Marc Robert", adresse: "22 Blvd de la République, Lille", livreurNom: "Marc Robert", statut: "Annulé", date: "15 Oct 2023" },
];
const GereLivraisons = () => {
  // ... tes states actuels ...
    const [modalConfirm, setModalConfirm] = useState({ show: false, id: null, code: '', action: null });
    const [modalDetails, setModalDetails] = useState({ show: false, data: null });

  const [livraisons, setLivraisons] = useState(mockLivraisons);//pour stocker les données des livraisons
const [showFilters, setShowFilters] = useState(false);// afficheer les filtres oou non
  const [searchQuery, setSearchQuery] = useState("");//pour la barre de recherche

  const [loading, setLoading]= useState(true);//pour afficher un indicateur de chargement pendant la récupération des données

  

  const [statutFilter, setStatutFilter] = useState("all");

  //fonction pour recuperer les donnees des livraisons depuis l'api (GDLT-10)
  const refreshList = async ()=> {
    try{
      setLoading(true);
      const res = await axios.get('/api/livraisons');
      setLivraisons(res.data.data || []);
      } catch (err){
        console.error("Erreur recuperation livraison", err);
      }finally {
        setLoading(false); 
      }
  };
  useEffect(()=>{
    refreshList();
  },[]);
// Filtrage des livraisons (Version cohérente avec l'équipe)
const filteredLivraisons = livraisons.filter(item => {
    // 1. Recherche par Code de suivi ou Nom du destinataire
    const matchSearch = 
        item.codeSuivi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destinataireNom.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filtrage par Statut (si "all", on affiche tout, sinon on compare)
    const matchStatut = 
        statutFilter === "all" || 
        item.statut.toLowerCase() === statutFilter.toLowerCase();

    // On retourne l'élément seulement s'il remplit TOUTES les conditions
    return matchSearch && matchStatut;
});
// Calcule les stats dynamiquement (pour tes StatCards)
const stats = {
    total: livraisons.length,
    enAttente: livraisons.filter(l => l.statut === "En attente").length,
    reussies: livraisons.filter(l => l.statut === "Livré").length,
    annulees: livraisons.filter(l => l.statut === "Annulé").length,
};


  return (
    <div className='flex min-h-screen bg-slate-50'>
      <Sidebar />
      <div className='flex-1 ml-64'>
        <TopBar searchTerm={searchQuery} setSearchTerm={setSearchQuery}/>
        <main className='p-8'>
          {/* header de la page  */}
          <div className='mb-8'>
            <h1 className="text-3xl font-bold text-slate-800">Supervision des livraisons</h1>
            <p className="text-slate-500">Gérez et suivez l'état des colis en temps réel.</p>
          </div>
           {/* Prochaine étape : Les cartes statistiques et le Tableau */}
           <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard label="TOTAL EXPÉDITIONS" value={stats.total} icon="bi-box" color="text-slate-600" trend="+12%" />
            <StatCard label="COLIS EN TRANSIT" value={stats.enAttente} icon="bi-clock" color="text-slate-600" trend="En attente" />
            <StatCard label="LIVRAISONS RÉUSSIES" value={stats.reussies} icon="bi-check-circle" color="text-slate-600" trend="Aujourd'hui" />
               {/* Carte Performance Spéciale (Design de la maquette) */}
            <div className="bg-[#013c58] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold opacity-60 uppercase mb-4 tracking-wider">Performance</p>
                    <p className="text-3xl font-bold mb-2">98.2%</p>
                    <p className="text-[10px] opacity-70">Taux de ponctualité global</p>
                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-4">
                        <div className="bg-white h-full rounded-full w-[98%] transition-all duration-1000"></div>
                    </div>
                </div>
                {/* Petit design de fond pour la carte */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>
            </div>
             {/* On déplace le select ici et on ne l'affiche que si showFilters est vrai */}
  {showFilters && (
    <div className="mb-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Filtrer par :</span>
            <select
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
            >
                <option value="all">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Livré">Livré</option>
                <option value="En attente">En attente</option>
                <option value="Annulé">Annulé</option>
            </select>
            {/* Tu pourras ajouter d'autres filtres ici plus tard (Date, Livreur, etc.) */}
        </div>
    </div>
  )}

            
             
              {/* 3. Utilisation de ton nouveau composant Tableau */}
          <LivraisonTable data={filteredLivraisons} 
           onToggleFilters={() => setShowFilters(!showFilters)} 
    isFilterActive={showFilters}
          />

        </main>
      </div>
      
    </div>
  );
};

export default GereLivraisons
